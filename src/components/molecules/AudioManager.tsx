import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import { saveAudio, deleteFile } from '../../services/fileStorage';

interface AudioManagerProps {
  audioPath: string | null;
  volume: number;
  onAudioChange: (path: string | null) => void;
}

export default function AudioManager({ audioPath, volume, onAudioChange }: AudioManagerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
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
    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      setRecordingDuration((d) => d + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      if (uri) {
        // Delete old audio if exists
        if (audioPath) await deleteFile(audioPath);
        const localUri = await saveAudio(uri);
        onAudioChange(localUri);
        Alert.alert('Audio guardado', 'El mensaje de voz se guardó correctamente.');
      }
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['audio/mpeg', 'audio/wav', 'audio/x-m4a', 'audio/mp4'],
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets[0]) {
      if (audioPath) await deleteFile(audioPath);
      const localUri = await saveAudio(result.assets[0].uri);
      onAudioChange(localUri);
      Alert.alert('Audio guardado', `Se guardó "${result.assets[0].name}" correctamente.`);
    }
  };

  const handlePlay = async () => {
    if (!audioPath) return;
    if (isPlaying && soundRef.current) {
      await soundRef.current.stopAsync();
      setIsPlaying(false);
      return;
    }
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioPath },
      { volume: volume / 100, shouldPlay: true },
    );
    soundRef.current = sound;
    setIsPlaying(true);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  const handleRemove = () => {
    Alert.alert('Eliminar audio', '¿Segura que quieres eliminar el audio configurado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          if (audioPath) await deleteFile(audioPath);
          onAudioChange(null);
        },
      },
    ]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      {/* Recording state */}
      {isRecording && (
        <View style={styles.recordingBanner}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Grabando... {formatTime(recordingDuration)}</Text>
          <TouchableOpacity style={styles.stopBtn} onPress={handleRecord} activeOpacity={0.7}>
            <Ionicons name="stop" size={14} color="#fff" />
            <Text style={styles.stopBtnText}>Detener</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Audio configured state */}
      {!isRecording && audioPath && (
        <View style={styles.configuredCard}>
          <View style={styles.configuredHeader}>
            <Ionicons name="checkmark-circle" size={16} color="#0F6E56" />
            <Text style={styles.configuredText}>Audio configurado</Text>
          </View>
          <View style={styles.configuredActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handlePlay} activeOpacity={0.7}>
              <Ionicons name={isPlaying ? 'stop-circle-outline' : 'play-circle-outline'} size={18} color="#1a1a1a" />
              <Text style={styles.actionBtnText}>{isPlaying ? 'Detener' : 'Escuchar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleRecord} activeOpacity={0.7}>
              <Ionicons name="mic-outline" size={18} color="#1a1a1a" />
              <Text style={styles.actionBtnText}>Regrabar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleUpload} activeOpacity={0.7}>
              <Ionicons name="folder-outline" size={18} color="#1a1a1a" />
              <Text style={styles.actionBtnText}>Cambiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={handleRemove} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={18} color="#E24B4A" />
              <Text style={[styles.actionBtnText, styles.deleteText]}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* No audio state */}
      {!isRecording && !audioPath && (
        <View style={styles.audioCard}>
          <TouchableOpacity style={styles.optionRow} onPress={handleRecord} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Ionicons name="mic-outline" size={18} color="#888" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>Grabar mensaje de voz</Text>
              <Text style={styles.optionSub}>Toca para grabar desde el micrófono</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#888" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.optionRow} onPress={handleUpload} activeOpacity={0.7}>
            <View style={styles.optionIcon}>
              <Ionicons name="folder-outline" size={18} color="#888" />
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionLabel}>Subir archivo de audio</Text>
              <Text style={styles.optionSub}>MP3, WAV, M4A</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color="#888" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  // Recording state
  recordingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 0.5,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E24B4A',
  },
  recordingText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#991B1B',
  },
  stopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E24B4A',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  stopBtnText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  // Configured state
  configuredCard: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  configuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  configuredText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0F6E56',
  },
  configuredActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 3,
  },
  actionBtnText: {
    fontSize: 10,
    color: '#1a1a1a',
  },
  deleteText: {
    color: '#E24B4A',
  },
  // No audio state
  audioCard: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  optionIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#f5f4f0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  optionSub: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e8e8e8',
    marginLeft: 54,
  },
});
