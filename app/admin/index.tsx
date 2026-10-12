import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { FEATURES } from '@/lib/features';
import { BookOpen, Users, Ticket, LayoutDashboard, ShieldCheck, LogOut, ArrowUpLeft, Search, RefreshCw, GraduationCap } from 'lucide-react-native';
import { adminClient, loadAdminData, demoStudents, educationError, progressMetrics, type StudentRow, type EducationInvite } from '@/lib/educationAdmin';
import { COURSE_LEVELS, SENTENCE_LESSONS } from '@/lib/courseContent';
import { toPersianDigits as fa } from '@/lib/format';

type Tab = 'overview' | 'students' | 'invites' | 'content';
const tabs = [
  { id: 'overview' as Tab, title: 'نمای کلی', icon: LayoutDashboard },
  { id: 'students' as Tab, title: 'زبان‌آموزان', icon: Users },
  { id: 'invites' as Tab, title: 'دعوت‌نامه‌ها', icon: Ticket },
  { id: 'content' as Tab, title: 'محتوای آموزشی', icon: BookOpen },
];
const dates = (value: string | null) => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleDateString('fa-IR') : 'هنوز همگام نشده';

export default function AdminRoute() {
  if (!FEATURES.adminPanel) return <Redirect href={'/languages' as never} />;
  return <EducationAdmin />;
}
function EducationAdmin() {
  const router = useRouter();
  const wide = useWindowDimensions().width > 940;
  const [mode, setMode] = useState<'login' | 'demo' | 'live'>('login');
  const [tab, setTab] = useState<Tab>('overview');
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [invites, setInvites] = useState<EducationInvite[]>([]);
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('all');
  const [label, setLabel] = useState(''); const [error, setError] = useState(''); const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<StudentRow | null>(null);
  const demo = mode === 'demo';
  const rows = demo ? demoStudents : students;
  const visible = rows.filter(r => r.display_name.includes(search.trim()) && (filter === 'all' || r.status === filter));
  const active = rows.filter(r => r.status === 'active');
  const synced = active.filter(r => r.summary);
  const avg = synced.length ? Math.round(synced.reduce((n,r) => n + progressMetrics(r.summary).percent, 0) / synced.length) : 0;

  async function refresh() {
    const data = await loadAdminData(); setStudents(data.students); setInvites(data.invites); setSelected(null);
  }
  async function task(action: () => Promise<void>) {
    if (busy) return; setBusy(true); setError(''); setNotice('');
    try { await action(); } catch (e) { setError(educationError(e)); } finally { setBusy(false); }
  }
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await adminClient().auth.getSession();
        if (!data.session) return;
        const result = await loadAdminData();
        if (mounted) { setStudents(result.students); setInvites(result.invites); setMode('live'); }
      } catch { /* Login remains available if the migration is not installed. */ }
    })();
    return () => { mounted = false; };
  }, []);
  const login = () => task(async () => {
    const { error } = await adminClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
    try { await refresh(); setMode('live'); setPassword(''); }
    catch (e) { await adminClient().auth.signOut(); throw e; }
  });
  const button = (title: string, onPress: () => void, secondary = false, disabled = false) => (
    <Pressable accessibilityRole="button" disabled={disabled || busy} onPress={onPress} style={[s.button, secondary && s.secondary, (disabled || busy) && { opacity: .45 }]}>
      <Text style={[s.buttonText, secondary && { color: '#344761' }]}>{title}</Text>
    </Pressable>
  );
  const feedback = <>{busy && <ActivityIndicator color="#0c8b78" />}{!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}{!!notice && <Text style={s.notice}>{notice}</Text>}</>;

  if (mode === 'login') return (
    <ScrollView contentContainerStyle={s.loginPage}>
      <View style={s.loginCard}>
        <View style={s.logo}><GraduationCap color="white" size={32} /></View>
        <Text style={s.eyebrow}>ENGLISH JOURNEY / ADMIN</Text>
        <Text style={s.title}>آموزش، با یک نگاه روشن</Text>
        <Text style={s.subtitle}>پنل مدیریت آموزشی شما؛ فقط پیشرفت زبان‌آموزانی که با رضایت عضو شده‌اند.</Text>
        <Text style={s.label}>ایمیل مدیر</Text>
        <TextInput accessibilityLabel="ایمیل مدیر" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} style={[s.input, s.ltr]} placeholder="you@example.com" />
        <Text style={s.label}>رمز عبور</Text>
        <TextInput accessibilityLabel="رمز عبور مدیر" secureTextEntry value={password} onChangeText={setPassword} style={[s.input, s.ltr]} onSubmitEditing={login} />
        {feedback}
        {button('ورود امن به پنل', login, false, !email.trim() || !password)}
        {button('مشاهده پیش‌نمایش با داده‌های نمونه', () => { setError(''); setMode('demo'); }, true)}
        <Text style={s.small}>حساب عادی یا ناشناس دسترسی مدیریتی ندارد. ساخت اولین مدیر از Supabase و طبق راهنمای EDUCATION-ADMIN انجام می‌شود.</Text>
        {button('بازگشت به آموزش', () => router.replace('/lang'), true)}
      </View>
    </ScrollView>
  );

  return <View style={s.root}>
    <View style={[s.shell, !wide && { flexDirection: 'column' }]}>
      <View style={[s.sidebar, !wide && { width: '100%', padding: 16, gap: 12 }]}>
        <View style={s.brand}><View style={s.logo}><GraduationCap color="white" size={25} /></View><View><Text style={s.brandTitle}>English Journey</Text><Text style={s.small}>فضای مدیریت آموزش</Text></View></View>
        {wide && <Text style={s.navLabel}>میز کار شما</Text>}
        <View style={[{ gap: 8 }, !wide && { flexDirection: 'row-reverse', flexWrap: 'wrap' }]}>
          {tabs.map(t => <Pressable accessibilityRole="button" key={t.id} onPress={() => {setTab(t.id);setSelected(null);}} style={[s.navItem, tab === t.id && s.navActive]}><t.icon size={19} color={tab === t.id ? '#087b69' : '#738195'} /><Text style={[s.navText, tab === t.id && { color: '#087b69' }]}>{t.title}</Text></Pressable>)}
        </View>
        {wide && <View style={{ flex: 1 }} />}
        {wide && <View style={s.privacy}><ShieldCheck size={24} color="#0b8b76" /><Text style={s.cardTitle}>فقط آموزش، با رضایت</Text><Text style={s.small}>بدون دسترسی به پیام‌ها، مخاطبان یا صفحه گوشی زبان‌آموز.</Text></View>}
        <Pressable style={s.navItem} onPress={() => void task(async () => { if (!demo) {const {error} = await adminClient().auth.signOut(); if(error) throw error;} setMode('login');setStudents([]);setInvites([]);setSelected(null); })}><LogOut size={18} color="#738195" /><Text style={s.navText}>{demo ? 'ورود به پنل واقعی' : 'خروج از حساب مدیر'}</Text></Pressable>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.main, !wide && { padding: 18 }]}>
        <View style={s.header}><View><Text style={s.eyebrow}>مدیریت آموزشی / {tabs.find(t => t.id === tab)?.title}</Text><Text style={s.title}>{tab === 'overview' ? 'رشد زبان‌آموزان، پیش چشم شما' : tabs.find(t => t.id === tab)?.title}</Text><Text style={s.subtitle}>یادگیری را دنبال کنید، نه زندگی خصوصی افراد را.</Text></View><View style={s.pill}><View style={s.dot} /><Text style={s.pillText}>{demo ? 'حالت نمایشی' : 'حساب مدیر'}</Text></View></View>
        {demo && <Text style={s.demoBanner}>پیش‌نمایش • نام‌ها و آمار این صفحه نمونه‌اند. ایجاد دعوت و تغییر وضعیت در این حالت غیرفعال است.</Text>}
        {feedback}
        {!demo && button('تازه‌سازی گزارش‌ها', () => void task(refresh), true)}
        {(tab === 'overview' || tab === 'students') && <>
          <View style={s.stats}>
            {[['زبان‌آموزان', rows.length, 'عضویت با رضایت'], ['اشتراک فعال', active.length, 'گزارش آموزشی فعال'], ['میانگین پیشرفت', `${fa(avg)}٪`, `${fa(synced.length)} نفر با گزارش همگام‌شده`], ['درس‌های دوره', SENTENCE_LESSONS.length, 'پوشش ۵۰۴ واژه مرجع']].map(([name,value,hint]) => <View key={name} style={s.stat}><Text style={s.statLabel}>{name}</Text><Text style={s.statNumber}>{typeof value === 'number' ? fa(value) : value}</Text><Text style={s.small}>{hint}</Text></View>)}
          </View>
          {tab === 'overview' && <View style={s.hero}><View style={{ flex: 1 }}><Text style={s.heroTitle}>مسیر یادگیری از یک دعوت شروع می‌شود.</Text><Text style={s.heroText}>یک دعوت اختصاصی بسازید؛ زبان‌آموز نام شما و نوع اطلاعات قابل اشتراک را می‌بیند و خودش تصمیم می‌گیرد.</Text></View>{button('دعوت زبان‌آموز جدید', () => setTab('invites'))}</View>}
          <View style={s.card}>
            <View style={s.sectionHead}><Text style={s.cardTitle}>زبان‌آموزان شما</Text><Text style={s.small}>آخرین داده ارسال‌شده از دستگاه</Text></View>
            <View style={s.toolbar}><View style={s.search}><Search size={18} color="#8390a1" /><TextInput accessibilityLabel="جستجوی نام زبان‌آموز" placeholder="جستجوی نام زبان‌آموز…" value={search} onChangeText={setSearch} style={s.searchInput} /></View><View style={s.filters}>{[['all','همه'],['active','فعال'],['paused','متوقف']].map(([id,title]) => <Pressable key={id} onPress={() => setFilter(id)} style={[s.filter, filter===id && {backgroundColor:'#def3ed'}]}><Text style={s.small}>{title}</Text></Pressable>)}</View></View>
            {!visible.length && <View style={s.empty}><Users size={34} color="#0c8b78" /><Text style={s.cardTitle}>{rows.length ? 'نتیجه‌ای پیدا نشد' : 'اولین زبان‌آموز را دعوت کنید'}</Text><Text style={s.small}>فقط افرادی که دعوت شما را پذیرفته‌اند اینجا ظاهر می‌شوند.</Text></View>}
            {visible.map((r,i) => { const m=progressMetrics(r.summary); return <Pressable accessibilityRole="button" key={r.student_id} onPress={() => setSelected(r)} style={s.studentRow}>
              <View style={[s.avatar, {backgroundColor: ['#e5f3f0','#eef0ff','#fff1dc'][i%3]}]}><Text style={s.avatarText}>{r.display_name.slice(0,1)}</Text></View>
              <View style={{ flex: 1, minWidth: 120 }}><Text style={s.studentName}>{r.display_name}</Text><Text style={s.small}>{r.status==='paused' ? 'گزارش متوقف است' : dates(r.synced_at)}</Text></View>
              <View style={{ width: wide ? 180 : 100 }}><Text style={s.small}>{r.summary ? `${fa(m.lessons)} از ۱۶۱ درس` : 'بدون گزارش'}</Text><View style={s.track}><View style={[s.fill,{width:`${m.percent}%`}]} /></View></View>
              <Text style={[s.badge, r.status==='paused' && { backgroundColor:'#fff3df',color:'#a36512' }]}>{r.status==='active' ? 'فعال' : 'متوقف'}</Text><ArrowUpLeft size={17} color="#8190a5" />
            </Pressable>; })}
          </View>
          {selected && <View style={s.card}><View style={s.sectionHead}><Text style={s.cardTitle}>گزارش {selected.display_name}</Text>{button('بستن',()=>setSelected(null),true)}</View><Text style={s.subtitle}>عضویت: {dates(selected.consent_at)} • آخرین همگام‌سازی: {dates(selected.synced_at)}</Text>
            {selected.summary && <Text style={s.detail}>{fa(progressMetrics(selected.summary).lessons)} درس تکمیل‌شده   ·   {fa(progressMetrics(selected.summary).words)} واژه معرفی‌شده   ·   {fa(progressMetrics(selected.summary).minutes)} دقیقه ثبت‌شده</Text>}
            <Text style={s.small}>این داده‌ها گزارش دستگاه‌اند، نه آزمون تسلط یا سنجش حضور. توقف گزارش، اپ یا درس‌های آفلاین را قفل نمی‌کند.</Text>
            {button(selected.status==='active' ? 'توقف دریافت گزارش این عضو' : 'فعال‌کردن دوباره گزارش', () => void task(async () => {
              const { error }=await adminClient().from('education_enrollments').update({status:selected.status==='active'?'paused':'active'}).eq('student_id',selected.student_id).select('student_id');
              if(error) throw error;await refresh();setNotice('وضعیت گزارش به‌روزرسانی شد.');
            }), true, demo)}
          </View>}
        </>}
        {tab === 'invites' && <View style={s.card}>
          <Text style={s.cardTitle}>دعوت آموزشی جدید</Text><Text style={s.subtitle}>دعوت یک‌بارمصرف با اعتبار ۷ روز. این کد با کد دعوت مکالمه فرق دارد.</Text>
          <TextInput accessibilityLabel="عنوان دعوت" placeholder="مثلاً: کلاس عصر — سارا" maxLength={80} value={label} onChangeText={setLabel} style={s.input} />
          {button('ساخت دعوت اختصاصی', () => void task(async () => {const {error}=await adminClient().from('education_invites').insert({label:label.trim()});if(error) throw error;setLabel('');await refresh();setNotice('دعوت ساخته شد. کد را فقط به فرد موردنظر بدهید.');}),false,demo || !label.trim())}
          <Text style={s.small}>زبان‌آموز در صفحه «مدیریت اشتراک آموزشی» کد را وارد می‌کند. نام مدیر و رضایت اشتراک پیشرفت قبل از عضویت نمایش داده می‌شود.</Text>
          {!invites.length && <Text style={s.emptyText}>{demo ? 'برای ساخت دعوت واقعی وارد حساب مدیر شوید.' : 'هنوز دعوتی ساخته نشده است.'}</Text>}
          {invites.map(inv => <View key={inv.id} style={s.inviteRow}><Text style={s.cardTitle}>{inv.label}</Text><Text selectable style={s.code}>{inv.code}</Text><Text style={s.small}>{inv.claimed_at ? 'مصرف‌شده' : Date.parse(inv.expires_at) < Date.now() ? 'منقضی‌شده' : 'آماده استفاده'} · پایان اعتبار: {dates(inv.expires_at)}</Text>{!inv.claimed_at && button('لغو دعوت',()=>void task(async()=>{const {error}=await adminClient().from('education_invites').delete().eq('id',inv.id);if(error) throw error;await refresh();}),true)}</View>)}
        </View>}
        {tab === 'content' && <View style={s.card}><Text style={s.cardTitle}>کتابخانه محتوای فعلی</Text><Text style={s.subtitle}>{fa(SENTENCE_LESSONS.length)} درس · {fa(SENTENCE_LESSONS.reduce((total, lesson) => total + lesson.sentences.length, 0))} جمله · ۵۰۴ واژه مرجع</Text><Text style={s.small}>این بخش فعلاً فقط خواندنی است. ویرایش و انتشار محتوای جدید از پنل هنوز پیاده‌سازی نشده است.</Text>{COURSE_LEVELS.map(l => <View key={l.id} style={s.contentRow}><View style={[s.levelDot,{backgroundColor:l.color}]} /><View style={{flex:1}}><Text style={s.studentName}>{l.title}</Text><Text style={s.small}>{l.description}</Text></View><Text style={s.badge}>{fa(SENTENCE_LESSONS.filter(x=>x.levelId===l.id).length)} درس</Text></View>)}</View>}
        <View style={s.footer}><ShieldCheck size={16} color="#7a899b" /><Text style={s.small}>مدیریت آموزشی • بدون نظارت بر گوشی • داده آفلاین پس از همگام‌سازی دیده می‌شود</Text></View>
        {button('بازگشت به اپ آموزشی',()=>router.replace('/lang'),true)}
      </ScrollView>
    </View>
  </View>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:'#f4f7fa'},shell:{flex:1,flexDirection:'row-reverse'},sidebar:{width:252,backgroundColor:'#fff',padding:24,gap:24,borderLeftWidth:1,borderColor:'#e5ebf1'},brand:{flexDirection:'row-reverse',gap:10,alignItems:'center'},brandTitle:{fontFamily:'Vazirmatn',fontSize:16,fontWeight:'700',color:'#172d45'},logo:{width:50,height:50,borderRadius:16,backgroundColor:'#0c8b78',alignItems:'center',justifyContent:'center'},navLabel:{fontFamily:'Vazirmatn',fontSize:11,color:'#98a3b2',textAlign:'right'},navItem:{flexDirection:'row-reverse',alignItems:'center',gap:12,padding:13,borderRadius:12},navActive:{backgroundColor:'#e9f6f1'},navText:{fontFamily:'Vazirmatn',fontSize:14,color:'#64748b'},privacy:{backgroundColor:'#f5f9f8',padding:17,gap:10,borderRadius:16,alignItems:'flex-end'},main:{padding:36,gap:24,maxWidth:1400,width:'100%',alignSelf:'center'},header:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'},eyebrow:{fontFamily:'Vazirmatn',fontSize:11,color:'#8190a2',textAlign:'right',marginBottom:8},title:{fontFamily:'Vazirmatn',fontSize:26,fontWeight:'700',color:'#172d45',textAlign:'right'},subtitle:{fontFamily:'Vazirmatn',fontSize:13,color:'#6c7c8e',textAlign:'right',lineHeight:25},pill:{flexDirection:'row-reverse',alignItems:'center',gap:8,backgroundColor:'#fff',borderRadius:25,padding:12},dot:{width:7,height:7,borderRadius:4,backgroundColor:'#0c8b78'},pillText:{fontFamily:'Vazirmatn',fontSize:12,color:'#426454'},demoBanner:{fontFamily:'Vazirmatn',fontSize:12,lineHeight:24,color:'#8b641c',backgroundColor:'#fff5dc',padding:14,borderRadius:12,textAlign:'right'},stats:{flexDirection:'row-reverse',flexWrap:'wrap',gap:14},stat:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e7edf3',padding:22,borderRadius:18,flex:1,minWidth:170,gap:7},statLabel:{fontFamily:'Vazirmatn',fontSize:13,color:'#788697',textAlign:'right'},statNumber:{fontFamily:'Vazirmatn',fontSize:32,fontWeight:'700',color:'#17384c',textAlign:'right'},small:{fontFamily:'Vazirmatn',fontSize:11,color:'#7d8c9e',textAlign:'right',lineHeight:21},hero:{backgroundColor:'#143d43',padding:26,borderRadius:20,flexDirection:'row-reverse',alignItems:'center',flexWrap:'wrap',gap:22},heroTitle:{fontFamily:'Vazirmatn',fontSize:19,color:'#fff',fontWeight:'700',textAlign:'right',marginBottom:8},heroText:{fontFamily:'Vazirmatn',fontSize:12,color:'#bcd6d5',textAlign:'right',lineHeight:25},card:{backgroundColor:'#fff',borderWidth:1,borderColor:'#e6edf3',borderRadius:20,padding:22,gap:17},cardTitle:{fontFamily:'Vazirmatn',fontSize:16,fontWeight:'700',color:'#253b52',textAlign:'right'},sectionHead:{flexDirection:'row-reverse',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10},toolbar:{flexDirection:'row-reverse',flexWrap:'wrap',gap:12,alignItems:'center'},search:{flex:1,minWidth:190,flexDirection:'row-reverse',alignItems:'center',gap:10,backgroundColor:'#f5f7fa',borderRadius:10,paddingHorizontal:12},searchInput:{flex:1,fontFamily:'Vazirmatn',fontSize:12,textAlign:'right',padding:12,color:'#253b52'},filters:{flexDirection:'row-reverse',gap:6},filter:{paddingHorizontal:14,paddingVertical:7,borderRadius:8},studentRow:{flexDirection:'row-reverse',alignItems:'center',gap:12,paddingVertical:18,borderTopWidth:1,borderColor:'#edf1f5',flexWrap:'wrap'},avatar:{width:42,height:42,borderRadius:14,alignItems:'center',justifyContent:'center'},avatarText:{fontFamily:'Vazirmatn',fontSize:20,color:'#42636b'},studentName:{fontFamily:'Vazirmatn',fontSize:13,fontWeight:'700',color:'#31615b',textAlign:'right'},badge:{fontFamily:'Vazirmatn',fontSize:11,color:'#19836a',backgroundColor:'#e9f7f0',paddingVertical:5,paddingHorizontal:12,borderRadius:8,overflow:'hidden'},track:{height:5,backgroundColor:'#edf2f6',borderRadius:5,marginTop:8,overflow:'hidden',alignItems:'flex-end'},fill:{height:5,backgroundColor:'#26a890',borderRadius:5},button:{backgroundColor:'#0c8b78',paddingHorizontal:20,paddingVertical:13,borderRadius:11,alignItems:'center'},secondary:{backgroundColor:'#f0f4f7'},buttonText:{fontFamily:'Vazirmatn',color:'#fff',fontSize:12,fontWeight:'700'},input:{fontFamily:'Vazirmatn',fontSize:14,color:'#253b52',backgroundColor:'#f7f9fb',borderWidth:1,borderColor:'#dce5ed',borderRadius:11,padding:14,textAlign:'right'},ltr:{textAlign:'left'},label:{fontFamily:'Vazirmatn',fontSize:12,color:'#52667c',textAlign:'right'},loginPage:{flexGrow:1,backgroundColor:'#edf4f3',alignItems:'center',justifyContent:'center',padding:24},loginCard:{backgroundColor:'#fff',padding:32,borderRadius:24,width:'100%',maxWidth:520,gap:16},error:{fontFamily:'Vazirmatn',color:'#aa3030',backgroundColor:'#fff0f0',padding:14,borderRadius:10,textAlign:'right',lineHeight:24},notice:{fontFamily:'Vazirmatn',color:'#12725e',backgroundColor:'#e7f6ee',padding:14,textAlign:'right',borderRadius:10},empty:{alignItems:'center',padding:30,gap:15},emptyText:{fontFamily:'Vazirmatn',color:'#8090a1',padding:25,textAlign:'center'},detail:{fontFamily:'Vazirmatn',color:'#236f61',fontSize:14,textAlign:'right',lineHeight:28},inviteRow:{borderTopWidth:1,borderColor:'#e7edf4',paddingTop:18,gap:12},code:{fontSize:14,color:'#285b86',textAlign:'left',padding:12,backgroundColor:'#f3f7fb',borderRadius:8},contentRow:{flexDirection:'row-reverse',alignItems:'center',gap:16,paddingVertical:18,borderTopWidth:1,borderColor:'#eef2f5'},levelDot:{width:12,height:36,borderRadius:5},footer:{flexDirection:'row-reverse',alignItems:'center',justifyContent:'center',gap:8},
});
