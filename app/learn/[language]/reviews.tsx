import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { GermanCoursePage as CoursePage, GermanCourseButton as CourseButton, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { GERMAN_SENTENCE_LEVELS, GERMAN_SENTENCE_LESSONS } from '@/lib/languages/germanSentenceCourse';
import { germanProgress } from '@/lib/languages/catalog';
import { findGermanLesson } from '@/lib/languages/catalog';
import { toPersianDigits as fa } from '@/lib/format';

export default function GermanReviews() {
  const { language } = useLocalSearchParams<{ language: string }>();
  const router = useRouter();
  const [dueCounts, setDueCounts] = useState<Record<number, number>>({});
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    if (language === 'de') {
      void germanProgress.getDueReviewCards().then(cards => {
        if (!alive) return;
        const counts = Object.fromEntries(GERMAN_SENTENCE_LEVELS.map(level => [
          level.id,
          cards.filter(card => findGermanLesson(card.lessonId)?.levelId === level.id).length,
        ]));
        setDueCounts(counts);
        setError('');
      }).catch(() => { if (alive) setError('مرور بارگذاری نشد. دوباره تلاش کنید.'); });
    }
    return () => { alive = false; };
  }, [language, retry]));

  if (language !== 'de') return <CoursePage title="مرور پیدا نشد">{null}</CoursePage>;
  const totalDue = Object.values(dueCounts).reduce((sum, count) => sum + count, 0);
  return (
    <CoursePage title="مرور امروز" subtitle="جمله‌های آلمانیِ موعدرسیده" back="/learn/de">
      {!!error && <><Text accessibilityRole="alert" style={s.error}>{error}</Text><CourseButton title="تلاش دوباره" onPress={() => setRetry(value => value + 1)} /></>}
      {!error && Object.keys(dueCounts).length === 0 ? <Text style={s.small}>در حال خواندن موعد مرور…</Text> : null}
      <View style={s.card}>
        <Text style={s.heading}>{fa(totalDue)} جمله آماده مرور</Text>
        <Text style={s.description}>جمله‌ها پس از پایان درس وارد مرور فاصله‌دار می‌شوند. معنی را به یاد بیاورید و سپس پاسخ را برگردانید.</Text>
        {totalDue > 0 ? <CourseButton title="شروع مرور جمله‌ها" onPress={() => router.push('/learn/de/review' as never)} /> : <Text style={s.small}>فعلاً جمله‌ای برای مرور ندارید.</Text>}
        <CourseButton title="رفتن به کتابخانهٔ درس‌ها" secondary onPress={() => router.push('/learn/de/library' as never)} />
      </View>
      {GERMAN_SENTENCE_LEVELS.map(level => {
        const lessons = GERMAN_SENTENCE_LESSONS.filter(lesson => lesson.levelId === level.id);
        const count = dueCounts[level.id] ?? 0;
        return (
          <View key={level.id} style={s.card}>
            <Text style={s.heading}>{level.cefr} · {level.title}</Text>
            <Text style={s.small}>{fa(count)} جملهٔ موعدرسیده از {fa(lessons.length)} درس</Text>
          </View>
        );
      })}
    </CoursePage>
  );
}
