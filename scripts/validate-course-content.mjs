import fs from 'node:fs';
import path from 'node:path';

import { buildSync } from 'esbuild';
import { createRequire } from 'node:module';

const root = process.cwd();
const canonical = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/essential504.json'), 'utf8'));
const bundle = path.join(root, 'node_modules/.cache/course-validation.cjs');

// Validate executed course data, not a formatting-dependent source regex.
buildSync({
  entryPoints: [path.join(root, 'lib/courseContent.ts')],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: bundle,
});

const {
  SENTENCE_LESSONS,
  EVERYDAY_COURSE_LESSON_IDS,
  COMMUNICATION_COURSE_LESSON_IDS,
  COMMUNICATION_MODULES,
} = createRequire(import.meta.url)(bundle);
const tagged = SENTENCE_LESSONS.flatMap(lesson => lesson.sentences
  .flatMap(sentence => sentence.vocabulary.filter(item => item.essential504).map(item => item.word)));
const lessonRecords = SENTENCE_LESSONS.map(({ id, order }) => ({ id, order }));
const foundation = SENTENCE_LESSONS.filter(lesson => lesson.levelId === 0);
const survival = SENTENCE_LESSONS.filter(lesson => lesson.levelId === 1);
const everyday = SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2);
const communication = SENTENCE_LESSONS.filter(lesson => lesson.levelId === 3);
const sentenceCount = SENTENCE_LESSONS.reduce((sum, lesson) => sum + lesson.sentences.length, 0);
const foundationSentenceCount = foundation.reduce((sum, lesson) => sum + lesson.sentences.length, 0);
const survivalSentenceCount = survival.reduce((sum, lesson) => sum + lesson.sentences.length, 0);
const everydaySentenceCount = everyday.reduce((sum, lesson) => sum + lesson.sentences.length, 0);
const communicationSentenceCount = communication.reduce((sum, lesson) => sum + lesson.sentences.length, 0);
const survivalVocabulary = new Set(survival.flatMap(lesson => lesson.sentences
  .flatMap(sentence => sentence.vocabulary.map(item => item.word))));
const everydayVocabulary = new Set(everyday.flatMap(lesson => lesson.sentences
  .flatMap(sentence => sentence.vocabulary.map(item => item.word))));
const communicationVocabulary = new Set(communication.flatMap(lesson => lesson.sentences
  .flatMap(sentence => sentence.vocabulary.map(item => item.word))));
const canonicalSet = new Set(canonical);
const duplicateWords = [...new Set(tagged.filter((word, index) => tagged.indexOf(word) !== index))];
const outside = tagged.filter(word => !canonicalSet.has(word));
const missing = canonical.filter(word => !tagged.includes(word));
const duplicateLessonIds = [...new Set(lessonRecords.map(lesson => lesson.id)
  .filter((id, index, ids) => ids.indexOf(id) !== index))];
const duplicateOrders = [...new Set(lessonRecords.map(lesson => lesson.order)
  .filter((order, index, orders) => orders.indexOf(order) !== index))];
const lessonOrders = lessonRecords.map(lesson => lesson.order).sort((a, b) => a - b);
const expectedOrders = Array.from({ length: 174 }, (_, index) => index + 1);
const hasExactOrders = JSON.stringify(lessonOrders) === JSON.stringify(expectedOrders);
const activeSentencesById = new Map(SENTENCE_LESSONS.flatMap(lesson => lesson.sentences.map(sentence => [sentence.id, sentence])));
const reviewedEditorialExamples = [
  { id: 'advanced-canonical-practice-72-practice-1', en: 'With a loud shriek, Ronald fled from the room.', fa: 'رونالد با جیغی بلند از اتاق گریخت.', word: 'shriek', meaning: 'جیغ بلند' },
  { id: 'advanced-canonical-practice-127-maintain', en: 'Angelo maintained his hold on the jagged rock though his fingers were becoming numb.', fa: 'با اینکه انگشتان آنجلو کم‌کم بی‌حس می‌شدند، او صخرهٔ ناهموار را محکم نگه داشته بود.', word: 'maintain', meaning: 'محکم نگه‌داشتن؛ حفظ کردن' },
  { id: 'advanced-canonical-practice-127-snub', en: 'Darryl later apologized to Sally for snubbing her at the dance.', fa: 'داریل بعدتر بابت بی‌اعتنایی به سالی در مهمانی رقص، از او عذرخواهی کرد.', word: 'snub', meaning: 'بی‌اعتنایی کردن' },
  { id: 'advanced-canonical-practice-127-wrath', en: "Anticipating Father's wrath, we tried to give him the news slowly.", fa: 'چون انتظار خشم پدر را داشتیم، سعی کردیم خبر را آرام‌آرام به او بگوییم.', word: 'wrath', meaning: 'خشم' },
  { id: 'advanced-canonical-practice-127-practice-1', en: 'The judge maintained his opinion that the verdict was fair.', fa: 'قاضی بر نظر خود مبنی بر عادلانه بودن حکم پافشاری کرد.', word: 'maintained', meaning: 'بر نظر خود پافشاری کردن' },
  { id: 'advanced-canonical-practice-127-practice-2', en: 'Sandra was tormented by the thought that she might be snubbed by her classmates.', fa: 'ساندرا از این فکر که ممکن است همکلاسی‌هایش به او بی‌اعتنایی کنند، رنج می‌برد.', word: 'snubbed', meaning: 'بی‌اعتنایی کردن' },
  { id: 'farm-share', en: 'Cooperation helps us share equipment and lower costs.', fa: 'همکاری کمک می‌کند تجهیزات را به‌اشتراک بگذاریم و هزینه‌ها را کاهش دهیم.', word: 'cooperation', meaning: 'همکاری' },
  { id: 'route-together', en: 'Stay together on the trail and follow the marked signs.', fa: 'در مسیر پیاده‌روی کنار هم بمانید و تابلوهای راهنما را دنبال کنید.', word: 'trail', meaning: 'مسیر پیاده‌روی' },
  { id: 'behavior-calm', en: 'Let us lower our voices and continue calmly.', fa: 'بیایید صدایمان را پایین بیاوریم و آرام ادامه دهیم.', word: 'lower our voices', meaning: 'صدایمان را پایین آوردن' },
  { id: 'biography-lesson', en: 'Her reputation changed after the biography was published.', fa: 'پس از انتشار زندگی‌نامه، شهرت او تغییر کرد.', word: 'reputation', meaning: 'اعتبار و شهرت' },
  { id: 'court-answer', en: 'As a witness, answer only the question you are asked.', fa: 'به‌عنوان شاهد، فقط به پرسشی پاسخ دهید که از شما می‌پرسند.', word: 'witness', meaning: 'شاهد' },
  { id: 'wholesale-review', en: 'Include storage costs in the monthly review.', fa: 'هزینه‌های انبارداری را در بررسی ماهانه لحاظ کنید.', word: 'storage', meaning: 'انبارداری' },
  { id: 'safety-report', en: 'Provide a safe, private way to report harassment.', fa: 'برای گزارش آزار و اذیت، راهی امن و محرمانه فراهم کنید.', word: 'harassment', meaning: 'مزاحمت و آزار' },
  { id: 'sample-repeat', en: 'Repeat the test with a fresh sample before drawing a conclusion.', fa: 'پیش از نتیجه‌گیری، آزمایش را با نمونه‌ای تازه تکرار کنید.', word: 'sample', meaning: 'نمونه' },
];
const reviewedEditorialExamplesAreStable = reviewedEditorialExamples.every(expected => {
  const sentence = activeSentencesById.get(expected.id);
  return sentence?.en === expected.en && sentence.fa === expected.fa
    && sentence.en.toLowerCase().includes(expected.word.toLowerCase())
    && sentence.vocabulary.some(item => item.word === expected.word && item.meaning === expected.meaning);
});
const normalizeEnglish = text => text.trim().toLowerCase()
  .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ');
const advanced = SENTENCE_LESSONS.filter(lesson => lesson.levelId === 4);
const advancedSentences = advanced.flatMap(lesson => lesson.sentences);
const advancedUniqueSentenceIds = new Set(advancedSentences.map(sentence => sentence.id));
const advancedUniqueExampleTexts = new Set(advancedSentences.map(sentence => normalizeEnglish(sentence.en)));
const advancedExamplesAreComplete = advanced.every(lesson => lesson.sentences.length > 0
  && lesson.sentences.every(sentence => sentence.id?.trim() && sentence.en?.trim() && sentence.fa?.trim()
    && sentence.pronunciation?.trim() && sentence.vocabulary.length > 0
    && sentence.vocabulary.every(item => item.word?.trim() && item.meaning?.trim())));
const everydayExamples = everyday.flatMap(lesson => lesson.sentences.map(sentence => normalizeEnglish(sentence.en)));
const everydayExampleSet = new Set(everydayExamples);
const everydayOriginalLessonIds = new Set(EVERYDAY_COURSE_LESSON_IDS.slice(0, 5));
const everydayAdditionKeys = new Set(everyday.flatMap(lesson => {
  const originalCount = everydayOriginalLessonIds.has(lesson.id) ? 6 : 10;
  return lesson.sentences.slice(originalCount).map(sentence => `${lesson.id}:${sentence.id}`);
}));
const communicationAdditionKeys = new Set(communication.flatMap((lesson, index) =>
  lesson.sentences.slice(index >= 9 ? 0 : 6).map(sentence => `${lesson.id}:${sentence.id}`)));
const allEnglishSentenceGroups = new Map();
for (const lesson of SENTENCE_LESSONS) {
  for (const sentence of lesson.sentences) {
    const key = normalizeEnglish(sentence.en);
    allEnglishSentenceGroups.set(key, [...(allEnglishSentenceGroups.get(key) ?? []), {
      lessonId: lesson.id,
      sentenceId: sentence.id,
      isEverydayAddition: everydayAdditionKeys.has(`${lesson.id}:${sentence.id}`),
      isCommunicationAddition: communicationAdditionKeys.has(`${lesson.id}:${sentence.id}`),
    }]);
  }
}
const duplicateGroupsInvolvingEverydayAdditions = [...allEnglishSentenceGroups.values()]
  .filter(group => group.length > 1 && group.some(item => item.isEverydayAddition));
const duplicateGroupsInvolvingCommunicationAdditions = [...allEnglishSentenceGroups.values()]
  .filter(group => group.length > 1 && group.some(item => item.isCommunicationAddition));
const everydayAdditionsAreComplete = everyday.every(lesson => {
  const originalCount = everydayOriginalLessonIds.has(lesson.id) ? 6 : 10;
  const additions = lesson.sentences.slice(originalCount);
  return additions.length === 50 - originalCount && additions.every(sentence => sentence.en && sentence.fa
    && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length >= 2
    && sentence.vocabulary.every(item => item.word && item.meaning
      && sentence.en.toLowerCase().includes(item.word.toLowerCase())));
});
const communicationAdditionsAreComplete = communication.length === COMMUNICATION_COURSE_LESSON_IDS.length
  && communication.every((lesson, index) => {
    const additions = lesson.sentences.slice(6);
    return lesson.id === COMMUNICATION_COURSE_LESSON_IDS[index]
      && lesson.sentences.length === 50 && additions.length === 44
      && additions.every(sentence => sentence.en && sentence.fa && sentence.pronunciation && sentence.pattern
        && sentence.vocabulary.length >= 2
        && sentence.vocabulary.every(item => item.word && item.meaning
          && sentence.en.toLowerCase().includes(item.word.toLowerCase())));
  });
const communicationNewSeedsAreComplete = communication.slice(9).every(lesson => lesson.sentences.slice(0, 6)
  .every(sentence => sentence.fa && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length >= 2
    && sentence.vocabulary.every(item => item.word && item.meaning
      && sentence.en.toLowerCase().includes(item.word.toLowerCase()))));
const communicationUnitLessonIds = COMMUNICATION_MODULES.flatMap(unit => unit.lessonIds);
const communicationUnitByLessonId = new Map(COMMUNICATION_MODULES.flatMap(unit => unit.lessonIds.map(id => [id, unit])));
const communicationModulesAreComplete = COMMUNICATION_MODULES.length === 8
  && communicationUnitLessonIds.length === COMMUNICATION_COURSE_LESSON_IDS.length
  && new Set(communicationUnitLessonIds).size === COMMUNICATION_COURSE_LESSON_IDS.length
  && COMMUNICATION_COURSE_LESSON_IDS.every(id => communicationUnitByLessonId.has(id))
  && communication.every(lesson => {
    const unit = communicationUnitByLessonId.get(lesson.id);
    return !!unit && lesson.unitId === unit.id && lesson.unitTitle === unit.titleFa
      && lesson.unitTitleEn === unit.titleEn;
  });

console.log(`Lessons: ${lessonRecords.length}/174; sentences: ${sentenceCount}/3862`);
console.log(`Foundation: ${foundation.length}/10 lessons; ${foundationSentenceCount}/500 sentences`);
console.log(`Survival: ${survival.length}/19 lessons; ${survivalSentenceCount}/950 sentences; ${survivalVocabulary.size} unique vocabulary entries`);
console.log(`Everyday: ${everyday.length}/20 lessons; ${everydaySentenceCount}/1000 sentences; ${everydayVocabulary.size} linked vocabulary phrases`);
console.log(`Communication: ${communication.length}/15 lessons; ${communicationSentenceCount}/750 sentences; ${communicationVocabulary.size} linked vocabulary phrases`);
console.log(`Communication structure: ${COMMUNICATION_MODULES.length} thematic units; new lesson seeds linked: ${communicationNewSeedsAreComplete ? 'PASS' : 'FAIL'}`);
console.log(`Advanced: ${advanced.length} lessons / ${advancedSentences.length} examples; unique IDs/text and complete translation, pronunciation and vocabulary: ${advancedUniqueSentenceIds.size === advancedSentences.length && advancedUniqueExampleTexts.size === advancedSentences.length && advancedExamplesAreComplete ? 'PASS' : 'FAIL'}`);
console.log(`Canonical 504 coverage: ${tagged.length}/504`);
console.log(`Reviewed editorial samples: ${reviewedEditorialExamplesAreStable ? `${reviewedEditorialExamples.length}/${reviewedEditorialExamples.length} PASS` : 'FAIL'}`);
console.log(`Remaining: ${missing.length}`);

const problems = [];
if (duplicateWords.length) problems.push(`Duplicate tagged words: ${duplicateWords.join(', ')}`);
if (outside.length) problems.push(`Words outside canonical list: ${outside.join(', ')}`);
if (missing.length) problems.push(`Missing canonical words: ${missing.join(', ')}`);
if (duplicateLessonIds.length) problems.push(`Duplicate lesson IDs: ${duplicateLessonIds.join(', ')}`);
if (duplicateOrders.length) problems.push(`Duplicate lesson orders: ${duplicateOrders.join(', ')}`);
if (!hasExactOrders) problems.push('Lesson orders must be exactly 1 through 174.');
if (tagged.length !== 504) problems.push(`Expected exactly 504 tagged words, found ${tagged.length}.`);
if (lessonRecords.length !== 174) problems.push(`Expected exactly 174 lessons, found ${lessonRecords.length}.`);
if (sentenceCount !== 3862) problems.push(`Expected 3862 active sentence examples, found ${sentenceCount}.`);
if (foundation.length !== 10 || foundationSentenceCount !== 500
  || foundation.some(lesson => lesson.sentences.length !== 50)) {
  problems.push('Foundation must contain ten lessons with exactly fifty sentences each.');
}
if (survival.length !== 19 || survivalSentenceCount !== 950
  || survival.some(lesson => lesson.sentences.length !== 50)) {
  problems.push('Survival must contain nineteen lessons with exactly fifty sentences each.');
}
if (survivalVocabulary.size < 1000) {
  problems.push(`Survival needs at least 1000 distinct vocabulary entries, found ${survivalVocabulary.size}.`);
}
if (survival.some(lesson => lesson.sentences.some(sentence => !sentence.fa || !sentence.pronunciation || !sentence.vocabulary.length))) {
  problems.push('Every Survival sentence must have a Persian translation, pronunciation guide, and sentence-linked vocabulary.');
}
if (survival.some(lesson => new Set(lesson.sentences.map(sentence => sentence.id)).size !== 50
  || new Set(lesson.sentences.map(sentence => normalizeEnglish(sentence.en))).size !== 50)) {
  problems.push('Every Survival lesson must have fifty unique sentence IDs and English examples.');
}
if (communication.length !== 15 || communicationSentenceCount !== 750
  || communication.some(lesson => lesson.sentences.length !== 50 || lesson.durationMinutes !== 35
    || new Set(lesson.sentences.map(sentence => sentence.id)).size !== 50
    || new Set(lesson.sentences.map(sentence => normalizeEnglish(sentence.en))).size !== 50)
  || communication.map(lesson => lesson.id).join('|') !== COMMUNICATION_COURSE_LESSON_IDS.join('|')
  || COMMUNICATION_COURSE_LESSON_IDS.length !== 15) {
  problems.push('Communication must preserve its original nine lesson IDs and append six ordered lessons with fifty unique examples apiece.');
}
if (!communicationModulesAreComplete) {
  problems.push('Communication must map all fifteen lessons exactly once to eight thematic units and retain unit metadata.');
}
if (!communicationNewSeedsAreComplete) {
  problems.push('Each new Communication lesson seed must include Persian, pronunciation, a sentence pattern, and two or more linked vocabulary entries.');
}
if (duplicateGroupsInvolvingCommunicationAdditions.length) {
  problems.push(`Communication additions duplicate ${duplicateGroupsInvolvingCommunicationAdditions.length} sentence group(s) in the active English course.`);
}
if (!communicationAdditionsAreComplete) {
  problems.push('Communication additions must add forty-four per lesson with Persian, pronunciation, patterns, and two or more literally linked vocabulary phrases.');
}
if (everyday.length !== 20 || everydaySentenceCount !== 1000
  || everyday.some(lesson => lesson.sentences.length !== 50 || lesson.durationMinutes !== 35)) {
  problems.push('Everyday must contain twenty ordered lessons with fifty examples each.');
}
if (everyday.map(lesson => lesson.id).join('|') !== EVERYDAY_COURSE_LESSON_IDS.join('|')
  || everydayOriginalLessonIds.size !== 5) {
  problems.push('Everyday lesson IDs or their original course order changed.');
}
if (everyday.some(lesson => new Set(lesson.sentences.map(sentence => sentence.id)).size !== 50
  || new Set(lesson.sentences.map(sentence => normalizeEnglish(sentence.en))).size !== 50)
  || everydayExampleSet.size !== 1000) {
  problems.push('Everyday examples must have unique IDs and non-duplicate English text.');
}
if (duplicateGroupsInvolvingEverydayAdditions.length) {
  problems.push(`Everyday additions duplicate ${duplicateGroupsInvolvingEverydayAdditions.length} sentence group(s) in the active English course.`);
}
if (!everydayAdditionsAreComplete) {
  problems.push('Everyday additions must include Persian, pronunciation, patterns, and at least two vocabulary items literally linked to the English sentence.');
}

if (!reviewedEditorialExamplesAreStable) {
  problems.push('Reviewed English editorial examples must retain their stable IDs, approved translations and sentence-specific vocabulary meanings.');
}
if (advancedUniqueSentenceIds.size !== advancedSentences.length) {
  problems.push('Advanced English sentence IDs must be unique.');
}
if (advancedUniqueExampleTexts.size !== advancedSentences.length) {
  problems.push('Advanced English examples must not repeat identical English text.');
}
if (!advancedExamplesAreComplete) {
  problems.push('Every Advanced English sentence must retain English, Persian, pronunciation and a complete linked vocabulary entry.');
}

if (problems.length) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}

console.log('Curriculum integrity: PASS');
