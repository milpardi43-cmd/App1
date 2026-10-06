import { getCourseProgress } from './courseProgress';
import { ensureChatIdentity } from './conversations';
import { supabase } from './supabase';

export type HumanAssistMode = 'translate' | 'correct' | 'suggest';

export interface HumanAssistResult {
  primary: string;
  explanationFa: string;
  alternatives: string[];
}

export async function requestHumanChatAssist(
  conversationId: string,
  mode: HumanAssistMode,
  draft: string,
  recentMessages: Array<{ mine: boolean; text: string }>,
): Promise<HumanAssistResult> {
  await ensureChatIdentity();
  const progress = await getCourseProgress();
  const completed = progress.completedLessonIds.length;
  const suggestionCount = completed < 12 ? 3 : completed < 45 ? 2 : 1;
  const { data, error } = await supabase.functions.invoke('human-chat-assist', {
    body: {
      conversationId,
      mode,
      draft: draft.trim().slice(0, 1500),
      suggestionCount,
      recentMessages: recentMessages.slice(-10).map((item) => ({
        role: item.mine ? 'learner' : 'contact',
        text: item.text.slice(0, 1000),
      })),
    },
  });
  if (error) throw new Error('دستیار خصوصی در دسترس نیست. اتصال اینترنت را بررسی کنید.');
  if (data?.error) throw new Error(String(data.error));
  const primary = String(data?.primary || '').trim();
  if (!primary) throw new Error('پاسخ معتبری از دستیار دریافت نشد.');
  return {
    primary,
    explanationFa: String(data?.explanationFa || ''),
    alternatives: Array.isArray(data?.alternatives) ? data.alternatives.map(String).filter(Boolean).slice(0, 3) : [],
  };
}
