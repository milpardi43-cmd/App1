/** Content contracts independent of screens, storage, or any AI provider. */
export type Skill = 'listening' | 'reading' | 'writing';
interface ExerciseBase {
  id: string;
  objectiveId: string;
  skill: Skill;
  promptFa: string;
  explanationFa: string;
}
export interface ChoiceExercise extends ExerciseBase {
  kind: 'choice';
  /** Visible source passage for reading, not a listening transcript. */
  readingText?: string;
  audioText?: string;
  transcriptFa?: string;
  choices: Array<{ id: string; label: string }>;
  correctChoice: string;
}
export interface OrderExercise extends ExerciseBase {
  kind: 'order';
  tokens: string[];
  answer: string;
}
export interface WriteExercise extends ExerciseBase {
  kind: 'write';
  acceptedAnswers: string[];
  sample: string;
  hintFa: string;
  taskNoteFa?: string;
}
export type LearningExercise = ChoiceExercise | OrderExercise | WriteExercise;
export interface GuidedLesson {
  id: string;
  title: string;
  canDoFa: string;
  objectiveIds: string[];
  prerequisiteIds: string[];
  situationFa: string;
  dialogue: Array<{ speaker: string; text: string; fa: string }>;
  examples: Array<{ text: string; fa: string }>;
  patternFa: string;
  pronunciationFa: string;
  exercises: LearningExercise[];
}
export interface LearningUnit {
  id: string;
  version: number;
  language: 'de' | 'en';
  level: 'Pre-A1' | 'A1' | 'A2' | 'B1';
  title: string;
  objectives: Array<{ id: string; canDoFa: string }>;
  lessons: GuidedLesson[];
  mission: LearningExercise[];
  oralMissionFa: string;
}
