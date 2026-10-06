// Local progress engine for the English-learning mini-app.
// Everything is stored on the device itself (no server needed) so the app
// works fully offline and never touches app 1's data.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { LESSONS, TOTAL_WORDS, wordKey } from './langContent';

export interface DailyStat {
  reviewed: number;
  xp: number;
}

export interface ProgressState {
  xp: number;
  // wordKey -> mastery strength: 0 = unseen, 1 = seen once, 2 = learned
  mastery: Record<string, number>;
  // 'YYYY-MM-DD' -> that day's activity
  daily: Record<string, DailyStat>;
  totalReviews: number;
}

const KEY = 'lang_progress_v1';

const EMPTY: ProgressState = { xp: 0, mastery: {}, daily: {}, totalReviews: 0 };

let cache: ProgressState | null = null;

function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const dd = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export async function loadProgress(): Promise<ProgressState> {
  if (cache) return cache;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as ProgressState) : { ...EMPTY, mastery: {}, daily: {} };
  } catch {
    cache = { ...EMPTY, mastery: {}, daily: {} };
  }
  return cache;
}

async function persist(): Promise<void> {
  if (!cache) return;
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // storage unavailable — keep the in-memory copy so the session still works
  }
}

/** Record that a word was reviewed. knew=true strengthens it, false resets it. */
export async function recordReview(lessonId: number, wordIndex: number, knew: boolean): Promise<void> {
  const p = await loadProgress();
  const key = wordKey(lessonId, wordIndex);
  const now = (p.mastery[key] ?? 0);
  p.mastery[key] = knew ? Math.min(2, now + 1) : 0;

  const today = dayKey();
  const stat = p.daily[today] ?? { reviewed: 0, xp: 0 };
  stat.reviewed += 1;
  const gained = knew ? 10 : 2;
  stat.xp += gained;
  p.xp += gained;
  p.daily[today] = stat;
  p.totalReviews += 1;
  await persist();
}

/** Record quiz answer for a word. */
export async function recordQuizAnswer(lessonId: number, wordIndex: number, correct: boolean): Promise<void> {
  const p = await loadProgress();
  const key = wordKey(lessonId, wordIndex);
  const now = (p.mastery[key] ?? 0);
  p.mastery[key] = correct ? Math.min(2, now + 1) : Math.max(0, now - 1);

  const today = dayKey();
  const stat = p.daily[today] ?? { reviewed: 0, xp: 0 };
  const gained = correct ? 10 : 0;
  stat.xp += gained;
  p.xp += gained;
  p.daily[today] = stat;
  p.totalReviews += 1;
  await persist();
}

export interface Overview {
  xp: number;
  streak: number;
  todayReviewed: number;
  wordsSeen: number;      // mastery >= 1
  wordsMastered: number;  // mastery >= 2
  totalWords: number;
  weekXp: number[];
}

export async function getOverview(): Promise<Overview> {
  const p = await loadProgress();
  let seen = 0;
  let mastered = 0;
  for (const v of Object.values(p.mastery)) {
    if (v >= 1) seen += 1;
    if (v >= 2) mastered += 1;
  }

  // streak = consecutive days with reviewed > 0, ending today or yesterday
  let streak = 0;
  const cursor = new Date();
  // walking back — if today has no activity, the streak can still include yesterday
  if (!p.daily[dayKey(cursor)]?.reviewed) {
    cursor.setDate(cursor.getDate() - 1);
  } else {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  while (p.daily[dayKey(cursor)]?.reviewed) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const weekXp: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    weekXp.push(p.daily[dayKey(d)]?.xp ?? 0);
  }

  return {
    xp: p.xp,
    streak,
    todayReviewed: p.daily[dayKey()]?.reviewed ?? 0,
    wordsSeen: seen,
    wordsMastered: mastered,
    totalWords: TOTAL_WORDS,
    weekXp,
  };
}

/** A lesson is completed when every word has been seen at least once. */
export async function isLessonCompleted(lessonId: number): Promise<boolean> {
  const p = await loadProgress();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return false;
  return lesson.words.every((_, i) => (p.mastery[wordKey(lessonId, i)] ?? 0) >= 1);
}

/** First lesson that is not completed yet (the one to "continue"). */
export async function getContinueLessonId(): Promise<number> {
  const p = await loadProgress();
  for (const lesson of LESSONS) {
    const done = lesson.words.every((_, i) => (p.mastery[wordKey(lesson.id, i)] ?? 0) >= 1);
    if (!done) return lesson.id;
  }
  return LESSONS[LESSONS.length - 1].id;
}

export async function getLessonMastery(lessonId: number): Promise<number[]> {
  const p = await loadProgress();
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return [];
  return lesson.words.map((_, i) => p.mastery[wordKey(lessonId, i)] ?? 0);
}
