import { GERMAN_EVERYDAY_LESSONS } from './germanEveryday';
import type { LearningLesson, LearningSentence } from './types';
const sentence = (id: string, text: string, fa: string, pronunciation: string, word: string, meaning: string): LearningSentence => ({
  id, text, fa, pronunciation, vocabulary: [{ word, meaning }],
});
/** Original starter material, not a complete A1 course. Persian pronunciation is approximate. */
export const GERMAN_STARTER_LESSONS: LearningLesson[] = [
  {
    id: 'de-greetings', title: 'سلام و خداحافظی', durationMinutes: 6,
    situation: 'با کسی آشنا می‌شوید؛ سلام می‌کنید، احوال می‌پرسید و خداحافظی می‌کنید. در این درس از خطاب دوستانه du استفاده می‌کنیم.',
    sentences: [
      sentence('de-g1', 'Hallo!', 'سلام!', 'هالو', 'hallo', 'سلام'),
      sentence('de-g2', 'Guten Morgen!', 'صبح بخیر!', 'گوتِن مورگِن', 'der Morgen', 'صبح'),
      sentence('de-g3', 'Wie geht es dir?', 'حالت چطور است؟', 'وی گِیت اِس دیر؟', 'dir', 'به تو / برای تو'),
      sentence('de-g4', 'Mir geht es gut, danke.', 'حالم خوب است، ممنون.', 'میر گِیت اِس گوت، دانکِه', 'gut', 'خوب'),
      sentence('de-g5', 'Auf Wiedersehen!', 'خداحافظ!', 'آوف ویدِرزِهِن', 'auf Wiedersehen', 'خداحافظ؛ تا دیدار بعد'),
    ],
    dialogue: [
      { speaker: 'آنا', text: 'Hallo! Wie geht es dir?', fa: 'سلام! حالت چطور است؟' },
      { speaker: 'شما', text: 'Mir geht es gut, danke. Und dir?', fa: 'حالم خوب است، ممنون. و تو؟' },
      { speaker: 'آنا', text: 'Auch gut, danke!', fa: 'من هم خوبم، ممنون!' },
    ],
  },
  {
    id: 'de-introductions', title: 'معرفی خود', durationMinutes: 7,
    situation: 'در اولین جلسه کلاس، نام و محل زندگی خود را می‌گویید. پرسش این درس دوستانه است.',
    sentences: [
      sentence('de-i1', 'Ich heiße Sara.', 'اسم من سارا است.', 'ایش هایسِه سارا', 'heißen', 'نام داشتن'),
      sentence('de-i2', 'Wie heißt du?', 'اسم تو چیست؟', 'وی هایست دو؟', 'du', 'تو؛ خطاب دوستانه'),
      sentence('de-i3', 'Ich komme aus dem Iran.', 'من اهل ایران هستم.', 'ایش کومِه آوس دِم ایران', 'kommen', 'آمدن'),
      sentence('de-i4', 'Ich wohne in Berlin.', 'من در برلین زندگی می‌کنم.', 'ایش وونِه این بِرلین', 'wohnen', 'سکونت داشتن'),
      sentence('de-i5', 'Ich lerne Deutsch.', 'من آلمانی یاد می‌گیرم.', 'ایش لِرنِه دویچ', 'Deutsch', 'زبان آلمانی'),
    ],
    dialogue: [
      { speaker: 'لوکاس', text: 'Hallo! Wie heißt du?', fa: 'سلام! اسم تو چیست؟' },
      { speaker: 'شما', text: 'Ich heiße Sara. Ich komme aus dem Iran.', fa: 'اسم من سارا است. من اهل ایران هستم.' },
      { speaker: 'لوکاس', text: 'Willkommen!', fa: 'خوش آمدی!' },
    ],
  },
  {
    id: 'de-polite-help', title: 'درخواست کمک', durationMinutes: 7,
    situation: 'از یک فرد ناآشنا مؤدبانه کمک می‌خواهید. Sie خطاب رسمی است و با حرف بزرگ نوشته می‌شود.',
    sentences: [
      sentence('de-h1', 'Entschuldigung!', 'ببخشید!', 'اِنت‌شولدیگونگ', 'die Entschuldigung', 'عذرخواهی'),
      sentence('de-h2', 'Können Sie mir helfen?', 'می‌توانید به من کمک کنید؟', 'کونِن زی میر هِلفِن؟', 'helfen', 'کمک کردن'),
      sentence('de-h3', 'Ich verstehe nicht.', 'متوجه نمی‌شوم.', 'ایش فِرشتِه نیشت', 'verstehen', 'فهمیدن'),
      sentence('de-h4', 'Bitte sprechen Sie langsam.', 'لطفاً آهسته صحبت کنید.', 'بیتِه شپرِشِن زی لانگزام', 'langsam', 'آهسته'),
      sentence('de-h5', 'Vielen Dank!', 'خیلی ممنون!', 'فیلِن دانک', 'der Dank', 'تشکر'),
    ],
    dialogue: [
      { speaker: 'شما', text: 'Entschuldigung! Können Sie mir helfen?', fa: 'ببخشید! می‌توانید به من کمک کنید؟' },
      { speaker: 'همراه', text: 'Ja, gern.', fa: 'بله، با کمال میل.' },
      { speaker: 'شما', text: 'Bitte sprechen Sie langsam.', fa: 'لطفاً آهسته صحبت کنید.' },
    ],
  },
  {
    id: 'de-numbers', title: 'عددها در زندگی روزمره', durationMinutes: 7,
    situation: 'چند عدد ساده را در جمله‌های مربوط به سن، خانواده، قیمت و زمان تمرین می‌کنید.',
    sentences: [
      sentence('de-n1', 'Ich bin zwanzig Jahre alt.', 'من بیست سال دارم.', 'ایش بین تسوانتسیش یارِه آلت', 'zwanzig', 'بیست'),
      sentence('de-n2', 'Ich habe zwei Brüder.', 'من دو برادر دارم.', 'ایش هابِه تسوای برودِر', 'zwei', 'دو'),
      sentence('de-n3', 'Das kostet fünf Euro.', 'این پنج یورو قیمت دارد.', 'داس کوستِت فونف اُیرو', 'fünf', 'پنج'),
      sentence('de-n4', 'Der Kurs beginnt um neun Uhr.', 'کلاس ساعت نُه شروع می‌شود.', 'دِر کورس بِگینت اوم نویْن اور', 'neun', 'نُه'),
      sentence('de-n5', 'Ich brauche zehn Minuten.', 'من ده دقیقه زمان نیاز دارم.', 'ایش براوخِه تسِین مینوتِن', 'zehn', 'ده'),
    ],
    dialogue: [
      { speaker: 'شما', text: 'Was kostet das?', fa: 'این چقدر قیمت دارد؟' },
      { speaker: 'فروشنده', text: 'Fünf Euro.', fa: 'پنج یورو.' },
      { speaker: 'شما', text: 'Danke!', fa: 'ممنون!' },
    ],
  },
  {
    id: 'de-cafe', title: 'سفارش در کافه', durationMinutes: 8,
    situation: 'در کافه نوشیدنی سفارش می‌دهید و در پایان صورت‌حساب را می‌خواهید.',
    sentences: [
      sentence('de-c1', 'Ich möchte einen Kaffee, bitte.', 'یک قهوه می‌خواهم، لطفاً.', 'ایش موشتِه آینِن کافه، بیتِه', 'der Kaffee', 'قهوه'),
      sentence('de-c2', 'Ein Wasser, bitte.', 'یک آب، لطفاً.', 'آین واسِر، بیتِه', 'das Wasser', 'آب'),
      sentence('de-c3', 'Mit Milch, bitte.', 'با شیر، لطفاً.', 'میت میلش، بیتِه', 'die Milch', 'شیر'),
      sentence('de-c4', 'Ohne Zucker, bitte.', 'بدون شکر، لطفاً.', 'اونِه تسوکِر، بیتِه', 'der Zucker', 'شکر'),
      sentence('de-c5', 'Die Rechnung, bitte.', 'صورت‌حساب، لطفاً.', 'دی رِشنونگ، بیتِه', 'die Rechnung', 'صورت‌حساب'),
    ],
    dialogue: [
      { speaker: 'شما', text: 'Ich möchte einen Kaffee, bitte.', fa: 'یک قهوه می‌خواهم، لطفاً.' },
      { speaker: 'پیشخدمت', text: 'Mit Milch?', fa: 'با شیر؟' },
      { speaker: 'شما', text: 'Ja, bitte. Ohne Zucker.', fa: 'بله، لطفاً. بدون شکر.' },
    ],
  },
  {
    id: 'de-directions', title: 'پرسیدن مسیر', durationMinutes: 8,
    situation: 'در شهر دنبال ایستگاه قطار می‌گردید و چند عبارت ساده جهت‌یابی می‌شنوید.',
    sentences: [
      sentence('de-d1', 'Wo ist der Bahnhof?', 'ایستگاه قطار کجاست؟', 'وو ایست دِر بان‌هوف؟', 'der Bahnhof', 'ایستگاه قطار'),
      sentence('de-d2', 'Gehen Sie geradeaus.', 'مستقیم بروید.', 'گِیِن زی گِرادِه‌آوس', 'geradeaus', 'مستقیم'),
      sentence('de-d3', 'Biegen Sie links ab.', 'به چپ بپیچید.', 'بیگِن زی لینکس اَب', 'links', 'چپ'),
      sentence('de-d4', 'Biegen Sie rechts ab.', 'به راست بپیچید.', 'بیگِن زی رِشتس اَب', 'rechts', 'راست'),
      sentence('de-d5', 'Ist es weit?', 'آیا دور است؟', 'ایست اِس وایت؟', 'weit', 'دور'),
    ],
    dialogue: [
      { speaker: 'شما', text: 'Entschuldigung, wo ist der Bahnhof?', fa: 'ببخشید، ایستگاه قطار کجاست؟' },
      { speaker: 'رهگذر', text: 'Gehen Sie geradeaus. Biegen Sie dann rechts ab.', fa: 'مستقیم بروید. سپس به راست بپیچید.' },
      { speaker: 'شما', text: 'Vielen Dank!', fa: 'خیلی ممنون!' },
    ],
  },
];

/** Append-only expansion: original IDs and storage key are unchanged. */
export const GERMAN_LESSONS: LearningLesson[] = [...GERMAN_STARTER_LESSONS, ...GERMAN_EVERYDAY_LESSONS];
