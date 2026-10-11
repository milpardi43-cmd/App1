import { Stack } from 'expo-router';
import { PageNavigation } from '@/components/PageNavigation';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '@/lib/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'صفحه یافت نشد' }} />
      <View style={styles.container}>
        <PageNavigation tone="dark" backFallback="/languages" />
        <Text style={styles.title}>صفحه مورد نظر یافت نشد</Text>
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
});
