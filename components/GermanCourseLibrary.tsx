import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, BookOpenCheck, Check, ChevronDown, ChevronLeft, ChevronUp, Play, Sparkles, Volume2 } from 'lucide-react-native';
import {
  EnglishLevelRail,
  EnglishProgressTrack,
  EnglishSectionHeading,
  displayEnglishModuleLabel,
} from '@/components/EnglishUI';
import { GermanPalette as Palette, GERMAN_LEVEL_GRADIENTS } from '@/components/germanTheme';
import { GermanBottomNav } from '@/components/GermanBottomNav';
import type { CourseLevelId } from '@/lib/courseContent';
import { toPersianDigits as fa } from '@/lib/format';
import { PageNavigation } from '@/components/PageNavigation';
import {
  GERMAN_SENTENCE_LEVELS,
  GERMAN_SENTENCE_LESSONS,
  germanSentenceLevelMetrics,
  getGermanSentenceResumeLesson,
  type GermanSentenceCourseLevel,
  type GermanSentenceLevelId,
} from '@/lib/languages/germanSentenceCourse';
import { germanProgress } from '@/lib/languages/catalog';
import type { CourseProgress } from '@/lib/createCourseProgressStore';

function resolveLevel(value?: string): GermanSentenceLevelId | null {
  if (value === undefined) return null;
  const byLabel = GERMAN_SENTENCE_LEVELS.find(level => level.cefr === value || level.title === value);
  if (byLabel) return byLabel.id;
  const number = Number(value);
  return GERMAN_SENTENCE_LEVELS.some(level => level.id === number) ? number as GermanSentenceLevelId : null;
}

function levelStatus(level: GermanSentenceCourseLevel) {
  return `${level.cefr} · ${fa(germanSentenceLevelMetrics(level.id).lessonCount)} درس`;
}

export default function GermanCourseLibrary() {
  const router = useRouter();
  const { level: levelParam } = useLocalSearchParams<{ level?: string }>();
  const selectedLevelId = resolveLevel(levelParam);
  const selectedLevel = selectedLevelId === null ? undefined : GERMAN_SENTENCE_LEVELS.find(level => level.id === selectedLevelId);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void germanProgress.getCourseProgress().then(value => {
      if (alive) { setProgress(value); setError(''); }
    }).catch(() => {
      if (alive) setError('پیشرفت ذخیره‌شده خوانده نشد؛ فهرست درس‌ها همچنان قابل استفاده است.');
    });
    return () => { alive = false; };
  }, [retry]));

  useEffect(() => setExpandedGroup(0), [selectedLevel?.id]);

  const selectedLessons = useMemo(
    () => selectedLevel ? GERMAN_SENTENCE_LESSONS.filter(lesson => lesson.levelId === selectedLevel.id) : [],
    [selectedLevel?.id],
  );
  const lessonGroups = useMemo(() => {
    const groups: typeof selectedLessons[] = [];
    for (let index = 0; index < selectedLessons.length; index += 5) groups.push(selectedLessons.slice(index, index + 5));
    return groups;
  }, [selectedLessons]);
  const completedIds = progress?.completedLessonIds ?? [];

  const levelRows = GERMAN_SENTENCE_LEVELS.map(level => {
    const lessons = GERMAN_SENTENCE_LESSONS.filter(lesson => lesson.levelId === level.id);
    const metrics = germanSentenceLevelMetrics(level.id);
    const completed = lessons.filter(lesson => completedIds.includes(lesson.id)).length;
    return { level, lessons, metrics, completed };
  });
  const activeLesson = getGermanSentenceResumeLesson(progress?.currentLessonId, completedIds);
  const activeLevelId = activeLesson?.levelId ?? 0;
  const railCounts = Object.fromEntries(levelRows.map(row => [row.level.id, {
    completed: row.completed,
    total: row.metrics.lessonCount,
  }])) as Partial<Record<CourseLevelId, { completed: number; total: number }>>;
  const selectedMetrics = selectedLevel ? germanSentenceLevelMetrics(selectedLevel.id) : null;
  const selectedCompleted = selectedLessons.filter(lesson => completedIds.includes(lesson.id)).length;
  const selectedPercent = selectedMetrics?.lessonCount ? selectedCompleted / selectedMetrics.lessonCount * 100 : 0;

  const openLevel = (id: number) => router.push(`/learn/de/library?level=${id}` as never);
  const openLesson = (id: string) => router.push({
    pathname: '/learn/[language]/lesson',
    params: { language: 'de', id },
  } as never);
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {!selectedLevel ? (
            <>
              <View style={styles.topBar}>
                <PageNavigation backFallback="/learn/de" accentColor={Palette.primary} borderColor={Palette.border} />
                <Text style={styles.brandEyebrow}>DEUTSCH · SATZKURS</Text>
                <Text style={styles.pageTitle}>مسیر جمله‌محور آلمانی</Text>
                <Text style={styles.pageIntro}>هر درس از جمله‌های واقعی، معنی، تلفظ، الگوی جمله و واژگان همان بافت ساخته شده است.</Text>
              </View>

              <LinearGradient colors={['#102F29', '#1A594B', '#367A63']} start={{ x: .95, y: .1 }} end={{ x: .05, y: .95 }} style={styles.overviewHero}>
                <View pointerEvents="none" style={styles.heroOrb} />
                <View style={styles.overviewTopRow}>
                  <View style={styles.overviewIcon}><BookOpenCheck size={18} color="#FFFFFF" /></View>
                  <View style={styles.heroPill}><Sparkles size={13} color={Palette.gold} /><Text style={styles.heroPillText}>۴ سطح آموزشی</Text></View>
                </View>
                <Text style={styles.overviewEyebrow}>DEUTSCH LERNEN · IM KONTEXT</Text>
                <Text style={styles.overviewTitle}>جمله بسازید؛{ '\n' }واژه را در بافت یاد بگیرید</Text>
                <Text style={styles.overviewText}>از عبارت‌های کوتاه آغاز کنید و قدم‌به‌قدم به روایت تجربه، بیان نظر و ساخت جمله‌های پیوسته برسید.</Text>
                <View style={styles.overviewMetrics}>
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(GERMAN_SENTENCE_LESSONS.length)}</Text><Text style={styles.overviewMetricLabel}>درس جمله‌محور</Text></View>
                  <View style={styles.overviewMetricDivider} />
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(GERMAN_SENTENCE_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0))}</Text><Text style={styles.overviewMetricLabel}>جملهٔ نمونه</Text></View>
                  <View style={styles.overviewMetricDivider} />
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(new Set(GERMAN_SENTENCE_LESSONS.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(word => word.word)))).size)}</Text><Text style={styles.overviewMetricLabel}>مدخل واژگانی یکتا</Text></View>
                </View>
              </LinearGradient>

              <View style={styles.levelRailCard}>
                <EnglishSectionHeading eyebrow="DEIN LERNWEG" title="پیشرفت در چهار مرحله" detail="مسیر بر اساس درس‌های همین دوره محاسبه می‌شود؛ می‌توانید هر سطحی را مستقیم باز کنید." accentColor={Palette.primary} />
                <View style={styles.railWrap}>
                  <EnglishLevelRail activeLevelId={activeLevelId as CourseLevelId} counts={railCounts} levels={GERMAN_SENTENCE_LEVELS} startLabel="مقدماتی" direction="rtl" accentColor={Palette.primary} successColor={Palette.success} activeLabelColor={Palette.primaryDark} numberOffset={1} onSelect={openLevel} />
                </View>
                <Text style={styles.railCurrent}>{activeLesson ? GERMAN_SENTENCE_LEVELS.find(level => level.id === activeLesson.levelId)?.title : GERMAN_SENTENCE_LEVELS[0].title}</Text>
              </View>

              <EnglishSectionHeading eyebrow="STUFE WÄHLEN" title="انتخاب سطح" detail="درس‌ها، جمله‌ها و واژگان هر کارت از محتوای همین دوره محاسبه می‌شود." accentColor={Palette.primary} />
              <View style={styles.levelList}>
                {levelRows.map(({ level, metrics, completed }) => {
                  const percent = metrics.lessonCount ? completed / metrics.lessonCount * 100 : 0;
                  const color = GERMAN_LEVEL_GRADIENTS[level.id as GermanSentenceLevelId][0];
                  return (
                    <Pressable
                      key={level.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${level.cefr}`}
                      style={({ pressed }) => [styles.levelOption, pressed && styles.pressed]}
                      onPress={() => openLevel(level.id)}
                    >
                      <LinearGradient colors={GERMAN_LEVEL_GRADIENTS[level.id as GermanSentenceLevelId]} style={styles.levelOptionMark}>
                        <Text style={styles.levelOptionNumber}>{fa(level.id + 1)}</Text>
                      </LinearGradient>
                      <View style={styles.levelOptionContent}>
                        <View style={styles.levelOptionTitleRow}>
                          <Text style={styles.levelOptionTitle}>{level.title}</Text>
                          <Text style={[styles.levelOptionBand, { color }]}>{level.cefr}</Text>
                        </View>
                        <Text style={styles.levelOptionDescription}>{level.description}</Text>
                        <View style={styles.levelOptionMeta}>
                          <Text style={styles.levelOptionStatus}>{levelStatus(level)}</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{fa(metrics.lessonCount)} درس</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{fa(metrics.sentenceCount)} جمله</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{fa(metrics.vocabularyCount)} مدخل</Text>
                        </View>
                        <EnglishProgressTrack value={percent} color={color} trackColor={Palette.border} height={5} />
                      </View>
                      <ChevronLeft size={19} color={Palette.muted} />
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.disclaimer}>این سطح‌بندی، نقشهٔ آموزشی داخلی برنامه است و گواهی یا اعتبارسنجی رسمی CEFR نیست.</Text>
            </>
          ) : (
            <>
              <View style={styles.selectedTopBar}>
                <PageNavigation backFallback="/learn/de/library" accentColor={Palette.primary} borderColor={Palette.border} />
                <Text style={styles.brandEyebrow}>DEUTSCHE LERNSTUFE {selectedLevel.id + 1}</Text>
              </View>

              <LinearGradient colors={GERMAN_LEVEL_GRADIENTS[selectedLevel.id as GermanSentenceLevelId]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.levelHero}>
                <View pointerEvents="none" style={styles.levelHeroOrb} />
                <View style={styles.levelHeroTop}>
                  <View style={styles.levelHeroTag}><Text style={styles.levelHeroTagText}>{selectedLevel.title.toUpperCase()}</Text></View>
                  <Text style={styles.levelHeroBand}>{selectedLevel.cefr}</Text>
                </View>
                <Text style={styles.selectedTitle}>{selectedLevel.title}</Text>
                <Text style={styles.selectedDescription}>{selectedLevel.description}</Text>
                <View style={styles.selectedProgressHeading}>
                  <Text style={styles.selectedProgressLabel}>پیشرفت این سطح</Text>
                  <Text style={styles.selectedProgressValue}>{fa(selectedCompleted)} از {fa(selectedMetrics?.lessonCount ?? 0)} درس</Text>
                </View>
                <View style={styles.selectedProgressTrack}><View style={[styles.selectedProgressFill, { width: `${Math.min(100, selectedPercent)}%` }]} /></View>
                <View style={styles.metricGrid}>
                  <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(selectedMetrics?.lessonCount ?? 0)}</Text><Text style={styles.heroMetricLabel}>درس</Text></View>
                  <View style={styles.heroMetricDivider} />
                  <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(selectedMetrics?.sentenceCount ?? 0)}</Text><Text style={styles.heroMetricLabel}>جمله</Text></View>
                  <View style={styles.heroMetricDivider} />
                  <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(selectedMetrics?.vocabularyCount ?? 0)}</Text><Text style={styles.heroMetricLabel}>مدخل واژگانی یکتا</Text></View>
                </View>
              </LinearGradient>

              <View style={styles.focusCard}>
                <View style={styles.focusHeadingRow}>
                  <View style={styles.focusIcon}><Sparkles size={17} color={Palette.primary} /></View>
                  <View style={styles.focusHeadingCopy}>
                    <Text style={styles.focusEyebrow}>THEMEN DIESER STUFE</Text>
                    <Text style={styles.focusTitle}>موضوع‌های این مرحله</Text>
                  </View>
                </View>
                <Text style={styles.focusDescription}>{selectedLevel.description}</Text>
                <View style={styles.moduleGrid}>
                  {selectedLevel.modules.map((module, index) => (
                    <View key={`${selectedLevel.id}-${index}-${module}`} style={styles.moduleChip}>
                      <View style={[styles.moduleDot, { backgroundColor: GERMAN_LEVEL_GRADIENTS[selectedLevel.id as GermanSentenceLevelId][0] }]} />
                      <Text style={styles.moduleText}>{displayEnglishModuleLabel(module)}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.focusFootnote}>هر موضوع از جمله‌های ثبت‌شده در همین مرحله می‌آید؛ نمونه‌ها و واژه‌های هر درس کنار هم می‌مانند.</Text>
              </View>

              <View style={styles.lessonSectionHeading}>
                <View>
                  <Text style={styles.brandEyebrow}>LEKTIONEN · SATZ FÜR SATZ</Text>
                  <Text style={styles.lessonSectionTitle}>درس‌ها، به ترتیب</Text>
                </View>
                <View style={styles.lessonCountPill}><BookOpen size={13} color={Palette.primary} /><Text style={styles.lessonCountText}>{fa(selectedMetrics?.lessonCount ?? 0)} درس</Text></View>
              </View>

              {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
              <View style={styles.groupList}>
                {lessonGroups.map((group, groupIndex) => {
                  const first = group[0];
                  const last = group[group.length - 1];
                  if (!first || !last) return null;
                  const completed = group.filter(lesson => completedIds.includes(lesson.id)).length;
                  const sentenceCount = group.reduce((count, lesson) => count + lesson.sentences.length, 0);
                  const expanded = expandedGroup === groupIndex;
                  return (
                    <View key={`${first.id}-${last.id}`} style={styles.group}>
                      <Pressable accessibilityRole="button" accessibilityState={{ expanded }} style={styles.groupHeader} onPress={() => setExpandedGroup(expanded ? -1 : groupIndex)}>
                        <View style={[styles.groupNumber, expanded && { backgroundColor: GERMAN_LEVEL_GRADIENTS[selectedLevel.id as GermanSentenceLevelId][0] }]}>
                          <Text style={[styles.groupNumberText, expanded && styles.groupNumberTextActive]}>{fa(groupIndex + 1)}</Text>
                        </View>
                        <View style={styles.groupHeaderCopy}>
                          <Text style={styles.groupTitle}>بخش {fa(groupIndex + 1)} · درس‌های {fa(first.order)} تا {fa(last.order)}</Text>
                          <Text style={styles.groupMeta}>{fa(group.length)} درس · {fa(completed)} تکمیل‌شده · {fa(sentenceCount)} جمله</Text>
                        </View>
                        {expanded ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.muted} />}
                      </Pressable>
                      {expanded ? (
                        <View style={styles.lessonList}>
                          {group.map(lesson => {
                            const complete = completedIds.includes(lesson.id);
                            const preview = lesson.sentences[0];
                            return (
                              <Pressable key={lesson.id} accessibilityRole="button" accessibilityLabel={`${lesson.order}. ${lesson.title}`} style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]} onPress={() => openLesson(lesson.id)}>
                                <View style={[styles.lessonOrder, complete && styles.lessonOrderComplete]}>
                                  {complete ? <Check size={15} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.lessonOrderText}>{fa(lesson.order)}</Text>}
                                </View>
                                <View style={styles.lessonCopy}>
                                  <View style={styles.lessonTitleLine}>
                                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                                    <View style={[styles.lessonStatus, complete && styles.lessonStatusDone]}>
                                      <Text style={[styles.lessonStatusText, complete && styles.lessonStatusTextDone]}>{complete ? 'تکمیل‌شده · قابل مرور' : 'شروع درس'}</Text>
                                    </View>
                                  </View>
                                  <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                                  {preview ? (
                                    <View style={styles.lessonSentencePreview}>
                                      <View style={styles.lessonSentenceHeader}><Volume2 size={13} color={Palette.primary} /><Text style={styles.lessonSentenceEyebrow}>جملهٔ نمونه</Text></View>
                                      <Text style={styles.lessonSentenceGerman}>{preview.text}</Text>
                                      <Text style={styles.lessonSentenceFa}>{preview.fa}</Text>
                                      <View style={styles.vocabularyRow}>
                                        {preview.vocabulary.slice(0, 3).map(item => <Text key={`${preview.id}-${item.word}`} style={styles.vocabularyChip}>{item.word} · {item.meaning}</Text>)}
                                      </View>
                                    </View>
                                  ) : null}
                                  {preview?.pattern ? <Text style={styles.lessonPattern}>الگو: {preview.pattern}</Text> : null}
                                </View>
                                <View style={styles.lessonPlayIcon}><Play size={12} color={Palette.primary} fill={Palette.primary} /></View>
                              </Pressable>
                            );
                          })}
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>
              <Text style={styles.disclaimer}>این سطح‌بندی نقشهٔ آموزشی داخلی برنامه است؛ گواهی یا اعتبارسنجی رسمی CEFR نیست.</Text>
            </>
          )}
          {error && !selectedLevel ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          {progress === null && !error ? <Text style={styles.loading}>در حال خواندن پیشرفت آلمانی…</Text> : null}
          {error ? <Pressable accessibilityRole="button" style={styles.retryButton} onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable> : null}
        </View>
      </ScrollView>
      <GermanBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 26, gap: 18 },
  topBar: { alignItems: 'flex-end', gap: 5 },
  selectedTopBar: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  brandEyebrow: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr', textAlign: 'right' },
  pageTitle: { fontFamily: 'Vazirmatn', color: Palette.ink, fontSize: 26, lineHeight: 37, fontWeight: '800', writingDirection: 'rtl', textAlign: 'right' },
  pageIntro: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 12, lineHeight: 21, writingDirection: 'rtl', textAlign: 'right' },
  overviewHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, borderWidth: 1, borderColor: 'rgba(215,180,107,0.35)', shadowColor: '#113A32', shadowOpacity: .2, shadowRadius: 20, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  heroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(215,180,107,0.12)' },
  overviewTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  overviewIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' },
  heroPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  heroPillText: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 9, fontWeight: '700', writingDirection: 'rtl' },
  overviewEyebrow: { color: '#E6D39B', fontSize: 8, fontWeight: '900', letterSpacing: 1.15, writingDirection: 'ltr', marginTop: 5 },
  overviewTitle: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 25, lineHeight: 37, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  overviewText: { fontFamily: 'Vazirmatn', color: 'rgba(255,255,255,0.78)', fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  overviewMetrics: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingTop: 11, marginTop: 3, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  overviewMetric: { flex: 1, alignItems: 'center', gap: 2 },
  overviewMetricValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', writingDirection: 'rtl' },
  overviewMetricLabel: { fontFamily: 'Vazirmatn', color: '#D7E8DB', fontSize: 9, writingDirection: 'rtl' },
  overviewMetricDivider: { width: 1, height: 29, backgroundColor: 'rgba(255,255,255,0.2)' },
  levelRailCard: { padding: 16, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 12 },
  railWrap: { paddingVertical: 1 },
  railCurrent: { fontFamily: 'Vazirmatn', color: Palette.primaryDark, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  levelList: { gap: 9 },
  levelOption: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, padding: 12, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  levelOptionMark: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  levelOptionNumber: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  levelOptionContent: { flex: 1, gap: 4 },
  levelOptionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  levelOptionTitle: { flexShrink: 1, fontFamily: 'Vazirmatn', color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  levelOptionBand: { fontSize: 9, fontWeight: '800', writingDirection: 'ltr' },
  levelOptionDescription: { fontFamily: 'Vazirmatn', color: Palette.text, fontSize: 10, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  levelOptionMeta: { flexDirection: 'row-reverse', alignItems: 'center', flexWrap: 'wrap', gap: 5 },
  levelOptionStatus: { fontFamily: 'Vazirmatn', color: Palette.primaryDark, fontSize: 8, fontWeight: '800', writingDirection: 'ltr' },
  levelOptionMetaText: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 8, writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Palette.border },
  pressed: { opacity: .82, transform: [{ scale: .995 }] },
  levelHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, borderWidth: 1, borderColor: 'rgba(215,180,107,0.34)', shadowColor: '#113A32', shadowOpacity: .18, shadowRadius: 20, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  levelHeroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(215,180,107,0.13)' },
  levelHeroTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  levelHeroTag: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 10, paddingVertical: 5 },
  levelHeroTagText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: .5, writingDirection: 'rtl' },
  levelHeroBand: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '800', writingDirection: 'ltr' },
  selectedTitle: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 26, lineHeight: 37, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl', marginTop: 4 },
  selectedDescription: { fontFamily: 'Vazirmatn', color: 'rgba(255,255,255,0.8)', fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  selectedProgressHeading: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  selectedProgressLabel: { fontFamily: 'Vazirmatn', color: '#DFEDE3', fontSize: 10, writingDirection: 'rtl' },
  selectedProgressValue: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  selectedProgressTrack: { height: 7, borderRadius: 999, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.22)' },
  selectedProgressFill: { height: '100%', borderRadius: 999, backgroundColor: Palette.gold, alignSelf: 'flex-end' },
  metricGrid: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12, marginTop: 2, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  heroMetric: { flex: 1, alignItems: 'center', gap: 1 },
  heroMetricValue: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', writingDirection: 'rtl' },
  heroMetricLabel: { fontFamily: 'Vazirmatn', color: '#D7E8DB', fontSize: 9, writingDirection: 'rtl' },
  heroMetricDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.18)' },
  focusCard: { padding: 17, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10 },
  focusHeadingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  focusIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  focusHeadingCopy: { flex: 1, alignItems: 'flex-end', gap: 1 },
  focusEyebrow: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  focusTitle: { fontFamily: 'Vazirmatn', color: Palette.ink, fontSize: 16, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  focusDescription: { fontFamily: 'Vazirmatn', color: Palette.text, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  moduleGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7 },
  moduleChip: { maxWidth: '100%', flexDirection: 'row-reverse', alignItems: 'center', flexWrap: 'wrap', gap: 5, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 12, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  moduleDot: { width: 6, height: 6, borderRadius: 3 },
  moduleText: { fontFamily: 'Vazirmatn', color: Palette.text, fontSize: 9, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  focusFootnote: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  lessonSectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  lessonSectionTitle: { fontFamily: 'Vazirmatn', color: Palette.ink, fontSize: 19, lineHeight: 28, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  lessonCountPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: Palette.primarySoft },
  lessonCountText: { fontFamily: 'Vazirmatn', color: Palette.primaryDark, fontSize: 9, fontWeight: '800', writingDirection: 'rtl' },
  groupList: { gap: 10 },
  group: { gap: 8 },
  groupHeader: { minHeight: 68, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  groupNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Palette.border },
  groupNumberText: { color: Palette.muted, fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  groupNumberTextActive: { color: '#FFFFFF' },
  groupHeaderCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  groupTitle: { fontFamily: 'Vazirmatn', color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  groupMeta: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  lessonList: { gap: 8 },
  lessonCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 9, padding: 11, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  lessonOrder: { width: 31, height: 31, borderRadius: 10, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  lessonOrderComplete: { backgroundColor: Palette.success },
  lessonOrderText: { color: Palette.primaryDark, fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  lessonCopy: { flex: 1, gap: 4 },
  lessonTitleLine: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 5 },
  lessonTitle: { flexShrink: 1, fontFamily: 'Vazirmatn', color: Palette.ink, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  lessonStatus: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 999, backgroundColor: Palette.surfaceMuted },
  lessonStatusDone: { backgroundColor: Palette.successSoft },
  lessonStatusText: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 7, fontWeight: '700', writingDirection: 'rtl' },
  lessonStatusTextDone: { color: Palette.success },
  lessonSentencePreview: { marginTop: 3, padding: 9, borderRadius: 13, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, gap: 3 },
  lessonSentenceHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  lessonSentenceEyebrow: { fontFamily: 'Vazirmatn', color: Palette.primary, fontSize: 7, fontWeight: '800', writingDirection: 'rtl' },
  lessonSentenceGerman: { color: Palette.ink, fontSize: 12, lineHeight: 18, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  lessonSentenceFa: { fontFamily: 'Vazirmatn', color: Palette.text, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  vocabularyRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  vocabularyChip: { fontFamily: 'Vazirmatn', color: Palette.primaryDark, backgroundColor: Palette.primarySoft, fontSize: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, writingDirection: 'rtl' },
  lessonPattern: { fontFamily: 'Vazirmatn', color: Palette.primaryDark, fontSize: 8, lineHeight: 14, textAlign: 'right', writingDirection: 'rtl', marginTop: 2 },
  lessonPlayIcon: { width: 27, height: 27, borderRadius: 9, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  error: { fontFamily: 'Vazirmatn', color: Palette.danger, backgroundColor: Palette.dangerSoft, padding: 12, borderRadius: 12, textAlign: 'right', writingDirection: 'rtl', fontSize: 10, lineHeight: 17 },
  loading: { fontFamily: 'Vazirmatn', color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  retryButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: Palette.primarySoft },
  retryText: { fontFamily: 'Vazirmatn', color: Palette.primary, fontWeight: '800', fontSize: 10, writingDirection: 'rtl' },
});
