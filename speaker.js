var forceSpeed = 130;
var streamArray = require("stream-array");
var makeProp = require("make-prop-stream");
var speechStream = require("speech-stream");
var randomvoice = require("randomvoice")();
randomvoice.speed = forceSpeed || randomvoice.speed;


const speaker = {
  say: function(phrase) {
    console.log('speaker says:', phrase);
    var Speaker = require('speaker');
    var wav = require('wav');
    var reader = new wav.Reader();
    // the "format" event gets emitted at the end of the WAVE header
    reader.on('format', function (format) {
      // the WAVE header is stripped from the output of the reader
      reader.pipe(new Speaker(format));
    });
    console.log('random voice options: ', randomvoice, forceSpeed);
    streamArray([phrase])
    .pipe(makeProp("message"))
    .pipe(speechStream(randomvoice))
    .pipe(reader)
  }
}

exports.speaker = speaker;



