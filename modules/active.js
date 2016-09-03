module.exports = {
  isModule: true,
  getStates: () => {
    return {
      en: [
        { "name": "marcel lets talk", "from": "passive", "to": "active" },
        { "name": "marcel shut up", "from": "active", "to": "passive" },
      ],
      fr: [
        { "name": "marcel parl", "from": "passive", "to": "active" },
        { "name": "marcel tais toi", "from": "active", "to": "passive" },
      ],
    };
  },
  action: (ear, mouth, state, lang) => {
    return new Promise((resolve, reject) => {
      console.log('Module action', lang);
      ear.listen(lang).then(phrase => {
        console.log('change state');
        state[phrase]();
        resolve();
      })
      .catch((e) => reject(e));
    });
  }
  // TODO:
  // init(ear, mouth)
  // enter() and leave()
}
