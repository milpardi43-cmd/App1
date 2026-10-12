import { Redirect, useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import GermanSentenceHome from '@/components/GermanSentenceHome';
import RussianHome from '@/components/RussianHome';
import { FEATURES } from '@/lib/features';

export default function LearningHomeRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'en') return <Redirect href={'/lang' as never} />;
  if (language === 'de') return <GermanSentenceHome />;
  if (language === 'ru' && !FEATURES.russianCourse) return <Redirect href={'/languages' as never} />;
  if (language === 'ru') return <RussianHome />;
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
