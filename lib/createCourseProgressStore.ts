import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from './supabase';

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy';

export interface SentenceReviewCard {
  id: string;
  lessonId: string;
  sentenceId: string;
  dueAt: string;
  intervalDays: number;
  ease: number;
  repetitions: number;
  lapses: number;
  lastReviewedAt?: string;
}

export interface CourseProgress {
  completedLessonIds: string[];
  currentLessonId: string;
  /** Kept for backward compatibility with early preview installs. */
  reviewSentenceIds: string[];
  reviewCards: SentenceReviewCard[];
  /** Historical inferred labels, NOT mastery. English completion no longer adds these. */
  learnedEssential504Words: string[];
  dailyGoalMinutes: number;
  todayMinutes: number;
  activityDate: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalMinutes: number;
  updatedAt: string;
}

export interface ProgressStoreOptions {
  key: string;
  lessons: ReadonlyArray<{ id: string; sentences: ReadonlyArray<{ id: string }> }>;
  wordsForLesson?: (id: string) => string[];
  /** Only the legacy English store uses learning_progress until multilingual cloud migration. */
  cloudSync: boolean;
  /** Disable estimated study minutes in evidence-based guided courses. */
  recordEstimatedTime?: boolean;
  markVocabularyOnCompletion?: boolean;
  explicitCloudSync?: boolean;
  /** Best-effort personal cloud sync after a successful local write; local storage remains authoritative. */
  afterLocalSave?: () => void;
}
export function createCourseProgressStore(options: ProgressStoreOptions) {
  if (!options.lessons.length) throw new Error('Progress store requires a curriculum');
  if (options.cloudSync && options.key !== 'sentence_course_progress_v1') throw new Error('Multilingual cloud sync is not configured');
  const KEY = options.key;
  const SENTENCE_LESSONS = options.lessons;
  const getEssential504WordsForLesson = options.wordsForLesson ?? (() => []);
const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function initialProgress(): CourseProgress {
  return {
    completedLessonIds: [],
    currentLessonId: SENTENCE_LESSONS[0].id,
    reviewSentenceIds: [],
    reviewCards: [],
    learnedEssential504Words: [],
    dailyGoalMinutes: 10,
    todayMinutes: 0,
    activityDate: localDateKey(),
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalMinutes: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

const reviewCardId = (lessonId: string, sentenceId: string) => `${lessonId}:${sentenceId}`;

function cardsForLesson(lessonId: string, dueAt = new Date()): SentenceReviewCard[] {
  const lesson = SENTENCE_LESSONS.find((item) => item.id === lessonId);
  if (!lesson) return [];
  return lesson.sentences.map((sentence) => ({
    id: reviewCardId(lesson.id, sentence.id),
    lessonId: lesson.id,
    sentenceId: sentence.id,
    dueAt: dueAt.toISOString(),
    intervalDays: 0,
    ease: 2.3,
    repetitions: 0,
    lapses: 0,
  }));
}

function normalizeProgress(value: Partial<CourseProgress>): CourseProgress {
  const base = initialProgress();
  if (!value || typeof value!=='object' || Array.isArray(value)) throw new Error('پیشرفت ذخیره‌شده معتبر نیست؛ نسخه پشتیبان را بررسی کنید.');
  const completedLessonIds = Array.isArray(value.completedLessonIds) ? value.completedLessonIds.filter(x=>typeof x==='string') : [];
  const existingCards = Array.isArray(value.reviewCards) ? value.reviewCards.filter(card=>card&&typeof card.id==='string'&&typeof card.lessonId==='string'&&typeof card.sentenceId==='string'&&Number.isFinite(Date.parse(card.dueAt))&&[card.intervalDays,card.ease,card.repetitions,card.lapses].every(n=>Number.isFinite(n)&&n>=0)) : [];
  const cardMap = new Map(existingCards.map((card) => [card.id, card]));

  // Preview users who finished lessons before the scheduler existed are
  // migrated automatically and do not lose their learning history.
  completedLessonIds.forEach((lessonId) => {
    cardsForLesson(lessonId).forEach((card) => {
      if (!cardMap.has(card.id)) cardMap.set(card.id, card);
    });
  });

  const isNewDay = value.activityDate !== localDateKey();
  return {
    ...base,
    dailyGoalMinutes: Number.isFinite(value.dailyGoalMinutes)&&value.dailyGoalMinutes!>0?Math.min(1440,value.dailyGoalMinutes!):base.dailyGoalMinutes,
    currentLessonId: SENTENCE_LESSONS.some(l=>l.id===value.currentLessonId)?value.currentLessonId!:base.currentLessonId,
    updatedAt: typeof value.updatedAt==='string'&&Number.isFinite(Date.parse(value.updatedAt))?value.updatedAt:base.updatedAt,
    completedLessonIds,
    reviewSentenceIds: Array.isArray(value.reviewSentenceIds) ? value.reviewSentenceIds : [],
    reviewCards: Array.from(cardMap.values()),
    learnedEssential504Words: Array.isArray(value.learnedEssential504Words) ? value.learnedEssential504Words : [],
    activityDate: localDateKey(),
    todayMinutes: isNewDay ? 0 : (Number.isFinite(value.todayMinutes)?Math.max(0,value.todayMinutes!):0),
    currentStreak: Number.isFinite(value.currentStreak)?Math.max(0,value.currentStreak!):0,
    longestStreak: Number.isFinite(value.longestStreak)?Math.max(0,value.longestStreak!):0,
    lastActiveDate: typeof value.lastActiveDate === 'string' ? value.lastActiveDate : null,
    totalMinutes: Number.isFinite(value.totalMinutes)?Math.max(0,value.totalMinutes!):0,
  };
}

async function readRaw(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(KEY);
  }
  return AsyncStorage.getItem(KEY);
}

async function writeRaw(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(KEY, value);
    return;
  }
  await AsyncStorage.setItem(KEY, value);
}

function previousLocalDateKey(date = new Date()): string {
  const previous = new Date(date);
  previous.setDate(previous.getDate() - 1);
  return localDateKey(previous);
}

function addDailyActivity(progress: CourseProgress, minutes: number, now = new Date()): CourseProgress {
  const today = localDateKey(now);
  const alreadyActiveToday = progress.lastActiveDate === today;
  const nextStreak = alreadyActiveToday
    ? progress.currentStreak
    : progress.lastActiveDate === previousLocalDateKey(now)
      ? progress.currentStreak + 1
      : 1;
  return {
    ...progress,
    activityDate: today,
    todayMinutes: Math.min(progress.dailyGoalMinutes, progress.todayMinutes + (options.recordEstimatedTime===false?0:minutes)),
    totalMinutes: progress.totalMinutes + (options.recordEstimatedTime===false?0:minutes),
    currentStreak: nextStreak,
    longestStreak: Math.max(progress.longestStreak, nextStreak),
    lastActiveDate: today,
    updatedAt: now.toISOString(),
  };
}

async function progressUserId(): Promise<string | null> {
  const { data: session } = await supabase.auth.getSession();
  if (session.session?.user.id) return session.session.user.id;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) return null;
  return data.user?.id ?? null;
}

async function uploadProgress(progress: CourseProgress): Promise<void> {
  if (!options.cloudSync) return;
  try {
    const userId = await progressUserId();
    if (!userId) return;
    await supabase.from('learning_progress').upsert({
      user_id: userId,
      progress,
      updated_at: progress.updatedAt,
    }, { onConflict: 'user_id' });
  } catch {
    // Local progress remains authoritative while offline and is retried later.
  }
}

async function saveProgress(progress: CourseProgress): Promise<CourseProgress> {
  const old=await readRaw();
  if(old!==null){normalizeProgress(JSON.parse(old));if(Platform.OS==='web')window.localStorage.setItem(KEY+'_backup_v1',old);else await AsyncStorage.setItem(KEY+'_backup_v1',old);}
  await writeRaw(JSON.stringify(progress));
  if (!options.explicitCloudSync) await uploadProgress(progress);
  try { options.afterLocalSave?.(); } catch { /* Local progress is already safely stored. */ }
  return progress;
}

// Reads never turn malformed/unreadable storage into an apparently empty course.
async function getCourseProgress(): Promise<CourseProgress> {
  const raw=await readRaw();
  return normalizeProgress(raw===null?{}:JSON.parse(raw));
}
let queue:Promise<unknown>=Promise.resolve();
function serial<T>(job:()=>Promise<T>):Promise<T>{const next=queue.then(job,job);queue=next.catch(()=>undefined);return next;}
/** Explicit, bounded, optimistic synchronization. No anonymous identity is created by a read. */
async function syncCourseProgress():Promise<CourseProgress>{
 if(!options.cloudSync)throw new Error('این مسیر فقط روی دستگاه ذخیره می‌شود.');
 return serial(async()=>{
  let authTimer:ReturnType<typeof setTimeout>|undefined;
  const auth=await Promise.race([supabase.auth.getSession(),new Promise<never>((_,reject)=>{authTimer=setTimeout(()=>reject(new Error('نشست حساب پاسخ نداد؛ سابقه محلی محفوظ است.')),10000);})]).finally(()=>clearTimeout(authTimer));
  const session=auth.data.session;
  if(!session?.user.id)throw new Error('نشست قبلی حساب در دسترس نیست. بدون ورود به همان حساب، سابقه ابری قابل بازیابی نیست؛ سابقه محلی محفوظ است.');
  const userId=session.user.id;
  let observed:CourseProgress|null=null;
  for(let tries=0;tries<3;tries++){
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),10000);
   try{
    const {data,error}=await supabase.from('learning_progress').select('progress,updated_at').eq('user_id',userId).abortSignal(controller.signal).maybeSingle();
    if(error)throw new Error('خواندن پیشرفت ابری ممکن نشد؛ سابقه محلی محفوظ است.');
    const current=await getCourseProgress();
    const local:CourseProgress=observed?mergeCourseProgress(current,observed):current;
    const merged:CourseProgress=data?.progress?mergeCourseProgress(local,normalizeProgress(data.progress)):local;
    observed=merged;
    merged.updatedAt=new Date(Math.max(Date.now(),Date.parse(data?.updated_at??'1970-01-01')+1,Date.parse(merged.updatedAt)+1)).toISOString();
    const payload={user_id:userId,progress:merged,updated_at:merged.updatedAt};
    const result=data
      ?await supabase.from('learning_progress').update(payload).eq('user_id',userId).eq('updated_at',data.updated_at).select('updated_at').abortSignal(controller.signal).maybeSingle()
      :await supabase.from('learning_progress').insert(payload).select('updated_at').abortSignal(controller.signal).maybeSingle();
    if(result.error){if(result.error.code==='23505')continue;throw new Error('ذخیره ابری انجام نشد؛ اتصال یا دسترسی حساب را بررسی کنید.');}
    if(!result.data)continue; // Another device won: read, merge and retry, never overwrite blindly.
    const final=mergeCourseProgress(await getCourseProgress(),merged);await saveProgress(final);return final;
   }finally{clearTimeout(timer);}
  }
  throw new Error('همزمان دستگاه دیگری تغییر ایجاد کرد؛ کمی بعد دوباره همگام‌سازی کنید.');
 });
}

async function completeSentenceLesson(lessonId: string, nextLessonId?: string): Promise<CourseProgress> {
  if (!SENTENCE_LESSONS.some(l => l.id === lessonId)) throw new Error('Unknown lesson for this language');
  if (nextLessonId && !SENTENCE_LESSONS.some(l => l.id === nextLessonId)) throw new Error('Unknown next lesson for this language');
  const current = await getCourseProgress();
  const cardMap = new Map(current.reviewCards.map((card) => [card.id, card]));
  cardsForLesson(lessonId).forEach((card) => {
    if (!cardMap.has(card.id)) cardMap.set(card.id, card);
  });
  const next = addDailyActivity({
    ...current,
    completedLessonIds: Array.from(new Set([...current.completedLessonIds, lessonId])),
    reviewCards: Array.from(cardMap.values()),
    learnedEssential504Words: Array.from(
      new Set([
        ...current.learnedEssential504Words,
        ...(options.markVocabularyOnCompletion===false?[]:getEssential504WordsForLesson(lessonId)),
      ]),
    ),
    currentLessonId: nextLessonId ?? current.currentLessonId,
  }, 8);
  return saveProgress(next);
}

async function getDueReviewCards(now = new Date()): Promise<SentenceReviewCard[]> {
  const progress = await getCourseProgress();
  const validIds = new Set(
    SENTENCE_LESSONS.flatMap((lesson) => lesson.sentences.map((sentence) => reviewCardId(lesson.id, sentence.id))),
  );
  return progress.reviewCards
    .filter((card) => validIds.has(card.id) && new Date(card.dueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
}

async function rateReviewCard(
  cardId: string,
  rating: ReviewRating,
  now = new Date(),
): Promise<SentenceReviewCard | null> {
  const progress = await getCourseProgress();
  const card = progress.reviewCards.find((item) => item.id === cardId);
  if (!card) return null;

  let intervalDays = card.intervalDays;
  let ease = card.ease;
  let repetitions = card.repetitions + 1;
  let lapses = card.lapses;
  let dueInMs: number;

  if (rating === 'again') {
    intervalDays = 0;
    ease = Math.max(1.3, ease - 0.2);
    repetitions = 0;
    lapses += 1;
    dueInMs = 10 * MINUTE;
  } else if (rating === 'hard') {
    intervalDays = intervalDays < 1 ? 1 : Math.max(1, Math.ceil(intervalDays * 1.2));
    ease = Math.max(1.3, ease - 0.1);
    dueInMs = intervalDays * DAY;
  } else if (rating === 'easy') {
    intervalDays = intervalDays < 1 ? 4 : Math.max(4, Math.round(intervalDays * (ease + 0.35)));
    ease = Math.min(3, ease + 0.1);
    dueInMs = intervalDays * DAY;
  } else {
    intervalDays = card.repetitions === 0 ? 1 : card.repetitions === 1 ? 3 : Math.max(3, Math.round(intervalDays * ease));
    dueInMs = intervalDays * DAY;
  }

  const updated: SentenceReviewCard = {
    ...card,
    intervalDays,
    ease,
    repetitions,
    lapses,
    lastReviewedAt: now.toISOString(),
    dueAt: new Date(now.getTime() + dueInMs).toISOString(),
  };
  const next = addDailyActivity({
    ...progress,
    reviewCards: progress.reviewCards.map((item) => item.id === cardId ? updated : item),
  }, 1, now);
  await saveProgress(next);
  return updated;
}

async function addSentenceToReview(sentenceId: string, lessonId?: string): Promise<void> {
  const lesson = lessonId
    ? SENTENCE_LESSONS.find((item) => item.id === lessonId)
    : SENTENCE_LESSONS.find((item) => item.sentences.some((sentence) => sentence.id === sentenceId));
  if (!lesson) return;
  const current = await getCourseProgress();
  const id = reviewCardId(lesson.id, sentenceId);
  if (current.reviewCards.some((card) => card.id === id)) return;
  const card = cardsForLesson(lesson.id).find((item) => item.id === id);
  if (!card) return;
  await saveProgress({
    ...current,
    reviewCards: [...current.reviewCards, card],
    updatedAt: new Date().toISOString(),
  });
}

function validBackup(value: unknown): value is { schema: 1; courseKey: string; progress: Partial<CourseProgress> & Pick<CourseProgress, 'completedLessonIds' | 'currentLessonId' | 'reviewCards'> } {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const envelope = value as Record<string, unknown>;
  if (envelope.schema !== 1 || envelope.courseKey !== KEY || !envelope.progress || typeof envelope.progress !== 'object' || Array.isArray(envelope.progress)) return false;
  const progress = envelope.progress as Record<string, unknown>;
  const lessonIds = new Set(SENTENCE_LESSONS.map(lesson => lesson.id));
  if (typeof progress.currentLessonId !== 'string' || !lessonIds.has(progress.currentLessonId)
    || !Array.isArray(progress.completedLessonIds)
    || !progress.completedLessonIds.every((id: unknown) => typeof id === 'string' && lessonIds.has(id))
    || !Array.isArray(progress.reviewCards)) return false;
  if (progress.reviewSentenceIds !== undefined && (!Array.isArray(progress.reviewSentenceIds) || !progress.reviewSentenceIds.every((id: unknown) => typeof id === 'string'))) return false;
  if (progress.learnedEssential504Words !== undefined && (!Array.isArray(progress.learnedEssential504Words) || !progress.learnedEssential504Words.every((word: unknown) => typeof word === 'string'))) return false;
  const cardIds = new Set<string>();
  for (const value of progress.reviewCards) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const card = value as Partial<SentenceReviewCard>;
    const lesson = SENTENCE_LESSONS.find(item => item.id === card.lessonId);
    const sentenceExists = lesson?.sentences.some(sentence => sentence.id === card.sentenceId) ?? false;
    if (!lesson || !sentenceExists || typeof card.lessonId !== 'string' || typeof card.sentenceId !== 'string'
      || card.id !== reviewCardId(card.lessonId, card.sentenceId) || cardIds.has(card.id)
      || typeof card.dueAt !== 'string' || !Number.isFinite(Date.parse(card.dueAt))
      || !Number.isFinite(card.intervalDays) || card.intervalDays! < 0
      || !Number.isFinite(card.ease) || card.ease! < 1.3 || card.ease! > 3
      || !Number.isInteger(card.repetitions) || card.repetitions! < 0
      || !Number.isInteger(card.lapses) || card.lapses! < 0
      || (card.lastReviewedAt !== undefined && (typeof card.lastReviewedAt !== 'string' || !Number.isFinite(Date.parse(card.lastReviewedAt))))) return false;
    cardIds.add(card.id);
  }
  return true;
}

async function restoreProgressText(text: string): Promise<CourseProgress> {
  let parsed: unknown;
  try { parsed = JSON.parse(text); }
  catch { throw new Error('نسخهٔ پشتیبان JSON معتبر نیست.'); }
  if (!validBackup(parsed)) throw new Error('نسخهٔ پشتیبان نامعتبر است یا به این دوره تعلق ندارد.');
  const raw = await readRaw();
  if (raw !== null) {
    if (Platform.OS === 'web') window.localStorage.setItem(KEY + '_before_restore', raw);
    else await AsyncStorage.setItem(KEY + '_before_restore', raw);
  }
  const restored = normalizeProgress(parsed.progress);
  let current: CourseProgress | null = null;
  try { current = await getCourseProgress(); }
  catch { /* The original raw bytes are retained above before explicit recovery. */ }
  const next = current ? mergeCourseProgress(current, restored) : restored;
  next.updatedAt = new Date().toISOString();
  await writeRaw(JSON.stringify(next));
  try { options.afterLocalSave?.(); } catch { /* The local restore is already safely stored. */ }
  return next;
}

async function mergeRemoteProgress(value: unknown): Promise<CourseProgress> {
  if (!validBackup({ schema: 1, courseKey: KEY, progress: value })) {
    throw new Error('پیشرفت ابری آلمانی معتبر نیست؛ دادهٔ محلی تغییری نکرد.');
  }
  return serial(async () => {
    const local = await getCourseProgress();
    const remote = normalizeProgress(value as Partial<CourseProgress>);
    const merged = mergeCourseProgress(local, remote);
    if (JSON.stringify(merged) !== JSON.stringify(local)) await saveProgress(merged);
    return merged;
  });
}

return { getCourseProgress, syncCourseProgress, mergeRemoteProgress,
 completeSentenceLesson:(id:string,next?:string)=>serial(()=>completeSentenceLesson(id,next)),
 getDueReviewCards, rateReviewCard:(id:string,rating:ReviewRating,now?:Date)=>serial(()=>rateReviewCard(id,rating,now)),
 addSentenceToReview:(id:string,lesson?:string)=>serial(()=>addSentenceToReview(id,lesson)),
 exportPreviousProgress:async()=>{const raw=Platform.OS==='web'?window.localStorage.getItem(KEY+'_backup_v1'):await AsyncStorage.getItem(KEY+'_backup_v1');if(!raw)throw new Error('هنوز پشتیبان خودکار موجود نیست.');return JSON.stringify({schema:1,courseKey:KEY,progress:normalizeProgress(JSON.parse(raw))},null,2);},
 exportProgress:async()=>JSON.stringify({schema:1,courseKey:KEY,progress:await getCourseProgress()},null,2),
 restoreProgress:(text:string)=>serial(()=>restoreProgressText(text)),
};
}

/** Union of non-destructive learning evidence; scheduling conflicts use the latest card review. */
export function mergeCourseProgress(a:CourseProgress,b:CourseProgress):CourseProgress {
 const difference=Date.parse(a.updatedAt)-Date.parse(b.updatedAt);
 const newer=difference>0?a:difference<0?b:JSON.stringify(a)>=JSON.stringify(b)?a:b;
 const cards=new Map<string,SentenceReviewCard>();
 for(const card of [...a.reviewCards,...b.reviewCards]){const prev=cards.get(card.id);const time=(x:SentenceReviewCard)=>Date.parse(x.lastReviewedAt??'1970-01-01')||0;
  if(!prev||time(card)>time(prev)||(time(card)===time(prev)&&JSON.stringify(card)>JSON.stringify(prev)))cards.set(card.id,card);
 }
 return {...newer,completedLessonIds:[...new Set([...a.completedLessonIds,...b.completedLessonIds])].sort(),reviewSentenceIds:[...new Set([...a.reviewSentenceIds,...b.reviewSentenceIds])].sort(),learnedEssential504Words:[...new Set([...a.learnedEssential504Words,...b.learnedEssential504Words])].sort(),reviewCards:[...cards.values()].sort((x,y)=>x.id.localeCompare(y.id)),totalMinutes:Math.max(a.totalMinutes,b.totalMinutes),longestStreak:Math.max(a.longestStreak,b.longestStreak)};
}
