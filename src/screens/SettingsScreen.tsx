import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toggle from '../components/atoms/Toggle';
import SectionLabel from '../components/atoms/SectionLabel';
import SettingRow from '../components/molecules/SettingRow';
import AudioOptionRow from '../components/molecules/AudioOptionRow';
import RestFieldControl from '../components/molecules/RestFieldControl';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [keepAwake, setKeepAwake] = useState(true);
  const [voiceAlert, setVoiceAlert] = useState(true);
  const [volume, setVolume] = useState(70);
  const [restH, setRestH] = useState(0);
  const [restM, setRestM] = useState(0);
  const [restS, setRestS] = useState(10);

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
            <Toggle value={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </SettingRow>

          <SettingRow label="Pantalla siempre activa" subtitle="Durante una sesión activa">
            <Toggle value={keepAwake} onToggle={() => setKeepAwake(!keepAwake)} />
          </SettingRow>

          {/* Aviso de voz */}
          <SectionLabel>Aviso de voz</SectionLabel>

          <SettingRow label="Activar aviso de voz" subtitle="Al cambiar de pose">
            <Toggle value={voiceAlert} onToggle={() => setVoiceAlert(!voiceAlert)} />
          </SettingRow>

          {voiceAlert && (
            <>
              <View style={styles.audioOptions}>
                <View style={styles.audioCard}>
                  <AudioOptionRow
                    icon="mic-outline"
                    label="Grabar mensaje de voz"
                    subtitle="Grabar ahora"
                    onPress={() => {}}
                  />
                  <View style={styles.audioDivider} />
                  <AudioOptionRow
                    icon="folder-outline"
                    label="Subir archivo de audio"
                    subtitle="MP3, WAV, M4A"
                    onPress={() => {}}
                  />
                </View>
              </View>

              {/* Volumen */}
              <View style={styles.volumeWrap}>
                <View style={styles.volumeHeader}>
                  <Text style={styles.volumeLabel}>Volumen del aviso</Text>
                  <Text style={styles.volumeValue}>{volume}%</Text>
                </View>
                <View style={styles.volumeTrack}>
                  <View style={[styles.volumeFill, { width: `${volume}%` }]} />
                </View>
              </View>
            </>
          )}

          {/* Sesión */}
          <SectionLabel>Sesión</SectionLabel>

          <View style={styles.restSection}>
            <Text style={styles.restTitle}>Descanso entre poses</Text>
            <Text style={styles.restSub}>0 = sin descanso</Text>
            <View style={styles.restFields}>
              <RestFieldControl value={restH} label="h" step={1} onChange={setRestH} />
              <RestFieldControl value={restM} label="min" step={1} max={59} onChange={setRestM} />
              <RestFieldControl value={restS} label="seg" step={5} max={55} onChange={setRestS} />
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
  volumeWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  volumeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  volumeLabel: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  volumeValue: {
    fontSize: 14,
    color: '#888',
  },
  volumeTrack: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  volumeFill: {
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
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
