import { RUSSIAN_LESSONS, type RussianLevelId } from './russian';

export type RussianCefrLevel = 'A1' | 'A2' | 'B1' | 'B2';
export type RussianCurriculumStatus = 'starter-only' | 'planned';
export type RussianUnitStatus = 'available' | 'planned';
export type RussianGrammarFeatureId = 'grammatical-cases' | 'verb-aspect' | 'agreement';

/**
 * A planning layer over the existing five-level Russian UI. Foundation and Survival
 * are grouped under the internal A1 band; this is not a certified CEFR placement.
 */
export const RUSSIAN_LEVEL_TO_CEFR: Readonly<Record<RussianLevelId, RussianCefrLevel>> = {
  0: 'A1',
  1: 'A1',
  2: 'A2',
  3: 'B1',
  4: 'B2',
};

export const RUSSIAN_CEFR_POLICY = {
  basis: 'internal-curriculum-planning',
  officialLevelClaim: false,
  officialAssessment: false,
  lessonCompletionMeansMastery: false,
  readinessEvidence: 'independent-transfer-in-a-new-context',
} as const;

export interface RussianCurriculumUnit {
  id: string;
  levelId: RussianCefrLevel;
  titleFa: string;
  outcomeFa: string;
  objectiveId: string;
  status: RussianUnitStatus;
  lessonIds: readonly string[];
  legacyLevelId?: RussianLevelId;
  /** Existing quizzes are formative checks, not independent transfer evidence. */
  lessonCheckCount: number;
  independentTransferPrompts: number;
}

export interface RussianCefrBand {
  id: RussianCefrLevel;
  titleFa: string;
  goalFa: string;
  legacyLevelIds: readonly RussianLevelId[];
  status: RussianCurriculumStatus;
  units: readonly RussianCurriculumUnit[];
}

const A1_UNITS: readonly RussianCurriculumUnit[] = RUSSIAN_LESSONS.map(lesson => ({
  id: `unit-${lesson.id}`,
  levelId: 'A1',
  titleFa: lesson.title,
  outcomeFa: lesson.situation,
  objectiveId: `objective-${lesson.id}`,
  status: 'available',
  lessonIds: [lesson.id],
  legacyLevelId: lesson.levelId,
  lessonCheckCount: lesson.checks?.length ?? 0,
  independentTransferPrompts: 0,
}));

function plannedUnit(levelId: RussianCefrLevel, id: string, titleFa: string, outcomeFa: string): RussianCurriculumUnit {
  return {
    id: `unit-${levelId.toLowerCase()}-${id}`,
    levelId,
    titleFa,
    outcomeFa,
    objectiveId: `objective-${levelId.toLowerCase()}-${id}`,
    status: 'planned',
    lessonIds: [],
    lessonCheckCount: 0,
    independentTransferPrompts: 0,
  };
}

/** Four internal CEFR planning bands; future bands are outlines, not published lessons. */
export const RUSSIAN_CEFR_BANDS: readonly RussianCefrBand[] = [
  {
    id: 'A1',
    titleFa: 'جمله‌سازی پایه',
    goalFa: 'معرفی، هویت، اشیا، مکان، نیازهای روزمره و افعال پرکاربرد',
    legacyLevelIds: [0, 1],
    status: 'starter-only',
    units: A1_UNITS,
  },
  {
    id: 'A2',
    titleFa: 'گسترش و ترکیب جمله‌ها',
    goalFa: 'گذشته و آینده، توصیف، مقایسه، درخواست و ارتباط میان جمله‌ها',
    legacyLevelIds: [2],
    status: 'planned',
    units: [
      plannedUnit('A2', 'past-future', 'گذشته و آینده', 'به‌کاربردن زمان‌های گذشته و آینده در جمله‌های روزمره.'),
      plannedUnit('A2', 'description-comparison', 'توصیف و مقایسه', 'گسترش جمله با توصیف و مقایسهٔ ساده.'),
      plannedUnit('A2', 'requests', 'درخواست و پاسخ', 'ساخت درخواست‌های روشن و پاسخ‌دادن به آن‌ها.'),
      plannedUnit('A2', 'sentence-links', 'پیوند جمله‌ها', 'وصل‌کردن جمله‌ها با رابطه‌های معنایی ساده.'),
    ],
  },
  {
    id: 'B1',
    titleFa: 'بیان مستقل منظور',
    goalFa: 'روایت، توضیح دلیل، بیان تجربه، نظر، هدف و ارتباط میان ایده‌ها',
    legacyLevelIds: [3],
    status: 'planned',
    units: [
      plannedUnit('B1', 'narration', 'روایت تجربه', 'بازگویی تجربه‌ها و رویدادها با ترتیب روشن.'),
      plannedUnit('B1', 'reasons', 'توضیح دلیل', 'بیان دلیل و نتیجه در جمله‌ها و گفت‌وگو.'),
      plannedUnit('B1', 'opinions-goals', 'نظر و هدف', 'گفتن نظر، تجربه و هدف شخصی.'),
      plannedUnit('B1', 'idea-links', 'ارتباط ایده‌ها', 'پیوند چند ایده در یک توضیح منسجم.'),
    ],
  },
  {
    id: 'B2',
    titleFa: 'بیان دقیق و انعطاف‌پذیر',
    goalFa: 'استدلال، شرط، فرض، ظرافت معنایی، ساختارهای پیچیده و بحث‌های تخصصی‌تر',
    legacyLevelIds: [4],
    status: 'planned',
    units: [
      plannedUnit('B2', 'argument', 'استدلال و بحث', 'پشتیبانی از نظر با دلیل و پاسخ به دیدگاه دیگر.'),
      plannedUnit('B2', 'conditionals', 'شرط و فرض', 'ساخت و تفسیر جمله‌های شرطی و فرضی.'),
      plannedUnit('B2', 'nuance', 'ظرافت معنایی', 'انتخاب صورت و لحن متناسب با منظور و بافت.'),
      plannedUnit('B2', 'complex-sentences', 'ساختارهای پیچیده', 'ترکیب ساختارهای پیچیده در موضوع‌های عمومی و تخصصی.'),
    ],
  },
];

export function russianCefrForLegacyLevel(levelId: RussianLevelId): RussianCefrLevel {
  return RUSSIAN_LEVEL_TO_CEFR[levelId];
}

export function findRussianCefrBand(levelId: RussianCefrLevel): RussianCefrBand | undefined {
  return RUSSIAN_CEFR_BANDS.find(band => band.id === levelId);
}

export function russianCefrForLesson(lessonId: string): RussianCefrLevel | undefined {
  const lesson = RUSSIAN_LESSONS.find(item => item.id === lessonId);
  return lesson ? russianCefrForLegacyLevel(lesson.levelId) : undefined;
}

export interface RussianGrammarThread {
  id: RussianGrammarFeatureId;
  titleFa: string;
  purposeFa: string;
  progression: Readonly<Record<RussianCefrLevel, string>>;
  currentA1Status: 'in-context' | 'exposure-only' | 'not-yet-authored';
  /** No annotation in this planning layer is shown as a new lesson explanation. */
  candidateSentenceIds: readonly string[];
  editorialStatus: 'requires-russian-editor-review';
}

/**
 * Russian-specific grammar strands are curriculum metadata. A1 annotations point
 * only to existing notes/examples; they do not add or rewrite learner-facing content.
 */
export const RUSSIAN_GRAMMAR_THREADS: readonly RussianGrammarThread[] = [
  {
    id: 'grammatical-cases',
    titleFa: 'حالت‌های دستوری',
    purposeFa: 'پیگیری تدریجی تغییر شکل اسم و ضمیر بر اساس نقش آن‌ها در جمله.',
    progression: {
      A1: 'دیدن چند شکل پرتکرار در عبارت‌ها و مثال‌های همین مسیر.',
      A2: 'مقایسهٔ نقش‌ها و گسترش شکل‌های پرتکرار در جمله‌های تازه.',
      B1: 'به‌کارگیری حالت‌ها در روایت، دلیل‌آوری و جمله‌های پیوسته.',
      B2: 'انتخاب دقیق‌تر حالت در ساختارهای پیچیده و بافت‌های تخصصی.',
    },
    currentA1Status: 'in-context',
    candidateSentenceIds: ['ru-intro-country', 'ru-intro-city', 'ru-directions-museum', 'ru-directions-ticket'],
    editorialStatus: 'requires-russian-editor-review',
  },
  {
    id: 'verb-aspect',
    titleFa: 'صرف و نمود فعل',
    purposeFa: 'پیگیری صرف فعل و تفاوت کاربردی میان نمودهای فعلی در بافت.',
    progression: {
      A1: 'تشخیص صورت‌های آشنا؛ آموزش تقابل کامل/ناقص هنوز برای این مسیر تألیف نشده است.',
      A2: 'آشنایی هدفمند با جفت‌ها و انتخاب نمود در موقعیت‌های پرتکرار.',
      B1: 'به‌کارگیری نمود در روایت تجربه و بیان توالی یا نتیجهٔ عمل.',
      B2: 'انتخاب دقیق‌تر نمود برای ظرافت معنایی و ساختارهای پیچیده.',
    },
    currentA1Status: 'not-yet-authored',
    candidateSentenceIds: [],
    editorialStatus: 'requires-russian-editor-review',
  },
  {
    id: 'agreement',
    titleFa: 'تطابق دستوری',
    purposeFa: 'پیگیری هماهنگی اسم، صفت، ضمیر و فعل در ساختارهای مرتبط.',
    progression: {
      A1: 'توجه به چند نمونهٔ سادهٔ جنس دستوری در عبارت‌های آشنا.',
      A2: 'گسترش تطابق در توصیف‌ها و جمله‌های ترکیبی.',
      B1: 'حفظ تطابق در روایت و ارجاع به افراد و اشیا در چند جمله.',
      B2: 'کنترل تطابق در ساختارهای پیچیده و بیان دقیق‌تر.',
    },
    currentA1Status: 'in-context',
    candidateSentenceIds: [
      'ru-family-brother', 'ru-family-sister', 'ru-help-sorry',
      'ru-object-my-desk', 'ru-object-my-bag',
      'ru-adjective-new-masculine', 'ru-adjective-new-feminine', 'ru-adjective-new-neuter',
      'ru-adjective-big-house', 'ru-adjective-new-book', 'ru-adjective-new-word',
    ],
    editorialStatus: 'requires-russian-editor-review',
  },
];

export interface RussianVocabularyExample {
  lessonId: string;
  sentenceId: string;
  sentenceText: string;
  sentenceFa: string;
  /** Existing hint is sentence-level; it is not presented as word pronunciation. */
  sentencePronunciationHint: string;
}

export interface RussianVocabularyEntry {
  id: string;
  sourceForm: string;
  meaningFa: string;
  /** Empty until a Russian-language editor confirms the lemma and inflections. */
  baseForm: string | null;
  pronunciationFa: string | null;
  inflectedForms: readonly { form: string; noteFa?: string }[];
  examples: readonly RussianVocabularyExample[];
  editorialStatus: 'needs-russian-lexical-review';
}

function vocabularyKey(sourceForm: string, meaningFa: string): string {
  return `${sourceForm.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('ru-RU')}\u0000${meaningFa.normalize('NFC').trim()}`;
}

const vocabularyBuckets = new Map<string, {
  id: string;
  sourceForm: string;
  meaningFa: string;
  examples: RussianVocabularyExample[];
}>();

for (const lesson of RUSSIAN_LESSONS) {
  for (const sentence of lesson.sentences) {
    for (const [wordIndex, item] of sentence.vocabulary.entries()) {
      const key = vocabularyKey(item.word, item.meaning);
      const existing = vocabularyBuckets.get(key);
      const example: RussianVocabularyExample = {
        lessonId: lesson.id,
        sentenceId: sentence.id,
        sentenceText: sentence.text,
        sentenceFa: sentence.fa,
        sentencePronunciationHint: sentence.pronunciation,
      };
      if (existing) existing.examples.push(example);
      else vocabularyBuckets.set(key, {
        id: `ru-vocab-${sentence.id}-${wordIndex + 1}`,
        sourceForm: item.word,
        meaningFa: item.meaning,
        examples: [example],
      });
    }
  }
}

/** Searchable internal index built only from the current Russian lesson vocabulary. */
export const RUSSIAN_VOCABULARY: readonly RussianVocabularyEntry[] = [...vocabularyBuckets.values()].map(entry => ({
  ...entry,
  baseForm: null,
  pronunciationFa: null,
  inflectedForms: [],
  editorialStatus: 'needs-russian-lexical-review',
}));

const vocabularyIdByKey = new Map(
  RUSSIAN_VOCABULARY.map(entry => [vocabularyKey(entry.sourceForm, entry.meaningFa), entry.id] as const),
);

const GRAMMAR_ANNOTATIONS_BY_SENTENCE: Readonly<Record<string, readonly RussianGrammarFeatureId[]>> = {
  'ru-intro-country': ['grammatical-cases'],
  'ru-intro-city': ['grammatical-cases'],
  'ru-directions-museum': ['grammatical-cases'],
  'ru-directions-ticket': ['grammatical-cases'],
  'ru-family-brother': ['agreement'],
  'ru-family-sister': ['agreement'],
  'ru-help-sorry': ['agreement'],
  'ru-object-my-desk': ['agreement'],
  'ru-object-my-bag': ['agreement'],
  'ru-adjective-new-masculine': ['agreement'],
  'ru-adjective-new-feminine': ['agreement'],
  'ru-adjective-new-neuter': ['agreement'],
  'ru-adjective-big-house': ['agreement'],
  'ru-adjective-new-book': ['agreement'],
  'ru-adjective-new-word': ['agreement'],
};

export interface RussianSentenceCurriculumEntry {
  sentenceId: string;
  lessonId: string;
  unitId: string;
  cefrLevelId: RussianCefrLevel;
  objectiveId: string;
  /** Preserved from the existing sentence record; no new example is generated. */
  patternFa: string | null;
  vocabularyEntryIds: readonly string[];
  grammarFeatureIds: readonly RussianGrammarFeatureId[];
  /** Transfer prompts require authored, reviewed material and are currently absent. */
  transferPromptIds: readonly string[];
  editorialStatus: 'existing-content-metadata-needs-review';
}

/** Sentence-to-goal/pattern/vocabulary links; the source lesson content is unchanged. */
export const RUSSIAN_SENTENCE_CURRICULUM: readonly RussianSentenceCurriculumEntry[] = RUSSIAN_LESSONS.flatMap(lesson =>
  lesson.sentences.map(sentence => ({
    sentenceId: sentence.id,
    lessonId: lesson.id,
    unitId: `unit-${lesson.id}`,
    cefrLevelId: russianCefrForLegacyLevel(lesson.levelId),
    objectiveId: `objective-${lesson.id}`,
    patternFa: sentence.pattern ?? null,
    vocabularyEntryIds: sentence.vocabulary.map(item => vocabularyIdByKey.get(vocabularyKey(item.word, item.meaning))!).filter(Boolean),
    grammarFeatureIds: GRAMMAR_ANNOTATIONS_BY_SENTENCE[sentence.id] ?? [],
    transferPromptIds: [],
    editorialStatus: 'existing-content-metadata-needs-review',
  })),
);

export function findRussianVocabularyEntry(id: string): RussianVocabularyEntry | undefined {
  return RUSSIAN_VOCABULARY.find(entry => entry.id === id);
}

export function findRussianSentenceCurriculumEntry(sentenceId: string): RussianSentenceCurriculumEntry | undefined {
  return RUSSIAN_SENTENCE_CURRICULUM.find(entry => entry.sentenceId === sentenceId);
}
