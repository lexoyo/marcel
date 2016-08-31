export LD_LIBRARY_PATH=/usr/local/lib:"${PWD}"/../pocketsphinx/src/libpocketsphinx/.libs:"${PWD}"/../sphinxbase/src/libsphinxbase/.libs:"${PWD}"/../sphinxbase/src/libsphinxad/.libs:"${PWD}"/../openfst/src/lib/
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:"${PWD}"/../pocketsphinx:"${PWD}"/../sphinxbase
PATH=$PATH:"${PWD}"/../Phonetisaurus/src/bin/

gcc -o listen listen.c \
  -DMODELDIR=\"`pkg-config --variable=modeldir pocketsphinx`\" \
  `pkg-config --cflags --libs pocketsphinx sphinxbase` \
  -I "../sphinxbase/include" \
  -I "../pocketsphinx/include" \
  -L "../pocketsphinx/src/libpocketsphinx/.libs"  \
  -L "../sphinxbase/src/libsphinxbase/.libs"  \
  -L "../sphinxbase/src/libsphinxad/.libs"
