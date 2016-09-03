module.exports = {
  isModule: true,
  getStates: () => {
    return {
      en: [
        { "name": "music", "from": "active", "to": "music" },
        { "name": "stop", "from": "music", "to": "passive" },
      ],
      fr: [
        { "name": "musique", "from": "active", "to": "music" },
        { "name": "stop", "from": "music", "to": "passive" },
        { "name": "arrete", "from": "music", "to": "passive" },
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
      console.log('Module enter', lang);
      this.mouth.say('What do you want to listen?')
      .then(() => {
        this.ear.listen(lang)
        .then(phrase => {
          console.log('heard', phrase);
          this.mouth.say('searching for ' + phrase)
          .then(() => {
            resolve();
          });
        }).catch(reject);
      }).catch(reject);
    });
  },
  leave: (lang) => {
    return new Promise((resolve, reject) => {
      console.log('Module leave', lang);
      this.mouth.say('Stopping music')
      .then(() => {
        resolve();
      }).catch(reject);
    });
  }
}
