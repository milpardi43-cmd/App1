const assert=require('node:assert/strict');const path=require('node:path');const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
require('esbuild').buildSync({stdin:{contents:["export * from './lib/languages/germanUnits';","export * from './lib/languages/germanCompletionContent';","export * from './lib/languages/germanLevelExams';","export * from './lib/languages/germanRecap';","export * from './lib/languages/a1Checkpoint';","export * from './lib/languages/german';","export * from './lib/languages/a1Coverage';","export * from './lib/languages/germanCourseStructure';","export * from './lib/languages/germanSentenceCourse';"].join('\n'),resolveDir:root},bundle:true,platform:'node',format:'cjs',outfile:path.join(root,'node_modules/.cache/german-completion.cjs')});
const c=require(path.join(root,'node_modules/.cache/german-completion.cjs'));
let passed=0;function check(name,ok){assert(ok,name);passed++;}
check('two independent Pre-A1 foundation units',c.FOUNDATION_UNITS.length===2&&c.FOUNDATION_UNITS.every(u=>u.level==='Pre-A1'));
check('Pre-A1 has 10 guided lessons',c.FOUNDATION_UNITS.reduce((n,u)=>n+u.lessons.length,0)===10);
check('17 internal A1 units and 85 lessons',c.GERMAN_A1_UNITS.length===17&&c.GERMAN_A1_UNITS.reduce((n,u)=>n+u.lessons.length,0)===85);
check('the prior A2 opening remains published and separate',c.GERMAN_A2_UNITS.map(u=>u.id).join(',')==='de-a2-past');
check('German levels use the English course-level contract from Foundation/Pre-A1 through B1',c.GERMAN_COURSE_LEVELS.map(l=>`${l.id}:${l.title}:${l.cefr}`).join('|')==='0:Foundation German:Pre-A1|1:Survival German:A1|2:Everyday German:A2|3:Communication German:B1'&&c.GERMAN_COURSE_LEVELS.every(l=>!!l.description&&!!l.color&&Array.isArray(l.modules)));
check('the active first phase is sentence-led Pre-A1 then A1; A2 remains starter and B1 planned',c.GERMAN_COURSE_LEVELS[0].status==='available'&&c.GERMAN_COURSE_LEVELS[1].status==='available'&&c.GERMAN_COURSE_LEVELS[2].status==='starter'&&c.GERMAN_COURSE_LEVELS[3].status==='planned'&&c.GERMAN_COURSE_LEVELS[0].description.includes('جمله'));
check('canonical German path orders existing units Pre-A1, A1, then A2 without reordering legacy storage',c.GERMAN_COURSE_UNITS.length===20&&c.GERMAN_COURSE_UNITS[0].level==='Pre-A1'&&c.GERMAN_COURSE_UNITS[1].level==='Pre-A1'&&c.GERMAN_COURSE_UNITS.slice(2,19).every(u=>u.level==='A1')&&c.GERMAN_COURSE_UNITS[19].level==='A2'&&c.GERMAN_UNITS[0].id==='de-a1-first-meeting');
check('sentence-first index aligns Pre-A1 and A1 lesson/order counts with existing content',c.GERMAN_COURSE_LESSONS.filter(l=>l.levelId===0).length===10&&c.GERMAN_COURSE_LESSONS.filter(l=>l.levelId===1).length===85&&c.GERMAN_COURSE_LESSONS.filter(l=>l.levelId===2).length===5&&c.GERMAN_COURSE_LESSONS.filter(l=>l.levelId===3).length===0);
check('Pre-A1 begins with sounds, introduces first-person sentence patterns, then advances to the A1 course',c.GERMAN_COURSE_LESSONS[0].id==='de-zero-alphabet'&&c.GERMAN_COURSE_LESSONS.some(l=>l.levelId===0&&l.id==='de-zero-person'&&l.sentences.length>0)&&c.GERMAN_COURSE_LESSONS.find(l=>l.levelId===1).unitId===c.GERMAN_A1_UNITS[0].id);
check('sentence-first index keeps each German example, translation, dialogue and grammar note unchanged',c.GERMAN_COURSE_LESSONS.every(l=>l.order>0&&l.sentences.length===l.source.examples.length&&l.sentences.every((s,i)=>s.text===l.source.examples[i].text&&s.fa===l.source.examples[i].fa)&&l.dialogue===l.source.dialogue&&l.pattern===l.source.patternFa&&l.pronunciation===l.source.pronunciationFa));
check('guided course catalog count stays internally consistent',c.GERMAN_GUIDED_LESSON_COUNT===100&&c.GERMAN_UNITS.reduce((n,u)=>n+u.lessons.length,0)===100);
check('old German unit IDs and order remain intact',c.GERMAN_UNITS.slice(0,15).map(u=>u.id).join(',')==='de-a1-first-meeting,de-a1-family,de-a1-time,de-a1-shopping,de-a1-home,de-a1-work,de-a1-transport,de-a1-needs,de-a1-skills,de-a1-contact,de-a1-calendar,de-a1-interests,de-a1-grammar,de-a1-real-life,de-a2-past');
check('new A1 bridge topics are all reachable',["de-a1-core-verbs","de-a1-services","de-a1-together"].every(id=>c.GERMAN_A1_UNITS.some(u=>u.id===id)));
check('every new level unit has five sequenced lessons and a five-task mission',[...c.FOUNDATION_UNITS,...c.COMPLETION_A1_UNITS].every(u=>u.lessons.length===5&&u.mission.length===5));
const contentUnits=[...c.FOUNDATION_UNITS,...c.COMPLETION_A1_UNITS];
const lessonIds=contentUnits.flatMap(u=>u.lessons.map(l=>l.id));check('new lesson IDs are unique and stable',lessonIds.length===25&&new Set(lessonIds).size===lessonIds.length);
const allUnits=[...c.GERMAN_UNITS,...c.LEVEL_EXAMS,...c.A1_CHECKPOINTS,c.A1_RECAP];
check('unit, exam and retained recap IDs are unique',allUnits.length===25&&new Set(allUnits.map(u=>u.id)).size===allUnits.length);
const exercises=allUnits.flatMap(u=>[...u.lessons.flatMap(l=>l.exercises),...u.mission]);
check('exercise IDs are unique across new and retained curricula',exercises.length===473&&new Set(exercises.map(e=>e.id)).size===exercises.length);
for(const u of contentUnits){
 check(`${u.id}: every lesson has a learning goal, explanation and speaking/listening support`,u.lessons.every(l=>!!l.canDoFa&&!!l.situationFa&&!!l.patternFa&&!!l.pronunciationFa&&l.examples.length>=3&&l.dialogue.length>=2&&l.examples.every(e=>e.text.trim()&&e.fa.trim())&&l.dialogue.every(d=>d.text.trim()&&d.fa.trim())));
 check(`${u.id}: distinct listening, reading and writing practice in each lesson`,u.lessons.every(l=>l.exercises.length===3&&l.exercises[0].skill==='listening'&&l.exercises[0].kind==='choice'&&!!l.exercises[0].audioText&&!!l.exercises[0].transcriptFa&&l.exercises[1].skill==='reading'&&l.exercises[1].kind==='choice'&&!!l.exercises[1].readingText&&l.exercises[2].skill==='writing'&&l.exercises[2].kind==='write'));
 check(`${u.id}: five fresh mission tasks, each linked to a stated objective`,u.mission.length===5&&u.mission.every(e=>u.objectives.some(o=>o.id===e.objectiveId)));
}
for(const e of exercises){
 check(`${e.id}: nonempty prompt/feedback and a linked objective`,!!e.promptFa?.trim()&&!!e.explanationFa?.trim()&&allUnits.some(u=>u.objectives.some(o=>o.id===e.objectiveId)));
 if(e.kind==='choice')check(`${e.id}: one valid answer and distinct options`,e.choices?.length>=2&&new Set(e.choices.map(x=>x.id)).size===e.choices.length&&new Set(e.choices.map(x=>x.label.trim())).size===e.choices.length&&e.choices.filter(x=>x.id===e.correctChoice).length===1);
 if(e.kind==='write')check(`${e.id}: usable model response`,e.acceptedAnswers?.length>0&&e.acceptedAnswers.includes(e.sample)&&e.acceptedAnswers.every(x=>x.trim()&&x.length<=300));
}
check('Pre-A1 and A1 end checks cover both published learning scopes',c.LEVEL_EXAMS.map(u=>`${u.id}:${u.level}:${u.mission.length}`).join('|')==='de-zero-final:Pre-A1:10|de-a1-final:A1:34');
for(const exam of c.LEVEL_EXAMS){
 check(`${exam.id}: each final question has an actionable repair lesson`,exam.mission.every(e=>{const t=c.repairTarget(exam,e.objectiveId),u=t&&c.findGermanUnit(t.unitId);return !!u&&u.lessons.some(l=>l.id===t.lessonId)}));
 check(`${exam.id}: separate local attempt identity`,c.findGermanUnit(exam.id)?.id===exam.id&&c.unitHref(exam).includes(`exam=${exam.id}`));
}
check('the original 12 legacy German lessons remain available as archived data',c.GERMAN_LESSONS.length===12);
check('active sentence-first German course has four ordered levels and ninety-five lessons',c.GERMAN_SENTENCE_LEVELS.map(l=>l.cefr).join('|')==='Pre-A1|A1|A2|B1'&&c.GERMAN_SENTENCE_LESSONS.length===95);
check('sentence-led Pre-A1 has twenty lessons and one thousand sample sentences',c.GERMAN_SENTENCE_LESSONS.filter(lesson=>lesson.levelId===0).length===20&&c.germanSentenceLevelMetrics(0).sentenceCount===1000);
check('Pre-A1 vocabulary has 396 distinct headword and reusable phrase entries',c.germanSentenceLevelMetrics(0).vocabularyCount===396);
const preA1SentenceLessons=c.GERMAN_SENTENCE_LESSONS.filter(lesson=>lesson.levelId===0);
check('Pre-A1 has twenty ordered 50-sentence modules, accurate long-lesson duration and matching library topics',preA1SentenceLessons.length===20&&preA1SentenceLessons.every((lesson,index)=>lesson.order===index+1&&lesson.sentences.length===50&&lesson.durationMinutes===20&&lesson.title===c.GERMAN_SENTENCE_LEVELS[0].modules[index]));
check('the twelve existing Pre-A1 lesson IDs stay first and eight approved bridge topics follow',preA1SentenceLessons.slice(0,12).map(lesson=>lesson.id).join('|')==='de-v2-greetings|de-v2-name-origin|de-v2-classroom|de-v2-numbers-time|de-v2-basic-needs|de-v2-alphabet|de-v2-countries-languages|de-v2-days-calendar|de-v2-personal-details|de-v2-food-drink|de-v2-objects-colors|de-v2-places-directions'&&preA1SentenceLessons.slice(12).map(lesson=>lesson.id).join('|')==='de-v2-core-verbs-pronouns|de-v2-questions-negation|de-v2-family-basics|de-v2-home-rooms|de-v2-daily-routine-basics|de-v2-shopping-prices|de-v2-feelings-health|de-v2-integrated-dialogues');
const originalPreA1SentenceIds=[
 'de-v2-greetings-s1|de-v2-greetings-s2|de-v2-greetings-s3|de-v2-greetings-s4|de-v2-greetings-s5',
 'de-v2-name-s1|de-v2-name-s2|de-v2-name-s3|de-v2-name-s4|de-v2-name-s5',
 'de-v2-class-s1|de-v2-class-s2|de-v2-class-s3|de-v2-class-s4|de-v2-class-s5',
 'de-v2-number-s1|de-v2-number-s2|de-v2-number-s3|de-v2-number-s4|de-v2-number-s5',
 'de-v2-needs-s1|de-v2-needs-s2|de-v2-needs-s3|de-v2-needs-s4|de-v2-needs-s5',
 'de-v2-alphabet-s1|de-v2-alphabet-s2|de-v2-alphabet-s3|de-v2-alphabet-s4|de-v2-alphabet-s5',
 'de-v2-languages-s1|de-v2-languages-s2|de-v2-languages-s3|de-v2-languages-s4|de-v2-languages-s5',
 'de-v2-days-s1|de-v2-days-s2|de-v2-days-s3|de-v2-days-s4|de-v2-days-s5',
 'de-v2-details-s1|de-v2-details-s2|de-v2-details-s3|de-v2-details-s4|de-v2-details-s5',
 'de-v2-food-s1|de-v2-food-s2|de-v2-food-s3|de-v2-food-s4|de-v2-food-s5',
 'de-v2-objects-s1|de-v2-objects-s2|de-v2-objects-s3|de-v2-objects-s4|de-v2-objects-s5',
 'de-v2-places-s1|de-v2-places-s2|de-v2-places-s3|de-v2-places-s4|de-v2-places-s5',
 'de-v2-core-s1|de-v2-core-s2|de-v2-core-s3|de-v2-core-s4|de-v2-core-s5',
 'de-v2-negation-s1|de-v2-negation-s2|de-v2-negation-s3|de-v2-negation-s4|de-v2-negation-s5',
 'de-v2-family-basic-s1|de-v2-family-basic-s2|de-v2-family-basic-s3|de-v2-family-basic-s4|de-v2-family-basic-s5',
 'de-v2-home-rooms-s1|de-v2-home-rooms-s2|de-v2-home-rooms-s3|de-v2-home-rooms-s4|de-v2-home-rooms-s5',
 'de-v2-routine-basic-s1|de-v2-routine-basic-s2|de-v2-routine-basic-s3|de-v2-routine-basic-s4|de-v2-routine-basic-s5',
 'de-v2-shopping-s1|de-v2-shopping-s2|de-v2-shopping-s3|de-v2-shopping-s4|de-v2-shopping-s5',
 'de-v2-feelings-s1|de-v2-feelings-s2|de-v2-feelings-s3|de-v2-feelings-s4|de-v2-feelings-s5',
 'de-v2-integrated-s1|de-v2-integrated-s2|de-v2-integrated-s3|de-v2-integrated-s4|de-v2-integrated-s5'
];
check('all original five Pre-A1 sentence IDs stay first in their lesson',preA1SentenceLessons.every((lesson,index)=>lesson.sentences.slice(0,5).map(sentence=>sentence.id).join('|')===originalPreA1SentenceIds[index]));
check('each Pre-A1 lesson appends forty-five complete, uniquely worded examples with stable IDs',preA1SentenceLessons.every(lesson=>lesson.sentences.slice(5).length===45&&new Set(lesson.sentences.map(sentence=>sentence.text)).size===50&&lesson.sentences.slice(5).every((sentence,index)=>sentence.id===`${lesson.id}-extra-${String(index+1).padStart(2,'0')}`&&sentence.text&&sentence.fa&&sentence.pronunciation&&!/[A-Za-z]/.test(sentence.pronunciation)&&sentence.vocabulary.length&&sentence.vocabulary.every(entry=>entry.word&&entry.meaning))));
check('Pre-A1 has complete vocabulary presentations for all 1,000 sentence examples',preA1SentenceLessons.flatMap(lesson=>lesson.sentences).length===1000&&preA1SentenceLessons.flatMap(lesson=>lesson.sentences).every(sentence=>sentence.vocabulary.length>0&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim())));
const closingPreA1Lesson=preA1SentenceLessons.at(-1);
check('the final Pre-A1 lesson is a clearly non-scored integrated review',closingPreA1Lesson?.id==='de-v2-integrated-dialogues'&&closingPreA1Lesson.subtitle.includes('بدون نمره')&&closingPreA1Lesson.teachingFa.includes('نه آزمون'));
const a1SentenceLessons=c.GERMAN_SENTENCE_LESSONS.filter(lesson=>lesson.levelId===1);
check('sentence-led A1 has twenty-five lessons, 1,250 sample sentences and 587 unique vocabulary entries',a1SentenceLessons.length===25&&c.germanSentenceLevelMetrics(1).sentenceCount===1250&&c.germanSentenceLevelMetrics(1).vocabularyCount===587);
check('A1 has twenty-five ordered modules with fifty sentences each, 25-minute estimates and updated teaching notes',a1SentenceLessons.every((lesson,index)=>lesson.order===index+1&&lesson.sentences.length===50&&lesson.durationMinutes===25&&lesson.title===c.GERMAN_SENTENCE_LEVELS[1].modules[index]&&lesson.teachingFa.includes('نکتهٔ تکمیلی')));
check('the five original A1 lesson IDs stay first and twenty new A1 topics follow',a1SentenceLessons.slice(0,5).map(lesson=>lesson.id).join('|')==='de-v2-family|de-v2-daily-routine|de-v2-cafe-food|de-v2-shopping|de-v2-city-transport'&&a1SentenceLessons.slice(5).map(lesson=>lesson.id).join('|')==='de-v2-a1-home-neighborhood|de-v2-a1-work-day|de-v2-a1-calendar-appointments|de-v2-a1-free-time|de-v2-a1-weather-seasons|de-v2-a1-health-appointment|de-v2-a1-travel-hotel|de-v2-a1-language-class|de-v2-a1-contact-forms|de-v2-a1-invitations|de-v2-a1-weekend-past|de-v2-a1-clothing-shopping|de-v2-a1-food-preferences|de-v2-a1-post-office|de-v2-a1-describing-people-things|de-v2-a1-household-tasks|de-v2-a1-train-station|de-v2-a1-phone-messages|de-v2-a1-lost-and-found|de-v2-a1-integrated-conversation');
const originalA1SentenceFingerprints=[
 ['de-v2-family','724ca87b42334434f2bfe856461df5c1d9af813d831da33d67814d72bb81cd58'],
 ['de-v2-daily-routine','a62edef50507ff2589fedb235cf5282fc15984b3a505a7106cb0758e82de76b3'],
 ['de-v2-cafe-food','0d05a36843e480671c977d9bad42c580a3958612fddcf103c2ab12b5567508fa'],
 ['de-v2-shopping','8d547e2ba0f071b70e191c2e6e0b93cb1a0ac21b7d71767d14c2c2e8b9d15929'],
 ['de-v2-city-transport','878485e64c77e649046ffa138cd00eb5d49d6781b33ff614e99f79e5aecd7e17'],
 ['de-v2-a1-home-neighborhood','a26adb82963db5a24d7960935f78f315259d99948d62f500f39816be663626fb'],
 ['de-v2-a1-work-day','76fcbebc82132f4a86a3bedf156bdb91557bbcef8bc62b4da3f9e346897d695e'],
 ['de-v2-a1-calendar-appointments','04766a0ea4fccf9602aeca0b43f7308c7cb0fd59051acae174da4a4becce0dc0'],
 ['de-v2-a1-free-time','e06c5ac6be2b8c5e10796849b62de5ae870cf5228feb86abd5f7646c359d4e6b'],
 ['de-v2-a1-weather-seasons','05bba232466d8b012c3054d313ceef3805603ba67eb1de9b44d2504bba35cce2'],
 ['de-v2-a1-health-appointment','104e2f4386d797d3e7cbbfbc0dc983d38bdd2b323c5f12c20235f033d64c003f'],
 ['de-v2-a1-travel-hotel','3a5bdebda29ca1d554119fa6d5f47affe6c75780544f4633aa351c9816acbba5'],
 ['de-v2-a1-language-class','dac57c3951dc12b46bee7db6626d108a8837fcbcce96e0d5304374e88bfb73b2'],
 ['de-v2-a1-contact-forms','4ee9774bff4d26078d91c728b4b1417ea3dd0f5b7826ebce18c4a3eba05ff768'],
 ['de-v2-a1-invitations','3532e7f43df3e7043ea2fc7cf529a4b323f97213fc9a436881a7dc1ca3469845'],
 ['de-v2-a1-weekend-past','3c67ca713391f9d123466e8e899d3edb5fb32dec0650f10a636c7edc71651e84'],
 ['de-v2-a1-clothing-shopping','3734cbd72d18f3fe90e6c5007560f4d05b5a641178aca5cd0e96451a8367648c'],
 ['de-v2-a1-food-preferences','13f779edf1269f024216cd42816f627e7b3984b4bf5ccb04917878991469b22f'],
 ['de-v2-a1-post-office','716e5aade8f793109e98a6e890edc2804a9787cdda391e25c37ec63bc1ea183e'],
 ['de-v2-a1-describing-people-things','b90cbfc5c7c89d5ffadab2e2fb5cc099943e674889e0a2840594b02c2dab5689'],
 ['de-v2-a1-household-tasks','2757a438b1921d883e93b7d166fdb4e234e0a85563d06dfbdbd5fb131ed68e70'],
 ['de-v2-a1-train-station','ecdcb0f06f9469792b7a8216d2e805712ea8775501a801163b4c0b64fe94fc1d'],
 ['de-v2-a1-phone-messages','fe1b414ae13b8f69cf7727999cbdf6d8a9e5a4ae8e68977ad5684e1b511ff1d1'],
 ['de-v2-a1-lost-and-found','e8bd9fe5b7c7905f15f635555c43acbbb3ce194b810f51f0c75d5ae8146055d7'],
 ['de-v2-a1-integrated-conversation','e0d420abd94882d441bc2d43d800037081d3738f8779add664754496e1166c8d'],
];
check('all 125 original A1 samples, translations, pronunciation and vocabulary are unchanged',a1SentenceLessons.every((lesson,index)=>lesson.id===originalA1SentenceFingerprints[index][0]&&crypto.createHash('sha256').update(JSON.stringify(lesson.sentences.slice(0,5))).digest('hex')===originalA1SentenceFingerprints[index][1]));
check('each A1 lesson appends forty-five unique complete examples with stable IDs and Persian pronunciation',a1SentenceLessons.every(lesson=>lesson.sentences.slice(5).length===45&&new Set(lesson.sentences.map(sentence=>sentence.text)).size===50&&lesson.sentences.slice(5).every((sentence,index)=>sentence.id===`${lesson.id}-extra-${String(index+1).padStart(2,'0')}`&&sentence.text&&sentence.fa&&sentence.pronunciation&&!/[A-Za-z]/.test(sentence.pronunciation)&&sentence.vocabulary.length&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim()))));
const appendedA1Sentences=a1SentenceLessons.flatMap(lesson=>lesson.sentences.slice(5));
const originalA1SentenceTexts=new Set(a1SentenceLessons.flatMap(lesson=>lesson.sentences.slice(0,5)).map(sentence=>sentence.text));
check('all 1,125 appended A1 examples are text-unique across lessons and do not repeat original A1 samples',appendedA1Sentences.length===1125&&new Set(appendedA1Sentences.map(sentence=>sentence.text)).size===1125&&appendedA1Sentences.every(sentence=>!originalA1SentenceTexts.has(sentence.text)));
check('all 1,250 A1 examples have complete, non-empty vocabulary presentations',a1SentenceLessons.flatMap(lesson=>lesson.sentences).length===1250&&a1SentenceLessons.flatMap(lesson=>lesson.sentences).every(sentence=>sentence.vocabulary.length>0&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim())));
const a2SentenceLessons=c.GERMAN_SENTENCE_LESSONS.filter(lesson=>lesson.levelId===2);
const originalA2SentenceFingerprints=[
 ['de-v2-weekend-past','2d88146906d9f7a4e7588086c11cf546050eaf55466003e47e70e3c85c745dd5'],
 ['de-v2-travel-stay','e920817d691b115ca8b62cfbd2252ca9ddd46fcd2b3799a497721a14e5d1473e'],
 ['de-v2-health-appointment','b92158fcdf976f3cbe7b9441aa977b1d47997abb42392a76f33309db180fe4d4'],
 ['de-v2-home-services','52fc0f76a92d88178c190238e9706688d72628265ea761375be9c73f6689d17c'],
 ['de-v2-invitations-plans','0d28b59dc1d605476e2dc2e308df10c4f2fe6c63769ec475735b062b121cede6'],
 ['de-v2-a2-commuting','668d460c64d59bc1d606f8fed4af5fa5e76145abbf9aa1fe84ac94d51ae5f81a'],
 ['de-v2-a2-work-colleagues','8ecc2c47b58ba4751ab59314d7246885e30df55383a6557c44e9bd6991ea6f53'],
 ['de-v2-a2-learning-course','e2feb494da67cf0232f8677493a3b0339d552e157a270d1abad6cad116f599b2'],
 ['de-v2-a2-shopping-returns','0f1f19322b6a03e9fb2f85a5f90428b67de6e470ab203713a77ab8fa16e8220d'],
 ['de-v2-a2-cooking','a2fdab82ad2d4474989d46bfc5f1294f7744317236f103a8b2d3305d555ea211'],
 ['de-v2-a2-digital-life','98c575c1a180555c0bc533cacaac73a79fb87b1c6fdd9abd5db8075cc1ce5094'],
 ['de-v2-a2-public-services','7892cb32f49cac030c46f4bf474cd35d192a96eb1910d62442b2264e386d631a'],
 ['de-v2-a2-moving-home','97806928a74dff3db619e470929464aa24d63f8436e56f8d7cd575e7a25adcf6'],
 ['de-v2-a2-trip-planning','95e9832d8b9b15a8aa53a2598234da330be9941b202ec17afd713fc105f0951c'],
 ['de-v2-a2-travel-memory','db9795dd59601bc9d52ea0d48b889875fc28d68f1170075cc2e5add6c32b9667'],
 ['de-v2-a2-weather-environment','d7acfe5a07e4c7aaeca6ab6df6f189ed59901f821fe3dbe60f1af2d7ce82b43f'],
 ['de-v2-a2-family-celebration','d23c553332e6b7bf283ab93abed3194d574baf842bb49d01fa7dae8a3ccc6055'],
 ['de-v2-a2-culture-events','aed12946c4a3e7560d8bb089b1b92470787a997867782d2e19ca4bfa3d41a90c'],
 ['de-v2-a2-health-habits','155b3a5e0fdab6176e4f1dfe8917b1fc50ed18bcc708434fd561fe4aa4db02a7'],
 ['de-v2-a2-home-problem-solving','53b53a40103aa218278766355f4b002a83d7dd86c0f1a9d6ec26b29e9958c7e0'],
 ['de-v2-a2-scheduling','e55d9be949b597aee0f327be9acfb1c7c51213ae13c21a1f4164e962d1631786'],
 ['de-v2-a2-compare-options','634870cb955996a4e9fc8c71acbb85af0a542e489f82de9139eb803594a12763'],
 ['de-v2-a2-experience-opinion','33812ef111ea2894ead6fc3ff6008f975c90c217328cce40923dad2ba906b84c'],
 ['de-v2-a2-city-visit','0234e266cf28ab52f62a99d08cd8046ec4d05844a3d8c72c03b0c22e9b8f7bc3'],
 ['de-v2-a2-integrated-conversation','4627661bd93b201c1cd8f4292f1ef084fd8a0ebaa04cdc42ff9030d3b54d5594'],
];
check('sentence-led A2 has twenty-five lessons, 1,250 examples and 716 unique vocabulary entries',a2SentenceLessons.length===25&&c.germanSentenceLevelMetrics(2).sentenceCount===1250&&c.germanSentenceLevelMetrics(2).vocabularyCount===716);
check('A2 lessons are sequential, fifty sentences each, dialogue-supported and aligned to all 25 topic labels',a2SentenceLessons.length===25&&c.GERMAN_SENTENCE_LEVELS[2].modules.length===25&&a2SentenceLessons.every((lesson,index)=>lesson.order===index+1&&lesson.sentences.length===50&&lesson.durationMinutes===30&&lesson.teachingFa.includes('نکتهٔ تکمیلی')&&lesson.dialogue.length>=3&&(index<5||lesson.title===c.GERMAN_SENTENCE_LEVELS[2].modules[index])));
check('all twenty-five original A2 samples, translations, pronunciation and vocabulary remain unchanged',a2SentenceLessons.every((lesson,index)=>lesson.id===originalA2SentenceFingerprints[index][0]&&crypto.createHash('sha256').update(JSON.stringify(lesson.sentences.slice(0,5))).digest('hex')===originalA2SentenceFingerprints[index][1]));
check('each A2 lesson appends forty-five unique complete examples with stable IDs and Persian pronunciation',a2SentenceLessons.every(lesson=>lesson.sentences.slice(5).length===45&&new Set(lesson.sentences.map(sentence=>sentence.text)).size===50&&lesson.sentences.slice(5).every((sentence,index)=>sentence.id===`${lesson.id}-extra-${String(index+1).padStart(2,'0')}`&&sentence.text&&sentence.fa&&sentence.pronunciation&&!/[A-Za-z]/.test(sentence.pronunciation)&&sentence.vocabulary.length&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim()))));
const appendedA2Sentences=a2SentenceLessons.flatMap(lesson=>lesson.sentences.slice(5));
check('all 1,125 appended A2 examples are text-unique across lessons',appendedA2Sentences.length===1125&&new Set(appendedA2Sentences.map(sentence=>sentence.text)).size===1125);
check('the original five A2 lesson IDs stay first and twenty new everyday modules follow',a2SentenceLessons.slice(0,5).map(lesson=>lesson.id).join('|')==='de-v2-weekend-past|de-v2-travel-stay|de-v2-health-appointment|de-v2-home-services|de-v2-invitations-plans'&&a2SentenceLessons.slice(5).map(lesson=>lesson.id).join('|')==='de-v2-a2-commuting|de-v2-a2-work-colleagues|de-v2-a2-learning-course|de-v2-a2-shopping-returns|de-v2-a2-cooking|de-v2-a2-digital-life|de-v2-a2-public-services|de-v2-a2-moving-home|de-v2-a2-trip-planning|de-v2-a2-travel-memory|de-v2-a2-weather-environment|de-v2-a2-family-celebration|de-v2-a2-culture-events|de-v2-a2-health-habits|de-v2-a2-home-problem-solving|de-v2-a2-scheduling|de-v2-a2-compare-options|de-v2-a2-experience-opinion|de-v2-a2-city-visit|de-v2-a2-integrated-conversation');
check('A2 vocabulary entries are complete, with original richer lists retained in all twenty added lessons',a2SentenceLessons.flatMap(lesson=>lesson.sentences).every(sentence=>sentence.vocabulary.length>0&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim()))&&a2SentenceLessons.slice(5).flatMap(lesson=>lesson.sentences.slice(0,5)).every(sentence=>sentence.vocabulary.length>=4));
const b1SentenceLessons=c.GERMAN_SENTENCE_LESSONS.filter(lesson=>lesson.levelId===3);
const originalB1SentenceFingerprints=[
 ['de-v2-opinions-reasons','af1ad4529247178260c058cc695376df14a7538dfd246e6160e614d7989558fe'],
 ['de-v2-work-experience','d1b0d312266c66188e67878eec5ff0c5819d91ba210492aceb4a0c9faede0809'],
 ['de-v2-complaint-solution','8addc4631955b27668dd217489d8822b9a066e134a71e5809038bccae1d9277e'],
 ['de-v2-news-and-change','f9a81726c0278b96abf2ca86cce9a72cad544e0e363247e11b34bace26a6a294'],
 ['de-v2-learning-future','ec67586d3e23bbf7510a43ee34b0055eee2d42280d2c114d970371dcbec9248c'],
 ['de-v2-b1-team-meetings','41ced725f0890c2a9e9c7126f7c77351bdde0fb187c2a75240c9a894b2e36e69'],
 ['de-v2-b1-career-interview','cd9bf6102292c1fbf77eb3a2619e11a24a3df1a496ea8b7dc00a6e75a50719a5'],
 ['de-v2-b1-budget-decisions','4eb61f0efffa2bac545f537b4a4546c2bca601d390da62d840216574abae0b7a'],
 ['de-v2-b1-neighborhood-agreements','9d83822efe8cc58ff76b9b4d17d708c83553c47bd68e1bd7f974139b1197194f'],
 ['de-v2-b1-travel-disruptions','1ca0d6d5ba38846c2af784e495f84a1f3f4601322ba06e7a798c1c64f19f1fcf'],
 ['de-v2-b1-personal-experience','74bab48746a32d96aef33ac8281c14c4cf321d4ad35a7539b614e5dd3408bba0'],
 ['de-v2-b1-continuing-education','bfa301c45892192fb034b2e0b4072dc572ad2cbb54b8d3099a74f818474a2056'],
 ['de-v2-b1-health-care','e2924877d6ee54aae5bc71c695d354affb20c0986580f3a80423f72dd70f2a41'],
 ['de-v2-b1-digital-privacy','99d019710567f457f9e82416c3404d84ff88f5650b36dcb906f8e63dd132d41a'],
 ['de-v2-b1-sustainable-choices','3ec1d42d951117d03334b0e1a4ab94a3aa2a9d91dcf7d29f6dc3e9ca04f2e86e'],
 ['de-v2-b1-news-and-sources','4e1f11c63b345da08bdf7ca8452b90171a2284f0d931c7fdc6bbc6095f8f33b0'],
 ['de-v2-b1-culture-review','1a257289efbaea04ba6f4ba1211577fb10d067b09fb12dd5057e0be258981007'],
 ['de-v2-b1-communication-misunderstanding','05eb3bd54b7fc121a1cb0f5d74a192250f2b04fc590da81fae3362d1b418e6d0'],
 ['de-v2-b1-volunteering-community','cae749a77162790952365c7f9aec2b900c16e025691c54d38824c458847a4692'],
 ['de-v2-b1-conflict-resolution','e8bc234673ab58308c557c597ec77e9202a6ce1a288f3a0f82f518b709c07c1f'],
 ['de-v2-b1-personal-goals','2056214fa368c1d69079a462f9c74ba14cbfcf39eae3e6aa80a8f1506a4b62c0'],
 ['de-v2-b1-conditions-alternatives','c5b36f024cbe197d34e0425cc07e5a1c46802f8fadf1aca47807c813a383286f'],
 ['de-v2-b1-process-instructions','2694cdcc6025319b02fdc8864a5fb1efeef1f7966e003980d7f698e7d931b9c2'],
 ['de-v2-b1-formal-correspondence','05485f2f53a4cd2d2996e7f1af00595d548cc2e6775d0ceb7f52d7ba8fba798a'],
 ['de-v2-b1-integrated-conversation','503979647735d89cb4b2f748d24dcbd2b586ba0bfdca8b734211f1ec39bb17fa'],
];
check('B1 has twenty-five lessons, 1,250 examples and 734 unique vocabulary entries',b1SentenceLessons.length===25&&c.germanSentenceLevelMetrics(3).sentenceCount===1250&&c.germanSentenceLevelMetrics(3).vocabularyCount===734);
check('B1 preserves its original five lesson IDs before twenty ordered new topics',b1SentenceLessons.slice(0,5).map(lesson=>lesson.id).join('|')==='de-v2-opinions-reasons|de-v2-work-experience|de-v2-complaint-solution|de-v2-news-and-change|de-v2-learning-future'&&b1SentenceLessons.slice(5).map(lesson=>lesson.id).join('|')==='de-v2-b1-team-meetings|de-v2-b1-career-interview|de-v2-b1-budget-decisions|de-v2-b1-neighborhood-agreements|de-v2-b1-travel-disruptions|de-v2-b1-personal-experience|de-v2-b1-continuing-education|de-v2-b1-health-care|de-v2-b1-digital-privacy|de-v2-b1-sustainable-choices|de-v2-b1-news-and-sources|de-v2-b1-culture-review|de-v2-b1-communication-misunderstanding|de-v2-b1-volunteering-community|de-v2-b1-conflict-resolution|de-v2-b1-personal-goals|de-v2-b1-conditions-alternatives|de-v2-b1-process-instructions|de-v2-b1-formal-correspondence|de-v2-b1-integrated-conversation');
check('B1 lessons are sequential, fifty sentences each, with duration and lesson-specific teaching notes',b1SentenceLessons.length===25&&c.GERMAN_SENTENCE_LEVELS[3].modules.length===25&&b1SentenceLessons.every((lesson,index)=>lesson.order===index+1&&lesson.sentences.length===50&&lesson.durationMinutes===35&&lesson.teachingFa.includes('نکتهٔ تکمیلی')&&lesson.dialogue.length>=3&&(index<5||lesson.title===c.GERMAN_SENTENCE_LEVELS[3].modules[index]))&&b1SentenceLessons.slice(5).flatMap(lesson=>lesson.sentences.slice(0,5)).every(sentence=>sentence.vocabulary.length>=4&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim())));
check('all twenty-five original B1 samples, translations, pronunciation and vocabulary remain unchanged',b1SentenceLessons.every((lesson,index)=>lesson.id===originalB1SentenceFingerprints[index][0]&&crypto.createHash('sha256').update(JSON.stringify(lesson.sentences.slice(0,5))).digest('hex')===originalB1SentenceFingerprints[index][1]));
check('each B1 lesson appends forty-five unique complete examples with stable IDs and Persian pronunciation',b1SentenceLessons.every(lesson=>lesson.sentences.slice(5).length===45&&new Set(lesson.sentences.map(sentence=>sentence.text)).size===50&&lesson.sentences.slice(5).every((sentence,index)=>sentence.id===`${lesson.id}-extra-${String(index+1).padStart(2,'0')}`&&sentence.text&&sentence.fa&&sentence.pronunciation&&!/[A-Za-z]/.test(sentence.pronunciation)&&sentence.vocabulary.length>0&&sentence.vocabulary.every(entry=>entry.word.trim()&&entry.meaning.trim()))));
const appendedB1Sentences=b1SentenceLessons.flatMap(lesson=>lesson.sentences.slice(5));
check('all 1,125 appended B1 examples are text-unique across lessons',appendedB1Sentences.length===1125&&new Set(appendedB1Sentences.map(sentence=>sentence.text)).size===1125);
check('B1 closing conversation remains a non-scored learning recap, not a certificate',b1SentenceLessons.at(-1)?.id==='de-v2-b1-integrated-conversation'&&b1SentenceLessons.at(-1).teachingFa.includes('بدون نمره')&&b1SentenceLessons.at(-1).teachingFa.includes('نه آزمون'));
check('the A2 capstone is a non-scored integrated conversation, not an exam or certificate',a2SentenceLessons.at(-1)?.id==='de-v2-a2-integrated-conversation'&&a2SentenceLessons.at(-1).teachingFa.includes('بدون نمره')&&a2SentenceLessons.at(-1).teachingFa.includes('نه آزمون'));
const appendedUpperSentenceExamples=[...appendedA2Sentences,...appendedB1Sentences];
const preservedSentenceTexts=new Set(c.GERMAN_SENTENCE_LESSONS.flatMap(lesson=>lesson.levelId<2?lesson.sentences:lesson.sentences.slice(0,5)).map(sentence=>sentence.text));
check('all 2,250 new A2/B1 sentences are globally unique and do not duplicate preserved course examples',appendedUpperSentenceExamples.length===2250&&new Set(appendedUpperSentenceExamples.map(sentence=>sentence.text)).size===2250&&appendedUpperSentenceExamples.every(sentence=>!preservedSentenceTexts.has(sentence.text)));
const previouslyCompletedA2AndEarlier=c.GERMAN_SENTENCE_LESSONS.filter(lesson=>lesson.levelId<2).map(lesson=>lesson.id).concat(a2SentenceLessons.slice(0,5).map(lesson=>lesson.id));
const savedB1Lesson=c.GERMAN_SENTENCE_LESSONS.find(lesson=>lesson.levelId===3);
check('returning learners with a saved B1 lesson are guided to new unfinished A2 content first',c.getGermanSentenceResumeLesson(savedB1Lesson.id,previouslyCompletedA2AndEarlier).id==='de-v2-a2-commuting');
const closingA1Lesson=a1SentenceLessons.at(-1);
check('the final A1 lesson is a non-scored integrated conversation, not an exam or certificate',closingA1Lesson?.id==='de-v2-a1-integrated-conversation'&&closingA1Lesson.teachingFa.includes('بدون نمره')&&closingA1Lesson.teachingFa.includes('نه آزمون'));
const sentenceCourseExamples=c.GERMAN_SENTENCE_LESSONS.flatMap(lesson=>lesson.sentences);
check('German sentence catalog has 4,750 unique examples with translation, pronunciation and vocabulary',sentenceCourseExamples.length===4750&&new Set(sentenceCourseExamples.map(sentence=>sentence.id)).size===4750&&sentenceCourseExamples.every(sentence=>sentence.text&&sentence.fa&&sentence.pronunciation&&sentence.vocabulary.length&&sentence.vocabulary.every(word=>word.word&&word.meaning)));
check('new German lessons provide dialogue examples for sentence-in-context practice',c.GERMAN_SENTENCE_LESSONS.every(lesson=>lesson.dialogue.length>=3&&lesson.dialogue.every(line=>line.text&&line.fa)));
check('A1 coverage map links all three completed bridge units',['de-a1-core-verbs','de-a1-services','de-a1-together'].every(id=>c.A1_COVERAGE.some(a=>a.units.includes(id))));
check('level final checks are transparently not named certifications',c.LEVEL_EXAMS.every(u=>!/(certificat|Zertifikat|CEFR bestanden)/i.test(u.title+' '+u.oralMissionFa)));
console.log(`${passed} German sentence-course foundation, A1, A2 and B1 checks passed (structural/editorial regression only; no independent teacher or CEFR accreditation claimed).`);
