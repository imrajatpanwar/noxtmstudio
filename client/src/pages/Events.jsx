import { useEffect, useState } from 'react';
import api from '../api.js';
import PageHeader from '../components/PageHeader.jsx';

const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '');

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events').then((r) => setEvents(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Events" title="Where you can find us" sub="Workshops, talks, and design jams we're hosting or joining." />
      <section className="container-x py-20">
        {loading ? (
          <p className="text-muted">Loading…</p>
        ) : events.length === 0 ? (
          <p className="text-muted">No upcoming events. Check back soon.</p>
        ) : (
          <div className="space-y-4">
            {events.map((e) => (
              <div key={e._id} className="card flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-accent">
                    {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ''}
                  </div>
                  <h2 className="mt-1 text-xl font-semibold">{e.title}</h2>
                  <p className="mt-1 text-sm text-muted">{e.description}</p>
                  {e.location && <p className="mt-1 text-xs text-muted">📍 {e.location}</p>}
                </div>
                {e.url && (
                  <a href={e.url} target="_blank" rel="noreferrer" className="btn-ghost shrink-0">
                    Details
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
