import { useLocalSearchParams } from 'expo-router';
import { CoursePage } from '@/components/LanguageCourseUI';
import GermanCourseLibrary from '@/components/GermanCourseLibrary';
import RussianLibrary from '@/components/RussianLibrary';

export default function LanguageLibraryRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language === 'de') return <GermanCourseLibrary />;
  if (language === 'ru') return <RussianLibrary />;
  return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
}
