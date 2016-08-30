const config = require('./package.json').marcel;

const Listener = require('./listener').Listener;
const listener = new Listener(config);

const Thinker = require('./thinker').Thinker;
const thinker = new Thinker(config);
const Modes = require('./thinker').Modes;

const Speaker = require('./speaker').Speaker;
const speaker = new Speaker(config);

function onHeard(phrase, next) {
  if(phrase === '') {
    next(thinker.state);
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
      listener.lang = thinker.state.lang.current;
      next(thinker.state);
    });
  }
}
speaker.say("Marcel starting...", function() {
  listener.start(onHeard);
});
