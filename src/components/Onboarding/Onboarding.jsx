import { useState } from 'react';
import { ADDICTION_OPTIONS } from '../../data/phases.js';

const STEPS = ['welcome', 'pick', 'dates', 'options', 'done'];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState([]);
  const [startDates, setStartDates] = useState({});
  const [bodyTracking, setBodyTracking] = useState(true);
  const [journalPrompts, setJournalPrompts] = useState(true);
  const [customName, setCustomName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  function toggleAddiction(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    if (!startDates[id]) {
      setStartDates(prev => ({ ...prev, [id]: today }));
    }
  }

  function addCustom() {
    if (!customName.trim()) return;
    const id = 'custom_' + customName.toLowerCase().replace(/\s+/g, '_');
    setSelected(prev => [...prev, id]);
    setStartDates(prev => ({ ...prev, [id]: today }));
    setCustomName('');
    setShowCustom(false);
  }

  function finish() {
    const addictions = selected.map(id => {
      const opt = ADDICTION_OPTIONS.find(o => o.id === id);
      return {
        id,
        label: opt ? opt.label : id.replace('custom_', '').replace(/_/g, ' '),
        startDate: startDates[id] || today,
        active: true,
      };
    });
    onComplete({
      version: 1,
      onboardingComplete: true,
      bodyTrackingEnabled: bodyTracking,
      journalPromptsEnabled: journalPrompts,
      addictions,
      createdAt: new Date().toISOString(),
    });
  }

  const canAdvancePick = selected.length > 0;
  const canAdvanceDates = selected.every(id => startDates[id]);

  return (
    <div className="app" style={{ justifyContent: 'center' }}>
      <div className="screen" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

        {step === 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0' }}>
            <p className="label" style={{ marginBottom: 12 }}>Ironframe</p>
            <h1 style={{ marginBottom: 16, lineHeight: 1.15 }}>
              Recovery built on clarity, not willpower.
            </h1>
            <p className="caption" style={{ marginBottom: 32 }}>
              Track what you're stepping away from. Get the right framework for exactly where you are — day by day.
            </p>
            <p className="muted" style={{ marginBottom: 40 }}>
              Everything stays on your device. No accounts, no data shared.
            </p>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Get started
            </button>
          </div>
        )}

        {step === 1 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: 6 }}>What are you stepping away from?</h2>
            <p className="muted" style={{ marginBottom: 20 }}>Select one or more. You can track several at once.</p>

            <div style={{ flex: 1 }}>
              {ADDICTION_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  className={`chip ${selected.includes(opt.id) ? 'selected' : ''}`}
                  style={{ display: 'flex', width: '100%', marginBottom: 8, justifyContent: 'flex-start' }}
                  onClick={() => toggleAddiction(opt.id)}
                >
                  <span style={{ fontSize: 20 }}>{opt.icon}</span>
                  <span>{opt.label}</span>
                  {selected.includes(opt.id) && <span style={{ marginLeft: 'auto', color: 'var(--blue)' }}>✓</span>}
                </button>
              ))}

              {showCustom ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <input
                    type="text"
                    placeholder="Name it"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustom()}
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <button className="btn btn-ghost" style={{ width: 'auto', padding: '12px 16px' }} onClick={addCustom}>Add</button>
                </div>
              ) : (
                <button
                  className="chip"
                  style={{ display: 'flex', width: '100%', marginTop: 4 }}
                  onClick={() => setShowCustom(true)}
                >
                  <span style={{ fontSize: 20 }}>＋</span>
                  <span>Something else</span>
                </button>
              )}

              {selected.filter(id => id.startsWith('custom_')).map(id => (
                <div key={id} className="chip selected" style={{ display: 'flex', width: '100%', marginTop: 8 }}>
                  <span>📌</span>
                  <span>{id.replace('custom_', '').replace(/_/g, ' ')}</span>
                  <span
                    style={{ marginLeft: 'auto', color: 'var(--text3)', cursor: 'pointer' }}
                    onClick={() => setSelected(prev => prev.filter(x => x !== id))}
                  >✕</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!canAdvancePick}
                style={{ opacity: canAdvancePick ? 1 : 0.4 }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: 6 }}>When did you start?</h2>
            <p className="muted" style={{ marginBottom: 20 }}>
              The day you last used it — or today if this is day one.
            </p>

            <div style={{ flex: 1 }}>
              {selected.map(id => {
                const opt = ADDICTION_OPTIONS.find(o => o.id === id);
                const label = opt ? opt.label : id.replace('custom_', '').replace(/_/g, ' ');
                const icon = opt ? opt.icon : '📌';
                return (
                  <div key={id} className="card-sm" style={{ marginBottom: 10 }}>
                    <p style={{ marginBottom: 8, fontWeight: 600 }}>{icon} {label}</p>
                    <p className="muted" style={{ marginBottom: 6, fontSize: 12 }}>Day 1 was:</p>
                    <input
                      type="date"
                      value={startDates[id] || today}
                      max={today}
                      onChange={e => setStartDates(prev => ({ ...prev, [id]: e.target.value }))}
                    />
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)} disabled={!canAdvanceDates}
                style={{ flex: 2, opacity: canAdvanceDates ? 1 : 0.4 }}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: 6 }}>A few options</h2>
            <p className="muted" style={{ marginBottom: 20 }}>You can change these any time.</p>

            <div className="card" style={{ flex: 0 }}>
              <div className="toggle-row">
                <div>
                  <p style={{ fontWeight: 600 }}>Daily journal prompts</p>
                  <p className="muted" style={{ fontSize: 13, marginTop: 3 }}>One focused question each day, tailored to where you are.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={journalPrompts} onChange={e => setJournalPrompts(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="toggle-row">
                <div>
                  <p style={{ fontWeight: 600 }}>Body stats tracker</p>
                  <p className="muted" style={{ fontSize: 13, marginTop: 3 }}>Log weight and waist over time. See what the change is doing to your body.</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={bodyTracking} onChange={e => setBodyTracking(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => setStep(4)}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>⚒️</p>
            <h1 style={{ marginBottom: 16, lineHeight: 1.15 }}>
              You're set.
            </h1>
            <p className="caption" style={{ marginBottom: 16 }}>
              You'll get the right framework for exactly where you are — day by day, phase by phase.
            </p>
            <p className="caption" style={{ marginBottom: 40 }}>
              No cheerleading. No judgment. Just clarity and the right thought at the right time.
            </p>
            <button className="btn btn-primary" onClick={finish}>
              Open Ironframe
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
