// Flashcard screen — flip through one lesson's words with pronunciation.

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, RotateCw, ArrowRight, ChevronLeft, ChevronRight, ClipboardList } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';
import { getLesson } from '@/lib/langContent';
import { recordReview } from '@/lib/langProgress';
import { AgentTopBar, LESSON_ICONS, ProgressBar, SpeakButton } from '@/components/LangShared';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = Math.max(1, Math.min(12, parseInt(String(params.lessonId ?? '1'), 10) || 1));
  const lesson = getLesson(lessonId);
  const total = lesson.words.length;

  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const word = lesson.words[Math.min(index, total - 1)];
  const Icon = LESSON_ICONS[lesson.icon];

  const progress = useMemo(() => (index + (finished ? 1 : 0)) / total, [index, finished, total]);

  const answer = useCallback(
    async (knew: boolean) => {
      await recordReview(lessonId, index, knew);
      if (knew) setXpEarned((x) => x + 10);
      else setXpEarned((x) => x + 2);
      setFlipped(false);
      if (index + 1 >= total) {
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [index, lessonId, total],
  );

  // Reset every time a new lesson id arrives
  useEffect(() => {
    setIndex(0);
    setFlipped(false);
    setFinished(false);
    setXpEarned(0);
  }, [lessonId]);

  if (finished) {
    return (
      <View style={styles.root}>
        <AgentTopBar title={`درس ${toPersianDigits(lessonId)}`} subtitle={lesson.title} alignRight backFallback="/lang" />
        <View style={styles.finishWrap}>
          <LinearGradient colors={lesson.gradient} style={styles.finishBadge}>
            <Check size={36} color={Colors.onColor} strokeWidth={2.5} />
          </LinearGradient>
          <Text style={styles.finishTitle}>درس تمام شد! 🎉</Text>
          <Text style={styles.finishSub}>
            {toPersianDigits(total)} واژه را مرور کردی و {toPersianDigits(xpEarned)} امتیاز گرفتی
          </Text>

          <Pressable
            style={[styles.finishBtn, { backgroundColor: lesson.color }]}
            onPress={() => router.push({ pathname: '/lang/quiz', params: { lessonId: String(lessonId) } } as never)}
          >
            <ClipboardList size={18} color={Colors.onColor} strokeWidth={2.3} />
            <Text style={styles.finishBtnText}>آزمون این درس</Text>
          </Pressable>

          <Pressable style={[styles.finishBtn, { backgroundColor: Colors.neutral[800] }]} onPress={() => router.back()}>
            <ArrowRight size={18} color={Colors.neutral[200]} strokeWidth={2.3} />
            <Text style={[styles.finishBtnText, { color: Colors.neutral[100] }]}>بازگشت به خانه</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <AgentTopBar title={`درس ${toPersianDigits(lessonId)} — ${lesson.title}`} subtitle={lesson.subtitle} alignRight backFallback="/lang" />

      <View style={styles.progressRow}>
        <View style={styles.progressIconWrap}>
          {Icon ? <Icon size={16} color={lesson.color} strokeWidth={2.3} /> : null}
          <Text style={[styles.progressText, { color: lesson.color }]}>
            {toPersianDigits(index + 1)} از {toPersianDigits(total)}
          </Text>
        </View>
        <View style={styles.progressBarWrap}>
          <ProgressBar value={progress} color={lesson.color} />
        </View>
      </View>

      {/* Flashcard */}
      <Pressable style={styles.cardWrap} onPress={() => setFlipped((f) => !f)}>
        <View style={styles.card}>
          {!flipped ? (
            <>
              <Text style={styles.cardHint}>برای دیدن معنی روی کارت بزنید 👇</Text>
              <Text style={styles.cardWord}>{word.en}</Text>
              <View style={styles.cardSpeakRow}>
                <SpeakButton text={word.en} color={lesson.color} size={56} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cardBackWord}>{word.en}</Text>
              <Text style={styles.cardMeaning}>{word.fa}</Text>
              <View style={styles.cardExampleBox}>
                <Text style={styles.cardExampleEn}>{word.ex}</Text>
                <Text style={styles.cardExampleFa}>{word.exFa}</Text>
              </View>
              <View style={styles.cardSpeakRow}>
                <SpeakButton text={word.ex} color={lesson.color} size={48} />
              </View>
            </>
          )}
        </View>
      </Pressable>

      {/* Answer buttons */}
      {flipped ? (
        <View style={styles.answerRow}>
          <Pressable style={[styles.answerBtn, styles.answerAgain]} onPress={() => answer(false)}>
            <RotateCw size={18} color={Colors.error[400]} strokeWidth={2.4} />
            <Text style={[styles.answerBtnText, { color: Colors.error[400] }]}>نمی‌دانستم</Text>
          </Pressable>
          <Pressable style={[styles.answerBtn, styles.answerKnew]} onPress={() => answer(true)}>
            <Check size={18} color={Palette.success} strokeWidth={2.6} />
            <Text style={[styles.answerBtnText, { color: Palette.success }]}>بلد بودم</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.navRow}>
          <Pressable
            style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
            disabled={index === 0}
            onPress={() => {
              setIndex((i) => Math.max(0, i - 1));
              setFlipped(false);
            }}
          >
            <ChevronRight size={20} color={index === 0 ? Colors.neutral[600] : Colors.neutral[200]} strokeWidth={2.4} />
            <Text style={styles.navBtnText}>قبلی</Text>
          </Pressable>
          <Pressable style={styles.navBtn} onPress={() => setFlipped(true)}>
            <Text style={[styles.navBtnText, { color: Palette.primary }]}>نمایش معنی</Text>
            <ChevronLeft size={20} color={Palette.primary} strokeWidth={2.4} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  progressRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },
  progressIconWrap: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  progressText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, textAlign: 'right', writingDirection: 'rtl' },
  progressBarWrap: { flex: 1 },
  cardWrap: { flex: 1, padding: Spacing.lg },
  card: {
    flex: 1, borderRadius: Radius.xl, borderWidth: 1, borderColor: Palette.border,
    backgroundColor: Palette.surface, padding: Spacing.xl, alignItems: 'center', justifyContent: 'center', gap: Spacing.lg,
    shadowColor: '#172033', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2,
  },
  cardHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl', alignSelf: 'stretch' },
  cardWord: { alignSelf: 'stretch', width: '100%', fontFamily: Typography.fontFamily, fontSize: 52, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  cardSpeakRow: { marginTop: Spacing.sm },
  cardBackWord: { alignSelf: 'stretch', width: '100%', fontFamily: Typography.fontFamily, fontSize: 30, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  cardMeaning: { width: '100%', fontFamily: Typography.fontFamily, fontSize: 26, lineHeight: 36, fontWeight: Typography.weights.bold, color: Palette.primary, textAlign: 'right', writingDirection: 'rtl' },
  cardExampleBox: { backgroundColor: Palette.surfaceMuted, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.border, padding: Spacing.md, gap: 7, alignSelf: 'stretch', marginTop: Spacing.sm },
  cardExampleEn: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, lineHeight: 23, color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  cardExampleFa: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  answerRow: { flexDirection: 'row-reverse', gap: Spacing.md, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl + 20 },
  answerBtn: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md, borderRadius: Radius.lg, borderWidth: 1.5 },
  answerAgain: { backgroundColor: Palette.dangerSoft, borderColor: '#FECACA' },
  answerKnew: { backgroundColor: Palette.successSoft, borderColor: '#BBF7D0' },
  answerBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, writingDirection: 'rtl', textAlign: 'center' },
  navRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl + 20 },
  navBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, backgroundColor: Palette.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Palette.border },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Palette.text, fontWeight: Typography.weights.medium, writingDirection: 'rtl' },
  finishWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, margin: Spacing.lg, gap: Spacing.lg, backgroundColor: Palette.surface, borderRadius: Radius.xl, borderWidth: 1, borderColor: Palette.border, shadowColor: '#172033', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  finishBadge: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' },
  finishTitle: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xxl, fontWeight: Typography.weights.bold, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  finishSub: { alignSelf: 'stretch', fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, color: Palette.text, textAlign: 'right', writingDirection: 'rtl', lineHeight: 24 },
  finishBtn: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg, alignSelf: 'stretch' },
  finishBtnText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.onColor, writingDirection: 'rtl', textAlign: 'center' },
});
