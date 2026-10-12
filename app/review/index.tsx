import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { Brain, Check, CheckCircle2, Clock3, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { AppBottomNav } from '@/components/AppBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { SENTENCE_LESSONS } from '@/lib/courseContent';
import {
  getCourseProgress,
  getDueReviewCards,
  rateReviewCard,
  type CourseProgress,
  type ReviewRating,
  type SentenceReviewCard,
} from '@/lib/courseProgress';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { toPersianDigits } from '@/lib/format';

import { useEnglishStudyTimer } from '@/components/useEnglishStudyTimer';

const ratingOptions: Array<{ id: ReviewRating; label: string; hint: string; color: string }> = [
  { id: 'again', label: 'فراموش کردم', hint: '۱۰ دقیقه', color: Palette.danger },
  { id: 'hard', label: 'سخت بود', hint: 'فردا', color: Palette.warning },
  { id: 'good', label: 'خوب بود', hint: 'زمان مناسب', color: Palette.primary },
  { id: 'easy', label: 'آسان بود', hint: 'فاصله بیشتر', color: Palette.success },
];

function contentForCard(card: SentenceReviewCard) {
  const lesson = SENTENCE_LESSONS.find((item) => item.id === card.lessonId);
  const sentence = lesson?.sentences.find((item) => item.id === card.sentenceId);
  return lesson && sentence ? { lesson, sentence } : null;
}

export default function ReviewHome() {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCards, setDueCards] = useState<SentenceReviewCard[]>([]);
  const [sessionCards, setSessionCards] = useState<SentenceReviewCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const timer=useEnglishStudyTimer(sessionActive&&!finished);

  const load = useCallback(async () => {
    const [nextProgress, nextCards] = await Promise.all([getCourseProgress(), getDueReviewCards()]);
    setProgress(nextProgress);
    setDueCards(nextCards);
  }, []);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

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
    await rateReviewCard(currentCard.id, rating);
    if (cardIndex + 1 >= sessionCards.length) {
      setSessionActive(false);
      setFinished(true);
      await load();
    } else {
      setCardIndex((value) => value + 1);
      setRevealed(false);
    }
    setSaving(false);
  };

  if (sessionActive && currentContent) {
    const { lesson, sentence } = currentContent;
    const vocabulary = sentence.vocabulary.map((item) => `${item.word} · ${item.meaning}`).join('   ');
    return (
      <View style={styles.root} onTouchStart={timer.interact}>
        {!!timer.error&&<Text style={{ color: Palette.danger, textAlign: 'right', writingDirection: 'rtl' }}>{timer.error}</Text>}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>مرور امروز</Text>
            <Text style={styles.subtitle}>کارت {toPersianDigits(cardIndex + 1)} از {toPersianDigits(sessionCards.length)} · {lesson.title}</Text>
          </View>
          <PageNavigation backFallback="/languages" />
        </View>
      </View>
        <View style={styles.sessionProgress}><View style={[styles.sessionProgressFill, { width: `${((cardIndex + 1) / sessionCards.length) * 100}%` }]} /></View>
        <ScrollView contentContainerStyle={styles.sessionContent}>
          <Text style={styles.recallLabel}>جمله انگلیسی را به یاد بیاورید</Text>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewFa}>{sentence.fa}</Text>
            {!revealed ? (
              <>
                <Text style={styles.sayHint}>پاسخ را با صدای بلند بگویید.</Text>
                <Pressable style={styles.revealButton} onPress={() => setRevealed(true)}>
                  <Text style={styles.revealButtonText}>نمایش پاسخ</Text>
                </Pressable>
              </>
            ) : (
              <View style={styles.answerArea}>
                <View style={styles.answerDivider} />
                <Text style={styles.reviewEn}>{sentence.en}</Text>
                <Text style={[styles.reviewPronunciation,sentence.pronunciation.startsWith('/ ')&&{writingDirection:'ltr'}]}>{sentence.pronunciation}</Text>
                {sentence.pronunciation.startsWith('/ ')&&<Text style={styles.reviewPronunciation}>راهنمای واجی بدون تکیه؛ واژه‌های داخل کروشه آوانویسی نشده‌اند.</Text>}
                <Pressable style={styles.soundButton} onPress={() => Speech.speak(sentence.en, { language: 'en-US', rate: .78 })}>
                  <Volume2 size={18} color={Colors.primary[400]} />
                  <Text style={styles.soundText}>پخش جمله</Text>
                </Pressable>
                {vocabulary ? <View style={styles.vocabChip}><Sparkles size={13} color={Colors.warning[400]} /><Text style={styles.vocabText}>{vocabulary}</Text></View> : null}
              </View>
            )}
          </View>

          {revealed ? (
            <View style={styles.ratingArea}>
              <Text style={styles.ratingTitle}>یادآوری این جمله چطور بود؟</Text>
              <View style={styles.ratingGrid}>
                {ratingOptions.map((option) => (
                  <Pressable key={option.id} disabled={saving} style={[styles.ratingButton, { borderColor: option.color + '55' }]} onPress={() => void rate(option.id)}>
                    {saving ? <ActivityIndicator size="small" color={option.color} /> : <Text style={[styles.ratingLabel, { color: option.color }]}>{option.label}</Text>}
                    <Text style={styles.ratingHint}>{option.hint}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.root} onTouchStart={timer.interact}>
        {!!timer.error&&<Text style={{ color: Palette.danger, textAlign: 'right', writingDirection: 'rtl' }}>{timer.error}</Text>}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <Text style={styles.title}>مرور هوشمند</Text>
            <Text style={styles.subtitle}>فقط جمله‌هایی که زمان مرورشان رسیده است</Text>
          </View>
          <PageNavigation backFallback="/languages" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {finished ? (
          <View style={styles.finishedCard}>
            <View style={styles.finishedIcon}><Check size={32} color={Colors.success[400]} /></View>
            <Text style={styles.finishedTitle}>مرور امروز تمام شد</Text>
            <Text style={styles.finishedDesc}>زمان مرور بعدی هر جمله بر اساس پاسخ شما تنظیم شد.</Text>
          </View>
        ) : null}

        <LinearGradient colors={['#18204B', '#303A80', '#4D48B6']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.summaryCard}>
          <View pointerEvents="none" style={styles.summaryOrb} />
          <View style={styles.summaryTop}>
            <View style={styles.brain}><Brain size={23} color="#D5D7FF" /></View>
            <View style={styles.summaryTag}><RefreshCw size={12} color="#C8CAFF" /><Text style={styles.summaryTagText}>SPACED REVIEW</Text></View>
          </View>
          <Text style={styles.summaryTitle}>{reviewCount ? `${toPersianDigits(reviewCount)} جمله برای مرور` : 'فعلاً مروری ندارید'}</Text>
          <Text style={styles.summaryDesc}>{reviewCount ? 'جمله‌های دشوار زودتر و جمله‌های آسان دیرتر برمی‌گردند.' : progress?.completedLessonIds.length ? 'مرور بعدی در زمان مناسب به‌طور خودکار اینجا ظاهر می‌شود.' : 'پس از پایان اولین درس، جمله‌های آن وارد برنامه مرور می‌شوند.'}</Text>
          <View style={styles.summaryActions}>
            <Pressable style={[styles.startButton, !reviewCount && styles.disabled]} disabled={!reviewCount} onPress={startSession}>
              <RefreshCw size={16} color={Palette.primaryDark} />
              <Text style={styles.startText}>شروع مرور امروز</Text>
            </Pressable>
            {reviewCount ? <View style={styles.time}><Clock3 size={13} color="#D7D9FF" /><Text style={styles.timeText}>حدود {toPersianDigits(Math.max(2, Math.ceil(reviewCount * .6)))} دقیقه</Text></View> : null}
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>مرور چگونه تنظیم می‌شود؟</Text>
        <View style={styles.methodList}>
          <Method num="۱" title="معنی را ببین و جمله را بگو" desc="پیش از دیدن پاسخ، جمله را با صدای بلند به یاد بیاورید." />
          <Method num="۲" title="پاسخ را ببین و بشنو" desc="جمله صحیح را با پاسخ خودتان مقایسه کنید." />
          <Method num="۳" title="میزان سختی را انتخاب کن" desc="برنامه زمان دقیق مرور بعدی را محاسبه می‌کند." />
        </View>

        <View style={styles.note}><CheckCircle2 size={18} color={Colors.success[400]} /><Text style={styles.noteText}>لغات، از جمله واژه‌های ۵۰۴، همیشه همراه جمله اصلی مرور می‌شوند.</Text></View>
      </ScrollView>
      <AppBottomNav />
    </View>
  );
}

function Method({ num, title, desc }: { num: string; title: string; desc: string }) {
  return <View style={styles.method}><View style={styles.methodNum}><Text style={styles.methodNumText}>{num}</Text></View><View style={styles.methodText}><Text style={styles.methodTitle}>{title}</Text><Text style={styles.methodDesc}>{desc}</Text></View></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  header: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingTop: 26, paddingBottom: Spacing.md, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  headerCopy: { flex: 1, alignItems: 'flex-end' },
  title: { fontFamily: Typography.fontFamily, fontSize: 27, lineHeight: 37, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', marginTop: 3 },
  content: { width: '100%', maxWidth: 860, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 28, gap: Spacing.md },
  summaryCard: { position: 'relative', overflow: 'hidden', borderRadius: 25, padding: 20, gap: 9, shadowColor: '#25235F', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  summaryOrb: { position: 'absolute', top: -54, left: -38, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.09)' },
  summaryTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 },
  brain: { width: 41, height: 41, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center' },
  summaryTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 9, paddingVertical: 6 },
  summaryTagText: { color: '#E0E1FF', fontSize: 8, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  summaryTitle: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 23, lineHeight: 33, fontWeight: Typography.weights.bold, color: '#FFFFFF', textAlign: 'right', writingDirection: 'rtl' },
  summaryDesc: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 12, color: 'rgba(255,255,255,0.78)', textAlign: 'right', writingDirection: 'rtl', lineHeight: 21 },
  summaryActions: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginTop: 7 },
  startButton: { flex: 1, minHeight: 47, borderRadius: 15, backgroundColor: '#FFFFFF', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startText: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: Typography.weights.bold, color: Palette.primaryDark, writingDirection: 'rtl' },
  disabled: { opacity: .55 },
  time: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  timeText: { fontFamily: Typography.fontFamily, fontSize: 9, color: '#E3E4FF', writingDirection: 'rtl' },
  sectionTitle: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', marginTop: Spacing.sm },
  methodList: { borderRadius: Radius.xl, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, overflow: 'hidden' },
  method: { minHeight: 72, padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Palette.border },
  methodNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  methodNumText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontWeight: Typography.weights.bold, writingDirection: 'rtl' },
  methodText: { flex: 1 },
  methodTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  methodDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', marginTop: 3 },
  note: { borderRadius: Radius.lg, backgroundColor: Palette.successSoft, borderWidth: 1, borderColor: '#BBF7D0', padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8 },
  noteText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', lineHeight: 19 },
  finishedCard: { borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', backgroundColor: Palette.successSoft, borderWidth: 1, borderColor: '#BBF7D0' },
  finishedIcon: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCFCE7' },
  finishedTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Palette.success, marginTop: Spacing.sm, textAlign: 'right', writingDirection: 'rtl' },
  finishedDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', marginTop: 4 },
  sessionProgress: { height: 6, backgroundColor: Palette.border },
  sessionProgressFill: { height: '100%', backgroundColor: Palette.primary, alignSelf: 'flex-end' },
  sessionContent: { flexGrow: 1, padding: Spacing.lg, alignItems: 'center' },
  recallLabel: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', marginVertical: Spacing.md },
  reviewCard: { width: '100%', minHeight: 330, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, shadowColor: '#172033', shadowOpacity: 0.05, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  reviewFa: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: 23, lineHeight: 36, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  sayHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Palette.muted, marginTop: Spacing.lg, textAlign: 'right', writingDirection: 'rtl' },
  revealButton: { minHeight: 48, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, justifyContent: 'center', backgroundColor: Palette.primary, marginTop: Spacing.lg },
  revealButtonText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.onColor, writingDirection: 'rtl' },
  answerArea: { width: '100%', alignItems: 'center' },
  answerDivider: { width: '75%', height: 1, backgroundColor: Palette.border, marginVertical: Spacing.lg },
  reviewEn: { alignSelf: 'stretch', fontSize: 23, lineHeight: 34, fontWeight: '700', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  reviewPronunciation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.primaryDark, textAlign: 'center', writingDirection: 'rtl', marginTop: 7 },
  soundButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, padding: Spacing.sm, marginTop: Spacing.sm },
  soundText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Palette.primary, writingDirection: 'rtl' },
  vocabChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: Radius.lg, backgroundColor: Palette.warningSoft, paddingHorizontal: 10, paddingVertical: 7, marginTop: Spacing.sm },
  vocabText: { flexShrink: 1, fontFamily: Typography.fontFamily, fontSize: 10, color: Palette.warning, textAlign: 'center', writingDirection: 'rtl' },
  ratingArea: { width: '100%', marginTop: Spacing.lg },
  ratingTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl', marginBottom: Spacing.sm },
  ratingGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: Spacing.sm },
  ratingButton: { width: '48%', minHeight: 62, flexGrow: 1, borderRadius: Radius.lg, backgroundColor: Palette.surface, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ratingLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, writingDirection: 'rtl' },
  ratingHint: { fontFamily: Typography.fontFamily, fontSize: 9, color: Palette.muted, marginTop: 3, writingDirection: 'rtl' },
});
