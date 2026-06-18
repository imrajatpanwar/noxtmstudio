import PageHeader from '../components/PageHeader.jsx';
import { Link } from 'react-router-dom';

const PROJECTS = [
  { title: 'Ledger — Fintech dashboard', tag: 'Product Design', blurb: 'Reimagined a dense analytics suite into a calm, focused workspace.' },
  { title: 'Orbit — SaaS rebrand', tag: 'Brand & Identity', blurb: 'A bold new identity that lifted brand recall across launch markets.' },
  { title: 'Pulse — Health mobile app', tag: 'Product Design', blurb: 'Patient onboarding redesigned to cut drop-off by nearly half.' },
  { title: 'Atlas — Design system', tag: 'Design Systems', blurb: 'A 120-component library unifying six product teams.' },
  { title: 'Nimbus — Marketplace', tag: 'Product Design', blurb: 'Seller tooling that made listings 3x faster to publish.' },
  { title: 'Verve — Marketing site', tag: 'Brand & Identity', blurb: 'A conversion-focused site with a distinctive editorial voice.' },
];

const COLORS = ['#c8a24a', '#5b8def', '#46b08c', '#d06b6b', '#9b6bd0', '#d0976b'];

export default function Work() {
  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="Selected projects"
        sub="A glimpse at products and brands we've helped shape. Original case studies available on request."
      />
      <section className="container-x py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <div key={i} className="card overflow-hidden p-0">
              <div className="h-44 w-full" style={{ background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}33, ${COLORS[i % COLORS.length]}10)` }} />
              <div className="p-6">
                <span className="eyebrow">{p.tag}</span>
                <h2 className="mt-2 text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted">{p.blurb}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact" className="btn-ghost">Request full case studies</Link>
        </div>
      </section>
    </div>
  );
}
