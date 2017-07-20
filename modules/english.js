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
    return new Promise((resolve, reject) => {
      Brain.lang = 'en-US';
      this.mouth.say('Yes I speak english!')
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
