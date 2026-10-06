import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'agent_device_id';
const SELECTED_DEVICE_KEY = 'selected_device_id';
const PAIRING_STATE_KEY = 'agent_pairing_state';
const ONBOARDING_COMPLETE_KEY = 'companion_onboarding_complete';

// Values are cached in memory as well so reads stay stable even if a
// transient AsyncStorage error occurs, and so the first read in a session
// can be warmed by `warmStorageCache()`.
const memoryCache = new Map<string, string>();

async function get(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const value = await AsyncStorage.getItem(key);
    if (value !== null) memoryCache.set(key, value);
    return value ?? memoryCache.get(key) ?? null;
  } catch {
    return memoryCache.get(key) ?? null;
  }
}

async function set(key: string, value: string): Promise<void> {
  memoryCache.set(key, value);
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  } catch {
    // Keep the in-memory copy — persistence failure should never crash the app.
  }
}

async function clear(key: string): Promise<void> {
  memoryCache.delete(key);
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const getDeviceId = () => get(STORAGE_KEY);
export const setDeviceId = (id: string) => set(STORAGE_KEY, id);
export const clearDeviceId = () => clear(STORAGE_KEY);

export const getSelectedDeviceId = () => get(SELECTED_DEVICE_KEY);
export const setSelectedDeviceId = (id: string) => set(SELECTED_DEVICE_KEY, id);

// Full pairing snapshot for the agent app: device id + a small JSON blob with
// the device name shown to the user and the time pairing completed.
export interface PairingState {
  deviceId: string;
  deviceName: string;
  pairedAt: string;
}

export async function getPairingState(): Promise<PairingState | null> {
  const raw = await get(PAIRING_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PairingState;
  } catch {
    return null;
  }
}

export const setPairingState = (state: PairingState) =>
  set(PAIRING_STATE_KEY, JSON.stringify(state));

export const clearPairingState = async () => {
  await clear(PAIRING_STATE_KEY);
  await clear(ONBOARDING_COMPLETE_KEY);
};

export const isOnboardingComplete = async () =>
  (await get(ONBOARDING_COMPLETE_KEY)) === 'true';

export const setOnboardingComplete = () => set(ONBOARDING_COMPLETE_KEY, 'true');
