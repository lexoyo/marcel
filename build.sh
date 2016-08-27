export LD_LIBRARY_PATH=/usr/local/lib:/home/lexoyo/Projects/jasper/pocketsphinx/src/libpocketsphinx/.libs:/home/lexoyo/Projects/jasper/sphinxbase/src/libsphinxbase/.libs:/home/lexoyo/Projects/jasper/sphinxbase/src/libsphinxad/.libs:/home/lexoyo/Projects/jasper/openfst/src/lib/
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig:/home/lexoyo/Projects/jasper/pocketsphinx:/home/lexoyo/Projects/jasper/sphinxbase
PATH=$PATH:/home/lexoyo/Projects/jasper/Phonetisaurus/src/bin/

gcc -o listen listen.c \
  -DMODELDIR=\"`pkg-config --variable=modeldir pocketsphinx`\" \
  `pkg-config --cflags --libs pocketsphinx sphinxbase` \
  -I "../sphinxbase/include" \
  -I "../pocketsphinx/include" \
  -L "../pocketsphinx/src/libpocketsphinx/.libs"  \
  -L "../sphinxbase/src/libsphinxbase/.libs"  \
  -L "../sphinxbase/src/libsphinxad/.libs"  \
