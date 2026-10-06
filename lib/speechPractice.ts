import { Platform } from 'react-native';
import { ensureChatIdentity } from './conversations';
import { supabase } from './supabase';

export interface SpeechEvaluation {
  recognized: string;
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

export async function evaluateSpokenSentence(audioUri: string, expected: string): Promise<SpeechEvaluation> {
  await ensureChatIdentity();
  const form = new FormData();
  form.append('expected', expected);
  form.append('mode', 'evaluate');
  await appendAudio(form, audioUri);

  const { data, error } = await supabase.functions.invoke('speech-evaluate', { body: form });
  if (error) throw new Error('بررسی صدا انجام نشد. اتصال اینترنت را بررسی کنید.');
  if (data?.error) throw new Error(String(data.error));
  if (typeof data?.score !== 'number') throw new Error('نتیجه معتبری برای صدا دریافت نشد.');

  return {
    recognized: String(data.recognized || ''),
    score: Math.max(0, Math.min(100, Number(data.score))),
    missingWords: Array.isArray(data.missingWords) ? data.missingWords.map(String) : [],
    feedbackFa: String(data.feedbackFa || ''),
  };
}

export async function transcribeLearnerSpeech(audioUri: string): Promise<string> {
  await ensureChatIdentity();
  const form = new FormData();
  form.append('mode', 'transcribe');
  await appendAudio(form, audioUri);
  const { data, error } = await supabase.functions.invoke('speech-evaluate', { body: form });
  if (error) throw new Error('صدای شما به متن تبدیل نشد. اتصال اینترنت را بررسی کنید.');
  if (data?.error) throw new Error(String(data.error));
  const recognized = String(data?.recognized || '').trim();
  if (!recognized) throw new Error('جمله‌ای از صدا تشخیص داده نشد. دوباره و کمی آهسته‌تر بگویید.');
  return recognized;
}
