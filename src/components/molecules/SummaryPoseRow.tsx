import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pose } from '../../types';
import { formatDuration } from '../../utils/formatDuration';

interface SummaryPoseRowProps {
  pose: Pose;
  isLast?: boolean;
}

export default function SummaryPoseRow({ pose, isLast }: SummaryPoseRowProps) {
  return (
    <View style={[styles.row, isLast && styles.noBorder]}>
      <Text style={styles.emoji}>{pose.images.length > 0 ? pose.images[0] : '🖼'}</Text>
      <Text style={styles.name}>{pose.name}</Text>
      <Text style={styles.duration}>{formatDuration(pose.durationSeconds)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  emoji: {
    fontSize: 14,
  },
  name: {
    flex: 1,
    fontSize: 11,
    color: '#1a1a1a',
  },
  duration: {
    fontSize: 11,
    color: '#aaa',
  },
});
