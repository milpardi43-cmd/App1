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
export async function loadWorkshop():Promise<WorkshopDraft>{
 const raw=Platform.OS==='web'?(typeof window==='undefined'?null:window.localStorage.getItem(WORKSHOP_KEY)):await AsyncStorage.getItem(WORKSHOP_KEY);
 if(!raw)return emptyWorkshop();const d:unknown=JSON.parse(raw);if(!validWorkshop(d))throw new Error('Invalid workshop draft');return d;
}
export async function saveWorkshop(d:WorkshopDraft):Promise<void>{
 if(!validWorkshop(d))throw new Error('Invalid workshop draft');const raw=JSON.stringify(d);
 if(Platform.OS==='web'){if(typeof window==='undefined')throw new Error('Storage unavailable');window.localStorage.setItem(WORKSHOP_KEY,raw);}else await AsyncStorage.setItem(WORKSHOP_KEY,raw);
}
export async function clearWorkshop():Promise<void>{if(Platform.OS==='web'){if(typeof window==='undefined')throw new Error('Storage unavailable');window.localStorage.removeItem(WORKSHOP_KEY);}else await AsyncStorage.removeItem(WORKSHOP_KEY);}
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
