import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, BookOpenCheck, Check, ChevronDown, ChevronLeft, ChevronUp, Compass, Flame, MessageCircle, Play, RefreshCw, ShieldCheck, Sparkles, Volume2 } from 'lucide-react-native';
import { EnglishLevelRail, EnglishProgressTrack, displayEnglishModuleLabel, ENGLISH_LEVEL_GRADIENTS } from '@/components/EnglishUI';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { RussianBottomNav } from '@/components/RussianBottomNav';
import { RUSSIAN_LEVELS, RUSSIAN_LESSONS, russianProgress, type RussianLevelId } from '@/lib/languages/russian';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

export default function RussianHome() {
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([russianProgress.getCourseProgress(), russianProgress.getDueReviewCards()])
      .then(([nextProgress, cards]) => {
        if (!alive) return;
        setProgress(nextProgress);
        setDueCount(cards.length);
        setError('');
      })
      .catch(() => { if (alive) setError('پیشرفت روسی خوانده نشد؛ اطلاعات قبلی تغییر نکرده است. دوباره تلاش کنید.'); });
    return () => { alive = false; };
  }, [retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const nextLesson = RUSSIAN_LESSONS.find(lesson => !completedSet.has(lesson.id));
  const heroLesson = nextLesson ?? RUSSIAN_LESSONS[RUSSIAN_LESSONS.length - 1];
  const activeLevel = RUSSIAN_LEVELS.find(level => level.id === (nextLesson?.levelId ?? heroLesson.levelId)) ?? RUSSIAN_LEVELS[0];
  const completedCount = RUSSIAN_LESSONS.filter(lesson => completedSet.has(lesson.id)).length;
  const levelLessons = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === activeLevel.id);
  const levelCompleted = levelLessons.filter(lesson => completedSet.has(lesson.id)).length;
  const sentenceCount = RUSSIAN_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const uniqueWords = new Set(RUSSIAN_LESSONS.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word)))).size;
  const firstSentence = heroLesson.sentences[0];
  const levelCounts = {} as Partial<Record<RussianLevelId, { completed: number; total: number }>>;
  RUSSIAN_LEVELS.forEach(level => {
    const lessons = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === level.id);
    levelCounts[level.id] = { completed: lessons.filter(lesson => completedSet.has(lesson.id)).length, total: lessons.length };
  });

  const openLevel = (levelId: RussianLevelId) => router.push(`/learn/ru/library?level=${levelId}` as never);
  const openNextLesson = () => {
    if (nextLesson) router.push(`/learn/ru/lesson?id=${encodeURIComponent(nextLesson.id)}` as never);
    else openLevel(2);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={['#6154E8', '#302A84']} style={styles.brandMark}><BookOpenCheck size={20} color="#FFFFFF" strokeWidth={2.2} /></LinearGradient>
              <View>
                <Text style={styles.brandEyebrow}>LEARN IN CONTEXT</Text>
                <Text style={styles.headerTitle}>Russian Journey</Text>
              </View>
            </View>
            <View style={styles.headerChip}><ShieldCheck size={15} color={Palette.teal} /><Text style={styles.headerChipText}>مسیر جمله‌محور</Text></View>
          </View>

          <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[activeLevel.id]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.heroCard}>
            <View pointerEvents="none" style={styles.heroOrbLarge} />
            <View pointerEvents="none" style={styles.heroOrbSmall} />
            <View style={styles.heroTopRow}>
              <View style={styles.heroLevelBadge}><View style={styles.heroBadgeDot} /><Text style={styles.heroLevelText}>LEVEL {activeLevel.id} · {activeLevel.title.toUpperCase()}</Text></View>
              <Text style={styles.heroCourseLabel}>CORE PATH</Text>
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>{nextLesson ? 'درس بعدی شما' : 'مسیر آغازین'}</Text>
              <Text style={styles.heroTitle}>{nextLesson ? heroLesson.title : 'مسیر آغازین تکمیل شد'}</Text>
              <Text style={styles.heroDescription}>{nextLesson ? heroLesson.subtitle : 'درس‌های موجود را مرور کنید یا نقشهٔ سطح‌های بعدی را ببینید.'}</Text>
            </View>
            <View style={styles.sentenceShowcase}>
              <View style={styles.sentenceShowcaseTop}>
                <View style={styles.sentenceLabelIcon}><Volume2 size={14} color="#C8C9FF" /></View>
                <Text style={styles.sentenceLabel}>جملهٔ کلیدی این درس</Text>
                <Text style={styles.sentenceLabelEn}>CORE SENTENCE</Text>
              </View>
              <Text style={styles.sentenceRussian}>{firstSentence.text}</Text>
              <Text style={styles.sentencePersian}>{firstSentence.fa}</Text>
              <Text style={styles.sentencePronunciation}>{firstSentence.pronunciation}</Text>
              {!!firstSentence.vocabulary.length && <View style={styles.wordChipRow}>{firstSentence.vocabulary.map(item => <View key={item.word} style={styles.wordChip}><Text style={styles.wordChipRussian}>{item.word}</Text><Text style={styles.wordChipDivider}>·</Text><Text style={styles.wordChipFa}>{item.meaning}</Text></View>)}</View>}
            </View>
            <View style={styles.heroActions}>
              <Pressable accessibilityRole="button" style={styles.continueButton} onPress={openNextLesson}>
                <Play size={16} color={Palette.primaryDark} fill={Palette.primaryDark} />
                <Text style={styles.continueButtonText}>{nextLesson ? completedCount ? 'ادامه یادگیری' : 'شروع از پایه' : 'مشاهدهٔ سطح‌های بعدی'}</Text>
                <ChevronLeft size={17} color={Palette.primaryDark} />
              </Pressable>
              <View style={styles.sentenceCount}><Text style={styles.sentenceCountValue}>{fa(heroLesson.sentences.length)}</Text><Text style={styles.sentenceCountLabel}>جملهٔ همین درس</Text></View>
            </View>
          </LinearGradient>

          {!!error && <View style={styles.errorCard}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text><Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable></View>}

          <View style={styles.pathPanel}>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}><Text style={styles.panelEyebrow}>THE MAIN CURRICULUM</Text><Text style={styles.panelTitle}>مسیر یادگیری روسی</Text></View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push('/learn/ru/library' as never)}><Text style={styles.libraryLinkText}>کتابخانه</Text><ChevronLeft size={16} color={Palette.primary} /></Pressable>
            </View>
            <View style={styles.railWrap}>
              <EnglishLevelRail activeLevelId={activeLevel.id} counts={levelCounts} levels={RUSSIAN_LEVELS} accessibilityLabelPrefix="فهرست درس‌های" direction="rtl" onSelect={openLevel} />
            </View>
            <View style={styles.currentLevelRow}>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelEyebrow}>اکنون · سطح {fa(activeLevel.id)}</Text>
                <Text style={styles.currentLevelName}>{activeLevel.title}</Text>
                <Text style={styles.currentLevelDescription}>{activeLevel.description}</Text>
              </View>
              <View style={[styles.levelCountBadge, { backgroundColor: `${activeLevel.color}12`, borderColor: `${activeLevel.color}38` }]}>
                <Text style={[styles.levelCountValue, { color: activeLevel.color }]}>{fa(levelCompleted)} از {fa(levelLessons.length)}</Text>
                <View style={styles.levelCountMeta}><View style={[styles.levelCountDot, { backgroundColor: activeLevel.color }]} /><Text style={styles.levelCountLabel}>درس تکمیل‌شده</Text></View>
              </View>
            </View>
            <EnglishProgressTrack value={levelLessons.length ? levelCompleted / levelLessons.length * 100 : 0} color={activeLevel.color} />
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showRoadmap }} style={styles.mapToggle} onPress={() => setShowRoadmap(value => !value)}>
              <View style={styles.mapToggleIcon}><Compass size={16} color={Palette.primary} /></View>
              <View style={styles.mapToggleText}><Text style={styles.mapToggleTitle}>{showRoadmap ? 'بستن نقشهٔ کامل ۵ سطح' : 'نمایش نقشهٔ کامل ۵ سطح'}</Text><Text style={styles.mapToggleMeta}>{activeLevel.modules.slice(0, 3).map(displayEnglishModuleLabel).join(' · ')}</Text></View>
              {showRoadmap ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.primary} />}
            </Pressable>
            {showRoadmap && <View style={styles.fullRoadmap}>{RUSSIAN_LEVELS.map(level => {
              const count = levelCounts[level.id] ?? { completed: 0, total: 0 };
              const passed = count.total > 0 && count.completed === count.total;
              return <Pressable key={level.id} accessibilityRole="button" accessibilityLabel={`فهرست درس‌های ${level.title}`} style={[styles.levelCard, level.id === activeLevel.id && styles.levelCardActive]} onPress={() => openLevel(level.id)}>
                <View style={[styles.levelNumber, { backgroundColor: `${level.color}18` }]}>{passed ? <Check size={18} color={level.color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color: level.color }]}>{fa(level.id)}</Text>}</View>
                <View style={styles.levelText}><View style={styles.levelTitleRow}><Text style={styles.levelTitle}>{level.title}</Text><Text style={[styles.levelBand, { color: level.color }]}>{level.cefr}</Text></View><Text style={styles.levelDesc} numberOfLines={2}>{level.description}</Text><Text style={styles.levelStats}>{fa(count.completed)} از {fa(count.total)} درس · {level.status === 'planned' ? 'در نقشهٔ آینده' : 'محتوای موجود'}</Text></View>
                <ChevronLeft size={18} color={Palette.muted} />
              </Pressable>;
            })}</View>}
          </View>

          <View style={styles.sectionHeader}><View style={styles.sectionHeaderCopy}><Text style={styles.sectionEyebrow}>TODAY AT A GLANCE</Text><Text style={styles.sectionTitle}>برنامهٔ امروز</Text></View><View style={styles.todayPill}><Flame size={14} color="#C46B18" /><Text style={styles.todayPillText}>{fa(dueCount)} جمله برای مرور</Text></View></View>
          <View style={styles.todayCard}>
            <View style={styles.todayCardTop}><View style={styles.todayMetricCopy}><Text style={styles.todayValue}>{fa(completedCount)} از {fa(RUSSIAN_LESSONS.length)} <Text style={styles.todayValueUnit}>درس</Text></Text><Text style={styles.todayLabel}>پیشرفت همین دستگاه؛ تکمیل به‌تنهایی نشانهٔ تسلط نیست.</Text></View><View style={styles.todayIcon}><BookOpenCheck size={20} color={Palette.primary} /></View></View>
            <View style={styles.todayProgressRow}><Text style={styles.todayProgressText}>{fa(Math.round(completedCount / RUSSIAN_LESSONS.length * 100))}٪</Text><View style={styles.todayProgressTrack}><EnglishProgressTrack value={completedCount / RUSSIAN_LESSONS.length * 100} color={Palette.primary} height={9} /></View></View>
            <View style={styles.todayFootnote}><BookOpen size={14} color={Palette.teal} /><Text style={styles.todayFootnoteText}>{fa(sentenceCount)} جملهٔ موجود · {fa(uniqueWords)} واژه/عبارت یکتا</Text></View>
          </View>

          <View style={styles.quickRow}>
            <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/learn/ru/review' as never)}><View style={[styles.quickIcon, { backgroundColor: Palette.tealSoft }]}><RefreshCw size={19} color={Palette.teal} /></View><View style={styles.quickCopy}><Text style={styles.quickTitle}>مرور جمله‌ها</Text><Text style={styles.quickDesc}>جمله‌های روسی با موعد مرور</Text></View><ChevronLeft size={17} color={Palette.muted} /></Pressable>
            <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/learn/ru/library' as never)}><View style={[styles.quickIcon, { backgroundColor: Palette.primarySoft }]}><MessageCircle size={19} color={Palette.primary} /></View><View style={styles.quickCopy}><Text style={styles.quickTitle}>کتابخانهٔ درس‌ها</Text><Text style={styles.quickDesc}>سطح و درس را انتخاب کنید</Text></View><ChevronLeft size={17} color={Palette.muted} /></Pressable>
          </View>

          <View style={styles.tipCard}><View style={styles.tipIcon}><Sparkles size={17} color="#D07A1E" /></View><View style={styles.tipCopy}><Text style={styles.tipTitle}>نقشهٔ سطح‌ها، محتوای مستقل روسی</Text><Text style={styles.tipText}>سطح‌بندی این مسیر داخلی است؛ سه سطح بالاتر فعلاً نقشه‌اند و هنوز درس جمله‌محور منتشرشده ندارند.</Text></View></View>
        </View>
      </ScrollView>
      <RussianBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 26, gap: 18 },
  header: { minHeight: 56, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brandLockup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  brandMark: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  brandEyebrow: { color: Palette.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, textAlign: 'right', writingDirection: 'ltr' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: 20, lineHeight: 27, fontWeight: '800', color: Palette.ink, textAlign: 'right', writingDirection: 'ltr' },
  headerChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 999, borderWidth: 1, borderColor: '#CFEEE6', backgroundColor: Palette.tealSoft, paddingHorizontal: 10, paddingVertical: 7 },
  headerChipText: { fontFamily: Typography.fontFamily, color: Palette.teal, fontSize: 10, fontWeight: '700', writingDirection: 'rtl' },
  heroCard: { position: 'relative', overflow: 'hidden', borderRadius: 27, padding: 20, gap: 14, shadowColor: '#27246B', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  heroOrbLarge: { position: 'absolute', top: -76, left: -42, width: 210, height: 210, borderRadius: 105, backgroundColor: 'rgba(141, 144, 255, 0.13)' },
  heroOrbSmall: { position: 'absolute', top: 128, left: 92, width: 76, height: 76, borderRadius: 38, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  heroTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  heroLevelBadge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.13)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 11, paddingVertical: 7 },
  heroBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#A4F3D5' },
  heroLevelText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: .35, writingDirection: 'ltr' },
  heroCourseLabel: { color: '#C5C9FF', fontSize: 9, fontWeight: '800', letterSpacing: 1.3, writingDirection: 'ltr' },
  heroCopy: { gap: 2, paddingTop: 2 },
  heroEyebrow: { fontFamily: Typography.fontFamily, color: '#C6C8FF', fontSize: 12, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  heroTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 27, lineHeight: 39, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  heroDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.78)', fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  sentenceShowcase: { borderRadius: 19, padding: 15, gap: 8, backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' },
  sentenceShowcaseTop: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  sentenceLabelIcon: { width: 25, height: 25, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  sentenceLabel: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
  sentenceLabelEn: { marginLeft: 'auto', color: '#CFD2FF', fontSize: 8, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  sentenceRussian: { color: '#FFFFFF', fontSize: 20, lineHeight: 30, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  sentencePersian: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  sentencePronunciation: { fontFamily: Typography.fontFamily, color: '#D5D7FF', fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  wordChipRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  wordChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 9, paddingVertical: 5 },
  wordChipRussian: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', writingDirection: 'ltr' },
  wordChipDivider: { color: '#C6C8FF', fontSize: 10 },
  wordChipFa: { fontFamily: Typography.fontFamily, color: '#E4E6FF', fontSize: 10, writingDirection: 'rtl' },
  heroActions: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  continueButton: { minHeight: 48, flex: 1, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 15, backgroundColor: '#FFFFFF', paddingHorizontal: 13 },
  continueButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  sentenceCount: { alignItems: 'flex-end', minWidth: 76 },
  sentenceCountValue: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  sentenceCountLabel: { fontFamily: Typography.fontFamily, color: '#D5D7FF', fontSize: 9, writingDirection: 'rtl' },
  pathPanel: { borderRadius: 23, padding: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 14, shadowColor: '#21264A', shadowOpacity: .045, shadowRadius: 13, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  panelHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  panelHeadingText: { flex: 1, alignItems: 'stretch' },
  panelEyebrow: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.3, textAlign: 'right', writingDirection: 'ltr' },
  panelTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 20, lineHeight: 29, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  libraryLink: { minHeight: 37, flexDirection: 'row', alignItems: 'center', gap: 2, paddingHorizontal: 9, borderRadius: 12, backgroundColor: Palette.primarySoft },
  libraryLinkText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
  railWrap: { paddingVertical: 2 },
  currentLevelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: 12, borderRadius: 17, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  currentLevelCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  currentLevelEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 9, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  currentLevelName: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 15, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  currentLevelDescription: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  levelCountBadge: { alignItems: 'stretch', justifyContent: 'center', minWidth: 92, minHeight: 58, borderRadius: 18, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 6, gap: 3 },
  levelCountValue: { width: '100%', fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 19, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  levelCountMeta: { flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', gap: 4 },
  levelCountDot: { width: 5, height: 5, borderRadius: 3 },
  levelCountLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  mapToggle: { minHeight: 51, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 11, borderRadius: 15, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  mapToggleIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  mapToggleText: { flex: 1, gap: 2 },
  mapToggleTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  mapToggleMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  fullRoadmap: { gap: 8 },
  levelCard: { minHeight: 76, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, padding: 12, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  levelCardActive: { borderColor: Palette.primary, backgroundColor: '#F9F8FF' },
  levelNumber: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  levelNumberText: { fontSize: 15, fontWeight: '800', writingDirection: 'rtl' },
  levelText: { flex: 1, gap: 3 },
  levelTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  levelTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelBand: { fontFamily: Typography.fontFamily, fontSize: 8, fontWeight: '800', writingDirection: 'rtl' },
  levelDesc: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  levelStats: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  sectionHeaderCopy: { alignItems: 'stretch' },
  sectionEyebrow: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.3, textAlign: 'right', writingDirection: 'ltr' },
  sectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 19, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Palette.warningSoft, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999 },
  todayPillText: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 9, fontWeight: '700', writingDirection: 'rtl' },
  todayCard: { borderRadius: 20, padding: 16, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 13, shadowColor: '#20264A', shadowOpacity: .035, shadowRadius: 11, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  todayCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  todayMetricCopy: { flex: 1, alignItems: 'stretch' },
  todayValue: { color: Palette.ink, fontSize: 23, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayValueUnit: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 12, fontWeight: '600' },
  todayLabel: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  todayIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  todayProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  todayProgressText: { width: 34, color: Palette.primaryDark, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayProgressTrack: { flex: 1 },
  todayFootnote: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 5, paddingTop: 10, borderTopWidth: 1, borderTopColor: Palette.border },
  todayFootnoteText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  quickRow: { gap: 10 },
  quickCard: { minHeight: 70, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  quickIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  quickCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  quickTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  quickDesc: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 17, borderWidth: 1, borderColor: '#F4DFC5', backgroundColor: '#FFF8EF' },
  tipIcon: { width: 33, height: 33, borderRadius: 11, backgroundColor: '#FFEDD4', alignItems: 'center', justifyContent: 'center' },
  tipCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  tipTitle: { fontFamily: Typography.fontFamily, color: Palette.warning, fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  tipText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  errorCard: { padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: '#F5CDD3' },
  errorText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11, fontWeight: '800', writingDirection: 'rtl' },
});
