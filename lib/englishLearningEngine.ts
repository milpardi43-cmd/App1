import {
  COMMUNICATION_MODULES,
  COURSE_LEVELS,
  SENTENCE_LESSONS,
  type CourseLevelId,
  type CourseSentence,
  type SentenceLesson,
} from './courseContent';

/** Structural roadmap requested for the English engine; lesson copy stays in courseContent. */
export const ENGLISH_ENGINE_BLUEPRINT = [
  {
    levelId: 0,
    title: 'Foundation',
    band: 'Level 0',
    modules: ['Introducing Yourself & Sounds', 'Asking for Help', 'Shopping & Prices', 'Alphabet & Spelling', 'Pronouns & Be', 'Numbers & Contact Details', 'Family & Possessions', 'Time & Calendar', 'Everyday Routines', 'Objects & Places'],
  },
  {
    levelId: 1,
    title: 'Survival English',
    band: 'Level 1 · A1',
    modules: ['Core Daily Situations', 'Useful Sentence Patterns', 'Basic Vocabulary', 'Basic Grammar Through Sentences', 'Listening Practice', 'Speaking Practice', 'Daily Conversations']
  },
  {
    levelId: 2,
    title: 'Everyday English',
    band: 'Level 2 · A2–B1',
    modules: ['Real-Life Situations', '1000+ Sentence Patterns', 'Vocabulary Expansion', 'Grammar in Context', 'Dialogues', 'Reading', 'Writing Basics', 'Conversation Practice'],
  },
  {
    levelId: 3,
    title: 'Communication English',
    band: 'Level 3 · B1–B2',
    modules: COMMUNICATION_MODULES.map(unit => unit.titleEn),
  },
  {
    levelId: 4,
    title: 'Advanced English',
    band: 'Level 4 · برچسب داخلی',
    modules: ['Work & Decisions', 'Media & Society', 'Science & Environment', 'Travel & Public Safety', 'Personal Growth & Relationships', 'Vocabulary Practice Sets'],
  },
] as const satisfies ReadonlyArray<{
  levelId: CourseLevelId;
  title: string;
  band: string;
  modules: readonly string[];
}>;

/** One calm, sequential route through a lesson. It does not duplicate lesson text. */
export const ENGLISH_ENGINE_STEPS = [
  { id: 'situation', labelFa: 'موقعیت', labelEn: 'Situation' },
  { id: 'core-sentences', labelFa: 'جمله‌های اصلی', labelEn: 'Core Sentences' },
  { id: 'listening', labelFa: 'شنیدن', labelEn: 'Listening' },
  { id: 'shadowing', labelFa: 'سایه‌خوانی', labelEn: 'Shadowing' },
  { id: 'sentence-building', labelFa: 'ساخت جمله', labelEn: 'Sentence Building' },
  { id: 'vocabulary', labelFa: 'واژگان از جمله', labelEn: 'Vocabulary From Sentences' },
  { id: 'grammar-through-usage', labelFa: 'دستور در کاربرد', labelEn: 'Grammar Through Usage' },
  { id: 'conversation', labelFa: 'مکالمه', labelEn: 'Conversation Practice' },
  { id: 'review', labelFa: 'مرور هوشمند', labelEn: 'Spaced Review' },
] as const;

/** Existing data sources behind the requested relational learning model. */
export const ENGLISH_CORE_DATABASE_FLOW = [
  { entity: 'Situations', source: 'SentenceLesson.situation' },
  { entity: 'Sentence Patterns', source: 'CourseSentence.pattern' },
  { entity: 'Vocabulary', source: 'CourseSentence.vocabulary, attached to its sentence' },
  { entity: 'Grammar Through Usage', source: 'Existing sentence patterns and examples; no rules are generated' },
  { entity: 'Dialogues', source: 'SentenceLesson.dialogue' },
  { entity: 'Exercises', source: 'Checks derived from sentences in EnglishLessonEvidence' },
  { entity: 'User Progress', source: 'courseProgress.ts and englishStudyState.ts' },
  { entity: 'Spaced Repetition', source: 'CourseProgress.reviewCards' },
] as const;

export interface EnglishLevelMetrics {
  levelId: CourseLevelId;
  lessonCount: number;
  completedLessonCount: number;
  sentenceCount: number;
  patternCount: number;
  vocabularyCount: number;
}

export function getEnglishLevelMetrics(levelId: CourseLevelId, completedLessonIds: readonly string[] = []): EnglishLevelMetrics {
  const lessons = SENTENCE_LESSONS.filter(lesson => lesson.levelId === levelId);
  const sentences = lessons.flatMap(lesson => lesson.sentences);
  const words = new Set(sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word)));
  const completed = new Set(completedLessonIds);
  return {
    levelId,
    lessonCount: lessons.length,
    completedLessonCount: lessons.filter(lesson => completed.has(lesson.id)).length,
    sentenceCount: sentences.length,
    patternCount: sentences.filter(sentence => !!sentence.pattern).length,
    vocabularyCount: words.size,
  };
}

export function getAdvancedContentComposition() {
  const lessons = SENTENCE_LESSONS.filter(lesson => lesson.levelId === 4);
  const scenarios = lessons.filter(lesson => lesson.contentKind === 'scenario');
  const vocabularyPractice = lessons.filter(lesson => lesson.contentKind === 'vocabulary-practice');
  return {
    scenarioLessonCount: scenarios.length,
    scenarioSentenceCount: scenarios.reduce((total, lesson) => total + lesson.sentences.length, 0),
    vocabularyPracticeLessonCount: vocabularyPractice.length,
    vocabularyPracticeSentenceCount: vocabularyPractice.reduce((total, lesson) => total + lesson.sentences.length, 0),
    totalLessonCount: lessons.length,
    totalSentenceCount: lessons.reduce((total, lesson) => total + lesson.sentences.length, 0),
  };
}

export interface SentenceVocabularyEntry {
  word: string;
  meaning: string;
  essential504?: true;
  sentenceId: string;
  exampleEn: string;
  exampleFa: string;
}

/** Vocabulary is always projected from its first original sentence, never detached. */
export function getLessonVocabulary(lesson: SentenceLesson): SentenceVocabularyEntry[] {
  const byWord = new Map<string, SentenceVocabularyEntry>();
  for (const sentence of lesson.sentences) {
    for (const item of sentence.vocabulary) {
      if (byWord.has(item.word)) continue;
      byWord.set(item.word, {
        ...item,
        sentenceId: sentence.id,
        exampleEn: sentence.en,
        exampleFa: sentence.fa,
      });
    }
  }
  return Array.from(byWord.values());
}

export interface SentencePatternEntry {
  sentenceId: string;
  pattern: string;
  exampleEn: string;
  exampleFa: string;
}

export function getLessonPatterns(lesson: SentenceLesson): SentencePatternEntry[] {
  return lesson.sentences.flatMap(sentence => sentence.pattern
    ? [{ sentenceId: sentence.id, pattern: sentence.pattern, exampleEn: sentence.en, exampleFa: sentence.fa }]
    : []);
}

/** A read-only projection connecting the existing sentence-first data to the engine entities. */
export function buildEnglishLessonCore(lesson: SentenceLesson) {
  const patterns = getLessonPatterns(lesson);
  return {
    situation: { id: lesson.id, title: lesson.title, text: lesson.situation },
    coreSentences: lesson.sentences as readonly CourseSentence[],
    sentencePatterns: patterns,
    vocabulary: lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => ({
      ...item,
      sentenceId: sentence.id,
      exampleEn: sentence.en,
      exampleFa: sentence.fa,
    }))),
    grammarThroughUsage: patterns,
    dialogues: lesson.dialogue,
    exerciseSourceSentenceIds: lesson.sentences.map(sentence => sentence.id),
    reviewCardIds: lesson.sentences.map(sentence => `${lesson.id}:${sentence.id}`),
  };
}

export function getEnglishLevelBlueprint(levelId: CourseLevelId) {
  return ENGLISH_ENGINE_BLUEPRINT.find(level => level.levelId === levelId)
    ?? COURSE_LEVELS.find(level => level.id === levelId);
}
