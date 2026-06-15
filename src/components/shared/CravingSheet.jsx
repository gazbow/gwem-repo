import { useState } from 'react';

export default function CravingSheet({ streaks, onLog, onClose }) {
  const [selectedId, setSelectedId] = useState(streaks[0]?.id || '');
  const [intensity, setIntensity] = useState(3);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h3 style={{ marginBottom: 16 }}>Log a craving</h3>

        {streaks.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <p className="label" style={{ marginBottom: 8 }}>Which one?</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {streaks.map(s => (
                <button
                  key={s.id}
                  className={`chip ${selectedId === s.id ? 'selected' : ''}`}
                  onClick={() => setSelectedId(s.id)}
                >
                  {s.icon} {s.profile.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <p className="label" style={{ marginBottom: 12 }}>Intensity</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setIntensity(n)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  border: '2px solid',
                  borderColor: intensity >= n ? 'var(--orange)' : 'var(--bg4)',
                  background: intensity >= n ? '#ff9f0a18' : 'var(--bg3)',
                  color: intensity >= n ? 'var(--orange)' : 'var(--text3)',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="muted" style={{ textAlign: 'center', marginTop: 8, fontSize: 13 }}>
            {intensity === 1 ? 'Barely there' : intensity === 2 ? 'Noticeable' : intensity === 3 ? 'Significant' : intensity === 4 ? 'Strong' : 'Peak'}
          </p>
        </div>

        <p className="caption" style={{ marginBottom: 20, fontStyle: 'italic', textAlign: 'center', color: 'var(--text3)' }}>
          Set the 15-minute timer on the Tools tab. Observe. It will pass.
        </p>

        <button className="btn btn-primary" onClick={() => onLog(selectedId, intensity)}>
          Log it
        </button>
      </div>
    </div>
  );
}
