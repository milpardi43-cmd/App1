/** Additive A1 curriculum. The original ten units and their task IDs stay untouched. */
import type { Task, Unit, Skill } from './content';

const task = (
  skill: Skill,
  prompt: string,
  answer: string,
  explanation: string,
  extra: Partial<Task> = {},
): Task => ({ id: '', skill, prompt, answers: [answer], explanation, ...extra });

export const ENGLISH_A1_UNITS: Unit[] = [
  {
    id: 'a1-profile', level: 'A1', title: 'پروفایل شخصی، کشور و زبان',
    goal: 'درباره نام، محل زندگی، کشور و زبان خود و دیگران پرس‌وجو کنید.',
    teaching: [
      { title: 'اطلاعات شخصی و راه تماس', text: 'نام، شهر، کشور، زبان، سن و شغل در معرفی کوتاه رایج‌اند. برای تمرین از هویت و شمارهٔ کاملاً خیالی استفاده کنید؛ اطلاعات خصوصی خود را در فرم نمونه وارد نکنید.', example: 'My name is Alex. I am 20. I live in Toronto. I am from Canada. My phone number is 000-000-0000.' },
      { title: 'کشور و زبان', text: 'نام کشور و زبان همیشه یک شکل نیست. از from برای خاستگاه و speak برای زبانی که کسی به آن صحبت می‌کند استفاده کنید.', example: 'She is from Japan. She speaks Japanese. He is from Brazil. He speaks Portuguese.' },
      { title: 'پرسش و پاسخ در معرفی', text: 'برای پرسیدن خاستگاه، زبان، شماره و شغل، سؤال را روشن و مؤدبانه بسازید. What do you do? دربارهٔ شغل می‌پرسد؛ در تمرین از پاسخ خیالی استفاده کنید.', example: 'Where are you from? — I am from Iran. What language do you speak? — Persian. What do you do? — I am a student. What is your phone number? — It is 000-000-0000.' },
    ],
    practice: [
      task('grammar', 'I ___ from Iran.', 'am', 'با I از am استفاده می‌کنیم.', { options: ['is', 'are', 'am'] }),
      task('reading', 'تِرِسا اهل کدام کشور است؟', 'Mexico', 'در متن آمده است که Teresa اهل Mexico است.', { source: 'My name is Teresa. I am from Mexico, and I speak Spanish.', options: ['Mexico', 'Spain', 'Canada'] }),
      task('listening', 'گوینده اهل کدام کشور است؟', 'Canada', 'در فایل شنیداری گفته می‌شود: I am from Canada.', { audio: 'I am from Canada. I speak English and French.', options: ['Canada', 'Japan', 'Italy'] }),
      task('writing', 'جمله را کامل کنید: Where ___ you from?', 'are', 'در این پرسش، are پیش از you می‌آید.', { options: ['is', 'are', 'am'] }),
    ],
    checkpoint: [
      task('grammar', 'She ___ from Egypt.', 'is', 'برای she از is استفاده می‌شود.', { options: ['am', 'is', 'are'] }),
      task('reading', 'لئو به چه زبانی صحبت می‌کند؟', 'Italian', 'در متن آمده است: I speak Italian.', { source: 'Leo lives in Rome. He is from Italy. He speaks Italian.', options: ['English', 'Italian', 'Arabic'] }),
      task('listening', 'گوینده در کدام شهر زندگی می‌کند؟', 'Seoul', 'پاسخ شنیداری Seoul است.', { audio: 'I am Mina. I live in Seoul, and I speak Korean.', options: ['Seoul', 'Tokyo', 'Paris'] }),
      task('writing', 'جمله را کامل کنید: What language ___ they speak?', 'do', 'در حال ساده برای they از do استفاده می‌شود.', { options: ['does', 'do', 'are'] }),
    ],
  },
  {
    id: 'a1-describing-people', level: 'A1', title: 'توصیف آدم‌ها و چیزها',
    goal: 'با صفت‌های ساده، ظاهر و ویژگی‌های عمومی افراد و اشیا را توصیف کنید.',
    teaching: [
      { title: 'صفت پس از فعل بودن', text: 'در جمله توصیفی ساده، صفت معمولاً پس از am/is/are می‌آید و برای جمع s نمی‌گیرد.', example: 'He is tall. They are friendly. The bags are blue.' },
      { title: 'ظاهر، ویژگی و مالکیت', text: 'برای مو و بعضی ویژگی‌های ظاهری از have/has استفاده می‌شود؛ برای قد و صفت‌های عمومی از be. برای مالکیت پس از نام شخص، ’s می‌آید.', example: 'She has long, dark hair. She is tall and friendly. Sara’s bag is blue.' },
      { title: 'ترتیب توصیف', text: 'یک یا دو صفت کافی است. رنگ معمولاً پیش از اسم می‌آید؛ صفت را با اسم از نظر جمع تغییر ندهید.', example: 'a small red bag; two small red bags; a kind teacher' },
    ],
    practice: [
      task('grammar', 'My sister ___ very friendly.', 'is', 'برای my sister که یک نفر است از is استفاده می‌کنیم.', { options: ['am', 'is', 'are'] }),
      task('reading', 'موهای اِوا چه رنگی است؟', 'black', 'در متن آمده است: She has black hair.', { source: 'Eva is short and kind. She has black hair and green eyes.', options: ['black', 'brown', 'blonde'] }),
      task('listening', 'دوست گوینده چه ویژگی‌ای دارد؟', 'tall', 'واژه tall در توصیف شنیده می‌شود.', { audio: 'My friend is tall and very funny.', options: ['tall', 'quiet', 'short'] }),
      task('writing', 'جمله را کامل کنید: The bags are ___.', 'blue', 'برای رنگ، صفت پیش از اسم یا پس از are می‌آید.', { options: ['blue', 'blues', 'a blue'] }),
    ],
    checkpoint: [
      task('grammar', 'He ___ short, but his brother is tall.', 'is', 'برای he از is استفاده می‌کنیم.', { options: ['are', 'is', 'am'] }),
      task('reading', 'مِی چه ویژگی‌ای دارد؟', 'friendly', 'متن می‌گوید May is friendly.', { source: 'May is 20 years old. She is friendly and has long hair.', options: ['friendly', 'angry', 'tired'] }),
      task('listening', 'موهای مادر گوینده چه رنگی است؟', 'brown', 'در فایل می‌شنوید: brown hair.', { audio: 'My mother is short. She has brown hair.', options: ['black', 'brown', 'white'] }),
      task('writing', 'جمله را کامل کنید: He ___ short, and he has dark hair.', 'is', 'برای توصیف قد از is استفاده می‌کنیم.', { options: ['has', 'is', 'does'] }),
    ],
  },
  {
    id: 'a1-home', level: 'A1', title: 'خانه و جای اشیا',
    goal: 'اتاق‌ها و وسایل ساده را نام ببرید و بگویید چیزی کجا قرار دارد.',
    teaching: [
      { title: 'اتاق‌ها و وسایل', text: 'واژه‌های پرکاربرد خانه را با حرف تعریف و عبارت کوتاه یاد بگیرید.', example: 'a kitchen; a bedroom; a bathroom; a living room; a table; a chair' },
      { title: 'there is / there are', text: 'برای معرفی وجود یک چیز از there is و برای چند چیز از there are استفاده کنید. در سؤال، is/are به ابتدای عبارت می‌آید.', example: 'There is a lamp in the room. There are two chairs. Is there a desk?' },
      { title: 'مکان و the', text: 'in یعنی داخل، on یعنی روی سطح، under یعنی زیر و next to یعنی کنار. the را برای چیز مشخص یا چیزی که قبلاً معرفی شده به‌کار ببرید؛ عبارت مکان معمولاً پس از اسم می‌آید.', example: 'There is a table in the room. The keys are on the table. The bag is under the chair.' },
    ],
    practice: [
      task('grammar', 'There ___ a sofa in the living room.', 'is', 'برای یک sofa از there is استفاده می‌کنیم.', { options: ['is', 'are'] }),
      task('reading', 'چراغ کجاست؟', 'روی میز', 'on the table یعنی روی میز.', { source: 'There is a small lamp on the table. The keys are under the table.', options: ['روی میز', 'زیر میز', 'کنار تخت'] }),
      task('listening', 'در اتاق چند صندلی هست؟', '2', 'two chairs یعنی دو صندلی.', { audio: 'There are two chairs in the kitchen.', options: ['1', '2', '3'] }),
      task('writing', 'جمله را کامل کنید: The cat is ___ the table. (زیر)', 'under', 'under یعنی زیر.', { options: ['in', 'on', 'under'] }),
    ],
    checkpoint: [
      task('grammar', 'There ___ three bedrooms in the house.', 'are', 'برای اسم جمع از there are استفاده می‌کنیم.', { options: ['is', 'are'] }),
      task('reading', 'کیف کجاست؟', 'کنار در', 'next to the door یعنی کنار در.', { source: 'The bag is next to the door. The shoes are under the chair.', options: ['کنار در', 'روی صندلی', 'داخل کمد'] }),
      task('listening', 'چه چیزی روی میز است؟', 'یک کتاب', 'گوینده می‌گوید: a book on the table.', { audio: 'There is a book on the table and a chair by the window.', options: ['یک کتاب', 'یک کیف', 'یک کلید'] }),
      task('writing', 'جمله را کامل کنید: ___ there a bathroom?', 'Is', 'در پرسش مفرد، Is ابتدای جمله می‌آید.', { options: ['Is', 'Are', 'Do'] }),
    ],
  },
  {
    id: 'a1-town-directions', level: 'A1', title: 'محله، مسیر و رفت‌وآمد',
    goal: 'مکان‌های عمومی را بشناسید، مسیر ساده بپرسید و راهنمایی کوتاه بدهید.',
    teaching: [
      { title: 'مکان‌های شهر', text: 'نام مکان‌ها را در عبارت واقعی یاد بگیرید؛ a/an را با صدای آغازین کلمه انتخاب کنید.', example: 'a bank; a bus stop; a station; a supermarket; a hospital; a park' },
      { title: 'راهنمایی مسیر', text: 'turn left یعنی به چپ بپیچید، turn right یعنی به راست بپیچید و go straight یعنی مستقیم بروید. این دستورها معمولاً با فعل ساده شروع می‌شوند.', example: 'Go straight. Turn left at the bank. The station is next to the park.' },
      { title: 'روش رفت‌وآمد', text: 'برای شیوهٔ رفت‌وآمد از by + وسیله استفاده کنید؛ برای پیاده‌روی می‌گوییم on foot. پرسش Where is…? برای مکان مفید است.', example: 'I go by bus. She goes by train. We walk to school on foot.' },
    ],
    practice: [
      task('grammar', '___ left at the next street.', 'Turn', 'برای راهنمایی، فعل دستوری در ابتدای جمله می‌آید.', { options: ['Turns', 'Turn', 'Turning'] }),
      task('reading', 'ایستگاه کجاست؟', 'کنار بانک', 'next to the bank یعنی کنار بانک.', { source: 'Go straight. The station is next to the bank, opposite the park.', options: ['کنار بانک', 'داخل پارک', 'پشت مدرسه'] }),
      task('listening', 'گوینده چگونه به محل کار می‌رود؟', 'با اتوبوس', 'by bus یعنی با اتوبوس.', { audio: 'I go to work by bus. The bus stop is near my home.', options: ['پیاده', 'با اتوبوس', 'با قطار'] }),
      task('writing', 'جمله را کامل کنید: Go ___ for two streets. (مستقیم)', 'straight', 'go straight یعنی مستقیم بروید.', { options: ['left', 'straight', 'right'] }),
    ],
    checkpoint: [
      task('grammar', 'How ___ I get to the station?', 'do', 'در پرسش با I از do استفاده می‌شود.', { options: ['does', 'do', 'am'] }),
      task('reading', 'داروخانه روبه‌روی کجاست؟', 'بانک', 'opposite the bank یعنی روبه‌روی بانک.', { source: 'The pharmacy is opposite the bank. The café is next to the station.', options: ['ایستگاه', 'پارک', 'بانک'] }),
      task('listening', 'برای رسیدن به پارک کجا بپیچیم؟', 'به راست', 'گوینده می‌گوید turn right.', { audio: 'Go straight and turn right at the supermarket. The park is there.', options: ['به چپ', 'به راست', 'برنگردید'] }),
      task('writing', 'جمله را کامل کنید: I go to school ___ foot.', 'on', 'عبارت ثابت on foot است.', { options: ['on', 'by', 'at'] }),
    ],
  },
  {
    id: 'a1-food-cafe', level: 'A1', title: 'خوراکی، سفارش و مقدار',
    goal: 'خوراکی‌های رایج را بشناسید و در کافه سفارش ساده بدهید.',
    teaching: [
      { title: 'قابل‌شمارش و غیرقابل‌شمارش', text: 'برای چیزهایی مانند apples از عدد و جمع استفاده می‌کنیم؛ برای آب و شیر در کاربرد معمول، مقدار یا ظرف می‌آوریم.', example: 'an apple; two eggs; some water; a glass of milk; a cup of tea' },
      { title: 'some، any و مقدار', text: 'some در عبارت‌های مثبت رایج است و any در بسیاری از پرسش‌ها و جمله‌های منفی. how many با جمع قابل‌شمارش و how much با مقدارهای غیرقابل‌شمارش می‌آید.', example: 'some rice; any apples?; How many eggs? How much water?' },
      { title: 'سفارش مودبانه', text: 'برای سفارش از I would like… یا شکل کوتاه I’d like… استفاده کنید. لطفاً و تشکر، مکالمه را طبیعی و مودبانه می‌کند.', example: 'I’d like a sandwich and some water, please. — Here you are. — Thank you.' },
    ],
    practice: [
      task('grammar', 'How ___ apples do you need?', 'many', 'apples اسم جمع قابل‌شمارش است؛ many به‌کار می‌رود.', { options: ['much', 'many'] }),
      task('reading', 'مشتری چه نوشیدنی می‌خواهد؟', 'tea', 'مشتری یک cup of tea سفارش می‌دهد.', { source: 'Hello. I would like a cheese sandwich and a cup of tea, please.', options: ['tea', 'coffee', 'milk'] }),
      task('listening', 'گوینده چند تخم‌مرغ می‌خواهد؟', '6', 'six eggs یعنی شش تخم‌مرغ.', { audio: 'I need six eggs and some milk, please.', options: ['4', '6', '8'] }),
      task('writing', 'جمله را کامل کنید: How ___ water is there?', 'much', 'water در این کاربرد غیرقابل‌شمارش است؛ much به‌کار می‌رود.', { options: ['many', 'much'] }),
    ],
    checkpoint: [
      task('grammar', 'We have ___ bread, but we do not have ___ eggs.', 'some / any', 'some در جمله مثبت و any در جمله منفی طبیعی است.', { options: ['some / any', 'any / some', 'a / an'] }),
      task('reading', 'سفارش غذا چیست؟', 'یک سوپ و آب', 'یک سوپ سبزیجات و مقداری آب سفارش داده شده است.', { source: 'I would like a vegetable soup and some water, please.', options: ['یک سوپ و آب', 'یک قهوه و شیر', 'یک کیک و چای'] }),
      task('listening', 'قیمت ساندویچ چقدر است؟', '8 dollars', 'گوینده می‌گوید: eight dollars.', { audio: 'The sandwich is eight dollars. The tea is two dollars.', options: ['2 dollars', '8 dollars', '10 dollars'] }),
      task('writing', 'یک سفارش را کامل کنید: I’d ___ a cup of tea, please.', 'like', 'الگوی مودبانه I would like است.', { options: ['like', 'likes', 'liking'] }),
    ],
  },
  {
    id: 'a1-shopping-clothes', level: 'A1', title: 'خرید، لباس و قیمت',
    goal: 'نام لباس و اندازه را بگویید، قیمت بپرسید و خرید ساده انجام دهید.',
    teaching: [
      { title: 'لباس و اندازه', text: 'لباس‌ها را با صفت رنگ و اندازه توصیف کنید. برای پرسیدن اندازه، واژهٔ size را به‌کار ببرید.', example: 'a blue shirt; black shoes; small (S); medium (M); large (L)' },
      { title: 'اشاره به کالا', text: 'this و that برای یک چیز نزدیک و دور، these و those برای چند چیز نزدیک و دور هستند.', example: 'How much is this shirt? How much are these shoes? Those shoes are black.' },
      { title: 'مقایسهٔ ساده', text: 'برای مقایسهٔ دو چیز، صفت کوتاه معمولاً er می‌گیرد و than پیش از مورد دوم می‌آید. این ساختار را در عبارت‌های کوتاه تمرین کنید.', example: 'This bag is smaller than that bag. The blue shirt is cheaper.' },
    ],
    practice: [
      task('grammar', 'How much ___ these shoes?', 'are', 'shoes جمع است؛ از are استفاده می‌کنیم.', { options: ['is', 'are'] }),
      task('reading', 'قیمت پیراهن آبی چقدر است؟', '20 dollars', 'برچسب قیمت پیراهن آبی 20 دلار است.', { source: 'Blue shirt: $20. Red shirt: $25. Black shoes: $30.', options: ['20 dollars', '25 dollars', '30 dollars'] }),
      task('listening', 'مشتری چه اندازه‌ای می‌خواهد؟', 'medium', 'گوینده می‌گوید: medium, please.', { audio: 'Do you have this shirt in medium? Yes, here you are.', options: ['small', 'medium', 'large'] }),
      task('writing', 'جمله را کامل کنید: This bag is ___ than that bag. (small)', 'smaller', 'برای مقایسهٔ این صفت کوتاه، er اضافه می‌شود.', { options: ['small', 'smaller', 'smallest'] }),
    ],
    checkpoint: [
      task('grammar', 'How much ___ that jacket?', 'is', 'jacket مفرد است؛ از is استفاده می‌کنیم.', { options: ['is', 'are'] }),
      task('reading', 'کدام کالا ارزان‌تر است؟', 'پیراهن آبی', 'قیمت پیراهن آبی 18 و قرمز 22 دلار است.', { source: 'Blue shirt: $18. Red shirt: $22. Both are small.', options: ['پیراهن آبی', 'پیراهن قرمز', 'قیمت برابر است'] }),
      task('listening', 'مشتری چه رنگی می‌خواهد؟', 'black', 'درخواست شنیداری شامل رنگ black است.', { audio: 'I like those shoes. Do you have them in black?', options: ['blue', 'black', 'white'] }),
      task('writing', 'جمله را کامل کنید: These ___ are too large.', 'shoes', 'these با اسم جمع shoes استفاده می‌شود.', { options: ['shoe', 'shoes', 'a shoe'] }),
    ],
  },
  {
    id: 'a1-abilities-requests', level: 'A1', title: 'توانایی، اجازه و درخواست',
    goal: 'توانایی‌ها را بیان کنید و برای کمک یا اجازه، درخواست کوتاه و مودبانه بسازید.',
    teaching: [
      { title: 'can و can’t', text: 'can برای توانایی یا امکان و can’t برای ناتوانی به‌کار می‌رود. پس از آن، فعل ساده بدون to می‌آید؛ شکل فعل برای he/she تغییر نمی‌کند.', example: 'I can swim. She can cook. He can’t drive.' },
      { title: 'درخواست و اجازه', text: 'Can you…? برای درخواست کمک و Can I…? برای اجازه یا خواستهٔ ساده کاربرد دارد. please لحن را مودبانه‌تر می‌کند.', example: 'Can you help me, please? Can I open the window?' },
      { title: 'دستور، ضمیر مفعولی و درخواست تکرار', text: 'دستور کوتاه با فعل ساده آغاز می‌شود. me, him, her, us و them پس از فعل یا حرف اضافه می‌آیند. اگر متوجه نشدید، درخواست تکرار کنید؛ این برنامه پاسخ گفتاری شما را ضبط یا نمره‌گذاری نمی‌کند.', example: 'Please sit down. Call me. Help her. Come with us. Could you repeat that, please? I don’t understand.' },
    ],
    practice: [
      task('grammar', 'Maya can ___ a bike.', 'ride', 'بعد از can شکل سادهٔ فعل می‌آید.', { options: ['rides', 'ride', 'riding'] }),
      task('reading', 'چه کسی نمی‌تواند شنا کند؟', 'Omar', 'متن می‌گوید Omar can’t swim.', { source: 'Lina can swim, but Omar can’t swim. They can play tennis together.', options: ['Lina', 'Omar', 'هر دو'] }),
      task('listening', 'گوینده چه درخواستی می‌کند؟', 'کمک', 'گوینده می‌گوید: Can you help me?', { audio: 'Excuse me. Can you help me, please?', options: ['کمک', 'غذا', 'آدرس ایمیل'] }),
      task('writing', 'جمله را کامل کنید: Can I ___ the window?', 'open', 'پس از can از شکل سادهٔ فعل استفاده می‌کنیم.', { options: ['open', 'opens', 'opening'] }),
    ],
    checkpoint: [
      task('grammar', 'She can’t ___ a car.', 'drive', 'can’t نیز با شکل سادهٔ فعل می‌آید.', { options: ['drives', 'drive', 'driving'] }),
      task('reading', 'با چه کسی باید تماس بگیرید؟', 'Anna', 'عبارت call her به Anna اشاره می‌کند.', { source: 'Anna is at the desk. Please call her after lunch.', options: ['Anna', 'Ben', 'هیچ‌کس'] }),
      task('listening', 'آیا گوینده اجازهٔ بازکردن پنجره را می‌خواهد؟', 'بله', 'پرسش Can I open the window? درخواست اجازه است.', { audio: 'It is hot in here. Can I open the window?', options: ['بله', 'خیر'] }),
      task('writing', 'جمله را کامل کنید: Please come with ___. (ما)', 'us', 'ضمیر مفعولی we برابر us است.', { options: ['we', 'us', 'our'] }),
    ],
  },
  {
    id: 'a1-free-time', level: 'A1', title: 'اوقات فراغت و قرار دوستانه',
    goal: 'علاقه‌ها و دفعات انجام کار را بگویید و دعوتی ساده را بپذیرید یا رد کنید.',
    teaching: [
      { title: 'علاقه‌ها', text: 'پس از like و love، برای نام‌بردن از فعالیت معمولاً شکل ing می‌آید. برای یک اسم از like + اسم نیز استفاده می‌شود.', example: 'I like reading. She loves music. They like playing football.' },
      { title: 'دفعات و زمان', text: 'always، usually، sometimes و never دفعات را نشان می‌دهند و در حال ساده معمولاً پیش از فعل اصلی می‌آیند؛ با فعل be پس از آن می‌آیند.', example: 'I usually walk. He sometimes cooks. She is always busy.' },
      { title: 'دعوت و پاسخ', text: 'برای پیشنهاد می‌توان گفت Would you like to…? پاسخ مثبت یا منفی را با تشکر و زمان جایگزین کامل کنید.', example: 'Would you like to see a film? — Yes, I’d love to. / Sorry, I can’t. How about Saturday?' },
    ],
    practice: [
      task('grammar', 'They like ___ football.', 'playing', 'پس از like برای فعالیت، playing به‌کار می‌رود.', { options: ['play', 'playing', 'plays'] }),
      task('reading', 'مِی چند وقت یک‌بار موسیقی گوش می‌دهد؟', 'گاهی', 'sometimes یعنی گاهی.', { source: 'May sometimes listens to music after work. She usually reads at night.', options: ['همیشه', 'گاهی', 'هرگز'] }),
      task('listening', 'قرار کدام روز است؟', 'Saturday', 'قرار جایگزین برای Saturday است.', { audio: 'Would you like to see a film on Friday? Sorry, I am busy. How about Saturday?', options: ['Friday', 'Saturday', 'Sunday'] }),
      task('writing', 'پاسخ مثبت کوتاه را کامل کنید: Yes, I’d love ___.', 'to', 'پاسخ رایج دعوت Yes, I’d love to است.', { options: ['to', 'do', 'going'] }),
    ],
    checkpoint: [
      task('grammar', 'He ___ goes swimming on Sundays. (معمولاً)', 'usually', 'usually پیش از فعل اصلی goes می‌آید.', { options: ['is usually', 'usually', 'usual'] }),
      task('reading', 'نویسنده چه زمانی فوتبال بازی می‌کند؟', 'روزهای شنبه', 'متن می‌گوید I play on Saturdays.', { source: 'I enjoy sport. I play football on Saturdays, and I sometimes ride my bike.', options: ['روزهای شنبه', 'هر روز', 'روزهای دوشنبه'] }),
      task('listening', 'دعوت برای انجام چه کاری است؟', 'تماشای فیلم', 'گوینده پیشنهاد دیدن فیلم می‌دهد.', { audio: 'Would you like to watch a film with us tonight?', options: ['تماشای فیلم', 'بازی تنیس', 'صرف صبحانه'] }),
      task('writing', 'جمله را کامل کنید: I ___ enjoy cooking. (هرگز)', 'never', 'never پیش از فعل اصلی قرار می‌گیرد.', { options: ['never', 'am never', 'never am'] }),
    ],
  },
  {
    id: 'a1-now-and-routines', level: 'A1', title: 'اکنون و برنامهٔ همیشگی',
    goal: 'کارهای در حال انجام را از عادت‌های روزانه به‌طور مقدماتی جدا کنید.',
    teaching: [
      { title: 'کاری که همین حالا جریان دارد', text: 'برای کار در حال انجام از am/is/are + فعل ing استفاده کنید. now و at the moment اغلب نشانهٔ این کاربرد هستند.', example: 'I am reading now. She is cooking. They are waiting at the moment.' },
      { title: 'عادت در برابر همین لحظه', text: 'حال ساده برای عادت و برنامهٔ معمول است؛ حال استمراری برای رویداد در جریان. هر دو را در یک گفت‌وگو مقایسه کنید.', example: 'I work every day, but today I am resting. He usually walks; now he is taking a bus.' },
      { title: 'ساخت فعل ing', text: 'به بیشتر فعل‌ها ing اضافه می‌شود؛ در نمونه‌های پایه، e پایانی حذف می‌شود: make → making. فعلاً چند الگوی پرتکرار را تمرین کنید.', example: 'read → reading; play → playing; make → making; sit → sitting' },
    ],
    practice: [
      task('grammar', 'Look! The baby ___.', 'is sleeping', 'برای رخداد همین حالا، is + sleeping می‌آید.', { options: ['sleeps', 'is sleeping', 'sleep'] }),
      task('reading', 'امروز جِین چه می‌کند؟', 'در خانه کار می‌کند', 'امروز برخلاف برنامه، در خانه کار می‌کند.', { source: 'Jane usually works at the office. Today she is working at home.', options: ['در دفتر کار می‌کند', 'در خانه کار می‌کند', 'در حال رانندگی است'] }),
      task('listening', 'چه کسی اکنون در حال آشپزی است؟', 'پدر', 'گوینده می‌گوید Dad is cooking now.', { audio: 'Mum is reading. Dad is cooking dinner now.', options: ['مادر', 'پدر', 'خواهر'] }),
      task('writing', 'جمله را کامل کنید: They are ___ football now.', 'playing', 'بعد از are از شکل ing فعل استفاده می‌کنیم.', { options: ['play', 'plays', 'playing'] }),
    ],
    checkpoint: [
      task('grammar', 'I usually ___ coffee, but now I am drinking tea.', 'drink', 'usually عادت را نشان می‌دهد؛ از حال ساده استفاده می‌کنیم.', { options: ['drink', 'am drinking', 'drinks'] }),
      task('reading', 'کودکان اکنون کجا بازی می‌کنند؟', 'در پارک', 'متن می‌گوید: They are playing in the park now.', { source: 'The children usually play at home. Today they are playing in the park.', options: ['در خانه', 'در پارک', 'در مدرسه'] }),
      task('listening', 'گوینده اکنون چه می‌خواند؟', 'کتاب', 'در جملهٔ دوم گفته می‌شود: I am reading a book.', { audio: 'I usually watch TV after dinner, but now I am reading a book.', options: ['روزنامه', 'کتاب', 'نامه'] }),
      task('writing', 'جمله را کامل کنید: She is ___ a cake. (make)', 'making', 'در make، e پایانی حذف می‌شود: making.', { options: ['makeing', 'making', 'makes'] }),
    ],
  },
  {
    id: 'a1-health', level: 'A1', title: 'بدن، حال عمومی و کمک‌گرفتن',
    goal: 'چند نشانهٔ ساده را بیان کنید و در یک موقعیت روزمره کمک یا وقت ملاقات بخواهید.',
    teaching: [
      { title: 'واژه‌های پایهٔ بدن', text: 'نام بخش‌های پرکاربرد بدن را همراه a/an یاد بگیرید. برای بیان درد از عبارت have a… استفاده می‌شود.', example: 'a head; an arm; a hand; a leg; a stomach; I have a headache.' },
      { title: 'حال عمومی', text: 'برای بیان حس، از feel + صفت یا be + صفت استفاده کنید. در این درس فقط زبان سادهٔ ارتباطی تمرین می‌شود؛ توصیه یا تشخیص پزشکی ارائه نمی‌شود.', example: 'I feel tired. She feels better today. He is ill and needs help.' },
      { title: 'درخواست کمک', text: 'در موقعیت واقعی اگر حالتان بد است از فرد قابل‌اعتماد یا خدمات درمانی کمک بگیرید. می‌توانید علائم و زمان مناسب را با جملهٔ ساده بیان کنید.', example: 'I have a headache. Can I make an appointment? I need help, please.' },
    ],
    practice: [
      task('grammar', 'I have ___ headache.', 'a', 'در عبارت have a headache از a استفاده می‌کنیم.', { options: ['a', 'an', 'some'] }),
      task('reading', 'نِد به چه کمکی نیاز دارد؟', 'وقت ملاقات', 'او می‌خواهد برای فردا وقت ملاقات بگیرد.', { source: 'Ned feels ill today. He has a sore throat. He would like an appointment tomorrow.', options: ['یک بلیت', 'وقت ملاقات', 'یک اتاق'] }),
      task('listening', 'گوینده چه احساسی دارد؟', 'خسته', 'tired یعنی خسته.', { audio: 'I feel tired today. I need to rest.', options: ['خسته', 'گرسنه', 'گرم'] }),
      task('writing', 'جمله را کامل کنید: Can I make an ___?', 'appointment', 'appointment یعنی وقت ملاقات.', { options: ['appointment', 'address', 'airport'] }),
    ],
    checkpoint: [
      task('grammar', 'She ___ better this morning.', 'feels', 'برای she از feels استفاده می‌کنیم.', { options: ['feel', 'feels', 'feeling'] }),
      task('reading', 'سَرا چه زمانی با درمانگاه تماس می‌گیرد؟', 'صبح', 'در متن آمده است: She will call in the morning.', { source: 'Sara has a toothache. The clinic opens at nine. She will call in the morning.', options: ['امشب', 'صبح', 'نیمه‌شب'] }),
      task('listening', 'گوینده برای چه کسی کمک می‌خواهد؟', 'برای برادرش', 'عبارت for my brother نشان می‌دهد برای برادرش است.', { audio: 'Can you help my brother? He has a stomachache.', options: ['برای خودش', 'برای برادرش', 'برای مادرش'] }),
      task('writing', 'جمله را کامل کنید: I ___ a sore throat.', 'have', 'برای I از have استفاده می‌کنیم.', { options: ['has', 'have', 'am'] }),
    ],
  },
  {
    id: 'a1-weather-plans', level: 'A1', title: 'آب‌وهوا، فصل‌ها و برنامهٔ آینده',
    goal: 'آب‌وهوا و فصل‌ها را توصیف کنید و برای یک برنامهٔ ساده از going to استفاده کنید.',
    teaching: [
      { title: 'آب‌وهوا و فصل‌ها', text: 'هوا را با it is و صفت یا اسم مناسب توصیف کنید. season یعنی فصل.', example: 'It is sunny and warm. It is raining. Spring is my favourite season.' },
      { title: 'لباس مناسب هوا', text: 'با wear لباس مناسب را بیان کنید. برای نظر ساده از because و یک دلیل روشن استفاده کنید.', example: 'I wear a coat because it is cold. She wears a hat on sunny days.' },
      { title: 'برنامه با going to', text: 'برای برنامهٔ در نظر گرفته‌شده، از am/is/are going to + فعل ساده استفاده کنید. شکل فعل اصلی پس از to تغییر نمی‌کند.', example: 'I am going to visit my friend tomorrow. They are going to stay at home.' },
    ],
    practice: [
      task('grammar', 'They are going to ___ the park tomorrow.', 'visit', 'پس از going to، شکل سادهٔ فعل می‌آید.', { options: ['visits', 'visit', 'visiting'] }),
      task('reading', 'چرا لِنا چتر می‌برد؟', 'بارانی است', 'پیش‌بینی می‌گوید بعدازظهر بارانی است.', { source: 'It is sunny now, but it is going to rain this afternoon. Lena is taking an umbrella.', options: ['برفی است', 'بارانی است', 'گرم است'] }),
      task('listening', 'در چه فصلی قرار است سفر کنند؟', 'تابستان', 'گوینده می‌گوید: in summer.', { audio: 'It is cold today, but we are going to visit Spain in summer.', options: ['زمستان', 'بهار', 'تابستان'] }),
      task('writing', 'جمله را کامل کنید: I am going to ___ my friend. (visit)', 'visit', 'ساختار going to با فعل ساده می‌آید.', { options: ['visiting', 'visit', 'visits'] }),
    ],
    checkpoint: [
      task('grammar', 'Mina ___ going to wear a coat.', 'is', 'برای Mina از is استفاده می‌کنیم.', { options: ['are', 'is', 'am'] }),
      task('reading', 'چه لباسی برای هوای سرد می‌پوشند؟', 'کت', 'در متن گفته شده coat می‌پوشند.', { source: 'The weather is cold and windy. We are going to wear our coats.', options: ['کلاه', 'کت', 'صندل'] }),
      task('listening', 'گوینده فردا چه کاری انجام می‌دهد؟', 'به ساحل می‌رود', 'گوینده می‌گوید: go to the beach.', { audio: 'Tomorrow it is going to be sunny. I am going to go to the beach.', options: ['در خانه می‌ماند', 'به ساحل می‌رود', 'به مدرسه می‌رود'] }),
      task('writing', 'جمله را کامل کنید: It is ___ today. (برفی)', 'snowy', 'snowy یعنی برفی.', { options: ['snowy', 'cloud', 'rain'] }),
    ],
  },
  {
    id: 'a1-travel', level: 'A1', title: 'سفر، بلیت و اقامت',
    goal: 'زمان حرکت و اطلاعات سادهٔ سفر را بخوانید و در هتل یا ایستگاه سؤال کنید.',
    teaching: [
      { title: 'زمان‌بندی و بلیت', text: 'در جدول، به مقصد و زمان حرکت دقت کنید. leaves یعنی حرکت می‌کند و arrives یعنی می‌رسد.', example: 'Train 4 to Oxford leaves at 10:15 and arrives at 11:00.' },
      { title: 'رزرو ساده', text: 'برای یک اتاق می‌توان گفت I have a reservation یا پرسید Is breakfast included? تاریخ را همراه ماه یا روز هفته روشن بیان کنید.', example: 'I have a reservation for two nights. Is breakfast included?' },
      { title: 'درخواست در سفر', text: 'برای اطلاعات یا کمک، با Excuse me آغاز کنید. پرسش را کوتاه و روشن بسازید و پاسخ را برای جزئیات کلیدی بررسی کنید.', example: 'Excuse me, where is platform two? How much is a ticket to York?' },
    ],
    practice: [
      task('grammar', 'The train ___ at 10:15.', 'leaves', 'در جدول حرکت، train سوم‌شخص مفرد است: leaves.', { options: ['leave', 'leaves', 'leaving'] }),
      task('reading', 'قطار چه ساعتی به آکسفورد می‌رسد؟', '11:00', 'در جدول، زمان رسیدن 11:00 است.', { source: 'Train 4: London 10:15 → Oxford 11:00. Train 6: London 11:00 → Oxford 11:50.', options: ['10:15', '11:00', '11:50'] }),
      task('listening', 'مهمان چند شب رزرو دارد؟', '2 nights', 'گوینده می‌گوید: for two nights.', { audio: 'Hello. I have a reservation for two nights. My name is Alex Lee.', options: ['1 night', '2 nights', '3 nights'] }),
      task('writing', 'جمله را کامل کنید: I have a ___ for tonight. (رزرو)', 'reservation', 'reservation یعنی رزرو.', { options: ['reservation', 'platform', 'passport'] }),
    ],
    checkpoint: [
      task('grammar', 'Where ___ platform three?', 'is', 'پرسش دربارهٔ مکان مفرد با is ساخته می‌شود.', { options: ['is', 'are', 'do'] }),
      task('reading', 'قطار ساعت 14:20 به کجا می‌رود؟', 'Bristol', 'ردیف ساعت 14:20 مقصد Bristol را نشان می‌دهد.', { source: '12:10 — Bristol — platform 2. 14:20 — Bristol — platform 4.', options: ['London', 'Bristol', 'Oxford'] }),
      task('listening', 'صبحانه شامل هزینهٔ اتاق هست؟', 'بله', 'پاسخ شنیداری Yes, it is است.', { audio: 'Is breakfast included? Yes, it is. It is served from seven to ten.', options: ['بله', 'خیر'] }),
      task('writing', 'جمله را کامل کنید: How much is a ___ to York? (بلیت)', 'ticket', 'ticket یعنی بلیت.', { options: ['ticket', 'room', 'key'] }),
    ],
  },
  {
    id: 'a1-past', level: 'A1', title: 'دیروز و گذشتهٔ نزدیک',
    goal: 'چند رویداد سادهٔ گذشته را با was/were و فعل‌های پرتکرار تعریف کنید.',
    teaching: [
      { title: 'گذشتهٔ فعل بودن', text: 'برای گذشتهٔ مفرد معمولاً was و برای you/we/they و اسم جمع were به‌کار می‌رود. پرسش با جابه‌جایی فعل ساخته می‌شود.', example: 'I was at home. They were at the park. Was she tired? Were you busy?' },
      { title: 'فعل‌های رایج گذشته', text: 'برخی فعل‌های پرکاربرد شکل ویژه دارند. چند نمونه را به‌صورت جفت حال/گذشته یاد بگیرید؛ گذشته زمان را می‌گوید، نه عادت روزانه.', example: 'go → went; have → had; see → saw; eat → ate; visit → visited' },
      { title: 'پرسش و منفی با did', text: 'برای پرسش و منفیِ فعل‌های معمولی از did/didn’t + شکل ساده استفاده کنید. did خودش نشان‌دهندهٔ گذشته است؛ به فعل پس از آن ed اضافه نکنید.', example: 'Did you visit the museum? I didn’t go by bus. We went on foot.' },
    ],
    practice: [
      task('grammar', 'Yesterday I ___ at home.', 'was', 'برای I در گذشته از was استفاده می‌کنیم.', { options: ['am', 'was', 'were'] }),
      task('reading', 'خانوادهٔ نُوا کجا رفتند؟', 'به موزه', 'آن‌ها از موزه دیدن کردند.', { source: 'On Saturday, Noah and his family went to the city museum. They saw old maps and had lunch in a café.', options: ['به پارک', 'به موزه', 'به مدرسه'] }),
      task('listening', 'گوینده دیشب چه چیزی خورد؟', 'پیتزا', 'گوینده می‌گوید: I ate pizza.', { audio: 'Last night I ate pizza and watched a film with my sister.', options: ['سوپ', 'پیتزا', 'ماهی'] }),
      task('writing', 'جمله را کامل کنید: Did you ___ the museum? (visit)', 'visit', 'بعد از did شکل سادهٔ visit می‌آید.', { options: ['visit', 'visited', 'visiting'] }),
    ],
    checkpoint: [
      task('grammar', 'We ___ at the station yesterday.', 'were', 'برای we در گذشته از were استفاده می‌کنیم.', { options: ['was', 'were', 'are'] }),
      task('reading', 'مِی دیروز چه چیزی دید؟', 'یک فیلم', 'در متن آمده است: She saw a film.', { source: 'May was tired yesterday. She stayed at home and saw a film.', options: ['یک فیلم', 'یک مسابقه', 'یک موزه'] }),
      task('listening', 'گوینده چگونه به محل رفت؟', 'با قطار', 'عبارت went by train یعنی با قطار رفت.', { audio: 'We went to York by train. We had lunch there.', options: ['با اتوبوس', 'با قطار', 'با ماشین'] }),
      task('writing', 'جمله را کامل کنید: I didn’t ___ coffee yesterday. (drink)', 'drink', 'پس از didn’t شکل سادهٔ drink می‌آید.', { options: ['drink', 'drank', 'drinking'] }),
    ],
  },
  {
    id: 'a1-notices-messages', level: 'A1', title: 'تابلو، برنامه و پیام کوتاه',
    goal: 'اطلاعات اصلی را از اعلان‌ها و برنامه‌های ساده پیدا کنید و پیامی روشن بنویسید.',
    teaching: [
      { title: 'تابلوهای روزمره', text: 'برای فهم تابلو، واژه‌های کلیدی، ساعت و علامت ممنوعیت را پیدا کنید؛ لازم نیست همهٔ کلمات را ترجمه کنید.', example: 'OPEN 9–5; NO PARKING; PLEASE WAIT HERE; CLOSED ON SUNDAY' },
      { title: 'زمان و مکان', text: 'at معمولاً با ساعت، on با روز و تاریخ، و in با ماه/سال و بخش‌هایی از روز می‌آید. در عبارت‌های رایج، in the morning و at night را به‌خاطر بسپارید.', example: 'at 8:00; on Monday; in July; in the evening; at night' },
      { title: 'پیام منظم', text: 'پیام روشن شامل سلام، هدف، اطلاعات ضروری و درخواست یا پایان مودبانه است. and اطلاعات را پیوند می‌دهد، but تضاد و because دلیل را نشان می‌دهد.', example: 'Hi Ben. The shop is closed today, so let’s meet tomorrow at six. Please reply. Thanks, Ana.' },
    ],
    practice: [
      task('grammar', 'The class is ___ Monday ___ 9:00.', 'on / at', 'روز با on و ساعت با at می‌آید.', { options: ['on / at', 'at / on', 'in / on'] }),
      task('reading', 'فروشگاه چه روزی بسته است؟', 'Sunday', 'تابلو می‌گوید CLOSED ON SUNDAY.', { source: 'SHOP HOURS: Monday–Saturday 9:00–17:00. CLOSED ON SUNDAY.', options: ['Monday', 'Saturday', 'Sunday'] }),
      task('listening', 'قرار در چه ساعتی است؟', '6:30', 'گوینده ساعت six thirty را می‌گوید.', { audio: 'The café is open until six. Let us meet there at six thirty.', options: ['6:00', '6:30', '7:30'] }),
      task('writing', 'جمله را کامل کنید: The meeting is ___ July. (ماه)', 'in', 'برای نام ماه از in استفاده می‌کنیم.', { options: ['at', 'on', 'in'] }),
    ],
    checkpoint: [
      task('grammar', 'We have English ___ the morning.', 'in', 'عبارت رایج in the morning است.', { options: ['in', 'on', 'at'] }),
      task('reading', 'بازدیدکننده باید کجا منتظر بماند؟', 'اینجا', 'تابلو می‌گوید PLEASE WAIT HERE.', { source: 'TICKET OFFICE: OPEN 8:00–16:00. PLEASE WAIT HERE.', options: ['اینجا', 'بیرون', 'در پارک'] }),
      task('listening', 'فردا فروشگاه چه ساعتی باز می‌شود؟', '9:00', 'گوینده می‌گوید: opens at nine.', { audio: 'The shop is closed today. Tomorrow it opens at nine in the morning.', options: ['8:00', '9:00', '10:00'] }),
      task('writing', 'جمله را کامل کنید: Please wait ___ the door. (کنار)', 'by', 'by the door یعنی کنار در.', { options: ['by', 'under', 'between'] }),
    ],
  },
];
