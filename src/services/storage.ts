import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types';

const SESSIONS_KEY = 'tempomusa_sessions';
const SETTINGS_KEY = 'tempomusa_settings';

export interface AppSettings {
  darkMode: boolean;
  keepAwake: boolean;
  voiceAlert: boolean;
  volume: number;
  audioPath: string | null;
  restH: number;
  restM: number;
  restS: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: true,
  keepAwake: true,
  voiceAlert: true,
  volume: 70,
  audioPath: null,
  restH: 0,
  restM: 0,
  restS: 10,
};

// Sessions
export async function loadSessions(): Promise<Session[]> {
  const json = await AsyncStorage.getItem(SESSIONS_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export async function addSession(session: Session): Promise<Session[]> {
  const sessions = await loadSessions();
  sessions.unshift(session);
  await saveSessions(sessions);
  return sessions;
}

export async function deleteSession(id: string): Promise<Session[]> {
  const sessions = await loadSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  await saveSessions(filtered);
  return filtered;
}

// Settings
export async function loadSettings(): Promise<AppSettings> {
  const json = await AsyncStorage.getItem(SETTINGS_KEY);
  return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
