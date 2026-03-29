import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionDetailProps } from '../types/navigation';
import StatBox from '../components/atoms/StatBox';
import SectionLabel from '../components/atoms/SectionLabel';
import PoseRow from '../components/molecules/PoseRow';
import { formatDuration } from '../utils/formatDuration';

export default function SessionDetailScreen({ navigation, route }: SessionDetailProps) {
  const { session } = route.params;
  const totalSeconds = session.poses.reduce((sum, p) => sum + p.durationSeconds, 0);

  const handleStart = () => {
    navigation.navigate('Player', { session });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.backBtn}>← Volver</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.editBtn}>Editar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{session.name}</Text>
            <Text style={styles.subtitle}>{session.poses.length} poses · creada por ti</Text>
          </View>

          {/* Stats */}
          <View style={styles.statRow}>
            <StatBox value={String(session.poses.length)} label="poses" />
            <StatBox value={formatDuration(totalSeconds)} label="duración" />
            <StatBox value={`${session.restSeconds} seg`} label="descanso" />
          </View>

          <SectionLabel>Lista de poses</SectionLabel>

          {session.poses.map((pose, index) => (
            <PoseRow key={pose.id} pose={pose} index={index} />
          ))}

          {/* Botón iniciar */}
          <View style={styles.startWrap}>
            <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.7}>
              <Text style={styles.startBtnText}>Iniciar sesión</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    fontSize: 13,
    color: '#888',
  },
  editBtn: {
    fontSize: 13,
    color: '#888',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
  },
  statRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  startWrap: {
    padding: 16,
  },
  startBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
