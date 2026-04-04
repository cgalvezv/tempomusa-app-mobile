import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { Session, Pose } from '../types';

interface SessionPlayerState {
  currentPoseIndex: number;
  secondsRemaining: number;
  isPlaying: boolean;
  isResting: boolean;
  restSecondsRemaining: number;
  restProgress: number;
  currentPose: Pose;
  nextPose: Pose | null;
  poseProgress: number;
  sessionProgress: number;
}

interface SessionPlayerActions {
  togglePlayPause: () => void;
  goNext: () => void;
  goPrev: () => void;
  skipRest: () => void;
}

interface AudioConfig {
  audioPath: string | null;
  volume: number;
}

export default function useSessionPlayer(
  session: Session,
  onComplete: () => void,
  audio?: AudioConfig,
): SessionPlayerState & SessionPlayerActions {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(session.poses[0].durationSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsRemaining, setRestSecondsRemaining] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const soundRef = useRef<Audio.Sound | null>(null);

  const playAlert = useCallback(async () => {
    if (!audio?.audioPath) return;
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: audio.audioPath },
        { volume: (audio.volume ?? 70) / 100, shouldPlay: true },
      );
      soundRef.current = sound;
    } catch {
      // Audio playback failed silently
    }
  }, [audio?.audioPath, audio?.volume]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const currentPose = session.poses[currentPoseIndex];
  const nextPose = currentPoseIndex < session.poses.length - 1 ? session.poses[currentPoseIndex + 1] : null;

  const poseProgress = 1 - secondsRemaining / currentPose.durationSeconds;
  const restProgress = session.restSeconds > 0 ? 1 - restSecondsRemaining / session.restSeconds : 0;

  const totalSessionSeconds = session.poses.reduce((sum, p) => sum + p.durationSeconds, 0);
  const elapsedSeconds =
    session.poses.slice(0, currentPoseIndex).reduce((sum, p) => sum + p.durationSeconds, 0) +
    (currentPose.durationSeconds - secondsRemaining);
  const sessionProgress = totalSessionSeconds > 0 ? elapsedSeconds / totalSessionSeconds : 0;

  // Pose countdown timer
  useEffect(() => {
    if (!isPlaying || isResting) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          playAlert();
          // Last pose — session complete
          if (currentPoseIndex >= session.poses.length - 1) {
            setIsPlaying(false);
            setTimeout(() => onCompleteRef.current(), 0);
            return 0;
          }
          // Has rest? Enter rest state. No rest? Go to next pose.
          if (session.restSeconds > 0) {
            setIsResting(true);
            setRestSecondsRemaining(session.restSeconds);
          } else {
            setCurrentPoseIndex((i) => i + 1);
            return session.poses[currentPoseIndex + 1].durationSeconds;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isResting, currentPoseIndex, session.poses, session.restSeconds]);

  // Rest countdown timer
  useEffect(() => {
    if (!isPlaying || !isResting) return;

    const interval = setInterval(() => {
      setRestSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          const nextIndex = currentPoseIndex + 1;
          setCurrentPoseIndex(nextIndex);
          setSecondsRemaining(session.poses[nextIndex].durationSeconds);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isResting, currentPoseIndex, session.poses]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const skipRest = useCallback(() => {
    if (!isResting) return;
    setIsResting(false);
    const nextIndex = currentPoseIndex + 1;
    setCurrentPoseIndex(nextIndex);
    setSecondsRemaining(session.poses[nextIndex].durationSeconds);
  }, [isResting, currentPoseIndex, session.poses]);

  const goNext = useCallback(() => {
    if (isResting) {
      skipRest();
      return;
    }
    if (currentPoseIndex < session.poses.length - 1) {
      const nextIndex = currentPoseIndex + 1;
      setCurrentPoseIndex(nextIndex);
      setSecondsRemaining(session.poses[nextIndex].durationSeconds);
    }
  }, [currentPoseIndex, session.poses, isResting, skipRest]);

  const goPrev = useCallback(() => {
    if (isResting) {
      setIsResting(false);
      setSecondsRemaining(currentPose.durationSeconds);
      return;
    }
    if (currentPoseIndex > 0) {
      const prevIndex = currentPoseIndex - 1;
      setCurrentPoseIndex(prevIndex);
      setSecondsRemaining(session.poses[prevIndex].durationSeconds);
    }
  }, [currentPoseIndex, session.poses, isResting, currentPose]);

  return {
    currentPoseIndex,
    secondsRemaining,
    isPlaying,
    isResting,
    restSecondsRemaining,
    restProgress,
    currentPose,
    nextPose,
    poseProgress,
    sessionProgress,
    togglePlayPause,
    goNext,
    goPrev,
    skipRest,
  };
}
