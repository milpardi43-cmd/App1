import { EXPANDED_SENTENCE_LESSONS } from './courseContentExpansion';
import { ADVANCED_SENTENCE_LESSONS } from './courseContentExpansion2';
import { ADVANCED_SENTENCE_LESSONS_2 } from './courseContentExpansion3';
import { ADVANCED_SENTENCE_LESSONS_3 } from './courseContentExpansion4';
import { ADVANCED_SENTENCE_LESSONS_4 } from './courseContentExpansion5';
import { ADVANCED_SENTENCE_LESSONS_5 } from './courseContentExpansion6';
import { ADVANCED_SENTENCE_LESSONS_6 } from './courseContentExpansion7';
import { ADVANCED_SENTENCE_LESSONS_7 } from './courseContentExpansion8';
import { FINAL_SENTENCE_LESSONS } from './courseContentFinal';
import { FOUNDATION_SURVIVAL_EXTENSIONS } from './courseContentFoundationSurvival';
import { FOUNDATION_COMPLETION_SENTENCES } from './courseContentFoundationCompletion';
import { FOUNDATION_SURVIVAL_EXPANSION_LESSONS } from './courseContentFoundationSurvivalExpansion';
import { EVERYDAY_EXPANSION_LESSONS } from './courseContentEverydayExpansion';
import { EVERYDAY_COMPLETION_SENTENCES } from './courseContentEverydayCompletion';
import { SURVIVAL_COMPLETION_SENTENCES } from './courseContentSurvivalCompletion';
import {
  COMMUNICATION_COMPLETION_SENTENCES,
  COMMUNICATION_COURSE_LESSON_IDS,
} from './courseContentCommunicationCompletion';
import { COMMUNICATION_NEW_LESSONS } from './courseContentCommunicationNewLessons';
import {
  COMMUNICATION_LESSON_UNIT,
  COMMUNICATION_MODULES,
} from './courseContentCommunicationStructure';

export { COMMUNICATION_COURSE_LESSON_IDS, COMMUNICATION_LESSON_UNIT, COMMUNICATION_MODULES };

export type CourseLevelId = 0 | 1 | 2 | 3 | 4;

export interface CourseSentence {
  id: string;
  en: string;
  fa: string;
  pronunciation: string;
  pattern?: string;
  vocabulary: Array<{
    word: string;
    meaning: string;
    /** Tracked internally; the lesson UI and sentence-first flow stay unchanged. */
    essential504?: true;
  }>;
}

export interface SentenceLesson {
  id: string;
  levelId: CourseLevelId;
  order: number;
  /** Honest distinction between the contextual Advanced lessons and legacy vocabulary sets. */
  contentKind?: 'scenario' | 'vocabulary-practice';
  title: string;
  subtitle: string;
  situation: string;
  durationMinutes: number;
  sentences: CourseSentence[];
  dialogue: Array<{ speaker: 'learner' | 'partner'; text: string; fa: string }>;
  /** Thematic unit metadata is currently populated for Communication English. */
  unitId?: string;
  unitTitle?: string;
  unitTitleEn?: string;
}

export interface CourseLevel {
  id: CourseLevelId;
  title: string;
  cefr: string;
  description: string;
  color: string;
  modules: string[];
}

export const COURSE_LEVELS: CourseLevel[] = [
  {
    id: 0,
    title: 'Foundation',
    cefr: 'شروع از صفر',
    description: 'صداها، الفبا و جمله‌های روزمره برای آغاز از صفر',
    color: '#6366f1',
    modules: ['معرفی و صداهای پایه', 'درخواست کمک', 'خرید و قیمت‌ها', 'الفبا و هجی‌کردن', 'ضمیرها و فعل be', 'عددها و اطلاعات تماس', 'خانواده و مالکیت', 'زمان و تقویم', 'کارهای روزمره', 'وسایل و مکان‌ها'],
  },
  {
    id: 1,
    title: 'Survival English',
    cefr: 'A1',
    description: 'مکالمه در موقعیت‌های ضروری روزمره',
    color: '#0ea5e9',
    modules: ['موقعیت‌های اصلی', 'الگوهای جمله', 'شنیدن و صحبت‌کردن'],
  },
  {
    id: 2,
    title: 'Everyday English',
    cefr: 'A2–B1',
    description: 'انگلیسی طبیعی برای زندگی روزمره',
    color: '#10b981',
    modules: ['موقعیت‌های واقعی', 'گفتگوها', 'خواندن و نوشتن'],
  },
  {
    id: 3,
    title: 'Communication English',
    cefr: 'B1–B2',
    description: 'روانی در گفتگو، نظر دادن و داستان‌گویی',
    color: '#f59e0b',
    modules: COMMUNICATION_MODULES.map(unit => unit.titleFa),
  },
  {
    id: 4,
    title: 'Advanced English',
    cefr: 'سطح ۴ · داخلی',
    description: 'سناریوهای حرفه‌ای، اجتماعی و علمی؛ همراه با مرور واژگان پیشرفته',
    color: '#8b5cf6',
    modules: ['کار و تصمیم‌گیری', 'رسانه و جامعه', 'علم و محیط زیست', 'سفر و ایمنی', 'رشد فردی و ارتباط', 'مرور واژگان در بافت'],
  },
];

const CORE_SENTENCE_LESSONS: SentenceLesson[] = [
  {
    id: 'foundation-introducing-yourself',
    levelId: 0,
    order: 1,
    title: 'معرفی خود',
    subtitle: 'اولین گفتگوی ساده و واقعی',
    situation: 'برای اولین بار با یک نفر آشنا شده‌اید و می‌خواهید خودتان را معرفی کنید.',
    durationMinutes: 8,
    sentences: [
      {
        id: 's1',
        en: 'Hello, my name is Sara.',
        fa: 'سلام، اسم من سارا است.',
        pronunciation: 'هِلو، مای نِیم ایز سارا',
        pattern: 'My name is + name',
        vocabulary: [{ word: 'name', meaning: 'اسم' }],
      },
      {
        id: 's2',
        en: 'What is your name?',
        fa: 'اسم شما چیست؟',
        pronunciation: 'وات ایز یور نِیم؟',
        pattern: 'What is your + noun?',
        vocabulary: [{ word: 'your', meaning: 'مال شما / ـتان' }],
      },
      {
        id: 's3',
        en: 'Nice to meet you.',
        fa: 'از آشنایی با شما خوشحالم.',
        pronunciation: 'نایس تو میت یو',
        vocabulary: [
          { word: 'nice', meaning: 'خوب / خوشایند' },
          { word: 'meet', meaning: 'ملاقات کردن' },
        ],
      },
      {
        id: 's4',
        en: 'I am from Iran.',
        fa: 'من اهل ایران هستم.',
        pronunciation: 'آی اَم فرام ایران',
        pattern: 'I am from + place',
        vocabulary: [{ word: 'from', meaning: 'از / اهل' }],
      },
      {
        id: 's5',
        en: 'Where are you from?',
        fa: 'شما اهل کجا هستید؟',
        pronunciation: 'وِر آر یو فرام؟',
        pattern: 'Where are you from?',
        vocabulary: [{ word: 'where', meaning: 'کجا' }],
      },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Hello! My name is Emma. What is your name?', fa: 'سلام! اسم من اِما است. اسم شما چیست؟' },
      { speaker: 'learner', text: 'Hello, my name is Sara.', fa: 'سلام، اسم من سارا است.' },
      { speaker: 'partner', text: 'Nice to meet you. Where are you from?', fa: 'از آشنایی خوشحالم. اهل کجا هستید؟' },
      { speaker: 'learner', text: 'Nice to meet you too. I am from Iran.', fa: 'من هم از آشنایی خوشحالم. اهل ایران هستم.' },
    ],
  },
  {
    id: 'foundation-asking-for-help',
    levelId: 0,
    order: 2,
    title: 'درخواست کمک',
    subtitle: 'جمله‌های ضروری وقتی کمک می‌خواهید',
    situation: 'در یک مکان جدید هستید و برای پیدا کردن مسیر یا فهمیدن صحبت دیگران کمک می‌خواهید.',
    durationMinutes: 9,
    sentences: [
      { id: 's1', en: 'Can you help me?', fa: 'می‌توانید به من کمک کنید؟', pronunciation: 'کَن یو هِلپ می؟', pattern: 'Can you + verb?', vocabulary: [{ word: 'help', meaning: 'کمک کردن' }] },
      { id: 's2', en: 'I do not understand.', fa: 'متوجه نمی‌شوم.', pronunciation: 'آی دو نات آندِراِستَند', vocabulary: [{ word: 'understand', meaning: 'متوجه شدن' }] },
      { id: 's3', en: 'Please speak slowly.', fa: 'لطفاً آهسته صحبت کنید.', pronunciation: 'پلیز اسپیک اِسلولی', vocabulary: [{ word: 'slowly', meaning: 'به‌آرامی' }] },
      { id: 's4', en: 'Could you say that again?', fa: 'می‌شود دوباره بگویید؟', pronunciation: 'کود یو سِی ذَت اَگِن؟', vocabulary: [{ word: 'again', meaning: 'دوباره' }] },
      { id: 's5', en: 'Thank you for your help.', fa: 'برای کمکتان ممنونم.', pronunciation: 'تَنک یو فُر یور هِلپ', vocabulary: [{ word: 'thank you', meaning: 'متشکرم' }] },
    ],
    dialogue: [
      { speaker: 'learner', text: 'Excuse me. Can you help me?', fa: 'ببخشید. می‌توانید کمکم کنید؟' },
      { speaker: 'partner', text: 'Of course. What do you need?', fa: 'البته. چه چیزی لازم دارید؟' },
      { speaker: 'learner', text: 'Please speak slowly. I do not understand.', fa: 'لطفاً آهسته صحبت کنید. متوجه نمی‌شوم.' },
    ],
  },
  {
    id: 'foundation-buying-something',
    levelId: 0,
    order: 3,
    title: 'خرید ساده',
    subtitle: 'پرسیدن قیمت و خرید یک کالا',
    situation: 'وارد فروشگاه شده‌اید و می‌خواهید قیمت یک کالا را بپرسید و آن را بخرید.',
    durationMinutes: 10,
    sentences: [
      { id: 's1', en: 'How much is this?', fa: 'این چقدر است؟', pronunciation: 'هاو ماچ ایز ذیس؟', vocabulary: [{ word: 'how much', meaning: 'چقدر / چه قیمتی' }] },
      { id: 's2', en: 'I would like this one.', fa: 'من این یکی را می‌خواهم.', pronunciation: 'آی وود لایک ذیس وان', pattern: 'I would like + noun', vocabulary: [{ word: 'would like', meaning: 'مایل بودن / خواستن' }] },
      { id: 's3', en: 'Do you have a smaller size?', fa: 'اندازه کوچک‌تر دارید؟', pronunciation: 'دو یو هَو اَ اِسمالِر سایز؟', vocabulary: [{ word: 'size', meaning: 'اندازه' }] },
      { id: 's4', en: 'Can I pay by card?', fa: 'می‌توانم با کارت پرداخت کنم؟', pronunciation: 'کَن آی پِی بای کارد؟', vocabulary: [{ word: 'pay', meaning: 'پرداخت کردن' }] },
      { id: 's5', en: 'That is all, thank you.', fa: 'همین است، متشکرم.', pronunciation: 'ذَت ایز آل، تَنک یو', vocabulary: [{ word: 'all', meaning: 'همه / تمام' }] },
    ],
    dialogue: [
      { speaker: 'learner', text: 'Excuse me, how much is this?', fa: 'ببخشید، این چقدر است؟' },
      { speaker: 'partner', text: 'It is ten dollars.', fa: 'ده دلار است.' },
      { speaker: 'learner', text: 'Great. I would like this one.', fa: 'عالی است. این یکی را می‌خواهم.' },
    ],
  },
  {
    id: 'survival-job-interview',
    levelId: 1,
    order: 4,
    title: 'معرفی توانایی‌های کاری',
    subtitle: 'صحبت ساده و طبیعی در یک مصاحبه',
    situation: 'در یک مصاحبه کوتاه می‌خواهید درباره علاقه، تجربه و توانایی‌های خود صحبت کنید.',
    durationMinutes: 11,
    sentences: [
      { id: 'job-keen', en: 'I am keen to learn new skills.', fa: 'من مشتاق یادگیری مهارت‌های جدید هستم.', pronunciation: 'آی اَم کین تو لِرن نیو اِسکیلز', pattern: 'I am keen to + verb', vocabulary: [{ word: 'keen', meaning: 'مشتاق', essential504: true }] },
      { id: 'job-qualify', en: 'My experience qualifies me for this job.', fa: 'تجربه‌ام من را برای این شغل واجد شرایط می‌کند.', pronunciation: 'مای اِکسپیریِنس کوالیفایز می فُر ذیس جاب', vocabulary: [{ word: 'qualify', meaning: 'واجد شرایط کردن', essential504: true }] },
      { id: 'job-data', en: 'I use data to make better decisions.', fa: 'من برای تصمیم‌های بهتر از داده‌ها استفاده می‌کنم.', pronunciation: 'آی یوز دِیتا تو مِیک بِتِر دِسیژِنز', vocabulary: [{ word: 'data', meaning: 'داده‌ها / اطلاعات', essential504: true }] },
      { id: 'job-talent', en: 'My main talent is solving problems.', fa: 'استعداد اصلی من حل‌کردن مشکلات است.', pronunciation: 'مای مِین تَلِنت ایز سالوینگ پرابلِمز', vocabulary: [{ word: 'talent', meaning: 'استعداد', essential504: true }] },
      { id: 'job-team', en: 'I work well with a team.', fa: 'من با یک تیم به‌خوبی کار می‌کنم.', pronunciation: 'آی وِرک وِل ویذ اَ تیم', vocabulary: [{ word: 'team', meaning: 'تیم' }] },
      { id: 'job-ready', en: 'I am ready to start.', fa: 'من آماده شروع هستم.', pronunciation: 'آی اَم رِدی تو اِستارت', vocabulary: [{ word: 'ready', meaning: 'آماده' }] },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Why do you want this job?', fa: 'چرا این شغل را می‌خواهید؟' },
      { speaker: 'learner', text: 'I am keen to learn new skills.', fa: 'من مشتاق یادگیری مهارت‌های جدید هستم.' },
      { speaker: 'partner', text: 'What is your main talent?', fa: 'استعداد اصلی شما چیست؟' },
      { speaker: 'learner', text: 'My main talent is solving problems.', fa: 'استعداد اصلی من حل‌کردن مشکلات است.' },
    ],
  },
  {
    id: 'survival-renting-a-home',
    levelId: 1,
    order: 5,
    title: 'پیدا کردن خانه',
    subtitle: 'پرسش‌های لازم برای اجاره خانه',
    situation: 'برای دیدن یک خانه رفته‌اید و می‌خواهید درباره قیمت، مدت قرارداد و شرایط آن سؤال کنید.',
    durationMinutes: 11,
    sentences: [
      { id: 'home-vacant', en: 'Is this apartment still vacant?', fa: 'آیا این آپارتمان هنوز خالی است؟', pronunciation: 'ایز ذیس اَپارت‌مِنت اِستیل وِیکِنت؟', vocabulary: [{ word: 'vacant', meaning: 'خالی / بدون استفاده', essential504: true }] },
      { id: 'home-expensive', en: 'The apartment is too expensive for me.', fa: 'این آپارتمان برای من خیلی گران است.', pronunciation: 'ذی اَپارت‌مِنت ایز تو اِکسپِنسیو فُر می', vocabulary: [{ word: 'expensive', meaning: 'گران', essential504: true }] },
      { id: 'home-minimum', en: 'The minimum stay is six months.', fa: 'حداقل مدت اقامت شش ماه است.', pronunciation: 'ذِ مینیمِم اِستِی ایز سیکس مانتس', vocabulary: [{ word: 'minimum', meaning: 'حداقل', essential504: true }] },
      { id: 'home-annual', en: 'Is there an annual fee?', fa: 'آیا هزینه سالانه‌ای وجود دارد؟', pronunciation: 'ایز ذِر اَن اَنیوئِل فی؟', vocabulary: [{ word: 'annual', meaning: 'سالانه', essential504: true }] },
      { id: 'home-bills', en: 'Are the bills included?', fa: 'آیا هزینه قبض‌ها حساب شده است؟', pronunciation: 'آر ذِ بیلز اینکلودِد؟', vocabulary: [{ word: 'included', meaning: 'شامل‌شده' }] },
      { id: 'home-see', en: 'I would like to see the rooms.', fa: 'می‌خواهم اتاق‌ها را ببینم.', pronunciation: 'آی وود لایک تو سی ذِ رومز', vocabulary: [{ word: 'room', meaning: 'اتاق' }] },
    ],
    dialogue: [
      { speaker: 'learner', text: 'Is this apartment still vacant?', fa: 'آیا این آپارتمان هنوز خالی است؟' },
      { speaker: 'partner', text: 'Yes, it is. The minimum stay is six months.', fa: 'بله. حداقل مدت اقامت شش ماه است.' },
      { speaker: 'learner', text: 'Thank you. Is there an annual fee?', fa: 'ممنون. آیا هزینه سالانه‌ای وجود دارد؟' },
    ],
  },
  {
    id: 'everyday-facing-a-challenge',
    levelId: 2,
    order: 6,
    title: 'روبه‌رو شدن با یک مشکل',
    subtitle: 'توضیح یک شرایط سخت و درخواست راه‌حل',
    situation: 'در سفر با شرایط سختی روبه‌رو شده‌اید و باید مشکل را واضح توضیح دهید و برای ادامه تصمیم بگیرید.',
    durationMinutes: 12,
    sentences: [
      { id: 'challenge-hardship', en: 'The bad weather caused great hardship.', fa: 'هوای بد سختی زیادی ایجاد کرد.', pronunciation: 'ذِ بَد وِذِر کازد گریت هاردشیپ', vocabulary: [{ word: 'hardship', meaning: 'سختی / دشواری', essential504: true }] },
      { id: 'challenge-abandon', en: 'We may have to abandon our plan.', fa: 'ممکن است مجبور شویم برنامه‌مان را رها کنیم.', pronunciation: 'وی مِی هَو تو اَبَندِن آور پِلَن', pattern: 'have to + verb', vocabulary: [{ word: 'abandon', meaning: 'رها کردن', essential504: true }] },
      { id: 'challenge-unaccustomed', en: 'I am unaccustomed to this cold weather.', fa: 'من به این هوای سرد عادت ندارم.', pronunciation: 'آی اَم اَناِکاستِمد تو ذیس کُلد وِذِر', pattern: 'be unaccustomed to + noun', vocabulary: [{ word: 'unaccustomed', meaning: 'عادت‌نداشته', essential504: true }] },
      { id: 'challenge-scarce', en: 'Clean water is scarce in this area.', fa: 'آب پاک در این منطقه کمیاب است.', pronunciation: 'کلین واتِر ایز اِسکِرس این ذیس اِریا', vocabulary: [{ word: 'scarce', meaning: 'کمیاب', essential504: true }] },
      { id: 'challenge-safe', en: 'We need to find a safe place.', fa: 'باید یک مکان امن پیدا کنیم.', pronunciation: 'وی نید تو فایند اَ سِیف پِلِیس', vocabulary: [{ word: 'safe', meaning: 'امن' }] },
      { id: 'challenge-together', en: 'We can solve this problem together.', fa: 'می‌توانیم این مشکل را با هم حل کنیم.', pronunciation: 'وی کَن سالو ذیس پرابلِم توگِذِر', vocabulary: [{ word: 'together', meaning: 'با هم' }] },
    ],
    dialogue: [
      { speaker: 'partner', text: 'Do we have enough clean water?', fa: 'آیا آب پاک کافی داریم؟' },
      { speaker: 'learner', text: 'No. Clean water is scarce in this area.', fa: 'نه. آب پاک در این منطقه کمیاب است.' },
      { speaker: 'partner', text: 'Should we abandon our plan?', fa: 'آیا باید برنامه‌مان را رها کنیم؟' },
      { speaker: 'learner', text: 'Not yet. We can solve this problem together.', fa: 'هنوز نه. می‌توانیم این مشکل را با هم حل کنیم.' },
    ],
  },
  {
    id: 'everyday-making-a-plan',
    levelId: 2,
    order: 7,
    title: 'ساختن یک برنامه بهتر',
    subtitle: 'پیشنهاد دادن و قانع‌کردن دیگران',
    situation: 'با دوستان یا همکاران خود درباره یک برنامه صحبت می‌کنید و می‌خواهید یک راه‌حل خوب پیشنهاد دهید.',
    durationMinutes: 12,
    sentences: [
      { id: 'plan-essential', en: 'A clear plan is essential for success.', fa: 'یک برنامه روشن برای موفقیت ضروری است.', pronunciation: 'اَ کلیر پِلَن ایز اِسِنشِل فُر ساکسِس', vocabulary: [{ word: 'essential', meaning: 'ضروری', essential504: true }] },
      { id: 'plan-devise', en: 'We need to devise a better plan.', fa: 'باید برنامه بهتری طراحی کنیم.', pronunciation: 'وی نید تو دِوایز اَ بِتِر پِلَن', vocabulary: [{ word: 'devise', meaning: 'طراحی کردن / ابداع کردن', essential504: true }] },
      { id: 'plan-persuade', en: 'I will try to persuade the team.', fa: 'تلاش می‌کنم تیم را متقاعد کنم.', pronunciation: 'آی ویل تِرای تو پِرسوِید ذِ تیم', pattern: 'persuade + person', vocabulary: [{ word: 'persuade', meaning: 'متقاعد کردن', essential504: true }] },
      { id: 'plan-typical', en: 'This is a typical problem for new teams.', fa: 'این یک مشکل معمول برای تیم‌های جدید است.', pronunciation: 'ذیس ایز اَ تیپیکِل پرابلِم فُر نیو تیمز', vocabulary: [{ word: 'typical', meaning: 'معمول / نمونه‌وار', essential504: true }] },
      { id: 'plan-share', en: 'Let me share my idea.', fa: 'اجازه دهید ایده‌ام را مطرح کنم.', pronunciation: 'لِت می شِر مای آیدیا', vocabulary: [{ word: 'idea', meaning: 'ایده' }] },
      { id: 'plan-agree', en: 'Do you agree with this plan?', fa: 'آیا با این برنامه موافقید؟', pronunciation: 'دو یو اَگری ویذ ذیس پِلَن؟', vocabulary: [{ word: 'agree', meaning: 'موافق بودن' }] },
    ],
    dialogue: [
      { speaker: 'learner', text: 'We need to devise a better plan.', fa: 'باید برنامه بهتری طراحی کنیم.' },
      { speaker: 'partner', text: 'Why is that essential?', fa: 'چرا این کار ضروری است؟' },
      { speaker: 'learner', text: 'This is a typical problem, and a clear plan can help us.', fa: 'این مشکلی معمول است و یک برنامه روشن می‌تواند کمکمان کند.' },
    ],
  },
];

const ENRICHED_CORE_SENTENCE_LESSONS: SentenceLesson[] = CORE_SENTENCE_LESSONS.map((lesson) => {
  const extension = FOUNDATION_SURVIVAL_EXTENSIONS[lesson.id];
  const completionSentences = FOUNDATION_COMPLETION_SENTENCES[lesson.id] ?? [];
  if (!extension && completionSentences.length === 0) return lesson;

  return {
    ...lesson,
    durationMinutes: extension?.durationMinutes ?? lesson.durationMinutes,
    sentences: [
      ...lesson.sentences.map((sentence) => {
        const pattern = extension?.patterns[sentence.id];
        return sentence.pattern || !pattern ? sentence : { ...sentence, pattern };
      }),
      ...(extension?.sentences ?? []),
      ...completionSentences,
    ],
    dialogue: extension ? [...lesson.dialogue, ...extension.dialogue] : lesson.dialogue,
  };
});

const COMMUNICATION_ORDER_INSERTION_COUNT = COMMUNICATION_NEW_LESSONS.length;

const ORIGINAL_SENTENCE_LESSONS: SentenceLesson[] = [
  ...ENRICHED_CORE_SENTENCE_LESSONS,
  ...EXPANDED_SENTENCE_LESSONS,
  ...ADVANCED_SENTENCE_LESSONS,
  ...ADVANCED_SENTENCE_LESSONS_2,
  ...ADVANCED_SENTENCE_LESSONS_3,
  ...ADVANCED_SENTENCE_LESSONS_4,
  ...ADVANCED_SENTENCE_LESSONS_5,
  ...ADVANCED_SENTENCE_LESSONS_6,
  ...ADVANCED_SENTENCE_LESSONS_7,
  ...FINAL_SENTENCE_LESSONS,
].map(lesson => {
  if (lesson.levelId !== 4) return lesson;
  const contentKind: NonNullable<SentenceLesson['contentKind']> = lesson.id.startsWith('advanced-canonical-practice-')
    ? 'vocabulary-practice'
    : 'scenario';
  return {
    ...lesson,
    contentKind,
    order: lesson.order + COMMUNICATION_ORDER_INSERTION_COUNT,
  };
})
  .concat(COMMUNICATION_NEW_LESSONS)
  .sort((a, b) => a.order - b.order);

/**
 * Foundation remains a ten-lesson, sentence-first course. The seven curated
 * additions follow its original IDs; 17 selected Survival lessons follow the
 * original Survival pair. A separate completion source brings every one of the
 * 19 stable Survival lesson records to exactly fifty linked sentence examples.
 */
export const FOUNDATION_EXPANSION_LESSON_IDS = [
  'foundation-alphabet-and-spelling',
  'foundation-pronouns-and-be',
  'foundation-numbers-and-contact',
  'foundation-family-and-possessions',
  'foundation-time-and-calendar',
  'foundation-everyday-routine',
  'foundation-objects-and-places',
] as const;

const foundationExpansionIds = new Set<string>(FOUNDATION_EXPANSION_LESSON_IDS);
const selectedFoundationLessons = FOUNDATION_SURVIVAL_EXPANSION_LESSONS
  .filter(lesson => foundationExpansionIds.has(lesson.id));
if (selectedFoundationLessons.length !== FOUNDATION_EXPANSION_LESSON_IDS.length) {
  throw new Error('A selected Foundation lesson is missing from its source.');
}

const FOUNDATION_EXPANSION_INSERTION_ORDER = 3;
const FOUNDATION_EXPANSION_LESSONS = selectedFoundationLessons.map((lesson, index) => {
  const completionSentences = FOUNDATION_COMPLETION_SENTENCES[lesson.id] ?? [];
  if (lesson.sentences.length !== 10 || completionSentences.length !== 40) {
    throw new Error(`Foundation lesson ${lesson.id} must have ten prepared and forty completion sentences.`);
  }
  return {
    ...lesson,
    order: FOUNDATION_EXPANSION_INSERTION_ORDER + index + 1,
    durationMinutes: 30,
    sentences: [...lesson.sentences, ...completionSentences],
  };
});

const LESSONS_WITH_FOUNDATION_EXPANSION: SentenceLesson[] = [
  ...ORIGINAL_SENTENCE_LESSONS.map(lesson => lesson.order > FOUNDATION_EXPANSION_INSERTION_ORDER
    ? { ...lesson, order: lesson.order + FOUNDATION_EXPANSION_LESSONS.length }
    : lesson),
  ...FOUNDATION_EXPANSION_LESSONS,
].sort((a, b) => a.order - b.order);

export const SURVIVAL_EXPANSION_LESSON_IDS = [
  'survival-personal-information',
  'survival-directions-and-neighborhood',
  'survival-public-transport',
  'survival-cafe-and-food',
  'survival-shopping-and-clothing',
  'survival-appointments-and-time',
  'survival-health-and-pharmacy',
  'survival-hobbies-and-free-time',
  'survival-invitations-and-plans',
  'survival-weather-and-seasons',
  'survival-travel-and-tickets',
  'survival-hotel-and-stay',
  'survival-phone-and-messages',
  'survival-services-and-post-office',
  'survival-school-and-learning',
  'survival-current-activities',
  'survival-past-and-future-plans',
] as const;

/** Stable lesson order for the fully developed A1/Survival block. */
export const SURVIVAL_COURSE_LESSON_IDS = [
  'survival-job-interview',
  'survival-renting-a-home',
  ...SURVIVAL_EXPANSION_LESSON_IDS,
] as const;

const survivalExpansionIds = new Set<string>(SURVIVAL_EXPANSION_LESSON_IDS);
const selectedSurvivalLessons = FOUNDATION_SURVIVAL_EXPANSION_LESSONS
  .filter(lesson => survivalExpansionIds.has(lesson.id));
if (selectedSurvivalLessons.length !== SURVIVAL_EXPANSION_LESSON_IDS.length) {
  throw new Error('A selected Survival expansion lesson is missing from its source.');
}

const SURVIVAL_EXPANSION_INSERTION_ORDER = 12;
const SURVIVAL_EXPANSION_LESSONS = selectedSurvivalLessons.map((lesson, index) => ({
  ...lesson,
  order: SURVIVAL_EXPANSION_INSERTION_ORDER + index + 1,
  durationMinutes: 20,
}));

const LESSONS_WITH_SURVIVAL_EXPANSION: SentenceLesson[] = [
  ...LESSONS_WITH_FOUNDATION_EXPANSION.map(lesson => lesson.order > SURVIVAL_EXPANSION_INSERTION_ORDER
    ? { ...lesson, order: lesson.order + SURVIVAL_EXPANSION_LESSONS.length }
    : lesson),
  ...SURVIVAL_EXPANSION_LESSONS,
].sort((a, b) => a.order - b.order);

/** Fifteen new A2–B1 Everyday English lessons follow the five previously published lessons. */
export const EVERYDAY_EXPANSION_LESSON_IDS = [
  'everyday-managing-a-busy-day',
  'everyday-keeping-in-touch',
  'everyday-sharing-an-experience',
  'everyday-comparing-choices',
  'everyday-cooking-at-home',
  'everyday-shopping-returns',
  'everyday-money-and-budget',
  'everyday-teamwork-at-work',
  'everyday-study-and-projects',
  'everyday-healthy-habits',
  'everyday-travel-changes',
  'everyday-email-and-messages',
  'everyday-sharing-a-home',
  'everyday-making-a-complaint',
  'everyday-sharing-opinions',
] as const;

/** Stable sequence of all twenty published Everyday English lessons. */
export const EVERYDAY_COURSE_LESSON_IDS = [
  'everyday-facing-a-challenge',
  'everyday-making-a-plan',
  'everyday-handling-a-misunderstanding',
  'everyday-talking-about-weather',
  'everyday-handling-an-emergency',
  ...EVERYDAY_EXPANSION_LESSON_IDS,
] as const;

const everydayExpansionIds = new Set<string>(EVERYDAY_EXPANSION_LESSON_IDS);
const selectedEverydayLessons = EVERYDAY_EXPANSION_LESSONS
  .filter(lesson => everydayExpansionIds.has(lesson.id));
if (selectedEverydayLessons.length !== EVERYDAY_EXPANSION_LESSON_IDS.length) {
  throw new Error('A selected Everyday English expansion lesson is missing from its source.');
}

const EVERYDAY_EXPANSION_INSERTION_ORDER = 34;
const EVERYDAY_EXPANSION_INSERTION_LESSONS = selectedEverydayLessons.map((lesson, index) => ({
  ...lesson,
  order: EVERYDAY_EXPANSION_INSERTION_ORDER + index + 1,
  durationMinutes: 20,
}));

const COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION: SentenceLesson[] = [
  ...LESSONS_WITH_SURVIVAL_EXPANSION.map(lesson => lesson.order > EVERYDAY_EXPANSION_INSERTION_ORDER
    ? { ...lesson, order: lesson.order + EVERYDAY_EXPANSION_INSERTION_LESSONS.length }
    : lesson),
  ...EVERYDAY_EXPANSION_INSERTION_LESSONS,
].sort((a, b) => a.order - b.order);

const survivalLessonIds = new Set<string>(SURVIVAL_COURSE_LESSON_IDS);
const survivalLessonsBeforeCompletion = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.filter(lesson => lesson.levelId === 1);
const survivalCompletionIds = Object.keys(SURVIVAL_COMPLETION_SENTENCES);
if (survivalLessonsBeforeCompletion.map(lesson => lesson.id).join('|') !== SURVIVAL_COURSE_LESSON_IDS.join('|')
  || survivalCompletionIds.length !== SURVIVAL_COURSE_LESSON_IDS.length
  || survivalCompletionIds.some(id => !survivalLessonIds.has(id))) {
  throw new Error('The Survival completion data must match the stable 19-lesson A1 course order.');
}

const communicationLessonsBeforeCompletion = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.filter(lesson => lesson.levelId === 3);
const communicationCompletionIds = Object.keys(COMMUNICATION_COMPLETION_SENTENCES);
if (communicationLessonsBeforeCompletion.map(lesson => lesson.id).join('|') !== COMMUNICATION_COURSE_LESSON_IDS.join('|')
  || communicationCompletionIds.length !== COMMUNICATION_COURSE_LESSON_IDS.length
  || communicationCompletionIds.some(id => !COMMUNICATION_COURSE_LESSON_IDS.includes(id as typeof COMMUNICATION_COURSE_LESSON_IDS[number]))) {
  throw new Error('The Communication completion data must match the stable fifteen-lesson course order.');
}

const everydayLessonsBeforeCompletion = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.filter(lesson => lesson.levelId === 2);
const everydayCompletionIds = Object.keys(EVERYDAY_COMPLETION_SENTENCES);
if (everydayLessonsBeforeCompletion.map(lesson => lesson.id).join('|') !== EVERYDAY_COURSE_LESSON_IDS.join('|')
  || everydayCompletionIds.length !== EVERYDAY_COURSE_LESSON_IDS.length
  || everydayCompletionIds.some(id => !EVERYDAY_COURSE_LESSON_IDS.includes(id as typeof EVERYDAY_COURSE_LESSON_IDS[number]))) {
  throw new Error('The Everyday completion data must match the stable 20-lesson course order.');
}
const originalEverydayLessonIds = new Set<string>(EVERYDAY_COURSE_LESSON_IDS.slice(0, 5));

export const SENTENCE_LESSONS: SentenceLesson[] = COURSE_LESSONS_BEFORE_SURVIVAL_COMPLETION.map(lesson => {
  if (lesson.levelId === 3) {
    const additions = COMMUNICATION_COMPLETION_SENTENCES[lesson.id as keyof typeof COMMUNICATION_COMPLETION_SENTENCES];
    if (!additions || lesson.sentences.length !== 6 || additions.length !== 44) {
      throw new Error(`Communication lesson ${lesson.id} must preserve its six prepared examples and add forty-four.`);
    }
    if (additions.some(sentence => !sentence.en || !sentence.fa || !sentence.pronunciation
      || !sentence.pattern || sentence.vocabulary.length < 2
      || sentence.vocabulary.some(({ word, meaning }) => !word || !meaning || !sentence.en.toLowerCase().includes(word.toLowerCase())))) {
      throw new Error(`Communication completion sentences for ${lesson.id} must include translations, pronunciation, patterns, and sentence-linked vocabulary.`);
    }

    const sentences = [...lesson.sentences, ...additions];
    const normalizedExamples = sentences.map(sentence => sentence.en.trim().toLowerCase()
      .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '));
    if (sentences.length !== 50
      || new Set(sentences.map(sentence => sentence.id)).size !== 50
      || new Set(normalizedExamples).size !== 50) {
      throw new Error(`Communication lesson ${lesson.id} must have fifty unique sentence IDs and examples.`);
    }

    const unit = COMMUNICATION_LESSON_UNIT[lesson.id];
    if (!unit) throw new Error(`Communication lesson ${lesson.id} is missing its thematic unit.`);
    return {
      ...lesson,
      durationMinutes: 35,
      unitId: unit.unitId,
      unitTitle: unit.unitTitleFa,
      unitTitleEn: unit.unitTitleEn,
      sentences,
    };
  }

  if (lesson.levelId === 2) {
    const additions = EVERYDAY_COMPLETION_SENTENCES[lesson.id as keyof typeof EVERYDAY_COMPLETION_SENTENCES];
    const expectedBaseCount = originalEverydayLessonIds.has(lesson.id) ? 6 : 10;
    if (!additions || lesson.sentences.length !== expectedBaseCount || additions.length !== 50 - expectedBaseCount) {
      throw new Error(`Everyday lesson ${lesson.id} must preserve its prepared examples and add enough to reach fifty.`);
    }
    if (additions.some(sentence => !sentence.en || !sentence.fa || !sentence.pronunciation
      || !sentence.pattern || sentence.vocabulary.length < 2
      || sentence.vocabulary.some(({ word, meaning }) => !word || !meaning || !sentence.en.toLowerCase().includes(word.toLowerCase())))) {
      throw new Error(`Everyday completion sentences for ${lesson.id} must include translations, pronunciation, patterns, and sentence-linked vocabulary.`);
    }

    const sentences = [...lesson.sentences, ...additions];
    const normalizedExamples = sentences.map(sentence => sentence.en.trim().toLowerCase()
      .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '));
    if (new Set(sentences.map(sentence => sentence.id)).size !== 50
      || new Set(normalizedExamples).size !== 50) {
      throw new Error(`Everyday lesson ${lesson.id} must have fifty unique sentence IDs and examples.`);
    }

    return { ...lesson, durationMinutes: 35, sentences };
  }

  if (lesson.levelId !== 1) return lesson;

  const additions = SURVIVAL_COMPLETION_SENTENCES[lesson.id];
  if (!additions || lesson.sentences.length + additions.length !== 50) {
    throw new Error(`Survival lesson ${lesson.id} must contain exactly fifty sentence examples.`);
  }
  if (additions.some(sentence => !sentence.en || !sentence.fa || !sentence.pronunciation
    || !sentence.pattern || sentence.vocabulary.length === 0)) {
    throw new Error(`Survival completion sentences for ${lesson.id} must include translation, pronunciation, pattern, and linked vocabulary.`);
  }

  const sentences = [...lesson.sentences, ...additions];
  if (new Set(sentences.map(sentence => sentence.id)).size !== 50
    || new Set(sentences.map(sentence => sentence.en.trim().toLowerCase())).size !== 50) {
    throw new Error(`Survival lesson ${lesson.id} must have fifty unique sentence IDs and examples.`);
  }

  return { ...lesson, durationMinutes: 35, sentences };
});

export const getSentenceLesson = (id: string) => SENTENCE_LESSONS.find((lesson) => lesson.id === id);
