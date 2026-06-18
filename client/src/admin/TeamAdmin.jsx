import { useEffect, useState } from 'react';
import api from '../api.js';

const EMPTY = { name: '', role: '', bio: '', photo: '', order: 0, published: true, socials: { linkedin: '', twitter: '', dribbble: '' } };

export default function TeamAdmin() {
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/team?all=1').then((r) => setMembers(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editing._id) await api.put(`/team/${editing._id}`, editing);
    else await api.post('/team', editing);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this member?')) return;
    await api.delete(`/team/${id}`);
    load();
  };

  const set = (k) => (e) => setEditing((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setSocial = (k) => (e) => setEditing((p) => ({ ...p, socials: { ...p.socials, [k]: e.target.value } }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Team</h1>
        <button onClick={() => setEditing({ ...EMPTY })} className="btn-primary">+ New member</button>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {members.map((m) => (
          <div key={m._id} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3A5E48]/10 font-display text-[#3A5E48] font-semibold">{m.name?.[0]}</div>
              <div>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="text-sm text-muted">{m.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing({ ...EMPTY, ...m, socials: { ...EMPTY.socials, ...(m.socials || {}) } })} className="btn-ghost px-3 py-1.5 text-xs">Edit</button>
              <button onClick={() => remove(m._id)} className="btn-ghost px-3 py-1.5 text-xs text-red-300">Delete</button>
            </div>
          </div>
        ))}
        {members.length === 0 && <p className="text-muted">No team members yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-6">
          <form onSubmit={save} className="card my-8 w-full max-w-xl space-y-4">
            <h2 className="font-display text-xl font-bold">{editing._id ? 'Edit member' : 'New member'}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input className="field" value={editing.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Role</label>
                <input className="field" value={editing.role} onChange={set('role')} />
              </div>
            </div>
            <div>
              <label className="label">Photo URL</label>
              <input className="field" value={editing.photo} onChange={set('photo')} />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea className="field min-h-[80px]" value={editing.bio} onChange={set('bio')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="label">LinkedIn</label>
                <input className="field" value={editing.socials.linkedin} onChange={setSocial('linkedin')} />
              </div>
              <div>
                <label className="label">Twitter</label>
                <input className="field" value={editing.socials.twitter} onChange={setSocial('twitter')} />
              </div>
              <div>
                <label className="label">Dribbble</label>
                <input className="field" value={editing.socials.dribbble} onChange={setSocial('dribbble')} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Order</label>
                <input type="number" className="field" value={editing.order} onChange={set('order')} />
              </div>
              <label className="flex items-end gap-2 pb-3 text-sm">
                <input type="checkbox" checked={editing.published} onChange={set('published')} /> Published
              </label>
            </div>
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
