const StateMachine = require("javascript-state-machine");
const exec = require('child_process').exec;
const ModuleManager = require('./module-manager');
const Ear = require('./ear');
const Mouth = require('./mouth');
const utils = require('./utils.js');

const SWITCH_OFF_DELAY = 10000;

const Brain = function(config) {
  // init io
  this.ear = new Ear(config);
  this.mouth = new Mouth(config);
  // init modules
  this.moduleManager = new ModuleManager();
  const languages = this.moduleManager.getLanguages();
  this.states = {};
  languages.forEach(lang => {
    return this.states[lang] = StateMachine.create({
      initial: config.brain.initialState,
      events: this.moduleManager.getStates(lang),
    });
  });

  // initial lang
  Brain.lang = config.brain.initialLang;

  this.switchedOff = false;
  this.switchInterval = null;
  this.switchOn();

  // init current module
  this.enterModule(() => {});
};

Brain.prototype.enterModule = function(phrase, cbk) {
  const moduleName = this.states[Brain.lang].current;
  const module = this.moduleManager.createModule(moduleName);
  this.module = module;
  if(module) {
    //console.log('enter module', moduleName);
    // FIXME: why do this all the time? should be in the factory
    // FIXME: we could pass only this
    module.init(this.ear, this.mouth, this.states[Brain.lang], this);
    module.enter(Brain.lang)
      .then(cbk)
      .catch((e) => {
        console.error('\x1b[2merror', e);
        cbk();
      });
  }
  else {
    console.error('No module for this state', moduleName);
    cbk();
  }
};

Brain.prototype.leaveModule = function(phrase, cbk) {
  if(this.module) {
    this.module.leave(Brain.lang)
      .then(cbk)
      .catch((e) => {
        console.error('error', e);
        cbk();
      });
  }
  else {
    cbk();
  }
};

Brain.prototype.retryThink = function(phrase, cbk) {
  setTimeout(() => {
    // retry
    if(this.switchedOff) {
      this.retryThink(phrase, cbk);
    }
    else {
      cbk();
    }
  }, 1000);
};

Brain.prototype.think = function(phrase) {
  if(this.switchedOff) {
    return new Promise((resolve, reject) => {
      this.retryThink(phrase, () => resolve());
    });
  }
  const moduleName = this.states[Brain.lang].current;
  const keywords = this.states[Brain.lang].transitions();
  console.log('\x1b[1mBrain understands:', keywords);
  return this.ear.listen(Brain.lang, keywords).then(phrase => {
    if(this.switchedOff) return;
    const currentState = this.states[Brain.lang].current;
    // try all combinations
    let found = false;
    let segmentFound = '';
    const words = phrase.split(' ');

    for(let idx1 = 0; idx1<words.length && found == false; idx1++) {
      for(let idx2=idx1; idx2<=words.length && found == false; idx2++) {
        const segment = words.slice(idx1, idx2).join(' ');
        //console.log('try state', segment);
        if(this.states[Brain.lang][segment] && this.states[Brain.lang].can(segment)) {
          //console.log('found!!');
          this.states[Brain.lang][segment]();
          found = true;
          segmentFound = segment;
        }
      }
    }
    // if(currentState !== this.states[Brain.lang].current) {
      console.log('change state', currentState, this.states[Brain.lang].current);
      if(this.module) {
	return new Promise((resolve, reject) => {
          this.leaveModule(segmentFound, () => this.enterModule(segmentFound, () => resolve()));
        });
      }
    // }
  })
};

// Call this when a sound is detected
Brain.prototype.postponeSwitchOff = function() {
  console.log('postpone switch off');
  this.switchOn();
  // if(this.switchInterval) {
    this.enableSleepMode(false);
    this.enableSleepMode(true);
  // }
};

Brain.prototype.enableSleepMode = function(enable) {
  console.log('Sleep mode enabled:', enable);
  if(this.switchInterval == null && enable === true) {
    this.switchInterval = setTimeout(() => {
      this.switchInterval = null;
      this.switchOff();
    }, SWITCH_OFF_DELAY);
  }
  else if(this.switchInterval != null && enable === false) {
    clearTimeout(this.switchInterval);
    this.switchInterval = null;
  }
};

Brain.prototype.switchOff = function() {
  if(this.switchedOff === false) {
    console.log('SWITCHING OFF');
    // switch off
    this.ear.stop();

    utils.play('switchoff.wav', () => {
      // detect claps to wakeup or postpone sleep
      this.ear.startClap(() => {
        this.postponeSwitchOff();
      });
    });
  }
  this.switchedOff = true;

	exec('./switch-monitor-off.sh', function(error, stdout, stderr) {
	  console.log('shell script called', error);
  });
};

Brain.prototype.switchOn = function() {
  if(this.switchedOff === true) {
    console.log('SWITCHING ON');
    this.ear.stopClap();
    utils.play('switchoff.wav', () => {
    });
  }

	exec('./switch-monitor-on.sh', function(error, stdout, stderr) {
	  console.log('shell script called', error);
  });
  this.switchedOff = false;
}

module.exports = Brain;

