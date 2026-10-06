import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

function words(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function editDistance(a: string[], b: string[]): number {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous.splice(0, previous.length, ...current);
  }
  return previous[b.length];
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return json({ error: 'Authentication required' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return json({ error: 'Invalid session' }, 401);
    const { data: allowed, error: usageError } = await supabase.rpc('consume_daily_ai_usage', {
      p_category: 'speech',
      p_limit: 60,
    });
    if (usageError) console.error('Usage-limit check failed', usageError);
    if (allowed === false) return json({ error: 'Daily speech practice limit reached' }, 429);

    const form = await request.formData();
    const audio = form.get('audio');
    const expected = String(form.get('expected') ?? '').trim();
    const mode = form.get('mode') === 'transcribe' ? 'transcribe' : 'evaluate';
    if (!(audio instanceof File) || (mode === 'evaluate' && !expected)) return json({ error: 'Required speech data is missing' }, 400);
    if (expected.length > 300) return json({ error: 'Sentence is too long' }, 400);
    if (audio.size > 8 * 1024 * 1024) return json({ error: 'Audio file is too large' }, 413);

    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) return json({ error: 'Speech service is not configured' }, 503);

    const openAIForm = new FormData();
    openAIForm.append('file', audio, audio.name || 'speech.m4a');
    openAIForm.append('model', Deno.env.get('OPENAI_TRANSCRIBE_MODEL') || 'whisper-1');
    openAIForm.append('language', 'en');
    openAIForm.append('response_format', 'json');
    if (expected) openAIForm.append('prompt', expected);

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openAIKey}` },
      body: openAIForm,
    });
    if (!response.ok) {
      console.error('OpenAI transcription failed', response.status, await response.text());
      return json({ error: 'Speech could not be evaluated' }, 502);
    }

    const transcription = await response.json();
    const recognized = String(transcription.text ?? '').trim();
    if (mode === 'transcribe') return json({ recognized });

    const expectedWords = words(expected);
    const recognizedWords = words(recognized);
    const distance = editDistance(expectedWords, recognizedWords);
    const score = Math.max(0, Math.round((1 - distance / Math.max(1, expectedWords.length, recognizedWords.length)) * 100));
    const recognizedSet = new Set(recognizedWords);
    const missingWords = Array.from(new Set(expectedWords.filter((word) => !recognizedSet.has(word))));
    const feedbackFa = score >= 90
      ? 'عالی بود؛ جمله شما کاملاً واضح و قابل‌فهم بود.'
      : score >= 75
        ? 'خیلی خوب بود؛ فقط بخش‌های مشخص‌شده را یک بار دیگر تمرین کنید.'
        : score >= 55
          ? 'جمله قابل‌فهم بود، اما بهتر است کلمات مشخص‌شده را دوباره بگویید.'
          : 'این بار جمله را آهسته‌تر بشنوید و دوباره با صدای بلند تکرار کنید.';

    return json({ recognized, score, missingWords, feedbackFa });
  } catch (error) {
    console.error('speech-evaluate error', error);
    return json({ error: 'Unexpected speech evaluation error' }, 500);
  }
});
