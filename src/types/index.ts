export interface Pose {
  id: string;
  name: string;
  description?: string;
  durationSeconds: number;
  images: string[];
}

export interface Session {
  id: string;
  name: string;
  poses: Pose[];
  restSeconds: number;
  createdAt: number;
}
