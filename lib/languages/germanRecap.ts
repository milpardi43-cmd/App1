import type { LearningUnit } from './learningDesign';
import type { UnitAttempt } from './unitProgress';

/** A separate, optional practice assessment, NOT a ninth teaching unit or CEFR certification. */
export const A1_RECAP: LearningUnit = {
  id:'de-a1-recap',version:1,language:'de',level:'A1',title:'جمع‌بندی مقدماتی A1',lessons:[],
  objectives:[
    {id:'recap-meeting',canDoFa:'نام فرد ناآشنا را مؤدبانه بپرسم.'},
    {id:'recap-family',canDoFa:'اطلاعات ساده خانواده را از متن بفهمم.'},
    {id:'recap-time',canDoFa:'روز و ساعت قرار را از صدا تشخیص بدهم.'},
    {id:'recap-shopping',canDoFa:'یک نوشیدنی را مؤدبانه سفارش بدهم.'},
    {id:'recap-home',canDoFa:'مکان یک ساختمان را از متن بفهمم.'},
    {id:'recap-work',canDoFa:'برنامه عصر را با ترتیب درست جمله بیان کنم.'},
    {id:'recap-transport',canDoFa:'زمان حرکت قطار را از صدا بفهمم.'},
    {id:'recap-needs',canDoFa:'وقتی مشکلی دارم، کمک بخواهم.'},
  ],
  mission:[
    {id:'recap-meeting-q',objectiveId:'recap-meeting',skill:'writing',kind:'write',promptFa:'در برخورد رسمی از یک فرد ناآشنا بپرسید: «نام شما چیست؟»',acceptedAnswers:['Wie heißen Sie?','Wie ist Ihr Name?','Was ist Ihr Name?'],sample:'Wie heißen Sie?',hintFa:'از Sie یا Ihr رسمی استفاده کنید.',explanationFa:'Wie heißen Sie? پرسش رسمی نام است؛ du خطاب دوستانه است.'},
    {id:'recap-family-q',objectiveId:'recap-family',skill:'reading',kind:'choice',promptFa:'متن را بخوانید: «Anna hat eine Schwester. Sie heißt Mia.» نام خواهر آنا چیست؟',choices:[{id:'anna',label:'Anna'},{id:'mia',label:'Mia'},{id:'nora',label:'Nora'}],correctChoice:'mia',explanationFa:'جمله دوم درباره خواهری است که در جمله اول معرفی شد؛ نام او Mia است.'},
    {id:'recap-time-q',objectiveId:'recap-time',skill:'listening',kind:'choice',audioText:'Wir treffen uns am Freitag um zehn Uhr.',transcriptFa:'جمعه ساعت ده همدیگر را می‌بینیم.',promptFa:'قرار چه روز و چه ساعتی است؟',choices:[{id:'a',label:'دوشنبه ساعت ده'},{id:'b',label:'جمعه ساعت نه'},{id:'c',label:'جمعه ساعت ده'}],correctChoice:'c',explanationFa:'am Freitag روز جمعه و um zehn Uhr ساعت ده را مشخص می‌کند.'},
    {id:'recap-shopping-q',objectiveId:'recap-shopping',skill:'writing',kind:'write',promptFa:'در کافه با Ich möchte و bitte یک آب سفارش بدهید.',acceptedAnswers:['Ich möchte ein Wasser, bitte.','Ich möchte bitte ein Wasser.'],sample:'Ich möchte ein Wasser, bitte.',hintFa:'آب = das Wasser؛ در سفارش ein Wasser.',explanationFa:'Ich möchte درخواست مؤدبانه است و Wasser در این سفارش ein می‌گیرد.'},
    {id:'recap-home-q',objectiveId:'recap-home',skill:'reading',kind:'choice',promptFa:'متن را بخوانید: «Die Bäckerei ist neben dem Supermarkt.» نانوایی کجاست؟',choices:[{id:'a',label:'کنار سوپرمارکت'},{id:'b',label:'داخل ایستگاه'},{id:'c',label:'کنار خانه'}],correctChoice:'a',explanationFa:'neben dem Supermarkt یعنی کنار سوپرمارکت؛ متن مکان ثابت را توصیف می‌کند.'},
    {id:'recap-work-q',objectiveId:'recap-work',skill:'writing',kind:'write',promptFa:'با Am Abend شروع کنید: «عصر آلمانی یاد می‌گیرم.»',acceptedAnswers:['Am Abend lerne ich Deutsch.'],sample:'Am Abend lerne ich Deutsch.',hintFa:'بعد از Am Abend، فعل lerne و سپس ich می‌آید.',explanationFa:'وقتی بخش زمانی اول است، فعل صرف‌شده همچنان در جایگاه دوم قرار دارد.'},
    {id:'recap-transport-q',objectiveId:'recap-transport',skill:'listening',kind:'choice',audioText:'Der Zug fährt um acht Uhr ab.',transcriptFa:'قطار ساعت هشت حرکت می‌کند.',promptFa:'قطار چه ساعتی حرکت می‌کند؟',choices:[{id:'a',label:'نه'},{id:'b',label:'هشت'},{id:'c',label:'یازده'}],correctChoice:'b',explanationFa:'um acht Uhr یعنی ساعت هشت؛ fährt … ab زمان حرکت را بیان می‌کند.'},
    {id:'recap-needs-q',objectiveId:'recap-needs',skill:'writing',kind:'write',promptFa:'از یک فرد ناآشنا با Können Sie بپرسید: «می‌توانید به من کمک کنید؟»',acceptedAnswers:['Können Sie mir helfen?','Können Sie mir bitte helfen?'],sample:'Können Sie mir helfen?',hintFa:'به من = mir؛ فعل پایانی = helfen.',explanationFa:'در این درخواست رسمی، helfen با mir به کار می‌رود.'},
  ],
  oralMissionFa:'یک موقعیت خیالی بسازید: خودتان را معرفی کنید، درباره خانواده و برنامه روزانه دو جمله بگویید، نوشیدنی سفارش بدهید و برای پیدا کردن مسیر کمک بخواهید. بدون متن اجرا کنید؛ توانایی گفتار در این ابزار نمره‌گذاری نمی‌شود.',
};
export const RECAP_TARGETS: Record<string,{unitId:string;lessonId:string}> = {
  'recap-meeting':{unitId:'de-a1-first-meeting',lessonId:'de-meeting-register'},
  'recap-family':{unitId:'de-a1-family',lessonId:'de-family-names'},
  'recap-time':{unitId:'de-a1-time',lessonId:'de-time-agree'},
  'recap-shopping':{unitId:'de-a1-shopping',lessonId:'de-shopping-order'},
  'recap-home':{unitId:'de-a1-home',lessonId:'de-home-location'},
  'recap-work':{unitId:'de-a1-work',lessonId:'de-work-evening'},
  'recap-transport':{unitId:'de-a1-transport',lessonId:'de-transport-departure'},
  'recap-needs':{unitId:'de-a1-needs',lessonId:'de-needs-help'},
};
export function recapRepairs(attempt: UnitAttempt) {
  return A1_RECAP.mission.filter(e=>{
    const r=attempt.results.find(r=>r.exerciseId===e.id);
    return !r?.correct || r.assisted;
  }).map(e=>({exercise:e,...RECAP_TARGETS[e.objectiveId]}));
}
