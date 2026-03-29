import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CountdownDisplay from '../atoms/CountdownDisplay';
import ProgressBar from '../atoms/ProgressBar';
import Badge from '../atoms/Badge';

interface PoseTimerBlockProps {
  formattedTime: string;
  progress: number;
  totalDurationLabel: string;
  badge: { label: string; variant: 'corta' | 'larga' } | null;
}

export default function PoseTimerBlock({ formattedTime, progress, totalDurationLabel, badge }: PoseTimerBlockProps) {
  return (
    <View style={styles.container}>
      <CountdownDisplay time={formattedTime} />
      <View style={styles.barWrap}>
        <ProgressBar progress={progress} height={6} />
      </View>
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>de {totalDurationLabel}</Text>
        {badge && (
          <>
            <Text style={styles.metaDot}> · </Text>
            <Badge label={badge.label} variant={badge.variant} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  barWrap: {
    width: '100%',
    marginTop: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 10,
    color: '#aaa',
  },
  metaDot: {
    fontSize: 10,
    color: '#aaa',
  },
});
