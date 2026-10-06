import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-anon-key';

const rawUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').trim();
const rawKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '').trim();

let supabaseUrl = rawUrl;
let supabaseAnonKey = rawKey;

// `createClient` throws synchronously if the URL is missing/empty or malformed.
// That throw happens at module-import time (before the app even renders), so it
// must never be allowed to escape — otherwise it crashes the whole app on launch
// with no readable error. Validate up front and fall back to safe placeholders.
try {
  if (!supabaseUrl) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL is empty');
  }
  // Throws TypeError if not a valid absolute URL.
  // eslint-disable-next-line no-new
  new URL(supabaseUrl);
} catch (error) {
  console.error(
    '[supabase] Invalid or missing EXPO_PUBLIC_SUPABASE_URL, falling back to placeholder. ' +
      'Supabase features will not work until this is fixed.',
    error
  );
  supabaseUrl = FALLBACK_URL;
}

if (!supabaseAnonKey) {
  console.error(
    '[supabase] Missing EXPO_PUBLIC_SUPABASE_ANON_KEY, falling back to placeholder. ' +
      'Supabase features will not work until this is fixed.'
  );
  supabaseAnonKey = FALLBACK_KEY;
}

const serverMemoryStorage = new Map<string, string>();
const webSafeStorage = {
  async getItem(key: string) {
    if (typeof window !== 'undefined') return window.localStorage.getItem(key);
    return serverMemoryStorage.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    else serverMemoryStorage.set(key, value);
  },
  async removeItem(key: string) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    else serverMemoryStorage.delete(key);
  },
};

const authOptions = {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false,
  storage: Platform.OS === 'web' ? webSafeStorage : AsyncStorage,
};

function createSafeClient() {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: authOptions,
    });
  } catch (error) {
    console.error(
      '[supabase] createClient threw unexpectedly, falling back to placeholder client.',
      error
    );
    return createClient(FALLBACK_URL, FALLBACK_KEY, {
      auth: authOptions,
    });
  }
}

export const supabase = createSafeClient();
