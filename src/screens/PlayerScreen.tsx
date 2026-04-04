import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayerProps } from '../types/navigation';
import useSessionPlayer from '../hooks/useSessionPlayer';
import { formatCountdown, formatDuration, getDurationBadge } from '../utils/formatDuration';
import PlayerTopBar from '../components/molecules/PlayerTopBar';
import ImageCarousel from '../components/molecules/ImageCarousel';
import PoseTimerBlock from '../components/molecules/PoseTimerBlock';
import TransportControls from '../components/molecules/TransportControls';
import NextPosePreview from '../components/molecules/NextPosePreview';
import PauseBadge from '../components/atoms/PauseBadge';
import CountdownDisplay from '../components/atoms/CountdownDisplay';
import ProgressBar from '../components/atoms/ProgressBar';
import IconButton from '../components/atoms/IconButton';
import FullscreenImageViewer from '../components/molecules/FullscreenImageViewer';
import useSettings from '../hooks/useSettings';

export default function PlayerScreen({ navigation, route }: PlayerProps) {
  const { session } = route.params;
  const { settings } = useSettings();

  const handleComplete = () => {
    navigation.replace('Summary', { session });
  };

  const audioConfig = settings?.voiceAlert
    ? { audioPath: settings.audioPath, volume: settings.volume }
    : undefined;

  const player = useSessionPlayer(session, handleComplete, audioConfig);

  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  const badge = getDurationBadge(player.currentPose.durationSeconds);
  const badgeInfo = badge ? { label: badge.label, variant: badge.style } : null;

  const handleImagePress = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenVisible(true);
  };

  // Rest screen
  if (player.isResting && player.nextPose) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <PlayerTopBar
            sessionName={session.name}
            currentPose={player.currentPoseIndex + 1}
            totalPoses={session.poses.length}
            progress={player.sessionProgress}
          />

          <View style={styles.restContent}>
            <Text style={styles.restLabel}>Descanso</Text>
            <CountdownDisplay time={formatCountdown(player.restSecondsRemaining)} />
            <View style={styles.restBarWrap}>
              <ProgressBar progress={player.restProgress} height={6} />
            </View>
            <Text style={styles.restMeta}>de {session.restSeconds} seg</Text>
          </View>

          <NextPosePreview pose={player.nextPose} />

          <View style={styles.restControls}>
            <IconButton
              icon={player.isPlaying ? 'pause' : 'play'}
              onPress={player.togglePlayPause}
              size={18}
            />
            <TouchableOpacity style={styles.skipBtn} onPress={player.skipRest} activeOpacity={0.7}>
              <Text style={styles.skipBtnText}>Saltar descanso →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Active / paused pose screen
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
        <ImageCarousel
          images={player.currentPose.images}
          dimmed={!player.isPlaying}
          onImagePress={handleImagePress}
        />

        {/* Fullscreen image viewer */}
        <FullscreenImageViewer
          visible={fullscreenVisible}
          images={player.currentPose.images}
          initialIndex={fullscreenIndex}
          poseName={player.currentPose.name}
          poseDescription={player.currentPose.description}
          formattedTime={formatCountdown(player.secondsRemaining)}
          onClose={() => setFullscreenVisible(false)}
        />

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
          muted={!player.isPlaying}
        />

        {/* Pause badge */}
        {!player.isPlaying && (
          <View style={styles.pauseBadgeWrap}>
            <PauseBadge />
          </View>
        )}

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
  pauseBadgeWrap: {
    alignItems: 'center',
    marginTop: 2,
  },
  restContent: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 8,
    paddingHorizontal: 14,
  },
  restLabel: {
    fontSize: 11,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  restBarWrap: {
    width: '100%',
    marginTop: 8,
  },
  restMeta: {
    fontSize: 10,
    color: '#aaa',
    marginTop: 4,
  },
  restControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  skipBtn: {
    borderWidth: 0.5,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: '#f5f4f0',
  },
  skipBtnText: {
    fontSize: 11,
    color: '#888',
  },
});
