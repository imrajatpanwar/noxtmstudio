import { useEffect, useState } from 'react';
import api from '../api.js';

export default function SettingsAdmin() {
  const [s, setS] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/settings').then((r) => setS(r.data)).catch(() => {});
  }, []);

  if (!s) return <p className="text-muted">Loading…</p>;

  const set = (k) => (e) => setS((p) => ({ ...p, [k]: e.target.value }));
  const social = (k) => (e) => setS((p) => ({ ...p, socials: { ...p.socials, [k]: e.target.value } }));

  const save = async () => {
    await api.put('/settings', s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Site settings</h1>

      <div className="mt-8 card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Site name</label><input className="field" value={s.siteName} onChange={set('siteName')} /></div>
          <div><label className="label">Logo text</label><input className="field" value={s.logoText} onChange={set('logoText')} /></div>
        </div>
        <div><label className="label">Tagline</label><input className="field" value={s.tagline} onChange={set('tagline')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Contact email</label><input className="field" value={s.contactEmail} onChange={set('contactEmail')} /></div>
          <div><label className="label">Contact phone</label><input className="field" value={s.contactPhone} onChange={set('contactPhone')} /></div>
        </div>
        <div><label className="label">Address</label><input className="field" value={s.address} onChange={set('address')} /></div>
      </div>

      <div className="mt-6 card space-y-4">
        <h2 className="font-semibold">Social links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">LinkedIn</label><input className="field" value={s.socials?.linkedin || ''} onChange={social('linkedin')} /></div>
          <div><label className="label">Twitter / X</label><input className="field" value={s.socials?.twitter || ''} onChange={social('twitter')} /></div>
          <div><label className="label">Instagram</label><input className="field" value={s.socials?.instagram || ''} onChange={social('instagram')} /></div>
          <div><label className="label">Dribbble</label><input className="field" value={s.socials?.dribbble || ''} onChange={social('dribbble')} /></div>
        </div>
      </div>

      <div className="mt-6 card space-y-4">
        <h2 className="font-semibold">Instagram Audit Login</h2>
        <p className="text-xs text-muted">Dedicated IG account for scraping public profiles. Avoid using your main account.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">IG Username</label><input className="field" value={s.igAuditUser || ''} onChange={set('igAuditUser')} placeholder="noxtmcrawler" /></div>
          <div><label className="label">IG Password</label><input className="field" type="password" value={s.igAuditPass || ''} onChange={set('igAuditPass')} placeholder="••••••••" /></div>
        </div>
        {s.igCookiesAt && <p className="text-xs text-muted">Session cached: {new Date(s.igCookiesAt).toLocaleString()}</p>}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary">Save settings</button>
        {saved && <span className="text-sm text-green-400">Saved!</span>}
      </div>
    </div>
  );
}
