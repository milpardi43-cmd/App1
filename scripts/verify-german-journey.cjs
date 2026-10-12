const assert=require('node:assert/strict');
const {chromium:pw}=require('playwright');
// Optional browser test. Requires a running web preview, esbuild, and Playwright.
// Set NODE_PATH to an external test dependency directory if needed.
const path=require('node:path');
const fs=require('node:fs');
const rootDir=path.resolve(__dirname,'..');
const tmp=path.join(rootDir,'node_modules/.cache/german-browser-check');
fs.mkdirSync(tmp,{recursive:true});
require('esbuild').buildSync({entryPoints:[path.join(rootDir,'lib/languages/germanUnits.ts')],bundle:true,platform:'node',format:'cjs',outfile:path.join(tmp,'units.cjs')});
const {GERMAN_UNITS,findGermanUnit}=require(path.join(tmp,'units.cjs'));
(async()=>{
 let options={headless:true};
 if(process.env.USE_SERVERLESS_CHROMIUM==='1'){
   const packPath=require.resolve('@sparticuz/chromium');
   const pack=await import(require('node:url').pathToFileURL(packPath).href);
   await pack.inflate(path.resolve(path.dirname(packPath),'../bin/al2023.tar.br'));
   pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(),'al2023/lib'));
   options={...options,args:pack.default.args,executablePath:await pack.default.executablePath()};
 }
 const browser=await pw.launch(options);
 const page=await browser.newPage({viewport:{width:1100,height:850}});
 const root=process.env.BROWSER_BASE_URL||'http://127.0.0.1:8081';let passed=0;
 const check=(name,v)=>{assert(v,name);console.log('PASS',name);passed++;};
 const button=name=>page.getByRole('button',{name,exact:true});
 const go=async path=>{await page.goto(root+path,{waitUntil:'networkidle'});};
 const saved=()=>page.getByText('پیش‌نویس روی همین دستگاه ذخیره شد؛ می‌توانید بعداً ادامه دهید.',{exact:true}).waitFor();
 const family=GERMAN_UNITS[1],lesson=family.lessons[0];
 await go('/learn/de/details');
 const today=await page.getByRole('tab',{name:'قدم امروز'}).boundingBox();const lib=await page.getByRole('tab',{name:'درس‌های کاربردی'}).boundingBox();
 check('Persian first tab is on the right',today.x>lib.x);
 await button('درس‌ها و نتیجه‌های «خانواده و آدم‌های اطراف»').click();
 await page.getByText('این فرد کیست؟',{exact:false}).first().waitFor();
 check('unit route carries family ID',page.url().includes('de-a1-family'));
 check('mission blocked before unit activities',await button('شروع مأموریت پایانی').isDisabled());
 await page.getByRole('button',{name:'شروع درس',exact:true}).first().click();
 await button('ادامه: الگوها را کشف کنیم').click();await button('ادامه: شنیدن و تکرار').click();await button('شروع تمرین؛ حالا نوبت شماست').click();
 await button('نمایش متن و معنی (با کمک)').click();await page.getByRole('radio').nth(1).click();await button('بررسی پاسخ').click();await saved();
 await page.reload({waitUntil:'networkidle'});
 await page.getByText('پاسخ پذیرفته شد',{exact:true}).waitFor();
 check('first response stays locked after reload',await page.getByRole('radio').nth(1).isDisabled());
 check('help remains recorded on reload',(await page.locator('body').innerText()).includes('این سؤال «با کمک» ثبت می‌شود'));
 await button('تمرین بعدی').click();
 for(const word of lesson.exercises[1].answer.split(' '))await button(word).click();
 await button('بررسی پاسخ').click();await button('تمرین بعدی').click();
 await page.getByRole('textbox').fill(lesson.exercises[2].sample);await button('بررسی پاسخ').click();await button('ادامه: مکالمه').click();await button('ادامه: لغات و الگوها').click();await button('پایان درس و ذخیره پیشرفت').click();
 await page.getByText('فعالیت درس ثبت شد',{exact:true}).waitFor();
 const result=await page.evaluate(()=>JSON.parse(localStorage.getItem('learning_unit_de-a1-family_v1')));
 check('family result saves helped and independent answers separately',result.activities[lesson.id].results[0].assisted&&result.activities[lesson.id].results[1].correct);
 check('original first-unit history is untouched',await page.evaluate(()=>localStorage.getItem('learning_unit_de_first_meeting_v1')===null));
 check('completed draft removed',await page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('language_learning_sessions_v1'))).length===0));
 await go('/learn/de/review?unit=de-a1-family');
 await page.getByText('۳ جمله آماده مرور',{exact:true}).waitFor();check('family review has its own three examples',true);
 await button('شروع مرور آلمانی').click();await button('نمایش پاسخ').click();await button('خوب بود').click();
 check('review advances to second example',(await page.locator('body').innerText()).includes('کارت ۲ از ۳'));
 const time=GERMAN_UNITS[2];await go(`/learn/de/practice?unit=${time.id}&lesson=${time.lessons[0].id}`);await saved();
 await go('/learn/de');await button('ادامه از همان‌جا').waitFor();await button('ادامه از همان‌جا').click();
 check('course resume opens time unit, not first unit',page.url().includes(time.id));
 await button('شروع دوباره همین جلسه').click();await button('بله، این جلسه را از ابتدا شروع کن').click();await saved();
 check('restart retains correct unit route',page.url().includes(time.id)&&page.url().includes('fresh='));
 // Seed only remaining prerequisites in this isolated test browser, then exercise the real mission UI.
 await page.evaluate(({family})=>{
  const key='learning_unit_de-a1-family_v1';const p=JSON.parse(localStorage.getItem(key));
  for(const l of family.lessons.slice(1))p.activities[l.id]={id:l.id,finishedAt:'2026-10-07T08:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))};
  localStorage.setItem(key,JSON.stringify(p));
 },{family});
 await go('/learn/de/practice?unit=de-a1-family&mission=1');
 for(let i=0;i<family.mission.length;i++){
  await page.getByRole('textbox').fill(family.mission[i].sample);
  await button(i===family.mission.length-1?'ثبت پاسخ و دیدن نتیجه':'ثبت پاسخ و سؤال بعد').click();
 }
 await page.getByText('نتیجه مأموریت ثبت شد',{exact:true}).waitFor();
 check('five-question family mission saves',(await page.evaluate(()=>JSON.parse(localStorage.getItem('learning_unit_de-a1-family_v1')).missions)).length===1);
 await go('/learn/de/details');
 await page.getByRole('tab',{name:'سطح A2',exact:true}).click();
 await page.getByText('واحدهای آماده A2',{exact:true}).filter({visible:true}).waitFor();
 check('level switch uses A2 route parameter',page.url().includes('level=A2'));
 check('A2 view does not list A1 unit cards',await button('درس‌ها و نتیجه‌های «اولین آشنایی»').count()===0);
 await button('درس‌ها و نتیجه‌های «روایت دیروز و آخر هفته»').click();
 check('A2 unit clearly labels its level',(await page.locator('body').innerText()).includes('A2'));
 await button('بازگشت').click();
 await page.getByText('Deutsch Journey',{exact:true}).waitFor();
 check('return from A2 preserves selected level',page.url().includes('level=A2'));
 // Exercise every lesson and mission of the next expansion without seeding prerequisites.
 const previousFamily=await page.evaluate(()=>localStorage.getItem('learning_unit_de-a1-family_v1'));
 for(const unit of GERMAN_UNITS.slice(3).filter(u=>!process.env.BROWSER_UNIT_FILTER||process.env.BROWSER_UNIT_FILTER.split(',').includes(u.id))){
  await go(`/learn/de/unit?unit=${unit.id}`);
  check(unit.id+': mission initially locked',await button('شروع مأموریت پایانی').isDisabled());
  for(const lesson of unit.lessons){
   await go(`/learn/de/practice?unit=${unit.id}&lesson=${lesson.id}`);
   await button('ادامه: الگوها را کشف کنیم').click();
   await button('ادامه: شنیدن و تکرار').click();await button('شروع تمرین؛ حالا نوبت شماست').click();
   await button('نمایش متن و معنی (با کمک)').click();
   const listening=lesson.exercises[0];
   await page.getByRole('radio').nth(listening.choices.findIndex(c=>c.id===listening.correctChoice)).click();
   await button('بررسی پاسخ').click();await saved();
   if(lesson===unit.lessons[0]){
    await page.reload({waitUntil:'networkidle'});
    await page.getByText('پاسخ پذیرفته شد',{exact:true}).waitFor();
    check(unit.id+': helped answer survives reload',await page.getByRole('radio').first().isDisabled());
   }
   await button('تمرین بعدی').click();
   const second=lesson.exercises[1];
   if(second.kind==='order'){
    for(const word of second.answer.split(' '))await button(word).click();
   }else{
    const passage=page.locator('[aria-label="متن آلمانی برای خواندن"]');
    await passage.waitFor();
    check(lesson.id+': reading source visible with LTR direction',(await passage.innerText())===second.readingText&&await passage.evaluate(e=>getComputedStyle(e).direction)==='ltr');
    if(lesson===unit.lessons[0]){
     await page.setViewportSize({width:390,height:844});
     check('reading passage fits mobile viewport',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
     await page.setViewportSize({width:1100,height:850});
    }
    await page.getByRole('radio').nth(second.choices.findIndex(c=>c.id===second.correctChoice)).click();
   }
   await button('بررسی پاسخ').click();await button('تمرین بعدی').click();
   await page.getByRole('textbox').fill(lesson.exercises[2].sample);
   if((unit.id==='de-a1-skills'||unit.level==='A2')&&lesson===unit.lessons[0]){
    await saved();await page.reload({waitUntil:'networkidle'});await page.getByRole('textbox').waitFor();
    check('two-sentence message draft survives reload',await page.getByRole('textbox').inputValue()===lesson.exercises[2].sample);
    check('message assessment limitation is visible',(await page.locator('body').innerText()).includes(unit.level==='A2'?'پیام مقید است':'این پیام کوتاه مقید'));
   }
   await button('بررسی پاسخ').click();await button('ادامه: مکالمه').click();await button('ادامه: لغات و الگوها').click();await button('پایان درس و ذخیره پیشرفت').click();
   await page.getByText('فعالیت درس ثبت شد',{exact:true}).waitFor();
   check(lesson.id+': completed through real lesson UI',true);
  }
  await go(`/learn/de/unit?unit=${unit.id}`);
  await button('شروع مأموریت پایانی').click();
  for(let i=0;i<unit.mission.length;i++){
   const e=unit.mission[i];
   if(e.kind==='write')await page.getByRole('textbox').fill(e.sample);
   else {if(e.audioText)await button('نمایش متن و معنی (با کمک)').click();await page.getByRole('radio').nth(e.choices.findIndex(c=>c.id===e.correctChoice)).click();}
   await button(i===unit.mission.length-1?'ثبت پاسخ و دیدن نتیجه':'ثبت پاسخ و سؤال بعد').click();
  }
  await page.getByText('نتیجه مأموریت ثبت شد',{exact:true}).waitFor();
  const progress=await page.evaluate(id=>JSON.parse(localStorage.getItem(`learning_unit_${id}_v1`)),unit.id);
  check(unit.id+': all five activities persist',Object.keys(progress.activities).length===5);
  if(unit.id==='de-a1-skills'||unit.level==='A2')check('reading responses recorded independently',Object.values(progress.activities).every(a=>a.results[1].correct&&!a.results[1].assisted));
  check(unit.id+': mixed mission results and help flags persist',progress.missions.length===1&&progress.missions[0].results.length===5&&progress.missions[0].results.every((r,i)=>r.correct&&r.assisted===!!unit.mission[i].audioText));
  await go(`/learn/de/review?unit=${unit.id}`);
  await page.getByText('۱۵ جمله آماده مرور',{exact:true}).waitFor();
  check(unit.id+': all fifteen examples enrolled in its review',true);
 }
 check('new units leave prior family history unchanged',previousFamily===await page.evaluate(()=>localStorage.getItem('learning_unit_de-a1-family_v1')));
 await go('/learn/de/details');await page.getByRole('tab',{name:'نقشه یادگیری',exact:true}).click();
 check('roadmap exposes seventeen available A1 sections',(await page.locator('body').innerText()).includes('۱۷ واحد قابل استفاده'));
 await go('/languages');await page.getByRole('button',{name:'اطلاعات مسیرهای انگلیسی و آلمانی',exact:true}).click();const germanCatalogText=await page.locator('body').innerText();check('catalog exposes the active German sentence-course total of 95 lessons and 4,750 sentences',germanCatalogText.includes('۹۵ درس')&&germanCatalogText.includes('۴۷۵۰ جمله'));
 await go('/learn/de/library?level=2');await page.getByText('گفت‌وگوی ترکیبی A2',{exact:true}).waitFor();
 const a2LibraryText=await page.locator('body').innerText();check('A2 browser library exposes the final module and 1,250-sentence count',/۱۲۵۰\s*جمله/.test(a2LibraryText)&&/۷۱۶\s*مدخل واژگانی یکتا/.test(a2LibraryText));
 await go('/learn/de/library?level=3');await page.getByText('گفت‌وگوی ترکیبی B1',{exact:true}).waitFor();
 const b1LibraryText=await page.locator('body').innerText();check('B1 browser library exposes the final module and 1,250-sentence count',/۱۲۵۰\s*جمله/.test(b1LibraryText)&&/۷۳۴\s*مدخل واژگانی یکتا/.test(b1LibraryText));
 const recap=findGermanUnit('de-a1-recap');
 await go('/learn/de/recap');
 await button('شروع جمع‌بندی').waitFor();
 check('A1 recap count excludes A2 lessons',(await page.locator('body').innerText()).includes('از ۸۵ فعالیت'));
 await button('شروع جمع‌بندی').click();
 for(let i=0;i<recap.mission.length;i++){
  const e=recap.mission[i];
  if(e.kind==='write')await page.getByRole('textbox').fill(i===0?'wrong answer':e.sample);
  else {
   if(e.audioText)await button('نمایش متن و معنی (با کمک)').click();
   await page.getByRole('radio').nth(e.choices.findIndex(c=>c.id===e.correctChoice)).click();
  }
  if(i===2){
   await saved();await page.reload({waitUntil:'networkidle'});
   await page.getByRole('radio').first().waitFor();
   check('mixed recap resumes current helped listening question',(await page.locator('body').innerText()).includes('این سؤال «با کمک» ثبت می‌شود'));
  }
  await button(i===recap.mission.length-1?'ثبت پاسخ و دیدن نتیجه':'ثبت پاسخ و سؤال بعد').click();
 }
 await page.getByText('نتیجه مأموریت ثبت شد',{exact:true}).waitFor();
 check('recap result includes remedial links',await page.getByRole('button',{name:'بازگشت به درس مرتبط',exact:true}).count()===3);
 await page.getByRole('button',{name:'بازگشت به درس مرتبط',exact:true}).first().click();
 check('recap remediation opens original formal-address lesson',page.url().includes('de-meeting-register')&&page.url().includes('de-a1-first-meeting'));
 await go('/learn/de/recap');
 await page.getByText('نتیجه آخرین تلاش کامل',{exact:true}).waitFor();
 check('recap report persists skill counts and repair plan',(await page.locator('body').innerText()).includes('۵ از ۸ پاسخ مستقل')&&await page.getByRole('button',{name:/تمرین دوباره:/}).count()===3);
 await button('تلاش تازه در سنجش').click();
 await page.getByRole('textbox').waitFor();
 check('new recap attempt starts with empty answer',await page.getByRole('textbox').inputValue()==='');
 await saved();await go('/learn/de/recap');await button('ادامه سنجش نیمه‌تمام').waitFor();
 check('report offers resume for unfinished retry',true);
 await go('/learn/de/coverage');
 check('coverage exposes content and outstanding human review',(await page.locator('body').innerText()).includes('بازبینی مستقل مدرس')&&await page.getByRole('button',{name:'دستور پایه در کاربرد',exact:true}).count()>=1);
 for(const exam of ['de-a1-checkpoint-a','de-a1-checkpoint-b']){
  const u=findGermanUnit(exam);
  await go('/learn/de/recap?exam='+exam);await button('شروع جمع‌بندی').click();
  for(let i=0;i<u.mission.length;i++){
   const e=u.mission[i];
   if(e.kind==='write')await page.getByRole('textbox').fill(e.sample);
   else {if(e.audioText)await button('نمایش متن و معنی (با کمک)').click();await page.getByRole('radio').nth(e.choices.findIndex(c=>c.id===e.correctChoice)).click();}
   if(i===0){await saved();await page.reload({waitUntil:'networkidle'});await page.getByRole('radio').first().waitFor();check(exam+': helped draft resumes',(await page.locator('body').innerText()).includes('این سؤال «با کمک» ثبت می‌شود'));}
   await button(i===u.mission.length-1?'ثبت پاسخ و دیدن نتیجه':'ثبت پاسخ و سؤال بعد').click();
  }
  await page.getByText('نتیجه مأموریت ثبت شد',{exact:true}).waitFor();
  check(exam+': helped items have valid repair links',await page.getByRole('button',{name:'بازگشت به درس مرتبط',exact:true}).count()===3);
  await page.getByRole('button',{name:'بازگشت به درس مرتبط',exact:true}).first().click();
  check(exam+': repair opens contact lesson',page.url().includes('unit=de-a1-contact')&&page.url().includes('lesson=de-contact-'));
  await go('/learn/de/recap?exam='+exam);await page.getByText('نتیجه آخرین تلاش کامل',{exact:true}).waitFor();
  check(exam+': own report persists',(await page.locator('body').innerText()).includes('۷ از ۱۰ پاسخ مستقل'));
 }
 await button('سنجش تکمیلی A1 — فرم الف').click();await page.getByText('نتیجه آخرین تلاش کامل',{exact:true}).filter({visible:true}).waitFor();
 check('switching assessment in-app retains own report',page.url().includes('de-a1-checkpoint-a')&&(await page.locator('body').innerText()).includes('۷ از ۱۰ پاسخ مستقل'));
 await button('جمع‌بندی پایه: ۸ سؤال').click();await button('ادامه سنجش نیمه‌تمام').waitFor();
 check('in-app switch restores separate core history',(await page.locator('body').innerText()).includes('۵ از ۸ پاسخ مستقل'));
 await go('/learn/de/recap?exam=unknown');check('unknown assessment rejected',(await page.locator('body').innerText()).includes('جمع‌بندی پیدا نشد'));
 await go('/learn/de/workshop');
 await page.getByRole('textbox',{name:'Vorname',exact:true}).waitFor();
 await button('بررسی اولیه فرم، بدون نمره').click();
 check('multi-field form reports missing values',(await page.locator('body').innerText()).includes('فیلدهای خالی'));
 const fields={'Vorname':'Alex','Nachname':'Winter','Straße und Hausnummer':'Gartenstraße 8','Postleitzahl':'10115','Wohnort':'Berlin','Geburtsdatum':'14.03.2000','Telefon':'000000000','E-Mail':'alex@example.com'};
 for(const [name,value] of Object.entries(fields))await page.getByRole('textbox',{name,exact:true}).fill(value);
 await button('بررسی اولیه فرم، بدون نمره').click();
 check('filled form gives structural feedback not language grade',(await page.locator('body').innerText()).includes('صحت نشانی، تاریخ تقویمی یا زبان را تأیید نمی‌کند'));
 const message='Hallo Mia, kommst du morgen um drei Uhr? Wir lesen zusammen. Bis morgen!';
 await page.getByRole('textbox',{name:'یک دعوت واقعی، با اطلاعات خیالی',exact:true}).fill(message);
 await page.getByRole('checkbox',{name:'سلام و خطاب مناسب دارم.',exact:true}).click();
 await page.getByRole('checkbox',{name:'بدون خواندن متن پاسخ دادم.',exact:true}).first().click();
 await button('ذخیره پیش‌نویس کارگاه').click();await page.getByText('پیش‌نویس کارگاه روی همین دستگاه ذخیره شد.',{exact:true}).waitFor();
 await page.reload({waitUntil:'networkidle'});await page.getByRole('textbox',{name:'Vorname',exact:true}).waitFor();
 check('workshop free text form and self-check survive reload',await page.getByRole('textbox',{name:'یک دعوت واقعی، با اطلاعات خیالی',exact:true}).inputValue()===message&&await page.getByRole('textbox',{name:'Vorname',exact:true}).inputValue()==='Alex'&&await page.getByRole('checkbox',{name:'سلام و خطاب مناسب دارم.',exact:true}).getAttribute('aria-checked')==='true');
 await page.getByRole('textbox',{name:'یک دعوت واقعی، با اطلاعات خیالی',exact:true}).fill(message+' Danke.');
 check('editing message resets its stale self-check',await page.getByRole('checkbox',{name:'سلام و خطاب مناسب دارم.',exact:true}).getAttribute('aria-checked')==='false');
 await page.evaluate(()=>{window.__originalSet=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new Error('test quota');};});
 await button('ذخیره پیش‌نویس کارگاه').click();await page.getByText('ذخیره نشد؛ صفحه را نبندید و دوباره تلاش کنید.',{exact:true}).waitFor();
 check('workshop failed save retains text and warns',await page.getByRole('textbox',{name:'یک دعوت واقعی، با اطلاعات خیالی',exact:true}).inputValue()===message+' Danke.');
 await page.evaluate(()=>{Storage.prototype.setItem=window.__originalSet;});
 await button('ذخیره پیش‌نویس کارگاه').click();await page.getByText('پیش‌نویس کارگاه روی همین دستگاه ذخیره شد.',{exact:true}).waitFor();
 await page.setViewportSize({width:390,height:844});
 check('workshop fits mobile width',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 await button('پاک‌کردن فقط داده کارگاه').click();await button('انصراف').click();
 check('cancel erase preserves free writing',await page.getByRole('textbox',{name:'یک دعوت واقعی، با اطلاعات خیالی',exact:true}).inputValue()===message+' Danke.');
 await button('پاک‌کردن فقط داده کارگاه').click();await button('بله، پاک شود').click();await page.getByText('فقط پیش‌نویس و خودارزیابی کارگاه پاک شد.',{exact:true}).waitFor();
 check('workshop erase preserves unit and assessment history',await page.evaluate(()=>localStorage.getItem('learning_de_a1_workshop_v1')===null&&!!localStorage.getItem('learning_unit_de-a1-checkpoint-a_v1'))&&previousFamily===await page.evaluate(()=>localStorage.getItem('learning_unit_de-a1-family_v1')));
 await page.evaluate(()=>localStorage.setItem('learning_de_a1_workshop_v1','{broken'));
 await page.reload({waitUntil:'networkidle'});await page.getByRole('alert').waitFor();
 check('corrupt workshop is not silently overwritten',await page.getByRole('textbox').count()===0&&await page.evaluate(()=>localStorage.getItem('learning_de_a1_workshop_v1')==='{broken'));
 await button('پاک‌کردن فقط داده کارگاه').click();await button('بله، پاک شود').click();await page.getByRole('textbox',{name:'Vorname',exact:true}).waitFor();
 await go('/learn/fr/workshop');check('workshop rejects unsupported language',(await page.locator('body').innerText()).includes('کارگاه پیدا نشد'));
 await go('/learn/de/unit?unit=invalid');check('invalid unit has no first-unit fallback',(await page.locator('body').innerText()).includes('این واحد پیدا نشد'));
 await page.setViewportSize({width:390,height:844});await go('/learn/de');
 check('mobile dashboard has no horizontal page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 await page.screenshot({path:path.join(tmp,'german-mobile.png'),fullPage:true});
 console.log('BROWSER CHECKS:',passed);await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
