const fs = require('fs');
const wav = require('wav');
const Speaker = require('speaker');

class Utils {
  play(path, cbk) {
    const file = fs.createReadStream(path);
    const reader = new wav.Reader();
    // the "format" event gets emitted at the end of the WAVE header
    reader.on('format', function (format) {

      // the WAVE header is stripped from the output of the reader
      reader.pipe(new Speaker(format));
    });
    file.on('end', () => {
      if(cbk) {
        cbk();
        // leave it a little delay
        // setTimeout(() => cbk(), 200);
      }
    });

    // pipe the WAVE file to the Reader instance
    file.pipe(reader);
  }
}

module.exports = new Utils();

