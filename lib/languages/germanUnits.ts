import { FOUNDATION_UNITS, COMPLETION_A1_UNITS } from './germanCompletionContent';
export { FOUNDATION_UNITS } from './germanCompletionContent';
import { LEVEL_EXAMS, LEVEL_EXAM_TARGETS } from './germanLevelExams';
import { FIRST_MEETING } from './germanFirstMeeting';
import { FAMILY_UNIT, TIME_UNIT } from './germanNextUnits';
import { SHOPPING_UNIT, HOME_UNIT } from './germanShoppingHome';
import { WORK_UNIT, TRANSPORT_UNIT } from './germanWorkTransport';
import { NEEDS_UNIT } from './germanNeeds';
import { A1_RECAP, RECAP_TARGETS } from './germanRecap';
import { SKILLS_UNIT } from './germanSkills';
import { A2_PAST_UNIT } from './germanA2Past';
import { CONTACT_UNIT, CALENDAR_UNIT } from './germanA1Foundations';
import { INTERESTS_UNIT, GRAMMAR_UNIT } from './germanA1EverydayGaps';
import { REAL_LIFE_UNIT } from './germanA1RealLife';
import { A1_CHECKPOINTS, CHECKPOINT_TARGETS } from './a1Checkpoint';
import type { LearningUnit } from './learningDesign';

/** Published units only. Planned levels never resolve as playable content. */
export const GERMAN_UNITS: readonly LearningUnit[] = [FIRST_MEETING, FAMILY_UNIT, TIME_UNIT, SHOPPING_UNIT, HOME_UNIT, WORK_UNIT, TRANSPORT_UNIT, NEEDS_UNIT, SKILLS_UNIT, CONTACT_UNIT, CALENDAR_UNIT, INTERESTS_UNIT, GRAMMAR_UNIT, REAL_LIFE_UNIT, A2_PAST_UNIT, ...COMPLETION_A1_UNITS, ...FOUNDATION_UNITS];
/** Every objective-only German assessment whose result uses the same local UnitProgress store. */
export const ALL_GERMAN_PROGRESS_UNITS: readonly LearningUnit[] = [...GERMAN_UNITS, A1_RECAP, ...A1_CHECKPOINTS, ...LEVEL_EXAMS];
export const GERMAN_A1_UNITS = GERMAN_UNITS.filter(u=>u.level==='A1');
export const GERMAN_A2_UNITS = GERMAN_UNITS.filter(u=>u.level==='A2');
export const GERMAN_GUIDED_LESSON_COUNT = GERMAN_UNITS.reduce((n,u)=>n+u.lessons.length,0);
export function findGermanUnit(id?: string): LearningUnit | undefined {
  return id === undefined ? FIRST_MEETING : [...GERMAN_UNITS,A1_RECAP,...A1_CHECKPOINTS,...LEVEL_EXAMS].find(u=>u.id===id);
}
export function unitForLesson(id?: string) { return GERMAN_UNITS.find(u=>u.lessons.some(l=>l.id===id)); }
export const unitHref = (unit: LearningUnit) => unit.id===A1_RECAP.id ? '/learn/de/recap' : [...A1_CHECKPOINTS,...LEVEL_EXAMS].some(u=>u.id===unit.id) ? `/learn/de/recap?exam=${unit.id}` : `/learn/de/unit?unit=${encodeURIComponent(unit.id)}`;
export const unitReviewHref = (unit: LearningUnit) => unit.id===FIRST_MEETING.id ? '/learn/de/review?course=first-meeting' : `/learn/de/review?unit=${encodeURIComponent(unit.id)}`;
export const unitPracticeHref = (unit: LearningUnit, lessonId?: string) => `/learn/de/practice?unit=${encodeURIComponent(unit.id)}&${lessonId ? `lesson=${encodeURIComponent(lessonId)}` : 'mission=1'}`;
export function previousGermanUnit(unit: LearningUnit) { if(unit.id===A2_PAST_UNIT.id)return REAL_LIFE_UNIT;const sequence=GERMAN_UNITS.filter(u=>u.level===unit.level);return sequence[sequence.findIndex(u=>u.id===unit.id)-1]; }

export function repairTarget(unit: LearningUnit, objectiveId: string) {
  if(LEVEL_EXAMS.some(u=>u.id===unit.id))return LEVEL_EXAM_TARGETS[objectiveId];
  if(unit.id===A1_RECAP.id)return RECAP_TARGETS[objectiveId];
  if(A1_CHECKPOINTS.some(u=>u.id===unit.id))return CHECKPOINT_TARGETS[objectiveId];
  const lesson=unit.lessons.find(l=>l.objectiveIds.includes(objectiveId));
  return lesson ? {unitId:unit.id,lessonId:lesson.id} : undefined;
}
