import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Bot, ChevronLeft, MessageCircle, Mic2, Plus, QrCode, ShieldCheck, Sparkles, UserRound } from 'lucide-react-native';
import { AppBottomNav } from '@/components/AppBottomNav';
import { listRealContacts, type RealContact } from '@/lib/conversations';
import { Colors, Radius, Spacing, Typography } from '@/lib/theme';

export default function ConversationsHome() {
  const router = useRouter();
  const [contacts, setContacts] = useState<RealContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactsError, setContactsError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoadingContacts(true);
      listRealContacts()
        .then((rows) => {
          if (!active) return;
          setContacts(rows);
          setContactsError(null);
        })
        .catch((cause) => {
          if (active) setContactsError(cause instanceof Error ? cause.message : 'دریافت مخاطبان انجام نشد.');
        })
        .finally(() => {
          if (active) setLoadingContacts(false);
        });
      return () => { active = false; };
    }, []),
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>مکالمه</Text>
        <Text style={styles.subtitle}>تمرین واقعی، بدون ترس از اشتباه</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>مربی همیشگی شما</Text>
        <Pressable style={styles.emmaCard} onPress={() => router.push('/conversations/emma' as never)}>
          <View style={styles.avatarWrap}>
            <View style={styles.emmaAvatar}><Text style={styles.avatarEmoji}>👩🏻‍🏫</Text></View>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.contactText}>
            <View style={styles.nameRow}>
              <Text style={styles.contactName}>Emma</Text>
              <View style={styles.aiBadge}><Bot size={12} color={Colors.accent[300]} /><Text style={styles.aiBadgeText}>مربی هوش مصنوعی</Text></View>
            </View>
            <Text style={styles.contactDesc}>همیشه آماده برای تمرین جمله‌های درس شما</Text>
            <View style={styles.capabilities}>
              <Text style={styles.capability}>اصلاح خصوصی</Text>
              <Text style={styles.capability}>پیشنهاد پاسخ</Text>
              <Text style={styles.capability}>مکالمه صوتی</Text>
            </View>
          </View>
          <ChevronLeft size={21} color={Colors.neutral[500]} />
        </Pressable>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionLabel}>مخاطبان واقعی</Text>
          <Text style={styles.sectionHint}>دعوت و تأیید دوطرفه</Text>
        </View>

        {loadingContacts ? (
          <View style={styles.loadingContacts}><ActivityIndicator color={Colors.primary[400]} /><Text style={styles.loadingText}>در حال دریافت مخاطبان…</Text></View>
        ) : contacts.length ? (
          <View style={styles.contactsList}>
            {contacts.map((contact) => (
              <Pressable
                key={contact.id}
                style={styles.contactCard}
                onPress={() => router.push({ pathname: '/conversations/human/[conversationId]', params: { conversationId: contact.conversationId, name: contact.displayName } } as never)}
              >
                <View style={styles.realAvatar}><Text style={styles.realAvatarText}>{contact.avatarEmoji}</Text></View>
                <View style={styles.realContactText}>
                  <Text style={styles.realContactName}>{contact.displayName}</Text>
                  <Text style={styles.realContactStatus}>مخاطب واقعی · {contact.englishLevel}</Text>
                </View>
                <ChevronLeft size={20} color={Colors.neutral[500]} />
              </Pressable>
            ))}
            <Pressable style={styles.addAnother} onPress={() => router.push('/conversations/invite' as never)}><Plus size={17} color={Colors.primary[300]} /><Text style={styles.addAnotherText}>افزودن مخاطب دیگر</Text></Pressable>
          </View>
        ) : (
          <View style={styles.emptyContacts}>
            <View style={styles.peopleIcon}><UserRound size={30} color={Colors.primary[400]} /></View>
            <Text style={styles.emptyTitle}>هنوز مخاطبی اضافه نکرده‌اید</Text>
            <Text style={styles.emptyDesc}>{contactsError || 'دوست مسلط به انگلیسی خود را با کد دعوت اضافه کنید و در محیطی خصوصی تمرین کنید.'}</Text>
            <Pressable style={styles.inviteButton} onPress={() => router.push('/conversations/invite' as never)}>
              <Plus size={19} color={Colors.onColor} />
              <Text style={styles.inviteText}>افزودن مخاطب واقعی</Text>
            </Pressable>
            <View style={styles.inviteMethods}>
              <View style={styles.method}><QrCode size={15} color={Colors.neutral[500]} /><Text style={styles.methodText}>کد دعوت</Text></View>
              <View style={styles.method}><ShieldCheck size={15} color={Colors.neutral[500]} /><Text style={styles.methodText}>ارتباط خصوصی</Text></View>
            </View>
          </View>
        )}

        <View style={styles.assistCard}>
          <Sparkles size={21} color={Colors.warning[400]} />
          <View style={styles.assistText}>
            <Text style={styles.assistTitle}>کمک هوشمند کنار گفتگوی واقعی</Text>
            <Text style={styles.assistDesc}>قبل از ارسال، ترجمه، اصلاح جمله و پیشنهاد پاسخ فقط برای شما نمایش داده می‌شود.</Text>
          </View>
        </View>

        <View style={styles.modeRow}>
          <View style={styles.modeCard}><MessageCircle size={20} color={Colors.success[400]} /><Text style={styles.modeTitle}>پیام متنی</Text><Text style={styles.modeDesc}>با اصلاح اختیاری</Text></View>
          <View style={styles.modeCard}><Mic2 size={20} color={Colors.error[300]} /><Text style={styles.modeTitle}>پیام صوتی</Text><Text style={styles.modeDesc}>تمرین تلفظ طبیعی</Text></View>
        </View>
      </ScrollView>
      <AppBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.neutral[950] },
  header: { paddingTop: 56, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.lg, backgroundColor: Colors.neutral[900], borderBottomWidth: 1, borderBottomColor: Colors.neutral[800] },
  title: { fontFamily: Typography.fontFamily, fontSize: 26, fontWeight: Typography.weights.bold, color: Colors.neutral[0], textAlign: 'right' },
  subtitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[400], textAlign: 'right', marginTop: 3 },
  content: { padding: Spacing.md, paddingBottom: 28, gap: Spacing.md },
  sectionLabel: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[200], textAlign: 'right' },
  sectionRow: { marginTop: Spacing.sm, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  sectionHint: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[600] },
  emmaCard: { borderRadius: Radius.xl, padding: Spacing.md, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.accent[500] + '50', flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  emmaAvatar: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.accent[500] + '20' },
  avatarEmoji: { fontSize: 34 },
  onlineDot: { position: 'absolute', left: 1, bottom: 3, width: 13, height: 13, borderRadius: 7, backgroundColor: Colors.success[500], borderWidth: 2, borderColor: Colors.neutral[850] },
  contactText: { flex: 1 },
  nameRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 7 },
  contactName: { fontSize: 19, fontWeight: '700', color: Colors.neutral[50] },
  aiBadge: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4, borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: Colors.accent[500] + '15' },
  aiBadgeText: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.accent[300] },
  contactDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[400], textAlign: 'right', lineHeight: 18, marginTop: 3 },
  capabilities: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 5, marginTop: 8 },
  capability: { fontFamily: Typography.fontFamily, fontSize: 9, color: Colors.neutral[400], backgroundColor: Colors.neutral[700], borderRadius: Radius.full, paddingHorizontal: 7, paddingVertical: 3 },
  loadingContacts: { minHeight: 110, borderRadius: Radius.xl, backgroundColor: Colors.neutral[900], alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  loadingText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500] },
  contactsList: { gap: Spacing.sm },
  contactCard: { minHeight: 72, borderRadius: Radius.lg, backgroundColor: Colors.neutral[850], borderWidth: 1, borderColor: Colors.neutral[800], padding: Spacing.md, flexDirection: 'row-reverse', alignItems: 'center', gap: Spacing.md },
  realAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.primary[500] + '15', alignItems: 'center', justifyContent: 'center' },
  realAvatarText: { fontSize: 25 },
  realContactText: { flex: 1 },
  realContactName: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.md, fontWeight: Typography.weights.bold, color: Colors.neutral[100], textAlign: 'right' },
  realContactStatus: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.success[400], textAlign: 'right', marginTop: 3 },
  addAnother: { minHeight: 44, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.primary[500] + '35', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 6 },
  addAnotherText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.primary[300] },
  emptyContacts: { borderRadius: Radius.xl, padding: Spacing.xl, backgroundColor: Colors.neutral[900], borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.neutral[700], alignItems: 'center' },
  peopleIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: Colors.primary[500] + '14', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  emptyTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.lg, fontWeight: Typography.weights.bold, color: Colors.neutral[200], textAlign: 'center' },
  emptyDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, color: Colors.neutral[500], textAlign: 'center', lineHeight: 22, marginTop: 6 },
  inviteButton: { minHeight: 46, marginTop: Spacing.lg, paddingHorizontal: Spacing.xl, borderRadius: Radius.lg, backgroundColor: Colors.primary[500], flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center', gap: 7 },
  inviteText: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.onColor },
  inviteMethods: { flexDirection: 'row-reverse', gap: Spacing.md, marginTop: Spacing.md },
  method: { flexDirection: 'row-reverse', gap: 5, alignItems: 'center' },
  methodText: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.neutral[600] },
  assistCard: { borderRadius: Radius.lg, padding: Spacing.md, backgroundColor: Colors.warning[500] + '0B', borderWidth: 1, borderColor: Colors.warning[500] + '20', flexDirection: 'row-reverse', alignItems: 'flex-start', gap: Spacing.sm },
  assistText: { flex: 1 },
  assistTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.warning[300], textAlign: 'right' },
  assistDesc: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.xs, color: Colors.neutral[500], textAlign: 'right', lineHeight: 19, marginTop: 3 },
  modeRow: { flexDirection: 'row-reverse', gap: Spacing.sm },
  modeCard: { flex: 1, borderRadius: Radius.lg, backgroundColor: Colors.neutral[850], padding: Spacing.md, borderWidth: 1, borderColor: Colors.neutral[800], alignItems: 'center', gap: 5 },
  modeTitle: { fontFamily: Typography.fontFamily, fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.neutral[200] },
  modeDesc: { fontFamily: Typography.fontFamily, fontSize: 10, color: Colors.neutral[600] },
});
