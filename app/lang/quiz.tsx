// Multiple-choice quiz screen — auto-generated from the lesson's words.

import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trophy, ArrowRight, RotateCcw, Star } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';
import { getLesson, type LangWord } from '@/lib/langContent';
import { recordQuizAnswer } from '@/lib/langProgress';
import { AgentTopBar, ProgressBar } from '@/components/LangShared';

const QUESTION_COUNT = 8;

interface Question {
  word: LangWord;
  wordIndex: number;
  options: LangWord[];
}

function buildQuestions(lessonId: number): Question[] {
  const lesson = getLesson(lessonId);
  const pool = lesson.words.map((word, i) => ({ word, i }));
  // shuffle
  for (let k = pool.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [pool[k], pool[j]] = [pool[j], pool[k]];
  }
  const pick = pool.slice(0, Math.min(QUESTION_COUNT, pool.length));

  return pick.map(({ word, i }) => {
    const others = lesson.words.filter((w) => w.en !== word.en);
    const shuffled = [...others];
    for (let k = shuffled.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [shuffled[k], shuffled[j]] = [shuffled[j], shuffled[k]];
    }
    const options = [word, ...shuffled.slice(0, 3)];
    for (let k = options.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [options[k], options[j]] = [options[j], options[k]];
    }
    return { word, wordIndex: i, options };
  });
}

export default function QuizScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = Math.max(1, Math.min(12, parseInt(String(params.lessonId ?? '1'), 10) || 1));
  const lesson = getLesson(lessonId);

  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(lessonId));
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setQuestions(buildQuestions(lessonId));
    setQi(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  }, [lessonId]);

  const question = questions[qi];
  const total = questions.length;

  const pick = async (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = question.options[idx].en === question.word.en;
    if (correct) setCorrectCount((c) => c + 1);
    await recordQuizAnswer(lessonId, question.wordIndex, correct);
  };

  const next = () => {
    if (qi + 1 >= total) {
      setFinished(true);
    } else {
      setQi((i) => i + 1);
      setSelected(null);
    }
  };

  const xp = correctCount * 10;
  const stars = correctCount >= total * 0.9 ? 3 : correctCount >= total * 0.6 ? 2 : correctCount >= total * 0.3 ? 1 : 0;

  if (finished) {
    return (
      <View style={styles.root}>
        <AgentTopBar title={`آزمون درس ${toPersianDigits(lessonId)}`} subtitle={lesson.title} />
        <View style={styles.finishWrap}>
          <LinearGradient colors={lesson.gradient} style={styles.trophyBadge}>
            <Trophy size={40} color={Colors.onColor} strokeWidth={2.2} />
          </LinearGradient>

          <View style={styles.starRow}>
            {[0, 1, 2].map((i) => (
              <Star
                key={i}
                size={34}
                color={i < stars ? Colors.warning[400] : Colors.neutral[700]}
                strokeWidth={1.8}
                fill={i < stars ? Colors.warning[400] : 'transparent'}
              />
            ))}
          </View>

          <Text style={styles.finishTitle}>آزمون تمام شد!</Text>
          <Text style={styles.finishScore}>
            {toPersianDigits(correctCount)} از {toPersianDigits(total)} پاسخ درست
          </Text>
          <Text style={styles.finishXp}>+{toPersianDigits(xp)} امتیاز</Text>

          <Pressable
            style={[styles.finishBtn, { backgroundColor: lesson.color }]}
            onPress={() => {
              setQuestions(buildQuestions(lessonId));
              setQi(0);
              setSelected(null);
              setCorrectCount(0);
              setFinished(false);
            }}
          >
            <RotateCcw size={18} color={Colors.onColor} strokeWidth={2.3} />
            <Text style={styles.finishBtnText}>تلاش دوباره</Text>
          </Pressable>

          <Pressable style={[styles.finishBtn, { backgroundColor: Colors.neutral[800] }]} onPress={() => router.back()}>
            <ArrowRight size={18} color={Colors.neutral[200]} strokeWidth={2.3} />
            <Text style={[styles.finishBtnText, { color: Colors.neutral[100] }]}>بازگشت</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!question) return <View style={styles.root} />;

  return (
    <View style={styles.root}>
      <AgentTopBar title={`آزمون درس ${toPersianDigits(lessonId)}`} subtitle={`سؤال ${toPersianDigits(qi + 1)} از ${toPersianDigits(total)}`} />

      <View style={styles.progressWrap}>
        <ProgressBar value={(qi + (selected !== null ? 1 : 0)) / total} color={lesson.color} />
      </View>

      <View style={styles.qWrap}>
        <Text style={styles.qLabel}>معنی این واژه چیست؟</Text>
        <Text style={styles.qWord}>{question.word.en}</Text>

        <View style={styles.optionsWrap}>
          {question.options.map((opt, idx) => {
            const isCorrect = opt.en === question.word.en;
            const isSelected = selected === idx;
            const showResult = selected !== null;
            const optionStyle = [
              styles.option,
              showResult && isCorrect && styles.optionCorrect,
              showResult && isSelected && !isCorrect && styles.optionWrong,
            ];
            const optionTextStyle = [
              styles.optionText,
              showResult && isCorrect && { color: Colors.success[500] },
              showResult && isSelected && !isCorrect && { color: Colors.error[400] },
            ];
            return (
              <Pressable key={idx} style={optionStyle} onPress={() => pick(idx)} disabled={selected !== null}>
                <Text style={styles.optionBadge}>{toPersianDigits(idx + 1)}</Text>
                <Text style={optionTextStyle}>{opt.fa}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected !== null && (
          <Pressable style={[styles.nextBtn, { backgroundColor: lesson.color }]} onPress={next}>
            <Text style={styles.nextBtnText}>{qi + 1 >= total ? 'نمایش نتیجه' : 'سؤال بعدی'}</Text>
            <ArrowRight size={18} color={Colors.onColor} strokeWidth={2.4} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950], direction: 'rtl' },

  progressWrap: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },

  qWrap: { flex: 1, padding: Spacing.xl, gap: Spacing.lg },
  qLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    color: Colors.neutral[300],
    textAlign: 'center',
  },
  qWord: {
    fontFamily: Typography.fontFamily,
    fontSize: 44,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'center',
  },

  optionsWrap: { gap: Spacing.sm, marginTop: Spacing.md },
  option: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.neutral[850],
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.neutral[800],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  optionCorrect: { backgroundColor: Colors.success[500] + '12', borderColor: Colors.success[500] },
  optionWrong: { backgroundColor: Colors.error[500] + '12', borderColor: Colors.error[500] },
  optionBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.neutral[900],
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[300],
    lineHeight: 30,
  },
  optionText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    color: Colors.neutral[100],
    textAlign: 'right',
  },

  nextBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
  },
  nextBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
  },

  finishWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.lg,
  },
  trophyBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starRow: { flexDirection: 'row-reverse', gap: 8 },
  finishTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'center',
  },
  finishScore: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.lg,
    color: Colors.neutral[200],
    textAlign: 'center',
  },
  finishXp: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.success[500],
    textAlign: 'center',
  },
  finishBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignSelf: 'stretch',
  },
  finishBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
  },
});
