import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export default function Toggle({ value, onToggle }: ToggleProps) {
  return (
    <TouchableOpacity
      style={[styles.toggle, !value && styles.toggleOff]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.knob, !value && styles.knobOff]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggle: {
    width: 44,
    height: 26,
    backgroundColor: '#1a1a1a',
    borderRadius: 13,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOff: {
    backgroundColor: '#ddd',
  },
  knob: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  knobOff: {
    alignSelf: 'flex-start',
  },
});
