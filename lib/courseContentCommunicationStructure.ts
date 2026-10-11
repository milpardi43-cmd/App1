export interface CommunicationCurriculumUnit {
  id: string;
  titleFa: string;
  titleEn: string;
  lessonIds: readonly string[];
}

/**
 * Stable unit map for Communication English. It follows the same lesson →
 * thematic-unit relationship used by the German sentence course, while keeping
 * every already-published lesson ID and its course order intact.
 */
export const COMMUNICATION_MODULES: readonly CommunicationCurriculumUnit[] = [
  {
    id: 'discussion-and-evidence',
    titleFa: 'بحث، نظر و شواهد',
    titleEn: 'Discussion & Evidence',
    lessonIds: ['communication-university-discussion', 'communication-public-discussion'],
  },
  {
    id: 'professional-collaboration',
    titleFa: 'همکاری و ارتباط حرفه‌ای',
    titleEn: 'Professional Collaboration',
    lessonIds: [
      'communication-working-with-a-client',
      'communication-giving-constructive-feedback',
      'communication-negotiating-project-priorities',
    ],
  },
  {
    id: 'health-and-community',
    titleFa: 'سلامت و مشارکت اجتماعی',
    titleEn: 'Health & Community',
    lessonIds: ['communication-health-checkup', 'communication-community-change'],
  },
  {
    id: 'plans-and-disagreement',
    titleFa: 'برنامه‌ریزی و حل اختلاف',
    titleEn: 'Plans & Disagreement',
    lessonIds: ['communication-changing-plans', 'communication-resolving-workplace-disagreement'],
  },
  {
    id: 'technology-and-digital-safety',
    titleFa: 'فناوری و امنیت دیجیتال',
    titleEn: 'Technology & Digital Safety',
    lessonIds: ['communication-solving-a-technical-problem', 'communication-avoiding-an-online-scam'],
  },
  {
    id: 'experiences-and-storytelling',
    titleFa: 'تجربه‌ها و داستان‌گویی',
    titleEn: 'Experiences & Storytelling',
    lessonIds: ['communication-mountain-trip'],
  },
  {
    id: 'presentations-and-networking',
    titleFa: 'ارائه و شبکه‌سازی',
    titleEn: 'Presentations & Networking',
    lessonIds: ['communication-presenting-project-findings', 'communication-networking-at-an-event'],
  },
  {
    id: 'professional-writing',
    titleFa: 'نوشتار حرفه‌ای',
    titleEn: 'Professional Writing',
    lessonIds: ['communication-writing-a-professional-email'],
  },
] as const;

export interface CommunicationLessonUnit {
  unitId: string;
  unitTitleFa: string;
  unitTitleEn: string;
}

export const COMMUNICATION_LESSON_UNIT: Readonly<Record<string, CommunicationLessonUnit>> =
  Object.fromEntries(COMMUNICATION_MODULES.flatMap(unit => unit.lessonIds.map(lessonId => [
    lessonId,
    { unitId: unit.id, unitTitleFa: unit.titleFa, unitTitleEn: unit.titleEn },
  ]))) as Readonly<Record<string, CommunicationLessonUnit>>;
