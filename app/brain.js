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
  console.log('init done', this.states[Brain.lang]);

  // init current module
  this.enterModule(() => {});
};

module.exports = Brain;

Brain.prototype.enterModule = function(cbk) {
  const moduleName = this.states[Brain.lang].current;
  const module = this.moduleManager.createModule(moduleName);
  this.module = module;
  if(module) {
    console.log('enter module', moduleName);
    module.init(this.ear, this.mouth, this.states[Brain.lang]);
    module.enter(Brain.lang)
      .then(cbk)
      .catch((e) => {
        console.log('error', e);
        cbk();
      });
  }
  else {
    console.log('No module for this state', moduleName);
    cbk();
  }
};

Brain.prototype.leaveModule = function(cbk) {
  if(this.module) {
    console.log('leave module', this.module);
    this.module.leave(Brain.lang)
      .then(cbk)
      .catch((e) => {
        console.log('error', e);
        cbk();
      });
  }
  else {
    cbk();
  }
};

Brain.prototype.think = function(phrase) {
  return new Promise((resolve, reject) => {
    const moduleName = this.states[Brain.lang].current;
    this.ear.listen(Brain.lang, moduleName).then(phrase => {
      const currentState = this.states[Brain.lang].current;
      if(this.states[Brain.lang][phrase]) {
        this.states[Brain.lang][phrase]();
      }
      console.log('current state', phrase, Brain.lang, this.states[Brain.lang].current , this.states[Brain.lang].transitions());
      if(currentState !== this.states[Brain.lang].current) {
        console.log('change state');
        if(this.module)
          this.leaveModule(() => this.enterModule(() => resolve()));
      }
      else {
        resolve();
      }
    })
    .catch((e) => reject(e));
  });
};

