#!/usr/bin/env python3

import speech_recognition as sr
import argparse
import sys
from os import path

#sys.stdout.write('marcel tais toi')
#sys.exit(0)

parser = argparse.ArgumentParser(description='Process speech from file or mic, with optional keywords.')
parser.add_argument('-a', help='audio file path')
parser.add_argument('-lang', help='language to use, i.e. fr-FR or en-EN')
parser.add_argument('-k', nargs='+', help='phrases to look for')
# parser.add_argument('-g', help='grammar file with phrases to look for')

args = parser.parse_args()

if args.lang is None:
    lang = "fr-FR"
else:
    lang = args.lang

if args.k is None:
    keywords = None
else:
    keywords = []
    for phrase in args.k:
        keywords.append((phrase, 1.0))
    # list(map(print, keywords))

r = sr.Recognizer()
if args.a is None:
    with sr.Microphone() as source:
        print("WAIT_SPEAK");
        r.adjust_for_ambient_noise(source)  # we only need to calibrate once, before we start listening
        print("GO_SPEAK");
        audio = r.listen(source)
else:
    audioFile = args.a
    # print('audio file', audioFile)
    # AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), "test.wav")
    with sr.AudioFile(audioFile) as source:
        audio = r.record(source)  # read the entire audio file

try:
    sys.stdout.write(r.recognize_sphinx(audio, lang, keywords))
except sr.UnknownValueError:
    sys.stderr.write("Sphinx could not understand audio")
    sys.exit(5)
except sr.RequestError as e:
    sys.stderr.write("Sphinx error; {0}".format(e))
    sys.exit(5)

