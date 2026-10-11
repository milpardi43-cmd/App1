import { readableAIError, readableFunctionError } from './errors';
import { requirePaidAI } from './paidAI';
import { Platform } from 'react-native';
import { ensureChatIdentity } from './conversations';
import { requireSupabaseConfigured } from './errors';
import { supabase } from './supabase';

export interface SpeechEvaluation {
  recognized: string;
  /** Transcript word similarity only; never acoustic pronunciation or fluency. */
  score: number;
  missingWords: string[];
  feedbackFa: string;
}

async function appendAudio(form: FormData, audioUri: string): Promise<void> {
  if (Platform.OS === 'web') {
    const audioBlob = await fetch(audioUri).then((response) => response.blob());
    form.append('audio', audioBlob, 'speech.webm');
  } else {
    form.append('audio', {
      uri: audioUri,
      name: 'speech.m4a',
      type: 'audio/m4a',
    } as unknown as Blob);
  }
}

export async function evaluateSpokenSentence(audioUri: string, expected: string, consent = false): Promise<SpeechEvaluation> {
  requirePaidAI();
  if(!consent)throw new Error('ارسال صوت به Supabase و سرویس تبدیل گفتار به رضایت صریح نیاز دارد؛ سیاست نگهداری سرویس باید پیش از فعال‌سازی مشخص شود.');
  requireSupabaseConfigured();
  await ensureChatIdentity();
  const form = new FormData();
  form.append('expected', expected);
  form.append('consent','true');
  form.append('mode', 'evaluate');
  await appendAudio(form, audioUri);

  const { data, error } = await supabase.functions.invoke('speech-evaluate', { body: form });
  if (error) throw new Error(await readableFunctionError(error));
  if (data?.error) throw new Error(readableAIError(data));
  if (typeof data?.score !== 'number'||!Number.isFinite(data.score)) throw new Error('نتیجه معتبری برای صدا دریافت نشد.');

  return {
    recognized: String(data.recognized || ''),
    score: Math.max(0, Math.min(100, Number(data.score))),
    missingWords: Array.isArray(data.missingWords) ? data.missingWords.map(String) : [],
    feedbackFa: 'این عدد فقط شباهت متن تشخیص‌داده‌شده با نمونه است؛ نمره تلفظ، روانی یا مکالمه نیست و تشخیص دستگاه ممکن است اشتباه کند.',
  };
}

export async function transcribeLearnerSpeech(audioUri: string, consent = false): Promise<string> {
  requirePaidAI();
  if(!consent)throw new Error('ارسال صوت به Supabase و سرویس تبدیل گفتار به رضایت صریح نیاز دارد؛ سیاست نگهداری سرویس باید پیش از فعال‌سازی مشخص شود.');
  requireSupabaseConfigured();
  await ensureChatIdentity();
  const form = new FormData();
  form.append('consent','true');
  form.append('mode', 'transcribe');
  await appendAudio(form, audioUri);
  const { data, error } = await supabase.functions.invoke('speech-evaluate', { body: form });
  if (error) throw new Error(await readableFunctionError(error));
  if (data?.error) throw new Error(readableAIError(data));
  const recognized = String(data?.recognized || '').trim();
  if (!recognized) throw new Error('جمله‌ای از صدا تشخیص داده نشد. دوباره و کمی آهسته‌تر بگویید.');
  return recognized;
}
