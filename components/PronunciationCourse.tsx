import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { AppBottomNav } from '@/components/AppBottomNav';
import { GermanBottomNav } from '@/components/GermanBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { toPersianDigits as fa } from '@/lib/format';
import {
  PRONUNCIATION_COURSES,
  type PronunciationLanguage,
  type PronunciationUnit,
} from '@/lib/languages/pronunciationCourse';
import {
  loadPronunciationMarks,
  savePronunciationMark,
  type PronunciationMark,
  type PronunciationMarks,
} from '@/lib/languages/pronunciationProgress';

const THEMES = {
  en: {
    accent: '#6654CE',
    accentDark: '#40327F',
    soft: '#F0ECFA',
    canvas: '#F5F3F7',
    surface: '#FFFFFF',
    ink: '#191A31',
    text: '#56566D',
    muted: '#858398',
    border: '#E7E2EC',
    gold: '#D8B76E',
    home: '/lang',
    locale: 'en-US',
    languageFa: 'انگلیسی',
    brand: 'ENGLISH · PRONUNCIATION',
  },
  de: {
    accent: '#197D70',
    accentDark: '#124B43',
    soft: '#E6F5EF',
    canvas: '#F4F7F4',
    surface: '#FFFFFF',
    ink: '#173E34',
    text: '#435E57',
    muted: '#71837E',
    border: '#D8E7E0',
    gold: '#C6A65D',
    home: '/learn/de',
    locale: 'de-DE',
    languageFa: 'آلمانی',
    brand: 'DEUTSCH · AUSSPRACHE',
  },
} as const;

export function PronunciationCourse({ language }: { language: PronunciationLanguage }) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const speechGeneration = useRef(0);
  const units = PRONUNCIATION_COURSES[language];
  const theme = THEMES[language];
  const [index, setIndex] = useState(0);
  const [marks, setMarks] = useState<PronunciationMarks>({});
  const [storageReady, setStorageReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [storageMessage, setStorageMessage] = useState('');
  const [retryStorage, setRetryStorage] = useState(0);
  const [saving, setSaving] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechMessage, setSpeechMessage] = useState('نمونه با موتور گفتار دستگاه پخش می‌شود؛ در صورت نیاز صدای این زبان را در تنظیمات دستگاه فعال کنید.');
  const unit = units[index];
  const mark = marks[unit.id]?.mark ?? undefined;
  const practicedCount = Object.values(marks).filter(value => value?.mark === 'practiced').length;
  const reviewCount = Object.values(marks).filter(value => value?.mark === 'review').length;

  useEffect(() => {
    let active = true;
    setMarks({});
    setStorageReady(false);
    setStorageError('');
    void loadPronunciationMarks(language).then(next => {
      if (!active) return;
      setMarks(next);
      setStorageReady(true);
      setStorageMessage('');
    }).catch(() => {
      if (!active) return;
      setStorageError('یادداشت محلی تلفظ خوانده نشد. دادهٔ ناسازگار را خودکار پاک یا بازنویسی نمی‌کنیم؛ می‌توانید دوباره تلاش کنید.');
    });
    return () => { active = false; };
  }, [language, retryStorage]);

  useEffect(() => () => {
    speechGeneration.current += 1;
    void Speech.stop().catch(() => undefined);
  }, []);

  useEffect(() => setIndex(0), [language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [index]);

  const stopSpeech = () => {
    const request = ++speechGeneration.current;
    setSpeaking(false);
    setSpeechMessage('پخش متوقف شد؛ برنامه شنیده‌شدن صدا را تأیید نمی‌کند.');
    void Speech.stop().catch(() => {
      if (request === speechGeneration.current) setSpeechMessage('توقف صدا ممکن نشد؛ پخش دستگاه را بررسی کنید.');
    });
  };

  const speak = async (text: string, rate: 'slow' | 'normal') => {
    const request = ++speechGeneration.current;
    setSpeaking(true);
    setSpeechMessage(`درخواست پخش ${rate === 'slow' ? 'آهسته' : 'عادی'} ارسال شد؛ منتظر صدای دستگاه هستیم.`);
    try {
      await Speech.stop();
      if (request !== speechGeneration.current) return;
      Speech.speak(text, {
        language: theme.locale,
        rate: rate === 'slow' ? 0.62 : 0.86,
        onStart: () => {
          if (request === speechGeneration.current) setSpeechMessage('موتور دستگاه شروع پخش را گزارش کرد؛ شنیده‌شدن صدا را خودتان بررسی کنید.');
        },
        onDone: () => {
          if (request !== speechGeneration.current) return;
          setSpeaking(false);
          setSpeechMessage('پایان پخش گزارش شد؛ این صفحه کیفیت تلفظ را نمی‌سنجد.');
        },
        onStopped: () => {
          if (request !== speechGeneration.current) return;
          setSpeaking(false);
          setSpeechMessage('پخش متوقف شد؛ شنیده‌شدن صدا تأیید نشده است.');
        },
        onError: () => {
          if (request !== speechGeneration.current) return;
          setSpeaking(false);
          setSpeechMessage(`صدای ${theme.languageFa} در دسترس نبود؛ تنظیمات گفتار دستگاه را بررسی کنید.`);
        },
      });
    } catch {
      if (request !== speechGeneration.current) return;
      setSpeaking(false);
      setSpeechMessage(`پخش صدای ${theme.languageFa} انجام نشد؛ تنظیمات گفتار دستگاه را بررسی کنید.`);
    }
  };

  const saveMark = async (nextMark: PronunciationMark | null) => {
    if (!storageReady || saving) return;
    setSaving(true);
    setStorageMessage('');
    try {
      const next = await savePronunciationMark(language, unit.id, nextMark);
      setMarks(next);
      setStorageMessage(nextMark === null
        ? 'علامت این تمرین پاک شد؛ اگر وارد حساب باشید، حذف آن همگام می‌شود.'
        : nextMark === 'practiced'
          ? 'یادداشت «تمرین کردم» ذخیره شد؛ در صورت ورود به حساب، همگام می‌شود.'
          : 'این تمرین برای مرور بعدی علامت خورد؛ در صورت ورود به حساب، همگام می‌شود.');
    } catch {
      setStorageMessage('یادداشت ذخیره نشد؛ فضای ذخیره‌سازی دستگاه را بررسی کنید. متن درس و صدای نمونه در دسترس می‌مانند.');
    } finally {
      setSaving(false);
    }
  };

  const goTo = (nextIndex: number) => {
    stopSpeech();
    if (nextIndex < 0 || nextIndex >= units.length) return;
    setIndex(nextIndex);
  };

  const next = () => {
    if (index + 1 < units.length) goTo(index + 1);
    else {
      stopSpeech();
      router.replace(theme.home as never);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.canvas }]}>
      <StatusBar style="dark" />
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <PageNavigation backFallback={theme.home} accentColor={theme.accent} borderColor={theme.border} />
        <View style={styles.headerCopy}>
          <Text style={[styles.brand, { color: theme.accent }]}>{theme.brand}</Text>
          <Text style={[styles.headerTitle, { color: theme.ink }]}>کارگاه تلفظ {theme.languageFa}</Text>
        </View>
        <View style={[styles.headerCount, { backgroundColor: theme.soft }]}>
          <Text style={[styles.headerCountText, { color: theme.accentDark }]}>{fa(index + 1)} / {fa(units.length)}</Text>
        </View>
      </View>

      <View style={[styles.track, { backgroundColor: theme.border }]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: units.length, now: index + 1 }}>
        <View style={[styles.trackFill, { width: `${((index + 1) / units.length) * 100}%`, backgroundColor: theme.accent }]} />
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.hero, { backgroundColor: theme.accentDark }]}>
            <View style={styles.heroTop}>
              <View style={styles.heroIcon}><Volume2 size={20} color={theme.gold} /></View>
              <Text style={styles.heroEyebrow}>تمرین {fa(index + 1)} از {fa(units.length)}</Text>
            </View>
            <Text accessibilityRole="header" style={styles.heroTitle}>{unit.title}</Text>
            <Text style={styles.heroFocus}>{unit.focusFa}</Text>
            <Text style={styles.heroProgress}>یادداشت شخصی: {fa(practicedCount)} تمرین‌شده · {fa(reviewCount)} برای مرور</Text>
          </View>

          <View style={[styles.noticeCard, { backgroundColor: theme.soft, borderColor: theme.border }]}>
            <Text style={[styles.noticeTitle, { color: theme.accentDark }]}>تمرین خودارزیابی؛ خصوصی و قابل‌همگام‌سازی</Text>
            <Text style={[styles.body, { color: theme.text }]}>نمونه‌ها با موتور گفتار سیستم‌عامل درخواست می‌شوند؛ موجودبودن و آفلاین‌بودن صدا به تنظیمات دستگاه بستگی دارد. این بخش میکروفن را باز نمی‌کند، صدای شما را ضبط یا ارسال نمی‌کند و تلفظ را نمره نمی‌دهد. وضعیت‌ها خودارزیابی‌اند؛ برای همگام‌سازی میان دستگاه‌ها، از صفحهٔ «حساب و همگام‌سازی» وارد شوید.</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.ink }]}>چه چیزی را تمرین کنیم؟</Text>
            <Text style={[styles.body, { color: theme.text }]}>{unit.explanationFa}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.sectionHeadingRow}>
              <Text style={[styles.sectionTitle, { color: theme.ink }]}>گوش کن و مقایسه کن</Text>
              <View style={[styles.smallBadge, { backgroundColor: theme.soft }]}>
                <Text style={[styles.smallBadgeText, { color: theme.accentDark }]}>{fa(unit.examples.length)} نمونه</Text>
              </View>
            </View>
            {unit.examples.map((example, exampleIndex) => (
              <View key={`${unit.id}-${exampleIndex}`} style={[styles.example, { borderColor: theme.border, backgroundColor: theme.canvas }]}>
                <Text style={[styles.exampleText, { color: theme.ink }]}>{example.text}</Text>
                <Text style={[styles.exampleMeaning, { color: theme.text }]}>{example.meaningFa}</Text>
                <Text style={[styles.exampleFocus, { color: theme.muted }]}>{example.focusFa}</Text>
                <View style={styles.audioButtons}>
                  <AudioButton
                    title="آهسته گوش کن"
                    accessibilityLabel={`پخش آهستهٔ ${example.text} به ${theme.languageFa}`}
                    accent={theme.accent}
                    soft={theme.soft}
                    disabled={false}
                    onPress={() => void speak(example.text, 'slow')}
                  />
                  <AudioButton
                    title="سرعت عادی"
                    accessibilityLabel={`پخش عادی ${example.text} به ${theme.languageFa}`}
                    accent={theme.accent}
                    soft={theme.soft}
                    disabled={false}
                    onPress={() => void speak(example.text, 'normal')}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.practiceCard, { backgroundColor: theme.accentDark }]}>
            <Text style={styles.practiceLabel}>حالا در جمله تمرین کن</Text>
            <Text style={styles.practiceText}>{unit.practiceText}</Text>
            <Text style={styles.practiceMeaning}>{unit.practiceMeaningFa}</Text>
            <Text style={styles.practiceInstruction}>{unit.practiceFa}</Text>
            <View style={styles.audioButtons}>
              <AudioButton
                title="جمله را آهسته بشنو"
                accessibilityLabel={`پخش آهستهٔ جمله به ${theme.languageFa}`}
                accent="#FFFFFF"
                soft="rgba(255,255,255,0.14)"
                disabled={false}
                onPress={() => void speak(unit.practiceText, 'slow')}
                light
              />
              <AudioButton
                title="جمله را عادی بشنو"
                accessibilityLabel={`پخش عادی جمله به ${theme.languageFa}`}
                accent="#FFFFFF"
                soft="rgba(255,255,255,0.14)"
                disabled={false}
                onPress={() => void speak(unit.practiceText, 'normal')}
                light
              />
            </View>
          </View>

          <View style={[styles.selfCheck, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.ink }]}>یادداشت خودت</Text>
            <Text style={[styles.body, { color: theme.text }]}>پس از گوش‌دادن و تکرار، فقط برای برنامه‌ریزی مرور انتخاب کن؛ این علامت، سنجش درست یا نادرست‌بودن تلفظ نیست.</Text>
            {!storageReady && !storageError ? <Text style={[styles.smallText, { color: theme.muted }]}>در حال خواندن یادداشت‌های همین دستگاه…</Text> : null}
            {storageError ? (
              <View style={styles.storageErrorWrap}>
                <Text accessibilityRole="alert" style={styles.storageError}>{storageError}</Text>
                <ActionButton title="تلاش دوباره" accent={theme.accent} soft={theme.soft} onPress={() => setRetryStorage(value => value + 1)} />
              </View>
            ) : null}
            <View style={styles.markButtons}>
              <ActionButton
                title={mark === 'practiced' ? '✓ تمرین کردم' : 'تمرین کردم'}
                accent={theme.accent}
                soft={theme.soft}
                selected={mark === 'practiced'}
                disabled={!storageReady || saving}
                onPress={() => void saveMark('practiced')}
              />
              <ActionButton
                title={mark === 'review' ? '✓ برای مرور' : 'برای مرور نگه دار'}
                accent={theme.accent}
                soft={theme.soft}
                selected={mark === 'review'}
                disabled={!storageReady || saving}
                onPress={() => void saveMark('review')}
              />
            </View>
            {!!mark && storageReady ? (
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={() => void saveMark(null)}
                style={styles.clearMark}
              >
                <RotateCcw size={14} color={theme.muted} />
                <Text style={[styles.clearMarkText, { color: theme.muted }]}>پاک‌کردن علامت این تمرین</Text>
              </Pressable>
            ) : null}
            {!!storageMessage ? <Text accessibilityLiveRegion="polite" style={[styles.smallText, { color: theme.muted }]}>{storageMessage}</Text> : null}
            {saving ? <Text style={[styles.smallText, { color: theme.muted }]}>در حال ذخیره…</Text> : null}
          </View>

          <Text accessibilityLiveRegion="polite" style={[styles.audioStatus, { color: theme.muted }]}>{speechMessage}</Text>
          {speaking ? (
            <ActionButton title="توقف صدا" accent={theme.accent} soft={theme.soft} onPress={stopSpeech} />
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.canvas, borderTopColor: theme.border }]}>
        <ActionButton
          title="تمرین قبلی"
          style={styles.footerAction}
          accent={theme.accent}
          soft={theme.soft}
          secondary
          disabled={index === 0 || saving}
          icon={<ChevronRight size={17} color={theme.accent} />}
          onPress={() => goTo(index - 1)}
        />
        <ActionButton
          title={index + 1 === units.length ? 'پایان و بازگشت به مسیر' : 'تمرین بعدی'}
          style={styles.footerAction}
          accent={theme.accent}
          soft={theme.soft}
          disabled={saving}
          icon={index + 1 === units.length ? <ArrowLeft size={17} color="#FFFFFF" /> : <ChevronLeft size={17} color="#FFFFFF" />}
          onPress={next}
        />
      </View>
      {language === 'de' ? <GermanBottomNav /> : <AppBottomNav />}
    </View>
  );
}

function AudioButton({
  title,
  accessibilityLabel,
  accent,
  soft,
  onPress,
  disabled,
  light = false,
}: {
  title: string;
  accessibilityLabel: string;
  accent: string;
  soft: string;
  onPress: () => void;
  disabled: boolean;
  light?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={onPress}
      style={[styles.audioButton, { backgroundColor: soft, borderColor: light ? 'rgba(255,255,255,0.25)' : `${accent}35` }, disabled && styles.disabled]}
    >
      <Volume2 size={15} color={accent} />
      <Text style={[styles.audioButtonText, { color: accent }]}>{title}</Text>
    </Pressable>
  );
}

function ActionButton({
  title,
  accent,
  soft,
  onPress,
  disabled = false,
  secondary = false,
  selected = false,
  icon,
  style,
}: {
  title: string;
  accent: string;
  soft: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  selected?: boolean;
  icon?: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.actionButton,
        style,
        { backgroundColor: secondary ? '#FFFFFF' : accent, borderColor: secondary ? accent : 'transparent' },
        selected && { backgroundColor: soft, borderColor: accent },
        disabled && styles.disabled,
      ]}
    >
      {icon}
      <Text style={[styles.actionButtonText, { color: secondary || selected ? accent : '#FFFFFF' }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { minHeight: 72, width: '100%', maxWidth: 980, alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 11, paddingHorizontal: 18, paddingTop: 45, paddingBottom: 10, borderBottomWidth: 1 },
  headerCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  brand: { fontSize: 8, fontWeight: '900', letterSpacing: 1.1, writingDirection: 'ltr' },
  headerTitle: { fontSize: 16, lineHeight: 24, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  headerCount: { minWidth: 52, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 999, alignItems: 'center' },
  headerCountText: { fontSize: 10, fontWeight: '800', writingDirection: 'ltr' },
  track: { height: 5, width: '100%', overflow: 'hidden' },
  trackFill: { height: '100%', alignSelf: 'flex-end' },
  scrollContent: { flexGrow: 1, paddingBottom: 18 },
  content: { width: '100%', maxWidth: 940, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 16, paddingBottom: 20, gap: 13 },
  hero: { overflow: 'hidden', padding: 19, borderRadius: 22, gap: 9 },
  heroTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  heroIcon: { width: 37, height: 37, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.11)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  heroEyebrow: { color: '#F2D99C', fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  heroTitle: { color: '#FFFFFF', fontSize: 22, lineHeight: 34, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  heroFocus: { color: '#E1DDEF', fontSize: 12, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  heroProgress: { color: '#D2CDE2', fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl', marginTop: 3 },
  noticeCard: { padding: 14, borderRadius: 17, borderWidth: 1, gap: 6 },
  noticeTitle: { fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  card: { padding: 16, borderRadius: 19, borderWidth: 1, gap: 11 },
  sectionHeadingRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionTitle: { flex: 1, fontSize: 15, lineHeight: 23, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  body: { fontSize: 12, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  smallBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  smallBadgeText: { fontSize: 9, fontWeight: '800', writingDirection: 'rtl' },
  example: { padding: 12, borderRadius: 14, borderWidth: 1, gap: 5 },
  exampleText: { fontSize: 21, lineHeight: 31, fontWeight: '800', textAlign: 'left', writingDirection: 'ltr' },
  exampleMeaning: { fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  exampleFocus: { fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  audioButtons: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7, paddingTop: 4 },
  audioButton: { minHeight: 38, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 },
  audioButtonText: { fontSize: 10, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  practiceCard: { padding: 17, borderRadius: 20, gap: 9 },
  practiceLabel: { color: '#F2D99C', fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  practiceText: { color: '#FFFFFF', fontSize: 20, lineHeight: 31, fontWeight: '800', textAlign: 'left', writingDirection: 'ltr' },
  practiceMeaning: { color: '#E1DDEF', fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  practiceInstruction: { color: '#E1DDEF', fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  selfCheck: { padding: 16, borderRadius: 19, borderWidth: 1, gap: 10 },
  markButtons: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  actionButton: { minHeight: 42, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 9 },
  footerAction: { flex: 1, minWidth: 0 },
  actionButtonText: { flexShrink: 1, fontSize: 10, fontWeight: '800', textAlign: 'center', writingDirection: 'rtl' },
  disabled: { opacity: 0.45 },
  clearMark: { minHeight: 36, flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-start', gap: 5, paddingHorizontal: 2 },
  clearMarkText: { fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  smallText: { fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  storageErrorWrap: { gap: 8 },
  storageError: { color: '#9B263C', backgroundColor: '#FFF0F2', borderWidth: 1, borderColor: '#F2D1D8', padding: 11, borderRadius: 12, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  audioStatus: { minHeight: 22, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  footer: { width: '100%', maxWidth: 940, alignSelf: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 9, paddingHorizontal: 18, paddingVertical: 10, borderTopWidth: 1 },
});
