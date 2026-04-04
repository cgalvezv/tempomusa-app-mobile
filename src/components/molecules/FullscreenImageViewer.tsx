import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import DotIndicator from '../atoms/DotIndicator';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface FullscreenImageViewerProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  poseName: string;
  poseDescription?: string;
  formattedTime: string;
  onClose: () => void;
}

export default function FullscreenImageViewer({
  visible,
  images,
  initialIndex,
  poseName,
  poseDescription,
  formattedTime,
  onClose,
}: FullscreenImageViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.photoCount}>Foto {activeIndex + 1} de {images.length}</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕ Cerrar</Text>
          </TouchableOpacity>
        </View>

        {/* Image carousel */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index })}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.carouselContent}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Text style={styles.imageEmoji}>{item || '🖼'}</Text>
              <Text style={styles.imageHint}>Imagen de referencia</Text>
            </View>
          )}
        />

        {/* Bottom overlay */}
        <View style={styles.bottomArea}>
          {images.length > 1 && (
            <View style={styles.dots}>
              <DotIndicator total={images.length} active={activeIndex} />
            </View>
          )}
          <View style={styles.infoCard}>
            <Text style={styles.poseName}>{poseName}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.poseDescription} numberOfLines={1}>
                {poseDescription || ''}
              </Text>
              <Text style={styles.timer}>{formattedTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 50,
    paddingBottom: 10,
  },
  photoCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  closeBtnText: {
    fontSize: 11,
    color: '#fff',
  },
  carouselContent: {
    alignItems: 'center',
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  imageHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
  },
  bottomArea: {
    paddingBottom: 16,
  },
  dots: {
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: 14,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  poseName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poseDescription: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },
  timer: {
    fontSize: 13,
    fontWeight: '500',
    color: '#fff',
    marginLeft: 8,
  },
});
