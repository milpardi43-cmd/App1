import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const KEY = 'emma_conversation_history_v1';

export interface EmmaStoredMessage {
  id: string;
  from: 'emma' | 'learner';
  text: string;
  translation?: string;
}

async function read(): Promise<string | null> {
  if (Platform.OS === 'web') return typeof window === 'undefined' ? null : window.localStorage.getItem(KEY);
  return AsyncStorage.getItem(KEY);
}

async function write(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.localStorage.setItem(KEY, value);
    return;
  }
  await AsyncStorage.setItem(KEY, value);
}

export async function loadEmmaHistory(fallback: EmmaStoredMessage[]): Promise<EmmaStoredMessage[]> {
  try {
    const raw = await read();
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed.slice(-30) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveEmmaHistory(messages: EmmaStoredMessage[]): Promise<void> {
  await write(JSON.stringify(messages.slice(-30)));
}
