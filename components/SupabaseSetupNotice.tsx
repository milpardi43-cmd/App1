import { StyleSheet, Text, View } from 'react-native';
import { Database, KeyRound, ShieldCheck } from 'lucide-react-native';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

/** Missing app configuration is not evidence that the database needs setup again. */
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
            تنظیمات اتصال در این نسخه برنامه موجود نیست. این پیام به معنی حذف یا خراب‌شدن پروژه Supabase شما نیست.
          </Text>
        </View>
      </View>

      <View style={styles.steps}>
        <Text style={styles.subtitle}>اگر قبلاً Supabase را راه‌اندازی کرده‌اید، SQL یا تنظیمات حساب را دوباره اجرا نکنید. باید نشانی پروژه و کلید عمومی همان پروژه در نسخه برنامه بازیابی شوند.</Text>
      </View>

      <View style={styles.footer}>
        <KeyRound size={14} color={Colors.neutral[500]} />
        <Text style={styles.footerText}>
          برای اتصال فقط Project URL و کلید عمومی publishable یا anon لازم است؛ کلید secret یا service_role را وارد یا ارسال نکنید.
        </Text>
      </View>

      <View style={styles.footer}>
        <ShieldCheck size={14} color={Colors.success[400]} />
        <Text style={styles.footerText}>
          کد دعوت به Emma یا سرویس هوش مصنوعی پولی وابسته نیست. محدودیت هزینه نباید اتصال مخاطب را قطع کند.
        </Text>
      </View>
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
