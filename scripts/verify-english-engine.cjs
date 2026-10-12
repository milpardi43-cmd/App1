const assert = require('node:assert/strict');
const path = require('node:path');
const esbuild = require('esbuild');

(async () => {
  const output = path.resolve('node_modules/.cache/english-learning-engine-test.cjs');
  await esbuild.build({
    stdin: {
      contents: "export * from './lib/courseContent'; export * from './lib/englishLearningEngine'; export * from './lib/englishFoundationEvidence'; export { isCorrect } from './lib/englishSupplement/content';",
      resolveDir: process.cwd(),
    },
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: output,
  });
  const app = require(output);
  let checks = 0;
  const check = value => { assert(value); checks += 1; };

  check(app.ENGLISH_ENGINE_BLUEPRINT.length === 5);
  check(app.ENGLISH_ENGINE_STEPS.length === 9);
  check(app.ENGLISH_ENGINE_BLUEPRINT.map(item => item.title).join('|') === app.COURSE_LEVELS.map(item => item.title).join('|'));
  check(app.ENGLISH_ENGINE_BLUEPRINT.every((item, index) => item.levelId === index && item.modules.length > 0));
  check(app.ENGLISH_ENGINE_BLUEPRINT[0].modules.length === 10 && app.COURSE_LEVELS[0].modules.length === 10);
  check(app.SENTENCE_LESSONS.length === 174);
  check(app.SENTENCE_LESSONS.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 3862);
  check(app.ENGLISH_CORE_DATABASE_FLOW.map(item => item.entity).join('|') === 'Situations|Sentence Patterns|Vocabulary|Grammar Through Usage|Dialogues|Exercises|User Progress|Spaced Repetition');

  const foundation = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 0);
  const survival = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 1);
  const everyday = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 2);
  const communication = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 3);
  const advanced = app.SENTENCE_LESSONS.filter(lesson => lesson.levelId === 4);
  check(foundation.length === 10 && foundation.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 500);
  check(foundation.every(lesson => lesson.sentences.length === 50 && lesson.sentences.every(sentence => sentence.fa && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length > 0)));
  check(foundation.every(lesson => new Set(lesson.sentences.map(sentence => sentence.en)).size === 50
    && lesson.sentences.map(sentence => sentence.id).join('|') === Array.from({ length: 50 }, (_, index) => `s${index + 1}`).join('|')));
  check(foundation.map(lesson => lesson.id).join('|') === ['foundation-introducing-yourself', 'foundation-asking-for-help', 'foundation-buying-something', ...app.FOUNDATION_EXPANSION_LESSON_IDS].join('|'));
  check(app.FOUNDATION_EXPANSION_LESSON_IDS.length === 7 && foundation.slice(3).every(lesson => lesson.dialogue.length >= 6));
  check(survival.length === 19 && survival.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 950);
  check(survival.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
    && lesson.sentences.every(sentence => !!sentence.fa && !!sentence.pronunciation && sentence.vocabulary.length > 0)
    && new Set(lesson.sentences.map(sentence => sentence.id)).size === 50
    && new Set(lesson.sentences.map(sentence => sentence.en.trim().toLowerCase())).size === 50));
  check(new Set(survival.flatMap(lesson => lesson.sentences.map(sentence => sentence.en.trim().toLowerCase()))).size === 950);
  const survivalVocabulary = new Set(survival.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  check(survivalVocabulary.size === 1312);
  check(everyday.length === 20 && everyday.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 1000);
  check(everyday.map(lesson => lesson.id).join('|') === app.EVERYDAY_COURSE_LESSON_IDS.join('|')
    && app.EVERYDAY_COURSE_LESSON_IDS.length === 20);
  check(everyday.slice(0, 5).map(lesson => lesson.id).join('|') === [
    'everyday-facing-a-challenge', 'everyday-making-a-plan', 'everyday-handling-a-misunderstanding',
    'everyday-talking-about-weather', 'everyday-handling-an-emergency',
  ].join('|'));
  check(app.EVERYDAY_EXPANSION_LESSON_IDS.length === 15
    && everyday.slice(5).map(lesson => lesson.id).join('|') === app.EVERYDAY_EXPANSION_LESSON_IDS.join('|'));
  check(everyday.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
    && new Set(lesson.sentences.map(sentence => sentence.id)).size === 50
    && new Set(lesson.sentences.map(sentence => sentence.en.trim().toLowerCase().replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '))).size === 50));
  check(new Set(everyday.flatMap(lesson => lesson.sentences.map(sentence => sentence.en.trim().toLowerCase()
    .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' ')))).size === 1000);
  check(everyday.every((lesson, index) => {
    const originalCount = index < 5 ? 6 : 10;
    const additions = lesson.sentences.slice(originalCount);
    return additions.length === 50 - originalCount && additions.every(sentence => sentence.fa && sentence.pronunciation
      && sentence.pattern && sentence.vocabulary.length >= 2
      && sentence.vocabulary.every(item => item.word && item.meaning && sentence.en.toLowerCase().includes(item.word.toLowerCase())));
  }));
  check(everyday.slice(5).every(lesson => lesson.dialogue.length >= 6));
  check(foundation.slice(0, 3).map(lesson => lesson.id).join('|') === 'foundation-introducing-yourself|foundation-asking-for-help|foundation-buying-something');
  check(communication.length === 15 && communication.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 750);
  check(communication.map(lesson => lesson.id).join('|') === app.COMMUNICATION_COURSE_LESSON_IDS.join('|')
    && app.COMMUNICATION_COURSE_LESSON_IDS.length === 15);
  check(communication.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
    && new Set(lesson.sentences.map(sentence => sentence.id)).size === 50
    && new Set(lesson.sentences.map(sentence => sentence.en.trim().toLowerCase()
      .replace(/[.!?]+$/g, '').replace(/[’']/g, "'").replace(/\s+/g, ' '))).size === 50
    && lesson.unitId && lesson.unitTitle && lesson.unitTitleEn
    && lesson.sentences.slice(6).length === 44
    && lesson.sentences.slice(6).every(sentence => sentence.fa && sentence.pronunciation && sentence.pattern
      && sentence.vocabulary.length >= 2
      && sentence.vocabulary.every(item => item.word && item.meaning
        && sentence.en.toLowerCase().includes(item.word.toLowerCase())))));
  const communicationUnitIds = app.COMMUNICATION_MODULES.flatMap(unit => unit.lessonIds);
  check(app.COMMUNICATION_MODULES.length === 8
    && new Set(communicationUnitIds).size === 15
    && communicationUnitIds.length === app.COMMUNICATION_COURSE_LESSON_IDS.length
    && app.COMMUNICATION_COURSE_LESSON_IDS.every(id => communicationUnitIds.includes(id))
    && app.ENGLISH_ENGINE_BLUEPRINT[3].modules.join('|') === app.COMMUNICATION_MODULES.map(unit => unit.titleEn).join('|')
    && app.COURSE_LEVELS[3].modules.join('|') === app.COMMUNICATION_MODULES.map(unit => unit.titleFa).join('|'));
  check(advanced.length === 110 && advanced.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 662);
  const advancedComposition = app.getAdvancedContentComposition();
  assert.deepEqual(advancedComposition, {
    scenarioLessonCount: 52,
    scenarioSentenceCount: advanced.filter(lesson => lesson.contentKind === 'scenario').reduce((sum, lesson) => sum + lesson.sentences.length, 0),
    vocabularyPracticeLessonCount: 58,
    vocabularyPracticeSentenceCount: advanced.filter(lesson => lesson.contentKind === 'vocabulary-practice').reduce((sum, lesson) => sum + lesson.sentences.length, 0),
    totalLessonCount: 110,
    totalSentenceCount: 662,
  }); checks += 1;
  check(advanced.every(lesson => lesson.contentKind === 'scenario' || lesson.contentKind === 'vocabulary-practice'));
  check(advanced.slice(0, 52).every(lesson => lesson.contentKind === 'scenario')
    && advanced.slice(52).every(lesson => lesson.contentKind === 'vocabulary-practice'));
  check(!app.ENGLISH_ENGINE_BLUEPRINT[4].modules.some(module => /IELTS|Academic English|Writing Skills|Professional Speaking/i.test(module)));
  check(!/\b(?:A1|A2|B1|B2|C1|C2)\b/.test(app.COURSE_LEVELS[4].cefr));
  check(survival.map(lesson => lesson.id).join('|') === [
    'survival-job-interview', 'survival-renting-a-home', 'survival-personal-information',
    'survival-directions-and-neighborhood', 'survival-public-transport', 'survival-cafe-and-food',
    'survival-shopping-and-clothing', 'survival-appointments-and-time', 'survival-health-and-pharmacy',
    'survival-hobbies-and-free-time', 'survival-invitations-and-plans', 'survival-weather-and-seasons',
    'survival-travel-and-tickets', 'survival-hotel-and-stay', 'survival-phone-and-messages',
    'survival-services-and-post-office', 'survival-school-and-learning', 'survival-current-activities',
    'survival-past-and-future-plans',
  ].join('|'));
  const topicChecks = [
    ['foundation-introducing-yourself', ['How do you spell your name?', 'The English alphabet has twenty-six letters: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, and Z.', 'A, E, I, O, and U are vowels.', 'The letter B makes the first sound in the word book.', 'The letters P, D, and T start pen, dog, and ten.', 'S, F, V, H, and R start sun, fan, van, hat, and red.', 'J, Y, K, L, M, and N start jam, yes, key, leg, man, and nose.', 'C can sound like K in cat and like S in city.', 'G can sound like G in go and like J in giant.', 'Q starts queen, W starts water, X ends box, and Z starts zoo.', 'The letter pair TH has two sounds, as in think and this.', 'I have one brother and one sister.', 'I get up at six every day.']],
    ['foundation-asking-for-help', ['What time is it?', 'It is half past seven.', 'My phone number is 555-0142.', 'There are twelve months in a year: January, February, March, April, May, June, July, August, September, October, November, and December.', 'The bus leaves at eight thirty a.m.', 'Turn left at the corner.', 'I need the number five bus.']],
    ['foundation-buying-something', ['I need two apples.', 'These apples cost three dollars.', 'How much is a kilo of rice?', 'I need a loaf of bread.', 'Could I have a sandwich, please?', 'Can I pay in cash?', 'Your change is three dollars.']],
    ['survival-job-interview', ['I take the number five bus to work.', 'I start work at eight.', 'Can we meet on Monday?', 'I have one year of experience in customer service.', 'I can help customers and answer questions.', 'Is this a full-time or part-time job?', 'What is the hourly pay?', 'I can work from Monday to Friday.', 'I can start next Monday.', 'Could you repeat the question, please?', 'The interview is on Tuesday at ten a.m.']],
    ['survival-renting-a-home', ['Turn left at the corner.', 'I need some bread and milk.', 'I need an appointment with a doctor.', 'I am traveling next week.', 'How much is the security deposit?', 'How long is the lease?', 'The lease is for twelve months.', 'Is the apartment furnished?', 'Is internet included in the rent?', 'When is the rent due?', 'I need a quiet apartment near work.', 'The apartment has one bedroom and a kitchen.', 'The sink is broken.', 'Could you fix it, please?']],
  ];
  check(topicChecks.every(([id, sentences]) => sentences.every(text => app.getSentenceLesson(id).sentences.some(sentence => sentence.en === text))));
  const foundationExpansionTopics = [
    ['foundation-alphabet-and-spelling', ['Can you spell your last name?', 'The sign says Open.', 'I can read the label now.']],
    ['foundation-pronouns-and-be', ['I am a student.', 'Are you from this city?', 'Where are they?']],
    ['foundation-numbers-and-contact', ['My email address is sara@example.com.', 'My postal code has five digits.', 'Please send me a text message.']],
    ['foundation-family-and-possessions', ['I have a small family.', 'Whose book is this?', 'We love our family.']],
    ['foundation-time-and-calendar', ['It is eight o’clock in the morning.', 'My appointment is on Wednesday.', 'I write the date on my calendar.']],
    ['foundation-everyday-routine', ['I wake up early.', 'Does he work on Saturdays?', 'Every day, I practice one new sentence.']],
    ['foundation-objects-and-places', ['There is a lamp on the table.', 'The bank is between the café and the shop.', 'The exit is beside the door.']],
  ];
  check(foundationExpansionTopics.every(([id, texts]) => {
    const lesson = app.getSentenceLesson(id);
    return lesson?.levelId === 0 && lesson.sentences.length === 50
      && texts.every(text => lesson.sentences.some(sentence => sentence.en === text));
  }));
  const expandedSurvivalTopics = [
    ['survival-personal-information', ['What is your first name?', 'Could you repeat your email address?']],
    ['survival-directions-and-neighborhood', ['How do I get to the station?', 'Turn left at the traffic light.']],
    ['survival-public-transport', ['Which bus goes to the museum?', 'A one-way ticket, please.']],
    ['survival-cafe-and-food', ['Could I see the menu, please?', 'Is the soup vegetarian?']],
    ['survival-shopping-and-clothing', ['I am looking for a warm jacket.', 'Can I return this if it does not fit?']],
    ['survival-appointments-and-time', ['I have an appointment at three.', 'I am running ten minutes late.']],
    ['survival-health-and-pharmacy', ['I have a headache.', 'Please call an ambulance.']],
    ['survival-hobbies-and-free-time', ['I go swimming once a week.', 'I am interested in photography.']],
    ['survival-invitations-and-plans', ['Would you like to have coffee with me?', 'Can we make it a little later?']],
    ['survival-weather-and-seasons', ['What is the weather like today?', 'The forecast says it will snow tonight.']],
    ['survival-travel-and-tickets', ['I would like a ticket to Kyoto.', 'I need to change trains in Osaka.']],
    ['survival-hotel-and-stay', ['I have a reservation for tonight.', 'My room key does not work.']],
    ['survival-phone-and-messages', ['May I speak to Mr. Lee?', 'I will call you back in ten minutes.']],
    ['survival-services-and-post-office', ['I would like to send this package.', 'How much does it cost to send this package?']],
    ['survival-school-and-learning', ['What page are we on?', 'Could you explain it again?']],
    ['survival-current-activities', ['I am waiting for the bus.', 'The children are playing outside.']],
    ['survival-past-and-future-plans', ['What did you do yesterday?', 'I am going to visit my aunt tomorrow.']],
  ];
  check(expandedSurvivalTopics.length === 17 && expandedSurvivalTopics.every(([id, sentences]) => {
    const lesson = app.getSentenceLesson(id);
    return lesson?.levelId === 1 && lesson.sentences.length === 50 && lesson.dialogue.length >= 6
      && lesson.sentences.every(sentence => !!sentence.fa && !!sentence.pronunciation && sentence.vocabulary.length > 0)
      && sentences.every(text => lesson.sentences.some(sentence => sentence.en === text));
  }));
  check(!app.getSentenceLesson('survival-home-and-facilities'));

  const everydayExpansion = everyday.slice(5);
  const coreLessons = [...foundation, ...survival, ...everydayExpansion];
  const evidenceByLesson = app.CORE_LESSON_EVIDENCE;
  check(app.FOUNDATION_EVIDENCE_TASKS_PER_LESSON === 6);
  check(app.EVERYDAY_EVIDENCE_TASKS_PER_LESSON === 6);
  check(Object.keys(evidenceByLesson).join('|') === coreLessons.map(lesson => lesson.id).join('|'));
  check(everyday.slice(0, 5).every(lesson => !evidenceByLesson[lesson.id]));
  check(everydayExpansion.map(lesson => lesson.id).join('|') === app.EVERYDAY_EXPANSION_LESSON_IDS.join('|'));
  const evidenceTaskIds = new Set();
  for (const lesson of coreLessons) {
    const tasks = evidenceByLesson[lesson.id];
    check(tasks.length === 6);
    check(new Set(tasks.map(task => task.id)).size === tasks.length);
    check(tasks.every(task => !evidenceTaskIds.has(task.id) && task.answers.length > 0));
    check(tasks.every(task => task.answers.every(answer => app.isCorrect(task, answer))));
    tasks.forEach(task => evidenceTaskIds.add(task.id));
    check(['listening', 'reading', 'writing'].every(skill => tasks.some(task => task.skill === skill)));
    check(tasks.every(task => task.skill !== 'listening' || !!task.audio));
    check(tasks.every(task => task.skill !== 'reading' || !!task.source));
    check(tasks.every(task => !task.options || (task.options.includes(task.answers[0]) && new Set(task.options).size === task.options.length)));
    if (lesson.levelId === 2) {
      check(tasks.map(task => task.skill).sort().join('|') === 'grammar|listening|listening|reading|writing|writing');
      check(tasks.every(task => task.id.startsWith(`everyday-core-${lesson.id}-`)));
    }
    const allCorrect = Object.fromEntries(tasks.map(task => [task.id, { skill: task.skill, correct: true, heard: true, attempts: 1 }]));
    check(!app.isCoreLessonEvidenceComplete(lesson.id));
    check(app.isCoreLessonEvidenceComplete(lesson.id, allCorrect));
    const missedListening = tasks.find(task => task.skill === 'listening');
    check(!!missedListening);
    check(!app.isCoreLessonEvidenceComplete(lesson.id, {
      ...allCorrect, [missedListening.id]: { ...allCorrect[missedListening.id], heard: false },
    }));
    const missedAnswer = tasks.find(task => task.skill === 'reading');
    check(!!missedAnswer);
    check(!app.isCoreLessonEvidenceComplete(lesson.id, {
      ...allCorrect, [missedAnswer.id]: { ...allCorrect[missedAnswer.id], correct: false },
    }));
  }
  check(evidenceTaskIds.size === 264);

  const completed = [app.SENTENCE_LESSONS[0].id];
  const counts = app.COURSE_LEVELS.map(level => app.getEnglishLevelMetrics(level.id, completed));
  check(counts.reduce((sum, item) => sum + item.lessonCount, 0) === 174);
  check(counts.reduce((sum, item) => sum + item.completedLessonCount, 0) === 1);
  check(counts.every(item => item.patternCount <= item.sentenceCount && item.vocabularyCount > 0));
  check(counts.reduce((sum, item) => sum + item.patternCount, 0) === 3121);
  check(counts.find(item => item.levelId === 0).vocabularyCount === 491);
  check(counts.find(item => item.levelId === 2).sentenceCount === 1000
    && counts.find(item => item.levelId === 2).vocabularyCount === 1774);
  check(counts.find(item => item.levelId === 3).lessonCount === 15
    && counts.find(item => item.levelId === 3).sentenceCount === 750
    && counts.find(item => item.levelId === 3).vocabularyCount === 1410);
  check(counts.reduce((sum, item) => sum + item.vocabularyCount, 0) === 5559);

  for (const lesson of app.SENTENCE_LESSONS) {
    const core = app.buildEnglishLessonCore(lesson);
    check(core.situation.id === lesson.id && core.situation.text === lesson.situation);
    assert.deepEqual(core.coreSentences, lesson.sentences); checks += 1;
    assert.deepEqual(core.dialogues, lesson.dialogue); checks += 1;
    check(core.exerciseSourceSentenceIds.join('|') === lesson.sentences.map(sentence => sentence.id).join('|'));
    check(core.reviewCardIds.join('|') === lesson.sentences.map(sentence => `${lesson.id}:${sentence.id}`).join('|'));
    check(core.vocabulary.every(item => {
      const sentence = lesson.sentences.find(entry => entry.id === item.sentenceId);
      return sentence && sentence.en === item.exampleEn && sentence.fa === item.exampleFa
        && sentence.vocabulary.some(word => word.word === item.word && word.meaning === item.meaning);
    }));
    check(core.sentencePatterns.every(item => {
      const sentence = lesson.sentences.find(entry => entry.id === item.sentenceId);
      return sentence && sentence.pattern === item.pattern && sentence.en === item.exampleEn && sentence.fa === item.exampleFa;
    }));
    const uniqueVocabulary = app.getLessonVocabulary(lesson);
    check(new Set(uniqueVocabulary.map(item => item.word)).size === uniqueVocabulary.length);
    check(uniqueVocabulary.every(item => lesson.sentences.some(sentence => sentence.id === item.sentenceId
      && sentence.en === item.exampleEn && sentence.vocabulary.some(word => word.word === item.word))));
    check(app.getLessonPatterns(lesson).length === lesson.sentences.filter(sentence => !!sentence.pattern).length);
  }

  console.log(`${checks} engine checks passed; 5 levels, 9 ordered lesson stages, 174 lesson records (the original 168 retained), 3862 sentences (500 Foundation with 491 distinct linked words, 950 Survival across 19 fifty-example lessons with ${survivalVocabulary.size} unique vocabulary entries, 1000 Everyday across 20 fifty-example lessons with 1774 unique linked vocabulary entries, and 750 Communication across 15 fifty-example lessons and 8 thematic units with 1410 linked vocabulary entries), 264 goal-based checks across Foundation, Survival and the 15 new Everyday lessons, and sentence-linked vocabulary/review mappings.`);
})().catch(error => { console.error(error); process.exit(1); });
