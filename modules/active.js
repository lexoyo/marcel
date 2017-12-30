module.exports = {
  isModule: true,
  getStates: () => {
    return {
      "en-US": [
        { "name": "marcel shut up", "from": "active", "to": "passive" },
      ],
      "fr-FR": [
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
    return Promise.resolve();
  },
  leave: (lang) => {
    return Promise.resolve();
  }
}
