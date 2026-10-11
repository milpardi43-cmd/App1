/** Explicit no-cost policy. Re-enabling requires a deliberate code change and a privacy/retention review. */
export const PAID_AI_ENABLED=false;
export const PAID_AI_DISABLED_MESSAGE='سرویس هوش مصنوعی و ارسال صدا فعلاً برای حالت بدون هزینه غیرفعال‌اند. از مسیر اصلی، مرور و کارگاه رایگان استفاده کنید.';
export function requirePaidAI(){if(!PAID_AI_ENABLED)throw new Error(PAID_AI_DISABLED_MESSAGE);}
