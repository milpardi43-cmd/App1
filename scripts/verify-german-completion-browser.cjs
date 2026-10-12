const assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
 const mod=require.resolve('@sparticuz/chromium');const pack=await import(require('node:url').pathToFileURL(mod).href);await pack.inflate(path.resolve(path.dirname(mod),'../bin/al2023.tar.br'));pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(),'al2023/lib'));
 const browser=await require('playwright').chromium.launch({headless:true,args:pack.default.args,executablePath:await pack.default.executablePath()});
 try{
  require('esbuild').buildSync({stdin:{contents:"export * from './lib/languages/germanUnits';export * from './lib/languages/germanCompletionContent';export * from './lib/languages/germanLevelExams';",resolveDir:path.resolve(__dirname,'..')},bundle:true,platform:'node',format:'cjs',outfile:path.resolve(__dirname,'../node_modules/.cache/german-browser-content.cjs')});
  const {FOUNDATION_UNITS,GERMAN_A1_UNITS,LEVEL_EXAMS}=require('../node_modules/.cache/german-browser-content.cjs');const exam=LEVEL_EXAMS.find(x=>x.id==='de-zero-final');const a1Exam=LEVEL_EXAMS.find(x=>x.id==='de-a1-final');
  const page=await browser.newPage({viewport:{width:1180,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route(/supabase\.(co|in)/,r=>r.abort());const base=process.env.BROWSER_BASE_URL||'http://127.0.0.1:8081/App2';let passed=0;const fa=n=>String(n).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[Number(d)]);const check=(name,ok)=>{assert(ok,name);passed++;};const go=async p=>page.goto(base+p,{waitUntil:'networkidle'});const button=name=>page.getByRole('button',{name,exact:true});
  const en='{"completedLessons":3,"minutes":17}';const old='{"currentLessonId":"lesson-4","completedLessonIds":["lesson-1"]}';
  await page.goto(base+'/learn/de/library?level=Pre-A1',{waitUntil:'networkidle'});await page.getByText('درس‌های مقدماتی',{exact:true}).waitFor();
  check('Pre-A1 library renders both complete foundation units',await page.getByText('مقدماتی: الفبا و صداها',{exact:true}).count()>=1&&await page.getByText('مقدماتی: اولین جمله‌ها',{exact:true}).count()>=1);
  check('Pre-A1 library exposes its final check and completion map',await button('سنجش جامع پایان مقدماتی').count()===1&&await button('وضعیت تکمیل مقدماتی و A1').count()===1);
  await button('سنجش جامع پایان مقدماتی').click();await page.getByText('سنجش پایان مقدماتی',{exact:true}).first().waitFor();await page.getByText(/۰ از ۱۰ فعالیت مرحله‌ای/).waitFor();
  check('final assessment is locked before lessons and unit missions',await button('شروع سنجش پایان مقدماتی').isDisabled());
  await go('/learn/de/practice?unit=de-zero-final&mission=1');await page.getByText(/ابتدا همه درس‌ها و مأموریت‌های واحدهای همان سطح/).waitFor();check('direct route cannot bypass foundation prerequisites',true);
  await go('/learn/de/recap?exam=de-a1-final');await page.getByText(/۰ از ۸۵ فعالیت مرحله‌ای/).waitFor();check('A1 final assessment starts locked independently',await button('شروع سنجش پایان A1').isDisabled());
  await go('/learn/de/practice?unit=de-a1-final&mission=1');await page.getByText(/ابتدا همه درس‌ها و مأموریت‌های واحدهای همان سطح/).waitFor();check('A1 direct route cannot bypass its separate prerequisites',true);
  await go('/learn/de/completion');await page.getByText('نقشه تکمیل مقدماتی و A1',{exact:true}).waitFor();await page.getByText('مقدماتی · شروع از صفر',{exact:true}).waitFor();
  check('completion view makes both module scopes explicit',await page.getByText('A1 · مسیر یکپارچه',{exact:true}).count()===1);
  await page.evaluate(({units,en,old})=>{localStorage.setItem('english_study_state_v1',en);localStorage.setItem('sentence_course_progress_v1',old);for(const u of units){const activities=Object.fromEntries(u.lessons.map(l=>[l.id,{id:`seed-${l.id}`,finishedAt:'2026-10-08T09:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))}]));const attempt={id:`seed-mission-${u.id}`,finishedAt:'2026-10-08T09:05:00.000Z',results:u.mission.map(e=>({exerciseId:e.id,correct:true,assisted:false}))};localStorage.setItem(`learning_unit_${u.id}_v${u.version}`,JSON.stringify({version:1,activities,missions:[attempt]}));}}, {units:FOUNDATION_UNITS,en,old});
  await go('/learn/de/recap?exam=de-zero-final');await page.getByText('۱۰ از ۱۰ فعالیت مرحله‌ای',{exact:false}).waitFor();
  check('foundation final-check gate opens only after all lessons and missions',await button('شروع سنجش پایان مقدماتی').isEnabled());
  await button('شروع سنجش پایان مقدماتی').click();await page.getByText('مأموریت: سنجش پایان مقدماتی',{exact:true}).waitFor();
  for(let i=0;i<exam.mission.length;i++){
   const e=exam.mission[i];
   if(e.kind==='choice'){
    if(e.audioText)await button('نمایش متن و معنی (با کمک)').click();
    await page.getByRole('radio').nth(e.choices.findIndex(c=>c.id===e.correctChoice)).click();
   }else await page.getByRole('textbox',{name:'پاسخ آلمانی شما'}).fill(e.sample);
   await button(i===exam.mission.length-1?'ثبت پاسخ و دیدن نتیجه':'ثبت پاسخ و سؤال بعد').click();
  }
  await page.getByText('نتیجه مأموریت ثبت شد',{exact:true}).waitFor();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('learning_unit_de-zero-final_v1')));
  check('10-question final exam persists complete responses',stored.missions.length===1&&stored.missions[0].results.length===exam.mission.length&&stored.missions[0].results.every(x=>x.correct));
  check('listening help remains excluded from independent score',stored.missions[0].results[0].assisted===true);
  await button('بازگشت به نقشه واحد').click();await page.getByText('سنجش پایان مقدماتی',{exact:true}).first().waitFor();
  const independent=stored.missions[0].results.filter(x=>x.correct&&!x.assisted).length;check('saved attempt appears on the correct separate exam report',(await page.locator('body').innerText()).includes(`${fa(independent)} از ۱۰ پاسخ مستقل`));
  await page.evaluate(({units})=>{for(const u of units){const activities=Object.fromEntries(u.lessons.map(l=>[l.id,{id:`seed-${l.id}`,finishedAt:'2026-10-08T10:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))}]));const attempt={id:`seed-mission-${u.id}`,finishedAt:'2026-10-08T10:05:00.000Z',results:u.mission.map(e=>({exerciseId:e.id,correct:true,assisted:false}))};const key=u.id==='de-a1-first-meeting'?'learning_unit_de_first_meeting_v1':`learning_unit_${u.id}_v${u.version}`;localStorage.setItem(key,JSON.stringify({version:1,activities,missions:[attempt]}));}}, {units:GERMAN_A1_UNITS});const historyBefore=await page.evaluate(()=>localStorage.getItem('learning_unit_de_first_meeting_v1'));
  await go('/learn/de/recap?exam=de-a1-final');await page.getByText('۸۵ از ۸۵ فعالیت مرحله‌ای',{exact:false}).waitFor();check('A1 final assessment gate opens after all 17 units',await button('شروع سنجش پایان A1').isEnabled());await button('شروع سنجش پایان A1').click();await page.getByText('مأموریت: سنجش جامع پایان A1',{exact:true}).waitFor();
  for(let i=0;i<a1Exam.mission.length;i++){const e=a1Exam.mission[i];if(e.kind==='choice'){if(e.audioText)await button('نمایش متن و معنی (با کمک)').click();await page.getByRole('radio').nth(e.choices.findIndex(c=>c.id===e.correctChoice)).click();}else await page.getByRole('textbox',{name:'پاسخ آلمانی شما'}).fill(e.sample);await button(i===a1Exam.mission.length-1?'ثبت پاسخ و دیدن نتیجه':'ثبت پاسخ و سؤال بعد').click();}
  await page.getByText('نتیجه مأموریت ثبت شد',{exact:true}).waitFor();const a1Stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('learning_unit_de-a1-final_v1')));check('34-question A1 final assessment persists complete answers',a1Stored.missions.length===1&&a1Stored.missions[0].results.length===34&&a1Stored.missions[0].results.every(x=>x.correct));await button('بازگشت به نقشه واحد').click();await page.getByText('سنجش جامع داخلی A1',{exact:true}).waitFor().catch(()=>{});await page.getByText('سنجش جامع پایان A1',{exact:true}).first().waitFor();
  const a1Independent=a1Stored.missions[0].results.filter(x=>x.correct&&!x.assisted).length;check('A1 report displays its own saved final result',(await page.locator('body').innerText()).includes(`${fa(a1Independent)} از ۳۴ پاسخ مستقل`));
  await go('/learn/de/completion');await page.getByText('A1 · مسیر یکپارچه',{exact:true}).waitFor();
  await page.setViewportSize({width:390,height:844});check('complete two-level overview fits mobile width',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  check('English storage and earlier German history survive both assessments',await page.evaluate(({en,old,historyBefore})=>localStorage.getItem('english_study_state_v1')===en&&localStorage.getItem('sentence_course_progress_v1')===old&&localStorage.getItem('learning_unit_de_first_meeting_v1')===historyBefore,{en,old,historyBefore}));
  assert.deepEqual(errors,[],'no React runtime/hydration errors');check('no runtime errors',true);
  console.log(`${passed} browser checks passed for Pre-A1/A1 routes, gating, saved assessments, preservation and mobile layout.`);await page.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
