import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, Copy, Link2, QrCode, RefreshCw, Send, ShieldCheck, UserPlus } from 'lucide-react-native';
import { claimRealContactInvite, createRealContactInvite } from '@/lib/conversations';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';

export default function InviteContactScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<'invite' | 'join'>('invite');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvite = async () => {
    setBusy(true);
    setError(null);
    try {
      setInviteCode(await createRealContactInvite());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ساخت کد دعوت انجام نشد.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void createInvite();
  }, []);

  const shareInvite = async () => {
    if (!inviteCode) return;
    await Share.share({ message: `برای تمرین خصوصی انگلیسی در Companion English، این کد دعوت را وارد کن: ${inviteCode}` });
  };

  const claimInvite = async () => {
    if (code.length !== 6 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const conversationId = await claimRealContactInvite(code);
      router.replace({ pathname: '/conversations/human/[conversationId]', params: { conversationId } } as never);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'اتصال مخاطب انجام نشد.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}><ArrowRight size={20} color={Colors.neutral[200]} /></Pressable>
        <View style={styles.headerText}><Text style={styles.title}>افزودن مخاطب واقعی</Text><Text style={styles.subtitle}>اتصال فقط با تأیید دوطرفه</Text></View>
      </View>

      <View style={styles.content}>
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, mode === 'invite' && styles.tabActive]} onPress={() => { setMode('invite'); setError(null); }}><Text style={[styles.tabText, mode === 'invite' && styles.tabTextActive]}>دعوت دوست</Text></Pressable>
          <Pressable style={[styles.tab, mode === 'join' && styles.tabActive]} onPress={() => { setMode('join'); setError(null); }}><Text style={[styles.tabText, mode === 'join' && styles.tabTextActive]}>واردکردن کد</Text></Pressable>
        </View>

        {mode === 'invite' ? (
          <View style={styles.card}>
            <View style={styles.icon}><QrCode size={34} color={Colors.primary[400]} /></View>
            <Text style={styles.cardTitle}>کد دعوت شما</Text>
            <Text style={styles.cardDesc}>این کد ۲۴ ساعت اعتبار دارد. آن را فقط برای فرد موردنظرتان ارسال کنید.</Text>
            <View style={styles.codeBox}>
              {busy && !inviteCode ? <ActivityIndicator color={Colors.primary[400]} /> : <Text style={styles.code}>{inviteCode ? toPersianDigits(inviteCode) : '------'}</Text>}
              <Copy size={18} color={Colors.neutral[500]} />
            </View>
            <Pressable style={[styles.primary, !inviteCode && styles.disabled]} disabled={!inviteCode} onPress={() => void shareInvite()}><Send size={18} color={Colors.onColor} /><Text style={styles.primaryText}>ارسال کد دعوت</Text></Pressable>
            {!inviteCode && !busy ? <Pressable style={styles.retry} onPress={() => void createInvite()}><RefreshCw size={15} color={Colors.primary[300]} /><Text style={styles.retryText}>تلاش دوباره</Text></Pressable> : null}
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.icon}><UserPlus size={34} color={Colors.accent[400]} /></View>
            <Text style={styles.cardTitle}>کد دوستتان را وارد کنید</Text>
            <Text style={styles.cardDesc}>پس از تأیید کد، گفتگوی خصوصی شما فوراً ساخته می‌شود.</Text>
            <TextInput style={styles.input} value={code} onChangeText={(text) => setCode(text.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" maxLength={6} placeholder="------" placeholderTextColor={Colors.neutral[700]} textAlign="center" />
            <Pressable style={[styles.primary, (code.length !== 6 || busy) && styles.disabled]} disabled={code.length !== 6 || busy} onPress={() => void claimInvite()}>
              {busy ? <ActivityIndicator color={Colors.onColor} /> : <><Link2 size={18} color={Colors.onColor} /><Text style={styles.primaryText}>اتصال و شروع گفتگو</Text></>}
            </Pressable>
          </View>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.security}><ShieldCheck size={19} color={Colors.success[400]} /><Text style={styles.securityText}>پیام‌ها با قوانین امنیتی Supabase فقط برای دو عضو همان گفتگو قابل مشاهده هستند.</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950] },
  header: { paddingTop: 52, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md, backgroundColor: Colors.neutral[900], borderBottomWidth: 1, borderBottomColor: Colors.neutral[800], flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.neutral[850], alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  title: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', marginTop: 2 },
  content: { flex: 1, padding: Spacing.lg },
  tabs: { flexDirection: 'row-reverse', padding: 4, borderRadius: Radius.lg, backgroundColor: Colors.neutral[900], marginBottom: Spacing.xl },
  tab: { flex: 1, minHeight: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: Colors.neutral[700] },
  tabText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[500] },
  tabTextActive: { color: Colors.neutral[100], fontWeight: Typography.weights.bold },
  card: { borderRadius: Radius.xl, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], padding: Spacing.xl, alignItems: 'center' },
  icon: { width: 70, height: 70, borderRadius: 35, backgroundColor: Colors.primary[500] + '14', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  cardTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xl, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'center' },
  cardDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[500], textAlign: 'center', lineHeight: 22, marginTop: 6 },
  codeBox: { width: '100%', minHeight: 68, borderRadius: Radius.lg, marginVertical: Spacing.xl, backgroundColor: Colors.neutral[900], borderWidth: 1, borderColor: Colors.primary[500] + '50', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  code: { fontSize: 30, fontWeight: '700', letterSpacing: 9, color: Colors.neutral[50] },
  input: { width: '100%', minHeight: 68, borderRadius: Radius.lg, marginVertical: Spacing.xl, backgroundColor: Colors.neutral[900], borderWidth: 1, borderColor: Colors.accent[500] + '50', fontSize: 30, fontWeight: '700', letterSpacing: 9, color: Colors.neutral[50] },
  primary: { width: '100%', minHeight: 50, borderRadius: Radius.lg, backgroundColor: Colors.primary[500], flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.onColor },
  disabled: { opacity: .4 },
  retry: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, marginTop: Spacing.md },
  retryText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.primary[300] },
  error: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.error[300], textAlign: 'center', marginTop: Spacing.md, lineHeight: 21 },
  security: { marginTop: Spacing.lg, borderRadius: Radius.lg, padding: Spacing.md, backgroundColor: Colors.success[500] + '0D', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 8 },
  securityText: { flex: 1, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', lineHeight: 19 },
});
