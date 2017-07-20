#!/usr/bin/env python3

import speech_recognition as sr
import argparse
import sys
from os import path
import json

#sys.stdout.write('marcel tais toi')
#sys.exit(0)

parser = argparse.ArgumentParser(description='Process speech from file or mic, with optional keywords.')
parser.add_argument('-a', help='audio file path')
parser.add_argument('-lang', help='language to use, i.e. fr-FR or en-EN')
parser.add_argument('-engine', help='engine to use for stt, i.e. sphinx or google')
parser.add_argument('-k', nargs='+', help='phrases to look for')
# parser.add_argument('-g', help='grammar file with phrases to look for')

args = parser.parse_args()

if args.lang is None:
    lang = "fr-FR"
else:
    lang = args.lang

if args.k is None:
    keywordsWithProba = None
    keywords = None
else:
    keywordsWithProba = []
    keywords = []
    for phrase in args.k:
        keywordsWithProba.append((phrase, 1.0))
        keywords.append(phrase)
    # list(map(print, keywords))

engine = 'sphinx'
if args.engine is not None:
    engine = args.engine

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
    if(engine == 'sphinx'):
        sys.stderr.write("Use engine Sphinx\n")
        phrase = r.recognize_sphinx(audio, lang, keywordsWithProba);
    else:
        sys.stderr.write("Use engine Google Speech API\n")
        phrase = r.recognize_google_cloud(audio, json.dumps({
          "type": "service_account",
          "project_id": "marcel-123",
          "private_key_id": "c8a4af088474e9e2ea93903726cdcb41087b43cb",
          "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC3CNfxAvHV0PoJ\n5BaCBM2Idqm3nM+qMQNTbvuYIkrOORVA81+sB2MGKMeWpRb8Dxyv9VgwjkaRciuV\nbM1QY5zPBUvi6F2LvKp6cxiImksGfL6c4ZzsqTIUfhYbhBnx1bEtx+sVwjVKxHDM\n9bfC/vaCswlFTix768vOC0hRgsRDa6uQTlBe5Azs8sgmUnN8tRWZ8K41FbYNghVX\nTqW9SSIqYqh38VrIjiojhGbUDfPsudwXg4IefTwO2/N4Q+ZY+NMPMGRBzPvzDHFe\ndmLibi3cMuJsh0NeEuKJW4bHXTXISR8Yg+W8gJD2hKaRQBvMk7kLCSbW76+YQfbU\nKUB8FxhTAgMBAAECggEAJU4uoSdN/hv1Un3EHqT29UjmR4+0/cW2nVNCAVx/7a9R\nxyazib8JrlAyeeBVInO8D5sMaf0dofhorLB72lYrOECmmm1s35XJE2MRDYqRHxXe\nzd/oGY5UsDuQqvQOS62XyrJ0Fj+6l+4Y5ZVxalOID9SI37DSvUEujWTcTQy/jtPy\nNGlp5c184zP2y+1jFr1JsaaWvMoFAL5IEWwEo3QgrJ5WLgADE2y8Gpdu5IPW9k9I\n+HWLroDFb0/32E/sSYlsu7shkUcnkRFejMK2iuux1uzXKSmp1a21Imj+OdkTKN3G\nwvMErXvR8ty/BIPuTuNThXXexTYCT6zebZGMQYGkfQKBgQD/d6CHyz/s0/JStzcH\n/Cio7Ru5e67bUiBN5t2khkXm6ILRmdA0XkSnzU3bUOkEkm8tObs/IS4tpQqF0VBB\nldwjwHGEsjmWCtlH81GEUPvDEkDx/YjbcfaguqcUYBaR57fcejqnvZMJF2GdWzOB\nZzcTzS9XEoqlV+caDu8mNYyXDQKBgQC3aozyjdiHdjvrQSoZp4rpZ2GQZXtTsEBF\nr74dciRWRo9guf/R+WhJudVZQJuMmc9tB2sijSUft82rPnKwL3foAUqyg78d9NS7\ndwV9dIgWi67qp7nwJusNx/TNHZvFqDkHziy7PaL6qwXUln/Y40P40Nm4jnVSDO5b\nNHGFuXyU3wKBgA0h8C2q5CFfj+ByrLCLZOeyMK+rTQTXRvPaP2CaynMhVsBBoPNg\nOTVLF4qDsUbb5D0174tCQGZ2SoEwjmigtI1d8jf5FX7CFgNd3b3oj9iqUo5eEy/8\nvsnqbnZcrixX9hquad9/nlRkUE9PhelMDgfFj35xZJE1YJr1U5PqQsztAoGADaBv\n6lFZhe7l0rubqh5FdsPEftrbR8Nvcv30jPF++53wZwpKlEoIUnno/OGM7Ow8eeg0\nMHP2Dx4zvIY+NRLBwM3fw9V/7HTVHTxhfwmaVrp3+10MtmfdzL9PU7HgcdXmrsrF\njf+tTRxJqZqo0u9HjIPPuSN0We02BDaoPHwkYlcCgYBK88Lp/WZMFNakV/ajugba\nnDedWJIxGUptRo1rNoGhnAGMFwBP8kEM5A/2mF8lpDfTF8zyUareO8rDJPR/maxE\n4PZ6EcpYfv4fy1AyNckHTCcc8IHeKUiz33ef7zG9FBlRig7weudNtKVvU9k+O/3v\noac3QISWlf3Izt93lMoSLQ==\n-----END PRIVATE KEY-----\n",
          "client_email": "marcel-account@marcel-123.iam.gserviceaccount.com",
          "client_id": "101489589357383356375",
          "auth_uri": "https://accounts.google.com/o/oauth2/auth",
          "token_uri": "https://accounts.google.com/o/oauth2/token",
          "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
          "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/marcel-account%40marcel-123.iam.gserviceaccount.com"
        }), lang, keywords);

    sys.stdout.write(phrase)
except sr.UnknownValueError:
    sys.stderr.write("Warning: I could not understand what you said\n")
    sys.exit(5)
except sr.RequestError as e:
    sys.stderr.write("Error; {0}\n".format(e))
    sys.exit(5)

