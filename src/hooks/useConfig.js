import { useState, useCallback } from 'react';

const CONFIG_KEY = 'ironframe_config';
const JOURNAL_KEY = 'ironframe_journal';
const CRAVINGS_KEY = 'ironframe_cravings';
const BODY_KEY = 'ironframe_body';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useConfig() {
  const [config, setConfigState] = useState(() => load(CONFIG_KEY, null));

  const saveConfig = useCallback((next) => {
    save(CONFIG_KEY, next);
    setConfigState(next);
  }, []);

  return { config, saveConfig };
}

export function useJournal() {
  const [entries, setEntries] = useState(() => load(JOURNAL_KEY, []));

  const saveEntry = useCallback((date, text, meta = {}) => {
    setEntries(prev => {
      const without = prev.filter(e => e.date !== date);
      const next = [{ date, text, ...meta, updatedAt: new Date().toISOString() }, ...without]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30);
      save(JOURNAL_KEY, next);
      return next;
    });
  }, []);

  return { entries, saveEntry };
}

export function useCravings() {
  const [cravings, setCravings] = useState(() => load(CRAVINGS_KEY, []));

  const logCraving = useCallback((addictionId, intensity) => {
    setCravings(prev => {
      const next = [{ addictionId, intensity, timestamp: new Date().toISOString() }, ...prev].slice(0, 200);
      save(CRAVINGS_KEY, next);
      return next;
    });
  }, []);

  return { cravings, logCraving };
}

export function useBodyStats() {
  const [stats, setStats] = useState(() => load(BODY_KEY, []));

  const logStat = useCallback((weight, waist) => {
    const date = new Date().toISOString().slice(0, 10);
    setStats(prev => {
      const without = prev.filter(s => s.date !== date);
      const next = [{ date, weight, waist }, ...without].sort((a, b) => b.date.localeCompare(a.date));
      save(BODY_KEY, next);
      return next;
    });
  }, []);

  return { stats, logStat };
}
