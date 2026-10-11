import type { CourseSentence } from './courseContent';
import { SURVIVAL_COMPLETION_PART_A } from './courseContentSurvivalCompletionA';
import { SURVIVAL_COMPLETION_PART_B } from './courseContentSurvivalCompletionB';
import { SURVIVAL_COMPLETION_PART_C } from './courseContentSurvivalCompletionC';
import { SURVIVAL_COMPLETION_PART_D } from './courseContentSurvivalCompletionD';
import { SURVIVAL_COMPLETION_PART_E } from './courseContentSurvivalCompletionE';
import { SURVIVAL_COMPLETION_PART_F } from './courseContentSurvivalCompletionF';

/** Curated additions to bring each published Survival lesson to fifty examples. */
export const SURVIVAL_COMPLETION_SENTENCES: Readonly<Record<string, readonly CourseSentence[]>> = {
  ...SURVIVAL_COMPLETION_PART_A,
  ...SURVIVAL_COMPLETION_PART_B,
  ...SURVIVAL_COMPLETION_PART_C,
  ...SURVIVAL_COMPLETION_PART_D,
  ...SURVIVAL_COMPLETION_PART_E,
  ...SURVIVAL_COMPLETION_PART_F,
};
