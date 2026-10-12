import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CourseSentence } from '@/lib/courseContent';
import { EnglishPalette as Palette } from './EnglishSupplementTask';

function normalizeSentence(value: string) {
  return value.toLocaleLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
}

function shuffleByRotation(tokens: string[]) {
  if (tokens.length < 2) return tokens;
  const shift = Math.max(1, Math.floor(tokens.length / 2));
  const rotated = [...tokens.slice(shift), ...tokens.slice(0, shift)];
  return rotated.every((token, index) => token === tokens[index]) ? [...tokens].reverse() : rotated;
}

export function EnglishSentenceBuilder({ sentence }: { sentence: CourseSentence }) {
  const tokens = useMemo(() => sentence.en.trim().split(/\s+/).filter(Boolean), [sentence.en]);
  const shuffled = useMemo(() => shuffleByRotation(tokens), [tokens]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const built = chosen.map(index => shuffled[index]).join(' ');
  const complete = chosen.length === shuffled.length;
  const correct = complete && normalizeSentence(built) === normalizeSentence(sentence.en);

  useEffect(() => {
    setChosen([]);
    setChecked(false);
  }, [sentence.id]);

  const choose = (index: number) => {
    if (chosen.includes(index)) return;
    setChosen(current => [...current, index]);
    setChecked(false);
  };

  const remove = (position: number) => {
    setChosen(current => current.filter((_, index) => index !== position));
    setChecked(false);
  };

  return <View style={styles.card}>
    <Text style={styles.kicker}>ساخت جمله از واژه‌های همین درس</Text>
    <Text style={styles.translation}>{sentence.fa}</Text>
    <View accessibilityLabel="جملهٔ ساخته‌شده" style={styles.answerArea}>
      {chosen.length ? chosen.map((tokenIndex, position) => <Pressable key={`${tokenIndex}-${position}`} accessibilityRole="button" accessibilityLabel={`حذف واژهٔ ${shuffled[tokenIndex]}`} onPress={() => remove(position)} style={styles.answerChip}>
        <Text style={styles.answerText}>{shuffled[tokenIndex]}</Text>
      </Pressable>) : <Text style={styles.placeholder}>واژه‌ها را به ترتیب جمله انتخاب کنید.</Text>}
    </View>
    <View style={styles.wordBank}>
      {shuffled.map((word, index) => {
        const used = chosen.includes(index);
        return <Pressable key={`${sentence.id}-${index}`} accessibilityRole="button" accessibilityState={{ disabled: used }} disabled={used} onPress={() => choose(index)} style={[styles.wordChip, used && styles.usedChip]}>
          <Text style={[styles.wordText, used && styles.usedText]}>{word}</Text>
        </Pressable>;
      })}
    </View>
    <View style={styles.actions}>
      <Pressable accessibilityRole="button" style={styles.primaryButton} onPress={() => setChecked(true)}>
        <Text style={styles.primaryButtonText}>بررسی ترتیب</Text>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => { setChosen([]); setChecked(false); }}>
        <Text style={styles.secondaryButtonText}>از نو</Text>
      </Pressable>
    </View>
    {checked && <Text accessibilityLiveRegion="polite" style={[styles.feedback, correct ? styles.success : styles.tryAgain]}>
      {correct ? 'جمله درست ساخته شد.' : complete ? 'ترتیب را دوباره بررسی کنید؛ می‌توانید واژه‌ها را از بخش پاسخ بردارید.' : `هنوز ${shuffled.length - chosen.length} واژه باقی مانده است.`}
    </Text>}
  </View>;
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 12 },
  kicker: { fontFamily: 'System', fontSize: 12, fontWeight: '700' as const, color: Palette.primary, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  translation: { fontFamily: 'System', fontSize: 17, lineHeight: 28, color: Palette.ink, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  answerArea: { minHeight: 76, borderRadius: 13, borderWidth: 1, borderColor: Palette.primary, backgroundColor: Palette.primarySoft, padding: 10, flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 7, alignItems: 'center' as const },
  placeholder: { flex: 1, fontFamily: 'System', fontSize: 13, lineHeight: 21, color: Palette.muted, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  answerChip: { borderRadius: 9, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.primary, paddingHorizontal: 9, paddingVertical: 7 },
  answerText: { color: Palette.ink, fontSize: 14, writingDirection: 'ltr' as const },
  wordBank: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, justifyContent: 'flex-start' as const, gap: 8 },
  wordChip: { borderRadius: 10, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 10, paddingVertical: 8 },
  usedChip: { opacity: .42 },
  wordText: { color: Palette.ink, fontSize: 14, writingDirection: 'ltr' as const },
  usedText: { color: Palette.muted },
  actions: { flexDirection: 'row-reverse' as const, alignItems: 'center' as const, gap: 9 },
  primaryButton: { flex: 1, minHeight: 44, backgroundColor: Palette.primary, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center' as const, justifyContent: 'center' as const },
  primaryButtonText: { fontFamily: 'System', color: '#FFFFFF', fontSize: 14, fontWeight: '700' as const, writingDirection: 'rtl' as const },
  secondaryButton: { minHeight: 44, backgroundColor: Palette.surfaceMuted, borderRadius: 12, paddingHorizontal: 14, alignItems: 'center' as const, justifyContent: 'center' as const },
  secondaryButtonText: { fontFamily: 'System', color: Palette.ink, fontSize: 13, fontWeight: '600' as const, writingDirection: 'rtl' as const },
  feedback: { fontFamily: 'System', fontSize: 13, lineHeight: 20, textAlign: 'right' as const, writingDirection: 'rtl' as const },
  success: { color: Palette.success },
  tryAgain: { color: Palette.warning },
});
