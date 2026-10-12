import type { LearningLesson } from './types';

/** Supplemental A1 practice; not a replacement for the assessed first unit. */
export const GERMAN_EVERYDAY_LESSONS: LearningLesson[] = [
  {
    id: 'de-family', title: 'خانواده و آدم‌های نزدیک', durationMinutes: 10,
    situation: 'عکس خانواده را به یک دوست نشان می‌دهید؛ افراد را معرفی می‌کنید و درباره خواهر و برادر می‌پرسید.',
    teachingFa: 'اسم‌ها را با حرف تعریف یاد بگیرید: der Vater، die Mutter، das Kind. برای «پدر من» می‌گوییم mein Vater و برای «مادر من» meine Mutter. بعد از haben، مفعول مذکر ein به einen تبدیل می‌شود: einen Bruder. برای Schwester از eine استفاده می‌کنیم.',
    sentences: [
      { id:'de-fam1',text:'Das ist meine Mutter.',fa:'این مادر من است.',pronunciation:'داس ایست ماینِه موتِر',vocabulary:[{word:'die Mutter',meaning:'مادر'}] },
      { id:'de-fam2',text:'Mein Vater wohnt in Hamburg.',fa:'پدر من در هامبورگ زندگی می‌کند.',pronunciation:'ماین فاتِر وونت این هامبورگ',vocabulary:[{word:'der Vater',meaning:'پدر'}] },
      { id:'de-fam3',text:'Ich habe eine Schwester.',fa:'من یک خواهر دارم.',pronunciation:'ایش هابِه آینِه شوِستِر',vocabulary:[{word:'die Schwester',meaning:'خواهر'}] },
      { id:'de-fam4',text:'Ich habe einen Bruder.',fa:'من یک برادر دارم.',pronunciation:'ایش هابِه آینِن برودِر',vocabulary:[{word:'der Bruder',meaning:'برادر'}] },
      { id:'de-fam5',text:'Hast du Geschwister?',fa:'آیا خواهر یا برادر داری؟',pronunciation:'هاست دو گِشویستِر؟',vocabulary:[{word:'die Geschwister',meaning:'خواهر و برادرها؛ اسم جمع'}] },
    ],
    dialogue:[{speaker:'شما',text:'Das ist meine Mutter.',fa:'این مادر من است.'},{speaker:'لنا',text:'Hast du Geschwister?',fa:'خواهر یا برادر داری؟'},{speaker:'شما',text:'Ja, ich habe eine Schwester und einen Bruder.',fa:'بله، یک خواهر و یک برادر دارم.'}],
    checks:[{promptFa:'برای «مادر من» کدام درست است؟',choices:['mein Mutter','meine Mutter','meinen Mutter'],correctIndex:1,explanationFa:'Mutter مؤنث است؛ در این عبارت meine Mutter می‌گوییم.'},{promptFa:'جمله Ich habe einen Bruder چه اطلاعاتی می‌دهد؟',choices:['من یک خواهر دارم.','من فرزند ندارم.','من یک برادر دارم.'],correctIndex:2,explanationFa:'Bruder یعنی برادر؛ einen شکل حرف تعریف مذکر در مفعول این جمله است.'}],
  },
  {
    id:'de-time-plans',title:'ساعت و قرار گذاشتن',durationMinutes:10,
    situation:'با دوستتان زمان یک دیدار را هماهنگ می‌کنید. ابتدا ساعت کامل و روز هفته را یاد می‌گیرید.',
    teachingFa:'برای ساعت از um استفاده می‌کنیم: um zehn Uhr. برای روز از am: am Montag. ساعت فعلی را با Es ist … Uhr می‌گوییم. در پرسش بله/خیر مثل Hast du Zeit? فعل اول می‌آید. فعلاً ساعت کامل را تمرین کنید؛ «نیم» و «ربع» مرحله بعدند.',
    sentences:[
      {id:'de-time1',text:'Wie spät ist es?',fa:'ساعت چند است؟',pronunciation:'وی شپِیت ایست اِس؟',vocabulary:[{word:'spät',meaning:'دیر؛ در این پرسش برای ساعت'}]},
      {id:'de-time2',text:'Es ist zehn Uhr.',fa:'ساعت ده است.',pronunciation:'اِس ایست تسِین اور',vocabulary:[{word:'die Uhr',meaning:'ساعت'}]},
      {id:'de-time3',text:'Der Kurs beginnt um neun Uhr.',fa:'کلاس ساعت نُه شروع می‌شود.',pronunciation:'دِر کورس بِگینت اوم نویْن اور',vocabulary:[{word:'beginnen',meaning:'شروع شدن'}]},
      {id:'de-time4',text:'Hast du am Montag Zeit?',fa:'دوشنبه وقت داری؟',pronunciation:'هاست دو اَم مونتاگ تسایت؟',vocabulary:[{word:'der Montag',meaning:'دوشنبه'}]},
      {id:'de-time5',text:'Wir treffen uns um zehn Uhr.',fa:'ساعت ده همدیگر را می‌بینیم.',pronunciation:'ویر تِرِفِن اونس اوم تسِین اور',vocabulary:[{word:'sich treffen',meaning:'همدیگر را ملاقات کردن'}]},
    ],
    dialogue:[{speaker:'شما',text:'Hast du am Montag Zeit?',fa:'دوشنبه وقت داری؟'},{speaker:'بِن',text:'Ja. Um zehn Uhr?',fa:'بله. ساعت ده؟'},{speaker:'شما',text:'Gut! Wir treffen uns um zehn Uhr.',fa:'خوب است! ساعت ده همدیگر را می‌بینیم.'}],
    checks:[{promptFa:'جای خالی: Der Kurs beginnt … neun Uhr.',choices:['am','um','aus'],correctIndex:1,explanationFa:'برای زمان ساعتی، um می‌آید: um neun Uhr.'},{promptFa:'am Montag به چه زمانی اشاره دارد؟',choices:['روز دوشنبه','ساعت ده','هر شب'],correctIndex:0,explanationFa:'Montag یعنی دوشنبه؛ برای روز هفته از am استفاده می‌کنیم.'}],
  },
  {
    id:'de-groceries',title:'خرید از فروشگاه',durationMinutes:10,
    situation:'در فروشگاه مواد غذایی، خریدتان را می‌گویید، قیمت می‌پرسید و شیوه پرداخت را مشخص می‌کنید.',
    teachingFa:'Ich brauche … یعنی «نیاز دارم» و Ich möchte … درخواست مؤدبانه است. برای پرسیدن قیمت یک چیز می‌گوییم Was kostet das? برای پرداخت با کارت از mit Karte استفاده می‌کنیم. این عبارت‌ها را در موقعیت خرید تمرین کنید، نه به صورت واژه‌های جدا.',
    sentences:[
      {id:'de-shop1',text:'Ich brauche Brot.',fa:'من نان لازم دارم.',pronunciation:'ایش براوخِه بروت',vocabulary:[{word:'das Brot',meaning:'نان'}]},
      {id:'de-shop2',text:'Ich möchte ein Kilo Äpfel.',fa:'یک کیلو سیب می‌خواهم.',pronunciation:'ایش موشتِه آین کیلو اِپفِل',vocabulary:[{word:'der Apfel / die Äpfel',meaning:'سیب / سیب‌ها'}]},
      {id:'de-shop3',text:'Was kostet das?',fa:'این چقدر قیمت دارد؟',pronunciation:'واس کوستِت داس؟',vocabulary:[{word:'kosten',meaning:'قیمت داشتن'}]},
      {id:'de-shop4',text:'Das kostet drei Euro.',fa:'این سه یورو قیمت دارد.',pronunciation:'داس کوستِت درای اُیرو',vocabulary:[{word:'drei',meaning:'سه'}]},
      {id:'de-shop5',text:'Kann ich mit Karte bezahlen?',fa:'می‌توانم با کارت پرداخت کنم؟',pronunciation:'کان ایش میت کارتِه بِتسالِن؟',vocabulary:[{word:'bezahlen',meaning:'پرداخت کردن'}]},
    ],
    dialogue:[{speaker:'شما',text:'Ich möchte ein Kilo Äpfel. Was kostet das?',fa:'یک کیلو سیب می‌خواهم. چقدر قیمت دارد؟'},{speaker:'فروشنده',text:'Drei Euro.',fa:'سه یورو.'},{speaker:'شما',text:'Kann ich mit Karte bezahlen?',fa:'می‌توانم با کارت پرداخت کنم؟'},{speaker:'فروشنده',text:'Ja, gern.',fa:'بله، حتماً.'}],
    checks:[{promptFa:'برای پرسیدن قیمت کدام جمله مناسب است؟',choices:['Wie heißt du?','Was kostet das?','Wo wohnst du?'],correctIndex:1,explanationFa:'Was kostet das? یعنی «این چقدر قیمت دارد؟».'},{promptFa:'mit Karte bezahlen یعنی چه؟',choices:['نقدی پرداخت کردن','کارت خریدن','با کارت پرداخت کردن'],correctIndex:2,explanationFa:'Karte در این موقعیت کارت بانکی است؛ mit یعنی «با».'}],
  },
  {
    id:'de-home',title:'خانه و اتاق‌ها',durationMinutes:10,
    situation:'درباره خانه‌تان چند جمله می‌گویید و جای آشپزخانه را به مهمان نشان می‌دهید.',
    teachingFa:'در جمله Meine Wohnung ist klein، صفت بعد از ist می‌آید و در این الگو پسوند نمی‌گیرد. kein و keine برای منفی‌کردن اسم به کار می‌روند؛ Ich habe keinen Balkon یعنی «بالکن ندارم». اسم‌های آلمانی با حرف بزرگ نوشته می‌شوند.',
    sentences:[
      {id:'de-home1',text:'Meine Wohnung ist klein.',fa:'آپارتمان من کوچک است.',pronunciation:'ماینِه وونونگ ایست کلاین',vocabulary:[{word:'die Wohnung',meaning:'آپارتمان؛ واحد مسکونی'}]},
      {id:'de-home2',text:'Die Küche ist hier.',fa:'آشپزخانه اینجاست.',pronunciation:'دی کوشِه ایست هیر',vocabulary:[{word:'die Küche',meaning:'آشپزخانه'}]},
      {id:'de-home3',text:'Das Zimmer ist hell.',fa:'اتاق روشن است.',pronunciation:'داس تسیمِر ایست هِل',vocabulary:[{word:'das Zimmer',meaning:'اتاق'}]},
      {id:'de-home4',text:'Ich habe keinen Balkon.',fa:'من بالکن ندارم.',pronunciation:'ایش هابِه کاینِن بالکون',vocabulary:[{word:'der Balkon',meaning:'بالکن'}]},
      {id:'de-home5',text:'Wo ist das Badezimmer?',fa:'حمام کجاست؟',pronunciation:'وو ایست داس بادِتسیمِر؟',vocabulary:[{word:'das Badezimmer',meaning:'حمام'}]},
    ],
    dialogue:[{speaker:'شما',text:'Meine Wohnung ist klein. Die Küche ist hier.',fa:'آپارتمان من کوچک است. آشپزخانه اینجاست.'},{speaker:'مهمان',text:'Das Zimmer ist hell! Hast du einen Balkon?',fa:'اتاق روشن است! بالکن داری؟'},{speaker:'شما',text:'Nein, ich habe keinen Balkon.',fa:'نه، بالکن ندارم.'}],
    checks:[{promptFa:'کدام جمله یعنی «بالکن ندارم»؟',choices:['Ich habe einen Balkon.','Ich habe keinen Balkon.','Der Balkon ist klein.'],correctIndex:1,explanationFa:'keinen Balkon وجود بالکن را نفی می‌کند.'},{promptFa:'در جمله Das Zimmer ist hell، اتاق چگونه است؟',choices:['روشن','گران','بزرگ'],correctIndex:0,explanationFa:'hell یعنی روشن؛ klein یعنی کوچک.'}],
  },
  {
    id:'de-routine',title:'برنامه روزانه',durationMinutes:10,
    situation:'یک روز معمولی‌تان را برای همکلاسی تعریف می‌کنید: بیدارشدن، صبحانه، کار و یادگیری.',
    teachingFa:'aufstehen فعل جداشدنی است: Ich stehe … auf. بخش auf در این جمله به پایان می‌رود. اگر جمله را با زمان شروع کنیم، فعل صرف‌شده همچنان جای دوم است: Am Abend lerne ich Deutsch. ترتیب آلمانی را با ترتیب فارسی یکی نگیرید.',
    sentences:[
      {id:'de-day1',text:'Ich stehe um sieben Uhr auf.',fa:'من ساعت هفت از خواب بلند می‌شوم.',pronunciation:'ایش شتِه اوم زیبِن اور آوف',vocabulary:[{word:'aufstehen',meaning:'از جا یا خواب بلند شدن'}]},
      {id:'de-day2',text:'Ich frühstücke um acht Uhr.',fa:'من ساعت هشت صبحانه می‌خورم.',pronunciation:'ایش فروش‌شتوکِه اوم آخت اور',vocabulary:[{word:'frühstücken',meaning:'صبحانه خوردن'}]},
      {id:'de-day3',text:'Ich arbeite von neun bis fünf.',fa:'من از نه تا پنج کار می‌کنم.',pronunciation:'ایش آربایتِه فون نویْن بیس فونف',vocabulary:[{word:'arbeiten',meaning:'کار کردن'}]},
      {id:'de-day4',text:'Am Abend lerne ich Deutsch.',fa:'عصر آلمانی یاد می‌گیرم.',pronunciation:'اَم آبِنت لِرنِه ایش دویچ',vocabulary:[{word:'der Abend',meaning:'عصر؛ اوایل شب'}]},
      {id:'de-day5',text:'Ich gehe um elf Uhr schlafen.',fa:'من ساعت یازده برای خواب می‌روم.',pronunciation:'ایش گِه اوم اِلف اور شلافِن',vocabulary:[{word:'schlafen',meaning:'خوابیدن'}]},
    ],
    dialogue:[{speaker:'لنا',text:'Wann stehst du auf?',fa:'چه زمانی از خواب بلند می‌شوی؟'},{speaker:'شما',text:'Ich stehe um sieben Uhr auf.',fa:'ساعت هفت از خواب بلند می‌شوم.'},{speaker:'لنا',text:'Wann lernst du Deutsch?',fa:'چه زمانی آلمانی یاد می‌گیری؟'},{speaker:'شما',text:'Am Abend lerne ich Deutsch.',fa:'عصر آلمانی یاد می‌گیرم.'}],
    checks:[{promptFa:'جمله را کامل کنید: Ich stehe um sieben Uhr …',choices:['aus','auf','an'],correctIndex:1,explanationFa:'فعل aufstehen جداشدنی است؛ auf در پایان این جمله می‌آید.'},{promptFa:'کدام ترتیب درست است؟',choices:['Am Abend ich lerne Deutsch.','Am Abend lerne ich Deutsch.','Am Abend Deutsch ich lerne.'],correctIndex:1,explanationFa:'Am Abend بخش اول جمله است؛ فعل صرف‌شده lerne در جایگاه دوم و ich بعد از آن می‌آید.'}],
  },
  {
    id:'de-transport',title:'بلیت و رفت‌وآمد',durationMinutes:10,
    situation:'می‌خواهید با قطار به برلین بروید؛ درباره بلیت، زمان حرکت و سکوی قطار می‌پرسید.',
    teachingFa:'برای مقصد شهر از nach استفاده می‌کنیم: nach Berlin. mit dem Bus یعنی «با اتوبوس»؛ بعد از mit در این عبارت der Bus به dem Bus تبدیل می‌شود. abfahren جداشدنی است: Der Zug fährt … ab. این الگوها را فعلاً همراه جمله یاد بگیرید.',
    sentences:[
      {id:'de-trip1',text:'Ich brauche eine Fahrkarte nach Berlin.',fa:'من یک بلیت به مقصد برلین لازم دارم.',pronunciation:'ایش براوخِه آینِه فارکارتِه ناخ بِرلین',vocabulary:[{word:'die Fahrkarte',meaning:'بلیت وسیله نقلیه'}]},
      {id:'de-trip2',text:'Wann fährt der Zug ab?',fa:'قطار چه زمانی حرکت می‌کند؟',pronunciation:'وان فِرت دِر تسوگ اَب؟',vocabulary:[{word:'abfahren',meaning:'حرکت کردن؛ راه افتادن'}]},
      {id:'de-trip3',text:'Der Zug fährt um zehn Uhr ab.',fa:'قطار ساعت ده حرکت می‌کند.',pronunciation:'دِر تسوگ فِرت اوم تسِین اور اَب',vocabulary:[{word:'der Zug',meaning:'قطار'}]},
      {id:'de-trip4',text:'Wo ist Gleis zwei?',fa:'سکوی شماره دو کجاست؟',pronunciation:'وو ایست گلایس تسوای؟',vocabulary:[{word:'das Gleis',meaning:'خط راه‌آهن؛ در ایستگاه شماره محل سوارشدن'}]},
      {id:'de-trip5',text:'Ich fahre mit dem Bus.',fa:'من با اتوبوس می‌روم.',pronunciation:'ایش فارِه میت دِم بوس',vocabulary:[{word:'der Bus',meaning:'اتوبوس'}]},
    ],
    dialogue:[{speaker:'شما',text:'Ich brauche eine Fahrkarte nach Berlin.',fa:'یک بلیت به مقصد برلین لازم دارم.'},{speaker:'کارمند',text:'Der Zug fährt um zehn Uhr ab.',fa:'قطار ساعت ده حرکت می‌کند.'},{speaker:'شما',text:'Wo ist Gleis zwei?',fa:'سکوی شماره دو کجاست؟'},{speaker:'کارمند',text:'Dort rechts.',fa:'آنجا سمت راست.'}],
    checks:[{promptFa:'nach Berlin در جمله بلیت به چه اشاره دارد؟',choices:['مقصد برلین','مبدأ برلین','ساعت حرکت'],correctIndex:0,explanationFa:'در این عبارت nach شهر مقصد را نشان می‌دهد.'},{promptFa:'جای خالی: Ich fahre … dem Bus.',choices:['aus','um','mit'],correctIndex:2,explanationFa:'برای وسیله رفت‌وآمد در این جمله می‌گوییم mit dem Bus.'}],
  },
];
