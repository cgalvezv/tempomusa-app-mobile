import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant: 'corta' | 'larga';
}

export default function Badge({ label, variant }: BadgeProps) {
  return (
    <View style={[styles.badge, variant === 'corta' ? styles.corta : styles.larga]}>
      <Text style={[styles.text, variant === 'corta' ? styles.cortaText : styles.largaText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 20,
  },
  corta: {
    backgroundColor: '#E1F5EE',
  },
  larga: {
    backgroundColor: '#FAECE7',
  },
  text: {
    fontSize: 10,
    fontWeight: '500',
  },
  cortaText: {
    color: '#0F6E56',
  },
  largaText: {
    color: '#993C1D',
  },
});
