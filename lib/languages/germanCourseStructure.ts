import type { GuidedLesson, LearningUnit } from './learningDesign';
import { GERMAN_UNITS } from './germanUnits';
import { GERMAN_ROADMAP } from './germanRoadmap';

/** Internal course bands mirror the English level-card contract without claiming official CEFR certification. */
export type GermanCourseLevelId = 0 | 1 | 2 | 3;
export type GermanCurriculumLevel = 'Pre-A1' | 'A1' | 'A2' | 'B1';
export type GermanLevelStatus = 'available' | 'starter' | 'planned';

export interface GermanCourseLevel {
  id: GermanCourseLevelId;
  title: string;
  cefr: string;
  description: string;
  color: string;
  modules: readonly string[];
  curriculumLevel: GermanCurriculumLevel;
  status: GermanLevelStatus;
  /** Existing Persian roadmap labels and descriptions stay available to current screens. */
  level: string;
  outcome: string;
  units: readonly string[];
}

export const GERMAN_COURSE_LEVELS = [
  {
    ...GERMAN_ROADMAP[0],
    id: 0,
    title: 'Foundation German',
    cefr: 'Pre-A1',
    description: 'از حروف و صداها شروع می‌کند و به جمله‌های کوتاه برای معرفی، نام، عدد و پرسش‌های پایه می‌رسد.',
    color: '#6555E9',
    modules: GERMAN_ROADMAP[0].units,
    curriculumLevel: 'Pre-A1',
    status: 'available',
  },
  {
    ...GERMAN_ROADMAP[1],
    id: 1,
    title: 'Survival German',
    cefr: 'A1',
    description: GERMAN_ROADMAP[1].outcome,
    color: '#27A1D6',
    modules: GERMAN_ROADMAP[1].units,
    curriculumLevel: 'A1',
    status: 'available',
  },
  {
    ...GERMAN_ROADMAP[2],
    id: 2,
    title: 'Everyday German',
    cefr: 'A2',
    description: GERMAN_ROADMAP[2].outcome,
    color: '#19A88B',
    modules: GERMAN_ROADMAP[2].units,
    curriculumLevel: 'A2',
    status: 'starter',
  },
  {
    ...GERMAN_ROADMAP[3],
    id: 3,
    title: 'Communication German',
    cefr: 'B1',
    description: GERMAN_ROADMAP[3].outcome,
    color: '#E4A436',
    modules: GERMAN_ROADMAP[3].units,
    curriculumLevel: 'B1',
    status: 'planned',
  },
] as const satisfies readonly GermanCourseLevel[];

/** A progression-ordered view; the legacy registry order remains unchanged for saved history and IDs. */
export const GERMAN_COURSE_UNITS: readonly LearningUnit[] = GERMAN_COURSE_LEVELS.flatMap(level =>
  GERMAN_UNITS.filter(unit => unit.level === level.curriculumLevel),
);

export interface GermanCourseSentenceExample {
  id: string;
  text: string;
  fa: string;
}

/** Sentence-first index parallel to English's levelId/order lesson catalogue; source lesson content is referenced, not rewritten. */
export interface GermanCourseLesson {
  id: string;
  levelId: GermanCourseLevelId;
  order: number;
  unitId: string;
  unitTitle: string;
  title: string;
  subtitle: string;
  situation: string;
  sentences: GermanCourseSentenceExample[];
  dialogue: GuidedLesson['dialogue'];
  pattern: string;
  pronunciation: string;
  source: GuidedLesson;
}

export const GERMAN_COURSE_LESSONS: GermanCourseLesson[] = GERMAN_COURSE_LEVELS.flatMap(level => {
  let order = 0;
  return GERMAN_COURSE_UNITS
    .filter(unit => unit.level === level.curriculumLevel)
    .flatMap(unit => unit.lessons.map(lesson => {
      order += 1;
      return {
        id: lesson.id,
        levelId: level.id,
        order,
        unitId: unit.id,
        unitTitle: unit.title,
        title: lesson.title,
        subtitle: lesson.canDoFa,
        situation: lesson.situationFa,
        sentences: lesson.examples.map((example, index) => ({
          id: `${lesson.id}-example-${index + 1}`,
          text: example.text,
          fa: example.fa,
        })),
        dialogue: lesson.dialogue,
        pattern: lesson.patternFa,
        pronunciation: lesson.pronunciationFa,
        source: lesson,
      };
    }));
});

export function getGermanCourseLevel(levelId: GermanCourseLevelId) {
  return GERMAN_COURSE_LEVELS.find(level => level.id === levelId);
}

export function getGermanCourseUnits(levelId: GermanCourseLevelId) {
  const level = getGermanCourseLevel(levelId);
  return level ? GERMAN_COURSE_UNITS.filter(unit => unit.level === level.curriculumLevel) : [];
}

export function getGermanCourseMetrics(levelId: GermanCourseLevelId) {
  const units = getGermanCourseUnits(levelId);
  const lessons = GERMAN_COURSE_LESSONS.filter(lesson => lesson.levelId === levelId);
  return {
    unitCount: units.length,
    lessonCount: lessons.length,
    sentenceExampleCount: lessons.reduce((count, lesson) => count + lesson.sentences.length, 0),
  };
}
