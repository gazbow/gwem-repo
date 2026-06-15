import { useMemo } from 'react';
import { getDayNumber, getPhaseForDay, ADDICTION_PROFILES } from '../data/phases.js';

export function useStreaks(addictions = []) {
  return useMemo(() => {
    return addictions
      .filter(a => a.active)
      .map(a => {
        const day = getDayNumber(a.startDate);
        const profile = ADDICTION_PROFILES[a.id] || {};
        const phase = getPhaseForDay(a.id, day);
        return {
          ...a,
          day,
          profile,
          phase,
          color: profile.color || '#888',
          icon: profile.icon || '●',
        };
      });
  }, [addictions]);
}

export function detectLesserEvilRisk(streaks) {
  if (streaks.length < 2) return false;
  const days = streaks.map(s => s.day);
  const max = Math.max(...days);
  const min = Math.min(...days);
  return max >= 14 && min <= 7;
}
