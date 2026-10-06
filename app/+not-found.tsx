import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, Spacing } from '@/lib/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'صفحه یافت نشد' }} />
      <View style={styles.container}>
        <Text style={styles.title}>صفحه مورد نظر یافت نشد</Text>
        <Link href="/" style={styles.link}>
          بازگشت به داشبورد
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[950],
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
  },
  link: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    color: Colors.accent[400],
    marginTop: Spacing.md,
  },
});
