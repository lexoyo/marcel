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
Ear.prototype.buildCmd = function(lang, opt_stateName) {
  // "./listen -continuous no -dict `pkg-config --variable=modeldir pocketsphinx`/lm/fr_FR/frenchWords62K.dic -hmm `pkg-config --variable=modeldir pocketsphinx`/hmm/fr_FR/french_f0 -lm `pkg-config --variable=modeldir pocketsphinx`/lm/fr_FR/french3g62K.lm.bin -vad_threshold 3.0",
  // "listen:fr:usePredefinedWords": -dict lang/fr/predefined.dic -lm lang/fr/predefined.lm -vad_threshold 3.0",
  const dic = opt_stateName ? `lang/${lang}/${opt_stateName}.dic` : this.paths[lang].dic;
  const lm = opt_stateName ? `lang/${lang}/${opt_stateName}.lm` : this.paths[lang].lm;
  const hmm = this.paths[lang].hmm;
  // contexts passed to npm start + 'all'
  // should be linux or raspi and/or debug
  const context = ['all'].concat(
    process.argv.filter(val => !!this.context[val])
  );
  const additionalParams =
    context.map(contextName => {
      const params = [];
      for(paramName in this.context[contextName])
        params.push(paramName + ' ' + this.context[contextName][paramName]);
      return params.join(' ');
    })
    .join(' ');

  const cmd = `./listen ${additionalParams} -hmm ${hmm} -dict ${dic} -lm ${lm}`;
  console.log('command:', cmd);
  return cmd;
};
Ear.prototype.listen = function(lang) {
  return new Promise((resolve, reject) => {
    // start process with listen C program
    const cmdStr = this.buildCmd(lang);
    const cmd = exec(cmdStr);

    // cmd.stdout.on('data', function (data) {
    //   const phrase = data.toString();
    // });
    // cmd.stdout.on('end', function (data) {
    //   console.log('stdout  END ');
    // });
    cmd.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
      reject(data.toString());
    });
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
        resolve(phrase);
      }
    });
  });
};
