import { EVERYDAY_COMPLETION_A } from './courseContentEverydayCompletionA';
import { EVERYDAY_COMPLETION_B } from './courseContentEverydayCompletionB';
import { EVERYDAY_COMPLETION_C } from './courseContentEverydayCompletionC';
import { EVERYDAY_COMPLETION_D } from './courseContentEverydayCompletionD';
import { EVERYDAY_COMPLETION_E } from './courseContentEverydayCompletionE';
import { EVERYDAY_COMPLETION_F } from './courseContentEverydayCompletionF';

/** 820 sentence-level additions that bring the 20 ordered Everyday lessons to 50 each. */
export const EVERYDAY_COMPLETION_SENTENCES = {
  ...EVERYDAY_COMPLETION_A,
  ...EVERYDAY_COMPLETION_B,
  ...EVERYDAY_COMPLETION_C,
  ...EVERYDAY_COMPLETION_D,
  ...EVERYDAY_COMPLETION_E,
  ...EVERYDAY_COMPLETION_F,
} as const;
