import type { LanguageDefinition } from './types';
import { SENTENCE_LESSONS } from '../courseContent';
import { GERMAN_SENTENCE_LESSONS } from './germanSentenceCourse';
import { RUSSIAN_LESSONS, russianProgress } from './russian';
import { createCourseProgressStore } from '../createCourseProgressStore';

export const LANGUAGES: readonly LanguageDefinition[] = [
  { id: 'en', name: 'انگلیسی', nativeName: 'English', speechLocale: 'en-US', accent: '#6356d9', lessonsCount: SENTENCE_LESSONS.length, description: 'جمله‌های کاربردی، مرور و مجموعه ۵۰۴' , status: 'available', home: '/lang' },
  { id: 'de', name: 'آلمانی', nativeName: 'Deutsch', speechLocale: 'de-DE', accent: '#087e75', lessonsCount: GERMAN_SENTENCE_LESSONS.length, description: 'آموزش جمله‌محور، جمله‌سازی و واژگان در چهار مرحله آموزشی', status: 'available', home: '/learn/de' },
  { id: 'ru', name: 'روسی', nativeName: 'Русский', speechLocale: 'ru-RU', accent: '#4267a8', lessonsCount: RUSSIAN_LESSONS.length, description: 'مسیر آغازین مستقل با خط سیریلیک، جمله‌های کاربردی و مرور محلی', status: 'starter', home: '/learn/ru' },
];
export { russianProgress };
export function findLanguage(id: string | undefined) { return LANGUAGES.find(l => l.id === id); }
export const germanProgress = createCourseProgressStore({
  key: 'sentence_course_progress_de_v2',
  lessons: GERMAN_SENTENCE_LESSONS,
  cloudSync: false,
  recordEstimatedTime: false,
});
export function findGermanLesson(id: string | undefined) { return GERMAN_SENTENCE_LESSONS.find(l => l.id === id); }
