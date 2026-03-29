import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface RestFieldControlProps {
  value: number;
  label: string;
  step: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function RestFieldControl({ value, label, step, max, onChange }: RestFieldControlProps) {
  const decrement = () => onChange(Math.max(0, value - step));
  const increment = () => onChange(max !== undefined ? Math.min(max, value + step) : value + step);

  return (
    <View style={styles.group}>
      <TouchableOpacity style={styles.btn} onPress={decrement} activeOpacity={0.7}>
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>
      <View style={styles.input}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={increment} activeOpacity={0.7}>
        <Text style={styles.btnText}>+</Text>
      </TouchableOpacity>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  btn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f4f0',
  },
  btnText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#fff',
    minWidth: 48,
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  label: {
    fontSize: 12,
    color: '#aaa',
  },
});
