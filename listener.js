const config = require('./package.json').marcel;
const exec = require('child_process').exec;

const Speaker = require('./speaker').Speaker;
const speaker = new Speaker(config);

const Lang = require('./thinker').Lang;


const Listener = function(config) {
  this.config = config;
};
Listener.prototype.usePredefinedWords = true;
Listener.prototype.lang = Lang.EN;
/**
 * make an array of npm command and
 * args from the context of config (package.json > marcel > *)
 */
Listener.prototype.buildCmd = function buildCmd() {
  const npmCommand = this.usePredefinedWords ? 'listen:' + this.lang + ':usePredefinedWords' : 'listen:' + this.lang;
  // contexts passed to npm start + 'all'
  // should be linux or raspi and/or debug
  const context = ['all'].concat(
    process.argv.filter(val => !!config.context[val])
  );
  const additionalParams =
    context.map(contextName => config.context[contextName]['listen-cmd-params'])
    .join(' ');

  return npmCommand + ' -- ' + additionalParams;
};
Listener.prototype.start = function start(onHeard) {
  if(this.usePredefinedWords === undefined || this.lang === undefined) {
    throw 'undefined variables (scope issue?) ' + this.toString();
  }
  // start process with listen C program
  const args = this.buildCmd();
  const cmd = exec('npm run ' + args);

  // cmd.stdout.on('data', function (data) {
  //   const phrase = data.toString();
  // });
  // cmd.stdout.on('end', function (data) {
  //   console.log('stdout  END ');
  // });
  // cmd.stderr.on('data', function (data) {
  //   console.log('stderr: ' + data.toString());
  // });
  // cmd.on('exit', function (code) {
  //   console.log('child process exited with code ' + code.toString());
  // });

  // say it out loud
  cmd.stdout.on('data', data => {
    const phrase = data.toString().split('\n').join(' ').trim();
    if(phrase.indexOf('>') === 0) {
      // npm logs
      // console.log(phrase, '\n');
    }
    else {
      onHeard(phrase, (state) => {
        this.start(onHeard);
      });
    }
  });
};

exports.Listener = Listener;
