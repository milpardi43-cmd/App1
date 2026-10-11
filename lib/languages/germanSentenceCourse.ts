import type { LearningLesson, LearningSentence } from './types';
import { PRE_A1_SENTENCE_ADDITIONS } from './germanPreA1Expansion';
import { A1_EXPANSION_TEACHING_NOTES, A1_SENTENCE_ADDITIONS } from './germanA1SentenceExpansion';
import { A2_EXPANSION_TEACHING_NOTES, A2_SENTENCE_ADDITIONS } from './germanA2SentenceExpansion';
import { B1_EXPANSION_TEACHING_NOTES, B1_SENTENCE_ADDITIONS } from './germanB1SentenceExpansion';

/** Internal teaching bands; these labels do not claim formal CEFR accreditation. */
export type GermanSentenceLevelId = 0 | 1 | 2 | 3;

export interface GermanSentenceCourseLevel {
  id: GermanSentenceLevelId;
  title: string;
  cefr: string;
  description: string;
  color: string;
  modules: readonly string[];
}

export interface GermanSentenceCourseLesson extends LearningLesson {
  levelId: GermanSentenceLevelId;
  order: number;
  subtitle: string;
}

export const GERMAN_SENTENCE_LEVELS: readonly GermanSentenceCourseLevel[] = [
  {
    id: 0,
    title: 'آلمانی مقدماتی',
    cefr: 'Pre-A1',
    description: 'مرحلهٔ مقدماتی داخلی پیش از ادامهٔ A1؛ از الفبا و معرفی تا خانه، برنامهٔ روزانه، خرید و نیازهای پایه، با جمله‌های کوتاه و گفت‌وگو.',
    color: '#6555E9',
    modules: ['سلام و آشنایی', 'نام و محل زندگی', 'زبان کلاس', 'عدد و زمان', 'نیازهای روزمره', 'الفبا و هجی‌کردن', 'کشورها و زبان‌ها', 'روزها و برنامهٔ ساده', 'نشانی و اطلاعات تماس', 'خوراک و نوشیدنی', 'اشیا و رنگ‌ها', 'مکان‌ها و جهت‌های پایه', 'فعل‌های پایه و ضمیرها', 'پرسش و منفی‌سازی', 'خانواده و افراد', 'خانه و اتاق‌ها', 'برنامهٔ روزانه', 'خرید و قیمت', 'احساس و تندرستی پایه', 'گفت‌وگو و مرور ترکیبی']
  },
  {
    id: 1,
    title: 'آلمانی پایه',
    cefr: 'A1',
    description: 'مرحلهٔ پایهٔ داخلی برای ارتباط روزمره در خانه، کار، آموزش، خرید، سلامت و سفر؛ با جمله‌سازی و گفت‌وگوهای کاربردی.',
    color: '#27A1D6',
    modules: ['خانواده و دوستان', 'برنامه روزانه', 'کافه و غذا', 'خرید و انتخاب', 'شهر و حمل‌ونقل', 'خانه و محله', 'کار و شغل', 'تقویم، تاریخ و قرار', 'وقت آزاد و سرگرمی‌ها', 'هوا و فصل‌ها', 'سلامت و وقت پزشک', 'سفر و اقامت', 'کلاس زبان و یادگیری', 'تلفن، نشانی و فرم', 'دعوت و برنامه‌ریزی', 'آخر هفته و گذشته', 'خرید، اندازه و قیمت', 'غذا و ترجیحات', 'خدمات روزمره', 'توصیف سادهٔ آدم‌ها و اشیا', 'کارهای خانه', 'ایستگاه و بلیت قطار', 'تماس و پیام کوتاه', 'درخواست کمک در موقعیت روزمره', 'گفت‌وگوی ترکیبی A1'],
  },
  {
    id: 2,
    title: 'آلمانی روزمره',
    cefr: 'A2',
    description: '۲۵ موقعیت روزمره برای روایت تجربه، حل مسئله، هماهنگی برنامه و گفت‌وگو دربارهٔ خانه، کار، سفر و خدمات؛ با جمله‌سازی، ترجمه، تلفظ و واژگان.',
    color: '#19A88B',
    modules: ['آخر هفته و گذشته', 'سفر و اقامت', 'سلامتی و قرار', 'خانه و خدمات', 'دعوت و برنامه', 'رفت‌وآمد و مسیرهای شهری', 'کار و همکاران', 'آموزش و هدف‌های یادگیری', 'خرید، تعویض و خدمات مشتری', 'رستوران و آشپزی', 'زندگی دیجیتال و ارتباط', 'اداره‌ها و کارهای روزمره', 'جابه‌جایی و خانهٔ تازه', 'برنامه‌ریزی سفر', 'خاطرهٔ سفر در گذشته', 'هوا، فصل‌ها و محیط زیست', 'مهمانی، خانواده و مناسبت‌ها', 'فرهنگ، رویداد و اوقات فراغت', 'سلامت و عادت‌های روزانه', 'حل مسئله در خانه و شهر', 'هماهنگی زمان و برنامه‌های متغیر', 'مقایسه و انتخاب', 'تجربه و نظر با دلیل', 'بازدید از شهر و محیط اطراف', 'گفت‌وگوی ترکیبی A2'],
  },
  {
    id: 3,
    title: 'بیان و ارتباط',
    cefr: 'B1',
    description: '۲۵ موقعیت برای بیان نظر با دلیل، گزارش تجربه، مشارکت در گفت‌وگوی کاری و اجتماعی، ارزیابی اطلاعات و حل مسئله؛ همراه با جمله‌های پیوسته و ارتباط مؤدبانه.',
    color: '#E4A436',
    modules: ['نظر و دلیل', 'کار و تجربه', 'شکایت و راه‌حل', 'تغییر و خبر', 'یادگیری و آینده', 'جلسه، مشارکت و جمع‌بندی', 'مصاحبه و مسیر شغلی', 'بودجه و تصمیم‌های مالی روزمره', 'همسایه‌ها و توافق‌های روزمره', 'سفر، تأخیر و تغییر برنامه', 'روایت تجربه و خاطره', 'ادامهٔ تحصیل و انتخاب دوره', 'سلامت و گفت‌وگو با مطب', 'فناوری، حریم خصوصی و رسانهٔ دیجیتال', 'محیط زیست و انتخاب پایدار', 'خبر، رسانه و ارزیابی منبع', 'کتاب، فیلم و نقد فرهنگی', 'دوستی، ارتباط و سوءتفاهم', 'مشارکت داوطلبانه و اجتماع', 'حل اختلاف و مصالحه', 'هدف‌های شخصی و برنامه‌ریزی', 'شرط، پیامد و گزینهٔ جایگزین', 'فرایندها و دستورالعمل‌ها', 'نامه و پیام رسمی', 'گفت‌وگوی ترکیبی B1'],
  },
] as const;

const sentence = (
  id: string,
  text: string,
  fa: string,
  pronunciation: string,
  word: string,
  meaning: string,
  pattern?: string,
  extraVocabulary: Array<{ word: string; meaning: string }> = [],
): LearningSentence => ({
  id,
  text,
  fa,
  pronunciation,
  ...(pattern ? { pattern } : {}),
  vocabulary: [{ word, meaning }, ...extraVocabulary],
});

const lesson = (
  levelId: GermanSentenceLevelId,
  order: number,
  id: string,
  title: string,
  subtitle: string,
  situation: string,
  teachingFa: string,
  sentences: LearningSentence[],
  dialogue: LearningLesson['dialogue'],
): GermanSentenceCourseLesson => ({
  id,
  levelId,
  order,
  title,
  subtitle,
  situation,
  teachingFa,
  durationMinutes: 9,
  sentences,
  dialogue,
});

/** Sentence-first German curriculum. Vocabulary entries include both headwords and reusable phrases/chunks. */
const BASE_GERMAN_SENTENCE_LESSONS: GermanSentenceCourseLesson[] = [
  // Pre-A1 · Foundation
  lesson(0, 1, 'de-v2-greetings', 'سلام و آشنایی', 'با چند جمله کوتاه شروع کنید.', 'برای اولین بار با یک نفر روبه‌رو می‌شوید؛ سلام می‌کنید و احوال می‌پرسید.', 'عبارت‌های سلام را همراه پاسخ طبیعی‌شان یاد بگیرید. در پرسش دوستانه از du استفاده می‌کنیم.', [
    sentence('de-v2-greetings-s1', 'Hallo!', 'سلام!', 'هالو', 'hallo', 'سلام'),
    sentence('de-v2-greetings-s2', 'Guten Morgen!', 'صبح بخیر!', 'گوتِن مورگِن', 'der Morgen', 'صبح'),
    sentence('de-v2-greetings-s3', 'Wie geht es dir?', 'حالت چطور است؟', 'وی گِیت اِس دیر؟', 'Wie geht es?', 'حالت چطور است؟', 'Wie geht es + شخص؟'),
    sentence('de-v2-greetings-s4', 'Mir geht es gut, danke.', 'حالم خوب است، ممنون.', 'میر گِیت اِس گوت، دانکِه', 'gut', 'خوب'),
    sentence('de-v2-greetings-s5', 'Bis bald!', 'به‌زودی می‌بینمت!', 'بیس بالت', 'bis bald', 'به‌زودی می‌بینمت'),
  ], [
    { speaker: 'طرف مقابل', text: 'Hallo! Wie geht es dir?', fa: 'سلام! حالت چطور است؟' },
    { speaker: 'شما', text: 'Mir geht es gut, danke. Und dir?', fa: 'حالم خوب است، ممنون. تو چطور؟' },
    { speaker: 'طرف مقابل', text: 'Auch gut, danke. Bis bald!', fa: 'من هم خوبم، ممنون. به‌زودی می‌بینمت!' },
  ]),
  lesson(0, 2, 'de-v2-name-origin', 'نام و محل زندگی', 'نام و محل زندگی‌تان را بگویید.', 'در کلاس زبان با هم‌کلاسی تازه‌ای آشنا می‌شوید و خودتان را معرفی می‌کنید.', 'فعل صرف‌شده در جمله ساده جایگاه دوم را می‌گیرد: Ich heiße … و Ich komme …', [
    sentence('de-v2-name-s1', 'Ich heiße Mina.', 'اسم من مینا است.', 'ایش هایسِه مینا', 'heißen', 'نام داشتن', 'Ich heiße + نام.'),
    sentence('de-v2-name-s2', 'Wie heißt du?', 'اسم تو چیست؟', 'وی هایست دو؟', 'du', 'تو؛ خطاب دوستانه'),
    sentence('de-v2-name-s3', 'Ich komme aus dem Iran.', 'من اهل ایران هستم.', 'ایش کومِه آوس دِم ایران', 'kommen aus', 'اهلِ جایی بودن', 'Ich komme aus + کشور.'),
    sentence('de-v2-name-s4', 'Woher kommst du?', 'اهل کجا هستی؟', 'ووهِر کومست دو؟', 'woher', 'از کجا'),
    sentence('de-v2-name-s5', 'Ich wohne in Berlin.', 'من در برلین زندگی می‌کنم.', 'ایش وونِه این بِرلین', 'wohnen', 'زندگی کردن؛ سکونت داشتن'),
  ], [
    { speaker: 'طرف مقابل', text: 'Hallo! Wie heißt du?', fa: 'سلام! اسمت چیست؟' },
    { speaker: 'شما', text: 'Ich heiße Mina. Ich komme aus dem Iran.', fa: 'اسم من مینا است. من اهل ایران هستم.' },
    { speaker: 'طرف مقابل', text: 'Wo wohnst du?', fa: 'کجا زندگی می‌کنی؟' },
    { speaker: 'شما', text: 'Ich wohne in Berlin.', fa: 'من در برلین زندگی می‌کنم.' },
  ]),
  lesson(0, 3, 'de-v2-classroom', 'زبان کلاس', 'واژه‌های کلاس را در جمله ببینید.', 'در کلاس، معنی یک واژه را می‌پرسید و از مدرس می‌خواهید جمله را تکرار کند.', 'برای درخواست مؤدبانه می‌توانیم bitte را به جمله اضافه کنیم. سؤال W معمولاً با واژه پرسشی شروع می‌شود.', [
    sentence('de-v2-class-s1', 'Ich lerne Deutsch.', 'من آلمانی یاد می‌گیرم.', 'ایش لِرنِه دویچ', 'Deutsch', 'زبان آلمانی'),
    sentence('de-v2-class-s2', 'Das ist mein Buch.', 'این کتاب من است.', 'داس ایست ماین بوخ', 'das Buch', 'کتاب'),
    sentence('de-v2-class-s3', 'Was bedeutet dieses Wort?', 'این واژه چه معنی می‌دهد؟', 'واس بِدویْتِت دیزِس وُرت؟', 'das Wort', 'واژه'),
    sentence('de-v2-class-s4', 'Können Sie das bitte wiederholen?', 'می‌توانید لطفاً آن را تکرار کنید؟', 'کونِن زی داس بیتِه ویدِر‌هولِن؟', 'wiederholen', 'تکرار کردن'),
    sentence('de-v2-class-s5', 'Ich verstehe die Frage.', 'من سؤال را می‌فهمم.', 'ایش فِرشتِه دی فراگِه', 'die Frage', 'سؤال'),
  ], [
    { speaker: 'شما', text: 'Was bedeutet dieses Wort?', fa: 'این واژه چه معنی می‌دهد؟' },
    { speaker: 'مدرس', text: 'Es bedeutet „Buch“.', fa: 'معنی آن «کتاب» است.' },
    { speaker: 'شما', text: 'Danke. Können Sie das bitte wiederholen?', fa: 'ممنون. می‌توانید لطفاً آن را تکرار کنید؟' },
  ]),
  lesson(0, 4, 'de-v2-numbers-time', 'عدد و زمان', 'عددها را در جمله‌های ساده به‌کار ببرید.', 'سن، تعداد و ساعت شروع کلاس را می‌گویید و می‌پرسید.', 'سن با sein و عبارت Jahre alt بیان می‌شود. زمان دقیق معمولاً با um می‌آید: um neun Uhr.', [
    sentence('de-v2-number-s1', 'Ich bin dreißig Jahre alt.', 'من سی سال دارم.', 'ایش بین درایسیش یارِه آلت', 'dreißig', 'سی', 'Ich bin … Jahre alt.'),
    sentence('de-v2-number-s2', 'Ich habe zwei Brüder.', 'من دو برادر دارم.', 'ایش هابِه تسوای برودِر', 'zwei', 'دو'),
    sentence('de-v2-number-s3', 'Es ist neun Uhr.', 'ساعت نه است.', 'اِس ایست نویْن اور', 'die Uhr', 'ساعت'),
    sentence('de-v2-number-s4', 'Der Kurs beginnt um zehn Uhr.', 'کلاس ساعت ده شروع می‌شود.', 'دِر کورس بِگینت اوم تسِین اور', 'beginnen', 'شروع شدن', 'beginnen um + ساعت.'),
    sentence('de-v2-number-s5', 'Ich brauche zwei Fahrkarten.', 'من دو بلیت لازم دارم.', 'ایش براوخِه تسوای فارکارتِن', 'die Fahrkarte', 'بلیت'),
  ], [
    { speaker: 'طرف مقابل', text: 'Wann beginnt der Kurs?', fa: 'کلاس چه زمانی شروع می‌شود؟' },
    { speaker: 'شما', text: 'Um zehn Uhr.', fa: 'ساعت ده.' },
    { speaker: 'طرف مقابل', text: 'Brauchst du eine Fahrkarte?', fa: 'به بلیت نیاز داری؟' },
    { speaker: 'شما', text: 'Ja, ich brauche zwei Fahrkarten.', fa: 'بله، دو بلیت لازم دارم.' },
  ]),
  lesson(0, 5, 'de-v2-basic-needs', 'نیازهای روزمره', 'درخواست کوتاه و مؤدبانه بسازید.', 'در یک مکان عمومی آب می‌خواهید و برای پیدا کردن سرویس بهداشتی کمک می‌گیرید.', 'برای درخواست کوتاه می‌توانید اسم را با bitte بیاورید. Können Sie …? درخواست مؤدبانه‌تری می‌سازد.', [
    sentence('de-v2-needs-s1', 'Ein Wasser, bitte.', 'یک آب، لطفاً.', 'آین واسِر، بیتِه', 'das Wasser', 'آب'),
    sentence('de-v2-needs-s2', 'Ich brauche Hilfe.', 'من به کمک نیاز دارم.', 'ایش براوخِه هیلفِه', 'die Hilfe', 'کمک'),
    sentence('de-v2-needs-s3', 'Wo ist die Toilette?', 'دستشویی کجاست؟', 'وو ایست دی توالِتِه؟', 'die Toilette', 'دستشویی'),
    sentence('de-v2-needs-s4', 'Können Sie mir helfen?', 'می‌توانید به من کمک کنید؟', 'کونِن زی میر هِلفِن؟', 'helfen', 'کمک کردن', 'Können Sie mir + فعل؟'),
    sentence('de-v2-needs-s5', 'Nein, danke.', 'نه، ممنون.', 'ناین، دانکِه', 'nein', 'نه'),
  ], [
    { speaker: 'شما', text: 'Entschuldigung, wo ist die Toilette?', fa: 'ببخشید، دستشویی کجاست؟' },
    { speaker: 'طرف مقابل', text: 'Dort links.', fa: 'آنجا سمت چپ.' },
    { speaker: 'شما', text: 'Vielen Dank!', fa: 'خیلی ممنون!' },
  ]),
  lesson(0, 6, 'de-v2-alphabet', 'الفبا و هجی‌کردن', 'نام و واژه‌ها را حرف‌به‌حرف بنویسید.', 'در کلاس، نام خود را هجی می‌کنید و از طرف مقابل می‌خواهید حرف‌ها را آهسته بگوید.', 'برای پرسیدن شیوهٔ نوشتن از Wie schreibt man …? استفاده کنید. buchstabieren یعنی واژه را با نام حرف‌ها گفتن.', [
    sentence('de-v2-alphabet-s1', 'Wie schreibt man deinen Namen?', 'اسم تو را چطور هجی می‌کنند؟', 'وی شرایبت مان داینِن نامِن؟', 'schreiben', 'نوشتن؛ هجی‌کردن', 'Wie schreibt man + اسم؟', [{ word: 'der Name', meaning: 'نام' }, { word: 'dein', meaning: 'مال تو' }]),
    sentence('de-v2-alphabet-s2', 'Mein Name ist Sara.', 'اسم من سارا است.', 'ماین نامِه ایست سارا', 'der Name', 'نام', undefined, [{ word: 'mein', meaning: 'مال من' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-alphabet-s3', 'Mein Name beginnt mit S.', 'نام من با حرف S شروع می‌شود.', 'ماین نامِه بِگینت میت اِس', 'beginnen', 'شروع شدن', 'beginnen mit + حرف', [{ word: 'mit', meaning: 'با' }, { word: 'der Buchstabe', meaning: 'حرف الفبا' }]),
    sentence('de-v2-alphabet-s4', 'Bitte buchstabiere das Wort langsam.', 'لطفاً واژه را آهسته هجی کن.', 'بیتِه بوخشتابیرِه داس وُرت لانگزام', 'buchstabieren', 'هجی‌کردن', undefined, [{ word: 'bitte', meaning: 'لطفاً' }, { word: 'langsam', meaning: 'آهسته' }, { word: 'das Wort', meaning: 'واژه' }]),
    sentence('de-v2-alphabet-s5', 'Ich kenne diesen Buchstaben nicht.', 'این حرف را نمی‌شناسم.', 'ایش کِنِه دیزِن بوخشتابِن نیشت', 'kennen', 'شناختن', undefined, [{ word: 'der Buchstabe', meaning: 'حرف الفبا' }, { word: 'nicht', meaning: 'نه؛ نمیـ' }]),
  ], [
    { speaker: 'شما', text: 'Wie schreibt man deinen Namen?', fa: 'اسم تو را چطور هجی می‌کنند؟' },
    { speaker: 'طرف مقابل', text: 'Sara. S-A-R-A.', fa: 'سارا؛ اِس، آ، اِر، آ.' },
    { speaker: 'شما', text: 'Danke. Jetzt kenne ich deinen Namen.', fa: 'ممنون. حالا اسم تو را می‌دانم.' },
  ]),
  lesson(0, 7, 'de-v2-countries-languages', 'کشورها و زبان‌ها', 'بگویید از کجا می‌آیید و چه زبانی می‌دانید.', 'در جمعی تازه، محل زندگی و زبان‌هایی را که صحبت می‌کنید معرفی می‌کنید.', 'برای زبان‌ها معمولاً از فعل sprechen استفاده می‌کنیم. برای گفتن توانایی محدود می‌گوییم ein bisschen: کمی.', [
    sentence('de-v2-languages-s1', 'Ich komme aus Japan.', 'من اهل ژاپن هستم.', 'ایش کومِه آوس یاپان', 'kommen aus', 'اهلِ جایی بودن', 'Ich komme aus + کشور.', [{ word: 'Japan', meaning: 'ژاپن' }, { word: 'aus', meaning: 'از' }]),
    sentence('de-v2-languages-s2', 'Ich spreche Japanisch.', 'من ژاپنی صحبت می‌کنم.', 'ایش شپِرِشِه یاپانیش', 'sprechen', 'صحبت‌کردن', undefined, [{ word: 'Japanisch', meaning: 'زبان ژاپنی' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-languages-s3', 'Welche Sprache sprichst du?', 'تو به چه زبانی صحبت می‌کنی؟', 'وِلشِه شپراخِه شپریخست دو؟', 'die Sprache', 'زبان', undefined, [{ word: 'welche', meaning: 'کدام؛ چه' }, { word: 'du', meaning: 'تو' }, { word: 'sprechen', meaning: 'صحبت‌کردن' }]),
    sentence('de-v2-languages-s4', 'Ich spreche heute ein bisschen Deutsch.', 'امروز کمی آلمانی صحبت می‌کنم.', 'ایش شپِرِشِه هویته آین بیسخِن دویچ', 'ein bisschen', 'کمی؛ اندکی', undefined, [{ word: 'heute', meaning: 'امروز' }, { word: 'Deutsch', meaning: 'زبان آلمانی' }, { word: 'sprechen', meaning: 'صحبت‌کردن' }]),
    sentence('de-v2-languages-s5', 'Wir lernen Persisch und Deutsch.', 'ما فارسی و آلمانی یاد می‌گیریم.', 'ویر لِرنِن پِرزی‌ش اونت دویچ', 'lernen', 'یادگرفتن؛ آموختن', undefined, [{ word: 'Persisch', meaning: 'زبان فارسی' }, { word: 'wir', meaning: 'ما' }, { word: 'Deutsch', meaning: 'زبان آلمانی' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Woher kommst du?', fa: 'اهل کجا هستی؟' },
    { speaker: 'شما', text: 'Ich komme aus Japan.', fa: 'من اهل ژاپن هستم.' },
    { speaker: 'طرف مقابل', text: 'Welche Sprache sprichst du?', fa: 'به چه زبانی صحبت می‌کنی؟' },
    { speaker: 'شما', text: 'Ich spreche Japanisch und ein bisschen Deutsch.', fa: 'ژاپنی و کمی آلمانی صحبت می‌کنم.' },
  ]),
  lesson(0, 8, 'de-v2-days-calendar', 'روزها و برنامهٔ ساده', 'روزهای هفته و زمان یک قرار را بگویید.', 'زمان کلاس یا یک قرار ساده را مشخص می‌کنید و دربارهٔ روز آن می‌پرسید.', 'برای روزهای هفته از am استفاده می‌کنیم: am Montag. امروز و فردا را با heute و morgen می‌گوییم.', [
    sentence('de-v2-days-s1', 'Heute ist Montag.', 'امروز دوشنبه است.', 'هویته ایست مونتاگ', 'heute', 'امروز', undefined, [{ word: 'Montag', meaning: 'دوشنبه' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-days-s2', 'Morgen ist Dienstag.', 'فردا سه‌شنبه است.', 'مورگِن ایست دینستاگ', 'morgen', 'فردا', undefined, [{ word: 'Dienstag', meaning: 'سه‌شنبه' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-days-s3', 'Der Kurs ist am Freitag.', 'کلاس روز جمعه است.', 'دِر کورس ایست اَم فرایتاگ', 'der Kurs', 'کلاس؛ دوره', undefined, [{ word: 'Freitag', meaning: 'جمعه' }, { word: 'am', meaning: 'در؛ روزِ' }]),
    sentence('de-v2-days-s4', 'Heute habe ich Zeit.', 'امروز وقت دارم.', 'هویته هابِه ایش تسایت', 'Zeit haben', 'وقت داشتن', undefined, [{ word: 'die Zeit', meaning: 'وقت؛ زمان' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-days-s5', 'Wann beginnt die Pause?', 'استراحت چه زمانی شروع می‌شود؟', 'وان بِگینت دی پاوزه؟', 'beginnen', 'شروع‌شدن', undefined, [{ word: 'wann', meaning: 'چه زمانی' }, { word: 'die Pause', meaning: 'استراحت؛ زنگ تفریح' }]),
  ], [
    { speaker: 'شما', text: 'Ist heute Montag?', fa: 'امروز دوشنبه است؟' },
    { speaker: 'طرف مقابل', text: 'Ja. Morgen ist Dienstag.', fa: 'بله. فردا سه‌شنبه است.' },
    { speaker: 'شما', text: 'Wann ist der Deutschkurs?', fa: 'کلاس آلمانی چه روزی است؟' },
    { speaker: 'طرف مقابل', text: 'Der Kurs ist am Freitag.', fa: 'کلاس روز جمعه است.' },
  ]),
  lesson(0, 9, 'de-v2-personal-details', 'نشانی و اطلاعات تماس', 'اطلاعات ساختگی را در جمله بیان کنید.', 'در تمرین کلاسی، نشانی و شمارهٔ نمونه را می‌پرسید و پاسخ می‌دهید.', 'برای حفظ حریم خصوصی فقط از نشانی و شمارهٔ ساختگی استفاده کنید. این تمرین، قالب پرسش و پاسخ را یاد می‌دهد.', [
    sentence('de-v2-details-s1', 'Wie ist deine Adresse?', 'نشانی تو چیست؟', 'وی ایست داینِه آدرِسِه؟', 'die Adresse', 'نشانی', undefined, [{ word: 'dein', meaning: 'مال تو' }, { word: 'wie', meaning: 'چطور؛ چه' }]),
    sentence('de-v2-details-s2', 'Ich wohne in der Musterstraße.', 'من در خیابان نمونه زندگی می‌کنم.', 'ایش وونِه این دِر موسترشتراسِه', 'wohnen', 'زندگی‌کردن؛ سکونت‌داشتن', undefined, [{ word: 'die Straße', meaning: 'خیابان' }, { word: 'die Musterstraße', meaning: 'خیابان نمونهٔ ساختگی' }]),
    sentence('de-v2-details-s3', 'Meine Hausnummer ist zehn.', 'شمارهٔ خانهٔ من ده است.', 'ماینِه هاوس‌نومِر ایست تسِین', 'die Hausnummer', 'شمارهٔ خانه؛ پلاک', undefined, [{ word: 'zehn', meaning: 'ده' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-details-s4', 'Wie ist deine Telefonnummer?', 'شمارهٔ تلفن تو چیست؟', 'وی ایست داینِه تِلِفون‌نومِر؟', 'die Telefonnummer', 'شمارهٔ تلفن', undefined, [{ word: 'das Telefon', meaning: 'تلفن' }, { word: 'dein', meaning: 'مال تو' }]),
    sentence('de-v2-details-s5', 'Meine Nummer endet auf fünf.', 'شمارهٔ من به پنج ختم می‌شود.', 'ماینِه نومِر اِندِت آوف فونف', 'enden auf', 'به … ختم‌شدن', undefined, [{ word: 'die Nummer', meaning: 'شماره' }, { word: 'fünf', meaning: 'پنج' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie ist deine Adresse?', fa: 'نشانی تو چیست؟' },
    { speaker: 'شما', text: 'Ich wohne in der Musterstraße.', fa: 'من در خیابان نمونه زندگی می‌کنم.' },
    { speaker: 'طرف مقابل', text: 'Wie ist deine Telefonnummer?', fa: 'شمارهٔ تلفنت چیست؟' },
    { speaker: 'شما', text: 'Meine Nummer endet auf fünf.', fa: 'شماره‌ام به پنج ختم می‌شود.' },
  ]),
  lesson(0, 10, 'de-v2-food-drink', 'خوراک و نوشیدنی', 'نیازهای سادهٔ خوراکی را بگویید.', 'در یک موقعیت روزمره می‌گویید چه می‌خورید و چه نوشیدنی می‌خواهید.', 'essen برای خوردن و trinken برای نوشیدن است. برای بیان گرسنگی و تشنگی در آلمانی از haben استفاده می‌شود.', [
    sentence('de-v2-food-s1', 'Ich trinke Wasser.', 'من آب می‌نوشم.', 'ایش ترینکِه واسِر', 'trinken', 'نوشیدن', undefined, [{ word: 'das Wasser', meaning: 'آب' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-food-s2', 'Ich esse Brot.', 'من نان می‌خورم.', 'ایش اِسِه بروت', 'essen', 'خوردن', undefined, [{ word: 'das Brot', meaning: 'نان' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-food-s3', 'Ich möchte einen Apfel.', 'من یک سیب می‌خواهم.', 'ایش موشتِه آینِن آپفِل', 'möchten', 'خواستن؛ مایل‌بودن', undefined, [{ word: 'der Apfel', meaning: 'سیب' }, { word: 'einen', meaning: 'یک؛ شکل مذکر در مفعولی' }]),
    sentence('de-v2-food-s4', 'Ich habe Hunger.', 'من گرسنه‌ام.', 'ایش هابِه هونگِر', 'der Hunger', 'گرسنگی', undefined, [{ word: 'Hunger haben', meaning: 'گرسنه‌بودن' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-food-s5', 'Ich habe Durst.', 'من تشنه‌ام.', 'ایش هابِه دورست', 'der Durst', 'تشنگی', undefined, [{ word: 'Durst haben', meaning: 'تشنه‌بودن' }, { word: 'haben', meaning: 'داشتن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Hast du Hunger?', fa: 'گرسنه‌ای؟' },
    { speaker: 'شما', text: 'Ja. Ich esse Brot und einen Apfel.', fa: 'بله. نان و یک سیب می‌خورم.' },
    { speaker: 'طرف مقابل', text: 'Möchtest du Wasser?', fa: 'آب می‌خواهی؟' },
    { speaker: 'شما', text: 'Ja, bitte.', fa: 'بله، لطفاً.' },
  ]),
  lesson(0, 11, 'de-v2-objects-colors', 'اشیا و رنگ‌ها', 'چیزهای ساده را نام ببرید و توصیف کنید.', 'در کلاس چند وسیله را نشان می‌دهید و رنگ یا جای آن‌ها را می‌گویید.', 'اسم‌ها در آلمانی حرف تعریف دارند؛ اینجا ein و eine را در جمله‌های کوتاه ببینید. رنگ معمولاً بعد از فعل sein می‌آید.', [
    sentence('de-v2-objects-s1', 'Das ist ein Tisch.', 'این یک میز است.', 'داس ایست آین تیش', 'der Tisch', 'میز', undefined, [{ word: 'ein', meaning: 'یک؛ حرف تعریف نکره' }, { word: 'das', meaning: 'این؛ آن' }]),
    sentence('de-v2-objects-s2', 'Das ist eine Tasche.', 'این یک کیف است.', 'داس ایست آینِه تاشِه', 'die Tasche', 'کیف', undefined, [{ word: 'eine', meaning: 'یک؛ حرف تعریف نکرهٔ مؤنث' }, { word: 'das', meaning: 'این؛ آن' }]),
    sentence('de-v2-objects-s3', 'Das Buch ist blau.', 'کتاب آبی است.', 'داس بوخ ایست بلاو', 'blau', 'آبی', undefined, [{ word: 'das Buch', meaning: 'کتاب' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-objects-s4', 'Die Tasche ist rot.', 'کیف قرمز است.', 'دی تاشِه ایست روت', 'rot', 'قرمز', undefined, [{ word: 'die Tasche', meaning: 'کیف' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-objects-s5', 'Wo ist mein Stift?', 'خودکار من کجاست؟', 'وو ایست ماین شتیفت؟', 'der Stift', 'خودکار؛ قلم', undefined, [{ word: 'wo', meaning: 'کجا' }, { word: 'mein', meaning: 'مال من' }]),
  ], [
    { speaker: 'شما', text: 'Was ist das?', fa: 'این چیست؟' },
    { speaker: 'طرف مقابل', text: 'Das ist ein Buch.', fa: 'این یک کتاب است.' },
    { speaker: 'شما', text: 'Welche Farbe hat das Buch?', fa: 'کتاب چه رنگی است؟' },
    { speaker: 'طرف مقابل', text: 'Das Buch ist blau.', fa: 'کتاب آبی است.' },
  ]),
  lesson(0, 12, 'de-v2-places-directions', 'مکان‌ها و جهت‌های پایه', 'یک مکان ساده را پیدا کنید.', 'در محله می‌پرسید مدرسه یا فروشگاه کجاست و راه را با چند واژهٔ کوتاه دنبال می‌کنید.', 'hier یعنی اینجا و dort یعنی آنجا. جهت‌های links و rechts کمک می‌کنند پاسخ کوتاه را بفهمید.', [
    sentence('de-v2-places-s1', 'Wo ist die Schule?', 'مدرسه کجاست؟', 'وو ایست دی شوله؟', 'die Schule', 'مدرسه', undefined, [{ word: 'wo', meaning: 'کجا' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-places-s2', 'Die Schule ist hier.', 'مدرسه اینجاست.', 'دی شوله ایست هیر', 'hier', 'اینجا', undefined, [{ word: 'die Schule', meaning: 'مدرسه' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-places-s3', 'Der Supermarkt ist dort.', 'فروشگاه آنجاست.', 'دِر زوپِرمارکت ایست دُرت', 'der Supermarkt', 'سوپرمارکت', undefined, [{ word: 'dort', meaning: 'آنجا' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-places-s4', 'Gehen Sie geradeaus.', 'مستقیم بروید.', 'گِیِن زی گِرادِه‌آوس', 'geradeaus', 'مستقیم', undefined, [{ word: 'gehen', meaning: 'رفتن' }, { word: 'Sie', meaning: 'شما؛ خطاب رسمی' }]),
    sentence('de-v2-places-s5', 'Ist der Bahnhof links oder rechts?', 'ایستگاه قطار سمت چپ است یا راست؟', 'ایست دِر بان‌هوف لینکس اودِر رِشتس؟', 'der Bahnhof', 'ایستگاه قطار', undefined, [{ word: 'links', meaning: 'سمت چپ' }, { word: 'rechts', meaning: 'سمت راست' }, { word: 'oder', meaning: 'یا' }]),
  ], [
    { speaker: 'شما', text: 'Entschuldigung, wo ist die Schule?', fa: 'ببخشید، مدرسه کجاست؟' },
    { speaker: 'طرف مقابل', text: 'Gehen Sie geradeaus. Die Schule ist dort.', fa: 'مستقیم بروید. مدرسه آنجاست.' },
    { speaker: 'شما', text: 'Ist die Schule links oder rechts?', fa: 'مدرسه سمت چپ است یا راست؟' },
    { speaker: 'طرف مقابل', text: 'Links.', fa: 'سمت چپ.' },
  ]),

  lesson(0, 13, 'de-v2-core-verbs-pronouns', 'فعل‌های پایه و ضمیرها', 'ضمیرها را با sein و haben در جمله به‌کار ببرید.', 'خودتان و چند وضعیت ساده را معرفی می‌کنید و دربارهٔ وقت یا آمادگی می‌پرسید.', 'فعل را همراه ضمیر و در قالب جمله یاد بگیرید: ich bin، du bist، wir sind؛ و ich habe، sie hat. اینجا هدف استفاده در جمله است، نه حفظ جدول صرف.', [
    sentence('de-v2-core-s1', 'Ich bin heute müde.', 'من امروز خسته‌ام.', 'ایش بین هویته مودِه', 'müde', 'خسته', undefined, [{ word: 'sein', meaning: 'بودن' }, { word: 'heute', meaning: 'امروز' }, { word: 'ich', meaning: 'من' }, { word: 'heute müde', meaning: 'امروز خسته' }]),
    sentence('de-v2-core-s2', 'Du bist sehr freundlich.', 'تو خیلی خوش‌برخوردی.', 'دو بیست زِر فرویندلیش', 'freundlich', 'خوش‌برخورد؛ مهربان', undefined, [{ word: 'du', meaning: 'تو' }, { word: 'sehr', meaning: 'خیلی' }, { word: 'sein', meaning: 'بودن' }, { word: 'sehr freundlich', meaning: 'خیلی خوش‌برخورد' }]),
    sentence('de-v2-core-s3', 'Er ist neu hier.', 'او اینجا تازه‌وارد است.', 'اِر ایست نوی هیر', 'neu', 'تازه؛ جدید', undefined, [{ word: 'er', meaning: 'او؛ برای مذکر' }, { word: 'hier', meaning: 'اینجا' }, { word: 'sein', meaning: 'بودن' }, { word: 'neu hier', meaning: 'تازه‌وارد؛ جدید در اینجا' }]),
    sentence('de-v2-core-s4', 'Ja, sie hat heute Zeit.', 'بله، او امروز وقت دارد.', 'یا، زی هات هویته تسایت', 'haben', 'داشتن', undefined, [{ word: 'ja', meaning: 'بله' }, { word: 'sie', meaning: 'او؛ برای مؤنث' }, { word: 'heute', meaning: 'امروز' }, { word: 'die Zeit', meaning: 'وقت؛ زمان' }, { word: 'Zeit haben', meaning: 'وقت‌داشتن' }]),
    sentence('de-v2-core-s5', 'Wir sind jetzt bereit.', 'ما حالا آماده‌ایم.', 'ویر زینت یِتست بِرایت', 'bereit', 'آماده', undefined, [{ word: 'wir', meaning: 'ما' }, { word: 'jetzt', meaning: 'حالا' }, { word: 'sein', meaning: 'بودن' }, { word: 'jetzt bereit', meaning: 'حالا آماده' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Bist du heute müde?', fa: 'امروز خسته‌ای؟' },
    { speaker: 'شما', text: 'Nein, ich bin jetzt bereit.', fa: 'نه، حالا آماده‌ام.' },
    { speaker: 'طرف مقابل', text: 'Hast du heute Zeit?', fa: 'امروز وقت داری؟' },
    { speaker: 'شما', text: 'Ja, ich habe Zeit.', fa: 'بله، وقت دارم.' },
  ]),
  lesson(0, 14, 'de-v2-questions-negation', 'پرسش و منفی‌سازی', 'پاسخ کوتاه بدهید و نبودن چیزی را بیان کنید.', 'در کلاس می‌پرسید کسی خانه است یا دفتر همراهش هست و با پاسخ کوتاه جواب می‌دهید.', 'در پرسش بله/خیر، فعل صرف‌شده معمولاً اول می‌آید: Bist du …? برای نفی اسم از kein و برای نفی صفت یا مکان از nicht استفاده کنید.', [
    sentence('de-v2-negation-s1', 'Bist du heute zu Hause?', 'امروز خانه هستی؟', 'بیست دو هویته تسو هاوزِه؟', 'zu Hause', 'در خانه', undefined, [{ word: 'heute', meaning: 'امروز' }, { word: 'sein', meaning: 'بودن' }, { word: 'du', meaning: 'تو' }, { word: 'zu Hause sein', meaning: 'در خانه بودن' }]),
    sentence('de-v2-negation-s2', 'Nein, ich bin nicht zu Hause.', 'نه، خانه نیستم.', 'ناین ایش بین نیشت تسو هاوزِه', 'nicht', 'نه؛ برای منفی‌کردن جمله', undefined, [{ word: 'nein', meaning: 'نه' }, { word: 'sein', meaning: 'بودن' }, { word: 'zu Hause', meaning: 'در خانه' }, { word: 'nicht zu Hause sein', meaning: 'خانه نبودن' }]),
    sentence('de-v2-negation-s3', 'Hast du ein Heft?', 'یک دفتر داری؟', 'هاست دو آین هِفت؟', 'das Heft', 'دفتر؛ جزوه', undefined, [{ word: 'haben', meaning: 'داشتن' }, { word: 'ein', meaning: 'یک؛ حرف تعریف نکره' }, { word: 'du', meaning: 'تو' }, { word: 'ein Heft', meaning: 'یک دفتر' }]),
    sentence('de-v2-negation-s4', 'Nein, ich habe kein Heft.', 'نه، دفتری ندارم.', 'ناین ایش هابِه کاین هِفت', 'kein', 'هیچ؛ برای منفی‌کردن اسم', undefined, [{ word: 'nein', meaning: 'نه' }, { word: 'haben', meaning: 'داشتن' }, { word: 'das Heft', meaning: 'دفتر؛ جزوه' }, { word: 'kein Heft haben', meaning: 'دفتر نداشتن' }]),
    sentence('de-v2-negation-s5', 'Das ist gar nicht schwer.', 'این اصلاً سخت نیست.', 'داس ایست گار نیشت شوِر', 'schwer', 'سخت؛ سنگین', undefined, [{ word: 'gar nicht', meaning: 'اصلاً نه' }, { word: 'das', meaning: 'این؛ آن' }, { word: 'sein', meaning: 'بودن' }, { word: 'gar nicht schwer', meaning: 'اصلاً سخت‌نبودن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Bist du heute zu Hause?', fa: 'امروز خانه هستی؟' },
    { speaker: 'شما', text: 'Nein, ich bin nicht zu Hause.', fa: 'نه، خانه نیستم.' },
    { speaker: 'طرف مقابل', text: 'Hast du ein Heft?', fa: 'دفتر داری؟' },
    { speaker: 'شما', text: 'Ja, hier ist mein Heft.', fa: 'بله، دفترم اینجاست.' },
  ]),
  lesson(0, 15, 'de-v2-family-basics', 'خانواده و افراد', 'چند نفر از خانواده را معرفی کنید.', 'با عکس‌های خانوادگی، مادر، پدر، خواهر و اعضای نزدیک خانواده را نام می‌برید.', 'برای معرفی می‌گوییم Das ist … . مالکیت را به صورت عبارت‌های آمادهٔ mein Vater و meine Mutter تمرین کنید.', [
    sentence('de-v2-family-basic-s1', 'Das ist meine Mutter.', 'این مادر من است.', 'داس ایست ماینِه موتِر', 'die Mutter', 'مادر', undefined, [{ word: 'meine', meaning: 'مال من؛ برای اسم مؤنث' }, { word: 'das ist', meaning: 'این است' }, { word: 'meine Mutter', meaning: 'مادر من' }]),
    sentence('de-v2-family-basic-s2', 'Das ist mein Vater.', 'این پدر من است.', 'داس ایست ماین فاتِر', 'der Vater', 'پدر', undefined, [{ word: 'mein', meaning: 'مال من؛ برای اسم مذکر' }, { word: 'das ist', meaning: 'این است' }, { word: 'mein Vater', meaning: 'پدر من' }]),
    sentence('de-v2-family-basic-s3', 'Ich habe eine Schwester.', 'من یک خواهر دارم.', 'ایش هابِه آینِه شوِستِر', 'die Schwester', 'خواهر', undefined, [{ word: 'haben', meaning: 'داشتن' }, { word: 'eine', meaning: 'یک؛ حرف تعریف مؤنث' }, { word: 'ich', meaning: 'من' }, { word: 'eine Schwester haben', meaning: 'یک خواهر داشتن' }, { word: 'die Geschwister', meaning: 'خواهرها و برادرها؛ خواهر یا برادر' }]),
    sentence('de-v2-family-basic-s4', 'Meine Eltern wohnen hier.', 'پدر و مادرم اینجا زندگی می‌کنند.', 'ماینِه اِلترن وونِن هیر', 'die Eltern', 'والدین', undefined, [{ word: 'wohnen', meaning: 'زندگی‌کردن؛ سکونت‌داشتن' }, { word: 'hier', meaning: 'اینجا' }, { word: 'meine', meaning: 'مال من؛ برای جمع' }, { word: 'meine Eltern', meaning: 'والدین من' }]),
    sentence('de-v2-family-basic-s5', 'Meine Familie ist groß.', 'خانوادهٔ من بزرگ است.', 'ماینِه فامیلیِه ایست گروس', 'die Familie', 'خانواده', undefined, [{ word: 'groß', meaning: 'بزرگ' }, { word: 'sein', meaning: 'بودن' }, { word: 'meine', meaning: 'مال من' }, { word: 'meine Familie', meaning: 'خانوادهٔ من' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wer ist das?', fa: 'این چه کسی است؟' },
    { speaker: 'شما', text: 'Das ist meine Mutter. Das ist mein Vater.', fa: 'این مادر من است. این پدر من است.' },
    { speaker: 'طرف مقابل', text: 'Hast du Geschwister?', fa: 'خواهر یا برادر داری؟' },
    { speaker: 'شما', text: 'Ja, ich habe eine Schwester.', fa: 'بله، یک خواهر دارم.' },
  ]),
  lesson(0, 16, 'de-v2-home-rooms', 'خانه و اتاق‌ها', 'اتاق‌ها و وسایل ساده را توصیف کنید.', 'در خانه، چند اتاق و جای وسایل را با جمله‌های کوتاه معرفی می‌کنید.', 'در این درس نام اتاق و وسیله را با صفت یا جای ساده می‌آوریم: Die Küche ist klein. Mein Bett ist am Fenster.', [
    sentence('de-v2-home-rooms-s1', 'Das ist mein Zimmer.', 'این اتاق من است.', 'داس ایست ماین تسیمِر', 'das Zimmer', 'اتاق', undefined, [{ word: 'mein', meaning: 'مال من' }, { word: 'das ist', meaning: 'این است' }, { word: 'mein Zimmer', meaning: 'اتاق من' }]),
    sentence('de-v2-home-rooms-s2', 'Die Küche ist klein.', 'آشپزخانه کوچک است.', 'دی کوخِه ایست کلاین', 'die Küche', 'آشپزخانه', undefined, [{ word: 'klein', meaning: 'کوچک' }, { word: 'sein', meaning: 'بودن' }, { word: 'klein sein', meaning: 'کوچک‌بودن' }]),
    sentence('de-v2-home-rooms-s3', 'Das Bad ist hier.', 'حمام اینجاست.', 'داس باد ایست هیر', 'das Bad', 'حمام؛ سرویس بهداشتی', undefined, [{ word: 'hier', meaning: 'اینجا' }, { word: 'sein', meaning: 'بودن' }, { word: 'hier sein', meaning: 'اینجا بودن' }]),
    sentence('de-v2-home-rooms-s4', 'Mein Bett steht am Fenster.', 'تخت من کنار پنجره است.', 'ماین بِت شتِیت اَم فِنستِر', 'das Bett', 'تخت', undefined, [{ word: 'stehen', meaning: 'قرارداشتن؛ ایستادن' }, { word: 'das Fenster', meaning: 'پنجره' }, { word: 'am Fenster', meaning: 'کنار پنجره' }, { word: 'am Fenster stehen', meaning: 'کنار پنجره قرارداشتن' }]),
    sentence('de-v2-home-rooms-s5', 'Die Tür ist offen.', 'در باز است.', 'دی تور ایست اوفِن', 'die Tür', 'در؛ درِ ورودی', undefined, [{ word: 'offen', meaning: 'باز' }, { word: 'sein', meaning: 'بودن' }, { word: 'offen sein', meaning: 'بازبودن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Ist das dein Zimmer?', fa: 'این اتاق توست؟' },
    { speaker: 'شما', text: 'Ja. Das Bad ist hier.', fa: 'بله. حمام اینجاست.' },
    { speaker: 'طرف مقابل', text: 'Wo steht dein Bett?', fa: 'تختت کجاست؟' },
    { speaker: 'شما', text: 'Mein Bett steht am Fenster.', fa: 'تخت من کنار پنجره است.' },
  ]),
  lesson(0, 17, 'de-v2-daily-routine-basics', 'برنامهٔ روزانه', 'چند کار روزمره را به‌ترتیب بگویید.', 'از صبحانه تا خواب، یک روز معمولی را با واژه‌های زمان و فعل‌های پرکاربرد شرح می‌دهید.', 'کارها را با نشانه‌های زمانی به هم وصل کنید: Dann …، am Mittag …، am Abend … . فعل جداشدنی aufstehen را در یک جملهٔ آماده ببینید.', [
    sentence('de-v2-routine-basic-s1', 'Ich stehe um sieben Uhr auf.', 'من ساعت هفت از خواب بلند می‌شوم.', 'ایش شتِه اوم زیبِن اور آوف', 'aufstehen', 'از خواب بلندشدن', 'Ich stehe … auf.', [{ word: 'um sieben Uhr', meaning: 'ساعت هفت' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-routine-basic-s2', 'Dann frühstücke ich.', 'بعد صبحانه می‌خورم.', 'دان فروشتوکِه ایش', 'frühstücken', 'صبحانه‌خوردن', undefined, [{ word: 'dann', meaning: 'بعد؛ سپس' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-routine-basic-s3', 'Um acht Uhr gehe ich zur Arbeit.', 'ساعت هشت به محل کار می‌روم.', 'اوم آخت اور گِه‌ه ایش تسور آربایت', 'zur Arbeit gehen', 'به محل کار رفتن', undefined, [{ word: 'acht', meaning: 'هشت' }, { word: 'gehen', meaning: 'رفتن' }, { word: 'die Arbeit', meaning: 'کار؛ محل کار' }]),
    sentence('de-v2-routine-basic-s4', 'Am Mittag esse ich mit Kollegen.', 'ظهر با همکارانم غذا می‌خورم.', 'اَم میتاگ اِسِه ایش میت کولِگِن', 'der Mittag', 'ظهر', undefined, [{ word: 'essen', meaning: 'خوردن' }, { word: 'mit', meaning: 'با' }, { word: 'der Kollege', meaning: 'همکار' }]),
    sentence('de-v2-routine-basic-s5', 'Am Abend gehe ich ins Bett.', 'شب به تخت می‌روم.', 'اَم آبِنت گِه‌ه ایش اینس بِت', 'ins Bett gehen', 'به تخت‌خواب رفتن', undefined, [{ word: 'der Abend', meaning: 'عصر؛ شب' }, { word: 'gehen', meaning: 'رفتن' }, { word: 'das Bett', meaning: 'تخت' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wann stehst du auf?', fa: 'چه ساعتی بلند می‌شوی؟' },
    { speaker: 'شما', text: 'Um sieben Uhr. Dann frühstücke ich.', fa: 'ساعت هفت. بعد صبحانه می‌خورم.' },
    { speaker: 'طرف مقابل', text: 'Und am Abend?', fa: 'و شب؟' },
    { speaker: 'شما', text: 'Am Abend gehe ich ins Bett.', fa: 'شب به تخت می‌روم.' },
  ]),
  lesson(0, 18, 'de-v2-shopping-prices', 'خرید و قیمت', 'قیمت را بپرسید و خرید ساده انجام دهید.', 'در فروشگاه قیمت چند سیب را می‌پرسید، مقدار کمی انتخاب می‌کنید و روش پرداخت را می‌پرسید.', 'برای پرسیدن قیمت از Was kostet …? استفاده کنید. واژهٔ Euro پس از عدد می‌آید و در این نمونه جمع آن هم Euro است.', [
    sentence('de-v2-shopping-s1', 'Was kostet ein Kilo Äpfel?', 'یک کیلو سیب چقدر است؟', 'واس کوستِت آین کیلو اِپفِل؟', 'kosten', 'قیمت‌داشتن؛ هزینه‌داشتن', 'Was kostet + اسم؟', [{ word: 'ein Kilo', meaning: 'یک کیلو' }, { word: 'der Apfel', meaning: 'سیب' }, { word: 'was', meaning: 'چه؛ چقدر' }]),
    sentence('de-v2-shopping-s2', 'Ein Kilo kostet drei Euro.', 'یک کیلو سه یورو است.', 'آین کیلو کوستِت درای اویرو', 'der Euro', 'یورو', undefined, [{ word: 'drei', meaning: 'سه' }, { word: 'kosten', meaning: 'قیمت‌داشتن' }, { word: 'das Kilo', meaning: 'کیلو' }]),
    sentence('de-v2-shopping-s3', 'Das ist günstig.', 'این ارزان و مناسب است.', 'داس ایست گونستیگ', 'günstig', 'ارزان؛ مناسب از نظر قیمت', undefined, [{ word: 'das', meaning: 'این؛ آن' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-shopping-s4', 'Ich nehme ein Kilo, bitte.', 'لطفاً یک کیلو برمی‌دارم.', 'ایش نِمِه آین کیلو، بیتِه', 'nehmen', 'گرفتن؛ انتخاب‌کردن', undefined, [{ word: 'ein Kilo', meaning: 'یک کیلو' }, { word: 'das Kilo', meaning: 'کیلو' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-shopping-s5', 'Kann ich mit Karte bezahlen?', 'می‌توانم با کارت پرداخت کنم؟', 'کان ایش میت کارتِه بِتسالِن؟', 'bezahlen', 'پرداخت‌کردن', undefined, [{ word: 'können', meaning: 'توانستن' }, { word: 'mit', meaning: 'با' }, { word: 'die Karte', meaning: 'کارت' }]),
  ], [
    { speaker: 'شما', text: 'Guten Tag. Was kostet ein Kilo Äpfel?', fa: 'روز بخیر. یک کیلو سیب چقدر است؟' },
    { speaker: 'فروشنده', text: 'Ein Kilo kostet drei Euro.', fa: 'یک کیلو سه یورو است.' },
    { speaker: 'شما', text: 'Das ist günstig. Ich nehme ein Kilo, bitte.', fa: 'قیمت مناسبی است. لطفاً یک کیلو برمی‌دارم.' },
    { speaker: 'شما', text: 'Kann ich mit Karte bezahlen?', fa: 'می‌توانم با کارت پرداخت کنم؟' },
  ]),
  lesson(0, 19, 'de-v2-feelings-health', 'احساس و تندرستی پایه', 'حال جسمی ساده را بیان کنید.', 'به دوستتان می‌گویید چه احساسی دارید و در صورت نیاز یک استراحت کوتاه می‌خواهید.', 'برای حالت‌هایی مانند سردم است از عبارت Mir ist … استفاده می‌شود؛ همچنین درخواست سادهٔ کمک را تمرین می‌کنید. این‌ها جمله‌های ارتباطی‌اند و جای توصیهٔ پزشکی را نمی‌گیرند.', [
    sentence('de-v2-feelings-s1', 'Mir ist kalt.', 'سردم است.', 'میر ایست کالت', 'kalt', 'سرد', undefined, [{ word: 'mir', meaning: 'به من؛ حالم' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-feelings-s2', 'Mir ist warm.', 'گرمم است.', 'میر ایست وارم', 'warm', 'گرم', undefined, [{ word: 'mir', meaning: 'به من؛ حالم' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-feelings-s3', 'Ich bin krank.', 'من بیمارم.', 'ایش بین کرانک', 'krank', 'بیمار', undefined, [{ word: 'ich', meaning: 'من' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-feelings-s4', 'Mein Kopf tut weh.', 'سرم درد می‌کند.', 'ماین کوپف توت وِه', 'der Kopf', 'سر', undefined, [{ word: 'wehtun', meaning: 'دردکردن' }, { word: 'mein', meaning: 'مال من' }]),
    sentence('de-v2-feelings-s5', 'Kannst du mir bitte helfen?', 'می‌توانی لطفاً به من کمک کنی؟', 'کانست دو میر بیتِه هِلفِن؟', 'helfen', 'کمک‌کردن', 'Kannst du mir bitte + فعل؟', [{ word: 'können', meaning: 'توانستن' }, { word: 'du', meaning: 'تو' }, { word: 'mir', meaning: 'به من' }, { word: 'bitte', meaning: 'لطفاً' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie geht es dir?', fa: 'حالت چطور است؟' },
    { speaker: 'شما', text: 'Mir ist kalt und ich bin müde.', fa: 'سردم است و خسته‌ام.' },
    { speaker: 'طرف مقابل', text: 'Brauchst du eine Pause?', fa: 'به استراحت نیاز داری؟' },
    { speaker: 'شما', text: 'Ja, bitte. Kannst du mir helfen?', fa: 'بله، لطفاً. می‌توانی به من کمک کنی؟' },
  ]),
  lesson(0, 20, 'de-v2-integrated-dialogues', 'گفت‌وگو و مرور ترکیبی', 'آموخته‌ها را در گفت‌وگویی پایانی و بدون نمره مرور کنید.', 'در آشنایی تازه، نام و زبان را می‌گویید، خرید ساده می‌کنید و مؤدبانه خداحافظی می‌کنید.', 'این درس جمع‌بندی تمرینی است، نه آزمون یا مدرک. جمله‌های آشنا را در موقعیت تازه کنار هم بگذارید و اگر لازم بود از کتابخانه به درس‌های قبلی برگردید.', [
    sentence('de-v2-integrated-s1', 'Guten Morgen, ich heiße Sara.', 'صبح بخیر، اسم من سارا است.', 'گوتِن مورگِن، ایش هایسِه سارا', 'Guten Morgen', 'صبح بخیر', undefined, [{ word: 'heißen', meaning: 'نام‌داشتن' }, { word: 'Sara', meaning: 'سارا؛ نام نمونه' }]),
    sentence('de-v2-integrated-s2', 'Ich komme aus Japan.', 'من اهل ژاپن هستم.', 'ایش کومِه آوس یاپان', 'kommen aus', 'اهلِ جایی بودن', undefined, [{ word: 'Japan', meaning: 'ژاپن' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-integrated-s3', 'Ich wohne in Berlin und lerne Deutsch.', 'من در برلین زندگی می‌کنم و آلمانی یاد می‌گیرم.', 'ایش وونِه این بِرلین اونت لِرنِه دویچ', 'wohnen', 'زندگی‌کردن؛ سکونت‌داشتن', undefined, [{ word: 'in', meaning: 'در' }, { word: 'Berlin', meaning: 'برلین' }, { word: 'lernen', meaning: 'یادگرفتن' }]),
    sentence('de-v2-integrated-s4', 'Ich möchte Wasser und Brot, bitte.', 'لطفاً آب و نان می‌خواهم.', 'ایش موشتِه واسِر اونت بروت، بیتِه', 'möchten', 'خواستن؛ مایل‌بودن', undefined, [{ word: 'das Wasser', meaning: 'آب' }, { word: 'das Brot', meaning: 'نان' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-integrated-s5', 'Vielen Dank für deine Hilfe.', 'برای کمکت خیلی ممنون.', 'فیلِن دانک فور داینِه هیلفِه', 'Vielen Dank', 'خیلی ممنون', undefined, [{ word: 'für', meaning: 'برای' }, { word: 'deine', meaning: 'مال تو' }, { word: 'die Hilfe', meaning: 'کمک' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Guten Morgen! Wie heißt du?', fa: 'صبح بخیر! اسمت چیست؟' },
    { speaker: 'شما', text: 'Ich heiße Sara. Ich komme aus Japan.', fa: 'اسم من سارا است. اهل ژاپن هستم.' },
    { speaker: 'طرف مقابل', text: 'Wo wohnst du?', fa: 'کجا زندگی می‌کنی؟' },
    { speaker: 'شما', text: 'Ich wohne in Berlin und lerne Deutsch.', fa: 'در برلین زندگی می‌کنم و آلمانی یاد می‌گیرم.' },
    { speaker: 'طرف مقابل', text: 'Möchtest du Wasser und Brot?', fa: 'آب و نان می‌خواهی؟' },
    { speaker: 'شما', text: 'Ja, bitte. Vielen Dank!', fa: 'بله، لطفاً. خیلی ممنون!' },
  ]),

  // A1 · Survival
  lesson(1, 1, 'de-v2-family', 'خانواده و دوستان', 'درباره آدم‌های نزدیکتان حرف بزنید.', 'عکسی از خانواده را به دوستتان نشان می‌دهید و درباره خواهر و برادر می‌گویید.', 'مالکیت را با mein و meine بیان می‌کنیم؛ شکل واژه با اسم همراه تغییر می‌کند. فعل صرف‌شده همچنان جایگاه دوم را دارد.', [
    sentence('de-v2-family-s1', 'Das ist meine Schwester.', 'این خواهر من است.', 'داس ایست ماینِه شوِستِر', 'die Schwester', 'خواهر', 'Das ist meine + اسم مؤنث.'),
    sentence('de-v2-family-s2', 'Mein Bruder wohnt in der Nähe.', 'برادرم نزدیک همین‌جا زندگی می‌کند.', 'ماین برودِر وونت این دِر نِه‌ه', 'der Bruder', 'برادر'),
    sentence('de-v2-family-s3', 'Hast du Kinder?', 'فرزند داری؟', 'هاست دو کیندِر؟', 'das Kind', 'کودک؛ فرزند'),
    sentence('de-v2-family-s4', 'Meine Eltern sprechen Deutsch.', 'پدر و مادرم آلمانی صحبت می‌کنند.', 'ماینِه اِلترن شپِرِشِن دویچ', 'die Eltern', 'والدین'),
    sentence('de-v2-family-s5', 'Wir besuchen unsere Großmutter am Sonntag.', 'یکشنبه به دیدن مادربزرگمان می‌رویم.', 'ویر بِزوخِن اونزِرِه گروس‌موتِر اَم زونتاگ', 'besuchen', 'دیدار کردن؛ به دیدن رفتن'),
  ], [
    { speaker: 'طرف مقابل', text: 'Wer ist das?', fa: 'این چه کسی است؟' },
    { speaker: 'شما', text: 'Das ist meine Schwester. Mein Bruder wohnt auch in der Nähe.', fa: 'این خواهر من است. برادرم هم نزدیک همین‌جا زندگی می‌کند.' },
    { speaker: 'طرف مقابل', text: 'Besucht ihr eure Großmutter oft?', fa: 'زیاد به دیدن مادربزرگتان می‌روید؟' },
    { speaker: 'شما', text: 'Ja, wir besuchen sie am Sonntag.', fa: 'بله، یکشنبه به دیدنش می‌رویم.' },
  ]),
  lesson(1, 2, 'de-v2-daily-routine', 'برنامه روزانه', 'کارهای روز را به‌ترتیب بگویید.', 'برای هم‌کلاسی‌تان یک روز معمولی را از صبح تا شب تعریف می‌کنید.', 'aufstehen فعل جداشدنی است: بخش auf در پایان جمله می‌آید. اگر جمله با زمان آغاز شود، فعل صرف‌شده جایگاه دوم می‌ماند.', [
    sentence('de-v2-routine-s1', 'Ich stehe um sieben Uhr auf.', 'من ساعت هفت از خواب بلند می‌شوم.', 'ایش شتِه اوم زیبِن اور آوف', 'aufstehen', 'از خواب بلند شدن', 'Ich stehe … auf.'),
    sentence('de-v2-routine-s2', 'Danach frühstücke ich.', 'بعد از آن صبحانه می‌خورم.', 'داناک فرواشتوکِه ایش', 'danach', 'بعد از آن'),
    sentence('de-v2-routine-s3', 'Ich fahre mit dem Bus zur Arbeit.', 'با اتوبوس به محل کار می‌روم.', 'ایش فارِه میت دِم بوس تسور آربایت', 'zur Arbeit', 'به محل کار'),
    sentence('de-v2-routine-s4', 'Am Abend lerne ich Deutsch.', 'عصر آلمانی یاد می‌گیرم.', 'اَم آبِنت لِرنِه ایش', 'der Abend', 'عصر؛ اوایل شب', 'Am Abend + فعل + فاعل.'),
    sentence('de-v2-routine-s5', 'Wann gehst du schlafen?', 'چه زمانی می‌خوابی؟', 'وان گِیست دو شلافِن؟', 'schlafen gehen', 'به خواب رفتن'),
  ], [
    { speaker: 'طرف مقابل', text: 'Wann stehst du auf?', fa: 'چه زمانی از خواب بلند می‌شوی؟' },
    { speaker: 'شما', text: 'Ich stehe um sieben Uhr auf. Danach fahre ich zur Arbeit.', fa: 'ساعت هفت بلند می‌شوم. بعد از آن به محل کار می‌روم.' },
    { speaker: 'طرف مقابل', text: 'Und wann lernst du Deutsch?', fa: 'و چه زمانی آلمانی یاد می‌گیری؟' },
    { speaker: 'شما', text: 'Am Abend lerne ich Deutsch.', fa: 'عصر آلمانی یاد می‌گیرم.' },
  ]),
  lesson(1, 3, 'de-v2-cafe-food', 'کافه و غذا', 'سفارش خود را کامل بیان کنید.', 'در کافه نوشیدنی و خوراکی سفارش می‌دهید و صورت‌حساب را درخواست می‌کنید.', 'möchten برای درخواست مؤدبانه به‌کار می‌رود. در einen Kaffee، اسم مذکر مفعول پسوند -en می‌گیرد.', [
    sentence('de-v2-cafe-s1', 'Ich möchte einen Kaffee, bitte.', 'یک قهوه می‌خواهم، لطفاً.', 'ایش موشتِه آینِن کافه، بیتِه', 'der Kaffee', 'قهوه', 'Ich möchte + اسم.'),
    sentence('de-v2-cafe-s2', 'Haben Sie auch Tee?', 'چای هم دارید؟', 'هابِن زی آوخ تِه؟', 'der Tee', 'چای'),
    sentence('de-v2-cafe-s3', 'Ich nehme ein Stück Kuchen.', 'یک تکه کیک برمی‌دارم.', 'ایش نِمِه آین شتوک کوخِن', 'das Stück', 'تکه؛ قطعه'),
    sentence('de-v2-cafe-s4', 'Die Rechnung, bitte.', 'صورت‌حساب، لطفاً.', 'دی رِشنونگ، بیتِه', 'die Rechnung', 'صورت‌حساب'),
    sentence('de-v2-cafe-s5', 'Können wir mit Karte bezahlen?', 'می‌توانیم با کارت پرداخت کنیم؟', 'کونِن ویر میت کارتِه بِتسالِن؟', 'bezahlen', 'پرداخت کردن'),
  ], [
    { speaker: 'شما', text: 'Ich möchte einen Kaffee und ein Stück Kuchen, bitte.', fa: 'یک قهوه و یک تکه کیک می‌خواهم، لطفاً.' },
    { speaker: 'پیشخدمت', text: 'Möchten Sie auch Tee?', fa: 'چای هم میل دارید؟' },
    { speaker: 'شما', text: 'Nein, danke. Die Rechnung, bitte.', fa: 'نه، ممنون. صورت‌حساب، لطفاً.' },
  ]),
  lesson(1, 4, 'de-v2-shopping', 'خرید و انتخاب', 'برای خرید پرسش و پاسخ بسازید.', 'در فروشگاه لباس مناسب پیدا می‌کنید، اندازه را می‌پرسید و خرید را انجام می‌دهید.', 'برای پرسیدن موجودی از Haben Sie …? استفاده کنید. صفت zu teuer یعنی «بیش از حد گران».', [
    sentence('de-v2-shop-s1', 'Ich suche eine Jacke.', 'من دنبال یک کت می‌گردم.', 'ایش زوخِه آینِه یاکِه', 'die Jacke', 'کت؛ ژاکت'),
    sentence('de-v2-shop-s2', 'Haben Sie diese Größe?', 'این اندازه را دارید؟', 'هابِن زی دیزِه گرُوسِه؟', 'die Größe', 'اندازه'),
    sentence('de-v2-shop-s3', 'Die Jacke ist zu teuer.', 'این کت بیش از حد گران است.', 'دی یاکِه ایست تسو تویِر', 'teuer', 'گران'),
    sentence('de-v2-shop-s4', 'Kann ich sie anprobieren?', 'می‌توانم آن را پرو کنم؟', 'کان ایش زی آن‌پروبیرِن؟', 'anprobieren', 'پرو کردن'),
    sentence('de-v2-shop-s5', 'Ich bezahle bar.', 'نقدی پرداخت می‌کنم.', 'ایش بِتسالِه بار', 'bar bezahlen', 'نقدی پرداخت کردن'),
  ], [
    { speaker: 'شما', text: 'Ich suche eine Jacke. Haben Sie diese Größe?', fa: 'دنبال یک کت می‌گردم. این اندازه را دارید؟' },
    { speaker: 'فروشنده', text: 'Ja, hier ist sie.', fa: 'بله، اینجاست.' },
    { speaker: 'شما', text: 'Danke. Kann ich sie anprobieren?', fa: 'ممنون. می‌توانم آن را پرو کنم؟' },
  ]),
  lesson(1, 5, 'de-v2-city-transport', 'شهر و حمل‌ونقل', 'مسیر را بپرسید و دنبال کنید.', 'در شهر نشانی ایستگاه را می‌پرسید و با اتوبوس به مقصد می‌روید.', 'در درخواست رسمی با Sie می‌گوییم: Gehen Sie … . برای پرسیدن زمان حرکت بگویید: Wann fährt der Bus? یا Wann fährt der Zug ab؟', [
    sentence('de-v2-city-s1', 'Wo ist der Bahnhof?', 'ایستگاه قطار کجاست؟', 'وو ایست دِر بان‌هوف؟', 'der Bahnhof', 'ایستگاه قطار'),
    sentence('de-v2-city-s2', 'Gehen Sie geradeaus.', 'مستقیم بروید.', 'گِیِن زی گِرادِه‌آوس', 'geradeaus', 'مستقیم', 'Gehen Sie + جهت.'),
    sentence('de-v2-city-s3', 'Biegen Sie an der Ampel links ab.', 'سر چراغ راهنمایی به چپ بپیچید.', 'بیگِن زی اَن دِر اَمپِل لینکس اَب', 'die Ampel', 'چراغ راهنمایی'),
    sentence('de-v2-city-s4', 'Wann fährt der Bus?', 'اتوبوس چه زمانی حرکت می‌کند؟', 'وان فِرت دِر بوس؟', 'abfahren', 'حرکت کردن'),
    sentence('de-v2-city-s5', 'Ich brauche eine Fahrkarte nach Berlin.', 'یک بلیت به مقصد برلین لازم دارم.', 'ایش براوخِه آینِه فارکارتِه ناخ بِرلین', 'nach', 'به؛ برای مقصد شهر'),
  ], [
    { speaker: 'شما', text: 'Entschuldigung, wo ist der Bahnhof?', fa: 'ببخشید، ایستگاه قطار کجاست؟' },
    { speaker: 'رهگذر', text: 'Gehen Sie geradeaus und biegen Sie an der Ampel links ab.', fa: 'مستقیم بروید و سر چراغ راهنمایی به چپ بپیچید.' },
    { speaker: 'شما', text: 'Vielen Dank. Wann fährt der Bus?', fa: 'خیلی ممنون. اتوبوس چه زمانی حرکت می‌کند؟' },
  ]),

  // A1 · twenty additional sentence-led modules
  lesson(1, 6, 'de-v2-a1-home-neighborhood', 'خانه و محله', 'خانه را توصیف کنید و مکان‌های نزدیک را بگویید.', 'به دوستی دربارهٔ محل زندگی‌تان می‌گویید و اتاق‌ها و مکان‌های نزدیک را توصیف می‌کنید.', 'برای مکان از عبارت‌های آماده مثل in einer Wohnung و in der Nähe استفاده کنید. صفت‌های hell و ruhig به توصیف اتاق کمک می‌کنند.', [
    sentence('de-v2-a1-home-s1', 'Ich wohne in einer kleinen Wohnung.', 'من در یک آپارتمان کوچک زندگی می‌کنم.', 'ایش وونِه این آینِر کلاینِن وونونگ', 'die Wohnung', 'آپارتمان', undefined, [{ word: 'wohnen', meaning: 'زندگی‌کردن؛ سکونت‌داشتن' }, { word: 'klein', meaning: 'کوچک' }, { word: 'in einer Wohnung', meaning: 'در یک آپارتمان' }]),
    sentence('de-v2-a1-home-s2', 'Wir haben eine Küche und ein Bad.', 'ما یک آشپزخانه و یک حمام داریم.', 'ویر هابِن آینِه کوخِه اونت آین باد', 'die Küche', 'آشپزخانه', undefined, [{ word: 'haben', meaning: 'داشتن' }, { word: 'das Bad', meaning: 'حمام؛ سرویس بهداشتی' }, { word: 'und', meaning: 'و' }]),
    sentence('de-v2-a1-home-s3', 'Mein Zimmer ist hell und ruhig.', 'اتاق من روشن و آرام است.', 'ماین تسیمِر ایست هِل اونت روئیش', 'hell', 'روشن', undefined, [{ word: 'das Zimmer', meaning: 'اتاق' }, { word: 'ruhig', meaning: 'آرام' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-a1-home-s4', 'Der Park ist in der Nähe.', 'پارک نزدیک است.', 'دِر پارک ایست این دِر نِه‌ه', 'der Park', 'پارک', undefined, [{ word: 'in der Nähe', meaning: 'در نزدیکی' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-a1-home-s5', 'Der Supermarkt ist neben dem Haus.', 'سوپرمارکت کنار خانه است.', 'دِر زوپِرمارکت ایست نِبِن دِم هاوس', 'der Supermarkt', 'سوپرمارکت', undefined, [{ word: 'neben', meaning: 'کنار' }, { word: 'das Haus', meaning: 'خانه؛ ساختمان' }, { word: 'sein', meaning: 'بودن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie ist deine Wohnung?', fa: 'آپارتمانت چطور است؟' },
    { speaker: 'شما', text: 'Sie ist klein, aber mein Zimmer ist hell.', fa: 'کوچک است، اما اتاقم روشن است.' },
    { speaker: 'طرف مقابل', text: 'Gibt es einen Park in der Nähe?', fa: 'پارکی در نزدیکی هست؟' },
    { speaker: 'شما', text: 'Ja, der Park ist neben dem Supermarkt.', fa: 'بله، پارک کنار سوپرمارکت است.' },
  ]),
  lesson(1, 7, 'de-v2-a1-work-day', 'کار و شغل', 'دربارهٔ کار و برنامهٔ روز کاری بگویید.', 'برای هم‌کلاسی‌تان شغل و ساعت شروع و پایان کارتان را توضیح می‌دهید.', 'برای بیان شغل از arbeiten als و برای شروع یک زمان می‌گوییم: Die Arbeit beginnt um … Uhr. اینجا زمان‌بندی را با جمله‌های کوتاه تمرین کنید.', [
    sentence('de-v2-a1-work-s1', 'Ich arbeite in einem Büro.', 'من در یک دفتر کار می‌کنم.', 'ایش آربایتِه این آینِم بورو', 'arbeiten', 'کارکردن', undefined, [{ word: 'das Büro', meaning: 'دفتر کار' }, { word: 'ich', meaning: 'من' }]),
    sentence('de-v2-a1-work-s2', 'Meine Arbeit beginnt um neun Uhr.', 'کارم ساعت نه شروع می‌شود.', 'ماینِه آربایت بِگینت اوم نویْن اور', 'beginnen', 'شروع‌شدن', undefined, [{ word: 'die Arbeit', meaning: 'کار' }, { word: 'um neun Uhr', meaning: 'ساعت نه' }]),
    sentence('de-v2-a1-work-s3', 'Meine Kollegin heißt Maria.', 'نام همکارم ماریاست.', 'ماینِه کولِگین هایست ماریا', 'die Kollegin', 'همکار زن', undefined, [{ word: 'heißen', meaning: 'نام‌داشتن' }, { word: 'Maria', meaning: 'ماریا؛ نام نمونه' }]),
    sentence('de-v2-a1-work-s4', 'Am Nachmittag mache ich eine Pause.', 'بعدازظهر استراحت می‌کنم.', 'اَم ناخمیتاگ ماخِه ایش آینِه پاوزه', 'der Nachmittag', 'بعدازظهر', undefined, [{ word: 'eine Pause machen', meaning: 'استراحت‌کردن' }, { word: 'machen', meaning: 'انجام‌دادن' }]),
    sentence('de-v2-a1-work-s5', 'Um fünf Uhr gehe ich nach Hause.', 'ساعت پنج به خانه می‌روم.', 'اوم فونف اور گِه‌ه ایش ناخ هاوزِه', 'nach Hause gehen', 'به خانه رفتن', undefined, [{ word: 'fünf', meaning: 'پنج' }, { word: 'nach Hause', meaning: 'به خانه' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wo arbeitest du?', fa: 'کجا کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich arbeite in einem Büro. Meine Arbeit beginnt um neun Uhr.', fa: 'در یک دفتر کار می‌کنم. کارم ساعت نه شروع می‌شود.' },
    { speaker: 'طرف مقابل', text: 'Wann gehst du nach Hause?', fa: 'چه ساعتی به خانه می‌روی؟' },
    { speaker: 'شما', text: 'Um fünf Uhr.', fa: 'ساعت پنج.' },
  ]),
  lesson(1, 8, 'de-v2-a1-calendar-appointments', 'تقویم، تاریخ و قرار', 'روز، تاریخ و ساعت یک قرار را مشخص کنید.', 'با دوستی قرار می‌گذارید و روز و ساعت مناسب را با هم هماهنگ می‌کنید.', 'روزهای هفته معمولاً با am و ساعت دقیق با um می‌آیند: am Dienstag، um halb sechs. nächste Woche یعنی هفتهٔ آینده.', [
    sentence('de-v2-a1-calendar-s1', 'Heute ist Montag, der elfte Mai.', 'امروز دوشنبه، یازدهم ماه مه است.', 'هویته ایست مونتاگ، دِر اِلفتِه مای', 'der Montag', 'دوشنبه', undefined, [{ word: 'heute', meaning: 'امروز' }, { word: 'der elfte Mai', meaning: 'یازدهم ماه مه' }, { word: 'das Datum', meaning: 'تاریخ' }]),
    sentence('de-v2-a1-calendar-s2', 'Mein Arzttermin ist am Dienstag.', 'قرار پزشکم روز سه‌شنبه است.', 'ماین آرتست‌تِرمین ایست اَم دینستاگ', 'der Arzttermin', 'قرار پزشک', undefined, [{ word: 'am Dienstag', meaning: 'روز سه‌شنبه' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-a1-calendar-s3', 'Wir treffen uns um halb sechs.', 'ساعت پنج‌ونیم همدیگر را می‌بینیم.', 'ویر ترفِن اونس اوم هالب زِکس', 'sich treffen', 'همدیگر را دیدن؛ قرارگذاشتن', undefined, [{ word: 'um halb sechs', meaning: 'ساعت پنج‌ونیم' }, { word: 'wir', meaning: 'ما' }]),
    sentence('de-v2-a1-calendar-s4', 'Der Film beginnt um acht Uhr.', 'فیلم ساعت هشت شروع می‌شود.', 'دِر فیلم بِگینت اوم آخت اور', 'der Film', 'فیلم', undefined, [{ word: 'beginnen', meaning: 'شروع‌شدن' }, { word: 'um acht Uhr', meaning: 'ساعت هشت' }]),
    sentence('de-v2-a1-calendar-s5', 'Hast du nächste Woche Zeit?', 'هفتهٔ آینده وقت داری؟', 'هاست دو نِکستِه وُخِه تسایت؟', 'nächste Woche', 'هفتهٔ آینده', undefined, [{ word: 'Zeit haben', meaning: 'وقت‌داشتن' }, { word: 'haben', meaning: 'داشتن' }]),
  ], [
    { speaker: 'شما', text: 'Hast du nächste Woche Zeit?', fa: 'هفتهٔ آینده وقت داری؟' },
    { speaker: 'طرف مقابل', text: 'Ja. Wann treffen wir uns?', fa: 'بله. چه زمانی همدیگر را ببینیم؟' },
    { speaker: 'شما', text: 'Am Dienstag um halb sechs.', fa: 'سه‌شنبه ساعت پنج‌ونیم.' },
    { speaker: 'طرف مقابل', text: 'Gut. Bis Dienstag!', fa: 'خوب است. تا سه‌شنبه!' },
  ]),
  lesson(1, 9, 'de-v2-a1-free-time', 'وقت آزاد و سرگرمی‌ها', 'از سرگرمی‌ها و اوقات فراغت حرف بزنید.', 'در کلاس دربارهٔ کارهایی که دوست دارید آخر هفته انجام دهید صحبت می‌کنید.', 'gern بعد از فعل می‌آید و علاقه را نشان می‌دهد: Ich lese gern. برای سؤال دربارهٔ علاقه بگویید: Was machst du gern?', [
    sentence('de-v2-a1-free-s1', 'Ich spiele gern Fußball.', 'من با علاقه فوتبال بازی می‌کنم.', 'ایش شپیلِه گِرن فوسبال', 'Fußball spielen', 'فوتبال‌بازی‌کردن', undefined, [{ word: 'gern', meaning: 'با علاقه؛ دوست‌داشتنِ انجام کاری' }, { word: 'spielen', meaning: 'بازی‌کردن' }]),
    sentence('de-v2-a1-free-s2', 'Am Wochenende treffe ich meine Freunde.', 'آخر هفته دوستانم را می‌بینم.', 'اَم وُخِن‌اِندِه ترفِه ایش ماینِه فرویندِه', 'das Wochenende', 'آخر هفته', undefined, [{ word: 'treffen', meaning: 'دیدن؛ ملاقات‌کردن' }, { word: 'die Freunde', meaning: 'دوستان' }]),
    sentence('de-v2-a1-free-s3', 'Meine Schwester liest gern Krimis.', 'خواهرم با علاقه داستان‌های جنایی می‌خواند.', 'ماینِه شوِستِر لیست گِرن کریمیس', 'der Krimi', 'داستان یا فیلم جنایی', undefined, [{ word: 'lesen', meaning: 'خواندن' }, { word: 'gern', meaning: 'با علاقه' }]),
    sentence('de-v2-a1-free-s4', 'Wir hören zusammen Musik.', 'ما با هم موسیقی گوش می‌دهیم.', 'ویر هورن تسوزامن موزیک', 'Musik hören', 'موسیقی گوش‌دادن', undefined, [{ word: 'zusammen', meaning: 'با هم' }, { word: 'hören', meaning: 'گوش‌دادن' }]),
    sentence('de-v2-a1-free-s5', 'Was machst du in deiner Freizeit?', 'در اوقات فراغت چه‌کار می‌کنی؟', 'واس ماخست دو این داینِر فرایت‌تسایت؟', 'die Freizeit', 'اوقات فراغت', undefined, [{ word: 'was machen', meaning: 'چه‌کارکردن' }, { word: 'du', meaning: 'تو' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Was machst du gern am Wochenende?', fa: 'آخر هفته دوست داری چه‌کار کنی؟' },
    { speaker: 'شما', text: 'Ich spiele gern Fußball und höre Musik.', fa: 'با علاقه فوتبال بازی می‌کنم و موسیقی گوش می‌دهم.' },
    { speaker: 'طرف مقابل', text: 'Liest du auch gern?', fa: 'کتاب‌خواندن را هم دوست داری؟' },
    { speaker: 'شما', text: 'Ja, ich lese gern Krimis.', fa: 'بله، داستان‌های جنایی را دوست دارم.' },
  ]),
  lesson(1, 10, 'de-v2-a1-weather-seasons', 'هوا و فصل‌ها', 'هوا و لباس مناسب را توصیف کنید.', 'برای برنامهٔ آخر هفته دربارهٔ آب‌وهوا حرف می‌زنید و لباس مناسب را انتخاب می‌کنید.', 'برای آب‌وهوا از es استفاده کنید: Es regnet. فصل‌ها با im می‌آیند: im Sommer، im Winter. trage شکل صرف‌شدهٔ tragen است.', [
    sentence('de-v2-a1-weather-s1', 'Im Frühling scheint oft die Sonne.', 'در بهار اغلب آفتابی است.', 'ایم فرویلینگ شاینت اُفت دی زونِه', 'der Frühling', 'بهار', undefined, [{ word: 'scheinen', meaning: 'تابیدن؛ آفتابی‌بودن' }, { word: 'die Sonne', meaning: 'خورشید' }, { word: 'oft', meaning: 'اغلب' }]),
    sentence('de-v2-a1-weather-s2', 'Im Sommer ist es sehr warm.', 'در تابستان هوا خیلی گرم است.', 'ایم زومِر ایست اِس زِر وارم', 'der Sommer', 'تابستان', undefined, [{ word: 'warm', meaning: 'گرم' }, { word: 'sehr', meaning: 'خیلی' }]),
    sentence('de-v2-a1-weather-s3', 'Im Herbst regnet es oft.', 'در پاییز اغلب باران می‌بارد.', 'ایم هِربست رِگنِت اِس اُفت', 'der Herbst', 'پاییز', undefined, [{ word: 'regnen', meaning: 'باران‌باریدن' }, { word: 'es regnet', meaning: 'باران می‌بارد' }]),
    sentence('de-v2-a1-weather-s4', 'Im Winter trage ich einen Mantel.', 'در زمستان پالتو می‌پوشم.', 'ایم وینتِر تراگِه ایش آینِن مانتِل', 'der Winter', 'زمستان', undefined, [{ word: 'tragen', meaning: 'پوشیدن؛ به تن داشتن' }, { word: 'der Mantel', meaning: 'پالتو' }]),
    sentence('de-v2-a1-weather-s5', 'Heute ist es windig, aber nicht kalt.', 'امروز هوا بادی است، اما سرد نیست.', 'هویته ایست اِس ویندیش، آبِر نیشت کالت', 'windig', 'بادی', undefined, [{ word: 'heute', meaning: 'امروز' }, { word: 'aber', meaning: 'اما' }, { word: 'kalt', meaning: 'سرد' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie ist das Wetter im Winter?', fa: 'هوا در زمستان چطور است؟' },
    { speaker: 'شما', text: 'Es ist oft kalt und es schneit.', fa: 'اغلب سرد است و برف می‌بارد.' },
    { speaker: 'طرف مقابل', text: 'Was trägst du dann?', fa: 'آن موقع چه می‌پوشی؟' },
    { speaker: 'شما', text: 'Ich trage einen warmen Mantel.', fa: 'یک پالتوی گرم می‌پوشم.' },
  ]),
  lesson(1, 11, 'de-v2-a1-health-appointment', 'سلامت و وقت پزشک', 'مشکل ساده را بیان و وقت ملاقات درخواست کنید.', 'در تماس با مطب، حال جسمی ساده را می‌گویید و دربارهٔ وقت خالی می‌پرسید.', 'عبارت Mir geht es nicht gut برای گفتن «حالم خوب نیست» است. این درس تمرین زبان است، نه توصیه یا تشخیص پزشکی.', [
    sentence('de-v2-a1-health-s1', 'Mir geht es heute nicht gut.', 'امروز حالم خوب نیست.', 'میر گِیت اِس هویته نیشت گوت', 'Mir geht es nicht gut.', 'حالم خوب نیست', undefined, [{ word: 'heute', meaning: 'امروز' }, { word: 'gut', meaning: 'خوب' }, { word: 'nicht', meaning: 'نه؛ برای منفی‌کردن' }]),
    sentence('de-v2-a1-health-s2', 'Ich habe Kopfschmerzen.', 'سردرد دارم.', 'ایش هابِه کوپف‌شمِرتسِن', 'die Kopfschmerzen', 'سردرد', undefined, [{ word: 'haben', meaning: 'داشتن' }, { word: 'der Kopf', meaning: 'سر' }, { word: 'der Schmerz', meaning: 'درد' }]),
    sentence('de-v2-a1-health-s3', 'Mein Bauch tut weh.', 'شکمم درد می‌کند.', 'ماین باوخ توت وِه', 'der Bauch', 'شکم', undefined, [{ word: 'wehtun', meaning: 'دردکردن' }, { word: 'mein', meaning: 'مال من' }]),
    sentence('de-v2-a1-health-s4', 'Ich brauche einen Termin beim Arzt.', 'به یک وقت ملاقات با پزشک نیاز دارم.', 'ایش براوخِه آینِن تِرمین بایم آرتست', 'der Termin', 'قرار؛ وقت ملاقات', undefined, [{ word: 'brauchen', meaning: 'نیازداشتن' }, { word: 'beim Arzt', meaning: 'پیش پزشک؛ در مطب' }]),
    sentence('de-v2-a1-health-s5', 'Wo ist die nächste Apotheke?', 'نزدیک‌ترین داروخانه کجاست؟', 'وو ایست دی نِکستِه آپوتِکه؟', 'die Apotheke', 'داروخانه', undefined, [{ word: 'nächste', meaning: 'نزدیک‌ترین؛ بعدی' }, { word: 'wo', meaning: 'کجا' }]),
  ], [
    { speaker: 'شما', text: 'Guten Tag. Mir geht es heute nicht gut.', fa: 'روز بخیر. امروز حالم خوب نیست.' },
    { speaker: 'پذیرش مطب', text: 'Was fehlt Ihnen?', fa: 'چه مشکلی دارید؟' },
    { speaker: 'شما', text: 'Ich habe Kopfschmerzen. Haben Sie heute einen Termin frei?', fa: 'سردرد دارم. امروز وقت خالی دارید؟' },
    { speaker: 'پذیرش مطب', text: 'Ja, um elf Uhr.', fa: 'بله، ساعت یازده.' },
  ]),
  lesson(1, 12, 'de-v2-a1-travel-hotel', 'سفر و اقامت', 'اتاق هتل و امکانات پایه را بپرسید.', 'در سفر برای یک شب اتاق می‌خواهید و دربارهٔ صبحانه و موقعیت هتل سؤال می‌کنید.', 'برای مقصد شهر از nach استفاده کنید. Einzelzimmer یعنی اتاق یک‌نفره و im Preis یعنی در قیمت گنجانده‌شده.', [
    sentence('de-v2-a1-travel-s1', 'Wir reisen morgen nach Wien.', 'ما فردا به وین سفر می‌کنیم.', 'ویر رایزِن مورگِن ناخ وین', 'reisen', 'سفرکردن', undefined, [{ word: 'morgen', meaning: 'فردا' }, { word: 'nach Wien', meaning: 'به وین' }]),
    sentence('de-v2-a1-travel-s2', 'Ich brauche ein Einzelzimmer für zwei Nächte.', 'برای دو شب یک اتاق یک‌نفره لازم دارم.', 'ایش براوخِه آین آینتسِل‌تسیمِر فور تسوای نِختِه', 'das Einzelzimmer', 'اتاق یک‌نفره', undefined, [{ word: 'brauchen', meaning: 'نیازداشتن' }, { word: 'für zwei Nächte', meaning: 'برای دو شب' }, { word: 'die Nacht', meaning: 'شب' }]),
    sentence('de-v2-a1-travel-s3', 'Das Frühstück ist im Preis enthalten.', 'صبحانه در قیمت گنجانده شده است.', 'داس فروشتوک ایست ایم پرایس اِنتهالتِن', 'das Frühstück', 'صبحانه', undefined, [{ word: 'der Preis', meaning: 'قیمت' }, { word: 'im Preis enthalten', meaning: 'در قیمت گنجانده‌شده' }, { word: 'enthalten', meaning: 'شامل‌بودن؛ در چیزی گنجانده‌شدن' }]),
    sentence('de-v2-a1-travel-s4', 'Wann beginnt das Frühstück?', 'صبحانه چه ساعتی شروع می‌شود؟', 'وان بِگینت داس فروشتوک؟', 'beginnen', 'شروع‌شدن', undefined, [{ word: 'wann', meaning: 'چه زمانی' }, { word: 'das Frühstück', meaning: 'صبحانه' }]),
    sentence('de-v2-a1-travel-s5', 'Das Hotel ist neben dem Bahnhof.', 'هتل کنار ایستگاه قطار است.', 'داس هوتِل ایست نِبِن دِم بان‌هوف', 'das Hotel', 'هتل', undefined, [{ word: 'neben', meaning: 'کنار' }, { word: 'der Bahnhof', meaning: 'ایستگاه قطار' }]),
  ], [
    { speaker: 'شما', text: 'Guten Abend. Haben Sie ein Einzelzimmer?', fa: 'عصر بخیر. اتاق یک‌نفره دارید؟' },
    { speaker: 'پذیرش هتل', text: 'Ja, für zwei Nächte.', fa: 'بله، برای دو شب.' },
    { speaker: 'شما', text: 'Ist das Frühstück im Preis?', fa: 'صبحانه در قیمت حساب شده است؟' },
    { speaker: 'پذیرش هتل', text: 'Ja. Es beginnt um sieben Uhr.', fa: 'بله. ساعت هفت شروع می‌شود.' },
  ]),
  lesson(1, 13, 'de-v2-a1-language-class', 'کلاس زبان و یادگیری', 'دربارهٔ درس و کارهای آموزشی حرف بزنید.', 'با هم‌کلاسی دربارهٔ کلاس، تمرین و تکلیف خانه صحبت می‌کنید.', 'برای درخواست تکرار می‌توان گفت Kannst du … wiederholen? واژهٔ Unterricht به معنی زمان یا محتوای تدریس است.', [
    sentence('de-v2-a1-class-s1', 'Ich besuche einen Deutschkurs.', 'من در یک دورهٔ آلمانی شرکت می‌کنم.', 'ایش بِزوخِه آینِن دویچ‌کورس', 'der Deutschkurs', 'دورهٔ زبان آلمانی', undefined, [{ word: 'besuchen', meaning: 'شرکت‌کردن در؛ رفتن به' }, { word: 'der Kurs', meaning: 'دوره؛ کلاس' }]),
    sentence('de-v2-a1-class-s2', 'Der Unterricht beginnt um neun Uhr.', 'کلاس ساعت نه شروع می‌شود.', 'دِر اونتِریشت بِگینت اوم نویْن اور', 'der Unterricht', 'کلاس؛ آموزش', undefined, [{ word: 'beginnen', meaning: 'شروع‌شدن' }, { word: 'um neun Uhr', meaning: 'ساعت نه' }]),
    sentence('de-v2-a1-class-s3', 'Wir lernen heute neue Wörter.', 'ما امروز واژه‌های تازه یاد می‌گیریم.', 'ویر لِرنِن هویته نویِه وُرتِر', 'das Wort', 'واژه', undefined, [{ word: 'lernen', meaning: 'یادگرفتن' }, { word: 'neu', meaning: 'تازه؛ جدید' }, { word: 'heute', meaning: 'امروز' }]),
    sentence('de-v2-a1-class-s4', 'Kannst du die Frage bitte wiederholen?', 'می‌توانی لطفاً سؤال را تکرار کنی؟', 'کانست دو دی فراگِه بیتِه ویدِر‌هولِن؟', 'wiederholen', 'تکرارکردن', 'Kannst du … bitte + فعل؟', [{ word: 'die Frage', meaning: 'سؤال' }, { word: 'können', meaning: 'توانستن' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-a1-class-s5', 'Ich mache meine Hausaufgaben am Abend.', 'من عصر تکالیفم را انجام می‌دهم.', 'ایش ماخِه ماینِه هاوس‌آوفگابِن اَم آبِنت', 'die Hausaufgabe', 'تکلیف خانه', undefined, [{ word: 'machen', meaning: 'انجام‌دادن' }, { word: 'am Abend', meaning: 'عصر؛ شب' }, { word: 'meine', meaning: 'مال من' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie findest du den Deutschkurs?', fa: 'دورهٔ آلمانی را چطور می‌بینی؟' },
    { speaker: 'شما', text: 'Sehr gut. Wir lernen heute neue Wörter.', fa: 'خیلی خوب. امروز واژه‌های تازه یاد می‌گیریم.' },
    { speaker: 'طرف مقابل', text: 'Kannst du die Frage wiederholen?', fa: 'می‌توانی سؤال را تکرار کنی؟' },
    { speaker: 'شما', text: 'Ja, natürlich.', fa: 'بله، حتماً.' },
  ]),
  lesson(1, 14, 'de-v2-a1-contact-forms', 'تلفن، نشانی و فرم', 'اطلاعات تماس را در موقعیت ساده بیان کنید.', 'در یک فرم تمرینی، راه تماس و نشانی خیالی را می‌گویید و محل امضا را پیدا می‌کنید.', 'واژه‌های این درس با داده‌های ساختگی تمرین می‌شوند؛ اطلاعات شخصی واقعی را در نمونه‌ها وارد نکنید. فعل جداشدنی ausfüllen در پایان بخش auf می‌گیرد.', [
    sentence('de-v2-a1-form-s1', 'Meine E-Mail-Adresse ist sara@example.com.', 'ایمیل نمونهٔ من sara@example.com است.', 'ماینِه ایمِیل‌آدرِسِه ایست سارا اَت اِگزَمپِل دات کام', 'die E-Mail-Adresse', 'نشانی ایمیل', undefined, [{ word: 'meine', meaning: 'مال من' }, { word: 'sein', meaning: 'بودن' }, { word: 'sara@example.com', meaning: 'ایمیل ساختگی نمونه' }]),
    sentence('de-v2-a1-form-s2', 'Meine Telefonnummer endet auf fünf.', 'شماره تلفنم به پنج ختم می‌شود.', 'ماینِه تِلِفون‌نومِر اِندِت آوف فونف', 'die Telefonnummer', 'شمارهٔ تلفن', undefined, [{ word: 'enden auf', meaning: 'به … ختم‌شدن' }, { word: 'fünf', meaning: 'پنج' }]),
    sentence('de-v2-a1-form-s3', 'Meine Adresse ist Parkstraße acht.', 'نشانی من خیابان پارک، شمارهٔ هشت است.', 'ماینِه آدرِسِه ایست پارک‌شتراسِه آخت', 'die Adresse', 'نشانی', undefined, [{ word: 'die Parkstraße', meaning: 'خیابان پارک؛ نشانی نمونه' }, { word: 'acht', meaning: 'هشت؛ شمارهٔ نمونه' }]),
    sentence('de-v2-a1-form-s4', 'Bitte füllen Sie das Formular aus.', 'لطفاً فرم را پر کنید.', 'بیتِه فولِن زی داس فورمولار آوس', 'ausfüllen', 'پرکردن؛ تکمیل‌کردن فرم', 'füllen … aus', [{ word: 'das Formular', meaning: 'فرم' }, { word: 'Sie', meaning: 'شما؛ خطاب رسمی' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-a1-form-s5', 'Hier ist meine Unterschrift.', 'امضای من اینجاست.', 'هیر ایست ماینِه اونتِر‌شریفت', 'die Unterschrift', 'امضا', undefined, [{ word: 'hier', meaning: 'اینجا' }, { word: 'meine', meaning: 'مال من' }]),
  ], [
    { speaker: 'کارمند', text: 'Bitte füllen Sie das Formular aus.', fa: 'لطفاً فرم را پر کنید.' },
    { speaker: 'شما', text: 'Hier ist meine Adresse und meine Telefonnummer.', fa: 'نشانی و شماره تلفنم اینجاست.' },
    { speaker: 'کارمند', text: 'Danke. Bitte unterschreiben Sie hier.', fa: 'ممنون. لطفاً اینجا امضا کنید.' },
    { speaker: 'شما', text: 'Ja, gern.', fa: 'بله، با کمال میل.' },
  ]),
  lesson(1, 15, 'de-v2-a1-invitations', 'دعوت و برنامه‌ریزی', 'دعوت را بپذیرید یا زمان دیگری پیشنهاد دهید.', 'دوستی شما را به شام دعوت می‌کند و دربارهٔ زمان مناسب با هم توافق می‌کنید.', 'برای دعوت از Möchtest du …? استفاده کنید. برای رد مؤدبانه می‌گوییم Leider kann ich nicht و بعد زمان دیگری پیشنهاد می‌دهیم.', [
    sentence('de-v2-a1-invite-s1', 'Möchtest du am Samstag zu mir kommen?', 'دوست داری شنبه به خانهٔ من بیایی؟', 'موشتِست دو اَم زامستاگ تسو میر کومِن؟', 'einladen', 'دعوت‌کردن', undefined, [{ word: 'am Samstag', meaning: 'روز شنبه' }, { word: 'zu mir kommen', meaning: 'به خانهٔ من آمدن' }, { word: 'möchten', meaning: 'خواستن؛ مایل‌بودن' }]),
    sentence('de-v2-a1-invite-s2', 'Wir können zusammen kochen.', 'می‌توانیم با هم آشپزی کنیم.', 'ویر کونِن تسوزامن کوخِن', 'kochen', 'آشپزی‌کردن', undefined, [{ word: 'können', meaning: 'توانستن' }, { word: 'zusammen', meaning: 'با هم' }]),
    sentence('de-v2-a1-invite-s3', 'Leider habe ich am Samstag keine Zeit.', 'متأسفانه شنبه وقت ندارم.', 'لایدر هابِه ایش اَم زامستاگ کاینِه تسایت', 'leider', 'متأسفانه', undefined, [{ word: 'keine Zeit haben', meaning: 'وقت‌نداشتن' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-a1-invite-s4', 'Geht es am Sonntag?', 'یکشنبه مناسب است؟', 'گِیت اِس اَم زونتاگ؟', 'am Sonntag', 'روز یکشنبه', undefined, [{ word: 'gehen', meaning: 'مناسب‌بودن؛ پیش‌رفتن' }, { word: 'es geht', meaning: 'مناسب است' }]),
    sentence('de-v2-a1-invite-s5', 'Ja, gern. Bis Sonntag!', 'بله، با کمال میل. تا یکشنبه!', 'یا گِرن، بیس زونتاگ', 'gern', 'با کمال میل؛ با علاقه', undefined, [{ word: 'bis Sonntag', meaning: 'تا یکشنبه' }, { word: 'ja', meaning: 'بله' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Möchtest du am Samstag zu mir kommen?', fa: 'دوست داری شنبه به خانهٔ من بیایی؟' },
    { speaker: 'شما', text: 'Leider kann ich am Samstag nicht.', fa: 'متأسفانه شنبه نمی‌توانم.' },
    { speaker: 'طرف مقابل', text: 'Geht es am Sonntag?', fa: 'یکشنبه مناسب است؟' },
    { speaker: 'شما', text: 'Ja, gern. Bis Sonntag!', fa: 'بله، با کمال میل. تا یکشنبه!' },
  ]),
  lesson(1, 16, 'de-v2-a1-weekend-past', 'آخر هفته و گذشته', 'یک آخر هفتهٔ ساده را در گذشته تعریف کنید.', 'با دوستی دربارهٔ آخر هفتهٔ گذشته و کارهایی که انجام دادید حرف می‌زنید.', 'برای بسیاری از کارهای گذشته در گفت‌وگوی روزمره از Perfekt استفاده می‌کنیم: haben یا sein + Partizip II. فعل در پایان جمله می‌آید.', [
    sentence('de-v2-a1-past-s1', 'Am Samstag habe ich meine Freunde besucht.', 'شنبه به دیدن دوستانم رفتم.', 'اَم زامستاگ هابِه ایش ماینِه فرویندِه بِزوخت', 'besuchen', 'به دیدن رفتن؛ ملاقات‌کردن', 'haben + Partizip II', [{ word: 'am Samstag', meaning: 'روز شنبه' }, { word: 'der Freund', meaning: 'دوست' }, { word: 'besucht', meaning: 'رفته‌دیدن؛ Partizip II از besuchen' }]),
    sentence('de-v2-a1-past-s2', 'Wir sind im Park spazieren gegangen.', 'در پارک قدم زدیم.', 'ویر زینت ایم پارک شپاتسیرِن گِگانگِن', 'spazieren gehen', 'قدم‌زدن', 'sein + Partizip II', [{ word: 'der Park', meaning: 'پارک' }, { word: 'gehen', meaning: 'رفتن' }, { word: 'gegangen', meaning: 'رفته؛ Partizip II از gehen' }]),
    sentence('de-v2-a1-past-s3', 'Danach haben wir zusammen gegessen.', 'بعد از آن با هم غذا خوردیم.', 'داناک هابِن ویر تسوزامن گِگِسِن', 'essen', 'خوردن', undefined, [{ word: 'danach', meaning: 'بعد از آن' }, { word: 'zusammen', meaning: 'با هم' }, { word: 'gegessen', meaning: 'خورده؛ Partizip II از essen' }]),
    sentence('de-v2-a1-past-s4', 'Am Sonntag habe ich lange geschlafen.', 'یکشنبه مدت زیادی خوابیدم.', 'اَم زونتاگ هابِه ایش لانگِه گِشلافِن', 'schlafen', 'خوابیدن', undefined, [{ word: 'lange', meaning: 'مدت طولانی' }, { word: 'geschlafen', meaning: 'خوابیده؛ Partizip II از schlafen' }]),
    sentence('de-v2-a1-past-s5', 'Das Wochenende war sehr schön.', 'آخر هفته خیلی خوب بود.', 'داس وُخِن‌اِندِه وار زِر شون', 'das Wochenende', 'آخر هفته', undefined, [{ word: 'sein', meaning: 'بودن' }, { word: 'schön', meaning: 'خوب؛ زیبا' }, { word: 'sehr', meaning: 'خیلی' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Was hast du am Wochenende gemacht?', fa: 'آخر هفته چه‌کار کردی؟' },
    { speaker: 'شما', text: 'Am Samstag habe ich Freunde besucht.', fa: 'شنبه به دیدن دوستانم رفتم.' },
    { speaker: 'طرف مقابل', text: 'Und am Sonntag?', fa: 'و یکشنبه؟' },
    { speaker: 'شما', text: 'Da habe ich lange geschlafen.', fa: 'آن روز مدت زیادی خوابیدم.' },
  ]),
  lesson(1, 17, 'de-v2-a1-clothing-shopping', 'خرید، اندازه و قیمت', 'اندازه بپرسید و دربارهٔ تعویض کالا گفت‌وگو کنید.', 'در فروشگاه لباسی را اندازه می‌کنید و اگر مناسب نباشد دربارهٔ تعویض آن می‌پرسید.', 'برای اندازه از in Größe … استفاده کنید. zu klein یعنی بیش از حد کوچک؛ umtauschen یعنی کالایی را با کالای دیگری عوض‌کردن.', [
    sentence('de-v2-a1-clothes-s1', 'Die Schuhe sind mir zu klein.', 'کفش‌ها برای من بیش از حد کوچک‌اند.', 'دی شوهِه زینت میر تسو کلاین', 'der Schuh', 'کفش', undefined, [{ word: 'zu klein', meaning: 'بیش از حد کوچک' }, { word: 'mir', meaning: 'برای من؛ به من' }]),
    sentence('de-v2-a1-clothes-s2', 'Haben Sie die Schuhe auch in Größe vierzig?', 'این کفش را در اندازهٔ چهل هم دارید؟', 'هابِن زی دی شوهِه آوخ این گرُوسِه فیرتسیش؟', 'die Größe', 'اندازه', undefined, [{ word: 'haben', meaning: 'داشتن' }, { word: 'auch', meaning: 'هم؛ نیز' }, { word: 'in Größe vierzig', meaning: 'در اندازهٔ چهل' }]),
    sentence('de-v2-a1-clothes-s3', 'Ich möchte diese Hose anprobieren.', 'می‌خواهم این شلوار را پرو کنم.', 'ایش موشتِه دیزِه هوزِه آن‌پروبیرِن', 'die Hose', 'شلوار', undefined, [{ word: 'anprobieren', meaning: 'پروکردن' }, { word: 'diese', meaning: 'این؛ برای اسم مؤنث' }]),
    sentence('de-v2-a1-clothes-s4', 'Der Kassenbon ist in meiner Tasche.', 'رسید خرید در کیف من است.', 'دِر کاسِن‌بوُن ایست این ماینِر تاشِه', 'der Kassenbon', 'رسید خرید', undefined, [{ word: 'in meiner Tasche', meaning: 'در کیف من' }, { word: 'die Tasche', meaning: 'کیف' }]),
    sentence('de-v2-a1-clothes-s5', 'Kann ich die Jacke umtauschen?', 'می‌توانم این کت را تعویض کنم؟', 'کان ایش دی یاکِه اوم‌تاوشِن؟', 'umtauschen', 'تعویض‌کردن', undefined, [{ word: 'die Jacke', meaning: 'کت؛ ژاکت' }, { word: 'können', meaning: 'توانستن' }]),
  ], [
    { speaker: 'شما', text: 'Die Schuhe sind mir zu klein.', fa: 'کفش‌ها برای من خیلی کوچک‌اند.' },
    { speaker: 'فروشنده', text: 'Möchten Sie eine andere Größe?', fa: 'اندازهٔ دیگری می‌خواهید؟' },
    { speaker: 'شما', text: 'Ja, haben Sie Größe M?', fa: 'بله، اندازهٔ M دارید؟' },
    { speaker: 'فروشنده', text: 'Ja, hier bitte.', fa: 'بله، بفرمایید.' },
  ]),
  lesson(1, 18, 'de-v2-a1-food-preferences', 'غذا و ترجیحات', 'سفارش غذا را با ترجیح ساده بیان کنید.', 'در رستوران غذای دلخواهتان را سفارش می‌دهید و یک پرسش مؤدبانه می‌پرسید.', 'برای منفی‌کردن اسم از kein استفاده کنید: Ich esse kein Fleisch. برای سفارش می‌توانید از Ich nehme … یا Für mich … استفاده کنید.', [
    sentence('de-v2-a1-food-pref-s1', 'Ich esse kein Fleisch.', 'من گوشت نمی‌خورم.', 'ایش اِسِه کاین فلایش', 'das Fleisch', 'گوشت', undefined, [{ word: 'essen', meaning: 'خوردن' }, { word: 'kein', meaning: 'هیچ؛ برای منفی‌کردن اسم' }]),
    sentence('de-v2-a1-food-pref-s2', 'Für mich bitte die Gemüsesuppe.', 'برای من لطفاً سوپ سبزیجات.', 'فور میش بیتِه دی گِموزِه‌زوبِه', 'die Gemüsesuppe', 'سوپ سبزیجات', undefined, [{ word: 'für mich', meaning: 'برای من' }, { word: 'das Gemüse', meaning: 'سبزیجات' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-a1-food-pref-s3', 'Ohne Zwiebeln, bitte.', 'بدون پیاز، لطفاً.', 'اُونِه تسویبِلن، بیتِه', 'die Zwiebel', 'پیاز', undefined, [{ word: 'ohne', meaning: 'بدون' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-a1-food-pref-s4', 'Möchten Sie noch einen Nachtisch?', 'آیا دسر دیگری میل دارید؟', 'موشتِن زی نوخ آینِن ناخ‌تیش؟', 'der Nachtisch', 'دسر', undefined, [{ word: 'möchten', meaning: 'خواستن؛ مایل‌بودن' }, { word: 'noch', meaning: 'هنوز؛ بیشتر' }, { word: 'Sie', meaning: 'شما؛ خطاب رسمی' }]),
    sentence('de-v2-a1-food-pref-s5', 'Die Rechnung, bitte.', 'صورت‌حساب، لطفاً.', 'دی رِشنونگ، بیتِه', 'die Rechnung', 'صورت‌حساب', undefined, [{ word: 'bitte', meaning: 'لطفاً' }]),
  ], [
    { speaker: 'پیشخدمت', text: 'Was möchten Sie essen?', fa: 'چه میل دارید بخورید؟' },
    { speaker: 'شما', text: 'Für mich bitte die Gemüsesuppe, ohne Zwiebeln.', fa: 'برای من لطفاً سوپ سبزیجات، بدون پیاز.' },
    { speaker: 'پیشخدمت', text: 'Möchten Sie noch einen Nachtisch?', fa: 'آیا دسر دیگری میل دارید؟' },
    { speaker: 'شما', text: 'Nein, danke. Die Rechnung, bitte.', fa: 'نه، ممنون. صورت‌حساب، لطفاً.' },
  ]),
  lesson(1, 19, 'de-v2-a1-post-office', 'خدمات روزمره', 'در ادارهٔ پست درخواست ساده مطرح کنید.', 'برای فرستادن بسته از کارمند پست دربارهٔ هزینه و زمان رسیدن می‌پرسید.', 'برای درخواست مؤدبانه می‌توانید از Ich möchte … استفاده کنید. فعل‌های جداشدنی مثل ankommen در جملهٔ خبری بخش دوم را به پایان می‌برند.', [
    sentence('de-v2-a1-post-s1', 'Ich möchte dieses Paket nach Japan schicken.', 'می‌خواهم این بسته را به ژاپن بفرستم.', 'ایش موشتِه دیزِس پاکِت ناخ یاپان شیکِن', 'das Paket', 'بستهٔ پستی', undefined, [{ word: 'schicken', meaning: 'فرستادن' }, { word: 'nach Japan', meaning: 'به ژاپن' }, { word: 'möchten', meaning: 'خواستن؛ مایل‌بودن' }]),
    sentence('de-v2-a1-post-s2', 'Was kostet der Versand?', 'هزینهٔ ارسال چقدر است؟', 'واس کوستِت دِر فِرزانْت؟', 'der Versand', 'ارسال؛ هزینهٔ ارسال', undefined, [{ word: 'kosten', meaning: 'قیمت‌داشتن؛ هزینه‌داشتن' }, { word: 'was', meaning: 'چه؛ چقدر' }]),
    sentence('de-v2-a1-post-s3', 'Wann kommt das Paket an?', 'بسته چه زمانی می‌رسد؟', 'وان کومت داس پاکِت اَن؟', 'ankommen', 'رسیدن', 'ankommen: an در پایان می‌آید.', [{ word: 'wann', meaning: 'چه زمانی' }, { word: 'das Paket', meaning: 'بستهٔ پستی' }]),
    sentence('de-v2-a1-post-s4', 'Können Sie mir bitte eine Briefmarke geben?', 'می‌توانید لطفاً یک تمبر به من بدهید؟', 'کونِن زی میر بیتِه آینِه بریف‌مارکِه گِیبِن؟', 'die Briefmarke', 'تمبر', undefined, [{ word: 'geben', meaning: 'دادن' }, { word: 'können', meaning: 'توانستن' }, { word: 'mir', meaning: 'به من' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-a1-post-s5', 'Ich bezahle bar.', 'نقدی پرداخت می‌کنم.', 'ایش بِتسالِه بار', 'bar bezahlen', 'نقدی پرداخت‌کردن', undefined, [{ word: 'bezahlen', meaning: 'پرداخت‌کردن' }, { word: 'bar', meaning: 'نقدی' }]),
  ], [
    { speaker: 'شما', text: 'Ich möchte dieses Paket nach Japan schicken.', fa: 'می‌خواهم این بسته را به ژاپن بفرستم.' },
    { speaker: 'کارمند پست', text: 'Was kostet der Versand?', fa: 'هزینهٔ ارسال چقدر است؟' },
    { speaker: 'شما', text: 'Können Sie mir bitte eine Briefmarke geben?', fa: 'می‌توانید لطفاً یک تمبر به من بدهید؟' },
    { speaker: 'کارمند پست', text: 'Ja, natürlich.', fa: 'بله، حتماً.' },
  ]),
  lesson(1, 20, 'de-v2-a1-describing-people-things', 'توصیف سادهٔ آدم‌ها و اشیا', 'ویژگی‌های ظاهری و رنگ وسایل را بگویید.', 'شخصی را به دوستتان معرفی می‌کنید و چند ویژگی سادهٔ ظاهر یا لباسش را می‌گویید.', 'برای توصیف از صفت‌های آشنا استفاده کنید: lange Haare، eine Brille، blau. صفت در جملهٔ ساده پس از فعل sein می‌آید.', [
    sentence('de-v2-a1-describe-s1', 'Meine Schwester hat lange braune Haare.', 'خواهرم موهای بلند و قهوه‌ای دارد.', 'ماینِه شوِستِر هات لانگِه براونِه هارِه', 'die Haare', 'مو', undefined, [{ word: 'lang', meaning: 'بلند' }, { word: 'braun', meaning: 'قهوه‌ای' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-a1-describe-s2', 'Mein Bruder trägt eine Brille.', 'برادرم عینک می‌زند.', 'ماین برودِر ترِکت آینِه بریلِه', 'die Brille', 'عینک', undefined, [{ word: 'tragen', meaning: 'به تن داشتن؛ پوشیدن' }, { word: 'mein', meaning: 'مال من' }]),
    sentence('de-v2-a1-describe-s3', 'Der blaue Pullover ist sehr schön.', 'پلیور آبی خیلی زیباست.', 'دِر بلاوِه پولُوِر ایست زِر شون', 'der Pullover', 'پلیور؛ ژاکت بافتنی', undefined, [{ word: 'blau', meaning: 'آبی' }, { word: 'schön', meaning: 'زیبا؛ خوب' }, { word: 'sehr', meaning: 'خیلی' }]),
    sentence('de-v2-a1-describe-s4', 'Die Tasche ist groß und schwer.', 'کیف بزرگ و سنگین است.', 'دی تاشِه ایست گروس اونت شوِر', 'schwer', 'سنگین', undefined, [{ word: 'die Tasche', meaning: 'کیف' }, { word: 'groß', meaning: 'بزرگ' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-a1-describe-s5', 'Welche Farbe gefällt dir?', 'چه رنگی را دوست داری؟', 'وِلشِه فاربِه گِفِلت دیر؟', 'die Farbe', 'رنگ', undefined, [{ word: 'gefallen', meaning: 'پسندآمدن؛ خوش‌آمدن' }, { word: 'dir', meaning: 'به تو' }, { word: 'welche', meaning: 'کدام' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wer ist deine Schwester?', fa: 'خواهرت کدام است؟' },
    { speaker: 'شما', text: 'Sie hat lange braune Haare.', fa: 'او موهای بلند و قهوه‌ای دارد.' },
    { speaker: 'طرف مقابل', text: 'Trägt sie eine Brille?', fa: 'عینک می‌زند؟' },
    { speaker: 'شما', text: 'Ja. Ihre Brille ist blau.', fa: 'بله. عینکش آبی است.' },
  ]),
  lesson(1, 21, 'de-v2-a1-household-tasks', 'کارهای خانه', 'دربارهٔ کارهای سادهٔ خانه حرف بزنید.', 'با هم‌خانه‌تان دربارهٔ مرتب‌کردن خانه و آماده‌کردن شام برنامه می‌ریزید.', 'چند فعل روزمره جداشدنی‌اند: aufräumen → Ich räume … auf. واژه‌های زمانی مثل danach کارها را به هم وصل می‌کنند.', [
    sentence('de-v2-a1-home-tasks-s1', 'Ich räume mein Zimmer auf.', 'اتاقم را مرتب می‌کنم.', 'ایش رویِم ماین تسیمِر آوف', 'aufräumen', 'مرتب‌کردن', 'räume … auf', [{ word: 'das Zimmer', meaning: 'اتاق' }, { word: 'mein', meaning: 'مال من' }]),
    sentence('de-v2-a1-home-tasks-s2', 'Meine Mutter kocht das Abendessen.', 'مادرم شام را می‌پزد.', 'ماینِه موتِر کوخت داس آبِنت‌اِسِن', 'das Abendessen', 'شام', undefined, [{ word: 'kochen', meaning: 'پختن؛ آشپزی‌کردن' }, { word: 'die Mutter', meaning: 'مادر' }]),
    sentence('de-v2-a1-home-tasks-s3', 'Mein Bruder wäscht die Wäsche.', 'برادرم لباس‌ها را می‌شوید.', 'ماین برودِر وِشت دی وِشِه', 'die Wäsche', 'لباس‌های شستنی؛ رخت', undefined, [{ word: 'waschen', meaning: 'شستن' }, { word: 'der Bruder', meaning: 'برادر' }]),
    sentence('de-v2-a1-home-tasks-s4', 'Wir decken zusammen den Tisch.', 'ما با هم میز را می‌چینیم.', 'ویر دِکِن تسوزامن دِن تیش', 'den Tisch decken', 'میز را چیدن', undefined, [{ word: 'zusammen', meaning: 'با هم' }, { word: 'der Tisch', meaning: 'میز' }]),
    sentence('de-v2-a1-home-tasks-s5', 'Danach sehen wir einen Film.', 'بعد از آن یک فیلم می‌بینیم.', 'داناک زِهِن ویر آینِن فیلم', 'danach', 'بعد از آن', undefined, [{ word: 'sehen', meaning: 'دیدن' }, { word: 'der Film', meaning: 'فیلم' }]),
  ], [
    { speaker: 'شما', text: 'Ich räume mein Zimmer auf.', fa: 'اتاقم را مرتب می‌کنم.' },
    { speaker: 'طرف مقابل', text: 'Danke. Ich koche das Abendessen.', fa: 'ممنون. من شام را می‌پزم.' },
    { speaker: 'شما', text: 'Dann decke ich den Tisch.', fa: 'پس من میز را می‌چینم.' },
    { speaker: 'طرف مقابل', text: 'Gut, danach sehen wir einen Film.', fa: 'خوب است، بعد از آن یک فیلم می‌بینیم.' },
  ]),
  lesson(1, 22, 'de-v2-a1-train-station', 'ایستگاه و بلیت قطار', 'سکو، تأخیر و تعویض قطار را بفهمید.', 'در ایستگاه مسیر قطار را می‌پرسید و مطمئن می‌شوید کجا باید پیاده یا عوض کنید.', 'در پرسش بله/خیر فعل صرف‌شده اول می‌آید: Muss ich …? افعال umsteigen و aussteigen جداشدنی‌اند.', [
    sentence('de-v2-a1-train-s1', 'Wo ist Gleis vier?', 'سکوی چهار کجاست؟', 'وو ایست گلایس فیِر؟', 'das Gleis', 'سکو؛ خط قطار', undefined, [{ word: 'vier', meaning: 'چهار' }, { word: 'wo', meaning: 'کجا' }]),
    sentence('de-v2-a1-train-s2', 'Der Zug nach Hamburg kommt um zehn Uhr.', 'قطار هامبورگ ساعت ده می‌رسد.', 'دِر تسوگ ناخ هامبورگ کومت اوم تسِین اور', 'der Zug', 'قطار', undefined, [{ word: 'nach Hamburg', meaning: 'به هامبورگ' }, { word: 'kommen', meaning: 'آمدن؛ رسیدن' }, { word: 'um zehn Uhr', meaning: 'ساعت ده' }]),
    sentence('de-v2-a1-train-s3', 'Der Zug hat zehn Minuten Verspätung.', 'قطار ده دقیقه تأخیر دارد.', 'دِر تسوگ هات تسِین مینوتِن فِر‌شپِتونگ', 'die Verspätung', 'تأخیر', undefined, [{ word: 'zehn Minuten', meaning: 'ده دقیقه' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-a1-train-s4', 'Muss ich in Köln umsteigen?', 'باید در کلن قطار عوض کنم؟', 'موس ایش این کُلن اوم‌شتیگِن؟', 'umsteigen', 'قطار یا وسیله عوض‌کردن', 'Muss ich …?', [{ word: 'müssen', meaning: 'باید؛ مجبوربودن' }, { word: 'in Köln', meaning: 'در کلن' }]),
    sentence('de-v2-a1-train-s5', 'Ich steige am Hauptbahnhof aus.', 'در ایستگاه مرکزی پیاده می‌شوم.', 'ایش شتایگِه اَم هاوپت‌بان‌هوف آوس', 'aussteigen', 'پیاده‌شدن', 'steige … aus', [{ word: 'der Hauptbahnhof', meaning: 'ایستگاه مرکزی قطار' }, { word: 'am Hauptbahnhof', meaning: 'در ایستگاه مرکزی' }]),
  ], [
    { speaker: 'شما', text: 'Entschuldigung, wo ist Gleis vier?', fa: 'ببخشید، سکوی چهار کجاست؟' },
    { speaker: 'کارمند ایستگاه', text: 'Dort rechts. Der Zug hat zehn Minuten Verspätung.', fa: 'آنجا سمت راست. قطار ده دقیقه تأخیر دارد.' },
    { speaker: 'شما', text: 'Muss ich in Köln umsteigen?', fa: 'باید در کلن قطار عوض کنم؟' },
    { speaker: 'کارمند ایستگاه', text: 'Nein, Sie steigen am Hauptbahnhof aus.', fa: 'نه، در ایستگاه مرکزی پیاده می‌شوید.' },
  ]),
  lesson(1, 23, 'de-v2-a1-phone-messages', 'تماس و پیام کوتاه', 'تماس تلفنی را هماهنگ و پیام ساده بفرستید.', 'به دوستتان زنگ می‌زنید، زمان را هماهنگ می‌کنید و می‌گویید بعداً پیام می‌فرستید.', 'برای درخواست تلفنی از Kannst du mich … anrufen? استفاده کنید. gerade یعنی «در همین لحظه» و später یعنی «بعدتر».', [
    sentence('de-v2-a1-message-s1', 'Kannst du mich heute Abend anrufen?', 'می‌توانی امشب به من زنگ بزنی؟', 'کانست دو میش هویته آبِنت آن‌روفِن؟', 'anrufen', 'تلفن‌کردن؛ زنگ‌زدن', 'rufst … an', [{ word: 'mich', meaning: 'مرا؛ به من' }, { word: 'heute Abend', meaning: 'امشب' }, { word: 'können', meaning: 'توانستن' }]),
    sentence('de-v2-a1-message-s2', 'Ich bin gerade im Bus.', 'من همین حالا در اتوبوس هستم.', 'ایش بین گِرادِه ایم بوس', 'gerade', 'همین حالا؛ در همین لحظه', undefined, [{ word: 'im Bus', meaning: 'در اتوبوس' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-a1-message-s3', 'Ich schreibe dir später eine Nachricht.', 'بعدتر برایت یک پیام می‌نویسم.', 'ایش شرایبِه دیر شپِتِر آینِه ناخ‌ریشت', 'die Nachricht', 'پیام؛ خبر', undefined, [{ word: 'schreiben', meaning: 'نوشتن' }, { word: 'später', meaning: 'بعدتر' }, { word: 'dir', meaning: 'به تو' }]),
    sentence('de-v2-a1-message-s4', 'Der Akku von meinem Handy ist fast leer.', 'شارژ گوشی‌ام تقریباً تمام شده است.', 'دِر آکو فون ماینِم هَندی ایست فاست لِر', 'der Akku', 'باتری؛ باتری قابل شارژ', undefined, [{ word: 'das Handy', meaning: 'گوشی همراه' }, { word: 'fast', meaning: 'تقریباً' }, { word: 'leer', meaning: 'خالی' }]),
    sentence('de-v2-a1-message-s5', 'Wir treffen uns um halb sieben vor dem Kino.', 'ساعت شش‌ونیم جلوی سینما همدیگر را می‌بینیم.', 'ویر ترفِن اونس اوم هالب زیبِن فور دِم کینو', 'vor dem Kino', 'جلوی سینما', undefined, [{ word: 'sich treffen', meaning: 'همدیگر را دیدن؛ قرارگذاشتن' }, { word: 'das Kino', meaning: 'سینما' }, { word: 'um halb sieben', meaning: 'ساعت شش‌ونیم' }]),
  ], [
    { speaker: 'شما', text: 'Kannst du mich heute Abend anrufen?', fa: 'می‌توانی امشب به من زنگ بزنی؟' },
    { speaker: 'طرف مقابل', text: 'Ich bin gerade im Bus.', fa: 'همین حالا در اتوبوس هستم.' },
    { speaker: 'طرف مقابل', text: 'Ich schreibe dir später eine Nachricht.', fa: 'بعدتر برایت پیام می‌نویسم.' },
    { speaker: 'شما', text: 'Gut. Wir treffen uns um halb sieben vor dem Kino.', fa: 'خوب است. ساعت شش‌ونیم جلوی سینما همدیگر را می‌بینیم.' },
  ]),
  lesson(1, 24, 'de-v2-a1-lost-and-found', 'درخواست کمک در موقعیت روزمره', 'گم‌شدن وسیله را توضیح دهید و کمک بگیرید.', 'کلیدتان را گم کرده‌اید و از کارمند یک مکان عمومی دربارهٔ بخش اشیای پیداشده می‌پرسید.', 'برای رویداد تمام‌شده می‌گوییم Ich habe … verloren. درخواست مؤدبانه را با Können Sie mir bitte …? بسازید.', [
    sentence('de-v2-a1-help-s1', 'Entschuldigung, ich habe meinen Schlüssel verloren.', 'ببخشید، کلیدم را گم کرده‌ام.', 'اِنت‌شولدِگونگ، ایش هابِه ماینِن شلوسِل فِرلورِن', 'der Schlüssel', 'کلید', undefined, [{ word: 'verlieren', meaning: 'گم‌کردن؛ ازدست‌دادن' }, { word: 'verloren', meaning: 'گم‌کرده؛ Partizip II از verlieren' }, { word: 'die Entschuldigung', meaning: 'عذرخواهی؛ ببخشید' }]),
    sentence('de-v2-a1-help-s2', 'Haben Sie den Schlüssel vielleicht gesehen?', 'شاید کلید را دیده‌اید؟', 'هابِن زی دِن شلوسِل فیلَیشت گِزِهِن؟', 'vielleicht', 'شاید', undefined, [{ word: 'sehen', meaning: 'دیدن' }, { word: 'gesehen', meaning: 'دیده؛ Partizip II از sehen' }, { word: 'Sie', meaning: 'شما؛ خطاب رسمی' }]),
    sentence('de-v2-a1-help-s3', 'Können Sie mir bitte helfen?', 'می‌توانید لطفاً به من کمک کنید؟', 'کونِن زی میر بیتِه هِلفِن؟', 'helfen', 'کمک‌کردن', 'Können Sie mir bitte + فعل؟', [{ word: 'können', meaning: 'توانستن' }, { word: 'mir', meaning: 'به من' }, { word: 'bitte', meaning: 'لطفاً' }]),
    sentence('de-v2-a1-help-s4', 'Wo ist das Fundbüro?', 'بخش اشیای پیداشده کجاست؟', 'وو ایست داس فوند‌بورو؟', 'das Fundbüro', 'بخش اشیای پیداشده', undefined, [{ word: 'wo', meaning: 'کجا' }, { word: 'sein', meaning: 'بودن' }]),
    sentence('de-v2-a1-help-s5', 'Vielen Dank, das ist sehr nett.', 'خیلی ممنون، لطف بزرگی است.', 'فیلِن دانک، داس ایست زِر نِت', 'nett', 'مهربان؛ لطف‌آمیز', undefined, [{ word: 'Vielen Dank', meaning: 'خیلی ممنون' }, { word: 'sehr', meaning: 'خیلی' }]),
  ], [
    { speaker: 'شما', text: 'Entschuldigung, ich habe meinen Schlüssel verloren.', fa: 'ببخشید، کلیدم را گم کرده‌ام.' },
    { speaker: 'کارمند', text: 'Haben Sie ihn vielleicht hier gesehen?', fa: 'شاید آن را اینجا دیده‌اید؟' },
    { speaker: 'شما', text: 'Nein. Können Sie mir bitte helfen?', fa: 'نه. می‌توانید لطفاً به من کمک کنید؟' },
    { speaker: 'کارمند', text: 'Ja. Das Fundbüro ist dort links.', fa: 'بله. بخش اشیای پیداشده آنجاست، سمت چپ.' },
  ]),
  lesson(1, 25, 'de-v2-a1-integrated-conversation', 'گفت‌وگوی ترکیبی A1', 'موضوع‌های آشنا را در یک گفت‌وگو کنار هم بیاورید.', 'خودتان را معرفی می‌کنید، دربارهٔ کار و برنامهٔ آخر هفته می‌گویید و یک قرار ساده می‌گذارید.', 'این درس جمع‌بندی تمرینی و بدون نمره است، نه آزمون یا مدرک. جمله‌های آشنا را در یک موقعیت تازه به هم پیوند دهید و در صورت نیاز به درس‌های قبلی برگردید.', [
    sentence('de-v2-a1-capstone-s1', 'Guten Morgen, ich heiße Lena und wohne in Berlin.', 'صبح بخیر، اسم من لناست و در برلین زندگی می‌کنم.', 'گوتِن مورگِن، ایش هایسِه لِنا اونت وونِه این بِرلین', 'wohnen', 'زندگی‌کردن؛ سکونت‌داشتن', undefined, [{ word: 'Guten Morgen', meaning: 'صبح بخیر' }, { word: 'heißen', meaning: 'نام‌داشتن' }, { word: 'Berlin', meaning: 'برلین؛ نام نمونه' }]),
    sentence('de-v2-a1-capstone-s2', 'Ich arbeite in einem Büro und lerne am Abend Deutsch.', 'در یک دفتر کار می‌کنم و عصر آلمانی یاد می‌گیرم.', 'ایش آربایتِه این آینِم بورو اونت لِرنِه اَم آبِنت دویچ', 'arbeiten', 'کارکردن', undefined, [{ word: 'das Büro', meaning: 'دفتر کار' }, { word: 'lernen', meaning: 'یادگرفتن' }, { word: 'am Abend', meaning: 'عصر؛ شب' }]),
    sentence('de-v2-a1-capstone-s3', 'Am Samstag fahre ich mit dem Zug nach Hamburg.', 'شنبه با قطار به هامبورگ می‌روم.', 'اَم زامستاگ فارِه ایش میت دِم تسوگ ناخ هامبورگ', 'der Zug', 'قطار', undefined, [{ word: 'am Samstag', meaning: 'روز شنبه' }, { word: 'fahren', meaning: 'رفتن با وسیلهٔ نقلیه' }, { word: 'nach Hamburg', meaning: 'به هامبورگ' }]),
    sentence('de-v2-a1-capstone-s4', 'Dort besuche ich meine Schwester und wir gehen ins Café.', 'آنجا به دیدن خواهرم می‌روم و به کافه می‌رویم.', 'دُرت بِزوخِه ایش ماینِه شوِستِر اونت ویر گِهِن اینس کافه', 'besuchen', 'به دیدن رفتن؛ ملاقات‌کردن', undefined, [{ word: 'dort', meaning: 'آنجا' }, { word: 'die Schwester', meaning: 'خواهر' }, { word: 'ins Café gehen', meaning: 'به کافه رفتن' }]),
    sentence('de-v2-a1-capstone-s5', 'Vielen Dank, das war ein schöner Tag.', 'خیلی ممنون، روز زیبایی بود.', 'فیلِن دانک، داس وار آین شونِر تاگ', 'der Tag', 'روز', undefined, [{ word: 'Vielen Dank', meaning: 'خیلی ممنون' }, { word: 'schön', meaning: 'زیبا؛ خوب' }, { word: 'war', meaning: 'بود؛ گذشتهٔ sein' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Guten Morgen! Was machst du beruflich?', fa: 'صبح بخیر! شغلت چیست؟' },
    { speaker: 'شما', text: 'Ich arbeite in einem Büro und lerne am Abend Deutsch.', fa: 'در یک دفتر کار می‌کنم و عصر آلمانی یاد می‌گیرم.' },
    { speaker: 'طرف مقابل', text: 'Was machst du am Samstag?', fa: 'شنبه چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich fahre nach Hamburg und besuche meine Schwester.', fa: 'به هامبورگ می‌روم و به دیدن خواهرم می‌روم.' },
    { speaker: 'طرف مقابل', text: 'Viel Spaß! Bis bald.', fa: 'خوش بگذرد! به‌زودی می‌بینمت.' },
  ]),

  // A2 · Everyday
  lesson(2, 1, 'de-v2-weekend-past', 'آخر هفته و گذشته', 'تجربه دیروز را روایت کنید.', 'با دوستی درباره آخر هفته گذشته صحبت می‌کنید و چند کار را به‌ترتیب تعریف می‌کنید.', 'برای بسیاری از فعل‌ها، گذشته محاوره‌ای با haben یا sein و Partizip II ساخته می‌شود. حرکت به مقصد معمولاً با sein می‌آید: Wir sind gegangen.', [
    sentence('de-v2-weekend-s1', 'Am Samstag habe ich meine Freunde besucht.', 'شنبه به دیدن دوستانم رفتم.', 'اَم زامستاگ هابِه ایش ماینِه فرویندِه بِزوخت', 'besuchen', 'دیدار کردن', 'haben + Partizip II.'),
    sentence('de-v2-weekend-s2', 'Wir sind im Park spazieren gegangen.', 'در پارک قدم زدیم.', 'ویر زینت ایم پارک شپاتسیرِن گِگانگِن', 'spazieren gehen', 'قدم زدن'),
    sentence('de-v2-weekend-s3', 'Danach haben wir zusammen gegessen.', 'بعد از آن با هم غذا خوردیم.', 'داناک هابِن ویر تسوزامن گِگِسِن', 'zusammen', 'با هم'),
    sentence('de-v2-weekend-s4', 'Das Wetter war schön, aber es war kalt.', 'هوا خوب بود، اما سرد بود.', 'داس وِتِر وار شون، آبِر اِس وار کالت', 'das Wetter', 'هوا'),
    sentence('de-v2-weekend-s5', 'Am Sonntag bin ich zu Hause geblieben.', 'یکشنبه در خانه ماندم.', 'اَم زونتاگ بین ایش تسو هاوزِه گِبلیبِن', 'bleiben', 'ماندن'),
  ], [
    { speaker: 'طرف مقابل', text: 'Was hast du am Wochenende gemacht?', fa: 'آخر هفته چه‌کار کردی؟' },
    { speaker: 'شما', text: 'Am Samstag habe ich meine Freunde besucht. Wir sind im Park spazieren gegangen.', fa: 'شنبه به دیدن دوستانم رفتم. در پارک قدم زدیم.' },
    { speaker: 'طرف مقابل', text: 'Und am Sonntag?', fa: 'و یکشنبه؟' },
    { speaker: 'شما', text: 'Da bin ich zu Hause geblieben.', fa: 'آن روز در خانه ماندم.' },
  ]),
  lesson(2, 2, 'de-v2-travel-stay', 'سفر و اقامت', 'در سفر درخواست روشن‌تری بسازید.', 'در هتل درباره رزرو، صبحانه و رفت‌وآمد به ایستگاه سؤال می‌کنید.', 'برای درخواست مؤدبانه می‌توان از Konjunktiv II استفاده کرد: Könnten Sie …? زمان گذشته در angekommen با sein ساخته شده است.', [
    sentence('de-v2-travel-s1', 'Ich habe ein Zimmer für zwei Nächte reserviert.', 'برای دو شب یک اتاق رزرو کرده‌ام.', 'ایش هابِه آین تسیمِر فور تسوای نِشتِه رِزِرویِرت', 'reservieren', 'رزرو کردن'),
    sentence('de-v2-travel-s2', 'Gibt es Frühstück?', 'صبحانه هم هست؟', 'گیبت اِس فروشتوک؟', 'das Frühstück', 'صبحانه'),
    sentence('de-v2-travel-s3', 'Wann fährt der Zug nach München?', 'قطار به مونیخ چه زمانی حرکت می‌کند؟', 'وان فِرت دِر تسوگ ناخ مونشِن؟', 'der Zug', 'قطار'),
    sentence('de-v2-travel-s4', 'Wir sind gestern spät angekommen.', 'ما دیروز دیر رسیدیم.', 'ویر زینت گِسترن شپِیت آن‌گِکومِن', 'ankommen', 'رسیدن'),
    sentence('de-v2-travel-s5', 'Könnten Sie mir ein Taxi bestellen?', 'ممکن است برایم تاکسی سفارش دهید؟', 'کونتِن زی میر آین تاکسی بِشتِلِن؟', 'bestellen', 'سفارش دادن', 'Könnten Sie mir …? درخواست مؤدبانه.'),
  ], [
    { speaker: 'شما', text: 'Guten Abend. Ich habe ein Zimmer für zwei Nächte reserviert.', fa: 'عصر بخیر. برای دو شب اتاق رزرو کرده‌ام.' },
    { speaker: 'کارمند هتل', text: 'Willkommen. Möchten Sie auch Frühstück?', fa: 'خوش آمدید. صبحانه هم میل دارید؟' },
    { speaker: 'شما', text: 'Ja, bitte. Könnten Sie mir morgen ein Taxi bestellen?', fa: 'بله، لطفاً. ممکن است فردا برایم تاکسی سفارش دهید؟' },
  ]),
  lesson(2, 3, 'de-v2-health-appointment', 'سلامتی و گرفتن وقت', 'علائم را توضیح دهید و وقت بگیرید.', 'برای یک مشکل ساده با مطب تماس می‌گیرید و درباره زمان مراجعه می‌پرسید.', 'Seit + زمان برای بیان شروع یک وضعیت به‌کار می‌رود. در جمله وابسته با wenn، فعل صرف‌شده به پایان می‌رود.', [
    sentence('de-v2-health-s1', 'Seit gestern habe ich Kopfschmerzen.', 'از دیروز سردرد دارم.', 'زایت گِسترن هابِه ایش کوپف‌شمِرتسِن', 'die Kopfschmerzen', 'سردرد'),
    sentence('de-v2-health-s2', 'Ich möchte einen Termin vereinbaren.', 'می‌خواهم یک وقت ملاقات بگیرم.', 'ایش موشتِه آینِن تِرمین فِرآینبارِن', 'der Termin', 'وقت ملاقات'),
    sentence('de-v2-health-s3', 'Der Arzt hat mir Ruhe empfohlen.', 'پزشک استراحت را به من توصیه کرده است.', 'دِر آرتست هات میر روئِه اِمپفولِن', 'empfehlen', 'توصیه کردن'),
    sentence('de-v2-health-s4', 'Ich nehme die Tabletten zweimal am Tag.', 'قرص‌ها را روزی دو بار مصرف می‌کنم.', 'ایش نِمِه دی تابِلِتِن تسوای‌مال اَم تاگ', 'zweimal', 'دو بار'),
    sentence('de-v2-health-s5', 'Wenn es schlimmer wird, rufe ich die Praxis an.', 'اگر بدتر شود، با مطب تماس می‌گیرم.', 'وِن اِس شلیمِر ویرت، روفِه ایش دی پراکسیس اَن', 'die Praxis', 'مطب؛ درمانگاه', 'Wenn …, فعل در جمله فرعی پایان می‌آید.'),
  ], [
    { speaker: 'مطب', text: 'Guten Tag. Wie kann ich Ihnen helfen?', fa: 'روز بخیر. چطور می‌توانم کمکتان کنم؟' },
    { speaker: 'شما', text: 'Seit gestern habe ich Kopfschmerzen. Ich möchte einen Termin vereinbaren.', fa: 'از دیروز سردرد دارم. می‌خواهم وقت بگیرم.' },
    { speaker: 'مطب', text: 'Morgen um zehn Uhr?', fa: 'فردا ساعت ده؟' },
    { speaker: 'شما', text: 'Ja, das passt. Vielen Dank.', fa: 'بله، مناسب است. خیلی ممنون.' },
  ]),
  lesson(2, 4, 'de-v2-home-services', 'خانه و خدمات', 'یک مشکل خانه را شرح دهید.', 'در خانه مشکلی پیش آمده و برای تعمیر آن با مدیر ساختمان یا صاحب‌خانه تماس می‌گیرید.', 'es gibt برای گفتن «وجود دارد» به‌کار می‌رود. در Perfekt با haben، بخش Partizip II معمولاً در پایان جمله می‌آید.', [
    sentence('de-v2-home-s1', 'In meiner Wohnung gibt es einen kleinen Balkon.', 'در آپارتمان من یک بالکن کوچک وجود دارد.', 'این ماینِر وونونگ گیبت اِس آینِن کلاینِن بالکون', 'die Wohnung', 'آپارتمان؛ واحد مسکونی'),
    sentence('de-v2-home-s2', 'Die Heizung funktioniert nicht.', 'سیستم گرمایش کار نمی‌کند.', 'دی هایتسونگ فونکسیونیرت نیشت', 'die Heizung', 'سیستم گرمایش'),
    sentence('de-v2-home-s3', 'Können Sie den Handwerker morgen schicken?', 'می‌توانید فردا تعمیرکار را بفرستید؟', 'کونِن زی دِن هانت‌وِرکِر مورگِن شیکِن؟', 'der Handwerker', 'تعمیرکار'),
    sentence('de-v2-home-s4', 'Ich habe dem Vermieter eine Nachricht geschrieben.', 'برای صاحب‌خانه پیام نوشته‌ام.', 'ایش هابِه دِم فِرمیتر آینِه ناخریشت گِشریبِن', 'der Vermieter', 'صاحب‌خانه'),
    sentence('de-v2-home-s5', 'Die Reparatur dauert wahrscheinlich zwei Tage.', 'تعمیر احتمالاً دو روز طول می‌کشد.', 'دی رِپاراتور داوِرت وارشاینلیش تسوای تاگِه', 'wahrscheinlich', 'احتمالاً'),
  ], [
    { speaker: 'شما', text: 'Guten Tag. Die Heizung funktioniert nicht.', fa: 'روز بخیر. سیستم گرمایش کار نمی‌کند.' },
    { speaker: 'صاحب‌خانه', text: 'Seit wann gibt es das Problem?', fa: 'از چه زمانی این مشکل وجود دارد؟' },
    { speaker: 'شما', text: 'Seit heute Morgen. Können Sie den Handwerker morgen schicken?', fa: 'از صبح امروز. می‌توانید فردا تعمیرکار را بفرستید؟' },
  ]),
  lesson(2, 5, 'de-v2-invitations-plans', 'دعوت و برنامه‌ریزی', 'برای قرار، زمان جایگزین پیشنهاد دهید.', 'دوستتان را به سینما دعوت می‌کنید و زمانی را پیدا می‌کنید که برای هر دوی شما مناسب باشد.', 'برای پیشنهاد از könnten wir …? استفاده کنید. فعل وجهی صرف‌شده جایگاه دوم می‌گیرد و مصدر به پایان جمله می‌رود.', [
    sentence('de-v2-plans-s1', 'Hast du am Freitag Zeit?', 'جمعه وقت داری؟', 'هاست دو اَم فرایتاک تسایت؟', 'Zeit haben', 'وقت داشتن'),
    sentence('de-v2-plans-s2', 'Wir könnten zusammen ins Kino gehen.', 'می‌توانیم با هم به سینما برویم.', 'ویر کونتِن تسوزامِن اینس کینو گِیِن', 'zusammen', 'با هم', 'Wir könnten … gehen.'),
    sentence('de-v2-plans-s3', 'Ich muss bis sechs Uhr arbeiten.', 'باید تا ساعت شش کار کنم.', 'ایش موس بیس زِکس اور آربایتِن', 'müssen', 'باید'),
    sentence('de-v2-plans-s4', 'Danach passt es mir gut.', 'بعد از آن برایم مناسب است.', 'داناک پاست اِس میر گوت', 'passen', 'مناسب بودن'),
    sentence('de-v2-plans-s5', 'Soll ich die Karten reservieren?', 'من بلیت‌ها را رزرو کنم؟', 'زول ایش دی کارتِن رِزِرویِرِن؟', 'reservieren', 'رزرو کردن'),
  ], [
    { speaker: 'شما', text: 'Hast du am Freitag Zeit? Wir könnten ins Kino gehen.', fa: 'جمعه وقت داری؟ می‌توانیم به سینما برویم.' },
    { speaker: 'طرف مقابل', text: 'Am Freitag muss ich bis sechs Uhr arbeiten.', fa: 'جمعه باید تا ساعت شش کار کنم.' },
    { speaker: 'شما', text: 'Danach passt es mir gut. Soll ich die Karten reservieren?', fa: 'بعد از آن برایم مناسب است. بلیت‌ها را رزرو کنم؟' },
  ]),

  // A2 · twenty additional everyday and problem-solving modules
  lesson(2, 6, 'de-v2-a2-commuting', 'رفت‌وآمد و مسیرهای شهری', 'مسیر روزانه را توضیح دهید و دربارهٔ تأخیر حرف بزنید.', 'در راه محل کار، دربارهٔ وسیلهٔ نقلیه، تعویض خط و دیررسیدن با همکار صحبت می‌کنید.', 'برای روایت اتفاق تمام‌شده از Perfekt استفاده کنید. در جملهٔ شرطی با wenn، فعل صرف‌شده به پایان می‌رود؛ ankommen و ausfallen فعل‌های جداشدنی‌اند.', [
    sentence('de-v2-a2-commute-s1', 'Ich fahre jeden Morgen mit der Straßenbahn zur Arbeit.', 'هر روز صبح با تراموا به محل کار می‌روم.', 'ایش فارِه یدِن مورگِن میت دِر شتراسن‌بان تسور آربایت', 'die Straßenbahn', 'تراموا', undefined, [{ word: 'jeden Morgen', meaning: 'هر روز صبح' }, { word: 'zur Arbeit fahren', meaning: 'با وسیله به محل کار رفتن' }, { word: 'fahren', meaning: 'رفتن با وسیلهٔ نقلیه' }]),
    sentence('de-v2-a2-commute-s2', 'Heute ist der Bus wegen einer Panne ausgefallen.', 'امروز اتوبوس به‌دلیل خرابی از سرویس خارج شد.', 'هویته ایست دِر بوس وِگِن آینِر پانِه آوس‌گِفالِن', 'ausfallen', 'لغو یا از کار افتادن', undefined, [{ word: 'die Panne', meaning: 'خرابی؛ نقص فنی' }, { word: 'wegen', meaning: 'به‌دلیلِ' }, { word: 'heute', meaning: 'امروز' }]),
    sentence('de-v2-a2-commute-s3', 'Am Hauptbahnhof muss ich in die U-Bahn umsteigen.', 'در ایستگاه مرکزی باید خط عوض کنم و سوار مترو شوم.', 'اَم هاوپت‌بان‌هوف موس ایش این دی اوبان اوم‌شتیگِن', 'umsteigen', 'وسیله یا خط را عوض‌کردن', undefined, [{ word: 'der Hauptbahnhof', meaning: 'ایستگاه مرکزی قطار' }, { word: 'die U-Bahn', meaning: 'مترو' }, { word: 'müssen', meaning: 'باید؛ مجبوربودن' }]),
    sentence('de-v2-a2-commute-s4', 'Die ganze Fahrt dauert ungefähr vierzig Minuten.', 'کل مسیر تقریباً چهل دقیقه طول می‌کشد.', 'دی گانتسِه فارت داوِرت اونگِفِر فیرتسیش مینوتِن', 'die Fahrt', 'مسیر؛ سفر با وسیله', undefined, [{ word: 'dauern', meaning: 'طول‌کشیدن' }, { word: 'ungefähr', meaning: 'تقریباً' }, { word: 'vierzig Minuten', meaning: 'چهل دقیقه' }]),
    sentence('de-v2-a2-commute-s5', 'Wenn ich früher losfahre, komme ich pünktlich an.', 'اگر زودتر راه بیفتم، به‌موقع می‌رسم.', 'وِن ایش فرویِر لوس‌فارِه، کومِه ایش پونکتلیش اَن', 'pünktlich ankommen', 'به‌موقع رسیدن', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'losfahren', meaning: 'راه‌افتادن با وسیله' }, { word: 'früher', meaning: 'زودتر' }, { word: 'pünktlich', meaning: 'به‌موقع' }]),
  ], [
    { speaker: 'همکار', text: 'Warum bist du heute so spät?', fa: 'چرا امروز این‌قدر دیر کردی؟' },
    { speaker: 'شما', text: 'Der Bus ist wegen einer Panne ausgefallen.', fa: 'اتوبوس به‌دلیل خرابی از سرویس خارج شد.' },
    { speaker: 'همکار', text: 'Musstest du am Hauptbahnhof umsteigen?', fa: 'مجبور شدی در ایستگاه مرکزی وسیله عوض کنی؟' },
    { speaker: 'شما', text: 'Ja. Wenn ich morgen früher losfahre, komme ich pünktlich an.', fa: 'بله. اگر فردا زودتر راه بیفتم، به‌موقع می‌رسم.' },
  ]),
  lesson(2, 7, 'de-v2-a2-work-colleagues', 'کار و همکاران', 'دربارهٔ وظایف و روز کاری توضیح دهید.', 'به همکار تازه‌وارد می‌گویید هر روز چه کارهایی انجام می‌دهید و چه زمانی جلسه دارید.', 'با bespreche ich دربارهٔ مطرح‌کردن موضوع‌ها صحبت کنید. weil دلیل می‌آورد و فعل را در جملهٔ وابسته به پایان می‌برد.', [
    sentence('de-v2-a2-work-s1', 'Ich bespreche die Aufgaben mit meinem Team.', 'دربارهٔ وظایف با تیمم صحبت می‌کنم.', 'ایش بِشپِرِشِه دی آوفگابِن میت ماینِم تیم', 'die Aufgabe', 'وظیفه؛ کار واگذارشده', undefined, [{ word: 'besprechen', meaning: 'دربارهٔ چیزی گفت‌وگوکردن' }, { word: 'das Team', meaning: 'تیم' }, { word: 'mit meinem Team', meaning: 'با تیمم' }]),
    sentence('de-v2-a2-work-s2', 'Meine Kollegin übernimmt heute den Telefondienst.', 'همکارم امروز مسئول پاسخ‌گویی تلفنی است.', 'ماینِه کولِگین اوبِر‌نیمت هویته دِن تِلِفون‌دینست', 'übernehmen', 'عهده‌دارشدن؛ برعهده‌گرفتن', undefined, [{ word: 'die Kollegin', meaning: 'همکار زن' }, { word: 'der Telefondienst', meaning: 'نوبت پاسخ‌گویی تلفنی' }, { word: 'heute', meaning: 'امروز' }]),
    sentence('de-v2-a2-work-s3', 'Ich arbeite lieber morgens, weil ich dann konzentrierter bin.', 'ترجیح می‌دهم صبح‌ها کار کنم، چون آن موقع تمرکزم بیشتر است.', 'ایش آربایتِه لیبِر مورگِنس، وایل ایش دان کُنتسِنتریرتِر بین', 'konzentriert', 'متمرکز', 'weil + فاعل + … + فعل.', [{ word: 'lieber', meaning: 'ترجیحاً؛ با میل بیشتر' }, { word: 'morgens', meaning: 'صبح‌ها' }, { word: 'weil', meaning: 'چون؛ زیرا' }]),
    sentence('de-v2-a2-work-s4', 'Am Mittwoch haben wir ein wichtiges Treffen.', 'چهارشنبه جلسهٔ مهمی داریم.', 'اَم میت‌وُخ هابِن ویر آین ویشتیشِس ترفِن', 'das Treffen', 'جلسه؛ دیدار', undefined, [{ word: 'am Mittwoch', meaning: 'روز چهارشنبه' }, { word: 'wichtig', meaning: 'مهم' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-a2-work-s5', 'Nach der Arbeit beantworte ich noch einige E-Mails.', 'بعد از کار هنوز به چند ایمیل پاسخ می‌دهم.', 'ناخ دِر آربایت بِآنت‌وُرتِه ایش نوخ آینیشِه ایمِیلز', 'beantworten', 'پاسخ‌دادن به', undefined, [{ word: 'nach der Arbeit', meaning: 'بعد از کار' }, { word: 'einige', meaning: 'چند؛ تعدادی' }, { word: 'die E-Mail', meaning: 'ایمیل' }]),
  ], [
    { speaker: 'همکار تازه‌وارد', text: 'Was machst du am Morgen?', fa: 'صبح‌ها چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich bespreche zuerst die Aufgaben mit meinem Team.', fa: 'اول دربارهٔ وظایف با تیمم صحبت می‌کنم.' },
    { speaker: 'همکار تازه‌وارد', text: 'Wann ist euer nächstes Treffen?', fa: 'جلسهٔ بعدی شما چه زمانی است؟' },
    { speaker: 'شما', text: 'Am Mittwoch. Meine Kollegin übernimmt heute den Telefondienst.', fa: 'چهارشنبه. همکارم امروز مسئول پاسخ‌گویی تلفنی است.' },
  ]),
  lesson(2, 8, 'de-v2-a2-learning-course', 'آموزش و هدف‌های یادگیری', 'دربارهٔ کلاس، تمرین و هدف بعدی حرف بزنید.', 'با هم‌کلاسی دربارهٔ یک دورهٔ تازه و راهی که برای آمادگی در آزمون انتخاب کرده‌اید صحبت می‌کنید.', 'برای گفتن مدت از seit استفاده کنید. anmelden فعل جداشدنی است و در جملهٔ وابسته با wenn، فعل صرف‌شده به پایان می‌رود.', [
    sentence('de-v2-a2-learning-s1', 'Ich mache seit drei Monaten einen Computerkurs.', 'سه ماه است در یک دورهٔ رایانه شرکت می‌کنم.', 'ایش ماخِه زایت درای موناتِن آینِن کومپیوتر‌کورس', 'der Computerkurs', 'دورهٔ رایانه', undefined, [{ word: 'seit drei Monaten', meaning: 'از سه ماه پیش؛ به‌مدت سه ماه تا اکنون' }, { word: 'machen', meaning: 'انجام‌دادن؛ شرکت‌کردن در دوره' }, { word: 'der Monat', meaning: 'ماه' }]),
    sentence('de-v2-a2-learning-s2', 'Der Kurs findet zweimal pro Woche statt.', 'این دوره هفته‌ای دو بار برگزار می‌شود.', 'دِر کورس فیندِت تسوای‌مال پرو وُخِه شتات', 'stattfinden', 'برگزارشدن', 'findet … statt', [{ word: 'zweimal', meaning: 'دو بار' }, { word: 'pro Woche', meaning: 'در هر هفته؛ هفته‌ای' }, { word: 'der Kurs', meaning: 'دوره؛ کلاس' }]),
    sentence('de-v2-a2-learning-s3', 'Wenn ich etwas nicht verstehe, frage ich die Lehrerin.', 'اگر چیزی را نفهمم، از معلم می‌پرسم.', 'وِن ایش اِتواس نیشت فِرشتِه‌ه، فراگِه ایش دی لِرِرین', 'verstehen', 'فهمیدن', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'etwas', meaning: 'چیزی' }, { word: 'fragen', meaning: 'پرسیدن' }, { word: 'die Lehrerin', meaning: 'معلم زن' }]),
    sentence('de-v2-a2-learning-s4', 'Für die Prüfung muss ich regelmäßig den Stoff wiederholen.', 'برای آزمون باید مطالب را مرتب مرور کنم.', 'فور دی پروفونگ موس ایش رِگل‌مِسیش ویدِر‌هولِن', 'wiederholen', 'مرور یا تکرارکردن', undefined, [{ word: 'die Prüfung', meaning: 'آزمون' }, { word: 'regelmäßig', meaning: 'به‌طور منظم' }, { word: 'der Stoff', meaning: 'مطالب درسی' }]),
    sentence('de-v2-a2-learning-s5', 'Nächstes Jahr möchte ich mich für einen Sprachkurs anmelden.', 'سال آینده می‌خواهم برای یک دورهٔ زبان ثبت‌نام کنم.', 'نِکستِس یار موشتِه ایش میش فور آینِن شپراخ‌کورس آن‌مِلدِن', 'sich anmelden', 'ثبت‌نام‌کردن', 'melde … an', [{ word: 'nächstes Jahr', meaning: 'سال آینده' }, { word: 'der Sprachkurs', meaning: 'دورهٔ زبان' }, { word: 'für', meaning: 'برای' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie lange machst du schon den Computerkurs?', fa: 'چه مدتی است در دورهٔ رایانه شرکت می‌کنی؟' },
    { speaker: 'شما', text: 'Seit drei Monaten. Der Kurs findet zweimal pro Woche statt.', fa: 'سه ماه است. دوره هفته‌ای دو بار برگزار می‌شود.' },
    { speaker: 'طرف مقابل', text: 'Was machst du, wenn du etwas nicht verstehst?', fa: 'اگر چیزی را نفهمی چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich frage die Lehrerin und wiederhole die Übungen.', fa: 'از معلم می‌پرسم و تمرین‌ها را مرور می‌کنم.' },
  ]),
  lesson(2, 9, 'de-v2-a2-shopping-returns', 'خرید، تعویض و خدمات مشتری', 'کالا را عوض کنید یا درخواست بازپرداخت بدهید.', 'در فروشگاه دربارهٔ اندازهٔ نامناسب توضیح می‌دهید و راه‌حل می‌خواهید.', 'برای تعویض می‌گوییم gegen eine andere Größe umtauschen. Falls یک شرط را معرفی می‌کند؛ در درخواست مؤدبانه می‌توان از könnten استفاده کرد.', [
    sentence('de-v2-a2-returns-s1', 'Die Schuhe passen mir leider nicht.', 'متأسفانه کفش‌ها اندازهٔ من نیستند.', 'دی شوهِه پاسِن میر لایدِر نیشت', 'passen', 'اندازه یا مناسب‌بودن', undefined, [{ word: 'der Schuh', meaning: 'کفش' }, { word: 'mir', meaning: 'برای من؛ به من' }, { word: 'leider', meaning: 'متأسفانه' }]),
    sentence('de-v2-a2-returns-s2', 'Ich habe den Kassenbon noch dabei.', 'رسید خرید هنوز همراهم است.', 'ایش هابِه دِن کاسِن‌بوُن نوخ دابای', 'der Kassenbon', 'رسید خرید', undefined, [{ word: 'noch dabei haben', meaning: 'هنوز همراه‌داشتن' }, { word: 'dabei', meaning: 'همراه؛ در اختیار' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-a2-returns-s3', 'Könnten Sie die Schuhe gegen eine größere Größe umtauschen?', 'ممکن است کفش‌ها را با اندازهٔ بزرگ‌تری عوض کنید؟', 'کونتِن زی دی شوهِه گِگِن آینِه گرُوسِرِه گرُوسِه اوم‌تاوشِن؟', 'umtauschen', 'تعویض‌کردن', 'Könnten Sie …? درخواست مؤدبانه.', [{ word: 'gegen', meaning: 'در برابر؛ با' }, { word: 'größer', meaning: 'بزرگ‌تر' }, { word: 'die Größe', meaning: 'اندازه' }]),
    sentence('de-v2-a2-returns-s4', 'Das blaue Modell ist leider ausverkauft.', 'متأسفانه مدل آبی تمام شده است.', 'داس بلاوِه مودِل ایست لایدِر آوس‌فِرکاوفت', 'ausverkauft', 'تمام‌شده؛ فروخته‌شده', undefined, [{ word: 'das Modell', meaning: 'مدل' }, { word: 'blau', meaning: 'آبی' }, { word: 'verkaufen', meaning: 'فروختن' }]),
    sentence('de-v2-a2-returns-s5', 'Falls Sie meine Größe nicht haben, möchte ich mein Geld zurück.', 'اگر اندازهٔ من را ندارید، می‌خواهم پولم را پس بگیرم.', 'فالس زی ماینِه گرُوسِه نیشت هابِن، موشتِه ایش ماین گِلت تسوروک', 'das Geld zurückbekommen', 'پول را پس‌گرفتن', 'Falls …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'falls', meaning: 'اگر؛ درصورتی‌که' }, { word: 'zurück', meaning: 'پس؛ بازگشت' }, { word: 'mein Geld', meaning: 'پول من' }]),
  ], [
    { speaker: 'شما', text: 'Die Schuhe passen mir leider nicht. Ich habe den Kassenbon dabei.', fa: 'متأسفانه کفش‌ها اندازه‌ام نیستند. رسید خرید را همراهم دارم.' },
    { speaker: 'فروشنده', text: 'Möchten Sie eine größere Größe?', fa: 'اندازهٔ بزرگ‌تری می‌خواهید؟' },
    { speaker: 'شما', text: 'Ja, bitte. Haben Sie das blaue Modell?', fa: 'بله، لطفاً. مدل آبی را دارید؟' },
    { speaker: 'فروشنده', text: 'Leider ist es ausverkauft.', fa: 'متأسفانه تمام شده است.' },
  ]),
  lesson(2, 10, 'de-v2-a2-cooking', 'رستوران و آشپزی', 'دستور ساده را به‌ترتیب توضیح دهید.', 'برای شام با دوستتان غذا آماده می‌کنید و دربارهٔ کارهای آشپزخانه هماهنگ می‌شوید.', 'واژه‌های zuerst و danach ترتیب کار را روشن می‌کنند. wenn یک شرط می‌آورد و während دو کار هم‌زمان را نشان می‌دهد.', [
    sentence('de-v2-a2-cooking-s1', 'Für das Abendessen brauchen wir noch frisches Gemüse.', 'برای شام هنوز به سبزیجات تازه نیاز داریم.', 'فور داس آبِنت‌اِسِن براوخِن ویر نوخ فریشِس گِموزِه', 'das Gemüse', 'سبزیجات', undefined, [{ word: 'das Abendessen', meaning: 'شام' }, { word: 'frisch', meaning: 'تازه' }, { word: 'brauchen', meaning: 'نیازداشتن' }]),
    sentence('de-v2-a2-cooking-s2', 'Zuerst schneide ich die Zwiebeln klein.', 'اول پیازها را ریز خرد می‌کنم.', 'تسوئِرست شنایدِه ایش دی تسویبِلن کلاین', 'zuerst', 'اول؛ در ابتدا', undefined, [{ word: 'schneiden', meaning: 'بریدن؛ خردکردن' }, { word: 'die Zwiebel', meaning: 'پیاز' }, { word: 'klein schneiden', meaning: 'ریز خردکردن' }]),
    sentence('de-v2-a2-cooking-s3', 'Danach brate ich sie mit etwas Öl an.', 'بعد از آن، آن‌ها را با کمی روغن تفت می‌دهم.', 'داناک براتِه ایش زی میت اِتواس اُیل اَن', 'anbraten', 'کمی سرخ یا تفت‌دادن', 'brate … an', [{ word: 'danach', meaning: 'بعد از آن' }, { word: 'das Öl', meaning: 'روغن' }, { word: 'etwas', meaning: 'کمی؛ مقداری' }]),
    sentence('de-v2-a2-cooking-s4', 'Die Suppe schmeckt besser, wenn sie länger kocht.', 'اگر سوپ بیشتر بپزد، خوشمزه‌تر می‌شود.', 'دی زوبِه شمِکت بِسِر، وِن زی لِنگِر کوخت', 'schmecken', 'مزه‌دادن؛ خوش‌طعم‌بودن', 'wenn + فاعل + … + فعل.', [{ word: 'besser', meaning: 'بهتر' }, { word: 'länger', meaning: 'بیشتر؛ طولانی‌تر' }, { word: 'kochen', meaning: 'پختن' }]),
    sentence('de-v2-a2-cooking-s5', 'Kannst du den Tisch decken, während ich den Salat mache?', 'می‌توانی میز را بچینی، درحالی‌که من سالاد درست می‌کنم؟', 'کانست دو دِن تیش دِکِن، وِرِنت ایش دِن زالات ماخِه؟', 'den Tisch decken', 'میز را چیدن', 'während + فاعل + … + فعل.', [{ word: 'während', meaning: 'درحالی‌که' }, { word: 'der Salat', meaning: 'سالاد' }, { word: 'decken', meaning: 'چیدن؛ پوشاندن' }]),
  ], [
    { speaker: 'شما', text: 'Für das Abendessen brauchen wir noch Gemüse.', fa: 'برای شام هنوز سبزیجات لازم داریم.' },
    { speaker: 'دوست', text: 'Ich schneide die Zwiebeln. Was machst du?', fa: 'من پیازها را خرد می‌کنم. تو چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich brate sie an. Kannst du danach den Tisch decken?', fa: 'من آن‌ها را تفت می‌دهم. می‌توانی بعد از آن میز را بچینی؟' },
    { speaker: 'دوست', text: 'Ja, gern. Die Suppe schmeckt sehr gut.', fa: 'بله، با کمال میل. سوپ خیلی خوش‌طعم است.' },
  ]),
  lesson(2, 11, 'de-v2-a2-digital-life', 'زندگی دیجیتال و ارتباط', 'رزرو آنلاین و ارسال فایل را توضیح دهید.', 'برای یک قرار آنلاین ثبت‌نام می‌کنید، تأییدیه را پیدا می‌کنید و یک فایل می‌فرستید.', 'برای ابزارهای روزمره از عبارت‌های رایج استفاده کنید. جملهٔ موصولی با das اطلاعات بیشتری دربارهٔ اسم می‌دهد و فعلش در پایان می‌آید.', [
    sentence('de-v2-a2-digital-s1', 'Ich habe meinen Termin online gebucht.', 'قرارم را آنلاین رزرو کرده‌ام.', 'ایش هابِه ماینِن تِرمین آنلاین گِبوخت', 'online buchen', 'آنلاین رزروکردن', undefined, [{ word: 'buchen', meaning: 'رزروکردن' }, { word: 'der Termin', meaning: 'قرار؛ وقت ملاقات' }, { word: 'online', meaning: 'برخط؛ آنلاین' }]),
    sentence('de-v2-a2-digital-s2', 'Die Bestätigung ist in meinem E-Mail-Postfach angekommen.', 'تأییدیه به صندوق ایمیلم رسیده است.', 'دی بِشتِتیگونگ ایست این ماینِم ایمِیل‌پوست‌فاخ آن‌گِکومِن', 'die Bestätigung', 'تأییدیه', undefined, [{ word: 'das E-Mail-Postfach', meaning: 'صندوق ایمیل' }, { word: 'ankommen', meaning: 'رسیدن' }, { word: 'die E-Mail', meaning: 'ایمیل' }]),
    sentence('de-v2-a2-digital-s3', 'Kannst du mir den Link per Nachricht schicken?', 'می‌توانی پیوند را با پیام برایم بفرستی؟', 'کانست دو میر دِن لینک پِر ناخ‌ریشت شیکِن؟', 'der Link', 'پیوند اینترنتی', undefined, [{ word: 'per Nachricht', meaning: 'ازطریق پیام' }, { word: 'schicken', meaning: 'فرستادن' }, { word: 'mir', meaning: 'برای من؛ به من' }]),
    sentence('de-v2-a2-digital-s4', 'Ich lade die Datei auf mein Handy herunter.', 'فایل را در گوشی‌ام بارگیری می‌کنم.', 'ایش لادِه دی داتای آوف ماین هَندی هِرونتِر', 'herunterladen', 'بارگیری‌کردن؛ دانلودکردن', 'lade … herunter', [{ word: 'die Datei', meaning: 'فایل' }, { word: 'das Handy', meaning: 'گوشی همراه' }, { word: 'laden', meaning: 'بارکردن؛ بارگیری‌کردن' }]),
    sentence('de-v2-a2-digital-s5', 'Ich benutze ein Passwort, das nicht leicht zu erraten ist.', 'از گذرواژه‌ای استفاده می‌کنم که به‌راحتی حدس‌زدنی نیست.', 'ایش بِنوتسِه آین پاس‌وُرت، داس نیشت لایشت تسو اِراتِن ایست', 'das Passwort', 'گذرواژه', 'جملهٔ موصولی با das؛ فعل در پایان.', [{ word: 'benutzen', meaning: 'استفاده‌کردن' }, { word: 'leicht', meaning: 'آسان' }, { word: 'erraten', meaning: 'حدس‌زدن' }]),
  ], [
    { speaker: 'همکار', text: 'Hast du den Termin schon gebucht?', fa: 'قرار را رزرو کرده‌ای؟' },
    { speaker: 'شما', text: 'Ja, ich habe ihn online gebucht. Die Bestätigung ist schon angekommen.', fa: 'بله، آن را آنلاین رزرو کرده‌ام. تأییدیه هم رسیده است.' },
    { speaker: 'همکار', text: 'Kannst du mir den Link schicken?', fa: 'می‌توانی پیوند را برایم بفرستی؟' },
    { speaker: 'شما', text: 'Natürlich. Ich schicke ihn dir per Nachricht.', fa: 'حتماً. آن را با پیام برایت می‌فرستم.' },
  ]),
  lesson(2, 12, 'de-v2-a2-public-services', 'اداره‌ها و کارهای روزمره', 'فرم و نوبت اداره را پیگیری کنید.', 'برای ثبت نشانی به ادارهٔ شهر می‌روید و می‌پرسید چه مدارکی لازم است.', 'برای گفتن هدف از brauchen … für … استفاده کنید. جملهٔ وابسته با bis زمان انتظار را مشخص می‌کند.', [
    sentence('de-v2-a2-services-s1', 'Für die Anmeldung brauche ich meinen Ausweis und ein Foto.', 'برای ثبت‌نام به کارت شناسایی و یک عکس نیاز دارم.', 'فور دی آن‌مِلدونگ براوخِه ایش ماینِن آوس‌وایس اونت آین فوتو', 'die Anmeldung', 'ثبت‌نام؛ ثبت رسمی', undefined, [{ word: 'der Ausweis', meaning: 'کارت شناسایی' }, { word: 'das Foto', meaning: 'عکس' }, { word: 'brauchen', meaning: 'نیازداشتن' }]),
    sentence('de-v2-a2-services-s2', 'Das Bürgerbüro ist am Donnerstag länger geöffnet.', 'ادارهٔ خدمات شهروندی پنجشنبه‌ها مدت بیشتری باز است.', 'داس بورگِر‌بورو ایست اَم دونِرستاگ لِنگِر گِاُفنت', 'das Bürgerbüro', 'ادارهٔ خدمات شهروندی', undefined, [{ word: 'geöffnet', meaning: 'باز؛ گشوده' }, { word: 'länger', meaning: 'مدت بیشتری' }, { word: 'am Donnerstag', meaning: 'روز پنجشنبه' }]),
    sentence('de-v2-a2-services-s3', 'Wo kann ich dieses Formular abgeben?', 'این فرم را کجا می‌توانم تحویل بدهم؟', 'وو کان ایش دیزِس فورمولار اَب‌گِیبِن؟', 'abgeben', 'تحویل‌دادن', 'kann … abgeben', [{ word: 'das Formular', meaning: 'فرم' }, { word: 'wo', meaning: 'کجا' }, { word: 'können', meaning: 'توانستن' }]),
    sentence('de-v2-a2-services-s4', 'Ich habe online einen Termin vereinbart.', 'آنلاین یک وقت ملاقات تعیین کرده‌ام.', 'ایش هابِه آنلاین آینِن تِرمین فِرآینبارت', 'einen Termin vereinbaren', 'وقت ملاقات تعیین‌کردن', undefined, [{ word: 'vereinbaren', meaning: 'هماهنگ‌کردن؛ تعیین‌کردن' }, { word: 'online', meaning: 'برخط؛ آنلاین' }, { word: 'der Termin', meaning: 'وقت ملاقات' }]),
    sentence('de-v2-a2-services-s5', 'Bitte warten Sie, bis Ihre Nummer auf dem Bildschirm erscheint.', 'لطفاً صبر کنید تا شماره‌تان روی صفحه ظاهر شود.', 'بیتِه وارتِن زی، بیس ایرِه نومِر آوف دِم بیلد‌شیرم اِرشاینْت', 'erscheinen', 'ظاهرشدن؛ پدیدارشدن', 'bis + جملهٔ وابسته؛ فعل در پایان.', [{ word: 'warten', meaning: 'منتظرماندن' }, { word: 'die Nummer', meaning: 'شماره' }, { word: 'der Bildschirm', meaning: 'صفحه‌نمایش' }]),
  ], [
    { speaker: 'کارمند', text: 'Haben Sie einen Termin?', fa: 'وقت ملاقات دارید؟' },
    { speaker: 'شما', text: 'Ja, ich habe online einen Termin vereinbart.', fa: 'بله، آنلاین وقت گرفته‌ام.' },
    { speaker: 'کارمند', text: 'Bitte zeigen Sie Ihren Ausweis und warten Sie, bis Ihre Nummer erscheint.', fa: 'لطفاً کارت شناسایی‌تان را نشان دهید و صبر کنید تا شماره‌تان ظاهر شود.' },
    { speaker: 'شما', text: 'Danke. Wo kann ich das Formular abgeben?', fa: 'ممنون. فرم را کجا تحویل بدهم؟' },
  ]),
  lesson(2, 13, 'de-v2-a2-moving-home', 'جابه‌جایی و خانهٔ تازه', 'دربارهٔ اسباب‌کشی و ویژگی‌های خانه حرف بزنید.', 'به دوستتان خبر می‌دهید که ماه آینده جابه‌جا می‌شوید و برای روز اسباب‌کشی کمک می‌خواهید.', 'فعل ziehen در عبارت in eine Wohnung ziehen به‌معنای نقل‌مکان‌کردن است. näher شکل مقایسه‌ای nah است.', [
    sentence('de-v2-a2-moving-s1', 'Wir ziehen nächsten Monat in eine größere Wohnung.', 'ماه آینده به آپارتمان بزرگ‌تری نقل‌مکان می‌کنیم.', 'ویر تسیِن نِکستِن مونات این آینِه گرُوسِرِه وونونگ', 'umziehen', 'اسباب‌کشی‌کردن؛ نقل‌مکان‌کردن', undefined, [{ word: 'nächsten Monat', meaning: 'ماه آینده' }, { word: 'größer', meaning: 'بزرگ‌تر' }, { word: 'die Wohnung', meaning: 'آپارتمان' }]),
    sentence('de-v2-a2-moving-s2', 'Die neue Wohnung liegt näher an meinem Arbeitsplatz.', 'آپارتمان تازه به محل کارم نزدیک‌تر است.', 'دی نویِه وونونگ لیگت نِهِر اَن ماینِر آربایت', 'näher', 'نزدیک‌تر', undefined, [{ word: 'liegen', meaning: 'قرارداشتن؛ واقع‌شدن' }, { word: 'der Arbeitsplatz', meaning: 'محل کار' }, { word: 'neu', meaning: 'تازه؛ جدید' }]),
    sentence('de-v2-a2-moving-s3', 'Für den Umzug haben wir einen kleinen Transporter gemietet.', 'برای اسباب‌کشی یک ون کوچک اجاره کرده‌ایم.', 'فور دِن اوم‌تسوگ هابِن ویر آینِن کلاینِن ترانسپورتر گِمیتِت', 'der Umzug', 'اسباب‌کشی', undefined, [{ word: 'der Transporter', meaning: 'ون؛ خودروی باربری' }, { word: 'mieten', meaning: 'اجاره‌کردن' }, { word: 'klein', meaning: 'کوچک' }]),
    sentence('de-v2-a2-moving-s4', 'Meine Nachbarin hilft mir beim Packen.', 'همسایه‌ام در بسته‌بندی کمکم می‌کند.', 'ماینِه ناخبارین هیلفت میر بایم پاکِن', 'packen', 'بسته‌بندی‌کردن؛ جمع‌کردن وسایل', undefined, [{ word: 'die Nachbarin', meaning: 'همسایهٔ زن' }, { word: 'helfen', meaning: 'کمک‌کردن' }, { word: 'beim Packen', meaning: 'هنگام بسته‌بندی' }]),
    sentence('de-v2-a2-moving-s5', 'Die Küche ist schon eingebaut, aber ein Schrank fehlt.', 'آشپزخانه نصب شده، اما یک کمد کم است.', 'دی کوخِه ایست شون آین‌گِباوت، آبِر آین شرانک فِلت', 'eingebaut', 'نصب‌شده؛ توکار', undefined, [{ word: 'der Schrank', meaning: 'کمد' }, { word: 'fehlen', meaning: 'کم‌بودن؛ وجودنداشتن' }, { word: 'schon', meaning: 'از قبل؛ همین حالا' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wann zieht ihr um?', fa: 'چه زمانی اسباب‌کشی می‌کنید؟' },
    { speaker: 'شما', text: 'Nächsten Monat. Die neue Wohnung liegt näher an meiner Arbeit.', fa: 'ماه آینده. آپارتمان تازه به محل کارم نزدیک‌تر است.' },
    { speaker: 'طرف مقابل', text: 'Brauchst du Hilfe beim Packen?', fa: 'برای بسته‌بندی کمک لازم داری؟' },
    { speaker: 'شما', text: 'Ja, das wäre toll. Meine Nachbarin hilft mir auch.', fa: 'بله، عالی می‌شود. همسایه‌ام هم کمکم می‌کند.' },
  ]),
  lesson(2, 14, 'de-v2-a2-trip-planning', 'برنامه‌ریزی سفر', 'زمان، اقامت و کارهای پیش از سفر را هماهنگ کنید.', 'با دوستی برای تعطیلات برنامه می‌ریزید و محل اقامت و رفت‌وآمد را انتخاب می‌کنید.', 'برای پیشنهاد مؤدبانه می‌توانید از möchten و könnten استفاده کنید. اگر شرطی مطرح می‌کنید، فعل جملهٔ wenn به پایان می‌رود.', [
    sentence('de-v2-a2-trip-s1', 'Wir fahren im Herbst für eine Woche an die Ostsee.', 'پاییز برای یک هفته به ساحل دریای بالتیک می‌رویم.', 'ویر فارِن ایم هِربست فور آینِه وُخِه اَن دی اُست‌زِه', 'die Ostsee', 'دریای بالتیک', undefined, [{ word: 'im Herbst', meaning: 'در پاییز' }, { word: 'für eine Woche', meaning: 'برای یک هفته' }, { word: 'fahren', meaning: 'رفتن با وسیلهٔ نقلیه' }]),
    sentence('de-v2-a2-trip-s2', 'Unsere Unterkunft liegt nur wenige Minuten vom Strand entfernt.', 'محل اقامت ما فقط چند دقیقه با ساحل فاصله دارد.', 'اونزِرِه اونتِرکونفت لیگت نور وِنیگِه مینوتِن فوم شترانت اِنتفِرنت', 'die Unterkunft', 'محل اقامت', undefined, [{ word: 'der Strand', meaning: 'ساحل' }, { word: 'entfernt', meaning: 'دور؛ فاصله‌دار' }, { word: 'wenige Minuten', meaning: 'چند دقیقه' }]),
    sentence('de-v2-a2-trip-s3', 'Ich möchte die Fahrkarten vorher online kaufen.', 'می‌خواهم بلیت‌ها را از قبل آنلاین بخرم.', 'ایش موشتِه دی فارکارتِن فورهِر آنلاین کاوفِن', 'die Fahrkarte', 'بلیت سفر', undefined, [{ word: 'vorher', meaning: 'از قبل' }, { word: 'online', meaning: 'برخط؛ آنلاین' }, { word: 'kaufen', meaning: 'خریدن' }]),
    sentence('de-v2-a2-trip-s4', 'Wenn das Wetter gut ist, machen wir eine Fahrradtour.', 'اگر هوا خوب باشد، با دوچرخه گردش می‌کنیم.', 'وِن داس وِتِر گوت ایست، ماخِن ویر آینِه فاررات‌تور', 'die Fahrradtour', 'گردش با دوچرخه', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'das Wetter', meaning: 'هوا' }, { word: 'die Fahrradtour machen', meaning: 'با دوچرخه گردش‌کردن' }, { word: 'gut', meaning: 'خوب' }]),
    sentence('de-v2-a2-trip-s5', 'Am letzten Tag müssen wir vor elf Uhr auschecken.', 'روز آخر باید پیش از ساعت یازده اتاق را تحویل دهیم.', 'اَم لِتستِن تاگ موسِن ویر فور اِلف اور آوس‌چِکِن', 'auschecken', 'تسویه‌کردن و تحویل اتاق هتل', undefined, [{ word: 'am letzten Tag', meaning: 'در روز آخر' }, { word: 'vor elf Uhr', meaning: 'پیش از ساعت یازده' }, { word: 'müssen', meaning: 'باید؛ مجبوربودن' }]),
  ], [
    { speaker: 'شما', text: 'Wollen wir im Herbst verreisen?', fa: 'پاییز به سفر برویم؟' },
    { speaker: 'طرف مقابل', text: 'Gern. Wohin möchtest du fahren?', fa: 'با کمال میل. کجا دوست داری بروی؟' },
    { speaker: 'شما', text: 'An die Ostsee. Wenn das Wetter gut ist, machen wir eine Fahrradtour.', fa: 'به ساحل بالتیک. اگر هوا خوب باشد، با دوچرخه گردش می‌کنیم.' },
    { speaker: 'طرف مقابل', text: 'Prima. Ich kaufe die Fahrkarten vorher online.', fa: 'عالی است. بلیت‌ها را از قبل آنلاین می‌خرم.' },
  ]),
  lesson(2, 15, 'de-v2-a2-travel-memory', 'خاطرهٔ سفر در گذشته', 'یک سفر را با ترتیب زمانی روایت کنید.', 'در کلاس زبان دربارهٔ سفری که تابستان گذشته انجام داده‌اید خاطره‌ای کوتاه تعریف می‌کنید.', 'برای ترتیب رویدادها از zuerst و danach استفاده کنید. فعل‌های حرکت در Perfekt معمولاً با sein می‌آیند؛ gefallen در گذشته با hat می‌آید.', [
    sentence('de-v2-a2-memory-s1', 'Letzten Sommer sind wir durch Österreich gereist.', 'تابستان گذشته در اتریش سفر کردیم.', 'لِتستِن زومِر زینت ویر دورش اُستِررایش گِرایست', 'durch Österreich reisen', 'در اتریش سفرکردن', undefined, [{ word: 'letzten Sommer', meaning: 'تابستان گذشته' }, { word: 'durch', meaning: 'از میان؛ در سراسر' }, { word: 'reisen', meaning: 'سفرکردن' }]),
    sentence('de-v2-a2-memory-s2', 'Zuerst haben wir zwei Nächte in Salzburg verbracht.', 'اول دو شب را در سالزبورگ گذراندیم.', 'تسوئِرست هابِن ویر تسوای نِختِه این زالتسبورگ فِربراخت', 'verbringen', 'گذراندنِ زمان', undefined, [{ word: 'zuerst', meaning: 'اول؛ در ابتدا' }, { word: 'zwei Nächte', meaning: 'دو شب' }, { word: 'verbrachte Zeit', meaning: 'زمانی را گذراند' }]),
    sentence('de-v2-a2-memory-s3', 'Danach sind wir mit dem Zug weitergefahren.', 'بعد از آن با قطار به مسیرمان ادامه دادیم.', 'داناک زینت ویر میت دِم تسوگ وایتِر‌گِفارِن', 'weiterfahren', 'به مسیر ادامه‌دادن', undefined, [{ word: 'danach', meaning: 'بعد از آن' }, { word: 'mit dem Zug', meaning: 'با قطار' }, { word: 'der Zug', meaning: 'قطار' }]),
    sentence('de-v2-a2-memory-s4', 'Am besten hat mir die kleine Altstadt gefallen.', 'بیش از همه شهر قدیمی کوچک را دوست داشتم.', 'اَم بِستِن هات میر دی کلاینِه آلت‌شتات گِفالِن', 'die Altstadt', 'بخش قدیمی شهر', undefined, [{ word: 'am besten', meaning: 'از همه بهتر؛ بیش از همه' }, { word: 'gefallen', meaning: 'پسندآمدن؛ خوش‌آمدن' }, { word: 'klein', meaning: 'کوچک' }]),
    sentence('de-v2-a2-memory-s5', 'Die Reise war anstrengend, aber sehr interessant.', 'سفر خسته‌کننده اما بسیار جالب بود.', 'دی رایزِه وار آن‌شترِنگِنت، آبِر زِر اینتِرِسانت', 'anstrengend', 'خسته‌کننده؛ طاقت‌فرسا', undefined, [{ word: 'die Reise', meaning: 'سفر' }, { word: 'interessant', meaning: 'جالب' }, { word: 'aber', meaning: 'اما' }]),
  ], [
    { speaker: 'هم‌کلاسی', text: 'Wohin bist du letzten Sommer gereist?', fa: 'تابستان گذشته به کجا سفر کردی؟' },
    { speaker: 'شما', text: 'Wir sind durch Österreich gereist und haben zwei Nächte in Salzburg verbracht.', fa: 'در اتریش سفر کردیم و دو شب در سالزبورگ ماندیم.' },
    { speaker: 'هم‌کلاسی', text: 'Was hat dir am besten gefallen?', fa: 'از همه بیشتر چه چیزی را دوست داشتی؟' },
    { speaker: 'شما', text: 'Die kleine Altstadt. Die Reise war sehr interessant.', fa: 'بخش قدیمی شهر را. سفر خیلی جالب بود.' },
  ]),
  lesson(2, 16, 'de-v2-a2-weather-environment', 'هوا، فصل‌ها و محیط زیست', 'آب‌وهوا را گزارش و عادت ساده‌ای را توضیح دهید.', 'برای برنامهٔ گردش آخر هفته، هوا را بررسی می‌کنید و دربارهٔ صرفه‌جویی در آب حرف می‌زنید.', 'es regnet یعنی باران می‌بارد. indem روشی برای انجام کار را توضیح می‌دهد؛ جملهٔ وابسته با فعل در پایان می‌آید.', [
    sentence('de-v2-a2-weather-s1', 'Seit zwei Tagen regnet es fast ohne Pause.', 'دو روز است تقریباً بی‌وقفه باران می‌بارد.', 'زایت تسوای تاگِن رِگنِت اِس فاست اونِه پاوزِه', 'ohne Pause', 'بدون وقفه', undefined, [{ word: 'seit zwei Tagen', meaning: 'از دو روز پیش؛ به‌مدت دو روز تا اکنون' }, { word: 'regnen', meaning: 'باران‌باریدن' }, { word: 'fast', meaning: 'تقریباً' }]),
    sentence('de-v2-a2-weather-s2', 'Bei starkem Wind bleiben die Boote im Hafen.', 'وقتی باد شدید است، قایق‌ها در بندر می‌مانند.', 'بای شتارکِم ویند بِلایبِن دی بوتِه ایم هافِن', 'der Hafen', 'بندر', undefined, [{ word: 'starker Wind', meaning: 'باد شدید' }, { word: 'das Boot', meaning: 'قایق' }, { word: 'bleiben', meaning: 'ماندن' }]),
    sentence('de-v2-a2-weather-s3', 'Bei schlechtem Wetter bleiben wir lieber drinnen.', 'در هوای بد ترجیح می‌دهیم داخل بمانیم.', 'بای شلِشتِم وِتِر بِلایبِن ویر لیبِر درینِن', 'drinnen bleiben', 'داخل ماندن', undefined, [{ word: 'schlechtes Wetter', meaning: 'هوای نامناسب' }, { word: 'lieber', meaning: 'ترجیحاً' }, { word: 'drinnen', meaning: 'داخل؛ درون ساختمان' }]),
    sentence('de-v2-a2-weather-s4', 'Ich spare Wasser, indem ich kürzer dusche.', 'با کوتاه‌تر دوش‌گرفتن در مصرف آب صرفه‌جویی می‌کنم.', 'ایش شپارِه واسِر، ایندِم ایش کورتسِر دوشِه', 'Wasser sparen', 'در مصرف آب صرفه‌جویی‌کردن', 'indem + فاعل + … + فعل.', [{ word: 'sparen', meaning: 'صرفه‌جویی‌کردن' }, { word: 'kürzer', meaning: 'کوتاه‌تر' }, { word: 'duschen', meaning: 'دوش‌گرفتن' }]),
    sentence('de-v2-a2-weather-s5', 'Morgen soll es wieder wärmer werden.', 'قرار است فردا دوباره گرم‌تر شود.', 'مورگِن زول اِس ویدِر وِرمِر وِردِن', 'wärmer werden', 'گرم‌ترشدن', undefined, [{ word: 'morgen', meaning: 'فردا' }, { word: 'wieder', meaning: 'دوباره' }, { word: 'werden', meaning: 'شدن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Gehen wir morgen spazieren?', fa: 'فردا برای قدم‌زدن برویم؟' },
    { speaker: 'شما', text: 'Vielleicht. Seit zwei Tagen regnet es fast ohne Pause.', fa: 'شاید. دو روز است تقریباً بی‌وقفه باران می‌بارد.' },
    { speaker: 'طرف مقابل', text: 'Der Wetterbericht sagt, morgen wird es wärmer.', fa: 'گزارش هواشناسی می‌گوید فردا گرم‌تر می‌شود.' },
    { speaker: 'شما', text: 'Prima. Dann können wir zum Hafen gehen.', fa: 'عالی است. پس می‌توانیم به بندر برویم.' },
  ]),
  lesson(2, 17, 'de-v2-a2-family-celebration', 'مهمانی، خانواده و مناسبت‌ها', 'برای یک مناسبت برنامه‌ریزی کنید.', 'برای تولد یکی از اعضای خانواده آماده می‌شوید و از همسایه‌ها هم دعوت می‌کنید.', 'برای دعوت از jemanden zu etwas einladen استفاده کنید. جملهٔ وابسته با weil دلیل را بیان می‌کند؛ فعل در پایان می‌آید.', [
    sentence('de-v2-a2-family-s1', 'Am Samstag feiern wir den Geburtstag meiner Mutter.', 'شنبه تولد مادرم را جشن می‌گیریم.', 'اَم زامستاگ فایِرن ویر دِن گِبوُرتستاگ ماینِر موتِر', 'der Geburtstag', 'تولد', undefined, [{ word: 'feiern', meaning: 'جشن‌گرفتن' }, { word: 'am Samstag', meaning: 'روز شنبه' }, { word: 'meine Mutter', meaning: 'مادرم' }]),
    sentence('de-v2-a2-family-s2', 'Meine Schwester backt einen Apfelkuchen.', 'خواهرم یک کیک سیب می‌پزد.', 'ماینِه شوِستِر باکت آینِن آپفِل‌کوخِن', 'backen', 'در فر پختن', undefined, [{ word: 'der Apfelkuchen', meaning: 'کیک سیب' }, { word: 'die Schwester', meaning: 'خواهر' }, { word: 'einen Kuchen backen', meaning: 'کیک پختن' }]),
    sentence('de-v2-a2-family-s3', 'Ich lade unsere Nachbarn zur Feier ein.', 'همسایه‌هایمان را به جشن دعوت می‌کنم.', 'ایش لادِه اونزِرِه ناخبارن تسور فایِر آین', 'einladen', 'دعوت‌کردن', 'lade … ein', [{ word: 'der Nachbar', meaning: 'همسایه' }, { word: 'die Feier', meaning: 'جشن؛ مراسم' }, { word: 'zu einer Feier', meaning: 'به یک جشن' }]),
    sentence('de-v2-a2-family-s4', 'Wir bereiten die Wohnung vor, bevor die Gäste kommen.', 'پیش از آمدن مهمان‌ها، خانه را آماده می‌کنیم.', 'ویر هابِن دی وونونگ فوربِرایتِت، بِفور دی گِستِه کومِن', 'vorbereiten', 'آماده‌کردن', undefined, [{ word: 'bevor', meaning: 'پیش از اینکه' }, { word: 'der Gast', meaning: 'مهمان' }, { word: 'vorbereitet', meaning: 'آماده‌کرده' }]),
    sentence('de-v2-a2-family-s5', 'Es war schön, weil die ganze Familie zusammen war.', 'خوب بود، چون همهٔ خانواده با هم بودند.', 'اِس وار شون، وایل دی گانتسِه فامیلیِه تسوزامن وار', 'die ganze Familie', 'تمام خانواده', 'weil + فاعل + … + فعل.', [{ word: 'die Familie', meaning: 'خانواده' }, { word: 'zusammen', meaning: 'با هم' }, { word: 'schön', meaning: 'خوب؛ زیبا' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Was machst du am Samstag?', fa: 'شنبه چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Wir feiern den Geburtstag meiner Mutter. Meine Schwester backt einen Apfelkuchen.', fa: 'تولد مادرم را جشن می‌گیریم. خواهرم کیک سیب می‌پزد.' },
    { speaker: 'طرف مقابل', text: 'Ladet ihr auch die Nachbarn ein?', fa: 'همسایه‌ها را هم دعوت می‌کنید؟' },
    { speaker: 'شما', text: 'Ja, wir feiern gern mit unseren Nachbarn zusammen.', fa: 'بله، دوست داریم همراه همسایه‌هایمان جشن بگیریم.' },
  ]),
  lesson(2, 18, 'de-v2-a2-culture-events', 'فرهنگ، رویداد و اوقات فراغت', 'برای برنامهٔ فرهنگی بلیت بگیرید و نظر بدهید.', 'با دوستی به کنسرت می‌روید و دربارهٔ برنامه و تجربهٔ آن گفت‌وگو می‌کنید.', 'obwohl برای بیان تضاد است و فعل جملهٔ وابسته را به پایان می‌برد. بعد از obwohl، جملهٔ اصلی با فعل آغاز می‌شود.', [
    sentence('de-v2-a2-culture-s1', 'Am Wochenende gibt es im Stadtzentrum ein Freiluftkonzert.', 'آخر هفته در مرکز شهر کنسرتی در فضای باز برگزار می‌شود.', 'اَم وُخِن‌اِندِه گیبت اِس ایم شتات‌تسِنتروم آین فرای‌لوفت‌کُنتسِرت', 'das Freiluftkonzert', 'کنسرت در فضای باز', undefined, [{ word: 'am Wochenende', meaning: 'آخر هفته' }, { word: 'das Stadtzentrum', meaning: 'مرکز شهر' }, { word: 'es gibt', meaning: 'وجود دارد؛ برگزار می‌شود' }]),
    sentence('de-v2-a2-culture-s2', 'Wir haben die Eintrittskarten online gekauft.', 'بلیت‌های ورودی را آنلاین خریده‌ایم.', 'ویر هابِن دی آین‌تریتس‌کارتِن آنلاین گِکاوفت', 'die Eintrittskarte', 'بلیت ورودی', undefined, [{ word: 'kaufen', meaning: 'خریدن' }, { word: 'online', meaning: 'برخط؛ آنلاین' }, { word: 'die Karte', meaning: 'بلیت؛ کارت' }]),
    sentence('de-v2-a2-culture-s3', 'Die Band beginnt um halb neun.', 'اجرای گروه ساعت هشت‌ونیم شروع می‌شود.', 'دی بَند بِگینت اوم هالب نویْن', 'die Band', 'گروه موسیقی', undefined, [{ word: 'beginnen', meaning: 'شروع‌شدن' }, { word: 'um halb neun', meaning: 'ساعت هشت‌ونیم' }, { word: 'die Musik', meaning: 'موسیقی' }]),
    sentence('de-v2-a2-culture-s4', 'Obwohl es leicht regnet, bleiben viele Besucher.', 'با اینکه کمی باران می‌بارد، بازدیدکنندگان زیادی می‌مانند.', 'اوب‌وُل اِس لایشت رِگنِت، بِلایبِن فیلِه بِزوخِر', 'der Besucher', 'بازدیدکننده', 'Obwohl …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'leicht', meaning: 'کمی؛ اندک' }, { word: 'regnen', meaning: 'باران‌باریدن' }, { word: 'bleiben', meaning: 'ماندن' }]),
    sentence('de-v2-a2-culture-s5', 'Nach dem Konzert gehen wir noch etwas trinken.', 'بعد از کنسرت می‌رویم چیزی بنوشیم.', 'ناخ دِم کُنتسِرت گِهِن ویر نوخ اِتواس ترینکِن', 'etwas trinken gehen', 'رفتن برای نوشیدن چیزی', undefined, [{ word: 'nach dem Konzert', meaning: 'بعد از کنسرت' }, { word: 'noch', meaning: 'باز هم؛ بعدتر' }, { word: 'trinken', meaning: 'نوشیدن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Möchtest du am Wochenende zum Konzert gehen?', fa: 'دوست داری آخر هفته به کنسرت برویم؟' },
    { speaker: 'شما', text: 'Gern. Ich habe die Eintrittskarten schon online gekauft.', fa: 'با کمال میل. بلیت‌ها را قبلاً آنلاین خریده‌ام.' },
    { speaker: 'طرف مقابل', text: 'Es soll leicht regnen.', fa: 'گفته‌اند کمی باران می‌بارد.' },
    { speaker: 'شما', text: 'Das macht nichts. Wir bleiben trotzdem.', fa: 'اشکالی ندارد. بااین‌حال می‌مانیم.' },
  ]),
  lesson(2, 19, 'de-v2-a2-health-habits', 'سلامت و عادت‌های روزانه', 'عادت سالم و برنامهٔ روزانه را توصیف کنید.', 'با هم‌خانه دربارهٔ پیاده‌روی، خوراک و استراحت در روزهای شلوغ صحبت می‌کنید.', 'sich fühlen فعل بازتابی است. برای بیان هدف از um … zu استفاده کنید؛ فاعل دو بخش باید یکسان باشد.', [
    sentence('de-v2-a2-habits-s1', 'Ich fühle mich besser, seit ich jeden Abend spazieren gehe.', 'از وقتی هر شب پیاده‌روی می‌کنم، حالم بهتر است.', 'ایش فیولِه میش بِسِر، زایت ایش یدِن آبِنت شپاتسیرِن گِه‌ه', 'sich besser fühlen', 'حال بهتری‌داشتن', undefined, [{ word: 'sich fühlen', meaning: 'احساس‌کردن؛ حال‌داشتن' }, { word: 'seit', meaning: 'از زمانی که؛ از' }, { word: 'jeden Abend', meaning: 'هر شب' }]),
    sentence('de-v2-a2-habits-s2', 'Zum Frühstück esse ich meistens Haferflocken und Obst.', 'معمولاً برای صبحانه جو دوسر و میوه می‌خورم.', 'تسوم فروشتوک اِسِه ایش مایستِنس هافِرفلوکِن اونت اُبست', 'die Haferflocken', 'پرک جو دوسر', undefined, [{ word: 'zum Frühstück', meaning: 'برای صبحانه' }, { word: 'meistens', meaning: 'معمولاً' }, { word: 'das Obst', meaning: 'میوه' }]),
    sentence('de-v2-a2-habits-s3', 'Bei der Arbeit trinke ich genug Wasser.', 'در محل کار به‌اندازهٔ کافی آب می‌نوشم.', 'بای دِر آربایت ترینکِه ایش گِنوق واسِر', 'genug Wasser trinken', 'به‌اندازهٔ کافی آب نوشیدن', undefined, [{ word: 'genug', meaning: 'به‌اندازهٔ کافی' }, { word: 'trinken', meaning: 'نوشیدن' }, { word: 'bei der Arbeit', meaning: 'در محل کار' }]),
    sentence('de-v2-a2-habits-s4', 'Wenn ich müde bin, mache ich eine kurze Pause.', 'اگر خسته باشم، استراحت کوتاهی می‌کنم.', 'وِن ایش مودِه بین، ماخِه ایش آینِه کورتسِه پاوزِه', 'müde', 'خسته', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'eine Pause machen', meaning: 'استراحت‌کردن' }, { word: 'kurz', meaning: 'کوتاه' }, { word: 'wenn', meaning: 'اگر؛ هرگاه' }]),
    sentence('de-v2-a2-habits-s5', 'Am Wochenende gehe ich schwimmen, um fit zu bleiben.', 'آخر هفته شنا می‌کنم تا سرحال بمانم.', 'اَم وُخِن‌اِندِه گِه‌ه ایش شویمِن، اوم فیت تسو بلایبِن', 'fit bleiben', 'سرحال و آماده ماندن', 'um … zu + مصدر؛ بیان هدف.', [{ word: 'schwimmen gehen', meaning: 'به شنا رفتن' }, { word: 'das Wochenende', meaning: 'آخر هفته' }, { word: 'um … zu', meaning: 'برای اینکه؛ به‌منظورِ' }]),
  ], [
    { speaker: 'هم‌خانه', text: 'Du gehst jetzt jeden Abend spazieren, oder?', fa: 'حالا هر شب برای پیاده‌روی می‌روی، درست است؟' },
    { speaker: 'شما', text: 'Ja, seit ich das mache, fühle ich mich besser.', fa: 'بله، از وقتی این کار را می‌کنم حالم بهتر است.' },
    { speaker: 'هم‌خانه', text: 'Was machst du, wenn du bei der Arbeit müde bist?', fa: 'اگر سر کار خسته شوی چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich mache eine kurze Pause und trinke Wasser.', fa: 'استراحت کوتاهی می‌کنم و آب می‌نوشم.' },
  ]),
  lesson(2, 20, 'de-v2-a2-home-problem-solving', 'حل مسئله در خانه و شهر', 'خرابی را شرح دهید و زمان تعمیر را هماهنگ کنید.', 'با خدمات مشتری تماس می‌گیرید تا برای تعمیر شیر آب زمان مناسبی پیدا کنید.', 'درخواست مؤدبانه را با Könnten Sie …? بیان کنید. Falls جملهٔ شرطی می‌سازد و فعل را به پایان می‌برد.', [
    sentence('de-v2-a2-problem-s1', 'Der Wasserhahn tropft seit gestern.', 'شیر آب از دیروز چکه می‌کند.', 'دِر واسِر‌هان تروپفت زایت گِسترن', 'der Wasserhahn', 'شیر آب', undefined, [{ word: 'tropfen', meaning: 'چکه‌کردن' }, { word: 'seit gestern', meaning: 'از دیروز' }, { word: 'das Wasser', meaning: 'آب' }]),
    sentence('de-v2-a2-problem-s2', 'Ich habe den Kundendienst angerufen, aber niemand hat geantwortet.', 'با خدمات مشتری تماس گرفتم، اما کسی پاسخ نداد.', 'ایش هابِه دِن کونْدِن‌دینست آن‌گِروفِن، آبِر نیمانت هات گِآنت‌وُرتِت', 'der Kundendienst', 'خدمات مشتری', undefined, [{ word: 'anrufen', meaning: 'تلفن‌کردن' }, { word: 'niemand', meaning: 'هیچ‌کس' }, { word: 'antworten', meaning: 'پاسخ‌دادن' }]),
    sentence('de-v2-a2-problem-s3', 'Könnten Sie heute Nachmittag einen Techniker schicken?', 'ممکن است امروز بعدازظهر یک تعمیرکار بفرستید؟', 'کونتِن زی هویته ناخمیتاگ آینِن تِخنیکِر شیکِن؟', 'der Techniker', 'تکنسین؛ تعمیرکار', 'Könnten Sie …? درخواست مؤدبانه.', [{ word: 'heute Nachmittag', meaning: 'امروز بعدازظهر' }, { word: 'schicken', meaning: 'فرستادن' }, { word: 'könnten', meaning: 'ممکن است؛ صورت مؤدبانهٔ können' }]),
    sentence('de-v2-a2-problem-s4', 'Falls heute niemand kommen kann, passt mir morgen Vormittag auch.', 'اگر امروز کسی نتواند بیاید، فردا صبح هم برایم مناسب است.', 'فالس هویته نیمانت کومِن کان، پاست میر مورگِن فورمیتاگ آوخ', 'Vormittag', 'پیش از ظهر', 'Falls …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'kommen können', meaning: 'توانستن آمدن' }, { word: 'morgen Vormittag', meaning: 'فردا پیش از ظهر' }, { word: 'passen', meaning: 'مناسب‌بودن' }]),
    sentence('de-v2-a2-problem-s5', 'Vielen Dank für Ihre schnelle Rückmeldung.', 'از پاسخ سریع شما بسیار ممنونم.', 'فیلِن دانک فور ایرِه شنِلِه روک‌مِلدونگ', 'die Rückmeldung', 'پاسخ؛ بازخورد', undefined, [{ word: 'schnell', meaning: 'سریع' }, { word: 'Vielen Dank für …', meaning: 'از … بسیار ممنون' }, { word: 'Ihre', meaning: 'مال شما؛ خطاب رسمی' }]),
  ], [
    { speaker: 'شما', text: 'Guten Tag. Der Wasserhahn tropft seit gestern.', fa: 'روز بخیر. شیر آب از دیروز چکه می‌کند.' },
    { speaker: 'خدمات تعمیر', text: 'Könnten Sie morgen Vormittag zu Hause sein?', fa: 'می‌توانید فردا پیش از ظهر خانه باشید؟' },
    { speaker: 'شما', text: 'Ja, das passt. Vielen Dank für Ihre Rückmeldung.', fa: 'بله، مناسب است. از پاسخ شما ممنونم.' },
    { speaker: 'خدمات تعمیر', text: 'Der Techniker kommt zwischen neun und zehn Uhr.', fa: 'تکنسین بین ساعت نه و ده می‌آید.' },
  ]),
  lesson(2, 21, 'de-v2-a2-scheduling', 'هماهنگی زمان و برنامه‌های متغیر', 'قرار را جابه‌جا کنید و زمان جایگزین پیشنهاد دهید.', 'زمان جلسه تغییر می‌کند و باید با همکارانتان برنامهٔ تازه‌ای هماهنگ کنید.', 'verschieben یعنی به زمان دیگری انتقال‌دادن. اگر جمله با زمان آغاز شود، فعل صرف‌شده در جایگاه دوم می‌آید.', [
    sentence('de-v2-a2-schedule-s1', 'Können wir den Termin auf Donnerstag verschieben?', 'می‌توانیم قرار را به پنجشنبه منتقل کنیم؟', 'کونِن ویر دِن تِرمین آوف دونِرستاگ فِرشیبِن؟', 'verschieben', 'به‌تعویق‌انداختن؛ جابه‌جاکردن زمان', undefined, [{ word: 'der Termin', meaning: 'قرار؛ وقت' }, { word: 'auf Donnerstag', meaning: 'به روز پنجشنبه' }, { word: 'können', meaning: 'توانستن' }]),
    sentence('de-v2-a2-schedule-s2', 'Am Vormittag habe ich schon einen Arzttermin.', 'پیش از ظهر از قبل وقت پزشک دارم.', 'اَم فورمیتاگ هابِه ایش شون آینِن آرتست‌تِرمین', 'der Arzttermin', 'وقت پزشک', undefined, [{ word: 'der Vormittag', meaning: 'پیش از ظهر' }, { word: 'schon', meaning: 'از قبل؛ همین حالا' }, { word: 'haben', meaning: 'داشتن' }]),
    sentence('de-v2-a2-schedule-s3', 'Lass uns die Besprechung auf halb vier legen.', 'بیا جلسه را برای ساعت سه‌ونیم بگذاریم.', 'لاس اونس دی بِشپرِشونگ آوف هالب فیِر لِگِن', 'die Besprechung', 'جلسه؛ نشست کاری', undefined, [{ word: 'lass uns …', meaning: 'بیا …؛ پیشنهاد دوستانه' }, { word: 'auf halb vier', meaning: 'برای ساعت سه‌ونیم' }, { word: 'legen', meaning: 'گذاشتن؛ تعیین‌کردن زمان' }]),
    sentence('de-v2-a2-schedule-s4', 'Ich muss vorher die Unterlagen vorbereiten.', 'باید پیش از آن مدارک را آماده کنم.', 'ایش موس فورهِر دی اونتِرلاگِن فوربِرایتِن', 'die Unterlagen', 'مدارک؛ اسناد', undefined, [{ word: 'vorher', meaning: 'پیش از آن' }, { word: 'vorbereiten', meaning: 'آماده‌کردن' }, { word: 'müssen', meaning: 'باید' }]),
    sentence('de-v2-a2-schedule-s5', 'Wenn du früher fertig bist, ruf mich bitte kurz an.', 'اگر زودتر کارت تمام شد، لطفاً کوتاه به من زنگ بزن.', 'وِن دو فرویِر فِرتیش بیست، روف میش بیتِه کورتس اَن', 'fertig sein', 'تمام‌کردن؛ آماده‌بودن', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'früher', meaning: 'زودتر' }, { word: 'kurz anrufen', meaning: 'کوتاه تماس‌گرفتن' }, { word: 'anrufen', meaning: 'تلفن‌کردن' }]),
  ], [
    { speaker: 'همکار', text: 'Können wir die Besprechung verschieben?', fa: 'می‌توانیم جلسه را جابه‌جا کنیم؟' },
    { speaker: 'شما', text: 'Am Vormittag habe ich einen Arzttermin.', fa: 'پیش از ظهر وقت پزشک دارم.' },
    { speaker: 'همکار', text: 'Passt dir halb vier?', fa: 'ساعت سه‌ونیم برایت مناسب است؟' },
    { speaker: 'شما', text: 'Ja. Wenn ich früher fertig bin, rufe ich dich an.', fa: 'بله. اگر زودتر کارم تمام شود، با تو تماس می‌گیرم.' },
  ]),
  lesson(2, 22, 'de-v2-a2-compare-options', 'مقایسه و انتخاب', 'دو گزینه را مقایسه و دلیل انتخاب را بگویید.', 'برای سفر، قطار و محل اقامت را مقایسه می‌کنید و گزینهٔ مناسب‌تر را انتخاب می‌کنید.', 'برای مقایسه از صفت + -er + als استفاده کنید. am …-sten شکل برترین صفت را می‌سازد؛ bequemer یعنی راحت‌تر.', [
    sentence('de-v2-a2-compare-s1', 'Der Regionalzug ist langsamer als der ICE, aber günstiger.', 'قطار محلی از قطار سریع‌السیر کندتر، اما ارزان‌تر است.', 'دِر رِگیونال‌تسوگ ایست لانگزامِر آلس دِر ای‌سه‌اِه، آبِر گونستیگِر', 'der Regionalzug', 'قطار منطقه‌ای', 'صفت مقایسه‌ای + als.', [{ word: 'langsamer als', meaning: 'کندتر از' }, { word: 'günstiger', meaning: 'ارزان‌تر؛ به‌صرفه‌تر' }, { word: 'aber', meaning: 'اما' }]),
    sentence('de-v2-a2-compare-s2', 'Das Gästehaus ist nicht so zentral wie das Hotel.', 'مهمان‌خانه به‌اندازهٔ هتل مرکزی نیست.', 'داس گِستِهاوس ایست نیشت زو تسِنترال وی داس هوتِل', 'das Gästehaus', 'مهمان‌خانه', 'nicht so … wie = نه به‌اندازهٔ …', [{ word: 'zentral', meaning: 'مرکزی' }, { word: 'das Hotel', meaning: 'هتل' }, { word: 'wie', meaning: 'مثل؛ به‌اندازهٔ' }]),
    sentence('de-v2-a2-compare-s3', 'Von allen Wegen ist diese Strecke am kürzesten.', 'این مسیر از همهٔ راه‌ها کوتاه‌تر است.', 'فون آلِن وِگِن ایست دیزِه شترِکِه اَم کورتستِن', 'die Strecke', 'مسیر؛ فاصله', 'am + صفت + -sten = برترین.', [{ word: 'der Weg', meaning: 'راه' }, { word: 'am kürzesten', meaning: 'کوتاه‌ترین' }, { word: 'alle', meaning: 'همه' }]),
    sentence('de-v2-a2-compare-s4', 'Ich nehme lieber den Zug, weil er bequemer ist.', 'ترجیح می‌دهم قطار را انتخاب کنم، چون راحت‌تر است.', 'ایش نِمِه لیبِر دِن تسوگ، وایل اِر بِکوِمِر ایست', 'bequem', 'راحت', 'weil + فاعل + … + فعل.', [{ word: 'lieber', meaning: 'ترجیحاً' }, { word: 'bequemer', meaning: 'راحت‌تر' }, { word: 'nehmen', meaning: 'گرفتن؛ انتخاب‌کردن' }]),
    sentence('de-v2-a2-compare-s5', 'Welche Möglichkeit findest du praktischer?', 'کدام گزینه را کاربردی‌تر می‌دانی؟', 'وِلشِه موگلیش‌کایت فیندِست دو پراکتیشِر؟', 'die Möglichkeit', 'امکان؛ گزینه', undefined, [{ word: 'praktisch', meaning: 'کاربردی' }, { word: 'praktischer', meaning: 'کاربردی‌تر' }, { word: 'finden', meaning: 'دانستن؛ به‌نظررسیدن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Fahren wir mit dem Regionalzug oder mit dem ICE?', fa: 'با قطار محلی برویم یا قطار سریع‌السیر؟' },
    { speaker: 'شما', text: 'Der Regionalzug ist langsamer, aber günstiger.', fa: 'قطار محلی کندتر، اما ارزان‌تر است.' },
    { speaker: 'طرف مقابل', text: 'Welche Möglichkeit findest du praktischer?', fa: 'کدام گزینه را کاربردی‌تر می‌دانی؟' },
    { speaker: 'شما', text: 'Ich nehme lieber den Zug, weil er bequemer ist.', fa: 'ترجیح می‌دهم قطار را انتخاب کنم، چون راحت‌تر است.' },
  ]),
  lesson(2, 23, 'de-v2-a2-experience-opinion', 'تجربه و نظر با دلیل', 'نظر کوتاه را با یک دلیل روشن کنید.', 'در کلاس دربارهٔ روش‌های یادگیری حضوری و آنلاین صحبت می‌کنید و تجربهٔ خودتان را می‌گویید.', 'dass برای گزارش نظر یا فکر به‌کار می‌رود و فعل را به پایان جمله می‌برد. deshalb در جملهٔ بعد نتیجه را نشان می‌دهد.', [
    sentence('de-v2-a2-opinion-s1', 'Ich lerne lieber in einer kleinen Gruppe, weil ich dann öfter sprechen kann.', 'ترجیح می‌دهم در گروهی کوچک یاد بگیرم، چون آن‌وقت بیشتر می‌توانم صحبت کنم.', 'ایش لِرنِه لیبِر این آینِر کلاینِن گروپِه، وایل ایش دان اُفتِر شپِرِشِن کان', 'die Gruppe', 'گروه', 'weil + فاعل + … + فعل.', [{ word: 'lieber', meaning: 'ترجیحاً' }, { word: 'öfter', meaning: 'بیشتر؛ دفعات بیشتر' }, { word: 'sprechen können', meaning: 'توانستن صحبت‌کردن' }]),
    sentence('de-v2-a2-opinion-s2', 'Ich finde, dass gemeinsame Übungen sehr hilfreich sind.', 'به‌نظرم تمرین‌های مشترک بسیار مفید هستند.', 'ایش فیندِه، داس گِماینزامِه اوبونگِن زِر هیلف‌ریش زینت', 'hilfreich', 'مفید؛ کمک‌کننده', 'dass + فاعل + … + فعل.', [{ word: 'gemeinsam', meaning: 'مشترک؛ با هم' }, { word: 'die Übung', meaning: 'تمرین' }, { word: 'finden', meaning: 'به‌نظررسیدن؛ عقیده‌داشتن' }]),
    sentence('de-v2-a2-opinion-s3', 'Online-Unterricht ist praktisch, aber manchmal vermisse ich den direkten Kontakt.', 'کلاس آنلاین کاربردی است، اما گاهی دلم برای ارتباط مستقیم تنگ می‌شود.', 'آنلاین‌اونتِریشت ایست پراکتیش، آبِر مانش‌مال فِرمیسِه ایش دِن دیرِکتِن کُنتاکت', 'vermissen', 'دلتنگ چیزی یا کسی بودن', undefined, [{ word: 'der Online-Unterricht', meaning: 'آموزش آنلاین' }, { word: 'manchmal', meaning: 'گاهی' }, { word: 'der Kontakt', meaning: 'ارتباط؛ تماس' }]),
    sentence('de-v2-a2-opinion-s4', 'Wenn man regelmäßig übt, merkt man den Fortschritt schneller.', 'اگر آدم مرتب تمرین کند، پیشرفت را زودتر متوجه می‌شود.', 'وِن مان رِگل‌مِسیش اوبت، مِرکت مان دِن فورت‌شریت شنِلِر', 'der Fortschritt', 'پیشرفت', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'regelmäßig üben', meaning: 'مرتب تمرین‌کردن' }, { word: 'merken', meaning: 'متوجه‌شدن' }, { word: 'schneller', meaning: 'سریع‌تر' }]),
    sentence('de-v2-a2-opinion-s5', 'Deshalb möchte ich auch im Urlaub ein bisschen Deutsch sprechen.', 'به همین دلیل می‌خواهم در تعطیلات هم کمی آلمانی صحبت کنم.', 'دِس‌هالب موشتِه ایش آوخ ایم اورلاوب آین بیسشِن دویچ شپِرِشِن', 'deshalb', 'به همین دلیل', undefined, [{ word: 'der Urlaub', meaning: 'تعطیلات' }, { word: 'ein bisschen', meaning: 'کمی' }, { word: 'auch', meaning: 'هم؛ نیز' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Lernst du lieber online oder in der Gruppe?', fa: 'ترجیح می‌دهی آنلاین یاد بگیری یا در گروه؟' },
    { speaker: 'شما', text: 'Ich lerne lieber in einer kleinen Gruppe, weil ich dann öfter sprechen kann.', fa: 'ترجیح می‌دهم در گروه کوچکی یاد بگیرم، چون آن‌وقت بیشتر صحبت می‌کنم.' },
    { speaker: 'طرف مقابل', text: 'Was findest du an Online-Unterricht praktisch?', fa: 'چه چیزی را در آموزش آنلاین کاربردی می‌دانی؟' },
    { speaker: 'شما', text: 'Ich kann zu Hause lernen. Deshalb mache ich beides.', fa: 'می‌توانم در خانه یاد بگیرم. برای همین هر دو روش را انجام می‌دهم.' },
  ]),
  lesson(2, 24, 'de-v2-a2-city-visit', 'بازدید از شهر و محیط اطراف', 'نشانی مکان‌های دیدنی را بپرسید و راه را توضیح دهید.', 'به شهری تازه می‌روید و از رهگذری دربارهٔ بازار، کتابخانه و راه پیاده سؤال می‌کنید.', 'برای ساختن جملهٔ موصولی از der یا auf dem استفاده کنید؛ فعل در پایان می‌آید. zu Fuß یعنی پیاده.', [
    sentence('de-v2-a2-city-s1', 'In unserer Nähe gibt es einen Markt, auf dem man frischen Fisch kaufen kann.', 'نزدیک ما بازاری هست که می‌شود از آن ماهی تازه خرید.', 'این اونزِرِر نِه‌ه گیبت اِس آینِن مارکت، آوف دِم مان فریشِن فیش کاوفِن کان', 'der Markt', 'بازار', 'جملهٔ موصولی با auf dem؛ فعل در پایان.', [{ word: 'die Nähe', meaning: 'نزدیکی' }, { word: 'frischer Fisch', meaning: 'ماهی تازه' }, { word: 'kaufen können', meaning: 'توانستن خرید' }]),
    sentence('de-v2-a2-city-s2', 'Die Altstadt erreicht man zu Fuß in zwanzig Minuten.', 'با بیست دقیقه پیاده‌روی به بخش قدیمی شهر می‌رسید.', 'دی آلت‌شتات اِر‌رایشْت مان تسو فوس این تسوانتسیش مینوتِن', 'zu Fuß', 'پیاده', undefined, [{ word: 'erreichen', meaning: 'رسیدن به؛ دست‌یافتن' }, { word: 'die Altstadt', meaning: 'بخش قدیمی شهر' }, { word: 'zwanzig Minuten', meaning: 'بیست دقیقه' }]),
    sentence('de-v2-a2-city-s3', 'An der nächsten Kreuzung müssen Sie rechts abbiegen.', 'در تقاطع بعدی باید به راست بپیچید.', 'اَن دِر نِکستِن کرویتسونگ موسِن زی رِشتس آب‌بیگِن', 'abbiegen', 'پیچیدن', 'müssen + مصدر در پایان.', [{ word: 'die Kreuzung', meaning: 'تقاطع' }, { word: 'rechts', meaning: 'سمت راست' }, { word: 'nächste', meaning: 'بعدی' }]),
    sentence('de-v2-a2-city-s4', 'Wenn du am Rathaus vorbeigehst, siehst du die Bücherei.', 'اگر از کنار شهرداری رد شوی، کتابخانه را می‌بینی.', 'وِن دو اَم رات‌هاوس فوربای‌گِیست، زیست دو دی بوخِرای', 'vorbeigehen', 'از کنار چیزی ردشدن', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'das Rathaus', meaning: 'شهرداری' }, { word: 'die Bücherei', meaning: 'کتابخانه' }, { word: 'sehen', meaning: 'دیدن' }]),
    sentence('de-v2-a2-city-s5', 'Am Samstag ist der Markt besonders voll.', 'شنبه بازار به‌ویژه شلوغ است.', 'اَم زامستاگ ایست دِر مارکت بِزوندرس فول', 'voll', 'پُر؛ شلوغ', undefined, [{ word: 'am Samstag', meaning: 'روز شنبه' }, { word: 'besonders', meaning: 'به‌ویژه' }, { word: 'der Markt', meaning: 'بازار' }]),
  ], [
    { speaker: 'شما', text: 'Entschuldigung, wie komme ich zur Altstadt?', fa: 'ببخشید، چطور به بخش قدیمی شهر بروم؟' },
    { speaker: 'رهگذر', text: 'Gehen Sie geradeaus. An der nächsten Kreuzung biegen Sie rechts ab.', fa: 'مستقیم بروید. در تقاطع بعدی به راست بپیچید.' },
    { speaker: 'شما', text: 'Kann ich zu Fuß gehen?', fa: 'می‌توانم پیاده بروم؟' },
    { speaker: 'رهگذر', text: 'Ja, in zwanzig Minuten sind Sie dort.', fa: 'بله، بیست دقیقه‌ای آنجا هستید.' },
  ]),
  lesson(2, 25, 'de-v2-a2-integrated-conversation', 'گفت‌وگوی ترکیبی A2', 'تجربه، برنامه و دلیل را در یک مکالمه کنار هم بگذارید.', 'با دوستی دربارهٔ دورهٔ زبان، تجربهٔ سفر و برنامه‌ای که برای آخر هفته دارید صحبت می‌کنید.', 'این درس جمع‌بندی تمرینی و بدون نمره است، نه آزمون یا مدرک. از واژه‌های زمانی، Perfekt، جملهٔ وابسته و درخواست مؤدبانه در یک گفت‌وگوی تازه استفاده کنید.', [
    sentence('de-v2-a2-capstone-s1', 'Letztes Jahr habe ich einen Deutschkurs begonnen, weil ich sicherer sprechen wollte.', 'سال گذشته یک دورهٔ آلمانی را شروع کردم، چون می‌خواستم با اطمینان بیشتری صحبت کنم.', 'لِتستِس یار هابِه ایش آینِن دویچ‌کورس بِگونِن، وایل ایش زیخِرِر شپِرِشِن وُلتِه', 'der Deutschkurs', 'دورهٔ آلمانی', 'Perfekt برای تجربهٔ گذشته؛ weil + فعل در پایان.', [{ word: 'letztes Jahr', meaning: 'سال گذشته' }, { word: 'beginnen', meaning: 'شروع‌کردن' }, { word: 'sicherer sprechen', meaning: 'با اطمینان بیشتری صحبت‌کردن' }]),
    sentence('de-v2-a2-capstone-s2', 'Inzwischen kann ich meine Termine selbst vereinbaren.', 'حالا می‌توانم قرارهایم را خودم هماهنگ کنم.', 'این‌تسویشِن کان ایش ماینِه تِرمینِه زِلبست فِرآینبارِن', 'inzwischen', 'در این فاصله؛ حالا دیگر', undefined, [{ word: 'selbst', meaning: 'خود؛ شخصاً' }, { word: 'einen Termin vereinbaren', meaning: 'وقت ملاقات تعیین‌کردن' }, { word: 'können', meaning: 'توانستن' }]),
    sentence('de-v2-a2-capstone-s3', 'Im Sommer möchte ich mit Freunden nach Hamburg reisen.', 'تابستان می‌خواهم با دوستانم به هامبورگ سفر کنم.', 'ایم زومِر موشتِه ایش میت فرویندِن ناخ هامبورگ رایزِن', 'reisen', 'سفرکردن', undefined, [{ word: 'im Sommer', meaning: 'در تابستان' }, { word: 'mit Freunden', meaning: 'با دوستان' }, { word: 'nach Hamburg', meaning: 'به هامبورگ' }]),
    sentence('de-v2-a2-capstone-s4', 'Wenn wir Zeit haben, besuchen wir die Altstadt und gehen am Abend ins Konzert.', 'اگر وقت داشته باشیم، از بخش قدیمی شهر دیدن می‌کنیم و عصر به کنسرت می‌رویم.', 'وِن ویر تسایت هابِن، بِزوخِن ویر دی آلت‌شتات اونت گِهِن اَم آبِنت اینس کُنتسِرت', 'die Altstadt besuchen', 'از بخش قدیمی شهر دیدن‌کردن', 'Wenn …, فعل جملهٔ وابسته در پایان می‌آید.', [{ word: 'Zeit haben', meaning: 'وقت‌داشتن' }, { word: 'am Abend', meaning: 'عصر؛ شب' }, { word: 'ins Konzert gehen', meaning: 'به کنسرت رفتن' }]),
    sentence('de-v2-a2-capstone-s5', 'Nach der Reise schreibe ich meiner Lehrerin eine kurze Nachricht.', 'بعد از سفر برای معلمم پیام کوتاهی می‌نویسم.', 'ناخ دِر رایزِه شرایبِه ایش ماینِر لِرِرین آینِه کورتسِه ناخ‌ریشت', 'die Nachricht', 'پیام', undefined, [{ word: 'nach der Reise', meaning: 'بعد از سفر' }, { word: 'die Lehrerin', meaning: 'معلم زن' }, { word: 'kurz', meaning: 'کوتاه' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Was hast du letztes Jahr gemacht?', fa: 'سال گذشته چه‌کار کردی؟' },
    { speaker: 'شما', text: 'Ich habe einen Deutschkurs begonnen und viel geübt.', fa: 'یک دورهٔ آلمانی شروع کردم و زیاد تمرین کردم.' },
    { speaker: 'طرف مقابل', text: 'Was möchtest du im Sommer machen?', fa: 'تابستان دوست داری چه‌کار کنی؟' },
    { speaker: 'شما', text: 'Ich möchte nach Hamburg reisen. Wenn wir Zeit haben, besuchen wir die Altstadt.', fa: 'می‌خواهم به هامبورگ سفر کنم. اگر وقت داشته باشیم، از بخش قدیمی شهر دیدن می‌کنیم.' },
    { speaker: 'طرف مقابل', text: 'Das klingt nach einem guten Plan!', fa: 'برنامهٔ خوبی به‌نظر می‌رسد!' },
  ]),

  // B1 · Communication
  lesson(3, 1, 'de-v2-opinions-reasons', 'نظر و دلیل', 'موافقت یا مخالفت را توضیح دهید.', 'در گفت‌وگویی درباره کار گروهی، نظر خود را می‌گویید و برای آن دلیل می‌آورید.', 'در جمله فرعی با weil و dass، فعل صرف‌شده به پایان می‌رود. einerseits … andererseits دو جنبه متفاوت را کنار هم می‌آورد.', [
    sentence('de-v2-opinion-s1', 'Meiner Meinung nach sollte die Stadt mehr Radwege bauen.', 'به نظر من، شهر باید مسیرهای دوچرخه بیشتری بسازد.', 'ماینِر ماینونگ ناخ زولتِه دی شتات مِر رات‌وِگِه باوِن', 'die Meinung', 'نظر؛ عقیده', 'Meiner Meinung nach …'),
    sentence('de-v2-opinion-s2', 'Ich bin dafür, weil es die Luft sauberer macht.', 'من موافقم، چون هوا را پاک‌تر می‌کند.', 'ایش بین دافور، وایل اِس دی لوفت زاوبرِر ماخت', 'dafür sein', 'موافق بودن'),
    sentence('de-v2-opinion-s3', 'Einerseits spart der Bus Zeit, andererseits ist er oft voll.', 'از یک طرف اتوبوس وقت را ذخیره می‌کند، از طرف دیگر اغلب شلوغ است.', 'آینِر‌زایتس شپارت دِر بوس تسایت، آندِرِرزایتس ایست اِر اُفت فول', 'einerseits … andererseits', 'از یک طرف … از طرف دیگر'),
    sentence('de-v2-opinion-s4', 'Ich sehe das anders, denn nicht alle wohnen im Zentrum.', 'من موضوع را طور دیگری می‌بینم، چون همه در مرکز شهر زندگی نمی‌کنند.', 'ایش زِه داس آندِرس، دِن نیشت آلِه وونِن ایم تسِنتروم', 'anders', 'متفاوت؛ طور دیگر'),
    sentence('de-v2-opinion-s5', 'Wir könnten einen Kompromiss finden.', 'می‌توانیم یک راه‌حل میانه پیدا کنیم.', 'ویر کونتِن آینِن کومپرومیس فیندِن', 'der Kompromiss', 'راه‌حل میانه؛ مصالحه'),
  ], [
    { speaker: 'طرف مقابل', text: 'Sollten wir mehr Radwege bauen?', fa: 'آیا باید مسیرهای دوچرخه بیشتری بسازیم؟' },
    { speaker: 'شما', text: 'Meiner Meinung nach ja, weil es die Luft sauberer macht.', fa: 'به نظر من بله، چون هوا را پاک‌تر می‌کند.' },
    { speaker: 'طرف مقابل', text: 'Das kostet aber viel Geld.', fa: 'اما این کار هزینه زیادی دارد.' },
    { speaker: 'شما', text: 'Wir könnten klein anfangen und einen Kompromiss finden.', fa: 'می‌توانیم کوچک شروع کنیم و راه‌حل میانه‌ای پیدا کنیم.' },
  ]),
  lesson(3, 2, 'de-v2-work-experience', 'کار و تجربه', 'درباره مسئولیت و تجربه حرف بزنید.', 'در یک گفت‌وگوی کاری درباره تجربه قبلی، مسئولیت‌ها و قدم بعدی صحبت می‌کنید.', 'برای شرح وظایف از Zu meinen Aufgaben gehörte … استفاده کنید. obwohl جمله فرعی می‌سازد و فعل را به پایان می‌برد.', [
    sentence('de-v2-work-s1', 'Ich habe in einem kleinen Team gearbeitet.', 'در یک تیم کوچک کار کرده‌ام.', 'ایش هابِه این آینِم کلاینِن تیم گِآربایتِت', 'das Team', 'تیم'),
    sentence('de-v2-work-s2', 'Zu meinen Aufgaben gehörte die Kundenberatung.', 'مشاوره به مشتریان از مسئولیت‌های من بود.', 'تسو ماینِن آوفگابِن گِهورتِه دی کونْدِن‌بِراتونگ', 'die Aufgabe', 'وظیفه؛ مسئولیت'),
    sentence('de-v2-work-s3', 'Obwohl der Termin knapp war, haben wir das Projekt abgeschlossen.', 'با اینکه مهلت کم بود، پروژه را تمام کردیم.', 'اوب‌وُل دِر تِرمین کنَپ وار، هابِن ویر داس پرویِکت آبگِشْلوسِن', 'abschließen', 'به پایان رساندن'),
    sentence('de-v2-work-s4', 'Ich würde gern mehr Verantwortung übernehmen.', 'دوست دارم مسئولیت بیشتری بپذیرم.', 'ایش ووردِه گِرن مِر فِرآنت‌وُرتونگ اوبِرنِمِن', 'die Verantwortung', 'مسئولیت'),
    sentence('de-v2-work-s5', 'Was erwarten Sie von der neuen Mitarbeiterin?', 'از کارمند جدید چه انتظاری دارید؟', 'واس اِروارتِن زی فون دِر نویِن میت‌آربایتِرین؟', 'erwarten', 'انتظار داشتن'),
  ], [
    { speaker: 'مصاحبه‌گر', text: 'Welche Erfahrung haben Sie?', fa: 'چه تجربه‌ای دارید؟' },
    { speaker: 'شما', text: 'Ich habe in einem kleinen Team gearbeitet. Zu meinen Aufgaben gehörte die Kundenberatung.', fa: 'در یک تیم کوچک کار کرده‌ام. مشاوره به مشتریان از مسئولیت‌های من بود.' },
    { speaker: 'مصاحبه‌گر', text: 'Was möchten Sie als Nächstes lernen?', fa: 'دوست دارید در قدم بعدی چه چیزی یاد بگیرید؟' },
    { speaker: 'شما', text: 'Ich würde gern mehr Verantwortung übernehmen.', fa: 'دوست دارم مسئولیت بیشتری بپذیرم.' },
  ]),
  lesson(3, 3, 'de-v2-complaint-solution', 'مشکل و راه‌حل', 'درخواست جبران را مؤدبانه بیان کنید.', 'محصولی که تحویل گرفته‌اید با سفارش تفاوت دارد و می‌خواهید راه‌حل مناسبی پیدا کنید.', 'obwohl برای بیان تضاد است و فعل را به پایان جمله فرعی می‌برد. Falls …, یک شرط را مطرح می‌کند.', [
    sentence('de-v2-complaint-s1', 'Ich habe gestern das falsche Produkt erhalten.', 'دیروز محصول اشتباهی دریافت کردم.', 'ایش هابِه گِسترن داس فالشه پرودوکت اِرهالتِن', 'erhalten', 'دریافت کردن'),
    sentence('de-v2-complaint-s2', 'Obwohl ich sofort angerufen habe, konnte mir niemand helfen.', 'با اینکه فوراً تماس گرفتم، هیچ‌کس نتوانست کمکم کند.', 'اوب‌وُل ایش زوفورت آن‌گِروفِن هابِه، کونتِه میر نیمانت هِلفِن', 'sofort', 'فوراً؛ بلافاصله'),
    sentence('de-v2-complaint-s3', 'Könnten Sie mir bitte eine Ersatzlieferung schicken?', 'ممکن است لطفاً کالای جایگزین برایم بفرستید؟', 'کونتِن زی میر بیتِه آینِه اِراتس‌لیفِرونگ شیکِن؟', 'die Ersatzlieferung', 'ارسال کالای جایگزین'),
    sentence('de-v2-complaint-s4', 'Falls das nicht möglich ist, möchte ich mein Geld zurück.', 'اگر این ممکن نیست، می‌خواهم پولم را پس بگیرم.', 'فالس داس نیشت موگلیش ایست، موشتِه ایش ماین گِلت تسوروک', 'zurück', 'پس؛ بازگشت'),
    sentence('de-v2-complaint-s5', 'Ich hoffe, dass wir eine Lösung finden.', 'امیدوارم راه‌حلی پیدا کنیم.', 'ایش هوفِه، داس ویر آینِه لوزونگ فیندِن', 'die Lösung', 'راه‌حل', 'Ich hoffe, dass … فعل در پایان می‌آید.'),
  ], [
    { speaker: 'خدمات مشتری', text: 'Guten Tag. Wie kann ich Ihnen helfen?', fa: 'روز بخیر. چطور می‌توانم کمکتان کنم؟' },
    { speaker: 'شما', text: 'Ich habe gestern das falsche Produkt erhalten. Könnten Sie mir eine Ersatzlieferung schicken?', fa: 'دیروز محصول اشتباهی دریافت کردم. ممکن است کالای جایگزین برایم بفرستید؟' },
    { speaker: 'خدمات مشتری', text: 'Ja, wir prüfen das sofort.', fa: 'بله، فوراً آن را بررسی می‌کنیم.' },
  ]),
  lesson(3, 4, 'de-v2-news-and-change', 'خبر و تغییر', 'درباره یک تغییر توضیح دهید.', 'در جمع دوستانه درباره یک برنامه تازه در شهر صحبت می‌کنید و اثر آن را توضیح می‌دهید.', 'برای روایت یک رویداد تمام‌شده از Perfekt استفاده کنید. inzwischen معنی «در این فاصله / حالا دیگر» می‌دهد.', [
    sentence('de-v2-news-s1', 'Letzte Woche habe ich an einer Veranstaltung teilgenommen.', 'هفته گذشته در یک رویداد شرکت کردم.', 'لِتستِه وُخِه هابِه ایش اَن آینِر فِرآنشتالتونگ تایل‌گِنومِن', 'teilnehmen an', 'شرکت کردن در'),
    sentence('de-v2-news-s2', 'Dort habe ich Menschen aus verschiedenen Bereichen kennengelernt.', 'آنجا با آدم‌هایی از حوزه‌های مختلف آشنا شدم.', 'دُرت هابِه ایش مِنشِن آوس فِرشیدِنِن بِرایشِن کِنِن‌گِلِرنت', 'kennenlernen', 'آشنا شدن'),
    sentence('de-v2-news-s3', 'Besonders interessant fand ich, wie die Stadt den Verkehr verbessert.', 'برایم به‌ویژه جالب بود که شهر چطور رفت‌وآمد را بهتر می‌کند.', 'بِزونْدِرس اینتِرِسانت فانت ایش، وی دی شتات دِن فِرکِر فِربِسِرت', 'der Verkehr', 'رفت‌وآمد؛ ترافیک'),
    sentence('de-v2-news-s4', 'Viele Bewohner nutzen inzwischen das neue Angebot.', 'بسیاری از ساکنان حالا از خدمات تازه استفاده می‌کنند.', 'فیلِه بِوونِر نوتسِن این‌تسویشِن داس نویِه آن‌گِبوت', 'der Bewohner', 'ساکن'),
    sentence('de-v2-news-s5', 'Die Veränderungen werden in den nächsten Monaten sichtbar.', 'تغییرات در ماه‌های آینده قابل مشاهده خواهند شد.', 'دی فِر‌اِندِرونگِن وِردِن این دِن نِکستِن موناتِن زیخت‌بار', 'die Veränderung', 'تغییر'),
  ], [
    { speaker: 'طرف مقابل', text: 'Hast du von dem neuen Angebot der Stadt gehört?', fa: 'درباره خدمات تازه شهر چیزی شنیده‌ای؟' },
    { speaker: 'شما', text: 'Ja. Letzte Woche habe ich an einer Veranstaltung teilgenommen.', fa: 'بله. هفته گذشته در یک رویداد شرکت کردم.' },
    { speaker: 'طرف مقابل', text: 'Was fandest du besonders interessant?', fa: 'چه چیزی برایت به‌ویژه جالب بود؟' },
    { speaker: 'شما', text: 'Wie die Stadt den Verkehr verbessert.', fa: 'اینکه شهر چطور رفت‌وآمد را بهتر می‌کند.' },
  ]),
  lesson(3, 5, 'de-v2-learning-future', 'یادگیری و آینده', 'هدف آینده را به تجربه امروز وصل کنید.', 'درباره راه یادگیری زبان، پیشرفت و هدفی که برای آینده دارید صحبت می‌کنید.', 'damit هدف را معرفی می‌کند و فعل در جمله فرعی به پایان می‌رود. obwohl نیز تضاد را نشان می‌دهد و همین ترتیب را دارد.', [
    sentence('de-v2-future-s1', 'Seit einem Jahr lerne ich Deutsch, damit ich sicherer kommunizieren kann.', 'یک سال است آلمانی یاد می‌گیرم تا بتوانم با اطمینان بیشتری ارتباط برقرار کنم.', 'زایت آینِم یار لِرنِه ایش دویچ، دامیت ایش زیخِرِر کومونیتسیرِن کان', 'kommunizieren', 'ارتباط برقرار کردن', 'damit + فاعل + … + فعل.'),
    sentence('de-v2-future-s2', 'Wenn ich regelmäßig übe, mache ich schnellere Fortschritte.', 'اگر مرتب تمرین کنم، سریع‌تر پیشرفت می‌کنم.', 'وِن ایش رِگل‌مِسیش اوبِه، ماخِه ایش شنِلِرِه فورت‌شریتِه', 'regelmäßig', 'به‌طور منظم'),
    sentence('de-v2-future-s3', 'Mein nächstes Ziel ist, eine Präsentation auf Deutsch zu halten.', 'هدف بعدی من ارائه دادن به زبان آلمانی است.', 'ماین نِکستِس تسِیل ایست، آینِه پرِزِنتاتسیون آوف دویچ تسو هالتِن', 'das Ziel', 'هدف'),
    sentence('de-v2-future-s4', 'Obwohl ich noch Fehler mache, spreche ich häufiger.', 'با اینکه هنوز اشتباه می‌کنم، بیشتر صحبت می‌کنم.', 'اوب‌وُل ایش نوخ فیلِر ماخِه، شپِرِشِه ایش هویفیگِر', 'der Fehler', 'اشتباه'),
    sentence('de-v2-future-s5', 'In Zukunft möchte ich an einem internationalen Projekt teilnehmen.', 'در آینده می‌خواهم در یک پروژه بین‌المللی شرکت کنم.', 'این تسوکونفت موشتِه ایش اَن آینِم اینتِرناتسیونالِن پرویِکت تایل‌نِمِن', 'in Zukunft', 'در آینده'),
  ], [
    { speaker: 'طرف مقابل', text: 'Was ist dein nächstes Ziel?', fa: 'هدف بعدی‌ات چیست؟' },
    { speaker: 'شما', text: 'Ich möchte eine Präsentation auf Deutsch halten.', fa: 'می‌خواهم به زبان آلمانی ارائه بدهم.' },
    { speaker: 'طرف مقابل', text: 'Und wie bereitest du dich darauf vor?', fa: 'و چطور برای آن آماده می‌شوی؟' },
    { speaker: 'شما', text: 'Ich übe regelmäßig, damit ich sicherer kommunizieren kann.', fa: 'مرتب تمرین می‌کنم تا بتوانم با اطمینان بیشتری ارتباط برقرار کنم.' },
  ]),
  lesson(3, 6, 'de-v2-b1-team-meetings', 'جلسه، مشارکت و جمع‌بندی', 'نظر بدهید و به تصمیم گروهی برسید.', 'در جلسه‌ای کاری پیشنهاد می‌دهید، نگرانی همکارتان را می‌شنوید و برای قدم بعد به توافق می‌رسید.', 'در این مثال، während با اسم در حالت Genitiv آمده است. weil جملهٔ وابسته می‌سازد و فعل را به پایان می‌برد؛ در مجهول، تمرکز بر خود تصمیم یا فرایند است: Die Entscheidung wurde verschoben.', [
    sentence('de-v2-b1-meeting-s1', 'Während der Besprechung habe ich einen anderen Vorschlag gemacht.', 'در جریان جلسه پیشنهاد دیگری مطرح کردم.', 'وِرِنت دِر بِشپرِشونگ هابِه ایش آینِن آندِرِن فورشلاگ گِماخت', 'der Vorschlag', 'پیشنهاد', 'während + اسم در حالت Genitiv.', [{ word: 'die Besprechung', meaning: 'جلسهٔ کاری' }, { word: 'während', meaning: 'درحینِ؛ درحالی‌که' }, { word: 'einen Vorschlag machen', meaning: 'پیشنهادی مطرح‌کردن' }]),
    sentence('de-v2-b1-meeting-s2', 'Ich verstehe deinen Punkt, trotzdem sehe ich ein Risiko.', 'نکته‌ات را می‌فهمم، بااین‌حال خطری می‌بینم.', 'ایش فِرشتِه داینِن پونکت، تروتس‌دِم زِه‌ه ایش آین ریسکُ', 'das Risiko', 'خطر؛ ریسک', undefined, [{ word: 'einen Punkt verstehen', meaning: 'منظور یا نکته‌ای را فهمیدن' }, { word: 'trotzdem', meaning: 'بااین‌حال' }, { word: 'sehen', meaning: 'دیدن؛ متوجه‌شدن' }]),
    sentence('de-v2-b1-meeting-s3', 'Könnten wir zuerst die Kosten prüfen und danach entscheiden?', 'می‌توانیم اول هزینه‌ها را بررسی کنیم و بعد تصمیم بگیریم؟', 'کونتِن ویر تسوئِرست دی کُستِن پروفِن اونت داناخ اِنت‌شایدِن؟', 'entscheiden', 'تصمیم‌گرفتن', 'Könnten wir …? پیشنهاد مؤدبانه.', [{ word: 'die Kosten', meaning: 'هزینه‌ها' }, { word: 'zuerst', meaning: 'ابتدا؛ اول' }, { word: 'prüfen', meaning: 'بررسی‌کردن' }]),
    sentence('de-v2-b1-meeting-s4', 'Die Entscheidung wurde verschoben, weil noch Informationen fehlen.', 'تصمیم به تعویق افتاد، چون هنوز اطلاعاتی کم است.', 'دی اِنت‌شایدونگ ووردِه فِرشیبِن، وایل نوخ اینفورماتسیونِن فیلِن', 'verschieben', 'به تعویق انداختن؛ جابه‌جا کردن', 'مجهول گذشته: wurde + Partizip II.', [{ word: 'die Entscheidung', meaning: 'تصمیم' }, { word: 'die Information', meaning: 'اطلاعات' }, { word: 'fehlen', meaning: 'کم‌بودن؛ موجودنبودن' }]),
    sentence('de-v2-b1-meeting-s5', 'Am Ende haben wir uns auf einen gemeinsamen Plan geeinigt.', 'در پایان بر سر برنامه‌ای مشترک به توافق رسیدیم.', 'اَم اِندِه هابِن ویر اونس آوف آینِن گِماینزامِن پلان گِآینیشت', 'sich einigen auf', 'بر سر چیزی به توافق رسیدن', undefined, [{ word: 'am Ende', meaning: 'در پایان' }, { word: 'gemeinsam', meaning: 'مشترک؛ باهم' }, { word: 'der Plan', meaning: 'برنامه' }]),
  ], [
    { speaker: 'همکار', text: 'Sollen wir den Vorschlag sofort annehmen?', fa: 'پیشنهاد را همین حالا بپذیریم؟' },
    { speaker: 'شما', text: 'Ich verstehe den Punkt, trotzdem sehe ich ein Risiko.', fa: 'نکته را می‌فهمم، بااین‌حال خطری می‌بینم.' },
    { speaker: 'همکار', text: 'Was sollten wir zuerst prüfen?', fa: 'اول چه چیزی را باید بررسی کنیم؟' },
    { speaker: 'شما', text: 'Die Kosten. Danach können wir gemeinsam entscheiden.', fa: 'هزینه‌ها را. بعد می‌توانیم باهم تصمیم بگیریم.' },
  ]),
  lesson(3, 7, 'de-v2-b1-career-interview', 'مصاحبه و مسیر شغلی', 'تجربه و توانایی خود را روشن بیان کنید.', 'در گفت‌وگویی شغلی دربارهٔ تجربه، نقطه‌قوت و هدفی که برای کار آینده دارید صحبت می‌کنید.', 'در جملهٔ موصولی فعل به پایان می‌رود. برای بیان هدف می‌توان از um … zu استفاده کرد؛ Konjunktiv II درخواست یا خواسته را مؤدبانه‌تر می‌کند.', [
    sentence('de-v2-b1-career-s1', 'Für die Stelle, auf die ich mich beworben habe, brauche ich Berufserfahrung.', 'برای موقعیتی که درخواستش را داده‌ام، به تجربهٔ کاری نیاز دارم.', 'فور دی شتِلِه، آوف دی ایش میش بِوُربِن هابِه، براوخِه ایش بِروف‌اِرفارونگ', 'die Berufserfahrung', 'تجربهٔ کاری', 'جملهٔ موصولی با فعل در پایان.', [{ word: 'die Stelle', meaning: 'موقعیت شغلی' }, { word: 'sich bewerben auf', meaning: 'برای چیزی درخواست‌دادن' }, { word: 'brauchen', meaning: 'نیازداشتن' }]),
    sentence('de-v2-b1-career-s2', 'Obwohl ich im Vorstellungsgespräch nervös war, konnte ich ruhig antworten.', 'با اینکه در مصاحبهٔ شغلی مضطرب بودم، توانستم آرام پاسخ بدهم.', 'اوب‌وُل ایش ایم فورشتِلونگس‌گِشپرِش نِرووس وار، کونتِه ایش روویش آنت‌وُرتِن', 'das Vorstellungsgespräch', 'مصاحبهٔ شغلی', 'obwohl + فعل در پایان جملهٔ وابسته.', [{ word: 'nervös', meaning: 'مضطرب' }, { word: 'ruhig', meaning: 'آرام' }, { word: 'antworten', meaning: 'پاسخ‌دادن' }]),
    sentence('de-v2-b1-career-s3', 'Die Personalchefin hat mich nach meinen Stärken gefragt.', 'مدیر منابع انسانی دربارهٔ نقاط قوتم از من پرسید.', 'دی پِرسونال‌شِفین هات میش ناخ ماینِن شتِرکِن گِفراگت', 'die Stärke', 'نقطهٔ قوت؛ توانمندی', undefined, [{ word: 'die Personalchefin', meaning: 'مدیر زن منابع انسانی' }, { word: 'nach etwas fragen', meaning: 'دربارهٔ چیزی پرسیدن' }, { word: 'fragen', meaning: 'پرسیدن' }]),
    sentence('de-v2-b1-career-s4', 'Ich würde gern mehr Verantwortung übernehmen, um mich weiterzuentwickeln.', 'دوست دارم مسئولیت بیشتری بپذیرم تا پیشرفت کنم.', 'ایش ووردِه گِرن مِر فِرآنت‌وُرتونگ اوبِرنِمِن، اوم میش وایتِر‌تسو‌اِنت‌ویکلِن', 'sich weiterentwickeln', 'رشدکردن؛ پیشرفت‌کردن', 'um … zu برای بیان هدف.', [{ word: 'Verantwortung übernehmen', meaning: 'مسئولیت پذیرفتن' }, { word: 'würde gern', meaning: 'دوست دارم؛ مایلم' }, { word: 'um … zu', meaning: 'برای اینکه؛ به‌منظورِ' }]),
    sentence('de-v2-b1-career-s5', 'Wenn die Firma mich einlädt, bereite ich konkrete Beispiele vor.', 'اگر شرکت دعوتم کند، نمونه‌های مشخصی آماده می‌کنم.', 'وِن دی فیِرما میش آین‌لِدت، بِرایتِه ایش کُنکرِتِه بای‌شپیلِه فور', 'vorbereiten', 'آماده‌کردن', 'Wenn …, فعل جملهٔ وابسته در پایان.', [{ word: 'die Firma', meaning: 'شرکت' }, { word: 'einladen', meaning: 'دعوت‌کردن' }, { word: 'konkret', meaning: 'مشخص؛ عینی' }]),
  ], [
    { speaker: 'مصاحبه‌گر', text: 'Welche Stärken bringen Sie mit?', fa: 'چه توانمندی‌هایی دارید؟' },
    { speaker: 'شما', text: 'Ich arbeite gern im Team und kann Probleme ruhig lösen.', fa: 'با علاقه در گروه کار می‌کنم و می‌توانم مسائل را آرام حل کنم.' },
    { speaker: 'مصاحبه‌گر', text: 'Warum haben Sie sich auf diese Stelle beworben?', fa: 'چرا برای این موقعیت درخواست دادید؟' },
    { speaker: 'شما', text: 'Ich möchte mehr Verantwortung übernehmen und mich weiterentwickeln.', fa: 'می‌خواهم مسئولیت بیشتری بپذیرم و پیشرفت کنم.' },
  ]),
  lesson(3, 8, 'de-v2-b1-budget-decisions', 'بودجه و تصمیم‌های مالی روزمره', 'هزینه‌ها را مقایسه و انتخاب را توجیه کنید.', 'برای خرید یک وسیله یا خدمات، چند پیشنهاد را با هم مقایسه می‌کنید و دربارهٔ بودجه‌تان تصمیم می‌گیرید.', 'damit هدف را بیان می‌کند. در مقایسه از als استفاده کنید؛ falls شرط را مشخص می‌کند و فعل جملهٔ وابسته را به پایان می‌برد.', [
    sentence('de-v2-b1-budget-s1', 'Damit ich mehr sparen kann, vergleiche ich vor dem Kauf verschiedene Angebote.', 'برای اینکه بیشتر پس‌انداز کنم، پیش از خرید پیشنهادهای گوناگون را مقایسه می‌کنم.', 'دامیت ایش مِر شپارِن کان، فِرگلایشِه ایش فور دِم کاوف فِرشیدِنِه آن‌گِبوتِه', 'das Angebot', 'پیشنهاد؛ آفر', 'damit + جملهٔ وابسته.', [{ word: 'sparen', meaning: 'پس‌اندازکردن' }, { word: 'vor dem Kauf', meaning: 'پیش از خرید' }, { word: 'vergleichen', meaning: 'مقایسه‌کردن' }]),
    sentence('de-v2-b1-budget-s2', 'Die Reparatur ist teurer geworden, als wir erwartet hatten.', 'تعمیر گران‌تر از چیزی شد که انتظار داشتیم.', 'دی رِپاراتور ایست تویِرِر گِوُردِن، آلس ویر اِروارتِت هاتِن', 'die Reparatur', 'تعمیر؛ تعمیرات', 'مقایسه با als؛ انتظارِ پیشین در گذشته.', [{ word: 'teurer werden', meaning: 'گران‌ترشدن' }, { word: 'erwarten', meaning: 'انتظارداشتن' }, { word: 'die Kosten', meaning: 'هزینه‌ها' }]),
    sentence('de-v2-b1-budget-s3', 'Wenn wir die laufenden Kosten teilen, bleibt jeder unabhängig.', 'اگر هزینه‌های جاری را تقسیم کنیم، هرکس استقلالش را حفظ می‌کند.', 'وِن ویر دی لاوفِندِن کُستِن تایلِن، بلایبت یدِر اون‌آبهِنگیش', 'die laufenden Kosten', 'هزینه‌های جاری', 'Wenn …, فعل جملهٔ وابسته در پایان.', [{ word: 'teilen', meaning: 'تقسیم‌کردن' }, { word: 'unabhängig', meaning: 'مستقل' }, { word: 'jeder', meaning: 'هرکس' }]),
    sentence('de-v2-b1-budget-s4', 'Der Vertrag lohnt sich nur, falls keine zusätzlichen Gebühren dazukommen.', 'این قرارداد فقط درصورتی به‌صرفه است که هزینهٔ اضافی دیگری نداشته باشد.', 'دِر فِرتراگ لونت زیش نور، فالس کاینِه تسوزِتسلیشِن گِبورِن داتسو‌کومِن', 'sich lohnen', 'به‌صرفه یا ارزشمندبودن', 'falls + جملهٔ وابسته.', [{ word: 'der Vertrag', meaning: 'قرارداد' }, { word: 'zusätzlich', meaning: 'اضافی' }, { word: 'die Gebühr', meaning: 'کارمزد؛ هزینه' }]),
    sentence('de-v2-b1-budget-s5', 'Ich würde den Kauf verschieben, bis ich genug Geld zurückgelegt habe.', 'خرید را عقب می‌انداختم تا پول کافی کنار گذاشته باشم.', 'ایش ووردِه دِن کاوف فِرشیبِن، بیس ایش گِنوق گِلت تسوروک‌گِلِکت هابِه', 'Geld zurücklegen', 'پول کنارگذاشتن؛ پس‌اندازکردن', 'bis + جملهٔ وابسته، فعل در پایان.', [{ word: 'der Kauf', meaning: 'خرید' }, { word: 'verschieben', meaning: 'به تعویق انداختن' }, { word: 'genug', meaning: 'به‌اندازهٔ کافی' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Sollen wir das günstigere Angebot nehmen?', fa: 'پیشنهاد ارزان‌تر را انتخاب کنیم؟' },
    { speaker: 'شما', text: 'Vielleicht. Wir sollten zuerst alle zusätzlichen Gebühren vergleichen.', fa: 'شاید. بهتر است اول همهٔ هزینه‌های اضافی را مقایسه کنیم.' },
    { speaker: 'طرف مقابل', text: 'Und wenn die Reparatur teurer wird?', fa: 'و اگر هزینهٔ تعمیر بیشتر شود؟' },
    { speaker: 'شما', text: 'Dann würde ich den Kauf verschieben.', fa: 'آن‌وقت خرید را عقب می‌انداختم.' },
  ]),
  lesson(3, 9, 'de-v2-b1-neighborhood-agreements', 'همسایه‌ها و توافق‌های روزمره', 'تفاوت‌ها را محترمانه حل‌وفصل کنید.', 'با همسایه دربارهٔ استفاده از فضای مشترک و زمان‌های استراحت صحبت می‌کنید.', 'برای پیشنهاد می‌توان از vorschlagen استفاده کرد. بعد از nachdem دربارهٔ کار پیشین حرف بزنید؛ seit با حال، وضعیتی را تا اکنون نشان می‌دهد.', [
    sentence('de-v2-b1-neighbor-s1', 'Unsere neue Nachbarin hat vorgeschlagen, den Innenhof gemeinsam zu nutzen.', 'همسایهٔ جدیدمان پیشنهاد کرده حیاط داخلی را مشترک استفاده کنیم.', 'اونزِرِه نویِه ناخبارین هات فورگِشلاگِن، دِن اینِن‌هوف گِماینزام تسو نوتسِن', 'der Innenhof', 'حیاط داخلی؛ حیاط مشترک', 'vorschlagen + مصدر با zu.', [{ word: 'vorschlagen', meaning: 'پیشنهادکردن' }, { word: 'gemeinsam nutzen', meaning: 'به‌صورت مشترک استفاده‌کردن' }, { word: 'die Nachbarin', meaning: 'همسایهٔ زن' }]),
    sentence('de-v2-b1-neighbor-s2', 'Obwohl wir unterschiedliche Gewohnheiten haben, kommen wir gut miteinander aus.', 'بااینکه عادت‌های متفاوتی داریم، با هم خوب کنار می‌آییم.', 'اوب‌وُل ویر اونتِرشیدلیشِه گِوون‌هایتِن هابِن، کومِن ویر گوت میت‌آیناندِر آوس', 'miteinander auskommen', 'با هم کنارآمدن', 'obwohl + فعل در پایان جملهٔ وابسته.', [{ word: 'unterschiedlich', meaning: 'متفاوت' }, { word: 'die Gewohnheit', meaning: 'عادت' }, { word: 'gut auskommen', meaning: 'خوب کنارآمدن' }]),
    sentence('de-v2-b1-neighbor-s3', 'Könnten wir die Ruhezeiten schriftlich vereinbaren?', 'می‌توانیم زمان‌های سکوت را مکتوب توافق کنیم؟', 'کونتِن ویر دی رووِتسایتِن شریفتلیش فِرآینبارِن؟', 'die Ruhezeit', 'زمان استراحت و سکوت', 'Könnten wir …? پیشنهاد مؤدبانه.', [{ word: 'schriftlich', meaning: 'به‌صورت مکتوب' }, { word: 'vereinbaren', meaning: 'توافق یا هماهنگ‌کردن' }, { word: 'die Zeit', meaning: 'زمان' }]),
    sentence('de-v2-b1-neighbor-s4', 'Das Missverständnis ließ sich lösen, nachdem wir offen darüber gesprochen hatten.', 'پس از اینکه صادقانه درباره‌اش صحبت کردیم، سوءتفاهم حل شد.', 'داس میس‌فِرشتِنتنیس لیس زیش لوزِن، ناخدِم ویر اُفِن داروبِر گِشپرُخِن هاتِن', 'das Missverständnis', 'سوءتفاهم', 'nachdem + رویداد پیشین در Plusquamperfekt.', [{ word: 'sich lösen lassen', meaning: 'قابل‌حل‌بودن' }, { word: 'offen', meaning: 'صریح؛ صادقانه' }, { word: 'darüber sprechen', meaning: 'دربارهٔ آن صحبت‌کردن' }]),
    sentence('de-v2-b1-neighbor-s5', 'Seit wir die Aufgaben teilen, gibt es weniger Konflikte.', 'از وقتی کارها را تقسیم کرده‌ایم، اختلاف کمتری پیش می‌آید.', 'زایت ویر دی آوفگابِن تایلِن، گیبت اِس وِنیگِر کُن‌فلیکتِه', 'der Konflikt', 'اختلاف؛ تعارض', 'seit + جملهٔ وابسته برای وضعیتی که تا حال ادامه دارد.', [{ word: 'die Aufgabe teilen', meaning: 'کار را تقسیم‌کردن' }, { word: 'weniger', meaning: 'کمتر' }, { word: 'es gibt', meaning: 'وجود دارد؛ پیش می‌آید' }]),
  ], [
    { speaker: 'همسایه', text: 'Können wir den Innenhof am Wochenende gemeinsam nutzen?', fa: 'می‌توانیم آخر هفته از حیاط مشترک استفاده کنیم؟' },
    { speaker: 'شما', text: 'Gern. Wir sollten aber auch die Ruhezeiten vereinbaren.', fa: 'با کمال میل. اما بهتر است زمان‌های سکوت را هم مشخص کنیم.' },
    { speaker: 'همسایه', text: 'Das klingt fair. Wann passt es Ihnen?', fa: 'منصفانه است. چه زمانی برایتان مناسب است؟' },
    { speaker: 'شما', text: 'Am Donnerstagabend können wir darüber sprechen.', fa: 'پنجشنبه‌شب می‌توانیم درباره‌اش صحبت کنیم.' },
  ]),
  lesson(3, 10, 'de-v2-b1-travel-disruptions', 'سفر، تأخیر و تغییر برنامه', 'در تغییر ناگهانی برنامه راه‌حل پیدا کنید.', 'به‌دلیل اعتصاب قطار شما تغییر می‌کند و باید با هتل و همراهانتان هماهنگ شوید.', 'sodass نتیجهٔ یک اتفاق را نشان می‌دهد؛ مجهول در اطلاعیه‌ها رایج است. trotz + اسم، تضاد را کوتاه بیان می‌کند.', [
    sentence('de-v2-b1-travel-s1', 'Wegen des Streiks ist unser Zug ausgefallen, sodass wir eine andere Verbindung suchen mussten.', 'به‌دلیل اعتصاب قطارمان لغو شد، بنابراین مجبور شدیم مسیر دیگری پیدا کنیم.', 'وِگِن دِس شترایکْس ایست اونزِر تسوگ آوس‌گِفالِن، زوداس ویر آینِه آندِرِه فِربیندونگ زوخِن موستِن', 'der Streik', 'اعتصاب', 'sodass نتیجه را معرفی می‌کند.', [{ word: 'ausfallen', meaning: 'لغو یا ازکارافتادن' }, { word: 'die Verbindung', meaning: 'مسیر یا ارتباطِ حمل‌ونقل' }, { word: 'suchen müssen', meaning: 'مجبوربودن به جست‌وجو' }]),
    sentence('de-v2-b1-travel-s2', 'Die Fahrgäste wurden gebeten, am Gleis zu warten.', 'از مسافران خواسته شد کنار سکو منتظر بمانند.', 'دی فارگِستِه ووردِن گِبیتِن، اَم گلایس تسو وارتِن', 'der Fahrgast', 'مسافرِ وسیلهٔ نقلیه', 'مجهول گذشته: wurden + Partizip II.', [{ word: 'bitten', meaning: 'درخواست‌کردن' }, { word: 'das Gleis', meaning: 'سکو یا خط قطار' }, { word: 'warten', meaning: 'منتظرماندن' }]),
    sentence('de-v2-b1-travel-s3', 'Falls wir den Anschluss verpassen, nehmen wir den späteren Zug.', 'اگر قطار بعدی را از دست بدهیم، قطار دیرتر را می‌گیریم.', 'فالس ویر دِن آن‌شلوس فِرپاسِن، نِمِن ویر دِن شپِتِرِن تسوگ', 'den Anschluss verpassen', 'به اتصال یا قطار بعدی نرسیدن', 'Falls …, فعل جملهٔ وابسته در پایان.', [{ word: 'der Anschluss', meaning: 'اتصال؛ قطار بعدی' }, { word: 'verpassen', meaning: 'از دست‌دادن' }, { word: 'später', meaning: 'دیرتر' }]),
    sentence('de-v2-b1-travel-s4', 'Das Hotel hat uns eine kostenfreie Umbuchung angeboten.', 'هتل تغییر رزرو رایگانی به ما پیشنهاد داده است.', 'داس هوتِل هات اونس آینِه کُستِن‌فرایِه اوم‌بوخونگ آن‌گِبوتِن', 'die Umbuchung', 'تغییر رزرو', undefined, [{ word: 'kostenfrei', meaning: 'رایگان؛ بدون هزینه' }, { word: 'anbieten', meaning: 'پیشنهادکردن؛ ارائه‌دادن' }, { word: 'das Hotel', meaning: 'هتل' }]),
    sentence('de-v2-b1-travel-s5', 'Trotz der langen Reise sind wir pünktlich angekommen.', 'باوجود طولانی‌بودن سفر، به‌موقع رسیدیم.', 'تروتس دِر لانگِن رایزِه زینت ویر پونکتلیش آن‌گِکومِن', 'trotz', 'باوجودِ', undefined, [{ word: 'die lange Reise', meaning: 'سفر طولانی' }, { word: 'pünktlich', meaning: 'به‌موقع' }, { word: 'ankommen', meaning: 'رسیدن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Unser Zug ist ausgefallen. Was machen wir jetzt?', fa: 'قطارمان لغو شده. حالا چه‌کار کنیم؟' },
    { speaker: 'شما', text: 'Ich suche eine andere Verbindung.', fa: 'دنبال مسیر دیگری می‌گردم.' },
    { speaker: 'طرف مقابل', text: 'Und wenn wir den Anschluss verpassen?', fa: 'و اگر به قطار بعدی نرسیم؟' },
    { speaker: 'شما', text: 'Dann nehmen wir den späteren Zug und informieren das Hotel.', fa: 'آن‌وقت قطار دیرتر را می‌گیریم و به هتل خبر می‌دهیم.' },
  ]),
  lesson(3, 11, 'de-v2-b1-personal-experience', 'روایت تجربه و خاطره', 'تجربه را با ترتیب و بازنگری روایت کنید.', 'در جمعی دوستانه دربارهٔ نقل‌مکان به شهری تازه و چیزی که از آن آموخته‌اید صحبت می‌کنید.', 'با zuerst و rückblickend ترتیب و ارزیابی را روشن کنید. ساختار je … desto … رابطهٔ تغییر دو چیز را نشان می‌دهد.', [
    sentence('de-v2-b1-experience-s1', 'Vor einigen Jahren bin ich allein nach Leipzig gezogen, um dort zu studieren.', 'چند سال پیش برای تحصیل تنها به لایپزیگ نقل‌مکان کردم.', 'فور آینیشِن یارِن بین ایش آلاین ناخ لایپتسیش گِتسوگِن، اوم دُرت تسو شتودیرِن', 'umziehen', 'نقل‌مکان‌کردن', 'um … zu برای بیان هدف.', [{ word: 'vor einigen Jahren', meaning: 'چند سال پیش' }, { word: 'allein', meaning: 'تنها' }, { word: 'studieren', meaning: 'در دانشگاه تحصیل‌کردن' }]),
    sentence('de-v2-b1-experience-s2', 'Zuerst fiel es mir schwer, neue Leute kennenzulernen.', 'در ابتدا آشناشدن با آدم‌های تازه برایم دشوار بود.', 'تسوئِرست فیل اِس میر شوِر، نویِه لویته کِنِن‌تسو‌لِرنِن', 'schwerfallen', 'دشواربودن؛ سخت‌بودن برای کسی', 'fiel … schwer، گذشتهٔ schwerfallen.', [{ word: 'zuerst', meaning: 'در آغاز' }, { word: 'neue Leute', meaning: 'آدم‌های تازه' }, { word: 'kennenlernen', meaning: 'آشناشدن با' }]),
    sentence('de-v2-b1-experience-s3', 'Je länger ich dort lebte, desto wohler fühlte ich mich.', 'هرچه بیشتر آنجا زندگی کردم، احساس راحتی بیشتری داشتم.', 'یه لِنگِر ایش دُرت لِبتِه، دِستو وولِر فیولتِه ایش میش', 'sich wohlfühlen', 'احساس راحتی یا آسودگی‌کردن', 'je …, desto … رابطهٔ دو تغییر را نشان می‌دهد.', [{ word: 'je länger … desto …', meaning: 'هرچه …، به همان نسبت …' }, { word: 'leben', meaning: 'زندگی‌کردن' }, { word: 'dort', meaning: 'آنجا' }]),
    sentence('de-v2-b1-experience-s4', 'Rückblickend war dieser Schritt wichtiger, als ich damals dachte.', 'با نگاه به گذشته، این قدم مهم‌تر از چیزی بود که آن زمان فکر می‌کردم.', 'روک‌بلیکِنت وار دیزِر شریت ویشتیشِر، آلس ایش دامالس داختِه', 'rückblickend', 'با نگاه به گذشته؛ در بازنگری', undefined, [{ word: 'der Schritt', meaning: 'قدم؛ گام' }, { word: 'damals', meaning: 'آن زمان' }, { word: 'wichtiger als', meaning: 'مهم‌تر از' }]),
    sentence('de-v2-b1-experience-s5', 'Diese Erfahrung hat mir gezeigt, dass man mit Geduld viel erreichen kann.', 'این تجربه به من نشان داد که آدم با صبر می‌تواند به چیزهای زیادی برسد.', 'دیزِه اِرفارونگ هات میر گِتسایگت، داس مان میت گِدولت فیل اِر‌رایشِن کان', 'die Geduld', 'صبر؛ شکیبایی', 'dass + فعل در پایان جملهٔ وابسته.', [{ word: 'die Erfahrung', meaning: 'تجربه' }, { word: 'zeigen', meaning: 'نشان‌دادن' }, { word: 'erreichen', meaning: 'به‌دست‌آوردن؛ رسیدن به' }]),
  ], [
    { speaker: 'دوست', text: 'Wie war es, in eine neue Stadt zu ziehen?', fa: 'نقل‌مکان به شهری تازه چطور بود؟' },
    { speaker: 'شما', text: 'Am Anfang war es schwer, neue Leute kennenzulernen.', fa: 'اوایل آشناشدن با آدم‌های تازه سخت بود.' },
    { speaker: 'دوست', text: 'Und hat sich das später geändert?', fa: 'بعدتر این وضعیت تغییر کرد؟' },
    { speaker: 'شما', text: 'Ja. Je länger ich dort lebte, desto wohler fühlte ich mich.', fa: 'بله. هرچه بیشتر آنجا زندگی کردم، راحت‌تر بودم.' },
  ]),
  lesson(3, 12, 'de-v2-b1-continuing-education', 'ادامهٔ تحصیل و انتخاب دوره', 'دوره‌ای مناسب را ارزیابی و برنامه‌ریزی کنید.', 'برای ارتقای مهارت کاری، یک دورهٔ عصرانه را با مسئول دوره بررسی می‌کنید.', 'جملهٔ موصولی مشخص می‌کند دربارهٔ کدام دوره صحبت می‌کنید. damit هدف می‌سازد و falls شرط احتمالی را بیان می‌کند.', [
    sentence('de-v2-b1-education-s1', 'Der Abendkurs, für den ich mich angemeldet habe, beginnt nächste Woche.', 'دورهٔ عصرانه‌ای که در آن ثبت‌نام کرده‌ام هفتهٔ آینده شروع می‌شود.', 'دِر آبِنت‌کورس، فور دِن ایش میش آن‌گِمِلدِت هابِه، بِگینت نِکستِه وُخِه', 'der Abendkurs', 'دورهٔ عصرانه', 'جملهٔ موصولی با für den؛ فعل در پایان.', [{ word: 'sich anmelden', meaning: 'ثبت‌نام‌کردن' }, { word: 'nächste Woche', meaning: 'هفتهٔ آینده' }, { word: 'beginnen', meaning: 'شروع‌شدن' }]),
    sentence('de-v2-b1-education-s2', 'Weil der Unterricht nur einmal pro Woche stattfindet, muss ich den Stoff selbstständig wiederholen.', 'چون کلاس فقط هفته‌ای یک‌بار برگزار می‌شود، باید مطالب را خودم مرور کنم.', 'وایل دِر اونتِریشت نور آین‌مال پرو وُخِه شتات‌فیندِت، موس ایش دِن شتوف زِلبستشتِندیش ویدِر‌هولِن', 'selbstständig', 'مستقل؛ به‌طور خودآموز', 'weil + فعل در پایان جملهٔ وابسته.', [{ word: 'der Unterricht', meaning: 'کلاس؛ آموزش' }, { word: 'der Stoff', meaning: 'مطالب درسی' }, { word: 'wiederholen', meaning: 'مرورکردن' }]),
    sentence('de-v2-b1-education-s3', 'Die Dozentin erklärt die Regeln anhand von Beispielen.', 'مدرس قواعد را با استفاده از مثال توضیح می‌دهد.', 'دی دوتسِنتین اِرکلِرت دی رِگلِن آن‌هَنت فون بای‌شپیلِن', 'anhand von', 'با استفاده از؛ بر پایهٔ', undefined, [{ word: 'die Dozentin', meaning: 'مدرس زن؛ استاد دوره' }, { word: 'die Regel', meaning: 'قاعده' }, { word: 'das Beispiel', meaning: 'مثال' }]),
    sentence('de-v2-b1-education-s4', 'Damit ich das Gelernte anwenden kann, schreibe ich jede Woche einen kurzen Text.', 'برای اینکه بتوانم آموخته‌ها را به‌کار ببرم، هر هفته متن کوتاهی می‌نویسم.', 'دامیت ایش داس گِلِرنته آن‌وِندِن کان، شرایبِه ایش یدِه وُخِه آینِن کورتسِن تِکست', 'anwenden', 'به‌کاربردن؛ اعمال‌کردن', 'damit + فعل در پایان جملهٔ وابسته.', [{ word: 'das Gelernte', meaning: 'آنچه آموخته شده' }, { word: 'jede Woche', meaning: 'هر هفته' }, { word: 'der Text', meaning: 'متن' }]),
    sentence('de-v2-b1-education-s5', 'Falls ich eine Stunde verpasse, kann ich die Aufgaben online nachholen.', 'اگر یک جلسه را از دست بدهم، می‌توانم تمرین‌ها را آنلاین جبران کنم.', 'فالس ایش آینِه شتوندِه فِرپاسِه، کان ایش دی آوفگابِن آنلاین ناخ‌هولِن', 'nachholen', 'جبران‌کردن؛ بعداً انجام‌دادن', 'Falls …, فعل جملهٔ وابسته در پایان.', [{ word: 'verpassen', meaning: 'از دست‌دادن' }, { word: 'online', meaning: 'آنلاین' }, { word: 'die Aufgabe', meaning: 'تمرین؛ وظیفه' }]),
  ], [
    { speaker: 'شما', text: 'Wie oft findet der Abendkurs statt?', fa: 'دورهٔ عصرانه چند وقت یک‌بار برگزار می‌شود؟' },
    { speaker: 'مسئول دوره', text: 'Einmal pro Woche. Die Aufgaben können Sie online nachholen.', fa: 'هفته‌ای یک‌بار. می‌توانید تمرین‌ها را آنلاین جبران کنید.' },
    { speaker: 'شما', text: 'Das ist hilfreich, weil ich manchmal spät arbeite.', fa: 'این مفید است، چون گاهی تا دیر وقت کار می‌کنم.' },
    { speaker: 'مسئول دوره', text: 'Dann passt der Kurs wahrscheinlich gut zu Ihnen.', fa: 'پس احتمالاً این دوره برایتان مناسب است.' },
  ]),
  lesson(3, 13, 'de-v2-b1-health-care', 'سلامت و گفت‌وگو با مطب', 'نشانه‌ها و توصیه‌ها را دقیق شرح دهید.', 'در تماس با مطب دربارهٔ یک نشانهٔ ادامه‌دار و زمان مراجعه صحبت می‌کنید.', 'برای شرح مدت از seit استفاده کنید. empfehlen می‌تواند با zu + مصدر بیاید؛ اگر نشانه‌ها تغییر کرد، از شرطی با wenn استفاده کنید.', [
    sentence('de-v2-b1-health-s1', 'Seit einigen Wochen habe ich Rückenschmerzen, besonders nach langem Sitzen.', 'چند هفته است کمردرد دارم، به‌ویژه پس از نشستن طولانی.', 'زایت آینیشِن وُخِن هابِه ایش روکِن‌شمرتسِن، بِزوندرس ناخ لانگِم زیتسِن', 'die Rückenschmerzen', 'کمردرد', undefined, [{ word: 'seit einigen Wochen', meaning: 'چند هفته است' }, { word: 'besonders', meaning: 'به‌ویژه' }, { word: 'langes Sitzen', meaning: 'نشستن طولانی' }]),
    sentence('de-v2-b1-health-s2', 'Die Ärztin hat mir empfohlen, mich regelmäßig zu bewegen.', 'پزشک به من توصیه کرده مرتب تحرک داشته باشم.', 'دی اِرتستین هات میر اِمپفولِن، میش رِگل‌مِسیش تسو بِوِگِن', 'empfehlen', 'توصیه‌کردن', 'empfehlen + مفعول + zu + مصدر.', [{ word: 'die Ärztin', meaning: 'پزشک زن' }, { word: 'sich bewegen', meaning: 'تحرک‌داشتن' }, { word: 'regelmäßig', meaning: 'به‌طور منظم' }]),
    sentence('de-v2-b1-health-s3', 'Wenn die Beschwerden stärker werden, soll ich noch einmal anrufen.', 'اگر نشانه‌ها شدیدتر شوند، باید دوباره تماس بگیرم.', 'وِن دی بِش‌وِردِن شتارکِر وِردِن، زول ایش نوخ آین‌مال آن‌روفِن', 'die Beschwerde', 'نشانهٔ ناخوشی؛ شکایت', 'Wenn …, فعل جملهٔ وابسته در پایان.', [{ word: 'stärker werden', meaning: 'شدیدترشدن' }, { word: 'noch einmal', meaning: 'یک بار دیگر' }, { word: 'anrufen', meaning: 'تلفن‌کردن' }]),
    sentence('de-v2-b1-health-s4', 'Vor dem Termin musste ich ein Formular ausfüllen.', 'پیش از وقت ملاقات مجبور شدم فرمی را پر کنم.', 'فور دِم تِرمین موستِه ایش آین فورمولار آوس‌فولِن', 'ausfüllen', 'پرکردنِ فرم', undefined, [{ word: 'vor dem Termin', meaning: 'پیش از وقت ملاقات' }, { word: 'das Formular', meaning: 'فرم' }, { word: 'müssen', meaning: 'باید؛ مجبوربودن' }]),
    sentence('de-v2-b1-health-s5', 'Ich achte darauf, bei der Arbeit regelmäßig Pausen zu machen.', 'حواسم هست که سر کار مرتب استراحت کنم.', 'ایش آختِه داراوف، بای دِر آربایت رِگل‌مِسیش پاوزِن تسو ماخِن', 'auf etwas achten', 'به چیزی توجه‌کردن؛ مراقب چیزی‌بودن', 'achten darauf + zu + مصدر.', [{ word: 'die Pause', meaning: 'استراحت' }, { word: 'bei der Arbeit', meaning: 'در محل کار' }, { word: 'regelmäßig', meaning: 'به‌طور منظم' }]),
  ], [
    { speaker: 'پذیرش مطب', text: 'Seit wann haben Sie die Schmerzen?', fa: 'از چه زمانی این درد را دارید؟' },
    { speaker: 'شما', text: 'Seit einigen Wochen, besonders nach langem Sitzen.', fa: 'چند هفته است، به‌ویژه پس از نشستن طولانی.' },
    { speaker: 'پذیرش مطب', text: 'Die Ärztin kann Sie am Donnerstag untersuchen.', fa: 'پزشک می‌تواند پنجشنبه شما را معاینه کند.' },
    { speaker: 'شما', text: 'Danke. Wenn es schlimmer wird, rufe ich noch einmal an.', fa: 'ممنون. اگر بدتر شد، دوباره تماس می‌گیرم.' },
  ]),
  lesson(3, 14, 'de-v2-b1-digital-privacy', 'فناوری، حریم خصوصی و رسانهٔ دیجیتال', 'اطلاعات را با احتیاط و دلیل بررسی کنید.', 'پیامی مشکوک دریافت کرده‌اید و به دوستتان توضیح می‌دهید چطور از اطلاعات حساب محافظت می‌کنید.', 'پرسش غیرمستقیم با ob ترتیب جملهٔ وابسته می‌گیرد. در مجهول با فعل وجهی، از sollten + Partizip II + werden استفاده کنید.', [
    sentence('de-v2-b1-digital-s1', 'Ich prüfe zuerst, ob die Nachricht wirklich von der Bank kommt.', 'اول بررسی می‌کنم که آیا پیام واقعاً از طرف بانک است یا نه.', 'ایش پروفِه تسوئِرست، اُب دی ناخ‌ریشت ویرکلیش فون دِر بانک کُمت', 'prüfen', 'بررسی‌کردن', 'پرسش غیرمستقیم با ob؛ فعل در پایان.', [{ word: 'zuerst', meaning: 'اول؛ ابتدا' }, { word: 'ob', meaning: 'آیا؛ اینکه آیا' }, { word: 'die Bank', meaning: 'بانک' }]),
    sentence('de-v2-b1-digital-s2', 'Persönliche Daten sollten nur über eine sichere Verbindung gesendet werden.', 'اطلاعات شخصی باید فقط از راه ارتباطی امن فرستاده شوند.', 'پِرزونلیشِه داتِن زولتِن نور اوبِر آینِه زیخِرِه فِربیندونگ گِزِندِت وِردِن', 'die Verbindung', 'ارتباط؛ پیوند', 'مجهول با فعل وجهی: sollten + Partizip II + werden.', [{ word: 'persönliche Daten', meaning: 'اطلاعات شخصی' }, { word: 'sicher', meaning: 'امن' }, { word: 'senden', meaning: 'فرستادن' }]),
    sentence('de-v2-b1-digital-s3', 'Das Passwort, das ich benutze, ändere ich regelmäßig.', 'گذرواژه‌ای را که استفاده می‌کنم مرتب تغییر می‌دهم.', 'داس پاس‌وُرت، داس ایش بِنوتسِه، اِندِرِه ایش رِگل‌مِسیش', 'das Passwort', 'گذرواژه', 'جملهٔ موصولی با das؛ فعل در پایان.', [{ word: 'benutzen', meaning: 'استفاده‌کردن' }, { word: 'ändern', meaning: 'تغییر‌دادن' }, { word: 'regelmäßig', meaning: 'به‌طور منظم' }]),
    sentence('de-v2-b1-digital-s4', 'Bevor ich einen Link öffne, kontrolliere ich die Absenderadresse.', 'پیش از بازکردن پیوند، نشانی فرستنده را بررسی می‌کنم.', 'بِفور ایش آینِن لینک اُفنِه، کُنت‌رولیِرِه ایش دی آپ‌زِندِر‌آدرِسِه', 'die Absenderadresse', 'نشانی فرستنده', 'bevor + فعل در پایان جملهٔ وابسته.', [{ word: 'einen Link öffnen', meaning: 'پیوندی را بازکردن' }, { word: 'kontrollieren', meaning: 'کنترل‌کردن' }, { word: 'die Adresse', meaning: 'نشانی' }]),
    sentence('de-v2-b1-digital-s5', 'Ich habe die Zwei-Faktor-Authentifizierung aktiviert, damit niemand ohne mein Handy auf das Konto zugreifen kann.', 'تأیید هویت دومرحله‌ای را فعال کرده‌ام تا کسی بدون گوشی‌ام به حساب دسترسی پیدا نکند.', 'ایش هابِه دی تسوای‌فاکتور آوتِنتیفی‌تسی‌رونگ آکتیویرت، دامیت نیمانت اونِه ماین هَندی آوف داس کُنتو تسوگ‌رایفِن کان', 'auf ein Konto zugreifen', 'به حسابی دسترسی‌داشتن', 'damit + فعل در پایان جملهٔ وابسته.', [{ word: 'die Zwei-Faktor-Authentifizierung', meaning: 'تأیید هویت دومرحله‌ای' }, { word: 'aktivieren', meaning: 'فعال‌کردن' }, { word: 'zugreifen auf', meaning: 'دسترسی‌داشتن به' }]),
  ], [
    { speaker: 'دوست', text: 'Hast du den Link aus der Nachricht geöffnet?', fa: 'پیوند داخل پیام را باز کردی؟' },
    { speaker: 'شما', text: 'Nein, ich prüfe zuerst, ob die Nachricht wirklich von der Bank kommt.', fa: 'نه، اول بررسی می‌کنم که پیام واقعاً از بانک آمده باشد.' },
    { speaker: 'دوست', text: 'Wie schützt du dein Konto?', fa: 'چطور از حسابت محافظت می‌کنی؟' },
    { speaker: 'شما', text: 'Ich benutze ein starkes Passwort und die Zwei-Faktor-Anmeldung.', fa: 'از گذرواژهٔ قوی و ورود دومرحله‌ای استفاده می‌کنم.' },
  ]),
  lesson(3, 15, 'de-v2-b1-sustainable-choices', 'محیط زیست و انتخاب پایدار', 'مزیت و هزینهٔ یک تغییر را مقایسه کنید.', 'در گفت‌وگویی محلی دربارهٔ رفت‌وآمد و کاهش پسماند، مزایا و دشواری‌های هر انتخاب را بررسی می‌کنید.', 'Konjunktiv II برای وضعیت فرضی به‌کار می‌رود. indem روش انجام کار را می‌گوید؛ einerseits … andererseits دو جنبه را مقایسه می‌کند.', [
    sentence('de-v2-b1-environment-s1', 'Viele Menschen würden häufiger das Fahrrad nehmen, wenn die Wege sicherer wären.', 'اگر مسیرها امن‌تر بودند، افراد بیشتری با دوچرخه رفت‌وآمد می‌کردند.', 'فیلِه مِنشِن ووردِن هویفیگِر داس فاررات نِمِن، وِن دی وِگِه زیخِرِر وِرِن', 'das Fahrrad nehmen', 'با دوچرخه رفت‌وآمدکردن', 'Konjunktiv II: würden …, wären …', [{ word: 'häufiger', meaning: 'بیشتر؛ با دفعات بیشتر' }, { word: 'der Weg', meaning: 'مسیر' }, { word: 'sicherer', meaning: 'امن‌تر' }]),
    sentence('de-v2-b1-environment-s2', 'Die Stadt hat mehrere alte Busse durch elektrische Fahrzeuge ersetzt.', 'شهر چند اتوبوس قدیمی را با خودروهای برقی جایگزین کرده است.', 'دی شتات هات مِرِرِه آلتِه بوسِه دورش اِلِکتریشِه فار‌تسوگِه اِر‌زِتست', 'ersetzen', 'جایگزین‌کردن', undefined, [{ word: 'mehrere', meaning: 'چندین' }, { word: 'das Fahrzeug', meaning: 'وسیلهٔ نقلیه' }, { word: 'elektrisch', meaning: 'برقی' }]),
    sentence('de-v2-b1-environment-s3', 'Einerseits kostet die Umstellung viel Geld, andererseits spart sie langfristig Energie.', 'از یک طرف این تغییر هزینهٔ زیادی دارد، از طرف دیگر در بلندمدت انرژی ذخیره می‌کند.', 'آینِر‌زایتس کُستِت دی اوم‌شْتِلونگ فیل گِلت، آندِرِرزایتس شپارت زی لانگ‌فریستیش اِنِرگی', 'die Umstellung', 'تغییر؛ گذار به روش تازه', undefined, [{ word: 'einerseits … andererseits', meaning: 'از یک طرف … از طرف دیگر' }, { word: 'langfristig', meaning: 'در بلندمدت' }, { word: 'die Energie', meaning: 'انرژی' }]),
    sentence('de-v2-b1-environment-s4', 'Wir vermeiden Abfall, indem wir wiederverwendbare Flaschen benutzen.', 'با استفاده از بطری‌های چندبارمصرف، از تولید زباله جلوگیری می‌کنیم.', 'ویر فِر‌مایدِن آب‌فال، ایندِم ویر ویدِر‌فِروِندبارِه فلاشِن بِنوتسِن', 'vermeiden', 'پرهیزکردن؛ جلوگیری‌کردن', 'indem + فعل در پایان جملهٔ وابسته.', [{ word: 'der Abfall', meaning: 'زباله؛ پسماند' }, { word: 'wiederverwendbar', meaning: 'چندبارمصرف' }, { word: 'die Flasche', meaning: 'بطری' }]),
    sentence('de-v2-b1-environment-s5', 'Ob sich diese Maßnahmen lohnen, hängt von der Umsetzung ab.', 'اینکه این اقدام‌ها به‌صرفه‌اند یا نه، به اجراکردنشان بستگی دارد.', 'اُب زیش دیزِه ماس‌نامِن لونِن، هِنگت فون دِر اوم‌زِتسونگ اَب', 'die Umsetzung', 'اجرا؛ پیاده‌سازی', 'پرسش غیرمستقیم با ob؛ فعل در پایان.', [{ word: 'die Maßnahme', meaning: 'اقدام؛ تدبیر' }, { word: 'sich lohnen', meaning: 'ارزش یا صرفه‌داشتن' }, { word: 'abhängen von', meaning: 'بستگی‌داشتن به' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Sollte die Stadt mehr Geld für Radwege ausgeben?', fa: 'آیا شهر باید پول بیشتری برای مسیرهای دوچرخه هزینه کند؟' },
    { speaker: 'شما', text: 'Ja, wenn die Wege sicherer wären, würden mehr Menschen Rad fahren.', fa: 'بله، اگر مسیرها امن‌تر بودند، افراد بیشتری دوچرخه‌سواری می‌کردند.' },
    { speaker: 'طرف مقابل', text: 'Aber die Umstellung kostet viel Geld.', fa: 'اما این تغییر هزینهٔ زیادی دارد.' },
    { speaker: 'شما', text: 'Das stimmt. Langfristig kann sie trotzdem Energie sparen.', fa: 'درست است. بااین‌حال، در بلندمدت می‌تواند در انرژی صرفه‌جویی کند.' },
  ]),
  lesson(3, 16, 'de-v2-b1-news-and-sources', 'خبر، رسانه و ارزیابی منبع', 'اطلاعات را پیش از بازنشر بررسی کنید.', 'دو خبر با تیترهای متفاوت می‌بینید و با دوستتان دربارهٔ منبع و شیوهٔ بررسی آن‌ها حرف می‌زنید.', 'پیش از بازنشر، منبع را بررسی کنید. عبارت wird behauptet مجهول است و در جملهٔ نقل‌شده با dass، فعل به پایان می‌رود.', [
    sentence('de-v2-b1-media-s1', 'Bevor ich eine Nachricht weiterleite, prüfe ich die Quelle.', 'پیش از بازفرستادن یک خبر، منبعش را بررسی می‌کنم.', 'بِفور ایش آینِه ناخ‌ریشت وایتِر‌لایتِه، پروفِه ایش دی کوِلِه', 'die Quelle', 'منبع', 'bevor + فعل در پایان جملهٔ وابسته.', [{ word: 'weiterleiten', meaning: 'بازفرستادن؛ ارجاع‌دادن' }, { word: 'die Nachricht', meaning: 'خبر؛ پیام' }, { word: 'prüfen', meaning: 'بررسی‌کردن' }]),
    sentence('de-v2-b1-media-s2', 'In dem Artikel wird behauptet, dass die Zahl deutlich gestiegen ist.', 'در آن مقاله ادعا شده که این رقم به‌وضوح افزایش یافته است.', 'این دِم آرتیکل ویرت بِهاوپتِت، داس دی تسال دویتلیش گِشتایگِن ایست', 'behaupten', 'ادعا‌کردن', 'مجهول حال؛ dass + فعل در پایان.', [{ word: 'der Artikel', meaning: 'مقاله' }, { word: 'die Zahl', meaning: 'عدد؛ رقم' }, { word: 'deutlich steigen', meaning: 'به‌وضوح افزایش‌یافتن' }]),
    sentence('de-v2-b1-media-s3', 'Ich lese mehrere Berichte, damit ich verschiedene Perspektiven vergleichen kann.', 'چند گزارش می‌خوانم تا بتوانم دیدگاه‌های مختلف را مقایسه کنم.', 'ایش لِزِه مِرِرِه بِریشتِه، دامیت ایش فِرشیدِنِه پِرسپِکتیوِن فِرگلایشِن کان', 'die Perspektive', 'دیدگاه؛ زاویهٔ نگاه', 'damit + فعل در پایان جملهٔ وابسته.', [{ word: 'der Bericht', meaning: 'گزارش' }, { word: 'verschieden', meaning: 'گوناگون؛ متفاوت' }, { word: 'vergleichen', meaning: 'مقایسه‌کردن' }]),
    sentence('de-v2-b1-media-s4', 'Die Überschrift klingt eindeutig, aber der Text ist vorsichtiger formuliert.', 'تیتر قطعی به‌نظر می‌رسد، اما متن با احتیاط بیشتری نوشته شده است.', 'دی اوبِرشریفت کلینگت آین‌دویتیخ، آبِر دِر تِکست ایست فورزیختیگِر فورمولیرت', 'die Überschrift', 'تیتر؛ عنوان', undefined, [{ word: 'eindeutig', meaning: 'روشن؛ بی‌ابهام' }, { word: 'vorsichtig', meaning: 'محتاط' }, { word: 'formulieren', meaning: 'بیان یا تنظیم‌کردن' }]),
    sentence('de-v2-b1-media-s5', 'Eine verlässliche Quelle nennt, wer die Information veröffentlicht hat.', 'منبع قابل‌اعتماد مشخص می‌کند چه کسی اطلاعات را منتشر کرده است.', 'آینِه فِر‌لِسلیشِه کوِلِه نِنت، وِر دی اینفورماتسیون فِر‌اُفِنتلیشت هات', 'verlässlich', 'قابل‌اعتماد', 'پرسش غیرمستقیم با wer؛ فعل در پایان.', [{ word: 'nennen', meaning: 'نام‌بردن؛ مشخص‌کردن' }, { word: 'veröffentlichen', meaning: 'منتشرکردن' }, { word: 'die Information', meaning: 'اطلاعات' }]),
  ], [
    { speaker: 'دوست', text: 'Hast du diese Nachricht schon weitergeleitet?', fa: 'این خبر را بازفرستاده‌ای؟' },
    { speaker: 'شما', text: 'Noch nicht. Ich prüfe zuerst die Quelle.', fa: 'هنوز نه. اول منبعش را بررسی می‌کنم.' },
    { speaker: 'دوست', text: 'Der Titel klingt sehr eindeutig.', fa: 'عنوان خیلی قطعی به‌نظر می‌رسد.' },
    { speaker: 'شما', text: 'Der Text ist vorsichtiger formuliert. Ich lese noch einen Bericht.', fa: 'متن محتاطانه‌تر نوشته شده. یک گزارش دیگر هم می‌خوانم.' },
  ]),
  lesson(3, 17, 'de-v2-b1-culture-review', 'کتاب، فیلم و نقد فرهنگی', 'نقد کوتاه را با مثال و مقایسه پشتیبانی کنید.', 'پس از دیدن فیلمی اقتباسی، با دوستتان دربارهٔ داستان، شخصیت‌ها و تفاوت آن با کتاب حرف می‌زنید.', 'برای ارزیابی از im Vergleich zu و obwohl استفاده کنید. جملهٔ موصولی با die/der می‌تواند شخصیت یا اثر را دقیق‌تر توصیف کند.', [
    sentence('de-v2-b1-culture-s1', 'Der Film handelt von einer Familie, die nach dem Krieg neu anfangen muss.', 'فیلم دربارهٔ خانواده‌ای است که پس از جنگ باید از نو شروع کند.', 'دِر فیلم هاندِلت فون آینِر فامیلیِه، دی ناخ دِم کریگ نوی آن‌فانگِن موس', 'handeln von', 'دربارهٔ چیزی بودن؛ موضوعش بودن', 'جملهٔ موصولی با die؛ فعل در پایان.', [{ word: 'die Familie', meaning: 'خانواده' }, { word: 'neu anfangen', meaning: 'از نو شروع‌کردن' }, { word: 'der Krieg', meaning: 'جنگ' }]),
    sentence('de-v2-b1-culture-s2', 'Besonders gut hat mir gefallen, wie die Figuren miteinander sprechen.', 'به‌ویژه شیوهٔ گفت‌وگوی شخصیت‌ها را خیلی دوست داشتم.', 'بِزوندرس گوت هات میر گِفالِن، وی دی فیگورِن میت‌آیناندِر شپِرِشِن', 'die Figur', 'شخصیت؛ کاراکتر', 'پرسش غیرمستقیم با wie؛ فعل در پایان.', [{ word: 'besonders gut', meaning: 'به‌ویژه خوب' }, { word: 'gefallen', meaning: 'پسندآمدن؛ خوش‌آمدن' }, { word: 'miteinander sprechen', meaning: 'با یکدیگر صحبت‌کردن' }]),
    sentence('de-v2-b1-culture-s3', 'Die Handlung war spannend, obwohl das Ende vorhersehbar war.', 'داستان پرکشش بود، بااینکه پایانش قابل‌پیش‌بینی بود.', 'دی هاندلونگ وار شپانِنت، اوب‌وُل داس اِندِه فورهِر‌زِه‌بار وار', 'die Handlung', 'خط داستان؛ پیرنگ', 'obwohl + فعل در پایان جملهٔ وابسته.', [{ word: 'spannend', meaning: 'پرکشش؛ هیجان‌انگیز' }, { word: 'das Ende', meaning: 'پایان' }, { word: 'vorhersehbar', meaning: 'قابل‌پیش‌بینی' }]),
    sentence('de-v2-b1-culture-s4', 'Im Vergleich zum Buch ist der Film kürzer, aber sehr eindrucksvoll.', 'در مقایسه با کتاب، فیلم کوتاه‌تر اما بسیار تأثیرگذار است.', 'ایم فِرگلایش تسوم بوخ ایست دِر فیلم کورتسِر، آبِر زِر آین‌دروکس‌فول', 'eindrucksvoll', 'تأثیرگذار؛ به‌یادماندنی', undefined, [{ word: 'im Vergleich zu', meaning: 'در مقایسه با' }, { word: 'kürzer', meaning: 'کوتاه‌تر' }, { word: 'das Buch', meaning: 'کتاب' }]),
    sentence('de-v2-b1-culture-s5', 'Ich würde den Film empfehlen, wenn man ruhige Geschichten mag.', 'اگر کسی داستان‌های آرام دوست داشته باشد، فیلم را پیشنهاد می‌کنم.', 'ایش ووردِه دِن فیلم اِمپفیلِن، وِن مان روویگِه گِشیشتِن ماگ', 'empfehlen', 'پیشنهادکردن', 'würde + مصدر؛ wenn + فعل در پایان.', [{ word: 'ruhig', meaning: 'آرام' }, { word: 'die Geschichte', meaning: 'داستان' }, { word: 'mögen', meaning: 'دوست‌داشتن' }]),
  ], [
    { speaker: 'طرف مقابل', text: 'Wie hat dir der Film gefallen?', fa: 'فیلم را چطور دیدی؟' },
    { speaker: 'شما', text: 'Die Handlung war spannend, obwohl das Ende vorhersehbar war.', fa: 'داستان پرکشش بود، بااینکه پایانش قابل‌پیش‌بینی بود.' },
    { speaker: 'طرف مقابل', text: 'War das Buch besser?', fa: 'کتاب بهتر بود؟' },
    { speaker: 'شما', text: 'Im Vergleich zum Buch ist der Film kürzer, aber sehr eindrucksvoll.', fa: 'در مقایسه با کتاب، فیلم کوتاه‌تر اما تأثیرگذار است.' },
  ]),
  lesson(3, 18, 'de-v2-b1-communication-misunderstanding', 'دوستی، ارتباط و سوءتفاهم', 'دربارهٔ برداشت خود سؤال کنید و روشن‌سازی کنید.', 'در گفت‌وگویی دوستانه دربارهٔ سوءتفاهمی کوچک حرف می‌زنید و راهی برای شفاف‌ترشدن ارتباط پیدا می‌کنید.', 'برای بیان برداشت از Ich hatte den Eindruck, dass … استفاده کنید. statt … zu جایگزین‌کردن یک رفتار را نشان می‌دهد؛ Konjunktiv II پیشنهاد را نرم‌تر می‌کند.', [
    sentence('de-v2-b1-communication-s1', 'Ich hatte den Eindruck, dass du mit dem Vorschlag nicht einverstanden warst.', 'این برداشت را داشتم که با پیشنهاد موافق نبودی.', 'ایش هاتِه دِن آین‌دروک، داس دو میت دِم فورشلاگ نیشت آین‌فِرشتاندِن وارست', 'der Eindruck', 'برداشت؛ تصور', 'dass + فعل در پایان جملهٔ وابسته.', [{ word: 'einverstanden sein', meaning: 'موافق‌بودن' }, { word: 'der Vorschlag', meaning: 'پیشنهاد' }, { word: 'mit etwas', meaning: 'با چیزی' }]),
    sentence('de-v2-b1-communication-s2', 'Statt sofort zu antworten, habe ich erst nachgefragt.', 'به‌جای پاسخ فوری، اول بیشتر سؤال کردم.', 'شتات زوفورت تسو آنت‌وُرتِن، هابِه ایش اِرست ناخ‌گِفراگت', 'nachfragen', 'بیشتر پرسیدن؛ پیگیری‌کردن', 'statt … zu + مصدر.', [{ word: 'statt … zu', meaning: 'به‌جای اینکه' }, { word: 'sofort', meaning: 'فوراً' }, { word: 'antworten', meaning: 'پاسخ‌دادن' }]),
    sentence('de-v2-b1-communication-s3', 'Es wäre hilfreich, wenn wir unsere Erwartungen früher klären würden.', 'اگر انتظارهایمان را زودتر روشن کنیم، مفید خواهد بود.', 'اِس وِرِه هیلف‌ریش، وِن ویر اونزِرِه اِروارتونگِن فرویِر کلِرِن ووردِن', 'die Erwartung', 'انتظار؛ توقع', 'Konjunktiv II برای پیشنهاد نرم و فرضی.', [{ word: 'hilfreich', meaning: 'مفید؛ کمک‌کننده' }, { word: 'früher', meaning: 'زودتر' }, { word: 'klären', meaning: 'روشن‌کردن؛ حل‌وفصل‌کردن' }]),
    sentence('de-v2-b1-communication-s4', 'Als sie ihre Gründe erklärte, konnte ich ihre Reaktion besser verstehen.', 'وقتی دلیل‌هایش را توضیح داد، توانستم واکنشش را بهتر بفهمم.', 'آلس زی ایرِه گروندِه اِرکلِرتِه، کونتِه ایش ایرِه رِآکتسیون بِسِر فِرشتِه‌ه', 'die Reaktion', 'واکنش', 'als + گذشتهٔ یگانه؛ فعل در پایان.', [{ word: 'der Grund', meaning: 'دلیل' }, { word: 'erklären', meaning: 'توضیح‌دادن' }, { word: 'besser verstehen', meaning: 'بهتر فهمیدن' }]),
    sentence('de-v2-b1-communication-s5', 'Seit wir offen miteinander sprechen, entstehen weniger Missverständnisse.', 'از وقتی صریح با هم صحبت می‌کنیم، سوءتفاهم‌های کمتری پیش می‌آید.', 'زایت ویر اُفِن میت‌آیناندِر شپِرِشِن، اِنت‌شتهِن وِنیگِر میس‌فِرشتِنت‌نیسِه', 'das Missverständnis', 'سوءتفاهم', 'seit + وضعیت ادامه‌دار تا اکنون.', [{ word: 'offen sprechen', meaning: 'صریح صحبت‌کردن' }, { word: 'entstehen', meaning: 'پدیدآمدن؛ ایجادشدن' }, { word: 'weniger', meaning: 'کمتر' }]),
  ], [
    { speaker: 'شما', text: 'Ich hatte den Eindruck, dass du mit meinem Vorschlag unzufrieden warst.', fa: 'این برداشت را داشتم که از پیشنهاد من راضی نبودی.' },
    { speaker: 'طرف مقابل', text: 'Ich war nur unsicher, wie viel Zeit es kostet.', fa: 'فقط مطمئن نبودم چقدر زمان می‌برد.' },
    { speaker: 'شما', text: 'Danke, dass du es erklärst. Dann können wir die Erwartungen klären.', fa: 'ممنون که توضیح می‌دهی. پس می‌توانیم انتظارها را روشن کنیم.' },
    { speaker: 'طرف مقابل', text: 'Gern. Offenes Sprechen hilft uns beiden.', fa: 'با کمال میل. گفت‌وگوی صریح به هر دوی ما کمک می‌کند.' },
  ]),
  lesson(3, 19, 'de-v2-b1-volunteering-community', 'مشارکت داوطلبانه و اجتماع', 'دربارهٔ فعالیت گروهی و اثر آن توضیح دهید.', 'به دوستتان از فعالیت داوطلبانه در مرکز محله و برنامه‌های آن برای ساکنان می‌گویید.', 'برای توصیف افراد از جملهٔ موصولی با die استفاده کنید. obwohl تضاد می‌سازد؛ dadurch نتیجهٔ کار قبلی را پیوند می‌دهد.', [
    sentence('de-v2-b1-community-s1', 'Einmal pro Woche helfe ich in einem Nachbarschaftszentrum aus.', 'هفته‌ای یک بار در یک مرکز محلی کمک می‌کنم.', 'آین‌مال پرو وُخِه هِلفِه ایش این آینِم ناخبارشافتس‌تسِنتروم آوس', 'aushelfen', 'به‌طور موقت یا داوطلبانه کمک‌کردن', undefined, [{ word: 'einmal pro Woche', meaning: 'هفته‌ای یک بار' }, { word: 'das Nachbarschaftszentrum', meaning: 'مرکز محله' }, { word: 'helfen', meaning: 'کمک‌کردن' }]),
    sentence('de-v2-b1-community-s2', 'Die Freiwilligen organisieren dort Angebote für ältere Menschen.', 'داوطلبان آنجا برنامه‌هایی برای سالمندان برگزار می‌کنند.', 'دی فرای‌ویلیگِن اُرگانیزیرِن دُرت آن‌گِبوتِه فور اِلتِرِه مِنشِن', 'der Freiwillige', 'داوطلب', undefined, [{ word: 'organisieren', meaning: 'سازمان‌دهی‌کردن' }, { word: 'das Angebot', meaning: 'برنامه؛ فعالیت پیشنهادی' }, { word: 'ältere Menschen', meaning: 'افراد سالمند' }]),
    sentence('de-v2-b1-community-s3', 'Wer mitmachen möchte, kann sich über die Webseite anmelden.', 'هرکس می‌خواهد شرکت کند، می‌تواند از طریق وب‌سایت ثبت‌نام کند.', 'وِر میت‌ماخِن موشتِه، کان زیش اوبِر دی وِب‌زایتِه آن‌مِلدِن', 'mitmachen', 'شرکت‌کردن؛ همراه‌شدن', 'جملهٔ موصولی عام با Wer؛ فعل در پایان جملهٔ وابسته.', [{ word: 'möchten', meaning: 'خواستن؛ مایل‌بودن' }, { word: 'die Webseite', meaning: 'وب‌سایت' }, { word: 'sich anmelden', meaning: 'ثبت‌نام‌کردن' }]),
    sentence('de-v2-b1-community-s4', 'Obwohl die Vorbereitung viel Zeit kostet, macht die Arbeit Spaß.', 'بااینکه آماده‌سازی زمان زیادی می‌گیرد، کار لذت‌بخش است.', 'اوب‌وُل دی فوربِرایتونگ فیل تسایت کُستِت، ماخت دی آربایت شپاس', 'die Vorbereitung', 'آماده‌سازی', 'obwohl + فعل در پایان جملهٔ وابسته.', [{ word: 'Zeit kosten', meaning: 'زمان‌بردن' }, { word: 'Spaß machen', meaning: 'لذت‌بخش‌بودن' }, { word: 'die Arbeit', meaning: 'کار' }]),
    sentence('de-v2-b1-community-s5', 'Dadurch lernen wir Menschen kennen, die sonst wenig Unterstützung bekommen.', 'به این ترتیب با افرادی آشنا می‌شویم که در غیر این صورت حمایت کمی دریافت می‌کنند.', 'دادورش لِرنِن ویر مِنشِن کِنِن، دی زونست وِنیگ اونتِرشتوتسونگ بِکومِن', 'die Unterstützung', 'حمایت؛ پشتیبانی', 'جملهٔ موصولی با die؛ فعل در پایان.', [{ word: 'dadurch', meaning: 'به این ترتیب؛ درنتیجه' }, { word: 'sonst', meaning: 'در غیر این صورت' }, { word: 'bekommen', meaning: 'دریافت‌کردن' }]),
  ], [
    { speaker: 'دوست', text: 'Was machst du am Samstag?', fa: 'شنبه چه‌کار می‌کنی؟' },
    { speaker: 'شما', text: 'Ich helfe im Nachbarschaftszentrum aus. Dort organisieren wir Angebote für ältere Menschen.', fa: 'در مرکز محله کمک می‌کنم. آنجا برای سالمندان برنامه‌هایی برگزار می‌کنیم.' },
    { speaker: 'دوست', text: 'Kann ich auch mitmachen?', fa: 'من هم می‌توانم شرکت کنم؟' },
    { speaker: 'شما', text: 'Natürlich. Du kannst dich über die Webseite anmelden.', fa: 'حتماً. می‌توانی از طریق وب‌سایت ثبت‌نام کنی.' },
  ]),
  lesson(3, 20, 'de-v2-b1-conflict-resolution', 'حل اختلاف و مصالحه', 'مسئله را از سرزنش جدا کنید و توافق بسازید.', 'در یک گروه دربارهٔ اختلافی برنامه‌ریزی حرف می‌زنید و مسئولیت‌ها را روشن می‌کنید.', 'به‌جای سرزنش از anstatt … zu استفاده کنید. nachdem + Plusquamperfekt رویدادی را نشان می‌دهد که پیش از رویداد گذشتهٔ دیگری رخ داده است.', [
    sentence('de-v2-b1-conflict-s1', 'Wir waren unterschiedlicher Meinung, aber beide wollten eine Lösung finden.', 'نظرهای متفاوتی داشتیم، اما هر دو می‌خواستیم راه‌حلی پیدا کنیم.', 'ویر وارِن اونتِرشیدلیشِر ماینونگ، آبِر بایدِه وُلتِن آینِه لوزونگ فیندِن', 'unterschiedlicher Meinung sein', 'نظر متفاوت‌داشتن', undefined, [{ word: 'beide', meaning: 'هر دو' }, { word: 'die Lösung', meaning: 'راه‌حل' }, { word: 'finden', meaning: 'پیداکردن' }]),
    sentence('de-v2-b1-conflict-s2', 'Anstatt jemandem die Schuld zu geben, sollten wir über konkrete Schritte sprechen.', 'به‌جای مقصر دانستن کسی، باید دربارهٔ قدم‌های مشخص صحبت کنیم.', 'آن‌شتات یِماندِم دی شولد تسو گِیبِن، زولتِن ویر اوبِر کُنکرِتِه شریتِه شپِرِشِن', 'die Schuld geben', 'مقصر دانستن؛ تقصیر را گردن کسی انداختن', 'anstatt … zu + مصدر.', [{ word: 'jemandem', meaning: 'به کسی' }, { word: 'konkret', meaning: 'مشخص؛ عینی' }, { word: 'der Schritt', meaning: 'قدم؛ گام' }]),
    sentence('de-v2-b1-conflict-s3', 'Ich kann deinen Ärger nachvollziehen, dennoch müssen wir fair bleiben.', 'می‌توانم ناراحتی‌ات را درک کنم، بااین‌حال باید منصف بمانیم.', 'ایش کان داینِن اِرگِر ناخفول‌تسیِن، دِن‌نوخ موسِن ویر فِر بلایبِن', 'nachvollziehen', 'درک‌کردن؛ پی‌بردن به', undefined, [{ word: 'der Ärger', meaning: 'ناراحتی؛ دلخوری' }, { word: 'dennoch', meaning: 'بااین‌حال' }, { word: 'fair', meaning: 'منصفانه' }]),
    sentence('de-v2-b1-conflict-s4', 'Nachdem jeder seine Sicht erklärt hatte, konnten wir einen Kompromiss vereinbaren.', 'پس از اینکه هرکس دیدگاهش را توضیح داد، توانستیم به مصالحه برسیم.', 'ناخدِم یدِر زاینِه زیخت اِرکلِرتِه هاتِه، کونتِن ویر آینِن کومپرومیس فِرآینبارِن', 'der Kompromiss', 'مصالحه؛ راه‌حل میانه', 'nachdem + Plusquamperfekt.', [{ word: 'die Sicht', meaning: 'دیدگاه' }, { word: 'erklären', meaning: 'توضیح‌دادن' }, { word: 'vereinbaren', meaning: 'توافق‌کردن' }]),
    sentence('de-v2-b1-conflict-s5', 'Die Vereinbarung gilt, solange sich keine neuen Umstände ergeben.', 'توافق تا زمانی معتبر است که شرایط تازه‌ای پیش نیاید.', 'دی فِرآینبارونگ گیلت، زولانگِه زیش کاینِه نویِن اوم‌شتِندِه اِرگِیبِن', 'die Vereinbarung', 'توافق؛ موافقت‌نامه', 'solange + جملهٔ وابسته، فعل در پایان.', [{ word: 'gelten', meaning: 'معتبر یا لازم‌الاجرا بودن' }, { word: 'der Umstand', meaning: 'شرایط؛ اوضاع' }, { word: 'sich ergeben', meaning: 'پیش‌آمدن؛ پدیدآمدن' }]),
  ], [
    { speaker: 'هم‌گروهی', text: 'Wir haben verschiedene Meinungen. Wie finden wir eine Lösung?', fa: 'نظرهای متفاوتی داریم. چطور راه‌حلی پیدا کنیم؟' },
    { speaker: 'شما', text: 'Lass uns über konkrete Schritte sprechen, statt jemandem die Schuld zu geben.', fa: 'بیا به‌جای مقصر دانستن کسی دربارهٔ قدم‌های مشخص صحبت کنیم.' },
    { speaker: 'هم‌گروهی', text: 'Das klingt fair. Ich erkläre zuerst meine Sicht.', fa: 'منصفانه است. اول دیدگاهم را توضیح می‌دهم.' },
    { speaker: 'شما', text: 'Gut. Danach können wir einen Kompromiss vereinbaren.', fa: 'خوب است. بعد می‌توانیم به مصالحه برسیم.' },
  ]),
  lesson(3, 21, 'de-v2-b1-personal-goals', 'هدف‌های شخصی و برنامه‌ریزی', 'هدف بزرگ را به قدم‌های قابل‌اجرا تقسیم کنید.', 'برای یک هدف کاری یا تحصیلی، زمان و کارهای کوچک‌تر را در برنامه‌تان جا می‌دهید.', 'برای گفتن هدف از es ist mein Ziel, … zu استفاده کنید. جملهٔ موصولی با an denen به زمان‌های مشخص اشاره می‌کند.', [
    sentence('de-v2-b1-goals-s1', 'Mein Ziel ist es, bis zum Sommer eine Weiterbildung abzuschließen.', 'هدفم این است که تا تابستان یک دورهٔ تکمیلی را تمام کنم.', 'ماین تسِیل ایست اِس، بیس تسوم زومِر آینِه وایتِربیلدونگ آب‌تسو‌شلوسِن', 'die Weiterbildung', 'آموزش تکمیلی؛ دورهٔ ارتقای مهارت', 'es ist mein Ziel, … zu + مصدر.', [{ word: 'das Ziel', meaning: 'هدف' }, { word: 'bis zum Sommer', meaning: 'تا تابستان' }, { word: 'abschließen', meaning: 'به پایان‌رساندن' }]),
    sentence('de-v2-b1-goals-s2', 'Damit das klappt, teile ich die Aufgaben in kleinere Schritte ein.', 'برای اینکه این برنامه عملی شود، کارها را به قدم‌های کوچک‌تر تقسیم می‌کنم.', 'دامیت داس کلاپت، تایله ایش دی آوفگابِن این کلاینِرِه شریتِه آین', 'einteilen', 'تقسیم یا دسته‌بندی‌کردن', 'damit + فعل در پایان جملهٔ وابسته.', [{ word: 'klappen', meaning: 'عملی‌شدن؛ درست پیش‌رفتن' }, { word: 'die Aufgabe', meaning: 'کار؛ وظیفه' }, { word: 'der Schritt', meaning: 'قدم؛ مرحله' }]),
    sentence('de-v2-b1-goals-s3', 'Wenn ich etwas nicht sofort schaffe, versuche ich aus dem Fehler zu lernen.', 'اگر کاری را فوراً انجام ندهم، سعی می‌کنم از اشتباهم درس بگیرم.', 'وِن ایش اِتواس نیشت زوفورت شافِه، فِرزوخِه ایش آوس دِم فیلِر تسو لِرنِن', 'aus einem Fehler lernen', 'از اشتباهی درس‌گرفتن', 'Wenn …, فعل جملهٔ وابسته در پایان.', [{ word: 'schaffen', meaning: 'از عهده برآمدن؛ انجام‌دادن' }, { word: 'der Fehler', meaning: 'اشتباه' }, { word: 'versuchen', meaning: 'تلاش‌کردن' }]),
    sentence('de-v2-b1-goals-s4', 'Im Kalender trage ich feste Zeiten ein, an denen ich ungestört arbeiten kann.', 'در تقویم زمان‌های ثابتی می‌گذارم که بتوانم بی‌مزاحمت کار کنم.', 'ایم کالِندِر تراگِه ایش فِستِه تسایتِن آین، اَن دینِن ایش اونگِشتورت آربایتِن کان', 'ungestört', 'بدون مزاحمت؛ بی‌وقفه', 'جملهٔ موصولی با an denen؛ فعل در پایان.', [{ word: 'der Kalender', meaning: 'تقویم' }, { word: 'feste Zeiten', meaning: 'زمان‌های ثابت' }, { word: 'eintragen', meaning: 'ثبت‌کردن' }]),
    sentence('de-v2-b1-goals-s5', 'So bleibe ich motiviert, auch wenn sich der Plan ändern muss.', 'به این ترتیب باانگیزه می‌مانم، حتی اگر برنامه ناچار به تغییر شود.', 'زو بلایبِه ایش موتیویِرت، آوخ وِن زیش دِر پلان اِندِرن موس', 'motiviert bleiben', 'باانگیزه ماندن', 'auch wenn + جملهٔ وابسته.', [{ word: 'motiviert', meaning: 'باانگیزه' }, { word: 'der Plan', meaning: 'برنامه' }, { word: 'sich ändern', meaning: 'تغییرکردن' }]),
  ], [
    { speaker: 'دوست', text: 'Was möchtest du in diesem Jahr erreichen?', fa: 'امسال دوست داری به چه چیزی برسی؟' },
    { speaker: 'شما', text: 'Ich möchte eine Weiterbildung abschließen.', fa: 'می‌خواهم یک دورهٔ تکمیلی را تمام کنم.' },
    { speaker: 'دوست', text: 'Wie planst du das?', fa: 'چطور برایش برنامه‌ریزی می‌کنی؟' },
    { speaker: 'شما', text: 'Ich teile die Aufgaben in kleinere Schritte ein und trage feste Lernzeiten ein.', fa: 'کارها را به قدم‌های کوچک تقسیم می‌کنم و زمان‌های مشخصی برای مطالعه می‌گذارم.' },
  ]),
  lesson(3, 22, 'de-v2-b1-conditions-alternatives', 'شرط، پیامد و گزینهٔ جایگزین', 'برای چند حالت ممکن برنامه بسازید.', 'برای رویدادی در فضای باز، احتمال باران و دیررسیدن اتوبوس را در برنامه در نظر می‌گیرید.', 'Konjunktiv II موقعیت فرضی یا پیشنهاد را نشان می‌دهد. ساختار je … desto … رابطهٔ میان دو تغییر را بیان می‌کند.', [
    sentence('de-v2-b1-conditions-s1', 'Falls der Bus später kommt, informieren wir alle Teilnehmenden per Nachricht.', 'اگر اتوبوس دیرتر بیاید، با پیام به همهٔ شرکت‌کنندگان اطلاع می‌دهیم.', 'فالس دِر بوس شپِتِر کُمت، اینفورمیرِن ویر آلِه تایل‌نِمِندِن پِر ناخ‌ریشت', 'die Teilnehmenden', 'شرکت‌کنندگان', 'Falls …, فعل جملهٔ وابسته در پایان.', [{ word: 'später kommen', meaning: 'دیرترآمدن' }, { word: 'informieren', meaning: 'اطلاع‌دادن' }, { word: 'per Nachricht', meaning: 'ازطریق پیام' }]),
    sentence('de-v2-b1-conditions-s2', 'Wäre das Wetter besser, könnten wir draußen arbeiten.', 'اگر هوا بهتر بود، می‌توانستیم بیرون کار کنیم.', 'وِرِه داس وِتِر بِسِر، کونتِن ویر دراوسِن آربایتِن', 'draußen', 'بیرون؛ در فضای باز', 'Konjunktiv II فرضی با wäre و könnten.', [{ word: 'das Wetter', meaning: 'هوا' }, { word: 'besser', meaning: 'بهتر' }, { word: 'arbeiten', meaning: 'کارکردن' }]),
    sentence('de-v2-b1-conditions-s3', 'Je früher wir anfangen, desto mehr Zeit bleibt für Fragen.', 'هرچه زودتر شروع کنیم، وقت بیشتری برای پرسش‌ها می‌ماند.', 'یه فرویِر ویر آن‌فانگِن، دِستو مِر تسایت بلایبت فور فراگِن', 'je … desto …', 'هرچه …، به همان نسبت …', 'je + صفت مقایسه‌ای، desto + صفت مقایسه‌ای.', [{ word: 'früher', meaning: 'زودتر' }, { word: 'anfangen', meaning: 'شروع‌کردن' }, { word: 'die Frage', meaning: 'پرسش' }]),
    sentence('de-v2-b1-conditions-s4', 'An deiner Stelle würde ich zuerst nach einer Alternative suchen.', 'اگر جای تو بودم، اول دنبال گزینهٔ دیگری می‌گشتم.', 'اَن داینِر شتِلِه ووردِه ایش تسوئِرست ناخ آینِر آلتِرناتیوِه زوخِن', 'an deiner Stelle', 'اگر جای تو بودم', 'Konjunktiv II برای توصیه.', [{ word: 'die Alternative', meaning: 'گزینهٔ جایگزین' }, { word: 'zuerst', meaning: 'اول؛ ابتدا' }, { word: 'suchen', meaning: 'جست‌وجوکردن' }]),
    sentence('de-v2-b1-conditions-s5', 'Damit niemand etwas übersieht, fasse ich die wichtigsten Punkte schriftlich zusammen.', 'برای اینکه چیزی از قلم نیفتد، نکات مهم را مکتوب خلاصه می‌کنم.', 'دامیت نیمانت اِتواس اوبِرزی‌ت، فاسِه ایش دی ویشتیگستِن پونکتِه شریفتلیش تسوزامن', 'zusammenfassen', 'خلاصه‌کردن', 'damit + فعل در پایان جملهٔ وابسته.', [{ word: 'übersehen', meaning: 'از قلم انداختن؛ متوجه‌نشدن' }, { word: 'der Punkt', meaning: 'نکته' }, { word: 'schriftlich', meaning: 'مکتوب' }]),
  ], [
    { speaker: 'همکار', text: 'Was machen wir, falls der Bus zu spät kommt?', fa: 'اگر اتوبوس خیلی دیر کند چه‌کار می‌کنیم؟' },
    { speaker: 'شما', text: 'Wir informieren alle per Nachricht.', fa: 'با پیام به همه اطلاع می‌دهیم.' },
    { speaker: 'همکار', text: 'Und wenn es regnet?', fa: 'و اگر باران ببارد؟' },
    { speaker: 'شما', text: 'Dann gehen wir in den Saal. Ich fasse die Änderungen schriftlich zusammen.', fa: 'آن‌وقت به سالن می‌رویم. تغییرات را مکتوب خلاصه می‌کنم.' },
  ]),
  lesson(3, 23, 'de-v2-b1-process-instructions', 'فرایندها و دستورالعمل‌ها', 'مراحل را دقیق و روشن توضیح دهید.', 'برای همکارتان توضیح می‌دهید سفارش یا فرم چگونه بررسی و تکمیل می‌شود.', 'در اطلاعیه‌ها و دستورالعمل‌ها مجهول رایج است. با nachdem ترتیب دو مرحله را مشخص کنید؛ فعل‌های وجهی هم در مجهول با werden می‌آیند.', [
    sentence('de-v2-b1-process-s1', 'Nachdem die Bestellung eingegangen ist, wird sie innerhalb von zwei Tagen bearbeitet.', 'پس از ثبت سفارش، ظرف دو روز پردازش می‌شود.', 'ناخدِم دی بِشتِلونگ آین‌گِگانگِن ایست، ویرت زی اینِر‌هالب فون تسوای تاگِن بِآربایتِت', 'bearbeiten', 'پردازش‌کردن؛ بررسی‌کردن', 'مجهول حال: wird + Partizip II.', [{ word: 'die Bestellung', meaning: 'سفارش' }, { word: 'eingehen', meaning: 'دریافت یا ثبت‌شدن' }, { word: 'innerhalb von', meaning: 'ظرفِ؛ در بازهٔ' }]),
    sentence('de-v2-b1-process-s2', 'Die Unterlagen müssen vollständig ausgefüllt werden.', 'مدارک باید به‌طور کامل تکمیل شوند.', 'دی اونتِرلاگِن موسِن فولشتِندیش آوس‌گِفولْت وِردِن', 'vollständig', 'کامل؛ تمام‌وکمال', 'مجهول با فعل وجهی: müssen + Partizip II + werden.', [{ word: 'die Unterlagen', meaning: 'مدارک؛ اسناد' }, { word: 'ausfüllen', meaning: 'پرکردن؛ تکمیل‌کردن' }, { word: 'müssen', meaning: 'باید؛ مجبوربودن' }]),
    sentence('de-v2-b1-process-s3', 'In der Anleitung wird Schritt für Schritt erklärt, wie das Gerät eingeschaltet wird.', 'در راهنما مرحله‌به‌مرحله توضیح داده می‌شود که دستگاه چطور روشن می‌شود.', 'این دِر آن‌لایتونگ ویرت شریت فور شریت اِرکلِرت، وی داس گِرِت آین‌گِشالتِت ویرت', 'die Anleitung', 'راهنما؛ دستورالعمل', 'مجهول حال؛ پرسش غیرمستقیم با wie.', [{ word: 'Schritt für Schritt', meaning: 'مرحله‌به‌مرحله' }, { word: 'das Gerät', meaning: 'دستگاه' }, { word: 'einschalten', meaning: 'روشن‌کردن' }]),
    sentence('de-v2-b1-process-s4', 'Bevor das Formular abgeschickt wird, sollten alle Angaben überprüft werden.', 'پیش از ارسال فرم، باید همهٔ اطلاعات بررسی شوند.', 'بِفور داس فورمولار آب‌گِشیکت ویرت، زولتِن آلِه آن‌گابِن اوبِرپروفْت وِردِن', 'die Angabe', 'اطلاعات واردشده؛ داده', 'bevor + مجهول؛ فعل‌ها در پایان.', [{ word: 'abschicken', meaning: 'ارسال‌کردن' }, { word: 'überprüfen', meaning: 'بازبینی‌کردن' }, { word: 'sollten', meaning: 'بهتر است؛ باید' }]),
    sentence('de-v2-b1-process-s5', 'Bei Fragen kann der Kundendienst telefonisch erreicht werden.', 'درصورت داشتن پرسش می‌توان با خدمات مشتری تلفنی تماس گرفت.', 'بای فراگِن کان دِر کونْدِن‌دینست تِلِفونی‌ش اِر‌رایشْت وِردِن', 'telefonisch erreichen', 'تلفنی تماس‌گرفتن با؛ دسترسی‌یافتن به', 'مجهول با فعل وجهی: kann + Partizip II + werden.', [{ word: 'der Kundendienst', meaning: 'خدمات مشتری' }, { word: 'telefonisch', meaning: 'تلفنی' }, { word: 'erreichen', meaning: 'دسترسی‌یافتن به؛ تماس‌گرفتن با' }]),
  ], [
    { speaker: 'همکار', text: 'Was passiert, nachdem die Bestellung eingegangen ist?', fa: 'پس از ثبت سفارش چه اتفاقی می‌افتد؟' },
    { speaker: 'شما', text: 'Sie wird geprüft und innerhalb von zwei Tagen bearbeitet.', fa: 'بررسی می‌شود و ظرف دو روز پردازش می‌شود.' },
    { speaker: 'همکار', text: 'Müssen die Unterlagen unterschrieben werden?', fa: 'مدارک باید امضا شوند؟' },
    { speaker: 'شما', text: 'Ja. Alle Angaben sollten vorher überprüft werden.', fa: 'بله. بهتر است همهٔ اطلاعات از قبل بازبینی شوند.' },
  ]),
  lesson(3, 24, 'de-v2-b1-formal-correspondence', 'نامه و پیام رسمی', 'درخواست رسمی را دقیق و مودبانه بنویسید.', 'برای پیگیری صورت‌حساب و زمان تعمیر، ایمیلی رسمی به یک شرکت خدماتی می‌نویسید.', 'در نامهٔ رسمی از Sie و فعل‌های مؤدبانه مانند könnten استفاده کنید. um die Sie gebeten haben یک جملهٔ موصولی با حرف اضافه است.', [
    sentence('de-v2-b1-correspondence-s1', 'Sehr geehrte Frau Müller, ich schreibe Ihnen, weil ich eine Frage zur Rechnung habe.', 'خانم مولر گرامی، برایتان می‌نویسم چون دربارهٔ صورت‌حساب پرسشی دارم.', 'زِر گِئرتِه فراو مولِر، ایش شرایبِه اینِن، وایل ایش آینِه فراگِه تسور رِخنونگ هابِه', 'die Rechnung', 'صورت‌حساب؛ فاکتور', 'نامهٔ رسمی؛ weil + فعل در پایان.', [{ word: 'Sehr geehrte Frau …', meaning: 'سرکار خانم … گرامی' }, { word: 'Ihnen', meaning: 'به شما؛ خطاب رسمی' }, { word: 'die Frage', meaning: 'پرسش' }]),
    sentence('de-v2-b1-correspondence-s2', 'Könnten Sie mir bitte mitteilen, wann die Reparatur abgeschlossen wird?', 'ممکن است لطفاً به من اطلاع دهید تعمیر چه زمانی به پایان می‌رسد؟', 'کونتِن زی میر بیتِه میت‌تایلِن، وان دی رِپاراتور آب‌گِشْلوسِن ویرت؟', 'mitteilen', 'اطلاع‌دادن؛ اعلام‌کردن', 'درخواست مؤدبانه با könnten؛ پرسش غیرمستقیم.', [{ word: 'Könnten Sie …?', meaning: 'ممکن است لطفاً …؟' }, { word: 'die Reparatur', meaning: 'تعمیر' }, { word: 'abschließen', meaning: 'به پایان‌رساندن' }]),
    sentence('de-v2-b1-correspondence-s3', 'Im Anhang finden Sie die Unterlagen, um die Sie gebeten haben.', 'در پیوست مدارکی را می‌یابید که درخواست کرده بودید.', 'ایم آن‌هانگ فیندِن زی دی اونتِرلاگِن، اوم دی زی گِبیتِن هابِن', 'der Anhang', 'پیوست؛ ضمیمه', 'جملهٔ موصولی با حرف اضافه در آغاز.', [{ word: 'im Anhang', meaning: 'در پیوست' }, { word: 'um etwas bitten', meaning: 'درخواست چیزی‌کردن' }, { word: 'die Unterlage', meaning: 'مدرک؛ سند' }]),
    sentence('de-v2-b1-correspondence-s4', 'Falls Sie weitere Informationen benötigen, sende ich sie Ihnen gern zu.', 'اگر به اطلاعات بیشتری نیاز داشته باشید، باکمال میل برایتان می‌فرستم.', 'فالس زی وایتِرِه اینفورماتسیونِن بِنوتیگِن، زِندِه ایش زی اینِن گِرن تسو', 'zusenden', 'برای کسی فرستادن', 'Falls …, فعل جملهٔ وابسته در پایان.', [{ word: 'weitere Informationen', meaning: 'اطلاعات بیشتر' }, { word: 'benötigen', meaning: 'نیازداشتن' }, { word: 'gern', meaning: 'با کمال میل' }]),
    sentence('de-v2-b1-correspondence-s5', 'Vielen Dank im Voraus für Ihre Rückmeldung.', 'پیشاپیش از پاسخ شما بسیار سپاسگزارم.', 'فیلِن دانک ایم فوراوس فور ایرِه روک‌مِلدونگ', 'im Voraus', 'پیشاپیش', undefined, [{ word: 'Vielen Dank', meaning: 'بسیار سپاسگزارم' }, { word: 'Ihre Rückmeldung', meaning: 'پاسخ شما؛ بازخوردتان' }, { word: 'die Rückmeldung', meaning: 'پاسخ؛ بازخورد' }]),
  ], [
    { speaker: 'مشتری', text: 'Wie kann ich die Firma wegen der Rechnung kontaktieren?', fa: 'چطور می‌توانم دربارهٔ صورت‌حساب با شرکت تماس بگیرم؟' },
    { speaker: 'همکار', text: 'Schreiben Sie eine kurze E-Mail und fügen Sie die Unterlagen im Anhang hinzu.', fa: 'یک ایمیل کوتاه بنویسید و مدارک را پیوست کنید.' },
    { speaker: 'مشتری', text: 'Soll ich auch nach dem Reparaturtermin fragen?', fa: 'دربارهٔ زمان تعمیر هم بپرسم؟' },
    { speaker: 'همکار', text: 'Ja, fragen Sie höflich, wann die Reparatur abgeschlossen wird.', fa: 'بله، مؤدبانه بپرسید تعمیر چه زمانی تمام می‌شود.' },
  ]),
  lesson(3, 25, 'de-v2-b1-integrated-conversation', 'گفت‌وگوی ترکیبی B1', 'تجربه، دلیل و پیشنهاد را پیوسته بیان کنید.', 'در گفت‌وگویی دربارهٔ یک پروژهٔ محلی، تجربهٔ گذشته را به برنامهٔ آینده و راه‌حل عملی پیوند می‌دهید.', 'این درس جمع‌بندی تمرینی و بدون نمره است، نه آزمون یا مدرک. روایت گذشته، جمله‌های موصولی، مجهول، پیوندهای استدلال و پیشنهاد مؤدبانه را در بافت تازه تمرین کنید.', [
    sentence('de-v2-b1-capstone-s1', 'Als ich vor zwei Jahren in die neue Stadt zog, kannte ich dort niemanden.', 'وقتی دو سال پیش به شهر تازه نقل‌مکان کردم، آنجا کسی را نمی‌شناختم.', 'آلس ایش فور تسوای یارِن این دی نویِه شتات تسوگ، کَنتِه ایش دُرت نیماندِن', 'niemanden kennen', 'هیچ‌کس را نشناختن', 'als برای رویدادی یگانه در گذشته.', [{ word: 'vor zwei Jahren', meaning: 'دو سال پیش' }, { word: 'umziehen', meaning: 'نقل‌مکان‌کردن' }, { word: 'niemand', meaning: 'هیچ‌کس' }]),
    sentence('de-v2-b1-capstone-s2', 'Über einen Kurs lernte ich Kolleginnen kennen, mit denen ich heute ein Projekt plane.', 'ازطریق دوره‌ای با همکارانی آشنا شدم که امروز با آن‌ها پروژه‌ای برنامه‌ریزی می‌کنم.', 'اوبِر آینِن کورس لِرنتِه ایش کولِگینِن کِنِن، میت دینِن ایش هویته آین پرویِکت پلانِه', 'mit denen', 'با آن‌ها؛ برای اسم جمع مؤنث', 'جملهٔ موصولی با mit denen؛ فعل در پایان.', [{ word: 'über einen Kurs', meaning: 'ازطریق یک دوره' }, { word: 'die Kollegin', meaning: 'همکار زن' }, { word: 'planen', meaning: 'برنامه‌ریزی‌کردن' }]),
    sentence('de-v2-b1-capstone-s3', 'Obwohl wir unterschiedliche Ideen haben, können wir offen darüber sprechen.', 'بااینکه ایده‌های متفاوتی داریم، می‌توانیم صریح درباره‌شان صحبت کنیم.', 'اوب‌وُل ویر اونتِرشیدلیشِه ایدیِن هابِن، کونِن ویر اُفِن داروبِر شپِرِشِن', 'darüber sprechen', 'دربارهٔ آن صحبت‌کردن', 'obwohl + فعل در پایان جملهٔ وابسته.', [{ word: 'unterschiedliche Ideen', meaning: 'ایده‌های متفاوت' }, { word: 'offen', meaning: 'صریح؛ آشکارا' }, { word: 'sprechen können', meaning: 'توانستن صحبت‌کردن' }]),
    sentence('de-v2-b1-capstone-s4', 'Wenn die Finanzierung klappt, wird unser Plan im Herbst umgesetzt.', 'اگر تأمین مالی انجام شود، برنامه‌مان پاییز اجرا خواهد شد.', 'وِن دی فینانتسیرونگ کلاپت، ویرت اونزِر پلان ایم هِربست اوم‌گِزِتست', 'die Finanzierung', 'تأمین مالی', 'Wenn + حال؛ مجهول آینده با wird + Partizip II.', [{ word: 'klappen', meaning: 'عملی‌شدن؛ موفق‌شدن' }, { word: 'umsetzen', meaning: 'اجراکردن؛ پیاده‌سازی‌کردن' }, { word: 'im Herbst', meaning: 'در پاییز' }]),
    sentence('de-v2-b1-capstone-s5', 'Diese Erfahrung hat mir gezeigt, dass gute Zusammenarbeit vor allem Vertrauen braucht.', 'این تجربه به من نشان داد که همکاری خوب بیش از هر چیز به اعتماد نیاز دارد.', 'دیزِه اِرفارونگ هات میر گِتسایگت، داس گوتِه تسوزامِن‌آربایت فور آلِم فِرتراوِن براوخت', 'das Vertrauen', 'اعتماد', 'dass + فعل در پایان جملهٔ وابسته.', [{ word: 'die Zusammenarbeit', meaning: 'همکاری' }, { word: 'vor allem', meaning: 'بیش از هر چیز؛ به‌ویژه' }, { word: 'brauchen', meaning: 'نیازداشتن' }]),
  ], [
    { speaker: 'همکار', text: 'Wie bist du auf die Idee für das Projekt gekommen?', fa: 'چطور ایدهٔ این پروژه به ذهنت رسید؟' },
    { speaker: 'شما', text: 'Als ich hierherzog, kannte ich niemanden. Über einen Kurs habe ich viele Menschen kennengelernt.', fa: 'وقتی به اینجا نقل‌مکان کردم، کسی را نمی‌شناختم. ازطریق یک دوره با افراد زیادی آشنا شدم.' },
    { speaker: 'همکار', text: 'Was machen wir, wenn die Finanzierung klappt?', fa: 'اگر تأمین مالی انجام شود، چه‌کار می‌کنیم؟' },
    { speaker: 'شما', text: 'Dann setzen wir den Plan im Herbst um. Wichtig ist, dass wir weiter offen zusammenarbeiten.', fa: 'آن‌وقت پاییز برنامه را اجرا می‌کنیم. مهم است که همچنان صریح با هم همکاری کنیم.' },
  ]),

];


// Preserve all existing lessons and samples in place; append additions only to the requested foundation bands.
export const GERMAN_SENTENCE_LESSONS: GermanSentenceCourseLesson[] = BASE_GERMAN_SENTENCE_LESSONS.map(item => {
  if (item.levelId === 0) {
    const additions = PRE_A1_SENTENCE_ADDITIONS[item.id] ?? [];
    return additions.length ? { ...item, durationMinutes: 20, sentences: [...item.sentences, ...additions] } : item;
  }
  if (item.levelId === 1) {
    const additions = A1_SENTENCE_ADDITIONS[item.id] ?? [];
    const teachingNote = A1_EXPANSION_TEACHING_NOTES[item.id];
    return additions.length ? {
      ...item,
      durationMinutes: 25,
      ...(teachingNote ? { teachingFa: `${item.teachingFa ?? ''} ${teachingNote}`.trim() } : {}),
      sentences: [...item.sentences, ...additions],
    } : item;
  }
  if (item.levelId === 2) {
    const additions = A2_SENTENCE_ADDITIONS[item.id] ?? [];
    const teachingNote = A2_EXPANSION_TEACHING_NOTES[item.id];
    return additions.length ? {
      ...item,
      durationMinutes: 30,
      ...(teachingNote ? { teachingFa: `${item.teachingFa ?? ''} ${teachingNote}`.trim() } : {}),
      sentences: [...item.sentences, ...additions],
    } : item;
  }
  if (item.levelId === 3) {
    const additions = B1_SENTENCE_ADDITIONS[item.id] ?? [];
    const teachingNote = B1_EXPANSION_TEACHING_NOTES[item.id];
    return additions.length ? {
      ...item,
      durationMinutes: 35,
      ...(teachingNote ? { teachingFa: `${item.teachingFa ?? ''} ${teachingNote}`.trim() } : {}),
      sentences: [...item.sentences, ...additions],
    } : item;
  }
  return item;
});

const PRE_A1_EXTRA_VOCABULARY: Record<string, Array<{ word: string; meaning: string }>> = {
  'de-v2-greetings-s3': [{ word: 'gehen', meaning: 'رفتن؛ در عبارت احوال‌پرسی' }, { word: 'dir', meaning: 'به تو؛ حالت' }],
  'de-v2-greetings-s4': [{ word: 'danke', meaning: 'ممنون' }, { word: 'mir', meaning: 'به من؛ حالم' }],
  'de-v2-greetings-s5': [{ word: 'bald', meaning: 'به‌زودی' }],
  'de-v2-name-s1': [{ word: 'ich', meaning: 'من' }, { word: 'Mina', meaning: 'مینا؛ نام نمونه' }],
  'de-v2-name-s2': [{ word: 'wie', meaning: 'چطور؛ چگونه' }, { word: 'heißen', meaning: 'نام داشتن' }],
  'de-v2-name-s3': [{ word: 'der Iran', meaning: 'ایران' }, { word: 'aus', meaning: 'از' }],
  'de-v2-name-s4': [{ word: 'kommen', meaning: 'آمدن؛ اهل جایی بودن' }],
  'de-v2-name-s5': [{ word: 'Berlin', meaning: 'برلین' }, { word: 'in', meaning: 'در' }],
  'de-v2-class-s1': [{ word: 'lernen', meaning: 'یادگرفتن' }, { word: 'ich', meaning: 'من' }],
  'de-v2-class-s2': [{ word: 'mein', meaning: 'مال من' }, { word: 'sein', meaning: 'بودن' }],
  'de-v2-class-s3': [{ word: 'bedeuten', meaning: 'معنی‌دادن' }, { word: 'dieses', meaning: 'این؛ شکل خنثی' }, { word: 'was', meaning: 'چه؛ چه چیزی' }],
  'de-v2-class-s4': [{ word: 'können', meaning: 'توانستن' }, { word: 'Sie', meaning: 'شما؛ خطاب رسمی' }, { word: 'bitte', meaning: 'لطفاً' }],
  'de-v2-class-s5': [{ word: 'verstehen', meaning: 'فهمیدن' }, { word: 'ich', meaning: 'من' }],
  'de-v2-number-s1': [{ word: 'sein', meaning: 'بودن' }, { word: 'das Jahr', meaning: 'سال' }, { word: 'alt', meaning: 'ساله؛ پیر' }],
  'de-v2-number-s2': [{ word: 'haben', meaning: 'داشتن' }, { word: 'der Bruder', meaning: 'برادر' }],
  'de-v2-number-s3': [{ word: 'neun', meaning: 'نه' }, { word: 'sein', meaning: 'بودن' }],
  'de-v2-number-s4': [{ word: 'der Kurs', meaning: 'کلاس؛ دوره' }, { word: 'zehn', meaning: 'ده' }, { word: 'um', meaning: 'در؛ ساعتِ' }],
  'de-v2-number-s5': [{ word: 'brauchen', meaning: 'نیازداشتن' }],
  'de-v2-needs-s1': [{ word: 'ein', meaning: 'یک؛ حرف تعریف نکره' }, { word: 'bitte', meaning: 'لطفاً' }],
  'de-v2-needs-s2': [{ word: 'brauchen', meaning: 'نیازداشتن' }, { word: 'ich', meaning: 'من' }],
  'de-v2-needs-s3': [{ word: 'wo', meaning: 'کجا' }, { word: 'sein', meaning: 'بودن' }],
  'de-v2-needs-s4': [{ word: 'können', meaning: 'توانستن' }, { word: 'Sie', meaning: 'شما؛ خطاب رسمی' }, { word: 'mir', meaning: 'به من' }],
  'de-v2-needs-s5': [{ word: 'danke', meaning: 'ممنون' }],
};

for (const lesson of GERMAN_SENTENCE_LESSONS) {
  if (lesson.levelId !== 0) continue;
  for (const sample of lesson.sentences) {
    sample.vocabulary.push(...(PRE_A1_EXTRA_VOCABULARY[sample.id] ?? []));
  }
}

/** Keep returning learners who finished the original A2 set from skipping its new modules. */
export const getGermanSentenceResumeLesson = (
  currentLessonId: string | undefined,
  completedLessonIds: readonly string[] = [],
): GermanSentenceCourseLesson => {
  const completed = new Set(completedLessonIds);
  const savedLesson = GERMAN_SENTENCE_LESSONS.find(lesson => lesson.id === currentLessonId);
  const a2Lessons = GERMAN_SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2);
  const firstNewA2Lesson = a2Lessons.slice(5).find(lesson => !completed.has(lesson.id));
  if (savedLesson?.levelId === 3 && a2Lessons.slice(0, 5).every(lesson => completed.has(lesson.id)) && firstNewA2Lesson) {
    return firstNewA2Lesson;
  }
  if (savedLesson && !completed.has(savedLesson.id)) return savedLesson;
  return GERMAN_SENTENCE_LESSONS.find(lesson => !completed.has(lesson.id))
    ?? GERMAN_SENTENCE_LESSONS[GERMAN_SENTENCE_LESSONS.length - 1];
};

export const germanSentenceLevelMetrics = (levelId: GermanSentenceLevelId) => {
  const lessons = GERMAN_SENTENCE_LESSONS.filter(item => item.levelId === levelId);
  return {
    lessonCount: lessons.length,
    sentenceCount: lessons.reduce((count, item) => count + item.sentences.length, 0),
    vocabularyCount: new Set(lessons.flatMap(item => item.sentences.flatMap(sentence => sentence.vocabulary.map(word => word.word)))).size,
  };
};
