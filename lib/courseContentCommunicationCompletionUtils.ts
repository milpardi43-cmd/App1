import type { CourseSentence } from './courseContent';

export type CommunicationCompletionVocabulary = readonly [word: string, meaning: string];
export type CommunicationCompletionRow = readonly [
  en: string,
  fa: string,
  pronunciation: string,
  pattern: string,
  vocabulary: readonly CommunicationCompletionVocabulary[],
];

/** Turn editorial communication-course rows into stable, ordered sentence records. */
export function buildCommunicationCompletion(
  prefix: string,
  firstNumber: number,
  rows: readonly CommunicationCompletionRow[],
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
