var streamArray = require("stream-array");
var makeProp = require("make-prop-stream");
var speechStream = require("speech-stream");

// var forceSpeed = 130;
// var randomvoice = require("randomvoice")();
// randomvoice.speed = forceSpeed || randomvoice.speed;

const Mouth = function(config) {
  this.voice = config.mouth.voice;
};
module.exports = Mouth;

Mouth.prototype.say = function(phrase, cbk) {
  return new Promise((resolve, reject) => {
    console.log('\x1b[1mMouth says:', phrase);
    var Speaker = require('speaker');
    var wav = require('wav');
    var reader = new wav.Reader();
    // the "format" event gets emitted at the end of the WAVE header
    reader.on('format', (format) => {
      // the WAVE header is stripped from the output of the reader
      reader.pipe(new Speaker(format));
    });
    reader.on('end', () => {
      resolve();
    });
    reader.on('error', (e) => {
      reject(e);
    });
    // console.log('random voice options: ', randomvoice);
    streamArray([phrase])
    .pipe(makeProp("message"))
    .pipe(speechStream(this.voice))
    .pipe(reader)
  });
};
