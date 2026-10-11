const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/russian-architecture-test.cjs');
  await esbuild.build({
    stdin: {
      contents: [
        "import * as russian from './lib/languages/russian';",
        "import * as curriculum from './lib/languages/russianCurriculum';",
        "import * as engine from './lib/languages/russianLearningEngine';",
        "import * as evidence from './lib/languages/russianLearningEvidence';",
        'export { russian, curriculum, engine, evidence };',
      ].join('\n'),
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
    plugins: [{
      name: 'russian-architecture-test-stubs',
      setup(build) {
        build.onResolve({ filter: /^\.\/supabase$/ }, args => args.importer.endsWith('/lib/createCourseProgressStore.ts')
          ? { path: 'supabase', namespace: 'russian-supabase-stub' }
          : null);
        build.onLoad({ filter: /.*/, namespace: 'russian-supabase-stub' }, () => ({
          contents: 'export const supabase = { auth: { async getSession() { globalThis.__russianSupabaseCalls = (globalThis.__russianSupabaseCalls || 0) + 1; return { data: { session: null } }; }, async signInAnonymously() { globalThis.__russianSupabaseCalls = (globalThis.__russianSupabaseCalls || 0) + 1; return { data: { user: null }, error: null }; } }, from() { globalThis.__russianSupabaseCalls = (globalThis.__russianSupabaseCalls || 0) + 1; return { upsert: async () => ({ data: null, error: null }) }; } };',
          loader: 'js',
        }));
        build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: 'async-storage', namespace: 'russian-storage-stub' }));
        build.onLoad({ filter: /.*/, namespace: 'russian-storage-stub' }, () => ({
          contents: 'export default { async getItem(key) { return globalThis.__russianNativeMemory?.get(key) ?? null; }, async setItem(key, value) { globalThis.__russianNativeMemory ??= new Map(); globalThis.__russianNativeMemory.set(key, String(value)); }, async removeItem(key) { globalThis.__russianNativeMemory?.delete(key); } };',
          loader: 'js',
        }));
        build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'react-native', namespace: 'russian-platform-stub' }));
        build.onLoad({ filter: /.*/, namespace: 'russian-platform-stub' }, () => ({ contents: 'export const Platform = { get OS() { return globalThis.__russianPlatformOS || "web"; } };', loader: 'js' }));
      },
    }],
  });

  global.__russianPlatformOS = 'web';
  const { russian, curriculum, engine, evidence } = require(output);
  const checks = [];
  const check = (label, value) => { assert(value, label); checks.push(label); };
  const equal = (label, actual, expected) => { assert.deepEqual(actual, expected, label); checks.push(label); };

  equal('four internal CEFR planning bands are ordered A1 through B2', curriculum.RUSSIAN_CEFR_BANDS.map(x => x.id), ['A1', 'A2', 'B1', 'B2']);
  equal('the five existing Russian UI levels map underneath the four planning bands',
    Object.values(curriculum.RUSSIAN_LEVEL_TO_CEFR), ['A1', 'A1', 'A2', 'B1', 'B2']);
  equal('existing five-level Russian UI ids and titles remain unchanged',
    russian.RUSSIAN_LEVELS.map(({ id, title }) => [id, title]),
    [[0, 'Foundation'], [1, 'Survival Russian'], [2, 'Everyday Russian'], [3, 'Communication Russian'], [4, 'Advanced Russian']]);
  check('CEFR labels are explicitly internal and non-certifying', curriculum.RUSSIAN_CEFR_POLICY.officialLevelClaim === false
    && curriculum.RUSSIAN_CEFR_POLICY.officialAssessment === false
    && curriculum.RUSSIAN_CEFR_POLICY.lessonCompletionMeansMastery === false);

  const a1 = curriculum.findRussianCefrBand('A1');
  check('A1 currently contains fourteen measurable starter units', a1.status === 'starter-only'
    && a1.units.length === 14 && a1.units.every(unit => unit.status === 'available' && unit.lessonIds.length === 1
      && unit.lessonCheckCount === 2 && unit.independentTransferPrompts === 0));
  check('A1 units point to the original Russian lesson ids and order', a1.units.map(unit => unit.lessonIds[0]).join('|')
    === russian.RUSSIAN_LESSONS.map(lesson => lesson.id).join('|'));
  check('A2, B1 and B2 are roadmaps with no invented published lessons', curriculum.RUSSIAN_CEFR_BANDS.slice(1).every(band => band.status === 'planned'
    && band.units.length > 0 && band.units.every(unit => unit.status === 'planned' && unit.lessonIds.length === 0)));

  const sourceSentences = russian.RUSSIAN_LESSONS.flatMap(lesson => lesson.sentences);
  check('sentence curriculum metadata links all eighty-four current sentences without rewriting their text',
    sourceSentences.length === 84 && curriculum.RUSSIAN_SENTENCE_CURRICULUM.length === sourceSentences.length
      && new Set(curriculum.RUSSIAN_SENTENCE_CURRICULUM.map(entry => entry.sentenceId)).size === sourceSentences.length
      && curriculum.RUSSIAN_SENTENCE_CURRICULUM.every(entry => {
        const source = sourceSentences.find(sentence => sentence.id === entry.sentenceId);
        return source && entry.patternFa === (source.pattern ?? null) && entry.cefrLevelId === 'A1';
      }));
  check('each vocabulary entry is attached to one or more existing sentence examples', curriculum.RUSSIAN_VOCABULARY.length > 0
    && curriculum.RUSSIAN_VOCABULARY.every(entry => entry.examples.length > 0
      && entry.examples.every(example => sourceSentences.some(sentence => sentence.id === example.sentenceId && sentence.text === example.sentenceText))));
  check('unreviewed vocabulary does not invent lemmas, word-level pronunciations or inflections', curriculum.RUSSIAN_VOCABULARY.every(entry => entry.baseForm === null
    && entry.pronunciationFa === null && entry.inflectedForms.length === 0 && entry.editorialStatus === 'needs-russian-lexical-review'));
  const sourceVocabularyCount = russian.RUSSIAN_LESSONS.reduce((count, lesson) => count
    + lesson.sentences.reduce((sentenceCount, sentence) => sentenceCount + sentence.vocabulary.length, 0), 0);
  equal('vocabulary index retains every existing vocabulary-to-sentence occurrence',
    curriculum.RUSSIAN_VOCABULARY.reduce((count, entry) => count + entry.examples.length, 0), sourceVocabularyCount);
  check('every indexed vocabulary example preserves its original form and meaning', curriculum.RUSSIAN_VOCABULARY.every(entry => entry.examples.every(example => {
    const sentence = russian.RUSSIAN_LESSONS.find(lesson => lesson.id === example.lessonId)?.sentences.find(item => item.id === example.sentenceId);
    return sentence?.vocabulary.some(word => word.word === entry.sourceForm && word.meaning === entry.meaningFa) === true;
  })));
  check('Russian grammar metadata includes cases, verb aspect and agreement without showing new lessons',
    ['grammatical-cases', 'verb-aspect', 'agreement'].every(id => curriculum.RUSSIAN_GRAMMAR_THREADS.some(thread => thread.id === id))
      && curriculum.RUSSIAN_GRAMMAR_THREADS.every(thread => thread.editorialStatus === 'requires-russian-editor-review'));
  check('only annotations tied to existing examples are present and all transfer prompts remain empty',
    curriculum.RUSSIAN_SENTENCE_CURRICULUM.every(entry => entry.transferPromptIds.length === 0)
      && curriculum.RUSSIAN_GRAMMAR_THREADS.every(thread => thread.candidateSentenceIds.every(id => sourceSentences.some(sentence => sentence.id === id))));

  equal('five pedagogical phases preserve the existing nine UI stages', engine.RUSSIAN_LEARNING_CYCLE.map(x => x.id),
    ['receive', 'notice', 'reconstruct', 'transfer', 'retrieve']);
  check('every learning phase maps only to an existing Russian lesson stage', engine.RUSSIAN_LEARNING_CYCLE.every(phase => phase.existingStageIds.length > 0
    && phase.existingStageIds.every(id => russian.RUSSIAN_LESSON_STAGES.some(stage => stage.id === id))));
  const plan = engine.buildRussianLessonLearningPlan('ru-introductions');
  check('lesson plan resolves to A1 and keeps transfer explicitly partial until prompts are reviewed', plan.cefrLevelId === 'A1'
    && plan.phases.length === 5
    && plan.phases.find(phase => phase.id === 'transfer').implementation === 'partial'
    && plan.phases.find(phase => phase.id === 'transfer').availableTaskCount === 0
    && plan.phases.find(phase => phase.id === 'transfer').transferPromptIds.length === 0);
  check('unknown Russian lesson ids do not receive a fabricated plan', engine.buildRussianLessonLearningPlan('ru-not-a-real-lesson') === undefined);

  equal('exact matching tolerates case, spacing and punctuation', engine.evaluateRussianAnswer('  ПРИВЕТ!  ', ['Привет']).outcome, 'matched');
  equal('ё remains distinct from е in Russian answer checks', engine.evaluateRussianAnswer('ёлка', ['елка']).outcome, 'unrecognized');
  equal('unrecognized responses are sent for review rather than marked wrong', engine.evaluateRussianAnswer('новый ответ', ['Привет']).requiresHumanReview, true);
  equal('empty Russian responses are not treated as mistakes', engine.evaluateRussianAnswer('   ', ['Привет']).outcome, 'empty');
  equal('lesson checks alone do not count as transfer assessment', engine.assessRussianBandReadiness('A1', []).status, 'insufficient-transfer-evidence');
  equal('unwritten CEFR bands remain unassessable', engine.assessRussianBandReadiness('B1', []).status, 'planned');

  const completeEvidence = a1.units.map((unit, index) => ({
    objectiveId: unit.objectiveId,
    cefrLevelId: 'A1',
    phaseId: 'transfer',
    outcome: 'matched',
    source: 'human-review',
    assisted: false,
    novelContext: true,
    promptReviewed: true,
    independentTransfer: true,
    createdAt: new Date(Date.UTC(2026, 9, 10, 10, index)).toISOString(),
  }));
  equal('only reviewed, independent new-context evidence can become ready for human review',
    engine.assessRussianBandReadiness('A1', completeEvidence).status, 'ready-for-human-review');
  check('an assisted or self-reported answer cannot satisfy a level objective',
    engine.assessRussianBandReadiness('A1', completeEvidence.map((item, index) => index === 0
      ? { ...item, source: 'self-report', independentTransfer: true }
      : item)).status !== 'ready-for-human-review');

  const memory = new Map();
  global.__russianSupabaseCalls = 0;
  global.window = { localStorage: {
    getItem(key) { return memory.has(key) ? memory.get(key) : null; },
    setItem(key, value) { memory.set(key, String(value)); },
    removeItem(key) { memory.delete(key); },
  } };
  const firstLesson = russian.RUSSIAN_LESSONS[0];
  const firstSentence = firstLesson.sentences[0];
  const now = new Date('2026-10-10T12:00:00.000Z');
  const saved = await evidence.recordRussianPracticeAttempt({
    lessonId: firstLesson.id,
    sentenceId: firstSentence.id,
    phaseId: 'reconstruct',
    outcome: 'confirmed-error',
    source: 'curated-exact-match',
    assisted: true,
    attemptId: 'russian-architecture-check-1',
  }, now);
  check('confirmed errors are saved and rescheduled using the existing short spaced-review interval', saved.reviewRescheduled
    && saved.attempt.independentTransfer === false);
  const persistedAttempts = await evidence.getRussianPracticeAttempts();
  check('Russian evidence is stored under its own local-only namespace', persistedAttempts.length === 1
    && memory.has(evidence.RUSSIAN_LEARNING_EVIDENCE_KEY)
    && memory.has('sentence_course_progress_ru_v1')
    && !memory.has('sentence_course_progress_v1')
    && !memory.has('sentence_course_progress_de_v1'));
  const progress = await russian.russianProgress.getCourseProgress();
  const reviewCard = progress.reviewCards.find(card => card.id === `${firstLesson.id}:${firstSentence.id}`);
  check('a reconstruction error increments the existing Russian lapse counter and schedules a retry in ten minutes',
    reviewCard && reviewCard.lapses === 1 && Date.parse(reviewCard.dueAt) === now.getTime() + 10 * 60 * 1000);
  check('saved reconstruction evidence still cannot pass A1', (await evidence.getRussianBandReadiness('A1')).status !== 'ready-for-human-review');
  check('Russian learning engine and evidence never call Supabase', global.__russianSupabaseCalls === 0);

  global.__russianPlatformOS = 'ios';
  global.__russianNativeMemory = new Map();
  const nativeAttempt = await evidence.recordRussianPracticeAttempt({
    lessonId: 'ru-greetings',
    sentenceId: 'ru-greet-hi',
    phaseId: 'retrieve',
    outcome: 'self-rated-good',
    source: 'self-report',
    attemptId: 'russian-native-evidence-check',
  }, now);
  check('native Russian learning evidence uses AsyncStorage and preserves the self-report label', nativeAttempt.attempt.outcome === 'self-rated-good'
    && global.__russianNativeMemory.has(evidence.RUSSIAN_LEARNING_EVIDENCE_KEY)
    && !JSON.parse(memory.get(evidence.RUSSIAN_LEARNING_EVIDENCE_KEY)).attempts.some(item => item.id === 'russian-native-evidence-check'));
  check('native evidence reads back from its isolated device store', (await evidence.getRussianPracticeAttempts()).length === 1);
  global.__russianPlatformOS = 'web';

  console.log(`${checks.length} Russian CEFR, sentence-catalog, grammar-thread, learning-cycle, assessment and local-evidence checks passed.`);
})().catch(error => { console.error(error); process.exit(1); });
