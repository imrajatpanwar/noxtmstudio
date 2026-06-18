import { useEffect, useState } from 'react';
import api from '../api.js';

export default function ChatAdmin() {
  const [config, setConfig] = useState(null);
  const [convos, setConvos] = useState([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/chat/admin/config').then((r) => setConfig(r.data)).catch(() => {});
    api.get('/chat/admin/conversations').then((r) => setConvos(r.data)).catch(() => {});
  }, []);

  if (!config) return <p className="text-muted">Loading…</p>;

  const set = (k) => (e) => setConfig((c) => ({ ...c, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const setRule = (i, field) => (e) => {
    const rules = [...config.rules];
    rules[i] = { ...rules[i], [field]: field === 'keywords' ? e.target.value.split(',').map((s) => s.trim()).filter(Boolean) : e.target.value };
    setConfig((c) => ({ ...c, rules }));
  };
  const addRule = () => setConfig((c) => ({ ...c, rules: [...c.rules, { keywords: [], answer: '' }] }));
  const removeRule = (i) => setConfig((c) => ({ ...c, rules: c.rules.filter((_, idx) => idx !== i) }));

  const save = async () => {
    await api.put('/chat/admin/config', config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Chatbot</h1>

      <div className="mt-8 card space-y-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={config.enabled} onChange={set('enabled')} /> Enable chat widget on site
        </label>
        <div>
          <label className="label">Widget title</label>
          <input className="field" value={config.title} onChange={set('title')} />
        </div>
        <div>
          <label className="label">Welcome message</label>
          <input className="field" value={config.welcome} onChange={set('welcome')} />
        </div>
        <div>
          <label className="label">Fallback reply (when no rule matches)</label>
          <input className="field" value={config.fallback} onChange={set('fallback')} />
        </div>
      </div>

      <div className="mt-6 card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Auto-reply rules</h2>
          <button onClick={addRule} className="btn-ghost px-3 py-1.5 text-xs">+ Add rule</button>
        </div>
        <p className="mt-1 text-xs text-muted">If a visitor message contains any keyword, the bot replies with the answer.</p>
        <div className="mt-4 space-y-4">
          {config.rules.map((r, i) => (
            <div key={i} className="rounded-xl border border-black/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">Rule {i + 1}</span>
                <button onClick={() => removeRule(i)} className="text-xs text-red-300">Remove</button>
              </div>
              <label className="label mt-2">Keywords (comma separated)</label>
              <input className="field" value={(r.keywords || []).join(', ')} onChange={setRule(i, 'keywords')} />
              <label className="label mt-2">Answer</label>
              <textarea className="field min-h-[60px]" value={r.answer} onChange={setRule(i, 'answer')} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary">Save chatbot config</button>
        {saved && <span className="text-sm text-green-400">Saved!</span>}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold">Recent conversations</h2>
        <div className="mt-4 space-y-3">
          {convos.map((c) => (
            <div key={c._id} className="card">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>{c.contactEmail || 'Anonymous visitor'}</span>
                <span>{new Date(c.updatedAt).toLocaleString()}</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {c.messages.map((m, i) => (
                  <div key={i} className={`text-sm ${m.from === 'bot' ? 'text-accent' : ''}`}>
                    <span className="text-muted">{m.from === 'bot' ? 'Bot' : 'User'}:</span> {m.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {convos.length === 0 && <p className="text-muted">No conversations yet.</p>}
        </div>
      </div>
    </div>
  );
}
