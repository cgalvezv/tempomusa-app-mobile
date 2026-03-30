import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SummaryProps } from '../types/navigation';
import StatBox from '../components/atoms/StatBox';
import SummaryPoseRow from '../components/molecules/SummaryPoseRow';
import { formatDuration } from '../utils/formatDuration';

export default function SummaryScreen({ navigation, route }: SummaryProps) {
  const { session } = route.params;
  const totalSeconds = session.poses.reduce((sum, p) => sum + p.durationSeconds, 0);
  const posesCount = session.poses.length;

  const handleRepeat = () => {
    navigation.replace('Player', { session });
  };

  const handleGoHome = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Success icon */}
        <View style={styles.iconWrap}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Sesión completada</Text>
        <Text style={styles.sessionName}>{session.name}</Text>

        {/* Stats */}
        <View style={styles.statRow}>
          <StatBox value={String(posesCount)} label="poses" />
          <StatBox value={formatDuration(totalSeconds)} label="tiempo total" />
          <StatBox value={`${posesCount}/${posesCount}`} label="completadas" />
        </View>

        {/* Pose list */}
        <Text style={styles.sectionLabel}>Poses realizadas</Text>
        <View style={styles.poseList}>
          {session.poses.map((pose, i) => (
            <SummaryPoseRow key={pose.id} pose={pose} isLast={i === posesCount - 1} />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.repeatBtn} onPress={handleRepeat} activeOpacity={0.7}>
            <Text style={styles.repeatBtnText}>Repetir sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={handleGoHome} activeOpacity={0.7}>
            <Text style={styles.homeBtnText}>Volver al inicio</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingBottom: 24,
  },
  iconWrap: {
    width: 48,
    height: 48,
    backgroundColor: '#D1FAE5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  checkIcon: {
    fontSize: 22,
    color: '#065F46',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  sessionName: {
    fontSize: 11,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  poseList: {
    marginHorizontal: 14,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  actions: {
    paddingHorizontal: 14,
    gap: 6,
  },
  repeatBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  repeatBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  homeBtn: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  homeBtnText: {
    fontSize: 12,
    color: '#1a1a1a',
  },
});
