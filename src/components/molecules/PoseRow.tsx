import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Badge from '../atoms/Badge';
import { Pose } from '../../types';
import { formatPoseDuration, getDurationBadge } from '../../utils/formatDuration';

const poseIcons: React.ComponentProps<typeof Ionicons>['name'][] = [
  'body-outline',
  'accessibility-outline',
  'bed-outline',
  'refresh-outline',
  'man-outline',
];

interface PoseRowProps {
  pose: Pose;
  index: number;
}

export default function PoseRow({ pose, index }: PoseRowProps) {
  const badge = getDurationBadge(pose.durationSeconds);

  return (
    <View style={styles.row}>
      <Text style={styles.num}>{index + 1}</Text>
      <View style={styles.thumb}>
        <Ionicons name={poseIcons[index % poseIcons.length]} size={18} color="#888" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{pose.name}</Text>
        <View style={styles.durRow}>
          <Text style={styles.dur}>{formatPoseDuration(pose.durationSeconds)}</Text>
          {badge && <Badge label={badge.label} variant={badge.style} />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  num: {
    fontSize: 12,
    color: '#aaa',
    width: 18,
  },
  thumb: {
    width: 36,
    height: 36,
    backgroundColor: '#f5f4f0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  durRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dur: {
    fontSize: 12,
    color: '#aaa',
  },
});
