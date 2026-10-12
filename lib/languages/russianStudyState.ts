import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { RUSSIAN_LESSONS, RUSSIAN_LESSON_STAGES } from './russian';

export const RUSSIAN_STUDY_STORAGE_KEY = 'russian_lesson_sessions_v1';

export interface RussianLessonSession {
  stage: number;
  sentenceIndex: number;
  revealed: boolean;
  answers: Record<string, number>;
  showCheckAnswers: boolean;
}

interface RussianStudyState {
  schema: 1;
  sessions: Record<string, RussianLessonSession>;
}

export function freshRussianLessonSession(): RussianLessonSession {
  return { stage: 0, sentenceIndex: 0, revealed: false, answers: {}, showCheckAnswers: false };
}

async function readRaw(): Promise<string | null> {
  if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(RUSSIAN_STUDY_STORAGE_KEY);
  return AsyncStorage.getItem(RUSSIAN_STUDY_STORAGE_KEY);
}

async function writeRaw(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(RUSSIAN_STUDY_STORAGE_KEY, value);
    return;
  }
  await AsyncStorage.setItem(RUSSIAN_STUDY_STORAGE_KEY, value);
}

function parseState(raw: string | null): RussianStudyState {
  if (raw === null) return { schema: 1, sessions: {} };
  const value: unknown = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('دادهٔ جلسهٔ روسی ساختار معتبری ندارد.');
  const state = value as Partial<RussianStudyState>;
  if (state.schema !== 1 || !state.sessions || typeof state.sessions !== 'object' || Array.isArray(state.sessions)) throw new Error('نسخهٔ دادهٔ جلسهٔ روسی شناخته‌شده نیست.');
  return { schema: 1, sessions: state.sessions as Record<string, RussianLessonSession> };
}

function validateSession(lessonId: string, value: unknown): RussianLessonSession {
  const lesson = RUSSIAN_LESSONS.find(item => item.id === lessonId);
  if (!lesson || !value || typeof value !== 'object' || Array.isArray(value)) throw new Error('جلسهٔ روسی برای این درس معتبر نیست.');
  const session = value as Partial<RussianLessonSession>;
  if (!Number.isInteger(session.stage) || session.stage! < 0 || session.stage! >= RUSSIAN_LESSON_STAGES.length
    || !Number.isInteger(session.sentenceIndex) || session.sentenceIndex! < 0 || session.sentenceIndex! >= lesson.sentences.length
    || typeof session.revealed !== 'boolean' || typeof session.showCheckAnswers !== 'boolean'
    || !session.answers || typeof session.answers !== 'object' || Array.isArray(session.answers)) {
    throw new Error('وضعیت ذخیره‌شدهٔ درس روسی معتبر نیست؛ دادهٔ اصلی تغییر نکرده است.');
  }
  const answers: Record<string, number> = {};
  for (const [key, answer] of Object.entries(session.answers)) {
    const checkIndex = Number(key);
    const check = lesson.checks?.[checkIndex];
    if (!Number.isInteger(checkIndex) || !check || !Number.isInteger(answer) || answer! < 0 || answer! >= check.choices.length) {
      throw new Error('پاسخ ذخیره‌شدهٔ تمرین روسی معتبر نیست؛ دادهٔ اصلی تغییر نکرده است.');
    }
    answers[key] = answer!;
  }
  return {
    stage: session.stage!,
    sentenceIndex: session.sentenceIndex!,
    revealed: session.revealed,
    answers,
    showCheckAnswers: session.showCheckAnswers,
  };
}

export async function loadRussianLessonSession(lessonId: string): Promise<RussianLessonSession> {
  if (!RUSSIAN_LESSONS.some(item => item.id === lessonId)) throw new Error('درس روسی پیدا نشد.');
  const state = parseState(await readRaw());
  const saved = state.sessions[lessonId];
  return saved === undefined ? freshRussianLessonSession() : validateSession(lessonId, saved);
}

let queue: Promise<unknown> = Promise.resolve();
function serial<T>(job: () => Promise<T>): Promise<T> {
  const next = queue.then(job, job);
  queue = next.catch(() => undefined);
  return next;
}

export function saveRussianLessonSession(lessonId: string, value: RussianLessonSession): Promise<void> {
  return serial(async () => {
    const safe = validateSession(lessonId, value);
    const state = parseState(await readRaw());
    await writeRaw(JSON.stringify({ ...state, sessions: { ...state.sessions, [lessonId]: safe } }));
  });
}

export function clearRussianLessonSession(lessonId: string): Promise<void> {
  return serial(async () => {
    if (!RUSSIAN_LESSONS.some(item => item.id === lessonId)) throw new Error('درس روسی پیدا نشد.');
    const state = parseState(await readRaw());
    const sessions = { ...state.sessions };
    delete sessions[lessonId];
    if (Object.keys(sessions).length) await writeRaw(JSON.stringify({ ...state, sessions }));
    else if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.removeItem(RUSSIAN_STUDY_STORAGE_KEY);
    } else await AsyncStorage.removeItem(RUSSIAN_STUDY_STORAGE_KEY);
  });
}
