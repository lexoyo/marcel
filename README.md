# marcel

a bot which listens and says non sense in several languages

## Current state

Marcel listens to you in French or in English but answers in English. To do so, he is able to use Sphinx (offline) or Google voice API (but there is [a bug described for Google voice in lib, so for now Sphinx is the only option](https://github.com/Uberi/speech_recognition/issues/298#issuecomment-351579430)).

Once all the dependencies installed (easy on a raspberry, more dependencies on other distro, see bellow) Marcel will install French automatically.

Marcel is made of several utility classes used to listen, talk and understand: Brain, ear, mouth classes. You can easily write modules and use these classes to automate your life or have as much fun with Marcel as I do, see [the modules in this folder, each .js file in this folder is loaded as a module and describes itself](./modules/).

[Marcel's config is in his package.json](./package.json)

## Use

```
$ npm i
$ npm start
```

## requirements

You probably need to [update nodejs](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

### python

on fedora, you will need to upgrade to python3 and have these dependencies
```
$ sudo dnf install python3-devel && pip3 install --force-reinstall --upgrade pip
$ sudo dnf install portaudio-devel
$ sudo dnf install swig
$ pip install pocketsphinx
$ pip install SpeechRecognition
$ pip install PyAudio
```

### speak

on fedora
```
$ sudo dnf install alsa-lib-devel
$ pip install SpeechRecognition
```

on a raspberry:
```
$ sudo apt-get install gcc libasound2 libasound2-dev
$ sudo apt-get install mpg321
$ sudo apt-get install --yes wget unzip # this is for install-french script
$ sudo apt-get install libpulse-dev # this is for pocketshpinx
$ pip install SpeechRecognition
```

### listen

See here [how to install other languages](https://github.com/Uberi/speech_recognition/blob/master/reference/pocketsphinx.rst#installing-other-languages)

If you want to use google instead of Sphinx, you will need to edit package.json config and install google-api-python-client like this:

```
$ pip install google-api-python-client
```
Also create an app in google cloud platform, activate the speech API and create a service account key, which will give you a json file. Put the json file as key.json at the root of Marcel's directory.

### notes

Needs pocketsphinx installed and configured, which is not an easy task.

Specific to raspberry:

* [Configuring ALSA Audio output on Analog and HDMI of Raspberry Pi](http://karuppuswamy.com/wordpress/2015/08/15/configuring-alsa-audio-output-on-analog-and-hdmi-of-raspberry-pi/)
* [the instructions for raspberry pi](http://cmusphinx.sourceforge.net/wiki/raspberrypi)
* [find the missing file alsa-base.conf](http://superuser.com/questions/989385/alsa-base-conf-missing-in-new-raspberry-pi-raspbian-jesse) (use the comment about `/lib/modprobe.d/aliases.conf`)
* [this post about trouble shooting mic/audio](https://www.raspberrypi.org/forums/viewtopic.php?f=37&t=37262) and [this one too](http://raspberrypi.stackexchange.com/questions/40831/how-do-i-configure-my-sound-for-jasper-on-raspbian-jessie)

Use this tool to chose words to be recognized (optional but much more efficient)
* http://www.speech.cs.cmu.edu/tools/lmtool-new.html
* also see http://www.speech.cs.cmu.edu/sphinx/models/

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

