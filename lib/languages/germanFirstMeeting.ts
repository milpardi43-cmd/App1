import type { LearningUnit } from './learningDesign';

export const FIRST_MEETING: LearningUnit = {
  id: 'de-a1-first-meeting', version: 1, language: 'de', level: 'A1', title: 'اولین آشنایی',
  objectives: [
    { id: 'greet', canDoFa: 'در یک دیدار کوتاه سلام کنم و خداحافظی کنم.' },
    { id: 'name', canDoFa: 'نام خودم را بگویم و نام طرف مقابل را بپرسم.' },
    { id: 'origin', canDoFa: 'کشور و زبانم را معرفی کنم.' },
    { id: 'register', canDoFa: 'خطاب دوستانه du و رسمی Sie را در معرفی تشخیص دهم.' },
    { id: 'repair', canDoFa: 'وقتی متوجه نمی‌شوم، درخواست تکرار کنم.' },
  ],
  lessons: [
    {
      id: 'de-meeting-hello', title: 'یک سلام، یک شروع', canDoFa: 'برای دیدار دوستانه یا رسمی، سلام مناسبی انتخاب می‌کنم.', objectiveIds: ['greet'], prerequisiteIds: [],
      situationFa: 'برای اولین بار وارد کلاس می‌شوید. یک نفر به شما سلام می‌کند. اول به صدای کوتاه گوش بدهید؛ بعد معنی را بررسی کنید.',
      dialogue: [
        { speaker: 'لنا', text: 'Hallo! Guten Morgen!', fa: 'سلام! صبح بخیر!' },
        { speaker: 'شما', text: 'Guten Morgen!', fa: 'صبح بخیر!' },
        { speaker: 'لنا', text: 'Bis bald!', fa: 'به‌زودی می‌بینمت!' },
      ],
      examples: [
        { text: 'Hallo!', fa: 'سلام؛ در موقعیت‌های غیررسمی رایج است.' },
        { text: 'Guten Tag!', fa: 'روز بخیر؛ برای برخورد مؤدبانه در طول روز.' },
        { text: 'Auf Wiedersehen!', fa: 'خداحافظ؛ در موقعیت‌های رسمی‌تر رایج است.' },
      ],
      patternFa: 'فعلاً عبارت را یک‌جا یاد بگیرید. Guten Morgen برای صبح است؛ Auf Wiedersehen برای پایان دیدار است، نه شروع آن.',
      pronunciationFa: 'در Hallo تکیه روی بخش دوم است. صدای آلمانی را تقلید کنید؛ نوشتار فارسی جای شنیدن را نمی‌گیرد.',
      exercises: [
        { id: 'meet-g-listen', objectiveId: 'greet', skill: 'listening', kind: 'choice', promptFa: 'گوش بدهید. این فرد چه می‌گوید؟', audioText: 'Auf Wiedersehen!', transcriptFa: 'خداحافظ!', choices: [{ id: 'morning', label: 'صبح بخیر' }, { id: 'bye', label: 'خداحافظ' }, { id: 'thanks', label: 'ممنون' }], correctChoice: 'bye', explanationFa: 'Auf Wiedersehen عبارت خداحافظی است. آن را در پایان دیدار به کار ببرید.' },
        { id: 'meet-g-read', objectiveId: 'greet', skill: 'reading', kind: 'choice', promptFa: 'صبح وارد کلاس می‌شوید. کدام عبارت مناسب است؟', choices: [{ id: 'bye', label: 'Auf Wiedersehen!' }, { id: 'morning', label: 'Guten Morgen!' }, { id: 'please', label: 'Bitte!' }], correctChoice: 'morning', explanationFa: 'Guten Morgen یعنی صبح بخیر.' },
        { id: 'meet-g-write', objectiveId: 'greet', skill: 'writing', kind: 'write', promptFa: 'در شروع یک دیدار رسمی در طول روز، «روز بخیر» را به آلمانی بنویسید.', acceptedAnswers: ['Guten Tag', 'Guten Tag!'], sample: 'Guten Tag!', hintFa: 'دو واژه: Guten + واژه آلمانی روز.', explanationFa: 'Guten Tag یک سلام مؤدبانه است.' },
      ],
    },
    {
      id: 'de-meeting-name', title: 'من چه کسی هستم؟', canDoFa: 'خودم را معرفی می‌کنم و نام یک همکلاسی را می‌پرسم.', objectiveIds: ['name'], prerequisiteIds: ['de-meeting-hello'],
      situationFa: 'کنار یک همکلاسی جدید نشسته‌اید. نامش را می‌پرسید و خودتان را معرفی می‌کنید.',
      dialogue: [
        { speaker: 'مکس', text: 'Hallo! Ich heiße Max. Wie heißt du?', fa: 'سلام! اسم من مکس است. اسم تو چیست؟' },
        { speaker: 'شما', text: 'Ich heiße Sara.', fa: 'اسم من سارا است.' },
        { speaker: 'مکس', text: 'Freut mich!', fa: 'خوشوقتم!' },
      ],
      examples: [{ text: 'Ich heiße Sara.', fa: 'اسم من سارا است.' }, { text: 'Mein Name ist Sara.', fa: 'نام من سارا است؛ راه دیگر معرفی نام.' }, { text: 'Wie heißt du?', fa: 'اسم تو چیست؟ خطاب دوستانه.' }],
      patternFa: 'Ich heiße + نام. برای پرسیدن از یک دوست: Wie heißt du? شکل فعل با ich و du تغییر می‌کند؛ فعلاً این دو الگو را در جمله یاد بگیرید.',
      pronunciationFa: 'ei در heiße مانند صدای «آی» است. ß صدای «س» می‌دهد. ch در ich با «ش» فارسی کاملاً یکسان نیست؛ به صدا توجه کنید.',
      exercises: [
        { id: 'meet-n-listen', objectiveId: 'name', skill: 'listening', kind: 'choice', promptFa: 'نام گوینده چیست؟', audioText: 'Hallo, ich heiße Ben.', transcriptFa: 'سلام، اسم من بِن است.', choices: [{ id: 'max', label: 'Max' }, { id: 'ben', label: 'Ben' }, { id: 'sara', label: 'Sara' }], correctChoice: 'ben', explanationFa: 'بعد از Ich heiße نام Ben را می‌شنوید.' },
        { id: 'meet-n-order', objectiveId: 'name', skill: 'writing', kind: 'order', promptFa: 'با زدن روی واژه‌ها، جمله «اسم من سارا است» را بسازید.', tokens: ['Sara.', 'heiße', 'Ich'], answer: 'Ich heiße Sara.', explanationFa: 'در این جمله، فاعل Ich اول و فعل heiße دوم می‌آید.' },
        { id: 'meet-n-write', objectiveId: 'name', skill: 'writing', kind: 'write', promptFa: 'از یک همکلاسی به شکل دوستانه بپرسید: «اسم تو چیست؟»', acceptedAnswers: ['Wie heißt du?', 'Wie ist dein Name?', 'Was ist dein Name?'], sample: 'Wie heißt du?', hintFa: 'Wie + شکل فعل heißen برای du + du.', explanationFa: 'Wie heißt du? پرسش رایج و دوستانه برای نام است.' },
      ],
    },
    {
      id: 'de-meeting-origin', title: 'از کجا آمده‌ام؟', canDoFa: 'کشور و زبانی را که یاد می‌گیرم معرفی می‌کنم.', objectiveIds: ['origin'], prerequisiteIds: ['de-meeting-name'],
      situationFa: 'همکلاسی از شما می‌پرسد اهل کجا هستید. پاسخ کوتاه می‌دهید و می‌گویید آلمانی یاد می‌گیرید.',
      dialogue: [{ speaker: 'لنا', text: 'Woher kommst du?', fa: 'اهل کجا هستی؟' }, { speaker: 'شما', text: 'Ich komme aus dem Iran. Ich lerne Deutsch.', fa: 'من اهل ایران هستم. آلمانی یاد می‌گیرم.' }, { speaker: 'لنا', text: 'Ich komme aus Deutschland.', fa: 'من اهل آلمان هستم.' }],
      examples: [{ text: 'Ich komme aus dem Iran.', fa: 'من اهل ایران هستم.' }, { text: 'Ich komme aus Deutschland.', fa: 'من اهل آلمان هستم.' }, { text: 'Ich spreche Persisch.', fa: 'من فارسی صحبت می‌کنم.' }, { text: 'Ich lerne Deutsch.', fa: 'من آلمانی یاد می‌گیرم.' }],
      patternFa: 'Ich komme aus … برای معرفی کشور است. در این الگو برای ایران از aus dem Iran استفاده می‌کنیم؛ Deutschland در این جمله حرف تعریف ندارد. همه کشورها یک الگوی یکسان ندارند.',
      pronunciationFa: 'sch در Deutsch و Persisch صدای «ش» می‌دهد. eu در Deutsch تقریباً صدای «اُی» دارد.',
      exercises: [
        { id: 'meet-o-listen', objectiveId: 'origin', skill: 'listening', kind: 'choice', promptFa: 'این فرد چه زبانی صحبت می‌کند؟', audioText: 'Ich spreche Persisch.', transcriptFa: 'من فارسی صحبت می‌کنم.', choices: [{ id: 'german', label: 'آلمانی' }, { id: 'persian', label: 'فارسی' }, { id: 'english', label: 'انگلیسی' }], correctChoice: 'persian', explanationFa: 'Persisch یعنی فارسی؛ Deutsch یعنی آلمانی.' },
        { id: 'meet-o-order', objectiveId: 'origin', skill: 'writing', kind: 'order', promptFa: 'جمله «من اهل ایران هستم» را بسازید.', tokens: ['dem', 'Ich', 'Iran.', 'aus', 'komme'], answer: 'Ich komme aus dem Iran.', explanationFa: 'الگوی این جمله Ich komme aus dem Iran است.' },
        { id: 'meet-o-write', objectiveId: 'origin', skill: 'writing', kind: 'write', promptFa: 'بنویسید: «من آلمانی یاد می‌گیرم.»', acceptedAnswers: ['Ich lerne Deutsch.', 'Deutsch lerne ich.'], sample: 'Ich lerne Deutsch.', hintFa: 'Ich + lerne + نام زبان.', explanationFa: 'Deutsch نام زبان آلمانی است و با حرف بزرگ نوشته می‌شود.' },
      ],
    },
    {
      id: 'de-meeting-register', title: 'دوستانه یا رسمی؟', canDoFa: 'برای پرسیدن نام، بین du و Sie انتخاب مناسبی می‌کنم.', objectiveIds: ['register', 'name'], prerequisiteIds: ['de-meeting-name'],
      situationFa: 'این بار به‌جای همکلاسی، با کارمند پذیرش صحبت می‌کنید. لحن مؤدبانه و خطاب رسمی را تمرین می‌کنید.',
      dialogue: [{ speaker: 'پذیرش', text: 'Guten Tag! Wie heißen Sie?', fa: 'روز بخیر! نام شما چیست؟' }, { speaker: 'شما', text: 'Ich heiße Sara Ahmadi.', fa: 'نام من سارا احمدی است.' }, { speaker: 'پذیرش', text: 'Willkommen!', fa: 'خوش آمدید!' }],
      examples: [{ text: 'Wie heißt du?', fa: 'نام تو چیست؟ دوستانه.' }, { text: 'Wie heißen Sie?', fa: 'نام شما چیست؟ رسمی.' }, { text: 'Woher kommen Sie?', fa: 'اهل کجا هستید؟ رسمی.' }],
      patternFa: 'du برای خطاب دوستانه مفرد است؛ Sie برای خطاب رسمی به یک یا چند نفر. Sie رسمی با حرف بزرگ نوشته می‌شود. صرف فعل را همراه عبارت یاد بگیرید: heißt du / heißen Sie.',
      pronunciationFa: 'در Sie، حرف S آغازین این واژه شبیه «ز» است. ie صدای «ای» کشیده می‌دهد؛ با ei در heißen فرق دارد.',
      exercises: [
        { id: 'meet-r-listen', objectiveId: 'register', skill: 'listening', kind: 'choice', promptFa: 'خطاب در این پرسش چگونه است؟', audioText: 'Wie heißen Sie?', transcriptFa: 'نام شما چیست؟', choices: [{ id: 'formal', label: 'رسمی' }, { id: 'casual', label: 'دوستانه با du' }], correctChoice: 'formal', explanationFa: 'Sie و heißen نشانه الگوی رسمی این پرسش‌اند.' },
        { id: 'meet-r-order', objectiveId: 'register', skill: 'writing', kind: 'order', promptFa: 'به‌شکل رسمی بپرسید «نام شما چیست؟»', tokens: ['Sie?', 'Wie', 'heißen'], answer: 'Wie heißen Sie?', explanationFa: 'صورت رسمی این پرسش Wie heißen Sie? است.' },
        { id: 'meet-r-write', objectiveId: 'register', skill: 'writing', kind: 'write', promptFa: 'صورت رسمی «Wie heißt du?» را بنویسید.', acceptedAnswers: ['Wie heißen Sie?', 'Wie ist Ihr Name?', 'Was ist Ihr Name?'], sample: 'Wie heißen Sie?', hintFa: 'du به Sie و heißt به heißen تبدیل می‌شود.', explanationFa: 'در نوشتن واقعی، S در Sie رسمی را بزرگ بنویسید؛ این تمرین بزرگی حروف را نمره‌گذاری نمی‌کند.' },
      ],
    },
    {
      id: 'de-meeting-repeat', title: 'وقتی متوجه نمی‌شوم', canDoFa: 'مؤدبانه می‌گویم متوجه نشدم و درخواست تکرار می‌کنم.', objectiveIds: ['repair'], prerequisiteIds: ['de-meeting-register'],
      situationFa: 'نام یا جمله طرف مقابل را نشنیده‌اید. به‌جای حدس‌زدن، از او می‌خواهید تکرار کند.',
      dialogue: [{ speaker: 'همراه', text: 'Ich heiße Friedrich.', fa: 'اسم من فریدریش است.' }, { speaker: 'شما', text: 'Entschuldigung, können Sie das bitte wiederholen?', fa: 'ببخشید، می‌توانید لطفاً آن را تکرار کنید؟' }, { speaker: 'همراه', text: 'Friedrich.', fa: 'فریدریش.' }],
      examples: [{ text: 'Ich verstehe nicht.', fa: 'متوجه نمی‌شوم.' }, { text: 'Noch einmal, bitte.', fa: 'یک بار دیگر، لطفاً.' }, { text: 'Können Sie das bitte wiederholen?', fa: 'می‌توانید لطفاً آن را تکرار کنید؟' }, { text: 'Bitte sprechen Sie langsam.', fa: 'لطفاً آهسته صحبت کنید.' }],
      patternFa: 'Noch einmal, bitte عبارت کوتاه و کاربردی برای تکرار است. شکل طولانی‌تر و مؤدبانه: Können Sie das bitte wiederholen? فعلاً آن را به‌عنوان یک عبارت کاربردی یاد بگیرید.',
      pronunciationFa: 'ö در können دقیقاً معادل «اُ» فارسی نیست. لب‌ها گرد می‌شوند؛ گوش‌دادن و تقلید مهم‌تر از رونویسی فارسی است.',
      exercises: [
        { id: 'meet-p-listen', objectiveId: 'repair', skill: 'listening', kind: 'choice', promptFa: 'گوینده چه درخواستی دارد؟', audioText: 'Noch einmal, bitte.', transcriptFa: 'یک بار دیگر، لطفاً.', choices: [{ id: 'repeat', label: 'تکرار کردن' }, { id: 'name', label: 'گفتن کشور' }, { id: 'bye', label: 'خداحافظی' }], correctChoice: 'repeat', explanationFa: 'Noch einmal یعنی یک بار دیگر.' },
        { id: 'meet-p-order', objectiveId: 'repair', skill: 'writing', kind: 'order', promptFa: 'جمله «متوجه نمی‌شوم» را بسازید.', tokens: ['nicht.', 'Ich', 'verstehe'], answer: 'Ich verstehe nicht.', explanationFa: 'این جمله کوتاه نشان می‌دهد به تکرار یا توضیح نیاز دارید.' },
        { id: 'meet-p-write', objectiveId: 'repair', skill: 'writing', kind: 'write', promptFa: 'از طرف مقابل بخواهید یک بار دیگر تکرار کند.', acceptedAnswers: ['Noch einmal, bitte.', 'Bitte noch einmal.', 'Können Sie das bitte wiederholen?', 'Können Sie bitte wiederholen?', 'Bitte wiederholen Sie das.', 'Kannst du das bitte wiederholen?'], sample: 'Noch einmal, bitte.', hintFa: 'عبارت کوتاه با Noch شروع می‌شود.', explanationFa: 'هم عبارت کوتاه و هم درخواست مؤدبانه کامل می‌توانند برای تکرار استفاده شوند.' },
      ],
    },
  ],
  mission: [
    { id: 'mission-listen', objectiveId: 'name', skill: 'listening', kind: 'choice', promptFa: 'در پذیرش یک کلاس جدید هستید. نام فردی که معرفی می‌شود چیست؟', audioText: 'Guten Tag! Ich heiße Julia. Ich komme aus Deutschland.', transcriptFa: 'روز بخیر! اسم من یولیا است. اهل آلمان هستم.', choices: [{ id: 'nora', label: 'Nora' }, { id: 'julia', label: 'Julia' }, { id: 'sara', label: 'Sara' }], correctChoice: 'julia', explanationFa: 'نام بعد از Ich heiße می‌آید: Julia.' },
    { id: 'mission-greeting', objectiveId: 'greet', skill: 'reading', kind: 'choice', promptFa: 'دیدار رسمی تمام شده است. چه می‌گویید؟', choices: [{ id: 'morning', label: 'Guten Morgen!' }, { id: 'bye', label: 'Auf Wiedersehen!' }, { id: 'name', label: 'Wie heißt du?' }], correctChoice: 'bye', explanationFa: 'در پایان دیدار از عبارت خداحافظی استفاده می‌کنیم.' },
    { id: 'mission-introduce', objectiveId: 'name', skill: 'writing', kind: 'write', promptFa: 'نقش جدید: نام شما Nora است. با یک جمله نام خود را معرفی کنید.', acceptedAnswers: ['Ich heiße Nora.', 'Mein Name ist Nora.', 'Ich bin Nora.', 'Hallo, ich heiße Nora.'], sample: 'Ich heiße Nora.', hintFa: 'الگوی معرفی نام را به یاد بیاورید؛ فقط نام جدید است.', explanationFa: 'نام Nora باید در یک جمله معرفی بیاید؛ نوشتن تنها نام کافی نیست.' },
    { id: 'mission-country', objectiveId: 'origin', skill: 'writing', kind: 'write', promptFa: 'در این نقش، اهل آلمان هستید. با یک جمله بگویید اهل کجا هستید.', acceptedAnswers: ['Ich komme aus Deutschland.', 'Ich bin aus Deutschland.', 'Aus Deutschland komme ich.'], sample: 'Ich komme aus Deutschland.', hintFa: 'Ich komme aus …؛ نام کشور Deutschland است.', explanationFa: 'در این جمله Deutschland بدون حرف تعریف می‌آید.' },
    { id: 'mission-formal', objectiveId: 'register', skill: 'writing', kind: 'write', promptFa: 'نام کارمند پذیرش را نمی‌دانید. به‌شکل رسمی نامش را بپرسید.', acceptedAnswers: ['Wie heißen Sie?', 'Wie ist Ihr Name?', 'Was ist Ihr Name?'], sample: 'Wie heißen Sie?', hintFa: 'از Sie رسمی استفاده کنید، نه du.', explanationFa: 'این موقعیت رسمی است؛ یکی از الگوهای رسمی پرسیدن نام را به کار ببرید.' },
    { id: 'mission-repeat', objectiveId: 'repair', skill: 'writing', kind: 'write', promptFa: 'پاسخ کارمند را نشنیده‌اید. مؤدبانه درخواست تکرار کنید.', acceptedAnswers: ['Noch einmal, bitte.', 'Bitte noch einmal.', 'Können Sie das bitte wiederholen?', 'Können Sie bitte wiederholen?', 'Bitte wiederholen Sie das.'], sample: 'Noch einmal, bitte.', hintFa: 'از عبارت کوتاه تکرار یا درخواست رسمی کامل استفاده کنید.', explanationFa: 'درخواست تکرار کمک می‌کند گفتگو ادامه پیدا کند.' },
  ],
  oralMissionFa: 'بدون نگاه به مثال‌ها، خودتان را با نام و کشور معرفی کنید؛ نام طرف مقابل را بپرسید و سپس درخواست تکرار کنید. این تمرین گفتاری خودارزیابی است و نمره خودکار تلفظ یا تأیید تسلط ندارد.',
};
