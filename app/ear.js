const config = require('../package.json').marcel;
const exec = require('child_process').exec;
const clapDetector = require('clap-detector');
const utils = require('./utils.js');

const Ear = function(config) {
  this.config = config.ear;
  this.calibrationDone = false;
  this.stopped = false;
  // redo calibration once in a while
  setInterval(() => this.calibrationDone = false, 30000);
	// Start clap detection
	const clapConfig = {
		AUDIO_SOURCE: 'alsa default',
	};
	clapDetector.start(clapConfig);
  this.stopClap();
};

Ear.prototype.stopClap = function() {
  console.log('clap detector pause');
  clapDetector.pause();
};

Ear.prototype.startClap = function(onClap) {
	// Register on clap event
	clapDetector.onClap((history) => {
		 console.log('clap! ', history);
		 if(onClap) onClap();
	});
  console.log('clap detector resume');
  clapDetector.resume();
};

Ear.prototype.stop = function() {
  this.stopped = true;
  if(this.cmd) this.cmd.kill('SIGINT');
  this.cmd = null;
}

/**
 * make an array of npm command and
 * args from the context of config (package.json > marcel > *)
 */
Ear.prototype.buildCmd = function(lang, keywords, calibration) {
  const cmdStr = `python -u listen.py -engine ${ this.config.engine } -lang ${ lang } ${ keywords ? '-k "' + keywords.join('" "') + '"' : '' } ${ calibration ? '-calibration ' : '' }`;
  console.log('\x1b[2mcommand:', cmdStr);
  return cmdStr;
};
Ear.prototype.listen = function(lang, transitions) {
  this.stopped = false;
  return new Promise((resolve, reject) => this.doListen(lang, transitions, resolve, reject));
};

Ear.prototype.doListen = function(lang, transitions, resolve, reject) {
  utils.play('beep.wav', () => {
    // start process with listen python program
    const cmdStr = this.buildCmd(lang, transitions, !this.calibrationDone);
    this.calibrationDone = true;
    this.cmd = exec(cmdStr);

    this.cmd.stderr.on('data', data => {
      // do not take this into account, if we are stopped
      // this happens when the process is stopped
      if(this.stopped) {
        resolve('');
        return;
      }

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
    this.cmd.on('exit', code => {
      // do not take this into account, if we are stopped
      // this happens when the process is stopped
      if(this.stopped) {
        // resolve('');
        return;
      }

      console.log('\x1b[2mchild process exited with code ' + code.toString());
      if(code != 0) {
        console.log('\x1b[2mrestart listener');
        this.doListen(lang, transitions, resolve, reject);
        // resolve();
      }
    });

    // say it out loud
    this.cmd.stdout.on('data', output => {
      const data = output.toString().split('\n').join(' ').trim().toLowerCase();
      console.log('Service: ', output.toString());
      if(['wait_speak'].indexOf(data) >= 0) {
        // do nothing
        console.log('\x1b[1mCalibrating... Do not speak now...');
      }
      else if(['go_speak'].indexOf(data) >= 0) {
        console.log('\x1b[1mEar waiting for: ', transitions);
      }
      else {
        console.log('\x1b[1mEar heard: ', data);
        resolve(data);
      }
    });
  });
};

module.exports = Ear;

