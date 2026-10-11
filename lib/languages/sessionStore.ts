import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { LearningUnit } from './learningDesign';
import type { ExerciseResult } from './unitProgress';

export const SESSION_STORAGE_KEY = 'language_learning_sessions_v1';
export interface LearningSession {
  schemaVersion: 1;
  /** Optional presentation-only state; old drafts remain valid. */
  presentation?: { listening: boolean; outro: 4 | 5 | null };
  unitId: string;
  contentVersion: number;
  lessonId: string | null;
  attemptId: string;
  stage: 'context' | 'pattern' | 'exercise';
  index: number;
  answer: string;
  ordered: number[];
  assisted: boolean;
  feedback: boolean | null;
  results: ExerciseResult[];
  updatedAt: string;
}
export const sessionKey = (unit: LearningUnit, lessonId: string | null) => `${unit.language}:${unit.id}:v${unit.version}:${lessonId ?? 'mission'}`;
export function validSession(value: unknown, unit: LearningUnit, lessonId: string | null): value is LearningSession {
  if (!value || typeof value !== 'object') return false;
  const s = value as LearningSession;
  const lesson = lessonId === null ? null : unit.lessons.find(l => l.id === lessonId);
  if (lessonId !== null && !lesson) return false;
  const exercises = lesson?.exercises ?? unit.mission;
  if (s.schemaVersion !== 1 || s.unitId !== unit.id || s.contentVersion !== unit.version || s.lessonId !== lessonId
    || typeof s.attemptId !== 'string' || !s.attemptId || s.attemptId.length > 150
    || !['context', 'pattern', 'exercise'].includes(s.stage) || (lessonId === null && s.stage !== 'exercise')
    || !Number.isInteger(s.index) || s.index < 0 || s.index >= exercises.length
    || typeof s.answer !== 'string' || s.answer.length > 300 || typeof s.assisted !== 'boolean'
    || (s.feedback !== null && typeof s.feedback !== 'boolean')
    || typeof s.updatedAt !== 'string' || !Number.isFinite(Date.parse(s.updatedAt))
    || !Array.isArray(s.results) || !Array.isArray(s.ordered)) return false;
  if(s.presentation!==undefined&&(!s.presentation||typeof s.presentation.listening!=='boolean'||![null,4,5].includes(s.presentation.outro)))return false;
  if(s.presentation?.outro!=null&&(s.stage!=='exercise'||s.index!==exercises.length-1||s.feedback===null))return false;
  const e = exercises[s.index];
  if (e.kind !== 'order' && s.ordered.length) return false;
  if (e.kind === 'order' && (!s.ordered.every(i => Number.isInteger(i) && i >= 0 && i < e.tokens.length) || new Set(s.ordered).size !== s.ordered.length)) return false;
  if (s.results.length > s.index + 1 || new Set(s.results.map(r => r?.exerciseId)).size !== s.results.length) return false;
  if (!s.results.every(r => r && typeof r.correct === 'boolean' && typeof r.assisted === 'boolean' && exercises.slice(0, s.index + 1).some(x => x.id === r.exerciseId))) return false;
  if (!exercises.slice(0, s.index).every(x => s.results.some(r => r.exerciseId === x.id))) return false;
  if (s.stage !== 'exercise' && (s.index !== 0 || s.results.length || s.feedback !== null)) return false;
  if (lessonId === null && s.feedback !== null) return false;
  const current = s.results.find(r => r.exerciseId === e.id);
  if (s.feedback !== null && (!current || current.correct !== s.feedback)) return false;
  if (lessonId !== null && current && s.feedback === null) return false;
  if (current && current.assisted && !s.assisted) return false;
  return true;
}
async function read(): Promise<Record<string, unknown>> {
  const raw = Platform.OS === 'web'
    ? typeof window === 'undefined' ? null : window.localStorage.getItem(SESSION_STORAGE_KEY)
    : await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return {};
  try { const value = JSON.parse(raw); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  catch { return {}; }
}
let writes: Promise<unknown> = Promise.resolve();
function update(change: (data: Record<string, unknown>) => void): Promise<void> {
  const next = writes.catch(() => undefined).then(async () => {
    const data = await read(); change(data);
    const raw = JSON.stringify(data);
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw new Error('Storage unavailable');
      window.localStorage.setItem(SESSION_STORAGE_KEY, raw);
    } else await AsyncStorage.setItem(SESSION_STORAGE_KEY, raw);
  });
  writes = next; return next;
}
export async function loadSession(unit: LearningUnit, lessonId: string | null): Promise<LearningSession | null> {
  await writes.catch(() => undefined);
  const value = (await read())[sessionKey(unit, lessonId)];
  return validSession(value, unit, lessonId) ? value : null;
}
export function saveSession(unit: LearningUnit, snapshot: LearningSession): Promise<void> {
  if (!validSession(snapshot, unit, snapshot.lessonId)) return Promise.reject(new Error('Invalid session snapshot'));
  const copy: LearningSession = JSON.parse(JSON.stringify(snapshot));
  return update(data => { data[sessionKey(unit, copy.lessonId)] = copy; });
}
export function clearSession(unit: LearningUnit, lessonId: string | null): Promise<void> {
  return update(data => { delete data[sessionKey(unit, lessonId)]; });
}
export async function latestSession(unit: LearningUnit, completedAttemptIds: string[] = []): Promise<LearningSession | null> {
  await writes.catch(() => undefined);
  const data = await read();
  return [...unit.lessons.map(l => l.id), null].flatMap(id => {
    const value = data[sessionKey(unit, id)]; return validSession(value, unit, id) && !completedAttemptIds.includes(value.attemptId) ? [value] : [];
  }).sort((a,b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))[0] ?? null;
}
