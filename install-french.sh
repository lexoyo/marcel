#!/usr/bin/env bash

SR_LIB=$(python -c "import speech_recognition as sr, os.path as p; print(p.dirname(sr.__file__))")

# sudo apt-get install --yes wget unzip
#sudo wget https://doc-04-40-docs.googleusercontent.com/docs/securesc/t042q8cvne12ghp5aqilld2bpgd30dat/6rqmecan741jv2fe3i7hankhqqlat8p5/1500451200000/00281452066314011224/12693779318150101750/0Bw_EqP-hnaFNN2FlQ21RdnVZSVE?e=download&nonce=0gi09i39nrujo&user=12693779318150101750&hash=94k0tmkeifvv0sh1illdkshg9gjauui9 -O "$SR_LIB/fr-FR.zip"

#echo "download fr-FR.zip from https://drive.google.com/file/d/0Bw_EqP-hnaFNN2FlQ21RdnVZSVE/view"
#echo "place it in this folder (`pwd`) and press enter"

if hash wget 2>/dev/null; then
  wget https://github.com/lexoyo/pocketsphinx-downloads/blob/master/fr-FR.zip\?raw\=true -O fr-FR.zip
else
  echo "wget is not installed, do this by hand:"
	echo "  - download fr-FR.zip from https://github.com/lexoyo/pocketsphinx-downloads/blob/master/fr-FR.zip\?raw\=true"
	echo "  - move fr-FR.zip to the current folder (`pwd`) and press enter"
  read -p "Press enter to continue"
fi

sudo unzip -o "fr-FR.zip" -d "$SR_LIB/"
sudo chmod --recursive a+r "$SR_LIB/pocketsphinx-data/fr-FR/"


