import { useState, useEffect } from 'react';
import { useJournal } from '../../hooks/useConfig.js';
import { useStreaks } from '../../hooks/useStreak.js';
import { getPhaseForDay } from '../../data/phases.js';
import { getDailyPrompt } from '../../data/journalPrompts.js';

export default function Journal({ config }) {
  const { entries, saveEntry } = useJournal();
  const streaks = useStreaks(config.addictions);
  const [text, setText] = useState('');

  const today = new Date().toISOString().slice(0, 10);
  const todayEntry = entries.find(e => e.date === today);

  useEffect(() => {
    if (todayEntry) setText(todayEntry.text || '');
  }, []);

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const prompt = config.journalPromptsEnabled ? getDailyPrompt(dayOfYear) : null;

  // Phase prompt from first streak
  const phasePrompt = streaks[0]?.phase?.journalPrompt;

  const activePrompt = phasePrompt || prompt;

  function handleBlur() {
    if (!text.trim()) return;
    const meta = {
      streakDays: Object.fromEntries(streaks.map(s => [s.id, s.day])),
    };
    saveEntry(today, text, meta);
  }

  const dateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ marginBottom: 4 }}>Journal</h1>
        <p className="muted">{dateStr}</p>
      </div>

      {activePrompt && (
        <div className="card" style={{ borderLeft: '3px solid var(--blue)', marginBottom: 16 }}>
          <p className="label" style={{ marginBottom: 8 }}>Today's prompt</p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text2)', fontStyle: 'italic' }}>
            "{activePrompt}"
          </p>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder="Write here. It saves automatically when you leave."
          style={{ minHeight: 160 }}
        />
      </div>

      {entries.length > 0 && (
        <div>
          <p className="label" style={{ marginBottom: 12 }}>Previous entries</p>
          {entries
            .filter(e => e.date !== today)
            .map((entry, i) => {
              const d = new Date(entry.date);
              const label = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
              const dayNums = entry.streakDays
                ? Object.entries(entry.streakDays).map(([id, day]) => `${id} D${day}`).join(' · ')
                : '';
              return (
                <HistoryEntry key={i} label={label} dayNums={dayNums} text={entry.text} />
              );
            })}
        </div>
      )}

      <div style={{ height: 40 }} />
    </>
  );
}

function HistoryEntry({ label, dayNums, text }) {
  const [open, setOpen] = useState(false);
  const preview = text?.slice(0, 80) + (text?.length > 80 ? '…' : '');

  return (
    <div className="card-sm" style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
        {dayNums && <p className="muted" style={{ fontSize: 12 }}>{dayNums}</p>}
      </div>
      <p className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>
        {open ? text : preview}
      </p>
    </div>
  );
}
