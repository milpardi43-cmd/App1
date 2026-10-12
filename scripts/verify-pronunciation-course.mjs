#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'node_modules', '.cache', 'pronunciation-course-test');
mkdirSync(cache, { recursive: true });
const entry = path.join(cache, 'entry.ts');
writeFileSync(entry, `
export * as course from '${path.join(root, 'lib/languages/pronunciationCourse.ts')}';
export * as progress from '${path.join(root, 'lib/languages/pronunciationProgress.ts')}';
export { default as mockAsyncStorage } from '@react-native-async-storage/async-storage';
`);
const esbuild = await import('esbuild');
const stubs = path.join(root, 'scripts', 'test-stubs');
const bundle = await esbuild.build({
  entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  plugins: [{ name: 'local-pronunciation-storage-stubs', setup(build) {
    build.onResolve({ filter: /^react-native$/ }, () => ({ path: path.join(stubs, 'react-native.js') }));
    build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: path.join(stubs, 'async-storage.js') }));
    build.onResolve({ filter: /^\.\.\/personalLearningSync$/ }, () => ({ path: 'personal-learning-sync', namespace: 'local-stub' }));
    build.onLoad({ filter: /.*/, namespace: 'local-stub' }, () => ({ contents: 'export function schedulePersonalLearningSync() {}', loader: 'js' }));
  } }],
});
const outfile = path.join(cache, 'bundle.mjs');
writeFileSync(outfile, bundle.outputFiles[0].text);
globalThis.__RN_OS__ = 'ios';
const app = await import(`${outfile}?run=${Date.now()}`);
const check = (condition, message) => assert.ok(condition, message);
let checks = 0;
const verify = (condition, message) => { check(condition, message); checks += 1; };

const { PRONUNCIATION_COURSES } = app.course;
for (const language of ['en', 'de']) {
  const units = PRONUNCIATION_COURSES[language];
  verify(units.length >= 8, `${language} has a structured multi-lesson pronunciation course`);
  verify(new Set(units.map(unit => unit.id)).size === units.length, `${language} unit IDs are unique`);
  verify(units.every(unit => unit.title && unit.explanationFa && unit.practiceFa && unit.practiceText && unit.examples.length >= 2), `${language} units include instruction, examples and a practice sentence`);
}
verify(PRONUNCIATION_COURSES.en.some(unit => /thin و this/.test(unit.title)), 'English course teaches the two TH sounds');
verify(PRONUNCIATION_COURSES.en.some(unit => /s و ed/.test(unit.title)), 'English course teaches common suffix pronunciations');
verify(PRONUNCIATION_COURSES.de.some(unit => /Umlaut/.test(unit.title)), 'German course teaches umlaut articulation');
verify(PRONUNCIATION_COURSES.de.some(unit => /ich و Bach/.test(unit.title)), 'German course contrasts both common CH sounds');

const storage = app.mockAsyncStorage;
await storage.clear();
const englishKey = app.progress.PRONUNCIATION_PROGRESS_KEYS.en;
const enUnit = PRONUNCIATION_COURSES.en[0];
const deUnit = PRONUNCIATION_COURSES.de[0];
verify(Object.keys(await app.progress.loadPronunciationMarks('en')).length === 0, 'missing English local marks start empty');
verify(Object.keys(await app.progress.loadPronunciationMarks('de')).length === 0, 'missing German local marks start empty');
await app.progress.savePronunciationMark('en', enUnit.id, 'practiced');
await app.progress.savePronunciationMark('de', deUnit.id, 'review');
verify((await app.progress.loadPronunciationMarks('en'))[enUnit.id]?.mark === 'practiced', 'English self-review status persists locally');
verify((await app.progress.loadPronunciationMarks('de'))[deUnit.id]?.mark === 'review', 'German self-review status persists locally');
verify(Object.keys(await app.progress.loadPronunciationMarks('en')).length === 1, 'English and German progress remain separate');
await app.progress.savePronunciationMark('en', enUnit.id, null);
verify((await app.progress.loadPronunciationMarks('en'))[enUnit.id]?.mark === null, 'cleared marks persist as cross-device tombstones');

await storage.setItem(englishKey, JSON.stringify({ schemaVersion: 1, language: 'en', marks: { [enUnit.id]: 'review' } }));
verify((await app.progress.loadPronunciationMarks('en'))[enUnit.id]?.mark === 'review', 'existing v1 local marks migrate in memory without data loss');
await assert.rejects(app.progress.savePronunciationMark('en', 'unknown-unit', 'practiced')); checks += 1;

const corrupt = '{not-json';
await storage.setItem(englishKey, corrupt);
await assert.rejects(app.progress.loadPronunciationMarks('en')); checks += 1;
verify(await storage.getItem(englishKey) === corrupt, 'corrupt local data is preserved, never silently replaced');

const ui = readFileSync(path.join(root, 'components/PronunciationCourse.tsx'), 'utf8');
verify(/Speech\.speak/.test(ui), 'sample speech is played by the platform TTS engine');
verify(!/getUserMedia|Speech\.requestPermissions|Speech\.Recording|navigator\.mediaDevices|fetch\s*\(/.test(ui), 'pronunciation course does not request a microphone, record audio or call a network endpoint');
verify(readFileSync(path.join(root, 'app/lang/index.tsx'), 'utf8').includes("'/learn/en/pronunciation'"), 'English home links to its pronunciation course');
verify(readFileSync(path.join(root, 'components/GermanSentenceHome.tsx'), 'utf8').includes("'/learn/de/pronunciation'"), 'German home links to its pronunciation course');
verify(readFileSync(path.join(root, 'components/AppBottomNav.tsx'), 'utf8').includes("'/learn/en/pronunciation'"), 'English navigation includes the pronunciation course');
verify(readFileSync(path.join(root, 'components/GermanBottomNav.tsx'), 'utf8').includes("'/learn/de/pronunciation'"), 'German navigation includes the pronunciation course');

console.log(`${checks} checks passed; English/German pronunciation lessons, backward-compatible self-review storage, navigation and speech privacy verified.`);
