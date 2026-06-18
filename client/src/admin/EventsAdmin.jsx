import { useEffect, useState } from 'react';
import api from '../api.js';

const EMPTY = { title: '', description: '', location: '', coverImage: '', startDate: '', endDate: '', url: '', published: true };

const toInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '');

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/events?all=1').then((r) => setEvents(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const startEdit = (e) => setEditing({ ...e, startDate: toInput(e.startDate), endDate: toInput(e.endDate) });

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...editing };
    if (editing._id) await api.put(`/events/${editing._id}`, payload);
    else await api.post('/events', payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this event?')) return;
    await api.delete(`/events/${id}`);
    load();
  };

  const set = (k) => (e) => setEditing((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Events</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary">+ New event</button>
      </div>

      <div className="mt-8 space-y-3">
        {events.map((e) => (
          <div key={e._id} className="card flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-muted">{toInput(e.startDate)} · {e.location || 'TBD'}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(e)} className="btn-ghost px-4 py-2">Edit</button>
              <button onClick={() => remove(e._id)} className="btn-ghost px-4 py-2 text-red-300">Delete</button>
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-muted">No events yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-6">
          <form onSubmit={save} className="card my-8 w-full max-w-2xl space-y-4">
            <h2 className="font-display text-xl font-bold">{editing._id ? 'Edit event' : 'New event'}</h2>
            <div>
              <label className="label">Title</label>
              <input className="field" value={editing.title} onChange={set('title')} required />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="field min-h-[80px]" value={editing.description} onChange={set('description')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Start date</label>
                <input type="date" className="field" value={editing.startDate} onChange={set('startDate')} required />
              </div>
              <div>
                <label className="label">End date</label>
                <input type="date" className="field" value={editing.endDate} onChange={set('endDate')} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Location</label>
                <input className="field" value={editing.location} onChange={set('location')} />
              </div>
              <div>
                <label className="label">URL</label>
                <input className="field" value={editing.url} onChange={set('url')} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.published} onChange={set('published')} /> Published
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
              <button className="btn-primary">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
