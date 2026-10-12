import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Compass, Headphones, BookOpen, PenLine, Mic } from 'lucide-react-native';
import { GermanCoursePage as CoursePage, GermanCourseButton as CourseButton, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { GERMAN_ROADMAP } from '@/lib/languages/germanRoadmap';
import { GERMAN_LESSONS } from '@/lib/languages/german';
import { germanProgress } from '@/lib/languages/catalog';
import { FIRST_MEETING } from '@/lib/languages/germanFirstMeeting';
import { reviewForUnit } from '@/lib/languages/unitReview';
import { GERMAN_UNITS, GERMAN_GUIDED_LESSON_COUNT, unitHref, unitReviewHref } from '@/lib/languages/germanUnits';
import { GERMAN_COURSE_UNITS } from '@/lib/languages/germanCourseStructure';
import { planCourseStep, type UnitSnapshot } from '@/lib/languages/coursePlanner';
import { getUnitProgress } from '@/lib/languages/unitProgress';
import { latestSession } from '@/lib/languages/sessionStore';
import { skillEvidence, objectiveEvidence } from '@/lib/languages/learningPlanner';
import type { CourseProgress } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';

type Dashboard = { units: UnitSnapshot[]; legacy: CourseProgress };
const libraryLessons = [...GERMAN_LESSONS].sort((a,b)=>Number(!!b.checks)-Number(!!a.checks));
const skillNames = { listening: 'فهم شنیداری', reading: 'فهم متن و موقعیت', writing: 'ساخت پاسخ نوشتاری' };
const skillIcons = { listening: Headphones, reading: BookOpen, writing: PenLine };
export default function GermanLearningDetails() {
  const { language,level:levelParam,view } = useLocalSearchParams<{language:string;level?:string;view?:string}>();
  const selectedLevel=levelParam==='A1'?'A1':levelParam==='A2'?'A2':'Pre-A1';
  const levelUnits=GERMAN_COURSE_UNITS.filter(u=>u.level===selectedLevel);
  const router=useRouter();
  const [data,setData]=useState<Dashboard|null>(null);
  const [error,setError]=useState('');
  const [tab,setTab]=useState<'today'|'path'|'library'>(view==='library'?'library':view==='path'?'path':'today');
  const load=useCallback(async()=>{
    const [legacy,units]=await Promise.all([germanProgress.getCourseProgress(),Promise.all(GERMAN_COURSE_UNITS.map(async unit=>{
      const [progress,due]=await Promise.all([getUnitProgress(unit),reviewForUnit(unit).getDueReviewCards()]);
      const resume=await latestSession(unit,[...Object.values(progress.activities),...progress.missions].map(a=>a.id));
      return {unit,progress,due:due.length,resume};
    }))]);
    return {legacy,units};
  },[]);
  useFocusEffect(useCallback(()=>{let active=true;if(language==='de')load().then(d=>{if(active){setData(d);setError('');}}).catch(()=>{if(active)setError('خواندن برنامه شما ممکن نشد؛ دسترسی ذخیره‌سازی دستگاه را بررسی کنید.');});return()=>{active=false;};},[language,load]));
  if(language!=='de')return <CoursePage title="این مسیر آموزشی پیدا نشد">{null}</CoursePage>;
  const planned=data?planCourseStep(data.units.filter(s=>s.unit.level===selectedLevel)):null;
  const next=planned?.action;
  const unit=planned?.unit??levelUnits[0]??FIRST_MEETING;
  const current=data?.units.find(s=>s.unit.id===unit.id);
  const skills=current?skillEvidence(unit,current.progress):[];
  const objectives=current?objectiveEvidence(unit,current.progress):[];
  const activities=current?unit.lessons.filter(l=>current.progress.activities[l.id]).length:0;
  const navigate=(path:string)=>router.push(path as never);
  const publishedUnits=<View style={s.card}><Text style={s.heading}>واحدهای آماده {selectedLevel==='Pre-A1'?'مقدماتی':selectedLevel}</Text><Text style={s.small}>پیشنهاد: به ترتیب پیش بروید. درس‌های کاربردی، تمرین مکمل‌اند و جای ارزیابی واحدها را نمی‌گیرند.</Text>{levelUnits.map((u,i)=>{
      const snapshot=data?.units.find(x=>x.unit.id===u.id);
      const action=snapshot?planCourseStep([snapshot])?.action:null;
      const finished=snapshot?u.lessons.filter(l=>snapshot.progress.activities[l.id]).length:0;
      const label=!snapshot?'در حال خواندن…':action?.type==='resume'?'جلسه نیمه‌تمام':action?.type==='review'?'مرور موعدرسیده':action?.type==='repair'?'نیازمند تمرین':action?.type==='consolidate'?'آماده تثبیت':finished?`${fa(finished)} از ${fa(u.lessons.length)} فعالیت`:'آماده شروع';
      return <View key={u.id} style={{gap:10}}><View style={s.row}><Text style={s.heading}>{fa(i+1)}. {u.title}</Text><Text style={s.pill}>{label}</Text></View><CourseButton title={`درس‌ها و نتیجه‌های «${u.title}»`} secondary onPress={()=>navigate(unitHref(u))}/></View>;
    })}{selectedLevel==='A1'?<><CourseButton title="سنجش جامع پایان A1" onPress={()=>navigate('/learn/de/recap?exam=de-a1-final')}/><CourseButton title="جمع‌بندی پایه و دو فرم تمرین افزوده" secondary onPress={()=>navigate('/learn/de/recap')}/><CourseButton title="کارگاه نوشتن و گفت‌وگوی A1" secondary onPress={()=>navigate('/learn/de/workshop')}/><CourseButton title="پوشش A1 و تمرین‌های تکمیلی" secondary onPress={()=>navigate('/learn/de/coverage')}/></>:selectedLevel==='Pre-A1'?<><Text style={s.notice}>این مسیر از الفبا و صداها شروع می‌شود؛ ابتدا دو واحد و ده درس مقدماتی را بخوانید.</Text><CourseButton title="سنجش پایان مقدماتی" onPress={()=>navigate('/learn/de/recap?exam=de-zero-final')}/></>:<Text style={s.notice}>این آغاز A2 است، نه دوره کامل. آشنایی با جمله ساده، ساعت و فعل‌های روزمره A1 پیشنهاد می‌شود؛ ورود آزاد است و قبولی سطح قبلی ادعا نمی‌شود.</Text>}</View>;
  return <CoursePage back="/learn/de" title="آلمانی، قدم‌به‌قدم" subtitle="Deutsch • از پایه، با تمرین هدفمند و راهنمای فارسی">
    <View style={st.topline}><Text style={s.pill}>{unit.level==='Pre-A1'?'مقدماتی':unit.level} / {unit.title}</Text><Text style={s.small}>مسیر آموزشی، نه آزمون تعیین سطح</Text></View>
    <View style={st.tabs}>{(['Pre-A1','A1','A2'] as const).map(level=><Pressable key={level} accessibilityRole="tab" accessibilityLabel={`سطح ${level}`} accessibilityState={{selected:level===selectedLevel}} onPress={()=>router.setParams({level})} style={[st.tab,level===selectedLevel&&st.activeTab]}><Text style={[st.tabText,level===selectedLevel&&{color:'#fff'}]}>{level==='Pre-A1'?'مقدماتی':level==='A1'?'A1 • پایه':'A2 • شروع گذشته‌گویی'}</Text></Pressable>)}</View>
    <View style={st.tabs}>{([['today','قدم امروز'],['path','نقشه یادگیری'],['library','درس‌های کاربردی']] as const).map(([id,title])=><Pressable key={id} accessibilityRole="tab" accessibilityState={{selected:tab===id}} onPress={()=>setTab(id)} style={[st.tab,tab===id&&st.activeTab]}><Text style={[st.tabText,tab===id&&{color:'#fff'}]}>{title}</Text></Pressable>)}</View>
    {selectedLevel==='A1'&&<CourseButton title="ورود به شروع A2: روایت دیروز و آخر هفته" secondary onPress={()=>router.setParams({level:'A2'})}/>}
    {tab==='path'&&publishedUnits}
    {!!error&&<View style={s.card}><Text accessibilityRole="alert" style={s.error}>{error}</Text><CourseButton title="تلاش دوباره" secondary onPress={()=>void load().then(d=>{setData(d);setError('');}).catch(()=>setError('ذخیره‌سازی همچنان در دسترس نیست.'))}/></View>}
    {tab==='today'&&<>
      <View style={st.hero}><View style={st.heroLabel}><Compass size={18} color="#91dfc7"/><Text style={st.eyebrow}>پیشنهاد قدم بعدی شما</Text></View><Text style={st.heroTitle}>{next?.title??'در حال آماده‌کردن مسیر…'}</Text><Text style={st.heroDescription}>{next?.reason??'فعالیت‌ها، جلسه نیمه‌تمام و موعد مرور بررسی می‌شوند.'}</Text>
        {next&&<><Pressable accessibilityRole="button" style={st.primary} onPress={()=>navigate(next.href)}><Text style={st.primaryText}>{next.type==='resume'?'ادامه از همان‌جا':'شروع قدم پیشنهادی'}</Text><ArrowLeft size={18} color="#173e45"/></Pressable><Text style={st.heroFoot}>حدود {fa(next.minutes)} دقیقه • پیشنهاد قاعده‌محور، نه تشخیص هوش مصنوعی</Text></>}
      </View>
      {publishedUnits}
      <View style={s.card}><Text style={s.heading}>تمرین مکمل برای زندگی روزمره</Text><Text style={s.description}>خانواده، ساعت و قرار، خرید، خانه، برنامه روزانه و رفت‌وآمد؛ با ۳۰ جمله، توضیح فارسی و ۱۲ پرسش تمرینی.</Text><CourseButton title="دیدن درس‌های کاربردی" onPress={()=>setTab('library')}/></View>
      <View style={st.stats}>{[[data?`${fa(activities)} از ${fa(unit.lessons.length)}`:'—','فعالیت در واحد پیشنهادی'],[data?fa(data.units.filter(s=>s.unit.level===selectedLevel).reduce((n,s)=>n+s.due,0)):'—','جمله آماده مرور این سطح'],[data?fa(current?.progress.missions.length??0):'—','تلاش پایانی همین واحد']].map(([value,label])=><View key={label} style={st.stat}><Text style={st.statValue}>{value}</Text><Text style={s.small}>{label}</Text></View>)}</View>
      <View style={s.row}><Text style={s.heading}>مهارت‌ها: {unit.title}</Text><Text style={s.small}>پاسخ مستقل / سؤال مشاهده‌شده</Text></View>
      <View style={st.skills}>{skills.map(skill=>{const Icon=skillIcons[skill.skill];return <View key={skill.skill} style={st.skill}><Icon size={23} color="#188674"/><Text style={st.skillTitle}>{skillNames[skill.skill]}</Text><Text style={st.skillNumber}>{skill.observed?`${fa(skill.independent)} از ${fa(skill.observed)}`:'هنوز ثبت نشده'}</Text><Text style={s.small}>{skill.needsPractice?`${fa(skill.needsPractice)} سؤال با کمک یا نیازمند تمرین`:'این نسبت، گواهی تسلط نیست'}</Text></View>;})}<View style={st.skill}><Mic size={23} color="#8493a5"/><Text style={st.skillTitle}>صحبت‌کردن</Text><Text style={st.skillNumber}>سنجیده نشده</Text><Text style={s.small}>تمرین خودارزیابی داریم؛ نمره خودکار گفتار نداریم.</Text></View></View>
      <View style={s.card}><Text style={s.heading}>هدف‌های واحد: {unit.title}</Text><Text style={s.small}>آخرین پاسخ هر سؤال ملاک است؛ تکرار همان سؤال تعداد شواهد را زیاد نمی‌کند.</Text>{objectives.map(o=><View key={o.id} style={st.objective}><Text style={[s.description,{flex:1}]}>{o.canDoFa}</Text><Text style={st.objectiveTag}>{!o.observed?'شروع نشده':o.needsPractice?'نیاز به تقویت':o.missionIndependent?'پاسخ مستقل در مأموریت':'در تمرین دیده شده'}</Text></View>)}</View>
      <View style={st.actions}><View style={{flex:1,minWidth:200}}><CourseButton title="درس‌های واحد پیشنهادی" secondary onPress={()=>navigate(unitHref(unit))}/></View><View style={{flex:1,minWidth:200}}><CourseButton title="مرور همین واحد" secondary onPress={()=>navigate(unitReviewHref(unit))}/></View></View>
      <Text style={s.small}>ترتیب پیشنهاد: جلسه نیمه‌تمام ← مرور موعدرسیده ← درس تازه ← مأموریت ← تمرین جبرانی. می‌توانید مسیر دیگری انتخاب کنید؛ پیشنهاد، قفل اجباری نیست.</Text>
    </>}
    {tab==='path'&&<>
      <View style={s.card}><Text style={s.heading}>چرخه هر واحد</Text><Text style={s.description}>موقعیت واقعی ← ورودی قابل‌فهم ← الگوی کوتاه ← تمرین ← پاسخ مستقل ← بازخورد و مرور</Text><Text style={s.small}>هدف ما کاربرد زبان است؛ تمام‌کردن صفحه با توانایی صحبت‌کردن یکسان نیست.</Text></View>
      {GERMAN_ROADMAP.map(level=>{const courseLevel=level.level==='مقدماتی'?'Pre-A1':level.level;const available=GERMAN_COURSE_UNITS.filter(u=>u.level===courseLevel);return <View key={level.level} style={s.card}><View style={s.row}><Text style={s.heading}>{level.level}</Text><Text style={s.pill}>{available.length?`${fa(available.length)} واحد قابل استفاده`:'برنامه آینده • منتشر نشده'}</Text></View><Text style={s.description}>{level.outcome}</Text>{level.units.map((title,i)=><View style={st.pathItem} key={title}><Text style={st.pathIndex}>{fa(i+1)}</Text><Text style={[s.description,{flex:1}]}>{title}</Text><Text style={s.small}>{available.some(u=>u.title===title)?'آماده':'طرح مسیر'}</Text></View>)}</View>;})}
    </>}
    {tab==='library'&&<>
      <Text style={s.notice}>این کتابخانه مکمل A1 است، حتی اگر سطح A2 را انتخاب کرده باشید. ۱۲ درس کاربردی: ۶ درس اولیه با سابقه قبلی و ۶ درس تازه. این تمرین‌ها از مأموریت واحد اول جدا هستند و تکمیل آن‌ها به معنی قبولی در ارزیابی نیست.</Text>
      {libraryLessons.map((lesson,i)=><View key={lesson.id} style={s.card}><View style={s.row}><Text style={s.heading}>{fa(i+1)}. {lesson.title}</Text><Text style={s.pill}>{data?.legacy.completedLessonIds.includes(lesson.id)?'تکمیل‌شده':lesson.checks?'درس تازه • همراه تمرین':'درس اولیه'}</Text></View><Text style={s.description}>{lesson.situation}</Text><CourseButton title="شروع یا مرور درس" secondary onPress={()=>navigate(`/learn/de/lesson?id=${lesson.id}`)}/></View>)}
      <CourseButton title="مرور جمله‌های درس‌های کاربردی" onPress={()=>navigate('/learn/de/review')}/>
    </>}
    <CourseButton title="چک‌لیست تکمیل مقدماتی و A1" onPress={()=>navigate('/learn/de/completion')}/>
    <Text style={s.small}>فعلاً {fa(GERMAN_UNITS.length)} واحد با {fa(GERMAN_GUIDED_LESSON_COUNT)} درس مرحله‌ای و {fa(GERMAN_LESSONS.length)} درس کاربردی منتشر شده است؛ پوشش این مسیر تا پایان برنامه داخلی A1 است؛ A2 در آغاز و B1 منتشرنشده است. پیشرفت و پیش‌نویس‌ها محلی‌اند و با پاک‌کردن داده دستگاه از بین می‌روند.</Text>
  </CoursePage>;
}
const st=StyleSheet.create({
 topline:{flexDirection:'row-reverse',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap'},tabs:{flexDirection:'row-reverse',padding:5,borderRadius:15,backgroundColor:'#f4f6fa',gap:5},tab:{flex:1,paddingVertical:13,paddingHorizontal:4,alignItems:'center',borderRadius:11},activeTab:{backgroundColor:'#4f46e5'},tabText:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:12,color:'#475569',fontWeight:'700'},hero:{backgroundColor:'#4f46e5',borderRadius:23,padding:27,gap:20},heroLabel:{flexDirection:'row-reverse',gap:9,alignItems:'center'},eyebrow:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:12,color:'#91dfc7'},heroTitle:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:25,fontWeight:'700',color:'#fff'},heroDescription:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:14,lineHeight:28,color:'#c9dcdf'},primary:{padding:16,borderRadius:12,backgroundColor:'#f4f6fa',flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center'},primaryText:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:14,color:'#475569',fontWeight:'700'},heroFoot:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:11,color:'#99b7bd'},stats:{flexDirection:'row-reverse',gap:10,flexWrap:'wrap'},stat:{flex:1,minWidth:110,backgroundColor:'#f4f6fa',padding:18,borderRadius:15,gap:8,borderWidth:1,borderColor:'#dde3ea'},statValue:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:25,color:'#475569',fontWeight:'700'},skills:{flexDirection:'row-reverse',gap:12,flexWrap:'wrap'},skill:{flex:1,minWidth:170,borderRadius:16,padding:19,backgroundColor:'#f4f6fa',borderWidth:1,borderColor:'#dde3ea',gap:10,alignItems:'flex-end'},skillTitle:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:13,color:'#475569',fontWeight:'700'},skillNumber:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:16,color:'#475569',fontWeight:'700'},objective:{flexDirection:'row-reverse',alignItems:'center',gap:15,paddingVertical:13,borderTopWidth:1,borderColor:'#dde3ea',flexWrap:'wrap'},objectiveTag:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:10,color:'#475569',backgroundColor:'#f4f6fa',padding:8,borderRadius:8},actions:{flexDirection:'row-reverse',gap:12,flexWrap:'wrap'},pathItem:{flexDirection:'row-reverse',alignItems:'center',gap:12,paddingVertical:8},pathIndex:{writingDirection:'rtl',textAlign:'right',fontFamily:'Vazirmatn',fontSize:13,color:'#475569',backgroundColor:'#f4f6fa',padding:10,borderRadius:10},
});
