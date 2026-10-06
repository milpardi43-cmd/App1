import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import { getPairingState, isOnboardingComplete } from '@/lib/storage';
import { Colors } from '@/lib/theme';

type Destination = '/agent/pair' | '/permissions' | '/lang';

/**
 * The user sees one short setup flow only once:
 * code -> Android permissions -> English learning app.
 */
export default function Index() {
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    // Design/preview mode: temporarily bypass setup while we build the main
    // Companion English experience. Production keeps onboarding enabled.
    if (process.env.EXPO_PUBLIC_SKIP_COMPANION_ONBOARDING === 'true') {
      setDestination('/lang');
      return;
    }

    Promise.all([getPairingState(), isOnboardingComplete()])
      .then(([pairing, complete]) => {
        if (!pairing) setDestination('/agent/pair');
        else if (!complete) setDestination('/permissions');
        else setDestination('/lang');
      })
      .catch(() => setDestination('/agent/pair'));
  }, []);

  if (!destination) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent[500]} />
      </View>
    );
  }

  return <Redirect href={destination} />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.neutral[950] },
});
