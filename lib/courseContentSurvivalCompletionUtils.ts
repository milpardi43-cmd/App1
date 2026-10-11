import type { CourseSentence } from './courseContent';

export type SurvivalVocabularyPair = readonly [word: string, meaning: string];
export type SurvivalSentenceRow = readonly [
  id: string,
  en: string,
  fa: string,
  pronunciation: string,
  pattern: string,
  vocabulary: readonly SurvivalVocabularyPair[],
];

/** Build the active sentence-first records without detaching their vocabulary. */
export function buildSurvivalSentences(rows: readonly SurvivalSentenceRow[]): CourseSentence[] {
  return rows.map(([id, en, fa, pronunciation, pattern, vocabulary]) => ({
    id,
    en,
    fa,
    pronunciation,
    pattern,
    vocabulary: vocabulary.map(([word, meaning]) => ({ word, meaning })),
  }));
}
