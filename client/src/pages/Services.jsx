import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import imgAashna from './Assets/Influencers/Aashna Arora.png';
import imgAnshika from './Assets/Influencers/Anshika Kaur .png';
import imgIshika from './Assets/Influencers/Ishika Sahni.png';
import imgIshita from './Assets/Influencers/Ishita Anand.png';
import imgMansu from './Assets/Influencers/Mansu Rathore.png';
import imgNived from './Assets/Influencers/Nived Mishra.png';
import imgRohit from './Assets/Influencers/Rohit Goel.png';
import imgShivank from './Assets/Influencers/Shivank Bhalla.png';

const SERVICES = [
  {
    num: '01',
    title: 'Social Media Management',
    desc: 'Full account takeover — strategy, scheduling, posting, and daily engagement. We run your socials so you can focus on building the business.',
    points: ['Platform strategy & calendar', 'Daily posting & community replies', 'Hashtag & trend exploitation', 'Algorithm-first scheduling'],
  },
  {
    num: '02',
    title: 'Content Production',
    desc: 'In-house scripts, shoots, and edits. Reels, carousels, stories, and graphics — scroll-stopping content engineered for virality.',
    points: ['Short-form video (Reels / Shorts)', 'Carousel architecture', 'Premium graphics & templates', 'Copywriting & scripting'],
  },
  {
    num: '03',
    title: 'Growth Strategy',
    desc: 'Data-backed roadmaps built around your audience, competitors, and market. Not guesswork — calculated growth engineering.',
    points: ['Competitor espionage & gap analysis', '90-day growth roadmap', 'Hook testing & A/B frameworks', 'KPI tracking & pivots'],
  },
  {
    num: '04',
    title: 'Influencer & Creator Network',
    desc: 'Access our locked-in network of 1000+ creators, meme pages, and micro-influencers for instant distribution and credibility.',
    points: ['Creator matchmaking', 'Campaign management end-to-end', 'UGC army deployment', 'Meme page syndication'],
  },
  {
    num: '05',
    title: 'Brand & Identity',
    desc: 'Visual identity systems that make brands instantly recognizable — from logo to social templates to brand voice guidelines.',
    points: ['Logo & visual identity', 'Social media templates', 'Brand voice & tone guide', 'Marketing collateral'],
  },
  {
    num: '06',
    title: 'Analytics & Reporting',
    desc: 'Monthly performance readouts tied to real business outcomes. Not vanity metrics — revenue-linked intelligence.',
    points: ['Custom dashboards', 'Monthly performance reviews', 'CAC & ROI tracking', 'Actionable growth insights'],
  },
];

const SPEAKERS = [
  { name: 'Aashna Arora', role: '108K followers', img: imgAashna },
  { name: 'Anshika Kaur', role: '224K followers', img: imgAnshika },
  { name: 'Ishika Sahni', role: '65.8K followers', img: imgIshika },
  { name: 'Ishita Anand', role: '239K followers', img: imgIshita },
  { name: 'Mansu Rathore', role: '126K followers', img: imgMansu },
  { name: 'Nived Mishra', role: '405K followers', img: imgNived },
  { name: 'Rohit Goyal', role: '7.6M followers · AdultSociety', img: imgRohit },
  { name: 'Shivank Bhalla', role: '322K followers', img: imgShivank },
];

const NETWORK_STATS = [
  { value: '1,000+', label: 'Creators & Pages' },
  { value: '500+', label: 'Owned Meme Pages' },
  { value: '100+', label: 'Partner Brands' },
  { value: '40M+', label: 'Monthly Reach' },
];

const DISTRIBUTION = [
  'Instant reach via 500+ owned meme & niche pages',
  'Guaranteed distribution across 1000+ creators',
  'Strategic cross-collabs with 100+ partner brands',
  'Pod-based algorithmic amplification',
  'PR placement & media syndication',
  'WhatsApp "dark social" broadcast architecture',
  'Competitor audience hijacking',
  'Micro-UGC army deployment (100+ raw videos monthly)',
];

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Services() {
  return (
    <div className="bg-[#F5F2ED] text-[#1A1A18]">

      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden border-b border-black/8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 85%)',
          }}
        />
        <div className="container-x relative z-10 py-20 md:py-28">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">What we do</p>
            <h1 className="mt-4 max-w-3xl font-bold leading-[1.04]" style={{ fontFamily: "'Gambetta', serif", fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}>
              We don't manage accounts. <span className="text-[#3A5E48]">We build empires.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-black/50">
              From content production to distribution monopolies — everything your brand needs to dominate social media, under one retainer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[#3A5E48] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#22372B] hover:shadow-lg hover:shadow-[#3A5E48]/25"
              >
                Book Free Consultation
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/audit"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-[#1A1A18] transition hover:border-[#3A5E48]/40 hover:bg-black/5"
              >
                Free Social Audit
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────── SERVICES GRID ───────────── */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">Services</p>
              <h2 className="mt-3 text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
                Everything. Under one roof.
              </h2>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-black/40">
              One retainer. One senior team. No outsourcing, no templates, no excuses.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.num} delay={(i % 3) * 80} className="h-full">
              <div className="group relative flex h-full flex-col bg-white p-7 transition-colors duration-300 hover:bg-[#F5F2ED]">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-black/20 transition-colors group-hover:text-[#3A5E48]/50">
                    {s.num}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/8 text-xs text-black/20 opacity-0 transition-all duration-300 group-hover:border-[#3A5E48] group-hover:bg-[#3A5E48] group-hover:text-white group-hover:opacity-100">
                    →
                  </span>
                </div>
                <h3 className="mt-4 text-[17px] font-bold text-[#1A1A18] transition-colors group-hover:text-[#3A5E48]" style={{ fontFamily: "'Gambetta', serif" }}>
                  {s.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-black/45">{s.desc}</p>
                <ul className="mt-5 space-y-1.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-[12px] text-black/40">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-[#3A5E48]/40" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── HOW WE WORK ───────────── */}
      <section className="border-y border-black/8 bg-white">
        <div className="container-x py-16 md:py-20">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">The engine</p>
            <h2 className="mt-3 text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
              Content & <span className="text-[#3A5E48]">Distribution.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl bg-[#3A5E48] p-8 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">Production</span>
                <h3 className="mt-3 text-2xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>The Content Syndicate</h3>
                <p className="mt-3 text-sm text-white/70">
                  We take complete ownership of your brand's output. Aggressive, relentless production designed to monopolize your niche's attention.
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-white/80">
                  {[
                    'Uncapped short-form video (Reels / Shorts)',
                    'High-conversion carousel architecture',
                    'Premium hand-crafted visual assets',
                    'Community & DM response protocols',
                    'Monthly viral hook A/B testing',
                    'IG Story sales sequencing',
                    'AI-powered trend prediction mapping',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-[#8FB89A]">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="h-full rounded-2xl border border-black/8 bg-[#F5F2ED] p-8">
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">Distribution</span>
                <h3 className="mt-3 text-2xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>The Distribution Monopoly</h3>
                <p className="mt-3 text-sm text-black/50">
                  Best content dies without distribution. We don't wait for the algorithm — we hijack it using our proprietary network.
                </p>
                <ul className="mt-6 space-y-2.5 text-sm text-black/60">
                  {DISTRIBUTION.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 text-[#3A5E48]">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── INFLUENCER NETWORK ───────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 15%, transparent 50%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 15%, transparent 50%)',
          }}
        />
        <div className="container-x relative z-10 py-16 md:py-20">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">Our network</p>
            <h2 className="mt-3 text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
              1000+ Influencers <span className="text-[#3A5E48]">& Meme Networks.</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-black/50">
              When you partner with Noxtm, you get instant access to our locked-in network of creators, meme architects, and high-level distribution channels.
            </p>
          </Reveal>

          {/* Network stats */}
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {NETWORK_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="rounded-2xl border border-black/8 bg-white p-6 text-center">
                  <div className="text-3xl font-bold text-[#3A5E48]" style={{ fontFamily: "'Gambetta', serif" }}>{s.value}</div>
                  <p className="mt-1.5 text-[11px] uppercase tracking-[0.15em] text-black/35">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Creator cards */}
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SPEAKERS.map((m, i) => (
              <Reveal key={m.name} delay={(i % 4) * 70}>
                <div className="group relative overflow-hidden rounded-2xl border border-black/8">
                  <img src={m.img} alt={m.name} className="w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" style={{ height: '360px' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="font-semibold leading-tight text-white">{m.name}</h3>
                    <p className="mt-0.5 text-xs text-white/75">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mt-6 text-center text-[12px] text-black/30">
              Showing 8 of 1,000+ creators in our network. Reach, niche, and audience demographics verified.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ───────────── PROCESS ───────────── */}
      <section className="border-y border-black/8 bg-white">
        <div className="container-x py-16 md:py-20">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">How it works</p>
            <h2 className="mt-3 text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
              From audit to authority — <span className="text-[#3A5E48]">in 90 days.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            {[
              { step: '01', title: 'Audit & Discovery', desc: 'We dissect your current presence, competitors, and audience to find gaps worth exploiting.' },
              { step: '02', title: 'Strategy Sprint', desc: 'A senior strategist builds your 90-day roadmap — content pillars, formats, cadence, and KPIs.' },
              { step: '03', title: 'Production & Launch', desc: 'Our in-house team scripts, shoots, designs, and ships content that sounds like you — only sharper.' },
              { step: '04', title: 'Scale & Report', desc: 'Double down on what works, kill what doesn\'t, and show you the numbers every month.' },
            ].map((p, i) => (
              <Reveal key={p.step} delay={i * 100}>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3A5E48]/25 bg-[#3A5E48]/8 text-xs font-bold text-[#3A5E48]">
                      {p.step}
                    </span>
                    {i < 3 && (
                      <span className="hidden h-px flex-1 bg-gradient-to-r from-[#3A5E48]/30 to-transparent md:block" />
                    )}
                  </div>
                  <h3 className="mt-4 text-lg font-bold" style={{ fontFamily: "'Gambetta', serif" }}>{p.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-black/50">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FINAL CTA ───────────── */}
      <section className="container-x py-16 pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A5E48] to-[#22372B] px-6 py-16 text-center md:py-20">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D9A441]/25 blur-[100px]" />

            <div className="relative z-10">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E8C87D]">
                Limited slots per quarter
              </span>
              <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold leading-tight text-white md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
                Ready to stop posting and start dominating?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
                We take on a limited number of clients each quarter so every account gets senior attention.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#F5F2ED] px-7 py-3 text-sm font-semibold text-[#22372B] transition-all hover:bg-white hover:shadow-lg hover:shadow-black/20"
                >
                  Book Free Consultation
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/audit"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
                >
                  Free Social Audit
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
