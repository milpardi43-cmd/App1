import { FEATURES } from '@/lib/features';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { PageNavigation } from '@/components/PageNavigation';
import { supabase } from '@/lib/supabase';
import { requireSupabaseConfigured } from '@/lib/errors';
import { educationError } from '@/lib/educationAdmin';

type Membership = { admin_id: string; status: string; consent_at: string };
export default function LearningAccess() {
  const [code,setCode]=useState(''); const [name,setName]=useState('');
  const [manager,setManager]=useState<string | null>(null); const [consent,setConsent]=useState(false);
  const [members,setMembers]=useState<Membership[]>([]); const [error,setError]=useState(''); const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false); const [confirm,setConfirm]=useState<string | null>(null);
  async function identity() {
    requireSupabaseConfigured();
    const {data,error}=await supabase.auth.getSession(); if(error) throw error;
    if(!data.session) { const result=await supabase.auth.signInAnonymously(); if(result.error) throw result.error; }
  }
  async function load() {
    const {data:session}=await supabase.auth.getSession();
    if(!session.session) {setMembers([]);return;}
    const {data,error}=await supabase.from('education_enrollments').select('admin_id,status,consent_at').eq('student_id',session.session.user.id);
    if(error) throw error;setMembers(data || []);
  }
  async function run(action:()=>Promise<void>) {if(busy)return;setBusy(true);setError('');setMessage('');try{await action();}catch(e){setError(educationError(e));}finally{setBusy(false);}}
  useEffect(()=>{void run(load);},[]);
  const button=(text:string, action:()=>void, disabled=false)=><Pressable accessibilityRole="button" disabled={disabled||busy} onPress={action} style={[s.button,(disabled||busy)&&{opacity:.4}]}><Text style={s.buttonText}>{text}</Text></Pressable>;
  return <ScrollView contentContainerStyle={s.root}><View style={s.page}>
    <PageNavigation backFallback="/lang" />
    <ShieldCheck size={38} color="#0c8b78"/><Text style={s.title}>مدیریت اشتراک آموزشی</Text>
    <Text style={s.text}>عضویت اختیاری است. مدیر فقط خلاصه پیشرفت آموزشی شما را می‌بیند، نه پیام‌ها، اطلاعات یا صفحه گوشی شما.</Text>
    {FEATURES.educationEnrollment && <View style={s.card}><Text style={s.heading}>پذیرفتن دعوت مدیر</Text>
      <Text style={s.text}>کد بلند دعوت آموزشی را وارد کنید؛ این کد با کد ۶ رقمی مکالمه متفاوت است.</Text>
      <TextInput accessibilityLabel="کد دعوت آموزشی" autoCapitalize="none" autoCorrect={false} placeholder="کد دعوت آموزشی" value={code} onChangeText={v=>{setCode(v);setManager(null);setConsent(false);}} style={s.input}/>
      {button('بررسی دعوت و نام مدیر',()=>void run(async()=>{
        if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code.trim())) {setError('کد دعوت آموزشی را کامل و بدون فاصله اضافه وارد کنید.');return;}
        await identity();const {data,error}=await supabase.rpc('preview_education_invite',{p_code:code.trim()});if(error)throw error;setManager(data);
      }),!code.trim())}
      {manager && <><Text style={s.heading}>نام مدیر: {manager}</Text>
        <TextInput accessibilityLabel="نام نمایشی زبان‌آموز" placeholder="نام شما در پنل مدیر" maxLength={80} value={name} onChangeText={setName} style={s.input}/>
        <Text style={s.text}>با پذیرش، نام نمایشی، درس‌های تکمیل‌شده، واژه‌های معرفی‌شده، زمان آموزشی ثبت‌شده، زنجیره فعالیت و زمان آخرین همگام‌سازی در اختیار این مدیر قرار می‌گیرد. ممکن است پیشرفت قبلی ذخیره‌شده شما نیز در گزارش ظاهر شود.</Text>
        <Pressable accessibilityRole="checkbox" accessibilityState={{checked:consent}} onPress={()=>setConsent(v=>!v)} style={s.consent}><Text style={s.text}>{consent?'☑':'☐'} با اشتراک این اطلاعات با مدیر نام‌برده موافقم.</Text></Pressable>
        {button('پذیرش دعوت و اشتراک پیشرفت',()=>void run(async()=>{await identity();const {error}=await supabase.rpc('accept_education_invite',{p_code:code.trim(),p_name:name.trim(),p_consent:consent});if(error)throw error;setManager(null);setCode('');setConsent(false);await load();setMessage('عضویت ثبت شد. گزارش از داده‌های همگام‌شده دستگاه نمایش داده می‌شود.');}),!consent||!name.trim())}
      </>}
    </View>}
    {!FEATURES.educationEnrollment && <Text style={s.note}>پذیرش دعوت جدید فعلاً غیرفعال است. لغو اشتراک‌های قبلی همچنان ممکن است.</Text>}
    {busy&&<ActivityIndicator color="#0c8b78"/>}{!!error&&<Text accessibilityRole="alert" style={s.error}>{error}</Text>}{!!message&&<Text style={s.success}>{message}</Text>}
    <View style={s.card}><Text style={s.heading}>اشتراک‌های فعلی</Text>
      {!members.length&&<Text style={s.text}>عضویتی برای این حساب نمایش داده نمی‌شود.</Text>}
      {members.map(m=><View key={m.admin_id} style={s.member}><Text style={s.text}>شناسه مدیر: {m.admin_id.slice(0,8)}… · {m.status==='active'?'اشتراک فعال':'گزارش متوقف'} </Text>
        {confirm===m.admin_id ? <><Text style={s.text}>دسترسی این مدیر به گزارش شما حذف شود؟ برای عضویت دوباره دعوت جدید لازم است.</Text>{button('بله، اشتراک را قطع کن',()=>void run(async()=>{const {data:session}=await supabase.auth.getSession();if(!session.session)throw new Error('AUTH_REQUIRED');const {error}=await supabase.from('education_enrollments').delete().eq('admin_id',m.admin_id).eq('student_id',session.session.user.id);if(error)throw error;setConfirm(null);await load();setMessage('دسترسی مدیر به گزارش شما قطع شد. درس‌ها و پیشرفت شما پاک نشده‌اند.');}))}{button('انصراف',()=>setConfirm(null))}</> : button('لغو رضایت و قطع اشتراک',()=>setConfirm(m.admin_id))}
      </View>)}
      {button('تازه‌سازی عضویت‌ها',()=>void run(load))}
    </View>
    <Text style={s.note}>هویت فعلی ممکن است مهمان باشد؛ پاک‌کردن داده مرورگر، حذف اپ یا تعویض دستگاه می‌تواند دسترسی به آن را از بین ببرد. انتقال حساب بین دستگاه‌ها هنوز در این نسخه پیاده‌سازی نشده است.</Text>
    <Text style={s.note}>قطع اشتراک، دسترسی بعدی مدیر را متوقف می‌کند؛ نسخه‌هایی که قبلاً دیده یا ذخیره کرده قابل پس‌گرفتن نیستند. اطلاعات دستگاه و کنترل گوشی بخشی از این عضویت نیست.</Text>
  </View></ScrollView>;
}
const s=StyleSheet.create({root:{flexGrow:1,backgroundColor:'#f3f7f9',padding:24},page:{width:'100%',maxWidth:760,alignSelf:'center',gap:20},title:{fontFamily:'Vazirmatn',fontSize:25,fontWeight:'700',color:'#1e3d50',textAlign:'right'},text:{fontFamily:'Vazirmatn',fontSize:13,color:'#496579',textAlign:'right',lineHeight:27},heading:{fontFamily:'Vazirmatn',fontSize:17,fontWeight:'700',color:'#203f52',textAlign:'right'},card:{backgroundColor:'#fff',borderRadius:18,padding:22,gap:18},input:{fontFamily:'Vazirmatn',backgroundColor:'#f5f8fa',padding:14,borderRadius:10,borderWidth:1,borderColor:'#dce6ec',textAlign:'right',color:'#253f54'},button:{backgroundColor:'#0c8b78',padding:14,borderRadius:10,alignItems:'center'},buttonText:{fontFamily:'Vazirmatn',fontSize:13,color:'#fff'},consent:{backgroundColor:'#edf8f3',padding:14,borderRadius:10},member:{borderTopWidth:1,borderColor:'#e4edf1',paddingTop:15,gap:12},note:{fontFamily:'Vazirmatn',fontSize:12,lineHeight:25,textAlign:'right',color:'#738496'},error:{fontFamily:'Vazirmatn',color:'#ae3333',textAlign:'right',lineHeight:25},success:{fontFamily:'Vazirmatn',color:'#14775d',textAlign:'right',lineHeight:25}});
