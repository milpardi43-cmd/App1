// English course content for the "app 2" English-learning mini-app.
// 12 lessons × 12 carefully ordered, practical everyday words.
// Each word: English, Persian meaning, an example sentence and its translation.

export interface LangWord {
  en: string;
  fa: string;
  ex: string;
  exFa: string;
}

export interface LangLesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string; // lucide icon name (resolved in the UI)
  color: string;
  gradient: [string, string];
  words: LangWord[];
}

const w = (en: string, fa: string, ex: string, exFa: string): LangWord => ({ en, fa, ex, exFa });

export const LESSONS: LangLesson[] = [
  {
    id: 1,
    title: 'کلمات پایه',
    subtitle: 'ضروری‌ترین کلمات روزمره',
    icon: 'sparkles',
    color: '#06b6d4',
    gradient: ['#06b6d4', '#0e7490'],
    words: [
      w('hello', 'سلام', 'Hello! How are you today?', 'سلام! امروز حال شما چطور است؟'),
      w('thank you', 'متشکرم', 'Thank you very much for your help.', 'بسیار متشکرم برای کمک شما.'),
      w('yes', 'بله', 'Yes, I agree with you completely.', 'بله، کاملاً با شما موافقم.'),
      w('no', 'نه / خیر', 'No, I am not sure about that.', 'نه، درباره‌ی آن مطمئن نیستم.'),
      w('please', 'لطفاً', 'Please, give me a glass of water.', 'لطفاً یک لیوان آب به من بدهید.'),
      w('sorry', 'متأسفم', 'I am sorry, I made a mistake.', 'متأسفم، من اشتباه کردم.'),
      w('excuse me', 'ببخشید', 'Excuse me, where is the station?', 'ببخشید، ایستگاه کجاست؟'),
      w('good', 'خوب', 'This is a very good book.', 'این کتاب بسیار خوبی است.'),
      w('bad', 'بد', 'The weather is bad today.', 'هوا امروز بد است.'),
      w('big', 'بزرگ', 'Tehran is a big city.', 'تهران شهر بزرگی است.'),
      w('small', 'کوچک', 'She lives in a small town.', 'او در شهر کوچکی زندگی می‌کند.'),
      w('very', 'خیلی', 'I am very happy today.', 'من امروز خیلی خوشحالم.'),
    ],
  },
  {
    id: 2,
    title: 'خانواده',
    subtitle: 'اعضای خانواده و دوستان',
    icon: 'users',
    color: '#6366f1',
    gradient: ['#6366f1', '#4338ca'],
    words: [
      w('mother', 'مادر', 'My mother is a kind woman.', 'مادر من زنی مهربان است.'),
      w('father', 'پدر', 'My father works very hard.', 'پدر من خیلی سخت کار می‌کند.'),
      w('brother', 'برادر', 'My brother is twenty years old.', 'برادر من بیست سال دارد.'),
      w('sister', 'خواهر', 'My sister goes to the university.', 'خواهر من به دانشگاه می‌رود.'),
      w('family', 'خانواده', 'My family lives in Tehran.', 'خانواده‌ی من در تهران زندگی می‌کنند.'),
      w('friend', 'دوست', 'He is my best friend.', 'او بهترین دوست من است.'),
      w('child', 'کودک', 'The child is playing in the park.', 'کودک دارد در پارک بازی می‌کند.'),
      w('parent', 'والدین', 'Your parents are very loving.', 'والدین شما خیلی مهربان هستند.'),
      w('uncle', 'عمو / دایی', 'My uncle is a teacher.', 'عموی من معلم است.'),
      w('aunt', 'خاله / عمه', 'My aunt lives in Isfahan.', 'خاله‌ی من در اصفهان زندگی می‌کند.'),
      w('wife', 'همسر / زن', 'He loves his wife very much.', 'او همسرش را خیلی دوست دارد.'),
      w('husband', 'همسر / شوهر', 'Her husband is an engineer.', 'شوهر او مهندس است.'),
    ],
  },
  {
    id: 3,
    title: 'غذا',
    subtitle: 'خوراکی‌ها و نوشیدنی‌ها',
    icon: 'coffee',
    color: '#f59e0b',
    gradient: ['#f59e0b', '#b45309'],
    words: [
      w('bread', 'نان', 'I eat bread with butter.', 'من نان را با کره می‌خورم.'),
      w('water', 'آب', 'Drink water every day.', 'هر روز آب بنوشید.'),
      w('milk', 'شیر', 'The milk is cold.', 'شیر سرد است.'),
      w('rice', 'برنج', 'We like rice for dinner.', 'ما برای شام برنج دوست داریم.'),
      w('meat', 'گوشت', 'He does not eat meat.', 'او گوشت نمی‌خورد.'),
      w('fruit', 'میوه', 'Apples are my favorite fruit.', 'سیب‌ها میوه‌ی مورد علاقه‌ی من هستند.'),
      w('breakfast', 'صبحانه', 'I have breakfast at 7 oclock.', 'من ساعت هفت صبحانه می‌خورم.'),
      w('lunch', 'ناهار', 'We had lunch together.', 'ما با هم ناهار خوردیم.'),
      w('dinner', 'شام', 'What is for dinner tonight?', 'امشب برای شام چه چیزی هست؟'),
      w('drink', 'نوشیدن', 'Drink your tea slowly.', 'چای شما را آهسته بنوشید.'),
      w('eat', 'خوردن', 'They eat breakfast together.', 'آن‌ها با هم صبحانه می‌خورند.'),
      w('hungry', 'گرسنه', 'I am very hungry.', 'من خیلی گرسنه هستم.'),
    ],
  },
  {
    id: 4,
    title: 'سفر',
    subtitle: 'سفر و رفت‌وآمد',
    icon: 'plane',
    color: '#16a34a',
    gradient: ['#16a34a', '#15803d'],
    words: [
      w('airport', 'فرودگاه', 'The airport is very crowded.', 'فرودگاه خیلی شلوغ است.'),
      w('ticket', 'بلیت', 'I bought two tickets.', 'من دو بلیت خریدم.'),
      w('hotel', 'هتل', 'The hotel has a nice room.', 'هتل اتاق خوبی دارد.'),
      w('journey', 'سفر', 'The journey was very pleasant.', 'سفر خیلی خوشایند بود.'),
      w('passport', 'گذرنامه', 'Show me your passport, please.', 'لطفاً گذرنامه‌ی خود را نشان دهید.'),
      w('suitcase', 'چمدان', 'Pack your suitcase tonight.', 'چمدان خود را امشب ببندید.'),
      w('map', 'نقشه', 'Look at the map carefully.', 'به نقشه دقت نگاه کنید.'),
      w('train', 'قطار', 'The train leaves at eight.', 'قطار ساعت هشت حرکت می‌کند.'),
      w('flight', 'پرواز', 'My flight is at 10 a.m.', 'پرواز من ساعت ده صبح است.'),
      w('station', 'ایستگاه', 'The station is near the market.', 'ایستگاه نزدیک بازار است.'),
      w('taxi', 'تاکسی', 'Take a taxi to the hotel.', 'یک تاکسی به هتل بگیرید.'),
      w('arrive', 'رسیدن', 'They arrived after a long flight.', 'آن‌ها بعد از یک پرواز طولانی رسیدند.'),
    ],
  },
  {
    id: 5,
    title: 'زمان',
    subtitle: 'روزها و زمان',
    icon: 'clock',
    color: '#8b5cf6',
    gradient: ['#8b5cf6', '#6d28d9'],
    words: [
      w('today', 'امروز', 'What are you doing today?', 'امروز چه کار می‌کنید؟'),
      w('tomorrow', 'فردا', 'See you tomorrow.', 'فردا می‌بینمت.'),
      w('yesterday', 'دیروز', 'I finished the work yesterday.', 'من کار را دیروز تمام کردم.'),
      w('week', 'هفته', 'I see him twice a week.', 'من هفته‌ای دو بار او را می‌بینم.'),
      w('month', 'ماه', 'We will travel next month.', 'ما ماه آینده سفر خواهیم کرد.'),
      w('year', 'سال', 'This year has been busy.', 'امسال سال شلوغی بوده است.'),
      w('hour', 'ساعت', 'Wait one more hour.', 'یک ساعت دیگر صبر کن.'),
      w('minute', 'دقیقه', 'Give me a few minutes.', 'به من چند دقیقه بده.'),
      w('morning', 'صبح', 'Good morning, teacher!', 'صبح بخیر، استاد!'),
      w('evening', 'عصر', 'We go for a walk in the evening.', 'ما عصرها می‌رویم قدم‌زدن.'),
      w('night', 'شب', 'He sleeps late at night.', 'او شب دیر می‌خوابد.'),
      w('always', 'همیشه', 'Always be kind to others.', 'همیشه با دیگران مهربان باش.'),
    ],
  },
  {
    id: 6,
    title: 'رنگ‌ها',
    subtitle: 'رنگ‌ها و توصیف‌ها',
    icon: 'palette',
    color: '#ec4899',
    gradient: ['#ec4899', '#be185d'],
    words: [
      w('red', 'قرمز', 'The red car is fast.', 'ماشین قرمز سریع است.'),
      w('blue', 'آبی', 'The sky is blue today.', 'آسمان امروز آبی است.'),
      w('color', 'رنگ', 'What is your favorite color?', 'رنگ مورد علاقه‌ی شما چیست؟'),
      w('beautiful', 'زیبا', 'She has a beautiful smile.', 'او لبخند زیبایی دارد.'),
      w('warm', 'گرم', 'The room is nice and warm.', 'اتاق خوب و گرم است.'),
      w('cold', 'سرد', 'The water is very cold.', 'آب خیلی سرد است.'),
      w('new', 'جدید / نو', 'I bought a new phone.', 'من یک گوشی جدید خریدم.'),
      w('old', 'قدیمی', 'This is an old building.', 'این یک ساختمان قدیمی است.'),
      w('easy', 'آسان', 'The test was very easy.', 'آزمون خیلی آسان بود.'),
      w('difficult', 'سخت', 'English is not difficult at all.', 'انگلیسی اصلاً سخت نیست.'),
      w('fast', 'سریع', 'The train is very fast.', 'قطار خیلی سریع است.'),
      w('slow', 'آرام / کند', 'The traffic is slow today.', 'ترافیک امروز کند است.'),
    ],
  },
  {
    id: 7,
    title: 'مدرسه',
    subtitle: 'تحصیل و آموزش',
    icon: 'book-open',
    color: '#0891b2',
    gradient: ['#0891b2', '#155e75'],
    words: [
      w('school', 'مدرسه', 'The school is near our house.', 'مدرسه نزدیک خانه‌ی ماست.'),
      w('teacher', 'معلم', 'The teacher explains the lesson.', 'معلم درس را توضیح می‌دهد.'),
      w('student', 'دانش‌آموز / دانشجو', 'The student studies very hard.', 'دانش‌آموز خیلی سخت درس می‌خواند.'),
      w('book', 'کتاب', 'Open your book, please.', 'لطفاً کتاب خود را باز کنید.'),
      w('pen', 'خودکار / قلم', 'I need a red pen.', 'من یک خودکار قرمز نیاز دارم.'),
      w('lesson', 'درس', 'The lesson was very interesting.', 'درس خیلی جالب بود.'),
      w('homework', 'تکلیف خانه', 'Do your homework first.', 'اول تکلیف خانه‌ات را انجام بده.'),
      w('question', 'سؤال', 'Ask me any question.', 'از من هر سؤالی که می‌خواهی بپرس.'),
      w('answer', 'پاسخ', 'The answer was completely correct.', 'پاسخ کاملاً درست بود.'),
      w('learn', 'یاد گرفتن', 'We learn English together.', 'ما با هم انگلیسی یاد می‌گیریم.'),
      w('study', 'درس خواندن', 'She studies every evening.', 'او هر عصر درس می‌خواند.'),
      w('class', 'کلاس', 'Our class has twenty students.', 'کلاس ما بیست دانش‌آموز دارد.'),
    ],
  },
  {
    id: 8,
    title: 'کار',
    subtitle: 'کار و حرفه',
    icon: 'briefcase',
    color: '#64748b',
    gradient: ['#64748b', '#334155'],
    words: [
      w('job', 'شغل / کار', 'He has a new job.', 'او یک شغل جدید دارد.'),
      w('office', 'دفتر', 'The office is in the city center.', 'دفتر در مرکز شهر است.'),
      w('work', 'کار کردن', 'I work eight hours a day.', 'من روزی هشت ساعت کار می‌کنم.'),
      w('money', 'پول', 'Money is not everything.', 'پول همه‌چیز نیست.'),
      w('salary', 'حقوق', 'She gets her salary every month.', 'او حقوق خود را هر ماه می‌گیرد.'),
      w('boss', 'رئیس', 'My boss is a calm person.', 'رئیس من آدم آرامی است.'),
      w('meeting', 'جلسه', 'The meeting starts at two.', 'جلسه ساعت دو شروع می‌شود.'),
      w('email', 'ایمیل', 'Send me an email tonight.', 'امشب به من ایمیل بفرست.'),
      w('interview', 'مصاحبه', 'The interview went very well.', 'مصاحبه خیلی خوب پیش رفت.'),
      w('project', 'پروژه', 'This project takes three months.', 'این پروژه سه ماه طول می‌کشد.'),
      w('plan', 'برنامه', 'What is your plan for the weekend?', 'برنامه‌ت برای آخر هفته چیست؟'),
      w('goal', 'هدف', 'Set clear goals for your life.', 'برای زندگی‌ات هدف‌های روشن تعیین کن.'),
    ],
  },
  {
    id: 9,
    title: 'سلامت',
    subtitle: 'بدن و تندرستی',
    icon: 'heart',
    color: '#ef4444',
    gradient: ['#ef4444', '#b91c1c'],
    words: [
      w('body', 'بدن', 'Listen to your body.', 'به بدن خود گوش کن.'),
      w('head', 'سر', 'My head hurts a lot.', 'سرم خیلی درد می‌کند.'),
      w('hand', 'دست', 'Hold my hand tightly.', 'دست مرا محکم بگیر.'),
      w('eye', 'چشم', 'Her eyes are brown.', 'چشمانش قهوه‌ای است.'),
      w('heart', 'قلب', 'The heart beats strongly.', 'قلب محکم تپ می‌زند.'),
      w('doctor', 'پزشک / دکتر', 'The doctor helped me feel better.', 'پزشک به من کمک کرد بهتر شوم.'),
      w('hospital', 'بیمارستان', 'The hospital is not far.', 'بیمارستان دور نیست.'),
      w('pain', 'درد', 'Where is your pain?', 'دردت کجاست؟'),
      w('health', 'سلامت', 'Health is our biggest wealth.', 'سلامت بزرگ‌ترین ثروت ماست.'),
      w('medicine', 'دارو', 'Take your medicine twice a day.', 'دارو را روزی دو بار بخور.'),
      w('tired', 'خسته', 'I feel very tired today.', 'امروز خیلی خسته‌ام.'),
      w('sleep', 'خوابیدن', 'Sleep seven hours every night.', 'هر شب هفت ساعت بخواب.'),
    ],
  },
  {
    id: 10,
    title: 'آسمان',
    subtitle: 'هوا و فصل‌ها',
    icon: 'cloud',
    color: '#0ea5e9',
    gradient: ['#0ea5e9', '#0369a1'],
    words: [
      w('weather', 'هوا / هواشناسی', 'How is the weather today?', 'هوا امروز چطور است؟'),
      w('sun', 'خورشید', 'The sun is shining brightly.', 'خورشید درخشان می‌تابد.'),
      w('rain', 'باران', 'It is raining a lot today.', 'امروز خیلی باران می‌بارد.'),
      w('snow', 'برف', 'The mountain is full of snow.', 'کوه پوشیده از برف است.'),
      w('cloud', 'ابر', 'There is not a single cloud.', 'حتی یک ابر هم نیست.'),
      w('wind', 'باد', 'The wind is very strong.', 'باد خیلی تند است.'),
      w('spring', 'بهار', 'Spring is full of flowers.', 'بهار پر از گل است.'),
      w('summer', 'تابستان', 'Summer is very hot here.', 'تابستان اینجا خیلی گرم است.'),
      w('autumn', 'پاییز', 'Autumn brings colorful leaves.', 'پاییز برگ‌های رنگی می‌آورد.'),
      w('winter', 'زمستان', 'Winter days are short.', 'روزهای زمستان کوتاه است.'),
      w('storm', 'طوفان', 'A big storm is coming tonight.', 'امشب یک طوفان بزرگ در راه است.'),
      w('sky', 'آسمان', 'The sky is so clear.', 'آسمان خیلی صاف است.'),
    ],
  },
  {
    id: 11,
    title: 'خانه',
    subtitle: 'خانه و زندگی روزمره',
    icon: 'home',
    color: '#84cc16',
    gradient: ['#84cc16', '#4d7c0f'],
    words: [
      w('house', 'خانه', 'Our house has a green door.', 'خانه‌ی ما در سبز دارد.'),
      w('room', 'اتاق', 'My room is on the second floor.', 'اتاق من در طبقه‌ی دوم است.'),
      w('door', 'در', 'Close the door, please.', 'لطفاً در را ببند.'),
      w('window', 'پنجره', 'Open the window for some air.', 'پنجره را برای کمی هوا باز کن.'),
      w('table', 'میز', 'The book is on the table.', 'کتاب روی میز است.'),
      w('chair', 'صندلی', 'This chair is very comfortable.', 'این صندلی خیلی راحت است.'),
      w('bed', 'تخت', 'I sleep in my warm bed.', 'من در تخت گرم خود می‌خوابم.'),
      w('kitchen', 'آشپزخانه', 'The kitchen smells like rice.', 'آشپزخانه بوی برنج می‌دهد.'),
      w('bathroom', 'حمام / سرویس', 'Clean the bathroom today.', 'امروز حمام را تمیز کن.'),
      w('key', 'کلید', 'Do you have the house key?', 'کلید خانه را داری؟'),
      w('wall', 'دیوار', 'The wall is painted blue.', 'دیوار آبی رنگ شده است.'),
      w('floor', 'کف / کف‌پوش', 'The floor is very clean.', 'کف خیلی تمیز است.'),
    ],
  },
  {
    id: 12,
    title: 'احساسات',
    subtitle: 'حس‌ها و شخصیت‌ها',
    icon: 'heart-handshake',
    color: '#f97316',
    gradient: ['#f97316', '#c2410c'],
    words: [
      w('happy', 'خوشحال', 'I am happy for your success.', 'من از بابت موفقیت تو خوشحالم.'),
      w('sad', 'غمگین', 'He felt sad during the movie.', 'او هنگام فیلم غمگین شد.'),
      w('angry', 'عصبانی', 'Do not be angry with me.', 'با من عصبانی نشو.'),
      w('afraid', 'ترسیده', 'The child is afraid of the dark.', 'کودک از تاریکی می‌ترسد.'),
      w('love', 'عشق / دوست داشتن', 'She loves English music.', 'او موسیقی انگلیسی دوست دارد.'),
      w('hate', 'متنفر بودن', 'I do not hate anyone.', 'من از کسی متنفر نیستم.'),
      w('hope', 'امید', 'Never lose hope in life.', 'در زندگی هیچ‌وقت ناامید نشو.'),
      w('calm', 'آرام / با‌قرار', 'Stay calm in hard times.', 'در دورهای سخت آرام بمان.'),
      w('excited', 'هیجان‌زده / خوشوقت', 'We are very excited for the trip.', 'ما برای سفر خیلی هیجان داریم.'),
      w('surprised', 'متعجب', 'I was really surprised by the news.', 'من واقعاً از شنیدن خبر تعجب کردم.'),
      w('proud', 'خودآگاه / مغرور', 'We are very proud of our child.', 'ما خیلی به فرزندمان افتخار می‌کنیم.'),
      w('shy', 'خجالتی', 'The small child is very shy.', 'کودک کوچک خیلی خجالتی است.'),
    ],
  },
];

export const TOTAL_WORDS = LESSONS.reduce((sum, l) => sum + l.words.length, 0);

export function getLesson(id: number): LangLesson {
  return LESSONS.find((l) => l.id === id) ?? LESSONS[0];
}

export function wordKey(lessonId: number, wordIndex: number): string {
  return `${lessonId}:${wordIndex}`;
}
