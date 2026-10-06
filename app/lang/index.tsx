import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpenCheck,
  Check,
  ChevronLeft,
  Clock3,
  Flame,
  Lock,
  MessageCircle,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { AppBottomNav } from '@/components/AppBottomNav';
import { COURSE_LEVELS, SENTENCE_LESSONS } from '@/lib/courseContent';
import { getCourseProgress, type CourseProgress } from '@/lib/courseProgress';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';

export default function LearningHome() {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      void getCourseProgress().then(setProgress);
    }, []),
  );

  const currentLesson =
    SENTENCE_LESSONS.find((lesson) => lesson.id === progress?.currentLessonId) ?? SENTENCE_LESSONS[0];
  const completed = progress?.completedLessonIds.length ?? 0;
  const currentLevel = COURSE_LEVELS.find((level) => level.id === currentLesson.levelId) ?? COURSE_LEVELS[0];
  const dailyPct = Math.min(1, (progress?.todayMinutes ?? 0) / (progress?.dailyGoalMinutes ?? 10));

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>English Journey</Text>
          <Text style={styles.headerSubtitle}>هر روز چند جمله واقعی</Text>
        </View>
        <Pressable style={styles.connectionChip} onPress={() => router.push('/agent' as never)}>
          <View style={styles.connectionDot} />
          <Text style={styles.connectionText}>متصل</Text>
          <ShieldCheck size={14} color={Colors.success[400]} strokeWidth={2.2} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.continueCard}
        >
          <View style={styles.continueTop}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>LEVEL {currentLevel.id} · {currentLevel.title.toUpperCase()}</Text>
            </View>
            <View style={styles.timeChip}>
              <Clock3 size={13} color="rgba(255,255,255,.9)" />
              <Text style={styles.timeText}>{toPersianDigits(currentLesson.durationMinutes)} دقیقه</Text>
            </View>
          </View>
          <Text style={styles.continueEyebrow}>درس بعدی</Text>
          <Text style={styles.continueTitle}>{currentLesson.title}</Text>
          <Text style={styles.continueDesc}>{currentLesson.subtitle}</Text>
          <Pressable
            style={styles.continueButton}
            onPress={() => router.push({ pathname: '/course/lesson', params: { id: currentLesson.id } } as never)}
          >
            <Play size={18} color="#4f46e5" fill="#4f46e5" />
            <Text style={styles.continueButtonText}>{completed ? 'ادامه یادگیری' : 'شروع اولین درس'}</Text>
            <ArrowLeft size={18} color="#4f46e5" />
          </Pressable>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>برنامه امروز</Text>
          <Text style={styles.sectionMeta}>{toPersianDigits(progress?.todayMinutes ?? 0)} از {toPersianDigits(progress?.dailyGoalMinutes ?? 10)} دقیقه</Text>
        </View>
        <View style={styles.dailyCard}>
          <View style={styles.goalRing}>
            <Flame size={23} color={Colors.warning[400]} strokeWidth={2.3} />
          </View>
          <View style={styles.dailyText}>
            <Text style={styles.dailyTitle}>{progress?.currentStreak ? `زنجیره ${toPersianDigits(progress.currentStreak)} روزه` : 'هدف کوتاه و قابل انجام'}</Text>
            <Text style={styles.dailyDesc}>{progress?.currentStreak ? `بهترین رکورد: ${toPersianDigits(progress.longestStreak)} روز` : 'یک درس جمله‌محور و یک مرور سریع'}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(5, dailyPct * 100)}%` }]} />
            </View>
          </View>
        </View>

        <View style={styles.quickRow}>
          <Pressable style={styles.quickCard} onPress={() => router.push('/conversations' as never)}>
            <View style={[styles.quickIcon, { backgroundColor: Colors.primary[500] + '18' }]}>
              <MessageCircle size={22} color={Colors.primary[400]} />
            </View>
            <Text style={styles.quickTitle}>مکالمه</Text>
            <Text style={styles.quickDesc}>با Emma یا یک دوست واقعی</Text>
          </Pressable>
          <Pressable style={styles.quickCard} onPress={() => router.push('/review' as never)}>
            <View style={[styles.quickIcon, { backgroundColor: Colors.success[500] + '18' }]}>
              <RefreshCw size={22} color={Colors.success[400]} />
            </View>
            <Text style={styles.quickTitle}>مرور امروز</Text>
            <Text style={styles.quickDesc}>جمله‌ها و لغات نیازمند تمرین</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>مسیر یادگیری</Text>
          <Text style={styles.sectionMeta}>فعلاً فقط قدم بعدی مهم است</Text>
        </View>
        <View style={styles.levelList}>
          {COURSE_LEVELS.map((level) => {
            const active = level.id === currentLevel.id;
            const passed = level.id < currentLevel.id;
            return (
              <View key={level.id} style={[styles.levelCard, active && styles.levelCardActive]}>
                <View style={[styles.levelNumber, { backgroundColor: level.color + '22' }]}>
                  {passed ? (
                    <Check size={20} color={level.color} strokeWidth={2.5} />
                  ) : active ? (
                    <BookOpenCheck size={20} color={level.color} />
                  ) : (
                    <Lock size={17} color={Colors.neutral[600]} />
                  )}
                </View>
                <View style={styles.levelText}>
                  <View style={styles.levelTitleRow}>
                    <Text style={[styles.levelTitle, !active && styles.muted]}>{level.title}</Text>
                    <Text style={[styles.cefr, { color: active ? level.color : Colors.neutral[600] }]}>{level.cefr}</Text>
                  </View>
                  <Text style={[styles.levelDesc, !active && styles.muted]} numberOfLines={1}>{level.description}</Text>
                </View>
                {active ? <ChevronLeft size={19} color={Colors.neutral[400]} /> : null}
              </View>
            );
          })}
        </View>

        <View style={styles.tipCard}>
          <Sparkles size={18} color={Colors.accent[400]} />
          <Text style={styles.tipText}>لغات را جدا حفظ نمی‌کنیم؛ هر لغت را داخل جمله و موقعیت واقعی یاد می‌گیرید.</Text>
          <Volume2 size={17} color={Colors.neutral[600]} />
        </View>
      </ScrollView>

      <AppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950] },
  header: {
    paddingTop: 54,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.neutral[900],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.neutral[0], textAlign: 'right' },
  headerSubtitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[400], textAlign: 'right', marginTop: 2 },
  connectionChip: { minHeight: 34, paddingHorizontal: 10, borderRadius: Radius.full, backgroundColor: Colors.success[500] + '10', borderWidth: 1, borderColor: Colors.success[500] + '35', flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  connectionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success[500] },
  connectionText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.success[400] },
  content: { padding: Spacing.md, paddingBottom: 30, gap: Spacing.md },
  continueCard: { borderRadius: Radius.xl, padding: Spacing.lg, overflow: 'hidden' },
  continueTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  levelBadge: { backgroundColor: 'rgba(255,255,255,.16)', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
  levelBadgeText: { fontSize: 10, color: '#fff', fontWeight: '700', letterSpacing: .5 },
  timeChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  timeText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,.9)' },
  continueEyebrow: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: 'rgba(255,255,255,.7)', textAlign: 'right' },
  continueTitle: { fontFamily: Typography.fontFamily, fontSize: 28, fontWeight: Typography.weights.bold, color: '#fff', textAlign: 'right', marginTop: 2 },
  continueDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: 'rgba(255,255,255,.82)', textAlign: 'right', marginTop: 4 },
  continueButton: { marginTop: Spacing.lg, minHeight: 50, borderRadius: Radius.lg, backgroundColor: '#fff', paddingHorizontal: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 9 },
  continueButtonText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: '#4f46e5', flex: 1, textAlign: 'center' },
  sectionHeader: { marginTop: Spacing.sm, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.neutral[100] },
  sectionMeta: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500] },
  dailyCard: { backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md },
  goalRing: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.warning[500] + '15', alignItems: 'center', justifyContent: 'center' },
  dailyText: { flex: 1 },
  dailyTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  dailyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', marginTop: 2 },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: Colors.neutral[700], marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.warning[500], alignSelf: 'flex-end' },
  quickRow: { flexDirection: 'row-reverse', gap: Spacing.sm },
  quickCard: { flex: 1, minHeight: 130, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], borderRadius: Radius.xl, padding: Spacing.md },
  quickIcon: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  quickTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  quickDesc: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.neutral[500], textAlign: 'right', lineHeight: 18, marginTop: 3 },
  levelList: { gap: Spacing.sm },
  levelCard: { minHeight: 72, borderRadius: Radius.lg, backgroundColor: Colors.neutral[900], borderWidth: 1, borderColor: Colors.neutral[850], padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md, opacity: .72 },
  levelCardActive: { backgroundColor: Colors.neutral[850], borderColor: Colors.primary[500] + '55', opacity: 1 },
  levelNumber: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  levelText: { flex: 1 },
  levelTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  levelTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[100] },
  cefr: { fontSize: 10, fontWeight: '700' },
  levelDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', marginTop: 3 },
  muted: { color: Colors.neutral[600] },
  tipCard: { borderRadius: Radius.lg, padding: Spacing.md, backgroundColor: Colors.accent[500] + '0C', flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  tipText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[400], textAlign: 'right', lineHeight: 19 },
});
