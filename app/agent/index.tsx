// Agent home (phone 2) — two faces:
//   not paired → elegant intro with the big "اتصال به گوشی اول" button
//   paired     → live status dashboard + real device info being reported

import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import {
  Smartphone,
  Link2,
  BatteryCharging,
  Wifi,
  HardDrive,
  Cpu,
  MapPin,
  MailWarning,
  CheckCircle2,
  Unplug,
  RefreshCw,
  ShieldCheck,
  Send,
  ScreenShare,
  Square,
  GraduationCap,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';
import { toPersianDigits } from '@/lib/format';
import { checkPairingStatus, markOffline, isSupabaseConfigured } from '@/lib/pairing';
import { getPairingState, clearPairingState, clearDeviceId, type PairingState } from '@/lib/storage';
import { useRealAgent, getAgentIdentity, type AgentSnapshot } from '@/lib/useRealAgent';
import { useScreenBroadcaster } from '@/lib/liveScreen';

function formatBytes(bytes: number | null): string {
  if (bytes === null || bytes <= 0) return 'نامشخص';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${toPersianDigits(gb.toFixed(1))} گیگ`;
  const mb = bytes / (1024 * 1024);
  return `${toPersianDigits(mb.toFixed(0))} مگ`;
}

function batteryFa(level: number | null, state: string | null): string {
  if (level === null) return 'نامشخص';
  const pct = `${toPersianDigits(Math.round(level * 100))}٪`;
  if (state === 'charging') return `${pct} (در حال شارژ)`;
  if (state === 'full') return `${pct} (پر)`;
  return pct;
}

function networkFa(type: string | null): string {
  switch (type) {
    case 'WIFI':
      return 'وای‌فای';
    case 'CELLULAR':
      return 'اینترنت سیم‌کارت';
    case 'NONE':
      return 'بدون اینترنت';
    default:
      return type ?? 'نامشخص';
  }
}

export default function AgentHomeScreen() {
  const router = useRouter();
  const [pairing, setPairing] = useState<PairingState | null>(null);
  const [checking, setChecking] = useState(true);
  const configured = isSupabaseConfigured();

  // Verify the stored pairing is still valid (the dashboard might have removed it)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setChecking(true);
        const stored = await getPairingState();
        if (!active) return;
        if (stored && configured) {
          const status = await checkPairingStatus(stored.deviceId);
          if (status !== 'approved') {
            await clearPairingState();
            await clearDeviceId();
            if (active) {
              setPairing(null);
              setChecking(false);
            }
            return;
          }
        }
        if (active) {
          setPairing(stored);
          setChecking(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [configured]),
  );

  // Real reporting loop — only when paired
  const agent = useRealAgent(pairing?.deviceId ?? null, !!pairing && configured);
  const liveScreen = useScreenBroadcaster(pairing?.deviceId ?? null);

  const disconnect = useCallback(async () => {
    await liveScreen.stop();
    if (pairing) await markOffline(pairing.deviceId);
    await clearPairingState();
    await clearDeviceId();
    setPairing(null);
  }, [liveScreen.stop, pairing]);

  if (checking) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.accent[500]} />
      </View>
    );
  }

  // ---------- not paired ----------
  if (!pairing) {
    return (
      <ScrollView style={styles.root}>
        <View style={styles.body}>
          <LinearGradient
            colors={[Colors.primary[600], Colors.accent[800]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroIcon}>
              <Smartphone size={36} color={Colors.onColor} strokeWidth={2} />
            </View>
            <Text style={styles.heroTitle}>گوشی دوم</Text>
            <Text style={styles.heroDesc}>
              این برنامه را به گوشی اول (پنل مدیریت) متصل کنید تا وضعیت این گوشی به‌صورت زنده گزارش شود
            </Text>
          </LinearGradient>

          <Pressable
            style={[styles.bigBtn, !configured && { opacity: 0.5 }]}
            disabled={!configured}
            onPress={() => router.push('/agent/pair' as never)}
          >
            <LinearGradient
              colors={[Colors.accent[500], Colors.accent[800]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bigBtnGradient}
            >
              <Link2 size={22} color={Colors.onColor} strokeWidth={2.4} />
              <Text style={styles.bigBtnText}>اتصال به گوشی اول</Text>
            </LinearGradient>
          </Pressable>

          {!configured && (
            <View style={styles.noticeCard}>
              <MailWarning size={18} color={Colors.warning[400]} strokeWidth={2} />
              <Text style={styles.noticeText}>
                اتصال سرور هنوز فعال نشده است. پس از فعال‌سازی سرور، دکمه‌ی اتصال روشن می‌شود.
              </Text>
            </View>
          )}

          <View style={styles.featuresCard}>
            <Text style={styles.featuresTitle}>پس از اتصال، این اطلاعات به‌صورت زنده ارسال می‌شود:</Text>
            <FeatureRow icon={BatteryCharging} text="میزان و وضعیت شارژ باتری" color={Colors.success[500]} />
            <FeatureRow icon={Wifi} text="نوع اینترنت (وای‌فای / سیم‌کارت)" color={Colors.primary[400]} />
            <FeatureRow icon={HardDrive} text="حافظه‌ی خالی و کل گوشی" color={Colors.warning[400]} />
            <FeatureRow icon={MapPin} text="موقعیت مکانی (با اجازه‌ی شما)" color={Colors.error[400]} />
            <FeatureRow icon={ShieldCheck} text="اجرای دستورات گوشی اول (پیدا کردن، صدا زدن، پیام)" color={Colors.accent[500]} />
          </View>

          <Text style={styles.footerNote}>
            مدل این دستگاه: {getAgentIdentity().deviceModel} • {getAgentIdentity().osVersion}
          </Text>
          <Pressable style={styles.languageBtn} onPress={() => router.push('/lang' as never)}>
            <GraduationCap size={20} color={Colors.accent[300]} strokeWidth={2.2} />
            <View style={styles.languageTextWrap}>
              <Text style={styles.languageTitle}>آموزش زبان انگلیسی</Text>
              <Text style={styles.languageDesc}>۱۲ درس، تلفظ صوتی، فلش‌کارت و آزمون</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // ---------- paired ----------
  const snap: AgentSnapshot | null = agent.snapshot;
  return (
    <ScrollView style={styles.root}>
      <View style={styles.body}>
        {/* status hero */}
        <LinearGradient
          colors={[Colors.success[500], '#065f46']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.statusRow}>
            <View style={styles.liveDot} />
            <Text style={styles.statusText}>متصل و فعال</Text>
          </View>
          <Text style={styles.heroTitle}>{pairing.deviceName}</Text>
          <Text style={styles.heroDesc}>
            {agent.syncing
              ? 'در حال ارسال گزارش…'
              : agent.lastSync
                ? `آخرین گزارش: ${toPersianDigits(
                    agent.lastSync.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
                  )}`
                : 'آماده‌ی ارسال گزارش'}
          </Text>
        </LinearGradient>

        {/* incoming message from phone 1 */}
        {agent.incomingMessage && (
          <View style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Send size={18} color={Colors.warning[400]} strokeWidth={2.2} />
              <Text style={styles.messageTitle}>پیام از گوشی اول</Text>
            </View>
            <Text style={styles.messageText}>{agent.incomingMessage}</Text>
            <Pressable style={styles.messageBtn} onPress={agent.dismissMessage}>
              <CheckCircle2 size={17} color={Colors.onColor} strokeWidth={2.2} />
              <Text style={styles.messageBtnText}>خواندم</Text>
            </Pressable>
          </View>
        )}

        {/* Explicit, visible screen sharing. Android asks for consent on every session. */}
        <View style={styles.liveCard}>
          <View style={styles.liveCardHeader}>
            <View style={styles.liveCardIcon}>
              <ScreenShare size={21} color={Colors.primary[300]} strokeWidth={2.2} />
            </View>
            <View style={styles.liveCardText}>
              <Text style={styles.liveCardTitle}>نمایش زنده صفحه برای گوشی اول</Text>
              <Text style={styles.liveCardDesc}>
                {liveScreen.phase === 'connected'
                  ? 'تصویر صفحه اکنون در گوشی اول نمایش داده می‌شود.'
                  : liveScreen.phase === 'waiting'
                    ? 'منتظر باز شدن صفحه کنترل زنده در گوشی اول…'
                    : liveScreen.phase === 'requesting'
                      ? 'در حال دریافت اجازه اندروید…'
                      : 'اشتراک فقط با تأیید شما شروع می‌شود و همیشه اعلان فعال دارد.'}
              </Text>
            </View>
          </View>

          {liveScreen.error && <Text style={styles.liveError}>{liveScreen.error}</Text>}

          {liveScreen.phase === 'idle' || liveScreen.phase === 'error' ? (
            <Pressable style={styles.liveStartBtn} onPress={() => void liveScreen.start()}>
              <ScreenShare size={18} color={Colors.onColor} strokeWidth={2.2} />
              <Text style={styles.liveStartText}>شروع اشتراک صفحه</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.liveStopBtn} onPress={() => void liveScreen.stop()}>
              <Square size={17} color={Colors.error[300]} fill={Colors.error[300]} strokeWidth={2} />
              <Text style={styles.liveStopText}>توقف اشتراک صفحه</Text>
            </Pressable>
          )}
        </View>

        {/* info grid */}
        <View style={styles.gridTitleRow}>
          <Text style={styles.gridTitle}>اطلاعاتی که ارسال می‌شود</Text>
          <RefreshCw size={15} color={agent.syncing ? Colors.accent[500] : Colors.neutral[600]} strokeWidth={2.2} />
        </View>

        <View style={styles.grid}>
          <InfoTile
            icon={BatteryCharging}
            color={Colors.success[500]}
            label="باتری"
            value={batteryFa(snap?.batteryLevel ?? null, snap?.batteryState ?? null)}
          />
          <InfoTile
            icon={Wifi}
            color={Colors.primary[400]}
            label="اینترنت"
            value={networkFa(snap?.networkType ?? null)}
          />
          <InfoTile
            icon={HardDrive}
            color={Colors.warning[400]}
            label="حافظه‌ی خالی"
            value={snap ? formatBytes(snap.freeStorage) : '…'}
          />
          <InfoTile
            icon={Cpu}
            color={Colors.accent[500]}
            label="حافظه‌ی رم"
            value={snap ? formatBytes(snap.totalMemory) : '…'}
          />
          <InfoTile
            icon={MapPin}
            color={Colors.error[400]}
            label="موقعیت مکانی"
            value={
              snap?.latitude != null && snap?.longitude != null
                ? `${toPersianDigits(snap.latitude.toFixed(3))}, ${toPersianDigits(snap.longitude.toFixed(3))}`
                : agent.locationGranted
                  ? 'در حال دریافت…'
                  : 'اجازه داده نشده'
            }
          />
          <InfoTile
            icon={Smartphone}
            color={Colors.neutral[300]}
            label="مدل"
            value={getAgentIdentity().deviceModel}
          />
        </View>

        <Pressable style={styles.disconnectBtn} onPress={disconnect}>
          <Unplug size={18} color={Colors.error[400]} strokeWidth={2.2} />
          <Text style={styles.disconnectText}>قطع اتصال از گوشی اول</Text>
        </Pressable>

        <Pressable style={styles.languageBtn} onPress={() => router.push('/lang' as never)}>
          <GraduationCap size={20} color={Colors.accent[300]} strokeWidth={2.2} />
          <View style={styles.languageTextWrap}>
            <Text style={styles.languageTitle}>آموزش زبان انگلیسی</Text>
            <Text style={styles.languageDesc}>ادامه درس‌ها و آزمون‌های شما</Text>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function FeatureRow({ icon: Icon, text, color }: { icon: typeof Wifi; text: string; color: string }) {
  return (
    <View style={styles.featureRow}>
      <View style={[styles.featureIcon, { backgroundColor: color + '18' }]}>
        <Icon size={16} color={color} strokeWidth={2.2} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function InfoTile({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Wifi;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.tile}>
      <View style={[styles.featureIcon, { backgroundColor: color + '18' }]}>
        <Icon size={18} color={color} strokeWidth={2.2} />
      </View>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950], direction: 'rtl' },
  center: { justifyContent: 'center', alignItems: 'center' },
  body: { padding: Spacing.lg, paddingBottom: Spacing.xxl + 24 },

  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
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

  statusRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#bbf7d0',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  statusText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: '#dcfce7',
  },

  bigBtn: { borderRadius: Radius.xl, overflow: 'hidden', marginBottom: Spacing.lg },
  bigBtnGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: Spacing.lg,
  },
  bigBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
  },

  noticeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.warning[500] + '12',
    borderWidth: 1,
    borderColor: Colors.warning[500] + '45',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  noticeText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.warning[400],
    lineHeight: 21,
    textAlign: 'right',
  },

  featuresCard: {
    backgroundColor: Colors.neutral[850],
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  featuresTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'right',
    marginBottom: 2,
  },
  featureRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    color: Colors.neutral[300],
    textAlign: 'right',
    lineHeight: 20,
  },

  footerNote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  languageBtn: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.accent[500] + '55',
    backgroundColor: Colors.accent[500] + '10',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: Spacing.md,
  },
  languageTextWrap: { flex: 1 },
  languageTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'right',
  },
  languageDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[400],
    textAlign: 'right',
    marginTop: 3,
  },

  liveCard: {
    backgroundColor: Colors.primary[500] + '12',
    borderWidth: 1.5,
    borderColor: Colors.primary[500] + '55',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  liveCardHeader: { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: Spacing.sm },
  liveCardIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary[500] + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveCardText: { flex: 1, gap: 4 },
  liveCardTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'right',
  },
  liveCardDesc: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[300],
    textAlign: 'right',
    lineHeight: 19,
  },
  liveError: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.error[300],
    textAlign: 'right',
  },
  liveStartBtn: {
    minHeight: 46,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary[500],
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  liveStartText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
  },
  liveStopBtn: {
    minHeight: 46,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.error[500] + '66',
    backgroundColor: Colors.error[500] + '12',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  liveStopText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.error[300],
  },

  gridTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  gridTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  tile: {
    width: '48.5%',
    backgroundColor: Colors.neutral[850],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    padding: Spacing.md,
    gap: 6,
  },
  tileLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[400],
    textAlign: 'right',
  },
  tileValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'right',
    lineHeight: 20,
  },

  messageCard: {
    backgroundColor: Colors.warning[500] + '12',
    borderWidth: 1.5,
    borderColor: Colors.warning[500] + '55',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  messageHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  messageTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.warning[400],
  },
  messageText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    color: Colors.neutral[100],
    textAlign: 'right',
    lineHeight: 24,
  },
  messageBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.warning[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  messageBtnText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.onColor,
  },

  disconnectBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.error[500] + '50',
    backgroundColor: Colors.error[500] + '0D',
  },
  disconnectText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.error[400],
  },
});
