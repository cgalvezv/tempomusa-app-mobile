import { Session } from '../types';

export const mockSessions: Session[] = [
  {
    id: '1',
    name: 'Práctica del jueves',
    poses: [
      { id: 'p1', name: 'De pie, brazos caídos', durationSeconds: 5, images: [] },       // TODO: restore to 420
      { id: 'p2', name: 'Sentada, espalda recta', durationSeconds: 5, images: [] },    // TODO: restore to 1200
      { id: 'p3', name: 'Recostada de lado', durationSeconds: 5, images: [] },         // TODO: restore to 2700
      { id: 'p4', name: 'Torsión sentada', durationSeconds: 5, images: [] },           // TODO: restore to 900
      { id: 'p5', name: 'De pie, contraposto', durationSeconds: 5, images: [] },       // TODO: restore to 600
    ],
    restSeconds: 5,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Gestos rápidos',
    poses: [
      { id: 'p6', name: 'Gesto libre 1', durationSeconds: 360, images: [] },
      { id: 'p7', name: 'Gesto libre 2', durationSeconds: 360, images: [] },
      { id: 'p8', name: 'Gesto libre 3', durationSeconds: 360, images: [] },
      { id: 'p9', name: 'Gesto libre 4', durationSeconds: 360, images: [] },
      { id: 'p10', name: 'Gesto libre 5', durationSeconds: 360, images: [] },
      { id: 'p11', name: 'Gesto libre 6', durationSeconds: 360, images: [] },
      { id: 'p12', name: 'Gesto libre 7', durationSeconds: 360, images: [] },
    ],
    restSeconds: 10,
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: 'Sesión larga',
    poses: [
      { id: 'p13', name: 'Pose extendida A', durationSeconds: 3600, images: [] },
      { id: 'p14', name: 'Pose extendida B', durationSeconds: 2700, images: [] },
      { id: 'p15', name: 'Pose extendida C', durationSeconds: 2700, images: [] },
    ],
    restSeconds: 15,
    createdAt: Date.now(),
  },
];
