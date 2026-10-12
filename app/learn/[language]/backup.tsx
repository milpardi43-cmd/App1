import { useCallback, useEffect, useState } from 'react';
import { Platform, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GermanCourseButton, GermanCoursePage, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { GermanPalette as Palette } from '@/components/germanTheme';
import { toPersianDigits as fa } from '@/lib/format';
import { germanProgress } from '@/lib/languages/catalog';
import { GERMAN_SENTENCE_LESSONS } from '@/lib/languages/germanSentenceCourse';
import type { CourseProgress } from '@/lib/createCourseProgressStore';

export default function GermanBackupRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  if (language !== 'de') return <GermanCoursePage title="پشتیبان این مسیر پیدا نشد">{null}</GermanCoursePage>;
  return <GermanBackup />;
}

function GermanBackup() {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState<number | null>(null);
  const [importText, setImportText] = useState('');
  const [fallbackExport, setFallbackExport] = useState('');
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');

  const refresh = useCallback(async () => {
    setLoadError('');
    try {
      const [saved, due] = await Promise.all([
        germanProgress.getCourseProgress(),
        germanProgress.getDueReviewCards(),
      ]);
      setProgress(saved);
      setDueCount(due.length);
    } catch {
      setLoadError('پیشرفت آلمانی خوانده نشد. سابقهٔ فعلی دست‌نخورده می‌ماند؛ دوباره تلاش کنید.');
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const exportBackup = async () => {
    setBusy('export');
    setError('');
    setStatus('');
    setFallbackExport('');
    let json = '';
    try {
      json = await germanProgress.exportProgress();
      if (Platform.OS === 'web') {
        downloadJson(json);
        setStatus('فایل پشتیبان دانلود شد. آن را در محلی امن نگه دارید.');
      } else {
        const result = await Share.share({ title: 'پشتیبان پیشرفت آلمانی', message: json });
        if (result.action === Share.dismissedAction) {
          setStatus('اشتراک‌گذاری لغو شد؛ پشتیبانی ارسال نشده است.');
        } else {
          setStatus('پشتیبان به برنامهٔ انتخاب‌شده فرستاده شد؛ آن را در محلی امن نگه دارید.');
        }
      }
    } catch {
      if (json) setFallbackExport(json);
      setError(json
        ? 'ارسال یا دانلود خودکار انجام نشد. متن پشتیبان را از کادر پایین کپی و در یک فایل امن ذخیره کنید.'
        : 'ساخت نسخهٔ پشتیبان انجام نشد. فضای ذخیره‌سازی دستگاه را بررسی و دوباره تلاش کنید.');
    } finally {
      setBusy(null);
    }
  };

  const chooseBackupFile = () => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      void file.text().then(text => {
        setImportText(text);
        setError('');
        setStatus(`فایل «${file.name}» آمادهٔ بررسی و بازیابی است.`);
      }).catch(() => setError('خواندن فایل ممکن نشد؛ فایل JSON دیگری انتخاب کنید.'));
    };
    input.click();
  };

  const restoreBackup = async () => {
    if (!importText.trim() || busy) return;
    setBusy('import');
    setError('');
    setStatus('');
    try {
      const restored = await germanProgress.restoreProgress(importText);
      setProgress(restored);
      setDueCount((await germanProgress.getDueReviewCards()).length);
      setImportText('');
      setFallbackExport('');
      setStatus(`ادغام پشتیبان انجام شد؛ اکنون ${fa(restored.completedLessonIds.length)} درس از ${fa(GERMAN_SENTENCE_LESSONS.length)} درس در سابقه ثبت است. سابقهٔ موجود پاک نشد.`);
    } catch {
      setError('بازیابی انجام نشد. مطمئن شوید فایل JSON از همین دورهٔ آلمانی صادر شده و دست‌کاری نشده است؛ سابقهٔ فعلی پاک نمی‌شود.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <GermanCoursePage title="پشتیبان پیشرفت آلمانی" subtitle="خروجی و بازیابی محلی · بدون همگام‌سازی ابری" back="/learn/de">
      <View style={s.card}>
        <Text style={s.heading}>وضعیت فعلی این دستگاه</Text>
        {loadError ? (
          <>
            <Text accessibilityRole="alert" style={s.error}>{loadError}</Text>
            <GermanCourseButton title="تلاش دوباره" secondary onPress={() => void refresh()} />
          </>
        ) : progress ? (
          <>
            <Text style={s.description}>{fa(progress.completedLessonIds.length)} از {fa(GERMAN_SENTENCE_LESSONS.length)} درس تکمیل‌شده</Text>
            <Text style={s.small}>{fa(dueCount ?? 0)} جمله برای مرور آماده است. این پیشرفت فعلاً روی همین دستگاه ذخیره می‌شود.</Text>
          </>
        ) : <Text style={s.small}>در حال خواندن پیشرفت…</Text>}
      </View>

      <View style={s.card}>
        <Text style={s.heading}>ساخت نسخهٔ پشتیبان</Text>
        <Text style={s.description}>فایل شامل پیشرفت درس‌ها و زمان‌بندی کارت‌های مرور آلمانی است. فایل را در محل امن نگه دارید؛ بازیابی آن با سابقهٔ فعلی ادغام می‌شود و آن را جایگزین یا پاک نمی‌کند.</Text>
        <GermanCourseButton
          title={busy === 'export' ? 'در حال آماده‌سازی…' : Platform.OS === 'web' ? 'دانلود فایل پشتیبان' : 'اشتراک‌گذاری پشتیبان'}
          disabled={busy !== null}
          onPress={() => void exportBackup()}
        />
        {fallbackExport ? (
          <TextInput
            accessibilityLabel="متن نسخهٔ پشتیبان برای کپی"
            value={fallbackExport}
            editable={false}
            multiline
            selectTextOnFocus
            style={styles.jsonFallback}
          />
        ) : null}
      </View>

      <View style={s.card}>
        <Text style={s.heading}>بازیابی و ادغام پشتیبان</Text>
        <Text style={s.description}>فایل را در وب انتخاب کنید یا متن JSON آن را جای‌گذاری کنید. فقط نسخه‌ای که از همین دورهٔ آلمانی صادر شده باشد پذیرفته می‌شود. پیشرفت فعلی با نسخهٔ پشتیبان ادغام می‌شود؛ هیچ سابقه‌ای عمداً جایگزین نمی‌شود.</Text>
        {Platform.OS === 'web' ? <GermanCourseButton title="انتخاب فایل JSON" secondary onPress={chooseBackupFile} /> : null}
        <TextInput
          accessibilityLabel="متن فایل پشتیبان آلمانی"
          value={importText}
          onChangeText={setImportText}
          multiline
          maxLength={4_000_000}
          editable={busy !== 'import'}
          autoCapitalize="none"
          autoCorrect={false}
          textAlignVertical="top"
          placeholder="متن کامل فایل پشتیبان را اینجا جای‌گذاری کنید…"
          style={styles.importInput}
        />
        <GermanCourseButton
          title={busy === 'import' ? 'در حال بررسی و ادغام…' : 'بررسی و بازیابی پیشرفت'}
          disabled={busy !== null || !importText.trim()}
          onPress={() => void restoreBackup()}
        />
      </View>

      {!!error ? <Text accessibilityRole="alert" style={s.error}>{error}</Text> : null}
      {!!status ? <Text accessibilityLiveRegion="polite" style={s.notice}>{status}</Text> : null}
      <Text style={s.small}>اگر فایل از دورهٔ دیگری باشد، شناسهٔ آن اشتباه باشد یا ساختارش خراب شده باشد، بازیابی رد می‌شود و پیشرفت فعلی حفظ خواهد شد.</Text>
    </GermanCoursePage>
  );
}

function downloadJson(text: string) {
  if (typeof document === 'undefined' || typeof URL === 'undefined') throw new Error('Download unavailable');
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `deutsch-journey-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const styles = StyleSheet.create({
  importInput: { minHeight: 190, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 14, padding: 13, color: Palette.ink, fontSize: 13, lineHeight: 20, textAlign: 'left', writingDirection: 'ltr' },
  jsonFallback: { minHeight: 140, maxHeight: 260, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 14, padding: 12, color: Palette.ink, fontSize: 10, lineHeight: 16, textAlign: 'left', writingDirection: 'ltr' },
});
