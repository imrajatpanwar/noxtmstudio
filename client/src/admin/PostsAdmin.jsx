import { useEffect, useState } from 'react';
import api from '../api.js';

const EMPTY = { title: '', slug: '', excerpt: '', body: '', coverImage: '', author: 'Noxtm Studio', tags: '', published: false };

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function PostsAdmin() {
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null); // null | EMPTY | post

  const load = () => api.get('/posts?all=1').then((r) => setPosts(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const startNew = () => setEditing({ ...EMPTY });
  const startEdit = (p) => setEditing({ ...p, tags: (p.tags || []).join(', ') });

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      tags: editing.tags ? editing.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    if (editing._id) await api.put(`/posts/${editing._id}`, payload);
    else await api.post('/posts', payload);
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    load();
  };

  const set = (k) => (e) => setEditing((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Blog posts</h1>
        <button onClick={startNew} className="btn-primary">+ New post</button>
      </div>

      <div className="mt-8 space-y-3">
        {posts.map((p) => (
          <div key={p._id} className="card flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{p.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-[11px] ${p.published ? 'bg-green-100 text-green-700' : 'bg-black/8 text-black/40'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-sm text-muted">/blog/{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="btn-ghost px-4 py-2">Edit</button>
              <button onClick={() => remove(p._id)} className="btn-ghost px-4 py-2 text-red-300">Delete</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="text-muted">No posts yet.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 backdrop-blur-sm p-6">
          <form onSubmit={save} className="card my-8 w-full max-w-2xl space-y-4">
            <h2 className="font-display text-xl font-bold">{editing._id ? 'Edit post' : 'New post'}</h2>
            <div>
              <label className="label">Title</label>
              <input className="field" value={editing.title} onChange={set('title')} required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Slug (auto if blank)</label>
                <input className="field" value={editing.slug} onChange={set('slug')} placeholder={slugify(editing.title)} />
              </div>
              <div>
                <label className="label">Author</label>
                <input className="field" value={editing.author} onChange={set('author')} />
              </div>
            </div>
            <div>
              <label className="label">Cover image URL</label>
              <input className="field" value={editing.coverImage} onChange={set('coverImage')} />
            </div>
            <div>
              <label className="label">Tags (comma separated)</label>
              <input className="field" value={editing.tags} onChange={set('tags')} />
            </div>
            <div>
              <label className="label">Excerpt</label>
              <textarea className="field min-h-[60px]" value={editing.excerpt} onChange={set('excerpt')} />
            </div>
            <div>
              <label className="label">Body</label>
              <textarea className="field min-h-[160px]" value={editing.body} onChange={set('body')} />
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
