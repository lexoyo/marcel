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
    return new Promise((resolve, reject) => {
      Brain.lang = 'fr-FR';
      this.mouth.say('Oui je parle francais!')
      .then(() => {
        resolve();
      }).catch(reject);
    });
  },
  leave: (lang) => {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}
