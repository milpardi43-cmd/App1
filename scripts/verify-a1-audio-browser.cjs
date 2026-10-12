// Browser control-flow tests with a FAKE speech engine. Does not test audible sound.
const assert=require('node:assert/strict');const {chromium:pw}=require('playwright');const path=require('node:path');
(async()=>{
 let options={headless:true};if(process.env.USE_SERVERLESS_CHROMIUM==='1'){
  const packPath=require.resolve('@sparticuz/chromium');const pack=await import(require('node:url').pathToFileURL(packPath).href);
  await pack.inflate(path.resolve(path.dirname(packPath),'../bin/al2023.tar.br'));pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(),'al2023/lib'));
  options={...options,args:pack.default.args,executablePath:await pack.default.executablePath()};
 }
 const browser=await pw.launch(options);const page=await browser.newPage({viewport:{width:390,height:844}});let passed=0;
 const check=(name,ok)=>{assert(ok,name);passed++;console.log('PASS',name);};
 await page.addInitScript(()=>{
  window.__voiceMode='de';window.__speechMode='success';window.__cancelCount=0;window.__lastMessage=null;
  window.SpeechSynthesisUtterance=class{};
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   getVoices:()=>window.__voiceMode==='empty'?[]:window.__voiceMode==='en'?[{voiceURI:'en',name:'English test',lang:'en-US'}]:[{voiceURI:'de-test',name:'German test',lang:'de-DE'}],
   cancel:()=>{window.__cancelCount++;},
   speak:m=>{window.__lastMessage=m;if(window.__speechMode==='hang')return;if(window.__speechMode==='error'){setTimeout(()=>m.onerror?.({error:'test'}),20);return;}setTimeout(()=>m.onstart?.({}),20);if(window.__speechMode==='success')setTimeout(()=>m.onend?.({}),1000);},
  }});
 });
 const root=process.env.BROWSER_BASE_URL||'http://127.0.0.1:8081';const button=name=>page.getByRole('button',{name,exact:true});
 await page.goto(root+'/learn/de/coverage',{waitUntil:'networkidle'});await button('بررسی صدای دستگاه').click();
 await button('انتخاب‌شده: German test (de-DE)').waitFor();check('coverage links to German audio diagnostic',page.url().includes('/audio-check'));
 check('four samples available',await page.getByRole('button',{name:/^پخش:/}).count()===4);
 const storageBefore=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await button('پخش: هجی').click();await page.getByText('موتور گفتار شروع پخش را گزارش کرد؛ فقط شما می‌توانید شنیده‌شدن آن را تأیید کنید.',{exact:true}).waitFor();
 check('active playback blocks another utterance',await button('پخش: ساعت').isDisabled());
 check('explicit German voice and language sent',await page.evaluate(()=>window.__lastMessage.voice.voiceURI==='de-test'&&window.__lastMessage.lang==='de-DE'));
 await page.getByText('موتور گفتار پایان پخش را گزارش کرد؛ این پیام تأیید کیفیت تلفظ نیست.',{exact:true}).waitFor();
 check('engine completion never fills self-report',(await page.locator('body').innerText()).split('هنوز گزارش نشده').length===5);
 await page.getByRole('radio',{name:'هجی: شنیدم؛ برایم واضح بود',exact:true}).click();
 check('self-report has accessible checked state',await page.getByRole('radio',{name:'هجی: شنیدم؛ برایم واضح بود',exact:true}).getAttribute('aria-checked')==='true');
 check('self-report does not write lesson progress or any storage',storageBefore===await page.evaluate(()=>JSON.stringify({...localStorage})));
 await button('نمایش متن: هجی').click();check('sample and expected interpretation can be revealed',(await page.locator('body').innerText()).includes('Ich buchstabiere: M, I, A.'));
 await page.evaluate(()=>{window.__speechMode='error';});await button('پخش: ساعت').click();await page.getByText('پخش ناموفق بود. بلندی صدا، حالت بی‌صدا و صدای آلمانی دستگاه را بررسی کنید.',{exact:true}).waitFor();check('playback error allows retry',await button('پخش: ساعت').isEnabled());
 await page.evaluate(()=>{window.__speechMode='pending';});await button('پخش: ساعت').click();await page.getByText('موتور گفتار شروع پخش را گزارش کرد؛ فقط شما می‌توانید شنیده‌شدن آن را تأیید کنید.',{exact:true}).waitFor();
 await button('توقف پخش').click();await page.evaluate(()=>window.__lastMessage.onend?.({}));
 check('late completion cannot overwrite stopped state',(await page.locator('body').innerText()).includes('پخش متوقف شد؛ شنیده‌شدن صدا تأیید نشده است.'));
 await page.evaluate(()=>{window.__speechMode='hang';});await button('پخش: ساعت').click();await page.getByText('موتور گفتار پاسخ نداد؛ توقف و تلاش دوباره را امتحان کنید.',{exact:true}).waitFor({timeout:18000});check('missing speech callbacks time out without success',await button('پخش: ساعت').isEnabled());
 await page.evaluate(()=>{window.__voiceMode='en';});await button('دوباره صداها را بررسی کن').click();await page.getByRole('alert').waitFor();
 check('non-German voice is never silently selected',await button('پخش: هجی').isDisabled()&&(await page.locator('body').innerText()).includes('صدای آلمانی پیدا نشد'));
 await page.evaluate(()=>{window.__voiceMode='empty';});await button('دوباره صداها را بررسی کن').click();await page.getByText('فهرست صداها پاسخ نداد. دوباره تلاش کنید یا تنظیمات گفتار دستگاه را بررسی کنید.',{exact:true}).waitFor({timeout:12000});check('empty browser voice list has bounded wait',await button('دوباره صداها را بررسی کن').isEnabled());
 await page.evaluate(()=>{window.__voiceMode='de';});await button('دوباره صداها را بررسی کن').click();await button('انتخاب‌شده: German test (de-DE)').waitFor();
 check('voice retry clears old observations',(await page.locator('body').innerText()).split('هنوز گزارش نشده').length===5);
 check('diagnostic fits mobile width',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const cancelled=await page.evaluate(()=>window.__cancelCount);await button('بازگشت').click();await button('بررسی صدای دستگاه').waitFor();check('leaving screen cancels speech',await page.evaluate(()=>window.__cancelCount)>cancelled);
 await page.goto(root+'/learn/en/audio-check',{waitUntil:'networkidle'});check('unsupported language rejected',(await page.locator('body').innerText()).includes('بررسی صدا پیدا نشد'));
 console.log('MOCK AUDIO BROWSER CHECKS:',passed);await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
