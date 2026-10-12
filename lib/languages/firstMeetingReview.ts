import { FIRST_MEETING } from './germanFirstMeeting';
import { createCourseProgressStore } from '../createCourseProgressStore';
import type { LearningLesson } from './types';
export const FIRST_MEETING_REVIEW_LESSONS: LearningLesson[] = FIRST_MEETING.lessons.map(lesson => ({
  id: lesson.id,
  title: lesson.title,
  situation: lesson.situationFa,
  durationMinutes: 7,
  dialogue: lesson.dialogue,
  sentences: lesson.examples.map((example, i) => ({ id: `${lesson.id}-example-${i + 1}`, text: example.text, fa: example.fa, pronunciation: '', vocabulary: [] })),
}));
export const firstMeetingReview = createCourseProgressStore({
  key: 'sentence_review_de_first_meeting_v1', lessons: FIRST_MEETING_REVIEW_LESSONS, cloudSync: false,
  afterLocalSave: () => {
    void import('../personalLearningSync')
      .then(({ schedulePersonalLearningSync }) => schedulePersonalLearningSync())
      .catch(() => undefined);
  },
});
