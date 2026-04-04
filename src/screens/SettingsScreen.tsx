import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import useSettings from '../hooks/useSettings';
import { saveAudio, deleteFile } from '../services/fileStorage';
import Toggle from '../components/atoms/Toggle';
import SectionLabel from '../components/atoms/SectionLabel';
import SettingRow from '../components/molecules/SettingRow';
import AudioOptionRow from '../components/molecules/AudioOptionRow';
import RestFieldControl from '../components/molecules/RestFieldControl';
import VolumeSlider from '../components/molecules/VolumeSlider';

export default function SettingsScreen() {
  const { settings, loading, update } = useSettings();
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  if (loading || !settings) return null;

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null;
        if (uri) {
          const localUri = await saveAudio(uri);
          update({ audioPath: localUri });
        }
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
    } else {
      // Start recording
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permiso requerido', 'Necesitamos acceso al micrófono para grabar.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setIsRecording(true);
    }
  };

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      const localUri = await saveAudio(result.assets[0].uri);
      update({ audioPath: localUri });
    }
  };

  const handlePreview = async () => {
    if (!settings.audioPath) return;
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: settings.audioPath },
      { volume: settings.volume / 100 },
    );
    soundRef.current = sound;
    await sound.playAsync();
  };

  const handleRemoveAudio = async () => {
    if (!settings.audioPath) return;
    Alert.alert('Eliminar audio', '¿Segura que quieres eliminar el audio configurado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteFile(settings.audioPath!);
          update({ audioPath: null });
        },
      },
    ]);
  };

  const audioSubtitle = settings.audioPath
    ? 'Audio configurado · toca para previsualizar'
    : 'Grabar ahora';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Ajustes</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Apariencia */}
          <SectionLabel>Apariencia</SectionLabel>

          <SettingRow label="Modo oscuro" subtitle="Recomendado para estudios">
            <Toggle value={settings.darkMode} onToggle={() => update({ darkMode: !settings.darkMode })} />
          </SettingRow>

          <SettingRow label="Pantalla siempre activa" subtitle="Durante una sesión activa">
            <Toggle value={settings.keepAwake} onToggle={() => update({ keepAwake: !settings.keepAwake })} />
          </SettingRow>

          {/* Aviso de voz */}
          <SectionLabel>Aviso de voz</SectionLabel>

          <SettingRow label="Activar aviso de voz" subtitle="Al cambiar de pose">
            <Toggle value={settings.voiceAlert} onToggle={() => update({ voiceAlert: !settings.voiceAlert })} />
          </SettingRow>

          {settings.voiceAlert && (
            <>
              <View style={styles.audioOptions}>
                <View style={styles.audioCard}>
                  <AudioOptionRow
                    icon="mic-outline"
                    label={isRecording ? 'Grabando... toca para detener' : 'Grabar mensaje de voz'}
                    subtitle={audioSubtitle}
                    onPress={settings.audioPath ? handlePreview : handleRecord}
                  />
                  <View style={styles.audioDivider} />
                  <AudioOptionRow
                    icon="folder-outline"
                    label="Subir archivo de audio"
                    subtitle="MP3, WAV, M4A"
                    onPress={handleUpload}
                  />
                </View>
              </View>

              {settings.audioPath && (
                <View style={styles.audioActions}>
                  <Text style={styles.audioConfigured}>✓ Audio configurado</Text>
                  <View style={styles.audioActionsRow}>
                    <Text style={styles.audioActionBtn} onPress={handlePreview}>Previsualizar</Text>
                    <Text style={styles.audioActionDot}> · </Text>
                    <Text style={styles.audioActionBtn} onPress={handleRecord}>Regrabar</Text>
                    <Text style={styles.audioActionDot}> · </Text>
                    <Text style={[styles.audioActionBtn, styles.audioActionDelete]} onPress={handleRemoveAudio}>Eliminar</Text>
                  </View>
                </View>
              )}

              {/* Volumen */}
              <VolumeSlider value={settings.volume} onChange={(v) => update({ volume: v })} />
            </>
          )}

          {/* Sesión */}
          <SectionLabel>Sesión</SectionLabel>

          <View style={styles.restSection}>
            <Text style={styles.restTitle}>Descanso entre poses</Text>
            <Text style={styles.restSub}>0 = sin descanso</Text>
            <View style={styles.restFields}>
              <RestFieldControl value={settings.restH} label="h" step={1} onChange={(v) => update({ restH: v })} />
              <RestFieldControl value={settings.restM} label="min" step={1} max={59} onChange={(v) => update({ restM: v })} />
              <RestFieldControl value={settings.restS} label="seg" step={5} max={55} onChange={(v) => update({ restS: v })} />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  audioOptions: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  audioCard: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  audioDivider: {
    height: 0.5,
    backgroundColor: '#e8e8e8',
    marginLeft: 54,
  },
  audioActions: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  audioConfigured: {
    fontSize: 11,
    color: '#0F6E56',
    marginBottom: 4,
  },
  audioActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioActionBtn: {
    fontSize: 11,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  audioActionDot: {
    fontSize: 11,
    color: '#aaa',
  },
  audioActionDelete: {
    color: '#E24B4A',
  },
  restSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  restTitle: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  restSub: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
    marginBottom: 12,
  },
  restFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
});
