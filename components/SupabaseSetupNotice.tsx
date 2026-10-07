import { StyleSheet, Text, View } from 'react-native';
import { Database, KeyRound, ShieldCheck } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

/**
 * Shown on every screen whose features live in Supabase (invite codes, private
 * chat, Emma, live calls) while `.env` still has no real project configured.
 *
 * Without it the user only saw a raw network/auth error and had no idea that the
 * fix is three dashboard steps. It is deliberately an on-screen checklist so the
 * app itself explains what is missing.
 */
export function SupabaseSetupNotice() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Database size={20} color={Colors.warning[400]} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>این بخش به اتصال Supabase نیاز دارد</Text>
          <Text style={styles.subtitle}>
            کد دعوت، گفتگوی خصوصی و Emma روی سرور ذخیره می‌شوند، پس بدون این تنظیم کار نمی‌کنند.
          </Text>
        </View>
      </View>

      <View style={styles.steps}>
        <Step index="۱" text="در پروژه Supabase وارد SQL Editor شوید و محتوای فایل supabase/SETUP-COPY-PASTE-ONCE.sql را اجرا کنید. (جدول‌ها و توابع کد دعوت را می‌سازد.)" />
        <Step index="۲" text="در Authentication ← Providers گزینه «Anonymous sign-ins» را روشن کنید." />
        <Step index="۳" text="در Project Settings ← API مقدارهای Project URL و anon key را در فایل .env بگذارید و اپ را با npx expo start -c دوباره اجرا کنید." />
      </View>

      <View style={styles.footer}>
        <KeyRound size={14} color={Colors.neutral[500]} />
        <Text style={styles.footerText}>
          راهنمای کامل تصویری: docs/RAH-ANDAZI-BEDOON-TERMINAL.md — کلید service_role را هرگز در .env یا Git نگذارید.
        </Text>
      </View>

      <View style={styles.footer}>
        <ShieldCheck size={14} color={Colors.success[400]} />
        <Text style={styles.footerText}>
          بخش آموزش زبان (درس‌ها، کوییز، مرور فاصله‌دار) کاملاً آفلاین کار می‌کند و به این تنظیم نیاز ندارد.
        </Text>
      </View>
    </View>
  );
}

function Step({ index, text }: { index: string; text: string }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepIndex}>
        <Text style={styles.stepIndexText}>{index}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.warning[500] + '55',
    backgroundColor: Colors.warning[500] + '0F',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  header: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: Spacing.sm },
  icon: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.warning[500] + '22',
  },
  headerText: { flex: 1 },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[50],
    textAlign: 'right',
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[400],
    textAlign: 'right',
    lineHeight: 19,
    marginTop: 3,
  },
  steps: { gap: Spacing.sm },
  stepRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: Spacing.sm },
  stepIndex: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.warning[500] + '26',
  },
  stepIndexText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.warning[700],
  },
  stepText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[200],
    textAlign: 'right',
    lineHeight: 20,
  },
  footer: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 6 },
  footerText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: 11,
    color: Colors.neutral[500],
    textAlign: 'right',
    lineHeight: 17,
  },
});
