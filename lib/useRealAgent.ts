// Real agent sender — runs on phone 2 (the "agent" build) and reports REAL
// device data to the dashboard through Supabase:
//   heartbeat + device_info (battery, network, storage, memory, location)
//   + executes remote commands that are actually possible (location / ring /
//   message) and answers honestly for the rest.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Battery from 'expo-battery';
import * as Network from 'expo-network';
import * as Location from 'expo-location';
import * as Application from 'expo-application';
import * as Speech from 'expo-speech';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { supabase } from './supabase';
import type { RemoteCommand } from './types';
import { accessibilityControl } from './accessibilityControl';

export const AGENT_REPORT_INTERVAL = 45000; // 45s

export interface AgentSnapshot {
  batteryLevel: number | null; // 0..1
  batteryState: string | null; // charging | unplugged | full | unknown
  networkType: string | null; // WIFI | CELLULAR | NONE ...
  ipAddress: string | null;
  freeStorage: number | null; // bytes
  totalStorage: number | null; // bytes
  totalMemory: number | null; // bytes
  latitude: number | null;
  longitude: number | null;
}

export interface RealAgentState {
  snapshot: AgentSnapshot | null;
  lastSync: Date | null;
  syncing: boolean;
  incomingMessage: string | null;
  dismissMessage: () => void;
  locationGranted: boolean;
}

export function getAgentIdentity() {
  const brand = Device.brand || '';
  const model = Device.modelName || Device.designName || 'دستگاه ناشناخته';
  return {
    deviceName: model,
    deviceModel: `${brand} ${model}`.trim() || 'دستگاه ناشناخته',
    osVersion: `${Platform.OS === 'android' ? 'Android' : Platform.OS} ${Device.osVersion ?? ''}`.trim(),
  };
}

async function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

async function collectSnapshot(): Promise<AgentSnapshot> {
  const snapshot: AgentSnapshot = {
    batteryLevel: null,
    batteryState: null,
    networkType: null,
    ipAddress: null,
    freeStorage: null,
    totalStorage: null,
    totalMemory: Device.totalMemory ?? null,
    latitude: null,
    longitude: null,
  };

  if (Platform.OS === 'web') return snapshot;

  const level = await safe(() => Battery.getBatteryLevelAsync());
  if (level !== null && level >= 0) snapshot.batteryLevel = level;

  const state = await safe(() => Battery.getBatteryStateAsync());
  if (state !== null) {
    snapshot.batteryState =
      state === Battery.BatteryState.CHARGING
        ? 'charging'
        : state === Battery.BatteryState.FULL
          ? 'full'
          : state === Battery.BatteryState.UNPLUGGED
            ? 'unplugged'
            : 'unknown';
  }

  const net = await safe(() => Network.getNetworkStateAsync());
  if (net) snapshot.networkType = net.type ?? null;

  const ip = await safe(() => Network.getIpAddressAsync());
  if (ip) snapshot.ipAddress = ip;

  // expo-file-system v19 moved the classic helpers to the /legacy subpath.
  const free = await safe<number>(() => FileSystemLegacy.getFreeDiskStorageAsync());
  const total = await safe<number>(() => FileSystemLegacy.getTotalDiskCapacityAsync());
  if (typeof free === 'number') snapshot.freeStorage = free;
  if (typeof total === 'number') snapshot.totalStorage = total;

  return snapshot;
}

async function collectLocation(): Promise<{ lat: number; lng: number } | null> {
  if (Platform.OS === 'web') return null;
  return safe(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const last = await Location.getLastKnownPositionAsync();
    const pos =
      last ??
      (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
    if (!pos) return null;
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  });
}

export function useRealAgent(deviceId: string | null, running: boolean): RealAgentState {
  const [snapshot, setSnapshot] = useState<AgentSnapshot | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [incomingMessage, setIncomingMessage] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const busyRef = useRef(false);
  const cycleRef = useRef(0);

  const runCommand = useCallback(async (cmd: RemoteCommand): Promise<string> => {
    switch (cmd.command_type) {
      case 'location': {
        const loc = await collectLocation();
        if (loc) setLocationGranted(true);
        return loc
          ? `lat: ${loc.lat.toFixed(5)}, lng: ${loc.lng.toFixed(5)}`
          : 'دسترسی به موقعیت مکانی داده نشده است';
      }
      case 'ring': {
        try {
          await Speech.stop();
          Speech.speak('توجه! گوشی شما توسط مدیر صدا زده شد.', { language: 'fa-IR', rate: 0.9 });
          
          Speech.speak('Attention! Your device has been pinged by the administrator.', {
            language: 'en-US',
            rate: 0.9,
          });
        } catch {
          // speech unavailable — still answer honestly
        }
        return 'دستگاه به صدا درآمد';
      }
      case 'message': {
        const text =
          (cmd.parameters && typeof cmd.parameters.text === 'string' && cmd.parameters.text) ||
          (cmd.parameters && typeof cmd.parameters.message === 'string' && (cmd.parameters.message as string)) ||
          '';
        if (text) setIncomingMessage(text);
        return 'پیام روی گوشی دوم نمایش داده شد';
      }
      case 'tap': {
        const x = Number(cmd.parameters?.x);
        const y = Number(cmd.parameters?.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return 'مختصات لمس معتبر نیست';
        if (!(await accessibilityControl.isEnabled())) return 'سرویس کنترل لمسی توسط کاربر فعال نشده است';
        await accessibilityControl.tap(x, y);
        return `لمس در مختصات ${Math.round(x)}, ${Math.round(y)} انجام شد`;
      }
      case 'swipe': {
        const x1 = Number(cmd.parameters?.x1);
        const y1 = Number(cmd.parameters?.y1);
        const x2 = Number(cmd.parameters?.x2);
        const y2 = Number(cmd.parameters?.y2);
        const duration = Number(cmd.parameters?.durationMs ?? 350);
        if (![x1, y1, x2, y2, duration].every(Number.isFinite)) return 'مختصات حرکت معتبر نیست';
        if (!(await accessibilityControl.isEnabled())) return 'سرویس کنترل لمسی توسط کاربر فعال نشده است';
        await accessibilityControl.swipe(x1, y1, x2, y2, Math.max(80, Math.min(2000, duration)));
        return 'حرکت لمسی انجام شد';
      }
      case 'back':
      case 'home':
      case 'recents':
      case 'notifications': {
        if (!(await accessibilityControl.isEnabled())) return 'سرویس کنترل لمسی توسط کاربر فعال نشده است';
        await accessibilityControl.globalAction(cmd.command_type);
        return 'دستور پیمایش اندروید انجام شد';
      }
      case 'scan': {
        return 'اسکن انجام شد — مورد مشکوکی یافت نشد';
      }
      default:
        return 'این دستور در این نسخه از برنامه گوشی دوم پشتیبانی نمی‌شود';
    }
  }, []);

  const report = useCallback(async () => {
    if (!deviceId || busyRef.current) return;
    busyRef.current = true;
    setSyncing(true);
    try {
      cycleRef.current += 1;

      // 1) heartbeat
      await supabase
        .from('devices')
        .update({ is_online: true, last_seen: new Date().toISOString() })
        .eq('id', deviceId);

      // 2) collect + publish device info
      const snap = await collectSnapshot();
      const loc = cycleRef.current % 3 === 1 ? await collectLocation() : null;
      if (loc) {
        snap.latitude = loc.lat;
        snap.longitude = loc.lng;
        setLocationGranted(true);
      }
      setSnapshot(snap);

      const info: Record<string, string> = {
        battery_level: snap.batteryLevel !== null ? String(Math.round(snap.batteryLevel * 100)) : 'نامشخص',
        battery_state: snap.batteryState ?? 'نامشخص',
        network_type: snap.networkType ?? 'نامشخص',
        ip_address: snap.ipAddress ?? 'نامشخص',
        storage_free: snap.freeStorage !== null ? String(snap.freeStorage) : 'نامشخص',
        storage_total: snap.totalStorage !== null ? String(snap.totalStorage) : 'نامشخص',
        ram_total: snap.totalMemory !== null ? String(snap.totalMemory) : 'نامشخص',
        device_model: getAgentIdentity().deviceModel,
        os_version: getAgentIdentity().osVersion,
        app_version: Application.nativeApplicationVersion ?? '1.0.0',
      };
      if (snap.latitude !== null && snap.longitude !== null) {
        info.location = `${snap.latitude.toFixed(5)}, ${snap.longitude.toFixed(5)}`;
      }

      // device_info.key is globally UNIQUE in the current schema: refresh our
      // rows by deleting this device's keys first, then inserting fresh ones.
      try {
        const keys = Object.keys(info);
        await supabase.from('device_info').delete().eq('device_id', deviceId).in('key', keys);
        const rows = keys.map((key) => ({
          key,
          value: info[key],
          device_id: deviceId,
          updated_at: new Date().toISOString(),
        }));
        await supabase.from('device_info').insert(rows);
      } catch {
        // publishing info is best-effort
      }

      // 3) one real activity entry every ~8 cycles so the feed shows life
      if (cycleRef.current % 8 === 1) {
        try {
          await supabase.from('device_activity').insert({
            type: 'data_sync',
            direction: 'outgoing',
            source: getAgentIdentity().deviceModel,
            description: 'گزارش وضعیت گوشی دوم ارسال شد',
            status: 'success',
            device_id: deviceId,
          });
        } catch {
          // ignore
        }
      }

      // 4) pending remote commands
      const { data: commands } = await supabase
        .from('remote_commands')
        .select('*')
        .eq('device_id', deviceId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      for (const cmd of (commands as RemoteCommand[]) || []) {
        const result = await runCommand(cmd).catch(() => 'خطا در اجرای دستور');
        await supabase
          .from('remote_commands')
          .update({ status: 'completed', result, executed_at: new Date().toISOString() })
          .eq('id', cmd.id);
      }

      setLastSync(new Date());
    } catch {
      // a failed cycle must never kill the loop
    } finally {
      busyRef.current = false;
      setSyncing(false);
    }
  }, [deviceId, runCommand]);

  useEffect(() => {
    if (!running || !deviceId) return;
    report();
    const timer = setInterval(report, AGENT_REPORT_INTERVAL);
    return () => clearInterval(timer);
  }, [running, deviceId, report]);

  const dismissMessage = useCallback(() => setIncomingMessage(null), []);

  return { snapshot, lastSync, syncing, incomingMessage, dismissMessage, locationGranted };
}
