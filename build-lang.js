const lmtool = require('lmtool');
const fs = require('fs');
const path = require('path');

['fr', 'en'].forEach( function(lang) {
  const fileName = path.resolve(__dirname, 'lang', lang, 'predefined.txt');
  const fileContent = fs.readFileSync(fileName).toString().split('\n');
  lmtool(fileContent, (err, id) => {
    console.log('lang data retrieved', err, id);
    ['dic', 'lm'].forEach( function(ext) {
      const fileName = path.resolve(__dirname, 'lang', lang, 'predefined.' + ext);
      const fileContent = fs.readFileSync(id + '.' + ext).toString();
      console.log('writing', fileName, fileContent);
      fs.writeFileSync(fileName, fileContent);
    });
  });
});

