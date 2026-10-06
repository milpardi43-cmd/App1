import { EXPANDED_SENTENCE_LESSONS } from './courseContentExpansion';
import { ADVANCED_SENTENCE_LESSONS } from './courseContentExpansion2';
import { ADVANCED_SENTENCE_LESSONS_2 } from './courseContentExpansion3';
import { ADVANCED_SENTENCE_LESSONS_3 } from './courseContentExpansion4';
import { ADVANCED_SENTENCE_LESSONS_4 } from './courseContentExpansion5';
import { ADVANCED_SENTENCE_LESSONS_5 } from './courseContentExpansion6';
import { ADVANCED_SENTENCE_LESSONS_6 } from './courseContentExpansion7';
import { ADVANCED_SENTENCE_LESSONS_7 } from './courseContentExpansion8';
import { FINAL_SENTENCE_LESSONS } from './courseContentFinal';

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
  title: string;
  subtitle: string;
  situation: string;
  durationMinutes: number;
  sentences: CourseSentence[];
  dialogue: Array<{ speaker: 'learner' | 'partner'; text: string; fa: string }>;
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
    description: 'صداها، خواندن ساده و جمله‌های ضروری',
    color: '#6366f1',
    modules: ['تلفظ و صداها', 'خواندن پایه', '۱۰۰ جمله ضروری', 'عبارت‌های فوری'],
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
    modules: ['بحث و نظر', 'داستان‌گویی', 'ارتباط حرفه‌ای'],
  },
  {
    id: 4,
    title: 'Advanced English',
    cefr: 'B2–C1',
    description: 'انگلیسی دانشگاهی، کاری و پیشرفته',
    color: '#8b5cf6',
    modules: ['انگلیسی دانشگاهی', 'کسب‌وکار', 'IELTS و گفتار حرفه‌ای'],
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

export const SENTENCE_LESSONS: SentenceLesson[] = [
  ...CORE_SENTENCE_LESSONS,
  ...EXPANDED_SENTENCE_LESSONS,
  ...ADVANCED_SENTENCE_LESSONS,
  ...ADVANCED_SENTENCE_LESSONS_2,
  ...ADVANCED_SENTENCE_LESSONS_3,
  ...ADVANCED_SENTENCE_LESSONS_4,
  ...ADVANCED_SENTENCE_LESSONS_5,
  ...ADVANCED_SENTENCE_LESSONS_6,
  ...ADVANCED_SENTENCE_LESSONS_7,
  ...FINAL_SENTENCE_LESSONS,
].sort((a, b) => a.order - b.order);

export const getSentenceLesson = (id: string) => SENTENCE_LESSONS.find((lesson) => lesson.id === id);
