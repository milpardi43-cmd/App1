import { reviewForUnit, unitReviewLessons } from '@/lib/languages/unitReview';
import { findGuidedUnit, unitHref } from '@/lib/languages/guidedCourses';
import type { LearningUnit } from '@/lib/languages/learningDesign';
import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { CoursePage, CourseButton, courseStyles } from '@/components/LanguageCourseUI';
import { GermanCoursePage, GermanCourseButton, germanCourseStyles } from '@/components/GermanCourseUI';
import RussianReview from '@/components/RussianReview';
import { germanProgress, findGermanLesson, findLanguage } from '@/lib/languages/catalog';
import { russianProgress, findRussianLesson } from '@/lib/languages/russian';
import type { SentenceReviewCard, ReviewRating } from '@/lib/courseProgress';
import { toPersianDigits as fa } from '@/lib/format';
export default function ReviewRoute(){
  const {language,course,unit:id}=useLocalSearchParams<{language:string;course?:string;unit?:string}>();
  const unit=id!==undefined?findGuidedUnit(language,id):course==='first-meeting'?findGuidedUnit(language):undefined;
  if(language==='de'&&unit&&unit.id!=='de-a1-skills')return <Redirect href={'/learn/de/library' as never}/>;
  if(unit&&!unit.lessons.length){const Page=language==='de'?GermanCoursePage:CoursePage;const s=language==='de'?germanCourseStyles:courseStyles;return <Page title="جمع‌بندی مرور مستقل ندارد" back={unitHref(unit)}><Text style={s.description}>برای مرور، به درس مرتبط در گزارش جمع‌بندی برگردید.</Text></Page>;}
  if(!['de','en','ru'].includes(language)||(id!==undefined&&!unit)||(language==='en'&&!unit)||(course!==undefined&&(language!=='de'||course!=='first-meeting')))return language==='de'?<GermanCoursePage title="مرور پیدا نشد">{null}</GermanCoursePage>:<CoursePage title="مرور پیدا نشد">{null}</CoursePage>;
  if(language==='ru'&&!unit)return <RussianReview/>;
  return <LanguageReview key={unit?.id??'library'} unit={unit} language={language}/>;
}
function LanguageReview({unit,language}:{unit?:LearningUnit;language:string}){
  const Page=language==='de'?GermanCoursePage:CoursePage;
  const Button=language==='de'?GermanCourseButton:CourseButton;
  const s=language==='de'?germanCourseStyles:courseStyles;
  const isUnit = !!unit;
  const name=unit?.language==='en'?'انگلیسی':language==='ru'?'روسی':'آلمانی';
  const title=unit?`مرور واحد ${unit.title}`:language==='ru'?'مرور درس‌های روسی':'مرور درس‌های کاربردی آلمانی';
  const back=unit?unitHref(unit):language==='ru'?'/learn/ru':'/learn/de';
  const store = unit ? reviewForUnit(unit) : language==='ru'?russianProgress:germanProgress;
  const [cards,setCards]=useState<SentenceReviewCard[]>([]);const [index,setIndex]=useState(0);const [revealed,setRevealed]=useState(false);const [started,setStarted]=useState(false);const [busy,setBusy]=useState(false);const [loaded,setLoaded]=useState(false);const [error,setError]=useState('');
  const load=useCallback(async()=>{setError('');try{const cards=await store.getDueReviewCards();setCards(cards.slice(0,20));setIndex(0);setStarted(false);setRevealed(false);setLoaded(true);}catch{setError('مرور بارگذاری نشد. دوباره تلاش کنید.');}},[store]);
  useFocusEffect(useCallback(()=>{void load();return()=>{void Speech.stop();};},[load]));
  useEffect(()=>()=>{void Speech.stop();},[]);
  const card=cards[index];const lesson=card?(isUnit?unitReviewLessons(unit!).find(l=>l.id===card.lessonId):language==='ru'?findRussianLesson(card.lessonId):findGermanLesson(card.lessonId)):undefined;const sentence=lesson?.sentences.find(x=>x.id===card.sentenceId);
  const rate=async(rating:ReviewRating)=>{if(!card||busy)return;setBusy(true);setError('');try{void Speech.stop();await store.rateReviewCard(card.id,rating);if(index+1>=cards.length){await load();}else{setIndex(i=>i+1);setRevealed(false);}}catch{setError('نتیجه مرور ذخیره نشد؛ دوباره تلاش کنید.');}finally{setBusy(false);}};
  return <Page title={title} subtitle={`فقط جمله‌های ${name} که زمان مرورشان رسیده است`} back={back}>
    {!!error&&<><Text accessibilityRole="alert" style={s.error}>{error}</Text>{!loaded&&<Button title="تلاش دوباره" secondary onPress={()=>void load()}/>}</>}
    {!loaded&&<Text style={s.small}>در حال بارگذاری…</Text>}
    {loaded&&!started&&<View style={s.card}><Text style={s.heading}>{cards.length?`${fa(cards.length)} جمله آماده مرور`:'فعلاً مروری ندارید'}</Text><Text style={s.description}>بعد از تکمیل درس، جمله‌های آن وارد مرور می‌شوند. جمله‌ای که فراموش کرده‌اید حدود ۱۰ دقیقه بعد دوباره موعد مرور خواهد داشت.</Text>{cards.length>0&&<Button title={`شروع مرور ${name}`} onPress={()=>setStarted(true)}/>}<Button title="بررسی دوباره موعد مرور" secondary onPress={()=>void load()}/></View>}
    {started&&sentence&&<View style={s.card}><Text style={s.small}>{lesson?.title} · کارت {fa(index+1)} از {fa(cards.length)}</Text><Text style={s.description}>{`جمله ${name} را به یاد بیاورید:`}</Text><Text style={s.heading}>{sentence.fa}</Text>
      {revealed?<><Text style={s.target}>{sentence.text}</Text><Text style={s.pronunciation}>{sentence.pronunciation}</Text><Button title="شنیدن پاسخ" secondary onPress={()=>{void Speech.stop();Speech.speak(sentence.text,{language:findLanguage(unit?.language??language)!.speechLocale,rate:.78,onError:()=>setError(`صدای ${name} دستگاه در دسترس نیست.`)});}}/><Text style={s.small}>یادآوری چطور بود؟</Text>{([['again','فراموش کردم'],['hard','سخت بود'],['good','خوب بود'],['easy','آسان بود']] as const).map(([id,label])=><Button key={id} title={label} disabled={busy} secondary onPress={()=>void rate(id)}/>)}</>:<Button title="نمایش پاسخ" onPress={()=>setRevealed(true)}/>}
    </View>}
</Page>;
}

export function RussianReviewPage(){return <RussianReview/>;}
