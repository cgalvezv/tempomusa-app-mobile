import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Session } from '../../types';
import { formatDuration } from '../../utils/formatDuration';

interface SessionCardProps {
  session: Session;
  onStart: () => void;
  onDetail: () => void;
}

export default function SessionCard({ session, onStart, onDetail }: SessionCardProps) {
  const totalSeconds = session.poses.reduce((sum, p) => sum + p.durationSeconds, 0);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{session.name}</Text>
      <Text style={styles.meta}>
        {session.poses.length} poses · {formatDuration(totalSeconds)}
      </Text>
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.btnPrimary} onPress={onStart} activeOpacity={0.7}>
          <Text style={styles.btnPrimaryText}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary} onPress={onDetail} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>Ver detalle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  btnSecondary: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#1a1a1a',
    fontSize: 12,
  },
});
