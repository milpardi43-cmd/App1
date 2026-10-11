import { GERMAN_A1_UNITS, FOUNDATION_UNITS } from './germanUnits';
import type { LearningUnit } from './learningDesign';
import type { UnitProgress } from './unitProgress';
import type { LearningSession } from './sessionStore';
import { planNextStep } from './learningPlanner';

export interface UnitSnapshot { unit: LearningUnit; progress: UnitProgress; due: number; resume: LearningSession | null }
/** Input order is published curriculum order, not object-key order. No score certifies a CEFR level. */
export function planCourseStep(snapshots: UnitSnapshot[]) {
  if (!snapshots.length) return null;
  const actions = snapshots.map(s=>({...s,action:planNextStep(s.unit,s.progress,s.due,s.resume)}));
  const resumable = actions.filter(s=>s.action.type==='resume').sort((a,b)=>Date.parse(b.resume!.updatedAt)-Date.parse(a.resume!.updatedAt));
  const selected = resumable[0] ?? actions.find(s=>s.action.type==='review') ?? actions.find(s=>s.action.type!=='consolidate') ?? actions[actions.length-1];
  const levelUnits=snapshots[0].unit.level==='Pre-A1'?FOUNDATION_UNITS:snapshots[0].unit.level==='A1'?GERMAN_A1_UNITS:[];
  if(actions.every(s=>s.action.type==='consolidate') && levelUnits.length>0 && levelUnits.every(u=>snapshots.some(s=>s.unit.id===u.id))) {
    const foundation=snapshots[0].unit.level==='Pre-A1';
    const exam=foundation?'de-zero-final':'de-a1-final';
    return {unit:selected.unit,action:{...selected.action,title:foundation?'سنجش پایان مقدماتی':'سنجش جامع پایان A1',reason:`همه درس‌ها و مأموریت‌های برنامه داخلی ${foundation?'مقدماتی':'A1'} انجام شده‌اند؛ اکنون سنجش پایانی را انجام دهید. نتیجه، گواهی رسمی یا اثبات تسلط نیست.`,href:`/learn/de/recap?exam=${exam}`,minutes:12}};
  }
  return { unit: selected.unit, action: selected.action };
}
