import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SENTENCE_LESSONS, type SentenceLesson } from '@/lib/courseContent';
import type { Task } from '@/lib/englishSupplement/content';
import { EnglishSupplementTask, supplementStyles as s } from './EnglishSupplementTask';
import { CORE_LESSON_EVIDENCE } from '@/lib/englishFoundationEvidence';
import { loadStudy, recordLessonEvidence } from '@/lib/englishStudyState';

/** Existing end-of-lesson stage: mapped Foundation, Survival and new Everyday lessons use goal-based checks; all other lessons retain their current checks. */
export function EnglishLessonEvidence({ lesson, onPassed }: { lesson: SentenceLesson; onPassed: () => void }) {
  const goalTasks = CORE_LESSON_EVIDENCE[lesson.id];
  const isCoreEvidence = !!goalTasks;
  const tasks = useMemo(() => {
    if (goalTasks) return [...goalTasks];
    const sentence = lesson.sentences[0];
    const other = lesson.sentences[1] ?? sentence;
    const distractors = [...new Set(SENTENCE_LESSONS.flatMap(item => item.sentences.map(entry => entry.fa)))]
      .filter(value => value !== sentence.fa).slice(0, 2);
    const options = [sentence.fa, ...distractors];
    const offset = lesson.order % options.length;
    options.push(...options.splice(0, offset));
    return [
      {
        id: `legacy-${lesson.id}-listening`, skill: 'listening', prompt: 'جمله را بشنوید و معنی آن را انتخاب کنید.',
        audio: sentence.en, options, answers: [sentence.fa], explanation: 'به واژه‌ها و معنی جمله در همین درس برگردید.',
      },
      {
        id: `legacy-${lesson.id}-writing`, skill: 'writing', prompt: 'جملهٔ انگلیسیِ مربوط به این معنی را مطابق متن همین درس بنویسید.',
        source: other.fa, answers: [other.en], explanation: `الگوی درس: ${other.en}`,
      },
    ] satisfies Task[];
  }, [goalTasks, lesson]);

  const [done, setDone] = useState<Record<string, boolean>>({});
  const doneRef = useRef(done);
  const [loading, setLoading] = useState(isCoreEvidence);
  const [loadError, setLoadError] = useState('');
  const onPassedRef = useRef(onPassed);
  doneRef.current = done;

  useEffect(() => { onPassedRef.current = onPassed; }, [onPassed]);

  useEffect(() => {
    if (!isCoreEvidence) return;
    let active = true;
    void loadStudy().then(state => {
      if (!active) return;
      const saved = state.lessonEvidence[lesson.id] ?? {};
      const restored = Object.fromEntries(tasks.map(item => {
        const result = saved[item.id];
        return [item.id, !!result?.correct && (item.skill !== 'listening' || result.heard)];
      }));
      doneRef.current = restored;
      setDone(restored);
      setLoading(false);
      setLoadError('');
      if (tasks.every(item => restored[item.id])) onPassedRef.current();
    }).catch(() => {
      if (!active) return;
      setLoadError('سنجش ذخیره‌شده خوانده نشد؛ برای حفظ اطلاعات، پاسخ تازه ثبت نمی‌شود.');
      setLoading(false);
    });
    return () => { active = false; };
  }, [isCoreEvidence, lesson.id, tasks]);

  async function saveCoreLessonResult(task: Task, correct: boolean, heard: boolean) {
    await recordLessonEvidence(lesson.id, task.id, task.skill, correct, heard);
    const next = { ...doneRef.current, [task.id]: correct && (task.skill !== 'listening' || heard) };
    doneRef.current = next;
    setDone(next);
    if (tasks.every(item => next[item.id])) onPassedRef.current();
  }

  function saveExistingResult(task: Task, correct: boolean) {
    const next = { ...doneRef.current, [task.id]: correct };
    doneRef.current = next;
    setDone(next);
    if (tasks.every(item => next[item.id])) onPassedRef.current();
  }

  const description = isCoreEvidence
    ? `برای پایان این درس، به هر ${tasks.length} سنجشِ مرتبط با هدف‌هایش درست پاسخ دهید. پاسخ نادرست را می‌توانید دوباره امتحان کنید؛ شنیداری پس از پخش کامل ثبت می‌شود. گفتار خودکار نمره‌گذاری نمی‌شود.`
    : 'برای ثبت پایان درس، یک سؤال شنیداری و یک پاسخ نوشتاری را درست انجام دهید. شنیدن بر اساس پایان پخش ثبت می‌شود، نه ارزیابی تلفظ شما.';

  return <View style={{ width: '100%', marginTop: 20 }}>
    <Text style={s.heading}>سنجش کوتاه پایان درس</Text>
    <Text style={s.text}>{description}</Text>
    {loading ? <Text style={s.text}>در حال بازیابی پاسخ‌های ذخیره‌شده…</Text> : null}
    {!!loadError && <Text style={s.error}>{loadError}</Text>}
    {!loading && !loadError && tasks.map(task => done[task.id]
      ? <Text key={task.id} style={s.success}>{task.skill === 'listening' ? 'شنیداری' : task.skill === 'writing' ? 'نوشتاری' : task.skill === 'reading' ? 'درک مطلب' : 'واژگان و دستور'}: ثبت شد ✓</Text>
      : isCoreEvidence
        ? <EnglishSupplementTask key={task.id} task={task} onSave={saveCoreLessonResult} />
        : <EnglishSupplementTask key={task.id} task={task} onResult={(_progress, correct) => saveExistingResult(task, correct)} />)}
  </View>;
}
