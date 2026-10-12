import type { LearningExercise, LearningUnit } from './learningDesign';
type Target={unitId:string;lessonId:string};
export const LEVEL_EXAM_TARGETS:Record<string,Target>={};
type Item={target:Target;goal:string;task:LearningExercise};
const target=(unitId:string,lessonId:string):Target=>({unitId,lessonId});
const choice=(skill:'reading'|'listening',text:string,promptFa:string,labels:string[],correct:number,explanationFa:string,transcriptFa?:string):LearningExercise=>({id:'',objectiveId:'',skill,kind:'choice',promptFa,explanationFa,...(skill==='reading'?{readingText:text}:{audioText:text,transcriptFa}),choices:labels.map((label,i)=>({id:`c${i}`,label})),correctChoice:`c${correct}`});
const write=(promptFa:string,answer:string,explanationFa:string):LearningExercise=>({id:'',objectiveId:'',skill:'writing',kind:'write',promptFa,acceptedAnswers:[answer],sample:answer,hintFa:'به الگوی درس مرتبط برگردید و با اطلاعات تازه پاسخ دهید.',explanationFa,taskNoteFa:'پاسخ کوتاه الگویی؛ نوشته آزاد جداگانه در کارگاه بازبینی می‌شود.'});
function exam(id:string,title:string,level:LearningUnit['level'],items:Item[]):LearningUnit{
 return {id,title,level,language:'de',version:1,lessons:[],oralMissionFa:'پس از سنجش کتبی، گفت‌وگوی دونفره و نوشتن آزاد را در کارگاه انجام دهید. این نمره شامل تلفظ، روانی یا کیفیت نوشتن آزاد نیست.',objectives:items.map((x,i)=>{const key=`${id}-goal-${i}`;LEVEL_EXAM_TARGETS[key]=x.target;return {id:key,canDoFa:x.goal};}),mission:items.map((x,i)=>({...x.task,id:`${id}-q-${i}`,objectiveId:`${id}-goal-${i}`}))};
}
const item=(unit:string,lesson:string,goal:string,task:LearningExercise):Item=>({target:target(unit,lesson),goal,task});
export const FOUNDATION_EXAM=exam('de-zero-final','سنجش پایان مقدماتی','Pre-A1',[
 item('de-zero-sounds','de-zero-alphabet','نام هجی‌شده را تشخیص می‌دهم.',choice('listening','N, I, N, A.','نام کدام است؟',['Nina','Nora','Mina'],0,'ترتیب N I N A نام Nina را می‌سازد.','N، I، N، A.')),
 item('de-zero-sounds','de-zero-vowels','طول واکه را تشخیص می‌دهم.',choice('listening','Staat','کدام واژه شنیده شد؟',['Stadt','Staat'],1,'صدای a بلند است؛ Staat با Stadt فرق دارد.','کشور/حکومت')),
 item('de-zero-sounds','de-zero-umlaut','حرف ویژه را حفظ می‌کنم.',choice('reading','Grün ist meine Lieblingsfarbe.','کدام حرف ویژه در Grün وجود دارد؟',['ö','ü','ä'],1,'حرف ü با u ساده یکسان نیست.')),
 item('de-zero-sounds','de-zero-combinations','ترکیب حروف را می‌خوانم.',choice('reading','sie / mein / neun','کدام واژه ei دارد؟',['sie','mein','neun'],1,'mein دارای ei است.')),
 item('de-zero-sounds','de-zero-stress','عبارت خداحافظی را می‌فهمم.',choice('listening','Auf Wiedersehen!','کاربرد عبارت چیست؟',['سلام صبحگاهی','خداحافظی','درخواست کمک'],1,'عبارت پایان دیدار است.','خداحافظ!')),
 item('de-zero-start','de-zero-numbers','عدد آغازین را می‌نویسم.',write('عدد 18 را با حروف آلمانی بنویسید.','achtzehn','acht + zehn برابر هجده است.')),
 item('de-zero-start','de-zero-nouns','اسم و حرف تعریف را می‌شناسم.',write('«در» را با حرف تعریف معین بنویسید.','die Tür','Tür با die یاد گرفته می‌شود.')),
 item('de-zero-start','de-zero-person','فعل بودن را صرف می‌کنم.',write('با Du بنویسید: تو تیم هستی.','Du bist Tim.','sein برای du به bist تبدیل می‌شود.')),
 item('de-zero-start','de-zero-questions','پرسش مکان زندگی را می‌فهمم.',choice('reading','Wo wohnst du?','پرسش درباره چیست؟',['نام','شهر یا محل زندگی','سن'],1,'Wo یعنی کجا.')),
 item('de-zero-start','de-zero-classroom','درخواست آهسته‌گویی می‌کنم.',write('با Langsam درخواست کوتاه «آهسته، لطفاً» بنویسید.','Langsam, bitte.','درخواست روشن و مؤدبانه است.')),
]);
export const A1_FINAL_EXAM=exam('de-a1-final','سنجش جامع پایان A1','A1',[
 item('de-a1-first-meeting','de-meeting-name','نام را از معرفی می‌گیرم.',choice('listening','Guten Tag. Ich heiße Nora Klein.','نام کوچک چیست؟',['Klein','Nora','Guten'],1,'Nora نام کوچک است.','روز بخیر. اسمم نورا کلاین است.')),
 item('de-a1-first-meeting','de-meeting-repeat','درخواست تکرار می‌کنم.',write('با Noch einmal درخواست تکرار کنید.','Noch einmal, bitte.','bitte درخواست را مؤدبانه می‌کند.')),
 item('de-a1-family','de-family-people','رابطه خانوادگی را می‌فهمم.',choice('reading','Tim hat eine Schwester. Sie heißt Eva. Eva hat zwei Kinder.','اوا چه نسبتی با تیم دارد؟',['خواهر','مادر','دختر'],0,'eine Schwester خواهر را مشخص می‌کند.')),
 item('de-a1-family','de-family-siblings','داشتن عضو خانواده را بیان می‌کنم.',write('با Ich habe بنویسید: یک برادر دارم.','Ich habe einen Bruder.','Bruder مذکر است؛ مفعول einen Bruder می‌آید.')),
 item('de-a1-time','de-time-agree','زمان قرار را تشخیص می‌دهم.',choice('listening','Der Kurs beginnt um elf Uhr. Bitte kommen Sie um zehn Uhr fünfzig.','کلاس چه ساعتی شروع می‌شود؟',['۱۰:۵۰','۱۱:۰۰','۱۱:۵۰'],1,'۱۱ آغاز کلاس و ۱۰:۵۰ زمان پیشنهادی ورود است.','کلاس یازده شروع می‌شود. لطفاً ده‌وپنجاه بیایید.')),
 item('de-a1-time','de-time-week','روزهای هفته را می‌فهمم.',choice('reading','Am Mittwoch habe ich Zeit. Am Dienstag arbeite ich.','چه روزی وقت دارد؟',['سه‌شنبه','چهارشنبه','پنجشنبه'],1,'Mittwoch چهارشنبه است.')),
 item('de-a1-shopping','de-shopping-order','سفارش مؤدبانه می‌دهم.',write('با Ich möchte بنویسید: یک قهوه می‌خواهم.','Ich möchte einen Kaffee.','Kaffee در این الگو مفعول مذکر است.')),
 item('de-a1-shopping','de-shopping-price','مبلغ را می‌فهمم.',choice('listening','Das Brot kostet zwei Euro dreißig.','قیمت چقدر است؟',['2,13 €','2,30 €','3,20 €'],1,'zwei Euro dreißig برابر ۲٫۳۰ است.','نان دو یورو و سی سنت است.')),
 item('de-a1-home','de-home-rooms','اتاق را تشخیص می‌دهم.',choice('reading','In der Küche kochen wir. Im Schlafzimmer schlafen wir.','آشپزی کجا انجام می‌شود؟',['آشپزخانه','اتاق خواب','حمام'],0,'Küche یعنی آشپزخانه.')),
 item('de-a1-home','de-home-location','مکان را نسبت به ساختمان می‌فهمم.',choice('listening','Die Apotheke ist neben dem Bahnhof.','داروخانه کنار چیست؟',['بانک','ایستگاه','مدرسه'],1,'neben dem Bahnhof یعنی کنار ایستگاه.','داروخانه کنار ایستگاه است.')),
 item('de-a1-work','de-work-job','شغل را بیان می‌کنم.',write('با Ich arbeite بنویسید: به‌عنوان معلم کار می‌کنم (مرد).','Ich arbeite als Lehrer.','پس از als نام شغل می‌آید.')),
 item('de-a1-work','de-work-hours','بازه ساعت کاری را می‌فهمم.',choice('reading','Arbeitszeit: 8–16 Uhr. Pause: 12–13 Uhr.','کار چه ساعتی تمام می‌شود؟',['۱۲','۱۳','۱۶'],2,'۱۶ پایان بازه کاری است.')),
 item('de-a1-transport','de-transport-ticket','بلیت درخواست می‌کنم.',write('با Eine Fahrkarte درخواست کنید: یک بلیت به برلین لطفاً.','Eine Fahrkarte nach Berlin, bitte.','برای مقصد شهر از nach استفاده می‌کنیم.')),
 item('de-a1-transport','de-transport-transfer','تعویض وسیله را می‌فهمم.',choice('listening','Fahren Sie mit der Linie drei. Am Markt steigen Sie in die Linie fünf um.','در میدان بازار باید سوار کدام خط شود؟',['۳','۵','۸'],1,'خط پنج پس از تعویض است.','با خط سه بروید. در بازار به خط پنج تغییر دهید.')),
 item('de-a1-needs','de-needs-find','شیء گمشده را تشخیص می‌دهم.',choice('reading','Ich suche meinen Schlüssel. Meine Tasche habe ich hier.','چه چیزی گم شده؟',['کیف','کلید','گوشی'],1,'Schlüssel مورد جست‌وجوست؛ کیف موجود است.')),
 item('de-a1-needs','de-needs-object','نیاز را بیان می‌کنم.',write('با Ich brauche بنویسید: آب لازم دارم.','Ich brauche Wasser.','Wasser در این درخواست بدون حرف تعریف آمده است.')),
 item('de-a1-skills','de-skills-plan','جزئیات تغییر قرار را می‌خوانم.',choice('reading','Hallo Eva, wir treffen uns um 18 Uhr vor dem Kino. Das Café ist heute geschlossen. Bis später!','قرار کدام است؟',['۱۸ جلوی سینما','۱۸ داخل کافه','۸ جلوی سینما'],0,'زمان و مکان جدید هر دو در متن هستند.')),
 item('de-a1-skills','de-skills-class','پیام کوتاه اطلاعاتی می‌نویسم.',write('با Ich komme بنویسید: ساعت شش می‌آیم. عدد را به حروف بنویسید.','Ich komme um sechs Uhr.','برای ساعت از um استفاده می‌کنیم.')),
 item('de-a1-contact','de-contact-address','نشانی را از اطلاعات فرم جدا می‌کنم.',choice('reading','Nora Klein, Lindenstraße 9, 53111 Bonn.','پلاک ساختمان کدام است؟',['53111','9','11'],1,'۹ پس از نام خیابان پلاک است.')),
 item('de-a1-contact','de-contact-phone','شماره کوتاه را می‌شنوم.',choice('listening','null, acht, drei, sieben, zwei','ترتیب شماره تمرینی کدام است؟',['08372','08732','80372'],0,'ارقام به ترتیب صفر هشت سه هفت دو هستند.','صفر، هشت، سه، هفت، دو.')),
 item('de-a1-calendar','de-calendar-clock','نیم‌ساعت آلمانی را می‌فهمم.',choice('listening','Wir beginnen um halb acht.','شروع چه ساعتی است؟',['۸:۳۰','۷:۳۰','۷:۱۵'],1,'halb acht نیم ساعت مانده به هشت است.','ساعت هفت‌ونیم شروع می‌کنیم.')),
 item('de-a1-calendar','de-calendar-date','تاریخ را می‌خوانم.',choice('reading','Termin: 14.09.2026, 15 Uhr.','قرار چه تاریخی است؟',['چهاردهم سپتامبر','نهم آوریل','پانزدهم سپتامبر'],0,'۱۴ روز و ۰۹ ماه است.')),
 item('de-a1-interests','de-interest-weather','هوا و برنامه را مرتبط می‌کنم.',choice('listening','Heute regnet es. Wir bleiben zu Hause. Morgen gehen wir in den Park.','امروز کجا می‌مانند؟',['پارک','خانه','مدرسه'],1,'Heute با bleiben zu Hause آمده است.','امروز باران می‌بارد. خانه می‌مانیم. فردا به پارک می‌رویم.')),
 item('de-a1-interests','de-interest-hobby','علاقه را می‌گویم.',write('با Ich بنویسید: شناکردن را دوست دارم. از gern استفاده کنید.','Ich schwimme gern.','gern علاقه به انجام فعل را نشان می‌دهد.')),
 item('de-a1-grammar','de-grammar-questions','اسم را نفی می‌کنم.',write('با Ich habe بنویسید: دوچرخه ندارم.','Ich habe kein Fahrrad.','das Fahrrad با kein نفی می‌شود.')),
 item('de-a1-grammar','de-grammar-person','صرف فعل را می‌شناسم.',choice('reading','Wir ___ Deutsch.','کدام شکل درست است؟',['lerne','lernt','lernen'],2,'با wir شکل lernen می‌آید.')),
 item('de-a1-real-life','de-real-notice','ساعت کار را می‌فهمم.',choice('reading','Montag–Freitag 10–18 Uhr. Samstag 10–14 Uhr.','شنبه ساعت ۱۵ فروشگاه چگونه است؟',['باز','بسته','مشخص نیست'],1,'شنبه در ۱۴ بسته می‌شود.')),
 item('de-a1-real-life','de-real-health','درخواست وقت را می‌فهمم.',choice('listening','Ich brauche heute einen Termin. Morgen kann ich nicht kommen.','وقت را برای چه زمانی می‌خواهد؟',['امروز','فردا','هفته بعد'],0,'heute زمان درخواست است.','امروز وقت می‌خواهم. فردا نمی‌توانم بیایم.')),
 item('de-a1-core-verbs','de-core-separable','فعل جداشدنی را می‌سازم.',write('با Ich بنویسید: ساعت هشت بیدار می‌شوم. عدد به حروف باشد.','Ich stehe um acht Uhr auf.','auf در پایان جمله است.')),
 item('de-a1-core-verbs','de-core-permission','ممنوعیت را از اجبار جدا می‌کنم.',choice('reading','Sie dürfen hier nicht fotografieren.','معنی چیست؟',['عکس لازم نیست','عکس ممنوع است','عکس ضروری است'],1,'nicht dürfen یعنی اجازه ندارید.')),
 item('de-a1-services','de-service-hotel','مدت اقامت را می‌شنوم.',choice('listening','Ich möchte ein Zimmer für drei Nächte.','چند شب می‌خواهد؟',['۲','۳','۴'],1,'drei Nächte یعنی سه شب.','یک اتاق برای سه شب می‌خواهم.')),
 item('de-a1-services','de-service-return','مشکل خرید را بیان می‌کنم.',write('با Die Schuhe بنویسید: کفش‌ها خیلی بزرگ‌اند.','Die Schuhe sind zu groß.','Schuhe جمع است و sind می‌گیرد.')),
 item('de-a1-together','de-social-email','درخواست اطلاعات کوتاه می‌نویسم.',write('با Haben Sie بپرسید: کلاس عصر دارید؟','Haben Sie einen Abendkurs?','سؤال رسمی و مفعول مذکر einen Abendkurs است.')),
 item('de-a1-together','de-social-invite','دعوت و زمان جایگزین را می‌فهمم.',choice('listening','Am Freitag habe ich keine Zeit. Treffen wir uns am Samstag um vier?','پیشنهاد جدید چیست؟',['جمعه چهار','شنبه چهار','شنبه پنج'],1,'Samstag um vier پیشنهاد جدید است.','جمعه وقت ندارم. شنبه ساعت چهار همدیگر را ببینیم؟')),
]);
export const LEVEL_EXAMS=[FOUNDATION_EXAM,A1_FINAL_EXAM];
