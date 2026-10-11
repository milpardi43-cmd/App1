import { FEATURES } from './features';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { isSupabaseConfigured } from './pairing';
import { SENTENCE_LESSONS } from './courseContent';
import canonical from '../assets/data/essential504.json';

// Separate auth storage: signing into the panel must not replace the learner session.
let client: SupabaseClient | null = null;
export function adminClient() {
  if (!FEATURES.adminPanel) throw new Error('پنل مدیریت فعلاً غیرفعال است.');
  if (!isSupabaseConfigured()) throw new Error('ابتدا اتصال Supabase پروژه را تنظیم کنید.');
  if (!client) client = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL!.trim(), process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim(), {
    auth: { storageKey: 'education-admin-session-v1', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false,
      storage: Platform.OS === 'web' ? {
        getItem: (key) => typeof window === 'undefined' ? null : window.localStorage.getItem(key),
        setItem: (key, value) => { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); },
        removeItem: (key) => { if (typeof window !== 'undefined') window.localStorage.removeItem(key); },
      } : AsyncStorage },
  });
  return client;
}
export interface StudentRow {
  student_id: string; display_name: string; status: 'active' | 'paused'; consent_at: string;
  synced_at: string | null; summary: Record<string, unknown> | null;
}
export interface EducationInvite { id: string; label: string; code: string; expires_at: string; claimed_at: string | null }
const lessonIds = new Set(SENTENCE_LESSONS.map(l => l.id));
const words = new Set<string>(canonical);
export function progressMetrics(summary: Record<string, unknown> | null) {
  const count = (value: unknown, allowed: Set<string>) => Array.isArray(value) ? new Set(value.filter((v): v is string => typeof v === 'string' && allowed.has(v))).size : 0;
  const finite = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const lessons = count(summary?.completedLessonIds, lessonIds);
  return { lessons, percent: Math.round(lessons / SENTENCE_LESSONS.length * 100), words: count(summary?.learnedEssential504Words, words), minutes: finite(summary?.totalMinutes), streak: finite(summary?.currentStreak) };
}
export function educationError(error: unknown): string {
  const text = error && typeof error === 'object' && 'message' in error ? String(error.message) : '';
  if (/EDUCATION_DISABLED/.test(text)) return 'مدیریت آموزشی فعلاً توسط مدیر سامانه غیرفعال شده است.';
  if (/INVITE_INVALID|invalid input syntax for type uuid/.test(text)) return 'دعوت معتبر نیست؛ ممکن است منقضی، لغو یا مصرف شده باشد.';
  if (/SELF_INVITE/.test(text)) return 'مدیر نمی‌تواند دعوت خودش را بپذیرد.';
  if (/duplicate key/.test(text)) return 'قبلاً عضو این گروه آموزشی شده‌اید.';
  if (/NAME_INVALID/.test(text)) return 'نامی بین ۱ تا ۸۰ نویسه بنویسید.';
  if (/Invalid login credentials/.test(text)) return 'ایمیل یا رمز ورود درست نیست.';
  if (/schema cache|does not exist/.test(text)) return 'راه‌اندازی پایگاه‌داده پنل هنوز کامل نیست؛ راهنمای EDUCATION-ADMIN را اجرا کنید.';
  if (/ADMIN_REQUIRED|permission denied|row-level security/.test(text)) return 'این حساب اجازه انجام این کار را ندارد.';
  if (/CONSENT_REQUIRED/.test(text)) return 'اشتراک پیشرفت فقط با رضایت شما انجام می‌شود.';
  if (/AUTH_REQUIRED|JWT|session/i.test(text)) return 'نشست ورود معتبر نیست؛ دوباره وارد شوید.';
  return 'عملیات انجام نشد. اتصال شبکه و تنظیمات پنل را بررسی کنید و دوباره تلاش کنید.';
}
export async function loadAdminData() {
  const db = adminClient();
  const { data: allowed, error: authError } = await db.rpc('is_education_admin');
  if (authError) throw authError;
  if (!allowed) throw new Error('ADMIN_REQUIRED');
  const [roster, invites] = await Promise.all([
    db.rpc('education_roster'),
    db.from('education_invites').select('id,label,code,expires_at,claimed_at').order('created_at', { ascending: false }),
  ]);
  if (roster.error) throw roster.error;
  if (invites.error) throw invites.error;
  return { students: (roster.data || []) as StudentRow[], invites: (invites.data || []) as EducationInvite[] };
}
export const demoStudents: StudentRow[] = [
  { student_id: 'demo-1', display_name: 'سارا احمدی · نمونه', status: 'active', consent_at: '2026-10-01T10:00:00Z', synced_at: '2026-10-07T08:30:00Z', summary: { completedLessonIds: SENTENCE_LESSONS.slice(0, 24).map(l => l.id), learnedEssential504Words: canonical.slice(0, 68), totalMinutes: 260, currentStreak: 7 } },
  { student_id: 'demo-2', display_name: 'علی رضایی · نمونه', status: 'active', consent_at: '2026-10-02T10:00:00Z', synced_at: '2026-10-06T11:20:00Z', summary: { completedLessonIds: SENTENCE_LESSONS.slice(0, 9).map(l => l.id), learnedEssential504Words: canonical.slice(0, 24), totalMinutes: 95, currentStreak: 3 } },
  { student_id: 'demo-3', display_name: 'مریم نوری · نمونه', status: 'paused', consent_at: '2026-10-03T10:00:00Z', synced_at: null, summary: null },
];
