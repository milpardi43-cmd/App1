import { useCallback, useEffect, useRef, useState } from 'react';
import { mediaDevices, MediaStream, RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';
import { ensureChatIdentity } from './conversations';
import { getRtcIceServers } from './rtcConfig';
import { supabase } from './supabase';
import type { VoiceCallPhase, VoiceCallState } from './voiceCall';

interface VoiceCallRow {
  id: string;
  conversation_id: string;
  caller_id: string;
  status: 'ringing' | 'accepted' | 'declined' | 'ended' | 'failed';
  offer: { type: 'offer'; sdp: string };
  answer: { type: 'answer'; sdp: string } | null;
}

function waitForIceGathering(pc: RTCPeerConnection, timeoutMs = 9000): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      (pc as any).onicegatheringstatechange = null;
      resolve();
    };
    const timer = setTimeout(finish, timeoutMs);
    (pc as any).onicegatheringstatechange = () => {
      if (pc.iceGatheringState === 'complete') finish();
    };
  });
}

export function useVoiceCall(conversationId: string, contactName?: string): VoiceCallState {
  const [phase, setPhase] = useState<VoiceCallPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [incomingCallerName, setIncomingCallerName] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<VoiceCallRow | null>(null);
  const phaseRef = useRef<VoiceCallPhase>('idle');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const updatePhase = useCallback((next: VoiceCallPhase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const releaseMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    setMuted(false);
  }, []);

  const preparePeer = useCallback(async () => {
    const iceServers = await getRtcIceServers(true);
    const permissionStream = await mediaDevices.getUserMedia({ audio: true, video: false });
    const stream = permissionStream as MediaStream;
    streamRef.current = stream;
    const pc = new RTCPeerConnection({ iceServers } as any);
    pcRef.current = pc;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    (pc as any).onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') updatePhase('connected');
      if (pc.connectionState === 'failed') {
        setError('ارتباط تماس برقرار نشد. شبکه یا TURN را بررسی کنید.');
        updatePhase('error');
        releaseMedia();
      }
    };
    // Remote audio tracks are rendered by the native WebRTC audio session.
    (pc as any).ontrack = () => undefined;
    return pc;
  }, [releaseMedia, updatePhase]);

  const finishCall = useCallback(async (status: 'declined' | 'ended' | 'failed' = 'ended') => {
    const callId = callRef.current?.id;
    updatePhase('ending');
    releaseMedia();
    callRef.current = null;
    setIncomingCallerName(null);
    if (callId) {
      await supabase.from('voice_calls').update({ status, ended_at: new Date().toISOString() }).eq('id', callId);
    }
    updatePhase('idle');
  }, [releaseMedia, updatePhase]);

  const startCall = useCallback(async () => {
    if (phaseRef.current !== 'idle') return;
    try {
      setError(null);
      updatePhase('outgoing');
      const user = await ensureChatIdentity();
      const pc = await preparePeer();
      const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: false });
      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc);
      if (!pc.localDescription?.sdp) throw new Error('پیشنهاد تماس ساخته نشد.');
      const { data, error: insertError } = await supabase.from('voice_calls').insert({
        conversation_id: conversationId,
        caller_id: user.id,
        status: 'ringing',
        offer: { type: 'offer', sdp: pc.localDescription.sdp },
      }).select('*').single();
      if (insertError || !data) throw insertError || new Error('تماس ایجاد نشد.');
      callRef.current = data as VoiceCallRow;
    } catch (cause) {
      releaseMedia();
      setError(cause instanceof Error ? cause.message : 'تماس شروع نشد.');
      updatePhase('error');
    }
  }, [conversationId, preparePeer, releaseMedia, updatePhase]);

  const acceptCall = useCallback(async () => {
    const call = callRef.current;
    if (!call || phaseRef.current !== 'incoming') return;
    try {
      setError(null);
      updatePhase('connecting');
      const pc = await preparePeer();
      await pc.setRemoteDescription(new RTCSessionDescription(call.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitForIceGathering(pc);
      if (!pc.localDescription?.sdp) throw new Error('پاسخ تماس ساخته نشد.');
      const { error: updateError } = await supabase.from('voice_calls').update({
        status: 'accepted',
        answer: { type: 'answer', sdp: pc.localDescription.sdp },
        answered_at: new Date().toISOString(),
      }).eq('id', call.id).eq('status', 'ringing');
      if (updateError) throw updateError;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'پاسخ به تماس انجام نشد.');
      await finishCall('failed');
    }
  }, [finishCall, preparePeer, updatePhase]);

  const declineCall = useCallback(() => finishCall('declined'), [finishCall]);
  const hangUp = useCallback(() => finishCall('ended'), [finishCall]);
  const toggleMute = useCallback(() => {
    const next = !muted;
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next; });
    setMuted(next);
  }, [muted]);

  useEffect(() => {
    let active = true;
    const check = async () => {
      if (!active) return;
      const call = callRef.current;
      if (call && phaseRef.current === 'outgoing') {
        const { data } = await supabase.from('voice_calls').select('*').eq('id', call.id).maybeSingle();
        if (!data) return;
        if (data.status === 'accepted' && data.answer?.sdp && !pcRef.current?.remoteDescription) {
          await pcRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
          updatePhase('connecting');
        } else if (data.status === 'declined' || data.status === 'ended' || data.status === 'failed') {
          await finishCall('ended');
        }
        return;
      }
      if (call && ['incoming', 'connecting', 'connected'].includes(phaseRef.current)) {
        const { data } = await supabase.from('voice_calls').select('status').eq('id', call.id).maybeSingle();
        if (data && ['declined', 'ended', 'failed'].includes(data.status)) await finishCall('ended');
        return;
      }
      if (phaseRef.current !== 'idle') return;
      const user = await ensureChatIdentity();
      const { data } = await supabase.from('voice_calls').select('*')
        .eq('conversation_id', conversationId).eq('status', 'ringing').neq('caller_id', user.id)
        .order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (data && active) {
        callRef.current = data as VoiceCallRow;
        setIncomingCallerName(contactName || 'مخاطب');
        updatePhase('incoming');
      }
    };
    void check();
    pollRef.current = setInterval(() => void check(), 1500);
    return () => {
      active = false;
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      releaseMedia();
    };
  }, [contactName, conversationId, finishCall, releaseMedia, updatePhase]);

  return { phase, error, muted, incomingCallerName, startCall, acceptCall, declineCall, hangUp, toggleMute };
}
