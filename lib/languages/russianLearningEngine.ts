import { RUSSIAN_LESSONS, RUSSIAN_LESSON_STAGES } from './russian';
import {
  findRussianCefrBand,
  findRussianSentenceCurriculumEntry,
  russianCefrForLesson,
  type RussianCefrLevel,
} from './russianCurriculum';

export type RussianLearningPhaseId = 'receive' | 'notice' | 'reconstruct' | 'transfer' | 'retrieve';
export type RussianPracticeOutcome = 'matched' | 'confirmed-error' | 'unrecognized'
  | 'self-rated-again' | 'self-rated-hard' | 'self-rated-good' | 'self-rated-easy';
export type RussianAssessmentSource = 'curated-exact-match' | 'self-report' | 'human-review';

export interface RussianLearningPhaseDefinition {
  id: RussianLearningPhaseId;
  titleFa: string;
  purposeFa: string;
  existingStageIds: readonly string[];
  implementation: 'available' | 'partial' | 'planned';
  requiresIndependentOutput: boolean;
}

/** Five-step pedagogical cycle, mapped onto (but not replacing) the existing nine UI stages. */
export const RUSSIAN_LEARNING_CYCLE: readonly RussianLearningPhaseDefinition[] = [
  {
    id: 'receive',
    titleFa: 'دریافت جمله',
    purposeFa: 'شنیدن جمله همراه متن و معنی.',
    existingStageIds: ['situation', 'core-sentences', 'listening', 'shadowing'],
    implementation: 'available',
    requiresIndependentOutput: false,
  },
  {
    id: 'notice',
    titleFa: 'درک الگو',
    purposeFa: 'دیدن الگو، نقش‌های زبانی و واژه‌ها در همان مثال.',
    existingStageIds: ['vocabulary', 'grammar-through-usage'],
    implementation: 'partial',
    requiresIndependentOutput: false,
  },
  {
    id: 'reconstruct',
    titleFa: 'بازسازی جمله',
    purposeFa: 'ساخت دوبارهٔ جمله از واژه‌های همان درس.',
    existingStageIds: ['sentence-building'],
    implementation: 'available',
    requiresIndependentOutput: false,
  },
  {
    id: 'transfer',
    titleFa: 'تولید جملهٔ تازه',
    purposeFa: 'تغییر کنترل‌شدهٔ فاعل، زمان، مکان یا منظور و ساخت جمله در بافتی تازه.',
    existingStageIds: ['conversation'],
    implementation: 'partial',
    requiresIndependentOutput: true,
  },
  {
    id: 'retrieve',
    titleFa: 'بازیابی و مرور',
    purposeFa: 'یادآوری بدون دیدن پاسخ و بازگشت جمله‌های دشوار با فاصله.',
    existingStageIds: ['review'],
    implementation: 'partial',
    requiresIndependentOutput: true,
  },
];

export interface RussianLessonLearningPlan {
  lessonId: string;
  cefrLevelId: RussianCefrLevel;
  unitId: string;
  objectiveId: string;
  phases: Array<RussianLearningPhaseDefinition & {
    sentenceIds: readonly string[];
    availableTaskCount: number;
    transferPromptIds: readonly string[];
  }>;
}

/**
 * Builds a non-visual lesson plan from the current content. No missing production
 * tasks are invented: the transfer step is explicitly partial until reviewed tasks exist.
 */
export function buildRussianLessonLearningPlan(lessonId: string): RussianLessonLearningPlan | undefined {
  const lesson = RUSSIAN_LESSONS.find(item => item.id === lessonId);
  const cefrLevelId = russianCefrForLesson(lessonId);
  if (!lesson || !cefrLevelId) return undefined;
  const sentenceIds = lesson.sentences.map(sentence => sentence.id);
  const metadata = lesson.sentences.map(sentence => findRussianSentenceCurriculumEntry(sentence.id));
  const transferPromptIds = metadata.flatMap(entry => entry?.transferPromptIds ?? []);
  const existingStageIds = new Set<string>(RUSSIAN_LESSON_STAGES.map(stage => stage.id));
  const phases = RUSSIAN_LEARNING_CYCLE.map(phase => {
    if (phase.existingStageIds.some(stageId => !existingStageIds.has(stageId))) {
      throw new Error(`Russian learning phase ${phase.id} references a missing UI stage.`);
    }
    return {
      ...phase,
      sentenceIds: phase.id === 'notice'
        ? lesson.sentences.filter(sentence => sentence.pattern || sentence.vocabulary.length).map(sentence => sentence.id)
        : phase.id === 'transfer'
          ? metadata.filter(entry => (entry?.transferPromptIds.length ?? 0) > 0).map(entry => entry!.sentenceId)
          : sentenceIds,
      transferPromptIds: phase.id === 'transfer' ? transferPromptIds : [],
      availableTaskCount: phase.id === 'transfer'
        ? transferPromptIds.length
        : phase.id === 'retrieve'
          ? sentenceIds.length + (lesson.checks?.length ?? 0)
          : sentenceIds.length,
    };
  });
  return {
    lessonId,
    cefrLevelId,
    unitId: `unit-${lessonId}`,
    objectiveId: `objective-${lessonId}`,
    phases,
  };
}

export interface RussianAnswerEvaluation {
  outcome: 'matched' | 'unrecognized' | 'empty';
  source: 'curated-exact-match';
  matchedAnswer: string | null;
  /** Alternate Russian answers are not rejected unless explicitly curated. */
  requiresHumanReview: boolean;
}

/**
 * Conservative local comparison only. It normalizes case, punctuation and spacing,
 * but deliberately keeps Ё distinct from Е and does not use fuzzy/AI scoring.
 */
export function normalizeRussianAnswer(value: string): string {
  return value.normalize('NFC')
    .toLocaleLowerCase('ru-RU')
    .replace(/[\u0301\u0341]/g, '')
    .replace(/[«»„“”"'`]/g, ' ')
    .replace(/[.,!?;:…]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function evaluateRussianAnswer(answer: string, acceptedAnswers: readonly string[]): RussianAnswerEvaluation {
  const normalizedAnswer = normalizeRussianAnswer(answer);
  if (!normalizedAnswer) return { outcome: 'empty', source: 'curated-exact-match', matchedAnswer: null, requiresHumanReview: false };
  const matchedAnswer = acceptedAnswers.find(candidate => normalizeRussianAnswer(candidate) === normalizedAnswer) ?? null;
  return matchedAnswer
    ? { outcome: 'matched', source: 'curated-exact-match', matchedAnswer, requiresHumanReview: false }
    : { outcome: 'unrecognized', source: 'curated-exact-match', matchedAnswer: null, requiresHumanReview: true };
}

export interface RussianAssessmentEvidence {
  objectiveId: string;
  cefrLevelId: RussianCefrLevel;
  phaseId: RussianLearningPhaseId;
  outcome: RussianPracticeOutcome;
  source: RussianAssessmentSource;
  assisted: boolean;
  novelContext: boolean;
  promptReviewed: boolean;
  independentTransfer: boolean;
  createdAt: string;
}

export type RussianReadinessStatus = 'planned' | 'insufficient-transfer-evidence' | 'needs-practice' | 'ready-for-human-review';

export interface RussianBandReadiness {
  cefrLevelId: RussianCefrLevel;
  status: RussianReadinessStatus;
  requiredObjectiveIds: string[];
  coveredObjectiveIds: string[];
  missingObjectiveIds: string[];
  needsPracticeObjectiveIds: string[];
  /** This is an internal evidence checkpoint, never a CEFR certificate or level pass. */
  officialLevelClaim: false;
}

/**
 * Lesson completion and multiple-choice checks cannot pass a level. Every current
 * objective needs an independently produced, reviewed transfer example before it
 * can be marked ready for human review.
 */
export function assessRussianBandReadiness(
  cefrLevelId: RussianCefrLevel,
  evidence: readonly RussianAssessmentEvidence[],
): RussianBandReadiness {
  const band = findRussianCefrBand(cefrLevelId);
  const requiredObjectiveIds = band?.units.filter(unit => unit.status === 'available').map(unit => unit.objectiveId) ?? [];
  if (!band || band.status === 'planned' || requiredObjectiveIds.length === 0) {
    return {
      cefrLevelId,
      status: 'planned',
      requiredObjectiveIds,
      coveredObjectiveIds: [],
      missingObjectiveIds: requiredObjectiveIds,
      needsPracticeObjectiveIds: [],
      officialLevelClaim: false,
    };
  }

  const transferEvidence = evidence.filter(item => item.cefrLevelId === cefrLevelId && item.phaseId === 'transfer');
  const latestByObjective = new Map<string, RussianAssessmentEvidence>();
  for (const item of transferEvidence) {
    const current = latestByObjective.get(item.objectiveId);
    if (!current || Date.parse(item.createdAt) >= Date.parse(current.createdAt)) latestByObjective.set(item.objectiveId, item);
  }

  const coveredObjectiveIds = requiredObjectiveIds.filter(objectiveId => {
    const latest = latestByObjective.get(objectiveId);
    return !!latest && latest.outcome === 'matched' && latest.source !== 'self-report'
      && !latest.assisted && latest.novelContext && latest.promptReviewed && latest.independentTransfer;
  });
  const coveredSet = new Set(coveredObjectiveIds);
  const missingObjectiveIds = requiredObjectiveIds.filter(objectiveId => !coveredSet.has(objectiveId));
  const needsPracticeObjectiveIds = requiredObjectiveIds.filter(objectiveId => {
    const latest = latestByObjective.get(objectiveId);
    return !!latest && (latest.outcome === 'confirmed-error' || latest.outcome.startsWith('self-rated-'));
  });
  const allCovered = coveredObjectiveIds.length === requiredObjectiveIds.length;
  const status: RussianReadinessStatus = allCovered
    ? 'ready-for-human-review'
    : needsPracticeObjectiveIds.length > 0
      ? 'needs-practice'
      : 'insufficient-transfer-evidence';

  return {
    cefrLevelId,
    status,
    requiredObjectiveIds,
    coveredObjectiveIds,
    missingObjectiveIds,
    needsPracticeObjectiveIds,
    officialLevelClaim: false,
  };
}
