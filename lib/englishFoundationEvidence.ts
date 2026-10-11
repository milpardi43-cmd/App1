import type { Skill, Task } from './englishSupplement/content';
import { SURVIVAL_EXPANSION_EVIDENCE } from './englishSurvivalEvidence';
import { EVERYDAY_LESSON_EVIDENCE } from './englishEverydayEvidence';

/** Goal-based checks for all ten active Foundation lessons. */
const task = (
  id: string,
  skill: Skill,
  prompt: string,
  answer: string,
  explanation: string,
  extra: Partial<Task> = {},
): Task => ({ id, skill, prompt, answers: [answer], explanation, ...extra });

const foundationTask = (lessonId: string, id: string) => `foundation-core-${lessonId}-${id}`;

export const FOUNDATION_LESSON_EVIDENCE: Readonly<Record<string, readonly Task[]>> = {
  'foundation-introducing-yourself': [
    task(
      foundationTask('introducing-yourself', 'spell-listening'), 'listening',
      'کدام نام هجی شد؟', 'Sara',
      'حروف S، A، R، A نام Sara را می‌سازند.',
      { audio: 'S. A. R. A.', options: ['Sara', 'Sarah', 'Sam'] },
    ),
    task(
      foundationTask('introducing-yourself', 'vowels'), 'grammar',
      'حروف واکه را انتخاب کنید.', 'A, E, I, O, and U',
      'پنج حرف واکهٔ انگلیسی A، E، I، O و U هستند.',
      { options: ['A, E, I, O, and U', 'B, C, D, F, and G', 'A, B, C, D, and E'] },
    ),
    task(
      foundationTask('introducing-yourself', 'letter-sounds-reading'), 'reading',
      'کدام گزینه با متن درس مطابقت دارد؟',
      'A is short in cat and long in name; C sounds like K in cat and S in city; SH makes one sound in ship.',
      'A در cat کوتاه و در name کشیده است؛ C در cat صدای K و در city صدای S می‌دهد؛ SH در ship یک صدا دارد.',
      {
        source: 'The letter A has a short sound in cat. The letter A has a long sound in name. C can sound like K in cat and like S in city. The letters S and H make one sound in ship.',
        options: [
          'A is short in cat and long in name; C sounds like K in cat and S in city; SH makes one sound in ship.',
          'A is long in cat and short in name; C sounds like K in cat and S in city; SH makes one sound in ship.',
          'A is short in cat and long in name; C sounds like K in cat and S in city; SH makes two sounds in ship.',
        ],
      },
    ),
    task(
      foundationTask('introducing-yourself', 'family-reading'), 'reading',
      'چه کسی در خانه است؟', 'Her mother',
      'در متن گفته شده مادر سارا در خانه است.',
      { source: 'Sara has one brother and one sister. Her mother is at home.', options: ['Her mother', 'Her sister', 'Her father'] },
    ),
    task(
      foundationTask('introducing-yourself', 'routine-listening'), 'listening',
      'گوینده چه ساعتی صبحانه می‌خورد؟', '7:00',
      'seven یعنی ساعت هفت.',
      { audio: 'I usually have breakfast at seven. I go to work at eight.', options: ['6:00', '7:00', '8:00'] },
    ),
    task(
      foundationTask('introducing-yourself', 'family-and-routine-writing'), 'writing',
      'طبق الگوی درس، هر دو جمله را به انگلیسی بنویسید: یک برادر و یک خواهر دارم؛ هر روز ساعت شش بیدار می‌شوم.',
      'I have one brother and one sister. I get up at six every day.',
      'پاسخ باید یک جمله دربارهٔ خانواده و یک جمله دربارهٔ روتین روزانه داشته باشد.',
    ),
  ],
  'foundation-asking-for-help': [
    task(
      foundationTask('asking-for-help', 'number-listening'), 'listening',
      'کدام عدد را شنیدید؟', '42',
      'forty-two برابر ۴۲ است.',
      { audio: 'The number is forty-two.', options: ['14', '42', '24'] },
    ),
    task(
      foundationTask('asking-for-help', 'number-writing'), 'writing',
      'عدد ۵۸ را با حروف انگلیسی بنویسید.', 'fifty-eight',
      'برای ۵۸، دهگان و یکان را با خط تیره می‌نویسیم.',
    ),
    task(
      foundationTask('asking-for-help', 'phone-listening'), 'listening',
      'کدام شمارهٔ تلفن را شنیدید؟', '555-0142',
      'هر رقم شماره جداگانه گفته شده است.',
      { audio: 'My phone number is five five five zero one four two.', options: ['555-0142', '555-0412', '555-0144'] },
    ),
    task(
      foundationTask('asking-for-help', 'date-writing'), 'writing',
      'جملهٔ «امروز یکم ژوئن است» را طبق الگوی درس به انگلیسی بنویسید.', 'Today is June first.',
      'برای تاریخ از Today is + month + ordinal number استفاده می‌کنیم.'
    ),
    task(
      foundationTask('asking-for-help', 'time-listening'), 'listening',
      'اتوبوس چه ساعتی حرکت می‌کند؟', '9:15 a.m.',
      'a quarter past nine یعنی ۹:۱۵ صبح.',
      { audio: 'The bus leaves at a quarter past nine a.m.', options: ['9:15 a.m.', '9:45 a.m.', '10:15 a.m.'] },
    ),
    task(
      foundationTask('asking-for-help', 'directions-reading'), 'reading',
      'برای رسیدن به ایستگاه، اول چه‌کار می‌کنید؟', 'Go straight for two blocks.',
      'راهنما ابتدا می‌گوید دو بلوک مستقیم بروید.',
      { source: 'Go straight for two blocks. Turn right at the corner. The station is across from the bank.', options: ['Go straight for two blocks.', 'Turn right first.', 'Take a taxi.'] },
    ),
  ],
  'foundation-buying-something': [
    task(
      foundationTask('buying-something', 'price-listening'), 'listening',
      'قیمت یک کیلو برنج چقدر است؟', 'four dollars',
      'در صدا قیمت چهار دلار برای هر کیلو گفته می‌شود.',
      { audio: 'This rice costs four dollars a kilo.', options: ['four dollars', 'forty dollars', 'fourteen dollars'] },
    ),
    task(
      foundationTask('buying-something', 'quantity-reading'), 'reading',
      'چند سیب لازم است؟', 'two',
      'two apples یعنی دو سیب.',
      { source: 'I need two apples and a kilo of rice.', options: ['one', 'two', 'three'] },
    ),
    task(
      foundationTask('buying-something', 'countable-grammar'), 'grammar',
      'کدام عبارت درست است؟', 'some eggs and milk',
      'برای eggs جمع می‌آوریم و برای milk از some استفاده می‌کنیم.',
      { options: ['some eggs and milk', 'two bread and one milk', 'a eggs and milks'] },
    ),
    task(
      foundationTask('buying-something', 'food-request-writing'), 'writing',
      'به انگلیسی مؤدبانه درخواست یک ساندویچ کنید.', 'Could I have a sandwich, please?',
      'Could I have …, please? یک درخواست مؤدبانه است.',
    ),
    task(
      foundationTask('buying-something', 'payment-reading'), 'reading',
      'مشتری ده دلار می‌دهد. چه مقدار باقی‌پول می‌گیرد؟', 'three dollars',
      'ده دلار منهای هفت دلار، سه دلار باقی‌پول است.',
      { source: 'The total is seven dollars. You pay ten dollars.', options: ['two dollars', 'three dollars', 'four dollars'] },
    ),
    task(
      foundationTask('buying-something', 'payment-writing'), 'writing',
      'بنویسید: «می‌توانم نقدی پرداخت کنم؟»', 'Can I pay in cash?',
      'Can I pay in cash? برای پرسیدن دربارهٔ پرداخت نقدی است.',
    ),
  ],
  'foundation-alphabet-and-spelling': [
    task(
      foundationTask('alphabet-and-spelling', 'spelled-name-listening'), 'listening',
      'کدام نام هجی شد؟', 'Sara',
      'حروف S، A، R و A نام Sara را می‌سازند.',
      { audio: 'S. A. R. A.', options: ['Sara', 'Sarah', 'Sam'] },
    ),
    task(
      foundationTask('alphabet-and-spelling', 'vowel-listening'), 'listening',
      'کدام حرف واکه را شنیدید؟', 'E',
      'E یکی از پنج حرف واکهٔ انگلیسی است.',
      { audio: 'A, E, I, O, U.', options: ['B', 'E', 'G'] },
    ),
    task(
      foundationTask('alphabet-and-spelling', 'capital-reading'), 'reading',
      'کدام حرف در متن کوچک است؟', 'a',
      'در متن، A حرف بزرگ و a حرف کوچک است.',
      { source: 'A is a capital letter; a is a small letter.', options: ['A', 'a', 'B'] },
    ),
    task(
      foundationTask('alphabet-and-spelling', 'word-starts-grammar'), 'grammar',
      'کدام جمله دربارهٔ آغاز واژه درست است؟', 'The word starts with S.',
      'برای گفتن حرف آغازین از starts with استفاده می‌کنیم.',
      { options: ['The word start with S.', 'The word starts with S.', 'The word starts S.'] },
    ),
    task(
      foundationTask('alphabet-and-spelling', 'write-name-writing'), 'writing',
      'به انگلیسی بنویسید: «نام کوچک‌تان را روی خط بنویسید.»', 'Write your first name on the line.',
      'از الگوی Write + نام + on the line استفاده کنید.',
    ),
    task(
      foundationTask('alphabet-and-spelling', 'spell-surname-writing'), 'writing',
      'به انگلیسی مؤدبانه بگویید: «لطفاً نام خانوادگی‌تان را هجی کنید.»', 'Please spell your last name.',
      'Please spell برای درخواست مؤدبانهٔ هجی‌کردن به‌کار می‌رود.',
    ),
  ],
  'foundation-pronouns-and-be': [
    task(
      foundationTask('pronouns-and-be', 'ready-listening'), 'listening',
      'چه کسانی برای درس آماده‌اند؟', 'We are ready.',
      'گوینده می‌گوید ما آماده هستیم.',
      { audio: 'They are at home. We are ready for the lesson.', options: ['They are ready.', 'We are ready.', 'He is ready.'] },
    ),
    task(
      foundationTask('pronouns-and-be', 'tired-listening'), 'listening',
      'گوینده چه می‌گوید؟', 'I am not tired.',
      'جملهٔ شنیده‌شده می‌گوید گوینده خسته نیست.',
      { audio: 'I am not tired.', options: ['I am tired.', 'I am not tired.', 'You are not tired.'] },
    ),
    task(
      foundationTask('pronouns-and-be', 'place-reading'), 'reading',
      'او کجا است؟', 'She is in the library.',
      'در متن گفته شده او در کتابخانه است.',
      { source: 'He is at school. She is in the library.', options: ['She is at school.', 'She is in the library.', 'She is at home.'] },
    ),
    task(
      foundationTask('pronouns-and-be', 'be-verb-grammar'), 'grammar',
      'کدام جمله با ضمیر و فعل be درست است؟', 'They are my neighbors.',
      'با They از are استفاده می‌کنیم.',
      { options: ['They is my neighbors.', 'They are my neighbors.', 'They am my neighbors.'] },
    ),
    task(
      foundationTask('pronouns-and-be', 'same-class-writing'), 'writing',
      'به انگلیسی بنویسید: «ما در یک کلاس هستیم.»', 'We are in the same class.',
      'برای «ما هستیم» از We are استفاده کنید.',
    ),
    task(
      foundationTask('pronouns-and-be', 'friend-question-writing'), 'writing',
      'به انگلیسی بپرسید: «آیا او دوست تو است؟»', 'Is he your friend?',
      'در پرسش با he، فعل Is در آغاز جمله می‌آید.',
    ),
  ],
  'foundation-numbers-and-contact': [
    task(
      foundationTask('numbers-and-contact', 'phone-listening'), 'listening',
      'کدام شمارهٔ تلفن را شنیدید؟', '555-0142',
      'رقم‌ها یکی‌یکی گفته می‌شوند: ۵۵۵-۰۱۴۲.',
      { audio: 'My phone number is five five five zero one four two.', options: ['555-0142', '555-0412', '555-0144'] },
    ),
    task(
      foundationTask('numbers-and-contact', 'postal-code-listening'), 'listening',
      'کد پستی چه بود؟', '10001',
      'کد با رقم‌های یک، صفر، صفر، صفر و یک گفته می‌شود.',
      { audio: 'The ZIP code is one zero zero zero one.', options: ['10001', '10100', '11001'] },
    ),
    task(
      foundationTask('numbers-and-contact', 'house-reading'), 'reading',
      'شمارهٔ آپارتمان چند است؟', 'four',
      'متن می‌گوید شمارهٔ آپارتمان چهار است.',
      { source: 'My apartment number is four. I live at 18 Pine Street.', options: ['four', 'eighteen', 'forty'] },
    ),
    task(
      foundationTask('numbers-and-contact', 'contact-detail-grammar'), 'grammar',
      'کدام جمله برای بیان نشانی ایمیل درست است؟', 'My email address is sara@example.com.',
      'برای معرفی اطلاعات تماس می‌گوییم My email address is …',
      { options: ['My email address are sara@example.com.', 'My email address is sara@example.com.', 'My email address am sara@example.com.'] },
    ),
    task(
      foundationTask('numbers-and-contact', 'age-writing'), 'writing',
      'به انگلیسی بنویسید: «من بیست‌ویک سال دارم.»', 'I am twenty-one years old.',
      'الگوی سن: I am + number + years old.',
    ),
    task(
      foundationTask('numbers-and-contact', 'email-writing'), 'writing',
      'به انگلیسی مؤدبانه درخواست کنید: «لطفاً نشانی ایمیلتان را هجی کنید.»', 'Please spell your email address.',
      'برای درخواست مؤدبانه از Please + فعل ساده استفاده کنید.',
    ),
  ],
  'foundation-family-and-possessions': [
    task(
      foundationTask('family-and-possessions', 'family-listening'), 'listening',
      'نام مادر گوینده چیست؟', 'Laleh',
      'گوینده می‌گوید نام مادرش Laleh است.',
      { audio: 'This is my mother. Her name is Laleh.', options: ['Laleh', 'Sara', 'Mina'] },
    ),
    task(
      foundationTask('family-and-possessions', 'siblings-listening'), 'listening',
      'گوینده چند خواهر دارد؟', 'two',
      'گوینده می‌گوید دو خواهر دارد.',
      { audio: 'I have one brother and two sisters.', options: ['one', 'two', 'three'] },
    ),
    task(
      foundationTask('family-and-possessions', 'possessions-reading'), 'reading',
      'عینک‌ها متعلق به چه کسی هستند؟', 'My father',
      'در متن گفته می‌شود عینک‌ها متعلق به پدر گوینده‌اند.',
      { source: 'Are these your keys? Those are my father’s glasses.', options: ['My father', 'My mother', 'My sister'] },
    ),
    task(
      foundationTask('family-and-possessions', 'possessive-grammar'), 'grammar',
      'کدام جمله دربارهٔ مالکیت درست است؟', 'Those are her bags.',
      'پیش از bags از her استفاده می‌کنیم تا مالک را نشان دهیم.',
      { options: ['Those is her bags.', 'Those are her bags.', 'Those are she bags.'] },
    ),
    task(
      foundationTask('family-and-possessions', 'photo-writing'), 'writing',
      'به انگلیسی بنویسید: «این عکس خانوادهٔ من است.»', 'This is my family photo.',
      'از This is my … برای معرفی یک چیز استفاده کنید.',
    ),
    task(
      foundationTask('family-and-possessions', 'brothers-question-writing'), 'writing',
      'به انگلیسی بپرسید: «آیا برادری دارید؟»', 'Do you have any brothers?',
      'برای پرسیدن دربارهٔ داشتن، از Do you have …? استفاده کنید.',
    ),
  ],
  'foundation-time-and-calendar': [
    task(
      foundationTask('time-and-calendar', 'class-time-listening'), 'listening',
      'کلاس چه ساعتی شروع می‌شود؟', 'at eight',
      'در صدا گفته می‌شود کلاس ساعت هشت شروع می‌شود.',
      { audio: 'My class starts at eight. We meet at noon.', options: ['at eight', 'at noon', 'at six'] },
    ),
    task(
      foundationTask('time-and-calendar', 'bus-time-listening'), 'listening',
      'اتوبوس چه ساعتی می‌رسد؟', '4:50',
      'ten to five یعنی ده دقیقه مانده به پنج، یا ۴:۵۰.',
      { audio: 'The bus arrives at ten to five.', options: ['4:50', '5:10', '5:50'] },
    ),
    task(
      foundationTask('time-and-calendar', 'meeting-day-reading'), 'reading',
      'جلسه چه روزی است؟', 'Tuesday',
      'در متن نوشته شده جلسه صبح سه‌شنبه است.',
      { source: 'The meeting is on Tuesday morning. My appointment is on Wednesday.', options: ['Monday', 'Tuesday', 'Wednesday'] },
    ),
    task(
      foundationTask('time-and-calendar', 'time-preposition-grammar'), 'grammar',
      'کدام عبارت برای روز هفته درست است؟', 'on Monday',
      'برای روزهای هفته از on استفاده می‌کنیم.',
      { options: ['at Monday', 'on Monday', 'in Monday'] },
    ),
    task(
      foundationTask('time-and-calendar', 'date-writing'), 'writing',
      'به انگلیسی بنویسید: «امروز دوم ژوئیه است.»', 'Today is the second of July.',
      'برای تاریخ از Today is + عدد ترتیبی + of + ماه استفاده کنید.',
    ),
    task(
      foundationTask('time-and-calendar', 'class-question-writing'), 'writing',
      'به انگلیسی بپرسید: «کلاس چه ساعتی شروع می‌شود؟»', 'What time does the class start?',
      'پرسش دربارهٔ ساعت با What time does … start? ساخته می‌شود.',
    ),
  ],
  'foundation-everyday-routine': [
    task(
      foundationTask('everyday-routine', 'wake-time-listening'), 'listening',
      'گوینده چه ساعتی بیدار می‌شود؟', 'at seven',
      'گوینده می‌گوید ساعت هفت بیدار می‌شود.',
      { audio: 'I get up at seven. I have breakfast at home.', options: ['at six', 'at seven', 'at eight'] },
    ),
    task(
      foundationTask('everyday-routine', 'commute-listening'), 'listening',
      'او هر روز چگونه به محل کار می‌رود؟', 'He walks to work.',
      'جمله می‌گوید او هر روز پیاده به محل کار می‌رود.',
      { audio: 'He walks to work every day.', options: ['He walks to work.', 'He takes a taxi.', 'He stays at home.'] },
    ),
    task(
      foundationTask('everyday-routine', 'habit-reading'), 'reading',
      'گوینده چند بار در روز مسواک می‌زند؟', 'twice a day',
      'در متن از twice a day، یعنی روزی دو بار، استفاده شده است.',
      { source: 'I brush my teeth twice a day. I go to bed at ten.', options: ['once a day', 'twice a day', 'three times a day'] },
    ),
    task(
      foundationTask('everyday-routine', 'third-person-grammar'), 'grammar',
      'کدام جمله دربارهٔ برنامهٔ روزانه درست است؟', 'She takes a bus to school.',
      'با she فعل take به شکل takes می‌آید.',
      { options: ['She take a bus to school.', 'She takes a bus to school.', 'She taking a bus to school.'] },
    ),
    task(
      foundationTask('everyday-routine', 'walk-dog-writing'), 'writing',
      'به انگلیسی بنویسید: «عصرها سگم را برای پیاده‌روی می‌برم.»', 'I walk my dog in the evening.',
      'از I walk my dog … برای گفتن این کار روزانه استفاده کنید.',
    ),
    task(
      foundationTask('everyday-routine', 'friday-writing'), 'writing',
      'به انگلیسی بنویسید: «آن‌ها جمعه فیلم تماشا می‌کنند.»', 'They watch a movie on Friday.',
      'با they از فعل سادهٔ watch استفاده می‌کنیم.',
    ),
  ],
  'foundation-objects-and-places': [
    task(
      foundationTask('objects-and-places', 'bus-stop-listening'), 'listening',
      'ایستگاه اتوبوس کجاست؟', 'Across from the café.',
      'در صدا گفته می‌شود ایستگاه روبه‌روی کافه است.',
      { audio: 'The bus stop is across from the café.', options: ['Across from the café.', 'Behind the bank.', 'Inside the museum.'] },
    ),
    task(
      foundationTask('objects-and-places', 'room-listening'), 'listening',
      'چند پنجره در اتاق هست؟', 'two',
      'گوینده از دو پنجره در اتاق می‌گوید.',
      { audio: 'There are two windows in the room.', options: ['one', 'two', 'four'] },
    ),
    task(
      foundationTask('objects-and-places', 'shop-reading'), 'reading',
      'فروشگاه کوچک کجاست؟', 'On this street.',
      'متن می‌گوید فروشگاه کوچک در همین خیابان است.',
      { source: 'There is a small shop on this street. The bus stop is across from the café.', options: ['On this street.', 'Behind the station.', 'In the café.'] },
    ),
    task(
      foundationTask('objects-and-places', 'there-are-grammar'), 'grammar',
      'کدام جمله برای دو پنجره درست است؟', 'There are two windows in the room.',
      'برای اسم جمع windows از There are استفاده می‌کنیم.',
      { options: ['There is two windows in the room.', 'There are two windows in the room.', 'There are a window in the room.'] },
    ),
    task(
      foundationTask('objects-and-places', 'bank-question-writing'), 'writing',
      'به انگلیسی بپرسید: «اینجا نزدیک بانک هست؟»', 'Is there a bank near here?',
      'برای پرسیدن دربارهٔ وجود یک مکان از Is there a …? استفاده کنید.',
    ),
    task(
      foundationTask('objects-and-places', 'object-direction-writing'), 'writing',
      'به انگلیسی بنویسید: «کتابتان را زیر میز بگذارید.»', 'Put your book under the desk.',
      'از Put + شیء + under + مکان برای دادن این راهنما استفاده کنید.',
    ),
  ],
};

const survivalTask = (lessonId: string, id: string) => `survival-core-${lessonId}-${id}`;

/** Goal-based checks for the two original Survival lessons; the expansion is merged below. */
const EXISTING_SURVIVAL_LESSON_EVIDENCE: Readonly<Record<string, readonly Task[]>> = {
  'survival-job-interview': [
    task(
      survivalTask('job-interview', 'experience-listening'), 'listening',
      'گوینده چند سال تجربه دارد؟', 'one year',
      'گوینده از یک سال تجربه در خدمات مشتری می‌گوید.',
      { audio: 'I have one year of experience in customer service. I can help customers and answer questions.', options: ['one year', 'two years', 'one month'] },
    ),
    task(
      survivalTask('job-interview', 'pay-reading'), 'reading',
      'دستمزد ساعتی چقدر است؟', 'twelve dollars',
      'در آگهی، دستمزد ساعتی دوازده دلار است.',
      { source: 'This is a part-time job. I can work from Monday to Friday. The hourly pay is twelve dollars.', options: ['ten dollars', 'twelve dollars', 'twenty dollars'] },
    ),
    task(
      survivalTask('job-interview', 'experience-writing'), 'writing',
      'به انگلیسی بنویسید: «من یک سال تجربه در خدمات مشتری دارم.»',
      'I have one year of experience in customer service.',
      'برای بیان سابقه از I have + مدت + of experience استفاده کنید.',
    ),
    task(
      survivalTask('job-interview', 'interview-time-listening'), 'listening',
      'مصاحبه چه روز و ساعتی است؟', 'Tuesday at ten a.m.',
      'مصاحبه سه‌شنبه ساعت ده صبح است.',
      { audio: 'The interview is on Tuesday at ten a.m.', options: ['Tuesday at ten a.m.', 'Tuesday at nine a.m.', 'Wednesday at ten a.m.'] },
    ),
    task(
      survivalTask('job-interview', 'can-grammar'), 'grammar',
      'کدام جمله دربارهٔ توانایی درست است؟', 'I can help customers and answer questions.',
      'بعد از can، فعل به شکل ساده می‌آید: help و answer.',
      { options: ['I can helps customers.', 'I can help customers and answer questions.', 'I can to help customers.'] },
    ),
    task(
      survivalTask('job-interview', 'pay-question-writing'), 'writing',
      'برای پرسیدن «دستمزد ساعتی چقدر است؟» جملهٔ انگلیسی را بنویسید.',
      'What is the hourly pay?',
      'برای پرسیدن دربارهٔ دستمزد از What is the hourly pay? استفاده کنید.',
    ),
  ],
  'survival-renting-a-home': [
    task(
      survivalTask('renting-a-home', 'lease-listening'), 'listening',
      'مدت قرارداد اجاره چقدر است؟', 'twelve months',
      'در صدا گفته می‌شود قرارداد دوازده ماه است.',
      { audio: 'The lease is for twelve months. The security deposit is one month’s rent.', options: ['six months', 'twelve months', 'two years'] },
    ),
    task(
      survivalTask('renting-a-home', 'neighborhood-reading'), 'reading',
      'کدام جمله با آگهی مطابقت دارد؟', 'It is furnished, and the station is two blocks away.',
      'آگهی می‌گوید آپارتمان مبله است و ایستگاه دو بلوک فاصله دارد.',
      {
        source: 'The apartment is furnished and has one bedroom. The train station is two blocks away. The pharmacy is next to the clinic.',
        options: [
          'It is furnished, and the station is two blocks away.',
          'It is unfurnished, and the station is next door.',
          'The pharmacy is inside the apartment.',
        ],
      },
    ),
    task(
      survivalTask('renting-a-home', 'deposit-question-writing'), 'writing',
      'به انگلیسی بپرسید: «مبلغ ودیعه چقدر است؟»', 'How much is the security deposit?',
      'برای پرسیدن مبلغ ودیعه از How much is the security deposit? استفاده کنید.',
    ),
    task(
      survivalTask('renting-a-home', 'utilities-grammar'), 'grammar',
      'کدام سؤال دربارهٔ آب و برق درست است؟', 'Are water and electricity included in the rent?',
      'water and electricity دو مورد هستند؛ در پرسش از are استفاده می‌شود.',
      { options: ['Is water and electricity included in the rent?', 'Are water and electricity included in the rent?', 'Does water and electricity included in the rent?'] },
    ),
    task(
      survivalTask('renting-a-home', 'repair-request-writing'), 'writing',
      'سینک خراب است. مؤدبانه از صاحب‌خانه بخواهید آن را تعمیر کند.', 'Could you fix it, please?',
      'Could you + فعل ساده + please? یک درخواست مؤدبانه است.',
    ),
    task(
      survivalTask('renting-a-home', 'rent-due-listening'), 'listening',
      'اجاره چه زمانی باید پرداخت شود؟', 'on the first day of each month',
      'در صدا گفته می‌شود موعد پرداخت روز اول هر ماه است.',
      { audio: 'The rent is due on the first day of each month.', options: ['on the first day of each month', 'on the fifteenth day of each month', 'at the end of each year'] },
    ),
  ],
};

/** The two legacy lessons plus all selected A1/Survival module checks. */
export const SURVIVAL_LESSON_EVIDENCE: Readonly<Record<string, readonly Task[]>> = {
  ...EXISTING_SURVIVAL_LESSON_EVIDENCE,
  ...SURVIVAL_EXPANSION_EVIDENCE,
};

export const FOUNDATION_EVIDENCE_TASKS_PER_LESSON = 6;
export const SURVIVAL_EVIDENCE_TASKS_PER_LESSON = 6;
export const EVERYDAY_EVIDENCE_TASKS_PER_LESSON = 6;

export interface FoundationEvidenceResult {
  skill: Skill;
  correct: boolean;
  heard: boolean;
  attempts: number;
}

export const CORE_LESSON_EVIDENCE: Readonly<Record<string, readonly Task[]>> = {
  ...FOUNDATION_LESSON_EVIDENCE,
  ...SURVIVAL_LESSON_EVIDENCE,
  ...EVERYDAY_LESSON_EVIDENCE,
};

function isLessonEvidenceComplete(
  lessonId: string,
  evidence: Record<string, FoundationEvidenceResult>,
  taskBank: Readonly<Record<string, readonly Task[]>>,
): boolean {
  const tasks = taskBank[lessonId];
  return !!tasks?.length && tasks.every(item => {
    const result = evidence[item.id];
    return !!result?.correct && (item.skill !== 'listening' || result.heard);
  });
}

export function isFoundationLessonEvidenceComplete(
  lessonId: string,
  evidence: Record<string, FoundationEvidenceResult> = {},
): boolean {
  return isLessonEvidenceComplete(lessonId, evidence, FOUNDATION_LESSON_EVIDENCE);
}

export function isSurvivalLessonEvidenceComplete(
  lessonId: string,
  evidence: Record<string, FoundationEvidenceResult> = {},
): boolean {
  return isLessonEvidenceComplete(lessonId, evidence, SURVIVAL_LESSON_EVIDENCE);
}

export function isCoreLessonEvidenceComplete(
  lessonId: string,
  evidence: Record<string, FoundationEvidenceResult> = {},
): boolean {
  return isLessonEvidenceComplete(lessonId, evidence, CORE_LESSON_EVIDENCE);
}
