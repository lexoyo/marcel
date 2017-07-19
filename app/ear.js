const config = require('../package.json').marcel;
const exec = require('child_process').exec;

const Ear = function(config) {
  this.context = config.ear.context;
  this.paths = config.ear.paths;
};
module.exports = Ear;

/**
 * make an array of npm command and
 * args from the context of config (package.json > marcel > *)
 */
Ear.prototype.buildCmd = function(lang, keywords) {
  const cmd = `python -u listen.py -lang ${ lang } -k "${ keywords.join('" "') }"`;
  console.log('command:', cmd);
  return cmd;
};
Ear.prototype.listen = function(lang, transitions) {
  return new Promise((resolve, reject) => this.doListen(lang, transitions, resolve, reject));
};

Ear.prototype.doListen = function(lang, transitions, resolve, reject) {
  console.log('doListen', lang, transitions)
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
    console.log('stderr: ' + data.toString());
    //reject(data.toString());
  });
  cmd.on('exit', code => {
    console.log('child process exited with code ' + code.toString());
    if(code != 0) {
      console.error('restart listener');
      this.doListen(lang, transitions, resolve, reject);
      // resolve();
    }
  });

  // say it out loud
  cmd.stdout.on('data', output => {
    const data = output.split('\n').join(' ').trim().toLowerCase();
    console.log('>>>>>>>>>>>>> ', data);
    if(['go_speak', 'wait_speak'].indexOf(data) >= 0) {
      //process.stdout.write('\x07');
      //this.beep();
    }
    else {
      console.log('xxx');
      const phrase = data;
      resolve(phrase);
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
