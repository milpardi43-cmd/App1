import { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
import { EnglishLevelRail, EnglishProgressTrack } from '@/components/EnglishUI';
import { GermanPalette as Palette, GERMAN_LEVEL_GRADIENTS } from '@/components/germanTheme';
import { GermanBottomNav } from '@/components/GermanBottomNav';
import { PageNavigation } from '@/components/PageNavigation';
import type { CourseLevelId } from '@/lib/courseContent';
import { toPersianDigits as fa } from '@/lib/format';
import {
  GERMAN_SENTENCE_LEVELS,
  GERMAN_SENTENCE_LESSONS,
  germanSentenceLevelMetrics,
  getGermanSentenceResumeLesson,
} from '@/lib/languages/germanSentenceCourse';
import { germanProgress } from '@/lib/languages/catalog';
import { syncPersonalLearningData } from '@/lib/personalLearningSync';
import type { CourseProgress } from '@/lib/createCourseProgressStore';
import { germanHomeStyles as styles } from './germanHomeStyles';

export default function GermanSentenceHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 640;
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    const refreshLocal = () => Promise.all([germanProgress.getCourseProgress(), germanProgress.getDueReviewCards()])
      .then(([nextProgress, due]) => {
        if (!alive) return;
        setProgress(nextProgress);
        setDueCount(due.length);
        setError('');
      })
      .catch(() => { if (alive) setError('پیشرفت ذخیره‌شده خوانده نشد؛ درس‌ها همچنان از کتابخانه در دسترس‌اند.'); });
    void refreshLocal();
    void syncPersonalLearningData().then(result => {
      if (result.status === 'synced') return refreshLocal();
      return undefined;
    }).catch(() => undefined); // Keep locally saved lessons usable when the cloud is offline or not configured.
    return () => { alive = false; };
  }, [retry]));

  const completedIds = progress?.completedLessonIds ?? [];
  const completed = GERMAN_SENTENCE_LESSONS.filter(lesson => completedIds.includes(lesson.id)).length;
  const currentLesson = getGermanSentenceResumeLesson(progress?.currentLessonId, completedIds);
  const currentLevel = GERMAN_SENTENCE_LEVELS.find(level => level.id === currentLesson.levelId) ?? GERMAN_SENTENCE_LEVELS[0];
  const currentSentence = currentLesson.sentences[0];
  const currentMetrics = germanSentenceLevelMetrics(currentLevel.id);
  const currentCompleted = GERMAN_SENTENCE_LESSONS.filter(lesson => lesson.levelId === currentLevel.id && completedIds.includes(lesson.id)).length;
  const levelRows = GERMAN_SENTENCE_LEVELS.map(level => {
    const metrics = germanSentenceLevelMetrics(level.id);
    const done = GERMAN_SENTENCE_LESSONS.filter(lesson => lesson.levelId === level.id && completedIds.includes(lesson.id)).length;
    return { level, metrics, completed: done };
  });
  const levelCounts = Object.fromEntries(levelRows.map(row => [row.level.id, {
    completed: row.completed,
    total: row.metrics.lessonCount,
  }])) as Partial<Record<CourseLevelId, { completed: number; total: number }>>;
  const lessonCount = GERMAN_SENTENCE_LESSONS.length;
  const totalSentenceCount = GERMAN_SENTENCE_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const progressPercent = lessonCount ? completed / lessonCount * 100 : 0;
  const isCourseComplete = lessonCount > 0 && completed === lessonCount;
  const openLevel = (levelId: number) => router.push(`/learn/de/library?level=${levelId}` as never);
  const openLesson = (id: string) => router.push({ pathname: '/learn/[language]/lesson', params: { language: 'de', id } } as never);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          <View style={styles.header}>
            <View style={styles.brandLockup}>
              <LinearGradient colors={['#2E806B', '#123E35']} style={styles.brandMark}>
                <BookOpenCheck size={20} color="#F4E3B5" strokeWidth={2.2} />
              </LinearGradient>
              <View>
                <Text style={styles.brandEyebrow}>DEUTSCH LERNEN · IM KONTEXT</Text>
                <Text style={styles.headerTitle}>Deutsch Journey</Text>
              </View>
            </View>
            <PageNavigation backFallback="/languages" accentColor={Palette.primary} borderColor={Palette.border} />
          </View>

          <LinearGradient colors={GERMAN_LEVEL_GRADIENTS[currentLevel.id]} start={{ x: 0.95, y: 0.04 }} end={{ x: 0.05, y: 1 }} style={styles.heroCard}>
            <View pointerEvents="none" style={styles.heroOrbLarge} />
            <View pointerEvents="none" style={styles.heroOrbSmall} />
            <View style={styles.heroTopRow}>
              <View style={styles.heroLevelBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroLevelText}>مرحلهٔ {fa(currentLevel.id + 1)} · {currentLevel.title}</Text>
              </View>
              <Text style={styles.heroCourseLabel}>DEUTSCH · SATZKURS</Text>
            </View>

            <View style={[styles.heroMainRow, compact && styles.heroMainRowCompact]}>
              <View style={styles.heroCopy}>
                <Text style={styles.heroEyebrow}>{isCourseComplete ? 'همهٔ درس‌های این مسیر تکمیل شده‌اند' : completed ? 'درس بعدی شما' : 'شروع مسیر جمله‌محور'}</Text>
                <Text style={styles.heroTitle}>{currentLesson.title}</Text>
                <Text style={styles.heroDescription}>{currentLesson.subtitle}</Text>
                <View style={styles.heroStatRow}>
                  <View style={styles.heroStat}>
                    <BookOpen size={13} color={Palette.gold} />
                    <Text style={styles.heroStatText}>{fa(lessonCount)} درس</Text>
                  </View>
                  <View style={styles.heroStatDivider} />
                  <View style={styles.heroStat}>
                    <Volume2 size={13} color="#C8E4D8" />
                    <Text style={styles.heroStatText}>{fa(totalSentenceCount)} جمله</Text>
                  </View>
                </View>
              </View>

              <View style={[styles.heroArtwork, compact && styles.heroArtworkCompact]}>
                <Image source={require('../assets/german-learning-hero.jpg')} resizeMode="cover" style={styles.heroImage} />
                <LinearGradient colors={['rgba(10,38,33,0.01)', 'rgba(10,38,33,0.42)']} style={styles.heroImageShade} />
                <View style={styles.heroArtBadge}>
                  <View style={styles.germanFlag}>
                    <View style={styles.flagBlack} />
                    <View style={styles.flagRed} />
                    <View style={styles.flagGold} />
                  </View>
                  <View style={styles.heroArtBadgeCopy}>
                    <Text style={styles.heroArtBadgeTitle}>DEUTSCH</Text>
                    <Text style={styles.heroArtBadgeSub}>BERLIN · SATZ FÜR SATZ</Text>
                  </View>
                </View>
              </View>
            </View>

            {currentSentence ? (
              <View style={styles.sentenceShowcase}>
                <View style={styles.sentenceShowcaseTop}>
                  <View style={styles.sentenceLabelIcon}><Volume2 size={14} color="#C8E4D8" /></View>
                  <Text style={styles.sentenceLabel}>جملهٔ کلیدی این درس</Text>
                  <Text style={styles.sentenceLabelEn}>BEISPIEL</Text>
                </View>
                <Text style={styles.sentenceGerman}>{currentSentence.text}</Text>
                <Text style={styles.sentencePersian}>{currentSentence.fa}</Text>
                {currentSentence.pattern ? (
                  <View style={styles.sentencePattern}>
                    <Text style={styles.sentencePatternLabel}>الگو</Text>
                    <Text style={styles.sentencePatternText}>{currentSentence.pattern}</Text>
                  </View>
                ) : null}
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

            <View style={styles.heroActions}>
              <Pressable accessibilityRole="button" style={({ pressed }) => [styles.continueButton, pressed && styles.buttonPressed]} onPress={() => isCourseComplete ? router.push('/learn/de/library' as never) : openLesson(currentLesson.id)}>
                <LinearGradient colors={['#E6D29B', '#C6A65D']} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.continueButtonGradient}>
                  <Play size={16} color={Palette.forestDeep} fill={Palette.forestDeep} />
                  <Text style={styles.continueButtonText}>{isCourseComplete ? 'بازکردن کتابخانه و مرور' : completed ? 'ادامه یادگیری' : 'شروع اولین درس'}</Text>
                  <ArrowLeft size={17} color={Palette.forestDeep} />
                </LinearGradient>
              </Pressable>
              <View style={styles.sentenceCount}>
                <Text style={styles.sentenceCountValue}>{fa(currentLesson.sentences.length)}</Text>
                <Text style={styles.sentenceCountLabel}>جملهٔ همین درس</Text>
              </View>
            </View>
          </LinearGradient>

          {!!error && (
            <View style={styles.errorCard}>
              <Text accessibilityRole="alert" style={styles.errorText}>{error}</Text>
              <Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable>
            </View>
          )}

          <View style={styles.pathPanel}>
            <View style={styles.panelHeadingRow}>
              <View style={styles.panelHeadingText}>
                <Text style={styles.panelEyebrow}>DER LERNPFAD</Text>
                <Text style={styles.panelTitle}>مسیر جمله‌محور</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.libraryLink} onPress={() => router.push('/learn/de/library' as never)}>
                <Text style={styles.libraryLinkText}>کتابخانه</Text>
                <ChevronLeft size={16} color={Palette.primary} />
              </Pressable>
            </View>

            <View style={styles.railWrap}>
              <EnglishLevelRail
                activeLevelId={currentLevel.id as CourseLevelId}
                counts={levelCounts}
                levels={GERMAN_SENTENCE_LEVELS}
                startLabel="مقدماتی"
                accessibilityLabelPrefix="فهرست درس‌های"
                direction="rtl"
                accentColor={Palette.primary}
                successColor={Palette.success}
                activeLabelColor={Palette.primaryDark}
                numberOffset={1}
                onSelect={openLevel}
              />
            </View>

            <View style={styles.currentLevelRow}>
              <View style={styles.currentLevelCopy}>
                <Text style={styles.currentLevelEyebrow}>اکنون · {currentLevel.cefr}</Text>
                <Text style={styles.currentLevelName}>{currentLevel.title}</Text>
                <Text style={styles.currentLevelDescription}>{currentLevel.description}</Text>
              </View>
              <View style={[styles.levelCountBadge, { backgroundColor: `${GERMAN_LEVEL_GRADIENTS[currentLevel.id][0]}12`, borderColor: `${GERMAN_LEVEL_GRADIENTS[currentLevel.id][0]}38` }]}>
                <Text style={[styles.levelCountValue, { color: GERMAN_LEVEL_GRADIENTS[currentLevel.id][0] }]}>{fa(currentCompleted)} از {fa(currentMetrics.lessonCount)}</Text>
                <View style={styles.levelCountMeta}>
                  <View style={[styles.levelCountDot, { backgroundColor: GERMAN_LEVEL_GRADIENTS[currentLevel.id][0] }]} />
                  <Text style={styles.levelCountLabel}>درس تکمیل‌شده</Text>
                </View>
              </View>
            </View>
            <EnglishProgressTrack value={currentMetrics.lessonCount ? currentCompleted / currentMetrics.lessonCount * 100 : 0} color={GERMAN_LEVEL_GRADIENTS[currentLevel.id][0]} trackColor={Palette.border} />

            <Pressable accessibilityRole="button" accessibilityState={{ expanded: showRoadmap }} style={styles.mapToggle} onPress={() => setShowRoadmap(value => !value)}>
              <View style={styles.mapToggleIcon}><Compass size={16} color={Palette.primary} /></View>
              <View style={styles.mapToggleText}>
                <Text style={styles.mapToggleTitle}>{showRoadmap ? 'بستن نقشهٔ کامل' : 'نمایش نقشهٔ کامل چهار سطح'}</Text>
                <Text style={styles.mapToggleMeta}>{currentLevel.modules.slice(0, 3).join(' · ')}</Text>
              </View>
              {showRoadmap ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.primary} />}
            </Pressable>

            {showRoadmap ? (
              <View style={styles.fullRoadmap}>
                {levelRows.map(row => {
                  const color = GERMAN_LEVEL_GRADIENTS[row.level.id][0];
                  const isComplete = row.metrics.lessonCount > 0 && row.completed === row.metrics.lessonCount;
                  return (
                    <Pressable key={row.level.id} accessibilityRole="button" accessibilityLabel={`فهرست درس‌های ${row.level.cefr}`} style={({ pressed }) => [styles.levelCard, row.level.id === currentLevel.id && styles.levelCardActive, pressed && styles.buttonPressed]} onPress={() => openLevel(row.level.id)}>
                      <View style={[styles.levelNumber, { backgroundColor: `${color}18` }]}>
                        {isComplete ? <Check size={18} color={color} strokeWidth={2.6} /> : <Text style={[styles.levelNumberText, { color }]}>{fa(row.level.id)}</Text>}
                      </View>
                      <View style={styles.levelText}>
                        <View style={styles.levelTitleRow}>
                          <Text style={styles.levelTitle}>{row.level.title}</Text>
                          <Text style={[styles.levelCefr, { color }]}>{row.level.cefr}</Text>
                        </View>
                        <Text style={styles.levelDesc}>{row.level.description}</Text>
                        <Text style={styles.levelStats}>{fa(row.completed)} از {fa(row.metrics.lessonCount)} درس · {fa(row.metrics.sentenceCount)} جمله · {fa(row.metrics.vocabularyCount)} واژه</Text>
                      </View>
                      <ChevronLeft size={18} color={Palette.muted} />
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderCopy}>
              <Text style={styles.sectionEyebrow}>HEUTE IM ÜBERBLICK</Text>
              <Text style={styles.sectionTitle}>برنامه امروز</Text>
            </View>
            <View style={styles.todayPill}>
              <Flame size={14} color={Palette.warning} />
              <Text style={styles.todayPillText}>{fa(dueCount)} جمله آماده مرور</Text>
            </View>
          </View>

          <View style={styles.todayCard}>
            <View style={styles.todayCardTop}>
              <View style={styles.todayMetricCopy}>
                <Text style={styles.todayValue}>{fa(completed)} از {fa(lessonCount)}</Text>
                <Text style={styles.todayLabel}>درس تکمیل‌شده؛ تکمیل یک فعالیت به‌تنهایی به معنی تسلط نیست.</Text>
              </View>
              <View style={styles.todayIcon}><Clock3 size={20} color={Palette.primary} /></View>
            </View>
            <View style={styles.todayProgressRow}>
              <Text style={styles.todayProgressText}>{fa(Math.round(progressPercent))}٪</Text>
              <View style={styles.todayProgressTrack}><EnglishProgressTrack value={progressPercent} color={Palette.primary} trackColor={Palette.border} height={9} /></View>
            </View>
            <View style={styles.todayFootnote}>
              <BookOpen size={14} color={Palette.teal} />
              <Text style={styles.todayFootnoteText}>جمله‌سازی و مرور فاصله‌دار</Text>
            </View>
          </View>

          <View style={[styles.quickRow, compact && styles.quickRowCompact]}>
            <Pressable accessibilityRole="button" style={[styles.quickCard, compact && styles.quickCardCompact]} onPress={() => router.push('/learn/de/workshop' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: Palette.primarySoft }]}><MessageCircle size={19} color={Palette.primary} /></View>
              <View style={styles.quickCopy}><Text style={styles.quickTitle}>کارگاه مکالمه</Text><Text style={styles.quickDesc}>نوشتن و تمرین گفتاریِ خودارزیابی‌شونده</Text></View>
              <ChevronLeft size={17} color={Palette.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" style={[styles.quickCard, compact && styles.quickCardCompact]} onPress={() => router.push('/learn/de/unit?unit=de-a1-skills' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: Palette.tealSoft }]}><BookOpenCheck size={19} color={Palette.teal} /></View>
              <View style={styles.quickCopy}><Text style={styles.quickTitle}>خواندن و پیام‌نویسی</Text><Text style={styles.quickDesc}>تمرین چندمهارتیِ A1</Text></View>
              <ChevronLeft size={17} color={Palette.muted} />
            </Pressable>
            <Pressable accessibilityRole="button" style={[styles.quickCard, compact && styles.quickCardCompact]} onPress={() => router.push('/learn/de/reviews' as never)}>
              <View style={[styles.quickIcon, { backgroundColor: Palette.tealSoft }]}><RefreshCw size={19} color={Palette.teal} /></View>
              <View style={styles.quickCopy}><Text style={styles.quickTitle}>مرور امروز</Text><Text style={styles.quickDesc}>جمله‌های موعدرسیدهٔ همین دوره</Text></View>
              <ChevronLeft size={17} color={Palette.muted} />
            </Pressable>
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel="باز کردن کارگاه تلفظ آلمانی" accessibilityHint="تمرین آواهای مهم آلمانی، تکیه و آهنگ جمله؛ بدون ضبط میکروفن" style={[styles.quickCard, { flex: 0 }, compact && styles.quickCardCompact]} onPress={() => router.push('/learn/de/pronunciation' as never)}>
            <View style={[styles.quickIcon, { backgroundColor: Palette.primarySoft }]}><Volume2 size={19} color={Palette.primary} /></View>
            <View style={styles.quickCopy}><Text style={styles.quickTitle}>کارگاه تلفظ آلمانی</Text><Text style={styles.quickDesc}>تمرین واکه‌ها، ch، تکیه و آهنگ جمله؛ یادداشت شخصی و همگام‌سازی حساب</Text></View>
            <ChevronLeft size={17} color={Palette.muted} />
          </Pressable>

          <Pressable accessibilityRole="button" accessibilityLabel="سنجش آغازین آلمانی برای انتخاب نقطهٔ شروع" style={[styles.quickCard, { flex: 0 }, compact && styles.quickCardCompact]} onPress={() => router.push({ pathname: '/placement', params: { language: 'de' } } as never)}>
            <View style={[styles.quickIcon, { backgroundColor: Palette.primarySoft }]}><Compass size={19} color={Palette.primary} /></View>
            <View style={styles.quickCopy}><Text style={styles.quickTitle}>پیداکردن نقطهٔ شروع</Text><Text style={styles.quickDesc}>سنجش کوتاه و اختیاری برای انتخاب سطح آلمانی</Text></View>
            <ChevronLeft size={17} color={Palette.muted} />
          </Pressable>

          <Pressable accessibilityRole="button" style={[styles.quickCard, { flex: 0 }, compact && styles.quickCardCompact]} onPress={() => router.push('/learn/de/backup' as never)}>
            <View style={[styles.quickIcon, { backgroundColor: Palette.goldSoft }]}><Download size={19} color={Palette.warning} /></View>
            <View style={styles.quickCopy}><Text style={styles.quickTitle}>پشتیبان پیشرفت</Text><Text style={styles.quickDesc}>ذخیره و بازیابی سابقهٔ همین دستگاه</Text></View>
            <ChevronLeft size={17} color={Palette.muted} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="ورود ایمیلی و همگام‌سازی شخصی" style={[styles.quickCard, { flex: 0 }, compact && styles.quickCardCompact]} onPress={() => router.push('/personal-sync' as never)}>
            <View style={[styles.quickIcon, { backgroundColor: Palette.primarySoft }]}><Cloud size={19} color={Palette.primary} /></View>
            <View style={styles.quickCopy}><Text style={styles.quickTitle}>حساب و همگام‌سازی</Text><Text style={styles.quickDesc}>پیشرفت و تلفظ هر دو زبان میان دستگاه‌ها</Text></View>
            <ChevronLeft size={17} color={Palette.muted} />
          </Pressable>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}><Sparkles size={17} color={Palette.warning} /></View>
            <View style={styles.tipCopy}>
              <Text style={styles.tipTitle}>از واژه تا جمله</Text>
              <Text style={styles.tipText}>هر واژه کنار جمله و موقعیت آن می‌آید؛ در هر درس هم جمله‌ها را با واژه‌بانک می‌سازید.</Text>
            </View>
          </View>
          <Text style={styles.todayLabel}>نام‌گذاری سطح‌ها، نقشهٔ داخلی دوره است و گواهی رسمی CEFR نیست.</Text>
          {!progress && !error ? <Text style={styles.loading}>در حال آماده‌کردن مسیر…</Text> : null}
        </View>
      </ScrollView>
      <GermanBottomNav />
    </View>
  );
}
