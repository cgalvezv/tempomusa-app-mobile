import React from 'react';
import { View, StyleSheet } from 'react-native';
import IconButton from '../atoms/IconButton';

interface TransportControlsProps {
  isPlaying: boolean;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function TransportControls({
  isPlaying,
  onPrev,
  onPlayPause,
  onNext,
  hasPrev,
  hasNext,
}: TransportControlsProps) {
  return (
    <View style={styles.container}>
      <IconButton
        icon="play-skip-back"
        onPress={onPrev}
        disabled={!hasPrev}
        size={18}
      />
      <IconButton
        icon={isPlaying ? 'pause' : 'play'}
        onPress={onPlayPause}
        size={24}
        color="#fff"
        bgColor="#1a1a1a"
        buttonSize={54}
      />
      <IconButton
        icon="play-skip-forward"
        onPress={onNext}
        disabled={!hasNext}
        size={18}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
});
