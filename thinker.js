const Speaker = require('./speaker').Speaker;
const speaker = new Speaker();

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

Thinker = {
  lang: Lang.EN,
  mode: Modes.LISTEN_WITH_PREDEFINED_WORDS,
  think: function(phrase, cbk) {
    console.log('thinking', phrase, Thinker.mode);
    if(phrase.indexOf('MARCEL') != -1) {
      speaker.say('Yes I\'m Marcel!', function() {
        cbk();
      });
    }
    else if(phrase.indexOf('SPEAK FRENCH') != -1) {
      Thinker.lang = Lang.FR;
      speaker.say('Oui, parlons frenchy!', function() {
        cbk();
      });
    }
    else if(phrase.indexOf('PARLONS ANGLAIS') != -1) {
      Thinker.lang = Lang.EN;
      speaker.say('Yes, let\'s talk in English!', function() {
        cbk();
      });
    }
    else {
      speaker.say('You said: ' + phrase, function() {
        cbk();
      });
    }
  },
}

exports.Thinker = Thinker;
