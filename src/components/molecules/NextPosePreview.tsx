import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Badge from '../atoms/Badge';
import { Pose } from '../../types';
import { formatDuration, getDurationBadge } from '../../utils/formatDuration';

interface NextPosePreviewProps {
  pose: Pose;
}

export default function NextPosePreview({ pose }: NextPosePreviewProps) {
  const badge = getDurationBadge(pose.durationSeconds);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>Siguiente pose</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.thumb}>
          <Text style={styles.thumbEmoji}>
            {pose.images.length > 0 ? pose.images[0] : '🖼'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{pose.name}</Text>
          {pose.description !== '' && (
            <Text style={styles.description}>{pose.description}</Text>
          )}
          <View style={styles.metaRow}>
            <Text style={styles.duration}>{formatDuration(pose.durationSeconds)}</Text>
            {badge && <Badge label={badge.label} variant={badge.style} />}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f5f4f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  headerLabel: {
    fontSize: 10,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  thumb: {
    width: 52,
    height: 52,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  description: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 10,
    color: '#888',
  },
});
