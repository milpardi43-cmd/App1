import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { PRONUNCIATION_COURSES, type PronunciationLanguage } from './pronunciationCourse';

export type PronunciationMark = 'practiced' | 'review';
export interface PronunciationMarkEntry {
  /** `null` is a synced tombstone, so clearing a mark on one device clears it everywhere. */
  mark: PronunciationMark | null;
  updatedAt: string;
}
export type PronunciationMarks = Partial<Record<string, PronunciationMarkEntry>>;

export const PRONUNCIATION_PROGRESS_KEYS: Record<PronunciationLanguage, string> = {
  en: 'pronunciation_practice_en_v1',
  de: 'pronunciation_practice_de_v1',
};

interface StoredPronunciationProgress {
  schemaVersion: 2;
  language: PronunciationLanguage;
  marks: PronunciationMarks;
}

const LEGACY_MARK_TIME = new Date(0).toISOString();
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

/** Validate a local or cloud mark map without ever treating malformed data as an empty record. */
export function parsePronunciationMarks(value: unknown, language: PronunciationLanguage): PronunciationMarks {
  if (!isRecord(value)) throw new Error('Pronunciation marks must be an object');
  const allowedIds = new Set(PRONUNCIATION_COURSES[language].map(unit => unit.id));
  const result: PronunciationMarks = {};
  for (const [id, candidate] of Object.entries(value)) {
    if (!allowedIds.has(id)) throw new Error('Pronunciation progress contains an unknown lesson');
    // v1 local marks were plain strings. Preserve them and let a real v2 edit
    // or cloud sync write the upgraded representation later.
    if (candidate === 'practiced' || candidate === 'review') {
      result[id] = { mark: candidate, updatedAt: LEGACY_MARK_TIME };
      continue;
    }
    if (!isRecord(candidate)
      || (candidate.mark !== 'practiced' && candidate.mark !== 'review' && candidate.mark !== null)
      || typeof candidate.updatedAt !== 'string'
      || !Number.isFinite(Date.parse(candidate.updatedAt))) {
      throw new Error('Pronunciation progress entry is invalid');
    }
    result[id] = { mark: candidate.mark, updatedAt: candidate.updatedAt };
  }
  return result;
}

function parseStoredProgress(value: unknown, language: PronunciationLanguage): PronunciationMarks {
  if (!isRecord(value) || value.language !== language || (value.schemaVersion !== 1 && value.schemaVersion !== 2)) {
    throw new Error('Saved pronunciation progress is invalid or incompatible');
  }
  return parsePronunciationMarks(value.marks, language);
}

export function mergePronunciationMarks(
  language: PronunciationLanguage,
  first: unknown,
  second: unknown,
): PronunciationMarks {
  const a = parsePronunciationMarks(first, language);
  const b = parsePronunciationMarks(second, language);
  const result: PronunciationMarks = { ...a };
  for (const [id, candidate] of Object.entries(b)) {
    if (!candidate) continue;
    const previous = result[id];
    if (!previous) {
      result[id] = candidate;
      continue;
    }
    const leftTime = Date.parse(previous.updatedAt);
    const rightTime = Date.parse(candidate.updatedAt);
    if (rightTime > leftTime) {
      result[id] = candidate;
    } else if (rightTime === leftTime && JSON.stringify(candidate) > JSON.stringify(previous)) {
      // Deterministic tie-breaking keeps concurrent updates convergent.
      result[id] = candidate;
    }
  }
  return result;
}

async function readRaw(language: PronunciationLanguage): Promise<string | null> {
  const key = PRONUNCIATION_PROGRESS_KEYS[language];
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  }
  return AsyncStorage.getItem(key);
}

async function writeRaw(language: PronunciationLanguage, value: string): Promise<void> {
  const key = PRONUNCIATION_PROGRESS_KEYS[language];
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') throw new Error('Local storage is unavailable');
    window.localStorage.setItem(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
}

async function readProgress(language: PronunciationLanguage): Promise<PronunciationMarks> {
  const raw = await readRaw(language);
  if (raw === null) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Saved pronunciation progress is not valid JSON');
  }
  return parseStoredProgress(parsed, language);
}

const writeQueues: Record<PronunciationLanguage, Promise<unknown>> = {
  en: Promise.resolve(),
  de: Promise.resolve(),
};

function serialWrite<T>(language: PronunciationLanguage, job: () => Promise<T>): Promise<T> {
  const next = writeQueues[language].catch(() => undefined).then(job);
  writeQueues[language] = next;
  return next;
}

function persist(language: PronunciationLanguage, marks: PronunciationMarks) {
  const stored: StoredPronunciationProgress = { schemaVersion: 2, language, marks };
  return writeRaw(language, JSON.stringify(stored));
}

function scheduleAccountSync() {
  // Avoid a static dependency cycle: the sync coordinator imports this module.
  void import('../personalLearningSync')
    .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
    .catch(() => undefined);
}

export async function loadPronunciationMarks(language: PronunciationLanguage): Promise<PronunciationMarks> {
  await writeQueues[language].catch(() => undefined);
  return readProgress(language);
}

/** Merge a validated cloud snapshot with local marks; null entries are retained as deletion tombstones. */
export function mergeRemotePronunciationMarks(
  language: PronunciationLanguage,
  remote: unknown,
): Promise<PronunciationMarks> {
  return serialWrite(language, async () => {
    const local = await readProgress(language);
    const merged = mergePronunciationMarks(language, local, remote);
    if (JSON.stringify(merged) !== JSON.stringify(local)) await persist(language, merged);
    return merged;
  });
}

export function savePronunciationMark(
  language: PronunciationLanguage,
  unitId: string,
  mark: PronunciationMark | null,
): Promise<PronunciationMarks> {
  if (!PRONUNCIATION_COURSES[language].some(unit => unit.id === unitId)) {
    return Promise.reject(new Error('Unknown pronunciation unit'));
  }
  if (mark !== null && mark !== 'practiced' && mark !== 'review') {
    return Promise.reject(new Error('Invalid pronunciation mark'));
  }
  return serialWrite(language, async () => {
    const marks = await readProgress(language);
    marks[unitId] = { mark, updatedAt: new Date().toISOString() };
    await persist(language, marks);
    scheduleAccountSync();
    return { ...marks };
  });
}
