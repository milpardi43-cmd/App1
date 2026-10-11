import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { russianProgress, RUSSIAN_LESSONS } from './russian';
import {
  findRussianSentenceCurriculumEntry,
  russianCefrForLesson,
  type RussianCefrLevel,
} from './russianCurriculum';
import {
  assessRussianBandReadiness,
  type RussianAssessmentSource,
  type RussianLearningPhaseId,
  type RussianPracticeOutcome,
} from './russianLearningEngine';

export const RUSSIAN_LEARNING_EVIDENCE_KEY = 'russian_learning_evidence_v1';
const MAX_ATTEMPTS = 1000;

export interface RussianPracticeAttempt {
  id: string;
  lessonId: string;
  sentenceId: string;
  objectiveId: string;
  cefrLevelId: RussianCefrLevel;
  phaseId: RussianLearningPhaseId;
  outcome: RussianPracticeOutcome;
  source: RussianAssessmentSource;
  assisted: boolean;
  novelContext: boolean;
  promptReviewed: boolean;
  independentTransfer: boolean;
  createdAt: string;
}

interface RussianPracticeEvidenceState {
  schema: 1;
  attempts: RussianPracticeAttempt[];
}

export interface RussianPracticeAttemptInput {
  lessonId: string;
  sentenceId: string;
  phaseId: RussianLearningPhaseId;
  outcome: RussianPracticeOutcome;
  source: RussianAssessmentSource;
  assisted?: boolean;
  novelContext?: boolean;
  promptReviewed?: boolean;
  attemptId?: string;
}

export interface RecordRussianPracticeAttemptResult {
  attempt: RussianPracticeAttempt;
  reviewRescheduled: boolean;
}

function blankState(): RussianPracticeEvidenceState {
  return { schema: 1, attempts: [] };
}

async function readRaw(): Promise<string | null> {
  if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(RUSSIAN_LEARNING_EVIDENCE_KEY);
  return AsyncStorage.getItem(RUSSIAN_LEARNING_EVIDENCE_KEY);
}

async function writeRaw(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') throw new Error('ذخیرهٔ شواهد یادگیری روسی در این محیط در دسترس نیست.');
    window.localStorage.setItem(RUSSIAN_LEARNING_EVIDENCE_KEY, value);
    return;
  }
  await AsyncStorage.setItem(RUSSIAN_LEARNING_EVIDENCE_KEY, value);
}

function validOutcomeSource(outcome: RussianPracticeOutcome, source: RussianAssessmentSource): boolean {
  const selfRated = outcome.startsWith('self-rated-');
  return selfRated ? source === 'self-report' : source !== 'self-report';
}

function independentTransferFor(value: Pick<RussianPracticeAttempt, 'phaseId' | 'outcome' | 'source' | 'assisted' | 'novelContext' | 'promptReviewed'>): boolean {
  return value.phaseId === 'transfer'
    && value.outcome === 'matched'
    && value.source !== 'self-report'
    && !value.assisted
    && value.novelContext
    && value.promptReviewed;
}

function validateAttempt(value: unknown): value is RussianPracticeAttempt {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const attempt = value as Partial<RussianPracticeAttempt>;
  const lesson = RUSSIAN_LESSONS.find(item => item.id === attempt.lessonId);
  const sentence = lesson?.sentences.find(item => item.id === attempt.sentenceId);
  const curriculum = attempt.sentenceId ? findRussianSentenceCurriculumEntry(attempt.sentenceId) : undefined;
  if (!lesson || !sentence || !curriculum || !attempt.id || typeof attempt.id !== 'string' || attempt.id.length > 160
    || attempt.objectiveId !== curriculum.objectiveId || attempt.cefrLevelId !== russianCefrForLesson(lesson.id)
    || !['receive', 'notice', 'reconstruct', 'transfer', 'retrieve'].includes(String(attempt.phaseId))
    || !['matched', 'confirmed-error', 'unrecognized', 'self-rated-again', 'self-rated-hard', 'self-rated-good', 'self-rated-easy'].includes(String(attempt.outcome))
    || !['curated-exact-match', 'self-report', 'human-review'].includes(String(attempt.source))
    || !validOutcomeSource(attempt.outcome!, attempt.source!)
    || typeof attempt.assisted !== 'boolean' || typeof attempt.novelContext !== 'boolean' || typeof attempt.promptReviewed !== 'boolean'
    || typeof attempt.independentTransfer !== 'boolean'
    || attempt.independentTransfer !== independentTransferFor(attempt as RussianPracticeAttempt)
    || typeof attempt.createdAt !== 'string' || !Number.isFinite(Date.parse(attempt.createdAt))) return false;
  return true;
}

function parseState(raw: string | null): RussianPracticeEvidenceState {
  if (raw === null) return blankState();
  let value: unknown;
  try { value = JSON.parse(raw); }
  catch { throw new Error('شواهد ذخیره‌شدهٔ روسی قابل‌خواندن نیست؛ دادهٔ اصلی تغییر نکرده است.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('ساختار شواهد یادگیری روسی معتبر نیست.');
  const state = value as Partial<RussianPracticeEvidenceState>;
  if (state.schema !== 1 || !Array.isArray(state.attempts) || state.attempts.length > MAX_ATTEMPTS
    || new Set(state.attempts.map(attempt => attempt?.id)).size !== state.attempts.length
    || !state.attempts.every(validateAttempt)) {
    throw new Error('نسخه یا دادهٔ شواهد یادگیری روسی معتبر نیست؛ دادهٔ اصلی تغییر نکرده است.');
  }
  return { schema: 1, attempts: state.attempts as RussianPracticeAttempt[] };
}

export async function getRussianPracticeAttempts(): Promise<RussianPracticeAttempt[]> {
  await writeQueue.catch(() => undefined);
  return parseState(await readRaw()).attempts;
}

let writeQueue: Promise<unknown> = Promise.resolve();
let generatedIdSequence = 0;
function serial<T>(job: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(job, job);
  writeQueue = next.catch(() => undefined);
  return next;
}

function makeAttempt(input: RussianPracticeAttemptInput, now: Date, existing: RussianPracticeAttempt[]): RussianPracticeAttempt {
  const lesson = RUSSIAN_LESSONS.find(item => item.id === input.lessonId);
  const sentence = lesson?.sentences.find(item => item.id === input.sentenceId);
  const curriculum = sentence ? findRussianSentenceCurriculumEntry(sentence.id) : undefined;
  const cefrLevelId = lesson ? russianCefrForLesson(lesson.id) : undefined;
  if (!lesson || !sentence || !curriculum || !cefrLevelId) throw new Error('تمرین روسی به درس یا جملهٔ موجود متصل نیست.');
  if (!validOutcomeSource(input.outcome, input.source)) throw new Error('نوع ارزیابی با نتیجهٔ ثبت‌شده سازگار نیست.');
  if (!Number.isFinite(now.getTime())) throw new Error('زمان ثبت تمرین روسی معتبر نیست.');
  const prefix = input.attemptId ?? `ru-attempt-${now.getTime()}`;
  let id = prefix;
  while (existing.some(item => item.id === id)) id = `${prefix}-${++generatedIdSequence}`;
  const attempt: RussianPracticeAttempt = {
    id,
    lessonId: lesson.id,
    sentenceId: sentence.id,
    objectiveId: curriculum.objectiveId,
    cefrLevelId,
    phaseId: input.phaseId,
    outcome: input.outcome,
    source: input.source,
    assisted: input.assisted ?? false,
    novelContext: input.novelContext ?? false,
    promptReviewed: input.promptReviewed ?? false,
    independentTransfer: false,
    createdAt: now.toISOString(),
  };
  attempt.independentTransfer = independentTransferFor(attempt);
  if (!validateAttempt(attempt)) throw new Error('ساختار شواهد تمرین روسی معتبر نیست.');
  return attempt;
}

/**
 * Saves local-only practice evidence. A confirmed error is also returned to the
 * existing Russian spaced-review queue at its short retry interval; an unrecognized
 * free response is never labelled wrong or rescheduled automatically.
 */
export function recordRussianPracticeAttempt(
  input: RussianPracticeAttemptInput,
  now = new Date(),
): Promise<RecordRussianPracticeAttemptResult> {
  return serial(async () => {
    const state = parseState(await readRaw());
    const attempt = makeAttempt(input, now, state.attempts);
    const next = { schema: 1 as const, attempts: [...state.attempts, attempt].slice(-MAX_ATTEMPTS) };
    await writeRaw(JSON.stringify(next));

    let reviewRescheduled = false;
    if (attempt.outcome === 'confirmed-error') {
      try {
        await russianProgress.addSentenceToReview(attempt.sentenceId, attempt.lessonId);
        const card = await russianProgress.rateReviewCard(`${attempt.lessonId}:${attempt.sentenceId}`, 'again', now);
        reviewRescheduled = card !== null;
      } catch {
        // The evidence remains durable even if the separate review-store write fails.
      }
    }
    return { attempt, reviewRescheduled };
  });
}

export async function getRussianBandReadiness(cefrLevelId: RussianCefrLevel) {
  const attempts = await getRussianPracticeAttempts();
  return assessRussianBandReadiness(cefrLevelId, attempts);
}
