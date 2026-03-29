import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatBoxProps {
  value: string;
  label: string;
}

export default function StatBox({ value, label }: StatBoxProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: '#f5f4f0',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  label: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
});
