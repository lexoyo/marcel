# the-bad-talker
a bot which listens and says non sense

```
$ npm i
$ npm start
```

## requirements

### speak

on a raspberry:
```
$ sudo apt-get install gcc libasound2 libasound2-dev
$ sudo apt-get install mpg321
```

`vi node_modules/speech-stream/node_modules/mespeak/src/index.js` or`vi node_modules/mespeak/src/index.js` then
replace

>  var ESpeak = require("./ESPEAK.js")

with

>  var ESpeak = require("./ESpeak.js")


### listen

needs pocketsphinx installed and configured, which is not an easy task

My parent folder looks like this

* openfst
* phonetisaurus
* Phonetisaurus
* pocketsphinx
* pocketsphinx-python
* sphinxbase
* the-bad-talker

Use this tool to chose words to be recognized (optional but much more efficient)
http://www.speech.cs.cmu.edu/tools/lmtool-new.html

Then use `npm run listen:sentences` in `index.js`
