import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, BookOpenCheck, Check, ChevronDown, ChevronLeft, ChevronUp, Clock3, Play, Sparkles, Volume2 } from 'lucide-react-native';
import { EnglishLevelRail, EnglishProgressTrack, EnglishSectionHeading, displayEnglishModuleLabel, ENGLISH_LEVEL_GRADIENTS } from '@/components/EnglishUI';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { RUSSIAN_LEVELS, RUSSIAN_LESSONS, russianProgress, type RussianLevelId } from '@/lib/languages/russian';
import type { CourseProgress } from '@/lib/courseProgress';
import { loadRussianLessonSession, type RussianLessonSession } from '@/lib/languages/russianStudyState';
import { toPersianDigits as fa } from '@/lib/format';
import { Typography } from '@/lib/theme';

const LESSONS_PER_GROUP = 10;

function lessonStatus(lessonId: string, progress: CourseProgress | null, sessions: Record<string, RussianLessonSession | null>) {
  if (progress?.completedLessonIds.includes(lessonId)) return 'تکمیل‌شده · قابل مرور';
  const session = sessions[lessonId];
  if (session && (session.stage > 0 || session.sentenceIndex > 0)) {
    return `ادامه از مرحله ${fa(session.stage + 1)}، جمله ${fa(session.sentenceIndex + 1)}`;
  }
  return 'شروع درس';
}

export default function RussianLibrary() {
  const router = useRouter();
  const { level } = useLocalSearchParams<{ level?: string }>();
  const [hydrated, setHydrated] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [sessions, setSessions] = useState<Record<string, RussianLessonSession | null>>({});
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => setHydrated(true), []);
  const selected = hydrated ? RUSSIAN_LEVELS.find(item => String(item.id) === String(level)) : undefined;
  const selectedLessons = useMemo(() => selected ? RUSSIAN_LESSONS.filter(item => item.levelId === selected.id) : [], [selected?.id]);
  const lessonGroups = useMemo(() => {
    const groups: typeof selectedLessons[] = [];
    for (let index = 0; index < selectedLessons.length; index += LESSONS_PER_GROUP) groups.push(selectedLessons.slice(index, index + LESSONS_PER_GROUP));
    return groups;
  }, [selectedLessons]);

  useFocusEffect(useCallback(() => {
    let alive = true;
    void Promise.all([
      russianProgress.getCourseProgress(),
      Promise.all(RUSSIAN_LESSONS.map(async lesson => {
        try { return [lesson.id, await loadRussianLessonSession(lesson.id)] as const; }
        catch { return [lesson.id, null] as const; }
      })),
    ]).then(([nextProgress, nextSessions]) => {
      if (!alive) return;
      setProgress(nextProgress);
      setSessions(Object.fromEntries(nextSessions));
      setError('');
    }).catch(() => { if (alive) setError('وضعیت ذخیره‌شده خوانده نشد؛ فهرست درس‌ها همچنان در دسترس است.'); });
    return () => { alive = false; };
  }, [retry]));

  useEffect(() => { setExpandedGroup(0); }, [selected?.id]);

  const completedIds = progress?.completedLessonIds ?? [];
  const firstUnfinished = RUSSIAN_LESSONS.find(item => !completedIds.includes(item.id)) ?? RUSSIAN_LESSONS[RUSSIAN_LESSONS.length - 1];
  const activeLevelId = firstUnfinished.levelId;
  const countFor = (levelId: RussianLevelId) => {
    const lessons = RUSSIAN_LESSONS.filter(item => item.levelId === levelId);
    return { total: lessons.length, completed: lessons.filter(item => completedIds.includes(item.id)).length };
  };
  const sentenceCount = selectedLessons.reduce((count, lesson) => count + lesson.sentences.length, 0);
  const words = new Set(selectedLessons.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  const patternCount = selectedLessons.reduce((count, lesson) => count + lesson.sentences.filter(sentence => !!sentence.pattern).length, 0);
  const allWords = new Set(RUSSIAN_LESSONS.flatMap(lesson => lesson.sentences.flatMap(sentence => sentence.vocabulary.map(item => item.word))));
  const totalSentences = RUSSIAN_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);

  const openLevel = (levelId: RussianLevelId) => router.push(`/learn/ru/library?level=${levelId}` as never);
  const openLesson = (id: string) => router.push(`/learn/ru/lesson?id=${encodeURIComponent(id)}` as never);

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.page}>
          {!selected ? <>
            <View style={styles.topBar}>
              <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace('/learn/ru' as never)}><ChevronLeft size={18} color={Palette.ink} /><Text style={styles.backText}>بازگشت به آموزش روسی</Text></Pressable>
              <Text style={styles.brandEyebrow}>RUSSIAN PATH · MAIN COURSE</Text>
              <Text style={styles.pageTitle}>مسیر یادگیری روسی</Text>
              <Text style={styles.pageIntro}>یک سطح را انتخاب کنید؛ از شناخت خط سیریلیک و نخستین جمله‌ها شروع می‌کنیم و مرحله‌به‌مرحله به موقعیت‌های روزمره می‌رسیم.</Text>
            </View>

            <LinearGradient colors={['#19204C', '#343B8A', '#5148C8']} start={{ x: .95, y: .1 }} end={{ x: .05, y: .95 }} style={styles.overviewHero}>
              <View pointerEvents="none" style={styles.heroOrb} />
              <View style={styles.heroTopRow}><View style={styles.heroIcon}><BookOpenCheck size={18} color="#FFFFFF" /></View><View style={styles.heroPill}><Sparkles size={13} color="#C8C9FF" /><Text style={styles.heroPillText}>۵ سطح در نقشهٔ روسی</Text></View></View>
              <Text style={styles.overviewEyebrow}>FROM THE FIRST SENTENCE ONWARD</Text>
              <Text style={styles.overviewTitle}>از الفبا؛{ '\n' }جمله به جمله</Text>
              <Text style={styles.overviewText}>محتوای موجود از پایه آغاز می‌شود. آمار فقط درس‌ها و جمله‌های منتشرشده را می‌شمارد؛ سطح‌های آینده محتوای ساختگی ندارند.</Text>
              <View style={styles.overviewMetrics}>
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(RUSSIAN_LESSONS.length)}</Text><Text style={styles.overviewMetricLabel}>درس موجود</Text></View><View style={styles.overviewMetricDivider} />
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(totalSentences)}</Text><Text style={styles.overviewMetricLabel}>جملهٔ اصلی</Text></View><View style={styles.overviewMetricDivider} />
                <View style={styles.overviewMetric}><Text style={styles.overviewMetricValue}>{fa(allWords.size)}</Text><Text style={styles.overviewMetricLabel}>واژهٔ یکتا</Text></View>
              </View>
            </LinearGradient>

            <View style={styles.levelRailCard}>
              <EnglishSectionHeading eyebrow="YOUR CURRENT STEP" title="پیشرفت در پنج سطح" detail="این برچسب‌ها نقشهٔ آموزشی داخلی‌اند و گواهی یا ارزیابی رسمی سطح نیستند." />
              <View style={styles.railWrap}>
                <EnglishLevelRail activeLevelId={activeLevelId} counts={Object.fromEntries(RUSSIAN_LEVELS.map(item => [item.id, countFor(item.id)]))} levels={RUSSIAN_LEVELS} onSelect={openLevel} />
              </View>
              <Text style={styles.railCurrent}>اکنون · {RUSSIAN_LEVELS.find(item => item.id === activeLevelId)?.title} · سطح {fa(activeLevelId)}</Text>
            </View>

            <EnglishSectionHeading eyebrow="CHOOSE A LEVEL" title="انتخاب سطح" detail="شمار درس و جمله از محتوای واقعی هر سطح محاسبه می‌شود." />
            <View style={styles.levelList}>
              {RUSSIAN_LEVELS.map(item => {
                const stats = countFor(item.id);
                const sentenceTotal = RUSSIAN_LESSONS.filter(lesson => lesson.levelId === item.id).reduce((count, lesson) => count + lesson.sentences.length, 0);
                const pct = stats.total ? stats.completed / stats.total * 100 : 0;
                return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`فهرست درس‌های ${item.title}`} style={styles.levelOption} onPress={() => openLevel(item.id)}>
                  <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[item.id]} style={styles.levelOptionMark}><Text style={styles.levelOptionNumber}>{fa(item.id)}</Text></LinearGradient>
                  <View style={styles.levelOptionContent}>
                    <View style={styles.levelOptionTitleRow}><Text style={styles.levelOptionTitle}>{item.title}</Text><Text style={[styles.levelOptionBand, { color: item.color }]}>{item.cefr}</Text></View>
                    <Text style={styles.levelOptionDescription}>{item.description}</Text>
                    <View style={styles.levelOptionMeta}><Text style={styles.levelOptionMetaText}>{fa(stats.total)} درس</Text><View style={styles.metaDot} /><Text style={styles.levelOptionMetaText}>{fa(sentenceTotal)} جمله</Text><View style={styles.metaDot} /><Text style={styles.levelOptionMetaText}>{item.status === 'planned' ? 'در نقشهٔ آینده' : `${fa(stats.completed)} تکمیل`}</Text></View>
                    <EnglishProgressTrack value={pct} color={item.color} height={5} />
                  </View>
                  <ChevronLeft size={19} color={Palette.muted} />
                </Pressable>;
              })}
            </View>
          </> : <>
            <View style={styles.selectedTopBar}>
              <Pressable accessibilityRole="button" style={styles.backButton} onPress={() => router.replace('/learn/ru/library' as never)}><ChevronLeft size={18} color={Palette.ink} /><Text style={styles.backText}>همهٔ سطح‌ها</Text></Pressable>
              <Text style={styles.brandEyebrow}>LEVEL {selected.id} · RUSSIAN COURSE MAP</Text>
            </View>

            <LinearGradient colors={ENGLISH_LEVEL_GRADIENTS[selected.id]} start={{ x: .95, y: 0 }} end={{ x: .05, y: 1 }} style={styles.levelHero}>
              <View pointerEvents="none" style={styles.levelHeroOrb} />
              <View style={styles.levelHeroTop}><View style={styles.levelHeroTag}><Text style={styles.levelHeroTagText}>LEVEL {selected.id}</Text></View><Text style={styles.levelHeroBand}>{selected.cefr}</Text></View>
              <Text style={styles.selectedTitle}>{selected.title}</Text>
              <Text style={styles.selectedDescription}>{selected.description}</Text>
              <View style={styles.selectedProgressHeading}><Text style={styles.selectedProgressLabel}>پیشرفت این سطح</Text><Text style={styles.selectedProgressValue}>{fa(countFor(selected.id).completed)} از {fa(selectedLessons.length)} درس</Text></View>
              <View style={styles.selectedProgressTrack}><View style={[styles.selectedProgressFill, { width: `${selectedLessons.length ? countFor(selected.id).completed / selectedLessons.length * 100 : 0}%` }]} /></View>
              <View style={styles.metricGrid}>
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(sentenceCount)}</Text><Text style={styles.heroMetricLabel}>جمله</Text></View><View style={styles.heroMetricDivider} />
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(patternCount)}</Text><Text style={styles.heroMetricLabel}>الگوی ثبت‌شده</Text></View><View style={styles.heroMetricDivider} />
                <View style={styles.heroMetric}><Text style={styles.heroMetricValue}>{fa(words.size)}</Text><Text style={styles.heroMetricLabel}>واژهٔ یکتا</Text></View>
              </View>
            </LinearGradient>

            <View style={styles.focusCard}>
              <View style={styles.focusHeadingRow}><View style={styles.focusIcon}><Sparkles size={17} color={Palette.primary} /></View><View style={styles.focusHeadingCopy}><Text style={styles.focusEyebrow}>LEVEL FOCUS</Text><Text style={styles.focusTitle}>موضوعات این سطح</Text></View></View>
              <Text style={styles.focusDescription}>{selected.description}</Text>
              <View style={styles.moduleGrid}>{selected.modules.map((module, index) => <View key={`${index}-${module}`} style={styles.moduleChip}><View style={[styles.moduleDot, { backgroundColor: selected.color }]} /><Text style={styles.moduleText}>{displayEnglishModuleLabel(module)}</Text></View>)}</View>
              <Text style={styles.focusFootnote}>{selected.status === 'planned' ? 'این سطح بخشی از نقشهٔ آینده است؛ تا زمان تدوین، درس یا جمله‌ای به شمار محتوای موجود اضافه نمی‌شود.' : 'محتوای منتشرشده بر پایهٔ جمله‌های روسی و راهنمای فارسی است؛ این نقشه سنجش رسمی CEFR نیست.'}</Text>
            </View>

            <View style={styles.lessonSectionHeading}><View><Text style={styles.brandEyebrow}>SENTENCE-BASED LESSONS</Text><Text style={styles.lessonSectionTitle}>درس‌ها، به ترتیب</Text></View><View style={styles.lessonCountPill}><BookOpen size={13} color={Palette.primary} /><Text style={styles.lessonCountText}>{fa(selectedLessons.length)} درس</Text></View></View>

            {selectedLessons.length ? <View style={styles.groupList}>{lessonGroups.map((group, index) => {
              const first = group[0];
              const last = group[group.length - 1];
              const groupCompleted = group.filter(item => completedIds.includes(item.id)).length;
              const open = expandedGroup === index;
              return <View key={`${first.id}-${last.id}`} style={styles.group}>
                <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.groupHeader} onPress={() => setExpandedGroup(open ? -1 : index)}>
                  <View style={[styles.groupNumber, open && styles.groupNumberActive]}><Text style={[styles.groupNumberText, open && styles.groupNumberTextActive]}>{fa(index + 1)}</Text></View>
                  <View style={styles.groupHeaderCopy}><Text style={styles.groupTitle}>بخش {fa(index + 1)} · درس‌های {fa(first.order)} تا {fa(last.order)}</Text><Text style={styles.groupMeta}>{fa(group.length)} درس · {fa(groupCompleted)} تکمیل‌شده</Text></View>
                  {open ? <ChevronUp size={18} color={Palette.primary} /> : <ChevronDown size={18} color={Palette.muted} />}
                </Pressable>
                {open && <View style={styles.lessonList}>{group.map(item => {
                  const status = lessonStatus(item.id, progress, sessions);
                  const complete = progress?.completedLessonIds.includes(item.id) ?? false;
                  const resumable = !complete && status.startsWith('ادامه');
                  const sentence = item.sentences[0];
                  return <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`${item.order}. ${item.title}`} style={styles.lessonCard} onPress={() => openLesson(item.id)}>
                    <View style={[styles.lessonOrder, complete && styles.lessonOrderComplete]}>{complete ? <Check size={16} color="#FFFFFF" strokeWidth={3} /> : <Text style={styles.lessonOrderText}>{fa(item.order)}</Text>}</View>
                    <View style={styles.lessonCopy}>
                      <View style={styles.lessonTitleLine}><Text style={styles.lessonTitle}>{item.title}</Text><View style={[styles.lessonStatus, complete && styles.lessonStatusDone, resumable && styles.lessonStatusResume]}><Text style={[styles.lessonStatusText, complete && styles.lessonStatusTextDone, resumable && styles.lessonStatusTextResume]}>{status}</Text></View></View>
                      <Text style={styles.lessonSubtitle}>{item.subtitle}</Text>
                      <View style={styles.lessonSentencePreview}>
                        <View style={styles.lessonSentenceHeader}><Volume2 size={12} color={Palette.primary} /><Text style={styles.lessonSentenceEyebrow}>جملهٔ آغازین</Text></View>
                        <Text style={styles.lessonSentenceRussian}>{sentence.text}</Text>
                        <Text style={styles.lessonSentenceFa}>{sentence.fa}</Text>
                        {!!sentence.vocabulary.length && <View style={styles.lessonVocabRow}>{sentence.vocabulary.slice(0, 3).map(word => <Text key={word.word} style={styles.lessonVocabChip}>{word.word} · {word.meaning}</Text>)}</View>}
                      </View>
                      <View style={styles.lessonFooter}><View style={styles.lessonFooterItem}><Clock3 size={12} color={Palette.muted} /><Text style={styles.lessonFooterText}>{fa(item.durationMinutes)} دقیقه</Text></View><Text style={styles.lessonFooterDot}>·</Text><Text style={styles.lessonFooterText}>{fa(item.sentences.length)} جملهٔ اصلی</Text></View>
                    </View>
                    <View style={styles.lessonPlayIcon}><Play size={13} color={Palette.primary} fill={Palette.primary} /></View>
                  </Pressable>;
                })}</View>}
              </View>;
            })}</View> : <View style={styles.emptyLevel}>
              <View style={styles.emptyIcon}><Sparkles size={24} color={Palette.primary} /></View>
              <Text style={styles.emptyTitle}>درس‌های این سطح هنوز تدوین نشده‌اند</Text>
              <Text style={styles.emptyDescription}>موضوع‌های سطح در نقشه ثبت شده‌اند، اما جمله یا درس ساختگی نمایش داده نمی‌شود. مسیر موجود فعلاً از الفبا تا موقعیت‌های مقدماتی ادامه دارد.</Text>
            </View>}
          </>}
          {!!error && <View style={styles.errorCard}><Text accessibilityRole="alert" style={styles.errorText}>{error}</Text><Pressable accessibilityRole="button" onPress={() => setRetry(value => value + 1)}><Text style={styles.retryText}>تلاش دوباره</Text></Pressable></View>}
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
  backButton: { alignSelf: 'flex-start', minHeight: 38, flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 10, borderRadius: 12, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, marginBottom: 7 },
  backText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, fontWeight: '700', writingDirection: 'rtl' },
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
  railCurrent: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 12, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  levelList: { gap: 9 },
  levelOption: { minHeight: 96, flexDirection: 'row-reverse', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, shadowColor: '#20264A', shadowOpacity: .035, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  levelOptionMark: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  levelOptionNumber: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', writingDirection: 'rtl' },
  levelOptionContent: { flex: 1, gap: 5 },
  levelOptionTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  levelOptionTitle: { flexShrink: 1, fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 14, fontWeight: '800', textAlign: 'right', writingDirection: 'ltr' },
  levelOptionBand: { fontFamily: Typography.fontFamily, fontSize: 9, fontWeight: '800', writingDirection: 'rtl' },
  levelOptionDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, textAlign: 'right', writingDirection: 'rtl' },
  levelOptionMeta: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  levelOptionMetaText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 9, writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Palette.border },
  levelHero: { position: 'relative', overflow: 'hidden', padding: 20, borderRadius: 25, gap: 9, shadowColor: '#24245C', shadowOpacity: .16, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  levelHeroOrb: { position: 'absolute', top: -60, right: -30, width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.10)' },
  levelHeroTop: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  levelHeroTag: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', paddingHorizontal: 10, paddingVertical: 5 },
  levelHeroTagText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: 1, writingDirection: 'ltr' },
  levelHeroBand: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '800', writingDirection: 'ltr' },
  selectedTitle: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 27, lineHeight: 37, fontWeight: '800', textAlign: 'left', writingDirection: 'ltr', marginTop: 4 },
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
  focusEyebrow: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.2, writingDirection: 'ltr' },
  focusTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  focusDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  moduleGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7 },
  moduleChip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, maxWidth: '100%', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  moduleDot: { width: 6, height: 6, borderRadius: 3 },
  moduleText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
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
  lessonStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: Palette.surfaceMuted },
  lessonStatusDone: { backgroundColor: Palette.successSoft },
  lessonStatusResume: { backgroundColor: Palette.warningSoft },
  lessonStatusText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, fontWeight: '700', writingDirection: 'rtl' },
  lessonStatusTextDone: { color: Palette.success },
  lessonStatusTextResume: { color: Palette.warning },
  lessonSentencePreview: { marginTop: 5, padding: 10, borderRadius: 14, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, gap: 4 },
  lessonSentenceHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  lessonSentenceEyebrow: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 8, fontWeight: '800', writingDirection: 'rtl' },
  lessonSentenceRussian: { color: Palette.ink, fontSize: 14, lineHeight: 21, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  lessonSentenceFa: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  lessonVocabRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 2 },
  lessonVocabChip: { fontFamily: Typography.fontFamily, color: Palette.primaryDark, backgroundColor: Palette.primarySoft, fontSize: 8, paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8, writingDirection: 'rtl' },
  lessonFooter: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: 3 },
  lessonFooterItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  lessonFooterText: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 8, writingDirection: 'rtl' },
  lessonFooterDot: { color: Palette.border, fontSize: 11 },
  lessonPlayIcon: { width: 27, height: 27, borderRadius: 9, backgroundColor: Palette.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyLevel: { padding: 24, gap: 11, alignItems: 'center', borderRadius: 21, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surface },
  emptyIcon: { width: 50, height: 50, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: Palette.primarySoft },
  emptyTitle: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, fontWeight: '800', textAlign: 'center', writingDirection: 'rtl' },
  emptyDescription: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  errorCard: { padding: 14, flexDirection: 'row-reverse', alignItems: 'center', gap: 10, borderRadius: 16, backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: '#F5CDD3' },
  errorText: { flex: 1, fontFamily: Typography.fontFamily, color: Palette.danger, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  retryText: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 11, fontWeight: '800', writingDirection: 'rtl' },
});
