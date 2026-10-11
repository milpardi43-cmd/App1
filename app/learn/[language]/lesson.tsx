import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { CoursePage } from '@/components/LanguageCourseUI';
import { GermanCoursePage, GermanCourseButton, germanCourseStyles } from '@/components/GermanCourseUI';
import { findGermanLesson, germanProgress, findLanguage } from '@/lib/languages/catalog';
import { findRussianLesson, type RussianCourseLesson } from '@/lib/languages/russian';
import RussianLesson from '@/components/RussianLesson';
import { GERMAN_SENTENCE_LESSONS } from '@/lib/languages/germanSentenceCourse';
import { GermanSentenceBuilder } from '@/components/GermanSentenceBuilder';
import { clearGermanSentenceSession, loadGermanSentenceSession, saveGermanSentenceSession } from '@/lib/languages/germanSentenceSession';
import type { GermanSentenceStage } from '@/lib/languages/germanSentenceSession';
import type { LearningLesson } from '@/lib/languages/types';
import { toPersianDigits as fa } from '@/lib/format';

const stages = ['موقعیت', 'جمله‌ها', 'شنیدن', 'جمله‌سازی', 'مکالمه', 'لغات'];
const PAGE_SIZE = 5;

export default function LanguageLessonRoute() {
  const { language, id } = useLocalSearchParams<{ language: string; id: string }>();
  const lesson = language === 'de' ? findGermanLesson(id) : language === 'ru' ? findRussianLesson(id) : undefined;
  if (!lesson) return <CoursePage title="درس پیدا نشد" subtitle="از صفحه انتخاب زبان، یک درس معتبر باز کنید.">{null}</CoursePage>;
  return language === 'ru' ? <RussianLesson key={lesson.id} lesson={lesson as RussianCourseLesson} /> : <GermanLesson key={lesson.id} lesson={lesson} />;
}

function GermanLesson({ lesson }: { lesson: LearningLesson }) {
  const s = germanCourseStyles;
  const router = useRouter();
  const [stage, setStage] = useState(0);
  // Sentence index in the sentence and build stages; page index in listening and vocabulary.
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sessionState, setSessionState] = useState<'loading' | 'ready' | 'unavailable' | 'unsaved'>('loading');
  const [sessionRestoreError, setSessionRestoreError] = useState('');
  const [sessionSaveState, setSessionSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [sessionSaveError, setSessionSaveError] = useState('');
  const [resumed, setResumed] = useState(false);
  const [restoreRetry, setRestoreRetry] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const current = lesson.sentences[index];
  const pageCount = Math.ceil(lesson.sentences.length / PAGE_SIZE);
  const pageStart = index * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, lesson.sentences.length);
  const pageSentences = lesson.sentences.slice(pageStart, pageEnd);
  const pagedStage = lesson.sentences.length > PAGE_SIZE && (stage === 2 || stage === 5);
  const sentenceStage = stage === 1 || stage === 3;

  useEffect(() => {
    let active = true;
    setSessionState('loading');
    setSessionRestoreError('');
    void loadGermanSentenceSession(lesson.id).then(saved => {
      if (!active) return;
      if (saved) {
        setStage(saved.stage);
        setIndex(saved.index);
        setResumed(true);
      } else {
        setStage(0);
        setIndex(0);
        setResumed(false);
      }
      setSessionSaveState('idle');
      setSessionSaveError('');
      setSessionState('ready');
    }).catch(() => {
      if (!active) return;
      setSessionRestoreError('جلسهٔ قبلی بازیابی نشد. پیش‌نویس موجود را خودکار پاک یا بازنویسی نمی‌کنیم. می‌توانید دوباره تلاش کنید یا این درس را بدون بازیابی ادامه دهید.');
      setSessionState('unavailable');
    });
    return () => { active = false; };
  }, [lesson.id, restoreRetry]);

  useEffect(() => {
    if (sessionState !== 'ready' || finishing) return;
    let active = true;
    setSessionSaveState('saving');
    void saveGermanSentenceSession({
      schemaVersion: 1,
      lessonId: lesson.id,
      stage: stage as GermanSentenceStage,
      index,
      updatedAt: new Date().toISOString(),
    }).then(() => {
      if (!active) return;
      setSessionSaveState('saved');
      setSessionSaveError('');
    }).catch(() => {
      if (!active) return;
      setSessionSaveState('error');
      setSessionSaveError('محل درس ذخیره نشد؛ اگر از صفحه خارج شوید، ممکن است مجبور شوید از بخش قبلی ادامه دهید.');
    });
    return () => { active = false; };
  }, [sessionState, lesson.id, stage, index, finishing]);

  useEffect(() => () => { void Speech.stop(); }, []);
  const speak = (text: string) => {
    setError('');
    void Speech.stop();
    Speech.speak(text, {
      language: findLanguage('de')!.speechLocale,
      rate: .78,
      onError: () => setError('پخش انجام نشد. صدای آلمانی دستگاه یا مرورگر را بررسی کنید؛ متن درس همچنان در دسترس است.'),
    });
  };
  const previousPage = () => {
    void Speech.stop();
    setIndex(value => Math.max(0, value - 1));
  };
  const continueWithoutRestore = () => {
    setStage(0);
    setIndex(0);
    setResumed(false);
    setSessionState('unsaved');
    setSessionSaveState('error');
  };
  const restartFromBeginning = () => {
    setStage(0);
    setIndex(0);
    setResumed(false);
    setError('');
  };
  const next = async () => {
    if (busy) return;
    void Speech.stop();
    setError('');
    if (sentenceStage && index < lesson.sentences.length - 1) {
      setIndex(value => value + 1);
      return;
    }
    if (pagedStage && index < pageCount - 1) {
      setIndex(value => value + 1);
      return;
    }
    if (stage < 5) {
      setStage(value => value + 1);
      setIndex(0);
      return;
    }
    setBusy(true);
    setFinishing(true);
    try {
      const nextLesson = GERMAN_SENTENCE_LESSONS[GERMAN_SENTENCE_LESSONS.findIndex(item => item.id === lesson.id) + 1];
      await germanProgress.completeSentenceLesson(lesson.id, nextLesson?.id);
      try {
        await clearGermanSentenceSession(lesson.id);
      } catch {
        setSessionSaveState('error');
        setSessionSaveError('پیشرفت درس ثبت شد، اما پیش‌نویس جلسه پاک نشد.');
      }
      router.replace('/learn/de' as never);
    } catch {
      setError('پیشرفت ذخیره نشد. فضای ذخیره‌سازی دستگاه را بررسی و دوباره تلاش کنید.');
      setFinishing(false);
    } finally {
      setBusy(false);
    }
  };
  const nextTitle = busy
    ? 'در حال ذخیره…'
    : pagedStage && index < pageCount - 1
      ? 'صفحه بعدی'
      : stage === 5
        ? 'پایان درس و ذخیره پیشرفت'
        : sentenceStage && index < lesson.sentences.length - 1
          ? 'جمله بعدی'
          : 'ادامه';
  const nextButton = <GermanCourseButton title={nextTitle} disabled={busy || sessionState === 'loading' || sessionState === 'unavailable'} onPress={() => void next()} />;
  const footer = pagedStage ? (
    <View style={s.row}>
      {index > 0 && <GermanCourseButton title="صفحه قبل" secondary onPress={previousPage} />}
      {nextButton}
    </View>
  ) : nextButton;

  return (
    <GermanCoursePage
      title={lesson.title}
      subtitle={`آلمانی · ${stages[stage]} · مرحله ${fa(stage + 1)} از ۶`}
      back="/learn/de"
      progress={(stage + 1) / 6}
      scrollResetKey={lesson.sentences.length > PAGE_SIZE ? `${stage}-${index}` : undefined}
      footer={footer}
    >
      {sessionState === 'loading' ? (
        <View style={s.card}><Text style={s.description}>در حال بازیابی محل توقف درس…</Text></View>
      ) : null}
      {sessionState === 'unavailable' ? (
        <View style={s.card}>
          <Text accessibilityRole="alert" style={s.error}>{sessionRestoreError}</Text>
          <GermanCourseButton title="تلاش دوباره برای بازیابی" secondary onPress={() => setRestoreRetry(value => value + 1)} />
          <GermanCourseButton title="شروع از ابتدا بدون بازنویسی پیش‌نویس قبلی" onPress={continueWithoutRestore} />
        </View>
      ) : null}
      {(sessionState === 'ready' || sessionState === 'unsaved') && <>
        {resumed ? (
          <View style={s.card}>
            <Text style={s.pill}>جلسهٔ ذخیره‌شده بازیابی شد</Text>
            <Text style={s.small}>از «{stages[stage]}»، مرحلهٔ {fa(stage + 1)} و بخش ذخیره‌شده ادامه می‌دهید.</Text>
            <GermanCourseButton title="شروع این درس از ابتدا" secondary onPress={restartFromBeginning} />
          </View>
        ) : null}
        {sessionState === 'ready' && sessionSaveState !== 'idle' ? (
          <Text accessibilityLiveRegion="polite" style={sessionSaveState === 'error' ? s.error : s.small}>
            {sessionSaveState === 'saving' ? 'در حال ذخیرهٔ محل توقف…' : sessionSaveState === 'saved' ? 'محل توقف درس روی همین دستگاه ذخیره شد.' : sessionSaveError}
          </Text>
        ) : null}
        {sessionState === 'unsaved' ? <Text style={s.notice}>درس را می‌توانید ادامه دهید، اما محل توقف این جلسه ذخیره نمی‌شود. پیشرفت پایان درس همچنان جداگانه ثبت خواهد شد.</Text> : null}
      {stage === 0 && <View style={s.card}>
        <Text style={s.heading}>در این موقعیت چه می‌گوییم؟</Text>
        <Text style={s.description}>{lesson.situation}</Text>
        <Text style={s.small}>{fa(lesson.sentences.length)} جمله کوتاه؛ تلفظ نوشتاری فارسی تقریبی است و جای صدای آلمانی را نمی‌گیرد.</Text>
        {lesson.teachingFa && <><Text style={s.heading}>نکته کوتاه به فارسی</Text><Text style={s.description}>{lesson.teachingFa}</Text></>}
      </View>}
      {stage === 1 && <View style={s.card}>
        <Text style={s.small}>جمله {fa(index + 1)} از {fa(lesson.sentences.length)}</Text>
        <Text style={s.target}>{current.text}</Text>
        <Text style={s.pronunciation}>{current.pronunciation}</Text>
        <View style={s.divider} />
        <Text style={s.description}>{current.fa}</Text>
        {current.pattern && <Text style={s.notice}>الگوی جمله: {current.pattern}</Text>}
        <GermanCourseButton title="🔊 شنیدن جمله به آلمانی" onPress={() => speak(current.text)} />
      </View>}
      {stage === 2 && <>
        <Text style={s.description}>گوش بدهید و با صدای خودتان تکرار کنید. ضبط و سرویس هوش مصنوعی لازم نیست.</Text>
        {pagedStage && <Text style={s.small}>صفحه {fa(index + 1)} از {fa(pageCount)} · جمله‌های {fa(pageStart + 1)} تا {fa(pageEnd)} از {fa(lesson.sentences.length)}</Text>}
        {pageSentences.map((item, pageItemIndex) => <View key={item.id} style={s.card}>
          {pagedStage && <Text style={s.small}>جمله {fa(pageStart + pageItemIndex + 1)}</Text>}
          <Text style={s.target}>{item.text}</Text>
          <GermanCourseButton title="🔊 گوش بده" secondary onPress={() => speak(item.text)} />
        </View>)}
      </>}
      {stage === 3 && <>
        <Text style={s.small}>جمله {fa(index + 1)} از {fa(lesson.sentences.length)} را با واژه‌های همین درس بسازید.</Text>
        <GermanSentenceBuilder sentence={current} />
      </>}
      {stage === 4 && lesson.dialogue.map((item, itemIndex) => <View key={itemIndex} style={s.card}>
        <Text style={s.pill}>{item.speaker}</Text>
        <Text style={s.target}>{item.text}</Text>
        <Text style={s.description}>{item.fa}</Text>
        <GermanCourseButton title="شنیدن این بخش گفتگو" secondary onPress={() => speak(item.text)} />
      </View>)}
      {stage === 5 && <>
        <Text style={s.description}>{pagedStage ? 'واژه‌ها را همراه جمله‌های همین صفحه یاد بگیرید؛ حرف تعریف اسم‌ها نیز نمایش داده شده است.' : 'واژه‌ها را همراه همین جمله‌ها یاد بگیرید؛ حرف تعریف اسم‌ها نیز نمایش داده شده است.'}</Text>
        {pagedStage && <Text style={s.small}>صفحه {fa(index + 1)} از {fa(pageCount)} · جمله‌های {fa(pageStart + 1)} تا {fa(pageEnd)} از {fa(lesson.sentences.length)}</Text>}
        {pageSentences.map(item => <View key={item.id} style={s.card}>
          {item.vocabulary.map((word, wordIndex) => <View key={`${word.word}-${wordIndex}`} style={s.row}>
            <Text style={s.word}>{word.word}</Text>
            <Text style={s.description}>{word.meaning}</Text>
          </View>)}
          <Text style={[s.target, { fontSize: 18 }]}>{item.text}</Text>
          <Text style={s.description}>{item.fa}</Text>
          <GermanCourseButton title="شنیدن مثال" secondary onPress={() => speak(item.text)} />
        </View>)}
      </>}
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      </>}
    </GermanCoursePage>
  );
}
