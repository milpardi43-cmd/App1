import { loadSession, saveSession, clearSession, type LearningSession } from '@/lib/languages/sessionStore';
import { LtrDirection } from '@/lib/theme';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { GermanCoursePage as CoursePage, GermanCourseButton as CourseButton, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { FIRST_MEETING } from '@/lib/languages/germanFirstMeeting';
import type { GuidedLesson, LearningExercise, LearningUnit } from '@/lib/languages/learningDesign';
import { evaluateExercise, getUnitProgress, saveLessonActivity, saveUnitMission, scoreAttempt, type ExerciseResult } from '@/lib/languages/unitProgress';
import { reviewForUnit } from '@/lib/languages/unitReview';
import { findGuidedUnit, repairTarget, unitForLesson, unitHref, unitReviewHref } from '@/lib/languages/guidedCourses';
import { LEVEL_EXAMS } from '@/lib/languages/germanLevelExams';
import { FOUNDATION_UNITS } from '@/lib/languages/germanCompletionContent';
import { GERMAN_A1_UNITS } from '@/lib/languages/germanUnits';
import { toPersianDigits as fa } from '@/lib/format';

export default function GuidedPracticeRoute() {
  const { language, lesson: id, mission, fresh, unit: unitId } = useLocalSearchParams<{ language: string; lesson?: string; mission?: string; fresh?: string; unit?: string }>();
  const resolvedUnit = unitId === undefined && id ? unitForLesson(language,id) : findGuidedUnit(language,unitId);
  const unit = resolvedUnit ?? FIRST_MEETING;
  const lesson = unit.lessons.find(l => l.id === id);
  const isPublishedGermanSkills = language === 'de' && resolvedUnit?.id === 'de-a1-skills';
  const isMission = mission === '1';
  const isLevelExam=LEVEL_EXAMS.some(e=>e.id===unit.id);
  const routeKey = `${language}:${unit.id}:${isMission ? 'mission' : id}:${fresh ?? ''}`;
  const [gate, setGate] = useState<{ key: string; access: 'allowed' | 'blocked' | 'error'; draft: LearningSession | null } | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let live = true;
    if ((language === 'de' && !isPublishedGermanSkills) || !resolvedUnit || resolvedUnit.language !== language || (!isMission && !lesson)) return;
    const prerequisites=unit.id==='de-zero-final'?FOUNDATION_UNITS:unit.id==='de-a1-final'?GERMAN_A1_UNITS:[];
    Promise.all([getUnitProgress(unit), loadSession(unit, isMission ? null : lesson!.id),Promise.all(prerequisites.map(getUnitProgress))]).then(([p, draft, prerequisiteProgress]) => {
      const levelReady=!isLevelExam||prerequisites.every((u,i)=>u.lessons.every(l=>prerequisiteProgress[i].activities[l.id])&&prerequisiteProgress[i].missions.length>0);
      const allowed = !isMission || (unit.lessons.every(l => p.activities[l.id])&&levelReady);
      const draftId = draft?.attemptId;
      const alreadyFinished = draftId && (isMission ? p.missions.some(a => a.id === draftId) : p.activities[lesson!.id]?.id === draftId);
      if (alreadyFinished) draft = null;
      if (live) setGate({ key: routeKey, access: allowed ? 'allowed' : 'blocked', draft });
    }).catch(() => { if (live) setGate({ key: routeKey, access: 'error', draft: null }); });
    return () => { live = false; };
  }, [routeKey, retry, isPublishedGermanSkills]);
  if (language === 'de' && !isPublishedGermanSkills) return <Redirect href={'/learn/de/library' as never} />;
  if (!resolvedUnit || resolvedUnit.language !== language || (!isMission && !lesson)) return <CoursePage title="تمرین پیدا نشد" back={language==='en'?'/learn/en':unitHref(unit)}>{null}</CoursePage>;
  const access = gate?.key === routeKey ? gate.access : 'loading';
  if (access !== 'allowed') return <CoursePage title={lesson?.title ?? `مأموریت: ${unit.title}`} back={unitHref(unit)}><Text style={s.description}>{access === 'loading' ? 'در حال آماده‌کردن جلسه و بررسی پیش‌نویس…' : access === 'blocked' ? isLevelExam ? 'برای سنجش پایان سطح، ابتدا همه درس‌ها و مأموریت‌های واحدهای همان سطح را انجام دهید. سابقه و نتیجه پاک نشده است.' : 'ابتدا تمرین‌های همه درس‌های این واحد را انجام دهید؛ سپس مأموریت فعال می‌شود.' : 'پیشرفت خوانده نشد؛ دسترسی ذخیره‌سازی دستگاه را بررسی کنید.'}</Text>{access === 'error' && <CourseButton title="تلاش دوباره" onPress={()=>setRetry(v=>v+1)}/>}</CoursePage>;
  return <PracticeSession key={routeKey} unit={unit} lesson={isMission ? undefined : lesson} initial={gate!.draft} />;
}

function PracticeSession({ unit, lesson, initial }: { unit: LearningUnit; lesson?: GuidedLesson; initial: LearningSession | null }) {
  const router = useRouter();
  const mission = !lesson;
  const exercises = lesson?.exercises ?? unit.mission;
  const [stage, setStage] = useState<'context' | 'pattern' | 'exercise' | 'done'>(initial?.stage ?? (mission ? 'exercise' : 'context'));
  const [listeningPanel,setListeningPanel]=useState(initial?.presentation?.listening??false);
  const [outro,setOutro]=useState<4|5|null>(initial?.presentation?.outro??null);
  const [translation, setTranslation] = useState(false);
  const [index, setIndex] = useState(initial?.index ?? 0);
  const [answer, setAnswer] = useState(initial?.answer ?? '');
  const [ordered, setOrdered] = useState<number[]>(initial?.ordered ?? []);
  const [assisted, setAssisted] = useState(initial?.assisted ?? false);
  const [played, setPlayed] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(initial?.feedback ?? null);
  const [results, setResults] = useState<ExerciseResult[]>(initial?.results ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [audioError, setAudioError] = useState('');
  const [attemptId] = useState(() => initial?.attemptId ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [draftStatus, setDraftStatus] = useState<'saving' | 'saved' | 'error'>('saving');
  const [draftRetry, setDraftRetry] = useState(0);
  const [restartConfirm, setRestartConfirm] = useState(false);
  useEffect(() => {
    if (stage === 'done') return;
    let current = true;
    setDraftStatus('saving');
    saveSession(unit, {
      presentation:{listening:listeningPanel,outro},
      schemaVersion: 1, unitId: unit.id, contentVersion: unit.version,
      lessonId: lesson?.id ?? null, attemptId, stage, index, answer, ordered, assisted, feedback, results,
      updatedAt: new Date().toISOString(),
    }).then(()=>{if(current)setDraftStatus('saved');}).catch(()=>{if(current)setDraftStatus('error');});
    return ()=>{current=false;};
  }, [stage, index, answer, ordered, assisted, feedback, results, attemptId, lesson?.id, draftRetry,listeningPanel,outro]);
  const exercise = exercises[index];
  const activeAudio = useRef<object | null>(null);
  const actionLock = useRef(false);
  useEffect(() => { actionLock.current = false; }, [index, feedback, stage]);
  useEffect(() => () => { activeAudio.current = null; void Speech.stop(); }, []);
  const speak = (text: string, listeningId?: string) => {
    // Each playback has its own token: a cancelled/error callback cannot unlock a later replay.
    const token={};activeAudio.current=token;setAudioError('');void Speech.stop();
    Speech.speak(text, { language: unit.language==='en'?'en-US':'de-DE', rate: .78,
      onStart: () => { if (unit.language==='de' && listeningId && activeAudio.current === token) setPlayed(true); },
      onDone: () => {if(unit.language==='en'&&listeningId&&activeAudio.current===token)setPlayed(true);},
      onError: () => { if (activeAudio.current === token) {activeAudio.current=null;setAudioError('صدای دستگاه پخش نشد. می‌توانید متن را ببینید؛ پاسخ آن سؤال به‌عنوان کمک‌گرفته ثبت می‌شود.');} },
    });
  };
  const stop = () => { activeAudio.current = null; void Speech.stop(); };
  const actualAnswer = exercise.kind === 'order' ? ordered.map(i => exercise.tokens[i]).join(' ') : answer;
  const needsAudio = exercise.kind === 'choice' && !!exercise.audioText;
  const responseLocked = feedback !== null || (mission && results.some(r => r.exerciseId === exercise.id));
  const canSubmit = !!actualAnswer.trim() && (!needsAudio || played || assisted) && (exercise.kind !== 'order' || ordered.length === exercise.tokens.length);
  const nextQuestion = () => {
    stop(); setIndex(i => i + 1); setAnswer(''); setOrdered([]); setAssisted(false); setPlayed(false); setFeedback(null); setError(''); setAudioError('');
  };
  async function finish(next: ExerciseResult[]) {
    if (!mission && outro!==5) { stop();setOutro(4);actionLock.current=false;return; }
    setBusy(true); setError(''); setAudioError(''); stop();
    try {
      const attempt = { id: attemptId, finishedAt: new Date().toISOString(), results: next };
      if (mission) await saveUnitMission(attempt, unit);
      else {
        const reviewProgress = await reviewForUnit(unit).getCourseProgress();
        if (!reviewProgress.completedLessonIds.includes(lesson!.id)) await reviewForUnit(unit).completeSentenceLesson(lesson!.id);
        await saveLessonActivity(lesson!.id, attempt, unit);
      }
      await clearSession(unit, lesson?.id ?? null).catch(() => setDraftStatus('error'));
      setStage('done');
    } catch { setError('نتیجه ذخیره نشد. فضای ذخیره‌سازی را بررسی کنید و دوباره دکمه ثبت را بزنید.'); }
    finally { setBusy(false); actionLock.current = false; }
  }
  const submit = async () => {
    if (!canSubmit || busy || actionLock.current) return;
    actionLock.current = true;
    const correct = evaluateExercise(exercise, actualAnswer,unit.language);
    const next = results.some(r => r.exerciseId === exercise.id) ? results : [...results, { exerciseId: exercise.id, correct, assisted }];
    setResults(next);
    if (mission) {
      if (index + 1 < exercises.length) nextQuestion(); else await finish(next);
    } else setFeedback(correct);
  };
  const score = scoreAttempt(results, exercises);
  const sample = (e: LearningExercise) => e.kind === 'write' ? e.sample : e.kind === 'order' ? e.answer : e.choices.find(c => c.id === e.correctChoice)?.label;
  const presentationStep=outro??(stage==='context'?0:stage==='pattern'?(listeningPanel?2:1):stage==='done'?5:3);
  const stageLabels=['موقعیت','جمله‌ها','شنیدن','تمرین','مکالمه','لغات'];
  const exerciseFooter=stage==='exercise'&&outro===null&&feedback!==null?<CourseButton title={busy ? 'در حال ذخیره…' : index + 1 < exercises.length ? 'تمرین بعدی' : 'ادامه: مکالمه'} disabled={busy} onPress={() => { if (actionLock.current) return; actionLock.current = true; if (index + 1 < exercises.length) nextQuestion(); else void finish(results); }} />:undefined;
  const footer=!mission&&stage!=='done'?(outro===4?<CourseButton title="ادامه: لغات و الگوها" onPress={()=>{stop();setOutro(5);}}/>:outro===5?<CourseButton title={busy?'در حال ذخیره…':'پایان درس و ذخیره پیشرفت'} disabled={busy} onPress={()=>{if(actionLock.current)return;actionLock.current=true;void finish(results);}}/>:stage==='context'?<CourseButton title="ادامه: الگوها را کشف کنیم" onPress={()=>{stop();setAudioError('');setStage('pattern');}}/>:stage==='pattern'?<CourseButton title={listeningPanel?'شروع تمرین؛ حالا نوبت شماست':'ادامه: شنیدن و تکرار'} onPress={()=>{stop();setAudioError('');if(listeningPanel)setStage('exercise');else setListeningPanel(true);}}/>:exerciseFooter):undefined;
  return <CoursePage progress={mission?undefined:(presentationStep+1)/6} footer={footer} title={mission ? `مأموریت: ${unit.title}` : lesson!.title} subtitle={mission ? 'ارزیابی محدود همین هدف‌ها؛ نه آزمون رسمی سطح' : `${stageLabels[presentationStep]} · مرحله ${fa(presentationStep+1)} از ۶`} back={unitHref(unit)}>
    {!mission&&<Text style={s.description}>{lesson!.canDoFa}</Text>}
    {stage !== 'done' && <View style={{gap:10}}>
      <Text style={draftStatus==='error'?s.error:s.small}>{draftStatus==='saving'?'در حال ذخیره پیش‌نویس…':draftStatus==='saved'?'پیش‌نویس روی همین دستگاه ذخیره شد؛ می‌توانید بعداً ادامه دهید.':'پیش‌نویس ذخیره نشد؛ ممکن است با خروج از صفحه از دست برود.'}</Text>
      {draftStatus === 'error' && <CourseButton title="تلاش دوباره برای ذخیره پیش‌نویس" secondary disabled={busy} onPress={()=>setDraftRetry(v=>v+1)}/>}
      {initial && <Text style={s.pill}>ادامه جلسه قبلی؛ پاسخ‌ها و کمک‌های استفاده‌شده حفظ شده‌اند</Text>}
      <Text style={s.small}>پیش‌نویس شامل متن پاسخ شماست و فقط محلی نگهداری می‌شود. امتیاز نهایی پس از پایان فعالیت ثبت می‌شود.</Text>
      {restartConfirm ? <><Text style={s.notice}>فقط پیش‌نویس این جلسه پاک شود؟ نتایج درس‌های تمام‌شده تغییر نمی‌کنند.</Text><CourseButton title="بله، این جلسه را از ابتدا شروع کن" secondary disabled={busy} onPress={()=>void (async()=>{
        setBusy(true);stop();
        try { await clearSession(unit,lesson?.id??null);router.replace({pathname:'/learn/[language]/practice',params:{language:unit.language,unit:unit.id,...(mission?{mission:'1'}:{lesson:lesson!.id}),fresh:String(Date.now())}} as never); }
        catch {setError('پیش‌نویس پاک نشد. دوباره تلاش کنید.');} finally {setBusy(false);}
      })()}/><CourseButton title="انصراف" secondary onPress={()=>setRestartConfirm(false)}/></> : <CourseButton title="شروع دوباره همین جلسه" secondary disabled={busy} onPress={()=>setRestartConfirm(true)}/>}
    </View>}
    {stage === 'context' && lesson && <>
      <View style={s.card}><Text style={s.heading}>۱. موقعیت را بشنوید</Text><Text style={s.description}>{lesson.situationFa}</Text><CourseButton title="🔊 شنیدن گفتگوی کوتاه" onPress={() => speak(lesson.dialogue.map(d => d.text).join(' '))} />
        <CourseButton title={translation ? 'پنهان‌کردن متن گفتگو' : 'دیدن متن و معنی گفتگو'} secondary onPress={() => setTranslation(v => !v)} />
        {translation && lesson.dialogue.map((d, i) => <View key={i} style={{ gap: 10 }}><Text style={s.pill}>{d.speaker}</Text><Text style={s.target}>{d.text}</Text><Text style={s.description}>{d.fa}</Text></View>)}
      </View>

    </>}
    {stage === 'pattern' && lesson && <>
      {listeningPanel&&<Text style={s.heading}>گوش کن و تکرار کن</Text>}
      <View style={s.card}><Text style={s.heading}>۲. کوتاه یاد بگیرید، زود استفاده کنید</Text><Text style={s.description}>{lesson.patternFa}</Text><Text style={s.notice}>{lesson.pronunciationFa}</Text></View>
      {lesson.examples.map((e, i) => <View style={s.card} key={i}><Text style={s.target}>{e.text}</Text><Text style={s.description}>{e.fa}</Text><CourseButton title="شنیدن و تکرار" secondary onPress={() => speak(e.text)} /></View>)}

    </>}
    {stage === 'exercise' && outro===null && <>
      <View style={s.row}><Text style={s.pill}>{mission ? 'مأموریت' : 'تمرین'} {fa(index + 1)} از {fa(exercises.length)}</Text><Text style={s.small}>{exercise.skill === 'listening' ? 'فهم شنیداری' : exercise.skill === 'reading' ? 'فهم موقعیت' : 'ساخت پاسخ'}</Text></View>
      <View style={s.track}><View style={[s.fill, { width: `${index / exercises.length * 100}%` }]} /></View>
      <View style={s.card}><Text style={s.heading}>{exercise.promptFa}</Text>
        {exercise.kind === 'choice' && exercise.readingText && <View style={styles.reading}><Text style={s.small}>متن مرجع؛ برای پاسخ می‌توانید دوباره آن را بخوانید.</Text><Text accessibilityLabel={unit.language==='en'?'متن انگلیسی برای خواندن':'متن آلمانی برای خواندن'} style={[s.target,{fontSize:20,lineHeight:34}]}>{exercise.readingText}</Text></View>}
        {exercise.kind === 'choice' && exercise.audioText && <>
          <CourseButton title={played ? '🔊 دوباره گوش بده' : '🔊 ابتدا گوش بده'} onPress={() => speak(exercise.audioText!, exercise.id)} />
          {!played && !assisted && <Text style={s.small}>{unit.language==='en'?'پس از پایان پخش، پاسخ را انتخاب کنید.':'پس از شروع پخش، پاسخ را انتخاب کنید.'} اگر صدا ندارید، نمایش متن کمک می‌کند ولی سنجش شنیداری مستقل محسوب نمی‌شود.</Text>}
          <CourseButton title="نمایش متن و معنی (با کمک)" secondary disabled={responseLocked || assisted} onPress={() => setAssisted(true)} />
          {assisted && <><Text style={s.target}>{exercise.audioText}</Text><Text style={s.description}>{exercise.transcriptFa}</Text></>}
        </>}
        {exercise.kind === 'choice' && exercise.choices.map(c => <Pressable accessibilityRole="radio" aria-checked={answer === c.id} accessibilityState={{ checked: answer === c.id, disabled: responseLocked || busy || (needsAudio && !played && !assisted) }} disabled={responseLocked || busy || (needsAudio && !played && !assisted)} onPress={() => setAnswer(c.id)} key={c.id} style={[styles.choice, answer === c.id && styles.selected]}><Text style={s.description}>{answer === c.id ? '● ' : '○ '}{c.label}</Text></Pressable>)}
        {exercise.kind === 'order' && <>
          <View style={styles.answerBox}><Text style={[s.target, { fontSize: 21 }]}>{actualAnswer || '…'}</Text></View>
          <View style={styles.tokens}>{exercise.tokens.map((word, i) => <Pressable accessibilityRole="button" key={i} disabled={ordered.includes(i) || responseLocked || busy} onPress={() => setOrdered(v => [...v, i])} style={[styles.token, ordered.includes(i) && { opacity: .3 }]}><Text style={styles.tokenText}>{word}</Text></Pressable>)}</View>
          <CourseButton title="پاک‌کردن و چیدن دوباره" secondary disabled={responseLocked || busy} onPress={() => setOrdered([])} />
        </>}
        {exercise.kind === 'write' && <>
          {!!exercise.taskNoteFa && <Text style={s.notice}>{exercise.taskNoteFa}</Text>}
          <TextInput accessibilityLabel={unit.language==='en'?'پاسخ انگلیسی شما':'پاسخ آلمانی شما'} multiline autoCorrect={false} autoCapitalize="sentences" editable={!responseLocked && !busy} value={answer} maxLength={300} onChangeText={setAnswer} placeholder={unit.language==='en'?'Your answer in English…':'Antwort auf Deutsch…'} style={styles.input} />
          <Text style={s.small}>{unit.language==='de'?'می‌توانید از ß یا ss استفاده کنید. ':''}در این تمرین بزرگی حروف و نشانه‌گذاری نمره ندارد؛ املا و الگوی جمله همچنان مهم‌اند.</Text>
          <CourseButton title="راهنمای کوتاه (با کمک)" secondary disabled={responseLocked || assisted} onPress={() => setAssisted(true)} />
          {assisted && <Text style={s.notice}>{exercise.hintFa}</Text>}
        </>}
        {assisted && <Text style={s.small}>این سؤال «با کمک» ثبت می‌شود، حتی اگر پاسخ درست باشد.</Text>}
        {feedback === null && <CourseButton title={busy ? 'در حال ذخیره…' : mission ? (index + 1 === exercises.length ? 'ثبت پاسخ و دیدن نتیجه' : 'ثبت پاسخ و سؤال بعد') : 'بررسی پاسخ'} disabled={!canSubmit || busy} onPress={() => void submit()} />}
        {!mission && feedback !== null && <View style={styles.feedback}>
          <Text style={s.heading}>{feedback ? 'پاسخ پذیرفته شد' : exercise.kind === 'write' ? 'پاسخ با الگوهای این تمرین تطبیق نداشت' : 'یک بار دیگر به الگو توجه کنید'}</Text>
          <Text style={s.description}>{exercise.explanationFa}</Text><Text style={s.target}>{sample(exercise)}</Text>
          {exercise.kind === 'write' && !feedback && <Text style={s.small}>این بررسی محدود به پاسخ‌های تعریف‌شده است؛ ممکن است جمله درست دیگری نوشته باشید. نمونه را مقایسه کنید؛ این ابزار داور همه جمله‌های درست نیست.</Text>}

        </View>}
      </View>
    </>}
    {outro===4&&stage!=='done'&&lesson&&<><Text style={s.heading}>مکالمه کوتاه</Text>{lesson.dialogue.map((d,i)=><View key={i} style={s.card}><Text style={s.pill}>{d.speaker}</Text><Text style={s.target}>{d.text}</Text><Text style={s.description}>{d.fa}</Text><CourseButton title="شنیدن این بخش گفتگو" secondary onPress={()=>speak(d.text)}/></View>)}</>}
    {outro===5&&stage!=='done'&&lesson&&<><Text style={s.heading}>لغات و الگوهای همین جمله‌ها</Text><View style={s.card}><Text style={s.description}>{lesson.patternFa}</Text><Text style={s.notice}>{lesson.pronunciationFa}</Text></View>{lesson.examples.map((e,i)=><View key={i} style={s.card}><Text style={s.target}>{e.text}</Text><Text style={s.description}>{e.fa}</Text><CourseButton title="شنیدن مثال" secondary onPress={()=>speak(e.text)}/></View>)}</>}
    {!!audioError && <Text style={s.notice}>{audioError}</Text>}
    {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
    {stage === 'done' && <>
      <View style={s.card}><Text style={s.heading}>{mission ? 'نتیجه مأموریت ثبت شد' : 'فعالیت درس ثبت شد'}</Text><Text style={s.title}>{fa(score.independent)} از {fa(score.total)} پاسخ مستقل</Text><Text style={s.description}>پاسخ درست در اولین ارسال و بدون نمایش راهنما، مستقل حساب شده است. پاسخ با کمک حذف نمی‌شود، اما در این شمارش نمی‌آید.</Text>
        {mission && <Text style={s.small}>تصحیح نوشتن محدود به پاسخ‌های تعریف‌شده است و ممکن است همه جمله‌های درست را نشناسد. هدف این تمرین: دست‌کم {fa(score.threshold)} پاسخ مستقل. {score.meetsPracticeTarget ? 'این معیار برآورده شد.' : 'هنوز به تمرین نیاز دارید.'} این نتیجه گواهی سطح، سنجش مکالمه یا تسلط کامل نیست.</Text>}
      </View>
      {mission && exercises.map(e => {
        const result = results.find(r => r.exerciseId === e.id)!;
        const related = repairTarget(unit,e.objectiveId);
        return <View key={e.id} style={s.card}><Text style={s.heading}>{e.promptFa}</Text><Text style={s.pill}>{result.assisted ? 'با کمک؛ نیازمند بررسی مستقل' : result.correct ? 'پاسخ مستقل پذیرفته شد' : 'نیازمند تمرین'}</Text><Text style={s.target}>{sample(e)}</Text><Text style={s.description}>{e.explanationFa}</Text>
          {related && (!result.correct || result.assisted) && <CourseButton title="بازگشت به درس مرتبط" secondary onPress={() => { router.replace({ pathname: '/learn/[language]/practice', params: { language: unit.language, unit: related.unitId, lesson: related.lessonId } } as never); }} />}
        </View>;
      })}
      {mission && <View style={s.card}><Text style={s.heading}>حالا بدون متن صحبت کنید</Text><Text style={s.description}>{unit.oralMissionFa}</Text><Text style={s.small}>از خودتان بپرسید: آیا خواسته‌های همین موقعیت را بدون متن بیان کردم؟ آیا سؤال مناسب پرسیدم؟ آیا توانستم منظورم را برسانم؟ برای ارزیابی معتبر گفتار، بازخورد مدرس یا ابزار معتبر لازم است.</Text></View>}
      <CourseButton title="قدم بعدی پیشنهادی من" onPress={() => router.replace(`/learn/${unit.language}?level=${unit.level}` as never)} />
      <CourseButton title="بازگشت به نقشه واحد" secondary onPress={() => router.replace(unitHref(unit) as never)} />
      {!mission && <CourseButton title="مرور جمله‌های همین واحد" secondary onPress={() => router.replace(unitReviewHref(unit) as never)} />}
    </>}
  </CoursePage>;
}
const styles = StyleSheet.create({
  reading: {padding:16,gap:12,borderRadius:12,backgroundColor:'#f4f6fa'},
  choice: { borderWidth: 1, borderColor: '#dde3ea', borderRadius: 12, padding: 15 },
  selected: { borderColor: '#6366f1', backgroundColor: '#f4f6fa' },
  input: { minHeight: 96, borderWidth: 1, borderColor: '#dde3ea', backgroundColor: '#f4f6fa', borderRadius: 12, padding: 16, fontSize: 21, color: '#475569', textAlign: 'left', writingDirection: 'ltr', textAlignVertical: 'top' },
  answerBox: { padding: 18, borderRadius: 12, backgroundColor: '#f4f6fa' },
  tokens: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, ...LtrDirection },
  token: { borderRadius: 10, backgroundColor: '#f4f6fa', padding: 15 },
  tokenText: { fontSize: 19, color: '#475569' },
  feedback: { backgroundColor: '#f4f6fa', borderRadius: 14, padding: 18, gap: 16 },
});
