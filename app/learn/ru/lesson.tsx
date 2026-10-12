import { Redirect, useLocalSearchParams } from 'expo-router';
import RussianLesson from '@/components/RussianLesson';
import { CoursePage } from '@/components/LanguageCourseUI';
import { findRussianLesson } from '@/lib/languages/russian';
import { FEATURES } from '@/lib/features';

export default function RussianLessonRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  if (!FEATURES.russianCourse) return <Redirect href={'/languages' as never} />;
  const lesson = findRussianLesson(id);
  if (!lesson) return <CoursePage title="درس روسی پیدا نشد" subtitle="از کتابخانه یک درس معتبر انتخاب کنید." back="/learn/ru">{null}</CoursePage>;
  return <RussianLesson key={lesson.id} lesson={lesson} />;
}
