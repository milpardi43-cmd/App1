import type { LearningUnit } from './learningDesign';
import * as german from './germanUnits';
// The guided curriculum belongs to German. English uses its original /lang course.
export function unitsForLanguage(language?:string):readonly LearningUnit[]{return language==='de'?german.GERMAN_UNITS:[];}
export function findGuidedUnit(language?:string,id?:string){return language==='de'?german.findGermanUnit(id):undefined;}
export function unitForLesson(language:string,id?:string){return unitsForLanguage(language).find(u=>u.lessons.some(l=>l.id===id));}
export const unitHref=german.unitHref;
export const unitPracticeHref=german.unitPracticeHref;
export const unitReviewHref=german.unitReviewHref;
export const repairTarget=german.repairTarget;
