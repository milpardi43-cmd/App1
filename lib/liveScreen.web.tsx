export type SharePhase = 'idle' | 'requesting' | 'waiting' | 'connected' | 'stopping' | 'error';

const unsupported = 'اشتراک زنده صفحه فقط در نسخه APK اندروید فعال است.';

export function useScreenBroadcaster(_deviceId: string | null) {
  return {
    phase: 'error' as SharePhase,
    error: unsupported,
    start: async () => undefined,
    stop: async () => undefined,
    reset: () => undefined,
  };
}
