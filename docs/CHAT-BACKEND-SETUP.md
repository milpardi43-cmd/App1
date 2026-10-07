# فعال‌سازی مکالمه واقعی و Emma

## مخاطب واقعی

همه جدول‌ها، Policyها و توابع کد دعوت در
`supabase/migrations/202610070001_real_contact_conversations.sql` قرار دارند، پس با
`supabase db push` (یا همان `./scripts/setup-production.sh`) خودکار ساخته می‌شوند.

اگر ترجیح می‌دهید دستی از SQL Editor استفاده کنید، همان محتوا در
`supabase/SETUP-CONVERSATIONS.sql` هم موجود است.

1. در Supabase به **Authentication → Providers** بروید.
2. گزینه **Anonymous Sign-Ins** را فعال کنید. (بدون این گزینه کد دعوت هرگز ساخته نمی‌شود.)
3. وارد **SQL Editor** شوید.
4. تمام فایل `supabase/SETUP-CONVERSATIONS.sql` را اجرا کنید (در صورت استفاده از `db push` لازم نیست).

پس از آن، کد دعوت ۶ رقمی، فهرست مخاطبان، پیام‌های خصوصی و دریافت زنده پیام‌ها فعال می‌شوند.

در اپ، کد دعوت از تابع `create_contact_invite` و اتصال مخاطب از `claim_contact_invite`
می‌آید؛ اگر این توابع روی پروژه اجرا نشده باشند، صفحه «افزودن مخاطب واقعی» پیام
راهنمای فارسی نشان می‌دهد و کدی ساخته نمی‌شود.

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
