import type { CourseSentence } from './courseContent';

export type EverydayCompletionVocabulary = readonly [word: string, meaning: string];
export type EverydayCompletionRow = readonly [
  en: string,
  fa: string,
  pronunciation: string,
  pattern: string,
  vocabulary: readonly EverydayCompletionVocabulary[],
];

/** Turn concise editorial rows into stable, ordered sentence records. */
export function buildEverydayCompletion(
  prefix: string,
  firstNumber: number,
  rows: readonly EverydayCompletionRow[],
): CourseSentence[] {
  return rows.map(([en, fa, pronunciation, pattern, vocabulary], index) => ({
    id: `${prefix}-${String(firstNumber + index).padStart(2, '0')}`,
    en,
    fa,
    pronunciation,
    pattern,
    vocabulary: vocabulary.map(([word, meaning]) => ({ word, meaning })),
  }));
}
