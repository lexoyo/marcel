module.exports = {
  isModule: true,
  getStates: () => {
    return {
      en: [
        { "name": "marcel shut up", "from": "active", "to": "passive" },
      ],
      fr: [
        { "name": "marcel tais toi", "from": "active", "to": "passive" },
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
      resolve();
    });
  }
}
