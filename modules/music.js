const exec = require('child_process').exec;

module.exports = {
  isModule: true,
  getStates: () => {
    return {
      "en-US": [
        { "name": "music", "from": "active", "to": "music" },
        { "name": "stop", "from": "music", "to": "passive" },
      ],
      "fr-FR": [
        { "name": "musique", "from": "active", "to": "music" },
        { "name": "stop", "from": "music", "to": "passive" },
        { "name": "arrête", "from": "music", "to": "passive" },
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
      this.mouth.say('What do you want to listen?')
      .then(() => {
        this.ear.listen(lang)
        .then(phrase => {
          const cmdStr = `DISPLAY=:0 python node_modules/marcel_tube/yt --q "${phrase}"`;
          console.log('command:', cmdStr);
          const cmd = exec(cmdStr);
          cmd.stderr.on('data', function (data) {
            console.log('stderr: ' + data.toString());
          });
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
      this.mouth.say('Stopping music')
      .then(() => {
        resolve();
      }).catch(reject);
    });
  }
}
