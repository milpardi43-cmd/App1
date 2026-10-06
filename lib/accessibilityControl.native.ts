import { NativeModules, Platform } from 'react-native';

interface CompanionControlModule {
  isEnabled(): Promise<boolean>;
  openSettings(): Promise<boolean>;
  tap(x: number, y: number): Promise<boolean>;
  swipe(x1: number, y1: number, x2: number, y2: number, durationMs: number): Promise<boolean>;
  globalAction(action: 'back' | 'home' | 'recents' | 'notifications'): Promise<boolean>;
}

function module(): CompanionControlModule {
  const native = NativeModules.CompanionControl as CompanionControlModule | undefined;
  if (Platform.OS !== 'android' || !native) throw new Error('ماژول کنترل اندروید در این نسخه نصب نشده است.');
  return native;
}

export const accessibilityControl = {
  isEnabled: async () => module().isEnabled(),
  openSettings: async () => module().openSettings(),
  tap: async (x: number, y: number) => module().tap(x, y),
  swipe: async (x1: number, y1: number, x2: number, y2: number, durationMs = 350) => module().swipe(x1, y1, x2, y2, durationMs),
  globalAction: async (action: 'back' | 'home' | 'recents' | 'notifications') => module().globalAction(action),
};
