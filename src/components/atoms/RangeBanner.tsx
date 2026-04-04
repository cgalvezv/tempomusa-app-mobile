import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RangeBannerProps {
  variant: 'corta' | 'larga';
}

export default function RangeBanner({ variant }: RangeBannerProps) {
  const isCorta = variant === 'corta';

  return (
    <View style={[styles.banner, isCorta ? styles.corta : styles.larga]}>
      <View style={[styles.dot, isCorta ? styles.dotCorta : styles.dotLarga]} />
      <Text style={[styles.text, isCorta ? styles.textCorta : styles.textLarga]}>
        {isCorta ? 'Pose corta (5 – 10 min)' : 'Pose larga (20+ min)'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 14,
    marginTop: 2,
    marginBottom: 10,
  },
  corta: {
    backgroundColor: '#E1F5EE',
  },
  larga: {
    backgroundColor: '#FAECE7',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotCorta: {
    backgroundColor: '#0F6E56',
  },
  dotLarga: {
    backgroundColor: '#993C1D',
  },
  text: {
    fontSize: 11,
  },
  textCorta: {
    color: '#085041',
  },
  textLarga: {
    color: '#993C1D',
  },
});
