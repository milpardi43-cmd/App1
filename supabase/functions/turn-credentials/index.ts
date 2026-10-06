import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return json({ error: 'Authentication required' }, 401);
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return json({ error: 'Invalid session' }, 401);

    const meteredDomain = (Deno.env.get('METERED_DOMAIN') || '').trim()
      .replace(/^https?:\/\//i, '').replace(/\/$/, '');
    const meteredSecret = (Deno.env.get('METERED_SECRET_KEY') || '').trim();
    let iceServers: unknown[] = [];
    if (meteredDomain && meteredSecret) {
      const response = await fetch(`https://${meteredDomain}/api/v1/turn/credentials?apiKey=${encodeURIComponent(meteredSecret)}`);
      if (!response.ok) {
        console.error('TURN provider failed', response.status, await response.text());
        return json({ error: 'TURN provider request failed' }, 502);
      }
      const result = await response.json();
      iceServers = Array.isArray(result) ? result : [];
    } else {
      const urls = (Deno.env.get('TURN_URLS') || '').split(',').map((item) => item.trim()).filter(Boolean);
      const username = (Deno.env.get('TURN_USERNAME') || '').trim();
      const credential = (Deno.env.get('TURN_CREDENTIAL') || '').trim();
      if (urls.length && username && credential) iceServers = [{ urls, username, credential }];
    }

    const safeServers = iceServers.filter((item: any) => {
      const urls = Array.isArray(item?.urls) ? item.urls : [item?.urls];
      return urls.some((url: unknown) => typeof url === 'string' && /^turns?:/i.test(url));
    }).map((item: any) => ({
      urls: item.urls,
      username: String(item.username || ''),
      credential: String(item.credential || ''),
    }));
    if (!safeServers.length) return json({ error: 'TURN is not configured' }, 503);
    return json({ iceServers: safeServers });
  } catch (error) {
    console.error(error);
    return json({ error: 'TURN credential service failed' }, 500);
  }
});

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
