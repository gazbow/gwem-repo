import { useStreaks } from '../../hooks/useStreak.js';
import { ADDICTION_PROFILES } from '../../data/phases.js';

function PhaseBand({ phase, dayStart, currentDay, color }) {
  const isPast = currentDay > phase.days[1];
  const isCurrent = currentDay >= phase.days[0] && currentDay <= phase.days[1];
  const dayRange = phase.days[1] >= 9000
    ? `Day ${phase.days[0]}+`
    : phase.days[0] === phase.days[1]
    ? `Day ${phase.days[0]}`
    : `Days ${phase.days[0]}–${phase.days[1]}`;

  return (
    <div
      className={`phase-band ${isPast ? 'past' : isCurrent ? 'current' : ''}`}
      style={{ borderLeftColor: isCurrent ? color : isPast ? '#888' : 'var(--bg4)' }}
    >
      <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: isCurrent ? color : 'var(--text2)' }}>
          {isCurrent && '▶ '}{phase.label}
        </p>
        <p className="muted" style={{ fontSize: 12, marginLeft: 'auto' }}>{dayRange}</p>
      </div>
      {(isCurrent) && (
        <>
          <p className="caption" style={{ marginBottom: 6 }}>{phase.neurological}</p>
          <p className="caption" style={{ marginBottom: 6, color: 'var(--text3)' }}>{phase.feeling}</p>
          <div className="divider" style={{ margin: '8px 0' }} />
          <p style={{ fontSize: 14, fontStyle: 'italic', color: 'var(--text2)', lineHeight: 1.6 }}>
            "{phase.anchor}"
          </p>
        </>
      )}
      {!isCurrent && (
        <p className="muted" style={{ fontSize: 13 }}>{phase.feeling}</p>
      )}
    </div>
  );
}

export default function Timeline({ config }) {
  const streaks = useStreaks(config.addictions);

  if (!streaks.length) {
    return <p className="muted" style={{ padding: 20 }}>No active streaks.</p>;
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 4 }}>Timeline</h1>
        <p className="muted">Your dopamine reset map. Current phase highlighted.</p>
      </div>

      {streaks.map(streak => {
        const profile = ADDICTION_PROFILES[streak.id];
        if (!profile) return null;
        return (
          <div key={streak.id} style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{streak.icon}</span>
              <h2 style={{ color: streak.color }}>{profile.label}</h2>
              <span className="muted" style={{ marginLeft: 'auto' }}>Day {streak.day}</span>
            </div>
            {profile.phases.map((phase, i) => (
              <PhaseBand
                key={i}
                phase={phase}
                currentDay={streak.day}
                color={streak.color}
              />
            ))}
          </div>
        );
      })}

      <div style={{ height: 40 }} />
    </>
  );
}
