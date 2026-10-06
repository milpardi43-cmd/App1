import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Brain, Check, CheckCircle2, Clock3, RefreshCw, Sparkles, Volume2 } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import { AppBottomNav } from '@/components/AppBottomNav';
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
import { toPersianDigits } from '@/lib/format';

const ratingOptions: Array<{ id: ReviewRating; label: string; hint: string; color: string }> = [
  { id: 'again', label: 'فراموش کردم', hint: '۱۰ دقیقه', color: Colors.error[400] },
  { id: 'hard', label: 'سخت بود', hint: 'فردا', color: Colors.warning[400] },
  { id: 'good', label: 'خوب بود', hint: 'زمان مناسب', color: Colors.primary[400] },
  { id: 'easy', label: 'آسان بود', hint: 'فاصله بیشتر', color: Colors.success[400] },
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
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.title}>مرور امروز</Text>
          <Text style={styles.subtitle}>کارت {toPersianDigits(cardIndex + 1)} از {toPersianDigits(sessionCards.length)} · {lesson.title}</Text>
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
                <Text style={styles.reviewPronunciation}>{sentence.pronunciation}</Text>
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
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>مرور هوشمند</Text>
        <Text style={styles.subtitle}>فقط جمله‌هایی که زمان مرورشان رسیده است</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {finished ? (
          <View style={styles.finishedCard}>
            <View style={styles.finishedIcon}><Check size={32} color={Colors.success[400]} /></View>
            <Text style={styles.finishedTitle}>مرور امروز تمام شد</Text>
            <Text style={styles.finishedDesc}>زمان مرور بعدی هر جمله بر اساس پاسخ شما تنظیم شد.</Text>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <View style={styles.brain}><Brain size={34} color={Colors.accent[400]} /></View>
          <Text style={styles.summaryTitle}>{reviewCount ? `${toPersianDigits(reviewCount)} جمله برای مرور` : 'فعلاً مروری ندارید'}</Text>
          <Text style={styles.summaryDesc}>{reviewCount ? 'جمله‌های دشوار زودتر و جمله‌های آسان دیرتر برمی‌گردند.' : progress?.completedLessonIds.length ? 'مرور بعدی در زمان مناسب به‌طور خودکار اینجا ظاهر می‌شود.' : 'پس از پایان اولین درس، جمله‌های آن وارد برنامه مرور می‌شوند.'}</Text>
          <Pressable style={[styles.startButton, !reviewCount && styles.disabled]} disabled={!reviewCount} onPress={startSession}>
            <RefreshCw size={18} color={Colors.onColor} />
            <Text style={styles.startText}>شروع مرور امروز</Text>
          </Pressable>
          {reviewCount ? <View style={styles.time}><Clock3 size={13} color={Colors.neutral[500]} /><Text style={styles.timeText}>حدود {toPersianDigits(Math.max(2, Math.ceil(reviewCount * .6)))} دقیقه</Text></View> : null}
        </View>

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
  root: { flex: 1, backgroundColor: Colors.neutral[950] },
  header: { paddingTop: 56, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.lg, backgroundColor: Colors.neutral[900], borderBottomWidth: 1, borderBottomColor: Colors.neutral[800] },
  title: { fontFamily: Typography.fontFamily, fontSize: 26, fontWeight: Typography.weights.bold, color: Colors.neutral[0], textAlign: 'right' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[400], textAlign: 'right', marginTop: 3 },
  content: { padding: Spacing.md, paddingBottom: 28, gap: Spacing.md },
  summaryCard: { borderRadius: Radius.xl, padding: Spacing.xl, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.accent[500] + '40', alignItems: 'center' },
  brain: { width: 74, height: 74, borderRadius: 37, backgroundColor: Colors.accent[500] + '15', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  summaryTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'center' },
  summaryDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[500], textAlign: 'center', lineHeight: 22, marginTop: 6 },
  startButton: { width: '100%', minHeight: 50, borderRadius: Radius.lg, marginTop: Spacing.lg, backgroundColor: Colors.accent[500], flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  startText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.onColor },
  disabled: { opacity: .4 },
  time: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: 9 },
  timeText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.neutral[500] },
  sectionTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[200], textAlign: 'right', marginTop: Spacing.sm },
  methodList: { borderRadius: Radius.xl, backgroundColor: Colors.neutral[900], borderWidth: 1, borderColor: Colors.neutral[800], overflow: 'hidden' },
  method: { minHeight: 72, padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.neutral[850] },
  methodNum: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary[500] + '15', alignItems: 'center', justifyContent: 'center' },
  methodNumText: { fontFamily: Typography.fontFamily, color: Colors.primary[300], fontWeight: Typography.weights.bold },
  methodText: { flex: 1 },
  methodTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.neutral[200], textAlign: 'right' },
  methodDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[600], textAlign: 'right', marginTop: 3 },
  note: { borderRadius: Radius.lg, backgroundColor: Colors.success[500] + '0D', padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8 },
  noteText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', lineHeight: 19 },
  finishedCard: { borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', backgroundColor: Colors.success[500] + '0D', borderWidth: 1, borderColor: Colors.success[500] + '30' },
  finishedIcon: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.success[500] + '15' },
  finishedTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.success[300], marginTop: Spacing.sm },
  finishedDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'center', marginTop: 4 },
  sessionProgress: { height: 4, backgroundColor: Colors.neutral[800] },
  sessionProgressFill: { height: '100%', backgroundColor: Colors.accent[500], alignSelf: 'flex-end' },
  sessionContent: { flexGrow: 1, padding: Spacing.lg, alignItems: 'center' },
  recallLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[500], marginVertical: Spacing.md },
  reviewCard: { width: '100%', minHeight: 330, borderRadius: Radius.xl, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800] },
  reviewFa: { fontFamily: Typography.fontFamily, fontSize: 23, lineHeight: 36, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'center' },
  sayHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], marginTop: Spacing.lg },
  revealButton: { minHeight: 48, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, justifyContent: 'center', backgroundColor: Colors.accent[500], marginTop: Spacing.lg },
  revealButtonText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.onColor },
  answerArea: { width: '100%', alignItems: 'center' },
  answerDivider: { width: '75%', height: 1, backgroundColor: Colors.neutral[700], marginVertical: Spacing.lg },
  reviewEn: { fontSize: 23, lineHeight: 34, fontWeight: '700', color: Colors.neutral[50], textAlign: 'center' },
  reviewPronunciation: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.primary[300], textAlign: 'center', marginTop: 7 },
  soundButton: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, padding: Spacing.sm, marginTop: Spacing.sm },
  soundText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.primary[400] },
  vocabChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: Radius.lg, backgroundColor: Colors.warning[500] + '0F', paddingHorizontal: 10, paddingVertical: 7, marginTop: Spacing.sm },
  vocabText: { flexShrink: 1, fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.warning[300], textAlign: 'center' },
  ratingArea: { width: '100%', marginTop: Spacing.lg },
  ratingTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[400], textAlign: 'center', marginBottom: Spacing.sm },
  ratingGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: Spacing.sm },
  ratingButton: { width: '48%', minHeight: 62, flexGrow: 1, borderRadius: Radius.lg, backgroundColor: Colors.neutral[850], borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  ratingLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold },
  ratingHint: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.neutral[500], marginTop: 3 },
});
