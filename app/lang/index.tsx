import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Compass,
  Cloud,
  Download,
  Flame,
  MessageCircle,
  Play,
  RefreshCw,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { AppBottomNav } from '@/components/AppBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import { COURSE_LEVELS, SENTENCE_LESSONS } from '@/lib/courseContent';
import { getCourseProgress, type CourseProgress } from '@/lib/courseProgress';
import { syncPersonalLearningData } from '@/lib/personalLearningSync';
import { Radius, Typography } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';
import { loadStudy, studyDay } from '@/lib/englishStudyState';
import { ENGLISH_ENGINE_BLUEPRINT, getEnglishLevelMetrics } from '@/lib/englishLearningEngine';
import { EnglishLevelRail, EnglishProgressTrack, displayEnglishModuleLabel } from '@/components/EnglishUI';

const HomeColors = {
  canvas: '#F5F3F7',
  surface: '#FFFFFF',
  surfaceSoft: '#FBF9F5',
  ink: '#191A31',
  text: '#56566D',
  muted: '#858398',
  border: '#E7E2EC',
  accent: '#6654CE',
  accentDeep: '#40327F',
  accentSoft: '#F0ECFA',
  sage: '#66805E',
  sageSoft: '#EFF4EA',
  amber: '#9A7133',
  amberSoft: '#FBF3E3',
  gold: '#D8B76E',
  goldSoft: '#F5EBD5',
} as const;

export default function LearningHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [measuredMinutes, setMeasuredMinutes] = useState(0);
  const [timeError, setTimeError] = useState(false);
  const [progress, setProgress] = useState<CourseProgress | null>(null);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void loadStudy().then(state => {
      if (alive) {
        setMeasuredMinutes(Math.floor((state.days[studyDay()] ?? 0) / 6000) / 10);
        setTimeError(false);
      }
    }).catch(() => { if (alive) setTimeError(true); });
    return () => { alive = false; };
  }, []));

  useFocusEffect(useCallback(() => {
    let alive = true;
    const refreshCourse = () => getCourseProgress().then(next => { if (alive) setProgress(next); });
    void refreshCourse();
    void syncPersonalLearningData().then(result => {
      if (result.status === 'synced') return refreshCourse();
      return undefined;
    }).catch(() => undefined); // Local progress remains available if cloud setup or connectivity is unavailable.
    return () => { alive = false; };
  }, []));

  const currentLesson = SENTENCE_LESSONS.find(lesson => lesson.id === progress?.currentLessonId) ?? SENTENCE_LESSONS[0];
  const currentLevel = COURSE_LEVELS.find(level => level.id === currentLesson.levelId) ?? COURSE_LEVELS[0];
  const currentSentence = currentLesson.sentences[0];
  const completedIds = progress?.completedLessonIds ?? [];
  const completed = completedIds.length;
  const levelMetrics = getEnglishLevelMetrics(currentLevel.id, completedIds);
  const currentBlueprint = ENGLISH_ENGINE_BLUEPRINT.find(level => level.levelId === currentLevel.id);
  const dailyGoal = progress?.dailyGoalMinutes ?? 10;
  const dailyPct = Math.min(100, dailyGoal ? (measuredMinutes / dailyGoal) * 100 : 0);
  const levelCounts = Object.fromEntries(COURSE_LEVELS.map(level => {
    const metrics = getEnglishLevelMetrics(level.id, completedIds);
    return [level.id, { completed: metrics.completedLessonCount, total: metrics.lessonCount }];
  }));
  const levelProgress = levelMetrics.lessonCount
    ? (levelMetrics.completedLessonCount / levelMetrics.lessonCount) * 100
    : 0;

  const openLevel = (levelId: number) => router.push({ pathname: '/lang/library', params: { level: String(levelId) } } as never);
  const openCurrentLesson = () => router.push({ pathname: '/course/lesson', params: { id: currentLesson.id } } as never);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={['#7864DF', '#37306F']} start={{ x: .9, y: 0 }} end={{ x: .1, y: 1 }} style={styles.brandMark}>
                <BookOpenCheck size={20} color="#F9E8B9" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.brandCopy}>
                <Text style={styles.brandEyebrow}>LANGUAGE JOURNEY</Text>
                <Text style={styles.headerTitle}>مسیر یادگیری انگلیسی</Text>
              </View>
            </View>
            <PageNavigation backFallback="/languages" />
          </View>

          <LinearGradient
            colors={['#171A38', '#29285C', '#45377D']}
            start={{ x: .95, y: .08 }}
            end={{ x: .04, y: 1 }}
            style={[styles.welcomeBlock, compact && styles.welcomeBlockCompact]}
          >
            <View pointerEvents="none" style={styles.welcomeGlowOne} />
            <View pointerEvents="none" style={styles.welcomeGlowTwo} />
            <View style={styles.welcomeCopy}>
              <View style={styles.welcomeEyebrowRow}>
                <Sparkles size={13} color={HomeColors.gold} />
                <Text style={styles.welcomeEyebrow}>YOUR NEXT STEP</Text>
              </View>
              <Text style={styles.welcomeTitle}>سلام! آماده‌ای ادامه بدی؟</Text>
              <Text style={styles.welcomeDescription}>یک جملهٔ کاربردی، یک قدم دیگر در مسیر یادگیری.</Text>
              <View style={styles.welcomeTags}>
                <View style={styles.welcomeTag}>
                  <BookOpen size={12} color={HomeColors.gold} />
                  <Text style={styles.welcomeTagText}>یادگیری جمله‌محور</Text>
                </View>
                <View style={styles.welcomeTag}>
                  <Sparkles size={12} color="#B8E3D5" />
                  <Text style={styles.welcomeTagText}>تمرین کوتاه روزانه</Text>
                </View>
              </View>
            </View>
            <View style={[styles.welcomeVisual, compact && styles.welcomeVisualCompact]}>
              <Image source={require('../../assets/english-learning-hero.jpg')} resizeMode="cover" style={styles.welcomeImage} />
              <LinearGradient colors={['rgba(16,18,43,0.02)', 'rgba(16,18,43,0.35)']} style={styles.welcomeImageShade} />
              <View style={styles.welcomeImageStamp}>
                <Text style={styles.welcomeImageStampMain}>EN</Text>
                <View style={styles.welcomeImageStampLine} />
                <Text style={styles.welcomeImageStampSub}>LEARN</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.lessonCard}>
            <LinearGradient colors={['#D8B76E', '#8C69D8', '#D8B76E']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.lessonCardAccent} />
            <View style={styles.lessonMetaRow}>
              <View style={styles.levelTag}>
                <View style={[styles.levelTagDot, { backgroundColor: currentLevel.color }]} />
                <Text style={[styles.levelTagName, { color: currentLevel.color }]}>{currentLevel.title}</Text>
                <Text style={styles.levelTagDivider}>·</Text>
                <Text style={[styles.levelTagText, { color: currentLevel.color, writingDirection: currentLevel.id === 0 ? 'rtl' : 'ltr' }]}>{currentLevel.cefr}</Text>
              </View>
              <Text style={styles.lessonOrder}>{toPersianDigits(currentLesson.order)} از {toPersianDigits(SENTENCE_LESSONS.length)}</Text>
            </View>

            <View style={styles.lessonHeading}>
              <Text style={styles.lessonEyebrow}>ادامهٔ یادگیری</Text>
              <Text style={styles.lessonTitle}>{currentLesson.title}</Text>
              <Text style={styles.lessonSubtitle}>{currentLesson.subtitle}</Text>
            </View>

            {currentSentence ? (
              <View style={styles.sentenceCard}>
                <View style={styles.sentenceTopRow}>
                  <View style={styles.sentenceIcon}><BookOpen size={15} color={HomeColors.accent} /></View>
                  <Text style={styles.sentenceLabel}>جملهٔ منتخب این درس</Text>
                  <Text style={styles.sentenceNumber}>{toPersianDigits(1)} / {toPersianDigits(currentLesson.sentences.length)}</Text>
                </View>
                <Text style={styles.sentenceEnglish}>{currentSentence.en}</Text>
                <Text style={styles.sentencePersian}>{currentSentence.fa}</Text>
                {!!currentSentence.vocabulary.length && (
                  <View style={styles.wordChipRow}>
                    {currentSentence.vocabulary.map(item => (
                      <View key={`${currentSentence.id}-${item.word}`} style={styles.wordChip}>
                        <Text style={styles.wordChipEn}>{item.word}</Text>
                        <Text style={styles.wordChipDivider}>·</Text>
                        <Text style={styles.wordChipFa}>{item.meaning}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null}

            <View style={styles.levelProgressBlock}>
              <View style={styles.levelProgressMeta}>
                <Text style={styles.levelProgressLabel}>پیشرفت در {currentLevel.title}</Text>
                <Text style={styles.levelProgressValue}>{toPersianDigits(levelMetrics.completedLessonCount)} از {toPersianDigits(levelMetrics.lessonCount)} درس</Text>
              </View>
              <EnglishProgressTrack value={levelProgress} color={currentLevel.color} height={7} />
            </View>

            <View style={styles.lessonFooter}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={completed ? 'ادامهٔ درس انگلیسی' : 'شروع اولین درس انگلیسی'}
                style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]}
                onPress={openCurrentLesson}
              >
                <LinearGradient colors={['#705BD7', '#40347F']} start={{ x: .96, y: 0 }} end={{ x: .04, y: 1 }} style={styles.continueButtonGradient}>
                  <Play size={16} color="#F5E7BC" fill="#F5E7BC" />
                  <Text style={styles.continueButtonText}>{completed ? 'ادامهٔ درس' : 'شروع اولین درس'}</Text>
                  <ArrowLeft size={17} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
              <View style={styles.lessonCountPill}>
                <Text style={styles.lessonCountValue}>{toPersianDigits(currentLesson.sentences.length)}</Text>
                <Text style={styles.lessonCountLabel}>جمله</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBlock}>
              <Text style={styles.sectionEyebrow}>TODAY AT A GLANCE</Text>
              <Text style={styles.sectionTitle}>برنامهٔ امروز</Text>
            </View>
            <View style={styles.dailyGoalPill}>
              <Flame size={14} color={HomeColors.amber} />
              <Text style={styles.dailyGoalText}>{toPersianDigits(dailyGoal)} دقیقه هدف روزانه</Text>
            </View>
          </View>

          <LinearGradient colors={['#1A1D3D', '#2D2B62', '#403879']} start={{ x: .95, y: .05 }} end={{ x: .04, y: 1 }} style={styles.todayCard}>
            <View pointerEvents="none" style={styles.todayGlow} />
            <View style={styles.todayTopRow}>
              <View style={styles.todayIcon}><Clock3 size={18} color={HomeColors.gold} /></View>
              <View style={styles.todayCopy}>
                <Text style={styles.todayValue}>{toPersianDigits(measuredMinutes)} <Text style={styles.todayUnit}>دقیقه</Text></Text>
                <Text style={styles.todayLabel}>{timeError ? 'زمان ثبت‌شده خوانده نشد' : 'زمان یادگیری ثبت‌شده امروز'}</Text>
              </View>
              <View style={styles.todayPercentPill}>
                <Text style={styles.todayPercentText}>{toPersianDigits(Math.round(dailyPct))}٪</Text>
              </View>
            </View>
            <View style={styles.todayProgressTrack}>
              <EnglishProgressTrack value={dailyPct} color={HomeColors.gold} trackColor="rgba(255,255,255,0.17)" height={7} />
            </View>
            <View style={styles.todayFootnote}>
              <BookOpen size={14} color={HomeColors.gold} />
              <Text style={styles.todayFootnoteText}>{toPersianDigits(completed)} از {toPersianDigits(SENTENCE_LESSONS.length)} درس اصلی تکمیل‌شده</Text>
              {progress?.currentStreak ? (
                <View style={styles.streakPill}>
                  <Flame size={12} color="#C4E8D8" />
                  <Text style={styles.streakText}>{toPersianDigits(progress.currentStreak)} روز پیاپی</Text>
                </View>
              ) : null}
            </View>
          </LinearGradient>

          <View style={styles.pathPanel}>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}>
                <Text style={styles.panelEyebrow}>YOUR LEARNING PATH</Text>
                <Text style={styles.panelTitle}>مسیر پنج‌سطحی</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push('/lang/library' as never)}>
                <Text style={styles.libraryLinkText}>کتابخانه</Text>
                <ChevronLeft size={16} color={HomeColors.accent} />
              </Pressable>
            </View>

            <View style={styles.railWrap}>
              <EnglishLevelRail activeLevelId={currentLevel.id} counts={levelCounts} direction="rtl" onSelect={openLevel} />
            </View>

            <View style={styles.currentLevelCard}>
              <View style={[styles.levelNumber, { backgroundColor: `${currentLevel.color}14` }]}>
                <Text style={[styles.levelNumberText, { color: currentLevel.color }]}>{toPersianDigits(currentLevel.id)}</Text>
              </View>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelName}>{currentLevel.title}</Text>
                <Text style={styles.currentLevelDescription}>{currentLevel.description}</Text>
              </View>
              <View style={styles.currentLevelCount}>
                <Text style={[styles.levelCountValue, { color: currentLevel.color }]}>{toPersianDigits(levelMetrics.completedLessonCount)} / {toPersianDigits(levelMetrics.lessonCount)}</Text>
                <Text style={styles.levelCountLabel}>درس</Text>
              </View>
            </View>

            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showRoadmap }} style={styles.mapToggle} onPress={() => setShowRoadmap(value => !value)}>
              <View style={styles.mapToggleIcon}><Compass size={16} color={HomeColors.accent} /></View>
              <View style={styles.mapToggleText}>
                <Text style={styles.mapToggleTitle}>{showRoadmap ? 'بستن نقشهٔ کامل' : 'دیدن جزئیات پنج سطح'}</Text>
                <Text style={styles.mapToggleMeta}>{currentBlueprint?.modules.slice(0, 3).map(displayEnglishModuleLabel).join(' · ')}</Text>
              </View>
              {showRoadmap ? <ChevronUp size={18} color={HomeColors.accent} /> : <ChevronDown size={18} color={HomeColors.muted} />}
            </Pressable>

            {showRoadmap && (
              <View style={styles.fullRoadmap}>
                {COURSE_LEVELS.map(level => {
                  const metrics = getEnglishLevelMetrics(level.id, completedIds);
                  const passed = metrics.lessonCount > 0 && metrics.completedLessonCount === metrics.lessonCount;
                  return (
                    <Pressable
                      key={level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${level.title}`}
                      style={({ pressed }) => [styles.levelCard, level.id === currentLevel.id && styles.levelCardActive, pressed && styles.buttonPressed]}
                      onPress={() => openLevel(level.id)}
                    >
                      <View style={[styles.levelNumber, { backgroundColor: `${level.color}14` }]}>
                        {passed ? <Check size={17} color={level.color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color: level.color }]}>{toPersianDigits(level.id)}</Text>}
                      </View>
                      <View style={styles.levelText}>
                        <View style={styles.levelTitleRow}>
                          <Text style={styles.levelTitle}>{level.title}</Text>
                          <Text style={[styles.levelCefr, { color: level.color }]}>{level.cefr}</Text>
                        </View>
                        <Text style={styles.levelDesc} numberOfLines={1}>{level.description}</Text>
                        <Text style={styles.levelStats}>{toPersianDigits(metrics.completedLessonCount)} از {toPersianDigits(metrics.lessonCount)} درس · {toPersianDigits(metrics.sentenceCount)} جمله · {toPersianDigits(metrics.vocabularyCount)} واژهٔ یکتا</Text>
                      </View>
                      <ChevronLeft size={18} color={HomeColors.muted} />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.quickSection}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionTitleBlock}>
                <Text style={styles.sectionEyebrow}>KEEP GOING</Text>
                <Text style={styles.sectionTitle}>میان‌برهای تو</Text>
              </View>
            </View>
            <View style={[styles.quickRow, compact && styles.quickRowCompact]}>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={() => router.push('/review' as never)}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.sageSoft }]}><RefreshCw size={18} color={HomeColors.sage} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>مرور جمله‌ها</Text>
                  <Text style={styles.quickDesc}>کارت‌های زمان‌بندی‌شدهٔ تو</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
              <Pressable accessibilityRole="button" style={styles.quickCard} onPress={openCurrentLesson}>
                <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><MessageCircle size={18} color={HomeColors.accent} /></View>
                <View style={styles.quickCopy}>
                  <Text style={styles.quickTitle}>تمرین مکالمه</Text>
                  <Text style={styles.quickDesc}>گفت‌وگوی همین درس</Text>
                </View>
                <ChevronLeft size={17} color={HomeColors.muted} />
              </Pressable>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="باز کردن کارگاه تلفظ انگلیسی"
              accessibilityHint="تمرین صداهای انگلیسی، تکیه و آهنگ جمله؛ بدون ضبط میکروفن"
              style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]}
              onPress={() => router.push('/learn/en/pronunciation' as never)}
            >
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><Volume2 size={18} color={HomeColors.accent} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>کارگاه تلفظ انگلیسی</Text>
                <Text style={styles.quickDesc}>تمرین صداها، تکیه و آهنگ جمله؛ خودارزیابی و همگام‌سازی حساب</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="سنجش آغازین انگلیسی برای انتخاب نقطهٔ شروع" style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]} onPress={() => router.push({ pathname: '/placement', params: { language: 'en' } } as never)}>
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.amberSoft }]}><Compass size={18} color={HomeColors.amber} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>پیداکردن نقطهٔ شروع</Text>
                <Text style={styles.quickDesc}>سنجش کوتاه و اختیاری برای انتخاب سطح انگلیسی</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="پشتیبان‌گیری محلی از پیشرفت انگلیسی" style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]} onPress={() => router.push('/lang/backup' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.sageSoft }]}><Download size={18} color={HomeColors.sage} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>پشتیبان پیشرفت</Text>
                <Text style={styles.quickDesc}>ذخیره و بازیابی امن سابقهٔ محلی انگلیسی</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="ورود ایمیلی و همگام‌سازی شخصی" style={({ pressed }) => [styles.quickCard, pressed && styles.buttonPressed]} onPress={() => router.push('/personal-sync' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: HomeColors.accentSoft }]}><Cloud size={18} color={HomeColors.accent} /></View>
              <View style={styles.quickCopy}>
                <Text style={styles.quickTitle}>حساب و همگام‌سازی</Text>
                <Text style={styles.quickDesc}>پیشرفت و تلفظ هر دو زبان میان دستگاه‌ها</Text>
              </View>
              <ChevronLeft size={17} color={HomeColors.muted} />
            </Pressable>
          </View>

          <LinearGradient colors={['#25214E', '#443571']} start={{ x: .95, y: .1 }} end={{ x: .05, y: 1 }} style={styles.noteCard}>
            <View style={styles.noteIcon}><Sparkles size={16} color={HomeColors.gold} /></View>
            <View style={styles.noteCopy}>
              <Text style={styles.noteTitle}>یادگیری در بافت</Text>
              <Text style={styles.noteText}>هر واژه را در جمله و موقعیت خودش می‌آموزی؛ نه جدا از کاربردش.</Text>
            </View>
            <View style={styles.noteOrnament} pointerEvents="none"><Sparkles size={30} color="rgba(216,183,110,0.22)" /></View>
          </LinearGradient>
        </View>
      </ScrollView>
      <AppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: HomeColors.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 22, paddingTop: 17, paddingBottom: 108, gap: 19 },
  header: { minHeight: 58, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brandLockup: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  brandMark: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(216,183,110,0.4)', shadowColor: '#38306F', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  brandCopy: { gap: 2 },
  brandEyebrow: { color: '#8C7BB8', fontSize: 8, fontWeight: '900', letterSpacing: 1.45, textAlign: 'right', writingDirection: 'ltr' },
  headerTitle: { fontFamily: Typography.fontFamily, fontSize: 16, lineHeight: 24, fontWeight: '800', color: HomeColors.ink, textAlign: 'right', writingDirection: 'rtl' },
  welcomeBlock: { position: 'relative', minHeight: 202, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 18, overflow: 'hidden', padding: 18, borderRadius: 27, borderWidth: 1, borderColor: '#514878', shadowColor: '#211A50', shadowOpacity: 0.2, shadowRadius: 23, shadowOffset: { width: 0, height: 11 }, elevation: 6 },
  welcomeBlockCompact: { flexDirection: 'column', alignItems: 'stretch', gap: 15, padding: 16 },
  welcomeGlowOne: { position: 'absolute', top: -104, right: '18%', width: 270, height: 270, borderRadius: 135, backgroundColor: 'rgba(216,183,110,0.09)' },
  welcomeGlowTwo: { position: 'absolute', bottom: -142, left: -90, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(130,111,221,0.22)' },
  welcomeCopy: { flex: 1, gap: 7, alignItems: 'stretch', zIndex: 1 },
  welcomeEyebrowRow: { flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-end', gap: 6, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  welcomeEyebrow: { color: '#E5D7B5', fontSize: 8, fontWeight: '900', letterSpacing: 1.35, textAlign: 'right', writingDirection: 'ltr' },
  welcomeTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 23, lineHeight: 35, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  welcomeDescription: { fontFamily: Typography.fontFamily, color: '#DAD6EA', fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  welcomeTags: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  welcomeTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  welcomeTagText: { fontFamily: Typography.fontFamily, color: '#F2EFF8', fontSize: 8, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  welcomeVisual: { position: 'relative', width: '36%', maxWidth: 270, height: 164, flexShrink: 0, overflow: 'hidden', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(216,183,110,0.56)', backgroundColor: '#191A34' },
  welcomeVisualCompact: { width: '100%', maxWidth: '100%', height: 145 },
  welcomeImage: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, width: '100%', height: '100%' },
  welcomeImageShade: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  welcomeImageStamp: { position: 'absolute', bottom: 9, left: 9, minWidth: 44, alignItems: 'center', paddingHorizontal: 7, paddingVertical: 5, borderRadius: 10, backgroundColor: 'rgba(20,22,48,0.83)', borderWidth: 1, borderColor: 'rgba(216,183,110,0.45)' },
  welcomeImageStampMain: { color: '#F2D99C', fontSize: 13, fontWeight: '900', letterSpacing: 1.2, textAlign: 'right', writingDirection: 'ltr' },
  welcomeImageStampLine: { width: 23, height: 1, backgroundColor: 'rgba(216,183,110,0.8)', marginVertical: 2 },
  welcomeImageStampSub: { color: '#FFFFFF', fontSize: 6, fontWeight: '800', letterSpacing: 1, textAlign: 'right', writingDirection: 'ltr' },
  lessonCard: { position: 'relative', overflow: 'hidden', borderRadius: 25, padding: 18, gap: 15, backgroundColor: HomeColors.surface, borderWidth: 1, borderColor: '#E5DDEB', shadowColor: '#30254E', shadowOpacity: 0.09, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  lessonCardAccent: { position: 'absolute', top: 0, right: 0, height: 4, width: '46%' },
  lessonMetaRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 4 },
  levelTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: Radius.full, backgroundColor: '#FBF8F0', borderWidth: 1, borderColor: '#EADCB9', paddingHorizontal: 10, paddingVertical: 7 },

  levelTagDot: { width: 6, height: 6, borderRadius: 3 },
  levelTagName: { color: HomeColors.accentDeep, fontSize: 9, fontWeight: '900', textAlign: 'right', writingDirection: 'ltr' },
  levelTagDivider: { color: '#A89CB3', fontSize: 9, fontWeight: '700' },
  levelTagText: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: '800', textAlign: 'right' },
  lessonOrder: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 9, textAlign: 'left', writingDirection: 'rtl' },
  lessonHeading: { gap: 3, alignItems: 'stretch' },
  lessonEyebrow: { fontFamily: Typography.fontFamily, color: '#A2854B', fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  lessonTitle: { fontFamily: Typography.fontFamily, color: HomeColors.ink, fontSize: 24, lineHeight: 36, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: HomeColors.text, fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  sentenceCard: { padding: 14, gap: 9, borderRadius: 19, backgroundColor: '#FCFAF6', borderWidth: 1, borderColor: '#ECE4D6' },
  sentenceTopRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  sentenceIcon: { width: 29, height: 29, borderRadius: 10, backgroundColor: HomeColors.goldSoft, borderWidth: 1, borderColor: '#EADCB9', alignItems: 'center', justifyContent: 'center' },
  sentenceLabel: { flex: 1, fontFamily: Typography.fontFamily, color: HomeColors.text, fontSize: 10, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  sentenceNumber: { color: HomeColors.muted, fontSize: 8, fontWeight: '800', writingDirection: 'ltr' },
  sentenceEnglish: { color: HomeColors.ink, fontSize: 18, lineHeight: 29, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  sentencePersian: { fontFamily: Typography.fontFamily, color: HomeColors.text, fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  wordChipRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 6, paddingTop: 2 },
  wordChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: Radius.full, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6DCC7', paddingHorizontal: 9, paddingVertical: 5 },
  wordChipEn: { color: HomeColors.accentDeep, fontSize: 9, fontWeight: '800', writingDirection: 'ltr' },
  wordChipDivider: { color: '#B9A874', fontSize: 9 },
  wordChipFa: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 9, writingDirection: 'rtl' },
  levelProgressBlock: { gap: 7, paddingTop: 12, borderTopWidth: 1, borderTopColor: HomeColors.border },
  levelProgressMeta: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  levelProgressLabel: { fontFamily: Typography.fontFamily, color: HomeColors.text, fontSize: 9, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  levelProgressValue: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 9, textAlign: 'left', writingDirection: 'rtl' },
  lessonFooter: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  continueButton: { minHeight: 50, flex: 1, borderRadius: 16, overflow: 'hidden' },
  continueButtonGradient: { minHeight: 50, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 13 },
  continueButtonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  buttonPressed: { opacity: .82, transform: [{ scale: .99 }] },
  lessonCountPill: { minWidth: 68, minHeight: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: HomeColors.goldSoft, borderWidth: 1, borderColor: '#E8D9B5', paddingHorizontal: 8 },
  lessonCountValue: { color: HomeColors.accentDeep, fontSize: 16, lineHeight: 20, fontWeight: '900' },
  lessonCountLabel: { fontFamily: Typography.fontFamily, color: HomeColors.accentDeep, fontSize: 8, fontWeight: '700', writingDirection: 'rtl' },
  sectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  sectionTitleBlock: { alignItems: 'stretch', gap: 2 },
  sectionEyebrow: { color: '#9B8559', fontSize: 8, fontWeight: '900', letterSpacing: 1.2, textAlign: 'right', writingDirection: 'ltr' },
  sectionTitle: { fontFamily: Typography.fontFamily, color: HomeColors.ink, fontSize: 18, lineHeight: 27, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  dailyGoalPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: Radius.full, backgroundColor: HomeColors.goldSoft, borderWidth: 1, borderColor: '#E9DDBF', paddingHorizontal: 10, paddingVertical: 7 },
  dailyGoalText: { fontFamily: Typography.fontFamily, color: HomeColors.amber, fontSize: 8, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  todayCard: { position: 'relative', overflow: 'hidden', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#575087', gap: 12, shadowColor: '#201B4C', shadowOpacity: 0.17, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
  todayGlow: { position: 'absolute', top: -80, left: -35, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(216,183,110,0.09)' },
  todayTopRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  todayIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center' },
  todayCopy: { flex: 1, alignItems: 'stretch', gap: 1 },
  todayValue: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 23, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  todayUnit: { fontSize: 10, fontWeight: '600', color: '#D6D0E9' },
  todayLabel: { fontFamily: Typography.fontFamily, color: '#D3CEE1', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  todayPercentPill: { minWidth: 47, minHeight: 34, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: 'rgba(216,183,110,0.14)', borderWidth: 1, borderColor: 'rgba(216,183,110,0.34)' },
  todayPercentText: { fontFamily: Typography.fontFamily, color: '#F2DDA9', fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  todayProgressTrack: { width: '100%' },
  todayFootnote: { flexDirection: 'row-reverse', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)' },
  todayFootnoteText: { flex: 1, fontFamily: Typography.fontFamily, color: '#E7E3F0', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  streakPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, borderRadius: Radius.full, backgroundColor: 'rgba(184,227,213,0.12)', borderWidth: 1, borderColor: 'rgba(184,227,213,0.2)', paddingHorizontal: 8, paddingVertical: 5 },
  streakText: { fontFamily: Typography.fontFamily, color: '#C4E8D8', fontSize: 8, fontWeight: '800', writingDirection: 'rtl' },
  pathPanel: { borderRadius: 24, padding: 17, backgroundColor: HomeColors.surface, borderWidth: 1, borderColor: '#E4DCEB', gap: 14, shadowColor: '#30254E', shadowOpacity: 0.065, shadowRadius: 18, shadowOffset: { width: 0, height: 7 }, elevation: 3 },
  panelHeadingRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  panelHeadingText: { flex: 1, alignItems: 'stretch' },
  panelEyebrow: { color: '#9B8559', fontSize: 8, fontWeight: '900', letterSpacing: 1.2, textAlign: 'right', writingDirection: 'ltr' },
  panelTitle: { fontFamily: Typography.fontFamily, color: HomeColors.ink, fontSize: 19, lineHeight: 29, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  libraryLink: { minHeight: 38, flexDirection: 'row-reverse', alignItems: 'center', gap: 2, paddingHorizontal: 10, borderRadius: 13, backgroundColor: HomeColors.goldSoft, borderWidth: 1, borderColor: '#E9DDBF' },
  libraryLinkText: { fontFamily: Typography.fontFamily, color: HomeColors.accentDeep, fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  railWrap: { paddingVertical: 3, paddingHorizontal: 3 },
  currentLevelCard: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, padding: 11, borderRadius: 17, backgroundColor: '#FBF9F4', borderWidth: 1, borderColor: '#EAE2D3' },
  levelNumber: { width: 35, height: 35, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  levelNumberText: { fontSize: 14, fontWeight: '900' },
  currentLevelCopy: { flex: 1, alignItems: 'stretch', gap: 1 },
  currentLevelName: { fontFamily: Typography.fontFamily, color: HomeColors.ink, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  currentLevelDescription: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  currentLevelCount: { alignItems: 'center', minWidth: 45 },
  levelCountValue: { fontSize: 12, fontWeight: '900', writingDirection: 'rtl' },
  levelCountLabel: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 8, writingDirection: 'rtl' },
  mapToggle: { minHeight: 50, flexDirection: 'row-reverse', alignItems: 'center', gap: 9, paddingHorizontal: 11, borderRadius: 15, backgroundColor: '#FAF8F4', borderWidth: 1, borderColor: '#EAE3D6' },
  mapToggleIcon: { width: 31, height: 31, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: HomeColors.goldSoft },
  mapToggleText: { flex: 1, gap: 2 },
  mapToggleTitle: { fontFamily: Typography.fontFamily, color: HomeColors.ink, fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  mapToggleMeta: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 8, textAlign: 'right', writingDirection: 'ltr' },
  fullRoadmap: { gap: 8 },
  levelCard: { minHeight: 70, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, padding: 11, borderRadius: 16, backgroundColor: HomeColors.surface, borderWidth: 1, borderColor: HomeColors.border, shadowColor: '#30254E', shadowOpacity: 0.035, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  levelCardActive: { borderColor: '#D6BD81', backgroundColor: '#FCF9F1' },
  levelText: { flex: 1, gap: 2 },
  levelTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  levelTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: HomeColors.ink, fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelCefr: { fontSize: 8, fontWeight: '800', writingDirection: 'ltr' },
  levelDesc: { fontFamily: Typography.fontFamily, color: HomeColors.text, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  levelStats: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 8, textAlign: 'right', writingDirection: 'rtl' },
  quickSection: { gap: 12 },
  quickRow: { flexDirection: 'row-reverse', gap: 10 },
  quickRowCompact: { flexDirection: 'column' },
  quickCard: { minHeight: 76, flex: 1, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 18, backgroundColor: HomeColors.surface, borderWidth: 1, borderColor: '#E6DFEA', shadowColor: '#30254E', shadowOpacity: 0.045, shadowRadius: 11, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  quickIcon: { width: 39, height: 39, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(90,80,120,0.08)', alignItems: 'center', justifyContent: 'center' },
  quickCopy: { flex: 1, alignItems: 'stretch', gap: 2 },
  quickTitle: { fontFamily: Typography.fontFamily, color: HomeColors.ink, fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  quickDesc: { fontFamily: Typography.fontFamily, color: HomeColors.muted, fontSize: 8, lineHeight: 15, textAlign: 'right', writingDirection: 'rtl' },
  noteCard: { position: 'relative', overflow: 'hidden', flexDirection: 'row-reverse', alignItems: 'center', gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: '#574887' },
  noteIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(216,183,110,0.25)', alignItems: 'center', justifyContent: 'center' },
  noteCopy: { flex: 1, alignItems: 'stretch', gap: 2, zIndex: 1 },
  noteTitle: { fontFamily: Typography.fontFamily, color: '#E7CC91', fontSize: 10, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl' },
  noteText: { fontFamily: Typography.fontFamily, color: '#E4E0EF', fontSize: 9, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  noteOrnament: { position: 'absolute', left: 13, bottom: -6, opacity: 0.8 },
});
