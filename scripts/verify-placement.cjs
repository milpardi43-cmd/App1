const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/placement-test.cjs');
  await esbuild.build({
    stdin: {
      contents: "export * from './lib/placement'; export { SENTENCE_LESSONS } from './lib/courseContent'; export { GERMAN_SENTENCE_LESSONS } from './lib/languages/germanSentenceCourse';",
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
  });

  const app = require(output);
  let checks = 0;
  const check = condition => { assert(condition); checks += 1; };
  const normalize = value => value.normalize('NFC').replace(/\s+/g, ' ').trim();
  const englishLessons = new Map(app.SENTENCE_LESSONS.map(lesson => [lesson.id, lesson]));
  const germanLessons = new Map(app.GERMAN_SENTENCE_LESSONS.map(lesson => [lesson.id, lesson]));

  check(app.getPlacementQuestions('en').length === 15);
  check(app.getPlacementQuestions('de').length === 12);
  check(new Set(['en', 'de'].flatMap(language => app.getPlacementQuestions(language).map(question => question.id))).size === 27);

  for (const language of ['en', 'de']) {
    const questions = app.getPlacementQuestions(language);
    const levelIds = [...new Set(questions.map(question => question.levelId))].sort((a, b) => a - b);
    check(levelIds.every((levelId, index) => levelId === index));
    check(levelIds.every(levelId => questions.filter(question => question.levelId === levelId).length === 3));
    check(levelIds.every(levelId => new Set(questions.filter(question => question.levelId === levelId).map(question => question.answerIndex)).size >= 2));
    check(questions.every(question => question.language === language && question.choices.length === 3
      && question.answerIndex >= 0 && question.answerIndex < question.choices.length
      && new Set(question.choices).size === question.choices.length
      && ['meaning', 'detail', 'inference'].includes(question.dimension)));
    check(new Set(questions.map(question => question.answerIndex)).size >= 2);

    for (const question of questions) {
      const courseLessons = language === 'en' ? englishLessons : germanLessons;
      const sourceLesson = courseLessons.get(question.sourceLessonId);
      check(!!sourceLesson);
      check(sourceLesson.levelId === question.levelId);
      const sourceText = [
        ...sourceLesson.sentences.map(sentence => sentence.en ?? sentence.text),
        ...(sourceLesson.dialogue ?? []).map(turn => turn.text),
      ].filter(Boolean).map(normalize);
      const passageParts = question.passage.match(/[^.!?]+[.!?]?/g)?.map(normalize) ?? [];
      check(passageParts.length > 0 && passageParts.every(part => sourceText.some(line => line === part || line.includes(part) || part.includes(line))));
    }

    const correctAnswers = Object.fromEntries(questions.map(question => [question.id, question.answerIndex]));
    const allCorrect = app.scorePlacement(language, correctAnswers);
    const lastLevel = Math.max(...levelIds);
    check(allCorrect.questionCount === questions.length && allCorrect.correctCount === questions.length);
    check(allCorrect.answeredCount === questions.length && allCorrect.unknownCount === 0);
    check(allCorrect.recommendedLevelId === lastLevel && allCorrect.perLevel.every(level => level.meetsScreeningThreshold));
    check(!allCorrect.nonMonotonicPattern);

    const allUnknown = Object.fromEntries(questions.map(question => [question.id, -1]));
    const unknownResult = app.scorePlacement(language, allUnknown);
    check(unknownResult.correctCount === 0 && unknownResult.answeredCount === 0 && unknownResult.unknownCount === questions.length);
    check(unknownResult.recommendedLevelId === 0 && unknownResult.perLevel.every(level => !level.meetsScreeningThreshold));

    const inconsistentAnswers = Object.fromEntries(questions.map(question => [
      question.id,
      question.levelId === 0 ? -1 : question.levelId === 1 ? question.answerIndex : -1,
    ]));
    check(app.scorePlacement(language, inconsistentAnswers).nonMonotonicPattern);
    assert.throws(() => app.scorePlacement(language, { 'not-a-question': 0 }), /Unknown placement question/); checks += 1;
    assert.throws(() => app.scorePlacement(language, { [questions[0].id]: 99 }), /Invalid placement answer/); checks += 1;
  }

  const partiallyAnswered = app.scorePlacement('en', {});
  check(partiallyAnswered.questionCount === 15 && partiallyAnswered.answeredCount === 0 && partiallyAnswered.unknownCount === 0);
  console.log(`${checks} placement checks passed; 15 English and 12 German items, three per internal level, all sourced from existing course examples, with scoring, unknown answers, non-monotonic results and invalid input covered.`);
})().catch(error => { console.error(error); process.exit(1); });
