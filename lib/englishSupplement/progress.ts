import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  ENGLISH_A1_COURSE_UNITS,
  ENGLISH_FOUNDATION_UNITS,
  ENGLISH_SUPPLEMENT,
  SKILLS,
  type EnglishUnitLevel,
  type Skill,
  type Task,
} from './content';
import { ASSESSMENTS, ASSESSMENT_PASS_PERCENT } from './assessments';

export const SUPPLEMENT_KEY = 'english_supplement_evidence_v1';
export interface Evidence { skill: Skill; correct: boolean; attempts: number; heard: boolean }
export interface AssessmentAnswer { correct: boolean; heard: boolean }
export interface AssessmentAttempt {
  id: string;
  level: EnglishUnitLevel;
  startedAt: string;
  completedAt?: string;
  abandonedAt?: string;
  answers: Record<string, AssessmentAnswer>;
}
export interface SupplementProgress {
  version: 1;
  evidence: Record<string, Evidence>;
  drafts: Record<string, string>;
  /** Optional when loading records created before the end-of-level checks were added. */
  assessmentAttempts: AssessmentAttempt[];
  checklists: Record<string, Record<string, boolean>>;
}

export const emptyProgress = (): SupplementProgress => ({ version: 1, evidence: {}, drafts: {}, assessmentAttempts: [], checklists: {} });

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function isTime(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

export function parseProgress(raw: string | null): SupplementProgress {
  if (raw === null) return emptyProgress();
  const p = JSON.parse(raw) as Partial<SupplementProgress> | null;
  if (!p || p.version !== 1 || !isRecord(p.evidence) || !isRecord(p.drafts)
    || Object.values(p.drafts).some(v => typeof v !== 'string' || v.length > 4000)
    || Object.values(p.evidence).some(e => !e || !Object.hasOwn(SKILLS, e.skill) || typeof e.correct !== 'boolean'
      || typeof e.heard !== 'boolean' || !Number.isSafeInteger(e.attempts) || e.attempts < 1)) {
    throw Error('نتایج ذخیره‌شده خوانده نشد؛ برای حفظ اطلاعات، بازنویسی متوقف شد.');
  }

  // Missing fields are expected for v1 records saved before the course was expanded.
  const assessmentAttempts = p.assessmentAttempts ?? [];
  const checklists = p.checklists ?? {};
  if (!Array.isArray(assessmentAttempts) || !isRecord(checklists)) {
    throw Error('سابقهٔ دوره معتبر نیست؛ برای حفظ اطلاعات، بازنویسی متوقف شد.');
  }
  const attemptsAreValid = assessmentAttempts.every(attempt => {
    if (!attempt || !['Foundation', 'A1'].includes(attempt.level) || typeof attempt.id !== 'string' || !attempt.id
      || !isTime(attempt.startedAt) || (attempt.completedAt !== undefined && !isTime(attempt.completedAt))
      || (attempt.abandonedAt !== undefined && !isTime(attempt.abandonedAt)) || !isRecord(attempt.answers)) return false;
    const knownTaskIds = new Set(ASSESSMENTS[attempt.level as EnglishUnitLevel].map(task => task.id));
    return Object.entries(attempt.answers).every(([id, answer]) => knownTaskIds.has(id) && !!answer
      && typeof answer.correct === 'boolean' && typeof answer.heard === 'boolean');
  });
  const checklistsAreValid = Object.values(checklists).every(checklist => isRecord(checklist)
    && Object.values(checklist).every(value => typeof value === 'boolean'));
  if (!attemptsAreValid || !checklistsAreValid) {
    throw Error('سابقهٔ سنجش یا خودارزیابی معتبر نیست؛ برای حفظ اطلاعات، بازنویسی متوقف شد.');
  }
  return { ...p, version: 1, evidence: p.evidence as Record<string, Evidence>, drafts: p.drafts as Record<string, string>, assessmentAttempts, checklists };
}

export async function loadSupplement() {
  return parseProgress(Platform.OS === 'web'
    ? (typeof window === 'undefined' ? null : window.localStorage.getItem(SUPPLEMENT_KEY))
    : await AsyncStorage.getItem(SUPPLEMENT_KEY));
}

let queue: Promise<unknown> = Promise.resolve();
function scheduleAccountSync() {
  void import('../personalLearningSync')
    .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
    .catch(() => undefined);
}
function update(mutate: (p: SupplementProgress) => void, sync = true): Promise<SupplementProgress> {
  const work = queue.then(async () => {
    const p = await loadSupplement();
    mutate(p);
    const raw = JSON.stringify(p);
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') throw Error('ذخیره‌سازی در دسترس نیست.');
      window.localStorage.setItem(SUPPLEMENT_KEY, raw);
    } else await AsyncStorage.setItem(SUPPLEMENT_KEY, raw);
    if (sync) scheduleAccountSync();
    return p;
  });
  queue = work.catch(() => {});
  return work;
}

export function recordEvidence(task: Task, correct: boolean, heard: boolean) {
  if (task.skill === 'listening' && !heard) return Promise.reject(Error('ابتدا پخش کامل صدا لازم است.'));
  return update(p => {
    p.evidence[task.id] = { skill: task.skill, correct, heard, attempts: (p.evidence[task.id]?.attempts ?? 0) + 1 };
  });
}

export function saveDraft(id: string, value: string) {
  // Free-text answers stay on this device; only learning evidence and outcomes sync.
  return update(p => { p.drafts[id] = value.slice(0, 4000); }, false);
}
export function saveChecklist(id: string, item: string, checked: boolean) {
  return update(p => { p.checklists[id] = { ...p.checklists[id], [item]: checked }; });
}

export function unitPassed(id: string, p: SupplementProgress) {
  const unit = ENGLISH_SUPPLEMENT.find(item => item.id === id);
  return !!unit && [...unit.practice, ...unit.checkpoint].every(task => p.evidence[task.id]?.correct
    && (task.skill !== 'listening' || p.evidence[task.id]?.heard));
}
export function foundationCoursePassed(p: SupplementProgress) {
  return ENGLISH_FOUNDATION_UNITS.every(unit => unitPassed(unit.id, p));
}
export function a1CoursePassed(p: SupplementProgress) {
  return ENGLISH_A1_COURSE_UNITS.every(unit => unitPassed(unit.id, p));
}
export function assessmentScore(attempt: AssessmentAttempt) {
  const tasks = ASSESSMENTS[attempt.level];
  const correct = tasks.filter(task => attempt.answers[task.id]?.correct
    && (task.skill !== 'listening' || attempt.answers[task.id]?.heard)).length;
  return { correct, total: tasks.length, percent: tasks.length ? Math.round(correct / tasks.length * 100) : 0 };
}
export function assessmentBreakdown(attempt: AssessmentAttempt) {
  const tasks = ASSESSMENTS[attempt.level];
  return (Object.keys(SKILLS) as Skill[]).map(skill => {
    const subset = tasks.filter(task => task.skill === skill);
    const correct = subset.filter(task => attempt.answers[task.id]?.correct
      && (task.skill !== 'listening' || attempt.answers[task.id]?.heard)).length;
    return { skill, label: SKILLS[skill], correct, total: subset.length, percent: subset.length ? Math.round(correct / subset.length * 100) : 0 };
  });
}
export function assessmentPassed(level: EnglishUnitLevel, p: SupplementProgress) {
  return p.assessmentAttempts.some(attempt => attempt.level === level && !!attempt.completedAt
    && assessmentScore(attempt).percent >= ASSESSMENT_PASS_PERCENT);
}
export function canStartAssessment(level: EnglishUnitLevel, p: SupplementProgress) {
  if (level === 'Foundation') return foundationCoursePassed(p);
  return foundationCoursePassed(p) && assessmentPassed('Foundation', p) && a1CoursePassed(p);
}
export function canOpenUnit(id: string, p: SupplementProgress) {
  const index = ENGLISH_SUPPLEMENT.findIndex(unit => unit.id === id);
  if (index < 0) return false;
  if (unitPassed(id, p)) return true; // Existing completed lessons remain accessible after course additions.
  if (index === 0) return true;
  if (!unitPassed(ENGLISH_SUPPLEMENT[index - 1].id, p)) return false;
  return ENGLISH_SUPPLEMENT[index].level !== 'A1' || assessmentPassed('Foundation', p);
}

function makeAttemptId(level: EnglishUnitLevel) {
  return `${level.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
export function startAssessment(level: EnglishUnitLevel, restart = false): Promise<AssessmentAttempt> {
  let selected!: AssessmentAttempt;
  return update(p => {
    const active = [...p.assessmentAttempts].reverse().find(attempt => attempt.level === level && !attempt.completedAt && !attempt.abandonedAt);
    if (active && !restart) {
      selected = active;
      return;
    }
    if (active && restart) active.abandonedAt = new Date().toISOString();
    selected = { id: makeAttemptId(level), level, startedAt: new Date().toISOString(), answers: {} };
    p.assessmentAttempts.push(selected);
  }).then(() => selected);
}

export function recordAssessmentAnswer(attemptId: string, task: Task, correct: boolean, heard: boolean) {
  const owner = (['Foundation', 'A1'] as EnglishUnitLevel[]).find(level => ASSESSMENTS[level].some(item => item.id === task.id));
  if (!owner || task.skill === 'listening' && !heard) return Promise.reject(Error('پاسخ سنجش معتبر نیست یا فایل شنیداری کامل نشده است.'));
  return update(p => {
    const attempt = p.assessmentAttempts.find(item => item.id === attemptId && item.level === owner && !item.completedAt && !item.abandonedAt);
    if (!attempt) throw Error('تلاش فعال پیدا نشد؛ پاسخ جدید ثبت نشد.');
    attempt.answers[task.id] = { correct, heard };
  });
}

export function finishAssessment(attemptId: string) {
  return update(p => {
    const attempt = p.assessmentAttempts.find(item => item.id === attemptId && !item.completedAt && !item.abandonedAt);
    if (!attempt) throw Error('تلاش فعال پیدا نشد.');
    const tasks = ASSESSMENTS[attempt.level];
    const complete = tasks.every(task => !!attempt.answers[task.id]
      && (task.skill !== 'listening' || attempt.answers[task.id].heard));
    if (!complete) throw Error('برای پایان سنجش، به همهٔ سؤال‌ها پاسخ بدهید و فایل‌های شنیداری را کامل گوش کنید.');
    attempt.completedAt = new Date().toISOString();
  });
}

export function latestAssessment(p: SupplementProgress, level: EnglishUnitLevel) {
  return [...p.assessmentAttempts].reverse().find(attempt => attempt.level === level && !!attempt.completedAt);
}
export function skillReport(p: SupplementProgress, skill: Skill) {
  const entries = Object.values(p.evidence).filter(e => e.skill === skill);
  return { answered: entries.length, correct: entries.filter(e => e.correct).length, attempts: entries.reduce((sum, e) => sum + e.attempts, 0) };
}
