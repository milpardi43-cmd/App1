# Companion English (App2)

این مخزن یک برنامه مستقل برای گوشی دوم است. برنامه کنترل‌کننده قدیمی و انتخاب نقش در این پروژه وجود ندارد.

## امکانات اصلی

- ۱۲۹ درس جمله‌محور و پوشش دقیق ۵۰۴ واژه
- مرور فاصله‌دار، تمرین تلفظ و Emma متنی/صوتی
- مخاطبان واقعی، پیام متنی و پیام صوتی خصوصی
- ترجمه، اصلاح و پیشنهاد پاسخ خصوصی قبل از ارسال
- تماس صوتی زنده WebRTC با TURN
- اشتراک صفحه رضایت‌محور با اعلان رسمی Android
- کنترل لمسی اختیاری از طریق Accessibility Service
- پیشرفت ابری، زنجیره روزانه و محدودیت مصرف AI

## اجرای محلی

```bash
npm install
npm run typecheck
npm run validate:content   # ۱۲۹ درس و ۵۰۴ واژه
npm run validate:logic     # تست منطق درس‌ها، مرور فاصله‌دار و ذخیره پیشرفت
npm run dev -- --web
```

`validate:logic` ماژول‌های واقعی اپ را در Node اجرا می‌کند (با stub کردن حافظه و Supabase)
و هم مسیر بومی (AsyncStorage) و هم مسیر وب (localStorage) را بررسی می‌کند؛ اگر از .env
قالب استفاده شده باشد یا کلیدها خالی باشند، همان‌جا هشدار می‌دهد.

## راه‌اندازی Backend با یک دستور

> اگر به ترمینال دسترسی ندارید، کل همین کار را می‌توانید فقط با مرورگر انجام دهید:
> راهنمای کامل در `docs/RAH-ANDAZI-BEDOON-TERMINAL.md` و فایل آماده برای
> کپی/پیست در SQL Editor در `supabase/SETUP-COPY-PASTE-ONCE.sql` است.
> هر دو مسیر (اسکریپت و داشبورد) بک‌اند یکسانی می‌سازند.

نیازی به نصب سراسری Supabase CLI نیست. ابتدا (فقط بار اول) وارد حساب شوید و پروژه را Link کنید:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

`YOUR_PROJECT_REF` همان بخش اول آدرس پروژه است: `https://YOUR_PROJECT_REF.supabase.co`.
سپس راه‌اندازی کامل با یک دستور انجام می‌شود:

```bash
./scripts/setup-production.sh
```

اسکریپت از `npx supabase` استفاده می‌کند، migration را اجرا و چهار Edge Function موردنیاز را منتشر می‌کند.

## TURN امن

اطلاعات اصلی سرویس TURN داخل APK قرار نمی‌گیرد. پس از تهیه سرویس، Secretها فقط روی Supabase ثبت می‌شوند:

```bash
supabase secrets set METERED_DOMAIN=YOUR_DOMAIN METERED_SECRET_KEY=YOUR_SECRET
supabase functions deploy turn-credentials
```

برای coturn شخصی می‌توان به‌جای آن `TURN_URLS`، `TURN_USERNAME` و `TURN_CREDENTIAL` را به‌عنوان Supabase Secret ثبت کرد.

## ساخت APK مستقل

شناسه Android این برنامه `com.devicecontrol.companion` است و با برنامه‌های دیگر تداخل ندارد.

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile production
```

پروفایل production در `eas.json` خروجی APK می‌سازد، onboarding واقعی را فعال نگه می‌دارد و از امضای مدیریت‌شده EAS استفاده می‌کند.

## نکات رضایت و امنیت

- اشتراک صفحه فقط پس از پنجره رسمی MediaProjection آغاز می‌شود.
- کنترل لمسی فقط پس از فعال‌سازی دستی Accessibility توسط صاحب گوشی کار می‌کند.
- TURN، پیام‌ها، فایل‌های صوتی و پیشرفت آموزشی با دسترسی احراز هویت‌شده استفاده می‌شوند.
- هیچ Secret خصوصی نباید در Git یا چت قرار گیرد.
