import { useCallback, useEffect, useRef, useState } from 'react';
import {
  mediaDevices,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { supabase } from './supabase';
import { getRtcIceServers } from './rtcConfig';

export type SharePhase = 'idle' | 'requesting' | 'waiting' | 'connected' | 'stopping' | 'error';

interface ScreenShareRow {
  id: string;
  device_id: string;
  status: 'offered' | 'connected' | 'stopped' | 'failed';
  offer: { type: 'offer'; sdp: string };
  answer: { type: 'answer'; sdp: string } | null;
  created_at: string;
}

function waitForIceGathering(pc: RTCPeerConnection, timeoutMs = 8000): Promise<void> {
  if (pc.iceGatheringState === 'complete') return Promise.resolve();
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      (pc as any).onicegatheringstatechange = null;
      resolve();
    };
    const check = () => {
      if (pc.iceGatheringState === 'complete') finish();
    };
    const timer = setTimeout(finish, timeoutMs);
    (pc as any).onicegatheringstatechange = check;
  });
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

export function useScreenBroadcaster(deviceId: string | null) {
  const [phase, setPhase] = useState<SharePhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const release = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
    stopStream(streamRef.current);
    streamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
  }, []);

  const stop = useCallback(async () => {
    setPhase('stopping');
    const sessionId = sessionIdRef.current;
    release();
    sessionIdRef.current = null;
    if (sessionId) {
      await supabase
        .from('screen_share_sessions')
        .update({ status: 'stopped', updated_at: new Date().toISOString() })
        .eq('id', sessionId);
    }
    setPhase('idle');
  }, [release]);

  const start = useCallback(async () => {
    if (!deviceId || (phase !== 'idle' && phase !== 'error')) return;
    setError(null);
    setPhase('requesting');
    try {
      // Android shows its own non-bypassable consent dialog here. The package's
      // foreground MediaProjection service keeps a visible notification active.
      const stream = (await (mediaDevices.getDisplayMedia as any)({
        video: true,
        audio: false,
        android: { createConfigForDefaultDisplay: true, resolutionScale: 0.6 },
      } as never)) as MediaStream;
      streamRef.current = stream;

      const iceServers = await getRtcIceServers(true);
      const pc = new RTCPeerConnection({ iceServers } as any);
      pcRef.current = pc;
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        (track as any).onended = () => void stop();
      });

      (pc as any).onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') setPhase('connected');
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          setError('ارتباط تصویر قطع شد. دوباره تلاش کنید.');
          setPhase('error');
        }
      };

      const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc);
      if (!pc.localDescription?.sdp) throw new Error('WebRTC offer was not created');

      // Remove stale sessions for this device before advertising the new one.
      await supabase
        .from('screen_share_sessions')
        .update({ status: 'stopped', updated_at: new Date().toISOString() })
        .eq('device_id', deviceId)
        .in('status', ['offered', 'connected']);

      const { data, error: insertError } = await supabase
        .from('screen_share_sessions')
        .insert({
          device_id: deviceId,
          status: 'offered',
          offer: { type: 'offer', sdp: pc.localDescription.sdp },
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();
      if (insertError || !data) throw insertError || new Error('Could not create screen session');

      sessionIdRef.current = data.id;
      setPhase('waiting');
      pollRef.current = setInterval(async () => {
        const id = sessionIdRef.current;
        const activePc = pcRef.current;
        if (!id || !activePc || activePc.remoteDescription) return;
        const { data: row } = await supabase
          .from('screen_share_sessions')
          .select('answer,status')
          .eq('id', id)
          .maybeSingle();
        if (row?.status === 'stopped') {
          await stop();
          return;
        }
        const answer = row?.answer as ScreenShareRow['answer'];
        if (answer?.sdp) {
          await activePc.setRemoteDescription(new RTCSessionDescription(answer));
          setPhase('connected');
        }
      }, 1500);
    } catch (cause) {
      release();
      setError(cause instanceof Error ? cause.message : 'اجازه اشتراک صفحه صادر نشد.');
      setPhase('error');
    }
  }, [deviceId, phase, release, stop]);

  const reset = useCallback(() => {
    release();
    setError(null);
    setPhase('idle');
  }, [release]);

  useEffect(() => () => release(), [release]);
  return { phase, error, start, stop, reset };
}
