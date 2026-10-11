import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Home } from 'lucide-react-native';

export type PageNavigationTone = 'light' | 'dark';

/** Compact RTL page controls: previous screen plus the language-selection home. */
export function PageNavigation({
  backFallback = '/languages',
  tone = 'light',
  style,
  onBack,
  accentColor,
  borderColor,
}: {
  backFallback?: string;
  tone?: PageNavigationTone;
  style?: ViewStyle;
  onBack?: () => void;
  accentColor?: string;
  borderColor?: string;
}) {
  const router = useRouter();
  const dark = tone === 'dark';
  const iconColor = dark ? '#F7F5FF' : accentColor ?? '#4F438D';

  return (
    <View style={[styles.row, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="بازگشت به صفحهٔ قبل"
        hitSlop={6}
        onPress={() => onBack ? onBack() : router.canGoBack() ? router.back() : router.replace(backFallback as never)}
        style={({ pressed }) => [styles.button, dark ? styles.buttonDark : styles.buttonLight, !dark && borderColor ? { borderColor } : null, pressed && styles.pressed]}
      >
        <ArrowRight size={19} color={iconColor} strokeWidth={2.4} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="بازگشت به صفحهٔ انتخاب زبان"
        hitSlop={6}
        onPress={() => router.replace('/languages' as never)}
        style={({ pressed }) => [styles.button, dark ? styles.buttonDark : styles.buttonLight, !dark && borderColor ? { borderColor } : null, pressed && styles.pressed]}
      >
        <Home size={18} color={iconColor} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  button: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  buttonLight: { backgroundColor: '#FFFFFF', borderColor: '#E7E2F2' },
  buttonDark: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.18)' },
  pressed: { opacity: .72, transform: [{ scale: .96 }] },
});
