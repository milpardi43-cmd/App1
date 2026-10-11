import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, ChevronDown, ChevronLeft, Globe2, Headphones, Layers3, ShieldCheck, Sparkles, Star } from 'lucide-react-native';
import { LANGUAGES } from '@/lib/languages/catalog';
import { FEATURES } from '@/lib/features';
import { COURSE_LEVELS, SENTENCE_LESSONS, type CourseLevelId } from '@/lib/courseContent';
import { GERMAN_SENTENCE_LESSONS, germanSentenceLevelMetrics } from '@/lib/languages/germanSentenceCourse';
import { toPersianDigits as fa } from '@/lib/format';

const ink = '#24213A';
const muted = '#777388';
const violet = '#7656DF';

const activeLanguages = LANGUAGES.filter(language => language.id !== 'ru' || FEATURES.russianCourse);

const ENGLISH_LEVEL_LABELS: Record<CourseLevelId, string> = {
  0: 'پایه',
  1: 'موقعیت‌های ضروری',
  2: 'روزمره',
  3: 'ارتباط',
  4: 'پیشرفته',
};

const englishLevelSummaries = COURSE_LEVELS.map(level => {
  const lessons = SENTENCE_LESSONS.filter(lesson => lesson.levelId === level.id);
  return {
    id: level.id,
    label: ENGLISH_LEVEL_LABELS[level.id],
    lessonCount: lessons.length,
    sentenceCount: lessons.reduce((count, lesson) => count + lesson.sentences.length, 0),
  };
});
const totalEnglishSentences = englishLevelSummaries.reduce((count, level) => count + level.sentenceCount, 0);
const totalEnglishLessons = englishLevelSummaries.reduce((count, level) => count + level.lessonCount, 0);

const germanLevelSummaries = ([
  { id: 0, label: 'مقدماتی' },
  { id: 1, label: 'پایه (A1)' },
  { id: 2, label: 'روزمره (A2)' },
  { id: 3, label: 'بیان و ارتباط (B1)' },
] as const).map(level => ({ ...level, ...germanSentenceLevelMetrics(level.id) }));
const totalGermanSentences = GERMAN_SENTENCE_LESSONS.reduce((count, lesson) => count + lesson.sentences.length, 0);

const accents = {
  en: {
    ink: '#704FD2', soft: '#F0EAFE', line: '#E1D8FA', gradient: ['#3A216E', '#7753D6', '#A77BE8'],
    greeting: 'Hello!', caption: 'هر جمله، یک شروع تازه', orbit: '#E4C6FF', available: 'مسیر انگلیسی',
  },
  de: {
    ink: '#197D70', soft: '#E6F5EF', line: '#D0E9DF', gradient: ['#124B59', '#1E877B', '#55B6A2'],
    greeting: 'Hallo!', caption: 'قدم‌به‌قدم، از پایه', orbit: '#B8F0CF', available: 'مسیر آلمانی',
  },
  ru: {
    ink: '#4267A8', soft: '#EBF0FA', line: '#D9E3F4', gradient: ['#304A82', '#5278B8', '#83A4D8'],
    greeting: 'Привет!', caption: 'گام‌به‌گام با خط سیریلیک', orbit: '#D5E5FF', available: 'مسیر روسی',
  },
} as const;

function FantasyPortal({ compact, tiny }: { compact: boolean; tiny: boolean }) {
  return (
    <View style={[styles.artStage, compact && styles.artStageCompact, tiny && styles.artStageTiny]} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.artOrbit, compact && styles.artOrbitCompact, tiny && styles.artOrbitTiny]} />
      <Image
        source={require('../assets/language-learning-hero.jpg')}
        resizeMode="cover"
        style={[styles.artImage, compact && styles.artImageCompact, tiny && styles.artImageTiny]}
      />
      <View style={styles.artStarTop}><Star size={15} color="#FFE7A7" fill="#FFE7A7" /></View>
      <View style={styles.artStarSide}><Sparkles size={20} color="#C6F4E5" /></View>
    </View>
  );
}

export default function LanguagesHome() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [hydrated, setHydrated] = useState(false);
  const [details, setDetails] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => setHydrated(true), []);
  const compact = !hydrated || width < 760;
  const tiny = !hydrated || width < 380;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={[styles.page, compact && styles.pageCompact]} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.header, tiny && styles.headerTiny]}>
            <View style={styles.brandRow}>
              <LinearGradient colors={['#9B78F0', '#5E42C5']} style={styles.logo}>
                <Globe2 size={24} color="#FFFFFF" strokeWidth={1.8} />
                <View style={styles.logoSpark}><Sparkles size={10} color="#FFEBA9" fill="#FFEBA9" /></View>
              </LinearGradient>
              <View style={styles.brandCopy}>
                <Text style={[styles.brand, tiny && styles.brandTiny]}>Language Journey</Text>
                <Text style={styles.brandCaption}>دنیای تازه‌ای با هر جمله</Text>
              </View>
            </View>
            <View style={[styles.headerTag, tiny && styles.headerTagTiny]}>
              <View style={styles.liveDot} />
              <Text style={styles.headerTagText}>{tiny ? `${fa(activeLanguages.length)} مسیر` : `${fa(activeLanguages.length)} مسیر آمادهٔ شروع`}</Text>
            </View>
          </View>

          <LinearGradient
            colors={['#17112F', '#29205E', '#4A348F']}
            start={{ x: 0.95, y: 0.08 }}
            end={{ x: 0.05, y: 1 }}
            style={[styles.hero, compact && styles.heroCompact]}
          >
            <View pointerEvents="none" style={styles.heroGlowOne} />
            <View pointerEvents="none" style={styles.heroGlowTwo} />
            <View style={[styles.heroCopy, compact && styles.heroCopyCompact]}>
              <View style={styles.eyebrow}>
                <Sparkles size={14} color="#FFE19A" />
                <Text style={styles.eyebrowText}>یک قدم کوچک، یک دنیای بزرگ</Text>
              </View>
              <Text accessibilityRole="header" style={[styles.title, compact && styles.titleCompact]}>
                کلمات را کشف کن؛{'\n'}<Text style={styles.titleAccent}>دنیاها را باز کن.</Text>
              </Text>
              <Text style={styles.description}>
                مسیر خودت را انتخاب کن؛ با جمله‌های واقعی، صدا و تمرین‌های کوتاه، هر روز کمی جلوتر برو.
              </Text>
              <View style={styles.heroFacts}>
                <View style={styles.fact}>
                  <Layers3 size={15} color="#D8C5FF" />
                  <Text style={styles.factText}>دو مسیر آموزشی</Text>
                </View>
                <View style={styles.factDivider} />
                <View style={styles.fact}>
                  <Headphones size={15} color="#B8F2DD" />
                  <Text style={styles.factText}>صدا و تمرین روزانه</Text>
                </View>
              </View>
            </View>
            <FantasyPortal compact={compact} tiny={tiny} />
            {compact && (
              <View style={styles.mobileTrail} pointerEvents="none" accessibilityElementsHidden>
                <View style={styles.trailDot} /><View style={styles.trailLine} /><View style={[styles.trailDot, styles.trailDotMint]} />
                <Text style={styles.trailText}>شروع سفر تو همین‌جاست</Text>
              </View>
            )}
          </LinearGradient>

          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <View style={styles.sectionEyebrowRow}><Sparkles size={13} color={violet} /><Text style={styles.sectionEyebrow}>CHOOSE YOUR JOURNEY</Text></View>
              <Text style={styles.sectionTitle}>کدام دنیا را باز کنیم؟</Text>
              <Text style={styles.sectionSubtitle}>یک زبان انتخاب کن و سفر خودت را شروع کن.</Text>
            </View>
            {!tiny && <View style={styles.sectionCount}><Text style={styles.sectionCountText}>{fa(activeLanguages.length)} / مسیرهای فعال</Text></View>}
          </View>

          <View style={[styles.cards, compact && styles.cardsCompact]}>
            {activeLanguages.map(language => {
              const accent = accents[language.id as keyof typeof accents];
              const active = hovered === language.id || focused === language.id;
              return (
                <Pressable
                  key={language.id}
                  accessibilityRole="button"
                  accessibilityLabel={`ورود به آموزش ${language.name}`}
                  accessibilityHint={`باز کردن درس‌ها و مرور ${language.name}`}
                  onHoverIn={() => setHovered(language.id)}
                  onHoverOut={() => setHovered(null)}
                  onFocus={() => setFocused(language.id)}
                  onBlur={() => setFocused(null)}
                  onPress={() => router.push(language.home as never)}
                  style={({ pressed }) => [
                    styles.card,
                    compact && styles.cardCompact,
                    { borderColor: active ? accent.ink : accent.line },
                    active && styles.cardActive,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <LinearGradient colors={accent.gradient} start={{ x: 0.95, y: 0 }} end={{ x: 0.05, y: 1 }} style={styles.cardCover}>
                    <View pointerEvents="none" style={[styles.coverOrb, { borderColor: accent.orbit }]} />
                    <View pointerEvents="none" style={[styles.coverGlow, { backgroundColor: accent.orbit }]} />
                    <View style={styles.cardTop}>
                      <View style={styles.languageIcon}><Text style={[styles.code, { color: accent.ink }]}>{language.id.toUpperCase()}</Text></View>
                      <View style={styles.available}>
                        <View style={styles.smallDot} />
                        <Text style={styles.availableText}>{accent.available}</Text>
                      </View>
                    </View>
                    <View style={styles.cardGreetingRow}>
                      <View style={styles.greetingOrb}><BookOpen size={20} color="#FFFFFF" /></View>
                      <View style={styles.greetingWrap}>
                        <Text style={styles.greeting}>{accent.greeting}</Text>
                        <Text style={styles.greetingCaption}>{accent.caption}</Text>
                      </View>
                    </View>
                    <View style={styles.coverSparkle}><Sparkles size={17} color="#FFF0BA" /></View>
                  </LinearGradient>

                  <View style={[styles.cardBody, compact && styles.cardBodyCompact]}>
                    <View style={styles.cardIdentity}>
                      <View style={styles.languageIdentity}>
                        <Text style={styles.languageName}>{language.name}</Text>
                        <Text style={[styles.nativeName, { color: accent.ink }]}>{language.nativeName}</Text>
                      </View>
                      <View style={[styles.cardBadge, { backgroundColor: accent.soft }]}><Text style={[styles.cardBadgeText, { color: accent.ink }]}>مسیر مستقل</Text></View>
                    </View>
                    <Text style={styles.cardDescription}>{language.description}</Text>
                    <View style={styles.meta}>
                      <View style={styles.metaItem}><BookOpen size={14} color={muted} /><Text style={styles.metaText}>{fa(language.lessonsCount)} درس</Text></View>
                      <View style={styles.metaDot} />
                      <View style={styles.metaItem}><Headphones size={14} color={muted} /><Text style={styles.metaText}>تلفظ صوتی</Text></View>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaText}>راهنمای فارسی</Text>
                    </View>
                    <View style={[styles.enter, { backgroundColor: accent.ink }]}>
                      <Text style={styles.enterText}>شروع سفر {language.name}</Text>
                      <View style={styles.enterIcon}><ChevronLeft size={18} color="#FFFFFF" /></View>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.reassurance, compact && styles.reassuranceCompact]}>
            <View style={styles.shield}><ShieldCheck size={20} color="#527745" /></View>
            <View style={styles.reassuranceCopy}>
              <Text style={styles.reassuranceTitle}>دو زبان، دو مسیر روشن</Text>
              <Text style={styles.reassuranceText}>درس‌ها و پیشرفت هر زبان جدا ذخیره می‌شوند؛ انتخاب مسیر دیگر، قدم‌های قبلی‌ات را پاک نمی‌کند.</Text>
            </View>
          </View>

          <View style={styles.note}>
            <Pressable accessibilityRole="button" accessibilityLabel="اطلاعات مسیرهای انگلیسی و آلمانی" accessibilityState={{ expanded: details }} onPress={() => setDetails(!details)} style={styles.noteToggle}>
              <View style={styles.noteLabel}>
                <BookOpen size={17} color={muted} />
                <View style={styles.noteCopy}>
                  <Text style={styles.noteTitle}>مسیرهای انگلیسی و آلمانی · سطح‌ها و دامنهٔ محتوا</Text>
                  <Text style={styles.noteCaption}>کتابخانه‌های فعال · شمار درس‌ها و جمله‌ها</Text>
                </View>
              </View>
              <ChevronDown size={18} color={muted} style={{ transform: [{ rotate: details ? '180deg' : '0deg' }] }} />
            </Pressable>
            {details && (
              <View style={styles.noteDetails}>
                <View style={[styles.courseDetailsCard, styles.englishDetailsCard]}>
                  <View style={styles.courseDetailsHeader}>
                    <Text style={styles.courseDetailsTitle}>مسیر انگلیسی</Text>
                    <Text style={styles.courseDetailsTotal}>{fa(totalEnglishLessons)} درس · {fa(totalEnglishSentences)} جمله</Text>
                  </View>
                  <Text style={styles.courseDetailsIntro}>تقسیم‌بندی درس‌ها در پنج مرحلهٔ آموزشی:</Text>
                  <View style={styles.levelSummaryList}>
                    {englishLevelSummaries.map(level => (
                      <View key={level.id} style={styles.levelSummaryRow}>
                        <Text style={styles.levelSummaryName}>{level.label}</Text>
                        <Text style={styles.levelSummaryStats}>{fa(level.lessonCount)} درس · {fa(level.sentenceCount)} جمله</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.courseDetailsCard, styles.germanDetailsCard]}>
                  <View style={styles.courseDetailsHeader}>
                    <Text style={styles.courseDetailsTitle}>مسیر آلمانی</Text>
                    <Text style={styles.courseDetailsTotal}>{fa(GERMAN_SENTENCE_LESSONS.length)} درس · {fa(totalGermanSentences)} جمله</Text>
                  </View>
                  <Text style={styles.courseDetailsIntro}>تقسیم‌بندی چهار مرحلهٔ آموزشی، همراه با شمار واژگان یکتا:</Text>
                  <View style={styles.levelSummaryList}>
                    {germanLevelSummaries.map(level => (
                      <View key={level.id} style={styles.levelSummaryRow}>
                        <Text style={styles.levelSummaryName}>{level.label}</Text>
                        <Text style={styles.levelSummaryStats}>
                          {fa(level.lessonCount)} درس · {fa(level.sentenceCount)} جمله · {fa(level.vocabularyCount)} واژهٔ یکتا
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <Text style={styles.noteFootnote}>
                  کتابخانهٔ هدایت‌شدهٔ قدیمی آلمانی برای سازگاری جدا نگهداری می‌شود و در این آمار نیست. نام‌گذاری سطح‌ها آموزشی و داخلی است و گواهی رسمی CEFR یا بازبینی مستقل مدرس به‌شمار نمی‌آید.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.footerText}>با قدم‌های کوچک، هر روز کمی جلوتر.</Text>
            <Sparkles size={14} color="#A89BD0" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8F6FB' },
  page: { flexGrow: 1, paddingHorizontal: 40, paddingTop: 24, paddingBottom: 36 },
  pageCompact: { paddingHorizontal: 18, paddingTop: 16 },
  content: { width: '100%', maxWidth: 1120, alignSelf: 'center' },
  header: { minHeight: 55, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 26 },
  headerTiny: { alignItems: 'stretch', flexDirection: 'column', gap: 8 },
  brandRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  logo: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  logoSpark: { position: 'absolute', right: -3, top: -3, width: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#423478' },
  brandCopy: { alignItems: 'flex-end' },
  brand: { color: ink, fontSize: 18, fontWeight: '800', letterSpacing: -.5, textAlign: 'right', writingDirection: 'ltr' },
  brandTiny: { fontSize: 15 },
  brandCaption: { fontFamily: 'Vazirmatn', color: muted, fontSize: 10, marginTop: 2, textAlign: 'right', writingDirection: 'rtl' },
  headerTag: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 24, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#ECE7F3' },
  headerTagTiny: { alignSelf: 'flex-end', paddingHorizontal: 9, paddingVertical: 6 },
  headerTagText: { fontFamily: 'Vazirmatn', color: '#695C84', fontSize: 10, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#81A869' },
  hero: { position: 'relative', minHeight: 330, overflow: 'hidden', borderRadius: 30, borderWidth: 1, borderColor: '#514382', paddingHorizontal: 34, paddingVertical: 27, flexDirection: 'row-reverse', alignItems: 'center', gap: 16, shadowColor: '#231752', shadowOpacity: .18, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 6 },
  heroCompact: { minHeight: 0, paddingHorizontal: 19, paddingVertical: 22, borderRadius: 25, flexDirection: 'column', alignItems: 'stretch', gap: 7 },
  heroGlowOne: { position: 'absolute', top: -126, right: '28%', width: 315, height: 315, borderRadius: 158, backgroundColor: 'rgba(156,119,250,0.18)' },
  heroGlowTwo: { position: 'absolute', bottom: -172, left: -74, width: 330, height: 330, borderRadius: 165, backgroundColor: 'rgba(78,213,189,0.12)' },
  heroCopy: { flex: 1, alignItems: 'flex-end', gap: 11, zIndex: 2 },
  heroCopyCompact: { width: '100%' },
  eyebrow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  eyebrowText: { fontFamily: 'Vazirmatn', color: '#FFE9B4', fontSize: 10, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  title: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 37, lineHeight: 58, fontWeight: '900', textAlign: 'right', writingDirection: 'rtl', letterSpacing: -.7 },
  titleCompact: { fontSize: 28, lineHeight: 44 },
  titleAccent: { color: '#D8C4FF' },
  description: { maxWidth: 480, alignSelf: 'flex-end', fontFamily: 'Vazirmatn', color: '#E1DAF7', fontSize: 12, lineHeight: 24, textAlign: 'right', writingDirection: 'rtl' },
  heroFacts: { flexDirection: 'row-reverse', flexWrap: 'wrap', alignItems: 'center', gap: 11, marginTop: 3 },
  fact: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  factText: { fontFamily: 'Vazirmatn', color: '#EEE9FF', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  factDivider: { height: 13, width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  artStage: { position: 'relative', width: 300, height: 280, alignItems: 'center', justifyContent: 'center' },
  artStageCompact: { width: '100%', height: 226 },
  artStageTiny: { height: 190 },
  artOrbit: { position: 'absolute', width: 252, height: 252, borderRadius: 126, borderWidth: 1, borderColor: 'rgba(223,206,255,0.4)', backgroundColor: 'rgba(255,255,255,0.035)' },
  artOrbitCompact: { width: 220, height: 220, borderRadius: 110 },
  artOrbitTiny: { width: 184, height: 184, borderRadius: 92 },
  artImage: { width: 252, height: 252, borderRadius: 32, borderWidth: 1, borderColor: 'rgba(241,229,255,0.35)' },
  artImageCompact: { width: 220, height: 220, borderRadius: 28 },
  artImageTiny: { width: 184, height: 184, borderRadius: 24 },
  artStarTop: { position: 'absolute', top: 17, right: 35 },
  artStarSide: { position: 'absolute', bottom: 25, left: 18 },
  mobileTrail: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 15, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.14)' },
  trailDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#E2C1FF' },
  trailDotMint: { backgroundColor: '#9FE5CD' },
  trailLine: { width: 24, height: 1, backgroundColor: 'rgba(226,193,255,0.65)' },
  trailText: { fontFamily: 'Vazirmatn', color: '#D8D0F0', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  section: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 31, marginBottom: 17 },
  sectionHeading: { flex: 1, alignItems: 'flex-end', gap: 3 },
  sectionEyebrowRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  sectionEyebrow: { color: '#897BAA', fontSize: 8, fontWeight: '900', letterSpacing: 1.25, textAlign: 'right', writingDirection: 'ltr' },
  sectionTitle: { fontFamily: 'Vazirmatn', color: ink, fontSize: 21, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  sectionSubtitle: { fontFamily: 'Vazirmatn', color: muted, fontSize: 10, textAlign: 'right', writingDirection: 'rtl' },
  sectionCount: { minHeight: 34, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 12, backgroundColor: '#F0ECF8' },
  sectionCountText: { fontFamily: 'Vazirmatn', color: '#7A6A9B', fontSize: 9, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  cards: { flexDirection: 'row-reverse', gap: 19 },
  cardsCompact: { flexDirection: 'column', gap: 14 },
  card: { flex: 1, borderRadius: 24, borderWidth: 1, backgroundColor: '#FFFFFF', overflow: 'hidden', shadowColor: '#32284E', shadowOpacity: .06, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  cardCompact: { flexGrow: 0, flexShrink: 0, flexBasis: 'auto', width: '100%' },
  cardActive: { shadowOpacity: .15, shadowRadius: 21, shadowOffset: { width: 0, height: 8 }, elevation: 5 },
  cardPressed: { opacity: .92, transform: [{ scale: .992 }] },
  cardCover: { position: 'relative', minHeight: 165, overflow: 'hidden', padding: 19, justifyContent: 'space-between' },
  coverOrb: { position: 'absolute', top: -55, left: 80, width: 210, height: 210, borderRadius: 105, borderWidth: 1, opacity: .5 },
  coverGlow: { position: 'absolute', right: -45, bottom: -100, width: 220, height: 220, borderRadius: 110, opacity: .14 },
  cardTop: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 },
  languageIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', shadowColor: '#1A1730', shadowOpacity: .17, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  code: { fontSize: 12, fontWeight: '900', letterSpacing: 1, textAlign: 'right', writingDirection: 'ltr' },
  available: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  availableText: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 9, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  smallDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#D5F6C7' },
  cardGreetingRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, zIndex: 1 },
  greetingOrb: { width: 40, height: 40, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.17)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
  greetingWrap: { alignItems: 'flex-end', gap: 2 },
  greeting: { color: '#FFFFFF', fontSize: 31, fontWeight: '800', letterSpacing: -.8, textAlign: 'right', writingDirection: 'ltr' },
  greetingCaption: { fontFamily: 'Vazirmatn', color: 'rgba(255,255,255,0.82)', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  coverSparkle: { position: 'absolute', left: 24, top: 72, opacity: .88 },
  cardBody: { padding: 20, paddingTop: 17, gap: 12 },
  cardBodyCompact: { padding: 17, gap: 10 },
  cardIdentity: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 9 },
  languageIdentity: { alignItems: 'flex-end' },
  languageName: { fontFamily: 'Vazirmatn', color: ink, fontSize: 25, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  nativeName: { fontSize: 11, fontWeight: '700', letterSpacing: .3, textAlign: 'right', writingDirection: 'ltr' },
  cardBadge: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 11 },
  cardBadgeText: { fontFamily: 'Vazirmatn', fontSize: 8, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  cardDescription: { fontFamily: 'Vazirmatn', color: muted, fontSize: 11, lineHeight: 22, textAlign: 'right', writingDirection: 'rtl' },
  meta: { flexDirection: 'row-reverse', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  metaItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Vazirmatn', color: muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#C8C2D2' },
  enter: { minHeight: 47, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 13, paddingVertical: 8, borderRadius: 14, marginTop: 1 },
  enterText: { fontFamily: 'Vazirmatn', color: '#FFFFFF', fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  enterIcon: { width: 29, height: 29, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.18)' },
  reassurance: { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginTop: 20, padding: 15, borderRadius: 18, backgroundColor: '#EEF4E9', borderWidth: 1, borderColor: '#E0EBD9' },
  reassuranceCompact: { alignItems: 'flex-start' },
  shield: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  reassuranceCopy: { flex: 1, gap: 2 },
  reassuranceTitle: { fontFamily: 'Vazirmatn', color: '#516A45', fontSize: 10, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  reassuranceText: { fontFamily: 'Vazirmatn', color: '#718168', fontSize: 9, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  note: { borderTopWidth: 1, borderTopColor: '#E7E1ED', marginTop: 11 },
  noteToggle: { minHeight: 66, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 15 },
  noteLabel: { flex: 1, flexDirection: 'row-reverse', alignItems: 'center', gap: 10 },
  noteCopy: { flex: 1, gap: 2 },
  noteTitle: { fontFamily: 'Vazirmatn', color: '#5C536A', fontSize: 11, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  noteCaption: { fontFamily: 'Vazirmatn', color: '#8B8397', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  noteDetails: { gap: 10, paddingBottom: 12 },
  courseDetailsCard: { padding: 14, borderRadius: 16, borderWidth: 1 },
  englishDetailsCard: { backgroundColor: '#F3EFFC', borderColor: '#E3DAF7' },
  germanDetailsCard: { backgroundColor: '#EEF6F0', borderColor: '#DDEBDD' },
  courseDetailsHeader: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 5 },
  courseDetailsTitle: { fontFamily: 'Vazirmatn', color: ink, fontSize: 11, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  courseDetailsTotal: { fontFamily: 'Vazirmatn', color: '#695C84', fontSize: 9, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  courseDetailsIntro: { fontFamily: 'Vazirmatn', color: muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl', marginTop: 7 },
  levelSummaryList: { marginTop: 5 },
  levelSummaryRow: { minHeight: 29, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, paddingVertical: 5, borderTopWidth: 1, borderTopColor: 'rgba(110,100,130,0.11)' },
  levelSummaryName: { flexShrink: 0, fontFamily: 'Vazirmatn', color: '#50475F', fontSize: 9, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  levelSummaryStats: { flexShrink: 1, fontFamily: 'Vazirmatn', color: muted, fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
  noteFootnote: { fontFamily: 'Vazirmatn', color: muted, fontSize: 9, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl', paddingHorizontal: 4 },
  footer: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10, paddingBottom: 16 },
  footerLine: { width: 24, height: 1, backgroundColor: '#D3CBDD' },
  footerText: { fontFamily: 'Vazirmatn', color: '#9990A7', fontSize: 9, textAlign: 'right', writingDirection: 'rtl' },
});
