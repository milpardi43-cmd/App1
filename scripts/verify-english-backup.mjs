#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'node_modules', '.cache', 'english-backup-test');
mkdirSync(cache, { recursive: true });
const entry = path.join(cache, 'entry.ts');
writeFileSync(entry, `
export * as backup from '${path.join(root, 'lib/englishBackup.ts')}';
export * as course from '${path.join(root, 'lib/courseProgress.ts')}';
export * as content from '${path.join(root, 'lib/courseContent.ts')}';
export * as study from '${path.join(root, 'lib/englishStudyState.ts')}';
export * as supplement from '${path.join(root, 'lib/englishSupplement/progress.ts')}';
export * as supplementContent from '${path.join(root, 'lib/englishSupplement/content.ts')}';
export * as assessments from '${path.join(root, 'lib/englishSupplement/assessments.ts')}';
`);
const esbuild = await import('esbuild');
const stubs = path.join(root, 'scripts', 'test-stubs');
const bundle = await esbuild.build({
  entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  plugins: [{ name: 'offline-storage-stubs', setup(build) {
    build.onResolve({ filter: /^react-native$/ }, () => ({ path: path.join(stubs, 'react-native.js') }));
    build.onResolve({ filter: /^@react-native-async-storage\/async-storage$/ }, () => ({ path: path.join(stubs, 'async-storage.js') }));
    build.onResolve({ filter: /^\.\/supabase$/, namespace: 'file' }, () => ({ path: 'backup-supabase', namespace: 'backup-stub' }));
    build.onLoad({ filter: /.*/, namespace: 'backup-stub' }, () => ({ contents: `
      const hit = () => { globalThis.__englishBackupCloudCalls = (globalThis.__englishBackupCloudCalls ?? 0) + 1; };
      export const supabase = {
        auth: { async getSession(){ hit(); return {data:{session:null},error:null}; }, async signInAnonymously(){ hit(); return {data:{user:{id:'test'}},error:null}; } },
        functions: { async invoke(){ hit(); return {data:null,error:null}; } },
        from(){ hit(); return { upsert: async()=>({error:null}) }; },
        async rpc(){ hit(); return {data:null,error:null}; },
      };
      export function isSupabaseConfigured(){ hit(); return false; }
    `, loader: 'js' }));
  } }],
});
const outfile = path.join(cache, 'bundle.mjs');
writeFileSync(outfile, bundle.outputFiles[0].text);
globalThis.__englishBackupCloudCalls = 0;
const app = await import(`${outfile}?run=${Date.now()}`);
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };

function memoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    values,
    async getItem(key) { return values.has(key) ? values.get(key) : null; },
    async setItem(key, value) { values.set(key, String(value)); },
    async removeItem(key) { values.delete(key); },
  };
}

const keys = app.backup.ENGLISH_BACKUP_STORAGE_KEYS;
check(keys.length === 3, 'backup covers exactly the three local English stores');
check(keys.includes('sentence_course_progress_v1') && keys.includes('english_study_state_v1') && keys.includes('english_supplement_evidence_v1'), 'all required legacy keys are included');
check(!keys.some(key => /de_|russian|german/i.test(key)), 'other languages are excluded');

const [lesson1, lesson2] = app.content.SENTENCE_LESSONS;
const today = new Date();
const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
const supplementTask = app.supplementContent.ENGLISH_SUPPLEMENT[0].practice[0];
const assessmentTask = app.assessments.ASSESSMENTS.Foundation[0];
const source = memoryStorage({ untouched_key: 'keep me' });
source.values.set(keys[0], JSON.stringify(app.course.parseCourseProgressBackup({
  completedLessonIds: [lesson1.id], currentLessonId: lesson1.id, reviewSentenceIds: ['legacy-review-id'],
  learnedEssential504Words: ['practice'], dailyGoalMinutes: 12, todayMinutes: 7, activityDate: todayKey,
  currentStreak: 2, longestStreak: 4, lastActiveDate: todayKey, totalMinutes: 55,
  updatedAt: '2026-10-10T10:00:00.000Z',
})));
source.values.set(keys[1], JSON.stringify({
  version: 1,
  sessions: { [lesson1.id]: { stage: 2, sentenceIndex: 6, revealed: true, evidencePassed: false } },
  days: { '2026-10-10': 3000 },
  lessonEvidence: { [lesson1.id]: { 'task-imported': { skill: 'reading', correct: true, attempts: 2, heard: false } } },
}));
source.values.set(keys[2], JSON.stringify({
  version: 1,
  evidence: { [supplementTask.id]: { skill: supplementTask.skill, correct: true, attempts: 3, heard: false } },
  drafts: { note: 'An imported private draft.' },
  assessmentAttempts: [{
    id: 'imported-attempt', level: 'Foundation', startedAt: '2026-10-10T09:00:00.000Z',
    answers: { [assessmentTask.id]: { correct: true, heard: false } },
  }],
  checklists: { 'writing-check': { clarity: true } },
}));

const summary = await app.backup.getEnglishBackupSummary(source);
check(summary.completedLessonCount === 1 && summary.lessonCount === app.content.SENTENCE_LESSONS.length, 'summary reports saved lesson progress');
check(summary.reviewCardCount > 0 && summary.studySessionCount === 1 && summary.supplementDraftCount === 1, 'summary reports the scheduler, study session and supplement draft');
const exportedText = await app.backup.exportEnglishBackup(source, new Date('2026-10-11T12:00:00.000Z'));
const exported = JSON.parse(exportedText);
check(exported.format === 'english-journey-progress' && exported.version === 1 && exported.course === 'en', 'export has the expected envelope');
check(Object.keys(exported.data).sort().join(',') === 'courseProgress,study,supplement', 'export contains exactly all three progress stores');
check(exported.data.courseProgress.completedLessonIds.includes(lesson1.id), 'course progress is exported');
check(exported.data.study.sessions[lesson1.id].sentenceIndex === 6, 'study session is exported');
check(exported.data.supplement.drafts.note === 'An imported private draft.', 'private draft is present and covered by privacy disclosure');
check(!/audio\s*data|base64|recordingUri/i.test(exportedText), 'backup does not package audio recordings');
check(source.values.get('untouched_key') === 'keep me', 'unrelated local keys are not modified');

const target = memoryStorage({ untouched_key: 'target value' });
target.values.set(keys[0], JSON.stringify(app.course.parseCourseProgressBackup({
  completedLessonIds: [lesson2.id], currentLessonId: lesson2.id, reviewSentenceIds: ['local-review-id'],
  learnedEssential504Words: ['local-word'], dailyGoalMinutes: 15, todayMinutes: 10, activityDate: todayKey,
  currentStreak: 5, longestStreak: 5, lastActiveDate: todayKey, totalMinutes: 80,
  updatedAt: '2026-10-10T11:00:00.000Z',
})));
target.values.set(keys[1], JSON.stringify({
  version: 1,
  sessions: { [lesson1.id]: { stage: 3, sentenceIndex: 9, revealed: false, evidencePassed: true } },
  days: { '2026-10-10': 9000 },
  lessonEvidence: { [lesson1.id]: { 'task-local': { skill: 'grammar', correct: true, attempts: 4, heard: false } } },
}));
target.values.set(keys[2], JSON.stringify({
  version: 1,
  evidence: { [supplementTask.id]: { skill: supplementTask.skill, correct: false, attempts: 1, heard: false }, 'local-evidence': { skill: 'writing', correct: true, attempts: 2, heard: false } },
  drafts: { note: 'Keep the current local version.', localOnly: 'Current unsynced work.' },
  assessmentAttempts: [{ id: 'local-attempt', level: 'Foundation', startedAt: '2026-10-10T10:00:00.000Z', answers: {} }],
  checklists: { 'writing-check': { completeness: true } },
}));

const restoredSummary = await app.backup.restoreEnglishBackup(exportedText, target, new Date('2026-10-11T13:00:00.000Z'));
const mergedCourse = JSON.parse(target.values.get(keys[0]));
const mergedStudy = JSON.parse(target.values.get(keys[1]));
const mergedSupplement = JSON.parse(target.values.get(keys[2]));
check(mergedCourse.completedLessonIds.includes(lesson1.id) && mergedCourse.completedLessonIds.includes(lesson2.id), 'restore unions completed lessons without deleting local work');
check(mergedCourse.reviewSentenceIds.includes('legacy-review-id') && mergedCourse.reviewSentenceIds.includes('local-review-id'), 'legacy review IDs are merged');
check(mergedCourse.learnedEssential504Words.includes('practice') && mergedCourse.learnedEssential504Words.includes('local-word'), 'historical word markers are merged');
check(mergedCourse.totalMinutes === 80 && mergedCourse.longestStreak === 5, 'maximum course totals are preserved');
check(mergedStudy.sessions[lesson1.id].stage === 3 && mergedStudy.sessions[lesson1.id].evidencePassed && mergedStudy.sessions[lesson1.id].revealed, 'most advanced study position retains both positive flags');
check(mergedStudy.days['2026-10-10'] === 9000, 'study time is merged without reducing existing totals');
check(mergedStudy.lessonEvidence[lesson1.id]['task-local'].attempts === 4 && mergedStudy.lessonEvidence[lesson1.id]['task-imported'].attempts === 2, 'study evidence is merged by key and attempts');
check(mergedSupplement.drafts.note === 'Keep the current local version.' && mergedSupplement.drafts.localOnly === 'Current unsynced work.', 'current conflicting draft and other local drafts are retained');
check(mergedSupplement.drafts.note !== exported.data.supplement.drafts.note, 'import does not replace an existing conflicting draft');
check(mergedSupplement.evidence[supplementTask.id].attempts === 3 && mergedSupplement.evidence['local-evidence'].attempts === 2, 'supplement evidence with more attempts and local-only evidence survive');
check(mergedSupplement.checklists['writing-check'].completeness && mergedSupplement.checklists['writing-check'].clarity, 'checklist entries are merged');
check(mergedSupplement.assessmentAttempts.some(item => item.id === 'imported-attempt') && mergedSupplement.assessmentAttempts.some(item => item.id === 'local-attempt'), 'assessment attempts from both stores survive');
check(restoredSummary.completedLessonCount === 2 && target.values.get('untouched_key') === 'target value', 'restore returns merged counts and leaves unrelated keys alone');

const syncMerged = await app.backup.mergeEnglishSyncExtras({
  study: exported.data.study,
  supplement: { ...exported.data.supplement, drafts: { remoteDraft: 'Must never leave its source device.' } },
}, target);
check(syncMerged.supplement.drafts.note === 'Keep the current local version.' && syncMerged.supplement.drafts.localOnly === 'Current unsynced work.', 'cloud merge keeps existing free-text drafts on this device');
check(!Object.hasOwn(syncMerged.supplement.drafts, 'remoteDraft'), 'cloud merge ignores free-text drafts from the remote snapshot');
check(JSON.parse(target.values.get(keys[2])).evidence['local-evidence'].attempts === 2, 'cloud merge retains local-only objective evidence');
check(syncMerged.study.days['2026-10-10'] === 9000, 'cloud merge retains the larger same-day study-time total');
const corruptSyncStorage = memoryStorage({ [keys[1]]: '{not-json' });
await assert.rejects(app.backup.mergeEnglishSyncExtras({ study: exported.data.study, supplement: exported.data.supplement }, corruptSyncStorage)); checks += 1;
check(corruptSyncStorage.values.get(keys[1]) === '{not-json', 'cloud merge refuses to overwrite corrupt local study data');

const beforeInvalid = Object.fromEntries(keys.map(key => [key, target.values.get(key)]));
const invalidEnvelope = { ...exported, data: { ...exported.data, study: undefined } };
await assert.rejects(app.backup.restoreEnglishBackup(JSON.stringify(invalidEnvelope), target)); checks += 1;
check(keys.every(key => target.values.get(key) === beforeInvalid[key]), 'invalid input is rejected before any existing store is written');
await assert.rejects(app.backup.restoreEnglishBackup('{broken json', target)); checks += 1;
check(keys.every(key => target.values.get(key) === beforeInvalid[key]), 'malformed JSON leaves all local stores unchanged');

const invalidCourse = JSON.parse(exportedText);
invalidCourse.data.courseProgress.activityDate = '2026-02-30';
await assert.rejects(app.backup.restoreEnglishBackup(JSON.stringify(invalidCourse), target)); checks += 1;
check(keys.every(key => target.values.get(key) === beforeInvalid[key]), 'impossible course activity date is rejected before writes');
const invalidStudy = JSON.parse(exportedText);
invalidStudy.data.study.sessions[lesson1.id].stage = 99;
await assert.rejects(app.backup.restoreEnglishBackup(JSON.stringify(invalidStudy), target)); checks += 1;
check(keys.every(key => target.values.get(key) === beforeInvalid[key]), 'invalid study state is rejected before writes');
const invalidSupplement = JSON.parse(exportedText);
invalidSupplement.data.supplement.evidence[supplementTask.id].attempts = 0;
await assert.rejects(app.backup.restoreEnglishBackup(JSON.stringify(invalidSupplement), target)); checks += 1;
check(keys.every(key => target.values.get(key) === beforeInvalid[key]), 'invalid supplement evidence is rejected before writes');

let failedOnce = false;
const failingStorage = {
  getItem: key => target.getItem(key),
  removeItem: key => target.removeItem(key),
  async setItem(key, value) {
    if (key === keys[1] && !failedOnce) { failedOnce = true; throw new Error('simulated storage quota failure'); }
    return target.setItem(key, value);
  },
};
await assert.rejects(app.backup.restoreEnglishBackup(exportedText, failingStorage)); checks += 1;
check(failedOnce && keys.every(key => target.values.get(key) === beforeInvalid[key]), 'partial write failure rolls all three stores back to their previous values');

const corruptLocal = memoryStorage({ [keys[1]]: '{not-json' });
await assert.rejects(app.backup.getEnglishBackupSummary(corruptLocal)); checks += 1;
check(corruptLocal.values.get(keys[1]) === '{not-json', 'corrupt local data is never silently replaced while reading summary');
const empty = memoryStorage();
const emptySummary = await app.backup.getEnglishBackupSummary(empty);
check(emptySummary.completedLessonCount === 0 && emptySummary.studySessionCount === 0 && emptySummary.supplementDraftCount === 0, 'missing keys export as valid empty local state');
check(empty.values.size === 0, 'reading empty stores does not write defaults');
check(globalThis.__englishBackupCloudCalls === 0, 'backup summary, export and restore make no Supabase/session calls');

console.log(`${checks} checks passed; local-only three-store English backup, non-destructive merge, validation, rollback and zero cloud calls verified.`);
