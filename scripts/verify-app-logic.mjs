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
    target: 'node22',
    logLevel: 'silent',
    absWorkingDir: APP,
    define: {
      'process.env.EXPO_PUBLIC_SUPABASE_URL': JSON.stringify(env.url ?? ''),
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
export * as storage from '@/lib/storage';
export * as format from '@/lib/format';
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

  check('129 sentence lessons exist', lessons.length === 129, `got ${lessons.length}`);
  check('lesson ids are unique', new Set(lessons.map((l) => l.id)).size === lessons.length);
  const orders = lessons.map((l) => l.order).sort((a, b) => a - b);
  check('orders are exactly 1..129', JSON.stringify(orders) === JSON.stringify([...Array(129)].map((_, i) => i + 1)));
  check('every lesson has a title', lessons.every((l) => typeof l.title === 'string' && l.title.length > 1));
  check('every lesson has sentences', lessons.every((l) => Array.isArray(l.sentences) && l.sentences.length > 0));
  check('every sentence has id + English + Persian', allSentences.every((s) => s.id && s.en && s.fa));
  check('sentence ids are unique inside each lesson', lessons.every((l) => new Set(l.sentences.map((s) => s.id)).size === l.sentences.length));
  check('more than 500 sentences in total', allSentences.length > 500, `${allSentences.length}`);
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
  check('daily activity minutes are counted', progress.todayMinutes > 0, `${progress.todayMinutes}`);
  check('streak becomes 1 after activity', progress.currentStreak === 1);
  check('that lesson contributes its 504 words',
    progress.learnedEssential504Words.length === app.essentials.getEssential504WordsForLesson(lesson1.id).length);

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

  // ---------------------------------------- D. setup state -------------------
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

  // ---------------------------------------- F. config detection + guards -----
  section('F. Supabase configuration detection & fail-fast guards');
  const errorEntry = `
export * as errors from '@/lib/errors';
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
  check('askEmma fails fast instead of attempting the network', await (async () => {
    try {
      await emptyEnvModule.emma.askEmma([{ role: 'user', content: 'hi' }]);
      return false;
    } catch (error) {
      return error.message.includes('EXPO_PUBLIC_SUPABASE_URL');
    }
  })());
  check('the private chat assistant fails fast too', await (async () => {
    try {
      await emptyEnvModule.assist.requestHumanChatAssist({ mode: 'translate', text: 'سلام' });
      return false;
    } catch (error) {
      return error.message.includes('EXPO_PUBLIC_SUPABASE_URL');
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
