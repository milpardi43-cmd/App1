export const accessibilityControl = {
  isEnabled: async () => false,
  openSettings: async () => false,
  tap: async (_x: number, _y: number) => { throw new Error('کنترل لمسی فقط در APK اندروید فعال است.'); },
  swipe: async (_x1: number, _y1: number, _x2: number, _y2: number, _durationMs = 350) => { throw new Error('کنترل لمسی فقط در APK اندروید فعال است.'); },
  globalAction: async (_action: 'back' | 'home' | 'recents' | 'notifications') => { throw new Error('کنترل لمسی فقط در APK اندروید فعال است.'); },
};
