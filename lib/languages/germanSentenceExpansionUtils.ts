// Approximate Persian reading aid; it is not IPA and should not replace audio or teacher review.
export function approximateGermanPronunciationFa(text: string): string {
  const numberNames: Record<string, string> = {
    '0': 'null', '1': 'eins', '2': 'zwei', '3': 'drei', '4': 'vier', '5': 'fünf',
    '6': 'sechs', '7': 'sieben', '8': 'acht', '9': 'neun', '10': 'zehn', '11': 'elf',
    '12': 'zwölf', '13': 'dreizehn', '14': 'vierzehn', '15': 'fünfzehn', '16': 'sechzehn',
    '17': 'siebzehn', '18': 'achtzehn', '19': 'neunzehn', '20': 'zwanzig',
    '21': 'einundzwanzig', '22': 'zweiundzwanzig', '23': 'dreiundzwanzig', '24': 'vierundzwanzig',
    '25': 'fünfundzwanzig', '30': 'dreißig', '40': 'vierzig', '50': 'fünfzig',
    '60': 'sechzig', '70': 'siebzig', '80': 'achtzig', '90': 'neunzig', '100': 'hundert',
  };
  const numberReadable = text.replace(/\d+/g, digits => digits.length > 4
    ? digits.split('').map(digit => numberNames[digit]).join(' ')
    : numberNames[digits] ?? digits);
  return numberReadable
    .replace(/tsch/gi, 'چ').replace(/sch/gi, 'ش')
    .replace(/([ieäöü])ch/gi, '$1ش').replace(/ch(?=[ieyäöü])/gi, 'ش').replace(/ch/gi, 'خ')
    .replace(/qu/gi, 'کو').replace(/äu|eu/gi, 'اوی')
    .replace(/ei/gi, 'آی').replace(/ie/gi, 'ی').replace(/au/gi, 'آو')
    .replace(/(^|\s)sp/gi, '$1شپ').replace(/(^|\s)st/gi, '$1شت')
    .replace(/ß|ss/gi, 'س').replace(/ä/gi, 'اِ').replace(/ö/gi, 'اُ').replace(/ü/gi, 'او')
    .replace(/ph/gi, 'ف').replace(/v/gi, 'ف').replace(/w/gi, 'و').replace(/j/gi, 'ی').replace(/z/gi, 'تس')
    .replace(/(^|\s)s(?=[aeiouäöü])/gi, '$1ز')
    .replace(/c/gi, 'ک').replace(/x/gi, 'کس').replace(/q/gi, 'ک')
    .replace(/a/gi, 'ا').replace(/e/gi, 'ِ').replace(/i/gi, 'ی').replace(/o/gi, 'اُ').replace(/u/gi, 'او').replace(/y/gi, 'ی')
    .replace(/b/gi, 'ب').replace(/d/gi, 'د').replace(/f/gi, 'ف').replace(/g/gi, 'گ').replace(/h/gi, 'ه')
    .replace(/k/gi, 'ک').replace(/l/gi, 'ل').replace(/m/gi, 'م').replace(/n/gi, 'ن').replace(/p/gi, 'پ')
    .replace(/r/gi, 'ر').replace(/s/gi, 'س').replace(/t/gi, 'ت');
}

export type GermanExpansionRow = readonly [
  word: string,
  meaning: string,
  text1: string, fa1: string,
  text2: string, fa2: string,
  text3: string, fa3: string,
];

export function buildGermanExpansionRows(lessonId: string, rows: readonly GermanExpansionRow[]) {
  if (rows.length !== 15) throw new Error(`${lessonId} must define exactly fifteen three-example learning sets.`);
  return rows.flatMap((row, rowIndex) => {
    const [word, meaning, text1, fa1, text2, fa2, text3, fa3] = row;
    const examples = [[text1, fa1], [text2, fa2], [text3, fa3]] as const;
    return examples.map(([text, fa], exampleIndex) => ({
      id: `${lessonId}-extra-${String(rowIndex * 3 + exampleIndex + 1).padStart(2, '0')}`,
      text,
      fa,
      pronunciation: approximateGermanPronunciationFa(text),
      vocabulary: [{ word, meaning }],
    }));
  });
}
