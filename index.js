// start process with listen C program
const util  = require('util');
const spawn = require('child_process').spawn;
const speaker = require('./speaker').speaker;


function listen(prompt) {
  if(prompt) {
    speaker.say("speak now", listen);
  }
  else {
    const cmd    = spawn('npm', ['run', 'listen:sentences']);

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
      else if(phrase === '') {
        listen(false);
      }
      else {
        console.log('xxx', phrase)
        speaker.say(phrase, function() {
          listen(true);
        });
      }
    });
  }
}
speaker.say("Mean talker starting...", function() {
  listen(true);
});
