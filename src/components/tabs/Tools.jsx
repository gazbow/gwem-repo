import { useState, useEffect, useRef } from 'react';
import { useCravings } from '../../hooks/useConfig.js';
import { useStreaks, detectLesserEvilRisk } from '../../hooks/useStreak.js';
import { getDailyPrompt } from '../../data/journalPrompts.js';

const URGE_SECONDS = 15 * 60;

function UrgeSurfTimer() {
  const [state, setState] = useState('idle'); // idle | running | done
  const [remaining, setRemaining] = useState(URGE_SECONDS);
  const intervalRef = useRef(null);

  function start() {
    setState('running');
    setRemaining(URGE_SECONDS);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setState('idle');
    setRemaining(URGE_SECONDS);
  }

  useEffect(() => {
    if (state !== 'running') return;
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          setState('done');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [state]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const pct = ((URGE_SECONDS - remaining) / URGE_SECONDS) * 100;

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <p className="label" style={{ marginBottom: 12 }}>Urge surfing timer</p>

      {state === 'idle' && (
        <>
          <p className="caption" style={{ marginBottom: 20 }}>
            When a craving hits, start the timer. Observe the feeling — don't wrestle it. Cravings peak within 15 minutes and subside on their own.
          </p>
          <div className="timer-display" style={{ color: 'var(--text3)', marginBottom: 20 }}>15:00</div>
          <button className="btn btn-primary" onClick={start}>Start timer</button>
        </>
      )}

      {state === 'running' && (
        <>
          <p className="caption" style={{ marginBottom: 16 }}>
            Observe. Don't resist. This is a wave — it peaks and it passes.
          </p>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--bg3)" strokeWidth="8" />
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="timer-display" style={{ fontSize: 40, color: 'var(--blue)' }}>{mins}:{secs}</span>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={reset}>Cancel</button>
        </>
      )}

      {state === 'done' && (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
          <h3 style={{ marginBottom: 8, color: 'var(--green)' }}>It passed.</h3>
          <p className="caption" style={{ marginBottom: 20 }}>It always does. Every time you ride one out, the circuit gets weaker.</p>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
        </>
      )}
    </div>
  );
}

function CravingLog() {
  const { cravings } = useCravings();
  const recent = cravings.slice(0, 10);

  if (!recent.length) {
    return (
      <div className="card">
        <p className="label" style={{ marginBottom: 8 }}>Craving log</p>
        <p className="muted">No cravings logged yet. Use the ⚡ button on the Today tab.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="label" style={{ marginBottom: 12 }}>Recent cravings</p>
      {recent.map((c, i) => {
        const d = new Date(c.timestamp);
        const timeStr = d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
        return (
          <div key={i} className="card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600 }}>{c.addictionId}</p>
              <p className="muted" style={{ fontSize: 12 }}>{timeStr}</p>
            </div>
            <div className="intensity">
              {[1,2,3,4,5].map(n => (
                <div key={n} className={`intensity-dot ${n <= c.intensity ? 'filled' : ''}`} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MeaningPrompt({ config }) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const prompt = getDailyPrompt(dayOfYear);

  return (
    <div className="card">
      <p className="label" style={{ marginBottom: 10 }}>Today's question</p>
      <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--text2)', fontStyle: 'italic' }}>
        "{prompt}"
      </p>
      <p className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Take it to the Journal tab if something surfaces.
      </p>
    </div>
  );
}

function LesserEvilCard({ streaks }) {
  const show = detectLesserEvilRisk(streaks);
  if (!show) return null;
  return (
    <div className="flag-card">
      <p className="flag-title">The substitution trap</p>
      <p className="caption">
        You have one established streak and one that's new. The brain knows this and will attempt to frame trading one for the other as a reasonable compromise — "at least I'm not doing X."
      </p>
      <p className="caption" style={{ marginTop: 8 }}>
        It is not a compromise. It is the same avoidance in different clothing. Both circuits are healing. Let both heal.
      </p>
    </div>
  );
}

export default function Tools({ config }) {
  const streaks = useStreaks(config.addictions);

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 4 }}>Tools</h1>
        <p className="muted">Practical support for when you need it.</p>
      </div>

      <LesserEvilCard streaks={streaks} />
      <UrgeSurfTimer />
      <MeaningPrompt config={config} />
      <CravingLog />

      <div style={{ height: 40 }} />
    </>
  );
}
