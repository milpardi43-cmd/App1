// Agent pairing screen (phone 2) — enter the 6-digit code shown on phone 1,
// or scan its QR code with the camera. Then wait for phone 1 to approve,
// exactly like a phone connecting to a smart TV.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Keyboard, ScanLine, Link2, CheckCircle2, XCircle, Hourglass } from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { claimPairingCode, checkPairingStatus, isSupabaseConfigured } from '@/lib/pairing';
import { getAgentIdentity } from '@/lib/useRealAgent';
import { setPairingState, setDeviceId } from '@/lib/storage';
import { AgentTopBar } from '@/components/LangShared';

type Stage =
  | { name: 'choose' }
  | { name: 'type' }
  | { name: 'scan' }
  | { name: 'claiming' }
  | { name: 'waiting'; deviceId: string; deviceName: string }
  | { name: 'error'; message: string };

export default function AgentPairScreen() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>({ name: 'type' });
  const [code, setCode] = useState('');
  const [permission, requestPermission] = useCameraPermissions();
  const scannedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const configured = isSupabaseConfigured();

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  };
  useEffect(() => stopPolling, []);

  const finishWithDevice = useCallback(
    async (deviceId: string, deviceName: string) => {
      stopPolling();
      await setDeviceId(deviceId);
      await setPairingState({ deviceId, deviceName, pairedAt: new Date().toISOString() });
      router.replace('/permissions' as never);
    },
    [router],
  );

  const startWaiting = useCallback(
    (deviceId: string, deviceName: string) => {
      setStage({ name: 'waiting', deviceId, deviceName });
      stopPolling();
      pollRef.current = setInterval(async () => {
        const status = await checkPairingStatus(deviceId);
        if (status === 'approved') {
          finishWithDevice(deviceId, deviceName);
        } else if (status === 'rejected') {
          stopPolling();
          setStage({ name: 'error', message: 'اتصال از سمت گوشی اول رد شد. دوباره تلاش کنید.' });
        }
      }, 3000);
    },
    [finishWithDevice],
  );

  const submitCode = useCallback(
    async (value: string) => {
      const clean = value.trim();
      if (clean.length !== 6) return;
      setStage({ name: 'claiming' });
      const result = await claimPairingCode(clean, getAgentIdentity());
      if (result.ok) {
        startWaiting(result.device.id, result.device.device_name);
      } else {
        setStage({
          name: 'error',
          message:
            result.reason === 'invalid_code'
              ? 'کد وارد شده معتبر نیست یا منقضی شده است. کد جدید را از گوشی اول بگیرید.'
              : result.reason === 'not_configured'
                ? 'اتصال سرور هنوز تنظیم نشده است.'
                : 'خطا در ارتباط. اینترنت را بررسی کنید و دوباره تلاش کنید.',
        });
      }
    },
    [startWaiting],
  );

  const onScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scannedRef.current) return;
      const digits = (data || '').replace(/\D/g, '');
      if (digits.length >= 6) {
        scannedRef.current = true;
        submitCode(digits.slice(0, 6));
      }
    },
    [submitCode],
  );

  // ---------- render ----------

  const renderBody = () => {
    if (!configured) {
      return (
        <View style={styles.centerBox}>
          <XCircle size={44} color={Colors.error[400]} strokeWidth={2} />
          <Text style={styles.bigText}>سرور هنوز تنظیم نشده است</Text>
          <Text style={styles.smallText}>
            برای اتصال دو گوشی، ابتدا باید سرور (Supabase) فعال شود. پس از فعال‌سازی، این صفحه به‌صورت خودکار آماده می‌شود.
          </Text>
        </View>
      );
    }

    switch (stage.name) {
      case 'choose':
        return (
          <>
            <LinearGradient
              colors={[Colors.primary[600], Colors.accent[800]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.heroIcon}>
                <Link2 size={34} color={Colors.onColor} strokeWidth={2} />
              </View>
              <Text style={styles.heroTitle}>اتصال به گوشی اول</Text>
              <Text style={styles.heroDesc}>
                کد ۶ رقمی که روی گوشی اول نمایش داده شده را وارد کنید یا کد آن را اسکن کنید
              </Text>
            </LinearGradient>

            <Pressable style={[styles.primaryBtn, { backgroundColor: Colors.accent[500] }]} onPress={() => setStage({ name: 'type' })}>
              <Keyboard size={20} color={Colors.onColor} strokeWidth={2.2} />
              <Text style={styles.primaryBtnText}>وارد کردن کد ۶ رقمی</Text>
            </Pressable>

            {Platform.OS !== 'web' && (
              <Pressable
                style={[styles.primaryBtn, { backgroundColor: Colors.neutral[800] }]}
                onPress={async () => {
                  if (!permission?.granted) {
                    const result = await requestPermission();
                    if (!result.granted) return;
                  }
                  scannedRef.current = false;
                  setStage({ name: 'scan' });
                }}
              >
                <ScanLine size={20} color={Colors.neutral[100]} strokeWidth={2.2} />
                <Text style={[styles.primaryBtnText, { color: Colors.neutral[100] }]}>اسکن QR گوشی اول</Text>
              </Pressable>
            )}
          </>
        );

      case 'type':
        return (
          <View style={styles.centerBox}>
            <Text style={styles.bigText}>کد ۶ رقمی را وارد کنید</Text>
            <Text style={styles.smallText}>کد روی صفحه‌ی گوشی اول نمایش داده شده است</Text>
            <TextInput
              style={styles.codeInput}
              value={code}
              onChangeText={(t) => {
                const digits = t.replace(/[^0-9۰-۹]/g, '').replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
                setCode(digits);
                if (digits.length === 6) submitCode(digits);
              }}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
              textAlign="center"
              placeholder="------"
              placeholderTextColor={Colors.neutral[700]}
            />
            <Text style={styles.securityNote}>
              پس از تأیید گوشی اول، فقط یک مرحله کوتاه برای مجوزهای اندروید باقی می‌ماند.
            </Text>
          </View>
        );

      case 'scan':
        return (
          <View style={styles.scanWrap}>
            <View style={styles.cameraBox}>
              {permission?.granted ? (
                <CameraView
                  style={styles.camera}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={onScanned}
                />
              ) : (
                <View style={styles.centerBox}>
                  <ScanLine size={40} color={Colors.neutral[500]} strokeWidth={1.8} />
                  <Text style={styles.smallText}>برای اسکن، اجازه‌ی دوربین لازم است</Text>
                  <Pressable
                    style={[styles.primaryBtn, { backgroundColor: Colors.accent[500] }]}
                    onPress={() => requestPermission()}
                  >
                    <Text style={styles.primaryBtnText}>اجازه‌ی دوربین</Text>
                  </Pressable>
                </View>
              )}
            </View>
            <Text style={styles.smallText}>دوربین را روی QR کد گوشی اول بگیرید</Text>
            <Pressable style={[styles.primaryBtn, { backgroundColor: Colors.neutral[800] }]} onPress={() => setStage({ name: 'type' })}>
              <Text style={[styles.primaryBtnText, { color: Colors.neutral[100] }]}>بازگشت</Text>
            </Pressable>
          </View>
        );

      case 'claiming':
        return (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.accent[500]} />
            <Text style={styles.bigText}>در حال بررسی کد…</Text>
          </View>
        );

      case 'waiting':
        return (
          <View style={styles.centerBox}>
            <View style={styles.waitIconWrap}>
              <Hourglass size={40} color={Colors.warning[400]} strokeWidth={2} />
            </View>
            <Text style={styles.bigText}>در انتظار تأیید گوشی اول…</Text>
            <Text style={styles.smallText}>
              روی گوشی اول پیام «{stage.deviceName} می‌خواهد متصل شود» نمایش داده شده است. پس از تأیید، اتصال به‌صورت خودکار برقرار می‌شود.
            </Text>
            <ActivityIndicator size="small" color={Colors.accent[500]} style={{ marginTop: Spacing.md }} />
            <Pressable
              style={[styles.primaryBtn, { backgroundColor: Colors.neutral[800], marginTop: Spacing.xl }]}
              onPress={() => {
                stopPolling();
                setStage({ name: 'type' });
              }}
            >
              <Text style={[styles.primaryBtnText, { color: Colors.neutral[100] }]}>انصراف</Text>
            </Pressable>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centerBox}>
            <XCircle size={44} color={Colors.error[400]} strokeWidth={2} />
            <Text style={styles.bigText}>اتصال برقرار نشد</Text>
            <Text style={styles.smallText}>{stage.message}</Text>
            <Pressable style={[styles.primaryBtn, { backgroundColor: Colors.accent[500] }]} onPress={() => setStage({ name: 'type' })}>
              <CheckCircle2 size={18} color={Colors.onColor} strokeWidth={2.2} />
              <Text style={styles.primaryBtnText}>تلاش دوباره</Text>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <View style={styles.root}>
      <AgentTopBar title="اتصال به گوشی اول" subtitle="جفت‌سازی گوشی دوم" />
      <View style={styles.body}>{renderBody()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950], direction: 'rtl' },
  body: { flex: 1, padding: Spacing.lg },

  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
    textAlign: 'center',
  },
  heroDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 22,
  },

  primaryBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },
  primaryBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
  },

  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
  bigText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'center',
  },
  securityNote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.success[400],
    textAlign: 'center',
    lineHeight: 20,
    marginTop: Spacing.sm,
  },
  smallText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[400],
    textAlign: 'center',
    lineHeight: 22,
  },

  codeInput: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: Colors.neutral[900],
    borderWidth: 2,
    borderColor: Colors.accent[500],
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    fontSize: 34,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    letterSpacing: 14,
    fontFamily: Typography.fontFamily,
    marginVertical: Spacing.md,
    direction: 'ltr',
  },

  scanWrap: { flex: 1, gap: Spacing.lg, justifyContent: 'center' },
  cameraBox: {
    height: 320,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.accent[500] + '60',
    backgroundColor: Colors.neutral[900],
  },
  camera: { flex: 1 },

  waitIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.warning[500] + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warning[500] + '40',
  },
});
