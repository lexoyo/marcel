module.exports = {
  isModule: true,
  getStates: () => {
    return {
      en: [
        { "name": "music", "from": "active", "to": "music" },
        { "name": "stop", "from": "music", "to": "active" },
      ],
      fr: [
        { "name": "musique", "from": "active", "to": "music" },
        { "name": "stop", "from": "music", "to": "active" },
        { "name": "arrete", "from": "music", "to": "active" },
      ],
    };
  },
  action: (lang, state, listener, speaker) => {
    speaker.say('what do you want?', () => {
      listener.prompt(phrase => {
        open('https://www.youtube.com/watch?v=KWzJGRh_Tsw');
        speaker.say('searching for ' + phrase, () => {
          listener.listen();
        });
      });
    });
  }
}
