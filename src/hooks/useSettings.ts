import { useState, useEffect, useCallback } from 'react';
import { AppSettings, loadSettings, saveSettings } from '../services/storage';

export default function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadSettings();
      setSettings(stored);
      setLoading(false);
    })();
  }, []);

  const update = useCallback(async (partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      saveSettings(next);
      return next;
    });
  }, []);

  return { settings, loading, update };
}
