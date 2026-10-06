export type VoiceCallPhase = 'idle' | 'incoming' | 'outgoing' | 'connecting' | 'connected' | 'ending' | 'error';

export interface VoiceCallState {
  phase: VoiceCallPhase;
  error: string | null;
  muted: boolean;
  incomingCallerName: string | null;
  startCall: () => Promise<void>;
  acceptCall: () => Promise<void>;
  declineCall: () => Promise<void>;
  hangUp: () => Promise<void>;
  toggleMute: () => void;
}

/** Browser preview intentionally does not simulate a private native call. */
export function useVoiceCall(_conversationId?: string, _contactName?: string): VoiceCallState {
  const unavailable = async () => { throw new Error('تماس زنده در نسخه نصب‌شده اندروید فعال است.'); };
  return {
    phase: 'idle', error: null, muted: false, incomingCallerName: null,
    startCall: unavailable, acceptCall: unavailable, declineCall: unavailable,
    hangUp: async () => undefined, toggleMute: () => undefined,
  };
}
