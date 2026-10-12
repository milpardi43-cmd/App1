// Synthetic speech control-flow only; this does not claim an audible/native-device test.
const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  require('esbuild').buildSync({
    stdin: { contents: "export * from './lib/englishSupplement/content'; export * from './lib/englishSupplement/assessments';", resolveDir: process.cwd() },
    bundle: true, platform: 'node', format: 'cjs', outfile: 'node_modules/.cache/english-supplement-content.cjs',
  });
  const { ENGLISH_SUPPLEMENT, ASSESSMENTS } = require('../node_modules/.cache/english-supplement-content.cjs');
  let options = { headless: true };
  if (process.env.USE_SERVERLESS_CHROMIUM === '1') {
    const loc = require.resolve('@sparticuz/chromium'); const pack = await import(require('node:url').pathToFileURL(loc).href);
    await pack.inflate(path.resolve(path.dirname(loc), '../bin/al2023.tar.br')); pack.setupLambdaEnvironment(path.join(require('node:os').tmpdir(), 'al2023/lib'));
    options = { ...options, args: pack.default.args, executablePath: await pack.default.executablePath() };
  }
  const browser = await chromium.launch(options);
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.setDefaultTimeout(30000);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    let checks = 0; const check = value => { assert(value); checks++; };
    await page.route(/supabase\.(co|in)/, route => route.abort());
    await page.addInitScript(() => {
      window.__mode = 'success'; window.SpeechSynthesisUtterance = class {};
      Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
        getVoices: () => [{ voiceURI: 'en', name: 'English test', lang: 'en-US' }], cancel: () => {},
        speak: utterance => { window.__lastSpeech = utterance; setTimeout(() => utterance.onstart?.({}), 10); setTimeout(() => window.__mode === 'error' ? utterance.onerror?.({ error: 'test' }) : utterance.onend?.({}), 300); },
      } });
    });
    const root = process.env.BROWSER_BASE_URL || 'http://127.0.0.1:8081';
    const button = name => page.getByRole('button', { name, exact: true });

    async function answerTask(task, deferFeedback = false) {
      const card = page.getByText(task.prompt, { exact: true }).locator('..');
      if (task.options) await card.getByRole('radio', { name: task.answers[0], exact: true }).click();
      else await card.getByRole('textbox').fill(task.answers[0]);
      if (task.audio) {
        check(await card.getByRole('button', { name: 'بررسی پاسخ', exact: true }).isDisabled());
        await card.getByRole('button', { name: 'شنیدن سؤال', exact: true }).click();
        await card.getByRole('button', { name: 'پخش دوباره', exact: true }).waitFor();
      }
      await card.getByRole('button', { name: 'بررسی پاسخ', exact: true }).click();
      if (deferFeedback) {
        await page.getByText('پاسخ این سؤال ذخیره شد؛ برای حفظ سنجش مستقل، امکان تغییر آن پس از ثبت وجود ندارد.', { exact: true }).waitFor();
        check(await card.getByText('پاسخ درست ثبت شد.', { exact: true }).count() === 0);
      } else await card.getByText('پاسخ درست ثبت شد.', { exact: true }).waitFor();
      checks++;
    }

    async function runFinalAssessment(level) {
      await button('گزارش و سنجش').click();
      await button(`شروع / ادامهٔ سنجش ${level}`).waitFor();
      await button(`شروع / ادامهٔ سنجش ${level}`).click();
      await page.getByText(`سنجش پایانی ${level}`, { exact: true }).waitFor();
      await button('شروع سنجش').click();
      const tasks = ASSESSMENTS[level];
      for (const [index, task] of tasks.entries()) {
        await answerTask(task, true);
        if (index < tasks.length - 1) await button('رفتن به سؤال بعد').click();
      }
      await button('ثبت نتیجهٔ پایانی').click();
      await page.getByText('معیار داخلی سنجش گذرانده شد', { exact: true }).waitFor();
      check((await page.locator('body').innerText()).includes(`${tasks.length} پاسخ درست`));
      await button('بازگشت به دوره').click();
      await button('واحدهای دوره').waitFor();
      await button('واحدهای دوره').click();
    }

    await page.goto(root + '/lang', { waitUntil: 'domcontentloaded' });
    await page.getByText('English Journey', { exact: true }).waitFor();
    await page.getByRole('button', { name: /نمایش نقشهٔ کامل ۵ سطح/ }).click();
    check(await page.getByRole('button', { name: /^فهرست درس‌های/ }).count() === 5);
    check((await page.locator('body').innerText()).includes('مسیر یادگیری'));

    await page.goto(root + '/lang/supplement', { waitUntil: 'domcontentloaded' });
    await page.getByText('مسیر انگلیسی مقدماتی تا A1', { exact: true }).waitFor();
    check(ENGLISH_SUPPLEMENT.length === 24);
    await page.getByRole('button', { name: /^1\. الفبا/ }).waitFor();
    check(await page.getByRole('button', { name: /^2\. صداها/ }).isDisabled());

    for (const [index, unit] of ENGLISH_SUPPLEMENT.entries()) {
      const unitButton = page.getByRole('button', { name: new RegExp(`^${index + 1}\\. `) });
      if (index === 4) check(await unitButton.isEnabled());
      await unitButton.click();
      check(await button('ابتدا چهار تمرین را درست انجام دهید').isDisabled());
      for (const [phase, tasks] of [['practice', unit.practice], ['check', unit.checkpoint]]) {
        if (phase === 'check') await button('شروع آزمون پایان واحد').click();
        for (const task of tasks) await answerTask(task);
      }
      await page.getByText('واحد کامل شد. برای ورود به واحد بعد، به فهرست واحدها برگردید.', { exact: true }).waitFor();
      checks++;
      await button('بازگشت به واحدها').click();
      if (index === 3) {
        check(await page.getByRole('button', { name: /^5/ }).isDisabled());
        await runFinalAssessment('Foundation');
      }
    }

    await runFinalAssessment('A1');
    await button('گزارش و سنجش').click();
    check((await page.locator('body').innerText()).includes('واحدهای تکمیل‌شده: 24 از 24'));
    await button('نوشتن و مکالمه').click();
    for (const [label, value] of [['First name', 'Mina'], ['Last name', 'Green'], ['City', 'York'], ['Email', 'mina@example.com']]) await page.getByRole('textbox', { name: label, exact: true }).fill(value);
    await button('بررسی و ذخیره فرم').click();
    await page.getByText('همه فیلدها درست‌اند؛ پیش‌نویس ذخیره شد.', { exact: true }).waitFor(); checks++;
    await page.getByRole('textbox', { name: 'پیام و قرار', exact: true }).fill('Hi Tom. Would you like to meet tomorrow at ten? Please reply.');
    const draft = page.getByText('پیام و قرار', { exact: true }).locator('..');
    await draft.getByRole('button', { name: 'ذخیره پیش‌نویس' }).click();
    await draft.getByText('پیش‌نویس روی همین دستگاه ذخیره شد.').waitFor();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await button('نوشتن و مکالمه').click();
    check((await page.getByRole('textbox', { name: 'پیام و قرار', exact: true }).inputValue()).startsWith('Hi Tom.'));
    check(await page.getByRole('textbox', { name: 'City', exact: true }).inputValue() === 'York');
    await page.getByRole('button', { name: 'شنیدن جملهٔ طرف مقابل' }).first().click();
    await page.getByRole('button', { name: 'در حال پخش…' }).first().waitFor();
    await page.getByRole('button', { name: 'شنیدن جملهٔ طرف مقابل' }).first().waitFor(); checks++;

    await page.goto(root + '/course/lesson?id=foundation-introducing-yourself', { waitUntil: 'domcontentloaded' });
    for (let i = 0; i < 15; i++) {
      if (await button('پایان درس').count()) break;
      const sentence = page.getByText('جمله بعدی', { exact: true });
      if (await sentence.count()) await sentence.click(); else await page.getByText('ادامه', { exact: true }).click();
    }
    check(await button('پایان درس').isDisabled());
    const listen = page.getByText('جمله را بشنوید و معنی آن را انتخاب کنید.', { exact: true }).locator('..');
    await listen.getByRole('radio', { name: 'سلام، اسم من سارا است.', exact: true }).click();
    check(await listen.getByRole('button', { name: 'بررسی پاسخ' }).isDisabled());
    await page.evaluate(() => window.__mode = 'error');
    await listen.getByRole('button', { name: 'شنیدن سؤال' }).click();
    await listen.getByText(/صدا کامل پخش نشد/).waitFor(); check(await button('پایان درس').isDisabled());
    await page.evaluate(() => window.__mode = 'success');
    await listen.getByRole('button', { name: 'شنیدن سؤال' }).click();
    await listen.getByRole('button', { name: 'پخش دوباره' }).waitFor();
    await listen.getByRole('button', { name: 'بررسی پاسخ' }).click();
    await page.getByText('شنیداری: ثبت شد ✓', { exact: true }).waitFor(); check(await button('پایان درس').isDisabled());
    const writing = page.getByText('جملهٔ انگلیسیِ مربوط به این معنی را مطابق متن همین درس بنویسید.', { exact: true }).locator('..');
    await writing.getByRole('textbox').fill('wrong'); await writing.getByRole('button', { name: 'بررسی پاسخ' }).click();
    await writing.getByText(/هنوز درست نیست/).waitFor(); check(await button('پایان درس').isDisabled());
    await writing.getByRole('textbox').fill('What is your name?'); await writing.getByRole('button', { name: 'بررسی پاسخ' }).click();
    await page.getByText('نوشتاری: ثبت شد ✓', { exact: true }).waitFor(); check(await button('پایان درس').isEnabled());
    await button('پایان درس').click(); await page.getByText('English Journey', { exact: true }).waitFor(); checks++;
    const expectedOfflineErrors = errors.filter(error => error.includes('cdn.jsdelivr.net/npm/jsqr@1.2.0') || (error.includes('Failed to fetch') && error.includes('SupabaseAuthClient.signInAnonymously')));
    const unexpectedErrors = errors.filter(error => !expectedOfflineErrors.includes(error));
    if (unexpectedErrors.length) console.error('Unexpected browser errors:', unexpectedErrors);
    check(unexpectedErrors.length === 0); check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    console.log(`${checks} English browser checks passed (mock TTS; legacy five-level library, 24 supplement units and both final assessments). ${expectedOfflineErrors.length} expected page errors came only from blocked external Supabase/QR requests.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
