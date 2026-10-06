import { useEffect, useState } from 'react';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { I18nManager, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Vazirmatn_400Regular,
  Vazirmatn_500Medium,
  Vazirmatn_700Bold,
} from '@expo-google-fonts/vazirmatn';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { getPairingState, isOnboardingComplete } from '@/lib/storage';
import { isSupabaseConfigured } from '@/lib/pairing';
import { useRealAgent } from '@/lib/useRealAgent';

I18nManager.forceRTL(true);
I18nManager.allowRTL(true);
SplashScreen.preventAutoHideAsync();

function CompanionRuntime() {
  const pathname = usePathname();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    Promise.all([getPairingState(), isOnboardingComplete()])
      .then(([pairing, complete]) => {
        setDeviceId(pairing?.deviceId ?? null);
        setEnabled(!!pairing && complete && isSupabaseConfigured());
      })
      .catch(() => {
        setDeviceId(null);
        setEnabled(false);
      });
  }, [pathname]);

  // Runs invisibly while the user studies: heartbeat, device status and
  // supported commands continue without exposing a complicated control UI.
  useRealAgent(deviceId, enabled);
  return null;
}

/**
 * Phone-2 companion only. There is no role chooser and no controller route in
 * this APK; it always boots into the companion connection screen.
 */
export default function RootLayout() {
  useFrameworkReady();
  const [fontsLoaded, fontError] = useFonts({
    Vazirmatn: Vazirmatn_400Regular,
    'Vazirmatn-Medium': Vazirmatn_500Medium,
    'Vazirmatn-Bold': Vazirmatn_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View style={{ flex: 1, direction: 'rtl' }}>
          <CompanionRuntime />
          <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
            <Stack.Screen name="index" />
            <Stack.Screen name="agent" />
            <Stack.Screen name="permissions" />
            <Stack.Screen name="lang/index" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
