class Module {
  constructor() {
    this.isModule = true
  }
  getStates() {
    return {
      "en-US": [
        { "name": "hello marcel", "from": "passive", "to": "active" },
      ],
      "fr-FR": [
        { "name": "marcel", "from": "passive", "to": "active" },
        { "name": "bonjour marcel", "from": "passive", "to": "active" },
        { "name": "bonjour", "from": "passive", "to": "active" },
      ],
    };
  }
  init(ear, mouth, state, brain) {
    this.ear = ear;
    this.mouth = mouth;
    this.state = state;
    this.brain = brain;
    this.switchInterval = null;
  }
  enter(lang) {
    this.brain.enableSleepMode(true);
    return new Promise((resolve, reject) => {
      this.mouth.say('Marcel\'s sleeping!')
      .then(() => {
        resolve();
      }).catch(reject);
    });
  }
  leave(lang) {
    this.brain.enableSleepMode(false);
    return new Promise((resolve, reject) => {
      this.mouth.say('Yes, my name is Marcel!')
      .then(() => {
        resolve();
      }).catch(reject);
    });
  }
}


module.exports = new Module();
