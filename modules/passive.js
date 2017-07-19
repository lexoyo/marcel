module.exports = {
  isModule: true,
  getStates: () => {
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
  },
  init: (ear, mouth, state) => {
    this.ear = ear;
    this.mouth = mouth;
    this.state = state;
  },
  enter: (lang) => {
    return new Promise((resolve, reject) => {
      this.mouth.say('Marcel\'s sleeping!')
      .then(() => {
        resolve();
      }).catch(reject);
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
