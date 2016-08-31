/*
 * continuous.c - Simple pocketsphinx command-line application to test
 *                both continuous listening/silence filtering from microphone
 *                and continuous file transcription.
 */

/*
 * This is a simple example of pocketsphinx application that uses continuous listening
 * with silence filtering to automatically segment a continuous stream of audio input
 * into utterances that are then decoded.
 *
 * Remarks:
 *   - Each utterance is ended when a silence segment of at least 1 sec is recognized.
 *   - Single-threaded implementation for portability.
 *   - Uses audio library; can be replaced with an equivalent custom library.
 *
 * command line options (`config.set_string('-dict', path.join(MODELDIR, 'en-us/cmudict-en-us.dict'))`)
 * * -hmm (pocketsphinx/model/hmm/en_US)
 * * -lm
 * * -dict
 * * -keyphrase
 * * -allphone
 * *
 * *
 * *
 * pocketsphinx_continuous -dict /usr/share/pocketsphinx/model/FR/frenchWords62K.dic -hmm /usr/share/pocketsphinx/model/FR/ -lm /usr/share/pocketsphinx/model/FR/french3g62K.lm.dmp
 INFO: pocketsphinx.c(152): Parsed model-specific feature parameters from ../fr//feat.params
 Current configuration:
 [NAME]                  [DEFLT]         [VALUE]
 -agc                    none            max
 -agcthresh              2.0             2.000000e+00
 -allphone
 -allphone_ci            no              no
 -alpha                  0.97            9.700000e-01
 -ascale                 20.0            2.000000e+01
 -aw                     1               1
 -backtrace              no              no
 -beam                   1e-48           1.000000e-48
 -bestpath               yes             yes
 -bestpathlw             9.5             9.500000e+00
 -ceplen                 13              13
 -cmn                    current         current
 -cmninit                8.0             8.0
 -compallsen             no              no
 -debug                                  0
 -dict                                   predefined-words/6023.dic
 -dictcase               no              no
 -dither                 no              no
 -doublebw               no              no
 -ds                     1               1
 -fdict
 -feat                   1s_c_d_dd       1s_c_d_dd
 -featparams
 -fillprob               1e-8            1.000000e-08
 -frate                  100             100
 -fsg
 -fsgusealtpron          yes             yes
 -fsgusefiller           yes             yes
 -fwdflat                yes             yes
 -fwdflatbeam            1e-64           1.000000e-64
 -fwdflatefwid           4               4
 -fwdflatlw              8.5             8.500000e+00
 -fwdflatsfwin           25              25
 -fwdflatwbeam           7e-29           7.000000e-29
 -fwdtree                yes             yes
 -hmm                                    ../fr/
 -input_endian           little          little
 -jsgf
 -keyphrase
 -kws
 -kws_delay              10              10
 -kws_plp                1e-1            1.000000e-01
 -kws_threshold          1               1.000000e+00
 -latsize                5000            5000
 -lda
 -ldadim                 0               0
 -lifter                 0               0
 -lm                                     predefined-words/6023.lm
-lmctl
-lmname
-logbase                1.0001          1.000100e+00
-logfn
-logspec                no              no
-lowerf                 133.33334       4.400000e+02
-lpbeam                 1e-40           1.000000e-40
-lponlybeam             7e-29           7.000000e-29
-lw                     6.5             6.500000e+00
-maxhmmpf               30000           30000
-maxwpf                 -1              -1
-mdef
-mean
-mfclogdir
-min_endfr              0               0
-mixw
-mixwfloor              0.0000001       1.000000e-07
-mllr
-mmap                   yes             yes
-ncep                   13              13
-nfft                   512             512
-nfilt                  40              31
-nwpen                  1.0             1.000000e+00
-pbeam                  1e-48           1.000000e-48
-pip                    1.0             1.000000e+00
-pl_beam                1e-10           1.000000e-10
-pl_pbeam               1e-10           1.000000e-10
-pl_pip                 1.0             1.000000e+00
-pl_weight              3.0             3.000000e+00
-pl_window              5               5
-rawlogdir
-remove_dc              no              no
-remove_noise           yes             yes
-remove_silence         yes             yes
-round_filters          yes             yes
-samprate               16000           1.600000e+04
-seed                   -1              -1
-sendump
-senlogdir
-senmgau
-silprob                0.005           5.000000e-03
-smoothspec             no              no
-svspec
-tmat
-tmatfloor              0.0001          1.000000e-04
-topn                   4               4
-topn_beam              0               0
-toprule
-transform              legacy          legacy
-unit_area              yes             yes
-upperf                 6855.4976       3.500000e+03
-uw                     1.0             1.000000e+00
-vad_postspeech         50              50
-vad_prespeech          20              20
-vad_startspeech        10              10
-vad_threshold          2.0             2.000000e+00
-var
-varfloor               0.0001          1.000000e-04
-varnorm                no              no
-verbose                no              no
-warp_params
-warp_type              inverse_linear  inverse_linear
-wbeam                  7e-29           7.000000e-29
-wip                    0.65            6.500000e-01
-wlen                   0.025625        2.562500e-02

 */

#include <stdio.h>
#include <string.h>
#include <assert.h>

#if defined(_WIN32) && !defined(__CYGWIN__)
#include <windows.h>
#else
#include <sys/select.h>
#endif

#include <sphinxbase/err.h>
#include <sphinxbase/ad.h>

#include "pocketsphinx.h"

static const arg_t cont_args_def[] = {
    POCKETSPHINX_OPTIONS,
    /* Argument file. */
    {"-argfile",
     ARG_STRING,
     NULL,
     "Argument file giving extra arguments."},
    {"-adcdev",
     ARG_STRING,
     NULL,
     "Name of audio device to use for input."},
    {"-infile",
     ARG_STRING,
     NULL,
     "Audio file to transcribe."},
    {"-inmic",
     ARG_BOOLEAN,
     "no",
     "Transcribe audio from microphone."},
    {"-continuous",
     ARG_BOOLEAN,
     "no",
     "Continue for ever vs stop after a sentence."},
    {"-time",
     ARG_BOOLEAN,
     "no",
     "Print word times in file transcription."},
    CMDLN_EMPTY_OPTION
};

static ps_decoder_t *ps;
static cmd_ln_t *config;
static FILE *rawfd;

static void
print_word_times()
{
    int frame_rate = cmd_ln_int32_r(config, "-frate");
    ps_seg_t *iter = ps_seg_iter(ps);
    while (iter != NULL) {
        int32 sf, ef, pprob;
        float conf;

        ps_seg_frames(iter, &sf, &ef);
        pprob = ps_seg_prob(iter, NULL, NULL, NULL);
        conf = logmath_exp(ps_get_logmath(ps), pprob);
        printf("> %s %.3f %.3f %f\n", ps_seg_word(iter), ((float)sf / frame_rate),
               ((float) ef / frame_rate), conf);
        iter = ps_seg_next(iter);
    }
}

static int
check_wav_header(char *header, int expected_sr)
{
    int sr;

    if (header[34] != 0x10) {
        printf("> Input audio file has [%d] bits per sample instead of 16\n", header[34]);
        return 0;
    }
    if (header[20] != 0x1) {
        printf("> Input audio file has compression [%d] and not required PCM\n", header[20]);
        return 0;
    }
    if (header[22] != 0x1) {
        printf("> Input audio file has [%d] channels, expected single channel mono\n", header[22]);
        return 0;
    }
    sr = ((header[24] & 0xFF) | ((header[25] & 0xFF) << 8) | ((header[26] & 0xFF) << 16) | ((header[27] & 0xFF) << 24));
    if (sr != expected_sr) {
        printf("> Input audio file has sample rate [%d], but decoder expects [%d]\n", sr, expected_sr);
        return 0;
    }
    return 1;
}

/*
 * Continuous recognition from a file
 */
static void
recognize_from_file()
{
    int16 adbuf[2048];
    const char *fname;
    const char *hyp;
    int32 k;
    uint8 utt_started, in_speech;
    int32 print_times = cmd_ln_boolean_r(config, "-time");

    fname = cmd_ln_str_r(config, "-infile");
    if ((rawfd = fopen(fname, "rb")) == NULL) {
        E_FATAL_SYSTEM("Failed to open file '%s' for reading",
                       fname);
    }

    if (strlen(fname) > 4 && strcmp(fname + strlen(fname) - 4, ".wav") == 0) {
        char waveheader[44];
  fread(waveheader, 1, 44, rawfd);
  if (!check_wav_header(waveheader, (int)cmd_ln_float32_r(config, "-samprate")))
          printf("> Failed to process file '%s' due to format mismatch.\n", fname);
    }

    if (strlen(fname) > 4 && strcmp(fname + strlen(fname) - 4, ".mp3") == 0) {
  printf("> Can not decode mp3 files, convert input file to WAV 16kHz 16-bit mono before decoding.\n");
    }

    ps_start_utt(ps);
    utt_started = FALSE;

    while ((k = fread(adbuf, sizeof(int16), 2048, rawfd)) > 0) {
        ps_process_raw(ps, adbuf, k, FALSE, FALSE);
        in_speech = ps_get_in_speech(ps);
        if (in_speech && !utt_started) {
            utt_started = TRUE;
        }
        if (!in_speech && utt_started) {
            ps_end_utt(ps);
            hyp = ps_get_hyp(ps, NULL);
            if (hyp != NULL)
          printf("> %s\n", hyp);
            if (print_times)
          print_word_times();
            fflush(stdout);

            ps_start_utt(ps);
            utt_started = FALSE;
        }
    }
    ps_end_utt(ps);
    if (utt_started) {
        hyp = ps_get_hyp(ps, NULL);
        if (hyp != NULL) {
          printf("> %s\n", hyp);
          if (print_times) {
        print_word_times();
      }
  }
    }

    fclose(rawfd);
}

/* Sleep for specified msec */
static void
sleep_msec(int32 ms)
{
#if (defined(_WIN32) && !defined(GNUWINCE)) || defined(_WIN32_WCE)
    Sleep(ms);
#else
    /* ------------------- Unix ------------------ */
    struct timeval tmo;

    tmo.tv_sec = 0;
    tmo.tv_usec = ms * 1000;

    select(0, NULL, NULL, NULL, &tmo);
#endif
}

/*
 * Main utterance processing loop:
 *     for (;;) {
 *        start utterance and wait for speech to process
 *        decoding till end-of-utterance silence will be detected
 *        print utterance result;
 *     }
 */
static void
recognize_from_microphone(int continuous)
{
    ad_rec_t *ad;
    int16 adbuf[2048];
    uint8 utt_started, in_speech;
    int32 k;
    char const *hyp;

    if ((ad = ad_open_dev(cmd_ln_str_r(config, "-adcdev"),
                          (int) cmd_ln_float32_r(config,
                                                 "-samprate"))) == NULL)
        printf("> Failed to open audio device\n");
    if (ad_start_rec(ad) < 0)
        printf("> Failed to start recording\n");

    if (ps_start_utt(ps) < 0)
        printf("> Failed to start utterance\n");
    utt_started = FALSE;
    E_INFO("Ready....\n");

    E_INFO("Starting... (-continuous=%i)\n", continuous);
    for (;;) {
        if ((k = ad_read(ad, adbuf, 2048)) < 0)
            printf("> Failed to read audio\n");
        ps_process_raw(ps, adbuf, k, FALSE, FALSE);
        in_speech = ps_get_in_speech(ps);
        if (in_speech && !utt_started) {
            utt_started = TRUE;
            E_INFO("Listening...\n");
        }
        if (!in_speech && utt_started) {
            /* speech -> silence transition, time to start new utterance  */
            ps_end_utt(ps);
            hyp = ps_get_hyp(ps, NULL );
            if (hyp != NULL) {
                printf("%s\n", hyp);
                fflush(stdout);
                // print_word_times();
                if(continuous == FALSE)
                  return;
            }
            else {
              // never comes here
            }

            if (ps_start_utt(ps) < 0)
                printf("> Failed to start utterance\n");
            utt_started = FALSE;
            E_INFO("Ready....\n");
        }
        sleep_msec(100);
    }
    ad_close(ad);
}

int
main(int argc, char *argv[])
{
    char const *cfg;

    config = cmd_ln_parse_r(NULL, cont_args_def, argc, argv, TRUE);

    /* Handle argument file as -argfile. */
    if (config && (cfg = cmd_ln_str_r(config, "-argfile")) != NULL) {
        config = cmd_ln_parse_file_r(config, cont_args_def, cfg, FALSE);
    }

    if (config == NULL || (cmd_ln_str_r(config, "-infile") == NULL && cmd_ln_boolean_r(config, "-inmic") == FALSE)) {
  E_INFO("Specify '-infile <file.wav>' to recognize from file or '-inmic yes' to recognize from microphone.\n");
        cmd_ln_free_r(config);
  return 1;
    }

    ps_default_search_args(config);
    ps = ps_init(config);
    if (ps == NULL) {
        cmd_ln_free_r(config);
        return 1;
    }

    E_INFO("%s COMPILED ON: %s, AT: %s\n\n", argv[0], __DATE__, __TIME__);

    if (cmd_ln_str_r(config, "-infile") != NULL) {
        recognize_from_file();
    } else if (cmd_ln_boolean_r(config, "-inmic")) {
        recognize_from_microphone(cmd_ln_boolean_r(config, "-continuous"));
    }

    ps_free(ps);
    cmd_ln_free_r(config);

    return 0;
}

#if defined(_WIN32_WCE)
#pragma comment(linker,"/entry:mainWCRTStartup")
#include <windows.h>
//Windows Mobile has the Unicode main only
int
wmain(int32 argc, wchar_t * wargv[])
{
    char **argv;
    size_t wlen;
    size_t len;
    int i;

    argv = malloc(argc * sizeof(char *));
    for (i = 0; i < argc; i++) {
        wlen = lstrlenW(wargv[i]);
        len = wcstombs(NULL, wargv[i], wlen);
        argv[i] = malloc(len + 1);
        wcstombs(argv[i], wargv[i], wlen);
    }

    //assuming ASCII parameters
    return main(argc, argv);
}
#endif
