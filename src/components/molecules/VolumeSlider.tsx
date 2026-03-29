import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';

interface VolumeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function VolumeSlider({ value, onChange }: VolumeSliderProps) {
  const trackWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        if (trackWidth.current > 0) {
          const pct = Math.round(Math.min(100, Math.max(0, (e.nativeEvent.locationX / trackWidth.current) * 100)));
          onChange(pct);
        }
      },
      onPanResponderMove: (e) => {
        if (trackWidth.current > 0) {
          const pct = Math.round(Math.min(100, Math.max(0, (e.nativeEvent.locationX / trackWidth.current) * 100)));
          onChange(pct);
        }
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>Volumen del aviso</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>
      <View style={styles.track} onLayout={onLayout} {...panResponder.panHandlers}>
        <View style={[styles.fill, { width: `${value}%` }]} />
        <View style={[styles.thumb, { left: `${value}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8e8e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#1a1a1a',
  },
  value: {
    fontSize: 14,
    color: '#888',
  },
  track: {
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 2,
    justifyContent: 'center',
  },
  fill: {
    height: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    marginLeft: -8,
  },
});
