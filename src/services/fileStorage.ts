import * as FileSystem from 'expo-file-system';

const IMAGES_DIR = `${FileSystem.documentDirectory}images/`;
const AUDIO_DIR = `${FileSystem.documentDirectory}audio/`;

async function ensureDir(dir: string) {
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function saveImage(sourceUri: string): Promise<string> {
  await ensureDir(IMAGES_DIR);
  const filename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const ext = sourceUri.split('.').pop()?.split('?')[0] || 'jpg';
  const destUri = `${IMAGES_DIR}${filename}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
}

export async function saveAudio(sourceUri: string): Promise<string> {
  await ensureDir(AUDIO_DIR);
  const filename = `audio_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const ext = sourceUri.split('.').pop()?.split('?')[0] || 'm4a';
  const destUri = `${AUDIO_DIR}${filename}.${ext}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destUri });
  return destUri;
}

export async function deleteFile(uri: string): Promise<void> {
  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri);
  }
}
