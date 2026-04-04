import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const isWeb = Platform.OS === 'web';
const IMAGES_DIR = isWeb ? '' : `${FileSystem.documentDirectory}images/`;
const AUDIO_DIR = isWeb ? '' : `${FileSystem.documentDirectory}audio/`;

async function ensureDir(dir: string) {
  if (isWeb) return;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function saveImage(sourceUri: string): Promise<string> {
  if (isWeb) return sourceUri;
  await ensureDir(IMAGES_DIR);
  const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const ext = sourceUri.split('.').pop()?.split('?')[0] || 'jpg';
  const destUri = `${IMAGES_DIR}${filename}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
}

export async function saveAudio(sourceUri: string): Promise<string> {
  if (isWeb) return sourceUri;
  await ensureDir(AUDIO_DIR);
  const filename = `audio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const ext = sourceUri.split('.').pop()?.split('?')[0] || 'm4a';
  const destUri = `${AUDIO_DIR}${filename}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
}

export async function deleteFile(uri: string): Promise<void> {
  if (isWeb) return;
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri);
  }
}
