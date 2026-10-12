import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Speech from 'expo-speech';
import { isCorrect, SKILLS, type Task } from '@/lib/englishSupplement/content';
import { Typography } from '@/lib/theme';
import { recordEvidence, type SupplementProgress } from '@/lib/englishSupplement/progress';

export const EnglishPalette = {
  canvas: '#F4F6FC',
  surface: '#FFFFFF',
  surfaceMuted: '#F8F9FE',
  ink: '#151A33',
  text: '#48536D',
  muted: '#77819A',
  border: '#E3E7F1',
  primary: '#5146E5',
  primaryDark: '#302B7B',
  primarySoft: '#EEF0FF',
  teal: '#0E9185',
  tealSoft: '#E9FAF6',
  success: '#168451',
  successSoft: '#ECF9F2',
  warning: '#A65C14',
  warningSoft: '#FFF6E8',
  danger: '#B4233B',
  dangerSoft: '#FFF0F2',
};

export const supplementStyles = StyleSheet.create({
  page: { flex: 1, backgroundColor: EnglishPalette.canvas },
  pageContent: { width: '100%', maxWidth: 820, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 18, paddingBottom: 48, gap: 16 },
  pageTitle: { fontFamily: Typography.fontFamily, color: EnglishPalette.ink, fontSize: 28, lineHeight: 39, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  sectionTitle: { fontFamily: Typography.fontFamily, color: EnglishPalette.ink, fontSize: 21, lineHeight: 31, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  levelHeader: { backgroundColor: EnglishPalette.surface, borderColor: EnglishPalette.border, borderWidth: 1, borderRadius: 22, padding: 18, gap: 12, shadowColor: '#20264A', shadowOpacity: 0.045, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  levelMeta: { fontFamily: Typography.fontFamily, color: EnglishPalette.muted, fontSize: 12, textAlign: 'right', writingDirection: 'rtl' },
  unitCard: { marginVertical: 0, padding: 16 },
  backButton: { alignSelf: 'flex-start', minHeight: 42, paddingHorizontal: 16, borderRadius: 999, backgroundColor: EnglishPalette.surface, borderColor: EnglishPalette.border },
  card: {
    backgroundColor: EnglishPalette.surface,
    borderColor: EnglishPalette.border,
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
    gap: 13,
    marginVertical: 4,
    width: '100%',
    shadowColor: '#20264A', shadowOpacity: 0.035, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1,
  },
  text: { fontFamily: Typography.fontFamily, color: EnglishPalette.text, fontSize: 15, lineHeight: 25, textAlign: 'right', writingDirection: 'rtl' },
  heading: { fontFamily: Typography.fontFamily, color: EnglishPalette.ink, fontSize: 19, lineHeight: 28, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  eyebrow: { fontFamily: Typography.fontFamily, color: EnglishPalette.primary, fontSize: 12, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  sentenceCard: { backgroundColor: EnglishPalette.surfaceMuted, borderColor: EnglishPalette.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 13, paddingVertical: 12, gap: 7 },
  sentenceEnglishRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  sentenceSoundButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: EnglishPalette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  sentenceEnglish: { flex: 1, fontFamily: Typography.fontFamily, color: EnglishPalette.ink, fontSize: 16, lineHeight: 25, textAlign: 'right', writingDirection: 'ltr' },
  sentencePersian: { fontFamily: Typography.fontFamily, color: EnglishPalette.text, fontSize: 14, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' },
  sentencePattern: { fontFamily: Typography.fontFamily, color: EnglishPalette.primaryDark, fontSize: 12, lineHeight: 19, textAlign: 'right', writingDirection: 'ltr' },
  english: { fontFamily: Typography.fontFamily, color: EnglishPalette.ink, fontSize: 16, lineHeight: 27, textAlign: 'right', writingDirection: 'ltr' },
  input: {
    fontFamily: Typography.fontFamily,
    color: EnglishPalette.ink,
    backgroundColor: EnglishPalette.surfaceMuted,
    borderColor: EnglishPalette.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    minHeight: 48,
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'ltr',
  },
  button: { backgroundColor: EnglishPalette.primary, borderRadius: 13, padding: 13, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 15, fontWeight: '700', textAlign: 'center', writingDirection: 'rtl' },
  secondaryButton: { backgroundColor: EnglishPalette.surface, borderColor: EnglishPalette.border, borderWidth: 1, borderRadius: 13, padding: 12, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontFamily: Typography.fontFamily, color: EnglishPalette.ink, fontSize: 14, fontWeight: '700', textAlign: 'center', writingDirection: 'rtl' },
  disabled: { opacity: 0.48 },
  error: { fontFamily: Typography.fontFamily, color: EnglishPalette.danger, backgroundColor: EnglishPalette.dangerSoft, borderRadius: 12, padding: 12, fontSize: 14, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  success: { fontFamily: Typography.fontFamily, color: EnglishPalette.success, backgroundColor: EnglishPalette.successSoft, borderRadius: 12, padding: 12, fontSize: 14, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  tabRow: { flexDirection: 'row-reverse', gap: 7, backgroundColor: '#E9EEF5', borderRadius: 15, padding: 5 },
  tab: { flex: 1, minHeight: 44, borderRadius: 11, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: EnglishPalette.surface },
  tabText: { fontFamily: Typography.fontFamily, color: EnglishPalette.muted, fontSize: 12, fontWeight: '600', textAlign: 'center', writingDirection: 'rtl' },
  tabTextActive: { color: EnglishPalette.primaryDark, fontWeight: '800' },
  chip: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: EnglishPalette.primarySoft, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontFamily: Typography.fontFamily, color: EnglishPalette.primaryDark, fontSize: 11, fontWeight: '700', textAlign: 'center', writingDirection: 'rtl' },
  progressTrack: { height: 8, width: '100%', borderRadius: 999, backgroundColor: '#E8EDF5', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: EnglishPalette.primary, alignSelf: 'flex-end' },
});
const s = supplementStyles;

export function EnglishSupplementTask({
  task,
  onResult,
  onSave,
  lockAfterSave = false,
  deferFeedback = false,
}: {
  task: Task;
  onResult?: (progress: SupplementProgress, correct: boolean) => void;
  onSave?: (task: Task, correct: boolean, heard: boolean) => Promise<unknown>;
  lockAfterSave?: boolean;
  deferFeedback?: boolean;
}) {
  const [answer, setAnswer] = useState('');
  const [heard, setHeard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);

  useEffect(() => () => {
    run.current++;
    if (timer.current) clearTimeout(timer.current);
    void Speech.stop();
  }, []);

  async function listen() {
    const token = ++run.current;
    setError('');
    setPlaying(true);
    setHeard(false);
    const finish = (ok: boolean) => {
      if (token !== run.current) return;
      if (timer.current) clearTimeout(timer.current);
      setPlaying(false);
      setHeard(ok);
      if (!ok) setError('صدا کامل پخش نشد. صدای دستگاه و صدای انگلیسی را بررسی و دوباره تلاش کنید.');
    };
    try {
      await Speech.stop();
      if (token !== run.current) return;
      timer.current = setTimeout(() => { finish(false); run.current++; void Speech.stop(); }, 60000);
      Speech.speak(task.audio!, { language: 'en-US', rate: 0.78, onDone: () => finish(true), onError: () => finish(false), onStopped: () => finish(false) });
    } catch { finish(false); }
  }

  async function submit() {
    if (saving.current || !answer.trim() || (task.audio && !heard)) return;
    saving.current = true;
    setBusy(true);
    setError('');
    try {
      const correct = isCorrect(task, answer);
      if (onSave) await onSave(task, correct, heard);
      else {
        const progress = await recordEvidence(task, correct, heard);
        onResult?.(progress, correct);
      }
      setResult(correct);
    } catch {
      setError('پاسخ ذخیره نشد؛ اطلاعات قبلی حفظ شده است. دوباره تلاش کنید.');
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  const locked = busy || (lockAfterSave && result !== null);
  return <View style={s.card}>
    <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <Text style={s.eyebrow}>{SKILLS[task.skill]}</Text>
      {task.audio ? <View style={s.chip}><Text style={s.chipText}>استماع</Text></View> : null}
    </View>
    {task.source ? <View style={{ backgroundColor: EnglishPalette.surfaceMuted, borderRadius: 12, padding: 12 }}><Text style={s.english}>{task.source}</Text></View> : null}
    <Text style={s.heading}>{task.prompt}</Text>
    {task.audio ? <Pressable accessibilityRole="button" accessibilityLabel={playing ? 'در حال پخش فایل شنیداری' : heard ? 'پخش دوبارهٔ فایل شنیداری' : 'شنیدن فایل شنیداری سؤال'} accessibilityState={{ disabled: playing || busy }} disabled={playing || busy} style={[s.secondaryButton, (playing || busy) && s.disabled]} onPress={() => void listen()}><Text style={s.secondaryButtonText}>{playing ? 'در حال پخش…' : heard ? 'پخش دوباره' : 'شنیدن سؤال'}</Text></Pressable> : null}
    {task.options
      ? task.options.map(option => <Pressable key={option} accessibilityRole="radio" accessibilityState={{ checked: answer === option, disabled: locked }} disabled={locked} style={[s.input, { minHeight: 48, justifyContent: 'center', backgroundColor: answer === option ? EnglishPalette.primarySoft : EnglishPalette.surfaceMuted, borderColor: answer === option ? EnglishPalette.primary : EnglishPalette.border }]} onPress={() => { setAnswer(option); setResult(null); }}><Text style={s.english}>{option}</Text></Pressable>)
      : <TextInput accessibilityLabel={task.prompt} editable={!locked} style={s.input} value={answer} onChangeText={value => { setAnswer(value); setResult(null); }} placeholder="پاسخ خود را بنویسید" placeholderTextColor={EnglishPalette.muted} autoCapitalize="none" autoCorrect={false} maxLength={500} />}
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: locked || !answer.trim() || (!!task.audio && !heard) }} disabled={locked || !answer.trim() || (!!task.audio && !heard)} style={[s.button, (locked || !answer.trim() || (!!task.audio && !heard)) && s.disabled]} onPress={() => void submit()}><Text style={s.buttonText}>{busy ? 'در حال ذخیره…' : 'بررسی پاسخ'}</Text></Pressable>
    {result !== null && !deferFeedback ? <Text accessibilityLiveRegion="polite" style={result ? s.success : s.error}>{result ? 'پاسخ درست ثبت شد.' : `هنوز درست نیست. ${task.explanation} دوباره پاسخ دهید.`}</Text> : null}
    {error ? <Text accessibilityLiveRegion="polite" style={s.error}>{error}</Text> : null}
  </View>;
}
