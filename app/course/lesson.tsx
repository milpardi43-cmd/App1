import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { ArrowRight, Check, ChevronLeft, Headphones, MessageCircle, Mic2, RotateCcw, Sparkles, Square, Volume2 } from 'lucide-react-native';
import { getSentenceLesson, SENTENCE_LESSONS } from '@/lib/courseContent';
import { completeSentenceLesson } from '@/lib/courseProgress';
import { evaluateSpokenSentence, type SpeechEvaluation } from '@/lib/speechPractice';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';

const stages = ['موقعیت', 'جمله‌ها', 'شنیدن', 'تمرین', 'مکالمه', 'لغات'];

export default function SentenceLessonScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = getSentenceLesson(id || '') ?? SENTENCE_LESSONS[0];
  const [stage, setStage] = useState(0);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);
  const [evaluatingSpeech, setEvaluatingSpeech] = useState(false);
  const [speechResult, setSpeechResult] = useState<SpeechEvaluation | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const current = lesson.sentences[sentenceIndex];
  const vocabulary = useMemo(() => {
    const seen = new Set<string>();
    return lesson.sentences.flatMap((sentence) => sentence.vocabulary).filter((item) => {
      if (seen.has(item.word)) return false;
      seen.add(item.word);
      return true;
    });
  }, [lesson]);

  const speak = (text: string, rate = 0.78) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', rate });
  };

  const startSpeechPractice = async () => {
    try {
      setSpeechError(null);
      setSpeechResult(null);
      Speech.stop();
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setSpeechError('برای تمرین گفتاری، اجازه استفاده از میکروفن را فعال کنید.');
        return;
      }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch {
      setSpeechError('ضبط صدا شروع نشد. دوباره تلاش کنید.');
    }
  };

  const stopAndEvaluateSpeech = async () => {
    if (!recorderState.isRecording || evaluatingSpeech) return;
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!recorder.uri) throw new Error('Recording URI is missing');
      setEvaluatingSpeech(true);
      setSpeechError(null);
      setSpeechResult(await evaluateSpokenSentence(recorder.uri, current.en));
    } catch (cause) {
      setSpeechError(cause instanceof Error && cause.message !== 'Recording URI is missing' ? cause.message : 'صدای شما بررسی نشد. دوباره تلاش کنید.');
    } finally {
      setEvaluatingSpeech(false);
    }
  };

  const selectListeningSentence = (index: number) => {
    if (recorderState.isRecording || evaluatingSpeech) return;
    setSentenceIndex(index);
    setSpeechResult(null);
    setSpeechError(null);
    speak(lesson.sentences[index].en, 0.72);
  };

  const next = async () => {
    if (stage === 1 && sentenceIndex < lesson.sentences.length - 1) {
      setSentenceIndex((value) => value + 1);
      setRevealed(false);
      return;
    }
    if (stage < stages.length - 1) {
      setStage((value) => value + 1);
      setSentenceIndex(0);
      setRevealed(false);
      return;
    }
    const index = SENTENCE_LESSONS.findIndex((item) => item.id === lesson.id);
    const nextLesson = SENTENCE_LESSONS[index + 1];
    await completeSentenceLesson(lesson.id, nextLesson?.id);
    router.replace('/lang' as never);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <ArrowRight size={20} color={Colors.neutral[200]} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSub}>{stages[stage]} · مرحله {toPersianDigits(stage + 1)} از {toPersianDigits(stages.length)}</Text>
        </View>
        <Text style={styles.percent}>{toPersianDigits(Math.round(((stage + 1) / stages.length) * 100))}٪</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((stage + 1) / stages.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {stage === 0 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Sparkles size={34} color={Colors.accent[400]} /></View>
            <Text style={styles.stageEyebrow}>موقعیت واقعی</Text>
            <Text style={styles.stageTitle}>{lesson.title}</Text>
            <Text style={styles.situation}>{lesson.situation}</Text>
            <View style={styles.promiseCard}>
              <Text style={styles.promiseTitle}>در پایان این درس می‌توانید:</Text>
              <Text style={styles.promiseText}>با {toPersianDigits(lesson.sentences.length)} جمله کوتاه، این موقعیت را مدیریت کنید.</Text>
            </View>
          </View>
        )}

        {stage === 1 && (
          <View style={styles.sentenceStage}>
            <Text style={styles.counter}>جمله {toPersianDigits(sentenceIndex + 1)} از {toPersianDigits(lesson.sentences.length)}</Text>
            <View style={styles.sentenceCard}>
              <Pressable style={styles.soundButton} onPress={() => speak(current.en)}>
                <Volume2 size={25} color={Colors.onColor} />
              </Pressable>
              <Text style={styles.english}>{current.en}</Text>
              <Text style={styles.pronunciation}>{current.pronunciation}</Text>
              <View style={styles.divider} />
              <Text style={styles.persian}>{current.fa}</Text>
              {current.pattern ? <Text style={styles.pattern}>الگو: {current.pattern}</Text> : null}
            </View>
            <Text style={styles.hint}>چند بار گوش دهید و جمله را با صدای بلند تکرار کنید.</Text>
          </View>
        )}

        {stage === 2 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Headphones size={34} color={Colors.primary[400]} /></View>
            <Text style={styles.stageTitle}>گوش کن و تکرار کن</Text>
            <Text style={styles.stageDesc}>هر جمله را بشنوید، یک مکث کوتاه کنید و دقیقاً با همان آهنگ تکرار کنید.</Text>
            <View style={styles.listenList}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable
                  key={sentence.id}
                  disabled={recorderState.isRecording || evaluatingSpeech}
                  style={[styles.listenRow, index === sentenceIndex && styles.listenRowActive]}
                  onPress={() => selectListeningSentence(index)}
                >
                  <View style={styles.listenNumber}><Text style={styles.listenNumberText}>{toPersianDigits(index + 1)}</Text></View>
                  <Text style={styles.listenEnglish}>{sentence.en}</Text>
                  <Volume2 size={19} color={Colors.primary[400]} />
                </Pressable>
              ))}
            </View>

            <View style={styles.speechPractice}>
              <Text style={styles.speechTitle}>حالا شما بگویید</Text>
              <Text style={styles.speechSentence}>{current.en}</Text>
              <Text style={styles.speechHint}>{recorderState.isRecording ? `در حال ضبط · ${toPersianDigits(Math.max(1, Math.round(recorderState.durationMillis / 1000)))} ثانیه` : evaluatingSpeech ? 'در حال بررسی قابل‌فهم‌بودن جمله…' : 'دکمه را بزنید، جمله را بگویید و سپس ضبط را متوقف کنید.'}</Text>
              <Pressable
                disabled={evaluatingSpeech}
                style={[styles.recordButton, recorderState.isRecording && styles.recordButtonActive, evaluatingSpeech && styles.recordButtonDisabled]}
                onPress={() => recorderState.isRecording ? void stopAndEvaluateSpeech() : void startSpeechPractice()}
              >
                {evaluatingSpeech ? <Text style={styles.recordButtonText}>در حال بررسی…</Text> : recorderState.isRecording ? <><Square size={17} color={Colors.onColor} fill={Colors.onColor} /><Text style={styles.recordButtonText}>توقف و بررسی</Text></> : <><Mic2 size={19} color={Colors.onColor} /><Text style={styles.recordButtonText}>شروع ضبط</Text></>}
              </Pressable>

              {speechResult ? (
                <View style={styles.speechResult}>
                  <View style={styles.scoreRow}><Text style={styles.scoreLabel}>وضوح جمله</Text><Text style={styles.scoreValue}>{toPersianDigits(speechResult.score)}٪</Text></View>
                  <Text style={styles.recognizedLabel}>آنچه شنیده شد:</Text>
                  <Text style={styles.recognizedText}>{speechResult.recognized || 'صدای قابل‌تشخیصی دریافت نشد.'}</Text>
                  <Text style={styles.feedbackText}>{speechResult.feedbackFa}</Text>
                  {speechResult.missingWords.length ? <Text style={styles.missingWords}>دوباره تمرین کنید: {speechResult.missingWords.join(' · ')}</Text> : null}
                </View>
              ) : null}
              {speechError ? <Text style={styles.speechError}>{speechError}</Text> : null}
            </View>

            <View style={styles.shadowTip}>
              <Mic2 size={18} color={Colors.warning[400]} />
              <Text style={styles.shadowText}>این امتیاز میزان قابل‌فهم‌بودن جمله را می‌سنجد؛ هدف لهجه بی‌نقص نیست.</Text>
            </View>
          </View>
        )}

        {stage === 3 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><RotateCcw size={33} color={Colors.success[400]} /></View>
            <Text style={styles.stageTitle}>جمله را به یاد بیاور</Text>
            <Text style={styles.stageDesc}>معنی زیر را بخوانید و جمله انگلیسی را با صدای بلند بگویید.</Text>
            <View style={styles.practiceCard}>
              <Text style={styles.practiceFa}>{current.fa}</Text>
              {revealed ? (
                <View style={styles.answerBox}>
                  <Check size={19} color={Colors.success[400]} />
                  <Text style={styles.answerText}>{current.en}</Text>
                </View>
              ) : (
                <Pressable style={styles.revealButton} onPress={() => setRevealed(true)}>
                  <Text style={styles.revealText}>نمایش پاسخ</Text>
                </Pressable>
              )}
            </View>
            <View style={styles.dots}>
              {lesson.sentences.map((sentence, index) => (
                <Pressable key={sentence.id} onPress={() => { setSentenceIndex(index); setRevealed(false); }} style={[styles.dot, index === sentenceIndex && styles.dotActive]} />
              ))}
            </View>
          </View>
        )}

        {stage === 4 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><MessageCircle size={34} color={Colors.accent[400]} /></View>
            <Text style={styles.stageTitle}>مکالمه کوتاه</Text>
            <Text style={styles.stageDesc}>جمله‌های درس حالا داخل یک گفتگوی واقعی استفاده می‌شوند.</Text>
            <View style={styles.dialogue}>
              {lesson.dialogue.map((line, index) => (
                <View key={`${line.text}-${index}`} style={[styles.bubble, line.speaker === 'learner' ? styles.bubbleLearner : styles.bubblePartner]}>
                  <Text style={styles.bubbleSpeaker}>{line.speaker === 'learner' ? 'شما' : 'Emma'}</Text>
                  <Text style={styles.bubbleEn}>{line.text}</Text>
                  <Text style={styles.bubbleFa}>{line.fa}</Text>
                  <Pressable onPress={() => speak(line.text)} hitSlop={10} style={styles.bubbleSound}><Volume2 size={15} color={Colors.primary[300]} /></Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        {stage === 5 && (
          <View style={styles.centerStage}>
            <View style={styles.bigIcon}><Sparkles size={34} color={Colors.warning[400]} /></View>
            <Text style={styles.stageTitle}>لغات همین جمله‌ها</Text>
            <Text style={styles.stageDesc}>لغت جدید را جدا حفظ نکنید؛ جمله‌ای را که در آن دیدید به خاطر بسپارید.</Text>
            <View style={styles.vocabList}>
              {vocabulary.map((item) => {
                const example = lesson.sentences.find((sentence) => sentence.vocabulary.some((word) => word.word === item.word));
                return (
                  <View key={item.word} style={styles.vocabCard}>
                    <View style={styles.vocabTop}>
                      <Text style={styles.vocabWord}>{item.word}</Text>
                      <Text style={styles.vocabMeaning}>{item.meaning}</Text>
                    </View>
                    <Text style={styles.vocabExample}>{example?.en}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.nextButton} onPress={() => void next()}>
          <Text style={styles.nextText}>{stage === stages.length - 1 ? 'پایان درس' : stage === 1 && sentenceIndex < lesson.sentences.length - 1 ? 'جمله بعدی' : 'ادامه'}</Text>
          {stage === stages.length - 1 ? <Check size={20} color={Colors.onColor} /> : <ChevronLeft size={20} color={Colors.onColor} />}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950] },
  header: { paddingTop: 52, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.neutral[900] },
  back: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.neutral[850], alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  headerSub: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', marginTop: 2 },
  percent: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.accent[400] },
  progressTrack: { height: 4, backgroundColor: Colors.neutral[800] },
  progressFill: { height: '100%', backgroundColor: Colors.accent[500], alignSelf: 'flex-end' },
  content: { padding: Spacing.lg, paddingBottom: 40 },
  centerStage: { alignItems: 'center' },
  bigIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.lg },
  stageEyebrow: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.accent[400], marginBottom: 4 },
  stageTitle: { fontFamily: Typography.fontFamily, fontSize: 25, fontWeight: Typography.weights.bold, color: Colors.neutral[50], textAlign: 'center' },
  stageDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[400], textAlign: 'center', lineHeight: 23, marginTop: Spacing.sm },
  situation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, color: Colors.neutral[300], textAlign: 'center', lineHeight: 27, marginTop: Spacing.md },
  promiseCard: { width: '100%', borderRadius: Radius.xl, backgroundColor: Colors.accent[500] + '10', borderWidth: 1, borderColor: Colors.accent[500] + '30', padding: Spacing.lg, marginTop: Spacing.xl },
  promiseTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.accent[300], textAlign: 'right' },
  promiseText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[300], textAlign: 'right', lineHeight: 23, marginTop: 5 },
  sentenceStage: { alignItems: 'center', paddingTop: Spacing.lg },
  counter: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], marginBottom: Spacing.md },
  sentenceCard: { width: '100%', borderRadius: Radius.xl, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[700], padding: Spacing.xl, alignItems: 'center' },
  soundButton: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.accent[500], alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  english: { fontSize: 25, lineHeight: 36, fontWeight: '700', color: Colors.neutral[0], textAlign: 'center' },
  pronunciation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.primary[300], textAlign: 'center', marginTop: 8 },
  divider: { width: '70%', height: 1, backgroundColor: Colors.neutral[700], marginVertical: Spacing.lg },
  persian: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, color: Colors.neutral[200], textAlign: 'center' },
  pattern: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.warning[400], backgroundColor: Colors.warning[500] + '10', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.full, marginTop: Spacing.md },
  hint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'center', lineHeight: 19, marginTop: Spacing.md },
  listenList: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  listenRow: { minHeight: 62, borderRadius: Radius.lg, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], paddingHorizontal: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  listenRowActive: { borderColor: Colors.primary[500] + '70', backgroundColor: Colors.primary[500] + '0C' },
  listenNumber: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.primary[500] + '18', alignItems: 'center', justifyContent: 'center' },
  listenNumberText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.primary[300] },
  listenEnglish: { flex: 1, fontSize: 15, color: Colors.neutral[100], textAlign: 'left' },
  speechPractice: { width: '100%', borderRadius: Radius.xl, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.accent[500] + '35', padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.lg },
  speechTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[100] },
  speechSentence: { fontSize: 19, lineHeight: 28, fontWeight: '700', color: Colors.neutral[50], textAlign: 'center', marginTop: Spacing.sm },
  speechHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'center', lineHeight: 19, marginTop: 6 },
  recordButton: { minHeight: 48, minWidth: 155, borderRadius: Radius.full, paddingHorizontal: Spacing.lg, backgroundColor: Colors.accent[500], flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: Spacing.md },
  recordButtonActive: { backgroundColor: Colors.error[500] },
  recordButtonDisabled: { opacity: .55 },
  recordButtonText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.onColor },
  speechResult: { width: '100%', borderRadius: Radius.lg, backgroundColor: Colors.success[500] + '0A', borderWidth: 1, borderColor: Colors.success[500] + '25', padding: Spacing.md, marginTop: Spacing.md },
  scoreRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  scoreLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500] },
  scoreValue: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.success[400] },
  recognizedLabel: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.neutral[500], textAlign: 'right', marginTop: Spacing.sm },
  recognizedText: { fontSize: 15, color: Colors.neutral[100], textAlign: 'left', marginTop: 3 },
  feedbackText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.success[300], textAlign: 'right', lineHeight: 19, marginTop: Spacing.sm },
  missingWords: { fontSize: 12, color: Colors.warning[300], textAlign: 'left', marginTop: Spacing.sm },
  speechError: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.error[300], textAlign: 'center', lineHeight: 19, marginTop: Spacing.sm },
  shadowTip: { width: '100%', marginTop: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.warning[500] + '0D', padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  shadowText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[400], textAlign: 'right', lineHeight: 19 },
  practiceCard: { width: '100%', minHeight: 230, borderRadius: Radius.xl, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], padding: Spacing.xl, marginTop: Spacing.xl, alignItems: 'center', justifyContent: 'center' },
  practiceFa: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'center', lineHeight: 32 },
  revealButton: { marginTop: Spacing.xl, minHeight: 44, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, backgroundColor: Colors.primary[500] + '18', alignItems: 'center', justifyContent: 'center' },
  revealText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.primary[300] },
  answerBox: { marginTop: Spacing.xl, padding: Spacing.md, borderRadius: Radius.lg, backgroundColor: Colors.success[500] + '10', flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  answerText: { flex: 1, fontSize: 18, color: Colors.success[300], textAlign: 'center' },
  dots: { flexDirection: 'row', gap: 8, marginTop: Spacing.lg },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.neutral[700] },
  dotActive: { width: 24, backgroundColor: Colors.accent[500] },
  dialogue: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  bubble: { maxWidth: '88%', borderRadius: Radius.xl, padding: Spacing.md, borderWidth: 1 },
  bubblePartner: { alignSelf: 'flex-start', backgroundColor: Colors.neutral[850], borderColor: Colors.neutral[700], borderBottomLeftRadius: 5 },
  bubbleLearner: { alignSelf: 'flex-end', backgroundColor: Colors.primary[500] + '18', borderColor: Colors.primary[500] + '40', borderBottomRightRadius: 5 },
  bubbleSpeaker: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.accent[400], marginBottom: 4 },
  bubbleEn: { fontSize: 16, color: Colors.neutral[100], lineHeight: 23 },
  bubbleFa: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', marginTop: 5 },
  bubbleSound: { alignSelf: 'flex-end', marginTop: 6 },
  vocabList: { width: '100%', gap: Spacing.sm, marginTop: Spacing.xl },
  vocabCard: { borderRadius: Radius.lg, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], padding: Spacing.md },
  vocabTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vocabWord: { fontSize: 18, fontWeight: '700', color: Colors.neutral[100] },
  vocabMeaning: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.accent[300] },
  vocabExample: { fontSize: 13, color: Colors.neutral[500], marginTop: 8 },
  footer: { padding: Spacing.md, paddingBottom: 22, backgroundColor: Colors.neutral[900], borderTopWidth: 1, borderTopColor: Colors.neutral[800] },
  nextButton: { minHeight: 52, borderRadius: Radius.lg, backgroundColor: Colors.accent[500], flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  nextText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.onColor },
});
