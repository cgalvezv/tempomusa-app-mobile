import React from 'react';
import { View, StyleSheet } from 'react-native';

interface DotIndicatorProps {
  total: number;
  active: number;
}

export default function DotIndicator({ total, active }: DotIndicatorProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, i === active && styles.activeDot]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#1a1a1a',
  },
});
