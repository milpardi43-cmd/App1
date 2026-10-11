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
function validAttempt(value: unknown, exercises: LearningExercise[]): value is UnitAttempt {
  if (!value || typeof value !== 'object') return false;
  const v = value as UnitAttempt;
  return typeof v.id === 'string' && typeof v.finishedAt === 'string' && Number.isFinite(Date.parse(v.finishedAt))
    && Array.isArray(v.results) && v.results.length === exercises.length
    && new Set(v.results.map(r => r?.exerciseId)).size === exercises.length
    && v.results.every(r => r && exercises.some(e => e.id === r.exerciseId) && typeof r.correct === 'boolean' && typeof r.assisted === 'boolean');
}
export function unitProgressKey(unit: LearningUnit = FIRST_MEETING) { return unit.id === FIRST_MEETING.id && unit.version === 1 ? UNIT_PROGRESS_KEY : `learning_unit_${unit.id}_v${unit.version}`; }
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
// Serialize writes in this JS runtime; cross-device sync is intentionally not claimed.
let writing: Promise<unknown> = Promise.resolve();
function update(unit: LearningUnit, change: (value: UnitProgress) => void): Promise<void> {
  const next = writing.catch(() => undefined).then(async () => {
    const value = await getUnitProgress(unit); change(value);
    const raw = JSON.stringify(value);
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw new Error('Local storage unavailable');
      window.localStorage.setItem(unitProgressKey(unit), raw);
    } else await AsyncStorage.setItem(unitProgressKey(unit), raw);
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
