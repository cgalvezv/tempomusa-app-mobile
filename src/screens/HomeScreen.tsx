import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockSessions } from '../data/mockSessions';
import SessionCard from '../components/molecules/SessionCard';
import SectionLabel from '../components/atoms/SectionLabel';
import { Session } from '../types';
import { HomeListProps } from '../types/navigation';

export default function HomeScreen({ navigation }: HomeListProps) {
  const handleStart = (session: Session) => {
    // TODO: navegar al reproductor
  };

  const handleDetail = (session: Session) => {
    navigation.navigate('SessionDetail', { session });
  };

  const handleNewSession = () => {
    // TODO: navegar a crear sesión
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.title}>Tempomusa</Text>
            <Text style={styles.subtitle}>Elige o crea una sesión</Text>
          </View>
          <View style={styles.avatar} />
        </View>

        {/* Nueva sesión */}
        <View style={styles.newBtnWrap}>
          <TouchableOpacity style={styles.newBtn} onPress={handleNewSession} activeOpacity={0.7}>
            <Text style={styles.newBtnText}>+ Nueva sesión</Text>
          </TouchableOpacity>
        </View>

        <SectionLabel>Mis sesiones guardadas</SectionLabel>

        {/* Lista de sesiones */}
        <FlatList
          data={mockSessions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SessionCard
              session={item}
              onStart={() => handleStart(item)}
              onDetail={() => handleDetail(item)}
            />
          )}
        />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  avatar: {
    width: 30,
    height: 30,
    backgroundColor: '#f5f4f0',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  newBtnWrap: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
  },
  newBtn: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  newBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },
});
