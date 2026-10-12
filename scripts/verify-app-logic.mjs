#!/usr/bin/env node
/**
 * Logic-level verification of the app's offline features.
 *
 * The Expo app modules are bundled with esbuild — with react-native, AsyncStorage
 * and Supabase replaced by the small stubs in scripts/test-stubs — and then
 * executed in Node. That way the real curriculum data, the spaced-repetition
 * scheduler, the progress storage and the configuration guards are exercised for
 * both the native (AsyncStorage) and the web (localStorage) code paths.
 *
 * Run:  npm run validate:logic          (both storage paths)
 *       npm run validate:logic -- web   (only the web path)
 *
 * Exits non-zero when a check fails.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP = path.resolve(HERE, '..');
const STUBS = path.join(HERE, 'test-stubs');
const TMP = path.join(APP, 'node_modules', '.cache', 'app-logic-test');
mkdirSync(TMP, { recursive: true });

const PATH_NAMES = process.argv[2] ? [process.argv[2]] : ['ios', 'web'];

let esbuild;
try {
  esbuild = await import('esbuild');
} catch {
  console.log('SKIPPED — esbuild is required for this check: npm install -D esbuild');
  process.exit(0);
}

async function bundle(entry, env = {}) {
  const result = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'node',
    external: ['@supabase/supabase-js'],
    target: 'node22',
    logLevel: 'silent',
    absWorkingDir: APP,
    define: {
      'process.env.EXPO_PUBLIC_SUPABASE_URL': JSON.stringify(env.url ?? ''),
      'process.env.EXPO_PUBLIC_ENABLE_EDUCATION_ADMIN': JSON.stringify('false'),
      'process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.key ?? ''),
    },
    plugins: [
      {
        name: 'stubs',
        setup(b) {
          // '@/' is the alias from tsconfig; resolve it like Metro does, trying
          // the usual source extensions and folder index files.
          b.onResolve({ filter: /^@\// }, (args) => {
            const base = path.join(APP, args.path.slice(2));
            const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}/index.ts`, `${base}/index.tsx`];
            const hit = candidates.find((candidate) => existsSync(candidate) && !candidate.endsWith('/'));
            return hit ? { path: hit } : { errors: [{ text: `Cannot resolve ${args.path}` }] };
          });
          b.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: path.join(STUBS, 'async-storage.js') }));
          b.onResolve({ filter: /^react-native$/ }, () => ({ path: path.join(STUBS, 'react-native.js') }));
          b.onResolve(
            { filter: /^expo-(speech|audio|camera|fonts|linear-gradient|haptics|device|application|constants|location|network|battery|file-system)\b/ },
            () => ({ path: 'expo-noop.js', namespace: 'noop' }),
          );
          b.onResolve({ filter: /^\.\.?\/supabase$/, namespace: 'file' }, () => ({ path: path.join(STUBS, 'supabase.js') }));
          b.onLoad({ filter: /.*/, namespace: 'noop' }, () => ({
            contents: [
              'export default {};',
              'export const RecordingPresets = { HIGH_QUALITY: {} };',
              'export const requestRecordingPermissionsAsync = async () => ({ granted: false });',
              'export const setAudioModeAsync = async () => {};',
              'export const useAudioRecorder = () => ({});',
              'export const useAudioRecorderState = () => ({});',
              'export const useCameraPermissions = () => [null, async () => {}];',
              'export const CameraView = () => null;',
              'export const useFonts = () => [true, null];',
              'export const SplashScreen = { preventAutoHideAsync() {}, hideAsync() {} };',
            ].join('\n'),
            namespace: 'noop',
          }));
        },
      },
    ],
  });
  return result.outputFiles[0].text;
}

/** Builds one bundle and imports it with a cache-busting query. */
async function load(files, name, env = {}) {
  const entryPath = path.join(TMP, 'entry', `${name}.ts`);
  mkdirSync(path.dirname(entryPath), { recursive: true });
  writeFileSync(entryPath, files);
  const code = await bundle(entryPath, env);
  const outFile = path.join(TMP, `${name}.mjs`);
  writeFileSync(outFile, code);
  return import(`${outFile}?v=${Date.now()}`);
}

// ------------------------------------------------------------------ harness ---
let pass = 0;
const problems = [];

function check(label, condition, detail = '') {
  if (condition) pass += 1;
  else problems.push(label + (detail ? ` — ${detail}` : ''));
  const mark = condition ? 'PASS' : 'FAIL';
  console.log(`  ${mark}  ${label}${!condition && detail ? ' — ' + detail : ''}`);
}

const section = (title) => console.log(`\n=== ${title} ===`);

async function runPath(OS) {
  globalThis.__RN_OS__ = OS;

  if (OS === 'web') {
    const map = new Map();
    globalThis.window = {
      localStorage: {
        getItem: (k) => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => map.set(k, String(v)),
        removeItem: (k) => map.delete(k),
        get length(){return map.size;}, key:(i)=>[...map.keys()][i]??null,
      },
    };
  } else {
    delete globalThis.window;
  }

  const app = await load(
    `
export * as courseContent from '@/lib/courseContent';
export * as langContent from '@/lib/langContent';
export * as essentials from '@/lib/essential504';
export * as langProgress from '@/lib/langProgress';
export * as courseProgress from '@/lib/courseProgress';
export * as languages from '@/lib/languages/catalog';
export * as german from '@/lib/languages/german';
export * as germanSentenceCourse from '@/lib/languages/germanSentenceCourse';
export * as germanSentenceSession from '@/lib/languages/germanSentenceSession';
export * as features from '@/lib/features';
export * as firstMeeting from '@/lib/languages/germanFirstMeeting';
export * as unitProgress from '@/lib/languages/unitProgress';
export * as unitReview from '@/lib/languages/firstMeetingReview';
export * as roadmap from '@/lib/languages/germanRoadmap';
export * as sessions from '@/lib/languages/sessionStore';
export * as units from '@/lib/languages/germanUnits';
export * as recap from '@/lib/languages/germanRecap';
export * as checkpoints from '@/lib/languages/a1Checkpoint';
export * as workshop from '@/lib/languages/a1Workshop';
export * as coverage from '@/lib/languages/a1Coverage';
export * as unitReviews from '@/lib/languages/unitReview';
export * as coursePlanner from '@/lib/languages/coursePlanner';
export * as planner from '@/lib/languages/learningPlanner';
export * as storage from '@/lib/storage';
export * as format from '@/lib/format';
export * as paidAI from '@/lib/paidAI';
export {supabase as testSupabase} from '${STUBS}/supabase.js';
export * as courseStore from '@/lib/createCourseProgressStore';
export * as speechPractice from '@/lib/speechPractice';
export * as guidedCourses from '@/lib/languages/guidedCourses';
export { default as asyncStorage } from '${STUBS}/async-storage.js';
`,
    `app-${OS}`,
  );

  // ---------------------------------------- A. curriculum content -------------
  section(`A. curriculum content (storage path: ${OS})`);
  const lessons = app.courseContent.SENTENCE_LESSONS;
  const allSentences = lessons.flatMap((lesson) => lesson.sentences);
  const tagged = allSentences.flatMap((sentence) => sentence.vocabulary).filter((word) => word.essential504).map((word) => word.word);
  const canonical = JSON.parse(readFileSync(path.join(APP, 'assets/data/essential504.json'), 'utf8'));

  check('174 sentence lessons exist after the Foundation, Survival, Everyday and Communication expansions', lessons.length === 174, `got ${lessons.length}`);
  check('lesson ids are unique', new Set(lessons.map((l) => l.id)).size === lessons.length);
  const orders = lessons.map((l) => l.order).sort((a, b) => a - b);
  check('orders are exactly 1..174', JSON.stringify(orders) === JSON.stringify([...Array(174)].map((_, i) => i + 1)));
  check('every lesson has a title', lessons.every((l) => typeof l.title === 'string' && l.title.length > 1));
  check('the active course contains exactly 3862 examples after the Communication expansion', allSentences.length === 3862);
  check('every lesson has sentences', lessons.every((l) => Array.isArray(l.sentences) && l.sentences.length > 0));
  check('every sentence has id + English + Persian', allSentences.every((s) => s.id && s.en && s.fa));
  check('sentence ids are unique inside each lesson', lessons.every((l) => new Set(l.sentences.map((s) => s.id)).size === l.sentences.length));
  check('more than 500 sentences in total', allSentences.length > 500, `${allSentences.length}`);
  const foundationLessons = lessons.filter(lesson => lesson.levelId === 0);
  check('Foundation has ten lessons with fifty complete, vocabulary-linked examples apiece', foundationLessons.length === 10
    && foundationLessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 500
    && foundationLessons.every(lesson => lesson.sentences.length === 50 && lesson.sentences.every(sentence => sentence.fa
      && sentence.pronunciation && sentence.pattern && sentence.vocabulary.length > 0)));
  check('the three original Foundation lesson IDs remain first, with seven stable additions after them', foundationLessons.map(lesson => lesson.id).join('|')
    === ['foundation-introducing-yourself', 'foundation-asking-for-help', 'foundation-buying-something', ...app.courseContent.FOUNDATION_EXPANSION_LESSON_IDS].join('|'));
  const survivalLessons = lessons.filter(lesson => lesson.levelId === 1);
  check('Survival has nineteen ordered lessons with fifty complete sentence examples each', survivalLessons.length === 19
    && survivalLessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 950
    && survivalLessons.every(lesson => lesson.sentences.length === 50
      && lesson.sentences.every(sentence => sentence.fa && sentence.pronunciation && sentence.vocabulary.length > 0)));
  const survivalVocabulary = new Set(survivalLessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  check('Survival contains 1312 distinct sentence-linked vocabulary entries', survivalVocabulary.size === 1312);
  check('original Survival lesson IDs remain first and unchanged', survivalLessons.slice(0, 2).map(lesson => lesson.id).join('|')
    === 'survival-job-interview|survival-renting-a-home');
  const everydayLessons = lessons.filter(lesson => lesson.levelId === 2);
  check('Everyday now has 20 ordered lessons and 1000 sentence examples', everydayLessons.length === 20
    && everydayLessons.reduce((sum, lesson) => sum + lesson.sentences.length, 0) === 1000
    && everydayLessons.every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35)
    && everydayLessons.map(lesson => lesson.id).join('|') === app.courseContent.EVERYDAY_COURSE_LESSON_IDS.join('|'));
  check('the five original Everyday lessons remain first and unchanged by ID', everydayLessons.slice(0, 5).map(lesson => lesson.id).join('|')
    === 'everyday-facing-a-challenge|everyday-making-a-plan|everyday-handling-a-misunderstanding|everyday-talking-about-weather|everyday-handling-an-emergency');
  const everydayExpansionIds = app.courseContent.EVERYDAY_EXPANSION_LESSON_IDS;
  check('15 Everyday lessons follow the originals and now have fifty complete sentences each', everydayExpansionIds.length === 15
    && everydayLessons.slice(5).map(lesson => lesson.id).join('|') === everydayExpansionIds.join('|')
    && everydayLessons.slice(5).every(lesson => lesson.sentences.length === 50 && lesson.durationMinutes === 35
      && lesson.dialogue.length >= 6 && lesson.sentences.slice(10).every(sentence => sentence.fa && sentence.pronunciation
        && sentence.pattern && sentence.vocabulary.length >= 2
        && sentence.vocabulary.every(item => item.word && item.meaning && sentence.en.toLowerCase().includes(item.word.toLowerCase())))));
  check('every sentence has vocabulary with word + meaning',
    allSentences.every((s) => Array.isArray(s.vocabulary) && s.vocabulary.every((v) => v.word && v.meaning)));
  check('exactly 504 words carry the essential504 flag', tagged.length === 504, `got ${tagged.length}`);
  check('no duplicated tagged word', new Set(tagged).size === tagged.length);
  check('every tagged word exists in assets/data/essential504.json', tagged.every((word) => canonical.includes(word)));
  check('every canonical 504 word is covered', canonical.every((word) => tagged.includes(word)));
  const perLesson = lessons.map((l) => app.essentials.getEssential504WordsForLesson(l.id).length);
  check('per-lesson 504 lookup works for all lessons', perLesson.every((n) => n >= 0));
  check('per-lesson 504 lists add up to 504', perLesson.reduce((a, b) => a + b, 0) === 504);

  const langLessons = app.langContent.LESSONS;
  check('12 word lessons exist', langLessons.length === 12, `got ${langLessons.length}`);
  check('getLesson(id) returns the matching lesson', langLessons.every((l) => app.langContent.getLesson(l.id).id === l.id));
  check('getLesson falls back safely out of range', app.langContent.getLesson(99) != null && app.langContent.getLesson(0) != null);
  const totalWords = langLessons.reduce((sum, l) => sum + l.words.length, 0);
  check('TOTAL_WORDS equals the sum of lesson words', app.langContent.TOTAL_WORDS === totalWords, `${app.langContent.TOTAL_WORDS} vs ${totalWords}`);

  // ---------------------------------------- B. word review + quiz -------------
  section('B. word review / quiz logic');
  const lp = app.langProgress;
  const firstLesson = langLessons[0];
  let overview = await lp.getOverview();
  check('fresh overview starts empty', overview.xp === 0 && overview.wordsSeen === 0 && overview.streak === 0);
  check('overview reports the full word count', overview.totalWords === totalWords);
  await lp.recordReview(firstLesson.id, 0, true);
  overview = await lp.getOverview();
  check('knew=true gives 10 XP and marks the word seen', overview.xp === 10 && overview.wordsSeen === 1);
  check('streak counts today', overview.streak === 1);
  check('todayReviewed increments', overview.todayReviewed === 1);
  await lp.recordQuizAnswer(firstLesson.id, 1, true);
  check('correct quiz answer gives 10 XP', (await lp.getOverview()).xp === 20);
  await lp.recordQuizAnswer(firstLesson.id, 1, false);
  check('wrong answer drops that word back to mastery 0', (await lp.getLessonMastery(firstLesson.id))[1] === 0);
  check('wrong answer gives no XP', (await lp.getOverview()).xp === 20);
  check('lesson is not complete after partial review', (await lp.isLessonCompleted(firstLesson.id)) === false);
  check('continue points at the first unfinished lesson', (await lp.getContinueLessonId()) === firstLesson.id);
  await lp.recordReview(firstLesson.id, 0, true);
  await lp.recordReview(firstLesson.id, 0, true);
  check('mastery is capped at 2', (await lp.getLessonMastery(firstLesson.id))[0] === 2);
  for (let i = 0; i < firstLesson.words.length; i += 1) await lp.recordReview(firstLesson.id, i, true);
  check('lesson completes once every word was seen', (await lp.isLessonCompleted(firstLesson.id)) === true);
  check('continue moves on to the next lesson', (await lp.getContinueLessonId()) === langLessons[1].id);
  overview = await lp.getOverview();
  check('week chart has 7 buckets and today has XP', overview.weekXp.length === 7 && overview.weekXp[6] > 0);
  const wordDump = app.asyncStorage.__dump();
  check('word progress is persisted (AsyncStorage)',
    Object.values(wordDump).some((value) => String(value).includes('mastery')),
    Object.keys(wordDump).join(',') || 'empty');

  // ---------------------------------------- C. course progress + scheduler ---
  section('C. sentence course progress + review scheduler');
  const cp = app.courseProgress;
  const lesson1 = lessons[0];
  let progress = await cp.getCourseProgress();
  check('fresh course progress starts at the first lesson', progress.currentLessonId === lesson1.id, progress.currentLessonId);
  check('no completed lessons yet', progress.completedLessonIds.length === 0);
  check('no review cards yet', progress.reviewCards.length === 0);
  check('streak starts at 0', progress.currentStreak === 0);

  progress = await cp.completeSentenceLesson(lesson1.id, lessons[1].id);
  check('completing a lesson records it', progress.completedLessonIds.includes(lesson1.id));
  check('completing advances currentLessonId', progress.currentLessonId === lessons[1].id);
  check('a review card is created per sentence',
    progress.reviewCards.filter((card) => card.lessonId === lesson1.id).length === lesson1.sentences.length,
    `${progress.reviewCards.length} cards / ${lesson1.sentences.length} sentences`);
  check('completion does not invent time', progress.todayMinutes === 0, `${progress.todayMinutes}`);
  check('streak becomes 1 after activity', progress.currentStreak === 1);
  check('completion does not invent vocabulary mastery', progress.learnedEssential504Words.length === 0);

  const due = await cp.getDueReviewCards();
  check('new cards are due immediately', due.length >= lesson1.sentences.length, `${due.length}`);
  const cardIds = due.slice(0, 4).map((card) => card.id);
  check('four due cards available for the comparison', cardIds.length === 4, `${cardIds.length}`);
  const rated = {};
  for (const [rating, id] of [['again', cardIds[0]], ['hard', cardIds[1]], ['good', cardIds[2]], ['easy', cardIds[3]]]) {
    rated[rating] = await cp.rateReviewCard(id, rating);
  }
  check('every rating returns the updated card', Object.values(rated).every(Boolean));
  check('again schedules the soonest and counts a lapse', rated.again.intervalDays === 0 && rated.again.lapses === 1);
  check('again resets repetitions', rated.again.repetitions === 0);
  check('again lowers ease', rated.again.ease < 2.3, `${rated.again.ease}`);
  check('hard is at least one day', rated.hard.intervalDays >= 1, `${rated.hard.intervalDays}`);
  check('easy gives the longest interval',
    rated.easy.intervalDays > rated.good.intervalDays && rated.easy.intervalDays > rated.hard.intervalDays,
    `easy=${rated.easy.intervalDays} good=${rated.good.intervalDays} hard=${rated.hard.intervalDays} again=${rated.again.intervalDays}`);
  check('ease order is easy > good > hard > again',
    rated.easy.ease > rated.good.ease && rated.good.ease > rated.hard.ease && rated.hard.ease > rated.again.ease,
    `easy=${rated.easy.ease} good=${rated.good.ease} hard=${rated.hard.ease} again=${rated.again.ease}`);
  check('ease stays inside 1.3..3', Object.values(rated).every((card) => card.ease >= 1.3 && card.ease <= 3));
  check('successful ratings accumulate repetitions',
    ['hard', 'good', 'easy'].every((rating) => rated[rating].repetitions >= 1));
  check('rating an unknown card returns null', (await cp.rateReviewCard('does-not-exist', 'good')) === null);
  const repeatA = await cp.rateReviewCard(cardIds[2], 'good');
  const repeatB = await cp.rateReviewCard(cardIds[2], 'good');
  check('repeated "good" grows the interval', repeatB.intervalDays >= repeatA.intervalDays);
  await cp.addSentenceToReview(lesson1.sentences[0].id);
  check('addSentenceToReview does not duplicate the card',
    (await cp.getCourseProgress()).reviewCards.filter((card) => card.id === `${lesson1.id}:${lesson1.sentences[0].id}`).length === 1);

  progress = await cp.getCourseProgress();
  check('progress survives a reload', progress.completedLessonIds.includes(lesson1.id));
  check('updatedAt is a valid ISO date', !Number.isNaN(Date.parse(progress.updatedAt)));
  const courseKey = 'sentence_course_progress_v1';
  const rawStore = OS === 'web' ? globalThis.window.localStorage.getItem(courseKey) : app.asyncStorage.__dump()[courseKey];
  check(`course progress is persisted on the ${OS} storage path`,
    typeof rawStore === 'string' && rawStore.includes(lesson1.id), OS === 'web' ? 'localStorage' : 'AsyncStorage');
  check('junk in storage is normalised instead of crashing', await (async () => {
    const junk = JSON.stringify({ completedLessonIds: ['x'], reviewCards: 'nonsense', currentStreak: -5 });
    if (OS === 'web') globalThis.window.localStorage.setItem(courseKey, junk);
    else await app.asyncStorage.setItem(courseKey, junk);
    const recovered = await cp.getCourseProgress();
    return Array.isArray(recovered.reviewCards) && recovered.currentStreak >= 0;
  })());
  check('completed Foundation history receives review cards for every current sentence', await (async () => {
    const legacy = JSON.stringify({
      completedLessonIds: [lesson1.id],
      currentLessonId: lessons[1].id,
      reviewCards: [],
    });
    if (OS === 'web') globalThis.window.localStorage.setItem(courseKey, legacy);
    else await app.asyncStorage.setItem(courseKey, legacy);
    const migrated = await cp.getCourseProgress();
    const cards = migrated.reviewCards.filter((card) => card.lessonId === lesson1.id);
    return cards.length === lesson1.sentences.length
      && lesson1.sentences.every((sentence) => cards.some((card) => card.id === `${lesson1.id}:${sentence.id}`));
  })());
  check('returning learners who had moved beyond Foundation are routed through its new lessons first', await (async () => {
    const legacy = JSON.stringify({
      completedLessonIds: ['foundation-introducing-yourself', 'foundation-asking-for-help', 'foundation-buying-something'],
      currentLessonId: 'survival-job-interview',
      reviewCards: [],
    });
    if (OS === 'web') globalThis.window.localStorage.setItem(courseKey, legacy);
    else await app.asyncStorage.setItem(courseKey, legacy);
    const migrated = await cp.getCourseProgress();
    if (migrated.currentLessonId !== app.courseContent.FOUNDATION_EXPANSION_LESSON_IDS[0]
      || !migrated.completedLessonIds.includes('foundation-buying-something')) return false;
    let progressed = migrated;
    for (const id of app.courseContent.FOUNDATION_EXPANSION_LESSON_IDS) {
      const index = lessons.findIndex(lesson => lesson.id === id);
      progressed = await cp.completeSentenceLesson(id, lessons[index + 1]?.id);
    }
    return progressed.currentLessonId === 'survival-job-interview'
      && app.courseContent.FOUNDATION_EXPANSION_LESSON_IDS.every(id => progressed.completedLessonIds.includes(id));
  })());
  check('legacy learners who completed Foundation and moved past the old Survival block are guided to its new lessons', await (async () => {
    const legacy = JSON.stringify({
      completedLessonIds: [
        'foundation-introducing-yourself', 'foundation-asking-for-help', 'foundation-buying-something',
        ...app.courseContent.FOUNDATION_EXPANSION_LESSON_IDS,
        'survival-job-interview', 'survival-renting-a-home',
      ],
      currentLessonId: 'everyday-facing-a-challenge',
      reviewCards: [],
    });
    if (OS === 'web') globalThis.window.localStorage.setItem(courseKey, legacy);
    else await app.asyncStorage.setItem(courseKey, legacy);
    const migrated = await cp.getCourseProgress();
    return migrated.currentLessonId === 'survival-personal-information'
      && migrated.completedLessonIds.includes('survival-renting-a-home')
      && app.courseContent.FOUNDATION_EXPANSION_LESSON_IDS.every(id => migrated.completedLessonIds.includes(id));
  })());
  check('legacy learners resume their unfinished Everyday content and return to their saved later lesson', await (async () => {
    const saved = OS === 'web' ? globalThis.window.localStorage.getItem(courseKey) : await app.asyncStorage.getItem(courseKey);
    const everydayIds = app.courseContent.EVERYDAY_EXPANSION_LESSON_IDS;
    const laterEverydayPath = lessons.filter(lesson => lesson.levelId === 3);
    const savedNextLesson = laterEverydayPath[3];
    const legacy = JSON.stringify({
      completedLessonIds: lessons.filter(lesson => lesson.order < savedNextLesson.order && !everydayIds.includes(lesson.id)).map(lesson => lesson.id),
      currentLessonId: savedNextLesson.id,
      reviewCards: [],
    });
    try {
      if (OS === 'web') globalThis.window.localStorage.setItem(courseKey, legacy);
      else await app.asyncStorage.setItem(courseKey, legacy);
      const migrated = await cp.getCourseProgress();
      if (migrated.currentLessonId !== everydayIds[0]) return false;
      let completed = migrated;
      for (const id of everydayIds) {
        const index = lessons.findIndex(lesson => lesson.id === id);
        completed = await cp.completeSentenceLesson(id, lessons[index + 1]?.id);
      }
      return completed.currentLessonId === savedNextLesson.id
        && everydayIds.every(id => completed.completedLessonIds.includes(id));
    } finally {
      if (OS === 'web') {
        if (saved === null) globalThis.window.localStorage.removeItem(courseKey);
        else globalThis.window.localStorage.setItem(courseKey, saved);
      } else if (saved === null) await app.asyncStorage.removeItem(courseKey);
      else await app.asyncStorage.setItem(courseKey, saved);
    }
  })());

  // ---------------------------------------- D. setup state -------------------
  const forward = await cp.completeSentenceLesson(lessons[2].id,lessons[3].id);
  const replay = await cp.completeSentenceLesson(lessons[0].id,lessons[1].id);
  check('revisiting an earlier English lesson never moves the path backwards', replay.currentLessonId===forward.currentLessonId);
  check('repeated English completion adds neither minutes nor untested learned words', replay.todayMinutes===forward.todayMinutes&&replay.learnedEssential504Words.length===0);
  section('D. onboarding / pairing storage');
  const st = app.storage;
  check('onboarding starts incomplete', (await st.isOnboardingComplete()) === false);
  await st.setOnboardingComplete();
  check('onboarding can be completed', (await st.isOnboardingComplete()) === true);
  check('pairing state is empty by default', (await st.getPairingState()) === null);
  await st.setPairingState({ deviceId: 'dev-123', code: '654321' });
  const pairing = await st.getPairingState();
  check('pairing state round-trips', pairing?.deviceId === 'dev-123' && pairing?.code === '654321', JSON.stringify(pairing));
  await st.clearPairingState();
  check('pairing state can be cleared', (await st.getPairingState()) === null);
  check('clearing pairing also drops the device id', (await st.getDeviceId()) == null);

  // ---------------------------------------- E. formatting --------------------
  section('E. Persian formatting helpers');
  const f = app.format;
  check('toPersianDigits converts ASCII digits', f.toPersianDigits('0123456789') === '۰۱۲۳۴۵۶۷۸۹', f.toPersianDigits('0123456789'));
  check('toPersianDigits accepts numbers', f.toPersianDigits(129) === '۱۲۹', f.toPersianDigits(129));
  check('formatBytes handles 0 and KiB', f.formatBytes(0).length > 0 && f.formatBytes(2048).length > 0, f.formatBytes(2048));
  check('formatDuration returns text', f.formatDuration(3661).length > 0, f.formatDuration(3661));
  check('timeAgo returns Persian text', f.timeAgo(new Date().toISOString()).length > 0, f.timeAgo(new Date().toISOString()));
  check('formatPersianDate accepts ISO input', f.formatPersianDate('2026-10-07T10:00:00.000Z').length > 0);
  check('formatTime accepts ISO input', f.formatTime('2026-10-07T10:00:00.000Z').length > 0);

  section('Multilingual content and progress isolation');
  const englishHomeSource = readFileSync(path.join(APP, 'app/lang/index.tsx'), 'utf8');
  const englishLibrarySource = readFileSync(path.join(APP, 'app/lang/library.tsx'), 'utf8');
  const englishBottomNavSource = readFileSync(path.join(APP, 'components/AppBottomNav.tsx'), 'utf8');
  const todayHeaderStyle = englishHomeSource.match(/sectionHeader:\s*\{([^}]+)\}/)?.[1] ?? '';
  const bottomNavShellStyle = englishBottomNavSource.match(/shell:\s*\{([^}]+)\}/)?.[1] ?? '';
  check('English Today heading stays right-aligned in RTL without changing its labels', /flexDirection:\s*'row-reverse'/.test(todayHeaderStyle) && englishHomeSource.includes('TODAY AT A GLANCE') && englishHomeSource.includes('برنامهٔ امروز'));
  check('English level cards show unique vocabulary counts calculated from each level', /metrics\.vocabularyCount/.test(englishHomeSource) && englishHomeSource.includes('واژهٔ یکتا') && /stats\.vocabularyCount/.test(englishLibrarySource) && englishLibrarySource.includes('واژهٔ یکتا'));
  check('English bottom navigation places Learning on the right, Conversation in the center, and Review on the left', /flexDirection:\s*'row-reverse'/.test(bottomNavShellStyle) && /path:\s*'\/lang',\s*label:\s*'یادگیری'/.test(englishBottomNavSource) && /path:\s*'\/conversations',\s*label:\s*'مکالمه'/.test(englishBottomNavSource) && /path:\s*'\/review',\s*label:\s*'مرور'/.test(englishBottomNavSource));
  const archivedGerman = app.german.GERMAN_LESSONS;
  check('Archived German legacy source remains isolated from the new course', archivedGerman.length === 12 && archivedGerman.every(l => l.id.startsWith('de-')));
  const germanCourse = app.germanSentenceCourse.GERMAN_SENTENCE_LESSONS;
  const germanSentences = germanCourse.flatMap(lesson => lesson.sentences);
  const germanLevels = app.germanSentenceCourse.GERMAN_SENTENCE_LEVELS;
  check('German sentence course has four ordered teaching levels and ninety-five lessons', germanLevels.map(level => level.cefr).join('|') === 'Pre-A1|A1|A2|B1' && germanCourse.length === 95);
  const preA1Course = germanCourse.filter(lesson => lesson.levelId === 0);
  check('Pre-A1 has twenty lessons, one thousand sentences and 396 unique vocabulary entries', preA1Course.length === 20 && app.germanSentenceCourse.germanSentenceLevelMetrics(0).sentenceCount === 1000 && app.germanSentenceCourse.germanSentenceLevelMetrics(0).vocabularyCount === 396);
  check('Pre-A1 lessons are sequential, fifty sentences each, and match all twenty topic chips', preA1Course.every((lesson, index) => lesson.order === index + 1 && lesson.sentences.length === 50 && new Set(lesson.sentences.map(sentence => sentence.text)).size === 50 && lesson.title === germanLevels[0].modules[index]));
  check('the twelve existing Pre-A1 lesson IDs stay first and eight bridge lessons follow', preA1Course.slice(0, 12).map(lesson => lesson.id).join('|') === 'de-v2-greetings|de-v2-name-origin|de-v2-classroom|de-v2-numbers-time|de-v2-basic-needs|de-v2-alphabet|de-v2-countries-languages|de-v2-days-calendar|de-v2-personal-details|de-v2-food-drink|de-v2-objects-colors|de-v2-places-directions' && preA1Course.slice(12).map(lesson => lesson.id).join('|') === 'de-v2-core-verbs-pronouns|de-v2-questions-negation|de-v2-family-basics|de-v2-home-rooms|de-v2-daily-routine-basics|de-v2-shopping-prices|de-v2-feelings-health|de-v2-integrated-dialogues');
  check('each of 1,000 Pre-A1 sentence examples has translated, pronounced vocabulary entries', preA1Course.flatMap(lesson => lesson.sentences).length === 1000 && preA1Course.flatMap(lesson => lesson.sentences).every(sentence => sentence.fa && sentence.pronunciation && sentence.vocabulary.length && sentence.vocabulary.every(entry => entry.word && entry.meaning)));
  const a1Course = germanCourse.filter(lesson => lesson.levelId === 1);
  check('A1 has twenty-five lessons, 1,250 sentence examples and 587 unique vocabulary entries', a1Course.length === 25 && app.germanSentenceCourse.germanSentenceLevelMetrics(1).sentenceCount === 1250 && app.germanSentenceCourse.germanSentenceLevelMetrics(1).vocabularyCount === 587);
  check('A1 lessons are sequential, fifty sentences each, and match all twenty-five topic chips', a1Course.every((lesson, index) => lesson.order === index + 1 && lesson.sentences.length === 50 && new Set(lesson.sentences.map(sentence => sentence.text)).size === 50 && lesson.durationMinutes === 25 && lesson.title === germanLevels[1].modules[index]));
  check('the five existing A1 lesson IDs stay first and twenty A1 topics follow', a1Course.slice(0, 5).map(lesson => lesson.id).join('|') === 'de-v2-family|de-v2-daily-routine|de-v2-cafe-food|de-v2-shopping|de-v2-city-transport' && a1Course.slice(5).map(lesson => lesson.id).join('|') === 'de-v2-a1-home-neighborhood|de-v2-a1-work-day|de-v2-a1-calendar-appointments|de-v2-a1-free-time|de-v2-a1-weather-seasons|de-v2-a1-health-appointment|de-v2-a1-travel-hotel|de-v2-a1-language-class|de-v2-a1-contact-forms|de-v2-a1-invitations|de-v2-a1-weekend-past|de-v2-a1-clothing-shopping|de-v2-a1-food-preferences|de-v2-a1-post-office|de-v2-a1-describing-people-things|de-v2-a1-household-tasks|de-v2-a1-train-station|de-v2-a1-phone-messages|de-v2-a1-lost-and-found|de-v2-a1-integrated-conversation');
  check('each of the 1,125 new A1 examples has a stable ID, unique text, Persian translation, pronunciation and vocabulary', a1Course.every(lesson => lesson.sentences.slice(5).length === 45 && new Set(lesson.sentences.map(sentence => sentence.text)).size === 50 && lesson.sentences.slice(5).every((sentence, index) => sentence.id === `${lesson.id}-extra-${String(index + 1).padStart(2, '0')}` && sentence.text && sentence.fa && sentence.pronunciation && sentence.vocabulary.length && sentence.vocabulary.every(entry => entry.word && entry.meaning))));
  const newA1Samples = a1Course.flatMap(lesson => lesson.sentences.slice(5));
  const originalA1Texts = new Set(a1Course.flatMap(lesson => lesson.sentences.slice(0, 5)).map(sentence => sentence.text));
  check('all appended A1 text is unique across lessons and avoids duplicates of preserved originals', newA1Samples.length === 1125 && new Set(newA1Samples.map(sentence => sentence.text)).size === 1125 && newA1Samples.every(sentence => !originalA1Texts.has(sentence.text)));
  check('A1 provides complete word and phrase presentations across all examples', a1Course.flatMap(lesson => lesson.sentences).every(sentence => sentence.vocabulary.length > 0 && sentence.vocabulary.every(entry => entry.word.trim() && entry.meaning.trim())) && a1Course.flatMap(lesson => lesson.sentences).reduce((count, sentence) => count + sentence.vocabulary.length, 0) === 1493);
  const a2Course = germanCourse.filter(lesson => lesson.levelId === 2);
  check('A2 has twenty-five lessons, 1,250 examples and 716 distinct vocabulary entries', a2Course.length === 25 && app.germanSentenceCourse.germanSentenceLevelMetrics(2).sentenceCount === 1250 && app.germanSentenceCourse.germanSentenceLevelMetrics(2).vocabularyCount === 716);
  check('A2 preserves its five original lesson IDs and appends twenty ordered fifty-sentence topics', a2Course.slice(0, 5).map(lesson => lesson.id).join('|') === 'de-v2-weekend-past|de-v2-travel-stay|de-v2-health-appointment|de-v2-home-services|de-v2-invitations-plans' && a2Course.slice(5).length === 20 && a2Course.every((lesson, index) => lesson.order === index + 1 && lesson.sentences.length === 50 && lesson.durationMinutes === 30 && lesson.teachingFa.includes('نکتهٔ تکمیلی')));
  const addedA2Samples = a2Course.flatMap(lesson => lesson.sentences.slice(5));
  check('A2 adds 1,125 stable, translated examples with Persian pronunciation and contextual vocabulary', addedA2Samples.length === 1125 && a2Course.every(lesson => lesson.sentences.slice(5).every((sentence, index) => sentence.id === `${lesson.id}-extra-${String(index + 1).padStart(2, '0')}` && sentence.text && sentence.fa && sentence.pronunciation && !/[A-Za-z]/.test(sentence.pronunciation) && sentence.vocabulary.length > 0 && sentence.vocabulary.every(entry => entry.word.trim() && entry.meaning.trim()))));
  const b1Course = germanCourse.filter(lesson => lesson.levelId === 3);
  check('B1 has twenty-five lessons, 1,250 sentence examples and 734 distinct vocabulary entries', b1Course.length === 25 && app.germanSentenceCourse.germanSentenceLevelMetrics(3).sentenceCount === 1250 && app.germanSentenceCourse.germanSentenceLevelMetrics(3).vocabularyCount === 734);
  check('B1 preserves five original IDs and appends twenty sequential fifty-sentence topics', b1Course.slice(0, 5).map(lesson => lesson.id).join('|') === 'de-v2-opinions-reasons|de-v2-work-experience|de-v2-complaint-solution|de-v2-news-and-change|de-v2-learning-future' && b1Course.slice(5).length === 20 && b1Course.every((lesson, index) => lesson.order === index + 1 && lesson.sentences.length === 50 && lesson.durationMinutes === 35 && lesson.teachingFa.includes('نکتهٔ تکمیلی')));
  const addedB1Samples = b1Course.flatMap(lesson => lesson.sentences.slice(5));
  check('B1 adds 1,125 stable, translated examples with Persian pronunciation and contextual vocabulary', addedB1Samples.length === 1125 && b1Course.every(lesson => lesson.sentences.slice(5).every((sentence, index) => sentence.id === `${lesson.id}-extra-${String(index + 1).padStart(2, '0')}` && sentence.text && sentence.fa && sentence.pronunciation && !/[A-Za-z]/.test(sentence.pronunciation) && sentence.vocabulary.length > 0 && sentence.vocabulary.every(entry => entry.word.trim() && entry.meaning.trim()))));
  const preservedCourseExamples = germanCourse.flatMap(lesson => lesson.levelId < 2 ? lesson.sentences : lesson.sentences.slice(0, 5));
  const allAddedUpperExamples = [...addedA2Samples, ...addedB1Samples];
  const preservedExampleTexts = new Set(preservedCourseExamples.map(sentence => sentence.text));
  check('new A2/B1 sentences are unique and do not duplicate preserved Pre-A1/A1/A2/B1 samples', allAddedUpperExamples.length === 2250 && new Set(allAddedUpperExamples.map(sentence => sentence.text)).size === 2250 && allAddedUpperExamples.every(sentence => !preservedExampleTexts.has(sentence.text)));
  check('B1 modules align with lesson titles and preserve their original richer vocabulary lists and dialogue', b1Course.length === 25 && germanLevels[3].modules.length === 25 && b1Course.every((lesson, index) => (index < 5 || lesson.title === germanLevels[3].modules[index]) && lesson.dialogue.length >= 3 && lesson.dialogue.every(line => line.text && line.fa)) && b1Course.slice(5).flatMap(lesson => lesson.sentences.slice(0, 5)).every(sentence => sentence.vocabulary.length >= 4 && sentence.vocabulary.every(entry => entry.word.trim() && entry.meaning.trim())));
  check('B1 capstone is explicitly a non-scored integrated conversation', b1Course.at(-1)?.id === 'de-v2-b1-integrated-conversation' && b1Course.at(-1).teachingFa.includes('بدون نمره') && b1Course.at(-1).teachingFa.includes('نه آزمون'));
  check('German catalog has 4,750 stable unique examples with Persian translation, pronunciation and vocabulary', germanSentences.length === 4750 && new Set(germanSentences.map(sentence => sentence.id)).size === germanSentences.length && germanSentences.every(sentence => sentence.text && sentence.fa && sentence.pronunciation && sentence.vocabulary.length && sentence.vocabulary.every(word => word.word && word.meaning)));
  check('German lesson dialogues stay sentence-aligned and translated', germanCourse.every(lesson => lesson.dialogue.length >= 3 && lesson.dialogue.every(line => line.text && line.fa)));
  check('German lessons resolve only through the new sentence-first catalog', germanCourse.every(lesson => app.languages.findGermanLesson(lesson.id) === lesson) && app.languages.findGermanLesson(archivedGerman[0].id) === undefined);
  const retiredGermanRoutes = ['details.tsx', 'recap.tsx', 'completion.tsx', 'coverage.tsx', 'audio-check.tsx'];
  check('retired German course routes redirect to the active sentence-first library', retiredGermanRoutes.every(file => {
    const source = readFileSync(path.join(APP, 'app', 'learn', '[language]', file), 'utf8');
    return source.includes('Redirect') && source.includes('/learn/de/library');
  }));
  const scopedGermanRoutes = ['unit.tsx', 'practice.tsx', 'review.tsx'].map(file => readFileSync(path.join(APP, 'app', 'learn', '[language]', file), 'utf8'));
  check('only the published three-skill A1 module is reachable through German guided routes', scopedGermanRoutes.every(source => source.includes('de-a1-skills') && source.includes('Redirect') && source.includes('/learn/de/library')));
  const germanHomeSource = readFileSync(path.join(APP, 'components', 'GermanSentenceHome.tsx'), 'utf8');
  check('German home exposes the reviewed A1 listening, reading and writing unit', germanHomeSource.includes('/learn/de/unit?unit=de-a1-skills') && germanHomeSource.includes('خواندن و پیام‌نویسی'));
  const germanLessonRoute = readFileSync(path.join(APP, 'app', 'learn', '[language]', 'lesson.tsx'), 'utf8');
  check('active German sentence lessons restore, save and clear per-lesson checkpoints', germanLessonRoute.includes('loadGermanSentenceSession') && germanLessonRoute.includes('saveGermanSentenceSession') && germanLessonRoute.includes('clearGermanSentenceSession') && germanLessonRoute.includes('جلسهٔ ذخیره‌شده بازیابی شد'));
  const germanBackupRoute = readFileSync(path.join(APP, 'app', 'learn', '[language]', 'backup.tsx'), 'utf8');
  check('German home backup route exports and merges only German progress', germanBackupRoute.includes('germanProgress.exportProgress()') && germanBackupRoute.includes('germanProgress.restoreProgress(importText)'));
  check('German home links to its progress backup screen', germanHomeSource.includes("router.push('/learn/de/backup'"));
  const germanWorkshopRoute = readFileSync(path.join(APP, 'app', 'learn', '[language]', 'workshop.tsx'), 'utf8');
  check('German home workshop opens a local, ungraded writing and speaking practice instead of redirecting away', germanWorkshopRoute.includes('loadWorkshop') && germanWorkshopRoute.includes('saveWorkshop') && germanWorkshopRoute.includes('ORAL_TASKS') && germanWorkshopRoute.includes('WRITING_TASKS') && !germanWorkshopRoute.includes('Redirect'));
  check('English language card reports the expanded active course size', app.languages.findLanguage('en').lessonsCount === 174);
  check('German language card reports the active sentence course size', app.languages.findLanguage('de').lessonsCount === germanCourse.length);
  check('German uses de-DE speech, English keeps en-US', app.languages.findLanguage('de').speechLocale === 'de-DE' && app.languages.findLanguage('en').speechLocale === 'en-US');
  check('unknown language does not silently become English', app.languages.findLanguage('unknown') === undefined);
  check('unknown German lesson is rejected by lookup', app.languages.findGermanLesson('unknown') === undefined);
  const enBefore = JSON.stringify(await app.courseProgress.getCourseProgress());
  const dp = app.languages.germanProgress;
  check('German starts independently of English progress', (await dp.getCourseProgress()).completedLessonIds.length === 0);
  await dp.completeSentenceLesson(germanCourse[0].id, germanCourse[1].id);
  let deProgress = await dp.getCourseProgress();
  check('German completion persists and advances', deProgress.completedLessonIds.includes(germanCourse[0].id) && deProgress.currentLessonId === germanCourse[1].id);
  check('German does not populate the English 504 tracker', deProgress.learnedEssential504Words.length === 0);
  check('German completion does not alter English history', JSON.stringify(await app.courseProgress.getCourseProgress()) === enBefore);
  let deCards = await dp.getDueReviewCards();
  check('German review includes every active German sentence for the 50-example Pre-A1 lesson', deCards.length === germanCourse[0].sentences.length && deCards.every(card => card.lessonId === germanCourse[0].id));
  await dp.rateReviewCard(deCards[0].id, 'easy');
  check('German review reschedules independently', (await dp.getDueReviewCards()).length === deCards.length - 1);
  check('German review cannot rate an English card', await dp.rateReviewCard('foundation-introducing-yourself:s1', 'good') === null);
  let blocked = false; try { await dp.completeSentenceLesson('foundation-introducing-yourself'); } catch { blocked = true; }
  check('German store rejects English lesson completion', blocked);
  check('German progress uses a versioned independent storage key', OS === 'web' ? Boolean(window.localStorage.getItem('sentence_course_progress_de_v2')) : Boolean(app.asyncStorage.__dump()['sentence_course_progress_de_v2']));
  check('admin and roadmap features default to disabled', !app.features.FEATURES.adminPanel && !app.features.FEATURES.contentEditor && !app.features.FEATURES.assignments && !app.features.FEATURES.germanAI);

  const oldCompleted = (await dp.getCourseProgress()).completedLessonIds.slice();
  await dp.completeSentenceLesson(germanCourse[2].id, germanCourse[3].id);
  const extendedProgress = await dp.getCourseProgress();
  check('Completing a German lesson preserves earlier completions', extendedProgress.completedLessonIds.includes(germanCourse[2].id) && oldCompleted.every(id => extendedProgress.completedLessonIds.includes(id)));
  check('new German lesson sentences enter spaced review', (await dp.getDueReviewCards()).filter(card => card.lessonId === germanCourse[2].id).length === germanCourse[2].sentences.length);
  check('German sentence-course completion leaves English unchanged', JSON.stringify(await app.courseProgress.getCourseProgress()) === enBefore);

  section('German sentence lesson save and resume');
  const sentenceSessions = app.germanSentenceSession;
  const lessonDraftStorage = OS === 'web' ? window.localStorage : app.asyncStorage;
  const sentenceDraftA = { schemaVersion: 1, lessonId: germanCourse[4].id, stage: 2, index: 6, updatedAt: '2026-10-08T10:00:00.000Z' };
  const sentenceDraftB = { schemaVersion: 1, lessonId: germanCourse[5].id, stage: 3, index: 23, updatedAt: '2026-10-08T10:05:00.000Z' };
  await sentenceSessions.clearGermanSentenceSession(sentenceDraftA.lessonId);
  await sentenceSessions.clearGermanSentenceSession(sentenceDraftB.lessonId);
  check('fresh German sentence lesson has no saved session', await sentenceSessions.loadGermanSentenceSession(sentenceDraftA.lessonId) === null);
  await sentenceSessions.saveGermanSentenceSession(sentenceDraftA);
  await sentenceSessions.saveGermanSentenceSession(sentenceDraftB);
  check('lesson stage and five-sentence page restore exactly', JSON.stringify(await sentenceSessions.loadGermanSentenceSession(sentenceDraftA.lessonId)) === JSON.stringify(sentenceDraftA));
  check('in-progress sentence-builder position restores exactly', JSON.stringify(await sentenceSessions.loadGermanSentenceSession(sentenceDraftB.lessonId)) === JSON.stringify(sentenceDraftB));
  let invalidSentenceDraft = false;
  try { await sentenceSessions.saveGermanSentenceSession({ ...sentenceDraftA, index: 99 }); } catch { invalidSentenceDraft = true; }
  check('invalid session index is rejected without overwriting the saved checkpoint', invalidSentenceDraft && JSON.stringify(await sentenceSessions.loadGermanSentenceSession(sentenceDraftA.lessonId)) === JSON.stringify(sentenceDraftA));
  await sentenceSessions.clearGermanSentenceSession(sentenceDraftA.lessonId);
  check('clearing one lesson session preserves another lesson checkpoint', await sentenceSessions.loadGermanSentenceSession(sentenceDraftA.lessonId) === null && JSON.stringify(await sentenceSessions.loadGermanSentenceSession(sentenceDraftB.lessonId)) === JSON.stringify(sentenceDraftB));
  const corruptSessionKey = sentenceSessions.germanSentenceSessionKey(sentenceDraftB.lessonId);
  await lessonDraftStorage.setItem(corruptSessionKey, '{broken JSON');
  let corruptSessionRejected = false;
  try { await sentenceSessions.loadGermanSentenceSession(sentenceDraftB.lessonId); } catch { corruptSessionRejected = true; }
  check('corrupt session is reported and not silently replaced with an empty draft', corruptSessionRejected && (OS === 'web' ? window.localStorage.getItem(corruptSessionKey) : app.asyncStorage.__dump()[corruptSessionKey]) === '{broken JSON');
  if (OS === 'web') window.localStorage.removeItem(corruptSessionKey); else await app.asyncStorage.removeItem(corruptSessionKey);
  check('clearing a saved lesson session removes only its draft', await sentenceSessions.loadGermanSentenceSession(sentenceDraftB.lessonId) === null);

  section('German progress backup and safe restore');
  const backupKey = 'sentence_course_backup_roundtrip_test';
  const backupStore = app.courseStore.createCourseProgressStore({ key: backupKey, lessons: germanCourse, cloudSync: false, recordEstimatedTime: false });
  await lessonDraftStorage.removeItem(backupKey);
  await lessonDraftStorage.removeItem(backupKey + '_backup_v1');
  await lessonDraftStorage.removeItem(backupKey + '_before_restore');
  await backupStore.completeSentenceLesson(germanCourse[0].id, germanCourse[1].id);
  const firstReviewCard = (await backupStore.getDueReviewCards())[0];
  await backupStore.rateReviewCard(firstReviewCard.id, 'easy');
  const backupJson = await backupStore.exportProgress();
  const backupPayload = JSON.parse(backupJson);
  check('exported backup identifies the German course and includes its review schedule', backupPayload.schema === 1 && backupPayload.courseKey === backupKey && backupPayload.progress.completedLessonIds.includes(germanCourse[0].id) && backupPayload.progress.reviewCards.some((card) => card.id === firstReviewCard.id && card.repetitions === 1));
  const previousBackup = JSON.parse(await backupStore.exportPreviousProgress());
  check('previous local snapshot can be exported before a later write', previousBackup.courseKey === backupKey && previousBackup.progress.completedLessonIds.includes(germanCourse[0].id) && previousBackup.progress.reviewCards.find((card) => card.id === firstReviewCard.id)?.repetitions === 0);
  await lessonDraftStorage.removeItem(backupKey);
  const restoredBackup = await backupStore.restoreProgress(backupJson);
  check('valid backup restores completed lessons and spaced-review ratings', restoredBackup.completedLessonIds.includes(germanCourse[0].id) && restoredBackup.reviewCards.find(card => card.id === firstReviewCard.id)?.repetitions === 1);
  await backupStore.completeSentenceLesson(germanCourse[1].id, germanCourse[2].id);
  const mergedBackup = await backupStore.restoreProgress(backupJson);
  check('restore merges without deleting newer local course progress', mergedBackup.completedLessonIds.includes(germanCourse[0].id) && mergedBackup.completedLessonIds.includes(germanCourse[1].id));
  const unchangedBeforeInvalidRestore = JSON.stringify(await backupStore.getCourseProgress());
  let wrongCourseRejected = false;
  try { await backupStore.restoreProgress(JSON.stringify({ ...backupPayload, courseKey: 'sentence_course_progress_v1' })); } catch { wrongCourseRejected = true; }
  check('backup from another course is rejected without changing current progress', wrongCourseRejected && JSON.stringify(await backupStore.getCourseProgress()) === unchangedBeforeInvalidRestore);
  let unknownLessonRejected = false;
  try { await backupStore.restoreProgress(JSON.stringify({ ...backupPayload, progress: { ...backupPayload.progress, completedLessonIds: [...backupPayload.progress.completedLessonIds, 'unknown-lesson'] } })); } catch { unknownLessonRejected = true; }
  check('backup with unknown lesson IDs is rejected without changing current progress', unknownLessonRejected && JSON.stringify(await backupStore.getCourseProgress()) === unchangedBeforeInvalidRestore);
  let invalidJsonRejected = false;
  try { await backupStore.restoreProgress('{bad json'); } catch { invalidJsonRejected = true; }
  check('malformed JSON is rejected without changing current progress', invalidJsonRejected && JSON.stringify(await backupStore.getCourseProgress()) === unchangedBeforeInvalidRestore);
  await lessonDraftStorage.removeItem(backupKey);
  await lessonDraftStorage.removeItem(backupKey + '_backup_v1');
  await lessonDraftStorage.removeItem(backupKey + '_before_restore');

  section('Guided German A1 unit: content, scoring and durable activity');
  const unit = app.firstMeeting.FIRST_MEETING;
  const engine = app.unitProgress;
  const allExercises = [...unit.lessons.flatMap(l=>l.exercises), ...unit.mission];
  check('first meeting has five lessons, fifteen practice tasks and six mission tasks', unit.lessons.length===5 && unit.lessons.flatMap(l=>l.exercises).length===15 && unit.mission.length===6);
  check('all unit exercise identifiers are unique', new Set(allExercises.map(e=>e.id)).size===allExercises.length);
  check('all objectives referenced by exercises exist', allExercises.every(e=>unit.objectives.some(o=>o.id===e.objectiveId)));
  check('prerequisites point backwards to existing lessons', unit.lessons.every((l,i)=>l.prerequisiteIds.every(id=>unit.lessons.slice(0,i).some(p=>p.id===id))));
  check('every mission objective was taught', unit.mission.every(e=>unit.lessons.some(l=>l.objectiveIds.includes(e.objectiveId))));
  check('choices have valid unique answers', allExercises.filter(e=>e.kind==='choice').every(e=>e.choices.some(c=>c.id===e.correctChoice)&&new Set(e.choices.map(c=>c.id)).size===e.choices.length));
  check('ordering tasks contain exactly the answer words', allExercises.filter(e=>e.kind==='order').every(e=>e.tokens.slice().sort().join('|')===e.answer.split(' ').sort().join('|')));
  check('every declared reference answer is accepted', allExercises.every(e=>engine.evaluateExercise(e,e.kind==='choice'?e.correctChoice:e.kind==='order'?e.answer:e.sample)));
  check('empty and unrelated answers are rejected', allExercises.every(e=>!engine.evaluateExercise(e,'')&&!engine.evaluateExercise(e,'irrelevant answer')));
  const formal = unit.mission.find(e=>e.id==='mission-formal');
  check('alternative formal wording is accepted', engine.evaluateExercise(formal,'Wie ist Ihr Name?'));
  check('case, whitespace, punctuation and ss are tolerant', engine.evaluateExercise(formal,'  WIE   HEISSEN SIE!  '));
  check('informal form does not satisfy formal prompt', !engine.evaluateExercise(formal,'Wie heißt du?'));
  const correctResults = unit.mission.map(e=>({exerciseId:e.id,correct:true,assisted:false}));
  const assistedResults = correctResults.map(r=>({...r,assisted:true}));
  check('assisted responses are not counted as independent', engine.scoreAttempt(assistedResults,unit.mission).independent===0);
  check('six independent answers satisfy this practice target', engine.scoreAttempt(correctResults,unit.mission).meetsPracticeTarget);
  check('four out of six does not satisfy the practice target', !engine.scoreAttempt(correctResults.map((r,i)=>({...r,correct:i<4})),unit.mission).meetsPracticeTarget);
  check('duplicate submissions cannot inflate score or replace first failure', engine.scoreAttempt([{...correctResults[0],correct:false},...correctResults],unit.mission).independent===5);
  check('empty exercise sets never count as passed', !engine.scoreAttempt([],[]).meetsPracticeTarget);
  let unitState=await engine.getUnitProgress();
  check('guided unit starts separate from legacy completed lessons', Object.keys(unitState.activities).length===0 && unitState.missions.length===0);
  const attempt={id:'test-mission',finishedAt:new Date().toISOString(),results:correctResults};
  let missionBlocked=false;try{await engine.saveUnitMission(attempt);}catch{missionBlocked=true;}
  check('mission storage requires completing unit activities',missionBlocked);
  const lessonAttempt={id:'test-activity',finishedAt:new Date().toISOString(),results:unit.lessons[0].exercises.map(e=>({exerciseId:e.id,correct:false,assisted:false}))};
  await engine.saveLessonActivity(unit.lessons[0].id,lessonAttempt);
  unitState=await engine.getUnitProgress();
  check('finished activity is recorded even when practice needs work', Boolean(unitState.activities[unit.lessons[0].id]) && engine.scoreAttempt(lessonAttempt.results,unit.lessons[0].exercises).independent===0);
  check('completing a lesson does not fabricate an assessment',unitState.missions.length===0);
  let incompleteBlocked=false;try{await engine.saveLessonActivity(unit.lessons[0].id,{...lessonAttempt,results:[]});}catch{incompleteBlocked=true;}
  check('partial activity is not saved as complete',incompleteBlocked);
  await Promise.all(unit.lessons.slice(1).map(l=>engine.saveLessonActivity(l.id,{id:l.id,finishedAt:new Date().toISOString(),results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))})));
  check('parallel lesson saves do not overwrite each other',Object.keys((await engine.getUnitProgress()).activities).length===5);
  await engine.saveUnitMission(attempt);await engine.saveUnitMission(attempt);
  check('retrying same save does not duplicate mission history',(await engine.getUnitProgress()).missions.length===1);
  check('unit progress persists using its own key',OS==='web'?Boolean(window.localStorage.getItem(engine.UNIT_PROGRESS_KEY)):Boolean(app.asyncStorage.__dump()[engine.UNIT_PROGRESS_KEY]));
  const remoteActivity={id:'remote-newer',finishedAt:new Date(Date.now()+5000).toISOString(),results:unit.lessons[0].exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))};
  const remoteMission={id:'cloud-mission',finishedAt:new Date(Date.now()+5000).toISOString(),results:correctResults};
  const mergedUnit=await engine.mergeRemoteUnitProgress(unit,{version:1,activities:{[unit.lessons[0].id]:remoteActivity},missions:[remoteMission]});
  check('cloud unit merge keeps every local lesson, prefers a newer result and unions mission attempts',Object.keys(mergedUnit.activities).length===unit.lessons.length&&mergedUnit.activities[unit.lessons[0].id].id==='remote-newer'&&mergedUnit.missions.length===2);
  const beforeInvalidUnitMerge=JSON.stringify(await engine.getUnitProgress());
  let invalidUnitMergeRejected=false;try{await engine.mergeRemoteUnitProgress(unit,{version:1,activities:{unknown:{...remoteActivity}},missions:[]});}catch{invalidUnitMergeRejected=true;}
  check('cloud unit merge rejects foreign lesson IDs without changing local progress',invalidUnitMergeRejected&&JSON.stringify(await engine.getUnitProgress())===beforeInvalidUnitMerge);
  const previousGerman=JSON.stringify(await dp.getCourseProgress());
  await app.unitReview.firstMeetingReview.completeSentenceLesson(unit.lessons[0].id);
  check('unit sentences join their own spaced review',(await app.unitReview.firstMeetingReview.getDueReviewCards()).length===unit.lessons[0].examples.length);
  check('unit review does not alter previous German progress',JSON.stringify(await dp.getCourseProgress())===previousGerman);
  check('new unit does not alter English progress',JSON.stringify(await app.courseProgress.getCourseProgress())===enBefore);
  check('roadmap includes A1, A2 and B1', ['A1','A2','B1'].every(level=>app.roadmap.GERMAN_ROADMAP.some(s=>s.level===level)));

  section('Learning planner and resumable sessions');
  const sessions=app.sessions, planner=app.planner;
  const completedBeforeDrafts=JSON.stringify(await engine.getUnitProgress());
  const blank={activities:{},missions:[]};
  const draft={schemaVersion:1,unitId:unit.id,contentVersion:unit.version,lessonId:unit.lessons[0].id,attemptId:'draft-a',stage:'exercise',index:0,answer:'a',ordered:[],assisted:true,feedback:false,results:[{exerciseId:unit.lessons[0].exercises[0].id,correct:false,assisted:true}],updatedAt:'2026-10-07T10:00:00.000Z'};
  check('valid feedback draft accepted',sessions.validSession(draft,unit,draft.lessonId));
  for(const [label,patch] of Object.entries({schema:{schemaVersion:2},content:{contentVersion:99},index:{index:99},answer:{answer:'a'.repeat(301)},tokens:{ordered:[99]},duplicate:{results:[draft.results[0],draft.results[0]]},help:{assisted:false},feedback:{feedback:true},missing:{results:[]},stage:{stage:'done'},time:{updatedAt:'invalid'},nullResult:{results:[null]}})){
    check('invalid draft rejected: '+label,!sessions.validSession({...draft,...patch},unit,draft.lessonId));
  }
  check('unknown lesson rejected',!sessions.validSession({...draft,lessonId:'unknown'},unit,'unknown'));
  check('missing earlier answers rejected',!sessions.validSession({...draft,index:1,results:[],feedback:null},unit,draft.lessonId));
  check('mission cannot resume instruction stage',!sessions.validSession({...draft,lessonId:null,stage:'context'},unit,null));
  await sessions.saveSession(unit,draft);
  check('resume keeps first response and assistance',JSON.stringify(await sessions.loadSession(unit,draft.lessonId))===JSON.stringify(draft));
  const second={...draft,lessonId:unit.lessons[1].id,attemptId:'draft-b',stage:'context',feedback:null,results:[],answer:'',assisted:false,updatedAt:'2026-10-07T11:00:00.000Z'};
  await Promise.all([sessions.saveSession(unit,draft),sessions.saveSession(unit,second)]);
  check('parallel drafts persist independently',!!await sessions.loadSession(unit,draft.lessonId)&&!!await sessions.loadSession(unit,second.lessonId));
  check('latest session selected by time',(await sessions.latestSession(unit)).attemptId==='draft-b');
  check('committed stale drafts excluded from resume',(await sessions.latestSession(unit,['draft-b'])).attemptId==='draft-a');
  const mutable={...second,answer:'original'};
  const pending=sessions.saveSession(unit,mutable);mutable.answer='changed';await pending;
  check('queued writes snapshot caller values',(await sessions.loadSession(unit,second.lessonId)).answer==='original');
  await Promise.all([sessions.saveSession(unit,draft),sessions.clearSession(unit,draft.lessonId)]);
  check('clear is ordered after pending save',await sessions.loadSession(unit,draft.lessonId)===null);
  check('clear does not erase another session',!!await sessions.loadSession(unit,second.lessonId));
  let badSave=false;try{await sessions.saveSession(unit,{...draft,index:-1});}catch{badSave=true;}
  check('invalid save rejects without overwriting valid drafts',badSave&&!!await sessions.loadSession(unit,second.lessonId));
  check('old unit content cannot resume',await sessions.loadSession({...unit,version:unit.version+1},second.lessonId)===null);
  check('resume takes priority over due review',planner.planNextStep(unit,blank,3,draft).type==='resume');
  check('review precedes new content',planner.planNextStep(unit,blank,3,null).type==='review');
  check('unit review recommendation has correct course scope',planner.planNextStep(unit,blank,3,null).href.includes('course=first-meeting'));
  check('empty learner starts first lesson',planner.planNextStep(unit,blank,0,null).href.includes(unit.lessons[0].id));
  const partial={activities:{[unit.lessons[0].id]:lessonAttempt},missions:[]};
  check('next lesson follows prerequisites',planner.planNextStep(unit,partial,0,null).href.includes(unit.lessons[1].id));
  check('mission draft cannot bypass prerequisites',planner.planNextStep(unit,blank,0,{...draft,lessonId:null}).type==='lesson');
  check('unknown session cannot recommend invalid route',planner.planNextStep(unit,blank,0,{...draft,lessonId:'unknown'}).type==='lesson');
  check('completed attempt is not recommended as draft',planner.planNextStep(unit,partial,0,{...draft,attemptId:lessonAttempt.id}).type==='lesson');
  const full={activities:Object.fromEntries(unit.lessons.map(l=>[l.id,{id:l.id,finishedAt:'2026-10-07T08:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))}])),missions:[]};
  check('mission follows five completed activities',planner.planNextStep(unit,full,0,null).type==='mission');
  const weakMission={id:'weak',finishedAt:'2026-10-07T09:00:00.000Z',results:correctResults.map((r,i)=>({...r,assisted:i===0}))};
  const weakState={...full,missions:[weakMission]};
  const repair=planner.planNextStep(unit,weakState,0,null);
  check('assisted mission response schedules related repair',repair.type==='repair'&&repair.href.includes(unit.lessons.find(l=>l.objectiveIds.includes(unit.mission[0].objectiveId)).id));
  const repaired={...weakState,activities:Object.fromEntries(Object.entries(full.activities).map(([id,a])=>[id,{...a,finishedAt:'2026-10-07T10:00:00.000Z'}]))};
  check('repair is followed by independent reassessment',planner.planNextStep(unit,repaired,0,null).type==='mission');
  const strongState={...full,missions:[weakMission,{id:'strong',finishedAt:'2026-10-07T11:00:00.000Z',results:correctResults}]};
  check('fully independent mission leads to consolidation not nonexistent unit',planner.planNextStep(unit,strongState,0,null).type==='consolidate');
  check('latest observation avoids repeat evidence inflation',planner.collectEvidence(unit,strongState).length===21);
  check('latest mission replaces older assisted evidence',planner.collectEvidence(unit,strongState).filter(e=>e.source==='mission').every(e=>e.correct&&!e.assisted));
  check('empty skills do not fabricate mastery',planner.skillEvidence(unit,blank).every(e=>e.observed===0&&e.independent===0));
  check('speaking is not reported as assessed',!planner.skillEvidence(unit,strongState).some(e=>e.skill==='speaking'));
  check('assistance is not independent in skill report',planner.skillEvidence(unit,weakState).reduce((n,e)=>n+e.independent,0)===20);
  check('objectives flag assisted mission evidence',planner.objectiveEvidence(unit,weakState).some(o=>o.needsPractice>0));
  check('draft operations preserve completed progress',JSON.stringify(await engine.getUnitProgress())===completedBeforeDrafts&&JSON.stringify(await dp.getCourseProgress())===previousGerman&&JSON.stringify(await app.courseProgress.getCourseProgress())===enBefore);
  await sessions.clearSession(unit,second.lessonId);
  check('no resume after clearing all sessions',await sessions.latestSession(unit)===null);
  const sessionStorage=OS==='web'?window.localStorage:app.asyncStorage;
  const originalSet=sessionStorage.setItem;
  sessionStorage.setItem=()=>{throw new Error('storage quota');};
  let writeFailed=false;try{await sessions.saveSession(unit,draft);}catch{writeFailed=true;}
  sessionStorage.setItem=originalSet;
  check('storage write failure is surfaced to caller',writeFailed);
  await sessions.saveSession(unit,draft);
  check('write queue recovers after failure',!!await sessions.loadSession(unit,draft.lessonId));
  const originalGet=sessionStorage.getItem;
  sessionStorage.getItem=()=>{throw new Error('storage blocked');};
  let readFailed=false;try{await sessions.latestSession(unit);}catch{readFailed=true;}
  sessionStorage.getItem=originalGet;
  check('storage access errors are not silent empty progress',readFailed);
  await sessionStorage.setItem(sessions.SESSION_STORAGE_KEY,'broken JSON');
  check('malformed JSON does not crash session route',await sessions.latestSession(unit)===null);
  await sessionStorage.setItem(sessions.SESSION_STORAGE_KEY,JSON.stringify({[sessions.sessionKey(unit,draft.lessonId)]:{...draft,schemaVersion:2}}));
  check('unsupported stored schema is ignored',await sessions.loadSession(unit,draft.lessonId)===null);
  await sessions.saveSession(unit,draft);
  check('valid session can replace unsupported snapshot',!!await sessions.loadSession(unit,draft.lessonId));
  await sessions.clearSession(unit,draft.lessonId);


  section('Multi-unit A1 curriculum and independent stores');
  const published=app.units.GERMAN_UNITS;
  const accountProgressIds=app.units.ALL_GERMAN_PROGRESS_UNITS.map(u=>u.id);
  check('account-sync unit registry includes all published units, recap, both checkpoints and both level assessments',published.every(u=>accountProgressIds.includes(u.id))&&['de-a1-recap','de-a1-checkpoint-a','de-a1-checkpoint-b','de-zero-final','de-a1-final'].every(id=>accountProgressIds.includes(id)));
  const oldUnitBefore=JSON.stringify(await engine.getUnitProgress());
  const oldReviewBefore=JSON.stringify(await app.unitReview.firstMeetingReview.getCourseProgress());
  check('twenty published sections, with one hundred guided lessons',published.length===20&&published.flatMap(u=>u.lessons).length===100);
  check('two Pre-A1 units, seventeen internal A1 units and one separate A2 starter are published',published.filter(u=>u.level==='Pre-A1').length===2&&published.filter(u=>u.level==='A1').length===17&&published.filter(u=>u.level==='A2').length===1&&!published.some(u=>u.level==='B1'));
  check('internal A1 map totals 85 guided lessons and the starter totals ten',published.filter(u=>u.level==='A1').flatMap(u=>u.lessons).length===85&&published.filter(u=>u.level==='Pre-A1').flatMap(u=>u.lessons).length===10);
  check('legacy unit route still resolves first meeting',app.units.findGermanUnit()===unit);
  check('unknown unit is rejected instead of falling back',app.units.findGermanUnit('invalid')===undefined);
  check('first unit keeps its exact progress key',engine.unitProgressKey(unit)===engine.UNIT_PROGRESS_KEY);
  check('first unit keeps its exact review store',app.unitReviews.reviewForUnit(unit)===app.unitReview.firstMeetingReview);
  check('progress keys unique by unit',new Set(published.map(u=>engine.unitProgressKey(u))).size===published.length);
  check('new content version gets a separate progress key',engine.unitProgressKey({...unit,version:2})!==engine.UNIT_PROGRESS_KEY);
  const exerciseIds=published.flatMap(u=>[...u.lessons.flatMap(l=>l.exercises),...u.mission]).map(e=>e.id);
  check('exercise IDs globally unique across guided units',new Set(exerciseIds).size===exerciseIds.length);
  const freshState={version:1,activities:{},missions:[]};
  const courseDrafts=[];
  const missionFor=u=>({id:'same-id-across-units',finishedAt:'2026-10-07T12:00:00.000Z',results:u.mission.map(e=>({exerciseId:e.id,correct:true,assisted:false}))});
  for(const u of published.slice(1)) {
    const tasks=[...u.lessons.flatMap(l=>l.exercises),...u.mission];
    check(u.id+': five lessons and five mission tasks',u.lessons.length===5&&u.mission.length===5);
    check(u.id+': every objective taught and independently checked',u.objectives.every(o=>u.lessons.some(l=>l.objectiveIds.includes(o.id))&&u.mission.some(e=>e.objectiveId===o.id)));
    check(u.id+': every exercise references a valid objective',tasks.every(e=>u.objectives.some(o=>o.id===e.objectiveId)));
    check(u.id+': prerequisites point backwards',u.lessons.every((l,i)=>l.prerequisiteIds.every(id=>u.lessons.slice(0,i).some(p=>p.id===id))));
    check(u.id+': all reference answers accepted',tasks.every(e=>engine.evaluateExercise(e,e.kind==='choice'?e.correctChoice:e.kind==='order'?e.answer:e.sample)));
    check(u.id+': all alternate writing answers accepted',tasks.filter(e=>e.kind==='write').every(e=>e.acceptedAnswers.every(a=>engine.evaluateExercise(e,a))));
    check(u.id+': order tokens exactly match answers',tasks.filter(e=>e.kind==='order').every(e=>e.tokens.slice().sort().join('|')===e.answer.split(' ').sort().join('|')));
    check(u.id+': listening answers point to valid choices',tasks.filter(e=>e.kind==='choice').every(e=>(e.skill==='listening'?e.audioText&&e.transcriptFa:e.readingText)&&e.choices.some(c=>c.id===e.correctChoice)));
    check(u.id+': full instruction and Persian translations',u.lessons.every(l=>l.patternFa&&l.pronunciationFa&&l.situationFa&&l.dialogue.length>=3&&l.dialogue.every(d=>d.text&&d.fa)&&l.examples.length>=3));
    check(u.id+': lesson lookup retains unit identity',u.lessons.every(l=>app.units.unitForLesson(l.id)===u));
    check(u.id+': links scope unit, practice and review',app.units.unitHref(u).includes(u.id)&&app.units.unitPracticeHref(u,u.lessons[0].id).includes(u.id)&&app.units.unitReviewHref(u).includes(u.id));
    check(u.id+': progress initially empty',Object.keys((await engine.getUnitProgress(u)).activities).length===0);
    let gate=false;try{await engine.saveUnitMission(missionFor(u),u);}catch{gate=true;}
    check(u.id+': other unit completion cannot unlock mission',gate);
    let foreign=false;try{await engine.saveLessonActivity(unit.lessons[0].id,lessonAttempt,u);}catch{foreign=true;}
    check(u.id+': rejects lesson from another unit',foreign);
    await Promise.all(u.lessons.map(l=>engine.saveLessonActivity(l.id,{id:l.id,finishedAt:'2026-10-07T11:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))},u)));
    check(u.id+': parallel activity writes all retained',Object.keys((await engine.getUnitProgress(u)).activities).length===5);
    await engine.saveUnitMission(missionFor(u),u);await engine.saveUnitMission(missionFor(u),u);
    check(u.id+': mission retry is idempotent',(await engine.getUnitProgress(u)).missions.length===1);
    const review=app.unitReviews.reviewForUnit(u);
    check(u.id+': review instance is stable',review===app.unitReviews.reviewForUnit(u));
    await review.completeSentenceLesson(u.lessons[0].id);
    check(u.id+': unit review includes only its own examples',(await review.getDueReviewCards()).length===3&&(await review.getDueReviewCards()).every(c=>c.lessonId===u.lessons[0].id));
    const d={schemaVersion:1,unitId:u.id,contentVersion:u.version,lessonId:u.lessons[0].id,attemptId:'shared-draft-id',stage:'exercise',index:0,answer:'c0',ordered:[],assisted:true,feedback:false,results:[{exerciseId:u.lessons[0].exercises[0].id,correct:false,assisted:true}],updatedAt:u===published[1]?'2026-10-07T13:00:00.000Z':'2026-10-07T14:00:00.000Z'};
    courseDrafts.push(d);await sessions.saveSession(u,d);
    check(u.id+': draft restores helped first response',(await sessions.loadSession(u,d.lessonId)).results[0].assisted===true);
    check(u.id+': draft cannot restore into first unit',await sessions.loadSession(unit,d.lessonId)===null);
    check(u.id+': empty progress proposes its first lesson',planner.planNextStep(u,freshState,0,null).href.includes(u.lessons[0].id));
    const weak={...(await engine.getUnitProgress(u)),missions:[{...missionFor(u),results:missionFor(u).results.map((r,i)=>({...r,assisted:i===0}))}]};
    check(u.id+': helped mission schedules same-unit repair',planner.planNextStep(u,weak,0,null).type==='repair'&&planner.planNextStep(u,weak,0,null).href.includes(u.id));
  }
  check('new units did not change original unit history',JSON.stringify(await engine.getUnitProgress())===oldUnitBefore);
  check('new unit reviews did not alter first-unit review',JSON.stringify(await app.unitReview.firstMeetingReview.getCourseProgress())===oldReviewBefore);
  check('new unit operations preserve legacy German and English',JSON.stringify(await dp.getCourseProgress())===previousGerman&&JSON.stringify(await app.courseProgress.getCourseProgress())===enBefore);
  await sessions.clearSession(published[1],courseDrafts[0].lessonId);
  check('clearing one unit draft leaves another intact',!!await sessions.loadSession(published[2],courseDrafts[1].lessonId));
  const nextSnapshots=await Promise.all(published.map(async u=>({unit:u,progress:await engine.getUnitProgress(u),due:0,resume:null})));
  const firstComplete={...nextSnapshots[0],progress:strongState};
  const secondEmpty={...nextSnapshots[1],progress:freshState};
  const thirdEmpty={...nextSnapshots[2],progress:freshState};
  const coursePlan=app.coursePlanner.planCourseStep;
  check('course advances to second unit after independent first mission',coursePlan([firstComplete,secondEmpty,thirdEmpty]).unit.id===published[1].id);
  check('course does not skip incomplete second unit',coursePlan([firstComplete,secondEmpty,thirdEmpty]).action.type==='lesson');
  check('course review priority crosses unit boundaries',coursePlan([firstComplete,secondEmpty,{...thirdEmpty,due:3}]).unit.id===published[2].id&&coursePlan([firstComplete,secondEmpty,{...thirdEmpty,due:3}]).action.type==='review');
  check('newest draft takes priority over due review',coursePlan([{...firstComplete,due:4},{...secondEmpty,resume:courseDrafts[0]},{...thirdEmpty,resume:courseDrafts[1]}]).unit.id===published[2].id);
  check('all completed units lead to consolidation, not unpublished levels',coursePlan([firstComplete,...nextSnapshots.slice(1)]).action.type==='consolidate');
  check('no published units means no fabricated recommendation',coursePlan([])===null);
  const beforeCross=published.slice(1).map(u=>engine.unitProgressKey(u));
  check('same attempt IDs do not collide across units',new Set(beforeCross).size===published.length-1&&(await engine.getUnitProgress(published[1])).missions[0].id===(await engine.getUnitProgress(published[2])).missions[0].id);
  await Promise.all(published.slice(1).map((u,i)=>sessions.clearSession(u,courseDrafts[i].lessonId)));

  section('Shopping and home expansion');
  const shopping=published.find(u=>u.id==='de-a1-shopping');
  const home=published.find(u=>u.id==='de-a1-home');
  check('published path matches each level roadmap order',['A1','A2'].every(level=>published.filter(u=>u.level===level).every((u,i)=>u.title===app.roadmap.GERMAN_ROADMAP.find(l=>l.level===level).units[i])));
  check('shopping follows time, home follows shopping',app.units.previousGermanUnit(shopping).id==='de-a1-time'&&app.units.previousGermanUnit(home)===shopping);
  check('all 300 practice tasks and 101 unit-mission tasks present',published.flatMap(u=>u.lessons.flatMap(l=>l.exercises)).length===300&&published.flatMap(u=>u.mission).length===101);
  const sTasks=[...shopping.lessons.flatMap(l=>l.exercises),...shopping.mission];
  const hTasks=[...home.lessons.flatMap(l=>l.exercises),...home.mission];
  check('polite request accepts both taught word orders',engine.evaluateExercise(sTasks.find(e=>e.id==='de-shopping-order-write'),'Ich möchte bitte ein Wasser.')&&engine.evaluateExercise(sTasks.find(e=>e.id==='de-shopping-order-write'),'Ich möchte ein Wasser, bitte.'));
  check('masculine tea requires einen in the target mission',!engine.evaluateExercise(sTasks.find(e=>e.id==='de-shopping-order-mission'),'Ich möchte ein Tee, bitte.'));
  check('with sugar does not pass without sugar mission',!engine.evaluateExercise(sTasks.find(e=>e.id==='de-shopping-preferences-mission'),'Mit Zucker, bitte.'));
  check('wrong amount does not pass price mission',!engine.evaluateExercise(sTasks.find(e=>e.id==='de-shopping-price-mission'),'Das kostet fünf Euro.'));
  check('payment question accepts zahlen alternative',engine.evaluateExercise(sTasks.find(e=>e.id==='de-shopping-pay-mission'),'Kann ich mit Karte zahlen?'));
  check('bathroom alternatives accepted',engine.evaluateExercise(hTasks.find(e=>e.id==='de-home-rooms-write'),'Wo ist das Badezimmer?'));
  check('wrong negation does not pass sofa task',!engine.evaluateExercise(hTasks.find(e=>e.id==='de-home-furniture-write'),'Ich habe nicht Sofa.'));
  check('existence question is not accepted as location question',!engine.evaluateExercise(hTasks.find(e=>e.id==='de-home-location-write'),'Gibt es hier eine Bäckerei?'));
  check('location target requires taught dative phrase',!engine.evaluateExercise(hTasks.find(e=>e.id==='de-home-location-mission'),'Die Apotheke ist neben der Supermarkt.'));
  check('course moves from time to shopping',coursePlan([...nextSnapshots.slice(0,3).map((s,i)=>i===0?firstComplete:s),{...nextSnapshots[3],progress:freshState},{...nextSnapshots[4],progress:freshState}]).unit===shopping);
  check('course moves from shopping to home',coursePlan([firstComplete,...nextSnapshots.slice(1,4),{...nextSnapshots[4],progress:freshState}]).unit===home);
  check('home review has correct scoped URL',planner.planNextStep(home,freshState,2,null).href.includes('unit=de-a1-home'));

  section('Work and transport expansion');
  const work=published.find(u=>u.id==='de-a1-work');
  const transport=published.find(u=>u.id==='de-a1-transport');
  const wTasks=[...work.lessons.flatMap(l=>l.exercises),...work.mission];
  const tTasks=[...transport.lessons.flatMap(l=>l.exercises),...transport.mission];
  check('work follows home, transport follows work',app.units.previousGermanUnit(work)===home&&app.units.previousGermanUnit(transport)===work);
  check('work accepts expanded im phrase',engine.evaluateExercise(wTasks.find(e=>e.id==='de-work-place-write'),'Ich arbeite in dem Büro.'));
  check('wake-up target requires separated auf',!engine.evaluateExercise(wTasks.find(e=>e.id==='de-work-morning-mission'),'Ich stehe um sechs Uhr.'));
  check('wrong work hours rejected',!engine.evaluateExercise(wTasks.find(e=>e.id==='de-work-hours-mission'),'Ich arbeite von acht bis vier Uhr.'));
  check('time-first target requires verb second',!engine.evaluateExercise(wTasks.find(e=>e.id==='de-work-evening-write'),'Am Abend ich lerne Deutsch.'));
  check('transport foot phrase accepts ss',engine.evaluateExercise(tTasks.find(e=>e.id==='de-transport-mode-write'),'Ich gehe zu Fuss.'));
  check('wrong ticket destination rejected',!engine.evaluateExercise(tTasks.find(e=>e.id==='de-transport-ticket-mission'),'Ich brauche eine Fahrkarte nach Berlin.'));
  check('departure target requires separated ab',!engine.evaluateExercise(tTasks.find(e=>e.id==='de-transport-departure-mission'),'Der Zug fährt um neun Uhr.'));
  check('left direction cannot pass right-direction mission',!engine.evaluateExercise(tTasks.find(e=>e.id==='de-transport-directions-mission'),'Biegen Sie links ab.'));
  check('modal transfer target keeps infinitive together',!engine.evaluateExercise(tTasks.find(e=>e.id==='de-transport-transfer-write'),'Ich muss steigen um.'));
  check('planner advances to work',coursePlan([firstComplete,...nextSnapshots.slice(1,5),{...nextSnapshots[5],progress:freshState},{...nextSnapshots[6],progress:freshState}]).unit===work);
  check('planner advances to transport',coursePlan([firstComplete,...nextSnapshots.slice(1,6),{...nextSnapshots[6],progress:freshState}]).unit===transport);
  check('transport review route is scoped',planner.planNextStep(transport,freshState,2,null).href.includes('unit=de-a1-transport'));

  section('Needs and optional mixed A1 recap');
  const needs=published.find(u=>u.id==='de-a1-needs');
  const recap=app.recap.A1_RECAP;
  check('needs unit follows transport',app.units.previousGermanUnit(needs)===transport);
  check('all-independent internal A1 path recommends its comprehensive final assessment',coursePlan([firstComplete,...nextSnapshots.slice(1).filter(s=>s.unit.level==='A1')]).action.href==='/learn/de/recap?exam=de-a1-final');
  check('partial path never recommends the A1 final assessment',coursePlan([{...firstComplete,progress:freshState},...nextSnapshots.slice(1)]).action.href!=='/learn/de/recap?exam=de-a1-final');
  const foundationUnits=app.units.FOUNDATION_UNITS;
  const foundationFresh=foundationUnits.map(unit=>({unit,progress:freshState,due:0,resume:null}));
  check('a new learner starts with the first Pre-A1 lesson',coursePlan(foundationFresh).action.href.includes('lesson=de-zero-alphabet'));
  check('partial Pre-A1 course cannot jump to its final assessment',coursePlan([{...foundationFresh[0],progress:{...freshState,activities:Object.fromEntries(foundationUnits[0].lessons.map(l=>[l.id,{id:l.id,finishedAt:'2026-10-08T08:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))}]))}},foundationFresh[1]]).action.href!=='/learn/de/recap?exam=de-zero-final');
  const fullSnapshot=unit=>({unit,due:0,resume:null,progress:{version:1,activities:Object.fromEntries(unit.lessons.map(l=>[l.id,{id:`done-${l.id}`,finishedAt:'2026-10-08T08:00:00.000Z',results:l.exercises.map(e=>({exerciseId:e.id,correct:true,assisted:false}))}])),missions:[{id:`mission-${unit.id}`,finishedAt:'2026-10-08T09:00:00.000Z',results:unit.mission.map(e=>({exerciseId:e.id,correct:true,assisted:false}))}]}});
  check('all Pre-A1 lessons and unit missions unlock the foundation final assessment',coursePlan(foundationUnits.map(fullSnapshot)).action.href==='/learn/de/recap?exam=de-zero-final');
  check('recap is separate from teaching-unit count',!published.includes(recap)&&recap.lessons.length===0&&app.units.findGermanUnit(recap.id)===recap);
  check('recap contains two listening, two reading and four writing questions',recap.mission.length===8&&recap.mission.filter(e=>e.skill==='listening').length===2&&recap.mission.filter(e=>e.skill==='reading').length===2&&recap.mission.filter(e=>e.skill==='writing').length===4);
  check('recap IDs do not collide with existing exercises',recap.mission.every(e=>!exerciseIds.includes(e.id))&&new Set(recap.mission.map(e=>e.id)).size===8);
  check('all recap answers accepted',recap.mission.every(e=>engine.evaluateExercise(e,e.kind==='choice'?e.correctChoice:e.sample)));
  check('recap repair targets point to real lessons in all eight units',new Set(Object.values(app.recap.RECAP_TARGETS).map(t=>t.unitId)).size===8&&recap.mission.every(e=>{
    const t=app.units.repairTarget(recap,e.objectiveId);return t&&app.units.findGermanUnit(t.unitId)?.lessons.some(l=>l.id===t.lessonId);
  }));
  check('recap unit link opens report route',app.units.unitHref(recap)==='/learn/de/recap');
  const originalUnitHistories=await Promise.all(published.map(u=>engine.getUnitProgress(u)));
  const recapAttempt={id:'recap-test',finishedAt:'2026-10-07T15:00:00.000Z',results:recap.mission.map((e,i)=>({exerciseId:e.id,correct:i!==0,assisted:i===2}))};
  let partialRecapBlocked=false;try{await engine.saveUnitMission({...recapAttempt,results:recapAttempt.results.slice(1)},recap);}catch{partialRecapBlocked=true;}
  check('partial recap cannot be stored as complete',partialRecapBlocked);
  await engine.saveUnitMission(recapAttempt,recap);await engine.saveUnitMission(recapAttempt,recap);
  check('optional recap is stored separately and retry is idempotent',(await engine.getUnitProgress(recap)).missions.length===1&&engine.unitProgressKey(recap)!==engine.unitProgressKey(needs));
  check('recap does not rewrite unit histories',JSON.stringify(await Promise.all(published.map(u=>engine.getUnitProgress(u))))===JSON.stringify(originalUnitHistories));
  const recapWeak=app.recap.recapRepairs(recapAttempt);
  check('wrong and assisted recap responses both generate repair',recapWeak.length===2&&recapWeak.some(r=>r.unitId===unit.id)&&recapWeak.some(r=>r.unitId==='de-a1-time'));
  check('correct independent recap leaves no repair',app.recap.recapRepairs({...recapAttempt,results:recapAttempt.results.map(r=>({...r,correct:true,assisted:false}))}).length===0);
  check('recap evidence preserves skill-specific counts',planner.skillEvidence(recap,{version:1,activities:{},missions:[recapAttempt]}).find(s=>s.skill==='listening').independent===1);
  const recapDraft={schemaVersion:1,unitId:recap.id,contentVersion:1,lessonId:null,attemptId:'recap-draft',stage:'exercise',index:0,answer:'Wie heißen Sie?',ordered:[],assisted:false,feedback:null,results:[],updatedAt:'2026-10-07T16:00:00.000Z'};
  await sessions.saveSession(recap,recapDraft);
  check('recap draft restores independently',(await sessions.loadSession(recap,null)).answer===recapDraft.answer&&await sessions.loadSession(needs,null)===null);
  await sessions.clearSession(recap,null);
  const help=needs.mission.find(e=>e.id==='de-needs-help-mission');
  check('help request accepts optional bitte',engine.evaluateExercise(help,'Können Sie mir bitte helfen?'));
  check('help request rejects mich instead of mir',!engine.evaluateExercise(help,'Können Sie mich helfen?'));
  check('wrong missing object is rejected',!engine.evaluateExercise(needs.mission.find(e=>e.id==='de-needs-find-mission'),'Ich finde meine Tasche nicht.'));
  check('thirst uses haben in taught pattern',!engine.evaluateExercise(needs.lessons[2].exercises[2],'Ich bin Durst.'));

  section('Connected passages and constrained short messages');
  const skillsUnit=published.find(u=>u.id==='de-a1-skills');
  check('skills section follows needs',app.units.previousGermanUnit(skillsUnit)===needs);
  check('each skills lesson exercises listening reading and writing',skillsUnit.lessons.every(l=>['listening','reading','writing'].every(skill=>l.exercises.some(e=>e.skill===skill))));
  check('reading passages are substantial and separate from transcripts',skillsUnit.lessons.every(l=>{const e=l.exercises.find(e=>e.skill==='reading');return e.kind==='choice'&&e.readingText.split(/\s+/).length>=20&&!e.audioText;}));
  check('listening passages connect at least three sentences',skillsUnit.lessons.every(l=>{const e=l.exercises.find(e=>e.skill==='listening');return e.audioText.split(/\s+/).length>=20&&e.audioText.split('.').length>=4&&e.transcriptFa;}));
  check('writing tasks disclose finite matching and contain two-part messages',skillsUnit.lessons.every(l=>{const e=l.exercises.find(e=>e.skill==='writing');return e.taskNoteFa&&e.acceptedAnswers.every(a=>a.includes('. '));}));
  const visit=skillsUnit.mission.find(e=>e.id==='de-skills-visit-mission');
  check('new message target requires both requested facts',!engine.evaluateExercise(visit,'Ich wohne in Berlin.')&&!engine.evaluateExercise(visit,'Ich wohne in Bonn. Wir treffen uns um elf Uhr.'));
  check('new message target accepts line breaks',engine.evaluateExercise(visit,'Ich wohne in Berlin.\nWir treffen uns um elf Uhr.'));
  const readQuestion=skillsUnit.lessons[0].exercises[1];
  check('reading wrong person rejected',!engine.evaluateExercise(readQuestion,'c0'));
  const readingDraft={schemaVersion:1,unitId:skillsUnit.id,contentVersion:1,lessonId:skillsUnit.lessons[0].id,attemptId:'reading-draft',stage:'exercise',index:1,answer:readQuestion.correctChoice,ordered:[],assisted:false,feedback:true,results:[{exerciseId:skillsUnit.lessons[0].exercises[0].id,correct:true,assisted:true},{exerciseId:readQuestion.id,correct:true,assisted:false}],updatedAt:'2026-10-07T18:00:00.000Z'};
  await sessions.saveSession(skillsUnit,readingDraft);
  check('visible reading source does not count as assistance',(await sessions.loadSession(skillsUnit,readingDraft.lessonId)).results[1].assisted===false);
  await sessions.clearSession(skillsUnit,readingDraft.lessonId);
  check('skills section is proposed before final recap',coursePlan([firstComplete,...nextSnapshots.slice(1,8),{...nextSnapshots[8],progress:freshState}]).unit===skillsUnit);

  section('A2 starter: Perfekt and level isolation');
  const a2=app.units.GERMAN_A2_UNITS[0];
  check('A1 registry contains 17 internal units and does not include A2/preparatory progress',app.units.GERMAN_A1_UNITS.length===17&&app.units.GERMAN_A1_UNITS.reduce((n,u)=>n+u.lessons.length,0)===85&&app.units.GERMAN_A1_UNITS.every(u=>u.level==='A1'));
  check('A2 has separate level and stable namespace',a2.level==='A2'&&engine.unitProgressKey(a2)==='learning_unit_de-a2-past_v1');
  check('A2 follows final supplemental A1 unit',app.units.previousGermanUnit(a2).id==='de-a1-real-life');
  check('A2 contains three skills in each lesson',a2.lessons.every(l=>['listening','reading','writing'].every(skill=>l.exercises.some(e=>e.skill===skill))));
  check('A2 inputs are connected passages',a2.lessons.every(l=>l.exercises[0].audioText.split(/\s+/).length>=25&&l.exercises[1].readingText.split(/\s+/).length>=25));
  check('A2 messages disclose constrained assessment',a2.lessons.every(l=>l.exercises[2].taskNoteFa&&l.exercises[2].sample.includes('. ')));
  const a2Exercise=id=>a2.lessons.flatMap(l=>l.exercises).concat(a2.mission).find(e=>e.id===id);
  check('Perfekt target rejects present-tense substitution',!engine.evaluateExercise(a2Exercise('de-a2-past-haben-write'),'Gestern arbeite ich. Am Abend lerne ich Deutsch.'));
  check('movement target rejects wrong auxiliary',!engine.evaluateExercise(a2Exercise('de-a2-past-sein-write'),'Ich habe nach Bonn gefahren. Danach habe ich nach Hause gegangen.'));
  check('separable participle requires eingekauft',!engine.evaluateExercise(a2Exercise('de-a2-past-weekend-write'),'Am Samstag habe ich geeinkauft. Am Sonntag habe ich meine Mutter besucht.'));
  check('be prefix does not accept added ge',!engine.evaluateExercise(a2Exercise('de-a2-past-weekend-write'),'Am Samstag habe ich eingekauft. Am Sonntag habe ich meine Mutter gebesucht.'));
  check('irregular participle required for eating',!engine.evaluateExercise(a2Exercise('de-a2-past-meal-write'),'Ich habe Brot geesst. Danach habe ich Wasser getrunken.'));
  check('three-part narrative requires all requested facts',!engine.evaluateExercise(a2Exercise('de-a2-past-story-mission'),'Am Samstag bin ich nach Berlin gefahren. Danach habe ich Wasser getrunken.'));
  check('full narrative fits existing draft input limit',a2.mission.every(e=>e.sample.length<=300));
  const a2Snapshot=nextSnapshots.find(s=>s.unit===a2);
  check('A2 can start without inventing an A1 pass',coursePlan([{...a2Snapshot,progress:freshState}]).unit===a2&&coursePlan([{...a2Snapshot,progress:freshState}]).action.type==='lesson');
  check('finished A2 never points back to A1 recap as its final action',coursePlan([a2Snapshot]).action.type==='consolidate'&&coursePlan([a2Snapshot]).action.href.includes(a2.id));
  check('level-specific review routing preserved',planner.planNextStep(a2,freshState,3,null).href.includes('unit=de-a2-past'));

  section('A1 gap closure: coverage, fresh questions and ungraded production');
  const gaps=published.filter(u=>['de-a1-contact','de-a1-calendar','de-a1-interests','de-a1-grammar','de-a1-real-life'].includes(u.id));
  check('25 new lessons address audited gaps',gaps.length===5&&gaps.flatMap(u=>u.lessons).length===25);
  check('new lessons each include listening reading and constrained writing',gaps.every(u=>u.lessons.every(l=>l.exercises.map(e=>e.skill).join(',')==='listening,reading,writing'&&l.exercises[2].taskNoteFa)));
  check('new unit missions have all three skills',gaps.every(u=>new Set(u.mission.map(e=>e.skill)).size===3));
  check('coverage map points only to published A1 units',app.coverage.A1_COVERAGE.every(a=>a.units.every(id=>published.some(u=>u.id===id&&u.level==='A1'))));
  const allCheckIds=app.checkpoints.A1_CHECKPOINTS.flatMap(u=>u.mission.map(e=>e.id));
  check('twenty fresh assessment IDs separate from lessons and core recap',allCheckIds.length===20&&new Set(allCheckIds).size===20&&allCheckIds.every(id=>!exerciseIds.includes(id)&&!recap.mission.some(e=>e.id===id)));
  for(const u of app.checkpoints.A1_CHECKPOINTS){
    check(u.id+': separate assessment route',app.units.findGermanUnit(u.id)===u&&app.units.unitHref(u).includes('exam='+u.id)&&!published.includes(u));
    check(u.id+': three listening three reading four writing',u.mission.filter(e=>e.skill==='listening').length===3&&u.mission.filter(e=>e.skill==='reading').length===3&&u.mission.filter(e=>e.skill==='writing').length===4);
    check(u.id+': objective and repair links resolve',u.mission.every(e=>{const t=app.units.repairTarget(u,e.objectiveId);return u.objectives.some(o=>o.id===e.objectiveId)&&app.units.findGermanUnit(t?.unitId)?.lessons.some(l=>l.id===t.lessonId);}));
    check(u.id+': accepted answers and wrong answers checked',u.mission.every(e=>e.kind==='choice'?engine.evaluateExercise(e,e.correctChoice)&&e.choices.filter(c=>c.id!==e.correctChoice).every(c=>!engine.evaluateExercise(e,c.id)):e.acceptedAnswers.every(a=>engine.evaluateExercise(e,a))&&!engine.evaluateExercise(e,'wrong answer')));
    await engine.saveUnitMission(missionFor(u),u);
    check(u.id+': optional assessment saves without teaching gate',(await engine.getUnitProgress(u)).missions.length===1);
    const d={schemaVersion:1,unitId:u.id,contentVersion:1,lessonId:null,attemptId:'checkpoint-draft',stage:'exercise',index:0,answer:'c0',ordered:[],assisted:true,feedback:null,results:[],updatedAt:new Date().toISOString()};
    await sessions.saveSession(u,d);
    check(u.id+': draft resumes independently',(await sessions.loadSession(u,null))?.unitId===u.id);
  }
  const getGap=id=>gaps.flatMap(u=>u.lessons.flatMap(l=>l.exercises)).find(e=>e.id===id);
  for(const [id,wrong] of [['de-calendar-clock-write','Es ist halb acht.'],['de-grammar-person-write','Wir lernt Deutsch.'],['de-grammar-possessive-write','Ich suche mein Stift.'],['de-contact-phone-write','479'],['de-grammar-modals-write','Ich muss stehe früh auf.']])check(id+': plausible wrong answer rejected',!engine.evaluateExercise(getGap(id),wrong));
  check('natural gern and gerne variants accepted',engine.evaluateExercise(getGap('de-interest-hobby-write'),'Ich lese gerne.'));
  const workshop=app.workshop;
  const untouched=JSON.stringify(await engine.getUnitProgress(unit));
  const blankWorkshop=await workshop.loadWorkshop();
  check('workshop starts empty and has no grade',workshop.validWorkshop(blankWorkshop)&&blankWorkshop.messages.invite===''&&!('score' in blankWorkshop));
  check('blank form reports missing fields',workshop.formFeedback(blankWorkshop.form).length===1);
  const wd={...blankWorkshop,form:{first:'Alex',last:'Winter',street:'Gartenstraße 8',postcode:'10115',city:'Berlin',birth:'14.03.2000',phone:'000000000',email:'alex@example.com'},messages:{invite:'Ein freier Text, nicht aus einer Antwortliste.',change:'Entschuldigung!'},checks:{'invite-0':true,'intro-0':true},notes:'دوباره تمرین کنم'};
  check('fictional form meets structural checks only',workshop.formFeedback(wd.form).length===0);
  check('malformed email postcode date and phone flagged',workshop.formFeedback({...wd.form,postcode:'12',email:'bad',birth:'today',phone:'abc'}).length===4);
  await workshop.saveWorkshop(wd);
  check('free text form oral checklist and Persian notes restore',JSON.stringify(await workshop.loadWorkshop())===JSON.stringify(wd));
  const localWorkshopSync=await workshop.exportWorkshopChecklistSyncState();
  check('workshop cloud snapshot contains only timestamped checkbox values, not personal form or free text',localWorkshopSync.checks['invite-0']?.checked===true&&!JSON.stringify(localWorkshopSync).match(/Alex|Winter|Gartenstraße|alex@example|Ein freier Text|دوباره تمرین/));
  const cloudChecklistAt=new Date(Date.now()+1000).toISOString();
  await workshop.mergeRemoteWorkshopChecklistSyncState({version:1,resetAt:null,checks:{'change-0':{checked:true,updatedAt:cloudChecklistAt}}});
  let mergedWorkshop=await workshop.loadWorkshop();
  check('remote checklist item merges without changing private workshop fields',mergedWorkshop.checks['change-0']===true&&mergedWorkshop.notes===wd.notes&&mergedWorkshop.form.email===wd.form.email&&mergedWorkshop.messages.invite===wd.messages.invite);
  const cloudUncheckAt=new Date(Date.now()+2000).toISOString();
  await workshop.mergeRemoteWorkshopChecklistSyncState({version:1,resetAt:null,checks:{'change-0':{checked:false,updatedAt:cloudUncheckAt}}});
  check('timestamped false checklist value acts as a cross-device uncheck', (await workshop.loadWorkshop()).checks['change-0']===false);
  const workshopBeforeInvalid=JSON.stringify(await workshop.loadWorkshop());
  for(const [label,patch] of Object.entries({version:{version:2},form:{form:{}},messages:{messages:{invite:'x'.repeat(2001),change:''}},checks:{checks:{'unknown':true}},notes:{notes:123},date:{updatedAt:'bad'}})){
    check('workshop rejects invalid '+label,!workshop.validWorkshop({...wd,...patch}));
    let rejected=false;try{await workshop.saveWorkshop({...wd,...patch});}catch{rejected=true;}check('invalid '+label+' never overwrites draft',rejected&&JSON.stringify(await workshop.loadWorkshop())===workshopBeforeInvalid);
  }
  await workshop.clearWorkshop();
  const clearedWorkshopChecks=await workshop.exportWorkshopChecklistSyncState();
  check('explicit workshop clear stores a sync tombstone and leaves lesson history intact',!!clearedWorkshopChecks.resetAt&&Object.keys(clearedWorkshopChecks.checks).length===0&&JSON.stringify(await engine.getUnitProgress(unit))===untouched);
  await workshop.mergeRemoteWorkshopChecklistSyncState({version:1,resetAt:null,checks:{'invite-0':{checked:true,updatedAt:cloudChecklistAt},'change-0':{checked:false,updatedAt:cloudUncheckAt}}});
  check('older remote workshop checkboxes do not reappear after the clear tombstone',Object.keys((await workshop.exportWorkshopChecklistSyncState()).checks).length===0&&(await workshop.loadWorkshop()).checks['invite-0']===undefined);
  await workshop.saveWorkshop({...workshop.emptyWorkshop(),checks:{'intro-0':true}});
  const postResetWorkshop=await workshop.exportWorkshopChecklistSyncState();
  check('a new workshop checkbox after clear supersedes the tombstone',postResetWorkshop.checks['intro-0']?.checked===true&&Date.parse(postResetWorkshop.checks['intro-0'].updatedAt)>Date.parse(postResetWorkshop.resetAt));

  // ---------------------------------------- F. config detection + guards -----
  section('F. Supabase configuration detection & fail-fast guards');
  const errorEntry = `
export * as errors from '@/lib/errors';
export * as education from '@/lib/educationAdmin';
export * as emma from '@/lib/emma';
export * as assist from '@/lib/humanChatAssist';
`;
  const scenarios = [
    { name: 'empty env', env: {}, configured: false },
    { name: 'template env copied from .env.example', env: { url: 'https://your-project.supabase.co', key: 'your-anon-key' }, configured: false },
    { name: 'real-looking project', env: { url: 'https://abcdefghijklmnop.supabase.co', key: 'eyJhbGciOiJIUzI1NiJ9.signature' }, configured: true },
  ];
  let emptyEnvModule = null;
  for (const scenario of scenarios) {
    const mod = await load(errorEntry, `errors-${scenario.name.replace(/\W+/g, '-')}`, scenario.env);
    if (!emptyEnvModule) emptyEnvModule = mod;
    let threw = false;
    try {
      mod.errors.requireSupabaseConfigured();
    } catch {
      threw = true;
    }
    check(`[${scenario.name}] guard ${scenario.configured ? 'allows' : 'blocks'} the call`, threw !== scenario.configured,
      `threw=${threw}, expected configured=${scenario.configured}`);
    if (!scenario.configured) {
      let message = '';
      try {
        mod.errors.requireSupabaseConfigured();
      } catch (error) {
        message = error.message;
      }
      check(`[${scenario.name}] explains what to put in .env`, message.includes('EXPO_PUBLIC_SUPABASE_URL'));
    }
  }

  const rawErrors = [
    ['Could not find the function public.create_contact_invite(p_display_name) in the schema cache', 'توابع ساخت کد دعوت'],
    ['Anonymous sign-ins are disabled', 'ورود ناشناس'],
    ['Invite is invalid or expired', 'اشتباه است یا اعتبار'],
    ['You cannot claim your own invite', 'کد دعوت خودتان'],
    ['relation "public.messages" does not exist', 'جدول‌های مکالمه'],
    ['Failed to fetch', 'ارتباط با سرور Supabase'],
    ['ENOTFOUND placeholder.supabase.co', 'ارتباط با سرور Supabase'],
  ];
  check('every raw error becomes actionable Persian text',
    rawErrors.every(([raw, expected]) => emptyEnvModule.errors.readableSupabaseError(new Error(raw)).includes(expected)),
    rawErrors.map(([raw]) => `${raw.slice(0, 20)}…`).join(' | '));
  const errors = emptyEnvModule.errors;
  const education = emptyEnvModule.education;
  const emptyStats = education.progressMetrics(null);
  check('admin report handles unsynced progress', emptyStats.lessons === 0 && emptyStats.words === 0);
  const dirtyStats = education.progressMetrics({completedLessonIds: ['foundation-introducing-yourself', 'foundation-introducing-yourself', 'unknown'], learnedEssential504Words: ['keen', 'keen', 'unknown'], totalMinutes: -4, currentStreak: Infinity});
  check('admin report deduplicates and validates lesson identifiers', dirtyStats.lessons === 1);
  check('admin report counts only reference vocabulary', dirtyStats.words === 1);
  check('admin report rejects invalid numeric totals', dirtyStats.minutes === 0 && dirtyStats.streak === 0);
  check('invalid invitations produce a readable Persian message', education.educationError(new Error('INVITE_INVALID')).includes('دعوت معتبر نیست'));

  check('missing relationship is not an invite RPC error', errors.readableSupabaseError({ message: "Could not find a relationship between learning_contacts and profiles in the schema cache" }).includes('ارتباط جدول'));
  check('generic schema cache errors do not blame invite functions', !errors.readableSupabaseError({ message: "Could not find the table in the schema cache" }).includes('توابع ساخت کد'));
  check('plain PostgREST errors retain their message', errors.readableSupabaseError({ message: 'relation "public.messages" does not exist', code: '42P01' }).includes('جدول‌های مکالمه'));
  check('unknown objects never render object Object', !errors.readableSupabaseError({}).includes('[object Object]'));
  check('legacy object Object message uses fallback', !errors.readableSupabaseError(new Error('[object Object]')).includes('[object Object]'));
  check('AI quota has a billing-specific explanation', errors.readableAIError({ code: 'AI_QUOTA_EXHAUSTED' }, 503).includes('اعتبار'));
  check('AI rate limit differs from quota', errors.readableAIError({ code: 'AI_RATE_LIMITED' }, 429).includes('درخواست‌های زیادی'));
  check('daily limit differs from upstream rate limit', errors.readableAIError({ code: 'DAILY_LIMIT' }, 429).includes('فردا'));
  check('missing AI key is configuration, not internet', errors.readableAIError({ code: 'AI_NOT_CONFIGURED' }, 503).includes('کلید'));
  check('function HTTP body is parsed', (await errors.readableFunctionError({ context: new Response(JSON.stringify({ code: 'AI_QUOTA_EXHAUSTED' }), { status: 503 }) })).includes('اعتبار'));
  check('old deployed generic error does not claim an internet failure', (await errors.readableFunctionError({ context: new Response(JSON.stringify({ error: 'AI provider request failed' }), { status: 502 }) })).includes('ممکن است'));
  check('non-JSON gateway response handled', (await errors.readableFunctionError({ context: new Response('Not found', { status: 404 }) })).includes('پیدا نشد'));
  check('transport failure handled', (await errors.readableFunctionError(new Error('Failed to fetch'))).includes('ارتباط شبکه'));
  check('askEmma fails fast instead of attempting the network', await (async () => {
    try {
      await emptyEnvModule.emma.askEmma([{ role: 'user', content: 'hi' }]);
      return false;
    } catch (error) {
      return error.message.includes('بدون هزینه');
    }
  })());
  check('the private chat assistant fails fast too', await (async () => {
    try {
      await emptyEnvModule.assist.requestHumanChatAssist({ mode: 'translate', text: 'سلام' });
      return false;
    } catch (error) {
      return error.message.includes('بدون هزینه');
    }
  })());
}

let totalPass = 0;
let totalFail = 0;

for (const OS of PATH_NAMES) {
  pass = 0;
  problems.length = 0;
  await runPath(OS);
  totalPass += pass;
  totalFail += problems.length;
  console.log(`\n${'-'.repeat(56)}`);
  console.log(`storage path: ${OS}   PASS: ${pass}   FAIL: ${problems.length}`);
  if (problems.length) {
    console.log('failed checks:');
    problems.forEach((item) => console.log('  - ' + item));
    process.exitCode = 1;
  }
}

console.log(`\nTOTAL: ${totalPass} checks passed, ${totalFail} failed`);
