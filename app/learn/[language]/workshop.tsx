import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { GermanCoursePage, GermanCourseButton, germanCourseStyles as s } from '@/components/GermanCourseUI';
import { GermanPalette as Palette } from '@/components/germanTheme';
import {
  FORM_FIELDS,
  ORAL_CRITERIA,
  ORAL_TASKS,
  WRITING_TASKS,
  clearWorkshop,
  emptyWorkshop,
  formFeedback,
  loadWorkshop,
  saveWorkshop,
  type WorkshopDraft,
} from '@/lib/languages/a1Workshop';

export default function GermanWorkshopRoute() {
  const { language } = useLocalSearchParams<{ language: string }>();
  const [draft, setDraft] = useState<WorkshopDraft>(emptyWorkshop);
  const [loading, setLoading] = useState(language === 'de');
  const [loadError, setLoadError] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [formResult, setFormResult] = useState<string[] | null>(null);
  const [revealedSamples, setRevealedSamples] = useState<Record<string, boolean>>({});
  const [eraseConfirm, setEraseConfirm] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (language !== 'de') return;
    let active = true;
    void loadWorkshop().then(value => {
      if (!active) return;
      setDraft(value);
      setLoading(false);
      setLoadError('');
    }).catch(() => {
      if (!active) return;
      setLoadError('پیش‌نویس کارگاه خوانده نشد یا معتبر نیست. برای جلوگیری از پاک‌شدن ناخواسته، تمرین تازه باز نمی‌شود. می‌توانید دوباره تلاش کنید یا فقط دادهٔ کارگاه را پاک کنید.');
      setLoading(false);
    });
    return () => { active = false; };
  }, [language]);

  if (language !== 'de') {
    return <GermanCoursePage title="کارگاه پیدا نشد">{null}</GermanCoursePage>;
  }

  const updateDraft = (update: (current: WorkshopDraft) => WorkshopDraft) => {
    setDraft(current => ({ ...update(current), updatedAt: new Date().toISOString() }));
    setSaveState('dirty');
    setNotice('');
  };

  const updateForm = (id: string, value: string) => {
    updateDraft(current => ({ ...current, form: { ...current.form, [id]: value } }));
    setFormResult(null);
  };

  const updateMessage = (id: string, value: string) => {
    const task = WRITING_TASKS.find(item => item.id === id);
    updateDraft(current => {
      const checks = { ...current.checks };
      task?.rubric.forEach((_, index) => { delete checks[`${id}-${index}`]; });
      return { ...current, messages: { ...current.messages, [id]: value }, checks };
    });
    setRevealedSamples(current => ({ ...current, [id]: false }));
  };

  const toggleCheck = (id: string) => updateDraft(current => ({
    ...current,
    checks: { ...current.checks, [id]: !current.checks[id] },
  }));

  const save = async () => {
    if (loading || !!loadError || saveState === 'saving') return;
    setSaveState('saving');
    setNotice('');
    try {
      await saveWorkshop(draft);
      setSaveState('saved');
      setNotice('پیش‌نویس کارگاه روی همین دستگاه ذخیره شد.');
    } catch {
      setSaveState('error');
      setNotice('ذخیره نشد؛ صفحه را نبندید و دوباره تلاش کنید.');
    }
  };

  const retryLoad = async () => {
    setLoadError('');
    setLoading(true);
    try {
      setDraft(await loadWorkshop());
      setSaveState('idle');
    } catch {
      setLoadError('پیش‌نویس کارگاه همچنان خوانده نمی‌شود. دادهٔ فعلی دست‌نخورده می‌ماند تا خودتان تصمیم بگیرید.');
    } finally {
      setLoading(false);
    }
  };

  const erase = async () => {
    try {
      await clearWorkshop();
      setDraft(emptyWorkshop());
      setLoadError('');
      setFormResult(null);
      setSaveState('idle');
      setEraseConfirm(false);
      setNotice('فقط پیش‌نویس و خودارزیابی کارگاه پاک شد.');
    } catch {
      setNotice('دادهٔ کارگاه پاک نشد؛ فضای ذخیره‌سازی دستگاه را بررسی کنید.');
    }
  };

  return (
    <GermanCoursePage
      title="کارگاه مکالمه و نوشتن"
      subtitle="تمرین مستقل آلمانی · بدون نمره‌گذاری خودکار"
      back="/learn/de"
    >
      {loading ? <Text style={s.small}>در حال بازیابی پیش‌نویس کارگاه…</Text> : null}

      {!!loadError ? (
        <View style={s.card}>
          <Text accessibilityRole="alert" style={s.error}>{loadError}</Text>
          <GermanCourseButton title="تلاش دوباره برای بازیابی" secondary onPress={() => void retryLoad()} />
        </View>
      ) : null}

      {!loading && !loadError ? (
        <>
          <View style={s.card}>
            <Text style={s.heading}>این کارگاه چه می‌کند؟</Text>
            <Text style={s.description}>در این صفحه یک فرم ساده، دو پیام کوتاه و سه تمرین گفتاری را انجام می‌دهید. متن‌ها و خودارزیابی روی همین دستگاه ذخیره می‌شوند؛ پاسخ آزاد یا گفتار شما نمره‌گذاری خودکار نمی‌شود.</Text>
            <Text style={s.notice}>از اطلاعات خیالی استفاده کنید. فرم صرفاً چند فیلد و قالب را بررسی می‌کند؛ اطلاعات واقعی یا صحت زبانی را تأیید نمی‌کند.</Text>
          </View>

          <View style={s.card}>
            <Text style={s.heading}>فرم اطلاعات</Text>
            <Text style={s.small}>اطلاعات خیالی وارد کنید. بررسی، نمره یا تأیید رسمی نیست.</Text>
            {FORM_FIELDS.map(([id, label, fa]) => (
              <View key={id} style={styles.field}>
                <Text style={styles.fieldLabel}>{label} · {fa}</Text>
                <TextInput
                  accessibilityLabel={label}
                  value={draft.form[id] ?? ''}
                  onChangeText={value => updateForm(id, value)}
                  maxLength={100}
                  autoCapitalize={id === 'email' ? 'none' : 'sentences'}
                  keyboardType={id === 'email' ? 'email-address' : id === 'phone' ? 'phone-pad' : 'default'}
                  style={styles.formInput}
                  placeholder={id === 'postcode' ? '10115' : id === 'birth' ? '14.03.2000' : ''}
                />
              </View>
            ))}
            <GermanCourseButton title="بررسی اولیه فرم، بدون نمره" secondary onPress={() => setFormResult(formFeedback(draft.form))} />
            {formResult !== null ? formResult.length ? (
              <View style={styles.feedbackBox}>
                {formResult.map(message => <Text key={message} style={s.error}>{message}</Text>)}
              </View>
            ) : (
              <Text style={s.notice}>قالب فیلدهای اصلی کامل به نظر می‌رسد؛ این بررسی صحت نشانی، تاریخ تقویمی یا زبان را تأیید نمی‌کند.</Text>
            ) : null}
          </View>

          {WRITING_TASKS.map(task => (
            <View key={task.id} style={s.card}>
              <Text style={s.heading}>{task.title}</Text>
              <Text style={s.description}>{task.prompt}</Text>
              <TextInput
                accessibilityLabel={task.title}
                value={draft.messages[task.id] ?? ''}
                onChangeText={value => updateMessage(task.id, value)}
                multiline
                maxLength={2000}
                textAlignVertical="top"
                autoCapitalize="sentences"
                style={styles.messageInput}
                placeholder="پیام آلمانی خود را اینجا بنویسید…"
              />
              {draft.messages[task.id]?.trim() ? (
                <GermanCourseButton
                  title={revealedSamples[task.id] ? 'پنهان‌کردن نمونهٔ پاسخ' : 'نمایش نمونهٔ پاسخ'}
                  secondary
                  onPress={() => setRevealedSamples(current => ({ ...current, [task.id]: !current[task.id] }))}
                />
              ) : <Text style={s.small}>اول پیام خودتان را بنویسید؛ بعد می‌توانید نمونه را برای مقایسه ببینید.</Text>}
              {revealedSamples[task.id] ? (
                <View style={styles.sampleBox}>
                  <Text style={styles.fieldLabel}>نمونه برای مقایسه، نه تنها پاسخ ممکن</Text>
                  <Text selectable style={styles.sampleText}>{task.sample}</Text>
                </View>
              ) : null}
              <Text style={s.small}>پس از نوشتن، با معیارهای زیر خودتان متن را بازبینی کنید. این چک‌لیست نمرهٔ زبان نیست.</Text>
              {task.rubric.map((criterion, index) => {
                const id = `${task.id}-${index}`;
                return <ChecklistRow key={id} label={criterion} checked={!!draft.checks[id]} onPress={() => toggleCheck(id)} />;
              })}
            </View>
          ))}

          {ORAL_TASKS.map(task => (
            <View key={task.id} style={s.card}>
              <Text style={s.heading}>تمرین گفتاری · {task.title}</Text>
              <Text style={s.description}>{task.prompt}</Text>
              <Text style={s.notice}>بدون خواندن نمونه، با صدای بلند تمرین کنید. ضبط یا ارسال صدا انجام نمی‌شود و این تمرین خودارزیابی است.</Text>
              {ORAL_CRITERIA.map((criterion, index) => {
                const id = `${task.id}-${index}`;
                return <ChecklistRow key={id} label={criterion} checked={!!draft.checks[id]} onPress={() => toggleCheck(id)} />;
              })}
            </View>
          ))}

          <View style={s.card}>
            <Text style={s.heading}>یادداشت شخصی</Text>
            <TextInput
              accessibilityLabel="یادداشت شخصی"
              value={draft.notes}
              onChangeText={value => updateDraft(current => ({ ...current, notes: value.slice(0, 2000) }))}
              multiline
              maxLength={2000}
              textAlignVertical="top"
              style={styles.messageInput}
              placeholder="چه چیزی را می‌خواهم دوباره تمرین کنم؟"
            />
          </View>

          {!!notice ? <Text accessibilityRole={saveState === 'error' ? 'alert' : undefined} style={saveState === 'error' ? s.error : saveState === 'saved' || saveState === 'idle' ? s.notice : s.small}>{notice}</Text> : null}
          {saveState === 'dirty' ? <Text style={s.small}>تغییرهای تازه ذخیره نشده‌اند.</Text> : null}
          <GermanCourseButton title={saveState === 'saving' ? 'در حال ذخیره…' : 'ذخیره پیش‌نویس کارگاه'} disabled={saveState === 'saving'} onPress={() => void save()} />

          <View style={s.card}>
            <Text style={s.heading}>پاک‌کردن اطلاعات این صفحه</Text>
            <Text style={s.small}>این کار فقط پیش‌نویس کارگاه را پاک می‌کند؛ تاریخچهٔ درس‌ها و نتیجه‌های سنجش دست‌نخورده می‌مانند.</Text>
            {!eraseConfirm ? (
              <GermanCourseButton title="پاک‌کردن فقط داده کارگاه" secondary onPress={() => { setEraseConfirm(true); setNotice(''); }} />
            ) : (
              <View style={styles.confirmRow}>
                <GermanCourseButton title="انصراف" secondary onPress={() => setEraseConfirm(false)} />
                <GermanCourseButton title="بله، پاک شود" onPress={() => void erase()} />
              </View>
            )}
          </View>
        </>
      ) : null}

      {!loading && loadError ? (
        <View style={s.card}>
          {!eraseConfirm ? (
            <GermanCourseButton title="پاک‌کردن فقط داده کارگاه" secondary onPress={() => setEraseConfirm(true)} />
          ) : (
            <View style={styles.confirmRow}>
              <GermanCourseButton title="انصراف" secondary onPress={() => setEraseConfirm(false)} />
              <GermanCourseButton title="بله، پاک شود" onPress={() => void erase()} />
            </View>
          )}
        </View>
      ) : null}
    </GermanCoursePage>
  );
}

function ChecklistRow({ label, checked, onPress }: { label: string; checked: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => [styles.checkRow, pressed && styles.pressed]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <Text style={styles.checkMark}>✓</Text> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: { width: '100%', gap: 6 },
  fieldLabel: { color: Palette.ink, fontSize: 12, lineHeight: 20, fontWeight: '700', textAlign: 'right', writingDirection: 'rtl' },
  formInput: { minHeight: 48, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 10, color: Palette.ink, fontSize: 15, textAlign: 'left', writingDirection: 'ltr' },
  messageInput: { minHeight: 126, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted, borderRadius: 13, paddingHorizontal: 12, paddingVertical: 12, color: Palette.ink, fontSize: 15, lineHeight: 24, textAlign: 'left', writingDirection: 'ltr' },
  sampleBox: { padding: 13, gap: 7, borderRadius: 13, backgroundColor: Palette.primarySoft, borderWidth: 1, borderColor: Palette.border },
  sampleText: { color: Palette.primaryDark, fontSize: 14, lineHeight: 22, textAlign: 'left', writingDirection: 'ltr' },
  feedbackBox: { gap: 8 },
  checkRow: { width: '100%', minHeight: 46, flexDirection: 'row-reverse', alignItems: 'center', gap: 11, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: Palette.border, backgroundColor: Palette.surfaceMuted },
  pressed: { opacity: .82 },
  checkbox: { width: 21, height: 21, borderRadius: 6, borderWidth: 1.5, borderColor: Palette.muted, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  checkMark: { color: '#FFFFFF', fontSize: 14, lineHeight: 17, fontWeight: '800' },
  checkLabel: { flex: 1, color: Palette.ink, fontSize: 12, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' },
  confirmRow: { flexDirection: 'row-reverse', gap: 10 },
});
