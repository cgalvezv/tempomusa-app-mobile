import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useSettings from '../hooks/useSettings';
import Toggle from '../components/atoms/Toggle';
import SectionLabel from '../components/atoms/SectionLabel';
import SettingRow from '../components/molecules/SettingRow';
import AudioManager from '../components/molecules/AudioManager';
import RestFieldControl from '../components/molecules/RestFieldControl';
import VolumeSlider from '../components/molecules/VolumeSlider';

export default function SettingsScreen() {
  const { settings, loading, update } = useSettings();

  if (loading || !settings) return null;

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
              <AudioManager
                audioPath={settings.audioPath}
                volume={settings.volume}
                onAudioChange={(path) => update({ audioPath: path })}
              />

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
