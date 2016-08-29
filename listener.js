const spawn = require('child_process').spawn;
const speaker = require('./speaker').speaker;
const Lang = require('./thinker').Lang;


const Listener = {
  usePredefinedWords: true,
  lang: Lang.EN,
  start: function start(onHeard) {
    if(Listener.usePredefinedWords === undefined || Listener.lang === undefined) {
      throw 'undefined variables (scope issue?)';
    }
    // start process with listen C program
    const cmd = spawn('npm', [
      'run',
      Listener.usePredefinedWords ? 'listen:' + Listener.lang + ':usePredefinedWords' : 'listen:' + Listener.lang
    ]);

    cmd.stdout.on('data', function (data) {
      const phrase = data.toString();
    });
    cmd.stdout.on('end', function (data) {
      console.log('stdout  END ');
    });
    cmd.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });
    cmd.on('exit', function (code) {
      console.log('child process exited with code ' + code.toString());
    });

    // say it out loud
    cmd.stdout.on('data', data => {
      const phrase = data.toString().split('\n').join(' ').trim();
      if(phrase.indexOf('>') === 0) {
        // npm logs
        console.log('do not say', phrase);
      }
      else {
        onHeard(phrase, function() {
          start(onHeard);
        });
      }
    });
  }
}
exports.Listener = Listener;
