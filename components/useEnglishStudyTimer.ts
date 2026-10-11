import { useCallback, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { addStudyTime, measuredInterval, studyDay } from '@/lib/englishStudyState';
/** Local-only measured engagement, not a claim of learning or attention. */
export function useEnglishStudyTimer(enabled=true){
 const touch=useRef(Date.now());const [error,setError]=useState('');
 const interact=useCallback(()=>{touch.current=Date.now();},[]);
 useFocusEffect(useCallback(()=>{
  if(!enabled)return;let previous=Date.now(),active=AppState.currentState!=='background';touch.current=previous;
  function tick(){const now=Date.now();const visible=Platform.OS!=='web'||typeof document==='undefined'||document.visibilityState==='visible';const amount=measuredInterval(previous,now,touch.current,active&&visible);const day=studyDay(new Date(previous));previous=now;if(amount)void addStudyTime(day,amount).then(()=>setError('')).catch(()=>setError('زمان این بخش ذخیره نشد؛ فضای ذخیره‌سازی دستگاه را بررسی کنید.'));}
  const timer=setInterval(tick,5000);
  const subscription=AppState.addEventListener('change',state=>{tick();active=state==='active';previous=Date.now();});
  function visibility(){tick();previous=Date.now();}
  if(Platform.OS==='web'&&typeof document!=='undefined'){document.addEventListener('pointerdown',interact,true);document.addEventListener('keydown',interact,true);document.addEventListener('scroll',interact,true);document.addEventListener('visibilitychange',visibility);}
  return()=>{tick();clearInterval(timer);subscription.remove();if(Platform.OS==='web'&&typeof document!=='undefined'){document.removeEventListener('pointerdown',interact,true);document.removeEventListener('keydown',interact,true);document.removeEventListener('scroll',interact,true);document.removeEventListener('visibilitychange',visibility);}};
 },[enabled,interact]));return {interact,error};
}
