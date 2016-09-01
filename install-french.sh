wget -O lium_french_f0.tar.gz http://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/Archive/French%20F0%20Broadcast%20News%20Acoustic%20Model/lium_french_f0.tar.gz/download
tar -xvzf lium_french_f0.tar.gz
cd lium_french_f0/
sudo mkdir -p `pkg-config --variable=modeldir pocketsphinx`/hmm/fr_FR/french_f0
sudo mv * `pkg-config --variable=modeldir pocketsphinx`/hmm/fr_FR/french_f0

wget -O french3g62K.lm.dmp http://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/French/fr.lm.dmp/download
# convert from old dmp to new bin
sphinx_lm_convert -i french3g62K.lm.dmp  -ifmt bin -o french3g62K.lm -ofmt arpa
sphinx_lm_convert -i french3g62K.lm -o french3g62K.lm.bin
#
sudo mkdir -p `pkg-config --variable=modeldir pocketsphinx`/lm/fr_FR/
sudo mv french3g62K.lm* `pkg-config --variable=modeldir pocketsphinx`/lm/fr_FR/

wget -O frenchWords62K.dic http://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/French/fr.dict/download
sudo mv frenchWords62K.dic `pkg-config --variable=modeldir pocketsphinx`/lm/fr_FR/


wget -O lium_french_f2.tar.gz http://sourceforge.net/projects/cmusphinx/files/Acoustic%20and%20Language%20Models/Archive/French%20F2%20Telephone%20Acoustic%20Model/lium_french_f2.tar.gz/download

