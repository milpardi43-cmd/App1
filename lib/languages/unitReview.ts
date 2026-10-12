import { FIRST_MEETING } from './germanFirstMeeting';
import { FIRST_MEETING_REVIEW_LESSONS, firstMeetingReview } from './firstMeetingReview';
import { createCourseProgressStore } from '../createCourseProgressStore';
import type { LearningUnit } from './learningDesign';
import type { LearningLesson } from './types';

const stores = new Map<string, ReturnType<typeof createCourseProgressStore>>();
export function unitReviewLessons(unit: LearningUnit): LearningLesson[] {
  if (unit.id===FIRST_MEETING.id && unit.version===1) return FIRST_MEETING_REVIEW_LESSONS;
  return unit.lessons.map(l=>({id:l.id,title:l.title,situation:l.situationFa,durationMinutes:8,dialogue:l.dialogue,
    sentences:l.examples.map((e,i)=>({id:`${l.id}-example-${i+1}`,text:e.text,fa:e.fa,pronunciation:'',vocabulary:[]}))}));
}
export function reviewForUnit(unit: LearningUnit) {
  if (unit.id===FIRST_MEETING.id && unit.version===1) return firstMeetingReview;
  const key=`sentence_review_${unit.id}_v${unit.version}`;
  let store=stores.get(key);
  if (!store) { store=createCourseProgressStore({
    key, lessons:unitReviewLessons(unit), cloudSync:false, recordEstimatedTime:unit.language!=='en',
    afterLocalSave: unit.language==='de' ? () => {
      void import('../personalLearningSync')
        .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
        .catch(() => undefined);
    } : undefined,
  }); stores.set(key,store); }
  return store;
}
