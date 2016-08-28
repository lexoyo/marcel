const spawn = require('child_process').spawn;
const speaker = require('./speaker').speaker;


const listener = {
  start: function start(onHeard) {
    // start process with listen C program
    const cmd    = spawn('npm', ['run', 'listen']);

    cmd.stdout.on('data', function (data) {
      const phrase = data.toString();
      console.log('stdout: ', phrase);
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
    cmd.stdout.on('data', function (data) {
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
exports.listener = listener;
