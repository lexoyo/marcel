const StateMachine = require("javascript-state-machine");
const ModuleManager = require('./module-manager');
const Ear = require('./ear');
const Mouth = require('./mouth');

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

  // init current module
  this.enterModule(() => {});
};

module.exports = Brain;

Brain.prototype.enterModule = function(phrase, cbk) {
  const moduleName = this.states[Brain.lang].current;
  const module = this.moduleManager.createModule(moduleName);
  this.module = module;
  if(module) {
    //console.log('enter module', moduleName);
    module.init(this.ear, this.mouth, this.states[Brain.lang]);
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

Brain.prototype.think = function(phrase) {
  const moduleName = this.states[Brain.lang].current;
  const keywords = this.states[Brain.lang].transitions();
  console.log('\x1b[1mBrain understands:', keywords);
  return this.ear.listen(Brain.lang, keywords).then(phrase => {
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
    if(currentState !== this.states[Brain.lang].current) {
      //console.log('change state', this.module, currentState, this.states[Brain.lang].current);
      if(this.module) {
	return new Promise((resolve, reject) => {
          this.leaveModule(segmentFound, () => this.enterModule(segmentFound, () => resolve()));
        });
      }
    }
    else {
      resolve();
    }
  })
};

