const config = require('./package.json').marcel;

const Speaker = require('./speaker').Speaker;
const speaker = new Speaker(config);

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
};
Thinker.prototype.lang = Lang.EN;
Thinker.prototype.mode = Modes.LISTEN_WITH_PREDEFINED_WORDS;
Thinker.prototype.think = function(phrase, cbk) {
  console.log('thinking', phrase, this.mode);
  if(phrase.indexOf('MARCEL') != -1) {
    speaker.say('Yes I\'m Marcel!', function() {
      cbk();
    });
  }
  else if(phrase.indexOf('SPEAK FRENCH') != -1) {
    this.lang = Lang.FR;
    speaker.say('Oui, parlons frenchy!', function() {
      cbk();
    });
  }
  else if(phrase.indexOf('PARLONS ANGLAIS') != -1) {
    this.lang = Lang.EN;
    speaker.say('Yes, let\'s talk in English!', function() {
      cbk();
    });
  }
  else {
    speaker.say('You said: ' + phrase, function() {
      cbk();
    });
  }
};

exports.Thinker = Thinker;
