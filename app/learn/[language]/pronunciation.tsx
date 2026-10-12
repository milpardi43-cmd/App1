import { Redirect, useLocalSearchParams } from 'expo-router';
import { PronunciationCourse } from '@/components/PronunciationCourse';
import { isPronunciationLanguage } from '@/lib/languages/pronunciationCourse';

export default function PronunciationRoute() {
  const { language } = useLocalSearchParams<{ language?: string }>();
  if (!isPronunciationLanguage(language)) return <Redirect href={'/languages' as never} />;
  return <PronunciationCourse language={language} />;
}
