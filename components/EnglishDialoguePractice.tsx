import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';
import { ChevronLeft, Volume2 } from 'lucide-react-native';
import type { SentenceLesson } from '@/lib/courseContent';
import { EnglishPalette as Palette } from './EnglishSupplementTask';

type DialogueLine = SentenceLesson['dialogue'][number];
type DialoguePair = { partner: DialogueLine; learner: DialogueLine };

export function EnglishDialoguePractice({ dialogue }: { dialogue: SentenceLesson['dialogue'] }) {
  const pairs = useMemo(() => {
    const output: DialoguePair[] = [];
    for (let index = 0; index < dialogue.length - 1; index += 1) {
      const prompt = dialogue[index];
      const reply = dialogue[index + 1];
      if (prompt.speaker === 'partner' && reply.speaker === 'learner') {
        output.push({ partner: prompt, learner: reply });
        index += 1;
      }
    }
    return output;
  }, [dialogue]);
  const [pairIndex, setPairIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = pairs[pairIndex];

  useEffect(() => {
    setPairIndex(0);
    setRevealed(false);
    return () => { void Speech.stop(); };
  }, [dialogue]);

  if (!current) return <View style={styles.card}><Text style={styles.text}>برای این درس دیالوگ آماده‌ای ثبت نشده است.</Text></View>;

  return <View style={styles.card}>
    <View style={styles.metaRow}>
      <Text style={styles.kicker}>گفت‌وگوی هدایت‌شده · بدون نیاز به سرویس آنلاین</Text>
      <Text style={styles.counter}>{pairIndex + 1} / {pairs.length}</Text>
    </View>
    <Text style={styles.instruction}>جملهٔ طرف مقابل را گوش کنید، پاسخ خود را بلند بگویید، سپس نمونهٔ همین درس را ببینید.</Text>
    <View style={styles.bubble}>
      <Text style={styles.speaker}>طرف مقابل</Text>
      <Text style={styles.english}>{current.partner.text}</Text>
      <Text style={styles.persian}>{current.partner.fa}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن: ${current.partner.text}`} style={styles.soundButton} onPress={() => Speech.speak(current.partner.text, { language: 'en-US', rate: 0.76 })}>
        <Volume2 size={17} color={Palette.primary} /><Text style={styles.soundText}>شنیدن</Text>
      </Pressable>
    </View>
    <View style={styles.replyCard}>
      <Text style={styles.speaker}>نوبت شما</Text>
      <Text style={styles.persian}>ابتدا بدون نگاه‌کردن پاسخ خود را با صدای بلند بگویید.</Text>
      {!revealed ? <Pressable accessibilityRole="button" style={styles.revealButton} onPress={() => setRevealed(true)}>
        <Text style={styles.revealText}>نمایش پاسخ نمونه</Text>
      </Pressable> : <>
        <Text style={styles.english}>{current.learner.text}</Text>
        <Text style={styles.persian}>{current.learner.fa}</Text>
        <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن پاسخ: ${current.learner.text}`} style={styles.soundButton} onPress={() => Speech.speak(current.learner.text, { language: 'en-US', rate: 0.76 })}>
          <Volume2 size={17} color={Palette.primary} /><Text style={styles.soundText}>شنیدن پاسخ</Text>
        </Pressable>
      </>}
    </View>
    {revealed && <Pressable accessibilityRole="button" style={styles.nextButton} onPress={() => { setPairIndex(currentIndex => (currentIndex + 1) % pairs.length); setRevealed(false); }}>
      <Text style={styles.nextText}>{pairIndex + 1 === pairs.length ? 'تمرین دوباره از آغاز' : 'موقعیت بعدی'}</Text>
      <ChevronLeft size={18} color="#FFFFFF" />
    </Pressable>}
    <Text style={styles.note}>این تمرین از دیالوگ موجود استفاده می‌کند؛ گفتار ضبط یا برای هوش مصنوعی ارسال نمی‌شود.</Text>
  </View>;
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 12 },
  metaRow: { flexDirection: 'row-reverse' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, gap: 8 },
  kicker: { flex: 1, fontFamily: 'System', fontSize: 12, fontWeight: '700' as const, color: Palette.primary, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  counter: { fontFamily: 'System', fontSize: 11, fontWeight: '700' as const, color: Palette.muted },
  instruction: { fontFamily: 'System', fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  bubble: { alignSelf: 'flex-start' as const, width: '94%' as const, borderRadius: 15, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, padding: 14, gap: 7 },
  replyCard: { alignSelf: 'flex-end' as const, width: '94%' as const, borderRadius: 15, borderWidth: 1, borderColor: '#DDE2FF', backgroundColor: Palette.primarySoft, padding: 14, gap: 7 },
  speaker: { fontFamily: 'System', fontSize: 11, fontWeight: '700' as const, color: Palette.primaryDark, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  english: { fontSize: 18, lineHeight: 27, color: Palette.ink, textAlign: 'left' as const, writingDirection: 'ltr' as const },
  persian: { fontFamily: 'System', fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  soundButton: { alignSelf: 'flex-start' as const, minHeight: 34, flexDirection: 'row-reverse' as const, alignItems: 'center' as const, gap: 5 },
  soundText: { fontFamily: 'System', fontSize: 12, color: Palette.primary, writingDirection: 'rtl' as const },
  revealButton: { minHeight: 42, alignItems: 'center' as const, justifyContent: 'center' as const, borderRadius: 10, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 12, marginTop: 4 },
  revealText: { fontFamily: 'System', fontSize: 13, fontWeight: '700' as const, color: Palette.primaryDark, writingDirection: 'rtl' as const },
  nextButton: { minHeight: 46, flexDirection: 'row-reverse' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 8, borderRadius: 12, backgroundColor: Palette.primary, paddingHorizontal: 14 },
  nextText: { fontFamily: 'System', fontSize: 14, fontWeight: '700' as const, color: '#FFFFFF', writingDirection: 'rtl' as const },
  note: { fontFamily: 'System', fontSize: 11, lineHeight: 18, color: Palette.muted, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  text: { fontFamily: 'System', fontSize: 14, color: Palette.text, textAlign: 'right' as const, writingDirection: 'rtl' as const },
});
