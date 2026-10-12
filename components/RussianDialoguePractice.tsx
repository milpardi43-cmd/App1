import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft, Volume2 } from 'lucide-react-native';
import type { LearningLesson } from '@/lib/languages/types';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';

export default function RussianDialoguePractice({ dialogue, onSpeak }: {
  dialogue: LearningLesson['dialogue'];
  onSpeak: (text: string) => void;
}) {
  const speakers = [...new Set(dialogue.map(line => line.speaker))];
  const [myRole, setMyRole] = useState(speakers[0]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = dialogue[index];
  const isMyLine = current?.speaker === myRole;

  const restart = () => { setIndex(0); setRevealed(false); };
  const advance = () => { setRevealed(false); setIndex(value => Math.min(value + 1, dialogue.length - 1)); };
  const changeRole = (role: string) => { setMyRole(role); restart(); };

  return (
    <View style={styles.card}>
      <View style={styles.metaRow}><Text style={styles.kicker}>گفت‌وگوی هدایت‌شده · بدون نیاز به سرویس آنلاین</Text><Text style={styles.counter}>{fa(index + 1)} / {fa(dialogue.length)}</Text></View>
      <Text style={styles.instruction}>نقش خود را انتخاب کنید. جملهٔ طرف مقابل را بشنوید، پاسخ را بلند بگویید و بعد نمونه را ببینید.</Text>
      <View style={styles.roleRow}>{speakers.map(speaker => <Pressable key={speaker} accessibilityRole="button" accessibilityState={{ selected: myRole === speaker }} onPress={() => changeRole(speaker)} style={[styles.roleButton, myRole === speaker && styles.roleButtonActive]}><Text style={[styles.roleText, myRole === speaker && styles.roleTextActive]}>{speaker}</Text></Pressable>)}</View>
      {current && <View style={[styles.bubble, isMyLine ? styles.bubbleLearner : styles.bubblePartner]}>
        <Text style={styles.speaker}>{isMyLine ? 'نوبت شما' : current.speaker}</Text>
        {isMyLine
          ? <><Text style={styles.persian}>{current.fa}</Text>{revealed ? <Text style={styles.russian}>{current.text}</Text> : <Text style={styles.hint}>اول جملهٔ روسی را از حافظه بگویید، سپس نمونه را ببینید.</Text>}</>
          : <><Text style={styles.russian}>{current.text}</Text><Text style={styles.persian}>{current.fa}</Text></>}
        {isMyLine && !revealed
          ? <Pressable accessibilityRole="button" style={styles.revealButton} onPress={() => setRevealed(true)}><Text style={styles.revealText}>نمایش پاسخ نمونه</Text></Pressable>
          : <Pressable accessibilityRole="button" accessibilityLabel={`شنیدن: ${current.text}`} style={styles.soundButton} onPress={() => onSpeak(current.text)}><Volume2 size={17} color={Palette.primary} /><Text style={styles.soundText}>{isMyLine ? 'شنیدن پاسخ' : 'شنیدن طرف مقابل'}</Text></Pressable>}
      </View>}
      {isMyLine && !revealed ? null : index < dialogue.length - 1
        ? <Pressable accessibilityRole="button" style={styles.nextButton} onPress={advance}><Text style={styles.nextText}>{isMyLine ? 'گفتم؛ ادامه' : 'ادامهٔ گفت‌وگو'}</Text><ChevronLeft size={18} color="#FFFFFF" /></Pressable>
        : <><Text style={styles.note}>گفت‌وگو تمام شد. نمونه‌ها از جمله‌های همین درس هستند؛ صدا ضبط یا ارزیابی خودکار نمی‌شود.</Text><Pressable accessibilityRole="button" style={styles.restartButton} onPress={restart}><Text style={styles.restartText}>تمرین دوباره از آغاز</Text></Pressable></>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 12, marginTop: 18 },
  metaRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  kicker: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '700', color: Palette.primary, textAlign: 'right', writingDirection: 'rtl' },
  counter: { fontFamily: Typography.fontFamily, fontSize: 11, fontWeight: '700', color: Palette.muted },
  instruction: { fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  roleRow: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7 },
  roleButton: { minHeight: 38, paddingHorizontal: 12, borderRadius: 11, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  roleButtonActive: { backgroundColor: Palette.primarySoft, borderColor: Palette.primary },
  roleText: { fontFamily: Typography.fontFamily, color: Palette.text, fontSize: 11, writingDirection: 'rtl' },
  roleTextActive: { color: Palette.primaryDark, fontWeight: '800' },
  bubble: { width: '94%', borderRadius: 15, borderWidth: 1, padding: 14, gap: 7 },
  bubblePartner: { alignSelf: 'flex-start', borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderBottomLeftRadius: 5 },
  bubbleLearner: { alignSelf: 'flex-end', borderColor: '#DDE2FF', backgroundColor: Palette.primarySoft, borderBottomRightRadius: 5 },
  speaker: { fontFamily: Typography.fontFamily, fontSize: 11, color: Palette.primaryDark, textAlign: 'right', writingDirection: 'rtl' },
  russian: { fontSize: 18, lineHeight: 27, color: Palette.ink, textAlign: 'left', writingDirection: 'ltr' },
  persian: { fontFamily: Typography.fontFamily, fontSize: 14, lineHeight: 23, color: Palette.text, textAlign: 'right', writingDirection: 'rtl' },
  hint: { fontFamily: Typography.fontFamily, fontSize: 12, lineHeight: 20, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  soundButton: { alignSelf: 'flex-start', minHeight: 34, flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  soundText: { fontFamily: Typography.fontFamily, fontSize: 12, color: Palette.primary, writingDirection: 'rtl' },
  revealButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 12, marginTop: 4 },
  revealText: { fontFamily: Typography.fontFamily, fontSize: 13, fontWeight: '700', color: Palette.primaryDark, writingDirection: 'rtl' },
  nextButton: { minHeight: 46, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, backgroundColor: Palette.primary, paddingHorizontal: 14 },
  nextText: { fontFamily: Typography.fontFamily, fontSize: 14, fontWeight: '700', color: '#FFFFFF', writingDirection: 'rtl' },
  restartButton: { minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 11, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted },
  restartText: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '700', color: Palette.primaryDark, writingDirection: 'rtl' },
  note: { fontFamily: Typography.fontFamily, fontSize: 11, lineHeight: 18, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
});
