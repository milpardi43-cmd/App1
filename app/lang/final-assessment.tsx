import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PageNavigation } from '@/components/PageNavigation';
import { EnglishSupplementTask, supplementStyles as s } from '@/components/EnglishSupplementTask';
import {
  assessmentBreakdown,
  assessmentScore,
  canStartAssessment,
  finishAssessment,
  latestAssessment,
  loadSupplement,
  recordAssessmentAnswer,
  startAssessment,
  type AssessmentAttempt,
  type SupplementProgress,
  emptyProgress,
} from '@/lib/englishSupplement/progress';
import { ASSESSMENTS, ASSESSMENT_PASS_PERCENT } from '@/lib/englishSupplement/assessments';
import type { EnglishUnitLevel, Task } from '@/lib/englishSupplement/content';

export default function EnglishFinalAssessmentScreen() {
  const params = useLocalSearchParams<{ level?: string | string[] }>();
  const rawLevel = Array.isArray(params.level) ? params.level[0] : params.level;
  const level: EnglishUnitLevel | undefined = rawLevel === 'Foundation' || rawLevel === 'A1' ? rawLevel : undefined;
  const tasks = level ? ASSESSMENTS[level] : [];
  const [progress, setProgress] = useState<SupplementProgress>(emptyProgress);
  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');

  async function load() {
    setMessage('');
    try {
      const next = await loadSupplement();
      setProgress(next);
      const active = level && [...next.assessmentAttempts].reverse().find(item => item.level === level && !item.completedAt && !item.abandonedAt);
      const latest = level ? latestAssessment(next, level) : undefined;
      const selected = active ?? latest ?? null;
      setAttempt(selected);
      if (active) {
        const firstMissing = tasks.findIndex(task => !active.answers[task.id]);
        setIndex(firstMissing < 0 ? tasks.length : firstMissing);
      } else setIndex(tasks.length);
      setReady(true);
    } catch {
      setMessage('نتایج خوانده نشد؛ برای حفظ اطلاعات آزمون باز نمی‌شود. دوباره تلاش کنید.');
    }
  }
  useEffect(() => { void load(); }, [level]);

  async function begin(restart = false) {
    if (!level) return;
    setBusy(true); setMessage('');
    try {
      const next = await startAssessment(level, restart);
      setAttempt(next); setIndex(tasks.findIndex(task => !next.answers[task.id]) < 0 ? tasks.length : tasks.findIndex(task => !next.answers[task.id]));
      setSaved(false);
    } catch { setMessage('آزمون شروع نشد؛ دوباره تلاش کنید.'); }
    finally { setBusy(false); }
  }

  async function saveAnswer(task: Task, correct: boolean, heard: boolean) {
    if (!attempt) throw Error('تلاش فعال پیدا نشد.');
    const next = await recordAssessmentAnswer(attempt.id, task, correct, heard);
    const updated = next.assessmentAttempts.find(item => item.id === attempt.id);
    if (!updated) throw Error('پاسخ ذخیره نشد.');
    setProgress(next); setAttempt(updated); setSaved(true);
  }

  async function complete() {
    if (!attempt) return;
    setBusy(true); setMessage('');
    try {
      const next = await finishAssessment(attempt.id);
      setProgress(next);
      setAttempt(next.assessmentAttempts.find(item => item.id === attempt.id) ?? null);
      setIndex(tasks.length); setSaved(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'نتیجه ثبت نشد؛ دوباره تلاش کنید.');
    } finally { setBusy(false); }
  }

  const active = !!attempt && !attempt.completedAt && !attempt.abandonedAt;
  const canStart = !!level && (active || canStartAssessment(level, progress));
  const current = active && index < tasks.length ? tasks[index] : undefined;
  const score = attempt?.completedAt ? assessmentScore(attempt) : null;
  const breakdown = score && attempt ? assessmentBreakdown(attempt) : [];
  const answeredCount = attempt ? tasks.filter(task => !!attempt.answers[task.id]).length : 0;
  const nextUnanswered = attempt ? tasks.findIndex(task => !attempt.answers[task.id]) : -1;
  const allAnswered = !!attempt && tasks.every(task => !!attempt.answers[task.id] && (task.skill !== 'listening' || attempt.answers[task.id].heard));

  return <View style={s.page}><ScrollView contentContainerStyle={s.pageContent} showsVerticalScrollIndicator={false}>
    <PageNavigation backFallback="/lang/supplement" />
    {!level && <View style={s.card}><Text style={s.heading}>سنجش پیدا نشد</Text><Text style={s.text}>Foundation یا A1 را از گزارش دوره انتخاب کنید.</Text></View>}
    {level && <>
      <Text style={s.pageTitle}>سنجش پایانی {level}</Text>
      <Text style={s.text}>{level === 'Foundation' ? '۱۲ پرسش تازه از خواندن، شنیدن، دستور و نوشتن پایه.' : '۳۲ پرسش تازه از خواندن، شنیدن، دستور و واژگان و نوشتن هدایت‌شده.'}</Text>
      <Text style={s.text}>این سنجش برای مرور یادگیری است. پاسخ‌ها و تلاش‌ها روی همین دستگاه ذخیره می‌شوند؛ معیار داخلی گذر ۸۰٪ است و به‌هیچ‌وجه گواهی رسمی یا ارزیابی مستقل CEFR نیست. گفتار آزاد و تلفظ در این صفحه نمره‌گذاری نمی‌شوند.</Text>
      {!!message && <Text accessibilityLiveRegion="polite" style={s.error}>{message}</Text>}
      {!ready && !message && <Text style={s.text}>در حال خواندن سابقهٔ دوره…</Text>}
      {ready && !active && !score && <View style={s.card}>
        <Text style={s.heading}>آماده‌اید؟</Text>
        <Text style={s.text}>{canStart ? 'هر سؤال را فقط یک‌بار پاسخ دهید؛ فایل شنیداری هر سؤال باید کامل پخش شود. می‌توانید بین سؤال‌ها خارج شوید و بعداً ادامه دهید.' : level === 'Foundation' ? 'ابتدا چهار واحد Foundation را کامل کنید.' : 'ابتدا Foundation، سنجش پایانی Foundation و هر ۲۰ واحد A1 را کامل کنید.'}</Text>
        <Pressable accessibilityRole="button" disabled={!canStart || busy} style={[s.button, (!canStart || busy) && s.disabled]} onPress={() => void begin()}><Text style={s.buttonText}>{busy ? 'در حال آماده‌سازی…' : 'شروع سنجش'}</Text></Pressable>
      </View>}
      {ready && active && attempt && <View style={s.card}>
        <Text style={s.heading}>تلاش در حال انجام</Text><Text style={s.text}>پاسخ‌های ثبت‌شده: {answeredCount} از {tasks.length}. اگر صفحه بسته شود، از نخستین سؤال بی‌پاسخ ادامه می‌دهید.</Text>
        {!!current && <Text style={s.text}>پرسش {index + 1} از {tasks.length}</Text>}
        {!!current && <EnglishSupplementTask key={`${attempt.id}-${current.id}`} task={current} lockAfterSave deferFeedback onSave={saveAnswer} />}
        {saved && !!current && <Text accessibilityLiveRegion="polite" style={s.success}>پاسخ این سؤال ذخیره شد؛ برای حفظ سنجش مستقل، امکان تغییر آن پس از ثبت وجود ندارد.</Text>}
        {active && saved && nextUnanswered >= 0 && <Pressable accessibilityRole="button" style={s.button} onPress={() => { setIndex(nextUnanswered); setSaved(false); }}><Text style={s.buttonText}>رفتن به سؤال بعد</Text></Pressable>}
        {allAnswered && <><Text style={s.text}>به همهٔ پرسش‌ها پاسخ داده شد. با ثبت نتیجه، خلاصهٔ تلاش ذخیره می‌شود.</Text><Pressable accessibilityRole="button" disabled={busy} style={[s.button, busy && s.disabled]} onPress={() => void complete()}><Text style={s.buttonText}>{busy ? 'در حال ثبت…' : 'ثبت نتیجهٔ پایانی'}</Text></Pressable></>}
      </View>}
      {score && <View style={s.card}>
        <Text style={score.percent >= ASSESSMENT_PASS_PERCENT ? s.success : s.heading}>{score.percent >= ASSESSMENT_PASS_PERCENT ? 'معیار داخلی سنجش گذرانده شد' : 'این تلاش به معیار داخلی نرسید'}</Text>
        <Text style={s.heading}>{score.correct} از {score.total} پاسخ درست · {score.percent}٪</Text>
        {breakdown.map(row => <Text key={row.skill} style={s.text}>{row.label}: {row.correct} از {row.total} · {row.percent}٪</Text>)}
        <Text style={s.text}>{score.percent >= ASSESSMENT_PASS_PERCENT ? 'آفرین؛ می‌توانید گزارش و واحدهای دوره را مرور کنید. این فقط نتیجهٔ آموزشیِ همین سنجش است.' : 'واحدهای مرتبط را مرور کنید و برای تمرین دوباره سنجش را آغاز کنید. تلاش قبلی در سابقه می‌ماند.'}</Text>
        <Pressable accessibilityRole="button" disabled={!canStartAssessment(level, progress) || busy} style={[s.button, (!canStartAssessment(level, progress) || busy) && s.disabled]} onPress={() => void begin(true)}><Text style={s.buttonText}>شروع تلاش تازه</Text></Pressable>
      </View>}
      {ready && !canStart && active && <Text style={s.error}>این تلاش را می‌توانید ادامه دهید، اما شروع آزمون تازه تا تکمیل پیش‌نیازها ممکن نیست.</Text>}
    </>}
  </ScrollView></View>;
}
