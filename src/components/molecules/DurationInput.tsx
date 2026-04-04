import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface DurationInputProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChangeHours: (v: number) => void;
  onChangeMinutes: (v: number) => void;
  onChangeSeconds: (v: number) => void;
}

export default function DurationInput({
  hours,
  minutes,
  seconds,
  onChangeHours,
  onChangeMinutes,
  onChangeSeconds,
}: DurationInputProps) {
  const parseNum = (text: string, max?: number) => {
    const n = parseInt(text, 10) || 0;
    return max !== undefined ? Math.min(max, Math.max(0, n)) : Math.max(0, n);
  };

  return (
    <View style={styles.row}>
      <TextInput
        style={styles.input}
        value={String(hours)}
        onChangeText={(t) => onChangeHours(parseNum(t))}
        keyboardType="number-pad"
        maxLength={2}
      />
      <Text style={styles.label}>h</Text>
      <TextInput
        style={styles.input}
        value={String(minutes)}
        onChangeText={(t) => onChangeMinutes(parseNum(t, 59))}
        keyboardType="number-pad"
        maxLength={2}
      />
      <Text style={styles.label}>min</Text>
      <TextInput
        style={styles.input}
        value={String(seconds)}
        onChangeText={(t) => onChangeSeconds(parseNum(t, 59))}
        keyboardType="number-pad"
        maxLength={2}
      />
      <Text style={styles.label}>seg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 6,
  },
  input: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1a1a1a',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 11,
    color: '#aaa',
  },
});
