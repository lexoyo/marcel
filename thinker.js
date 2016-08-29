const Speaker = require('./speaker').Speaker;
const speaker = new Speaker();

const Modes = {
  LISTEN: 'listen',
  SPEAK: 'speak',
  LISTEN_WITH_PREDEFINED_WORDS: 'listenWithPredefinedWords',
}
exports.Modes = Modes;

const Thinker = function() {};
exports.Thinker = Thinker;

Thinker.prototype = {
  mode: Modes.LISTEN,
  think: function(phrase, cbk) {
    console.log('thinking', phrase, this.mode);
    if(phrase.indexOf('marcel') != -1) {
      this.mode = Modes.SPEAK;
      speaker.say('Yes I\'m Marcel!', () => {
        this.mode = Modes.LISTEN_WITH_PREDEFINED_WORDS;
        cbk();
      });
    }
    else {
      this.mode = Modes.SPEAK;
      speaker.say('You said: ' + phrase, () => {
        this.mode = Modes.LISTEN;
        cbk();
      });
    }
  },
}
