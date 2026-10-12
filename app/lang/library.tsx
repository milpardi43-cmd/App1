import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock3,
  Play,
  Sparkles,
  Volume2,
} from 'lucide-react-native';
import { COURSE_LEVELS, SENTENCE_LESSONS, type CourseLevelId, type SentenceLesson } from '@/lib/courseContent';
import { getCourseProgress, type CourseProgress } from '@/lib/courseProgress';
import { loadStudy, type StudyState } from '@/lib/englishStudyState';
import { ENGLISH_ENGINE_BLUEPRINT, getAdvancedContentComposition, getEnglishLevelMetrics } from '@/lib/englishLearningEngine';
import { ENGLISH_PHONEME_LICENSE } from '@/lib/englishPhonemeLicense';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import {
  ENGLISH_LEVEL_GRADIENTS,
  EnglishLevelRail,
  EnglishProgressTrack,
  EnglishSectionHeading,
  displayEnglishModuleLabel,
} from '@/components/EnglishUI';
import { toPersianDigits } from '@/lib/format';
import { PageNavigation } from '@/components/PageNavigation';

const LESSONS_PER_GROUP = 10;
const sentenceTotal = SENTENCE_LESSONS.reduce((total, lesson) => total + lesson.sentences.length, 0);

function lessonStatus(lesson: SentenceLesson, progress: CourseProgress | null, study: StudyState | null) {
  if (progress?.completedLessonIds.includes(lesson.id)) return 'تکمیل‌شده · قابل مرور';
  const session = study?.sessions[lesson.id];
  if (session && (session.stage > 0 || session.sentenceIndex > 0)) {
    return `ادامه از مرحله ${toPersianDigits(session.stage + 1)}، جمله ${toPersianDigits(session.sentenceIndex + 1)}`;
  }
  return 'شروع درس';
}

export default function EnglishLessonList() {
  const [showLicense, setShowLicense] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(0);
  const { level } = useLocalSearchParams<{ level?: string }>();
  const router = useRouter();
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [study, setStudy] = useState<StudyState | null>(null);
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  const selected = hydrated ? COURSE_LEVELS.find(item => String(item.id) === level) : undefined;
  useEffect(() => {
    let alive = true;
    void Promise.all([getCourseProgress(), loadStudy()]).then(([nextProgress, nextStudy]) => {
      if (alive) { setProgress(nextProgress); setStudy(nextStudy); }
    }).catch(() => {
      if (alive) setError('وضعیت ذخیره‌شده خوانده نشد؛ فهرست همچنان قابل استفاده است.');
    });
    return () => { alive = false; };
  }, []);
  useEffect(() => { setExpandedGroup(0); }, [selected?.id]);

  const lessons = useMemo(() => selected ? SENTENCE_LESSONS.filter(item => item.levelId === selected.id) : [], [selected?.id]);
  const completedIds = progress?.completedLessonIds ?? [];
  const completed = lessons.filter(item => completedIds.includes(item.id)).length;
  const metrics = selected ? getEnglishLevelMetrics(selected.id, completedIds) : null;
  const blueprint = selected ? ENGLISH_ENGINE_BLUEPRINT.find(item => item.levelId === selected.id) : null;
  const advancedComposition = getAdvancedContentComposition();
  const lessonGroups = useMemo(() => {
    const collections = selected?.id === 4
      ? [
          lessons.filter(item => item.contentKind === 'scenario'),
          lessons.filter(item => item.contentKind === 'vocabulary-practice'),
        ]
      : [lessons];
    const groups: typeof lessons[] = [];
    for (const collection of collections) {
      for (let index = 0; index < collection.length; index += LESSONS_PER_GROUP) {
        groups.push(collection.slice(index, index + LESSONS_PER_GROUP));
      }
    }
    return groups;
  }, [lessons, selected?.id]);
  const activeLesson = SENTENCE_LESSONS.find(item => item.id === progress?.currentLessonId) ?? SENTENCE_LESSONS[0];
  const activeLevelId = activeLesson.levelId;
  const counts = Object.fromEntries(COURSE_LEVELS.map(item => {
    const value = getEnglishLevelMetrics(item.id, completedIds);
    return [item.id, { completed: value.completedLessonCount, total: value.lessonCount }];
  }));
  const allWords = new Set(SENTENCE_LESSONS.flatMap(item => item.sentences.flatMap(sentence => sentence.vocabulary.map(word => word.word))));

  const openLevel = (levelId: CourseLevelId) => router.push({ pathname: '/lang/library', params: { level: String(levelId) } } as never);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {!selected ? (
            <>
              <View style={styles.topBar}>
                <PageNavigation backFallback="/lang" />
                <Text style={styles.brandEyebrow}>ENGLISH PATH · MAIN COURSE</Text>
                <Text style={styles.pageTitle}>مسیر یادگیری انگلیسی</Text>
                <Text style={styles.pageIntro}>یک سطح را انتخاب کنید؛ درس‌ها بر اساس موقعیت و جمله پیش می‌روند و واژگان زیر جملهٔ مربوط می‌مانند.</Text>
              </View>

              <LinearGradient colors={['#19204C', '#343B8A', '#5148C8']} start={{ x: .95, y: .1 }} end={{ x: .05, y: .95 }} style={styles.overviewHero}>
                <View pointerEvents="none" style={styles.heroOrb} />
                <View style={styles.heroTopRow}>
                  <View style={styles.heroIcon}><BookOpenCheck size={18} color="#FFFFFF" /></View>
                  <View style={styles.heroPill}><Sparkles size={13} color="#C8C9FF" /><Text style={styles.heroPillText}>۵ سطح آموزشی</Text></View>
                </View>
                <Text style={styles.overviewEyebrow}>FROM THE FIRST SENTENCE ONWARD</Text>
                <Text style={styles.overviewTitle}>یک مسیر روشن؛{ '\n' }جمله به جمله</Text>
                <Text style={styles.overviewText}>ساختار سطح‌ها را ببینید و با محتوای واقعاً موجود در هر مرحله پیش بروید.</Text>
                <View style={styles.overviewMetrics}>
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{toPersianDigits(SENTENCE_LESSONS.length)}</Text><Text style={styles.overviewMetricLabel}>درس موجود</Text></View>
                  <View style={styles.overviewMetricDivider} />
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{toPersianDigits(sentenceTotal)}</Text><Text style={styles.overviewMetricLabel}>جملهٔ اصلی</Text></View>
                  <View style={styles.overviewMetricDivider} />
                  <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{toPersianDigits(allWords.size)}</Text><Text style={styles.overviewMetricLabel}>واژهٔ یکتا</Text></View>
                </View>
              </LinearGradient>

              <View style={styles.levelRailCard}>
                <EnglishSectionHeading eyebrow="YOUR CURRENT STEP" title="پیشرفت در پنج سطح" detail="برای شروع فقط یک سطح را باز کنید؛ لازم نیست همهٔ مسیر را یک‌باره ببینید." />
                <View style={styles.railWrap}><EnglishLevelRail activeLevelId={activeLevelId} counts={counts} direction="rtl" onSelect={openLevel} /></View>
                <Text style={styles.railCurrent}>{COURSE_LEVELS.find(item => item.id === activeLevelId)?.title}</Text>
              </View>

              <EnglishSectionHeading eyebrow="CHOOSE A LEVEL" title="انتخاب سطح" detail="آمار هر کارت از درس‌ها، جمله‌ها و واژه‌های یکتای همان سطح محاسبه می‌شود." />
              <View style={styles.levelList}>
                {COURSE_LEVELS.map(item => {
                  const stats = getEnglishLevelMetrics(item.id, completedIds);
                  const pct = stats.lessonCount ? (stats.completedLessonCount / stats.lessonCount) * 100 : 0;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={`فهرست درس‌های ${item.title}`}
                      style={({ pressed }) => [styles.levelOption, pressed && styles.pressed]}
                      onPress={() => openLevel(item.id)}
                    >
                      <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[item.id]} style={styles.levelOptionMark}>
                        <Text style={styles.levelOptionNumber}>{toPersianDigits(item.id)}</Text>
                      </LinearGradient>
                      <View style={styles.levelOptionContent}>
                        <View style={styles.levelOptionTitleRow}>
                          <Text style={styles.levelOptionTitle}>{item.title}</Text>
                          <Text style={[styles.levelOptionBand, { color: item.color }]}>{item.cefr}</Text>
                        </View>
                        <Text style={styles.levelOptionDescription}>{item.description}</Text>
                        <View style={styles.levelOptionMeta}>
                          <Text style={styles.levelOptionMetaText}>{toPersianDigits(stats.lessonCount)} درس</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{toPersianDigits(stats.sentenceCount)} جمله</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{toPersianDigits(stats.vocabularyCount)} واژهٔ یکتا</Text>
                          <View style={styles.metaDot} />
                          <Text style={styles.levelOptionMetaText}>{toPersianDigits(stats.completedLessonCount)} تکمیل</Text>
                        </View>
                        <EnglishProgressTrack value={pct} color={item.color} height={5} />
                      </View>
                      <ChevronLeft size={19} color={Palette.muted} />
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <>
              <View style={styles.selectedTopBar}>
                <PageNavigation backFallback="/lang/library" />
                <Text style={styles.brandEyebrow}>LEVEL {selected.id} · COURSE MAP</Text>
              </View>

              {metrics && (
                <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[selected.id]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.levelHero}>
                  <View pointerEvents="none" style={styles.levelHeroOrb} />
                  <View style={styles.levelHeroTop}>
                    <View style={styles.levelHeroTag}><Text style={styles.levelHeroTagText}>LEVEL {selected.id}</Text></View>
                    <Text style={styles.levelHeroBand}>{selected.cefr}</Text>
                  </View>
                  <Text style={styles.selectedTitle}>{selected.title}</Text>
                  <Text style={styles.selectedDescription}>{selected.description}</Text>
                  <View style={styles.selectedProgressHeading}>
                    <Text style={styles.selectedProgressLabel}>پیشرفت این سطح</Text>
                    <Text style={styles.selectedProgressValue}>{toPersianDigits(completed)} از {toPersianDigits(lessons.length)} درس</Text>
                  </View>
                  <View style={styles.selectedProgressTrack}><View style={[styles.selectedProgressFill, { width: `${lessons.length ? (completed / lessons.length) * 100 : 0}%` }]} /></View>
                  <View style={styles.metricGrid}>
                    <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{toPersianDigits(metrics.sentenceCount)}</Text><Text style={styles.heroMetricLabel}>جمله</Text></View>
                    <View style={styles.heroMetricDivider} />
                    <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{toPersianDigits(metrics.patternCount)}</Text><Text style={styles.heroMetricLabel}>الگوی ثبت‌شده</Text></View>
                    <View style={styles.heroMetricDivider} />
                    <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{toPersianDigits(metrics.vocabularyCount)}</Text><Text style={styles.heroMetricLabel}>واژهٔ یکتا</Text></View>
                  </View>
                </LinearGradient>
              )}

              <View style={styles.focusCard}>
                <View style={styles.focusHeadingRow}>
                  <View style={styles.focusIcon}><Sparkles size={17} color={Palette.primary} /></View>
                  <View style={styles.focusHeadingCopy}>
                    <Text style={styles.focusEyebrow}>LEVEL FOCUS</Text>
                    <Text style={styles.focusTitle}>موضوعات این سطح</Text>
                  </View>
                </View>
                <Text style={styles.focusDescription}>{selected.description}</Text>
                <View style={styles.moduleGrid}>
                  {(blueprint?.modules ?? selected.modules).map((module, index) => (
                    <View key={`${index}-${module}`} style={styles.moduleChip}>
                      <View style={[styles.moduleDot, { backgroundColor: selected.color }]} />
                      <Text style={styles.moduleText}>{displayEnglishModuleLabel(module)}</Text>
                    </View>
                  ))}
                </View>
                {selected.id === 4 ? (
                  <Text style={styles.focusFootnote}>
                    در دادهٔ فعلی {toPersianDigits(advancedComposition.scenarioLessonCount)} درس سناریومحور و {toPersianDigits(advancedComposition.vocabularyPracticeLessonCount)} مجموعهٔ مرور واژگان وجود دارد. مجموعه‌های مرور شامل مثال‌های مستقل‌اند و گفت‌وگوی پیوسته یا سنجش رسمی محسوب نمی‌شوند؛ برچسب سطح داخلی است.
                  </Text>
                ) : (
                  <Text style={styles.focusFootnote}>موضوعات نقشه، هدف مسیرند؛ شمار درس‌ها، جمله‌ها و واژه‌های یکتای این سطح از محتوای موجود محاسبه شده است.</Text>
                )}
              </View>

              <View style={styles.lessonSectionHeading}>
                <View>
                  <Text style={styles.brandEyebrow}>SENTENCE-BASED LESSONS</Text>
                  <Text style={styles.lessonSectionTitle}>درس‌ها، به ترتیب</Text>
                </View>
                <View style={styles.lessonCountPill}><BookOpen size={13} color={Palette.primary} /><Text style={styles.lessonCountText}>{toPersianDigits(lessons.length)} درس</Text></View>
              </View>

              <View style={styles.groupList}>
                {lessonGroups.map((group, index) => {
                  const first = group[0];
                  const last = group[group.length - 1];
                  const groupCompleted = group.filter(item => completedIds.includes(item.id)).length;
                  const open = expandedGroup === index;
                  const advancedGroup = selected?.id === 4;
                  const groupKind = first.contentKind;
                  const groupNumber = advancedGroup
                    ? lessonGroups.slice(0, index + 1).filter(items => items[0]?.contentKind === groupKind).length
                    : index + 1;
                  const groupTitle = advancedGroup && groupKind === 'scenario'
                    ? `سناریوهای پیشرفته · بستهٔ ${toPersianDigits(groupNumber)}`
                    : advancedGroup && groupKind === 'vocabulary-practice'
                      ? `مرور واژگان · بستهٔ ${toPersianDigits(groupNumber)}`
                      : `بخش ${toPersianDigits(groupNumber)} · درس‌های ${toPersianDigits(first.order)} تا ${toPersianDigits(last.order)}`;
                  return (
                    <View key={`${first.id}-${last.id}`} style={styles.group}>
                      <Pressable accessibilityRole="button" accessibilityLabel={groupTitle} accessibilityState={{ expanded: open }} style={styles.groupHeader} onPress={() => setExpandedGroup(open ? -1 : index)}>
                        <View style={[styles.groupNumber, open && styles.groupNumberActive]}><Text style={[styles.groupNumberText, open && styles.groupNumberTextActive]}>{toPersianDigits(groupNumber)}</Text></View>
                        <View style={styles.groupHeaderCopy}>
                          <Text style={styles.groupTitle}>{groupTitle}</Text>
                          <Text style={styles.groupMeta}>{toPersianDigits(group.length)} درس · {toPersianDigits(groupCompleted)} تکمیل‌شده · درس‌های {toPersianDigits(first.order)} تا {toPersianDigits(last.order)}</Text>
                        </View>
                        {open ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.muted} />}
                      </Pressable>
                      {open && (
                        <View style={styles.lessonList}>
                          {group.map(item => {
                            const status = lessonStatus(item, progress, study);
                            const isComplete = progress?.completedLessonIds.includes(item.id) ?? false;
                            const isResumable = !isComplete && status.startsWith('ادامه');
                            const previewSentence = item.sentences[0];
                            return (
                              <Pressable
                                key={item.id}
                                accessibilityRole="button"
                                accessibilityLabel={`${item.order}. ${item.title}${item.contentKind === 'vocabulary-practice' ? '، مرور واژگان از مثال‌های مستقل' : ''}`}
                                style={({ pressed }) => [styles.lessonCard, pressed && styles.pressed]}
                                onPress={() => router.push({ pathname: '/course/lesson', params: { id: item.id } } as never)}
                              >
                                <View style={[styles.lessonOrder, isComplete && styles.lessonOrderComplete]}>
                                  {isComplete ? <Check size={16} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.lessonOrderText}>{toPersianDigits(item.order)}</Text>}
                                </View>
                                <View style={styles.lessonCopy}>
                                  <View style={styles.lessonTitleLine}>
                                    <Text style={styles.lessonTitle}>{item.title}</Text>
                                    <View style={[styles.lessonStatus, isComplete && styles.lessonStatusDone, isResumable && styles.lessonStatusResume]}>
                                      <Text style={[styles.lessonStatusText, isComplete && styles.lessonStatusTextDone, isResumable && styles.lessonStatusTextResume]}>{status}</Text>
                                    </View>
                                  </View>
                                  <Text style={styles.lessonSubtitle}>{item.subtitle}</Text>
                                  {item.contentKind === 'vocabulary-practice' ? (
                                    <Text style={styles.contentKindNote}>مجموعهٔ مرجع واژگان · مثال‌های مستقل</Text>
                                  ) : null}
                                  {previewSentence ? (
                                    <View style={styles.lessonSentencePreview}>
                                      <View style={styles.lessonSentenceHeader}><Volume2 size={12} color={Palette.primary} /><Text style={styles.lessonSentenceEyebrow}>جملهٔ آغازین</Text></View>
                                      <Text style={styles.lessonSentenceEn}>{previewSentence.en}</Text>
                                      <Text style={styles.lessonSentenceFa}>{previewSentence.fa}</Text>
                                      {!!previewSentence.vocabulary.length && (
                                        <View style={styles.lessonVocabRow}>
                                          {previewSentence.vocabulary.slice(0, 3).map(word => <Text key={word.word} style={styles.lessonVocabChip}>{word.word} · {word.meaning}</Text>)}
                                        </View>
                                      )}
                                    </View>
                                  ) : null}
                                  <View style={styles.lessonFooter}>
                                    <View style={styles.lessonFooterItem}><Clock3 size={12} color={Palette.muted} /><Text style={styles.lessonFooterText}>{toPersianDigits(item.durationMinutes)} دقیقه</Text></View>
                                    <Text style={styles.lessonFooterDot}>·</Text>
                                    <Text style={styles.lessonFooterText}>{toPersianDigits(item.sentences.length)} جملهٔ اصلی</Text>
                                  </View>
                                </View>
                                <View style={styles.lessonPlayIcon}><Play size={13} color={Palette.primary} fill={Palette.primary} /></View>
                              </Pressable>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>

              <View style={styles.licenseArea}>
                <Text style={styles.licenseIntro}>راهنمای واجی درس‌های ۱۰۴ تا ۱۶۱ از واژه‌نامه مشتق شده؛ جایگزین شنیدن نمونه نیست.</Text>
                <Pressable accessibilityRole="button" style={styles.licenseButton} onPress={() => setShowLicense(value => !value)}>
                  <Text style={styles.licenseButtonText}>{showLicense ? 'بستن منبع راهنمای واجی' : 'منبع و مجوز راهنمای واجی'}</Text>
                  {showLicense ? <ChevronUp size={16} color={Palette.primary} /> : <ChevronDown size={16} color={Palette.primary} />}
                </Pressable>
                {showLicense ? <Text style={styles.licenseText}>{ENGLISH_PHONEME_LICENSE}</Text> : null}
              </View>
            </>
          )}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  scrollContent: { flexGrow: 1 },
  page: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 50, gap: 17 },
  topBar: { gap: 4 },
  selectedTopBar: { gap: 5 },
  brandEyebrow: { color: Palette.primary, fontSize: 9, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr' },
  pageTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 29, lineHeight: 39, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  pageIntro: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 13, lineHeight: 23, textAlign: 'right', writingDirection: 'rtl' },
  overviewHero: { position: 'relative', overflow: 'hidden', borderRadius: 25, padding: 20, gap: 10, shadowColor: '#282671', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  heroOrb: { position: 'absolute', top: -50, left: -42, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.09)' },
  heroTopRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  heroIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  heroPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 10, paddingVertical: 6 },
  heroPillText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 10, fontWeight: '700', writingDirection: 'rtl' },
  overviewEyebrow: { color: '#C6C9FF', fontSize: 8, fontWeight: '800', letterSpacing: 1.4, writingDirection: 'ltr', marginTop: 4 },
  overviewTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 26, lineHeight: 38, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  overviewText: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.78)', fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  overviewMetrics: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', marginTop: 5, paddingTop: 13, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  overviewMetric: { flex: 1, alignItems: 'center', gap: 2 },
  overviewMetricValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', writingDirection: 'rtl' },
  overviewMetricLabel: { fontFamily: Typography.fontFamily, color: '#CFD2FF', fontSize: 9, writingDirection: 'rtl' },
  overviewMetricDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.18)' },
  levelRailCard: { padding: 16, gap: 12, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  railWrap: { paddingVertical: 5 },
  railCurrent: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelList: { gap: 9 },
  levelOption: { minHeight: 96, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, shadowColor: '#20264A', shadowOpacity: .035, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  levelOptionMark: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  levelOptionNumber: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', writingDirection: 'rtl' },
  levelOptionContent: { flex: 1, gap: 5 },
  levelOptionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  levelOptionTitle: { flexShrink: 1, fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 14, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelOptionBand: { fontSize: 9, fontWeight: '800', writingDirection: 'ltr' },
  levelOptionDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  levelOptionMeta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  levelOptionMetaText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Palette.border },
  pressed: { opacity: .82, transform: [{ scale: .995 }] },
  levelHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, shadowColor: '#24245C', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  levelHeroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.10)' },
  levelHeroTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  levelHeroTag: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 10, paddingVertical: 5 },
  levelHeroTagText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  levelHeroBand: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '800', writingDirection: 'ltr' },
  selectedTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 27, lineHeight: 37, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr', marginTop: 4 },
  selectedDescription: { fontFamily: Typography.fontFamily, color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  selectedProgressHeading: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  selectedProgressLabel: { fontFamily: Typography.fontFamily, color: '#DCE0FF', fontSize: 10, writingDirection: 'rtl' },
  selectedProgressValue: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  selectedProgressTrack: { height: 7, borderRadius: 999, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.22)' },
  selectedProgressFill: { height: '100%', alignSelf: 'flex-end', borderRadius: 999, backgroundColor: '#B8F28F' },
  metricGrid: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-around', paddingTop: 12, marginTop: 2, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  heroMetric: { flex: 1, alignItems: 'center', gap: 1 },
  heroMetricValue: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', writingDirection: 'rtl' },
  heroMetricLabel: { fontFamily: Typography.fontFamily, color: '#D6D9FF', fontSize: 9, writingDirection: 'rtl' },
  heroMetricDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.18)' },
  focusCard: { padding: 17, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 10 },
  focusHeadingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  focusIcon: { width: 36, height: 36, borderRadius: 13, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  focusHeadingCopy: { flex: 1, alignItems: 'flex-end', gap: 1 },
  focusEyebrow: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.2 },
  focusTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  focusDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  moduleGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7 },
  moduleChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, maxWidth: '100%', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  moduleDot: { width: 6, height: 6, borderRadius: 3 },
  moduleText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, fontWeight: '700', textAlign: 'right', writingDirection: 'ltr' },
  focusFootnote: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, lineHeight: 16, textAlign: 'right', writingDirection: 'rtl' },
  lessonSectionHeading: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 },
  lessonSectionTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 20, lineHeight: 29, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  lessonCountPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, backgroundColor: Palette.primarySoft },
  lessonCountText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  groupList: { gap: 10 },
  group: { gap: 8 },
  groupHeader: { minHeight: 68, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingVertical: 10, borderRadius: 17, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  groupNumber: { width: 36, height: 36, borderRadius: 12, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Palette.border },
  groupNumberActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  groupNumberText: { color: Palette.muted, fontSize: 12, fontWeight: '800', writingDirection: 'rtl' },
  groupNumberTextActive: { color: '#FFFFFF' },
  groupHeaderCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  groupTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  groupMeta: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  lessonList: { gap: 8 },
  lessonCard: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 18, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  lessonOrder: { width: 33, height: 33, borderRadius: 11, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  lessonOrderComplete: { backgroundColor: Palette.success },
  lessonOrderText: { color: Palette.primaryDark, fontSize: 11, fontWeight: '800', writingDirection: 'rtl' },
  lessonCopy: { flex: 1, gap: 4 },
  lessonTitleLine: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  lessonTitle: { fontFamily: Typography.fontFamily, flexShrink: 1, color: Palette.ink, fontSize: 13, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  lessonSubtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  contentKindNote: { alignSelf: 'flex-end', overflow: 'hidden', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: Palette.warningSoft, color: Palette.warning, fontFamily: Typography.fontFamily, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  lessonStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: Palette.surfaceMuted },
  lessonStatusDone: { backgroundColor: Palette.successSoft },
  lessonStatusResume: { backgroundColor: Palette.warningSoft },
  lessonStatusText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, fontWeight: '700', writingDirection: 'rtl' },
  lessonStatusTextDone: { color: Palette.success },
  lessonStatusTextResume: { color: Palette.warning },
  lessonSentencePreview: { marginTop: 5, padding: 10, borderRadius: 14, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, gap: 4 },
  lessonSentenceHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  lessonSentenceEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 8, fontWeight: '800', writingDirection: 'rtl' },
  lessonSentenceEn: { color: Palette.ink, fontSize: 12, lineHeight: 18, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  lessonSentenceFa: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  lessonVocabRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  lessonVocabChip: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, backgroundColor: Palette.primarySoft, fontSize: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, writingDirection: 'rtl' },
  lessonFooter: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: 3 },
  lessonFooterItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  lessonFooterText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, writingDirection: 'rtl' },
  lessonFooterDot: { color: Palette.border, fontSize: 11 },
  lessonPlayIcon: { width: 27, height: 27, borderRadius: 9, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  licenseArea: { gap: 8, marginTop: 4 },
  licenseIntro: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  licenseButton: { minHeight: 44, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, borderRadius: 13, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  licenseButtonText: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
  licenseText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, lineHeight: 18, textAlign: 'left', writingDirection: 'ltr', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  error: { fontFamily: Typography.fontFamily, color: Palette.danger, backgroundColor: Palette.dangerSoft, padding: 12, borderRadius: 12, textAlign: 'right', writingDirection: 'rtl' },
});
