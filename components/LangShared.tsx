// Shared building blocks for the English-learning mini-app ("app 2").
// The leading underscore means expo-router treats this as a plain module,
// not a route.

import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import {
  ChevronRight,
  Volume2,
  Sparkles,
  Users,
  Coffee,
  Plane,
  Clock,
  Palette,
  BookOpen,
  Briefcase,
  Heart,
  Cloud,
  Home,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react-native';
import { Colors, Typography, Spacing, Radius } from '@/lib/theme';

/** Map the icon names stored in the curriculum to real components. */
export const LESSON_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  users: Users,
  coffee: Coffee,
  plane: Plane,
  clock: Clock,
  palette: Palette,
  'book-open': BookOpen,
  briefcase: Briefcase,
  heart: Heart,
  cloud: Cloud,
  home: Home,
  'heart-handshake': HeartHandshake,
};

let speaking = false;

/** Read an English word/sentence aloud (safe on every platform). */
export async function speakEnglish(text: string): Promise<void> {
  try {
    if (speaking) {
      await Speech.stop();
      speaking = false;
    }
    speaking = true;
    Speech.speak(text, {
      language: 'en-US',
      rate: Platform.OS === 'ios' ? 0.45 : 0.85,
      onDone: () => {
        speaking = false;
      },
      onStopped: () => {
        speaking = false;
      },
      onError: () => {
        speaking = false;
      },
    });
  } catch {
    speaking = false;
  }
}

/** Nice top bar for the mini-app screens: page title + back arrow on the right (RTL). */
export function AgentTopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  return (
    <View style={topBarStyles.bar}>
      <View style={topBarStyles.texts}>
        <Text style={topBarStyles.title}>{title}</Text>
        {subtitle ? <Text style={topBarStyles.subtitle}>{subtitle}</Text> : null}
      </View>
      <Pressable style={topBarStyles.backBtn} onPress={() => (router.canGoBack() ? router.back() : router.replace('/lang'))}>
        <ChevronRight size={20} color={Colors.neutral[200]} strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

const topBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.neutral[850],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  texts: { flex: 1, alignItems: 'flex-end' },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.neutral[0],
    textAlign: 'right',
  },
  subtitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.sizes.xs,
    color: Colors.neutral[400],
    textAlign: 'right',
    marginTop: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.neutral[900],
    borderWidth: 1,
    borderColor: Colors.neutral[800],
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
});

/** Progress bar (thin), fills from the RIGHT side (RTL). */
export function ProgressBar({ value, color }: { value: number; color: string }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={barStyles.track}>
      <View style={[barStyles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const barStyles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.neutral[800],
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.full,
    alignSelf: 'flex-end',
  },
});

/** Big round pronunciation button. */
export function SpeakButton({ text, size = 44, color }: { text: string; size?: number; color: string }) {
  return (
    <Pressable
      style={[
        speakStyles.btn,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color + '20',
          borderColor: color + '60',
        },
      ]}
      onPress={() => speakEnglish(text)}
      accessibilityLabel="پخش تلفظ"
    >
      <Volume2 size={size * 0.45} color={color} strokeWidth={2} />
    </Pressable>
  );
}

const speakStyles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
});
