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
  this.languages = this.moduleManager.getLanguages();
  this.states = {};
  this.languages.forEach(lang => this.states[lang] = StateMachine.create(this.moduleManager.getStates(lang)));

  // initial state
  this.lang = config.brain.initialLang;
  this.states[this.lang].current = config.brain.initialState;
  console.log('init done', this.states[this.lang]);
};

module.exports = Brain;

Brain.prototype.think = function(phrase) {
  return new Promise((resolve, reject) => {
    const moduleName = this.states[this.lang].current;
    const module = this.moduleManager.createModule(moduleName);
    module.action(this.ear, this.mouth, this.states[this.lang], this.lang)
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};

