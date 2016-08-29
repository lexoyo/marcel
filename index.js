const Listener = require('./listener').Listener;
const listener = new Listener();
const Modes = require('./thinker').Modes;

const Thinker = require('./thinker').Thinker;
const thinker = new Thinker();

const Speaker = require('./speaker').Speaker;
const speaker = new Speaker();


function onHeard(phrase, next) {
  if(phrase === '') {
    next();
  }
  else {
    thinker.think(phrase, function() {
      switch(thinker.mode) {
        case Modes.LISTEN:
          listener.usePredefinedWords = false;
        break;
        case Modes.LISTEN_WITH_PREDEFINED_WORDS:
          listener.usePredefinedWords = true;
        break;
        default:
          console.error('thinker has a lisening mode =', thinker.mode)
      }
      speaker.say("Talk now...", function() {
        next();
      });
    });
  }
}
speaker.say("Mean talker starting...", function() {
  listener.start(onHeard);
});
