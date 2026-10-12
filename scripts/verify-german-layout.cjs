const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');const {chromium}=require('playwright');
(async()=>{
 const loc=require.resolve('@sparticuz/chromium');const pack=await import(require('node:url').pathToFileURL(loc).href);await pack.inflate(path.resolve(path.dirname(loc),'../bin/al2023.tar.br'));pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(),'al2023/lib'));const browser=await chromium.launch({headless:true,args:pack.default.args,executablePath:await pack.default.executablePath()});try{
 const page=await browser.newPage({viewport:{width:390,height:844}});await page.route(/supabase\.(co|in)/,r=>r.abort());const errors=[];page.on('pageerror',e=>errors.push(`${page.url()}: ${e.message}`));let checks=0;const check=(name,ok)=>{assert(ok,name);checks++;};const root=process.env.BROWSER_BASE_URL||'http://127.0.0.1:8081/App2';const go=async p=>page.goto(root+p,{waitUntil:'networkidle'});const button=name=>page.getByRole('button',{name,exact:true});
 await go('/lang');await page.getByText('English Journey',{exact:true}).waitFor();const english=await page.evaluate(()=>localStorage.getItem('sentence_course_progress_v1'));
 await go('/learn/de');await page.getByText('Deutsch Journey',{exact:true}).waitFor();for(const title of ['برنامه امروز','مسیر یادگیری','آموزش و تمرین تکمیلی پایه'])check(title,await page.getByText(title,{exact:true}).count()===1);for(const label of ['یادگیری','مکالمه','مرور'])check('German bottom nav '+label,await button(label).count()===1);
 const germanLevels=await Promise.all(['مقدماتی','A1','A2','B1'].map(async level=>(await button(`فهرست درس‌های ${level}`).boundingBox()).x));check('German level rail proceeds right to left',germanLevels.every((x,i)=>i===0||germanLevels[i-1]>x));
 await button('فهرست درس‌های A1').click();await page.getByText('درس‌های A1',{exact:true}).waitFor();check('complete unit library is reachable',await page.getByText('اولین آشنایی',{exact:true}).count()>0);
 // Resolve the actual stable lesson ID instead of inventing a route ID.
 require('esbuild').buildSync({entryPoints:['lib/languages/germanUnits.ts'],bundle:true,platform:'node',outfile:'node_modules/.cache/german-layout-units.cjs'});const {GERMAN_UNITS}=require('../node_modules/.cache/german-layout-units.cjs');const unit=GERMAN_UNITS[1],lesson=unit.lessons[0];await go(`/learn/de/practice?unit=${unit.id}&lesson=${lesson.id}`);
 await page.getByText(/موقعیت · مرحله ۱ از ۶/).waitFor();await button('ادامه: الگوها را کشف کنیم').click();await page.getByText(/جمله‌ها · مرحله ۲ از ۶/).waitFor();await button('ادامه: شنیدن و تکرار').click();await page.getByText(/شنیدن · مرحله ۳ از ۶/).waitFor();await page.getByText('پیش‌نویس روی همین دستگاه ذخیره شد؛ می‌توانید بعداً ادامه دهید.',{exact:true}).waitFor();await page.reload({waitUntil:'networkidle'});await page.getByText(/شنیدن · مرحله ۳ از ۶/).waitFor();checks++;
 await button('شروع تمرین؛ حالا نوبت شماست').click();await page.getByText(/تمرین · مرحله ۴ از ۶/).waitFor();
 for(const [i,e] of lesson.exercises.entries()){
  if(e.kind==='choice'){if(e.audioText)await button('نمایش متن و معنی (با کمک)').click();await page.getByRole('radio').nth(e.choices.findIndex(c=>c.id===e.correctChoice)).click();}
  else if(e.kind==='order'){for(const token of e.answer.split(' '))await button(token).click();}
  else await page.getByRole('textbox').fill(e.sample);
  await button('بررسی پاسخ').click();await button(i===lesson.exercises.length-1?'ادامه: مکالمه':'تمرین بعدی').click();
 }
 await page.getByText(/مکالمه · مرحله ۵ از ۶/).waitFor();check('all original dialogue turns retained',await page.getByText(lesson.dialogue[0].text,{exact:true}).count()===1);
 await button('ادامه: لغات و الگوها').click();await page.getByText(/لغات · مرحله ۶ از ۶/).waitFor();await page.getByText('پیش‌نویس روی همین دستگاه ذخیره شد؛ می‌توانید بعداً ادامه دهید.',{exact:true}).waitFor();await page.reload({waitUntil:'networkidle'});await page.getByText(/لغات · مرحله ۶ از ۶/).waitFor();checks++;
 check('last stage retains all examples',await page.getByText(lesson.examples[0].text,{exact:true}).count()===1);await button('پایان درس و ذخیره پیشرفت').click();await page.getByText('فعالیت درس ثبت شد',{exact:true}).waitFor();check('activity persisted only through completion',await page.evaluate(({id,lesson})=>!!JSON.parse(localStorage.getItem(`learning_unit_${id}_v1`)).activities[lesson],{id:unit.id,lesson:lesson.id}));
 await go('/learn/de/reviews');await page.getByText('مرور امروز',{exact:true}).waitFor();await button('مرور '+unit.title).click();await button('شروع مرور آلمانی').waitFor();checks++;
 await go('/learn/de/workshop');await page.getByRole('textbox',{name:'Vorname',exact:true}).waitFor();checks++;
 await go('/learn/de/details?view=library');await page.getByRole('button',{name:'شروع یا مرور درس',exact:true}).first().waitFor();check('all 12 legacy lessons remain accessible',await page.getByRole('button',{name:'شروع یا مرور درس',exact:true}).count()===12);
 await go('/learn/de/library?level=B1');await page.getByText('این سطح در نقشه آینده است و هنوز درس منتشرشده ندارد.',{exact:true}).waitFor();checks++;
 check('English history untouched',english===await page.evaluate(()=>localStorage.getItem('sentence_course_progress_v1')));check('no mobile horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(errors.length)console.log(errors);check('no runtime/hydration errors',errors.length===0);
 console.log(`${checks} German layout, six-stage resume and preservation checks passed.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
