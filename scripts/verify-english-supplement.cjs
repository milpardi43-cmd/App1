const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/english-supplement-test.cjs');
  await esbuild.build({
    stdin: { contents: "export * from './lib/englishSupplement/content'; export * from './lib/englishSupplement/progress'; export * from './lib/englishSupplement/assessments'; export * from './lib/courseContent';", resolveDir: process.cwd() },
    bundle: true, platform: 'node', format: 'cjs', outfile: output,
    plugins: [{ name: 'platform', setup(build) {
      build.onResolve({ filter: /^(react-native|@react-native-async-storage\/async-storage)$/ }, args => ({ path: args.path, namespace: 'stub' }));
      build.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'react-native' ? "export const Platform={OS:'web'}" : 'export default {}' }));
    } }],
  });
  const app = require(output);
  let checks = 0;
  const check = value => { assert(value); checks++; };
  const ids = new Set();

  check(app.ENGLISH_SUPPLEMENT.length === 24);
  check(app.SENTENCE_LESSONS.length === 174);
  const survivalLessons = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 1);
  check(survivalLessons.length === 19 && survivalLessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 950
    && survivalLessons.every(lesson => lesson.sentences.length === 50));
  check(app.ENGLISH_FOUNDATION_UNITS.length === 4);
  check(app.ENGLISH_A1_COURSE_UNITS.length === 20);
  check(app.A1_FINAL_CHECK.length === 32 && app.FOUNDATION_FINAL_CHECK.length === 12);
  check(new Set(app.ENGLISH_SUPPLEMENT.map(unit => unit.id)).size === 24);
  check(app.ENGLISH_SUPPLEMENT.slice(0, 10).map(unit => unit.id).join(',') === Array.from({ length: 10 }, (_, i) => `foundation-${i + 1}`).join(','));
  for (const [level, expectedPerSkill] of [['Foundation', 3], ['A1', 8]]) {
    for (const skill of Object.keys(app.SKILLS)) check(app.ASSESSMENTS[level].filter(task => task.skill === skill).length === expectedPerSkill);
  }

  // The ten pre-expansion lessons retain their original IDs/order and task IDs; all new units are appended.
  const originalTitles = ['الفبا و هجی', 'صداها و تلفظ پایه', 'ضمیر و فعل بودن', 'اسم، حرف تعریف و جمع', 'عدد و ساعت', 'خانواده و مالکیت', 'زندگی روزمره و حال ساده', 'پرسش و منفی در حال ساده', 'خواندن و تکمیل فرم', 'پیام و متن پیوسته'];
  assert.deepEqual(app.ENGLISH_SUPPLEMENT.slice(0, 10).map(unit => unit.title), originalTitles); checks++;
  for (let i = 0; i < 10; i++) {
    check(app.ENGLISH_SUPPLEMENT[i].id === `foundation-${i + 1}`);
    check(app.ENGLISH_SUPPLEMENT[i].practice.map(task => task.id).join(',') === [1, 2, 3, 4].map(n => `foundation-${i + 1}-practice-${n}`).join(','));
    check(app.ENGLISH_SUPPLEMENT[i].checkpoint.map(task => task.id).join(',') === [1, 2, 3, 4].map(n => `foundation-${i + 1}-check-${n}`).join(','));
  }

  for (const unit of app.ENGLISH_SUPPLEMENT) {
    check(['Foundation', 'A1'].includes(unit.level));
    check(unit.teaching.length === 3);
    check(unit.practice.length === 4 && unit.checkpoint.length === 4);
    for (const task of [...unit.practice, ...unit.checkpoint]) {
      check(!ids.has(task.id)); ids.add(task.id);
      check(app.isCorrect(task, task.answers[0]));
      check(!app.isCorrect(task, ''));
      check(!app.isCorrect(task, 'wrong answer'));
      check(task.skill !== 'listening' || !!task.audio);
      check(task.skill !== 'reading' || !!task.source);
      if (task.options) { check(task.options.includes(task.answers[0])); check(new Set(task.options).size === task.options.length); }
    }
  }
  for (const assessment of [...app.FOUNDATION_FINAL_CHECK, ...app.A1_FINAL_CHECK]) {
    check(!ids.has(assessment.id)); ids.add(assessment.id);
    check(app.isCorrect(assessment, assessment.answers[0]));
    check(assessment.skill !== 'listening' || !!assessment.audio);
    check(assessment.skill !== 'reading' || !!assessment.source);
    if (assessment.options) check(assessment.options.includes(assessment.answers[0]));
  }
  check(!app.isCorrect(app.ENGLISH_SUPPLEMENT[0].practice[3], 'sam'));
  check(!app.isCorrect(app.ENGLISH_SUPPLEMENT[0].practice[3], 'SAM'));

  const memory = new Map();
  global.window = { localStorage: { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) } };
  memory.set('course_progress', 'untouched');
  memory.set('learning_de_progress', 'untouched');
  const legacyEvidence = { 'foundation-1-practice-1': { skill: 'grammar', correct: true, attempts: 3, heard: false } };
  const legacyRecord = app.parseProgress(JSON.stringify({ version: 1, evidence: legacyEvidence, drafts: { message: 'Hi Tom.' } }));
  check(legacyRecord.evidence['foundation-1-practice-1'].attempts === 3);
  check(legacyRecord.drafts.message === 'Hi Tom.');
  check(legacyRecord.assessmentAttempts.length === 0 && Object.keys(legacyRecord.checklists).length === 0);

  let p = await app.loadSupplement();
  check(!app.unitPassed('foundation-1', p));
  check(app.canOpenUnit('foundation-1', p));
  check(!app.canOpenUnit('foundation-2', p));
  const firstUnit = app.ENGLISH_SUPPLEMENT[0];
  await assert.rejects(app.recordEvidence(firstUnit.practice[2], true, false)); checks++;
  await Promise.all(firstUnit.practice.map(task => app.recordEvidence(task, true, !!task.audio)));
  p = await app.loadSupplement(); check(!app.unitPassed(firstUnit.id, p));
  await Promise.all(firstUnit.checkpoint.map(task => app.recordEvidence(task, true, !!task.audio)));
  p = await app.loadSupplement(); check(app.unitPassed(firstUnit.id, p)); check(app.skillReport(p, 'listening').correct === 2);
  check(app.canOpenUnit('foundation-2', p));
  await app.recordEvidence(firstUnit.checkpoint[0], false, false);
  p = await app.loadSupplement(); check(!app.unitPassed(firstUnit.id, p)); check(p.evidence[firstUnit.checkpoint[0].id].attempts === 2);

  // Old storage keys and draft content are never cleared by the expanded course.
  await app.saveDraft('message', 'Hi Tom.');
  check((await app.loadSupplement()).drafts.message === 'Hi Tom.');
  check(memory.get('course_progress') === 'untouched');
  check(memory.get('learning_de_progress') === 'untouched');

  // Legacy v1 progress unlocks Foundation first, then its independent final check gates A1.
  const passUnits = async units => {
    for (const unit of units) for (const task of [...unit.practice, ...unit.checkpoint]) await app.recordEvidence(task, true, !!task.audio);
  };
  await passUnits(app.ENGLISH_FOUNDATION_UNITS);
  p = await app.loadSupplement();
  check(app.canStartAssessment('Foundation', p));
  check(!app.canOpenUnit('foundation-5', p));
  check(!app.canStartAssessment('A1', p));

  let foundationAttempt = await app.startAssessment('Foundation');
  check(foundationAttempt.answers && Object.keys(foundationAttempt.answers).length === 0);
  check((await app.startAssessment('Foundation')).id === foundationAttempt.id); // resumes instead of creating a blank attempt
  await assert.rejects(app.finishAssessment(foundationAttempt.id)); checks++;
  await assert.rejects(app.recordAssessmentAnswer(foundationAttempt.id, app.FOUNDATION_FINAL_CHECK.find(task => task.skill === 'listening'), true, false)); checks++;
  for (const task of app.FOUNDATION_FINAL_CHECK) await app.recordAssessmentAnswer(foundationAttempt.id, task, false, !!task.audio);
  p = await app.finishAssessment(foundationAttempt.id);
  check(!app.assessmentPassed('Foundation', p));
  check(!app.canOpenUnit('foundation-5', p));

  foundationAttempt = await app.startAssessment('Foundation', true);
  for (const task of app.FOUNDATION_FINAL_CHECK) await app.recordAssessmentAnswer(foundationAttempt.id, task, true, !!task.audio);
  p = await app.finishAssessment(foundationAttempt.id);
  check(app.assessmentPassed('Foundation', p));
  check(app.assessmentScore(app.latestAssessment(p, 'Foundation')).percent === 100);
  check(p.assessmentAttempts.filter(attempt => attempt.level === 'Foundation').length === 2);
  check(app.assessmentBreakdown(app.latestAssessment(p, 'Foundation')).every(item => item.correct === item.total && item.total === 3));
  check(app.canOpenUnit('foundation-5', p));

  await passUnits(app.ENGLISH_A1_COURSE_UNITS);
  p = await app.loadSupplement();
  check(app.a1CoursePassed(p));
  check(app.canStartAssessment('A1', p));
  let a1Attempt = await app.startAssessment('A1');
  for (const task of app.A1_FINAL_CHECK) await app.recordAssessmentAnswer(a1Attempt.id, task, true, !!task.audio);
  p = await app.finishAssessment(a1Attempt.id);
  check(app.assessmentPassed('A1', p));
  check(app.assessmentScore(app.latestAssessment(p, 'A1')).percent === 100);
  check(app.assessmentBreakdown(app.latestAssessment(p, 'A1')).every(item => item.correct === item.total && item.total === 8));
  check(app.skillReport(p, 'listening').answered === 48); // lesson evidence only; final attempts stay independent

  memory.set(app.SUPPLEMENT_KEY, 'broken');
  await assert.rejects(app.saveDraft('message', 'must not overwrite')); checks++;
  check(memory.get(app.SUPPLEMENT_KEY) === 'broken');
  memory.delete(app.SUPPLEMENT_KEY);
  await app.saveDraft('message', 'retry works');
  check((await app.loadSupplement()).drafts.message === 'retry works');
  global.window.localStorage.setItem = () => { throw Error('quota'); };
  await assert.rejects(app.recordEvidence(firstUnit.practice[0], true, false)); checks++;

  const mainLessonIds = new Set(app.SENTENCE_LESSONS.map(lesson => lesson.id));
  const mainSentenceIds = new Set(app.SENTENCE_LESSONS.flatMap(lesson => lesson.sentences.map(sentence => sentence.id)));
  const supplementTaskIds = app.ENGLISH_SUPPLEMENT.flatMap(unit => [
    ...unit.practice.map(task => task.id),
    ...unit.checkpoint.map(task => task.id),
  ]);
  check(app.ENGLISH_SUPPLEMENT.every(unit => !mainLessonIds.has(unit.id)));
  check(supplementTaskIds.every(id => !mainSentenceIds.has(id)));
  check(app.SUPPLEMENT_KEY === 'english_supplement_evidence_v1' && app.SUPPLEMENT_KEY !== 'sentence_course_progress_v1');
  console.log(`${checks} checks passed; 24 supplement units (4 Foundation + 20 A1), 192 unit questions and 44 final-check questions; 174 main lessons including 10 Foundation, 19 Survival lessons / 950 sentences, 20 Everyday lessons / 1000 sentences, and 15 Communication lessons / 750 sentences; the supplement remains separate.`);
})().catch(error => { console.error(error); process.exit(1); });
