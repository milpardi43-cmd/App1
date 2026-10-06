import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { ArrowRight, Check, Languages, Lightbulb, Mic, MicOff, Pause, Phone, PhoneOff, Play, Send, ShieldCheck, Sparkles, Square, UserRound } from 'lucide-react-native';
import {
  currentChatUserId,
  getVoiceMessageUrl,
  listMessages,
  sendTextMessage,
  sendVoiceMessage,
  subscribeToMessages,
  unsubscribeFromMessages,
  type DirectMessage,
} from '@/lib/conversations';
import { requestHumanChatAssist, type HumanAssistMode, type HumanAssistResult } from '@/lib/humanChatAssist';
import { useVoiceCall } from '@/lib/voiceCall';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

function VoiceMessage({ message }: { message: DirectMessage }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const player = useAudioPlayer(url ? { uri: url } : null);
  const status = useAudioPlayerStatus(player);

  const toggle = async () => {
    try {
      if (!url && message.mediaPath) {
        const signedUrl = await getVoiceMessageUrl(message.mediaPath);
        setUrl(signedUrl);
        setTimeout(() => player.play(), 0);
      } else if (status.playing) {
        player.pause();
      } else {
        if (status.didJustFinish) await player.seekTo(0);
        player.play();
      }
    } catch {
      setError(true);
    }
  };

  return (
    <Pressable style={styles.voiceMessage} onPress={() => void toggle()}>
      <View style={styles.voicePlay}>
        {!url && !error ? <Play size={16} color={Colors.neutral[50]} fill={Colors.neutral[50]} /> : status.playing ? <Pause size={16} color={Colors.neutral[50]} fill={Colors.neutral[50]} /> : <Play size={16} color={Colors.neutral[50]} fill={Colors.neutral[50]} />}
      </View>
      <View style={styles.wave}><View style={styles.waveLine} /><View style={[styles.waveLine, { height: 20 }]} /><View style={[styles.waveLine, { height: 12 }]} /><View style={[styles.waveLine, { height: 24 }]} /><View style={[styles.waveLine, { height: 16 }]} /></View>
      <Text style={styles.voiceDuration}>{error ? 'خطا' : `${message.body || '1'} ثانیه`}</Text>
    </Pressable>
  );
}

export default function HumanConversationScreen() {
  const router = useRouter();
  const { conversationId, name } = useLocalSearchParams<{ conversationId: string; name?: string }>();
  const call = useVoiceCall(conversationId, name);
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [assisting, setAssisting] = useState<HumanAssistMode | null>(null);
  const [assistResult, setAssistResult] = useState<HumanAssistResult | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder, 250);

  const addMessage = (message: DirectMessage) => {
    setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, message]);
  };

  useEffect(() => {
    let active = true;
    let channel: ReturnType<typeof subscribeToMessages> | null = null;
    Promise.all([listMessages(conversationId), currentChatUserId()])
      .then(([rows, userId]) => {
        if (!active) return;
        setMessages(rows);
        setMyId(userId);
        channel = subscribeToMessages(conversationId, addMessage);
        setError(null);
      })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : 'گفتگو باز نشد.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      void unsubscribeFromMessages(channel);
    };
  }, [conversationId]);

  const send = async () => {
    const clean = input.trim();
    if (!clean || sending) return;
    setSending(true);
    setInput('');
    setAssistResult(null);
    try {
      addMessage(await sendTextMessage(conversationId, clean));
      setError(null);
    } catch (cause) {
      setInput(clean);
      setError(cause instanceof Error ? cause.message : 'پیام ارسال نشد.');
    } finally {
      setSending(false);
    }
  };

  const runAssist = async (mode: HumanAssistMode) => {
    if (assisting) return;
    if (mode !== 'suggest' && !input.trim()) {
      setError(mode === 'translate' ? 'ابتدا جمله فارسی را بنویسید.' : 'ابتدا جمله انگلیسی را بنویسید.');
      return;
    }
    setAssisting(mode);
    setError(null);
    try {
      const result = await requestHumanChatAssist(
        conversationId,
        mode,
        input,
        messages.filter((item) => item.type === 'text' && item.body).map((item) => ({ mine: item.senderId === myId, text: item.body || '' })),
      );
      setAssistResult(result);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'دستیار خصوصی پاسخ نداد.');
    } finally {
      setAssisting(null);
    }
  };

  const startRecording = async () => {
    if (sending || recorderState.isRecording) return;
    try {
      setError(null);
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) throw new Error('برای پیام صوتی، اجازه میکروفن را فعال کنید.');
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ضبط صدا شروع نشد.');
    }
  };

  const stopAndSendRecording = async () => {
    if (!recorderState.isRecording || sending) return;
    const duration = Math.max(1, Math.round(recorderState.durationMillis / 1000));
    setSending(true);
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!recorder.uri) throw new Error('فایل صدای ضبط‌شده پیدا نشد.');
      addMessage(await sendVoiceMessage(conversationId, recorder.uri, duration));
      setError(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'پیام صوتی ارسال نشد.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}><ArrowRight size={20} color={Colors.neutral[200]} /></Pressable>
        <View style={styles.avatar}><UserRound size={22} color={Colors.primary[300]} /></View>
        <View style={styles.headerText}><Text style={styles.name}>{name || 'مخاطب واقعی'}</Text><Text style={styles.status}>{call.phase === 'connected' ? 'تماس امن برقرار است' : 'گفتگوی خصوصی'}</Text></View>
        <Pressable style={styles.callButton} disabled={call.phase !== 'idle'} onPress={() => void call.startCall()}><Phone size={19} color={call.phase === 'idle' ? Colors.success[300] : Colors.neutral[600]} /></Pressable>
        <ShieldCheck size={20} color={Colors.success[400]} />
      </View>

      {call.phase !== 'idle' ? (
        <View style={styles.callPanel}>
          <View style={styles.callInfo}>
            <Text style={styles.callTitle}>{call.phase === 'incoming' ? `تماس ورودی از ${call.incomingCallerName || name || 'مخاطب'}` : call.phase === 'outgoing' ? 'در حال تماس…' : call.phase === 'connected' ? 'تماس صوتی برقرار است' : call.phase === 'error' ? 'تماس برقرار نشد' : 'در حال اتصال تماس…'}</Text>
            <Text style={styles.callHint}>{call.phase === 'connected' ? 'صدا به‌صورت زنده و خصوصی منتقل می‌شود.' : 'برای تماس اینترنتی پایدار، TURN باید تنظیم باشد.'}</Text>
          </View>
          {call.phase === 'incoming' ? <Pressable style={styles.acceptCall} onPress={() => void call.acceptCall()}><Phone size={18} color={Colors.onColor} /></Pressable> : null}
          {call.phase === 'connected' ? <Pressable style={styles.muteCall} onPress={call.toggleMute}>{call.muted ? <MicOff size={18} color={Colors.warning[300]} /> : <Mic size={18} color={Colors.neutral[100]} />}</Pressable> : null}
          <Pressable style={styles.endCall} onPress={() => void (call.phase === 'incoming' ? call.declineCall() : call.hangUp())}><PhoneOff size={18} color={Colors.onColor} /></Pressable>
        </View>
      ) : null}
      {call.error ? <Text style={styles.callError}>{call.error}</Text> : null}

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={Colors.primary[400]} /><Text style={styles.centerText}>در حال بازکردن گفتگو…</Text></View>
      ) : (
        <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={styles.messageContent} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          <View style={styles.privateNote}><ShieldCheck size={14} color={Colors.success[400]} /><Text style={styles.privateText}>فقط شما و این مخاطب پیام‌ها را می‌بینید.</Text></View>
          {!messages.length ? (
            <View style={styles.empty}><Text style={styles.emptyEmoji}>👋</Text><Text style={styles.emptyTitle}>گفتگو را شروع کنید</Text><Text style={styles.emptyDesc}>یک سلام ساده انگلیسی بهترین شروع است.</Text></View>
          ) : messages.map((message) => {
            const mine = message.senderId === myId;
            return (
              <View key={message.id} style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                {message.type === 'voice' ? <VoiceMessage message={message} /> : <Text style={styles.messageText}>{message.body}</Text>}
                <Text style={styles.time}>{new Date(message.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}

      {showCoach ? (
        <View style={styles.coach}>
          <View style={styles.coachTitleRow}><Sparkles size={15} color={Colors.warning[400]} /><Text style={styles.coachTitle}>دستیار خصوصی — چیزی خودکار ارسال نمی‌شود</Text></View>
          <View style={styles.coachActions}>
            <Pressable style={styles.coachAction} disabled={!!assisting} onPress={() => void runAssist('translate')}><Languages size={14} color={Colors.warning[300]} /><Text style={styles.coachActionText}>ترجمه</Text></Pressable>
            <Pressable style={styles.coachAction} disabled={!!assisting} onPress={() => void runAssist('correct')}><Check size={14} color={Colors.success[300]} /><Text style={styles.coachActionText}>اصلاح</Text></Pressable>
            <Pressable style={styles.coachAction} disabled={!!assisting} onPress={() => void runAssist('suggest')}><Lightbulb size={14} color={Colors.primary[300]} /><Text style={styles.coachActionText}>پیشنهاد پاسخ</Text></Pressable>
          </View>
          {assisting ? <ActivityIndicator size="small" color={Colors.warning[400]} /> : null}
          {assistResult ? (
            <View style={styles.assistResult}>
              <Text style={styles.assistPrimary}>{assistResult.primary}</Text>
              {assistResult.explanationFa ? <Text style={styles.assistExplanation}>{assistResult.explanationFa}</Text> : null}
              <Pressable style={styles.useSuggestion} onPress={() => { setInput(assistResult.primary); setAssistResult(null); }}><Text style={styles.useSuggestionText}>قرار دادن در کادر پیام</Text></Pressable>
              {assistResult.alternatives.map((item) => <Pressable key={item} onPress={() => { setInput(item); setAssistResult(null); }}><Text style={styles.alternative}>{item}</Text></Pressable>)}
            </View>
          ) : null}
        </View>
      ) : null}
      {recorderState.isRecording ? <View style={styles.recording}><View style={styles.recordDot} /><Text style={styles.recordingText}>در حال ضبط · {Math.max(1, Math.round(recorderState.durationMillis / 1000))} ثانیه · برای ارسال دوباره بزنید</Text></View> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.composer}>
        <Pressable style={styles.helper} onPress={() => setShowCoach((value) => !value)}><Sparkles size={19} color={showCoach ? Colors.warning[400] : Colors.neutral[400]} /></Pressable>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="پیام فارسی یا انگلیسی بنویسید…" placeholderTextColor={Colors.neutral[600]} multiline textAlign="right" />
        {input.trim() ? (
          <Pressable style={[styles.send, sending && styles.disabled]} disabled={sending} onPress={() => void send()}>{sending ? <ActivityIndicator size="small" color={Colors.onColor} /> : <Send size={18} color={Colors.onColor} />}</Pressable>
        ) : (
          <Pressable style={[styles.send, recorderState.isRecording && styles.recordStop, sending && styles.disabled]} disabled={sending} onPress={() => recorderState.isRecording ? void stopAndSendRecording() : void startRecording()}>
            {sending ? <ActivityIndicator size="small" color={Colors.onColor} /> : recorderState.isRecording ? <Square size={16} color={Colors.onColor} fill={Colors.onColor} /> : <Mic size={19} color={Colors.onColor} />}
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950] },
  header: { paddingTop: 50, paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, minHeight: 104, backgroundColor: Colors.neutral[900], borderBottomWidth: 1, borderBottomColor: Colors.neutral[800], flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.sm },
  back: { width: 39, height: 39, borderRadius: Radius.md, backgroundColor: Colors.neutral[850], alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary[500] + '15', alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1 },
  name: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  status: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.success[400], textAlign: 'right', marginTop: 2 },
  callButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.success[500] + '14', alignItems: 'center', justifyContent: 'center' },
  callPanel: { minHeight: 72, padding: Spacing.md, backgroundColor: Colors.neutral[900], borderBottomWidth: 1, borderBottomColor: Colors.neutral[800], flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  callInfo: { flex: 1 },
  callTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  callHint: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.neutral[500], textAlign: 'right', marginTop: 3 },
  acceptCall: { width: 39, height: 39, borderRadius: 20, backgroundColor: Colors.success[500], alignItems: 'center', justifyContent: 'center' },
  muteCall: { width: 39, height: 39, borderRadius: 20, backgroundColor: Colors.neutral[700], alignItems: 'center', justifyContent: 'center' },
  endCall: { width: 39, height: 39, borderRadius: 20, backgroundColor: Colors.error[500], alignItems: 'center', justifyContent: 'center' },
  callError: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.error[300], textAlign: 'center', padding: 6, backgroundColor: Colors.error[500] + '10' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  centerText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500] },
  messages: { flex: 1 },
  messageContent: { flexGrow: 1, padding: Spacing.md, gap: Spacing.sm },
  privateNote: { alignSelf: 'center', flexDirection: 'row-reverse', alignItems: 'center', gap: 5, borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: Colors.success[500] + '0D', marginBottom: Spacing.md },
  privateText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.success[400] },
  empty: { flex: 1, minHeight: 300, alignItems: 'center', justifyContent: 'center' },
  emptyEmoji: { fontSize: 42 },
  emptyTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.neutral[200], marginTop: Spacing.md },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[600], marginTop: 4 },
  bubble: { maxWidth: '84%', borderRadius: Radius.xl, padding: Spacing.md, borderWidth: 1 },
  mine: { alignSelf: 'flex-end', backgroundColor: Colors.primary[600], borderColor: Colors.primary[500], borderBottomRightRadius: 5 },
  theirs: { alignSelf: 'flex-start', backgroundColor: Colors.neutral[850], borderColor: Colors.neutral[700], borderBottomLeftRadius: 5 },
  messageText: { fontSize: 16, lineHeight: 23, color: Colors.neutral[50], textAlign: 'left' },
  time: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.neutral[400], marginTop: 5, textAlign: 'left' },
  voiceMessage: { minWidth: 190, flexDirection: 'row', alignItems: 'center', gap: 9 },
  voicePlay: { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.neutral[50] + '22', alignItems: 'center', justifyContent: 'center' },
  wave: { flex: 1, height: 28, flexDirection: 'row', gap: 4, alignItems: 'center' },
  waveLine: { width: 3, height: 9, borderRadius: 2, backgroundColor: Colors.neutral[200] },
  voiceDuration: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.neutral[300] },
  coach: { padding: Spacing.md, backgroundColor: Colors.warning[500] + '0B', borderTopWidth: 1, borderTopColor: Colors.warning[500] + '20', gap: 8 },
  coachTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  coachTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: Colors.warning[300] },
  coachActions: { flexDirection: 'row-reverse', gap: 7 },
  coachAction: { flex: 1, minHeight: 34, borderRadius: Radius.md, backgroundColor: Colors.neutral[850], flexDirection: 'row-reverse', gap: 5, alignItems: 'center', justifyContent: 'center' },
  coachActionText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.neutral[300] },
  assistResult: { borderRadius: Radius.md, backgroundColor: Colors.neutral[900], padding: Spacing.sm, gap: 5 },
  assistPrimary: { fontSize: 14, lineHeight: 20, color: Colors.neutral[50], textAlign: 'left' },
  assistExplanation: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.neutral[500], textAlign: 'right' },
  useSuggestion: { alignSelf: 'flex-end', borderRadius: Radius.full, backgroundColor: Colors.primary[500], paddingHorizontal: 10, paddingVertical: 6 },
  useSuggestionText: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.onColor },
  alternative: { fontSize: 12, color: Colors.primary[200], textAlign: 'left', paddingVertical: 3 },
  recording: { minHeight: 34, backgroundColor: Colors.error[500] + '12', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  recordDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.error[400] },
  recordingText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.error[300] },
  error: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.error[300], textAlign: 'center', paddingHorizontal: Spacing.md, paddingTop: 6, backgroundColor: Colors.neutral[900] },
  composer: { padding: Spacing.sm, paddingBottom: 18, backgroundColor: Colors.neutral[900], flexDirection: 'row-reverse', alignItems: 'flex-end', gap: 7 },
  helper: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.neutral[850], alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, minHeight: 42, maxHeight: 100, borderRadius: 21, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[700], paddingHorizontal: Spacing.md, paddingVertical: 10, fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[100] },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.primary[500], alignItems: 'center', justifyContent: 'center' },
  recordStop: { backgroundColor: Colors.error[500] },
  disabled: { opacity: .4 },
});
