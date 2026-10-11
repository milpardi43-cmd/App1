import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';

export default function CourseCompletionRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  return language === 'de'
    ? <Redirect href={'/learn/de/library' as never} />
    : <CoursePage title="گزارش تکمیل پیدا نشد">{null}</CoursePage>;
}
