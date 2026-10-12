export const A1_AUDIO_SAMPLES = [
  { id:'letters',title:'هجی',text:'Ich buchstabiere: M, I, A.',expected:'نام MIA؛ سه حرف باید جدا و به آلمانی خوانده شوند.' },
  { id:'numbers',title:'تفاوت عددها',text:'Fünfzehn. Fünfzig. Zweiunddreißig. Dreiundzwanzig.',expected:'به‌ترتیب ۱۵، ۵۰، ۳۲، ۲۳؛ پایان -zehn و -zig را مقایسه کنید.' },
  { id:'clock',title:'ساعت',text:'Halb neun. Viertel vor neun. Viertel nach neun.',expected:'به‌ترتیب ۸:۳۰، ۸:۴۵ و ۹:۱۵.' },
  { id:'sounds',title:'واکه‌ها و جمله',text:'Buch. Bücher. Schon. Schön. Können Sie das bitte wiederholen?',expected:'u/ü و o/ö باید متفاوت شنیده شوند. جمله پایانی: می‌توانید لطفاً آن را تکرار کنید؟ برای داوری دقیق تلفظ از مدرس کمک بگیرید.' },
] as const;
export type AudioObservation='clear'|'unclear'|'silent';
export const AUDIO_OBSERVATIONS:Record<AudioObservation,string>={clear:'شنیدم؛ برایم واضح بود',unclear:'شنیدم؛ مبهم یا نامناسب بود',silent:'صدایی نشنیدم'};
export function isGermanVoice(language:string){return /^de(?:[-_]|$)/i.test(language);}
export function audioCheckReport(voice:string,observations:Partial<Record<string,AudioObservation>>){
 return ['گزارش شخصی بررسی صدای A1 — نه تأیید مدرس یا آزمون تسلط',`صدای انتخاب‌شده: ${voice || 'انتخاب نشده'}`,...A1_AUDIO_SAMPLES.map(s=>`${s.title}: ${observations[s.id]?AUDIO_OBSERVATIONS[observations[s.id]!]: 'هنوز گزارش نشده'}`),'مدل گوشی / مرورگر: …','توضیح مشکل (بدون اطلاعات شخصی): …'].join('\n');
}
