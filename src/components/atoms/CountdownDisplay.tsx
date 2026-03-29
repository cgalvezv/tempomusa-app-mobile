import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface CountdownDisplayProps {
  time: string;
  muted?: boolean;
}

export default function CountdownDisplay({ time, muted }: CountdownDisplayProps) {
  return (
    <Text style={[styles.text, muted && styles.muted]}>{time}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 48,
    fontWeight: '500',
    color: '#1a1a1a',
    letterSpacing: 1,
    fontVariant: ['tabular-nums'],
  },
  muted: {
    color: '#ccc',
  },
});
