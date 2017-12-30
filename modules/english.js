const Brain = require('../app/brain');

module.exports = {
  isModule: true,
  getStates: () => {
    return {
      "en-US": [
      ],
      "fr-FR": [
        { "name": "parlons anglais", "from": "active", "to": "english" },
      ],
    };
  },
  init: (ear, mouth, state) => {
    this.ear = ear;
    this.mouth = mouth;
    this.state = state;
  },
  enter: (lang) => {
    Brain.lang = 'en-US';
    return this.mouth.say('Yes I speak english!');
  },
  leave: (lang) => {
    return Promise.resolve();
  }
}
