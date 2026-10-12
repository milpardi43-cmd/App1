import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { GERMAN_SENTENCE_LESSONS } from './germanSentenceCourse';

export const GERMAN_SENTENCE_SESSION_PREFIX = 'german_sentence_session_v1:';
const PAGE_SIZE = 5;

export type GermanSentenceStage = 0 | 1 | 2 | 3 | 4 | 5;

export interface GermanSentenceSession {
  schemaVersion: 1;
  lessonId: string;
  /** Sentence index for stages 1/3; five-sentence page index for stages 2/5. */
  stage: GermanSentenceStage;
  index: number;
  updatedAt: string;
}

export function germanSentenceSessionKey(lessonId: string) {
  return `${GERMAN_SENTENCE_SESSION_PREFIX}${lessonId}`;
}

export function validGermanSentenceSession(value: unknown, lessonId: string): value is GermanSentenceSession {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const session = value as Partial<GermanSentenceSession>;
  const lesson = GERMAN_SENTENCE_LESSONS.find(item => item.id === lessonId);
  if (!lesson || session.schemaVersion !== 1 || session.lessonId !== lessonId
    || !Number.isInteger(session.stage) || session.stage! < 0 || session.stage! > 5
    || !Number.isInteger(session.index) || session.index! < 0
    || typeof session.updatedAt !== 'string' || !Number.isFinite(Date.parse(session.updatedAt))) return false;

  const stage = session.stage as GermanSentenceStage;
  const index = session.index!;
  const pageCount = Math.ceil(lesson.sentences.length / PAGE_SIZE);
  if (stage === 0 || stage === 4) return index === 0;
  if (stage === 1 || stage === 3) return index < lesson.sentences.length;
  return index < pageCount;
}

async function readRaw(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  }
  return AsyncStorage.getItem(key);
}

async function writeRaw(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') throw new Error('Storage unavailable');
    window.localStorage.setItem(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

let writeQueue: Promise<unknown> = Promise.resolve();
function serialWrite<T>(job: () => Promise<T>): Promise<T> {
  const next = writeQueue.catch(() => undefined).then(job);
  writeQueue = next;
  return next;
}

export async function loadGermanSentenceSession(lessonId: string): Promise<GermanSentenceSession | null> {
  const lesson = GERMAN_SENTENCE_LESSONS.find(item => item.id === lessonId);
  if (!lesson) throw new Error('Unknown German sentence lesson');
  await writeQueue.catch(() => undefined);
  const raw = await readRaw(germanSentenceSessionKey(lessonId));
  if (raw === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Saved German lesson session is not valid JSON');
  }
  if (!validGermanSentenceSession(parsed, lessonId)) {
    throw new Error('Saved German lesson session is invalid or incompatible');
  }
  return parsed;
}

export function saveGermanSentenceSession(session: GermanSentenceSession): Promise<void> {
  if (!validGermanSentenceSession(session, session.lessonId)) {
    return Promise.reject(new Error('Invalid German sentence session'));
  }
  const copy = JSON.stringify({ ...session });
  const key = germanSentenceSessionKey(session.lessonId);
  return serialWrite(async () => writeRaw(key, copy));
}

export function clearGermanSentenceSession(lessonId: string): Promise<void> {
  if (!GERMAN_SENTENCE_LESSONS.some(item => item.id === lessonId)) {
    return Promise.reject(new Error('Unknown German sentence lesson'));
  }
  return serialWrite(async () => {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw new Error('Storage unavailable');
      window.localStorage.removeItem(germanSentenceSessionKey(lessonId));
    } else {
      await AsyncStorage.removeItem(germanSentenceSessionKey(lessonId));
    }
  });
}
