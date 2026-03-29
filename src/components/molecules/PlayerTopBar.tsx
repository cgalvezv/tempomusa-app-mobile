import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from '../atoms/ProgressBar';

interface PlayerTopBarProps {
  sessionName: string;
  currentPose: number;
  totalPoses: number;
  progress: number;
}

export default function PlayerTopBar({ sessionName, currentPose, totalPoses, progress }: PlayerTopBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.sessionName}>{sessionName}</Text>
        <Text style={styles.poseIndicator}>Pose {currentPose} / {totalPoses}</Text>
      </View>
      <ProgressBar progress={progress} height={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 6,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionName: {
    fontSize: 11,
    color: '#888',
  },
  poseIndicator: {
    fontSize: 11,
    color: '#888',
  },
});
