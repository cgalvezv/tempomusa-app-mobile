import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pose } from '../../types';
import { formatDuration, getDurationBadge } from '../../utils/formatDuration';

const poseIcons: React.ComponentProps<typeof Ionicons>['name'][] = [
  'body-outline',
  'accessibility-outline',
  'bed-outline',
  'refresh-outline',
  'man-outline',
];

interface EditablePoseRowProps {
  pose: Pose;
  index: number;
}

export default function EditablePoseRow({ pose, index }: EditablePoseRowProps) {
  const badge = getDurationBadge(pose.durationSeconds);

  return (
    <View style={styles.row}>
      <Text style={styles.num}>{index + 1}</Text>
      <View style={styles.thumb}>
        <Ionicons name={poseIcons[index % poseIcons.length]} size={18} color="#888" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{pose.name}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, badge.style === 'corta' ? styles.badgeCorta : styles.badgeLarga]}>
          <Text style={[styles.badgeText, badge.style === 'corta' ? styles.badgeTextCorta : styles.badgeTextLarga]}>
            {formatDuration(pose.durationSeconds)}
          </Text>
        </View>
      )}
      {!badge && (
        <Text style={styles.duration}>{formatDuration(pose.durationSeconds)}</Text>
      )}
      <Text style={styles.handle}>≡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  num: {
    fontSize: 12,
    color: '#aaa',
    width: 16,
  },
  thumb: {
    width: 32,
    height: 32,
    backgroundColor: '#f5f4f0',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  duration: {
    fontSize: 10,
    color: '#888',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeCorta: {
    backgroundColor: '#E1F5EE',
  },
  badgeLarga: {
    backgroundColor: '#FAECE7',
  },
  badgeText: {
    fontSize: 10,
  },
  badgeTextCorta: {
    color: '#0F6E56',
  },
  badgeTextLarga: {
    color: '#993C1D',
  },
  handle: {
    fontSize: 14,
    color: '#aaa',
    paddingLeft: 4,
  },
});
