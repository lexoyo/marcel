
const speaker = {
  say: function(phrase) {
    console.log('speaker says', phrase);
  }
}


exports.speaker = speaker;

return;

var stream = require('stream');
var util = require('util');
var Transform = stream.Transform;

function CleanUpAndMonitorStream(options) {
  Transform.call(this, options);
}
util.inherits(CleanUpAndMonitorStream, Transform);

CleanUpAndMonitorStream.prototype._transform = function (chunk, enc, cb) {
  // console.log('_transform', chunk.toString());
  // this.push(chunk);
  const str = chunk.toString();
  const cleanedup = str.split('\n').join(' ').trim();
  console.log('_transform', cleanedup);
  if(cleanedup.length > 0)
    this.push(cleanedup);
  cb();
};

var cleanUpAndMonitorStream = new CleanUpAndMonitorStream();
// cmd.stdout
//   .pipe(removeNewLines)
//   .pipe(process.stdout);

var mespeak = require("mespeak");
var randomvoice = require("randomvoice");
var Transform = require("stream").Transform;
let format =  { audioFormat: 1,
  endianness: 'LE',
  channels: 1,
  sampleRate: 22050,
  byteRate: 44100,
  blockAlign: 2,
  bitDepth: 16,
  signed: true
}

mespeak.loadConfig(require("mespeak/src/mespeak_config.json"));
mespeak.loadVoice(require("mespeak/voices/en/en-us.json"));

voice = randomvoice();
voice.rawdata = true;

function SayStream(options) {
  Transform.call(this, options);
}
util.inherits(SayStream, Transform);

SayStream.prototype._transform = function (chunk, enc, cb) {
  console.log('_transform', chunk.length, chunk.toString());
  var speech = mespeak.speak(chunk.toString(), voice);
  speech.length = speech.byteLength;
  reader.pipe(new Speaker(format));
//  this.push(new Buffer(speech);
  cb(null, new Buffer(speech));
};

var sayStream = new SayStream();
// cmd.stdout
//   .pipe(removeNewLines)
//   .pipe(process.stdout);


var streamArray = require("stream-array");
var makeProp = require("make-prop-stream");
var randomvoice = require("randomvoice")();

var Speaker = require('speaker');
var wav = require('wav');
var reader = new wav.Reader();
var fs = require("fs");

// the "format" event gets emitted at the end of the WAVE header
// reader.on('format', function (format) {
//   console.log('format', format)
//   // the WAVE header is stripped from the output of the reader
//   reader.pipe(new Speaker(format));
// });
console.log('random voice options: ', randomvoice);

cmd.stdout
  .pipe(cleanUpAndMonitorStream)
  .pipe(sayStream)
  .pipe(reader)
