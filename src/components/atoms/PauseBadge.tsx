import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PauseBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>En pausa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: {
    fontSize: 10,
    color: '#856404',
  },
});
