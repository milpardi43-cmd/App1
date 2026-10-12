import { unitHref, unitReviewHref, unitPracticeHref } from './guidedCourses';
import type { LearningExercise, LearningUnit, Skill } from './learningDesign';
import type { UnitAttempt, UnitProgress } from './unitProgress';
import type { LearningSession } from './sessionStore';

export interface Evidence {
  exercise: LearningExercise;
  correct: boolean;
  assisted: boolean;
  source: 'practice' | 'mission';
  at: string;
}
/** Latest observation per exercise. Retrying does not manufacture a larger sample size. */
export function collectEvidence(unit: LearningUnit, progress: UnitProgress): Evidence[] {
  const records: Evidence[] = [];
  const add = (attempt: UnitAttempt, exercises: LearningExercise[], source: Evidence['source']) => {
    for (const result of attempt.results) {
      const exercise = exercises.find(e => e.id === result.exerciseId);
      if (exercise) records.push({ exercise, correct: result.correct, assisted: result.assisted, source, at: attempt.finishedAt });
    }
  };
  for (const lesson of unit.lessons) if (progress.activities[lesson.id]) add(progress.activities[lesson.id], lesson.exercises, 'practice');
  for (const mission of progress.missions) add(mission, unit.mission, 'mission');
  const latest = new Map<string, Evidence>();
  records.sort((a,b) => Date.parse(a.at) - Date.parse(b.at)).forEach(e => latest.set(e.exercise.id, e));
  return [...latest.values()];
}
export function skillEvidence(unit: LearningUnit, progress: UnitProgress) {
  const evidence = collectEvidence(unit, progress);
  return (['listening','reading','writing'] as Skill[]).map(skill => {
    const sample = evidence.filter(e => e.exercise.skill === skill);
    return { skill, observed: sample.length, independent: sample.filter(e => e.correct && !e.assisted).length,
      assisted: sample.filter(e => e.assisted).length, needsPractice: sample.filter(e => !e.correct || e.assisted).length };
  });
}
export function objectiveEvidence(unit: LearningUnit, progress: UnitProgress) {
  const evidence = collectEvidence(unit, progress);
  return unit.objectives.map(objective => {
    const sample = evidence.filter(e => e.exercise.objectiveId === objective.id);
    return { ...objective, observed: sample.length, independent: sample.filter(e => e.correct && !e.assisted).length,
      needsPractice: sample.filter(e => !e.correct || e.assisted).length,
      missionIndependent: sample.filter(e => e.source === 'mission' && e.correct && !e.assisted).length };
  });
}
export interface LearningAction {
  type: 'resume' | 'review' | 'lesson' | 'repair' | 'mission' | 'consolidate';
  title: string;
  reason: string;
  href: string;
  minutes: number;
}
const lessonHref = (unit: LearningUnit, id: string) => unitPracticeHref(unit, id);
export function planNextStep(unit: LearningUnit, progress: UnitProgress, dueCount: number, resume: LearningSession | null): LearningAction {
  const allDone = unit.lessons.every(l => progress.activities[l.id]);
  const alreadyFinished = resume && (resume.lessonId === null ? progress.missions.some(a => a.id === resume.attemptId) : progress.activities[resume.lessonId]?.id === resume.attemptId);
  if (resume && !alreadyFinished && resume.unitId === unit.id && resume.contentVersion === unit.version && (resume.lessonId === null ? allDone : unit.lessons.some(l => l.id === resume.lessonId))) {
    return { type: 'resume', title: 'ادامه جلسه نیمه‌تمام', reason: 'همان مرحله و پاسخ‌های ثبت‌شده در پیش‌نویس را ادامه می‌دهید؛ کمک‌های قبلی هم حفظ می‌شوند.', href: resume.lessonId ? lessonHref(unit, resume.lessonId) : unitPracticeHref(unit), minutes: 5 };
  }
  if (dueCount > 0) return { type: 'review', title: `مرور جمله‌های موعدرسیده`, reason: 'اول چیزهایی را که قبلاً خوانده‌اید به یاد بیاورید؛ بعد به محتوای تازه برگردید.', href: unitReviewHref(unit), minutes: Math.min(10, Math.max(2, Math.ceil(dueCount / 2))) };
  const nextLesson = unit.lessons.find(l => !progress.activities[l.id] && l.prerequisiteIds.every(id => progress.activities[id]));
  if (nextLesson) return { type: 'lesson', title: nextLesson.title, reason: nextLesson.canDoFa, href: lessonHref(unit, nextLesson.id), minutes: 8 };
  const latestMission = [...progress.missions].sort((a,b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt))[0];
  if (latestMission) {
    const weak = unit.mission.filter(e => { const r = latestMission.results.find(x => x.exerciseId === e.id); return !r?.correct || r.assisted; });
    const repairLesson = unit.lessons.find(l => weak.some(e => l.objectiveIds.includes(e.objectiveId)) && (!progress.activities[l.id] || Date.parse(progress.activities[l.id].finishedAt) <= Date.parse(latestMission.finishedAt)));
    if (repairLesson) return { type: 'repair', title: `تقویت: ${repairLesson.title}`, reason: 'در آخرین مأموریت، یکی از هدف‌های این درس نیاز به تمرین داشت یا با کمک پاسخ داده شد. پس از تمرین دوباره، مأموریت را تکرار کنید.', href: lessonHref(unit, repairLesson.id), minutes: 6 };
    if (!weak.length) return { type: 'consolidate', title: 'تثبیت آموخته‌ها و تمرین گفتاری', reason: 'در آخرین مأموریت همه پاسخ‌ها مستقل پذیرفته شدند. اکنون تمرین گفتاری همین واحد را بدون متن انجام دهید؛ گفتار هنوز ارزیابی نشده است.', href: unitHref(unit), minutes: 5 };
  }
  return { type: 'mission', title: `مأموریت مستقل: ${unit.title}`, reason: latestMission ? 'تمرین جبرانی انجام شده؛ حالا بدون الگو دوباره پاسخ بدهید.' : 'فعالیت‌های درس‌ها تمام شده‌اند؛ وقت بررسی پاسخ مستقل است.', href: unitPracticeHref(unit), minutes: 8 };
}
