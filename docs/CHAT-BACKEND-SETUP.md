# فعال‌سازی مکالمه واقعی و Emma

## مخاطب واقعی

1. در Supabase به **Authentication → Providers** بروید.
2. گزینه **Anonymous Sign-Ins** را فعال کنید.
3. وارد **SQL Editor** شوید.
4. تمام فایل `supabase/SETUP-CONVERSATIONS.sql` را اجرا کنید.

پس از آن، کد دعوت ۶ رقمی، فهرست مخاطبان، پیام‌های خصوصی و دریافت زنده پیام‌ها فعال می‌شوند.

## Emma

برای چت واقعی Emma باید Edge Function پروژه منتشر شود و کلید ارائه‌دهنده هوش مصنوعی فقط روی سرور ثبت شود:

```bash
supabase functions deploy emma-chat
supabase functions deploy speech-evaluate
supabase secrets set OPENAI_API_KEY=YOUR_KEY
supabase secrets set OPENAI_MODEL=gpt-4o-mini
supabase secrets set OPENAI_TRANSCRIBE_MODEL=whisper-1
```

کلید هوش مصنوعی را هرگز داخل `.env` اپ یا APK قرار ندهید. فایل تابع در `supabase/functions/emma-chat/index.ts` قرار دارد.

## امنیت

- پیام‌های واقعی با RLS فقط برای اعضای همان گفتگو قابل خواندن هستند.
- کد دعوت ۲۴ ساعت اعتبار دارد و پس از استفاده باطل می‌شود.
- تابع Emma هویت Supabase کاربر را پیش از تماس با ارائه‌دهنده AI بررسی می‌کند.
