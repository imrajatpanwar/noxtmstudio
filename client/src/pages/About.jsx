import HowItWorks from '../components/HowItWorks.jsx';
import { Link } from 'react-router-dom';

const PROCESS = [
  { num: '01', step: 'Audit', detail: 'Brand analysis, competitor teardown, platform diagnostics.' },
  { num: '02', step: 'Roadmap', detail: 'Data-backed growth plan tied to real business outcomes.' },
  { num: '03', step: 'Production', detail: 'Scripts, visuals, reels — all in-house. Nothing outsourced.' },
  { num: '04', step: 'Manage', detail: 'Daily posting, engagement, and reporting across every platform.' },
  { num: '05', step: 'Scale', detail: 'Monthly reviews, optimisation cycles, new channel expansion.' },
];

export default function About() {
  return (
    <div className="bg-[#F5F2ED] text-[#1A1A18]">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/8">
        {/* grid lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 75%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 75%)',
          }}
        />
        <div className="container-x relative z-10 grid items-center gap-12 py-24 md:grid-cols-[1fr_380px] md:py-32">

          {/* Left */}
          <div>
            <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#3A5E48]">
              About Noxtm Studio
            </span>
            <h1 className="mt-5 text-5xl font-bold leading-[1.06] md:text-[4rem]" style={{ fontFamily: "'Gambetta', serif" }}>
              Senior-led. In-house production.{' '}
              <span className="text-[#3A5E48]">Zero overhead.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-black/50">
              Noxtm Studio is a full-service social media growth agency. We handle everything from strategy to daily execution so you never have to think about content again.
            </p>
          </div>

          {/* Right — glass card */}
          <div
            className="rounded-2xl border border-white/60 p-6 shadow-xl"
            style={{
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">The process</p>
            <div className="divide-y divide-black/6">
              {PROCESS.map((item) => (
                <div key={item.num} className="flex gap-3 py-3">
                  <span className="shrink-0 text-[10px] font-semibold tabular-nums text-black/25 pt-0.5">{item.num}</span>
                  <div>
                    <p className="text-xs font-semibold text-[#1A1A18]">{item.step}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-black/45">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/contact"
              className="mt-5 block w-full rounded-full bg-[#3A5E48] py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[#2f4e3b]"
            >
              Apply for a Spot →
            </Link>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS — dark contrast */}
      <HowItWorks />

    </div>
  );
}
