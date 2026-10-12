import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Cloud, LockKeyhole, Mail, RefreshCw, ShieldCheck, Smartphone, UserRound, X } from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { isSupabaseConfigured } from '@/lib/pairing';
import { syncPersonalLearningData } from '@/lib/personalLearningSync';
import { supabase } from '@/lib/supabase';

const configured = isSupabaseConfigured();

type Step = 'email' | 'code';

export default function PersonalSyncScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [lastSynced, setLastSynced] = useState('');

  const runSync = useCallback(async () => {
    setSyncing(true);
    setError('');
    setMessage('در حال ادغام غیرحذفی پیشرفت دو زبان و یادداشت‌های تلفظ…');
    try {
      const result = await syncPersonalLearningData();
      if (result.status === 'signed-out') {
        setAccountEmail('');
        setMessage('برای همگام‌سازی، ابتدا با ایمیل وارد شوید. سابقهٔ محلی شما محفوظ است.');
        return;
      }
      setAccountEmail(result.email);
      setLastSynced(result.updatedAt);
      setMessage('پیشرفت آموزشی تکمیل‌شدهٔ انگلیسی و آلمانی و یادداشت‌های تلفظ با حساب شما همگام شد.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'همگام‌سازی انجام نشد؛ سابقهٔ محلی حفظ شده است.');
      setMessage('همگام‌سازی کامل نشد؛ دادهٔ محلی روی همین دستگاه محفوظ است.');
    } finally {
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setAccountEmail(session?.user.email ?? '');
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const signedInEmail = data.session?.user.email ?? '';
      setAccountEmail(signedInEmail);
      if (signedInEmail) void runSync();
    }).catch(() => undefined);
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [runSync]);

  const requestCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!configured) {
      setError('ابتدا اتصال عمومی Supabase را در تنظیمات محیطی اپ وارد کنید؛ کلید محرمانه لازم نیست.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setError('یک نشانی ایمیل معتبر وارد کنید.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: { shouldCreateUser: true },
      });
      if (authError) throw authError;
      setEmail(normalizedEmail);
      setCode('');
      setStep('code');
      setMessage(`کد یک‌بارمصرف به ${normalizedEmail} فرستاده شد. پوشهٔ هرزنامه را هم بررسی کنید.`);
    } catch {
      setError('ارسال کد انجام نشد. تنظیم Email OTP، قالب ایمیل و محدودیت ارسال پروژهٔ Supabase را بررسی کنید.');
    } finally {
      setBusy(false);
    }
  };

  const verifyCode = async () => {
    const token = code.replace(/\D/g, '').trim();
    if (!token) {
      setError('کدی را که در ایمیل دریافت کردید وارد کنید.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const { data, error: authError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: 'email',
      });
      if (authError || !data.session) throw authError ?? new Error('Session was not returned');
      setAccountEmail(data.user?.email ?? email.trim().toLowerCase());
      setMessage('ایمیل تأیید شد؛ پیشرفت محلی با دادهٔ حساب ادغام می‌شود و چیزی با ورود حذف نخواهد شد.');
      await runSync();
    } catch {
      setError('کد معتبر نیست یا منقضی شده است. کد تازه بگیرید و دوباره امتحان کنید.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    setError('');
    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) throw authError;
      setAccountEmail('');
      setLastSynced('');
      setMessage('از حساب خارج شدید؛ پیشرفت محلی روی این دستگاه پاک نشده است.');
    } catch {
      setError('خروج از حساب انجام نشد. اتصال شبکه را بررسی کنید.');
    } finally {
      setBusy(false);
    }
  };

  const close = () => router.canGoBack() ? router.back() : router.replace('/languages' as never);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.page}>
            <View style={styles.top}>
              <PageNavigation backFallback="/languages" />
              <Pressable accessibilityRole="button" accessibilityLabel="بستن و بازگشت" onPress={close} style={styles.close}>
                <X size={18} color="#5E6071" />
              </Pressable>
            </View>

            <View style={styles.hero}>
              <View style={styles.heroIcon}><Cloud size={24} color="#FFFFFF" strokeWidth={2} /></View>
              <Text accessibilityRole="header" style={styles.title}>حساب شخصی و همگام‌سازی</Text>
              <Text style={styles.subtitle}>یک ورود ایمیلی برای همگام‌سازی پیشرفت آموزشی و خودارزیابی تلفظ انگلیسی و آلمانی میان دستگاه‌های شما.</Text>
              <View style={styles.privacyPill}><ShieldCheck size={15} color="#D6F2E6" /><Text style={styles.privacyText}>خصوصی برای حساب واردشده · بدون رمز عبور</Text></View>
            </View>

            <View style={styles.card}>
              {accountEmail ? (
                <>
                  <View style={styles.accountRow}>
                    <View style={styles.accountIcon}><UserRound size={19} color="#396C58" /></View>
                    <View style={styles.accountText}>
                      <Text style={styles.eyebrow}>حساب فعال</Text>
                      <Text style={styles.accountEmail}>{accountEmail}</Text>
                    </View>
                    <View style={styles.onlineDot} />
                  </View>
                  <View style={styles.rule} />
                  <View style={styles.scopeRow}><Smartphone size={17} color="#67677A" /><Text style={styles.scopeText}>پیشرفت درس‌ها و سنجش‌های تکمیل‌شده، مرورهای زمان‌بندی‌شده، زمان مطالعه و یادداشت‌های تلفظ هر دو زبان</Text></View>
                  <Pressable accessibilityRole="button" accessibilityState={{ disabled: syncing || busy }} disabled={syncing || busy} onPress={() => void runSync()} style={({ pressed }) => [styles.primaryButton, (syncing || busy) && styles.buttonDisabled, pressed && styles.buttonPressed]}>
                    {syncing ? <ActivityIndicator size="small" color="#FFFFFF" /> : <RefreshCw size={17} color="#FFFFFF" />}
                    <Text style={styles.primaryText}>{syncing ? 'در حال همگام‌سازی…' : 'همگام‌سازی اکنون'}</Text>
                  </Pressable>
                  {!!lastSynced && <Text style={styles.lastSynced}>آخرین تأیید سرور: {new Date(lastSynced).toLocaleString()}</Text>}
                  <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || syncing }} disabled={busy || syncing} onPress={() => void signOut()} style={styles.secondaryButton}>
                    <Text style={styles.secondaryText}>خروج از حساب (دادهٔ محلی پاک نمی‌شود)</Text>
                  </Pressable>
                </>
              ) : step === 'email' ? (
                <>
                  <View style={styles.formIcon}><Mail size={19} color="#5C49B2" /></View>
                  <Text style={styles.cardTitle}>ورود با کد ایمیل</Text>
                  <Text style={styles.cardCaption}>کد یک‌بارمصرف می‌فرستیم؛ نیازی به ساخت یا نگه‌داری رمز عبور نیست.</Text>
                  <Text style={styles.label}>نشانی ایمیل</Text>
                  <TextInput
                    accessibilityLabel="نشانی ایمیل برای ورود"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@example.com"
                    placeholderTextColor="#A2A2AF"
                    editable={!busy && configured}
                    style={styles.input}
                  />
                  <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy || !configured }} disabled={busy || !configured} onPress={() => void requestCode()} style={({ pressed }) => [styles.primaryButton, (busy || !configured) && styles.buttonDisabled, pressed && styles.buttonPressed]}>
                    {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Mail size={17} color="#FFFFFF" />}
                    <Text style={styles.primaryText}>{busy ? 'در حال ارسال…' : 'ارسال کد یک‌بارمصرف'}</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.formIcon}><LockKeyhole size={19} color="#5C49B2" /></View>
                  <Text style={styles.cardTitle}>کد ایمیل را وارد کنید</Text>
                  <Text style={styles.cardCaption}>کد ارسال‌شده به {email} را وارد کنید.</Text>
                  <Text style={styles.label}>کد یک‌بارمصرف</Text>
                  <TextInput
                    accessibilityLabel="کد یک‌بارمصرف ایمیل"
                    autoComplete="one-time-code"
                    keyboardType="number-pad"
                    maxLength={8}
                    value={code}
                    onChangeText={value => setCode(value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="کد ایمیل"
                    placeholderTextColor="#A2A2AF"
                    editable={!busy}
                    style={[styles.input, styles.codeInput]}
                  />
                  <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => void verifyCode()} style={({ pressed }) => [styles.primaryButton, busy && styles.buttonDisabled, pressed && styles.buttonPressed]}>
                    {busy ? <ActivityIndicator size="small" color="#FFFFFF" /> : <ShieldCheck size={17} color="#FFFFFF" />}
                    <Text style={styles.primaryText}>{busy ? 'در حال تأیید…' : 'تأیید ایمیل و همگام‌سازی'}</Text>
                  </Pressable>
                  <View style={styles.codeActions}>
                    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => void requestCode()}><Text style={styles.linkText}>ارسال دوبارهٔ کد</Text></Pressable>
                    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} onPress={() => { setStep('email'); setCode(''); setError(''); setMessage(''); }}><Text style={styles.linkText}>ویرایش ایمیل</Text></Pressable>
                  </View>
                </>
              )}

              {!!message && <Text accessibilityRole="text" style={styles.message}>{message}</Text>}
              {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
            </View>

            <View style={styles.safeNote}>
              <ShieldCheck size={17} color="#52775D" />
              <Text style={styles.safeText}>اطلاعات آموزشی ابری فقط برای حساب احراز‌شدهٔ شماست؛ RLS شناسه را با auth.uid() می‌سنجد و نقش anon دسترسی ندارد. متن پیش‌نویس‌ها و فرم کارگاه ارسال نمی‌شود؛ فقط چک‌باکس‌های خودارزیابی بدون متن همگام می‌شوند. برنامه صدای شما را ضبط یا بارگذاری نمی‌کند.</Text>
            </View>
            <View style={styles.mergeNote}>
              <Text style={styles.mergeTitle}>داده‌های قبلی محفوظ می‌مانند</Text>
              <Text style={styles.mergeText}>هنگام ورود، شواهد و نتیجه‌های آموزشی محلی با دادهٔ حساب ادغام می‌شوند. پیش‌نویس پاسخ‌های آزاد، متن و فرم کارگاه آلمانی و جلسه‌های ناتمام فقط روی همین دستگاه می‌مانند؛ چک‌باکس‌های خودارزیابی کارگاه بدون انتقال متن همگام می‌شوند. اگر نسخه‌ای فقط در حساب ناشناسِ دستگاه دیگری باشد، همان دستگاه باید یک‌بار با این ایمیل وارد و همگام شود؛ ورود، دادهٔ محلی را پاک نمی‌کند.</Text>
            </View>
            {!configured && <Text style={styles.configHint}>اتصال Supabase هنوز در این اجرا تنظیم نشده است. پس از افزودن URL پروژه و کلید عمومی anon، برنامه را دوباره اجرا کنید؛ کلید service_role یا رمز لازم نیست.</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F5F8' },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 30 },
  page: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 16 },
  top: { minHeight: 40, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  close: { width: 38, height: 38, borderRadius: 13, borderWidth: 1, borderColor: '#E1E2E9', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  hero: { borderRadius: 25, padding: 23, backgroundColor: '#282250', overflow: 'hidden', alignItems: 'flex-start' },
  heroIcon: { width: 48, height: 48, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.13)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '700', textAlign: 'right', width: '100%' },
  subtitle: { color: '#E1DDF4', fontSize: 14, lineHeight: 23, textAlign: 'right', marginTop: 7, width: '100%' },
  privacyPill: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7, backgroundColor: 'rgba(80,153,120,0.23)', paddingHorizontal: 11, paddingVertical: 8, borderRadius: 99, marginTop: 15 },
  privacyText: { color: '#E3F4EB', fontSize: 12, fontWeight: '600' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 23, borderWidth: 1, borderColor: '#E4E5EC', padding: 20, shadowColor: '#20213D', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  accountRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 11 },
  accountIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#E8F2EA', alignItems: 'center', justifyContent: 'center' },
  accountText: { flex: 1, alignItems: 'flex-start' },
  eyebrow: { color: '#7B7B8B', fontSize: 11, fontWeight: '700' },
  accountEmail: { color: '#22243A', fontSize: 15, fontWeight: '700', marginTop: 2, textAlign: 'right' },
  onlineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#3E9A69' },
  rule: { height: 1, backgroundColor: '#ECECF1', marginVertical: 16 },
  scopeRow: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 9, marginBottom: 16 },
  scopeText: { flex: 1, color: '#56576C', fontSize: 13, lineHeight: 21, textAlign: 'right' },
  formIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#F0EDFC', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cardTitle: { color: '#212239', fontSize: 18, fontWeight: '700', textAlign: 'right' },
  cardCaption: { color: '#696A7A', fontSize: 13, lineHeight: 21, textAlign: 'right', marginTop: 5, marginBottom: 17 },
  label: { color: '#434458', fontSize: 12, fontWeight: '700', textAlign: 'right', marginBottom: 7 },
  input: { height: 50, borderWidth: 1, borderColor: '#DCDDE6', backgroundColor: '#FCFCFE', borderRadius: 14, paddingHorizontal: 14, color: '#24253A', fontSize: 15, textAlign: 'left', marginBottom: 13 },
  codeInput: { letterSpacing: 8, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  primaryButton: { minHeight: 49, borderRadius: 15, backgroundColor: '#5D4BB0', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 16, marginTop: 5 },
  buttonDisabled: { opacity: 0.55 },
  buttonPressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryButton: { minHeight: 43, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  secondaryText: { color: '#6A617E', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  codeActions: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingTop: 12 },
  linkText: { color: '#5D4BB0', fontSize: 12, fontWeight: '700', paddingVertical: 4 },
  message: { color: '#43704F', backgroundColor: '#EFF7EF', borderRadius: 12, padding: 11, fontSize: 12, lineHeight: 20, textAlign: 'right', marginTop: 12 },
  error: { color: '#9C4139', backgroundColor: '#FFF0EE', borderRadius: 12, padding: 11, fontSize: 12, lineHeight: 20, textAlign: 'right', marginTop: 10 },
  lastSynced: { color: '#858596', fontSize: 10, textAlign: 'center', marginTop: 11 },
  safeNote: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 9, paddingHorizontal: 6 },
  safeText: { flex: 1, color: '#5C695F', fontSize: 12, lineHeight: 20, textAlign: 'right' },
  mergeNote: { backgroundColor: '#FAF7EE', borderColor: '#EEE2C5', borderWidth: 1, borderRadius: 17, padding: 15 },
  mergeTitle: { color: '#735A30', fontSize: 13, fontWeight: '700', textAlign: 'right', marginBottom: 5 },
  mergeText: { color: '#74694F', fontSize: 12, lineHeight: 20, textAlign: 'right' },
  configHint: { color: '#777383', fontSize: 12, lineHeight: 20, textAlign: 'right', paddingHorizontal: 4 },
});
