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
  }
  enter(lang) {
    this.brain.enableSleepMode(true);
    return this.mouth.say('Marcel\'s sleeping!');
  }
  leave(lang) {
    this.brain.enableSleepMode(false);
    return this.mouth.say('Yes, my name is Marcel!');
  }
}


module.exports = new Module();
