const config = require('../package.json').marcel;
const exec = require('child_process').exec;

const Ear = function(config) {
  this.config = config.ear;
};
module.exports = Ear;

/**
 * make an array of npm command and
 * args from the context of config (package.json > marcel > *)
 */
Ear.prototype.buildCmd = function(lang, keywords) {
  const cmd = `python -u listen.py -engine ${ this.config.engine } -lang ${ lang } ${ keywords ? '-k "' + keywords.join('" "') + '"' : '' }`;
  console.log('\x1b[2mcommand:', cmd);
  return cmd;
};
Ear.prototype.listen = function(lang, transitions) {
  return new Promise((resolve, reject) => this.doListen(lang, transitions, resolve, reject));
};

Ear.prototype.doListen = function(lang, transitions, resolve, reject) {
  // start process with listen python program
  const cmdStr = this.buildCmd(lang, transitions);
  const cmd = exec(cmdStr);

  // cmd.stdout.on('data', function (data) {
  //   const phrase = data.toString();
  // });
  // cmd.stdout.on('end', function (data) {
  //   console.log('stdout  END ');
  // });
  cmd.stderr.on('data', data => {
    try {
      const err = data.split('\n').filter(str => str.trim() != '').join('\n\x1b[2mpython error: ');
      console.error('\x1b[2mpython error: ', err);
    }
    catch(e) {
      // more severe python error
      console.error('\x1b[2mpython error: ', data.toString());
    }
    //reject(data.toString());
  });
  cmd.on('exit', code => {
    console.log('\x1b[2mchild process exited with code ' + code.toString());
    if(code != 0) {
      console.log('\x1b[2mrestart listener');
      this.doListen(lang, transitions, resolve, reject);
      // resolve();
    }
  });

  // say it out loud
  cmd.stdout.on('data', output => {
    const data = output.toString().split('\n').join(' ').trim().toLowerCase();
    console.log('Service: ', output.toString());
    if(['wait_speak'].indexOf(data) >= 0) {
      // do nothing
    }
    else if(['go_speak'].indexOf(data) >= 0) {
      console.log('\x1b[1mEar waiting for: ', transitions);
      this.beep();
    }
    else {
      console.log('\x1b[1mEar heard: ', data);
      resolve(data);
    }
  });
};


Ear.prototype.beep = function() {
  console.log('beep');
  var fs = require('fs');
  var wav = require('wav');
  var Speaker = require('speaker');

  var file = fs.createReadStream('beep.wav');
  var reader = new wav.Reader();

  // the "format" event gets emitted at the end of the WAVE header
  reader.on('format', function (format) {

    // the WAVE header is stripped from the output of the reader
    reader.pipe(new Speaker(format));
  });

  // pipe the WAVE file to the Reader instance
  file.pipe(reader);
};
