import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PageNavigation } from '@/components/PageNavigation';
import * as Speech from 'expo-speech';
import { ENGLISH_A1_COURSE_UNITS, ENGLISH_FOUNDATION_UNITS, ENGLISH_SUPPLEMENT, SKILLS, type EnglishUnitLevel, type Skill } from '@/lib/englishSupplement/content';
import {
  a1CoursePassed,
  assessmentPassed,
  assessmentScore,
  canOpenUnit,
  canStartAssessment,
  emptyProgress,
  latestAssessment,
  loadSupplement,
  saveChecklist,
  saveDraft,
  skillReport,
  unitPassed,
  type SupplementProgress,
} from '@/lib/englishSupplement/progress';
import { ASSESSMENTS, ASSESSMENT_PASS_PERCENT } from '@/lib/englishSupplement/assessments';
import { EnglishPalette as Palette, EnglishSupplementTask, supplementStyles as s } from '@/components/EnglishSupplementTask';
import { useEnglishStudyTimer } from '@/components/useEnglishStudyTimer';

const writingPrompts = [
  { id: 'a1-intro', title: 'معرفی و پروفایل', prompt: 'دربارهٔ یک شخصیت خیالی ۵ تا ۷ جمله بنویسید: نام، کشور/شهر، زبان، کار یا تحصیل، خانواده و یک علاقه.', sample: 'My name is Mina. I am from Iran, and I live in Tehran. I speak Persian and a little English. I am a student. I have one brother. I like reading.', rubric: ['اطلاعات شخصی پایه روشن است.', 'فاعل و فعل در جمله‌ها آمده‌اند.', 'حرف بزرگ و نشانه‌گذاری را بازبینی کرده‌ام.'] },
  { id: 'a1-routine', title: 'روز معمولی', prompt: '۶ تا ۸ جمله دربارهٔ روز یک شخصیت خیالی بنویسید. از زمان، usually/sometimes و first/then استفاده کنید.', sample: 'I usually get up at seven. First, I have breakfast. Then, I go to work by bus. I have lunch at one. In the evening, I sometimes read. I go to bed at ten.', rubric: ['ترتیب زمانی مشخص است.', 'حال ساده و قید دفعات را تمرین کرده‌ام.', 'زمان را با at و بخش روز را درست نوشته‌ام.'] },
  { id: 'a1-home-writing', title: 'خانه و محله', prompt: '۵ تا ۷ جمله دربارهٔ یک خانه یا محلهٔ خیالی بنویسید. از there is/are و دست‌کم دو عبارت مکان استفاده کنید.', sample: 'There is a small kitchen in my home. There are two bedrooms. The table is next to the window. There is a park near my home. The bus stop is opposite the bank.', rubric: ['there is/there are را با مفرد/جمع هماهنگ کرده‌ام.', 'دو عبارت مکان به‌کار برده‌ام.', 'توصیف برای خواننده قابل‌فهم است.'] },
  { id: 'a1-message', title: 'پیام و قرار', prompt: 'برای دوست خیالی خود پیام ۴ تا ۶ جمله‌ای بنویسید: سلام، دعوت یا تغییر زمان/مکان، یک دلیل و درخواست پاسخ.', sample: 'Hi Sam. Would you like to meet at the café tomorrow? I am busy today because I have a class. How about Saturday at four? Please reply. Thanks, Mina.', rubric: ['هدف پیام را گفته‌ام.', 'زمان/مکان روشن است.', 'دلیل یا درخواست و پایان مودبانه دارم.'] },
  { id: 'a1-past-writing', title: 'دیروز یا آخر هفته', prompt: '۴ تا ۶ جمله دربارهٔ آخر هفتهٔ یک شخصیت خیالی بنویسید. از was/were و دست‌کم دو فعل گذشته استفاده کنید.', sample: 'On Saturday, I was in the city. I went to a bookshop with my sister. We had lunch in a café. The weather was sunny. In the evening, I watched a film.', rubric: ['زمان گذشته را با نشانه‌ای مانند yesterday مشخص کرده‌ام.', 'was/were را درست به‌کار برده‌ام.', 'فعل‌های گذشته را با شکل مناسب نوشته‌ام.'] },
  { id: 'a1-plans-writing', title: 'برنامهٔ آینده', prompt: '۴ تا ۶ جمله دربارهٔ برنامهٔ فردای یک شخصیت خیالی بنویسید. از going to، زمان و یک دلیل استفاده کنید.', sample: 'Tomorrow I am going to visit my friend. We are going to have lunch at one. Then, we are going to walk in the park because the weather is sunny.', rubric: ['ساختار am/is/are going to را رعایت کرده‌ام.', 'زمان و فعالیت برنامه مشخص است.', 'یک پیونددهنده مانند then یا because دارم.'] },
];

const speakingPrompts = [
  { id: 'intro', title: 'آشنایی و اطلاعات شخصی', partner: 'Hello. What is your name? Where are you from? What languages do you speak?', goal: 'خودتان را معرفی کنید، به خاستگاه و زبان پاسخ دهید و یک پرسش ساده متقابل بپرسید.', phrases: 'My name is… / I am from… / I speak… / And you?', rubric: ['به هر سه پرسش پاسخ دادم.', 'یک پرسش متقابل پرسیدم.', 'نام‌ها و کشور را شمرده و روشن گفتم.'] },
  { id: 'cafe', title: 'سفارش در کافه', partner: 'Hello. What would you like to eat and drink?', goal: 'یک خوراکی و نوشیدنی سفارش دهید، لطفاً/تشکر کنید و دربارهٔ قیمت بپرسید.', phrases: 'I’d like…, please. / How much is it? / Thank you.', rubric: ['سفارش روشن دادم.', 'از please یا thank you استفاده کردم.', 'قیمت را پرسیدم یا پاسخ دادم.'] },
  { id: 'directions', title: 'پرسیدن مسیر', partner: 'Excuse me. Where is the bus station?', goal: 'مودبانه پاسخ دهید و با یک یا دو دستور ساده مسیر را توضیح دهید.', phrases: 'Go straight. / Turn left/right. / It is next to… / Thank you.', rubric: ['با یک عبارت مودبانه شروع کردم.', 'مسیر یا مکان را روشن گفتم.', 'طرف مقابل را برای فهمیدن فرصت دادم.'] },
  { id: 'invitation', title: 'دعوت و زمان جایگزین', partner: 'Would you like to see a film on Friday?', goal: 'دعوت را بپذیرید یا مودبانه رد کنید و زمان دیگری پیشنهاد دهید.', phrases: 'Yes, I’d love to. / Sorry, I can’t. / How about Saturday?', rubric: ['پاسخ مثبت یا منفی روشن دادم.', 'یک زمان دیگر پیشنهاد کردم.', 'از لحن دوستانه استفاده کردم.'] },
  { id: 'appointment', title: 'درخواست وقت ملاقات', partner: 'Good morning. How can I help you?', goal: 'وقت ملاقات بخواهید و زمان مناسب را بیان کنید؛ تشخیص یا توصیهٔ پزشکی لازم نیست.', phrases: 'I’d like an appointment, please. / I feel… / Is tomorrow morning available?', rubric: ['درخواست وقت ملاقات را بیان کردم.', 'حال یا زمان مناسب را کوتاه گفتم.', 'اگر متوجه نشدم، درخواست تکرار کردم.'] },
  { id: 'hotel', title: 'ورود به هتل', partner: 'Good evening. Do you have a reservation?', goal: 'نام و تعداد شب را بگویید و یک پرسش ساده دربارهٔ صبحانه یا اتاق بپرسید.', phrases: 'Yes, I have a reservation. / For two nights. / Is breakfast included?', rubric: ['رزرو و نام را بیان کردم.', 'تعداد شب‌ها را گفتم.', 'یک پرسش مرتبط پرسیدم.'] },
];

function Draft({ id, title, prompt, sample, rubric, initial, initialChecks }: {
  id: string; title: string; prompt: string; sample: string; rubric: string[]; initial: string; initialChecks: Record<string, boolean>;
}) {
  const [value, setValue] = useState(initial), [message, setMessage] = useState(''), [busy, setBusy] = useState(false), [show, setShow] = useState(false), [checks, setChecks] = useState(initialChecks);
  async function toggle(index: number) {
    const key = String(index), next = !checks[key];
    setChecks(current => ({ ...current, [key]: next }));
    try { await saveChecklist(id, key, next); } catch { setMessage('چک‌لیست ذخیره نشد؛ دوباره تلاش کنید.'); }
  }
  return <View style={s.card}>
    <Text style={s.heading}>{title}</Text><Text style={s.text}>{prompt}</Text>
    <TextInput accessibilityLabel={title} editable={!busy} multiline maxLength={4000} style={[s.input, { minHeight: 150 }]} value={value} onChangeText={v => { setValue(v); setMessage(''); }} />
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} style={[s.button, busy && s.disabled]} onPress={async () => { setBusy(true); try { await saveDraft(id, value); setMessage('پیش‌نویس روی همین دستگاه ذخیره شد.'); } catch { setMessage('ذخیره نشد؛ متن را نگه دارید و دوباره تلاش کنید.'); } finally { setBusy(false); } }}><Text style={s.buttonText}>{busy ? 'در حال ذخیره…' : 'ذخیره پیش‌نویس'}</Text></Pressable>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.text}>{message}</Text>}
    <Text style={s.text}>بازبینی شخصی؛ این چک‌لیست نمرهٔ مهارت محسوب نمی‌شود.</Text>
    {rubric.map((item, i) => <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: !!checks[String(i)] }} key={item} onPress={() => void toggle(i)}><Text style={s.text}>{checks[String(i)] ? '☑' : '☐'} {item}</Text></Pressable>)}
    <Pressable accessibilityRole="button" style={s.button} onPress={() => setShow(!show)}><Text style={s.buttonText}>{show ? 'بستن نمونه' : 'دیدن نمونه برای مقایسه'}</Text></Pressable>
    {show && <Text style={s.english}>{sample}</Text>}
  </View>;
}

function RolePlay({ item, initial, initialChecks }: { item: typeof speakingPrompts[number]; initial: string; initialChecks: Record<string, boolean> }) {
  const [playing, setPlaying] = useState(false), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [checks, setChecks] = useState(initialChecks), [notes, setNotes] = useState(initial);
  function speak() {
    setPlaying(true);
    Speech.speak(item.partner, { language: 'en-US', rate: 0.78, onDone: () => setPlaying(false), onStopped: () => setPlaying(false), onError: () => { setPlaying(false); setMessage('صدا پخش نشد؛ تنظیمات صدای دستگاه را بررسی کنید.'); } });
  }
  async function toggle(index: number) {
    const key = String(index), next = !checks[key]; setChecks(current => ({ ...current, [key]: next }));
    try { await saveChecklist(`speaking-${item.id}`, key, next); } catch { setMessage('خودارزیابی ذخیره نشد؛ دوباره تلاش کنید.'); }
  }
  return <View style={s.card}>
    <Text style={s.heading}>{item.title}</Text><Text style={s.text}>{item.goal}</Text>
    <Text style={s.text}>گفت‌وگوی نقش‌آفرینی: جملهٔ طرف مقابل را گوش کنید، سپس پاسخ خود را بلند بگویید. صدای شما ضبط و تلفظتان خودکار نمره‌گذاری نمی‌شود.</Text>
    <Text style={s.english}>{item.partner}</Text>
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: playing }} disabled={playing} style={[s.button, playing && s.disabled]} onPress={speak}><Text style={s.buttonText}>{playing ? 'در حال پخش…' : 'شنیدن جملهٔ طرف مقابل'}</Text></Pressable>
    <Text style={s.english}>{item.phrases}</Text>
    <Text style={s.text}>پس از تمرین، مواردی را که خودتان انجام داده‌اید علامت بزنید:</Text>
    {item.rubric.map((check, i) => <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: !!checks[String(i)] }} key={check} onPress={() => void toggle(i)}><Text style={s.text}>{checks[String(i)] ? '☑' : '☐'} {check}</Text></Pressable>)}
    <TextInput accessibilityLabel={`یادداشت ${item.title}`} multiline maxLength={1000} value={notes} onChangeText={setNotes} placeholder="یادداشت اختیاری برای دفعهٔ بعد" placeholderTextColor="#94a3b8" style={[s.input, { minHeight: 75 }]} />
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} style={[s.button, busy && s.disabled]} onPress={async () => { setBusy(true); try { await saveDraft(`speaking-${item.id}`, notes); setMessage('یادداشت روی همین دستگاه ذخیره شد.'); } catch { setMessage('ذخیره نشد؛ دوباره تلاش کنید.'); } finally { setBusy(false); } }}><Text style={s.buttonText}>{busy ? 'در حال ذخیره…' : 'ذخیرهٔ یادداشت'}</Text></Pressable>
    {!!message && <Text accessibilityLiveRegion="polite" style={s.text}>{message}</Text>}
  </View>;
}

function FormExercise({ initial }: { initial: Record<string, string> }) {
  const fields = [['first', 'First name', 'Mina'], ['last', 'Last name', 'Green'], ['city', 'City', 'York'], ['email', 'Email', 'mina@example.com']] as const;
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(([id]) => [id, initial[`form-${id}`] ?? '']))), [feedback, setFeedback] = useState(''), [busy, setBusy] = useState(false);
  return <View style={s.card}><Text style={s.heading}>فرم با اطلاعات خیالی</Text><Text style={s.text}>اطلاعات متن را در فیلد مناسب وارد کنید؛ اطلاعات شخصی خودتان لازم نیست.</Text><Text style={s.english}>My name is Mina Green. I live in York. My email is mina@example.com.</Text>{fields.map(([id, label]) => <View key={id}><Text style={s.english}>{label}</Text><TextInput accessibilityLabel={label} editable={!busy} value={values[id]} autoCapitalize="none" autoCorrect={false} maxLength={100} style={s.input} onChangeText={v => { setValues({ ...values, [id]: v }); setFeedback(''); }} /></View>)}
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: busy }} disabled={busy} style={[s.button, busy && s.disabled]} onPress={async () => { setBusy(true); try { for (const [id] of fields) await saveDraft(`form-${id}`, values[id]); const wrong = fields.filter(([id, , answer]) => values[id].trim() !== answer); setFeedback(wrong.length ? `این فیلدها را با متن تطبیق دهید: ${wrong.map(([, label]) => label).join('، ')}` : 'همه فیلدها درست‌اند؛ پیش‌نویس ذخیره شد.'); } catch { setFeedback('ذخیره نشد؛ دوباره تلاش کنید.'); } finally { setBusy(false); } }}><Text style={s.buttonText}>بررسی و ذخیره فرم</Text></Pressable>{!!feedback && <Text accessibilityLiveRegion="polite" style={s.text}>{feedback}</Text>}</View>;
}

export default function EnglishSupplementScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ level?: string | string[] }>();
  const rawLevel = Array.isArray(params.level) ? params.level[0] : params.level;
  const levelFilter: EnglishUnitLevel | undefined = rawLevel === 'Foundation' || rawLevel === 'A1' ? rawLevel : undefined;
  const [p, setP] = useState<SupplementProgress>(emptyProgress), [ready, setReady] = useState(false), [error, setError] = useState(''), [unit, setUnit] = useState<number | null>(null), [tab, setTab] = useState<'units' | 'report' | 'writing'>('units'), [testing, setTesting] = useState(false);
  async function load() { setError(''); try { setP(await loadSupplement()); setReady(true); } catch { setError('نتایج خوانده نشد. برای حفظ اطلاعات، تمرین فعلاً باز نمی‌شود. دوباره تلاش کنید.'); } }
  useEffect(() => { void load(); return () => { void Speech.stop(); }; }, []);
  const timer = useEnglishStudyTimer(ready);
  const selected = unit === null ? null : ENGLISH_SUPPLEMENT[unit];
  const selectedTrack = selected?.level === 'Foundation' ? ENGLISH_FOUNDATION_UNITS : ENGLISH_A1_COURSE_UNITS;
  const trackPosition = selected ? selectedTrack.findIndex(item => item.id === selected.id) + 1 : 0;
  const practiced = !!selected && selected.practice.every(task => p.evidence[task.id]?.correct);
  const visibleUnits = levelFilter ? ENGLISH_SUPPLEMENT.filter(item => item.level === levelFilter) : ENGLISH_SUPPLEMENT;
  const foundationAttempt = latestAssessment(p, 'Foundation'), a1Attempt = latestAssessment(p, 'A1');
  const foundationScore = foundationAttempt ? assessmentScore(foundationAttempt) : null, a1Score = a1Attempt ? assessmentScore(a1Attempt) : null;
  const foundationDone = ENGLISH_FOUNDATION_UNITS.filter(item => unitPassed(item.id, p)).length;
  const a1Done = ENGLISH_A1_COURSE_UNITS.filter(item => unitPassed(item.id, p)).length;
  const totalDone = foundationDone + a1Done;

  return <View onTouchStart={timer.interact} style={s.page}><ScrollView contentContainerStyle={s.pageContent} showsVerticalScrollIndicator={false}>
    <PageNavigation backFallback="/lang" onBack={() => { if (selected) { setUnit(null); setTesting(false); void Speech.stop(); } else if (router.canGoBack()) router.back(); else router.replace('/lang' as never); }} />
    <Text style={s.pageTitle}>مسیر انگلیسی مقدماتی تا A1</Text>{!!timer.error && <Text style={s.error}>{timer.error}</Text>}
    {!selected && <View style={s.levelHeader}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Text style={s.sectionTitle}>پیشرفت مسیر</Text>
        <View style={s.chip}><Text style={s.chipText}>{totalDone} از ۲۴ واحد</Text></View>
      </View>
      <View style={s.progressTrack}><View style={[s.progressFill, { width: `${(totalDone / ENGLISH_SUPPLEMENT.length) * 100}%` }]} /></View>
      <Text style={s.levelMeta}>Foundation ‏{foundationDone}/۴  ·  A1 ‏{a1Done}/۲۰</Text>
    </View>}
    <Text style={s.text}>دورهٔ مکمل، در کنار ۱۶۱ درس اصلی قرار دارد؛ محتوای قبلی و سابقهٔ ذخیره‌شده حفظ شده است. سنجش‌های این مسیر تمرینی و محلی‌اند، نه گواهی رسمی CEFR.</Text>
    {!!error && <><Text style={s.error}>{error}</Text><Pressable accessibilityRole="button" style={s.button} onPress={() => void load()}><Text style={s.buttonText}>تلاش دوباره</Text></Pressable></>}
    {!ready && !error && <Text style={s.text}>در حال خواندن نتایج…</Text>}
    {ready && <>
      {!selected && <View style={s.tabRow}>{([['units', 'واحدهای دوره'], ['writing', 'نوشتن و مکالمه'], ['report', 'گزارش و سنجش']] as const).map(([key, label]) => <Pressable key={key} accessibilityRole="button" accessibilityState={{ selected: tab === key }} style={[s.tab, tab === key && s.tabActive]} onPress={() => { setTab(key); void load(); }}><Text style={[s.tabText, tab === key && s.tabTextActive]}>{label}</Text></Pressable>)}</View>}

      {!selected && tab === 'units' && <>
        <Text style={s.text}>۲۴ واحد: Foundation چهار واحد و A1 بیست واحد. هر واحد سه بخش آموزش، چهار تمرین بازخورددار و چهار پرسش مستقل دارد. واحد بعد با پاسخ درست به همهٔ تمرین‌ها و پرسش‌های پایان واحد باز می‌شود.</Text>
        {!assessmentPassed('Foundation', p) && <View style={s.card}>
          <Text style={s.heading}>پیش‌نیاز مسیر A1</Text>
          <Text style={s.text}>برای بازشدن واحدهای ناآموختهٔ A1، چهار واحد Foundation را کامل کنید و سنجش ۱۲پرسشی آن را بگذرانید.</Text>
          <Pressable accessibilityRole="button" style={s.button} onPress={() => router.replace({ pathname: '/lang/supplement', params: { level: 'Foundation' } } as never)}><Text style={s.buttonText}>رفتن به واحدهای Foundation</Text></Pressable>
          {canStartAssessment('Foundation', p) && <Pressable accessibilityRole="button" style={s.button} onPress={() => router.push({ pathname: '/lang/final-assessment', params: { level: 'Foundation' } } as never)}><Text style={s.buttonText}>شروع سنجش Foundation</Text></Pressable>}
        </View>}
        {(levelFilter ? [levelFilter] : ['Foundation', 'A1'] as EnglishUnitLevel[]).map(level => {
          const levelUnits = visibleUnits.filter(item => item.level === level);
          const levelDone = level === 'Foundation' ? foundationDone : a1Done;
          const levelTotal = level === 'Foundation' ? ENGLISH_FOUNDATION_UNITS.length : ENGLISH_A1_COURSE_UNITS.length;
          return <View key={level} style={{ gap: 9 }}>
            <View style={s.levelHeader}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <Text style={s.sectionTitle}>{level === 'Foundation' ? 'مقدماتی · Foundation' : 'A1 · استفادهٔ روزمره'}</Text>
                <Text style={s.levelMeta}>{levelDone} از {levelTotal} واحد</Text>
              </View>
              <View style={s.progressTrack}><View style={[s.progressFill, { width: `${(levelDone / levelTotal) * 100}%` }]} /></View>
            </View>
            {levelUnits.map(item => {
              const index = ENGLISH_SUPPLEMENT.findIndex(entry => entry.id === item.id), open = canOpenUnit(item.id, p);
              const trackNumber = levelFilter ? levelUnits.findIndex(entry => entry.id === item.id) + 1 : index + 1;
              const passed = unitPassed(item.id, p);
              return <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ disabled: !open }} disabled={!open} style={[s.card, s.unitCard, !open && s.disabled]} onPress={() => { setUnit(index); setTesting(false); }}>
                <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <Text style={[s.heading, { flex: 1 }]}>{trackNumber}. {item.title}</Text>
                  <View style={[s.chip, { backgroundColor: passed ? Palette.successSoft : open ? Palette.primarySoft : Palette.surfaceMuted }]}>
                    <Text style={[s.chipText, { color: passed ? Palette.success : open ? Palette.primaryDark : Palette.muted }]}>{passed ? 'تکمیل‌شده' : open ? 'شروع' : 'قفل'}</Text>
                  </View>
                </View>
                <Text style={s.text}>{item.goal}</Text>
              </Pressable>;
            })}
          </View>;
        })}
      </>}

      {selected && <>
        <Text style={s.text}>{selected.level} · واحد {trackPosition} از {selectedTrack.length} · ترتیب کلی {ENGLISH_SUPPLEMENT.findIndex(item => item.id === selected.id) + 1} از {ENGLISH_SUPPLEMENT.length}</Text>
        <Text style={s.heading}>{selected.title}</Text><Text style={s.text}>{selected.goal}</Text>
        {!testing && <>{selected.teaching.map(section => <View style={s.card} key={section.title}>
          <Text style={s.heading}>{section.title}</Text><Text style={s.text}>{section.text}</Text><Text style={s.english}>{section.example}</Text>
          <Pressable accessibilityRole="button" style={s.button} onPress={() => { void Speech.stop(); Speech.speak(section.audio ?? section.example.replace(/\/[^/]+\//g, ''), { language: 'en-US', rate: 0.72, onError: () => setError('صدای انگلیسی پخش نشد؛ تنظیمات صدای دستگاه را بررسی کنید.') }); }}><Text style={s.buttonText}>شنیدن الگو و تکرار</Text></Pressable>
        </View>)}<Text style={s.heading}>تمرین با بازخورد</Text></>}
        {testing && <Text style={s.heading}>آزمون پایان واحد · چهار سؤال مستقل</Text>}
        {(testing ? selected.checkpoint : selected.practice).map(task => <View key={task.id}>{p.evidence[task.id]?.correct && <Text style={s.success}>آخرین پاسخ ثبت‌شده: درست</Text>}<EnglishSupplementTask task={task} onResult={next => setP(next)} /></View>)}
        {!testing && <Pressable accessibilityRole="button" accessibilityState={{ disabled: !practiced }} disabled={!practiced} style={[s.button, !practiced && s.disabled]} onPress={() => { setTesting(true); void Speech.stop(); }}><Text style={s.buttonText}>{practiced ? 'شروع آزمون پایان واحد' : 'ابتدا چهار تمرین را درست انجام دهید'}</Text></Pressable>}
        {testing && <><Pressable accessibilityRole="button" style={s.button} onPress={() => setTesting(false)}><Text style={s.buttonText}>مرور آموزش و تمرین</Text></Pressable>{unitPassed(selected.id, p) && <Text style={s.success}>واحد کامل شد. برای ورود به واحد بعد، به فهرست واحدها برگردید.</Text>}</>}
      </>}

      {!selected && tab === 'report' && <>
        <Text style={s.text}>گزارش زیر فقط پاسخ‌های ثبت‌شدهٔ واحدهای همین مسیر مکمل را می‌شمارد؛ سابقهٔ ۱۶۱ درس اصلی جداگانه در کتابخانهٔ خودش می‌ماند. سنجش پایانی برای مرور پیشرفت است؛ نمرهٔ ۸۰٪ صرفاً معیار داخلی همین تمرین است، نه احراز رسمی سطح زبان. نوشتن آزاد و تلفظ خودکار نمره‌گذاری نمی‌شوند.</Text>
        <View style={s.card}><Text style={s.heading}>Foundation</Text><Text style={s.text}>واحدهای کامل: {ENGLISH_FOUNDATION_UNITS.filter(item => unitPassed(item.id, p)).length} از {ENGLISH_FOUNDATION_UNITS.length}</Text><Text style={s.text}>سنجش پایانی: {foundationScore ? `${foundationScore.correct} از ${foundationScore.total} (${foundationScore.percent}٪) · ${assessmentPassed('Foundation', p) ? 'حداقل یک تلاش معیار داخلی را گذرانده' : 'هنوز تلاش موفق ثبت نشده'}` : 'هنوز انجام نشده'}</Text><Pressable accessibilityRole="button" accessibilityState={{ disabled: !canStartAssessment('Foundation', p) }} disabled={!canStartAssessment('Foundation', p)} style={[s.button, !canStartAssessment('Foundation', p) && s.disabled]} onPress={() => router.push({ pathname: '/lang/final-assessment', params: { level: 'Foundation' } } as never)}><Text style={s.buttonText}>{canStartAssessment('Foundation', p) ? 'شروع / ادامهٔ سنجش Foundation' : 'ابتدا همهٔ واحدهای Foundation را کامل کنید'}</Text></Pressable></View>
        <View style={s.card}><Text style={s.heading}>A1</Text><Text style={s.text}>واحدهای کامل: {ENGLISH_A1_COURSE_UNITS.filter(item => unitPassed(item.id, p)).length} از {ENGLISH_A1_COURSE_UNITS.length}</Text><Text style={s.text}>سنجش پایانی: {a1Score ? `${a1Score.correct} از ${a1Score.total} (${a1Score.percent}٪) · ${assessmentPassed('A1', p) ? 'حداقل یک تلاش معیار داخلی را گذرانده' : 'هنوز تلاش موفق ثبت نشده'}` : 'هنوز انجام نشده'}</Text><Pressable accessibilityRole="button" accessibilityState={{ disabled: !canStartAssessment('A1', p) }} disabled={!canStartAssessment('A1', p)} style={[s.button, !canStartAssessment('A1', p) && s.disabled]} onPress={() => router.push({ pathname: '/lang/final-assessment', params: { level: 'A1' } } as never)}><Text style={s.buttonText}>{canStartAssessment('A1', p) ? 'شروع / ادامهٔ سنجش A1' : 'ابتدا Foundation، سنجش آن و همهٔ واحدهای A1 را کامل کنید'}</Text></Pressable></View>
        {(Object.keys(SKILLS) as Skill[]).map(skill => { const report = skillReport(p, skill); return <View style={s.card} key={skill}><Text style={s.heading}>{SKILLS[skill]}</Text><Text style={s.text}>{report.answered ? `${report.correct} پاسخ درست از ${report.answered} سؤال پاسخ‌داده‌شده · ${report.attempts} تلاش` : 'هنوز سنجیده نشده'}</Text></View>; })}
        <Text style={s.text}>واحدهای تکمیل‌شده: {ENGLISH_SUPPLEMENT.filter(item => unitPassed(item.id, p)).length} از {ENGLISH_SUPPLEMENT.length}. داده‌ها فقط روی همین دستگاه ذخیره می‌شوند. پایان پخش صدا، شنیدن واقعی یا کیفیت تلفظ را تضمین نمی‌کند.</Text>
        {a1CoursePassed(p) && assessmentPassed('A1', p) && <Text style={s.success}>همهٔ واحدهای آموزشی و سنجش داخلی A1 ثبت شده‌اند. این نتیجه گواهی رسمی یا ارزیابی مستقل CEFR نیست.</Text>}
      </>}

      {!selected && tab === 'writing' && <>
        <Text style={s.text}>تمرین نوشتن، فرم و مکالمهٔ نقش‌آفرینی. پیش‌نویس و خودارزیابی روی همین دستگاه می‌ماند؛ متن آزاد یا گفتار شما به‌صورت خودکار تصحیح یا ضبط نمی‌شود.</Text>
        <FormExercise initial={p.drafts} />
        {writingPrompts.map(item => <Draft key={item.id} {...item} initial={p.drafts[item.id] ?? ''} initialChecks={p.checklists[item.id] ?? {}} />)}
        <Text style={s.heading}>مکالمهٔ هدایت‌شده</Text>
        {speakingPrompts.map(item => <RolePlay key={item.id} item={item} initial={p.drafts[`speaking-${item.id}`] ?? ''} initialChecks={p.checklists[`speaking-${item.id}`] ?? {}} />)}
      </>}
    </>}
  </ScrollView></View>;
}
