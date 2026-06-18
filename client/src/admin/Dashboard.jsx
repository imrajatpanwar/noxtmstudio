import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

export default function Dashboard() {
  const [counts, setCounts] = useState({ posts: 0, events: 0, team: 0, leads: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/posts?all=1'),
      api.get('/events?all=1'),
      api.get('/team?all=1'),
      api.get('/leads'),
    ]).then(([p, e, t, l]) => {
      setCounts({ posts: p.data.length, events: e.data.length, team: t.data.length, leads: l.data.length });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Blog posts', value: counts.posts, to: '/admin/posts' },
    { label: 'Events', value: counts.events, to: '/admin/events' },
    { label: 'Team members', value: counts.team, to: '/admin/team' },
    { label: 'Leads', value: counts.leads, to: '/admin/leads' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted">Manage everything on the Noxtm Studio site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="card transition hover:border-accent">
            <div className="font-display text-4xl font-bold text-accent">{c.value}</div>
            <div className="mt-1 text-sm text-muted">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link to="/admin/pages" className="card hover:border-accent">
          <h3 className="font-semibold">Edit home page</h3>
          <p className="mt-1 text-sm text-muted">Update hero, stats, and services content.</p>
        </Link>
        <Link to="/admin/chat" className="card hover:border-accent">
          <h3 className="font-semibold">Configure chatbot</h3>
          <p className="mt-1 text-sm text-muted">Set welcome message and auto-reply rules.</p>
        </Link>
      </div>
    </div>
  );
}
