import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';

export default function GermanDetailsRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  return language === 'de'
    ? <Redirect href={'/learn/de/library' as never} />
    : <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
