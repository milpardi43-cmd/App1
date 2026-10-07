import type { RealtimeChannel, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface RealContact {
  id: string;
  conversationId: string;
  displayName: string;
  avatarEmoji: string;
  englishLevel: string;
  lastSeen: string | null;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'voice' | 'system';
  body: string | null;
  mediaPath: string | null;
  readAt: string | null;
  createdAt: string;
}

/** Shown when `.env` has no real Supabase project configured. */
export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  'برای این بخش باید اتصال Supabase تنظیم شود. مقادیر EXPO_PUBLIC_SUPABASE_URL و ' +
  'EXPO_PUBLIC_SUPABASE_ANON_KEY را در فایل .env بگذارید و سرور را یک‌بار با ' +
  'npx expo start -c دوباره اجرا کنید.';

function readableError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error || '');
  if (/anonymous sign-ins|Anonymous sign-ins/i.test(message)) {
    return 'ورود ناشناس در تنظیمات Authentication پروژه Supabase فعال نشده است.';
  }
  if (/invalid or expired/i.test(message)) return 'کد دعوت اشتباه است یا اعتبار آن تمام شده است.';
  if (/own invite/i.test(message)) return 'نمی‌توانید کد دعوت خودتان را وارد کنید.';
  if (/could not find the function|function .* does not exist|schema cache/i.test(message)) {
    // The invite RPCs live in supabase/SETUP-CONVERSATIONS.sql (shipped as a
    // migration in supabase/migrations/). Until they are applied, no code can
    // ever be generated — surface that instead of the raw Postgres text.
    return 'توابع ساخت کد دعوت روی Supabase اجرا نشده‌اند. فایل supabase/SETUP-CONVERSATIONS.sql را در SQL Editor اجرا کنید یا ./scripts/setup-production.sh را بزنید.';
  }
  if (/relation .* does not exist/i.test(message)) {
    return 'جدول‌های مکالمه هنوز روی Supabase ساخته نشده‌اند.';
  }
  if (/fetch failed|failed to fetch|network ?error|load failed|timeout|timed out|ENOTFOUND|ERR_/i.test(message)) {
    return 'ارتباط با سرور Supabase برقرار نشد. اتصال اینترنت دستگاه و درست بودن مقادیر .env را بررسی کنید.';
  }
  return message || 'ارتباط با سرور برقرار نشد.';
}

export async function ensureChatIdentity(displayName = 'زبان‌آموز'): Promise<User> {
  const { data: sessionData } = await supabase.auth.getSession();
  let user = sessionData.session?.user ?? null;
  if (!user) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) throw new Error(readableError(error));
    user = data.user;
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    { id: user.id, display_name: displayName, last_seen: new Date().toISOString() },
    { onConflict: 'id' },
  );
  if (profileError) throw new Error(readableError(profileError));
  return user;
}

export async function createRealContactInvite(displayName = 'زبان‌آموز'): Promise<string> {
  await ensureChatIdentity(displayName);
  const { data, error } = await supabase.rpc('create_contact_invite', { p_display_name: displayName });
  if (error || typeof data !== 'string') throw new Error(readableError(error));
  return data;
}

export async function claimRealContactInvite(code: string, displayName = 'زبان‌آموز'): Promise<string> {
  await ensureChatIdentity(displayName);
  const { data, error } = await supabase.rpc('claim_contact_invite', {
    p_code: code.trim(),
    p_display_name: displayName,
  });
  if (error || typeof data !== 'string') throw new Error(readableError(error));
  return data;
}

export async function listRealContacts(): Promise<RealContact[]> {
  await ensureChatIdentity();
  const { data, error } = await supabase
    .from('learning_contacts')
    .select(
      'conversation_id,created_at,contact:profiles!learning_contacts_contact_id_fkey(id,display_name,avatar_emoji,english_level,last_seen)',
    )
    .order('created_at', { ascending: false });
  if (error) throw new Error(readableError(error));

  return ((data || []) as any[]).flatMap((row) => {
    const contact = Array.isArray(row.contact) ? row.contact[0] : row.contact;
    if (!contact) return [];
    return [{
      id: contact.id,
      conversationId: row.conversation_id,
      displayName: contact.display_name,
      avatarEmoji: contact.avatar_emoji || '🙂',
      englishLevel: contact.english_level || 'Foundation',
      lastSeen: contact.last_seen ?? null,
    } satisfies RealContact];
  });
}

function mapMessage(row: any): DirectMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    type: row.message_type,
    body: row.body,
    mediaPath: row.media_path,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function listMessages(conversationId: string): Promise<DirectMessage[]> {
  await ensureChatIdentity();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(200);
  if (error) throw new Error(readableError(error));
  return (data || []).map(mapMessage);
}

export async function sendTextMessage(conversationId: string, body: string): Promise<DirectMessage> {
  const user = await ensureChatIdentity();
  const clean = body.trim();
  if (!clean) throw new Error('پیام خالی است.');
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, message_type: 'text', body: clean })
    .select('*')
    .single();
  if (error || !data) throw new Error(readableError(error));
  return mapMessage(data);
}

export async function sendVoiceMessage(
  conversationId: string,
  audioUri: string,
  durationSeconds: number,
): Promise<DirectMessage> {
  const user = await ensureChatIdentity();
  const response = await fetch(audioUri);
  if (!response.ok) throw new Error('فایل صوتی خوانده نشد.');
  const audio = await response.arrayBuffer();
  if (!audio.byteLength) throw new Error('فایل صوتی خالی است.');
  if (audio.byteLength > 12 * 1024 * 1024) throw new Error('پیام صوتی باید کمتر از ۱۲ مگابایت باشد.');

  const extension = audioUri.toLowerCase().includes('.webm') ? 'webm' : 'm4a';
  const mediaPath = `${conversationId}/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('chat-voice')
    .upload(mediaPath, audio, { contentType: extension === 'webm' ? 'audio/webm' : 'audio/mp4', upsert: false });
  if (uploadError) throw new Error(readableError(uploadError));

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      message_type: 'voice',
      body: String(Math.max(1, Math.round(durationSeconds))),
      media_path: mediaPath,
    })
    .select('*')
    .single();
  if (error || !data) {
    await supabase.storage.from('chat-voice').remove([mediaPath]);
    throw new Error(readableError(error));
  }
  return mapMessage(data);
}

export async function getVoiceMessageUrl(mediaPath: string): Promise<string> {
  await ensureChatIdentity();
  const { data, error } = await supabase.storage.from('chat-voice').createSignedUrl(mediaPath, 60 * 60);
  if (error || !data?.signedUrl) throw new Error(readableError(error));
  return data.signedUrl;
}

export async function currentChatUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export function subscribeToMessages(
  conversationId: string,
  onMessage: (message: DirectMessage) => void,
): RealtimeChannel {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
      (payload) => onMessage(mapMessage(payload.new)),
    )
    .subscribe();
}

export async function unsubscribeFromMessages(channel: RealtimeChannel | null): Promise<void> {
  if (channel) await supabase.removeChannel(channel);
}
