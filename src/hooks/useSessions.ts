import { useState, useEffect, useCallback } from 'react';
import { Session } from '../types';
import { loadSessions, saveSessions, addSession as addSessionStorage, deleteSession as deleteSessionStorage } from '../services/storage';
import { mockSessions } from '../data/mockSessions';

export default function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadSessions();
      if (stored.length === 0) {
        // Seed with mock data on first launch
        await saveSessions(mockSessions);
        setSessions(mockSessions);
      } else {
        setSessions(stored);
      }
      setLoading(false);
    })();
  }, []);

  const addSession = useCallback(async (session: Session) => {
    const updated = await addSessionStorage(session);
    setSessions(updated);
  }, []);

  const removeSession = useCallback(async (id: string) => {
    const updated = await deleteSessionStorage(id);
    setSessions(updated);
  }, []);

  const refresh = useCallback(async () => {
    const stored = await loadSessions();
    setSessions(stored);
  }, []);

  return { sessions, loading, addSession, removeSession, refresh };
}
