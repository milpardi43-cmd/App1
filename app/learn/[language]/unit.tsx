import { findGuidedUnit } from '@/lib/languages/guidedCourses';
import { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { GermanCoursePage as CoursePage, GermanCourseButton as CourseButton, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { findGermanUnit, previousGermanUnit, unitHref, unitReviewHref } from '@/lib/languages/germanUnits';
import type { LearningUnit } from '@/lib/languages/learningDesign';
import { getUnitProgress, scoreAttempt, type UnitProgress } from '@/lib/languages/unitProgress';
import { toPersianDigits as fa } from '@/lib/format';
export default function UnitRoute() {
  const {language,unit:id}=useLocalSearchParams<{language:string;unit?:string}>();
  const unit=findGuidedUnit(language,id);
  // Keep the sentence-first course as the default; expose the already-reviewed
  // three-skill A1 bridge as an optional module from the German home screen.
  if (language === 'de' && unit?.id !== 'de-a1-skills') return <Redirect href={'/learn/de/library' as never} />;
  if(!unit)return <CoursePage title="این واحد پیدا نشد">{null}</CoursePage>;
  if(!unit.lessons.length)return <Redirect href={unitHref(unit) as never}/>;
  return <UnitPage key={unit.id} unit={unit}/>;
}
function UnitPage({unit}:{unit:LearningUnit}) {
  const router = useRouter();
  const [progress, setProgress] = useState<UnitProgress | null>(null);
  const [error, setError] = useState('');
  const [retry,setRetry]=useState(0);
  useFocusEffect(useCallback(() => {
    let active = true;
    getUnitProgress(unit).then(p => { if (active) { setProgress(p); setError(''); } }).catch(() => { if (active) {setProgress(null);setError('خواندن پیشرفت ممکن نشد؛ دسترسی ذخیره‌سازی مرورگر را بررسی کنید.');} });
    return () => { active = false; };
  }, [unit,retry]));
  const done = unit.lessons.filter(l => progress?.activities[l.id]).length;
  const latest = progress?.missions.at(-1);
  const score = latest ? scoreAttempt(latest.results, unit.mission) : null;
  return <CoursePage title={unit.title} subtitle={`آلمانی · ${unit.level==='Pre-A1'?'مقدماتی':unit.level} · نسخه ${fa(unit.version)} واحد آموزشی`} back={`/learn/de?level=${unit.level}`}>
    {previousGermanUnit(unit)&&<View style={s.card}><Text style={s.small}>پیش‌نیاز پیشنهادی: {previousGermanUnit(unit)!.title}. دسترسی آزاد است؛ تکمیل واحد قبلی توصیه می‌شود.</Text><CourseButton title="رفتن به واحد قبلی" secondary onPress={()=>router.push(unitHref(previousGermanUnit(unit)!) as never)}/></View>}
    <View style={s.card}><Text style={s.heading}>در پایان این واحد می‌توانم…</Text>{unit.objectives.map(o => <Text key={o.id} style={s.description}>• {o.canDoFa}</Text>)}<Text style={s.small}>{fa(unit.lessons.length)} درس کوتاه، {fa(unit.lessons.reduce((n,l)=>n+l.exercises.length,0))} تمرین و یک مأموریت پایانی؛ کیفیت پاسخ مهم است، نه سرعت تمام‌کردن صفحه‌ها.</Text></View>
    {!!error && <><Text style={s.error}>{error}</Text><CourseButton title="تلاش دوباره" secondary onPress={()=>setRetry(n=>n+1)}/></>}
    <View style={s.row}><Text style={s.pill}>{progress?`${fa(done)} از ${fa(unit.lessons.length)} فعالیت تکمیل‌شده`:'در حال خواندن پیشرفت…'}</Text><Text style={s.small}>تکمیل فعالیت ≠ تسلط</Text></View>
    {unit.lessons.map((lesson, i) => {
      const result = progress?.activities[lesson.id];
      const stats = result ? scoreAttempt(result.results, lesson.exercises) : null;
      const ready = lesson.prerequisiteIds.every(id => progress?.activities[id]);
      return <View key={lesson.id} style={s.card}><Text style={s.heading}>{fa(i + 1)}. {lesson.title}</Text><Text style={s.description}>{lesson.canDoFa}</Text>
        <Text style={s.small}>{stats ? `آخرین تمرین: ${fa(stats.independent)} از ${fa(stats.total)} پاسخ مستقل در تلاش اول` : progress ? 'هنوز تمرین ثبت نشده است' : 'هنوز وضعیت خوانده نشده است'}</Text>
        {!ready && <Text style={s.small}>پیشنهاد: ابتدا درس‌های قبلی را انجام دهید؛ دسترسی به این درس بسته نیست.</Text>}
        <CourseButton title={result ? 'تمرین دوباره' : 'شروع درس'} secondary={!!result} onPress={() => router.push({ pathname: '/learn/[language]/practice', params: { language: 'de', unit: unit.id, lesson: lesson.id } } as never)} />
      </View>;
    })}
    <View style={s.card}><Text style={s.heading}>مأموریت: {unit.title}</Text><Text style={s.description}>با نام‌ها و موقعیتی تازه، بدون دیدن الگو پاسخ می‌دهید. پاسخ‌ها تا پایان مأموریت نشان داده نمی‌شوند.</Text>
      {!progress && <Text style={s.small}>در حال خواندن پیشرفت…</Text>}
      {done < unit.lessons.length && <Text style={s.small}>ابتدا فعالیت‌های {fa(unit.lessons.length)} درس را انجام دهید. لازم نیست همه پاسخ‌ها صحیح باشند؛ ارزیابی قرار است نیاز به تمرین را مشخص کند.</Text>}
      <CourseButton title="شروع مأموریت پایانی" disabled={done < unit.lessons.length} onPress={() => router.push({ pathname: '/learn/[language]/practice', params: { language: 'de', unit: unit.id, mission: '1' } } as never)} />
      {score && <><Text style={s.heading}>آخرین نتیجه: {fa(score.independent)} از {fa(score.total)} پاسخ مستقل</Text><Text style={s.small}>{score.meetsPracticeTarget ? 'معیار این تمرین برآورده شده است؛ این نتیجه مدرک سطح یا تأیید تسلط گفتاری نیست.' : 'بعضی هدف‌ها به تمرین بیشتری نیاز دارند؛ نتیجه کامل در پایان تلاش بعدی هم نمایش داده می‌شود.'}</Text></>}
    </View>
    <CourseButton title="مرور فاصله‌دار جمله‌های همین واحد" secondary onPress={() => router.push(unitReviewHref(unit) as never)} />
    <Text style={s.notice}>پیشرفت و نتایج فعلاً روی همین دستگاه ذخیره می‌شوند. ارزیابی نوشتاری با پاسخ‌های ازپیش‌تعریف‌شده است؛ نمره خودکار گفتار یا تصحیح آزاد هوش مصنوعی نداریم.</Text>
  </CoursePage>;
}
