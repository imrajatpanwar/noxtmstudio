import { useParams, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { CITIES } from './cityData.js';
import { CITY_IMAGES, CITY_LANDMARKS } from './cityImages.js';

const SERVICES = [
  { num: '01', title: 'Social Media Management', desc: 'Full account ownership — strategy, posting, and engagement handled daily.' },
  { num: '02', title: 'Content Production', desc: 'Reels, graphics, and copy scripted and produced in-house.' },
  { num: '03', title: 'Growth Strategy', desc: 'Data-backed roadmap built around your audience and competitors.' },
  { num: '04', title: 'Community Engagement', desc: 'DMs, comments, and real-time replies managed in your brand voice.' },
  { num: '05', title: 'Reporting & Analytics', desc: 'Monthly performance readouts tied to real business outcomes.' },
  { num: '06', title: 'Influencer Partnerships', desc: 'Access to our creator network for local reach and credibility.' },
];

const PROCESS = [
  { step: '01', title: 'Audit & Discovery', desc: 'We dissect your current presence, competitors, and local audience to find the gaps worth exploiting.' },
  { step: '02', title: 'Strategy Sprint', desc: 'A senior strategist builds your 90-day roadmap — content pillars, formats, cadence, and KPIs.' },
  { step: '03', title: 'Production & Launch', desc: 'Our in-house team scripts, shoots, designs, and ships content that sounds like you — only sharper.' },
  { step: '04', title: 'Scale & Report', desc: 'We double down on what works, kill what does not, and show you the numbers every month.' },
];

const STATS = [
  { value: '120+', label: 'Brands managed' },
  { value: '40M+', label: 'Organic reach generated' },
  { value: '5,000+', label: 'Content pieces shipped' },
  { value: '94%', label: 'Client retention' },
];

const FAQS = (cityName) => [
  { q: `How much does social media management cost in ${cityName}?`, a: `Retainers are scoped to your goals — most ${cityName} brands invest between ₹35,000 and ₹1,50,000 per month depending on platforms, content volume, and whether production is included. You get an exact quote after a free audit.` },
  { q: 'Do you work with small businesses or only big brands?', a: 'Both. We take a limited number of clients per quarter so every account gets senior attention — from D2C startups to established enterprises.' },
  { q: `Will my account manager understand the ${cityName} market?`, a: `Yes. Every strategy is built around local audience behavior, language, and culture — not recycled national templates.` },
  { q: 'How soon will I see results?', a: 'Engagement and content quality improve within the first month. Meaningful follower and lead growth typically compounds from month two onwards.' },
  { q: 'What platforms do you manage?', a: 'Instagram, LinkedIn, YouTube, Facebook, and X — we recommend the mix that actually fits your audience instead of spreading you thin.' },
];

/* Fade-up on scroll */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b border-black/8">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-[#1A1A18]">{q}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
            open ? 'rotate-45 border-[#3A5E48] bg-[#3A5E48] text-white' : 'border-black/15 text-black/40'
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-all duration-400 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-sm leading-relaxed text-black/50">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function CityPage() {
  const { slug } = useParams();
  // Extract city slug from /social-media-management-{city} URLs
  const city = slug?.startsWith('social-media-management-')
    ? slug.replace('social-media-management-', '')
    : null;
  const cityData = city ? CITIES.find((c) => c.slug === city) : null;

  const cityName = cityData?.name || city?.charAt(0).toUpperCase() + city?.slice(1) || 'Your City';
  const stateName = cityData?.state || '';
  const cityImg = cityData ? CITY_IMAGES[cityData.slug] : null;
  const landmark = cityData ? CITY_LANDMARKS[cityData.slug] : '';

  const [heroIn, setHeroIn] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const title = `Social Media Management Agency in ${cityName} | NOXTM Studio`;
    const desc = `Looking for a social media agency in ${cityName}? NOXTM Studio offers content, strategy & management to grow local brands online. Book a free consultation.`;
    const url = `https://noxtmstudio.com/social-media-management-${cityData?.slug || ''}`;

    document.title = title;
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', desc);

    // noindex broken/unknown city slugs (avoid soft-404 indexing)
    let robots = document.querySelector('meta[name="robots"]');
    if (!cityData) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, nofollow';
      return () => robots?.remove();
    }
    robots?.remove();

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // Open Graph / Twitter
    const ogTags = {
      'og:title': title,
      'og:description': desc,
      'og:url': url,
      'og:type': 'website',
      'og:site_name': 'NOXTM Studio',
      'twitter:card': 'summary_large_image',
      'twitter:title': title,
      'twitter:description': desc,
    };
    const created = [];
    for (const [prop, content] of Object.entries(ogTags)) {
      const attr = prop.startsWith('twitter') ? 'name' : 'property';
      let tag = document.querySelector(`meta[${attr}="${prop}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, prop);
        document.head.appendChild(tag);
        created.push(tag);
      }
      tag.setAttribute('content', content);
    }

    // JSON-LD: ProfessionalService + FAQPage
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfessionalService',
          name: 'NOXTM Studio',
          description: desc,
          url,
          areaServed: { '@type': 'City', name: cityName, containedInPlace: { '@type': 'State', name: stateName } },
          serviceType: 'Social Media Management',
          priceRange: '₹₹',
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQS(cityName).map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://noxtmstudio.com/' },
            { '@type': 'ListItem', position: 2, name: 'Cities', item: 'https://noxtmstudio.com/cities' },
            { '@type': 'ListItem', position: 3, name: cityName, item: url },
          ],
        },
      ],
    };
    let script = document.getElementById('city-jsonld');
    if (!script) {
      script = document.createElement('script');
      script.id = 'city-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);

    const t = requestAnimationFrame(() => setHeroIn(true));
    return () => {
      cancelAnimationFrame(t);
      canonical?.remove();
      script?.remove();
      created.forEach((tag) => tag.remove());
    };
  }, [cityName, stateName, cityData]);

  if (!cityData) {
    return (
      <div className="bg-[#F5F2ED] min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-sm text-black/40">City not found.</p>
          <Link to="/cities" className="mt-4 inline-block text-sm font-semibold text-[#3A5E48] hover:underline">
            View all cities →
          </Link>
        </div>
      </div>
    );
  }

  const otherCities = CITIES.filter((c) => c.slug !== cityData.slug);

  return (
    <div className="bg-[#F5F2ED] text-[#1A1A18]">

      {/* ───────────────── HERO ───────────────── */}
      <section className="relative overflow-hidden border-b border-black/8">
        {/* grid backdrop */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 85%)',
          }}
        />

        <div className="container-x relative z-10 grid items-end gap-10 pt-16 md:grid-cols-[1.1fr_0.9fr] md:gap-6 md:pt-20">
          {/* Copy */}
          <div className="pb-14 md:pb-20">
            <div
              style={{
                transform: heroIn ? 'translateY(0)' : 'translateY(28px)',
                opacity: heroIn ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease',
              }}
            >
              <Link to="/cities" className="mb-6 inline-flex items-center gap-1.5 text-[11px] font-medium text-black/35 transition-colors hover:text-black/60">
                ← All Cities
              </Link>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3A5E48]/25 bg-[#3A5E48]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3A5E48]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3A5E48]" />
                  {stateName}
                </span>
              </div>
              <h1 className="mt-5 max-w-2xl font-bold leading-[1.04]" style={{ fontFamily: "'Gambetta', serif", fontSize: 'clamp(2.5rem, 5.5vw, 4rem)' }}>
                Social Media Management Agency in <em className="text-[#3A5E48]" style={{ fontStyle: 'italic' }}>{cityName}</em>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-black/50">
                NOXTM Studio helps {cityName}-based brands dominate social media. From content production to full account management — we handle everything so you can focus on growth.
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

              {/* micro trust row */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] text-black/40">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#D9A441]">★★★★★</span> Rated by founders
                </span>
                <span className="hidden h-3 w-px bg-black/15 sm:block" />
                <span>Senior-led accounts</span>
                <span className="hidden h-3 w-px bg-black/15 sm:block" />
                <span>No long lock-ins</span>
              </div>
            </div>
          </div>

          {/* Monument */}
          {cityImg && (
            <div className="relative hidden self-end md:block">
              <div
                className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#3A5E48]/10 blur-3xl"
                style={{ opacity: heroIn ? 1 : 0, transition: 'opacity 1.2s ease 0.3s' }}
              />
              <div
                style={{
                  transform: heroIn ? 'translateY(0)' : 'translateY(100%)',
                  transition: 'transform 1s cubic-bezier(0.22,1,0.36,1) 0.15s',
                }}
              >
                <img
                  src={cityImg}
                  alt={`${landmark}, ${cityName}`}
                  className="mx-auto block max-h-[340px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_24px_40px_rgba(26,26,24,0.18)]"
                />
              </div>
              <p
                className="absolute -bottom-0 right-0 hidden rotate-0 text-[10px] uppercase tracking-[0.2em] text-black/25 lg:block"
                style={{ opacity: heroIn ? 1 : 0, transition: 'opacity 0.8s ease 0.8s' }}
              >
                {landmark}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────── STATS BAR ───────────────── */}
      <section className="relative overflow-hidden border-b border-black/8 bg-[#3A5E48] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="container-x relative grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="px-4 py-9 text-center md:px-6">
              <div className="text-3xl font-bold text-[#E8C87D] md:text-4xl" style={{ fontFamily: "'Gambetta', serif" }}>
                {s.value}
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/70">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── LOCAL CONTEXT ───────────────── */}
      {cityData.about && (
        <section className="border-b border-black/8">
          <div className="container-x py-14">
            <Reveal>
              <div className="grid gap-6 md:grid-cols-[0.35fr_0.65fr]">
                <h2 className="text-2xl font-bold leading-tight md:text-3xl" style={{ fontFamily: "'Gambetta', serif" }}>
                  Social media marketing in {cityName}
                </h2>
                <p className="text-[15px] leading-relaxed text-black/55">{cityData.about}</p>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ───────────────── WHY NOXTM ───────────────── */}
      <section className="border-b border-black/8 bg-white">
        <div className="container-x py-16 md:py-20">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">Why Noxtm in {cityName}</p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
              Most agencies post content. <span className="text-[#3A5E48]">We build presence.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 md:grid-cols-3">
            {[
              { n: '01', t: 'Local-first', d: `We understand ${cityName}'s market, culture, and audience behavior — not just generic social media tactics.` },
              { n: '02', t: 'Senior-led', d: 'A principal strategist owns your account from day one. No juniors, no handoffs, no excuses.' },
              { n: '03', t: 'Full-service', d: 'Strategy, production, posting, engagement, and reporting — everything in one retainer.' },
            ].map((item, i) => (
              <Reveal key={item.n} delay={i * 100} className="h-full">
                <div className="group h-full bg-white p-8 transition-colors duration-300 hover:bg-[#F5F2ED]">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-[#3A5E48]/50">{item.n}</span>
                  <div className="mt-3 text-2xl font-bold text-[#1A1A18] transition-colors group-hover:text-[#3A5E48]" style={{ fontFamily: "'Gambetta', serif" }}>
                    {item.t}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-black/50">{item.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── SERVICES ───────────────── */}
      <section className="container-x py-16 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">Services in {cityName}</p>
              <h2 className="mt-3 text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
                Everything your brand needs.
              </h2>
            </div>
            <p className="max-w-xs text-[12px] leading-relaxed text-black/40">
              One retainer. One senior team. Every service below included or scoped to your goals.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 90} className="h-full">
              <div className="group relative h-full bg-[#F5F2ED] p-7 transition-colors duration-300 hover:bg-white">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-black/25 transition-colors group-hover:text-[#3A5E48]/60">{s.num}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/8 text-xs text-black/25 opacity-0 transition-all duration-300 group-hover:border-[#3A5E48] group-hover:bg-[#3A5E48] group-hover:text-white group-hover:opacity-100">
                    →
                  </span>
                </div>
                <p className="mt-4 text-[15px] font-semibold text-[#1A1A18] transition-colors group-hover:text-[#3A5E48]">{s.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-black/45">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────────── PROCESS ───────────────── */}
      <section className="border-y border-black/8 bg-white">
        <div className="container-x py-16 md:py-20">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">How we work</p>
            <h2 className="mt-3 text-3xl font-bold md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
              From audit to authority — in 90 days.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 110}>
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3A5E48]/25 bg-[#3A5E48]/8 text-xs font-bold text-[#3A5E48]">
                      {p.step}
                    </span>
                    {i < PROCESS.length - 1 && (
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

      {/* ───────────────── FAQ ───────────────── */}
      <section className="container-x py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-[2.75rem] md:leading-[1.1]" style={{ fontFamily: "'Gambetta', serif" }}>
              Questions {cityName} brands ask us.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-black/45">
              Still unsure? Book a free consultation — no pitch decks, just straight answers.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A18] transition hover:border-[#3A5E48]/40 hover:bg-black/5"
            >
              Talk to us →
            </Link>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-2xl border border-black/8 bg-white px-6 md:px-8">
              {FAQS(cityName).map((f, i) => (
                <FaqItem
                  key={f.q}
                  q={f.q}
                  a={f.a}
                  open={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── OTHER CITIES ───────────────── */}
      <section className="border-t border-black/8">
        <div className="container-x py-12">
          <Reveal>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">Also serving</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {otherCities.map((c) => (
                <Link
                  key={c.slug}
                  to={`/social-media-management-${c.slug}`}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-black/10 bg-white px-4 text-[12px] font-medium text-black/55 transition hover:border-[#3A5E48] hover:bg-[#3A5E48] hover:text-white"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────── FINAL CTA ───────────────── */}
      <section className="container-x pb-20 pt-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A5E48] to-[#22372B] px-6 py-16 text-center md:py-20">
            {/* grid texture */}
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
                Ready to grow your brand in {cityName}?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm text-white/65">
                We take on a limited number of clients each quarter so every account gets senior attention. Apply now.
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
                  to="/cities"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-semibold text-white/85 transition hover:border-white/50 hover:text-white"
                >
                  All Cities
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

    </div>
  );
}
