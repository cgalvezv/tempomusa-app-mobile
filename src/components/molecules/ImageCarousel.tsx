import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import DotIndicator from '../atoms/DotIndicator';

const CAROUSEL_WIDTH = Dimensions.get('window').width - 28;

interface ImageCarouselProps {
  images: string[];
  dimmed?: boolean;
  onImagePress?: (index: number) => void;
}

export default function ImageCarousel({ images, dimmed, onImagePress }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const hasImages = images.length > 0;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / CAROUSEL_WIDTH);
    setActiveIndex(index);
  };

  if (!hasImages) {
    return (
      <View style={styles.container}>
        <View style={[styles.placeholder, dimmed && styles.dimmed]}>
          <Text style={styles.placeholderIcon}>🖼</Text>
          <Text style={styles.placeholderText}>Sin imágenes de referencia</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.imageSlide, dimmed && styles.dimmed]}
            activeOpacity={0.8}
            onPress={() => onImagePress?.(index)}
            disabled={!onImagePress}
          >
            <Text style={styles.imageEmoji}>{item || '🖼'}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.photoLabel}>
        Foto {activeIndex + 1} de {images.length} · toca para ampliar
      </Text>
      {images.length > 1 && (
        <View style={styles.dots}>
          <DotIndicator total={images.length} active={activeIndex} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 14,
    marginTop: 10,
  },
  placeholder: {
    backgroundColor: '#f5f4f0',
    borderRadius: 10,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  placeholderIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: '#888',
  },
  imageSlide: {
    width: CAROUSEL_WIDTH,
    height: 140,
    backgroundColor: '#f5f4f0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  imageEmoji: {
    fontSize: 28,
  },
  dimmed: {
    opacity: 0.45,
  },
  photoLabel: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
    marginTop: 6,
  },
  dots: {
    marginTop: 6,
  },
});
