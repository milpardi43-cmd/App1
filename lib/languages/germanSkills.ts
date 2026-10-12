import type { LearningUnit, GuidedLesson, ChoiceExercise, WriteExercise } from './learningDesign';

type TextTask = { text:string; fa:string; question:string; choices:string[]; correct:number; why:string };
type MessageTask = { prompt:string; answers:string[]; hint:string; why:string };
interface SkillsLesson {
  id:string; title:string; goal:string; situation:string; pattern:string; sound:string;
  dialogue:[string,string][]; examples:[string,string][];
  listen:TextTask; read:TextTask; write:MessageTask; mission:MessageTask;
}
const specs:SkillsLesson[] = [
  {
    id:'de-skills-class',title:'پیام یک همکلاسی',goal:'اطلاعات یک معرفی کوتاه را می‌فهمم و دو جمله برای معرفی می‌نویسم.',
    situation:'همکلاسی تازه یک پیام کوتاه فرستاده است. اول اطلاعات مهم را از صدا پیدا می‌کنید، سپس متن دیگری می‌خوانید و پاسخ کوتاه می‌نویسید.',
    pattern:'برای فهم متن لازم نیست همه واژه‌ها را ترجمه کنید. بار اول موضوع را بگیرید؛ بار دوم نام، شهر یا زمان خواسته‌شده را پیدا کنید. در نوشتن، دو جمله مستقل با نقطه از هم جدا می‌شوند.',
    sound:'بین جمله‌ها مکث کوتاه کنید. نام شخص را با نام شهر اشتباه نگیرید؛ به واژه بعد از wohne توجه کنید.',
    dialogue:[['Hallo, ich heiße Nora.','سلام، اسم من نورا است.'],['Hallo Nora! Ich heiße Sara.','سلام نورا! اسم من سارا است.'],['Wo wohnst du?','کجا زندگی می‌کنی؟']],
    examples:[['Ich heiße Sara.','اسم من سارا است.'],['Ich wohne in Bonn.','من در بُن زندگی می‌کنم.'],['Ich lerne Deutsch.','من آلمانی یاد می‌گیرم.']],
    listen:{text:'Hallo! Ich heiße Nora. Ich komme aus Deutschland. Ich wohne in Bonn. Ich lerne Deutsch am Montag. Mein Bruder wohnt in Berlin.',fa:'سلام! اسم من نورا است. اهل آلمان هستم. در بُن زندگی می‌کنم. دوشنبه آلمانی یاد می‌گیرم. برادرم در برلین زندگی می‌کند.',question:'خود نورا در کدام شهر زندگی می‌کند؟',choices:['Berlin','Bonn','Hamburg'],correct:1,why:'بعد از Ich wohne شهر Bonn آمده است؛ Berlin شهر برادر اوست.'},
    read:{text:'Hallo! Ich bin Ben. Meine Schwester heißt Mia. Sie wohnt in Hamburg. Ich wohne in Berlin und lerne Deutsch. Am Freitag habe ich Zeit.',fa:'سلام! من بِن هستم. خواهرم میا نام دارد. او در هامبورگ زندگی می‌کند. من در برلین زندگی می‌کنم و آلمانی یاد می‌گیرم. جمعه وقت دارم.',question:'طبق پیام، چه کسی در هامبورگ زندگی می‌کند؟',choices:['بِن','نورا','میا'],correct:2,why:'Sie در جمله سوم به Mia، خواهر بِن، اشاره می‌کند؛ راوی در Berlin است.'},
    write:{prompt:'در نقش Sara یک معرفی دو جمله‌ای بنویسید: «اسم من سارا است. من در بُن زندگی می‌کنم.» به همین ترتیب با Ich heiße و Ich wohne شروع کنید.',answers:['Ich heiße Sara. Ich wohne in Bonn.'],hint:'جمله اول: Ich heiße Sara. جمله دوم با Ich wohne شروع می‌شود.',why:'نام و شهر باید هر دو حاضر باشند. پس از خواندن نمونه بررسی کنید: آیا دو جمله جدا نوشته‌اید؟ آیا اسم شهر حرف بزرگ دارد؟'},
    mission:{prompt:'در نقش Ben پیام دو جمله‌ای بدهید: «اسم من بِن است. من در هامبورگ زندگی می‌کنم.» به همین ترتیب با Ich heiße و Ich wohne شروع کنید.',answers:['Ich heiße Ben. Ich wohne in Hamburg.'],hint:'نام Ben و شهر Hamburg است؛ دو جمله با Ich شروع می‌شوند.',why:'پیام شامل معرفی نام و محل زندگی است؛ ترتیب خواسته‌شده حفظ شده است.'},
  },
  {
    id:'de-skills-plan',title:'هماهنگی یک قرار',goal:'روز و ساعت را از پیام می‌فهمم و یک قرار کوتاه می‌نویسم.',
    situation:'دوستتان چند زمان را در یک پیام مطرح کرده است. باید زمان نهایی قرار را از زمان کار جدا کنید.',
    pattern:'am برای روز و um برای ساعت است. منفی‌بودن یک جمله مهم است: keine Zeit یعنی آن زمان مناسب نیست. برای پیام کوتاه لازم نیست چند جمله را با ساختار پیچیده به هم وصل کنید.',
    sound:'پیش از پاسخ‌دادن تا پایان پیام گوش دهید؛ زمان اولی که می‌شنوید لزوماً زمان قرار نیست.',
    dialogue:[['Hast du am Montag Zeit?','دوشنبه وقت داری؟'],['Nein. Am Freitag habe ich Zeit.','نه. جمعه وقت دارم.'],['Gut! Wir treffen uns um zehn Uhr.','خوب است! ساعت ده همدیگر را می‌بینیم.']],
    examples:[['Am Freitag habe ich Zeit.','جمعه وقت دارم.'],['Wir treffen uns um zehn Uhr.','ساعت ده همدیگر را می‌بینیم.'],['Am Montag habe ich keine Zeit.','دوشنبه وقت ندارم.']],
    listen:{text:'Hallo Sara! Am Montag arbeite ich von acht bis vier Uhr. Ich habe keine Zeit. Am Freitag habe ich Zeit. Wir treffen uns um zehn Uhr.',fa:'سلام سارا! دوشنبه از هشت تا چهار کار می‌کنم. وقت ندارم. جمعه وقت دارم. ساعت ده همدیگر را می‌بینیم.',question:'قرار چه زمانی است؟',choices:['دوشنبه ساعت هشت','جمعه ساعت چهار','جمعه ساعت ده'],correct:2,why:'هشت تا چهار زمان کار دوشنبه است؛ روز و ساعت قرار در دو جمله پایانی آمده‌اند.'},
    read:{text:'Hallo Ben! Ich lerne am Dienstag Deutsch. Der Kurs beginnt um neun Uhr. Am Mittwoch habe ich Zeit. Wir treffen uns am Mittwoch um elf Uhr.',fa:'سلام بِن! سه‌شنبه آلمانی یاد می‌گیرم. کلاس ساعت نه شروع می‌شود. چهارشنبه وقت دارم. چهارشنبه ساعت یازده همدیگر را می‌بینیم.',question:'زمان دیدار چه موقع است، نه زمان کلاس؟',choices:['چهارشنبه ساعت یازده','سه‌شنبه ساعت نه','چهارشنبه ساعت نه'],correct:0,why:'جمله آخر زمان دیدار را مشخص می‌کند؛ نه، ساعت شروع کلاس سه‌شنبه است.'},
    write:{prompt:'دو جمله بنویسید: «جمعه وقت دارم. ساعت ده همدیگر را می‌بینیم.» جمله اول با Am Freitag و دوم با Wir treffen شروع شود؛ عدد به حروف.',answers:['Am Freitag habe ich Zeit. Wir treffen uns um zehn Uhr.'],hint:'Am Freitag habe ich Zeit. سپس Wir treffen uns um … Uhr.',why:'در جمله اول پس از عبارت زمانی فعل habe می‌آید؛ در جمله دوم uns و um را فراموش نکنید.'},
    mission:{prompt:'قرار تازه: دوشنبه وقت دارید و ساعت نه دیدار می‌کنید. دو جمله به ترتیب با Am Montag و Wir treffen بنویسید؛ عدد به حروف.',answers:['Am Montag habe ich Zeit. Wir treffen uns um neun Uhr.'],hint:'الگوی پیام قبلی را با Montag و neun به کار ببرید.',why:'روز و ساعت تازه باید جایگزین شوند؛ پیام درباره وقت آزاد و سپس قرار است.'},
  },
  {
    id:'de-skills-order',title:'سفارش را درست بفهمیم',goal:'جزئیات سفارش را تشخیص می‌دهم و درخواست دو بخشی می‌نویسم.',
    situation:'دو نفر نوشیدنی‌های متفاوت می‌خواهند. باید سفارش هر نفر و خواسته او درباره شیر یا شکر را جدا کنید.',
    pattern:'با mit و ohne جزئیات سفارش عوض می‌شوند. قبل از نوشتن، چک کنید چه کسی چه می‌خواهد. یک درخواست مؤدبانه می‌تواند از یک جمله و یک عبارت کوتاه تشکیل شود.',
    sound:'هنگام شنیدن روی نام شخص، نوشیدنی و ohne تمرکز کنید؛ تفاوت Kaffee و Tee را واضح بشنوید.',
    dialogue:[['Was möchten Sie?','چه میل دارید؟'],['Ich möchte einen Kaffee, bitte.','یک قهوه می‌خواهم، لطفاً.'],['Mit Milch?','با شیر؟'],['Ja, aber ohne Zucker.','بله، اما بدون شکر.']],
    examples:[['Ich möchte einen Kaffee, bitte.','یک قهوه می‌خواهم، لطفاً.'],['Ohne Zucker, bitte.','بدون شکر، لطفاً.'],['Mit Milch, bitte.','با شیر، لطفاً.']],
    listen:{text:'Ben möchte einen Kaffee mit Milch. Sara möchte einen Tee ohne Zucker. Der Kaffee kostet drei Euro. Der Tee kostet zwei Euro. Beide bezahlen bar.',fa:'بِن یک قهوه با شیر می‌خواهد. سارا یک چای بدون شکر می‌خواهد. قهوه سه یورو قیمت دارد. چای دو یورو است. هر دو نقدی پرداخت می‌کنند.',question:'سارا چه سفارشی دارد؟',choices:['قهوه با شیر','چای بدون شکر','آب بدون شکر'],correct:1,why:'سفارش سارا در جمله دوم است؛ قهوه مربوط به بِن است.'},
    read:{text:'Hallo! Ich möchte ein Wasser und einen Kaffee, bitte. Den Kaffee bitte ohne Milch. Ich bezahle mit Karte. Meine Schwester möchte einen Tee mit Zucker.',fa:'سلام! یک آب و یک قهوه می‌خواهم، لطفاً. قهوه لطفاً بدون شیر باشد. با کارت پرداخت می‌کنم. خواهرم یک چای با شکر می‌خواهد.',question:'گوینده چگونه پرداخت می‌کند؟',choices:['نقدی','پرداخت نمی‌کند','با کارت'],correct:2,why:'Ich bezahle mit Karte روش پرداخت را مشخص می‌کند؛ بقیه جمله‌ها درباره سفارش‌اند.'},
    write:{prompt:'در دو بخش سفارش بدهید: «یک قهوه می‌خواهم، لطفاً. بدون شکر، لطفاً.» اول با Ich möchte و بعد با Ohne شروع کنید.',answers:['Ich möchte einen Kaffee, bitte. Ohne Zucker, bitte.','Ich möchte bitte einen Kaffee. Ohne Zucker, bitte.'],hint:'بخش اول einen Kaffee دارد؛ بخش دوم Ohne Zucker, bitte است.',why:'دو نکته را چک کنید: Kaffee در این جمله einen می‌گیرد؛ ohne به معنی بدون است، نه با.'},
    mission:{prompt:'در دو بخش سفارش بدهید: «یک چای می‌خواهم، لطفاً. بدون شکر، لطفاً.» اول با Ich möchte و بعد با Ohne شروع کنید.',answers:['Ich möchte einen Tee, bitte. Ohne Zucker, bitte.','Ich möchte bitte einen Tee. Ohne Zucker, bitte.'],hint:'Tee هم مذکر است؛ در مفعول einen Tee می‌آید.',why:'نوع نوشیدنی عوض شده، اما لحن مؤدبانه و خواسته بدون شکر حفظ می‌شوند.'},
  },
  {
    id:'de-skills-bag',title:'پیام برای پیدا کردن کیف',goal:'جزئیات یک مشکل را می‌فهمم و پیام کمک کوتاه می‌نویسم.',
    situation:'شخصی وسیله‌ای را پیدا نمی‌کند. از پیام او باید بفهمید کدام وسیله گم شده، نه اینکه صرفاً اولین اسم را انتخاب کنید.',
    pattern:'nicht می‌تواند معنای جمله را عوض کند. در Ich finde meine Tasche nicht، مشکل پیدا‌نکردن کیف است. درخواست رسمی کمک با Können Sie mir helfen? می‌آید.',
    sound:'به nicht و nein در پیام دقت کنید. مکث بین بیان مشکل و درخواست کمک، فهم شنونده را آسان‌تر می‌کند.',
    dialogue:[['Was suchst du?','دنبال چه می‌گردی؟'],['Ich finde meine Tasche nicht.','کیفم را پیدا نمی‌کنم.'],['Dein Handy ist hier.','تلفن همراهت اینجاست.'],['Danke. Aber ich suche meine Tasche.','ممنون. اما دنبال کیفم می‌گردم.']],
    examples:[['Ich finde meine Tasche nicht.','کیفم را پیدا نمی‌کنم.'],['Können Sie mir helfen?','می‌توانید به من کمک کنید؟'],['Mein Handy ist hier.','تلفن همراهم اینجاست.']],
    listen:{text:'Hallo! Ich bin im Kurs. Mein Handy ist hier. Mein Stift ist auch hier. Aber ich finde meine Tasche nicht. Können Sie mir bitte helfen?',fa:'سلام! من در کلاس هستم. تلفن همراهم اینجاست. خودکارم هم اینجاست. اما کیفم را پیدا نمی‌کنم. می‌توانید به من کمک کنید، لطفاً؟',question:'گوینده کدام وسیله را پیدا نمی‌کند؟',choices:['کیف','خودکار','تلفن همراه'],correct:0,why:'Handy و Stift اینجا هستند؛ جمله منفی فقط درباره Tasche است.'},
    read:{text:'Hallo Nora! Deine Tasche ist im Büro. Dein Handy ist neben der Tasche. Ich arbeite heute bis vier Uhr. Am Abend habe ich Zeit. Bis bald!',fa:'سلام نورا! کیفت در دفتر است. تلفن همراهت کنار کیف است. امروز تا ساعت چهار کار می‌کنم. عصر وقت دارم. به‌زودی می‌بینمت!',question:'طبق پیام کیف کجاست؟',choices:['در قطار','در دفتر','در کافه'],correct:1,why:'جمله دوم، Deine Tasche ist im Büro، محل کیف را صریح می‌گوید.'},
    write:{prompt:'پیام رسمی دو جمله‌ای بنویسید: «کیفم را پیدا نمی‌کنم. می‌توانید به من کمک کنید؟» اول با Ich finde و دوم با Können Sie شروع کنید.',answers:['Ich finde meine Tasche nicht. Können Sie mir helfen?','Ich finde meine Tasche nicht. Können Sie mir bitte helfen?'],hint:'کیفم = meine Tasche؛ درخواست کمک از mir استفاده می‌کند.',why:'پیام خوب ابتدا مشکل مشخص را می‌گوید و سپس کمک می‌خواهد؛ mir را با mich عوض نکنید.'},
    mission:{prompt:'این بار تلفن همراه را پیدا نمی‌کنید. دو جمله بنویسید: «تلفن همراهم را پیدا نمی‌کنم. می‌توانید به من کمک کنید؟» با Ich finde و Können Sie.',answers:['Ich finde mein Handy nicht. Können Sie mir helfen?','Ich finde mein Handy nicht. Können Sie mir bitte helfen?'],hint:'تلفن همراهم = mein Handy.',why:'اسم تازه Handy خنثی است؛ mein جای meine را می‌گیرد.'},
  },
  {
    id:'de-skills-visit',title:'دیدار در محله تازه',goal:'نشانی نسبی و زمان را از یک پیام کوتاه جدا می‌کنم.',
    situation:'دوستتان درباره محله و برنامه دیدار نوشته است. فقط اطلاعات لازم برای رسیدن به مقصد را پیدا می‌کنید.',
    pattern:'متن کوتاه ممکن است هم درباره مکان باشد و هم زمان. سؤال را اول بخوانید: «کجا؟» با «چه ساعتی؟» یکی نیست. im یعنی in dem؛ برای کنار یک مکان ثابت، neben dem به کار می‌رود.',
    sound:'در شنیدن، جمله حاوی مکان را از جمله حاوی um جدا کنید. برای مکان دنبال اسم ساختمان و برای زمان دنبال Uhr باشید.',
    dialogue:[['Wo ist die Bäckerei?','نانوایی کجاست؟'],['Die Bäckerei ist neben dem Supermarkt.','نانوایی کنار سوپرمارکت است.'],['Wann treffen wir uns?','چه زمانی همدیگر را می‌بینیم؟'],['Um zehn Uhr.','ساعت ده.']],
    examples:[['Ich wohne in Bonn.','من در بُن زندگی می‌کنم.'],['Die Bäckerei ist neben dem Supermarkt.','نانوایی کنار سوپرمارکت است.'],['Wir treffen uns um zehn Uhr.','ساعت ده همدیگر را می‌بینیم.']],
    listen:{text:'Hallo Ben! Ich wohne in Bonn. Hier gibt es einen Supermarkt und eine Bäckerei. Die Bäckerei ist neben dem Supermarkt. Wir treffen uns am Samstag um zehn Uhr.',fa:'سلام بِن! من در بُن زندگی می‌کنم. اینجا یک سوپرمارکت و یک نانوایی هست. نانوایی کنار سوپرمارکت است. شنبه ساعت ده همدیگر را می‌بینیم.',question:'نانوایی کجاست؟',choices:['کنار ایستگاه','داخل خانه','کنار سوپرمارکت'],correct:2,why:'neben dem Supermarkt مکان را نشان می‌دهد؛ Samstag و zehn Uhr به زمان دیدار مربوط‌اند.'},
    read:{text:'Hallo Sara! Ich arbeite am Montag im Büro. Am Freitag habe ich Zeit. Wir treffen uns um elf Uhr. Die Apotheke ist neben dem Supermarkt. Bis Freitag!',fa:'سلام سارا! دوشنبه در دفتر کار می‌کنم. جمعه وقت دارم. ساعت یازده همدیگر را می‌بینیم. داروخانه کنار سوپرمارکت است. تا جمعه!',question:'دیدار چه روز و ساعتی است؟',choices:['جمعه ساعت یازده','دوشنبه ساعت یازده','جمعه ساعت ده'],correct:0,why:'جمعه روز وقت آزاد است و جمله بعد ساعت یازده را تعیین می‌کند؛ دوشنبه روز کار است.'},
    write:{prompt:'دو جمله بنویسید: «من در بُن زندگی می‌کنم. ساعت ده همدیگر را می‌بینیم.» به ترتیب با Ich wohne و Wir treffen شروع کنید؛ عدد به حروف.',answers:['Ich wohne in Bonn. Wir treffen uns um zehn Uhr.'],hint:'شهر بعد از in و ساعت بعد از um می‌آید.',why:'پیام شامل دو اطلاعات مستقل است: محل زندگی و ساعت دیدار. جای in و um را بررسی کنید.'},
    mission:{prompt:'پیام تازه: «من در برلین زندگی می‌کنم. ساعت یازده همدیگر را می‌بینیم.» با Ich wohne و Wir treffen و عدد به حروف بنویسید.',answers:['Ich wohne in Berlin. Wir treffen uns um elf Uhr.'],hint:'برلین = Berlin؛ یازده = elf.',why:'الگوی پیام ثابت است ولی شهر و ساعت باید مطابق درخواست تازه باشند.'},
  },
];
const choice=(s:SkillsLesson,task:TextTask,reading:boolean):ChoiceExercise=>({
  id:`${s.id}-${reading?'read':'listen'}`,objectiveId:`${s.id}-goal`,kind:'choice',skill:reading?'reading':'listening',
  ...(reading?{readingText:task.text}:{audioText:task.text,transcriptFa:task.fa}),
  promptFa:task.question,choices:task.choices.map((label,i)=>({id:`c${i}`,label})),correctChoice:`c${task.correct}`,explanationFa:task.why,
});
const writing=(s:SkillsLesson,mission:boolean):WriteExercise=>{
  const t=mission?s.mission:s.write;
  return {id:`${s.id}-${mission?'mission':'write'}`,objectiveId:`${s.id}-goal`,kind:'write',skill:'writing',promptFa:t.prompt,acceptedAnswers:t.answers,sample:t.answers[0],hintFa:t.hint,explanationFa:t.why,
    taskNoteFa:'این پیام کوتاه مقید به اطلاعات و آغاز جمله‌های خواسته‌شده است. بررسی فقط با الگوهای تعریف‌شده انجام می‌شود؛ جمله درست دیگری ممکن است پذیرفته نشود. بزرگی حروف و نشانه‌گذاری فعلاً نمره ندارند؛ بعد از پاسخ، خودتان آن‌ها را با نمونه مقایسه کنید.'};
};
const lessons:GuidedLesson[]=specs.map((s,i)=>({id:s.id,title:s.title,canDoFa:s.goal,objectiveIds:[`${s.id}-goal`],prerequisiteIds:i?[specs[i-1].id]:[],situationFa:s.situation,patternFa:s.pattern,pronunciationFa:s.sound,dialogue:s.dialogue.map(([text,fa],j)=>({speaker:j%2?'شما':'همراه',text,fa})),examples:s.examples.map(([text,fa])=>({text,fa})),exercises:[choice(s,s.listen,false),choice(s,s.read,true),writing(s,false)]}));
export const SKILLS_UNIT:LearningUnit={id:'de-a1-skills',version:1,language:'de',level:'A1',title:'تقویت مهارت‌ها: متن و پیام',objectives:specs.map(s=>({id:`${s.id}-goal`,canDoFa:s.goal})),lessons,mission:specs.map(s=>writing(s,true)),oralMissionFa:'بدون خواندن نمونه، یکی از پیام‌ها را برای یک دوست بازگو کنید. سپس با تغییر شهر، ساعت یا وسیله، پیام خودتان را بگویید. آیا اطلاعات اصلی روشن بود؟ گفتار در این ابزار خودکار ارزیابی نمی‌شود.'};
