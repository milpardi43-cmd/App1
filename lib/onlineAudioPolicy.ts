/**
 * Outbound learner audio is intentionally blocked pending product consent,
 * upload/retention terms, and a documented opt-in decision. Playback of existing
 * audio and on-device speech synthesis are separate capabilities.
 */
export const ONLINE_AUDIO_ENABLED = false;
export const ONLINE_AUDIO_DISABLED_MESSAGE = 'ضبط و ارسال آنلاین صدا فعلاً غیرفعال است؛ پیام متنی را می‌توانید ارسال کنید.';

export function requireOnlineAudioEnabled(): void {
  if (!ONLINE_AUDIO_ENABLED) throw new Error(ONLINE_AUDIO_DISABLED_MESSAGE);
}
