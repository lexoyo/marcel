const config = require('./package.json').marcel;

const Speaker = require('./speaker').Speaker;
const speaker = new Speaker(config);

const StateMachine = require("javascript-state-machine");

const Modes = {
  LISTEN: 'listen',
  SPEAK: 'speak',
  LISTEN_WITH_PREDEFINED_WORDS: 'listenWithPredefinedWords',
}
exports.Modes = Modes;

const Lang = {
  EN: 'en',
  FR: 'fr',
}
exports.Lang = Lang;

const Thinker = function(config) {
  this.config = config;
  this.state = {
    activity: StateMachine.create(config.states.activity),
    lang: StateMachine.create(config.states.lang),
  }
};
Thinker.prototype.lang = Lang.EN;
Thinker.prototype.mode = Modes.LISTEN_WITH_PREDEFINED_WORDS;
Thinker.prototype.think = function(phrase, cbk) {
  // console.log('thinking', phrase, this.state.activity.current, this.state.lang.current);
  if(phrase.indexOf('MARCEL') != -1) {
    speaker.say('Yes I\'m Marcel!', function() {
      cbk();
    });
  }
  else {
    // find the events of wich all words are in the phrase
    let hasChanged = false;
    for (let stateName in this.state) {
      const state = this.state[stateName];
      state.transitions().forEach(eventName => {
        const isSaid = eventName.split(' ').reduce((prev, word) => prev && phrase.indexOf(word.toUpperCase()) > -1, true);
        if(isSaid) {
          // console.log('change state', isSaid, eventName);
          state[eventName]();
          hasChanged = true;
        }
      });
    }
    if(hasChanged) {
      console.log('new state:', this.state.activity.current, this.state.lang.current)
      speaker.say('switching state!', function() {
        cbk();
      });
    }
    else {
      console.log('Nothing to do', phrase);
      cbk();
    }
  }
};

exports.Thinker = Thinker;
