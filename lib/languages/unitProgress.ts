import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { LearningExercise, LearningUnit } from './learningDesign';
import { FIRST_MEETING } from './germanFirstMeeting';
export const UNIT_PROGRESS_KEY = 'learning_unit_de_first_meeting_v1';
export interface ExerciseResult { exerciseId: string; correct: boolean; assisted: boolean }
export interface UnitAttempt { id: string; finishedAt: string; results: ExerciseResult[] }
export interface UnitProgress {
  version: 1;
  activities: Record<string, UnitAttempt>;
  missions: UnitAttempt[];
}
export function normalizeGermanAnswer(answer: string): string {
  return answer.normalize('NFC').toLocaleLowerCase('de-DE').replace(/ß/g, 'ss')
    .replace(/[.,!?;:„“”"'…]/g, ' ').replace(/\s+/g, ' ').trim();
}
export function normalizeEnglishAnswer(answer:string):string {
  return answer.normalize('NFC').toLowerCase().replace(/[’‘]/g,"'").replace(/[.,!?;:„“”"…]/g,' ').replace(/\s+/g,' ').trim();
}
export function evaluateExercise(exercise: LearningExercise, answer: string, language:'de'|'en'='de'): boolean {
  if (!answer.trim()) return false;
  if (exercise.kind === 'choice') return answer === exercise.correctChoice;
  const expected = exercise.kind === 'order' ? [exercise.answer] : exercise.acceptedAnswers;
  const normalize=language==='en'?normalizeEnglishAnswer:normalizeGermanAnswer;
  return expected.some(item => normalize(item) === normalize(answer));
}
export function scoreAttempt(results: ExerciseResult[], exercises: LearningExercise[]) {
  const byId = new Map<string, ExerciseResult>();
  // First submission is authoritative; duplicate entries cannot inflate the score.
  for (const result of results) if (!byId.has(result.exerciseId)) byId.set(result.exerciseId, result);
  const independent = exercises.filter(e => byId.get(e.id)?.correct === true && byId.get(e.id)?.assisted === false);
  const threshold = Math.ceil(exercises.length * .8);
  return { independent: independent.length, total: exercises.length, threshold,
    meetsPracticeTarget: exercises.length > 0 && independent.length >= threshold,
    needsPractice: exercises.filter(e => !independent.some(ok => ok.id === e.id)),
  };
}
function blank(): UnitProgress { return { version: 1, activities: {}, missions: [] }; }
function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function validAttempt(value: unknown, exercises: LearningExercise[]): value is UnitAttempt {
  if (!value || typeof value !== 'object') return false;
  const v = value as UnitAttempt;
  return typeof v.id === 'string' && typeof v.finishedAt === 'string' && Number.isFinite(Date.parse(v.finishedAt))
    && Array.isArray(v.results) && v.results.length === exercises.length
    && new Set(v.results.map(r => r?.exerciseId)).size === exercises.length
    && v.results.every(r => r && exercises.some(e => e.id === r.exerciseId) && typeof r.correct === 'boolean' && typeof r.assisted === 'boolean');
}
export function parseUnitProgress(value: unknown, unit: LearningUnit): UnitProgress {
  if (!isRecord(value) || value.version !== 1
    || (value.activities !== undefined && !isRecord(value.activities))
    || (value.missions !== undefined && !Array.isArray(value.missions))) {
    throw new Error('پیشرفت واحد آموزشی معتبر نیست؛ دادهٔ محلی تغییر نکرد.');
  }
  const result = blank();
  const activities = (value.activities ?? {}) as Record<string, unknown>;
  for (const [lessonId, attempt] of Object.entries(activities)) {
    const lesson = unit.lessons.find(item => item.id === lessonId);
    if (!lesson || !validAttempt(attempt, lesson.exercises)) throw new Error('فعالیت یک درس در پیشرفت ابری معتبر نیست.');
    result.activities[lessonId] = attempt;
  }
  const missions = (value.missions ?? []) as unknown[];
  if (missions.some(attempt => !validAttempt(attempt, unit.mission))) throw new Error('تمرین پایانی در پیشرفت ابری معتبر نیست.');
  result.missions = missions as UnitAttempt[];
  return result;
}

export function mergeUnitProgressSnapshots(current: UnitProgress, incoming: UnitProgress, unit: LearningUnit): UnitProgress {
  const activities: Record<string, UnitAttempt> = { ...incoming.activities };
  for (const [lessonId, candidate] of Object.entries(current.activities)) {
    const prior = activities[lessonId];
    if (!prior || Date.parse(candidate.finishedAt) > Date.parse(prior.finishedAt)
      || (candidate.finishedAt === prior.finishedAt && JSON.stringify(candidate) > JSON.stringify(prior))) activities[lessonId] = candidate;
  }
  const missions = new Map<string, UnitAttempt>();
  for (const attempt of [...incoming.missions, ...current.missions]) {
    const prior = missions.get(attempt.id);
    if (!prior || Date.parse(attempt.finishedAt) > Date.parse(prior.finishedAt)
      || (attempt.finishedAt === prior.finishedAt && JSON.stringify(attempt) > JSON.stringify(prior))) missions.set(attempt.id, attempt);
  }
  return parseUnitProgress({ version: 1, activities, missions: [...missions.values()]
    .sort((a, b) => Date.parse(a.finishedAt) - Date.parse(b.finishedAt) || a.id.localeCompare(b.id)).slice(-20) }, unit);
}

export function unitProgressKey(unit: LearningUnit = FIRST_MEETING) { return unit.id === FIRST_MEETING.id && unit.version === 1 ? UNIT_PROGRESS_KEY : `learning_unit_${unit.id}_v${unit.version}`; }
async function readRaw(unit: LearningUnit): Promise<string | null> {
  const key = unitProgressKey(unit);
  return Platform.OS === 'web' ? (typeof window === 'undefined' ? null : window.localStorage.getItem(key)) : AsyncStorage.getItem(key);
}
async function writeRaw(unit: LearningUnit, raw: string): Promise<void> {
  const key = unitProgressKey(unit);
  if (Platform.OS === 'web') {
    if (typeof window === 'undefined') throw new Error('Local storage unavailable');
    window.localStorage.setItem(key, raw);
  } else await AsyncStorage.setItem(key, raw);
}
export async function getUnitProgress(unit: LearningUnit = FIRST_MEETING): Promise<UnitProgress> {
  const raw = Platform.OS === 'web' ? (typeof window === 'undefined' ? null : window.localStorage.getItem(unitProgressKey(unit))) : await AsyncStorage.getItem(unitProgressKey(unit));
  if (!raw) return blank();
  let v: unknown;
  try { v = JSON.parse(raw); } catch { return blank(); }
  if (!v || typeof v !== 'object' || (v as UnitProgress).version !== 1) return blank();
  const value = v as UnitProgress;
  const result = blank();
  for (const lesson of unit.lessons) {
    const attempt = value.activities?.[lesson.id];
    if (validAttempt(attempt, lesson.exercises)) result.activities[lesson.id] = attempt;
  }
  result.missions = Array.isArray(value.missions) ? value.missions.filter(a => validAttempt(a, unit.mission)).slice(-20) : [];
  return result;
}
// Serialize local writes in this JS runtime; the account-level sync wrapper handles cloud merge separately.
let writing: Promise<unknown> = Promise.resolve();
function scheduleAccountSync() {
  void import('../personalLearningSync')
    .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
    .catch(() => undefined);
}
function update(unit: LearningUnit, change: (value: UnitProgress) => void): Promise<void> {
  const next = writing.catch(() => undefined).then(async () => {
    const value = await getUnitProgress(unit); change(value);
    await writeRaw(unit, JSON.stringify(value));
    if (unit.language === 'de' || unit.language === 'en') scheduleAccountSync();
  });
  writing = next;
  return next;
}
export function mergeRemoteUnitProgress(unit: LearningUnit, remote: unknown): Promise<UnitProgress> {
  const next = writing.catch(() => undefined).then(async () => {
    const raw = await readRaw(unit);
    let current = blank();
    if (raw !== null) {
      let parsed: unknown;
      try { parsed = JSON.parse(raw); }
      catch { throw new Error('دادهٔ محلی پیشرفت این واحد خوانا نیست؛ برای جلوگیری از حذف، ادغام انجام نشد.'); }
      current = parseUnitProgress(parsed, unit);
    }
    const incoming = parseUnitProgress(remote, unit);
    const merged = mergeUnitProgressSnapshots(current, incoming, unit);
    if (JSON.stringify(merged) !== JSON.stringify(current)) await writeRaw(unit, JSON.stringify(merged));
    return merged;
  });
  writing = next;
  return next;
}
export function saveLessonActivity(lessonId: string, attempt: UnitAttempt, unit: LearningUnit = FIRST_MEETING): Promise<void> {
  const lesson = unit.lessons.find(l => l.id === lessonId);
  if (!lesson || !validAttempt(attempt, lesson.exercises)) return Promise.reject(new Error('Incomplete lesson activity'));
  return update(unit, p => { p.activities[lessonId] = attempt; });
}
export function saveUnitMission(attempt: UnitAttempt, unit: LearningUnit = FIRST_MEETING): Promise<void> {
  if (!validAttempt(attempt, unit.mission)) return Promise.reject(new Error('Incomplete mission'));
  return update(unit, p => {
    if (!unit.lessons.every(l => p.activities[l.id])) throw new Error('Complete unit activities first');
    p.missions = [...p.missions.filter(a => a.id !== attempt.id), attempt].slice(-20); });
}
