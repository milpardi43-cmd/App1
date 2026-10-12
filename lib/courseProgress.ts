import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { EVERYDAY_EXPANSION_LESSON_IDS, FOUNDATION_EXPANSION_LESSON_IDS, SENTENCE_LESSONS, SURVIVAL_EXPANSION_LESSON_IDS } from './courseContent';
import { mergeCourseProgress as mergeSharedCourseProgress } from './createCourseProgressStore';
import { supabase } from './supabase';

export const COURSE_PROGRESS_STORAGE_KEY = 'sentence_course_progress_v1';
const KEY = COURSE_PROGRESS_STORAGE_KEY;
const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface SentenceReviewCard {
  id: string;
  lessonId: string;
  sentenceId: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  lastReviewedAt?: string;
}

export interface CourseProgress {
  completedLessonIds: string[];
  currentLessonId: string;
  /** Kept for backward compatibility with early preview installs. */
  reviewSentenceIds: string[];
  reviewCards: SentenceReviewCard[];
  /** Historical, unverified coverage from older versions; never a mastery score. */
  learnedEssential504Words: string[];
  dailyGoalMinutes: number;
  todayMinutes: number;
  activityDate: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalMinutes: number;
  updatedAt: string;
}

const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function initialProgress(): CourseProgress {
  return {
    completedLessonIds: [],
    currentLessonId: 'foundation-introducing-yourself',
    reviewSentenceIds: [],
    reviewCards: [],
    learnedEssential504Words: [],
    dailyGoalMinutes: 10,
    todayMinutes: 0,
    activityDate: localDateKey(),
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalMinutes: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

const reviewCardId = (lessonId: string, sentenceId: string) => `${lessonId}:${sentenceId}`;
const FOUNDATION_EXPANSION_IDS = new Set<string>(FOUNDATION_EXPANSION_LESSON_IDS);
const SURVIVAL_EXPANSION_IDS = new Set<string>(SURVIVAL_EXPANSION_LESSON_IDS);
const EVERYDAY_EXPANSION_IDS = new Set<string>(EVERYDAY_EXPANSION_LESSON_IDS);

function currentLessonAfterCurriculumExpansion(value: Partial<CourseProgress>, completedLessonIds: string[], base: CourseProgress) {
  const storedId = typeof value.currentLessonId === 'string' && SENTENCE_LESSONS.some(lesson => lesson.id === value.currentLessonId)
    ? value.currentLessonId
    : base.currentLessonId;
  const storedIndex = SENTENCE_LESSONS.findIndex(lesson => lesson.id === storedId);
  const lastOriginalFoundationIndex = SENTENCE_LESSONS.findIndex(lesson => lesson.id === 'foundation-buying-something');
  const firstUnfinishedFoundation = FOUNDATION_EXPANSION_LESSON_IDS.find(id => !completedLessonIds.includes(id));

  // Returning learners who had moved beyond the old three-lesson Foundation block
  // are offered its new lessons before continuing, without undoing any completed work.
  if (!FOUNDATION_EXPANSION_IDS.has(storedId) && storedIndex > lastOriginalFoundationIndex && firstUnfinishedFoundation) {
    return firstUnfinishedFoundation;
  }

  const firstUnfinishedSurvival = SURVIVAL_EXPANSION_LESSON_IDS.find(id => !completedLessonIds.includes(id));
  const lastOriginalSurvivalIndex = SENTENCE_LESSONS.findIndex(lesson => lesson.id === 'survival-renting-a-home');
  const isPreviouslyPublishedLesson = !FOUNDATION_EXPANSION_IDS.has(storedId)
    && !SURVIVAL_EXPANSION_IDS.has(storedId)
    && !EVERYDAY_EXPANSION_IDS.has(storedId);

  // Existing learners are guided through inserted Survival material first.
  if (isPreviouslyPublishedLesson && storedIndex > lastOriginalSurvivalIndex && firstUnfinishedSurvival) {
    return firstUnfinishedSurvival;
  }

  const firstUnfinishedEveryday = EVERYDAY_EXPANSION_LESSON_IDS.find(id => !completedLessonIds.includes(id));
  const lastOriginalEverydayIndex = SENTENCE_LESSONS.findIndex(lesson => lesson.id === 'everyday-handling-an-emergency');
  // Learners whose saved position is beyond the five original Everyday lessons
  // complete the new modules before returning to their prior course position.
  if (isPreviouslyPublishedLesson && storedIndex > lastOriginalEverydayIndex && firstUnfinishedEveryday) {
    return firstUnfinishedEveryday;
  }
  return storedId;
}

function cardsForLesson(lessonId: string, dueAt = new Date()): SentenceReviewCard[] {
  const lesson = SENTENCE_LESSONS.find((item) => item.id === lessonId);
  if (!lesson) return [];
  return lesson.sentences.map((sentence) => ({
    id: reviewCardId(lesson.id, sentence.id),
    lessonId: lesson.id,
    sentenceId: sentence.id,
    dueAt: dueAt.toISOString(),
    intervalDays: 0,
    ease: 2.3,
    repetitions: 0,
    lapses: 0,
  }));
}

function normalizeProgress(value: Partial<CourseProgress>): CourseProgress {
  const base = initialProgress();
  const completedLessonIds = Array.isArray(value.completedLessonIds) ? value.completedLessonIds : [];
  const existingCards = Array.isArray(value.reviewCards) ? value.reviewCards : [];
  const cardMap = new Map(existingCards.map((card) => [card.id, card]));

  // Preview users who finished lessons before the scheduler existed are
  // migrated automatically and do not lose their learning history.
  completedLessonIds.forEach((lessonId) => {
    cardsForLesson(lessonId).forEach((card) => {
      if (!cardMap.has(card.id)) cardMap.set(card.id, card);
    });
  });

  const isNewDay = value.activityDate !== localDateKey();
  return {
    ...base,
    ...value,
    completedLessonIds,
    currentLessonId: currentLessonAfterCurriculumExpansion(value, completedLessonIds, base),
    reviewSentenceIds: Array.isArray(value.reviewSentenceIds) ? value.reviewSentenceIds : [],
    reviewCards: Array.from(cardMap.values()),
    learnedEssential504Words: Array.isArray(value.learnedEssential504Words) ? value.learnedEssential504Words : [],
    activityDate: localDateKey(),
    todayMinutes: isNewDay ? 0 : (value.todayMinutes ?? 0),
    currentStreak: Math.max(0, Number(value.currentStreak) || 0),
    longestStreak: Math.max(0, Number(value.longestStreak) || 0),
    lastActiveDate: typeof value.lastActiveDate === 'string' ? value.lastActiveDate : null,
    totalMinutes: Math.max(0, Number(value.totalMinutes) || 0),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isLocalDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/** Validate a backup payload before normalizing it; malformed imports never reach storage. */
export function parseCourseProgressBackup(value: unknown): CourseProgress {
  const lessonIds = new Set(SENTENCE_LESSONS.map(lesson => lesson.id));
  const sentenceIds = new Map(SENTENCE_LESSONS.map(lesson => [lesson.id, new Set(lesson.sentences.map(sentence => sentence.id))]));
  if (!isRecord(value)
    || (value.completedLessonIds !== undefined && (!Array.isArray(value.completedLessonIds) || value.completedLessonIds.some(id => typeof id !== 'string' || !lessonIds.has(id))))
    || (value.currentLessonId !== undefined && (typeof value.currentLessonId !== 'string' || !lessonIds.has(value.currentLessonId)))
    || (value.reviewSentenceIds !== undefined && (!Array.isArray(value.reviewSentenceIds) || value.reviewSentenceIds.some(id => typeof id !== 'string')))
    || (value.learnedEssential504Words !== undefined && (!Array.isArray(value.learnedEssential504Words) || value.learnedEssential504Words.some(word => typeof word !== 'string')))
    || (value.updatedAt !== undefined && (typeof value.updatedAt !== 'string' || !Number.isFinite(Date.parse(value.updatedAt))))
    || (value.dailyGoalMinutes !== undefined && (typeof value.dailyGoalMinutes !== 'number' || !Number.isFinite(value.dailyGoalMinutes) || value.dailyGoalMinutes <= 0 || value.dailyGoalMinutes > 1440))
    || (['todayMinutes', 'currentStreak', 'longestStreak', 'totalMinutes'] as const).some(key => value[key] !== undefined
      && (typeof value[key] !== 'number' || !Number.isFinite(value[key]) || value[key] < 0))
    || (value.activityDate !== undefined && !isLocalDate(value.activityDate))
    || (value.lastActiveDate !== undefined && value.lastActiveDate !== null && !isLocalDate(value.lastActiveDate))
    || (value.reviewCards !== undefined && (!Array.isArray(value.reviewCards) || value.reviewCards.some(card => {
      if (!isRecord(card) || typeof card.lessonId !== 'string' || typeof card.sentenceId !== 'string') return true;
      const lessonSentences = sentenceIds.get(card.lessonId);
      return !lessonSentences || !lessonSentences.has(card.sentenceId)
        || card.id !== `${card.lessonId}:${card.sentenceId}`
        || typeof card.dueAt !== 'string' || !Number.isFinite(Date.parse(card.dueAt))
        || typeof card.intervalDays !== 'number' || !Number.isFinite(card.intervalDays) || card.intervalDays < 0
        || typeof card.ease !== 'number' || !Number.isFinite(card.ease) || card.ease < 1.3 || card.ease > 3
        || !Number.isInteger(card.repetitions) || (card.repetitions as number) < 0
        || !Number.isInteger(card.lapses) || (card.lapses as number) < 0
        || (card.lastReviewedAt !== undefined && (typeof card.lastReviewedAt !== 'string' || !Number.isFinite(Date.parse(card.lastReviewedAt))));
    })))) {
    throw new Error('پیشرفت انگلیسی در فایل پشتیبان معتبر نیست؛ دادهٔ فعلی تغییر نکرد.');
  }
  return normalizeProgress(value as Partial<CourseProgress>);
}

async function readRaw(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(KEY);
  }
  return AsyncStorage.getItem(KEY);
}

async function writeRaw(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(KEY, value);
    return;
  }
  await AsyncStorage.setItem(KEY, value);
}

function previousLocalDateKey(date = new Date()): string {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return localDateKey(previous);
}

function addDailyActivity(progress: CourseProgress, minutes: number, now = new Date()): CourseProgress {
  const today = localDateKey(now);
  const alreadyActiveToday = progress.lastActiveDate === today;
  const nextStreak = alreadyActiveToday
    ? progress.currentStreak
    : progress.lastActiveDate === previousLocalDateKey(now)
      ? progress.currentStreak + 1
      : 1;
  return {
    ...progress,
    activityDate: today,
    todayMinutes: Math.min(progress.dailyGoalMinutes, progress.todayMinutes + minutes),
    totalMinutes: progress.totalMinutes + minutes,
    currentStreak: nextStreak,
    longestStreak: Math.max(progress.longestStreak, nextStreak),
    lastActiveDate: today,
    updatedAt: now.toISOString(),
  };
}

async function progressUserId(): Promise<string | null> {
  const { data: session } = await supabase.auth.getSession();
  // Do not silently create an anonymous identity for personal learning data.
  // Existing authenticated sessions (including a user who deliberately joined
  // an education workspace) continue to use their own RLS-protected row.
  return session.session?.user.id ?? null;
}

async function uploadProgress(progress: CourseProgress): Promise<void> {
  try {
    const userId = await progressUserId();
    if (!userId) return;
    await supabase.from('learning_progress').upsert({
      user_id: userId,
      progress,
      updated_at: progress.updatedAt,
    }, { onConflict: 'user_id' });
  } catch {
    // Local progress remains authoritative while offline and is retried later.
  }
}

async function saveProgress(progress: CourseProgress): Promise<CourseProgress> {
  await writeRaw(JSON.stringify(progress));
  await uploadProgress(progress);
  void import('./personalLearningSync')
    .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
    .catch(() => undefined);
  return progress;
}

export async function getCourseProgress(): Promise<CourseProgress> {
  try {
    const raw = await readRaw();
    let progress = normalizeProgress(raw ? JSON.parse(raw) as Partial<CourseProgress> : {});
    const userId = await progressUserId();
    if (userId) {
      const { data } = await supabase
        .from('learning_progress')
        .select('progress,updated_at')
        .eq('user_id', userId)
        .maybeSingle();
      if (data?.progress) {
        const remote = parseCourseProgressBackup(data.progress);
        // A newly linked email account may already have progress from another
        // device. Union completion/review evidence with this device instead of
        // replacing one side based only on timestamps.
        const merged = mergeSharedCourseProgress(progress, remote);
        const changed = JSON.stringify(merged) !== JSON.stringify(remote);
        progress = merged;
        if (changed) await uploadProgress(progress);
      } else {
        await uploadProgress(progress);
      }
    }
    await writeRaw(JSON.stringify(progress));
    return progress;
  } catch {
    try {
      const raw = await readRaw();
      return normalizeProgress(raw ? JSON.parse(raw) as Partial<CourseProgress> : {});
    } catch {
      return initialProgress();
    }
  }
}

export async function completeSentenceLesson(lessonId: string, nextLessonId?: string): Promise<CourseProgress> {
  const current = await getCourseProgress();
  const cardMap = new Map(current.reviewCards.map((card) => [card.id, card]));
  cardsForLesson(lessonId).forEach((card) => {
    if (!cardMap.has(card.id)) cardMap.set(card.id, card);
  });
  const completedLessonIds = Array.from(new Set([...current.completedLessonIds, lessonId]));
  const completedSet = new Set(completedLessonIds);
  const currentIndex = SENTENCE_LESSONS.findIndex(lesson => lesson.id === current.currentLessonId);
  const requestedNextIndex = nextLessonId ? SENTENCE_LESSONS.findIndex(lesson => lesson.id === nextLessonId) : -1;
  const advancesPath = requestedNextIndex > currentIndex;
  const nextUncompletedLesson = advancesPath
    ? SENTENCE_LESSONS.slice(requestedNextIndex).find(lesson => !completedSet.has(lesson.id))
    : undefined;
  const next = addDailyActivity({
    ...current,
    completedLessonIds,
    reviewCards: Array.from(cardMap.values()),
    // Historical coverage is retained, but page completion is not evidence of word mastery.
    learnedEssential504Words: current.learnedEssential504Words,
    currentLessonId: advancesPath ? nextUncompletedLesson?.id ?? nextLessonId! : current.currentLessonId,
  }, 0);
  return saveProgress(next);
}

export async function getDueReviewCards(now = new Date()): Promise<SentenceReviewCard[]> {
  const progress = await getCourseProgress();
  const validIds = new Set(
    SENTENCE_LESSONS.flatMap((lesson) => lesson.sentences.map((sentence) => reviewCardId(lesson.id, sentence.id))),
  );
  return progress.reviewCards
    .filter((card) => validIds.has(card.id) && new Date(card.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

export async function rateReviewCard(
  cardId: string,
  rating: ReviewRating,
  now = new Date(),
): Promise<SentenceReviewCard | null> {
  const progress = await getCourseProgress();
  const card = progress.reviewCards.find((item) => item.id === cardId);
  if (!card) return null;

  let intervalDays = card.intervalDays;
  let ease = card.ease;
  let repetitions = card.repetitions + 1;
  let lapses = card.lapses;
  let dueInMs: number;

  if (rating === 'again') {
    intervalDays = 0;
    ease = Math.max(1.3, ease - 0.2);
    repetitions = 0;
    lapses += 1;
    dueInMs = 10 * MINUTE;
  } else if (rating === 'hard') {
    intervalDays = intervalDays < 1 ? 1 : Math.max(1, Math.ceil(intervalDays * 1.2));
    ease = Math.max(1.3, ease - 0.1);
    dueInMs = intervalDays * DAY;
  } else if (rating === 'easy') {
    intervalDays = intervalDays < 1 ? 4 : Math.max(4, Math.round(intervalDays * (ease + 0.35)));
    ease = Math.min(3, ease + 0.1);
    dueInMs = intervalDays * DAY;
  } else {
    intervalDays = card.repetitions === 0 ? 1 : card.repetitions === 1 ? 3 : Math.max(3, Math.round(intervalDays * ease));
    dueInMs = intervalDays * DAY;
  }

  const updated: SentenceReviewCard = {
    ...card,
    intervalDays,
    ease,
    repetitions,
    lapses,
    lastReviewedAt: now.toISOString(),
    dueAt: new Date(now.getTime() + dueInMs).toISOString(),
  };
  const next = addDailyActivity({
    ...progress,
    reviewCards: progress.reviewCards.map((item) => item.id === cardId ? updated : item),
  }, 0, now);
  await saveProgress(next);
  return updated;
}

export async function addSentenceToReview(sentenceId: string, lessonId?: string): Promise<void> {
  const lesson = lessonId
    ? SENTENCE_LESSONS.find((item) => item.id === lessonId)
    : SENTENCE_LESSONS.find((item) => item.sentences.some((sentence) => sentence.id === sentenceId));
  if (!lesson) return;
  const current = await getCourseProgress();
  const id = reviewCardId(lesson.id, sentenceId);
  if (current.reviewCards.some((card) => card.id === id)) return;
  const card = cardsForLesson(lesson.id).find((item) => item.id === id);
  if (!card) return;
  await saveProgress({
    ...current,
    reviewCards: [...current.reviewCards, card],
    updatedAt: new Date().toISOString(),
  });
}
