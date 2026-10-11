import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';

export default function GermanRecapRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  return language === 'de'
    ? <Redirect href={'/learn/de/library' as never} />
    : <CoursePage title="جمع‌بندی پیدا نشد">{null}</CoursePage>;
}
