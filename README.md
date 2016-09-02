# marcel

a bot which listens and says non sense in several languages

```
$ npm i
$ npm start linux release
```
or
```
$ npm start raspi release
```

## requirements

### speak

on fedora
```
$ sudo dnf install alsa-lib-devel
$ sudo dnf install sphinxbase-devel.x86_64
$ export LD_LIBRARY_PATH=/usr/local/lib:/usr/include/pocketsphinx:/usr/include/sphinxbase
$ export PKG_CONFIG_PATH=/usr/lib64/pkgconfig/:/usr/local/lib/pkgconfig:/usr/include/pocketsphinx:/usr/include/sphinxbase
$ export CPATH=$CPATH:/usr/include/pocketsphinx:/usr/include/sphinxbase
```

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

Needs pocketsphinx installed and configured, which is not an easy task.

Specific to raspberry:

* [the instructions for raspberry pi](http://cmusphinx.sourceforge.net/wiki/raspberrypi)
* [find the missing file alsa-base.conf](http://superuser.com/questions/989385/alsa-base-conf-missing-in-new-raspberry-pi-raspbian-jesse) (use the comment about `/lib/modprobe.d/aliases.conf`)
* [this post about trouble shooting mic/audio](https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=37262) and [this one too](http://raspberrypi.stackexchange.com/questions/40831/how-do-i-configure-my-sound-for-jasper-on-raspbian-jessie)

My parent folder looks like this

* openfst
* phonetisaurus
* Phonetisaurus
* pocketsphinx
* pocketsphinx-python
* sphinxbase
* marcel

Use this tool to chose words to be recognized (optional but much more efficient)
* http://www.speech.cs.cmu.edu/tools/lmtool-new.html
* also see http://www.speech.cs.cmu.edu/sphinx/models/

Then use `npm run listen:sentences` in `index.js`

Here are foreign language packs:
http://www.politepix.com/languages

Convert *.lm.dmp to *.lm (very slow) (from [this tutorial](http://cmusphinx.sourceforge.net/wiki/tutoriallm))

```
sphinx_lm_convert -i ../fr/fr.lm.dmp -ifmt bin -o ../fr/model.lm -ofmt arpa
```
Convert to .bin (quicker to start)

```
sphinx_lm_convert -i model.lm -o model.lm.bin
```

## road map

* activate between "marcel" and "shut up marcel"
* switch between languages
* repeat mode
* record / play sound
* play radio
* give the time, set timer
* search [duckduckgo instant answers](https://duckduckgo.com/api)
