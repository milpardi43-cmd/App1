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
  const message = errorMessage(error);
  if (/anonymous sign-ins|Anonymous sign-ins/i.test(message)) {
    return 'ورود ناشناس در تنظیمات Authentication پروژه Supabase فعال نشده است.';
  }
  if (/invalid or expired/i.test(message)) return 'کد دعوت اشتباه است یا اعتبار آن تمام شده است.';
  if (/own invite/i.test(message)) return 'نمی‌توانید کد دعوت خودتان را وارد کنید.';
  if (/could not find the function|function .* does not exist/i.test(message)) {
    // The invite RPCs are installed by the checked-in migration/setup SQL.
    // Keep a migration/setup failure distinct from missing profile relations.
    return 'توابع ساخت کد دعوت روی Supabase اجرا نشده‌اند. برای پروژهٔ تازه supabase/SETUP-COPY-PASTE-ONCE.sql را در SQL Editor اجرا کنید یا ./scripts/setup-production.sh را به کار ببرید.';
  }
  if (/could not find.*relationship|relationship.*schema cache/i.test(message)) {
    return 'ارتباط جدول‌های مخاطبان با درخواست برنامه سازگار نیست. این مشکل باید در برنامه یا ساختار پایگاه‌داده بررسی شود.';
  }
  if (/schema cache/i.test(message)) return 'ساختار موردنیاز برنامه در پایگاه‌داده پیدا نشد. اگر پروژهٔ تازه است، supabase/SETUP-COPY-PASTE-ONCE.sql را اجرا کنید؛ برای پروژهٔ قبلی، فقط ساختار موجود را بررسی کنید.';
  if (/relation .* does not exist/i.test(message)) {
    return 'جدول‌های مکالمه هنوز روی Supabase ساخته نشده‌اند.';
  }
  if (/fetch failed|failed to fetch|network ?error|load failed|timeout|timed out|ENOTFOUND|ERR_/i.test(message)) {
    return 'ارتباط با سرور Supabase برقرار نشد. اتصال اینترنت دستگاه و درست بودن مقادیر .env را بررسی کنید.';
  }
  return message || 'ارتباط با سرور برقرار نشد.';
}

/** Supabase/PostgREST often throws plain objects, not Error instances. */
function errorMessage(error: unknown): string {
  if (typeof error === 'string') return error === '[object Object]' ? '' : error;
  if (!error || typeof error !== 'object') return '';
  const value = error as { message?: unknown; error?: unknown };
  if (typeof value.message === 'string') return errorMessage(value.message);
  if (typeof value.error === 'string') return errorMessage(value.error);
  return '';
}

export function readableAIError(payload: unknown, status?: number): string {
  const value = payload && typeof payload === 'object' ? payload as { code?: unknown } : {};
  const message = errorMessage(payload);
  const code = typeof value.code === 'string' ? value.code : '';
  if(code==='PAID_AI_DISABLED')return 'سرویس هوش مصنوعی در حالت بدون هزینه غیرفعال است.';
  if(code==='CONSENT_REQUIRED')return 'ارسال صدا بدون رضایت صریح مجاز نیست.';
  if (/AI_QUOTA_EXHAUSTED|insufficient_quota|credit_balance_exhausted/.test(code + message)) {
    return 'اعتبار سرویس هوش مصنوعی کافی نیست. فعلاً می‌توانید درس‌ها، پخش تلفظ و مرور را بدون این سرویس ادامه دهید.';
  }
  if (/AI_NOT_CONFIGURED|AI_KEY_INVALID|OPENAI_API_KEY/.test(code + message)) {
    return 'کلید سرویس هوش مصنوعی روی سرور تنظیم نشده یا معتبر نیست. مدیر برنامه باید تنظیمات را بررسی کند.';
  }
  if (/DAILY_LIMIT|Daily (Emma|speech) practice limit/.test(code + message)) return 'سهمیه امروز سرویس تمام شده است. فردا دوباره امتحان کنید.';
  if (status === 429 || code === 'AI_RATE_LIMITED') return 'سرویس هوش مصنوعی فعلاً درخواست‌های زیادی دارد. کمی بعد دوباره امتحان کنید.';
  if (status === 401 || status === 403) return 'نشست ورود تأیید نشد. صفحه را تازه‌سازی کنید و دوباره امتحان کنید.';
  if (status === 404) return 'سرویس هوش مصنوعی روی سرور پیدا نشد. مدیر برنامه باید راه‌اندازی آن را بررسی کند.';
  return 'پاسخی از سرویس هوش مصنوعی دریافت نشد. ممکن است تنظیمات، اعتبار سرویس یا ارتباط شبکه مشکل داشته باشد؛ درس‌ها و مرور همچنان قابل استفاده‌اند.';
}

/** Read the HTTP error body instead of treating every Functions error as offline. */
export async function readableFunctionError(error: unknown): Promise<string> {
  const context = error && typeof error === 'object'
    ? (error as { context?: unknown }).context : undefined;
  if (typeof Response !== 'undefined' && context instanceof Response) {
    try {
      return readableAIError(await context.clone().json(), context.status);
    } catch {
      return readableAIError(null, context.status);
    }
  }
  return readableAIError(error);
}
