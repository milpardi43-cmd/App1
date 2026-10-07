import { isSupabaseConfigured } from './pairing';

/**
 * Shared Persian wording for the "no Supabase project configured yet" state.
 *
 * Every cloud feature (invite codes, private chat, Emma, speech evaluation,
 * live calls) needs the project URL + anon key from `.env`; without them the app
 * used to fire requests that could only fail and surfaced raw English fetch
 * errors. The screens show this text, and `SupabaseSetupNotice` renders the
 * full three-step checklist.
 */
export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'برای این بخش باید اتصال Supabase تنظیم شود. مقادیر EXPO_PUBLIC_SUPABASE_URL و ' +
  'EXPO_PUBLIC_SUPABASE_ANON_KEY را در فایل .env بگذارید و سرور را یک‌بار با ' +
  'npx expo start -c دوباره اجرا کنید.';

/**
 * Fail fast (with an actionable message) instead of sending a request that
 * cannot succeed. Call this at the top of any function that talks to Supabase.
 */
export function requireSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
}

/** Turns raw Supabase / network failures into an explanation a learner can act on. */
export function readableSupabaseError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || '');
  if (/anonymous sign-ins|Anonymous sign-ins/i.test(message)) {
    return 'ورود ناشناس در تنظیمات Authentication پروژه Supabase فعال نشده است.';
  }
  if (/invalid or expired/i.test(message)) return 'کد دعوت اشتباه است یا اعتبار آن تمام شده است.';
  if (/own invite/i.test(message)) return 'نمی‌توانید کد دعوت خودتان را وارد کنید.';
  if (/could not find the function|function .* does not exist|schema cache/i.test(message)) {
    // The invite RPCs live in supabase/SETUP-CONVERSATIONS.sql (shipped as a
    // migration in supabase/migrations/). Until they are applied, no code can
    // ever be generated — surface that instead of the raw Postgres text.
    return 'توابع ساخت کد دعوت روی Supabase اجرا نشده‌اند. فایل supabase/SETUP-CONVERSATIONS.sql را در SQL Editor اجرا کنید یا ./scripts/setup-production.sh را بزنید.';
  }
  if (/relation .* does not exist/i.test(message)) {
    return 'جدول‌های مکالمه هنوز روی Supabase ساخته نشده‌اند.';
  }
  if (/fetch failed|failed to fetch|network ?error|load failed|timeout|timed out|ENOTFOUND|ERR_/i.test(message)) {
    return 'ارتباط با سرور Supabase برقرار نشد. اتصال اینترنت دستگاه و درست بودن مقادیر .env را بررسی کنید.';
  }
  return message || 'ارتباط با سرور برقرار نشد.';
}
