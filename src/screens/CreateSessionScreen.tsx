import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreateSessionProps } from '../types/navigation';
import { Pose, Session } from '../types';
import useSessions from '../hooks/useSessions';
import SectionLabel from '../components/atoms/SectionLabel';
import EditablePoseRow from '../components/molecules/EditablePoseRow';

export default function CreateSessionScreen({ navigation, route }: CreateSessionProps) {
  const { addSession } = useSessions();
  const [name, setName] = useState('');
  const [restSeconds, setRestSeconds] = useState(10);
  const [poses, setPoses] = useState<Pose[]>([]);

  // Listen for new pose coming back from CreatePose screen
  useEffect(() => {
    const newPose = route.params?.newPose;
    if (newPose) {
      setPoses((prev) => [...prev, newPose]);
      // Clear the param so it doesn't re-add on re-render
      navigation.setParams({ newPose: undefined });
    }
  }, [route.params?.newPose]);

  const handleSave = async () => {
    if (!name.trim() || poses.length === 0) return;

    const newSession: Session = {
      id: String(Date.now()),
      name: name.trim(),
      poses,
      restSeconds,
      createdAt: Date.now(),
    };

    await addSession(newSession);
    navigation.goBack();
  };

  const handleAddPose = () => {
    navigation.navigate('CreatePose');
  };

  const canSave = name.trim().length > 0 && poses.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.cancelBtn}>← Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Nueva sesión</Text>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.7} disabled={!canSave}>
            <Text style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>Guardar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Session name */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Nombre de la sesión</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="Mi sesión del jueves"
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Rest seconds */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Descanso entre poses</Text>
            <View style={styles.restRow}>
              <TextInput
                style={styles.restInput}
                value={String(restSeconds)}
                onChangeText={(t) => setRestSeconds(Math.max(0, parseInt(t, 10) || 0))}
                keyboardType="number-pad"
              />
              <Text style={styles.restUnit}>seg</Text>
              <Text style={styles.restHint}>(0 = sin descanso)</Text>
            </View>
            <View style={styles.restNote}>
              <Text style={styles.restNoteText}>Durante el descanso se previsualiza la siguiente pose</Text>
            </View>
          </View>

          {/* Pose list */}
          <SectionLabel>Poses de la sesión</SectionLabel>

          {poses.map((pose, index) => (
            <EditablePoseRow
              key={pose.id}
              pose={pose}
              index={index}
              onDelete={() => setPoses((prev) => prev.filter((_, i) => i !== index))}
            />
          ))}

          {/* Add pose button */}
          <TouchableOpacity style={styles.addPoseBtn} onPress={handleAddPose} activeOpacity={0.7}>
            <Text style={styles.addPoseText}>+ Agregar pose</Text>
          </TouchableOpacity>

          {/* Save button */}
          <View style={styles.saveBtnWrap}>
            <TouchableOpacity
              style={[styles.saveSessionBtn, !canSave && styles.saveSessionBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!canSave}
            >
              <Text style={styles.saveSessionBtnText}>Guardar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  cancelBtn: {
    fontSize: 12,
    color: '#888',
  },
  topTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  saveBtn: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  saveBtnDisabled: {
    color: '#ccc',
  },
  fieldWrap: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 3,
  },
  fieldInput: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#1a1a1a',
    backgroundColor: '#fff',
  },
  restRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restInput: {
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
  restUnit: {
    fontSize: 11,
    color: '#aaa',
  },
  restHint: {
    fontSize: 11,
    color: '#aaa',
    paddingLeft: 4,
  },
  restNote: {
    marginTop: 6,
    backgroundColor: '#f5f4f0',
    borderRadius: 8,
    padding: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  restNoteText: {
    fontSize: 10,
    color: '#888',
  },
  addPoseBtn: {
    marginHorizontal: 14,
    marginTop: 6,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addPoseText: {
    fontSize: 11,
    color: '#aaa',
  },
  saveBtnWrap: {
    padding: 14,
  },
  saveSessionBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveSessionBtnDisabled: {
    backgroundColor: '#ccc',
  },
  saveSessionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
