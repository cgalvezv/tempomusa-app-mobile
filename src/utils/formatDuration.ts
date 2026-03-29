export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes} min`;
  if (hours > 0) return `${hours}h`;
  return `${minutes} min`;
}

export function formatPoseDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0 && minutes > 0) return `${hours}h ${minutes} min`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes} min`;
  return `${seconds} seg`;
}

export function getDurationBadge(seconds: number): { label: string; style: 'corta' | 'larga' } | null {
  const minutes = seconds / 60;
  if (minutes <= 10) return { label: 'Corta', style: 'corta' };
  if (minutes >= 20) return { label: 'Larga', style: 'larga' };
  return null;
}
