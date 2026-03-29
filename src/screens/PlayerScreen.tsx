import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayerProps } from '../types/navigation';
import useSessionPlayer from '../hooks/useSessionPlayer';
import { formatCountdown, formatDuration, getDurationBadge } from '../utils/formatDuration';
import PlayerTopBar from '../components/molecules/PlayerTopBar';
import ImageCarousel from '../components/molecules/ImageCarousel';
import PoseTimerBlock from '../components/molecules/PoseTimerBlock';
import TransportControls from '../components/molecules/TransportControls';

export default function PlayerScreen({ navigation, route }: PlayerProps) {
  const { session } = route.params;

  const handleComplete = () => {
    navigation.goBack();
  };

  const player = useSessionPlayer(session, handleComplete);

  const badge = getDurationBadge(player.currentPose.durationSeconds);
  const badgeInfo = badge ? { label: badge.label, variant: badge.style } : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Top bar */}
        <PlayerTopBar
          sessionName={session.name}
          currentPose={player.currentPoseIndex + 1}
          totalPoses={session.poses.length}
          progress={player.sessionProgress}
        />

        {/* Image carousel */}
        <ImageCarousel images={player.currentPose.images} />

        {/* Pose info */}
        <View style={styles.poseInfo}>
          <Text style={styles.poseName}>{player.currentPose.name}</Text>
          {player.currentPose.description !== '' && (
            <Text style={styles.poseDescription}>{player.currentPose.description}</Text>
          )}
        </View>

        {/* Timer */}
        <PoseTimerBlock
          formattedTime={formatCountdown(player.secondsRemaining)}
          progress={player.poseProgress}
          totalDurationLabel={formatDuration(player.currentPose.durationSeconds)}
          badge={badgeInfo}
        />

        {/* Transport controls */}
        <TransportControls
          isPlaying={player.isPlaying}
          onPrev={player.goPrev}
          onPlayPause={player.togglePlayPause}
          onNext={player.goNext}
          hasPrev={player.currentPoseIndex > 0}
          hasNext={player.currentPoseIndex < session.poses.length - 1}
        />

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.nextLabel}>
            {player.nextPose ? `Siguiente: ${player.nextPose.name}` : 'Última pose'}
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Text style={styles.finishBtn}>Finalizar</Text>
          </TouchableOpacity>
        </View>
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
  poseInfo: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 2,
    paddingBottom: 2,
  },
  poseName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  poseDescription: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    marginTop: 'auto',
  },
  nextLabel: {
    fontSize: 10,
    color: '#aaa',
  },
  finishBtn: {
    fontSize: 10,
    color: '#E24B4A',
  },
});
