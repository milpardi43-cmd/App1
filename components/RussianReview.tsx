import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { Brain, Check, CheckCircle2, Clock3, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import { RUSSIAN_LESSONS, russianProgress } from '@/lib/languages/russian';
import type { CourseProgress, ReviewRating, SentenceReviewCard } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const ratingOptions: Array<{ id: ReviewRating; label: string; hint: string; color: string }> = [
  { id: 'again', label: 'فراموش کردم', hint: '۱۰ دقیقه', color: Palette.danger },
  { id: 'hard', label: 'سخت بود', hint: 'فردا', color: Palette.warning },
  { id: 'good', label: 'خوب بود', hint: 'زمان مناسب', color: Palette.primary },
  { id: 'easy', label: 'آسان بود', hint: 'فاصلهٔ بیشتر', color: Palette.success },
];

function contentForCard(card: SentenceReviewCard) {
  const lesson = RUSSIAN_LESSONS.find(item => item.id === card.lessonId);
  const sentence = lesson?.sentences.find(item => item.id === card.sentenceId);
  return lesson && sentence ? { lesson, sentence } : null;
}

export default function RussianReview() {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCards, setDueCards] = useState<SentenceReviewCard[]>([]);
  const [sessionCards, setSessionCards] = useState<SentenceReviewCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nextProgress, nextCards] = await Promise.all([russianProgress.getCourseProgress(), russianProgress.getDueReviewCards()]);
      setProgress(nextProgress);
      setDueCards(nextCards);
      setError('');
    } catch {
      setError('مرور روسی بارگذاری نشد؛ پیشرفت محلی شما تغییر نکرده است. دوباره تلاش کنید.');
    } finally { setLoading(false); }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
    return () => { void Speech.stop(); };
  }, [load]));

  const currentCard = sessionCards[cardIndex];
  const currentContent = useMemo(() => currentCard ? contentForCard(currentCard) : null, [currentCard]);
  const reviewCount = dueCards.length;

  const startSession = () => {
    if (!dueCards.length) return;
    setSessionCards(dueCards.slice(0, 20));
    setCardIndex(0);
    setRevealed(false);
    setFinished(false);
    setSessionActive(true);
  };

  const rate = async (rating: ReviewRating) => {
    if (!currentCard || saving) return;
    setSaving(true);
    setError('');
    try {
      void Speech.stop();
      await russianProgress.rateReviewCard(currentCard.id, rating);
      if (cardIndex + 1 >= sessionCards.length) {
        setSessionActive(false);
        setFinished(true);
        await load();
      } else {
        setCardIndex(value => value + 1);
        setRevealed(false);
      }
    } catch {
      setError('نتیجهٔ مرور ذخیره نشد؛ دوباره تلاش کنید.');
    } finally { setSaving(false); }
  };

  const speak = (text: string) => {
    setError('');
    void Speech.stop();
    Speech.speak(text, { language: 'ru-RU', rate: .78, onError: () => setError('صدای روسی دستگاه در دسترس نیست؛ جمله همچنان برای خواندن نمایش داده می‌شود.') });
  };

  if (sessionActive && currentContent) {
    const { lesson, sentence } = currentContent;
    const vocabulary = sentence.vocabulary.map(item => `${item.word} · ${item.meaning}`).join('   ');
    return <View style={styles.root}>
      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      <View style={styles.header}><Text style={styles.title}>مرور امروز</Text><Text style={styles.subtitle}>کارت {fa(cardIndex + 1)} از {fa(sessionCards.length)} · {lesson.title}</Text></View>
      <View style={styles.sessionProgress}><View style={[styles.sessionProgressFill, { width: `${((cardIndex + 1) / sessionCards.length) * 100}%` }]} /></View>
      <ScrollView contentContainerStyle={styles.sessionContent}>
        <Text style={styles.recallLabel}>جملهٔ روسی را به یاد بیاورید</Text>
        <View style={styles.reviewCard}>
          <Text style={styles.reviewFa}>{sentence.fa}</Text>
          {!revealed ? <><Text style={styles.sayHint}>پاسخ روسی را با صدای بلند بگویید.</Text><Pressable accessibilityRole="button" style={styles.revealButton} onPress={() => setRevealed(true)}><Text style={styles.revealButtonText}>نمایش پاسخ</Text></Pressable></> : <View style={styles.answerArea}>
            <View style={styles.answerDivider} /><Text style={styles.reviewRussian}>{sentence.text}</Text><Text style={styles.reviewPronunciation}>{sentence.pronunciation}</Text>
            <Pressable accessibilityRole="button" style={styles.soundButton} onPress={() => speak(sentence.text)}><Volume2 size={18} color={Palette.primary} /><Text style={styles.soundText}>پخش جمله</Text></Pressable>
            {vocabulary ? <View style={styles.vocabChip}><Sparkles size={13} color={Palette.warning} /><Text style={styles.vocabText}>{vocabulary}</Text></View> : null}
          </View>}
        </View>
        {revealed ? <View style={styles.ratingArea}><Text style={styles.ratingTitle}>یادآوری این جمله چطور بود؟</Text><View style={styles.ratingGrid}>{ratingOptions.map(option => <Pressable key={option.id} disabled={saving} style={[styles.ratingButton, { borderColor: `${option.color}55` }]} onPress={() => void rate(option.id)}><Text style={[styles.ratingLabel, { color: option.color }]}>{saving ? 'در حال ذخیره…' : option.label}</Text><Text style={styles.ratingHint}>{option.hint}</Text></Pressable>)}</View></View> : null}
      </ScrollView>
    </View>;
  }

  return <View style={styles.root}>
    <View style={styles.header}><Text style={styles.title}>مرور روسی</Text><Text style={styles.subtitle}>فقط جمله‌هایی که زمان مرورشان رسیده است</Text></View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {finished ? <View style={styles.finishedCard}><View style={styles.finishedIcon}><Check size={32} color={Palette.success} /></View><Text style={styles.finishedTitle}>مرور امروز تمام شد</Text><Text style={styles.finishedDesc}>زمان مرور بعدی هر جمله بر اساس پاسخ شما تنظیم شد.</Text></View> : null}
      <LinearGradient colors={['#18204B', '#303A80', '#4D48B6']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.summaryCard}>
        <View pointerEvents="none" style={styles.summaryOrb} />
        <View style={styles.summaryTop}><View style={styles.brain}><Brain size={23} color="#D5D7FF" /></View><View style={styles.summaryTag}><RefreshCw size={12} color="#C8CAFF" /><Text style={styles.summaryTagText}>SPACED REVIEW</Text></View></View>
        <Text style={styles.summaryTitle}>{loading ? 'در حال بارگذاری مرور…' : reviewCount ? `${fa(reviewCount)} جمله برای مرور` : 'فعلاً مروری ندارید'}</Text>
        <Text style={styles.summaryDesc}>{loading ? 'در حال بررسی موعد مرور جمله‌های روسی…' : reviewCount ? 'جمله‌های دشوار زودتر و جمله‌های آسان دیرتر برمی‌گردند.' : progress?.completedLessonIds.length ? 'مرور بعدی در زمان مناسب به‌طور خودکار اینجا ظاهر می‌شود.' : 'پس از پایان اولین درس روسی، جمله‌های آن وارد برنامهٔ مرور می‌شوند.'}</Text>
        {!!error && <Text accessibilityRole="alert" style={styles.summaryError}>{error}</Text>}
        <View style={styles.summaryActions}><Pressable accessibilityRole="button" disabled={!reviewCount || loading} style={[styles.startButton, (!reviewCount || loading) && styles.disabled]} onPress={startSession}><RefreshCw size={16} color={Palette.primaryDark} /><Text style={styles.startText}>شروع مرور امروز</Text></Pressable>{reviewCount ? <View style={styles.time}><Clock3 size={13} color="#D7D9FF" /><Text style={styles.timeText}>حدود {fa(Math.max(2, Math.ceil(reviewCount * .6)))} دقیقه</Text></View> : null}</View>
      </LinearGradient>
      <Text style={styles.sectionTitle}>مرور چگونه تنظیم می‌شود؟</Text>
      <View style={styles.methodList}><Method num="۱" title="معنی را ببین و جمله را بگو" desc="پیش از دیدن پاسخ، جملهٔ روسی را با صدای بلند به یاد بیاورید." /><Method num="۲" title="پاسخ را ببین و بشنو" desc="متن روسی و آوانویسی تقریبی را با پاسخ خود مقایسه کنید." /><Method num="۳" title="میزان سختی را انتخاب کن" desc="برنامه زمان مرور بعدی را روی همین دستگاه تنظیم می‌کند." /></View>
      <View style={styles.note}><CheckCircle2 size={18} color={Palette.success} /><Text style={styles.noteText}>مرور روسی جدا از پیشرفت انگلیسی و آلمانی، فقط در حافظهٔ همین دستگاه ذخیره می‌شود.</Text></View>
    </ScrollView>
    <RussianBottomNav />
  </View>;
}

function Method({ num, title, desc }: { num: string; title: string; desc: string }) {
  return <View style={styles.method}><View style={styles.methodNum}><Text style={styles.methodNumText}>{num}</Text></View><View style={styles.methodText}><Text style={styles.methodTitle}>{title}</Text><Text style={styles.methodDesc}>{desc}</Text></View></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  header: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingTop: 26, paddingBottom: 14, paddingHorizontal: 20 },
  title: { fontFamily: Typography.fontFamily, fontSize: 27, lineHeight: 37, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', marginTop: 3 },
  content: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 28, gap: 16 },
  summaryCard: { position: 'relative', overflow: 'hidden', borderRadius: 25, padding: 20, gap: 9, shadowColor: '#25235F', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  summaryOrb: { position: 'absolute', top: -54, left: -38, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.09)' },
  summaryTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  brain: { width: 41, height: 41, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center' },
  summaryTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 9, paddingVertical: 6 },
  summaryTagText: { color: '#E0E1FF', fontSize: 8, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  summaryTitle: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 23, lineHeight: 33, fontWeight: '800', color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  summaryDesc: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.78)', textAlign: 'right', writingDirection: 'rtl', lineHeight: 21 },
  summaryError: { fontFamily: Typography.fontFamily, color: '#FFD5DC', fontSize: 11, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  summaryActions: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginTop: 7 },
  startButton: { flex: 1, minHeight: 47, borderRadius: 15, backgroundColor: '#FFFFFF', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startText: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '800', color: Palette.primaryDark, writingDirection: 'rtl' },
  disabled: { opacity: .55 },
  time: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  timeText: { fontFamily: Typography.fontFamily, fontSize: 9, color: '#E3E4FF', writingDirection: 'rtl' },
  sectionTitle: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 15, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', marginTop: 6 },
  methodList: { borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, overflow: 'hidden' },
  method: { minHeight: 72, padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: Palette.border },
  methodNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  methodNumText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontWeight: '800', writingDirection: 'rtl' },
  methodText: { flex: 1 },
  methodTitle: { fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  methodDesc: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', marginTop: 3, lineHeight: 18 },
  note: { borderRadius: 16, backgroundColor: Palette.successSoft, borderWidth: 1, borderColor: '#BBF7D0', padding: 14, flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8 },
  noteText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19 },
  finishedCard: { borderRadius: 20, padding: 18, alignItems: 'center', backgroundColor: Palette.successSoft, borderWidth: 1, borderColor: '#BBF7D0' },
  finishedIcon: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCFCE7' },
  finishedTitle: { fontFamily: Typography.fontFamily, fontSize: 18, fontWeight: '800', color: Palette.success, marginTop: 8, textAlign: 'right', writingDirection: 'rtl' },
  finishedDesc: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', marginTop: 4 },
  sessionProgress: { height: 6, backgroundColor: Palette.border },
  sessionProgressFill: { height: '100%', backgroundColor: Palette.primary, alignSelf: 'flex-end' },
  sessionContent: { flexGrow: 1, padding: 18, alignItems: 'center' },
  recallLabel: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', marginVertical: 14 },
  reviewCard: { width: '100%', minHeight: 330, borderRadius: 22, padding: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, shadowColor: '#172033', shadowOpacity: .05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  reviewFa: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 23, lineHeight: 36, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  sayHint: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.muted, marginTop: 18, textAlign: 'right', writingDirection: 'rtl' },
  revealButton: { minHeight: 48, paddingHorizontal: 22, borderRadius: 999, justifyContent: 'center', backgroundColor: Palette.primary, marginTop: 18 },
  revealButtonText: { fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '800', color: '#FFFFFF', writingDirection: 'rtl' },
  answerArea: { width: '100%', alignItems: 'center' },
  answerDivider: { width: '75%', height: 1, backgroundColor: Palette.border, marginVertical: 18 },
  reviewRussian: { alignSelf: 'stretch', fontSize: 23, lineHeight: 34, fontWeight: '700', color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  reviewPronunciation: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primaryDark, textAlign: 'center', writingDirection: 'rtl', marginTop: 7 },
  soundButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, padding: 8, marginTop: 8 },
  soundText: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.primary, writingDirection: 'rtl' },
  vocabChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, flexWrap: 'wrap', borderRadius: 15, backgroundColor: Palette.warningSoft, paddingHorizontal: 10, paddingVertical: 7, marginTop: 8 },
  vocabText: { flexShrink: 1, fontFamily: Typography.fontFamily, fontSize: 10, color: Palette.warning, textAlign: 'center', writingDirection: 'rtl' },
  ratingArea: { width: '100%', marginTop: 18 },
  ratingTitle: { fontFamily: Typography.fontFamily, fontSize: 13, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', marginBottom: 8 },
  ratingGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8 },
  ratingButton: { width: '48%', minHeight: 62, flexGrow: 1, borderRadius: 16, backgroundColor: Palette.surface, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ratingLabel: { fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '800', writingDirection: 'rtl' },
  ratingHint: { fontFamily: Typography.fontFamily, fontSize: 9, color: Palette.muted, marginTop: 3, writingDirection: 'rtl' },
  error: { fontFamily: Typography.fontFamily, color: Palette.danger, backgroundColor: Palette.dangerSoft, padding: 12, borderRadius: 12, textAlign: 'right', writingDirection: 'rtl' },
});
