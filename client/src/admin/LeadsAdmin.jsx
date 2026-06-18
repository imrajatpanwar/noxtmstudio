import { useEffect, useState } from 'react';
import api from '../api.js';

const STATUSES = ['new', 'contacted', 'won', 'lost'];
const COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
};

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    const q = filter ? `?status=${filter}` : '';
    api.get(`/leads${q}`).then((r) => setLeads(r.data)).catch(() => {});
  };
  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/leads/${id}`, { status });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await api.delete(`/leads/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Leads</h1>
        <select className="field w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="mt-8 space-y-3">
        {leads.map((l) => (
          <div key={l._id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{l.name}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${COLORS[l.status]}`}>{l.status}</span>
                  <span className="rounded-full bg-line px-2 py-0.5 text-[11px] text-muted">{l.source}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  <a href={`mailto:${l.email}`} className="text-accent">{l.email}</a>
                  {l.phone ? ` · ${l.phone}` : ''}{l.company ? ` · ${l.company}` : ''}
                </p>
                {l.message && <p className="mt-2 text-sm">{l.message}</p>}
                <p className="mt-2 text-xs text-muted">{new Date(l.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <select className="field w-auto py-1.5 text-xs" value={l.status} onChange={(e) => updateStatus(l._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => remove(l._id)} className="btn-ghost px-3 py-1.5 text-xs text-red-300">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {leads.length === 0 && <p className="text-muted">No leads yet.</p>}
      </div>
    </div>
  );
}
