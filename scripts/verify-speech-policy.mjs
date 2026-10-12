#!/usr/bin/env node
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cache = path.join(root, 'node_modules', '.cache', 'speech-policy-test');
const entry = path.join(cache, 'entry.ts');
const output = path.join(cache, 'bundle.mjs');
mkdirSync(cache, { recursive: true });
writeFileSync(entry, `
export * as speech from '${path.join(root, 'lib/speechPractice.ts')}';
export * as paidAI from '${path.join(root, 'lib/paidAI.ts')}';
export * as onlineAudio from '${path.join(root, 'lib/onlineAudioPolicy.ts')}';
export * as conversations from '${path.join(root, 'lib/conversations.ts')}';
`);
const esbuild = await import('esbuild');
const bundle = await esbuild.build({
  entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node', target: 'node22', logLevel: 'silent',
  plugins: [{ name: 'network-observation-stubs', setup(build) {
    build.onResolve({ filter: /^react-native$/ }, () => ({ path: 'react-native', namespace: 'guard-stub' }));
    build.onResolve({ filter: /^\.\/(conversations|errors|supabase)$/, namespace: 'file' }, args => ({ path: args.path.slice(2), namespace: 'guard-stub' }));
    build.onLoad({ filter: /.*/, namespace: 'guard-stub' }, args => {
      if (args.path === 'react-native') return { contents: "export const Platform={OS:'web'};", loader: 'js' };
      if (args.path === 'conversations') return { contents: `
        export async function ensureChatIdentity(){ globalThis.__identityCalls++; return { id: 'test-user' }; }
        export function readableSupabaseError(value){ return String(value); }
      `, loader: 'js' };
      if (args.path === 'errors') return { contents: `
        export const SUPABASE_NOT_CONFIGURED_MESSAGE = 'not configured';
        export function readableAIError(){ return 'AI error'; }
        export async function readableFunctionError(){ return 'function error'; }
        export function readableSupabaseError(){ return 'Supabase error'; }
        export function requireSupabaseConfigured(){ globalThis.__configurationChecks++; }
      `, loader: 'js' };
      return { contents: `
        export const supabase = {
          auth: { async getSession(){ globalThis.__supabaseCalls++; return {data:{session:{user:{id:'test-user'}}}}; }, async signInAnonymously(){ globalThis.__supabaseCalls++; return {data:{user:{id:'test-user'}}}; } },
          functions: { async invoke(){ globalThis.__supabaseCalls++; return {data:{recognized:'hello',score:100},error:null}; } },
          from(){ globalThis.__supabaseCalls++; return { upsert: async()=>({error:null}) }; },
          storage: { from(){ globalThis.__supabaseCalls++; return {upload:async()=>({error:null}),remove:async()=>({error:null}),createSignedUrl:async()=>({data:{signedUrl:'x'},error:null})}; } },
          async rpc(){ globalThis.__supabaseCalls++; return {data:null,error:null}; },
        };
      `, loader: 'js' };
    });
  } }],
});
writeFileSync(output, bundle.outputFiles[0].text);

const source = await import(`${output}?run=${Date.now()}`);
globalThis.__identityCalls = 0;
globalThis.__configurationChecks = 0;
globalThis.__supabaseCalls = 0;
let fetchCalls = 0;
const originalFetch = globalThis.fetch;
globalThis.fetch = async (...args) => { fetchCalls += 1; return originalFetch(...args); };
let checks = 0;
const check = (condition, message) => { assert.ok(condition, message); checks += 1; };
const disabled = /غیرفعال/;

check(source.paidAI.PAID_AI_ENABLED === false, 'paid AI and cloud speech remain explicitly disabled');
check(source.onlineAudio.ONLINE_AUDIO_ENABLED === false, 'outbound learner audio is explicitly disabled');
await assert.rejects(source.speech.evaluateSpokenSentence('file:///private-audio.m4a', 'hello', true), disabled); checks += 1;
await assert.rejects(source.speech.evaluateSpokenSentence('file:///private-audio.m4a', 'hello', false), disabled); checks += 1;
await assert.rejects(source.speech.transcribeLearnerSpeech('file:///private-audio.m4a', true), disabled); checks += 1;
await assert.rejects(source.speech.transcribeLearnerSpeech('file:///private-audio.m4a', false), disabled); checks += 1;
await assert.rejects(source.conversations.sendVoiceMessage('conversation', 'file:///private-audio.m4a', 4), disabled); checks += 1;
check(fetchCalls === 0 && globalThis.__identityCalls === 0 && globalThis.__configurationChecks === 0 && globalThis.__supabaseCalls === 0,
  'blocked online audio exits before fetch, identity/session creation, Supabase configuration, or any server function');

const read = file => readFileSync(path.join(root, file), 'utf8');
const lesson = read('app/course/lesson.tsx');
const emma = read('app/conversations/emma.tsx');
const human = read('app/conversations/human/[conversationId].tsx');
check(/if\s*\(!PAID_AI_ENABLED\)[\s\S]*?return;[\s\S]*?requestRecordingPermissionsAsync\(\)/.test(lesson), 'English lesson blocks before requesting the microphone permission');
check(/disabled=\{!PAID_AI_ENABLED\s*\|\|\s*evaluatingSpeech\}/.test(lesson), 'English lesson record control is disabled by the policy flag');
check(/if\s*\(!PAID_AI_ENABLED\)[\s\S]*?return;[\s\S]*?requestRecordingPermissionsAsync\(\)/.test(emma), 'Emma voice path blocks before requesting the microphone permission');
check(/disabled=\{!PAID_AI_ENABLED\s*\|\|\s*thinking\s*\|\|\s*transcribing\}/.test(emma), 'Emma voice control is disabled by the policy flag');
check(/if\s*\(!ONLINE_AUDIO_ENABLED\)[\s\S]*?return;[\s\S]*?requestRecordingPermissionsAsync\(\)/.test(human), 'human voice-message path blocks before requesting the microphone permission');
check(/disabled=\{sending\s*\|\|\s*!ONLINE_AUDIO_ENABLED\}/.test(human), 'human voice-message control is disabled by the separate online-audio policy');
check(/requireOnlineAudioEnabled\(\);\s*const user = await ensureChatIdentity\(\);/.test(read('lib/conversations.ts')), 'lower-level voice upload API enforces the gate before identity or upload work');
check(/Speech\.speak\(text,\s*\{\s*language:\s*'en-US'/.test(lesson), 'device/platform speech playback remains available');
check(/!ONLINE_AUDIO_ENABLED[\s\S]*?ONLINE_AUDIO_DISABLED_MESSAGE/.test(human)
  && /ضبط و ارسال آنلاین صدا فعلاً غیرفعال است/.test(source.onlineAudio.ONLINE_AUDIO_DISABLED_MESSAGE), 'conversation explains that recording and sending are disabled');

globalThis.fetch = originalFetch;
console.log(`${checks} checks passed; cloud speech, transcription, human voice-message upload, and microphone access are gated, while local speech playback remains.`);
