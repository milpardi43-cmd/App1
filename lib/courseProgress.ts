import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { SENTENCE_LESSONS } from './courseContent';
import { getEssential504WordsForLesson } from './essential504';
import { supabase } from './supabase';

const KEY = 'sentence_course_progress_v1';
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
  /** Internal coverage only; this does not add a new section to the lesson UI. */
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
  if (session.session?.user.id) return session.session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return null;
  return data.user?.id ?? null;
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
        const remote = normalizeProgress(data.progress as Partial<CourseProgress>);
        if (new Date(data.updated_at).getTime() > new Date(progress.updatedAt).getTime()) progress = remote;
        else await uploadProgress(progress);
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
  const next = addDailyActivity({
    ...current,
    completedLessonIds: Array.from(new Set([...current.completedLessonIds, lessonId])),
    reviewCards: Array.from(cardMap.values()),
    learnedEssential504Words: Array.from(
      new Set([
        ...current.learnedEssential504Words,
        ...getEssential504WordsForLesson(lessonId),
      ]),
    ),
    currentLessonId: nextLessonId ?? current.currentLessonId,
  }, 8);
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
  }, 1, now);
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
