import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, MessageCircle, RefreshCw } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

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
          <Pressable key={item.path} style={styles.item} onPress={() => router.replace(item.path as never)}>
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <Icon size={20} color={active ? Colors.onColor : Colors.neutral[500]} strokeWidth={active ? 2.4 : 2} />
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
    minHeight: 76,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.neutral[900],
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[800],
  },
  item: { minWidth: 76, alignItems: 'center', gap: 3 },
  iconWrap: {
    width: 42,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: Colors.accent[500] },
  label: { fontFamily: Typography.fontFamily, fontSize: 11, color: Colors.neutral[500] },
  labelActive: { color: Colors.neutral[100], fontWeight: Typography.weights.bold },
});
