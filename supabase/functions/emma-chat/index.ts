import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InputMessage {
  role: 'user' | 'assistant';
  content: string;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Authentication required' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.replace(/^Bearer\s+/i, '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return json({ error: 'Invalid session' }, 401);
    const { data: allowed, error: usageError } = await supabase.rpc('consume_daily_ai_usage', {
      p_category: 'emma',
      p_limit: 100,
    });
    if (usageError) console.error('Usage-limit check failed', usageError);
    if (allowed === false) return json({ error: 'Daily Emma practice limit reached' }, 429);

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) return json({ error: 'OPENAI_API_KEY is not configured' }, 503);

    const body = await request.json();
    const level = typeof body.level === 'string' ? body.level.slice(0, 80) : 'Foundation';
    const situation = typeof body.situation === 'string' ? body.situation.slice(0, 500) : 'introducing yourself';
    const targetWords = (Array.isArray(body.targetWords) ? body.targetWords : []).filter((item: unknown) => typeof item === 'string').slice(0, 8).map(String);
    const suggestionCount = Math.max(1, Math.min(3, Number(body.suggestionCount) || 3));
    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((item: InputMessage) => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string' && item.content.trim().length > 0)
      .slice(-12)
      .map((item: InputMessage) => ({ ...item, content: item.content.slice(0, 1000) }));
    if (!messages.length) return json({ error: 'At least one message is required' }, 400);

    const systemPrompt = `You are Emma, a warm English conversation coach for a Persian-speaking learner.
Learner level: ${level}. Current lesson situation: ${situation}.
Words already introduced in the current lesson: ${targetWords.join(', ') || 'none provided'}.
Keep the conversation natural, encouraging, and sentence-first. Stay close to the current lesson unless the learner clearly changes the topic.
Naturally reuse at most one introduced word when it fits; never force vocabulary into an unnatural sentence.
For Foundation/A1 use one or two short English sentences and common words.
Never overwhelm the learner. Correct only the most important error, privately and kindly.
Return strict JSON with these keys:
reply: your English reply;
translation: concise Persian translation of your reply;
correction: null or an object with original, improved, and explanationFa;
suggestions: exactly ${suggestionCount} short English response suggestion${suggestionCount === 1 ? '' : 's'}.
Do not include markdown.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: Deno.env.get('OPENAI_MODEL') || 'gpt-4o-mini',
        temperature: 0.55,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('OpenAI error', response.status, detail);
      return json({ error: 'AI provider request failed' }, 502);
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;
    if (!content) return json({ error: 'AI returned an empty response' }, 502);
    const result = JSON.parse(content);

    return json({
      reply: String(result.reply || ''),
      translation: String(result.translation || ''),
      correction: result.correction || null,
      suggestions: Array.isArray(result.suggestions) ? result.suggestions.slice(0, suggestionCount).map(String) : [],
    });
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : 'Unexpected server error' }, 500);
  }
});

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
