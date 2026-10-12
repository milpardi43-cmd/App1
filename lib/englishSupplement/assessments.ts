import type { EnglishUnitLevel, Skill, Task } from './content';

const q = (id: string, skill: Skill, prompt: string, answer: string, explanation: string, extra: Partial<Task> = {}): Task => ({
  id, skill, prompt, answers: [answer], explanation, ...extra,
});

/** Fresh, locally stored formative checks; neither test awards an official CEFR certificate. */
export const FOUNDATION_FINAL_CHECK: Task[] = [
  q('foundation-final-g1', 'grammar', 'I ___ a student.', 'am', 'با I از am استفاده می‌کنیم.', { options: ['am', 'is', 'are'] }),
  q('foundation-final-g2', 'grammar', '___ you ready?', 'Are', 'در پرسش با you از are استفاده می‌شود.', { options: ['Is', 'Are', 'Am'] }),
  q('foundation-final-g3', 'grammar', 'دو کتاب: two ___.', 'books', 'اسم‌های باقاعده برای جمع معمولاً s می‌گیرند.'),
  q('foundation-final-r1', 'reading', 'نام کوچک لِیلا چیست؟', 'Leila', 'Leila نام کوچک است.', { source: 'My name is Leila Noor. I am from Oman. I live in Muscat.', options: ['Leila', 'Noor', 'Muscat'] }),
  q('foundation-final-r2', 'reading', 'لیلا کجا زندگی می‌کند؟', 'Muscat', 'در متن آمده است: I live in Muscat.', { source: 'My name is Leila Noor. I am from Oman. I live in Muscat.', options: ['Oman', 'Muscat', 'Noor'] }),
  q('foundation-final-r3', 'reading', 'آیا مِی معلم است؟', 'خیر', 'متن می‌گوید May is not a teacher.', { source: 'May is a student. She is not a teacher. She is happy.', options: ['بله', 'خیر'] }),
  q('foundation-final-l1', 'listening', 'نام خانوادگی چیست؟', 'Green', 'گوینده نام Anna Green را می‌گوید.', { audio: 'My name is Anna Green.', options: ['Anna', 'Green', 'Mina'] }),
  q('foundation-final-l2', 'listening', 'کلاس چه ساعتی است؟', '10:00', 'ten o’clock برابر 10:00 است.', { audio: 'The class is at ten o’clock.', options: ['9:00', '10:00', '11:00'] }),
  q('foundation-final-l3', 'listening', 'آیا گوینده خواهر دارد؟', 'بله', 'گوینده می‌گوید: I have a sister.', { audio: 'I have a sister. Her name is Sara.', options: ['بله', 'خیر'] }),
  q('foundation-final-w1', 'writing', 'نام «maria» را با حرف اول بزرگ بنویسید.', 'Maria', 'نام شخص با حرف بزرگ شروع می‌شود.', { caseSensitive: true }),
  q('foundation-final-w2', 'writing', 'مرتب کنید: am / I / at home', 'I am at home.', 'ترتیب جملهٔ خبری: فاعل + am + ادامهٔ جمله است.'),
  q('foundation-final-w3', 'writing', 'شکل جمع child را بنویسید.', 'children', 'جمع نامنظم child برابر children است.'),
];

export const A1_FINAL_CHECK: Task[] = [
  q('a1-final-g1', 'grammar', 'Does Ben ___ near the station?', 'live', 'بعد از does، فعل به شکل ساده می‌آید.', { options: ['live', 'lives', 'living'] }),
  q('a1-final-g2', 'grammar', '___ there two chairs in the kitchen?', 'Are', 'برای اسم جمع در پرسش از are there استفاده می‌کنیم.', { options: ['Is', 'Are', 'Do'] }),
  q('a1-final-g3', 'grammar', 'How ___ water do we need?', 'much', 'water در این کاربرد غیرقابل‌شمارش است.', { options: ['many', 'much'] }),
  q('a1-final-g4', 'grammar', 'She can ___ very well.', 'swim', 'بعد از can از شکل سادهٔ فعل استفاده می‌شود.', { options: ['swims', 'swim', 'swimming'] }),
  q('a1-final-g5', 'grammar', 'Look! They are ___ for the bus.', 'waiting', 'برای کار در جریان: are + فعل ing.', { options: ['wait', 'waits', 'waiting'] }),
  q('a1-final-g6', 'grammar', 'I ___ to work by bus every day.', 'go', 'every day عادت را نشان می‌دهد؛ برای I از شکل سادهٔ go استفاده می‌کنیم.', { options: ['go', 'goes', 'am going'] }),
  q('a1-final-g7', 'grammar', 'Did you ___ the old museum?', 'visit', 'بعد از did، فعل به شکل ساده می‌آید.', { options: ['visit', 'visited', 'visiting'] }),
  q('a1-final-g8', 'grammar', 'Our trip is ___ July.', 'in', 'برای ماه از in استفاده می‌کنیم.', { options: ['at', 'on', 'in'] }),

  q('a1-final-r1', 'reading', 'کافه روز شنبه چه ساعتی باز می‌شود؟', '8:00', 'ساعت بازشدن فردا 8:00 است.', { source: 'RIVER CAFÉ\nToday: 9:00–17:00\nSaturday: 8:00–14:00\nClosed Sunday', options: ['8:00', '9:00', '14:00'] }),
  q('a1-final-r2', 'reading', 'قیمت سوپ چقدر است؟', '6 dollars', 'قیمت سوپ در منو $6 درج شده است.', { source: 'MENU\nSoup $6\nSalad $5\nTea $2', options: ['2 dollars', '5 dollars', '6 dollars'] }),
  q('a1-final-r3', 'reading', 'چرا جُو به خانه می‌رود؟', 'He feels ill.', 'او می‌گوید حالش خوب نیست و می‌خواهد استراحت کند.', { source: 'Hi Sam. I am going home now because I feel ill. I am going to rest. See you tomorrow, Joe.', options: ['He feels ill.', 'He is going shopping.', 'He has a new job.'] }),
  q('a1-final-r4', 'reading', 'قطار شمارهٔ ۱۰ چه زمانی به لِیدز می‌رسد؟', '12:40', 'ردیف قطار Leeds زمان رسیدن 12:40 را نشان می‌دهد.', { source: 'Train 10: London 11:00 — Leeds 12:40.\nTrain 12: London 12:00 — Leeds 13:35.', options: ['11:00', '12:40', '13:35'] }),
  q('a1-final-r5', 'reading', 'اتاق هتل برای چند شب رزرو شده است؟', '3 nights', 'پیام می‌گوید for three nights.', { source: 'Booking: Kim Park, one double room, three nights, breakfast included.', options: ['1 night', '2 nights', '3 nights'] }),
  q('a1-final-r6', 'reading', 'مِی معمولاً چه کاری انجام می‌دهد؟', 'walks to work', 'usually نشانهٔ عادت است و متن می‌گوید او پیاده به کار می‌رود.', { source: 'May usually walks to work. Today she is taking a bus because it is raining.', options: ['walks to work', 'drives to work', 'stays at home'] }),
  q('a1-final-r7', 'reading', 'در اعلان، بازدیدکنندگان باید کجا منتظر بمانند؟', 'by the door', 'تابلو می‌گوید Please wait by the door.', { source: 'MUSEUM\nOpen 10:00–16:00\nPlease wait by the door.\nNo food in the rooms.', options: ['by the door', 'in the café', 'in the garden'] }),
  q('a1-final-r8', 'reading', 'لِیلی شنبه چه برنامه‌ای دارد؟', 'She is going to visit her aunt.', 'برنامهٔ شنبه در پیام با going to بیان شده است.', { source: 'Hi Ana. I am free on Saturday. I am going to visit my aunt in the morning, but I can meet you at four. — Lily', options: ['She is going to visit her aunt.', 'She is going to work all day.', 'She is going to travel on Friday.'] }),

  q('a1-final-l1', 'listening', 'گوینده کجا زندگی می‌کند؟', 'Dublin', 'گوینده می‌گوید: I live in Dublin.', { audio: 'My name is Patrick. I am from Ireland, and I live in Dublin.', options: ['London', 'Dublin', 'Rome'] }),
  q('a1-final-l2', 'listening', 'چه چیزی کنار پنجره است؟', 'a table', 'گوینده می‌گوید میز کنار پنجره است.', { audio: 'There is a table next to the window. The keys are on the table.', options: ['a table', 'a bed', 'a chair'] }),
  q('a1-final-l3', 'listening', 'مشتری چه نوشیدنی سفارش می‌دهد؟', 'a coffee', 'در سفارش، a coffee شنیده می‌شود.', { audio: 'Could I have a coffee and a cheese sandwich, please?', options: ['a tea', 'a coffee', 'some water'] }),
  q('a1-final-l4', 'listening', 'مسافر به کدام سکو برود؟', 'platform 3', 'در پاسخ، platform three گفته می‌شود.', { audio: 'Excuse me, where is the train to Bath? It leaves from platform three.', options: ['platform 1', 'platform 2', 'platform 3'] }),
  q('a1-final-l5', 'listening', 'گوینده چه زمانی معمولاً ورزش می‌کند؟', 'on Fridays', 'عادت او on Fridays بیان می‌شود.', { audio: 'I usually go swimming on Fridays. Today I am staying home.', options: ['on Mondays', 'on Fridays', 'on Sundays'] }),
  q('a1-final-l6', 'listening', 'دوست گوینده چه توانایی‌ای دارد؟', 'play the piano', 'در فایل می‌شنوید: can play the piano.', { audio: 'My sister can play the piano, but she cannot sing very well.', options: ['play the piano', 'drive a bus', 'speak Japanese'] }),
  q('a1-final-l7', 'listening', 'گوینده دیروز کجا بود؟', 'at the beach', 'گوینده می‌گوید: We were at the beach.', { audio: 'Yesterday it was sunny. We were at the beach and we ate lunch there.', options: ['at home', 'at the beach', 'at school'] }),
  q('a1-final-l8', 'listening', 'قرار چه ساعتی است؟', '5:30', 'پاسخ شنیداری five thirty برابر 5:30 است.', { audio: 'Can we meet after work? Yes. Let us meet at five thirty by the station.', options: ['5:00', '5:30', '6:30'] }),

  q('a1-final-w1', 'writing', 'جمله را کامل کنید: The children ___ in the park now.', 'are playing', 'برای جمع و کاری که اکنون جریان دارد، are playing درست است.', { options: ['play', 'are playing', 'plays'] }),
  q('a1-final-w2', 'writing', 'جمله را کامل کنید: There ___ a supermarket next to my home.', 'is', 'برای یک supermarket از there is استفاده می‌کنیم.', { options: ['is', 'are', 'do'] }),
  q('a1-final-w3', 'writing', 'درخواست مودبانه را کامل کنید: Could you ___ me, please?', 'help', 'پس از could از شکل سادهٔ فعل استفاده می‌شود.', { options: ['help', 'helps', 'helping'] }),
  q('a1-final-w4', 'writing', 'جمله را کامل کنید: I didn’t ___ a film yesterday.', 'watch', 'بعد از didn’t شکل سادهٔ watch می‌آید.', { options: ['watch', 'watched', 'watching'] }),
  q('a1-final-w5', 'writing', 'پیشنهاد را کامل کنید: Would you like ___ come with us?', 'to', 'الگوی دعوت Would you like to + فعل ساده است.', { options: ['to', 'for', 'at'] }),
  q('a1-final-w6', 'writing', 'جمله را کامل کنید: These ___ are too small. (کفش‌ها)', 'shoes', 'these با اسم جمع shoes می‌آید.', { options: ['shoe', 'shoes', 'a shoe'] }),
  q('a1-final-w7', 'writing', 'جمله را کامل کنید: She usually ___ breakfast at seven.', 'has', 'برای she در حال ساده از has استفاده می‌کنیم.', { options: ['have', 'has', 'having'] }),
  q('a1-final-w8', 'writing', 'پیام را با عبارت مودبانه کامل کنید: Thanks for your help. See you ___.', 'tomorrow', 'tomorrow برای دیدار روز بعد مناسب است.', { options: ['yesterday', 'tomorrow', 'last week'] }),
];

export const ASSESSMENTS: Record<EnglishUnitLevel, Task[]> = {
  Foundation: FOUNDATION_FINAL_CHECK,
  A1: A1_FINAL_CHECK,
};

export const ASSESSMENT_PASS_PERCENT = 80;
