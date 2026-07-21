import { useState } from 'react';
import { useStreaks, detectLesserEvilRisk } from '../../hooks/useStreak.js';
import { useCravings } from '../../hooks/useConfig.js';
import CravingSheet from '../shared/CravingSheet.jsx';

function StreakCard({ streak }) {
  const pct = Math.min(100, (streak.day / 90) * 100);
  return (
    <div className="card" style={{ borderLeft: `3px solid ${streak.color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className="label" style={{ marginBottom: 4 }}>{streak.icon} {streak.profile.label || streak.label}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="streak-num" style={{ color: streak.color }}>{streak.day}</span>
            <span className="muted">days</span>
          </div>
          <p style={{ color: 'var(--text2)', fontSize: 14, marginTop: 4 }}>
            {streak.phase?.label || '—'}
          </p>
        </div>
      </div>
      <div style={{ marginTop: 12, height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: streak.color, borderRadius: 2, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

function AnchorCard({ streaks }) {
  // Show the anchor for whichever streak has a risk flag first, otherwise the first streak
  const withFlag = streaks.find(s => s.phase?.riskFlag);
  const primary = withFlag || streaks[0];
  if (!primary?.phase) return null;
  return (
    <div className="card" style={{ background: 'var(--bg2)' }}>
      <p className="label" style={{ marginBottom: 10 }}>Today's frame</p>
      <p style={{ fontSize: 16, lineHeight: 1.6, fontStyle: 'italic', color: 'var(--text2)', marginBottom: 12 }}>
        "{primary.phase.anchor}"
      </p>
      <div className="divider" />
      <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text2)' }}>
        {primary.phase.reframe}
      </p>
    </div>
  );
}

// Returns the keystone streak (alcohol) and any secondary streaks for cross-link warnings.
// If a secondary streak (porn) is very short and the keystone is established,
// a slip in the secondary is likely connected — surface this diagnostic link.
function detectKeystoneLink(streaks) {
  const keystone = streaks.find(s => s.id === 'alcohol');
  const secondary = streaks.filter(s => s.id !== 'alcohol');
  if (!keystone || !secondary.length) return null;
  // If keystone is established (7+ days) and any secondary is very early (≤3 days),
  // the secondary streak is likely downstream of the keystone behaviour.
  const newSecondary = secondary.filter(s => s.day <= 3);
  if (keystone.day >= 7 && newSecondary.length) {
    return {
      keystone,
      secondary: newSecondary,
    };
  }
  return null;
}

function RiskFlags({ streaks }) {
  const flagged = streaks.filter(s => s.phase?.riskFlag);
  const lesserEvil = detectLesserEvilRisk(streaks);
  const keystoneLink = detectKeystoneLink(streaks);

  if (!flagged.length && !lesserEvil && !keystoneLink) return null;

  return (
    <>
      {flagged.map(s => (
        <div key={s.id} className="flag-card">
          <p className="flag-title">⚠ {s.profile.label} — {s.phase.label}</p>
          <p className="caption">{s.phase.riskFlag}</p>
        </div>
      ))}
      {lesserEvil && (
        <div className="flag-card">
          <p className="flag-title">⚠ Watch for the trade</p>
          <p className="caption">
            One streak is established, another is new. The brain may try to frame substituting one for the other as a reasonable compromise. It is not — it is the same avoidance mechanism wearing a different mask. Name it if it appears.
          </p>
        </div>
      )}
      {keystoneLink && (
        <div className="flag-card" style={{ borderColor: 'var(--teal)' }}>
          <p className="flag-title" style={{ color: 'var(--teal)' }}>◈ Keystone check</p>
          <p className="caption">
            {keystoneLink.secondary.map(s => s.profile.label).join(' and ')} {keystoneLink.secondary.length === 1 ? 'is' : 'are'} still early. Alcohol is the keystone behaviour — when alcohol is solid, the downstream behaviours tend to follow. Keep the keystone clean and the rest gets easier.
          </p>
          <p className="caption" style={{ marginTop: 8 }}>
            If the secondary streak slips, check the alcohol status first — that's where to look for the root cause.
          </p>
        </div>
      )}
    </>
  );
}

export default function Today({ config }) {
  const streaks = useStreaks(config.addictions);
  const { logCraving } = useCravings();
  const [showCraving, setShowCraving] = useState(false);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Morning.' : hour < 17 ? 'Afternoon.' : 'Evening.';
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1>{greeting}</h1>
        <p className="muted">{dateStr}</p>
      </div>

      <RiskFlags streaks={streaks} />

      {streaks.map(s => <StreakCard key={s.id} streak={s} />)}

      {streaks.length > 0 && <AnchorCard streaks={streaks} />}

      {/* What your body is doing today */}
      {streaks.length > 0 && (
        <div className="card">
          <p className="label" style={{ marginBottom: 10 }}>What's happening neurologically</p>
          {streaks.map(s => s.phase && (
            <div key={s.id} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: 600, fontSize: 14, color: s.color, marginBottom: 4 }}>
                {s.icon} {s.profile.label} — Day {s.day}
              </p>
              <p className="caption">{s.phase.neurological}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 80 }} />

      <button className="craving-btn" onClick={() => setShowCraving(true)} title="Log a craving">
        ⚡
      </button>

      {showCraving && (
        <CravingSheet
          streaks={streaks}
          onLog={(id, intensity) => { logCraving(id, intensity); setShowCraving(false); }}
          onClose={() => setShowCraving(false)}
        />
      )}
    </>
  );
}
