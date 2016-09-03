module.exports = {
  isModule: true,
  getStates: () => {
    return {
      en: [
        { "name": "marcel", "from": "passive", "to": "active" },
      ],
      fr: [
        { "name": "marcel", "from": "passive", "to": "active" },
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
      resolve();
    });
  },
  leave: (lang) => {
    return new Promise((resolve, reject) => {
      this.mouth.say('Yes, my name is Marcel!')
      .then(() => {
        resolve();
      }).catch(reject);
    });
  }
}
