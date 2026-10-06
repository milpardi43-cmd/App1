// Pairing engine — the "TV-style" link between the dashboard (phone 1)
// and the agent (phone 2), on top of the existing `devices` table:
//
//   1. Dashboard creates a session row: pairing_code (6 digits), is_paired=false.
//   2. Agent enters the code (or scans it as a QR) → fills the row with its
//      real name/model/OS. The row is now "pending approval".
//   3. Dashboard shows the pending device (like a TV confirmation popup)
//      → confirm sets is_paired=true (agent sees this and goes live)
//      → reject deletes the row (agent sees "rejected").
//   4. Sessions expire after PAIRING_TTL_MS; stale rows are cleaned lazily.

import { supabase } from './supabase';
import type { Device } from './types';

export const PAIRING_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function isSupabaseConfigured(): boolean {
  const url = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').trim();
  return url.startsWith('https://') && !url.includes('placeholder');
}

function generateCode(): string {
  // Avoid trivial codes; 6 numeric digits, Persian-friendly.
  return String(Math.floor(100000 + Math.random() * 900000));
}

// ---------- Dashboard (phone 1) ----------

export interface PairingSession {
  id: string;
  code: string;
  createdAt: number;
  expiresAt: number;
}

export async function createPairingSession(): Promise<PairingSession | null> {
  // Best-effort cleanup of stale pending sessions so codes stay unique.
  try {
    const staleBefore = new Date(Date.now() - PAIRING_TTL_MS).toISOString();
    await supabase
      .from('devices')
      .delete()
      .eq('is_paired', false)
      .is('device_model', null)
      .lt('created_at', staleBefore);
  } catch {
    // ignore — cleanup is best-effort
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const code = generateCode();
    const { data, error } = await supabase
      .from('devices')
      .insert({
        device_name: 'در انتظار اتصال…',
        pairing_code: code,
        is_paired: false,
        is_online: false,
      })
      .select('id, created_at')
      .single();

    if (!error && data) {
      const createdAt = data.created_at ? Date.parse(data.created_at) : Date.now();
      return { id: data.id, code, createdAt, expiresAt: createdAt + PAIRING_TTL_MS };
    }
    // pairing_code has a UNIQUE constraint — a collision just retries.
  }
  return null;
}

export async function cancelPairingSession(sessionId: string): Promise<void> {
  try {
    await supabase.from('devices').delete().eq('id', sessionId).eq('is_paired', false);
  } catch {
    // ignore
  }
}

/** Devices that introduced themselves with a code and are waiting for approval. */
export async function fetchPendingDevices(): Promise<Device[]> {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('is_paired', false)
    .not('device_model', 'is', null)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data as Device[]) || [];
}

export async function confirmDevice(deviceId: string): Promise<boolean> {
  const { error } = await supabase
    .from('devices')
    .update({ is_paired: true, is_online: true, last_seen: new Date().toISOString() })
    .eq('id', deviceId);
  return !error;
}

export async function rejectDevice(deviceId: string): Promise<void> {
  try {
    await supabase.from('devices').delete().eq('id', deviceId);
  } catch {
    // ignore
  }
}

// ---------- Agent (phone 2) ----------

export type ClaimResult =
  | { ok: true; device: Device }
  | { ok: false; reason: 'invalid_code' | 'not_configured' | 'error' };

export interface AgentIdentity {
  deviceName: string;
  deviceModel: string;
  osVersion: string;
}

export async function claimPairingCode(code: string, identity: AgentIdentity): Promise<ClaimResult> {
  if (!isSupabaseConfigured()) return { ok: false, reason: 'not_configured' };

  const since = new Date(Date.now() - PAIRING_TTL_MS).toISOString();
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .eq('pairing_code', code.trim())
    .eq('is_paired', false)
    .is('device_model', null) // not already claimed by another phone
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return { ok: false, reason: 'error' };
  const row = ((data as Device[]) || [])[0];
  if (!row) return { ok: false, reason: 'invalid_code' };

  const { data: updated, error: updateError } = await supabase
    .from('devices')
    .update({
      device_name: identity.deviceName,
      device_model: identity.deviceModel,
      os_version: identity.osVersion,
      is_online: true,
      last_seen: new Date().toISOString(),
    })
    .eq('id', row.id)
    .is('device_model', null) // guard against a race with another phone
    .select('*')
    .single();

  if (updateError || !updated) {
    return { ok: false, reason: updateError ? 'error' : 'invalid_code' };
  }
  return { ok: true, device: updated as Device };
}

export type PairingStatus = 'waiting' | 'approved' | 'rejected' | 'gone';

export async function checkPairingStatus(deviceId: string): Promise<PairingStatus> {
  const { data, error } = await supabase
    .from('devices')
    .select('id, is_paired')
    .eq('id', deviceId)
    .maybeSingle();
  if (error) return 'waiting'; // transient errors shouldn't kick the user out
  if (!data) return 'rejected';
  return data.is_paired ? 'approved' : 'waiting';
}

export async function markOffline(deviceId: string): Promise<void> {
  try {
    await supabase
      .from('devices')
      .update({ is_online: false, last_seen: new Date().toISOString() })
      .eq('id', deviceId);
  } catch {
    // ignore
  }
}
