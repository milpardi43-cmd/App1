import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, MessageCircle, RefreshCw } from 'lucide-react-native';
import { Radius, Typography } from '@/lib/theme';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';

const items = [
  { path: '/lang', label: 'یادگیری', icon: BookOpen },
  { path: '/conversations', label: 'مکالمه', icon: MessageCircle },
  { path: '/review', label: 'مرور', icon: RefreshCw },
] as const;

export function AppBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.shell}>
      {items.map((item) => {
        const active = pathname === item.path || pathname.startsWith(`${item.path}/`);
        const Icon = item.icon;
        return (
          <Pressable key={item.path} accessibilityRole="button" accessibilityState={{ selected: active }} style={styles.item} onPress={() => router.replace(item.path as never)}>
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Icon size={19} color={active ? Palette.primary : Palette.muted} strokeWidth={active ? 2.4 : 2} />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    minHeight: 68,
    marginHorizontal: 14,
    marginBottom: 8,
    paddingTop: 7,
    paddingBottom: 9,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
    borderRadius: 22,
    shadowColor: '#1D2345',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  item: { flex: 1, minWidth: 76, alignItems: 'center', gap: 2 },
  iconWrap: {
    width: 42,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: Palette.primarySoft },
  label: { fontFamily: Typography.fontFamily, fontSize: 10, color: Palette.muted },
  labelActive: { color: Palette.primaryDark, fontWeight: Typography.weights.bold },
});
