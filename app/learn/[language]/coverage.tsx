import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';

export default function GermanCoverageRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  return language === 'de'
    ? <Redirect href={'/learn/de/library' as never} />
    : <CoursePage title="نقشه پوشش پیدا نشد">{null}</CoursePage>;
}
