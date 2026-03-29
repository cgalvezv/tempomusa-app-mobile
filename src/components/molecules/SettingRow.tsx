import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SettingRowProps {
  label: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SettingRow({ label, subtitle, children }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.label}>{label}</Text>
        {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  sub: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
});
