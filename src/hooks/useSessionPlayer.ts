import { useState, useEffect, useCallback, useRef } from 'react';
import { Session, Pose } from '../types';

interface SessionPlayerState {
  currentPoseIndex: number;
  secondsRemaining: number;
  isPlaying: boolean;
  currentPose: Pose;
  nextPose: Pose | null;
  poseProgress: number;
  sessionProgress: number;
}

interface SessionPlayerActions {
  togglePlayPause: () => void;
  goNext: () => void;
  goPrev: () => void;
}

export default function useSessionPlayer(
  session: Session,
  onComplete: () => void,
): SessionPlayerState & SessionPlayerActions {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(session.poses[0].durationSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const currentPose = session.poses[currentPoseIndex];
  const nextPose = currentPoseIndex < session.poses.length - 1 ? session.poses[currentPoseIndex + 1] : null;

  const poseProgress = 1 - secondsRemaining / currentPose.durationSeconds;

  const totalSessionSeconds = session.poses.reduce((sum, p) => sum + p.durationSeconds, 0);
  const elapsedSeconds =
    session.poses.slice(0, currentPoseIndex).reduce((sum, p) => sum + p.durationSeconds, 0) +
    (currentPose.durationSeconds - secondsRemaining);
  const sessionProgress = totalSessionSeconds > 0 ? elapsedSeconds / totalSessionSeconds : 0;

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (currentPoseIndex >= session.poses.length - 1) {
            setIsPlaying(false);
            setTimeout(() => onCompleteRef.current(), 0);
            return 0;
          }
          setCurrentPoseIndex((i) => i + 1);
          return session.poses[currentPoseIndex + 1].durationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentPoseIndex, session.poses]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const goNext = useCallback(() => {
    if (currentPoseIndex < session.poses.length - 1) {
      const nextIndex = currentPoseIndex + 1;
      setCurrentPoseIndex(nextIndex);
      setSecondsRemaining(session.poses[nextIndex].durationSeconds);
    }
  }, [currentPoseIndex, session.poses]);

  const goPrev = useCallback(() => {
    if (currentPoseIndex > 0) {
      const prevIndex = currentPoseIndex - 1;
      setCurrentPoseIndex(prevIndex);
      setSecondsRemaining(session.poses[prevIndex].durationSeconds);
    }
  }, [currentPoseIndex, session.poses]);

  return {
    currentPoseIndex,
    secondsRemaining,
    isPlaying,
    currentPose,
    nextPose,
    poseProgress,
    sessionProgress,
    togglePlayPause,
    goNext,
    goPrev,
  };
}
