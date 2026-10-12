import type { LearningSentence } from './types';

type VocabularyEntry = { word: string; meaning: string };
type Example = { text: string; fa: string; vocabulary: VocabularyEntry[]; pattern?: string };
type Recipe<T> = { lessonId: string; seeds: T[]; render: (seed: T) => [Example, Example, Example] };

// This is deliberately approximate: it is a Persian reading aid, not German phonetic transcription.
function approximatePronunciation(text: string): string {
  const germanNumbers: Record<string, string> = {
    '0': 'null', '1': 'eins', '2': 'zwei', '3': 'drei', '4': 'vier',
    '5': 'fünf', '6': 'sechs', '7': 'sieben', '8': 'acht', '9': 'neun',
    '10': 'zehn', '11': 'elf', '12': 'zwölf', '13': 'dreizehn', '14': 'vierzehn',
    '15': 'fünfzehn', '16': 'sechzehn', '17': 'siebzehn', '18': 'achtzehn',
    '19': 'neunzehn', '20': 'zwanzig', '21': 'einundzwanzig',
  };
  const germanLetterNames: Record<string, string> = {
    A: 'آ', B: 'بِه', C: 'تسه', D: 'ده', E: 'اِ', F: 'اِف', G: 'گه', H: 'ها',
    I: 'ای', J: 'یوت', K: 'کا', L: 'اِل', M: 'اِم', N: 'اِن', O: 'او', P: 'په',
    Q: 'کو', R: 'اِر', S: 'اِس', T: 'ته', U: 'او', V: 'فاو', W: 'وه', X: 'اِکس',
    Y: 'اوپسیلون', Z: 'تسه‌ت',
  };
  const readableNumbers = text.replace(/\d+/g, digits => digits.length > 4
    ? digits.split('').map(digit => germanNumbers[digit]).join(' ')
    : germanNumbers[digits] ?? digits);
  const readableLetters = readableNumbers
    .replace(/\b(?:[A-Z]-){2,}[A-Z]\b/g, spelling => spelling.split('-').map(letter => germanLetterNames[letter]).join('، '))
    .replace(/\b[A-Z]\b/g, letter => germanLetterNames[letter] ?? letter);
  return readableLetters
    .replace(/tsch/gi, 'چ').replace(/sch/gi, 'ش')
    .replace(/ch(?=[ieyäöü])/gi, 'ش').replace(/ch/gi, 'خ')
    .replace(/qu/gi, 'کو').replace(/äu|eu/gi, 'اوی')
    .replace(/ei/gi, 'آی').replace(/ie/gi, 'ی').replace(/au/gi, 'آو')
    .replace(/(^|\s)sp/gi, '$1شپ').replace(/(^|\s)st/gi, '$1شت')
    .replace(/ß|ss/gi, 'س').replace(/ä/gi, 'اِ').replace(/ö/gi, 'اُ').replace(/ü/gi, 'او')
    .replace(/ph/gi, 'ف').replace(/v/gi, 'ف').replace(/w/gi, 'و').replace(/j/gi, 'ی').replace(/z/gi, 'تس')
    .replace(/(^|\s)s(?=[aeiouäöü])/gi, '$1ز')
    .replace(/c/gi, 'ک').replace(/x/gi, 'کس').replace(/q/gi, 'ک')
    .replace(/a/gi, 'ا').replace(/e/gi, 'ِ').replace(/i/gi, 'ی').replace(/o/gi, 'اُ').replace(/u/gi, 'او').replace(/y/gi, 'ی')
    .replace(/b/gi, 'ب').replace(/d/gi, 'د').replace(/f/gi, 'ف').replace(/g/gi, 'گ').replace(/h/gi, 'ه')
    .replace(/k/gi, 'ک').replace(/l/gi, 'ل').replace(/m/gi, 'م').replace(/n/gi, 'ن').replace(/p/gi, 'پ')
    .replace(/r/gi, 'ر').replace(/s/gi, 'س').replace(/t/gi, 'ت');
}
function example(text: string, fa: string, frameWord: string, frameMeaning: string, pattern?: string, additionalVocabulary: VocabularyEntry[] = []): Example {
  return { text, fa, vocabulary: [{ word: frameWord, meaning: frameMeaning }, ...additionalVocabulary], ...(pattern ? { pattern } : {}) };
}

function build<T>(recipe: Recipe<T>): LearningSentence[] {
  return recipe.seeds.flatMap((seed, seedIndex) => recipe.render(seed).map((sample, variantIndex) => ({
    id: `${recipe.lessonId}-extra-${String(seedIndex * 3 + variantIndex + 1).padStart(2, '0')}`,
    text: sample.text,
    fa: sample.fa,
    pronunciation: approximatePronunciation(sample.text),
    ...(sample.pattern ? { pattern: sample.pattern } : {}),
    vocabulary: sample.vocabulary,
  })));
}

const greetings = build<{
  name: string; greeting: string; greetingFa: string;
}>(
  {
    lessonId: 'de-v2-greetings',
    seeds: [
      { name: 'Mina', greeting: 'Hallo', greetingFa: 'سلام' },
      { name: 'Sara', greeting: 'Guten Morgen', greetingFa: 'صبح بخیر' },
      { name: 'Amir', greeting: 'Guten Tag', greetingFa: 'روز بخیر' },
      { name: 'Lea', greeting: 'Guten Abend', greetingFa: 'عصر بخیر' },
      { name: 'Omar', greeting: 'Hallo', greetingFa: 'سلام' },
      { name: 'Lina', greeting: 'Guten Morgen', greetingFa: 'صبح بخیر' },
      { name: 'Paul', greeting: 'Guten Tag', greetingFa: 'روز بخیر' },
      { name: 'Nora', greeting: 'Guten Abend', greetingFa: 'عصر بخیر' },
      { name: 'Ali', greeting: 'Hallo', greetingFa: 'سلام' },
      { name: 'Emma', greeting: 'Guten Morgen', greetingFa: 'صبح بخیر' },
      { name: 'David', greeting: 'Guten Tag', greetingFa: 'روز بخیر' },
      { name: 'Hana', greeting: 'Guten Abend', greetingFa: 'عصر بخیر' },
      { name: 'Mia', greeting: 'Hallo', greetingFa: 'سلام' },
      { name: 'Noah', greeting: 'Guten Morgen', greetingFa: 'صبح بخیر' },
      { name: 'Luca', greeting: 'Guten Tag', greetingFa: 'روز بخیر' },
    ],
    render: ({ name, greeting, greetingFa }) => [
      example(`${greeting}, ${name}!`, `${greetingFa}، ${name}!`, 'die Begrüßung', 'سلام و احوال‌پرسی'),
      example(`Wie geht es dir, ${name}?`, `حالت چطور است، ${name}؟`, 'Wie geht es dir?', 'حالت چطور است؟'),
      example(`Mir geht es gut, danke, ${name}.`, `حالم خوب است، ممنون، ${name}.`, 'Mir geht es gut', 'حالم خوب است'),
    ],
  },
);

const nameOrigin = build<{
  name: string; city: string; country: string; countryFa: string;
}>(
  {
    lessonId: 'de-v2-name-origin',
    seeds: [
      { name: 'Julia', city: 'Köln', country: 'Japan', countryFa: 'ژاپن' },
      { name: 'Ben', city: 'Frankfurt', country: 'Frankreich', countryFa: 'فرانسه' },
      { name: 'Yusuf', city: 'Leipzig', country: 'Ägypten', countryFa: 'مصر' },
      { name: 'Clara', city: 'Dresden', country: 'Italien', countryFa: 'ایتالیا' },
      { name: 'David', city: 'Bremen', country: 'Spanien', countryFa: 'اسپانیا' },
      { name: 'Amina', city: 'Hannover', country: 'Syrien', countryFa: 'سوریه' },
      { name: 'Leon', city: 'Nürnberg', country: 'Österreich', countryFa: 'اتریش' },
      { name: 'Elena', city: 'Freiburg', country: 'der Schweiz', countryFa: 'سوئیس' },
      { name: 'Jonas', city: 'Bonn', country: 'Portugal', countryFa: 'پرتغال' },
      { name: 'Farah', city: 'Aachen', country: 'der Türkei', countryFa: 'ترکیه' },
      { name: 'Max', city: 'Mainz', country: 'Deutschland', countryFa: 'آلمان' },
      { name: 'Eva', city: 'Potsdam', country: 'Kanada', countryFa: 'کانادا' },
      { name: 'Tom', city: 'Augsburg', country: 'Indien', countryFa: 'هند' },
      { name: 'Sofia', city: 'Kiel', country: 'den USA', countryFa: 'آمریکا' },
      { name: 'Daniel', city: 'Rostock', country: 'China', countryFa: 'چین' },
    ],
    render: ({ name, city, country, countryFa }) => [
      example(`Ich heiße ${name}.`, `اسم من ${name} است.`, 'heißen', 'نام‌داشتن'),
      example(`Ich wohne in ${city}.`, `من در ${city} زندگی می‌کنم.`, 'wohnen', 'زندگی‌کردن'),
      example(`Ich komme aus ${country}.`, `من اهل ${countryFa} هستم.`, 'kommen aus', 'اهل جایی‌بودن؛ از جایی‌آمدن'),
    ],
  },
);

const classroom = build<{
  word: string; meaning: string; mine: string; mineAcc: string;
}>(
  {
    lessonId: 'de-v2-classroom',
    seeds: [
      { word: 'das Buch', meaning: 'کتاب', mine: 'mein Buch hier', mineAcc: 'mein Buch' },
      { word: 'das Heft', meaning: 'دفتر', mine: 'mein Heft', mineAcc: 'mein Heft' },
      { word: 'der Stift', meaning: 'خودکار', mine: 'mein Stift', mineAcc: 'meinen Stift' },
      { word: 'der Bleistift', meaning: 'مداد', mine: 'mein Bleistift', mineAcc: 'meinen Bleistift' },
      { word: 'die Tasche', meaning: 'کیف', mine: 'meine Tasche', mineAcc: 'meine Tasche' },
      { word: 'das Wörterbuch', meaning: 'فرهنگ لغت', mine: 'mein Wörterbuch', mineAcc: 'mein Wörterbuch' },
      { word: 'das Lineal', meaning: 'خط‌کش', mine: 'mein Lineal', mineAcc: 'mein Lineal' },
      { word: 'der Radiergummi', meaning: 'پاک‌کن', mine: 'mein Radiergummi', mineAcc: 'meinen Radiergummi' },
      { word: 'das Papier', meaning: 'کاغذ', mine: 'mein Papier', mineAcc: 'mein Papier' },
      { word: 'die Tafel', meaning: 'تختهٔ کلاس', mine: 'meine Tafel', mineAcc: 'meine Tafel' },
      { word: 'die Kreide', meaning: 'گچ', mine: 'meine Kreide', mineAcc: 'meine Kreide' },
      { word: 'der Computer', meaning: 'رایانه', mine: 'mein Computer', mineAcc: 'meinen Computer' },
      { word: 'das Handy', meaning: 'گوشی', mine: 'mein Handy', mineAcc: 'mein Handy' },
      { word: 'der Schlüssel', meaning: 'کلید', mine: 'mein Schlüssel', mineAcc: 'meinen Schlüssel' },
      { word: 'die Schere', meaning: 'قیچی', mine: 'meine Schere', mineAcc: 'meine Schere' },
    ],
    render: ({ word, meaning, mine, mineAcc }) => [
      example(mine === 'mein Buch hier' ? 'Mein Buch liegt hier.' : `Das ist ${mine}.`, mine === 'mein Buch hier' ? 'کتاب من اینجاست.' : `این ${meaning} من است.`, word, meaning, 'برای نام‌بردن و نشان‌دادن وسایل کلاس.'),
      example(`Wo ist ${mine === 'mein Buch hier' ? 'mein Buch' : mine}?`, `${meaning} من کجاست؟`, word, meaning, 'Wo ist …? برای پرسیدن جای یک شیء.'),
      example(`Ich brauche ${mineAcc}.`, `من به ${meaning} نیاز دارم.`, word, meaning, 'brauchen + مفعول مستقیم.'),
    ],
  },
);

const times = build<{ time: string; fa: string }>(
  {
    lessonId: 'de-v2-numbers-time',
    seeds: [
      { time: 'sechs Uhr', fa: 'ساعت شش' }, { time: 'sieben Uhr', fa: 'ساعت هفت' },
      { time: 'acht Uhr', fa: 'ساعت هشت' }, { time: 'zweiundzwanzig Uhr', fa: 'ساعت بیست‌ودو' },
      { time: 'einundzwanzig Uhr', fa: 'ساعت بیست‌ویک' }, { time: 'elf Uhr', fa: 'ساعت یازده' },
      { time: 'zwölf Uhr', fa: 'ساعت دوازده' }, { time: 'dreizehn Uhr', fa: 'ساعت سیزده' },
      { time: 'vierzehn Uhr', fa: 'ساعت چهارده' }, { time: 'fünfzehn Uhr', fa: 'ساعت پانزده' },
      { time: 'sechzehn Uhr', fa: 'ساعت شانزده' }, { time: 'siebzehn Uhr', fa: 'ساعت هفده' },
      { time: 'achtzehn Uhr', fa: 'ساعت هجده' }, { time: 'neunzehn Uhr', fa: 'ساعت نوزده' },
      { time: 'zwanzig Uhr', fa: 'ساعت بیست' },
    ],
    render: ({ time, fa }) => [
      example(`Es ist ${time}.`, `${fa} است.`, 'die Uhr', 'ساعت'),
      example(`Der Kurs beginnt um ${time}.`, `کلاس ساعت ${fa.replace('ساعت ', '')} شروع می‌شود.`, 'beginnen', 'شروع‌شدن'),
      example(`Hast du um ${time} Zeit?`, `ساعت ${fa.replace('ساعت ', '')} وقت داری؟`, 'Zeit haben', 'وقت‌داشتن'),
    ],
  },
);

const needStatements: Record<string, { text: string; fa: string }> = {
  'die Hilfe': { text: 'Ich brauche sofort Hilfe.', fa: 'من فوری به کمک نیاز دارم.' },
  'der Arzt': { text: 'Ich brauche jetzt einen Arzt.', fa: 'من الان به یک پزشک نیاز دارم.' },
  'das Ticket': { text: 'Ich brauche noch ein Ticket.', fa: 'من هنوز به یک بلیت دیگر نیاز دارم.' },
  'das Zimmer': { text: 'Ich brauche ein freies Zimmer.', fa: 'من به یک اتاق خالی نیاز دارم.' },
};
const needQuestions: Record<string, { text: string; fa: string; word: string; meaning: string }> = {
  'das Wasser': { text: 'Kann ich Wasser haben?', fa: 'می‌توانم آب داشته باشم؟', word: 'haben', meaning: 'داشتن' },
  'die Hilfe': { text: 'Können Sie mir bitte helfen?', fa: 'می‌توانید لطفاً به من کمک کنید؟', word: 'helfen', meaning: 'کمک‌کردن' },
  'die Toilette': { text: 'Ist hier eine Toilette?', fa: 'اینجا دستشویی هست؟', word: 'hier', meaning: 'اینجا' },
  'der Arzt': { text: 'Können Sie einen Arzt rufen?', fa: 'می‌توانید یک پزشک را صدا کنید؟', word: 'rufen', meaning: 'صداکردن' },
  'die Apotheke': { text: 'Wo ist die nächste Apotheke?', fa: 'نزدیک‌ترین داروخانه کجاست؟', word: 'nächste', meaning: 'نزدیک‌ترین' },
  'das Ticket': { text: 'Wo kann ich ein Ticket kaufen?', fa: 'از کجا می‌توانم بلیت بخرم؟', word: 'kaufen', meaning: 'خریدن' },
  'der Bus': { text: 'Wann fährt der Bus ab?', fa: 'اتوبوس چه زمانی حرکت می‌کند؟', word: 'abfahren', meaning: 'حرکت‌کردن؛ راه‌افتادن' },
  'das Telefon': { text: 'Darf ich Ihr Telefon benutzen?', fa: 'می‌توانم از تلفن شما استفاده کنم؟', word: 'benutzen', meaning: 'استفاده‌کردن' },
  'der Kaffee': { text: 'Kann ich einen Kaffee bekommen?', fa: 'می‌توانم یک قهوه بگیرم؟', word: 'bekommen', meaning: 'گرفتن؛ دریافت‌کردن' },
  'der Tee': { text: 'Kann ich einen Tee bestellen?', fa: 'می‌توانم یک چای سفارش بدهم؟', word: 'bestellen', meaning: 'سفارش‌دادن' },
  'das Brot': { text: 'Kann ich hier Brot kaufen?', fa: 'می‌توانم اینجا نان بخرم؟', word: 'kaufen', meaning: 'خریدن' },
  'das Zimmer': { text: 'Ist mein Zimmer fertig?', fa: 'اتاق من آماده است؟', word: 'fertig', meaning: 'آماده' },
  'das Taxi': { text: 'Können Sie ein Taxi rufen?', fa: 'می‌توانید تاکسی خبر کنید؟', word: 'rufen', meaning: 'صداکردن؛ خبرکردن' },
  'die Pause': { text: 'Wie lange ist die Pause?', fa: 'استراحت چقدر طول می‌کشد؟', word: 'wie lange', meaning: 'چه‌مدت؛ چقدر' },
  'der Platz': { text: 'Kann ich hier sitzen?', fa: 'می‌توانم اینجا بنشینم؟', word: 'sitzen', meaning: 'نشستن' },
};

const needs = build<{
  word: string; meaning: string; accusative: string; where: string; whereFa: string; whereWord: string; whereMeaning: string;
}>(
  {
    lessonId: 'de-v2-basic-needs',
    seeds: [
      { word: 'das Wasser', meaning: 'آب', accusative: 'Wasser', where: 'Wo finde ich Wasser?', whereFa: 'آب را از کجا پیدا کنم؟', whereWord: 'finden', whereMeaning: 'پیداکردن' },
      { word: 'die Hilfe', meaning: 'کمک', accusative: 'Hilfe', where: 'Wo bekomme ich Hilfe?', whereFa: 'از کجا می‌توانم کمک بگیرم؟', whereWord: 'bekommen', whereMeaning: 'دریافت‌کردن' },
      { word: 'die Toilette', meaning: 'دستشویی', accusative: 'eine Toilette', where: 'Wo finde ich eine Toilette?', whereFa: 'دستشویی را از کجا پیدا کنم؟', whereWord: 'finden', whereMeaning: 'پیداکردن' },
      { word: 'der Arzt', meaning: 'پزشک', accusative: 'einen Arzt', where: 'Wo ist ein Arzt?', whereFa: 'پزشک کجاست؟', whereWord: 'wo', whereMeaning: 'کجا' },
      { word: 'die Apotheke', meaning: 'داروخانه', accusative: 'eine Apotheke', where: 'Wo ist eine Apotheke?', whereFa: 'داروخانه کجاست؟', whereWord: 'wo', whereMeaning: 'کجا' },
      { word: 'das Ticket', meaning: 'بلیت', accusative: 'ein Ticket', where: 'Wo bekomme ich ein Ticket?', whereFa: 'از کجا بلیت بگیرم؟', whereWord: 'bekommen', whereMeaning: 'گرفتن؛ دریافت‌کردن' },
      { word: 'der Bus', meaning: 'اتوبوس', accusative: 'einen Bus', where: 'Wo fährt der Bus ab?', whereFa: 'اتوبوس از کجا حرکت می‌کند؟', whereWord: 'abfahren', whereMeaning: 'حرکت‌کردن؛ راه‌افتادن' },
      { word: 'das Telefon', meaning: 'تلفن', accusative: 'ein Telefon', where: 'Wo ist das Telefon?', whereFa: 'تلفن کجاست؟', whereWord: 'wo', whereMeaning: 'کجا' },
      { word: 'der Kaffee', meaning: 'قهوه', accusative: 'einen Kaffee', where: 'Wo kann ich einen Kaffee bekommen?', whereFa: 'از کجا می‌توانم قهوه بگیرم؟', whereWord: 'bekommen', whereMeaning: 'گرفتن؛ دریافت‌کردن' },
      { word: 'der Tee', meaning: 'چای', accusative: 'einen Tee', where: 'Wo kann ich einen Tee bestellen?', whereFa: 'کجا می‌توانم چای سفارش بدهم؟', whereWord: 'bestellen', whereMeaning: 'سفارش‌دادن' },
      { word: 'das Brot', meaning: 'نان', accusative: 'Brot', where: 'Wo kann ich Brot kaufen?', whereFa: 'از کجا می‌توانم نان بخرم؟', whereWord: 'kaufen', whereMeaning: 'خریدن' },
      { word: 'das Zimmer', meaning: 'اتاق', accusative: 'ein Zimmer', where: 'Wo ist mein Zimmer?', whereFa: 'اتاق من کجاست؟', whereWord: 'wo', whereMeaning: 'کجا' },
      { word: 'das Taxi', meaning: 'تاکسی', accusative: 'ein Taxi', where: 'Wo finde ich ein Taxi?', whereFa: 'از کجا تاکسی پیدا کنم؟', whereWord: 'finden', whereMeaning: 'پیداکردن' },
      { word: 'die Pause', meaning: 'استراحت', accusative: 'eine Pause', where: 'Wann ist die Pause?', whereFa: 'استراحت چه زمانی است؟', whereWord: 'wann', whereMeaning: 'چه زمانی' },
      { word: 'der Platz', meaning: 'جا؛ صندلی', accusative: 'einen Platz', where: 'Ist hier noch ein Platz frei?', whereFa: 'اینجا هنوز جایی خالی هست؟', whereWord: 'frei', whereMeaning: 'خالی؛ آزاد' },
    ],
    render: ({ word, meaning, accusative, where, whereFa, whereWord, whereMeaning }) => {
      const statement = needStatements[word] ?? { text: `Ich brauche ${accusative}.`, fa: `من به ${meaning} نیاز دارم.` };
      return [
        example(statement.text, statement.fa, word, meaning, 'brauchen برای بیان نیاز.'),
        example(needQuestions[word].text, needQuestions[word].fa, needQuestions[word].word, needQuestions[word].meaning, 'Können Sie …? و Kann ich …? برای درخواست مؤدبانه‌اند.'),
        example(where, whereFa, whereWord, whereMeaning, 'برای درخواست کمک، از پرسش کوتاه و روشن استفاده کنید.'),
      ];
    },
  },
);

const alphabet = build<{ name: string; fa: string; first: string; spelling: string }>(
  {
    lessonId: 'de-v2-alphabet',
    seeds: [
      { name: 'Sara', fa: 'سارا', first: 'S', spelling: 'S-A-R-A' }, { name: 'Mina', fa: 'مینا', first: 'M', spelling: 'M-I-N-A' },
      { name: 'Amir', fa: 'امیر', first: 'A', spelling: 'A-M-I-R' }, { name: 'Lea', fa: 'لیا', first: 'L', spelling: 'L-E-A' },
      { name: 'Omar', fa: 'عمر', first: 'O', spelling: 'O-M-A-R' }, { name: 'Nora', fa: 'نورا', first: 'N', spelling: 'N-O-R-A' },
      { name: 'Mia', fa: 'میا', first: 'M', spelling: 'M-I-A' }, { name: 'Paul', fa: 'پاول', first: 'P', spelling: 'P-A-U-L' },
      { name: 'Lina', fa: 'لینا', first: 'L', spelling: 'L-I-N-A' }, { name: 'Noah', fa: 'نوآ', first: 'N', spelling: 'N-O-A-H' },
      { name: 'Aiko', fa: 'آیکو', first: 'A', spelling: 'A-I-K-O' }, { name: 'Kenji', fa: 'کنجی', first: 'K', spelling: 'K-E-N-J-I' },
      { name: 'Maria', fa: 'ماریا', first: 'M', spelling: 'M-A-R-I-A' }, { name: 'Luca', fa: 'لوکا', first: 'L', spelling: 'L-U-C-A' },
      { name: 'Hana', fa: 'هانا', first: 'H', spelling: 'H-A-N-A' },
    ],
    render: ({ name, fa, first, spelling }) => [
      example(`Mein Vorname ist ${name}.`, `نام کوچک من ${fa} است.`, 'der Vorname', 'نام کوچک'),
      example(`Der erste Buchstabe von ${name} ist ${first}.`, `حرف اولِ ${fa} ${first} است.`, 'der Buchstabe', 'حرف'),
      example(`Ich buchstabiere ${name}: ${spelling}.`, `اسم ${fa} را این‌طور هجی می‌کنم: ${spelling}.`, 'buchstabieren', 'هجی‌کردن', 'beginnt mit و buchstabieren برای گفتن یا هجی‌کردن اسم.'),
    ],
  },
);

const countryLanguages = build<{
  country: string; countryFa: string; city: string; cityFa: string; language: string; languageFa: string;
}>(
  {
    lessonId: 'de-v2-countries-languages',
    seeds: [
      { country: 'Deutschland', countryFa: 'آلمان', city: 'Berlin', cityFa: 'برلین', language: 'Deutsch', languageFa: 'آلمانی' },
      { country: 'Österreich', countryFa: 'اتریش', city: 'Wien', cityFa: 'وین', language: 'Deutsch', languageFa: 'آلمانی' },
      { country: 'der Schweiz', countryFa: 'سوئیس', city: 'Bern', cityFa: 'برن', language: 'Deutsch', languageFa: 'آلمانی' },
      { country: 'Frankreich', countryFa: 'فرانسه', city: 'Paris', cityFa: 'پاریس', language: 'Französisch', languageFa: 'فرانسوی' },
      { country: 'Italien', countryFa: 'ایتالیا', city: 'Rom', cityFa: 'رم', language: 'Italienisch', languageFa: 'ایتالیایی' },
      { country: 'Spanien', countryFa: 'اسپانیا', city: 'Madrid', cityFa: 'مادرید', language: 'Spanisch', languageFa: 'اسپانیایی' },
      { country: 'Portugal', countryFa: 'پرتغال', city: 'Lissabon', cityFa: 'لیسبون', language: 'Portugiesisch', languageFa: 'پرتغالی' },
      { country: 'Japan', countryFa: 'ژاپن', city: 'Tokio', cityFa: 'توکیو', language: 'Japanisch', languageFa: 'ژاپنی' },
      { country: 'China', countryFa: 'چین', city: 'Peking', cityFa: 'پکن', language: 'Chinesisch', languageFa: 'چینی' },
      { country: 'Indien', countryFa: 'هند', city: 'Delhi', cityFa: 'دهلی', language: 'Hindi', languageFa: 'هندی' },
      { country: 'Kanada', countryFa: 'کانادا', city: 'Toronto', cityFa: 'تورنتو', language: 'Englisch', languageFa: 'انگلیسی' },
      { country: 'den USA', countryFa: 'آمریکا', city: 'New York', cityFa: 'نیویورک', language: 'Englisch', languageFa: 'انگلیسی' },
      { country: 'dem Iran', countryFa: 'ایران', city: 'Teheran', cityFa: 'تهران', language: 'Persisch', languageFa: 'فارسی' },
      { country: 'der Türkei', countryFa: 'ترکیه', city: 'Ankara', cityFa: 'آنکارا', language: 'Türkisch', languageFa: 'ترکی' },
      { country: 'Ägypten', countryFa: 'مصر', city: 'Kairo', cityFa: 'قاهره', language: 'Arabisch', languageFa: 'عربی' },
    ],
    render: ({ country, countryFa, city, cityFa, language, languageFa }) => {
      const location = country === 'dem Iran' ? 'im Iran' : `in ${country}`;
      return [
        example(`Ich lebe ${location}.`, `من در ${countryFa} زندگی می‌کنم.`, 'leben', 'زندگی‌کردن'),
        example(`In ${city} spreche ich ${language}.`, `من در ${cityFa} به ${languageFa} صحبت می‌کنم.`, 'sprechen', 'صحبت‌کردن'),
        example(`Ich lerne ${language} in ${city}.`, `من در ${cityFa} ${languageFa} یاد می‌گیرم.`, 'lernen', 'یادگرفتن'),
      ];
    },
  },
);

const calendar = build<{ day: string; fa: string }>(
  {
    lessonId: 'de-v2-days-calendar',
    seeds: [
      { day: 'am Montag', fa: 'دوشنبه' }, { day: 'am Dienstag', fa: 'سه‌شنبه' },
      { day: 'am Mittwoch', fa: 'چهارشنبه' }, { day: 'am Donnerstag', fa: 'پنجشنبه' },
      { day: 'am Freitag', fa: 'جمعه' }, { day: 'am Samstag', fa: 'شنبه' },
      { day: 'am Sonntag', fa: 'یکشنبه' }, { day: 'am Wochenende', fa: 'آخر هفته' },
      { day: 'am Morgen', fa: 'صبح' }, { day: 'am Vormittag', fa: 'پیش از ظهر' },
      { day: 'am Mittag', fa: 'ظهر' }, { day: 'am Nachmittag', fa: 'بعدازظهر' },
      { day: 'am Abend', fa: 'عصر' }, { day: 'am ersten Mai', fa: 'روز اول ماه مه' },
      { day: 'am fünfzehnten Juni', fa: 'روز پانزدهم ژوئن' },
    ],
    render: ({ day, fa }) => [
      example(`Der Deutschkurs ist ${day}.`, `کلاس آلمانی ${fa} است.`, 'der Deutschkurs', 'کلاس آلمانی'),
      example(`Ich habe ${day} Zeit.`, `من ${fa} وقت دارم.`, 'Zeit haben', 'وقت‌داشتن'),
      example(`Hast du ${day} Zeit?`, `${fa} وقت داری؟`, 'Zeit haben', 'وقت‌داشتن'),
    ],
  },
);

const contactDetails = build<{
  street: string; streetFa: string; number: string; numberFa: string; postalCode: string; city: string; cityFa: string;
}>(
  {
    lessonId: 'de-v2-personal-details',
    seeds: [
      { street: 'Rosenstraße', streetFa: 'خیابان رز', number: '12', numberFa: 'دوازده', postalCode: '10115', city: 'Berlin', cityFa: 'برلین' },
      { street: 'Lindenstraße', streetFa: 'خیابان زیرفون', number: '8', numberFa: 'هشت', postalCode: '20095', city: 'Hamburg', cityFa: 'هامبورگ' },
      { street: 'Gartenstraße', streetFa: 'خیابان باغ', number: '5', numberFa: 'پنج', postalCode: '80331', city: 'München', cityFa: 'مونیخ' },
      { street: 'Schulstraße', streetFa: 'خیابان مدرسه', number: '21', numberFa: 'بیست‌ویک', postalCode: '50667', city: 'Köln', cityFa: 'کلن' },
      { street: 'Bahnhofstraße', streetFa: 'خیابان ایستگاه', number: '3', numberFa: 'سه', postalCode: '60311', city: 'Frankfurt', cityFa: 'فرانکفورت' },
      { street: 'Parkstraße', streetFa: 'خیابان پارک', number: '17', numberFa: 'هفده', postalCode: '70173', city: 'Stuttgart', cityFa: 'اشتوتگارت' },
      { street: 'Bergstraße', streetFa: 'خیابان کوه', number: '9', numberFa: 'نه', postalCode: '04109', city: 'Leipzig', cityFa: 'لایپزیگ' },
      { street: 'Kirchstraße', streetFa: 'خیابان کلیسا', number: '14', numberFa: 'چهارده', postalCode: '01067', city: 'Dresden', cityFa: 'درسدن' },
      { street: 'Wiesenstraße', streetFa: 'خیابان چمنزار', number: '6', numberFa: 'شش', postalCode: '30159', city: 'Hannover', cityFa: 'هانوفر' },
      { street: 'Sonnenstraße', streetFa: 'خیابان آفتاب', number: '11', numberFa: 'یازده', postalCode: '90402', city: 'Nürnberg', cityFa: 'نورمبرگ' },
      { street: 'Blumenstraße', streetFa: 'خیابان گل', number: '4', numberFa: 'چهار', postalCode: '45127', city: 'Essen', cityFa: 'اسن' },
      { street: 'Feldstraße', streetFa: 'خیابان مزرعه', number: '19', numberFa: 'نوزده', postalCode: '28195', city: 'Bremen', cityFa: 'برمن' },
      { street: 'Marktstraße', streetFa: 'خیابان بازار', number: '7', numberFa: 'هفت', postalCode: '66111', city: 'Saarbrücken', cityFa: 'زاربروکن' },
      { street: 'Seestraße', streetFa: 'خیابان دریاچه', number: '16', numberFa: 'شانزده', postalCode: '18055', city: 'Rostock', cityFa: 'روستوک' },
      { street: 'Buchenstraße', streetFa: 'خیابان درخت راش', number: '10', numberFa: 'ده', postalCode: '14467', city: 'Potsdam', cityFa: 'پوتسدام' },
    ],
    render: ({ street, streetFa, number, numberFa, postalCode, city, cityFa }) => [
      example(`Ich wohne in der ${street} ${number}.`, `من در ${streetFa}، شمارهٔ ${numberFa} زندگی می‌کنم.`, `die ${street}`, streetFa),
      example(`Meine Postleitzahl ist ${postalCode}.`, `کدپستی من ${postalCode} است.`, 'die Postleitzahl', 'کدپستی'),
      example(`Meine Stadt heißt ${city}.`, `نام شهر من ${cityFa} است.`, 'die Stadt', 'شهر'),
    ],
  },
);

const food = build<{ word: string; meaning: string; accusative: string; faAcc: string }>(
  {
    lessonId: 'de-v2-food-drink',
    seeds: [
      { word: 'der Apfel', meaning: 'سیب', accusative: 'einen Apfel', faAcc: 'یک سیب' },
      { word: 'die Banane', meaning: 'موز', accusative: 'eine Banane', faAcc: 'یک موز' },
      { word: 'das Brot', meaning: 'نان', accusative: 'Brot', faAcc: 'نان' },
      { word: 'der Käse', meaning: 'پنیر', accusative: 'Käse', faAcc: 'پنیر' },
      { word: 'die Suppe', meaning: 'سوپ', accusative: 'eine Suppe', faAcc: 'یک سوپ' },
      { word: 'der Salat', meaning: 'سالاد', accusative: 'einen Salat', faAcc: 'یک سالاد' },
      { word: 'der Reis', meaning: 'برنج', accusative: 'Reis', faAcc: 'برنج' },
      { word: 'der Tee', meaning: 'چای', accusative: 'einen Tee', faAcc: 'یک چای' },
      { word: 'der Kaffee', meaning: 'قهوه', accusative: 'einen Kaffee', faAcc: 'یک قهوه' },
      { word: 'die Milch', meaning: 'شیر', accusative: 'Milch', faAcc: 'شیر' },
      { word: 'das Ei', meaning: 'تخم‌مرغ', accusative: 'ein Ei', faAcc: 'یک تخم‌مرغ' },
      { word: 'die Tomate', meaning: 'گوجه‌فرنگی', accusative: 'eine Tomate', faAcc: 'یک گوجه‌فرنگی' },
      { word: 'die Kartoffel', meaning: 'سیب‌زمینی', accusative: 'eine Kartoffel', faAcc: 'یک سیب‌زمینی' },
      { word: 'der Fisch', meaning: 'ماهی', accusative: 'einen Fisch', faAcc: 'یک ماهی' },
      { word: 'die Orange', meaning: 'پرتقال', accusative: 'eine Orange', faAcc: 'یک پرتقال' },
    ],
    render: ({ word, meaning, accusative, faAcc }) => [
      example(`Zum Mittag esse ich ${accusative}.`, `برای ناهار ${faAcc} می‌خورم.`, word, meaning, 'essen برای گفتن اینکه چه چیزی می‌خوریم.'),
      example(`Ich möchte ${accusative}, bitte.`, `لطفاً ${faAcc} می‌خواهم.`, word, meaning, 'möchten برای درخواست مؤدبانه.'),
      example(`Möchtest du ${accusative}?`, `${faAcc} می‌خواهی؟`, word, meaning, 'möchtest du پرسش دوستانه است.'),
    ],
  },
);

const objectsColours = build<{ word: string; meaning: string; color: string; colorFa: string }>(
  {
    lessonId: 'de-v2-objects-colors',
    seeds: [
      { word: 'der Tisch', meaning: 'میز', color: 'braun', colorFa: 'قهوه‌ای' },
      { word: 'die Tasche', meaning: 'کیف', color: 'rot', colorFa: 'قرمز' },
      { word: 'das Buch', meaning: 'کتاب', color: 'blau', colorFa: 'آبی' },
      { word: 'der Stift', meaning: 'خودکار', color: 'grün', colorFa: 'سبز' },
      { word: 'die Lampe', meaning: 'چراغ', color: 'gelb', colorFa: 'زرد' },
      { word: 'das Fenster', meaning: 'پنجره', color: 'weiß', colorFa: 'سفید' },
      { word: 'die Tür', meaning: 'در', color: 'schwarz', colorFa: 'سیاه' },
      { word: 'der Stuhl', meaning: 'صندلی', color: 'grau', colorFa: 'خاکستری' },
      { word: 'das Heft', meaning: 'دفتر', color: 'orange', colorFa: 'نارنجی' },
      { word: 'die Flasche', meaning: 'بطری', color: 'grün', colorFa: 'سبز' },
      { word: 'der Rucksack', meaning: 'کوله‌پشتی', color: 'blau', colorFa: 'آبی' },
      { word: 'die Jacke', meaning: 'کاپشن', color: 'gelb', colorFa: 'زرد' },
      { word: 'das Handy', meaning: 'گوشی', color: 'schwarz', colorFa: 'سیاه' },
      { word: 'der Schlüssel', meaning: 'کلید', color: 'silbern', colorFa: 'نقره‌ای' },
      { word: 'die Tasse', meaning: 'فنجان', color: 'lila', colorFa: 'بنفش' },
    ],
    render: ({ word, meaning, color, colorFa }) => {
      const cap = word[0].toUpperCase() + word.slice(1);
      const colour = { word: color, meaning: colorFa };
      return [
        example(`Hier ist ${word}.`, `اینجا ${meaning} است.`, word, meaning),
        example(`Welche Farbe hat ${word}?`, `${meaning} چه رنگی است؟`, 'Welche Farbe?', 'چه رنگی؟', undefined, [colour]),
        example(`Ist ${word} ${color}?`, `آیا ${meaning} ${colorFa} است؟`, word, meaning, undefined, [colour]),
      ];
    },
  },
);

const placesDirections = build<{
  place: string; meaning: string; route: string; routeFa: string;
}>(
  {
    lessonId: 'de-v2-places-directions',
    seeds: [
      { place: 'die Schule', meaning: 'مدرسه', route: 'nach links', routeFa: 'به چپ' },
      { place: 'der Bahnhof', meaning: 'ایستگاه قطار', route: 'nach rechts', routeFa: 'به راست' },
      { place: 'die Apotheke', meaning: 'داروخانه', route: 'geradeaus', routeFa: 'مستقیم' },
      { place: 'der Supermarkt', meaning: 'سوپرمارکت', route: 'zurück', routeFa: 'به عقب' },
      { place: 'das Hotel', meaning: 'هتل', route: 'bis zur Ampel', routeFa: 'تا چراغ راهنمایی' },
      { place: 'die Bank', meaning: 'بانک', route: 'über die Straße', routeFa: 'از خیابان عبور' },
      { place: 'das Café', meaning: 'کافه', route: 'bis zur Ecke', routeFa: 'تا سرِ خیابان' },
      { place: 'der Park', meaning: 'پارک', route: 'durch den Park', routeFa: 'از میان پارک' },
      { place: 'das Museum', meaning: 'موزه', route: 'bis zum Platz', routeFa: 'تا میدان' },
      { place: 'die Bushaltestelle', meaning: 'ایستگاه اتوبوس', route: 'zur nächsten Straße', routeFa: 'به خیابان بعدی' },
      { place: 'der Flughafen', meaning: 'فرودگاه', route: 'mit dem Bus', routeFa: 'با اتوبوس' },
      { place: 'die Post', meaning: 'ادارهٔ پست', route: 'bis zum Bahnhof', routeFa: 'تا ایستگاه قطار' },
      { place: 'die Bibliothek', meaning: 'کتابخانه', route: 'durch diese Tür', routeFa: 'از این در' },
      { place: 'das Krankenhaus', meaning: 'بیمارستان', route: 'die Straße entlang', routeFa: 'در امتداد خیابان' },
      { place: 'der Markt', meaning: 'بازار', route: 'bis zur Kreuzung', routeFa: 'تا چهارراه' },
    ],
    render: ({ place, meaning, route, routeFa }) => {
      const cap = place[0].toUpperCase() + place.slice(1);
      const verb = route === 'mit dem Bus' ? 'fahren' : 'gehen';
      const instruction = verb === 'fahren' ? `Fahren Sie bitte ${route}.` : `Gehen Sie bitte ${route}.`;
      return [
        example(`Ist hier ${place}?`, `آیا ${meaning} اینجاست؟`, place, meaning),
        example(`${cap} ist in der Nähe.`, `${meaning} نزدیک است.`, place, meaning, 'in der Nähe یعنی «در نزدیکی».'),
        example(instruction, `لطفاً ${routeFa} بروید.`, verb, verb === 'fahren' ? 'رفتن با وسیلهٔ نقلیه' : 'رفتن؛ پیاده‌رفتن', undefined, [{ word: route, meaning: routeFa }]),
      ];
    },
  },
);

const coreVerbs = build<{
  word: string; meaning: string; lines: [[string, string], [string, string], [string, string]];
}>(
  {
    lessonId: 'de-v2-core-verbs-pronouns',
    seeds: [
      { word: 'sein', meaning: 'بودن', lines: [['Ich bin hier.', 'من اینجا هستم.'], ['Bist du heute zu Hause?', 'امروز خانه هستی؟'], ['Wir sind im Kurs.', 'ما در کلاس هستیم.']] },
      { word: 'haben', meaning: 'داشتن', lines: [['Ich habe heute Zeit.', 'من امروز وقت دارم.'], ['Hast du einen Stift?', 'خودکار داری؟'], ['Wir haben ein Buch.', 'ما یک کتاب داریم.']] },
      { word: 'wohnen', meaning: 'زندگی‌کردن', lines: [['Ich wohne in Berlin.', 'من در برلین زندگی می‌کنم.'], ['Wohnst du in Hamburg?', 'در هامبورگ زندگی می‌کنی؟'], ['Lea wohnt in München.', 'لیا در مونیخ زندگی می‌کند.']] },
      { word: 'kommen', meaning: 'آمدن؛ اهل جایی‌بودن', lines: [['Ich komme aus dem Iran.', 'من اهل ایران هستم.'], ['Kommst du aus Japan?', 'اهل ژاپن هستی؟'], ['Ali kommt aus Berlin.', 'علی اهل برلین است.']] },
      { word: 'lernen', meaning: 'یادگرفتن', lines: [['Ich lerne Deutsch.', 'من آلمانی یاد می‌گیرم.'], ['Lernst du heute?', 'امروز درس می‌خوانی؟'], ['Wir lernen im Kurs.', 'ما در کلاس یاد می‌گیریم.']] },
      { word: 'sprechen', meaning: 'صحبت‌کردن', lines: [['Ich spreche langsam.', 'من آهسته صحبت می‌کنم.'], ['Sprichst du Englisch?', 'انگلیسی صحبت می‌کنی؟'], ['Sara spricht Deutsch.', 'سارا آلمانی صحبت می‌کند.']] },
      { word: 'arbeiten', meaning: 'کارکردن', lines: [['Ich arbeite am Morgen.', 'من صبح کار می‌کنم.'], ['Arbeitest du heute?', 'امروز کار می‌کنی؟'], ['Mein Vater arbeitet hier.', 'پدرم اینجا کار می‌کند.']] },
      { word: 'machen', meaning: 'انجام‌دادن؛ درست‌کردن', lines: [['Ich mache eine Pause.', 'من استراحت می‌کنم.'], ['Was machst du heute?', 'امروز چه‌کار می‌کنی؟'], ['Wir machen die Aufgabe.', 'ما تمرین را انجام می‌دهیم.']] },
      { word: 'essen', meaning: 'خوردن', lines: [['Ich esse einen Apfel.', 'من یک سیب می‌خورم.'], ['Isst du Brot?', 'نان می‌خوری؟'], ['Wir essen zusammen.', 'ما با هم غذا می‌خوریم.']] },
      { word: 'trinken', meaning: 'نوشیدن', lines: [['Ich trinke Wasser.', 'من آب می‌نوشم.'], ['Trinkst du Tee?', 'چای می‌نوشی؟'], ['Das Kind trinkt Milch.', 'کودک شیر می‌نوشد.']] },
      { word: 'kaufen', meaning: 'خریدن', lines: [['Ich kaufe ein Brot.', 'من یک نان می‌خرم.'], ['Kaufst du Äpfel?', 'سیب می‌خری؟'], ['Wir kaufen im Markt ein.', 'ما در بازار خرید می‌کنیم.']] },
      { word: 'brauchen', meaning: 'نیازداشتن', lines: [['Ich brauche Hilfe.', 'من به کمک نیاز دارم.'], ['Brauchst du ein Ticket?', 'به بلیت نیاز داری؟'], ['Wir brauchen eine Pause.', 'ما به استراحت نیاز داریم.']] },
      { word: 'gehen', meaning: 'رفتن؛ پیاده‌رفتن', lines: [['Ich gehe zur Schule.', 'من به مدرسه می‌روم.'], ['Gehst du nach Hause?', 'به خانه می‌روی؟'], ['Wir gehen zu Fuß.', 'ما پیاده می‌رویم.']] },
      { word: 'fahren', meaning: 'رفتن با وسیلهٔ نقلیه', lines: [['Ich fahre mit dem Bus.', 'من با اتوبوس می‌روم.'], ['Fährst du nach Berlin?', 'به برلین می‌روی؟'], ['Wir fahren heute nach Hause.', 'ما امروز به خانه می‌رویم.']] },
      { word: 'heißen', meaning: 'نام‌داشتن', lines: [['Ich heiße Nora.', 'اسم من نورا است.'], ['Wie heißt du?', 'اسم تو چیست؟'], ['Er heißt Paul.', 'اسم او پاول است.']] },
    ],
    render: ({ word, meaning, lines }) => lines.map(([text, fa]) => example(text, fa, word, meaning, 'صرف فعل در جملهٔ خبری و پرسشی.')) as [Example, Example, Example],
  },
);

const questionsNegation = build<{
  word: string; meaning: string; lines: [[string, string], [string, string], [string, string]];
}>(
  {
    lessonId: 'de-v2-questions-negation',
    seeds: [
      { word: 'zu Hause', meaning: 'در خانه', lines: [['Ich bin heute zu Hause.', 'من امروز خانه هستم.'], ['Bist du heute Abend zu Hause?', 'امشب خانه هستی؟'], ['Nein, heute bin ich nicht zu Hause.', 'نه، امروز خانه نیستم.']] },
      { word: 'ein Heft', meaning: 'یک دفتر', lines: [['Ich habe heute ein Heft.', 'من امروز یک دفتر دارم.'], ['Hast du heute ein Heft?', 'امروز یک دفتر داری؟'], ['Nein, heute habe ich kein Heft.', 'نه، امروز دفتر ندارم.']] },
      { word: 'einen Stift', meaning: 'یک خودکار', lines: [['Ich habe einen Stift.', 'من یک خودکار دارم.'], ['Hast du einen Stift?', 'یک خودکار داری؟'], ['Nein, ich habe keinen Stift.', 'نه، من خودکاری ندارم.']] },
      { word: 'eine Tasche', meaning: 'یک کیف', lines: [['Ich habe eine Tasche.', 'من یک کیف دارم.'], ['Hast du eine Tasche?', 'یک کیف داری؟'], ['Nein, ich habe keine Tasche.', 'نه، من کیفی ندارم.']] },
      { word: 'Zeit', meaning: 'وقت', lines: [['Ich habe Zeit.', 'من وقت دارم.'], ['Hast du Zeit?', 'وقت داری؟'], ['Nein, ich habe keine Zeit.', 'نه، من وقت ندارم.']] },
      { word: 'Kaffee', meaning: 'قهوه', lines: [['Ich trinke Kaffee.', 'من قهوه می‌نوشم.'], ['Trinkst du Kaffee?', 'قهوه می‌نوشی؟'], ['Nein, ich trinke keinen Kaffee.', 'نه، من قهوه نمی‌نوشم.']] },
      { word: 'Brot', meaning: 'نان', lines: [['Ich esse Brot.', 'من نان می‌خورم.'], ['Isst du Brot?', 'نان می‌خوری؟'], ['Nein, ich esse kein Brot.', 'نه، من نان نمی‌خورم.']] },
      { word: 'Englisch', meaning: 'انگلیسی', lines: [['Ich spreche Englisch.', 'من انگلیسی صحبت می‌کنم.'], ['Sprichst du Englisch?', 'انگلیسی صحبت می‌کنی؟'], ['Nein, ich spreche kein Englisch.', 'نه، من انگلیسی صحبت نمی‌کنم.']] },
      { word: 'aus Berlin', meaning: 'اهل برلین', lines: [['Ich komme aus Berlin.', 'من اهل برلین هستم.'], ['Kommst du aus Berlin?', 'اهل برلین هستی؟'], ['Nein, ich komme nicht aus Berlin.', 'نه، من اهل برلین نیستم.']] },
      { word: 'müde', meaning: 'خسته', lines: [['Ich bin müde.', 'من خسته هستم.'], ['Bist du müde?', 'خسته هستی؟'], ['Nein, ich bin nicht müde.', 'نه، من خسته نیستم.']] },
      { word: 'einen Apfel', meaning: 'یک سیب', lines: [['Ich esse einen Apfel.', 'من یک سیب می‌خورم.'], ['Isst du einen Apfel?', 'یک سیب می‌خوری؟'], ['Nein, ich esse keinen Apfel.', 'نه، من سیبی نمی‌خورم.']] },
      { word: 'Wasser', meaning: 'آب', lines: [['Ich trinke Wasser.', 'من آب می‌نوشم.'], ['Trinkst du Wasser?', 'آب می‌نوشی؟'], ['Nein, ich trinke kein Wasser.', 'نه، من آب نمی‌نوشم.']] },
      { word: 'ein Zimmer', meaning: 'یک اتاق', lines: [['Ich brauche ein Zimmer.', 'من به یک اتاق نیاز دارم.'], ['Brauchst du ein Zimmer?', 'به یک اتاق نیاز داری؟'], ['Nein, ich brauche kein Zimmer.', 'نه، من به اتاق نیاز ندارم.']] },
      { word: 'ein Ticket', meaning: 'یک بلیت', lines: [['Ich habe ein Ticket.', 'من یک بلیت دارم.'], ['Hast du ein Ticket?', 'یک بلیت داری؟'], ['Nein, ich habe kein Ticket.', 'نه، من بلیتی ندارم.']] },
      { word: 'eine Pause', meaning: 'یک استراحت', lines: [['Ich mache eine Pause.', 'من استراحت می‌کنم.'], ['Machst du eine Pause?', 'استراحت می‌کنی؟'], ['Nein, ich mache keine Pause.', 'نه، من استراحت نمی‌کنم.']] },
    ],
    render: ({ word, meaning, lines }) => lines.map(([text, fa]) => example(text, fa, word, meaning, 'nicht برای نفی فعل یا صفت و kein برای نفی اسم.')) as [Example, Example, Example],
  },
);

const family = build<{
  relation: string; fa: string; possessive: string; name: string; nameFa: string; city: string; cityFa: string;
}>(
  {
    lessonId: 'de-v2-family-basics',
    seeds: [
      { relation: 'die Mutter', fa: 'مادر', possessive: 'meine Mutter', name: 'Sara', nameFa: 'سارا', city: 'Berlin', cityFa: 'برلین' },
      { relation: 'der Vater', fa: 'پدر', possessive: 'mein Vater', name: 'Ali', nameFa: 'علی', city: 'Hamburg', cityFa: 'هامبورگ' },
      { relation: 'die Schwester', fa: 'خواهر', possessive: 'meine Schwester', name: 'Mina', nameFa: 'مینا', city: 'München', cityFa: 'مونیخ' },
      { relation: 'der Bruder', fa: 'برادر', possessive: 'mein Bruder', name: 'Amir', nameFa: 'امیر', city: 'Köln', cityFa: 'کلن' },
      { relation: 'die Großmutter', fa: 'مادربزرگ', possessive: 'meine Großmutter', name: 'Nora', nameFa: 'نورا', city: 'Frankfurt', cityFa: 'فرانکفورت' },
      { relation: 'der Großvater', fa: 'پدربزرگ', possessive: 'mein Großvater', name: 'Paul', nameFa: 'پاول', city: 'Leipzig', cityFa: 'لایپزیگ' },
      { relation: 'die Tante', fa: 'عمه؛ خاله', possessive: 'meine Tante', name: 'Lea', nameFa: 'لیا', city: 'Dresden', cityFa: 'درسدن' },
      { relation: 'der Onkel', fa: 'عمو؛ دایی', possessive: 'mein Onkel', name: 'Omar', nameFa: 'عمر', city: 'Stuttgart', cityFa: 'اشتوتگارت' },
      { relation: 'die Cousine', fa: 'دخترعمو؛ دخترخاله', possessive: 'meine Cousine', name: 'Lina', nameFa: 'لینا', city: 'Wien', cityFa: 'وین' },
      { relation: 'der Cousin', fa: 'پسرعمو؛ پسرخاله', possessive: 'mein Cousin', name: 'Luca', nameFa: 'لوکا', city: 'Zürich', cityFa: 'زوریخ' },
      { relation: 'die Tochter', fa: 'دختر', possessive: 'meine Tochter', name: 'Mia', nameFa: 'میا', city: 'Bonn', cityFa: 'بن' },
      { relation: 'der Sohn', fa: 'پسر', possessive: 'mein Sohn', name: 'Noah', nameFa: 'نوآ', city: 'Essen', cityFa: 'اسن' },
      { relation: 'die Frau', fa: 'همسر؛ زن', possessive: 'meine Frau', name: 'Hana', nameFa: 'هانا', city: 'Bremen', cityFa: 'برمن' },
      { relation: 'der Mann', fa: 'همسر؛ مرد', possessive: 'mein Mann', name: 'David', nameFa: 'دیوید', city: 'Potsdam', cityFa: 'پوتسدام' },
      { relation: 'die Freundin', fa: 'دوست دختر؛ دوست مؤنث', possessive: 'meine Freundin', name: 'Emma', nameFa: 'اما', city: 'Kiel', cityFa: 'کیل' },
    ],
    render: ({ relation, fa, possessive, name, nameFa, city, cityFa }) => [
      example(`Hier ist ${possessive}.`, `این‌جا ${fa} من است.`, relation, fa),
      example(`${possessive[0].toUpperCase()}${possessive.slice(1)} heißt ${name}.`, `${fa} من ${nameFa} نام دارد.`, relation, fa, undefined, [{ word: 'heißen', meaning: 'نام‌داشتن' }]),
      example(`${possessive[0].toUpperCase()}${possessive.slice(1)} wohnt in ${city}.`, `${fa} من در ${cityFa} زندگی می‌کند.`, relation, fa, undefined, [{ word: 'wohnen', meaning: 'زندگی‌کردن' }]),
    ],
  },
);

const home = build<{ word: string; meaning: string; adjective: string; adjectiveFa: string }>(
  {
    lessonId: 'de-v2-home-rooms',
    seeds: [
      { word: 'das Haus', meaning: 'خانه', adjective: 'groß', adjectiveFa: 'بزرگ' },
      { word: 'die Wohnung', meaning: 'آپارتمان', adjective: 'klein', adjectiveFa: 'کوچک' },
      { word: 'das Zimmer', meaning: 'اتاق', adjective: 'hell', adjectiveFa: 'روشن' },
      { word: 'die Küche', meaning: 'آشپزخانه', adjective: 'sauber', adjectiveFa: 'تمیز' },
      { word: 'das Bad', meaning: 'حمام', adjective: 'klein', adjectiveFa: 'کوچک' },
      { word: 'das Schlafzimmer', meaning: 'اتاق‌خواب', adjective: 'ruhig', adjectiveFa: 'آرام' },
      { word: 'das Wohnzimmer', meaning: 'اتاق نشیمن', adjective: 'gemütlich', adjectiveFa: 'دنج' },
      { word: 'der Flur', meaning: 'راهرو', adjective: 'lang', adjectiveFa: 'بلند' },
      { word: 'der Balkon', meaning: 'بالکن', adjective: 'schön', adjectiveFa: 'زیبا' },
      { word: 'die Tür', meaning: 'در', adjective: 'geschlossen', adjectiveFa: 'بسته' },
      { word: 'das Fenster', meaning: 'پنجره', adjective: 'geschlossen', adjectiveFa: 'بسته' },
      { word: 'der Tisch', meaning: 'میز', adjective: 'frei', adjectiveFa: 'خالی' },
      { word: 'das Bett', meaning: 'تخت', adjective: 'bequem', adjectiveFa: 'راحت' },
      { word: 'der Schrank', meaning: 'کمد', adjective: 'neu', adjectiveFa: 'نو' },
      { word: 'die Lampe', meaning: 'چراغ', adjective: 'hell', adjectiveFa: 'پرنور' },
    ],
    render: ({ word, meaning, adjective, adjectiveFa }) => {
      const cap = word[0].toUpperCase() + word.slice(1);
      return [
        example(`Das ist ${word}.`, `این ${meaning} است.`, word, meaning),
        example(`${cap} ist ${adjective}.`, `${meaning} ${adjectiveFa} است.`, word, meaning, undefined, [{ word: adjective, meaning: adjectiveFa }]),
        example(`Ist ${word} ${adjective}?`, `آیا ${meaning} ${adjectiveFa} است؟`, word, meaning, undefined, [{ word: adjective, meaning: adjectiveFa }]),
      ];
    },
  },
);

const routines = build<{
  word: string; meaning: string; lines: [[string, string], [string, string], [string, string]];
}>(
  {
    lessonId: 'de-v2-daily-routine-basics',
    seeds: [
      { word: 'aufwachen', meaning: 'بیدارشدن', lines: [['Ich wache um sechs Uhr auf.', 'من ساعت شش بیدار می‌شوم.'], ['Wann wachst du auf?', 'چه زمانی بیدار می‌شوی؟'], ['Am Sonntag wache ich um acht Uhr auf.', 'یکشنبه ساعت هشت بیدار می‌شوم.']] },
      { word: 'aufstehen', meaning: 'از خواب بلندشدن', lines: [['Morgens stehe ich um sieben Uhr auf.', 'صبح‌ها ساعت هفت از خواب بلند می‌شوم.'], ['Stehst du früh auf?', 'زود از خواب بلند می‌شوی؟'], ['Am Wochenende stehe ich spät auf.', 'آخر هفته دیر از خواب بلند می‌شوم.']] },
      { word: 'duschen', meaning: 'دوش‌گرفتن', lines: [['Ich dusche am Morgen.', 'من صبح دوش می‌گیرم.'], ['Duschst du am Abend?', 'عصر دوش می‌گیری؟'], ['Heute dusche ich nach dem Kurs.', 'امروز بعد از کلاس دوش می‌گیرم.']] },
      { word: 'sich anziehen', meaning: 'لباس‌پوشیدن', lines: [['Ich ziehe mich schnell an.', 'من سریع لباس می‌پوشم.'], ['Ziehst du eine Jacke an?', 'کاپشن می‌پوشی؟'], ['Im Winter ziehe ich einen Mantel an.', 'زمستان پالتو می‌پوشم.']] },
      { word: 'frühstücken', meaning: 'صبحانه‌خوردن', lines: [['Ich frühstücke um acht Uhr.', 'من ساعت هشت صبحانه می‌خورم.'], ['Was isst du zum Frühstück?', 'برای صبحانه چه می‌خوری؟'], ['Heute frühstücke ich zu Hause.', 'امروز در خانه صبحانه می‌خورم.']] },
      { word: 'fahren', meaning: 'رفتن با وسیلهٔ نقلیه', lines: [['Ich fahre mit dem Bus zur Arbeit.', 'من با اتوبوس به محل کار می‌روم.'], ['Fährst du mit dem Rad?', 'با دوچرخه می‌روی؟'], ['Am Morgen fahre ich zum Kurs.', 'صبح به کلاس می‌روم.']] },
      { word: 'arbeiten', meaning: 'کارکردن', lines: [['Ich arbeite bis fünf Uhr.', 'من تا ساعت پنج کار می‌کنم.'], ['Arbeitest du heute?', 'امروز کار می‌کنی؟'], ['Am Montag arbeite ich zu Hause.', 'دوشنبه در خانه کار می‌کنم.']] },
      { word: 'lernen', meaning: 'یادگرفتن؛ درس‌خواندن', lines: [['Ich lerne am Nachmittag Deutsch.', 'من بعدازظهر آلمانی می‌خوانم.'], ['Lernst du am Abend?', 'عصر درس می‌خوانی؟'], ['Heute lerne ich mit Sara.', 'امروز با سارا درس می‌خوانم.']] },
      { word: 'zu Mittag essen', meaning: 'ناهارخوردن', lines: [['Ich esse um zwölf Uhr zu Mittag.', 'من ساعت دوازده ناهار می‌خورم.'], ['Isst du in der Pause?', 'در زمان استراحت غذا می‌خوری؟'], ['Heute essen wir zusammen zu Mittag.', 'امروز با هم ناهار می‌خوریم.']] },
      { word: 'einkaufen', meaning: 'خریدکردن', lines: [['Ich kaufe nach dem Kurs ein.', 'من بعد از کلاس خرید می‌کنم.'], ['Kaufst du heute ein?', 'امروز خرید می‌کنی؟'], ['Am Samstag kaufen wir im Markt ein.', 'شنبه در بازار خرید می‌کنیم.']] },
      { word: 'nach Hause kommen', meaning: 'به خانه برگشتن', lines: [['Ich komme um sechs Uhr nach Hause.', 'من ساعت شش به خانه برمی‌گردم.'], ['Wann kommst du nach Hause?', 'چه زمانی به خانه برمی‌گردی؟'], ['Heute komme ich früh nach Hause.', 'امروز زود به خانه برمی‌گردم.']] },
      { word: 'zu Abend essen', meaning: 'شام‌خوردن', lines: [['Wir essen um sieben Uhr zu Abend.', 'ما ساعت هفت شام می‌خوریم.'], ['Esst ihr zusammen zu Abend?', 'با هم شام می‌خورید؟'], ['Heute esse ich eine Suppe zu Abend.', 'امروز برای شام سوپ می‌خورم.']] },
      { word: 'fernsehen', meaning: 'تلویزیون‌دیدن', lines: [['Ich sehe am Abend fern.', 'من عصر تلویزیون می‌بینم.'], ['Siehst du gern fern?', 'تلویزیون‌دیدن را دوست داری؟'], ['Heute sehen wir zusammen fern.', 'امروز با هم تلویزیون می‌بینیم.']] },
      { word: 'lesen', meaning: 'خواندن', lines: [['Ich lese ein Buch.', 'من یک کتاب می‌خوانم.'], ['Liest du gern?', 'از خواندن خوشت می‌آید؟'], ['Vor dem Schlafen lese ich zehn Minuten.', 'پیش از خواب ده دقیقه مطالعه می‌کنم.']] },
      { word: 'schlafen gehen', meaning: 'به خواب رفتن', lines: [['Ich gehe um zehn Uhr schlafen.', 'من ساعت ده به خواب می‌روم.'], ['Gehst du früh schlafen?', 'زود به خواب می‌روی؟'], ['Am Sonntag gehe ich später schlafen.', 'یکشنبه دیرتر به خواب می‌روم.']] },
    ],
    render: ({ word, meaning, lines }) => lines.map(([text, fa]) => example(text, fa, word, meaning, 'عبارت‌های کوتاه برای توصیف برنامهٔ روزانه.')) as [Example, Example, Example],
  },
);

const shopping = build<{
  item: string; itemFa: string; accusative: string; accFa: string; price: string; priceFa: string;
}>(
  {
    lessonId: 'de-v2-shopping-prices',
    seeds: [
      { item: 'ein Kilo Äpfel', itemFa: 'یک کیلو سیب', accusative: 'ein Kilo Äpfel', accFa: 'یک کیلو سیب', price: 'zwei Euro', priceFa: 'دو یورو' },
      { item: 'ein Brot', itemFa: 'یک نان', accusative: 'ein Brot', accFa: 'یک نان', price: 'drei Euro', priceFa: 'سه یورو' },
      { item: 'ein Liter Milch', itemFa: 'یک لیتر شیر', accusative: 'einen Liter Milch', accFa: 'یک لیتر شیر', price: 'zwei Euro fünfzig', priceFa: 'دو یورو و پنجاه سنت' },
      { item: 'eine Flasche Wasser', itemFa: 'یک بطری آب', accusative: 'eine Flasche Wasser', accFa: 'یک بطری آب', price: 'einen Euro', priceFa: 'یک یورو' },
      { item: 'ein Kaffee', itemFa: 'یک قهوه', accusative: 'einen Kaffee', accFa: 'یک قهوه', price: 'zwei Euro', priceFa: 'دو یورو' },
      { item: 'ein Tee', itemFa: 'یک چای', accusative: 'einen Tee', accFa: 'یک چای', price: 'zwei Euro', priceFa: 'دو یورو' },
      { item: 'ein Kilo Tomaten', itemFa: 'یک کیلو گوجه‌فرنگی', accusative: 'ein Kilo Tomaten', accFa: 'یک کیلو گوجه‌فرنگی', price: 'vier Euro', priceFa: 'چهار یورو' },
      { item: 'eine Banane', itemFa: 'یک موز', accusative: 'eine Banane', accFa: 'یک موز', price: 'einen Euro', priceFa: 'یک یورو' },
      { item: 'eine Zeitung', itemFa: 'یک روزنامه', accusative: 'eine Zeitung', accFa: 'یک روزنامه', price: 'zwei Euro', priceFa: 'دو یورو' },
      { item: 'ein Ticket', itemFa: 'یک بلیت', accusative: 'ein Ticket', accFa: 'یک بلیت', price: 'drei Euro', priceFa: 'سه یورو' },
      { item: 'ein Stück Käse', itemFa: 'یک تکه پنیر', accusative: 'ein Stück Käse', accFa: 'یک تکه پنیر', price: 'vier Euro', priceFa: 'چهار یورو' },
      { item: 'ein Kilo Kartoffeln', itemFa: 'یک کیلو سیب‌زمینی', accusative: 'ein Kilo Kartoffeln', accFa: 'یک کیلو سیب‌زمینی', price: 'drei Euro', priceFa: 'سه یورو' },
      { item: 'eine Schokolade', itemFa: 'یک شکلات', accusative: 'eine Schokolade', accFa: 'یک شکلات', price: 'einen Euro fünfzig', priceFa: 'یک یورو و پنجاه سنت' },
      { item: 'ein Brötchen', itemFa: 'یک نان کوچک', accusative: 'ein Brötchen', accFa: 'یک نان کوچک', price: 'achtzig Cent', priceFa: 'هشتاد سنت' },
      { item: 'ein Saft', itemFa: 'یک آب‌میوه', accusative: 'einen Saft', accFa: 'یک آب‌میوه', price: 'zwei Euro', priceFa: 'دو یورو' },
    ],
    render: ({ item, itemFa, accusative, accFa, price, priceFa }) => {
      const cap = item[0].toUpperCase() + item.slice(1);
      return [
        example(`Wie viel kostet ${item}?`, `${itemFa} چند قیمت دارد؟`, 'kosten', 'قیمت‌داشتن'),
        example(`${cap} kostet ${price}.`, `${itemFa} ${priceFa} قیمت دارد.`, 'kosten', 'قیمت‌داشتن', undefined, [{ word: price, meaning: priceFa }]),
        example(`Ich nehme ${accusative}, bitte.`, `لطفاً ${accFa} برمی‌دارم.`, 'nehmen', 'گرفتن؛ انتخاب‌کردن', undefined, [{ word: item, meaning: itemFa }]),
      ];
    },
  },
);

const healthFeelings = build<{
  word: string; meaning: string; lines: [[string, string], [string, string], [string, string]];
}>(
  {
    lessonId: 'de-v2-feelings-health',
    seeds: [
      { word: 'müde', meaning: 'خسته', lines: [['Ich bin müde.', 'من خسته‌ام.'], ['Bist du müde?', 'خسته‌ای؟'], ['Heute bin ich nicht müde.', 'امروز خسته نیستم.']] },
      { word: 'froh', meaning: 'خوشحال', lines: [['Ich bin froh.', 'من خوشحالم.'], ['Bist du heute froh?', 'امروز خوشحالی؟'], ['Wir sind froh, danke.', 'خوشحالیم، ممنون.']] },
      { word: 'traurig', meaning: 'غمگین', lines: [['Ich bin heute traurig.', 'من امروز غمگینم.'], ['Warum bist du traurig?', 'چرا غمگینی؟'], ['Sie ist nicht traurig.', 'او غمگین نیست.']] },
      { word: 'krank', meaning: 'بیمار', lines: [['Ich bin heute krank.', 'من امروز بیمارم.'], ['Bist du krank?', 'بیماری؟'], ['Heute bin ich nicht krank.', 'امروز بیمار نیستم.']] },
      { word: 'fit', meaning: 'سرحال؛ آماده', lines: [['Ich bin fit.', 'من سرحالم.'], ['Bist du fit?', 'سرحالی؟'], ['Nach der Pause bin ich fit.', 'بعد از استراحت سرحالم.']] },
      { word: 'kalt', meaning: 'سرد', lines: [['Mir ist am Morgen kalt.', 'صبح احساس سرما می‌کنم.'], ['Ist dir kalt?', 'احساس سرما می‌کنی؟'], ['Mir ist heute nicht kalt.', 'امروز احساس سرما نمی‌کنم.']] },
      { word: 'warm', meaning: 'گرم', lines: [['Mir ist am Nachmittag warm.', 'بعدازظهر احساس گرما می‌کنم.'], ['Ist dir warm?', 'احساس گرما می‌کنی؟'], ['Im Zimmer ist es warm.', 'اتاق گرم است.']] },
      { word: 'Hunger', meaning: 'گرسنگی', lines: [['Ich habe Hunger.', 'من گرسنه‌ام.'], ['Hast du Hunger?', 'گرسنه‌ای؟'], ['Nach dem Kurs habe ich Hunger.', 'بعد از کلاس گرسنه‌ام.']] },
      { word: 'Durst', meaning: 'تشنگی', lines: [['Ich habe Durst.', 'من تشنه‌ام.'], ['Hast du Durst?', 'تشنه‌ای؟'], ['Nach dem Sport habe ich Durst.', 'بعد از ورزش تشنه‌ام.']] },
      { word: 'der Kopf', meaning: 'سر', lines: [['Mein Kopf tut heute weh.', 'امروز سرم درد می‌کند.'], ['Tut dein Kopf weh?', 'سرت درد می‌کند؟'], ['Ich brauche einen Arzt.', 'به پزشک نیاز دارم.']] },
      { word: 'der Bauch', meaning: 'شکم', lines: [['Mein Bauch tut weh.', 'شکمم درد می‌کند.'], ['Tut dein Bauch weh?', 'شکمت درد می‌کند؟'], ['Ich bin heute zu Hause.', 'امروز خانه می‌مانم.']] },
      { word: 'die Hand', meaning: 'دست', lines: [['Meine Hand tut weh.', 'دستم درد می‌کند.'], ['Tut deine Hand weh?', 'دستت درد می‌کند؟'], ['Ich brauche Hilfe.', 'به کمک نیاز دارم.']] },
      { word: 'nervös', meaning: 'مضطرب', lines: [['Ich bin nervös.', 'من مضطربم.'], ['Bist du vor dem Kurs nervös?', 'پیش از کلاس مضطربی؟'], ['Jetzt bin ich ruhig.', 'حالا آرامم.']] },
      { word: 'ruhig', meaning: 'آرام', lines: [['Ich bin ruhig.', 'من آرامم.'], ['Bist du jetzt ruhig?', 'حالا آرامی؟'], ['Das Zimmer ist ruhig.', 'اتاق آرام است.']] },
      { word: 'Angst', meaning: 'ترس', lines: [['Ich habe keine Angst.', 'من نمی‌ترسم.'], ['Hast du Angst?', 'می‌ترسی؟'], ['Vor dem Test habe ich ein bisschen Angst.', 'پیش از امتحان کمی می‌ترسم.']] },
    ],
    render: ({ word, meaning, lines }) => lines.map(([text, fa]) => example(text, fa, word, meaning, 'جمله‌های کوتاه برای احساس و وضعیت جسمی.')) as [Example, Example, Example],
  },
);

const integrated = build<{
  word: string; meaning: string; lines: [[string, string], [string, string], [string, string]];
}>(
  {
    lessonId: 'de-v2-integrated-dialogues',
    seeds: [
      { word: 'die Vorstellung', meaning: 'معرفی', lines: [['Guten Tag, ich heiße Mina.', 'روز بخیر، اسم من مینا است.'], ['Wie heißen Sie?', 'اسم شما چیست؟'], ['Ich komme aus dem Iran.', 'من اهل ایران هستم.']] },
      { word: 'der Kurs', meaning: 'کلاس؛ دوره', lines: [['Ich bin neu im Kurs.', 'من در کلاس تازه‌وارد هستم.'], ['Der Kurs beginnt um neun Uhr.', 'کلاس ساعت نه شروع می‌شود.'], ['Wir lernen heute Deutsch.', 'ما امروز آلمانی یاد می‌گیریم.']] },
      { word: 'der Bahnhof', meaning: 'ایستگاه قطار', lines: [['Wo ist der Bahnhof?', 'ایستگاه قطار کجاست؟'], ['Gehen Sie bitte geradeaus.', 'لطفاً مستقیم بروید.'], ['Ich brauche ein Ticket.', 'من به یک بلیت نیاز دارم.']] },
      { word: 'das Café', meaning: 'کافه', lines: [['Ich möchte einen Kaffee, bitte.', 'لطفاً یک قهوه می‌خواهم.'], ['Was kostet der Tee?', 'چای چند است؟'], ['Ein Tee kostet zwei Euro.', 'یک چای دو یورو قیمت دارد.']] },
      { word: 'der Markt', meaning: 'بازار', lines: [['Was kostet ein Kilo Äpfel?', 'یک کیلو سیب چند است؟'], ['Ich nehme zwei Bananen.', 'دو موز برمی‌دارم.'], ['Danke, auf Wiedersehen!', 'ممنون، خداحافظ!']] },
      { word: 'das Hotel', meaning: 'هتل', lines: [['Guten Abend, ich brauche ein Zimmer.', 'عصر بخیر، به یک اتاق نیاز دارم.'], ['Haben Sie ein Zimmer?', 'اتاق دارید؟'], ['Danke, hier ist mein Pass.', 'ممنون، این گذرنامهٔ من است.']] },
      { word: 'die Hilfe', meaning: 'کمک', lines: [['Entschuldigung, können Sie mir helfen?', 'ببخشید، می‌توانید به من کمک کنید؟'], ['Ich suche die Apotheke.', 'دنبال داروخانه می‌گردم.'], ['Gehen Sie bitte nach links.', 'لطفاً به چپ بروید.']] },
      { word: 'die Familie', meaning: 'خانواده', lines: [['Das ist meine Schwester.', 'این خواهر من است.'], ['Sie heißt Sara.', 'اسم او سارا است.'], ['Sie wohnt in Berlin.', 'او در برلین زندگی می‌کند.']] },
      { word: 'die Schule', meaning: 'مدرسه', lines: [['Ich gehe heute zur Schule.', 'من امروز به مدرسه می‌روم.'], ['Mein Buch ist in der Tasche.', 'کتابم در کیف است.'], ['Der Unterricht beginnt um acht Uhr.', 'درس ساعت هشت شروع می‌شود.']] },
      { word: 'das Essen', meaning: 'غذا', lines: [['Ich esse gern Suppe.', 'من سوپ را با میل می‌خورم.'], ['Trinkst du Wasser?', 'آب می‌نوشی؟'], ['Das Essen ist sehr gut.', 'غذا خیلی خوب است.']] },
      { word: 'die Adresse', meaning: 'نشانی', lines: [['Meine Adresse ist in der Rosenstraße.', 'نشانی من در خیابان رز است.'], ['Meine Hausnummer ist zwölf.', 'شمارهٔ خانهٔ من دوازده است.'], ['Ich wohne in Berlin.', 'من در برلین زندگی می‌کنم.']] },
      { word: 'die Uhrzeit', meaning: 'زمان؛ ساعت', lines: [['Wie spät ist es?', 'ساعت چند است؟'], ['Es ist zehn Uhr.', 'ساعت ده است.'], ['Der Bus kommt um zehn Uhr.', 'اتوبوس ساعت ده می‌آید.']] },
      { word: 'das Zuhause', meaning: 'خانه', lines: [['Ich bin jetzt zu Hause.', 'من الان خانه هستم.'], ['Das Wohnzimmer ist hell.', 'اتاق نشیمن روشن است.'], ['Am Abend lese ich ein Buch.', 'عصر کتاب می‌خوانم.']] },
      { word: 'die Gesundheit', meaning: 'سلامتی', lines: [['Mir ist nicht gut.', 'حالم خوب نیست.'], ['Mein Kopf tut heute weh.', 'امروز سرم درد می‌کند.'], ['Ich brauche einen Arzt.', 'به پزشک نیاز دارم.']] },
      { word: 'der Einkauf', meaning: 'خرید', lines: [['Ich kaufe Brot und Milch.', 'من نان و شیر می‌خرم.'], ['Das Brot kostet drei Euro.', 'نان سه یورو قیمت دارد.'], ['Ich bezahle, bitte.', 'لطفاً حساب می‌کنم.']] },
    ],
    render: ({ word, meaning, lines }) => lines.map(([text, fa]) => example(text, fa, word, meaning, 'گفت‌وگوی کوتاه با واژگان آشنای دوره.')) as [Example, Example, Example],
  },
);

export const PRE_A1_SENTENCE_ADDITIONS: Record<string, LearningSentence[]> = {
  'de-v2-greetings': greetings,
  'de-v2-name-origin': nameOrigin,
  'de-v2-classroom': classroom,
  'de-v2-numbers-time': times,
  'de-v2-basic-needs': needs,
  'de-v2-alphabet': alphabet,
  'de-v2-countries-languages': countryLanguages,
  'de-v2-days-calendar': calendar,
  'de-v2-personal-details': contactDetails,
  'de-v2-food-drink': food,
  'de-v2-objects-colors': objectsColours,
  'de-v2-places-directions': placesDirections,
  'de-v2-core-verbs-pronouns': coreVerbs,
  'de-v2-questions-negation': questionsNegation,
  'de-v2-family-basics': family,
  'de-v2-home-rooms': home,
  'de-v2-daily-routine-basics': routines,
  'de-v2-shopping-prices': shopping,
  'de-v2-feelings-health': healthFeelings,
  'de-v2-integrated-dialogues': integrated,
};
