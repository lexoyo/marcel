const Brain = require('../app/brain');

module.exports = {
  isModule: true,
  getStates: () => {
    return {
      "en-US": [
        { "name": "speak french", "from": "active", "to": "french" },
      ],
      "fr-FR": [
      ],
    };
  },
  init: (ear, mouth, state) => {
    this.ear = ear;
    this.mouth = mouth;
    this.state = state;
  },
  enter: (lang) => {
    Brain.lang = 'fr-FR';
    return this.mouth.say('Oui je parle francais!');
  },
  leave: (lang) => {
    return Promise.resolve();
  }
}
