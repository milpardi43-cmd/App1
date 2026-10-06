import { supabase } from './supabase';

export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

const STUN_SERVERS: IceServerConfig[] = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
];
const staticTurnUrls = (process.env.EXPO_PUBLIC_TURN_URLS || process.env.EXPO_PUBLIC_TURN_URL || '')
  .split(',').map((value) => value.trim()).filter(Boolean);
const staticTurnUsername = (process.env.EXPO_PUBLIC_TURN_USERNAME || '').trim();
const staticTurnCredential = (process.env.EXPO_PUBLIC_TURN_CREDENTIAL || '').trim();
let cached: { servers: IceServerConfig[]; expiresAt: number } | null = null;

function hasRelay(servers: IceServerConfig[]): boolean {
  return servers.some((server) => {
    const urls = Array.isArray(server.urls) ? server.urls : [server.urls];
    return urls.some((url) => /^turns?:/i.test(url));
  });
}

function staticServers(): IceServerConfig[] {
  return [
    ...STUN_SERVERS,
    ...(staticTurnUrls.length && staticTurnUsername && staticTurnCredential
      ? [{ urls: staticTurnUrls, username: staticTurnUsername, credential: staticTurnCredential }]
      : []),
  ];
}

/** Fetches TURN credentials from an authenticated Edge Function, keeping the
 * provider secret out of the APK. Static EXPO_PUBLIC values remain a fallback
 * for self-hosted TURN deployments. */
export async function getRtcIceServers(requireTurn = true): Promise<IceServerConfig[]> {
  if (cached && cached.expiresAt > Date.now()) return cached.servers;
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) await supabase.auth.signInAnonymously();
    const { data, error } = await supabase.functions.invoke('turn-credentials');
    if (error) throw error;
    const remote = Array.isArray(data?.iceServers) ? data.iceServers : [];
    const servers: IceServerConfig[] = remote
      .filter((item: unknown) => item && typeof item === 'object')
      .map((item: any) => ({ urls: item.urls, username: item.username, credential: item.credential }))
      .filter((item: IceServerConfig) => typeof item.urls === 'string' || Array.isArray(item.urls));
    if (!hasRelay(servers)) throw new Error('TURN response contained no relay server');
    cached = { servers: [...STUN_SERVERS, ...servers], expiresAt: Date.now() + 50 * 60 * 1000 };
    return cached.servers;
  } catch {
    const fallback = staticServers();
    if (requireTurn && !hasRelay(fallback)) {
      throw new Error('سرور امن TURN هنوز تنظیم نشده است؛ تماس یا نمایش اینترنتی شروع نشد.');
    }
    return fallback;
  }
}
