import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Session } from './index';

export type HomeStackParamList = {
  HomeList: undefined;
  SessionDetail: { session: Session };
  Player: { session: Session };
  Summary: { session: Session };
  CreateSession: { newPose?: Session['poses'][number] } | undefined;
  CreatePose: undefined;
};

export type HomeListProps = NativeStackScreenProps<HomeStackParamList, 'HomeList'>;
export type SessionDetailProps = NativeStackScreenProps<HomeStackParamList, 'SessionDetail'>;
export type PlayerProps = NativeStackScreenProps<HomeStackParamList, 'Player'>;
export type SummaryProps = NativeStackScreenProps<HomeStackParamList, 'Summary'>;
export type CreateSessionProps = NativeStackScreenProps<HomeStackParamList, 'CreateSession'>;
export type CreatePoseProps = NativeStackScreenProps<HomeStackParamList, 'CreatePose'>;
