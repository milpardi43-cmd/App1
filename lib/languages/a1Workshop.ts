import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
export const WORKSHOP_KEY='learning_de_a1_workshop_v1';
export const FORM_FIELDS=[['first','Vorname','نام'],['last','Nachname','نام خانوادگی'],['street','Straße und Hausnummer','خیابان و پلاک'],['postcode','Postleitzahl','کد پستی'],['city','Wohnort','شهر'],['birth','Geburtsdatum','تاریخ تولد'],['phone','Telefon','تلفن'],['email','E-Mail','ایمیل']] as const;
export const WRITING_TASKS=[
 {id:'invite',title:'یک دعوت واقعی، با اطلاعات خیالی',prompt:'برای یک دوست حدود ۳۰ تا ۴۰ واژه به آلمانی بنویسید: او را برای یک فعالیت دعوت کنید، روز/ساعت و مکان را بگویید و درخواست پاسخ کنید. این طول فقط پیشنهاد تمرین است.',rubric:['سلام و خطاب مناسب دارم.','فعالیت، روز/ساعت و مکان روشن است.','درخواست پاسخ و پایان‌بندی دارم.','فعل و فاعل، حرف بزرگ اسم‌ها و نشانه‌گذاری را بازخوانی کردم.'],sample:'Hallo Mia, hast du am Samstag Zeit? Wir kochen um 18 Uhr bei mir zu Hause. Meine Adresse ist Gartenstraße 8. Möchtest du kommen? Bitte schreib mir bis Freitag. Liebe Grüße, Alex'},
 {id:'change',title:'پیام تغییر قرار بدون جمله آماده',prompt:'برای کلاس زبان یک پیام کوتاه بنویسید: بگویید به قرار امروز نمی‌رسید، عذرخواهی کنید و روز و ساعت دیگری پیشنهاد بدهید. از اطلاعات خیالی استفاده کنید.',rubric:['مخاطب و لحن مناسب است.','نرسیدن به قرار و عذرخواهی روشن است.','روز و ساعت تازه پیشنهاد کرده‌ام.','ترتیب کلمه و پایان‌بندی را بازخوانی کردم.'],sample:'Guten Tag Frau Weber, leider kann ich heute nicht zum Kurs kommen. Ich muss arbeiten. Es tut mir leid. Haben Sie morgen um 10 Uhr Zeit? Vielen Dank und freundliche Grüße, Alex Winter'},
] as const;
export const ORAL_TASKS=[
 {id:'intro',title:'معرفی و هجی',prompt:'همراه نام، کشور، زبان و شماره خیالی شما را می‌پرسد. پاسخ دهید، نام خانوادگی را هجی کنید و از او هم دو سؤال بپرسید.'},
 {id:'plan',title:'هماهنگی و تغییر برنامه',prompt:'دوستتان شنبه ساعت ۹ پیشنهاد می‌دهد. نمی‌توانید؛ ساعت نیم‌ساعت دیرتر پیشنهاد کنید، درباره هوا و فعالیت صحبت کنید و زمان نهایی را تأیید کنید.'},
 {id:'shop',title:'خرید و رفع ابهام',prompt:'لباس، رنگ و سایز دلخواه بخواهید؛ همراه قیمت را می‌گوید. درخواست تکرار کنید، قیمت را تأیید کنید و خرید را بپذیرید یا رد کنید.'},
] as const;
export const ORAL_CRITERIA=['بدون خواندن متن پاسخ دادم.','پرسیدم، پاسخ شنیدم و واکنش مناسب نشان دادم.','اطلاعات اصلی برای همراه قابل‌فهم بود.','اگر نفهمیدم، درخواست تکرار یا توضیح کردم.'] as const;
export interface WorkshopDraft {version:1; form:Record<string,string>; messages:Record<string,string>; checks:Record<string,boolean>; notes:string; updatedAt:string}
export function emptyWorkshop():WorkshopDraft{return {version:1,form:Object.fromEntries(FORM_FIELDS.map(([id])=>[id,''])),messages:Object.fromEntries(WRITING_TASKS.map(t=>[t.id,''])),checks:{},notes:'',updatedAt:new Date().toISOString()};}
export const workshopCheckIds=[...WRITING_TASKS.flatMap(t=>t.rubric.map((_,i)=>`${t.id}-${i}`)),...ORAL_TASKS.flatMap(t=>ORAL_CRITERIA.map((_,i)=>`${t.id}-${i}`))];
export function validWorkshop(value:unknown):value is WorkshopDraft {
 if(!value||typeof value!=='object')return false;const d=value as WorkshopDraft;
 const strings=(x:unknown,keys:string[],max:number)=>!!x&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).length===keys.length&&keys.every(k=>typeof (x as Record<string,unknown>)[k]==='string'&&((x as Record<string,string>)[k]).length<=max);
 return d.version===1&&strings(d.form,FORM_FIELDS.map(f=>f[0]),100)&&strings(d.messages,WRITING_TASKS.map(t=>t.id),2000)&&typeof d.notes==='string'&&d.notes.length<=2000&&!!d.checks&&typeof d.checks==='object'&&!Array.isArray(d.checks)&&Object.entries(d.checks).every(([k,v])=>workshopCheckIds.includes(k)&&typeof v==='boolean')&&typeof d.updatedAt==='string'&&Number.isFinite(Date.parse(d.updatedAt));
}
export const WORKSHOP_CHECKS_SYNC_KEY='learning_de_a1_workshop_checks_sync_v1';
export interface WorkshopCheckSyncEntry {checked:boolean;updatedAt:string}
export interface WorkshopChecklistSyncState {version:1;resetAt:string|null;checks:Record<string,WorkshopCheckSyncEntry>}
const emptyWorkshopChecklistSyncState=():WorkshopChecklistSyncState=>({version:1,resetAt:null,checks:{}});
const isRecord=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const validSyncTime=(value:unknown):value is string=>typeof value==='string'&&Number.isFinite(Date.parse(value));
export function parseWorkshopChecklistSyncState(value:unknown):WorkshopChecklistSyncState{
 if(!isRecord(value)||value.version!==1||(value.resetAt!==null&&!validSyncTime(value.resetAt))||!isRecord(value.checks)
   ||Object.entries(value.checks).some(([id,entry])=>!workshopCheckIds.includes(id)||!isRecord(entry)||typeof entry.checked!=='boolean'||!validSyncTime(entry.updatedAt)))throw new Error('Workshop checklist sync data is invalid');
 const checks=value.checks as Record<string,WorkshopCheckSyncEntry>;
 const resetAt=value.resetAt as string|null;
 const visible=Object.fromEntries(Object.entries(checks).filter(([,entry])=>!resetAt||Date.parse(entry.updatedAt)>Date.parse(resetAt)));
 return {version:1,resetAt,checks:visible};
}
async function getStored(key:string):Promise<string|null>{return Platform.OS==='web'?(typeof window==='undefined'?null:window.localStorage.getItem(key)):AsyncStorage.getItem(key);}
async function setStored(key:string,value:string):Promise<void>{if(Platform.OS==='web'){if(typeof window==='undefined')throw new Error('Storage unavailable');window.localStorage.setItem(key,value);}else await AsyncStorage.setItem(key,value);}
async function removeStored(key:string):Promise<void>{if(Platform.OS==='web'){if(typeof window==='undefined')throw new Error('Storage unavailable');window.localStorage.removeItem(key);}else await AsyncStorage.removeItem(key);}
function legacyChecklistState(draft:WorkshopDraft|null):WorkshopChecklistSyncState{
 if(!draft)return emptyWorkshopChecklistSyncState();
 return {version:1,resetAt:null,checks:Object.fromEntries(Object.entries(draft.checks).map(([id,checked])=>[id,{checked,updatedAt:draft.updatedAt}]))};
}
async function readWorkshopChecklistSyncState(legacyDraft?:WorkshopDraft|null):Promise<WorkshopChecklistSyncState>{
 const raw=await getStored(WORKSHOP_CHECKS_SYNC_KEY);
 if(raw!==null){let parsed:unknown;try{parsed=JSON.parse(raw);}catch{throw new Error('Saved workshop checklist sync data is not valid JSON');}return parseWorkshopChecklistSyncState(parsed);}
 let draft=legacyDraft??null;
 if(legacyDraft===undefined){const draftRaw=await getStored(WORKSHOP_KEY);if(draftRaw){try{const parsed:unknown=JSON.parse(draftRaw);if(validWorkshop(parsed))draft=parsed;}catch{/* Preserve an unreadable private draft; it cannot be migrated automatically. */}}}
 return legacyChecklistState(draft);
}
export async function exportWorkshopChecklistSyncState():Promise<WorkshopChecklistSyncState>{return readWorkshopChecklistSyncState();}
function mergeWorkshopChecklistStates(local:WorkshopChecklistSyncState,remote:WorkshopChecklistSyncState):WorkshopChecklistSyncState{
 const resetCandidates=[local.resetAt,remote.resetAt].filter((value):value is string=>!!value&&validSyncTime(value));
 const resetAt=resetCandidates.sort((a,b)=>Date.parse(b)-Date.parse(a))[0]??null;
 const checks:Record<string,WorkshopCheckSyncEntry>={...remote.checks};
 for(const [id,candidate] of Object.entries(local.checks)){
  const prior=checks[id];
  if(!prior||Date.parse(candidate.updatedAt)>Date.parse(prior.updatedAt)
    ||(candidate.updatedAt===prior.updatedAt&&JSON.stringify(candidate)>JSON.stringify(prior)))checks[id]=candidate;
 }
 for(const [id,entry] of Object.entries(checks))if(resetAt&&Date.parse(entry.updatedAt)<=Date.parse(resetAt))delete checks[id];
 return parseWorkshopChecklistSyncState({version:1,resetAt,checks});
}
function visibleWorkshopChecks(state:WorkshopChecklistSyncState):Record<string,boolean>{return Object.fromEntries(Object.entries(state.checks).map(([id,entry])=>[id,entry.checked]));}
export async function mergeRemoteWorkshopChecklistSyncState(remote:unknown):Promise<WorkshopChecklistSyncState>{
 const incoming=parseWorkshopChecklistSyncState(remote);
 const local=await readWorkshopChecklistSyncState();
 const merged=mergeWorkshopChecklistStates(local,incoming);
 const draftRaw=await getStored(WORKSHOP_KEY);
 let draft:WorkshopDraft|null=null;
 if(draftRaw!==null){try{const parsed:unknown=JSON.parse(draftRaw);if(validWorkshop(parsed))draft=parsed;}catch{/* Keep damaged local draft bytes intact; checklist state is stored separately. */}}
 const nextChecks=visibleWorkshopChecks(merged);
 const nextDraft=draft??(Object.keys(nextChecks).length?emptyWorkshop():null);
 await setStored(WORKSHOP_CHECKS_SYNC_KEY,JSON.stringify(merged));
 if(nextDraft&&JSON.stringify(nextDraft.checks)!==JSON.stringify(nextChecks)){
  await setStored(WORKSHOP_KEY,JSON.stringify({...nextDraft,checks:nextChecks}));
 }
 return merged;
}
function scheduleAccountSync(){void import('../personalLearningSync').then(({schedulePersonalLearningSync})=>schedulePersonalLearningSync()).catch(()=>undefined);}
export async function loadWorkshop():Promise<WorkshopDraft>{
 const raw=await getStored(WORKSHOP_KEY);
 let draft:WorkshopDraft;
 if(!raw)draft=emptyWorkshop();else{const parsed:unknown=JSON.parse(raw);if(!validWorkshop(parsed))throw new Error('Invalid workshop draft');draft=parsed;}
 const syncRaw=await getStored(WORKSHOP_CHECKS_SYNC_KEY);
 if(syncRaw!==null){let state:unknown;try{state=JSON.parse(syncRaw);}catch{throw new Error('Invalid workshop checklist sync data');}draft={...draft,checks:visibleWorkshopChecks(parseWorkshopChecklistSyncState(state))};}
 return draft;
}
export async function saveWorkshop(d:WorkshopDraft):Promise<void>{
 if(!validWorkshop(d))throw new Error('Invalid workshop draft');
 const previousRaw=await getStored(WORKSHOP_KEY);
 let previous:WorkshopDraft|null=null;
 if(previousRaw!==null){let parsed:unknown;try{parsed=JSON.parse(previousRaw);}catch{throw new Error('Invalid workshop draft');}if(!validWorkshop(parsed))throw new Error('Invalid workshop draft');previous=parsed;}
 await setStored(WORKSHOP_KEY,JSON.stringify(d));
 const changed=workshopCheckIds.filter(id=>!!previous?.checks[id]!==!!d.checks[id]);
 if(!changed.length)return;
 try{
  const state=await readWorkshopChecklistSyncState(previous);
  for(const id of changed){
   const previousTime=Date.parse(state.checks[id]?.updatedAt??'1970-01-01T00:00:00.000Z');
   const resetTime=state.resetAt?Date.parse(state.resetAt):0;
   const updatedAt=new Date(Math.max(Date.now(),previousTime+1,resetTime+1)).toISOString();
   state.checks[id]={checked:!!d.checks[id],updatedAt};
  }
  await setStored(WORKSHOP_CHECKS_SYNC_KEY,JSON.stringify(state));
  scheduleAccountSync();
 }catch{/* The private draft is safely saved; malformed auxiliary sync metadata is not overwritten. */}
}
export async function clearWorkshop():Promise<void>{
 let previous=emptyWorkshopChecklistSyncState();
 try{previous=await readWorkshopChecklistSyncState();}catch{/* Explicit clear may replace damaged auxiliary checklist metadata. */}
 const observed=[previous.resetAt,...Object.values(previous.checks).map(entry=>entry.updatedAt)]
  .filter((value):value is string=>!!value&&validSyncTime(value)).map(value=>Date.parse(value));
 const resetAt=new Date(Math.max(Date.now(),...observed.map(value=>value+1))).toISOString();
 const state={version:1 as const,resetAt,checks:{}};
 await setStored(WORKSHOP_CHECKS_SYNC_KEY,JSON.stringify(state));
 await removeStored(WORKSHOP_KEY);
 scheduleAccountSync();
}
/** Structural feedback only: deliberately no free-writing or speech score. */
export function formFeedback(form:Record<string,string>):string[]{
 const missing=FORM_FIELDS.filter(([id])=>!form[id]?.trim()).map(([,label])=>label);
 const issues=missing.length?[`فیلدهای خالی: ${missing.join('، ')}`]:[];
 if(form.postcode&&!/^\d{5}$/.test(form.postcode.trim()))issues.push('کد پستی آلمانی این تمرین باید ۵ رقم لاتین باشد.');
 if(form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))issues.push('شکل ایمیل را بررسی کنید؛ مثلاً alex@example.com.');
 if(form.birth&&!/^\d{2}\.\d{2}\.\d{4}$/.test(form.birth.trim()))issues.push('قالب تاریخ: روز.ماه.سال، مثلاً 14.03.2000.');
 if(form.phone&&!/^[+\d ()-]{5,30}$/.test(form.phone.trim()))issues.push('برای تلفن از رقم لاتین و در صورت نیاز +، فاصله یا خط تیره استفاده کنید.');
 return issues;
}
