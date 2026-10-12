import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { SENTENCE_LESSONS } from './courseContent';
import { COURSE_PROGRESS_STORAGE_KEY, parseCourseProgressBackup, type CourseProgress } from './courseProgress';
import { STUDY_KEY, parseStudy, type StudyState } from './englishStudyState';
import { SUPPLEMENT_KEY, parseProgress, type SupplementProgress } from './englishSupplement/progress';

export const ENGLISH_BACKUP_FORMAT = 'english-journey-progress';
export const ENGLISH_BACKUP_VERSION = 1;
export const MAX_ENGLISH_BACKUP_CHARACTERS = 8_000_000;
export const ENGLISH_BACKUP_STORAGE_KEYS = [COURSE_PROGRESS_STORAGE_KEY, STUDY_KEY, SUPPLEMENT_KEY] as const;

export interface EnglishBackupData {
  courseProgress: CourseProgress;
  study: StudyState;
  supplement: SupplementProgress;
}

export interface EnglishBackupSummary {
  completedLessonCount: number;
  lessonCount: number;
  reviewCardCount: number;
  studySessionCount: number;
  studyEvidenceCount: number;
  supplementDraftCount: number;
  supplementEvidenceCount: number;
  assessmentAttemptCount: number;
}

export interface BackupStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const deviceStorage: BackupStorage = {
  async getItem(key) {
    if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
    return AsyncStorage.getItem(key);
  },
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw new Error('ذخیره‌سازی مرورگر در دسترس نیست.');
      window.localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  },
  async removeItem(key) {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw new Error('ذخیره‌سازی مرورگر در دسترس نیست.');
      window.localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function parseStoredJson(raw: string, label: string): unknown {
  try { return JSON.parse(raw) as unknown; }
  catch { throw new Error(`دادهٔ ذخیره‌شدهٔ ${label} معتبر نیست؛ فایل پشتیبان ساخته نشد.`); }
}

async function readLocalData(storage: BackupStorage): Promise<EnglishBackupData> {
  const [progressRaw, studyRaw, supplementRaw] = await Promise.all(
    ENGLISH_BACKUP_STORAGE_KEYS.map(key => storage.getItem(key)),
  );
  const courseProgress = progressRaw === null
    ? parseCourseProgressBackup({})
    : parseCourseProgressBackup(parseStoredJson(progressRaw, 'پیشرفت دوره'));
  return {
    courseProgress,
    study: parseStudy(studyRaw),
    supplement: parseProgress(supplementRaw),
  };
}

export async function getEnglishBackupSummary(storage: BackupStorage = deviceStorage): Promise<EnglishBackupSummary> {
  return summarize(await readLocalData(storage));
}

function summarize(data: EnglishBackupData): EnglishBackupSummary {
  return {
    completedLessonCount: data.courseProgress.completedLessonIds.length,
    lessonCount: SENTENCE_LESSONS.length,
    reviewCardCount: data.courseProgress.reviewCards.length,
    studySessionCount: Object.keys(data.study.sessions).length,
    studyEvidenceCount: Object.values(data.study.lessonEvidence).reduce((sum, evidence) => sum + Object.keys(evidence).length, 0),
    supplementDraftCount: Object.keys(data.supplement.drafts).length,
    supplementEvidenceCount: Object.keys(data.supplement.evidence).length,
    assessmentAttemptCount: data.supplement.assessmentAttempts.length,
  };
}

export async function exportEnglishBackup(storage: BackupStorage = deviceStorage, now = new Date()): Promise<string> {
  const data = await readLocalData(storage);
  const payload = {
    format: ENGLISH_BACKUP_FORMAT,
    version: ENGLISH_BACKUP_VERSION,
    course: 'en',
    exportedAt: now.toISOString(),
    data,
  };
  const json = JSON.stringify(payload, null, 2);
  if (json.length > MAX_ENGLISH_BACKUP_CHARACTERS) throw new Error('فایل پشتیبان از اندازهٔ مجاز بزرگ‌تر است.');
  return json;
}

export function parseEnglishBackup(text: string): { exportedAt: string; data: EnglishBackupData } {
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_ENGLISH_BACKUP_CHARACTERS) {
    throw new Error('متن فایل پشتیبان خالی است یا از اندازهٔ مجاز بزرگ‌تر است.');
  }
  const parsed = parseStoredJson(text, 'فایل') as unknown;
  if (!isRecord(parsed) || parsed.format !== ENGLISH_BACKUP_FORMAT || parsed.version !== ENGLISH_BACKUP_VERSION
    || parsed.course !== 'en' || typeof parsed.exportedAt !== 'string' || !Number.isFinite(Date.parse(parsed.exportedAt))
    || !isRecord(parsed.data)) {
    throw new Error('این فایل نسخهٔ پشتیبان معتبر همین مسیر انگلیسی نیست.');
  }
  const data = parsed.data;
  if (!isRecord(data.courseProgress) || !isRecord(data.study) || !isRecord(data.supplement)) {
    throw new Error('فایل پشتیبان هر سه بخش معتبر ذخیره‌سازی انگلیسی را ندارد.');
  }
  const courseProgress = parseCourseProgressBackup(data.courseProgress);
  let study: StudyState;
  let supplement: SupplementProgress;
  try { study = parseStudy(JSON.stringify(data.study)); }
  catch { throw new Error('بخش جلسه‌ها و شواهد مطالعه معتبر نیست؛ دادهٔ فعلی تغییر نکرد.'); }
  try { supplement = parseProgress(JSON.stringify(data.supplement)); }
  catch { throw new Error('بخش تمرین تکمیلی و پیش‌نویس‌ها معتبر نیست؛ دادهٔ فعلی تغییر نکرد.'); }
  return { exportedAt: parsed.exportedAt, data: { courseProgress, study, supplement } };
}

function latestTimestamp(left?: string, right?: string): string | undefined {
  const candidates = [left, right].filter((value): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value)));
  return candidates.sort((a, b) => Date.parse(a) - Date.parse(b)).at(-1);
}

function reviewedAt(card: CourseProgress['reviewCards'][number]): number {
  return Date.parse(card.lastReviewedAt ?? card.dueAt) || 0;
}

export function mergeEnglishCourseProgress(current: CourseProgress, incoming: CourseProgress, now = new Date()): CourseProgress {
  const currentIsNewer = Date.parse(current.updatedAt) >= Date.parse(incoming.updatedAt);
  const latest = currentIsNewer ? current : incoming;
  const cards = new Map(current.reviewCards.map(card => [card.id, card]));
  for (const candidate of incoming.reviewCards) {
    const existing = cards.get(candidate.id);
    if (!existing || reviewedAt(candidate) > reviewedAt(existing)
      || (reviewedAt(candidate) === reviewedAt(existing) && candidate.repetitions > existing.repetitions)) {
      cards.set(candidate.id, candidate);
    }
  }
  const activityDate = latest.activityDate;
  return parseCourseProgressBackup({
    ...latest,
    completedLessonIds: [...new Set([...current.completedLessonIds, ...incoming.completedLessonIds])],
    reviewSentenceIds: [...new Set([...current.reviewSentenceIds, ...incoming.reviewSentenceIds])],
    reviewCards: [...cards.values()],
    learnedEssential504Words: [...new Set([...current.learnedEssential504Words, ...incoming.learnedEssential504Words])],
    activityDate,
    todayMinutes: current.activityDate === incoming.activityDate ? Math.max(current.todayMinutes, incoming.todayMinutes) : latest.todayMinutes,
    longestStreak: Math.max(current.longestStreak, incoming.longestStreak),
    lastActiveDate: latestTimestamp(current.lastActiveDate ?? undefined, incoming.lastActiveDate ?? undefined) ?? null,
    totalMinutes: Math.max(current.totalMinutes, incoming.totalMinutes),
    updatedAt: now.toISOString(),
  });
}

function mergeStudyState(current: StudyState, incoming: StudyState): StudyState {
  const sessions: StudyState['sessions'] = { ...incoming.sessions };
  for (const [lessonId, currentSession] of Object.entries(current.sessions)) {
    const incomingSession = incoming.sessions[lessonId];
    if (!incomingSession) {
      sessions[lessonId] = currentSession;
      continue;
    }
    const preferred = currentSession.stage > incomingSession.stage
      || (currentSession.stage === incomingSession.stage && currentSession.sentenceIndex >= incomingSession.sentenceIndex)
      ? currentSession
      : incomingSession;
    sessions[lessonId] = {
      ...preferred,
      revealed: incomingSession.revealed || currentSession.revealed,
      evidencePassed: incomingSession.evidencePassed || currentSession.evidencePassed,
    };
  }
  const days: StudyState['days'] = { ...incoming.days };
  for (const [day, milliseconds] of Object.entries(current.days)) days[day] = Math.max(days[day] ?? 0, milliseconds);
  const lessonEvidence: StudyState['lessonEvidence'] = { ...incoming.lessonEvidence };
  for (const [lessonId, currentResults] of Object.entries(current.lessonEvidence)) {
    lessonEvidence[lessonId] = { ...incoming.lessonEvidence[lessonId] };
    for (const [taskId, result] of Object.entries(currentResults)) {
      const incomingResult = incoming.lessonEvidence[lessonId]?.[taskId];
      if (!incomingResult || result.attempts >= incomingResult.attempts) lessonEvidence[lessonId][taskId] = result;
    }
  }
  return parseStudy(JSON.stringify({ version: 1, sessions, days, lessonEvidence }));
}

function mergeAssessmentAttempts(current: SupplementProgress['assessmentAttempts'], incoming: SupplementProgress['assessmentAttempts']) {
  const attempts = new Map(incoming.map(attempt => [attempt.id, attempt]));
  for (const item of current) {
    const prior = attempts.get(item.id);
    if (!prior) {
      attempts.set(item.id, item);
      continue;
    }
    const completedAt = latestTimestamp(prior.completedAt, item.completedAt);
    const startedAt = [prior.startedAt, item.startedAt].sort((a, b) => Date.parse(a) - Date.parse(b))[0];
    attempts.set(item.id, {
      ...prior,
      ...item,
      startedAt,
      answers: { ...prior.answers, ...item.answers },
      completedAt,
      abandonedAt: completedAt ? undefined : latestTimestamp(prior.abandonedAt, item.abandonedAt),
    });
  }
  return [...attempts.values()].sort((a, b) => Date.parse(a.startedAt) - Date.parse(b.startedAt) || a.id.localeCompare(b.id));
}

function mergeSupplementProgress(current: SupplementProgress, incoming: SupplementProgress): SupplementProgress {
  const evidence: SupplementProgress['evidence'] = { ...incoming.evidence };
  for (const [id, result] of Object.entries(current.evidence)) {
    const imported = incoming.evidence[id];
    if (!imported || result.attempts >= imported.attempts) evidence[id] = result;
  }
  const drafts: SupplementProgress['drafts'] = { ...incoming.drafts, ...current.drafts };
  const checklists: SupplementProgress['checklists'] = { ...incoming.checklists };
  for (const [id, list] of Object.entries(current.checklists)) checklists[id] = { ...incoming.checklists[id], ...list };
  return parseProgress(JSON.stringify({
    version: 1,
    evidence,
    drafts,
    assessmentAttempts: mergeAssessmentAttempts(current.assessmentAttempts, incoming.assessmentAttempts),
    checklists,
  }));
}

export function mergeEnglishBackupData(current: EnglishBackupData, incoming: EnglishBackupData, now = new Date()): EnglishBackupData {
  return {
    courseProgress: mergeEnglishCourseProgress(current.courseProgress, incoming.courseProgress, now),
    study: mergeStudyState(current.study, incoming.study),
    supplement: mergeSupplementProgress(current.supplement, incoming.supplement),
  };
}

export type EnglishSyncExtras = Pick<EnglishBackupData, 'study' | 'supplement'>;

/** Read the non-sentence-course English progress stores without including the separate main course row. */
export async function exportEnglishSyncExtras(storage: BackupStorage = deviceStorage): Promise<EnglishSyncExtras> {
  const [studyRaw, supplementRaw] = await Promise.all([
    storage.getItem(STUDY_KEY),
    storage.getItem(SUPPLEMENT_KEY),
  ]);
  return { study: parseStudy(studyRaw), supplement: parseProgress(supplementRaw) };
}

/** Merge cloud self-assessment/evidence while intentionally keeping free-text drafts local. */
export async function mergeEnglishSyncExtras(remote: unknown, storage: BackupStorage = deviceStorage): Promise<EnglishSyncExtras> {
  if (!isRecord(remote) || !isRecord(remote.study) || !isRecord(remote.supplement)) {
    throw new Error('پیشرفت تکمیلی انگلیسی در حساب معتبر نیست؛ دادهٔ محلی تغییر نکرد.');
  }
  const [studyRaw, supplementRaw] = await Promise.all([
    storage.getItem(STUDY_KEY),
    storage.getItem(SUPPLEMENT_KEY),
  ]);
  const currentStudy = parseStudy(studyRaw);
  const currentSupplement = parseProgress(supplementRaw);
  const incomingStudy = parseStudy(JSON.stringify(remote.study));
  // Cloud snapshots deliberately omit answer drafts; do not import free text from a device backup.
  const incomingSupplement = parseProgress(JSON.stringify({ ...remote.supplement, drafts: {} }));
  const mergedStudy = mergeStudyState(currentStudy, incomingStudy);
  const mergedSupplement = mergeSupplementProgress(currentSupplement, incomingSupplement);
  const values = [JSON.stringify(mergedStudy), JSON.stringify(mergedSupplement)];
  const keys = [STUDY_KEY, SUPPLEMENT_KEY] as const;
  const previous = [studyRaw, supplementRaw];
  if (values[0] === (studyRaw ?? JSON.stringify(parseStudy(null)))
    && values[1] === (supplementRaw ?? JSON.stringify(parseProgress(null)))) {
    return { study: mergedStudy, supplement: mergedSupplement };
  }
  try {
    await storage.setItem(keys[0], values[0]);
    await storage.setItem(keys[1], values[1]);
  } catch {
    let rollbackFailed = false;
    for (let index = keys.length - 1; index >= 0; index -= 1) {
      try {
        if (previous[index] === null) await storage.removeItem(keys[index]);
        else await storage.setItem(keys[index], previous[index]!);
      } catch { rollbackFailed = true; }
    }
    if (rollbackFailed) throw new Error('ادغام پیشرفت انگلیسی کامل نشد و بازگردانی خودکار یکی از بخش‌ها هم ناموفق بود؛ سابقهٔ محلی را بررسی کنید.');
    throw new Error('ذخیرهٔ ادغام پیشرفت انگلیسی انجام نشد؛ هر دو بخش محلی به وضعیت قبلی بازگردانده شدند.');
  }
  return { study: mergedStudy, supplement: mergedSupplement };
}

export async function restoreEnglishBackup(text: string, storage: BackupStorage = deviceStorage, now = new Date()): Promise<EnglishBackupSummary> {
  const incoming = parseEnglishBackup(text).data;
  const current = await readLocalData(storage);
  const merged = mergeEnglishBackupData(current, incoming, now);
  const values = [
    JSON.stringify(merged.courseProgress),
    JSON.stringify(merged.study),
    JSON.stringify(merged.supplement),
  ];
  const previous = await Promise.all(ENGLISH_BACKUP_STORAGE_KEYS.map(key => storage.getItem(key)));
  try {
    for (let index = 0; index < ENGLISH_BACKUP_STORAGE_KEYS.length; index += 1) {
      await storage.setItem(ENGLISH_BACKUP_STORAGE_KEYS[index], values[index]);
    }
  } catch {
    let rollbackFailed = false;
    for (let index = ENGLISH_BACKUP_STORAGE_KEYS.length - 1; index >= 0; index -= 1) {
      try {
        if (previous[index] === null) await storage.removeItem(ENGLISH_BACKUP_STORAGE_KEYS[index]);
        else await storage.setItem(ENGLISH_BACKUP_STORAGE_KEYS[index], previous[index]!);
      } catch { rollbackFailed = true; }
    }
    if (rollbackFailed) throw new Error('بازیابی کامل نشد و بازگردانی خودکار یکی از بخش‌ها هم ناموفق بود؛ پیش از ادامه، دستگاه را بررسی کنید.');
    throw new Error('ذخیرهٔ بازیابی انجام نشد؛ تلاش برای بازگرداندن هر سه سابقهٔ قبلی انجام شد. دوباره تلاش کنید.');
  }
  return summarize(merged);
}
