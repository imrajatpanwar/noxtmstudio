import { useEffect, useState } from 'react';
import api from '../api.js';

const DEFAULT = {
  hero: { eyebrow: '', headline: '', sub: '', ctaPrimary: { label: '', href: '' }, ctaSecondary: { label: '', href: '' } },
  stats: [],
  services: [],
  ctaBand: { headline: '', sub: '', cta: { label: '', href: '' } },
};

export default function PagesAdmin() {
  const [s, setS] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/pages/home').then((r) => {
      setS({ ...DEFAULT, ...(r.data?.sections || {}) });
    }).catch(() => {});
  }, []);

  const hero = (k) => (e) => setS((p) => ({ ...p, hero: { ...p.hero, [k]: e.target.value } }));
  const heroCta = (cta, k) => (e) => setS((p) => ({ ...p, hero: { ...p.hero, [cta]: { ...p.hero[cta], [k]: e.target.value } } }));
  const band = (k) => (e) => setS((p) => ({ ...p, ctaBand: { ...p.ctaBand, [k]: e.target.value } }));
  const bandCta = (k) => (e) => setS((p) => ({ ...p, ctaBand: { ...p.ctaBand, cta: { ...p.ctaBand.cta, [k]: e.target.value } } }));

  const setStat = (i, k) => (e) => { const stats = [...s.stats]; stats[i] = { ...stats[i], [k]: e.target.value }; setS((p) => ({ ...p, stats })); };
  const addStat = () => setS((p) => ({ ...p, stats: [...p.stats, { value: '', label: '' }] }));
  const delStat = (i) => setS((p) => ({ ...p, stats: p.stats.filter((_, x) => x !== i) }));

  const setSvc = (i, k) => (e) => { const services = [...s.services]; services[i] = { ...services[i], [k]: e.target.value }; setS((p) => ({ ...p, services })); };
  const addSvc = () => setS((p) => ({ ...p, services: [...p.services, { title: '', desc: '' }] }));
  const delSvc = (i) => setS((p) => ({ ...p, services: p.services.filter((_, x) => x !== i) }));

  const save = async () => {
    await api.put('/pages/home', { title: 'Home', sections: s, published: true });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Home page content</h1>
      <p className="mt-1 text-muted">Edit the homepage hero, stats, services, and call-to-action band.</p>

      <div className="mt-8 card space-y-4">
        <h2 className="font-semibold">Hero</h2>
        <div><label className="label">Eyebrow</label><input className="field" value={s.hero.eyebrow} onChange={hero('eyebrow')} /></div>
        <div><label className="label">Headline</label><input className="field" value={s.hero.headline} onChange={hero('headline')} /></div>
        <div><label className="label">Subtext</label><textarea className="field min-h-[60px]" value={s.hero.sub} onChange={hero('sub')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Primary button label</label><input className="field" value={s.hero.ctaPrimary?.label || ''} onChange={heroCta('ctaPrimary', 'label')} /></div>
          <div><label className="label">Primary button link</label><input className="field" value={s.hero.ctaPrimary?.href || ''} onChange={heroCta('ctaPrimary', 'href')} /></div>
          <div><label className="label">Secondary button label</label><input className="field" value={s.hero.ctaSecondary?.label || ''} onChange={heroCta('ctaSecondary', 'label')} /></div>
          <div><label className="label">Secondary button link</label><input className="field" value={s.hero.ctaSecondary?.href || ''} onChange={heroCta('ctaSecondary', 'href')} /></div>
        </div>
      </div>

      <div className="mt-6 card">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Stats</h2><button onClick={addStat} className="btn-ghost px-3 py-1.5 text-xs">+ Add</button></div>
        <div className="mt-4 space-y-3">
          {s.stats.map((st, i) => (
            <div key={i} className="flex gap-3">
              <input className="field" placeholder="120+" value={st.value} onChange={setStat(i, 'value')} />
              <input className="field" placeholder="Products shipped" value={st.label} onChange={setStat(i, 'label')} />
              <button onClick={() => delStat(i)} className="btn-ghost px-3 py-2 text-xs text-red-300">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 card">
        <div className="flex items-center justify-between"><h2 className="font-semibold">Services</h2><button onClick={addSvc} className="btn-ghost px-3 py-1.5 text-xs">+ Add</button></div>
        <div className="mt-4 space-y-3">
          {s.services.map((sv, i) => (
            <div key={i} className="flex gap-3">
              <input className="field max-w-[12rem]" placeholder="Title" value={sv.title} onChange={setSvc(i, 'title')} />
              <input className="field" placeholder="Description" value={sv.desc} onChange={setSvc(i, 'desc')} />
              <button onClick={() => delSvc(i)} className="btn-ghost px-3 py-2 text-xs text-red-300">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 card space-y-4">
        <h2 className="font-semibold">CTA band</h2>
        <div><label className="label">Headline</label><input className="field" value={s.ctaBand.headline} onChange={band('headline')} /></div>
        <div><label className="label">Subtext</label><input className="field" value={s.ctaBand.sub} onChange={band('sub')} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Button label</label><input className="field" value={s.ctaBand.cta?.label || ''} onChange={bandCta('label')} /></div>
          <div><label className="label">Button link</label><input className="field" value={s.ctaBand.cta?.href || ''} onChange={bandCta('href')} /></div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={save} className="btn-primary">Save home page</button>
        {saved && <span className="text-sm text-green-400">Saved!</span>}
      </div>
    </div>
  );
}
