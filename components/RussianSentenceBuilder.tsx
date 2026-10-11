import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { LearningSentence } from '@/lib/languages/types';
import { EnglishPalette as Palette } from '@/components/EnglishSupplementTask';
import { Typography } from '@/lib/theme';
import { toPersianDigits as fa } from '@/lib/format';

function scramble(sentence: LearningSentence): Array<{ id: number; text: string }> {
  const words = sentence.text.trim().split(/\s+/).map((text, id) => ({ id, text }));
  let seed = [...sentence.id].reduce((sum, char) => sum + char.charCodeAt(0), 17);
  for (let index = words.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280;
    const other = seed % (index + 1);
    [words[index], words[other]] = [words[other], words[index]];
  }
  if (words.length > 1 && words.every((word, index) => word.id === index)) {
    [words[0], words[words.length - 1]] = [words[words.length - 1], words[0]];
  }
  return words;
}

function normalize(value: string) {
  return value.replace(/\s+([,.;:!?])/g, '$1').trim();
}

export default function RussianSentenceBuilder({ sentence }: { sentence: LearningSentence }) {
  const pieces = useMemo(() => scramble(sentence), [sentence.id, sentence.text]);
  const [selected, setSelected] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const answer = selected.map(id => pieces.find(item => item.id === id)?.text ?? '').join(' ');
  const complete = selected.length === pieces.length;
  const correct = complete && normalize(answer) === normalize(sentence.text);
  const unused = pieces.filter(item => !selected.includes(item.id));

  useEffect(() => { setSelected([]); setChecked(false); }, [sentence.id]);

  const choose = (id: number) => {
    if (selected.includes(id)) return;
    setSelected(current => [...current, id]);
    setChecked(false);
  };
  const remove = (id: number) => {
    setSelected(current => current.filter(value => value !== id));
    setChecked(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>ساخت جمله از واژه‌های همین درس</Text>
      <Text style={styles.translation}>{sentence.fa}</Text>
      <View accessibilityLabel="جملهٔ ساخته‌شده" style={styles.answerArea}>
        {selected.length ? selected.map((id, position) => {
          const piece = pieces.find(item => item.id === id)!;
          return <Pressable key={`${id}-${position}`} accessibilityRole="button" accessibilityLabel={`حذف واژهٔ ${piece.text}`} onPress={() => remove(id)} style={styles.answerChip}><Text style={styles.answerText}>{piece.text}</Text></Pressable>;
        }) : <Text style={styles.placeholder}>واژه‌ها را به ترتیب جمله انتخاب کنید.</Text>}
      </View>
      <View style={styles.wordBank}>{unused.map(piece => <Pressable key={piece.id} accessibilityRole="button" onPress={() => choose(piece.id)} style={styles.wordChip}><Text style={styles.wordText}>{piece.text}</Text></Pressable>)}</View>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" disabled={!selected.length} style={[styles.primaryButton, !selected.length && styles.disabled]} onPress={() => setChecked(true)}><Text style={styles.primaryButtonText}>بررسی ترتیب</Text></Pressable>
        <Pressable accessibilityRole="button" style={styles.secondaryButton} onPress={() => { setSelected([]); setChecked(false); }}><Text style={styles.secondaryButtonText}>از نو</Text></Pressable>
      </View>
      {checked && <Text accessibilityLiveRegion="polite" style={[styles.feedback, correct ? styles.success : styles.tryAgain]}>
        {correct ? 'جمله درست ساخته شد.' : complete ? 'ترتیب را دوباره بررسی کنید؛ می‌توانید واژه‌ها را از بخش پاسخ بردارید.' : `هنوز ${fa(pieces.length - selected.length)} واژه باقی مانده است.`}
      </Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', backgroundColor: Palette.surface, borderRadius: 18, borderWidth: 1, borderColor: Palette.border, padding: 16, gap: 12, marginTop: 18 },
  kicker: { fontFamily: Typography.fontFamily, fontSize: 12, fontWeight: '700', color: Palette.primary, textAlign: 'right', writingDirection: 'rtl' },
  translation: { fontFamily: Typography.fontFamily, fontSize: 17, lineHeight: 28, color: Palette.ink, textAlign: 'right', writingDirection: 'rtl' },
  answerArea: { minHeight: 76, borderRadius: 13, borderWidth: 1, borderColor: Palette.primary, backgroundColor: Palette.primarySoft, padding: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 7, alignItems: 'center' },
  placeholder: { flex: 1, fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 21, color: Palette.muted, textAlign: 'right', writingDirection: 'rtl' },
  answerChip: { borderRadius: 9, backgroundColor: Palette.surface, borderWidth: 1, borderColor: Palette.primary, paddingHorizontal: 9, paddingVertical: 7 },
  answerText: { color: Palette.ink, fontSize: 14, writingDirection: 'ltr' },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8 },
  wordChip: { borderRadius: 10, backgroundColor: Palette.surfaceMuted, borderWidth: 1, borderColor: Palette.border, paddingHorizontal: 10, paddingVertical: 8 },
  wordText: { color: Palette.ink, fontSize: 14, writingDirection: 'ltr' },
  actions: { flexDirection: 'row-reverse', alignItems: 'center', gap: 9 },
  primaryButton: { flex: 1, minHeight: 44, backgroundColor: Palette.primary, borderRadius: 12, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: Typography.fontFamily, color: '#FFFFFF', fontSize: 14, fontWeight: '700', writingDirection: 'rtl' },
  secondaryButton: { minHeight: 44, backgroundColor: Palette.surfaceMuted, borderRadius: 12, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center' },
  secondaryButtonText: { fontFamily: Typography.fontFamily, color: Palette.ink, fontSize: 13, fontWeight: '600', writingDirection: 'rtl' },
  disabled: { opacity: .48 },
  feedback: { fontFamily: Typography.fontFamily, fontSize: 13, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  success: { color: Palette.success },
  tryAgain: { color: Palette.warning },
});
