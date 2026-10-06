import { COURSE_LEVELS, SENTENCE_LESSONS } from './courseContent';
import { ensureChatIdentity } from './conversations';
import { getCourseProgress } from './courseProgress';
import { supabase } from './supabase';

export interface EmmaInputMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface EmmaCorrection {
  original: string;
  improved: string;
  explanationFa: string;
}

export interface EmmaReply {
  reply: string;
  translation: string;
  correction: EmmaCorrection | null;
  suggestions: string[];
}

export interface EmmaPracticeContext {
  level: string;
  situation: string;
  lessonTitleFa: string;
  targetWords: string[];
  suggestionCount: number;
}

export async function getEmmaPracticeContext(): Promise<EmmaPracticeContext> {
  const progress = await getCourseProgress();
  const lesson = SENTENCE_LESSONS.find((item) => item.id === progress.currentLessonId) ?? SENTENCE_LESSONS[0];
  const level = COURSE_LEVELS.find((item) => item.id === lesson.levelId) ?? COURSE_LEVELS[0];
  const targetWords = Array.from(new Set(lesson.sentences.flatMap((sentence) => sentence.vocabulary.map((item) => item.word)))).slice(0, 8);

  return {
    level: `${level.title} (${level.cefr})`,
    situation: lesson.situation,
    lessonTitleFa: lesson.title,
    targetWords,
    // Help fades automatically as the learner advances, without adding any setting.
    suggestionCount: lesson.levelId === 0 ? 3 : lesson.levelId === 1 ? 2 : 1,
  };
}

export async function askEmma(
  messages: EmmaInputMessage[],
  options?: Partial<EmmaPracticeContext>,
): Promise<EmmaReply> {
  await ensureChatIdentity();
  const context = { ...await getEmmaPracticeContext(), ...options };
  const { data, error } = await supabase.functions.invoke('emma-chat', {
    body: {
      messages: messages.slice(-12),
      level: context.level,
      situation: context.situation,
      targetWords: context.targetWords,
      suggestionCount: context.suggestionCount,
    },
  });
  if (error) throw new Error('سرویس Emma در دسترس نیست. اتصال اینترنت را بررسی کنید.');
  if (data?.error) throw new Error(String(data.error));
  if (!data?.reply) throw new Error('پاسخی از Emma دریافت نشد.');
  return {
    reply: String(data.reply),
    translation: String(data.translation || ''),
    correction: data.correction || null,
    suggestions: Array.isArray(data.suggestions) ? data.suggestions.map(String).slice(0, context.suggestionCount) : [],
  };
}
