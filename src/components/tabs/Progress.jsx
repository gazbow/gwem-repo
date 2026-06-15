import { useState } from 'react';
import { useStreaks } from '../../hooks/useStreak.js';
import { useBodyStats } from '../../hooks/useConfig.js';
import { MILESTONES } from '../../data/milestones.js';

function MilestoneItem({ milestone, currentDay }) {
  const [open, setOpen] = useState(false);
  const done = currentDay >= milestone.day;
  const isNext = !done && currentDay < milestone.day &&
    (MILESTONES[Object.keys(MILESTONES)[0]] || []).findIndex(m => m.day === milestone.day) !== -1;

  return (
    <div className="milestone" onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
      <div className={`milestone-icon ${done ? 'done' : 'future'}`}>
        {done ? <span style={{ color: 'var(--green)' }}>✓</span> : <span className="muted">{milestone.day}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: done ? 'var(--green)' : 'var(--text2)' }}>
            {milestone.label}
          </p>
          <p className="muted" style={{ fontSize: 13 }}>Day {milestone.day}</p>
        </div>
        {open && (
          <p className="caption" style={{ marginTop: 6 }}>{milestone.detail}</p>
        )}
      </div>
    </div>
  );
}

function BodyStatsSection() {
  const { stats, logStat } = useBodyStats();
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [saved, setSaved] = useState(false);

  const baseline = stats[stats.length - 1];
  const latest = stats[0];

  function handleSave() {
    if (!weight && !waist) return;
    logStat(weight ? parseFloat(weight) : null, waist ? parseFloat(waist) : null);
    setWeight('');
    setWaist('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function delta(current, base, lower = true) {
    if (current == null || base == null) return null;
    const diff = current - base;
    const improved = lower ? diff < 0 : diff > 0;
    return { diff, improved };
  }

  const wDelta = latest && baseline && latest !== baseline
    ? delta(latest.weight, baseline.weight, true)
    : null;
  const waistDelta = latest && baseline && latest !== baseline
    ? delta(latest.waist, baseline.waist, true)
    : null;

  return (
    <div className="card">
      <p className="label" style={{ marginBottom: 12 }}>Body stats</p>

      {latest && (
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <div className="stat-box">
            <div className="num">{latest.weight ?? '—'}<span style={{ fontSize: 14, fontWeight: 400 }}>kg</span></div>
            <div className="lbl">
              Weight
              {wDelta && (
                <span style={{ color: wDelta.improved ? 'var(--green)' : 'var(--red)', marginLeft: 4 }}>
                  {wDelta.diff > 0 ? '+' : ''}{wDelta.diff.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <div className="stat-box">
            <div className="num">{latest.waist ?? '—'}<span style={{ fontSize: 14, fontWeight: 400 }}>cm</span></div>
            <div className="lbl">
              Waist
              {waistDelta && (
                <span style={{ color: waistDelta.improved ? 'var(--green)' : 'var(--red)', marginLeft: 4 }}>
                  {waistDelta.diff > 0 ? '+' : ''}{waistDelta.diff.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ marginBottom: 12 }}>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Weight (kg)</p>
          <input type="number" placeholder="e.g. 84.5" value={weight} onChange={e => setWeight(e.target.value)} step="0.1" />
        </div>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Waist (cm)</p>
          <input type="number" placeholder="e.g. 90" value={waist} onChange={e => setWaist(e.target.value)} step="0.5" />
        </div>
      </div>

      <button className="btn btn-ghost" onClick={handleSave}>
        {saved ? '✓ Saved' : 'Log today'}
      </button>

      {stats.length > 1 && (
        <div style={{ marginTop: 12 }}>
          <p className="label" style={{ marginBottom: 8 }}>History</p>
          {stats.slice(0, 7).map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--bg3)' }}>
              <span className="muted" style={{ fontSize: 13 }}>{s.date}</span>
              <span style={{ fontSize: 13 }}>
                {s.weight != null ? `${s.weight}kg` : '—'}
                {' · '}
                {s.waist != null ? `${s.waist}cm` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Progress({ config }) {
  const streaks = useStreaks(config.addictions);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 4 }}>Progress</h1>
        <p className="muted">Milestones and what your body is building toward.</p>
      </div>

      {streaks.map(streak => {
        const milestones = MILESTONES[streak.id];
        if (!milestones) return null;
        return (
          <div key={streak.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{streak.icon}</span>
              <h2 style={{ color: streak.color }}>{streak.profile.label}</h2>
              <span className="muted" style={{ marginLeft: 'auto' }}>Day {streak.day}</span>
            </div>
            <div className="card" style={{ padding: '4px 16px' }}>
              {milestones.map((m, i) => (
                <MilestoneItem key={i} milestone={m} currentDay={streak.day} />
              ))}
            </div>
          </div>
        );
      })}

      {config.bodyTrackingEnabled && <BodyStatsSection />}

      <div style={{ height: 40 }} />
    </>
  );
}
