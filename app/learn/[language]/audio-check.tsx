import { useCallback, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Redirect, useFocusEffect, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { GermanCourseButton as CourseButton, GermanCoursePage as CoursePage, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { A1_AUDIO_SAMPLES, AUDIO_OBSERVATIONS, audioCheckReport, isGermanVoice, type AudioObservation } from '@/lib/languages/a1AudioCheck';

export default function AudioCheck(){
 const {language}=useLocalSearchParams<{language:string}>();
 const [voices,setVoices]=useState<Speech.Voice[]>([]);const [selected,setSelected]=useState('');
 const [loading,setLoading]=useState(true);const [voiceError,setVoiceError]=useState('');
 const [status,setStatus]=useState('هنوز پخش درخواست نشده است.');const [active,setActive]=useState<string|null>(null);
 const [revealed,setRevealed]=useState<Record<string,boolean>>({});
 const [observations,setObservations]=useState<Partial<Record<string,AudioObservation>>>({});
 const focused=useRef(false),generation=useRef(0),loadGeneration=useRef(0);
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),voiceTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const clearTimer=()=>{if(timer.current)clearTimeout(timer.current);timer.current=null;};
 const stop=()=>{const request=++generation.current;clearTimer();setActive(null);setStatus('پخش متوقف شد؛ شنیده‌شدن صدا تأیید نشده است.');void Speech.stop().catch(()=>{if(focused.current&&generation.current===request)setStatus('توقف صدا ممکن نشد؛ پخش دستگاه را بررسی کنید.');});};
 const loadVoices=useCallback(()=>{
  const request=++loadGeneration.current;setLoading(true);setVoiceError('');setVoices([]);setSelected('');setObservations({});
  if(voiceTimer.current)clearTimeout(voiceTimer.current);
  const valid=()=>focused.current&&request===loadGeneration.current;
  voiceTimer.current=setTimeout(()=>{if(valid()){loadGeneration.current++;setLoading(false);setVoiceError('فهرست صداها پاسخ نداد. دوباره تلاش کنید یا تنظیمات گفتار دستگاه را بررسی کنید.');}},8000);
  Speech.getAvailableVoicesAsync().then(all=>{
   if(!valid())return;if(voiceTimer.current)clearTimeout(voiceTimer.current);
   const german=all.filter(v=>isGermanVoice(v.language));setVoices(german);setSelected(german.find(v=>v.language.toLowerCase()==='de-de')?.identifier??german[0]?.identifier??'');setLoading(false);
   if(!german.length)setVoiceError('صدای آلمانی پیدا نشد. در تنظیمات گفتار گوشی، زبان آلمانی را فعال کنید و دوباره بررسی کنید.');
  }).catch(()=>{if(valid()){if(voiceTimer.current)clearTimeout(voiceTimer.current);setLoading(false);setVoiceError('خواندن فهرست صداها ممکن نشد؛ مرورگر یا تنظیمات گفتار را بررسی کنید.');}});
 },[]);
 useFocusEffect(useCallback(()=>{
  if(language==='de')return;
  focused.current=true;setActive(null);setStatus('هنوز پخش درخواست نشده است.');
  return()=>{focused.current=false;generation.current++;loadGeneration.current++;clearTimer();if(voiceTimer.current)clearTimeout(voiceTimer.current);void Speech.stop().catch(()=>undefined);};
 },[language,loadVoices]));
 const play=async(id:string,text:string)=>{
  if(!selected||!focused.current)return;const request=++generation.current;clearTimer();
  setObservations(o=>{const copy={...o};delete copy[id];return copy;});setActive(id);setStatus('درخواست پخش ارسال شد؛ هنوز شروع آن گزارش نشده است.');
  const valid=()=>focused.current&&generation.current===request;
  const finish=(message:string)=>{if(valid()){generation.current++;clearTimer();setActive(null);setStatus(message);}};
  timer.current=setTimeout(()=>{if(valid()){finish('موتور گفتار پاسخ نداد؛ توقف و تلاش دوباره را امتحان کنید.');void Speech.stop().catch(()=>undefined);}},12000);
  try{
   await Speech.stop();if(!valid())return;
   Speech.speak(text,{language:'de-DE',voice:selected,rate:.78,
    onStart:()=>{if(valid()){clearTimer();setStatus('موتور گفتار شروع پخش را گزارش کرد؛ فقط شما می‌توانید شنیده‌شدن آن را تأیید کنید.');timer.current=setTimeout(()=>{if(valid()){finish('پایان پخش گزارش نشد؛ پخش متوقف شد.');void Speech.stop().catch(()=>undefined);}},45000);}},
    onDone:()=>finish('موتور گفتار پایان پخش را گزارش کرد؛ این پیام تأیید کیفیت تلفظ نیست.'),
    onStopped:()=>finish('پخش متوقف شد؛ شنیده‌شدن صدا تأیید نشده است.'),
    onError:()=>finish('پخش ناموفق بود. بلندی صدا، حالت بی‌صدا و صدای آلمانی دستگاه را بررسی کنید.'),
   });
  }catch{finish('پخش ناموفق بود؛ دوباره تلاش کنید.');}
 };
 if(language==='de')return <Redirect href={'/learn/de/library' as never}/>;
 if(language!=='de')return <CoursePage title="بررسی صدا پیدا نشد">{null}</CoursePage>;
 const voiceName=voices.find(v=>v.identifier===selected)?.name??'';
 return <CoursePage title="بررسی صدای دستگاه" subtitle="آزمون روی گوشی شما • بدون نمره یا ضبط میکروفن" back="/learn/de/coverage">
  <Text style={s.notice}>بلندی صدا را بالا ببرید و حالت بی‌صدا را بررسی کنید. صدا از موتور گفتار دستگاه می‌آید؛ آفلاین‌بودن به تنظیمات آن بستگی دارد. پیدا‌شدن صدا یا پیام «پایان پخش» ثابت نمی‌کند که تلفظ درست یا صدا شنیده شده است.</Text>
  <View style={s.card}><Text style={s.heading}>۱. صدای آلمانی</Text>{loading&&<Text style={s.small}>در حال خواندن صداهای دستگاه…</Text>}{!!voiceError&&<Text accessibilityRole="alert" style={s.error}>{voiceError}</Text>}{voices.map(v=><CourseButton key={v.identifier} title={`${v.identifier===selected?'انتخاب‌شده: ':'انتخاب: '}${v.name} (${v.language})`} secondary disabled={active!==null} onPress={()=>{setSelected(v.identifier);setObservations({});setStatus('صدا عوض شد؛ نمونه‌ها را دوباره بررسی کنید.');}}/>)}<CourseButton title="دوباره صداها را بررسی کن" secondary disabled={active!==null||loading} onPress={loadVoices}/></View>
  <Text accessibilityLiveRegion="polite" style={s.description}>{status}</Text><CourseButton title="توقف پخش" secondary onPress={stop}/>
  <Text style={s.heading}>۲. ابتدا بشنوید، سپس متن را مقایسه کنید</Text>
  {A1_AUDIO_SAMPLES.map(sample=><View key={sample.id} style={s.card}><Text style={s.heading}>{sample.title}</Text><CourseButton title={`پخش: ${sample.title}`} disabled={!selected||active!==null} onPress={()=>void play(sample.id,sample.text)}/><CourseButton title={`${revealed[sample.id]?'بستن':'نمایش'} متن: ${sample.title}`} secondary onPress={()=>setRevealed(r=>({...r,[sample.id]:!r[sample.id]}))}/>{revealed[sample.id]&&<><Text style={s.target}>{sample.text}</Text><Text style={s.description}>{sample.expected}</Text></>}
   <Text style={s.small}>گزارش خود شما، نه تشخیص برنامه:</Text>{(Object.entries(AUDIO_OBSERVATIONS) as [AudioObservation,string][]).map(([id,label])=><Pressable key={id} accessibilityRole="radio" accessibilityLabel={`${sample.title}: ${label}`} aria-checked={observations[sample.id]===id} disabled={!selected||active!==null} onPress={()=>setObservations(o=>({...o,[sample.id]:id}))} style={{padding:12,borderWidth:1,borderColor:'#dde3ea',borderRadius:8}}><Text style={s.description}>{observations[sample.id]===id?'● ':'○ '}{label}</Text></Pressable>)}
  </View>)}
  <View style={s.card}><Text style={s.heading}>۳. گزارش برای ارسال</Text><Text style={s.small}>این گزارش خودکار ذخیره یا ارسال نمی‌شود. متن زیر را انتخاب و کپی کنید؛ نام مدل گوشی و مرورگر را موقع ارسال اضافه کنید. تغییر صدا یا بارگذاری مجدد گزارش را پاک می‌کند. نتیجه‌ای به نمره درس اضافه نمی‌شود.</Text><Text selectable style={s.description}>{audioCheckReport(voiceName,observations)}</Text></View>
 </CoursePage>;
}
