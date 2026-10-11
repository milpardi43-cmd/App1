import { useEffect, useRef, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, usePathname } from 'expo-router';
import { PageNavigation } from '@/components/PageNavigation';
import { GermanBottomNav } from '@/components/GermanBottomNav';
import { GermanPalette as Palette } from '@/components/germanTheme';
import { LtrDirection, Radius, Typography } from '@/lib/theme';

export function GermanCoursePage({
  title,
  subtitle,
  children,
  back = '/learn/de',
  progress,
  footer,
  scrollResetKey,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  back?: string;
  progress?: number;
  footer?: ReactNode;
  scrollResetKey?: string | number;
}) {
  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, [scrollResetKey]);
  const pathname = usePathname();
  const { language } = useLocalSearchParams<{ language?: string }>();
  const isGermanRoute = language === 'de' || pathname.startsWith('/learn/de');
  const normalizedProgress = progress === undefined ? undefined : Math.max(0, Math.min(1, progress));

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <PageNavigation backFallback={back} accentColor={Palette.primary} borderColor={Palette.border} />
        <View style={styles.headerCopy}>
          <Text style={styles.brand}>DEUTSCH LERNEN · KURS</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {normalizedProgress !== undefined ? <Text style={styles.progressPill}>{Math.round(normalizedProgress * 100)}٪</Text> : null}
      </View>
      {normalizedProgress !== undefined ? (
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: normalizedProgress * 100 }} style={styles.track}>
          <View style={[styles.fill, { width: `${normalizedProgress * 100}%` }]} />
        </View>
      ) : null}
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, LtrDirection]}>{children}</View>
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
      {isGermanRoute && normalizedProgress === undefined ? <GermanBottomNav /> : null}
    </View>
  );
}

export function GermanCourseButton({
  title,
  onPress,
  disabled = false,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.buttonSecondary,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.canvas },
  header: { width: '100%', maxWidth: 900, minHeight: 78, alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  headerCopy: { flex: 1, alignItems: 'flex-end', gap: 2 },
  brand: { color: Palette.primary, fontSize: 8, fontWeight: '800', letterSpacing: 1.1, writingDirection: 'ltr' },
  title: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 19, lineHeight: 28, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  subtitle: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, lineHeight: 17, textAlign: 'right', writingDirection: 'rtl' },
  progressPill: { minWidth: 42, paddingHorizontal: 8, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Palette.primarySoft, color: Palette.primaryDark, textAlign: 'center', fontSize: 10, fontWeight: '800', writingDirection: 'rtl' },
  track: { height: 5, width: '100%', backgroundColor: Palette.border, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Palette.primary, alignSelf: 'flex-end' },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  content: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28, gap: 14 },
  footer: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 13, backgroundColor: Palette.canvas, borderTopWidth: 1, borderTopColor: Palette.border },
  card: { width: '100%', padding: 18, borderRadius: 21, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, gap: 12, shadowColor: '#173E34', shadowOpacity: .035, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  heading: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 17, lineHeight: 26, fontWeight: '800', textAlign: 'right', writingDirection: 'rtl' },
  description: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 13, lineHeight: 23, textAlign: 'right', writingDirection: 'rtl' },
  small: { fontFamily: Typography.fontFamily, color: Palette.muted, fontSize: 10, lineHeight: 18, textAlign: 'right', writingDirection: 'rtl' },
  target: { color: Palette.ink, fontSize: 23, lineHeight: 36, fontWeight: '700', textAlign: 'left', writingDirection: 'ltr' },
  pronunciation: { fontFamily: Typography.fontFamily, color: Palette.primary, fontSize: 12, lineHeight: 21, textAlign: 'right', writingDirection: 'rtl' },
  button: { minHeight: 47, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 15, paddingVertical: 11, borderRadius: 14, backgroundColor: Palette.primary },
  buttonSecondary: { backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border },
  buttonDisabled: { opacity: .45 },
  buttonPressed: { opacity: .82, transform: [{ scale: .995 }] },
  buttonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 12, fontWeight: '800', textAlign: 'center', writingDirection: 'rtl' },
  buttonTextSecondary: { color: Palette.primaryDark },
  row: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  pill: { alignSelf: 'flex-start', fontFamily: Typography.fontFamily, color: Palette.primaryDark, fontSize: 10, fontWeight: '700', backgroundColor: Palette.primarySoft, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, textAlign: 'right', writingDirection: 'rtl' },
  notice: { fontFamily: Typography.fontFamily, color: Palette.warning, backgroundColor: Palette.warningSoft, borderWidth: 1, borderColor: '#F2DFC1', padding: 14, borderRadius: 15, fontSize: 11, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  error: { fontFamily: Typography.fontFamily, color: Palette.danger, backgroundColor: Palette.dangerSoft, borderWidth: 1, borderColor: '#F2D1D8', padding: 13, borderRadius: 14, fontSize: 11, lineHeight: 19, textAlign: 'right', writingDirection: 'rtl' },
  word: { color: Palette.ink, fontSize: 20, lineHeight: 30, textAlign: 'left', writingDirection: 'ltr' },
  divider: { height: 1, width: '100%', backgroundColor: Palette.border },
  answerBox: { padding: 16, borderRadius: 15, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  reading: { padding: 16, gap: 12, borderRadius: 16, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border },
  choice: { borderWidth: 1, borderColor: Palette.border, borderRadius: 13, padding: 14, backgroundColor: Palette.surface },
  selected: { borderColor: Palette.primary, backgroundColor: Palette.primarySoft },
  input: { minHeight: 96, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 14, padding: 15, fontSize: 19, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr', textAlignVertical: 'top' },
  tokens: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, ...LtrDirection },
  token: { borderRadius: 11, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 13, paddingVertical: 11 },
  tokenText: { color: Palette.ink, fontSize: 17, writingDirection: 'ltr' },
  feedback: { backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, borderRadius: 16, padding: 16, gap: 13 },
});

export const germanCourseStyles = styles;
