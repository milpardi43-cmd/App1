// Structural checks + a manually specified regression oracle. NOT a teacher review.
const assert=require('node:assert/strict');
const path=require('node:path');const fs=require('node:fs');const esbuild=require('esbuild');
const root=path.resolve(__dirname,'..');const tmp=path.join(root,'node_modules/.cache/a1-editorial');fs.mkdirSync(tmp,{recursive:true});
esbuild.buildSync({stdin:{contents:"export * from './lib/languages/germanUnits';export * from './lib/languages/a1Checkpoint';export * from './lib/languages/germanRecap';export * from './lib/languages/a1AudioCheck';",resolveDir:root},bundle:true,platform:'node',format:'cjs',outfile:path.join(tmp,'content.cjs')});
const content=require(path.join(tmp,'content.cjs'));
const units=[...content.GERMAN_A1_UNITS,content.A1_RECAP,...content.A1_CHECKPOINTS];
const tasks=units.flatMap(u=>[...u.lessons.flatMap(l=>l.exercises),...u.mission]);
let passed=0;function check(name,ok){assert(ok,name);passed++;console.log('PASS',name);}
check('369 A1 exercises inventoried (core lessons, recap and supplements)',tasks.length===369);
check('A1 assessment and lesson IDs unique',new Set(tasks.map(e=>e.id)).size===tasks.length);
for(const u of units){
 check(u.id+': objective links complete',[...u.lessons.flatMap(l=>l.exercises),...u.mission].every(e=>u.objectives.some(o=>o.id===e.objectiveId)));
}
for(const e of tasks){
 check(e.id+': prompt and feedback present',!!e.promptFa?.trim()&&!!e.explanationFa?.trim());
 if(e.kind==='choice'){
  check(e.id+': choices unique and exactly one keyed answer',e.choices.length>=2&&new Set(e.choices.map(c=>c.id)).size===e.choices.length&&new Set(e.choices.map(c=>c.label.trim())).size===e.choices.length&&e.choices.filter(c=>c.id===e.correctChoice).length===1);
  check(e.id+': listening transcript or reading input available',e.skill==='listening'?!!e.audioText&&!!e.transcriptFa:!!e.readingText||/[A-Za-zÄÖÜäöüß]/.test(e.promptFa)||e.choices.every(c=>/[A-Za-zÄÖÜäöüß]/.test(c.label)));
 }else if(e.kind==='write'){
  check(e.id+': all reference responses fit input limit',e.acceptedAnswers.length>0&&e.acceptedAnswers.every(a=>a.trim().length>0&&a.length<=300)&&e.acceptedAnswers.includes(e.sample));
 }
}
const expected={
 'de-calendar-numbers-listen':'32','de-calendar-numbers-mission':'54',
 'de-calendar-prices-listen':'15 €','de-calendar-prices-read':'2,80 €',
 'de-calendar-months-listen':'Juni','de-calendar-clock-listen':'09:30',
 'de-calendar-date-read':'دوازدهم ژوئن','de-calendar-date-mission':'هشتم نوامبر',
 'de-real-change-listen':'۲:۳۰','de-real-change-read':'۱۲',
 'de-real-notice-read':'نه، شنبه تا ۱۴ باز است','de-real-health-read':'۱۰ دقیقه',
 'de-grammar-questions-read':'قهوه داغ نیست و گوینده شکر ندارد',
 'de-a1-checkpoint-a-q-2':'۸:۴۵','de-a1-checkpoint-a-q-3':'۲۱ ژوئن',
 'de-a1-checkpoint-b-q-0':'06284','de-a1-checkpoint-b-q-2':'12,50 €',
};
for(const [id,label] of Object.entries(expected)){const e=tasks.find(e=>e.id===id);check(id+': meaning-specific answer regression',e?.kind==='choice'&&e.choices.find(c=>c.id===e.correctChoice)?.label===label);}
check('Dann morgen translation cannot be mistaken for day after tomorrow',content.findGermanUnit('de-a1-grammar').lessons.find(l=>l.id==='de-grammar-modals').dialogue.find(d=>d.text==='Dann morgen?').fa==='پس، فردا چطور؟');
check('form distinguishes language field from introductory sentence',content.findGermanUnit('de-a1-contact').lessons.find(l=>l.id==='de-contact-form').exercises[2].promptFa.includes('فقط Deutsch'));
check('German voice detection supports language and regional tags',['de','de-DE','de_AT','de-CH','DE-de'].every(content.isGermanVoice)&&['en-DE','del','fa','en-US'].every(x=>!content.isGermanVoice(x)));
const blank=content.audioCheckReport('',{});check('empty audio report never invents a result',!blank.includes('برایم واضح بود')&&blank.split('هنوز گزارش نشده').length===5);
check('audio report labels results as personal observation',content.audioCheckReport('Test',{letters:'silent'}).includes('صدایی نشنیدم')&&blank.includes('نه تأیید مدرس'));
check('audio sample IDs unique and content nonempty',new Set(content.A1_AUDIO_SAMPLES.map(s=>s.id)).size===4&&content.A1_AUDIO_SAMPLES.every(s=>s.text&&s.expected));
console.log(`A1 EDITORIAL CHECKS: ${passed} passed; no independent human review claimed.`);
