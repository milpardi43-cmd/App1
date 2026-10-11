import { COMMUNICATION_COMPLETION_A } from './courseContentCommunicationCompletionA';
import { COMMUNICATION_COMPLETION_B } from './courseContentCommunicationCompletionB';
import { COMMUNICATION_COMPLETION_C } from './courseContentCommunicationCompletionC';
import { COMMUNICATION_COMPLETION_D } from './courseContentCommunicationCompletionD';
import { COMMUNICATION_COMPLETION_E } from './courseContentCommunicationCompletionE';
import { COMMUNICATION_COMPLETION_F } from './courseContentCommunicationCompletionF';

/** Stable source order: the original nine lessons remain first and unchanged. */
export const COMMUNICATION_COURSE_LESSON_IDS = [
  'communication-university-discussion',
  'communication-working-with-a-client',
  'communication-health-checkup',
  'communication-community-change',
  'communication-changing-plans',
  'communication-solving-a-technical-problem',
  'communication-mountain-trip',
  'communication-public-discussion',
  'communication-avoiding-an-online-scam',
  'communication-giving-constructive-feedback',
  'communication-negotiating-project-priorities',
  'communication-presenting-project-findings',
  'communication-resolving-workplace-disagreement',
  'communication-networking-at-an-event',
  'communication-writing-a-professional-email',
] as const;

/** Forty-four linked examples per lesson, including each newly added lesson. */
export const COMMUNICATION_COMPLETION_SENTENCES = {
  ...COMMUNICATION_COMPLETION_A,
  ...COMMUNICATION_COMPLETION_B,
  ...COMMUNICATION_COMPLETION_C,
  ...COMMUNICATION_COMPLETION_D,
  ...COMMUNICATION_COMPLETION_E,
  ...COMMUNICATION_COMPLETION_F,
};
