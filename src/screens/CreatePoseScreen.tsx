import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { CreatePoseProps } from '../types/navigation';
import { Pose } from '../types';
import { getDurationBadge } from '../utils/formatDuration';
import { saveImage, deleteFile } from '../services/fileStorage';
import DurationInput from '../components/molecules/DurationInput';
import RangeBanner from '../components/atoms/RangeBanner';

export default function CreatePoseScreen({ navigation }: CreatePoseProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const badge = getDurationBadge(totalSeconds);
  const canSave = name.trim().length > 0 && totalSeconds > 0;

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const localUri = await saveImage(result.assets[0].uri);
      setImages((prev) => [...prev, localUri]);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const uri = images[index];
    Alert.alert('Eliminar imagen', '¿Segura que quieres eliminar esta imagen?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await deleteFile(uri);
          setImages((prev) => prev.filter((_, i) => i !== index));
        },
      },
    ]);
  };

  const handleSave = () => {
    if (!canSave) return;

    const newPose: Pose = {
      id: String(Date.now()),
      name: name.trim(),
      description: description.trim(),
      durationSeconds: totalSeconds,
      images,
    };

    navigation.navigate('CreateSession', { newPose });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.cancelBtn}>← Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.topTitle}>Nueva pose</Text>
          <TouchableOpacity onPress={handleSave} activeOpacity={0.7} disabled={!canSave}>
            <Text style={[styles.addBtn, !canSave && styles.addBtnDisabled]}>Agregar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Images */}
          <View style={styles.imagesSection}>
            <Text style={styles.imagesLabel}>Imágenes de referencia</Text>
            <View style={styles.imagesRow}>
              {images.map((uri, i) => (
                <TouchableOpacity key={i} style={styles.imageThumb} onPress={() => handleRemoveImage(i)} activeOpacity={0.7}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.imageAdd} onPress={handleAddImage} activeOpacity={0.7}>
                <Text style={styles.imageAddIcon}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.imagesHint}>Toca una imagen para eliminar · toca + para agregar</Text>
          </View>

          {/* Name */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Nombre de la pose</Text>
            <TextInput
              style={styles.fieldInput}
              value={name}
              onChangeText={setName}
              placeholder="De pie, brazo extendido"
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Description */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Descripción (opcional)</Text>
            <TextInput
              style={styles.fieldInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Un brazo hacia el frente..."
              placeholderTextColor="#aaa"
            />
          </View>

          {/* Duration */}
          <Text style={styles.durationLabel}>Duración</Text>
          <DurationInput
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onChangeHours={setHours}
            onChangeMinutes={setMinutes}
            onChangeSeconds={setSeconds}
          />

          {/* Range badge */}
          {badge && <RangeBanner variant={badge.style} />}

          {/* Save button */}
          <View style={styles.saveBtnWrap}>
            <TouchableOpacity
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={!canSave}
            >
              <Text style={styles.saveBtnText}>Agregar a sesión</Text>
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
  addBtn: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  addBtnDisabled: {
    color: '#ccc',
  },
  imagesSection: {
    backgroundColor: '#f5f4f0',
    margin: 14,
    marginBottom: 6,
    borderRadius: 10,
    padding: 10,
  },
  imagesLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  imageThumb: {
    width: 62,
    height: 62,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageAdd: {
    width: 62,
    height: 62,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageAddIcon: {
    fontSize: 20,
    color: '#ccc',
  },
  imagesHint: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 6,
  },
  fieldWrap: {
    paddingHorizontal: 14,
    paddingBottom: 4,
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
    marginBottom: 6,
  },
  durationLabel: {
    fontSize: 11,
    color: '#888',
    paddingHorizontal: 14,
    marginBottom: 3,
  },
  saveBtnWrap: {
    padding: 14,
  },
  saveBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
