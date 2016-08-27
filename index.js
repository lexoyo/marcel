// start process with listen C program
const util  = require('util'),
    spawn = require('child_process').spawn,
    cmd    = spawn('./listen', ['-inmic', 'yes', '-logfn', '/dev/null', '-continuous', 'yes']);

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
const speaker = require('./speaker').speaker;
cmd.stdout.on('data', function (data) {
  const phrase = data.toString();
  speaker.say(phrase);
});
speaker.say("Starting");
