import { useEffect, useState, useRef } from 'react';
import { ShieldCheck, Zap, Crosshair, Infinity } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import PhotoArcCarousel from '../components/PhotoArcCarousel.jsx';

import imgAashna from './Assets/Influencers/Aashna Arora.png';
import imgAnshika from './Assets/Influencers/Anshika Kaur .png';
import imgIshika from './Assets/Influencers/Ishika Sahni.png';
import imgIshita from './Assets/Influencers/Ishita Anand.png';
import imgMansu from './Assets/Influencers/Mansu Rathore.png';
import imgNived from './Assets/Influencers/Nived Mishra.png';
import imgRohit from './Assets/Influencers/Rohit Goel.png';
import imgShivank from './Assets/Influencers/Shivank Bhalla.png';

import tRohit from './Assets/Influencers/testimonials/rohitgoel.png';
import tAshish from './Assets/Influencers/testimonials/ashishsingh.png';
import tAbhay from './Assets/Influencers/testimonials/abhay.png';
import tYash from './Assets/Influencers/testimonials/yash.png';

const FALLBACK = {
  hero: {
    eyebrow: 'SOCIAL GROWTH ENGINE',
    headline: <>Master of Marketing<br />and Management</>,
    sub: 'We act as your complete in-house media division without the overhead. From viral content pipelines to automated retention systems, we manage the machine while you scale the empire.',
    ctaPrimary: { label: 'Audit My Social', href: '/audit' },
    ctaSecondary: { label: 'See The Proof (PDF)', href: '/work' },
  },
  stats: [
    { value: '47+', label: 'Brands Scaled' },
    { value: '₹2.4Cr', label: 'Revenue Generated' },
    { value: '321%', label: 'Avg. Follower Growth' },
    { value: '18 Mo', label: 'Avg. Client Tenure' },
  ],
};

const PATHS = [
  { img: '/client_onboard.png', title: 'Audit & Strategy Plan', desc: 'Deep-dive brand audits and competitor research to build your winning, data-driven roadmap.' },
  { img: '/noxtmstudio_shoot.png', title: 'In-House Production', desc: 'We script, shoot, and edit scroll-stopping Reels and graphics so you never have to.' },
  { img: '/management_brand.png', title: 'Manage & Scale', desc: 'Total account takeover. We handle the daily chaos while you focus on the revenue.' },
];

const SPEAKERS = [
  { name: 'Aashna Arora',   role: '108K followers',   img: imgAashna },
  { name: 'Anshika Kaur',   role: '224K followers',   img: imgAnshika },
  { name: 'Ishika Sahni',   role: '65.8K followers',  img: imgIshika },
  { name: 'Ishita Anand',   role: '239K followers',   img: imgIshita },
  { name: 'Mansu Rathore',  role: '126K followers',   img: imgMansu },
  { name: 'Nived Mishra',   role: '405K followers',   img: imgNived },
  { name: 'Rohit Goyal',    role: '7.6M followers · AdultSociety', img: imgRohit },
  { name: 'Shivank Bhalla', role: '322K followers',   img: imgShivank },
];

const TESTIMONIALS = [
  {
    img: tRohit,
    name: 'Rohit Goyal',
    role: 'Founder of Taggify, Adult Society',
    quote: "Honestly didn't expect results this fast. Noxtm Studio took over content for our pages - Adult Society, The Viral Cinema, Unheard Comedy, and a few others - and things just took off. They focused on reels, kept it organic, and within a couple of months we were hitting millions of views. The team actually gets what works, they're not just posting for the sake of it. Creative, reliable, and genuinely fun to work with. Thankyou.",
  },
  {
    img: tAshish,
    name: 'Ashish Singh',
    role: 'Founder & CEO · Canvas & Co.',
    quote: "Noxtm Studio has been an excellent collaboration partner for us at Canvas & Co. They seamlessly managed both our company page and our clients' pages, delivering consistent, high-quality content that actually performed. Professional, reliable, and great to work with - exactly the kind of team you want in your corner.",
  },
  {
    img: tAbhay,
    name: 'Abhay Hindu',
    role: 'Co-Founder · Naughty World',
    quote: "We partnered with Noxtm Studio for brand management and ad campaigns at Naughty World, and it was a great experience throughout. They understood our brand tone instantly, executed campaigns efficiently, and were always proactive in communication. If you're looking for a reliable agency to handle your brand and paid campaigns. Noxtm Studio is the one.",
  },
  {
    img: tYash,
    name: 'Yash Vashishtha',
    role: 'Founder, Social Matte Media',
    quote: 'Noxtm Studio did an excellent job for our brand. Their strategies delivered quick results and the team was very professional. Highly recommended.',
  },
];

const OUTCOMES = [
  { icon: <ShieldCheck size={28} strokeWidth={1.5} />, title: 'Authority Scaling', desc: 'We convert a weak, passive brand image into undeniable industry dominance, ensuring trust upon first interaction.', bg: 'bg-white border border-black/8', dark: true },
  { icon: <Zap size={28} strokeWidth={1.5} />, title: 'Cost Collapse (CAC)', desc: 'By engineering high-velocity, viral hooks, we force the algorithms to lower your customer acquisition cost to bare minimums.', bg: 'bg-[#3A5E48]' },
  { icon: <Crosshair size={28} strokeWidth={1.5} />, title: 'Traffic Extraction', desc: "We don't just generate 'views' for the ego. Every piece of content is a calculated trap designed to push users into your checkout funnel.", bg: 'bg-[#22372B]' },
  { icon: <Infinity size={28} strokeWidth={1.5} />, title: 'Lifetime Retargeting', desc: 'You capture them once, we keep them forever. Using our network, we trap audiences into dark-social retention loops that force repeat sales.', bg: 'bg-[#8FB89A]', dark: true },
];

const FAQS = [
  { q: 'Are you just going to schedule posts for us?', a: 'No. We are not social media janitors. We are growth architects. If you just want a pretty grid, go to Fiverr. If you want algorithmic dominance, rapid hook testing, and traffic funnels engineered to strip market share from your competitors, you deploy us. We don\'t plan posts; we build distribution machines.' },
  { q: 'How painful is the onboarding and approval process?', a: 'It\'s entirely frictionless. The number one reason founders fire agencies is communication lag. We operate entirely via the Noxtm Ecosystem (utilizing proprietary tools and mail servers). No messy WhatsApp chains. No lost Google Drives. We tell you what to do, you review it in one click, and we execute.' },
  { q: 'Why shouldn\'t I just build an in-house team?', a: 'You can, but you can\'t build our network. When you partner with Noxtm, you aren\'t just getting editors and strategists. You get immediate, tactical access to our underlying syndicate—a vast, locked-in network of creators, meme architects, and high-level distribution channels. It would take you three years to build the leverage we grant you on Day 1.' },
  { q: 'What is the financial commitment?', a: 'We operate on custom retainers because every war requires a different strategy. We don\'t do cheap. If you are comparing us against an entry-level freelancer based on price alone, we are not the right fit. But if you measure ROI by Customer Acquisition Cost and raw attention dominance, we are the best investment you will ever make.' },
];

export default function Home() {
  const [hero, setHero] = useState(FALLBACK.hero);
  const [stats, setStats] = useState(FALLBACK.stats);
  const [openFaq, setOpenFaq] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/pages/home').then((r) => {
      const s = r.data?.sections;
      // hero + stats managed in code, not DB
    }).catch(() => {});
    api.get('/posts').then((r) => setPosts((r.data || []).slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="bg-[#F5F2ED]">
      {/* HERO */}
      <section className="relative overflow-hidden -mt-14">
        <div className="absolute inset-0">
          <video
            src="/Webheader.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover scale-110"
          />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        </div>
        <div className="container-x relative z-30 pt-32 pb-8 text-center md:pt-56 md:pb-16">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-5 py-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-400" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">Accepting New Clients: 2 Spots Left</span>
          </div>
          <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-bold leading-[1.04] md:text-7xl" style={{ fontFamily: "'Gambetta', serif" }}>
            {hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/70">{hero.sub}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to={hero.ctaPrimary?.href || '/contact'} className="inline-flex items-center gap-2 rounded-full border border-[#8FB89A] px-6 py-2 text-sm font-medium text-[#8FB89A] transition hover:bg-[#8FB89A] hover:text-[#1A1A18]">
              {hero.ctaPrimary?.label} <span>➔</span>
            </Link>
            <Link to={hero.ctaSecondary?.href || '/work'} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md px-6 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              {hero.ctaSecondary?.label} <span>↓</span>
            </Link>
          </div>
          <div className="mt-24 flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
            <div className="relative h-12 w-px overflow-hidden bg-white/10">
              <div
                className="absolute left-0 w-full rounded-full bg-white/70"
                style={{
                  height: '33%',
                  animation: 'scrollline 1.8s ease-in-out infinite',
                }}
              />
              <style>{`
                @keyframes scrollline {
                  0% { top: -33%; opacity: 0; }
                  30% { opacity: 1; }
                  100% { top: 100%; opacity: 0; }
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative overflow-hidden bg-[#3A5E48]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="container-x relative grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="px-4 py-9 text-center md:px-6">
              <div className="text-3xl font-bold text-[#E8C87D] md:text-4xl" style={{ fontFamily: "'Gambetta', serif" }}>{s.value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Scrolling ticker */}
      <div className="overflow-hidden bg-[#22372B] py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="mx-4 text-[13px] font-medium tracking-widest uppercase text-white">
              WE DON'T MANAGE&nbsp;&nbsp;•&nbsp;&nbsp;WE DOMINATE&nbsp;&nbsp;•&nbsp;&nbsp;CRUSH YOUR COMPETITION&nbsp;&nbsp;•&nbsp;&nbsp;THE 90-DAY ATTENTION HEIST&nbsp;&nbsp;•&nbsp;&nbsp;FOUNDER-LEVEL STRATEGY&nbsp;&nbsp;•&nbsp;&nbsp;BEYOND AESTHETICS&nbsp;&nbsp;•&nbsp;&nbsp;PURE PERFORMANCE&nbsp;&nbsp;•&nbsp;&nbsp;STEAL THEIR AUDIENCE&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* SHIFT + Carousel — all cream */}
      <section id="algo-section" className="relative text-ink" style={{ backgroundColor: 'rgb(245, 242, 237)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)', backgroundSize: '24px 24px', maskImage: 'linear-gradient(to bottom, black 30%, transparent 60%)', WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 60%)' }} />
        <div className="container-x relative z-10 pt-24 pb-12">
          <h2 className="text-center font-bold leading-tight" style={{ fontFamily: "'Gambetta', serif", fontSize: '2.5rem' }}>
            Aesthetics Don't Pay the Bills.
          </h2>
          <h2 className="text-center font-bold leading-tight text-[#3A5E48] md:text-8xl text-6xl" style={{ fontFamily: "'Gambetta', serif" }}>
            Algorithms Do.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-lg text-ink/60">Stop optimizing for pretty grids. We optimize for predatory growth.</p>
        </div>
        <div className="relative z-10">
          <PhotoArcCarousel />
        </div>
        <div className="h-12" />
      </section>

      {/* ENGAGEMENT — forest */}
      <section className="bg-forest">
        <div className="container-x py-24">
          <h2 className="text-center font-bold leading-tight" style={{ fontFamily: "'Gambetta', serif", fontSize: '2.5rem' }}>
            We build the engine.
          </h2>
          <h2 className="text-center font-bold leading-tight text-[#8FB89A] md:text-7xl text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            Then we force the momentum.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-[#3A5E48] p-8">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>The Content Syndicate</h3>
              <p className="mt-3 text-sm text-white/85">
                We take complete ownership of your brand's output. An aggressive, relentless production schedule designed to monopolize your niche's attention without you lifting a finger.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-white/85">
                <li>→&nbsp;&nbsp;Uncapped Short-Form Video (Reels/Shorts)</li>
                <li>→&nbsp;&nbsp;High-Conversion Carousel Architecture</li>
                <li>→&nbsp;&nbsp;Competitor Espionage & Strategy Building</li>
                <li>→&nbsp;&nbsp;Premium Hand-Crafted Visual Assets</li>
                <li>→&nbsp;&nbsp;Community & DM Response Protocols</li>
                <li>→&nbsp;&nbsp;Monthly Viral Hook A/B Testing</li>
                <li>→&nbsp;&nbsp;IG Story Sales Sequencing (Turn stories into funnels)</li>
                <li>→&nbsp;&nbsp;Bio-Link & Traffic Routing Engineering</li>
                <li>→&nbsp;&nbsp;AI-Powered Trend Prediction Mapping</li>
                <li>→&nbsp;&nbsp;Account Health & Shadowban Shielding</li>
                <li>→&nbsp;&nbsp;Omni-Channel Native Formatting (Twitter/LinkedIn/IG)</li>
              </ul>
            </div>
            <div className="rounded-3xl bg-[#F5F2ED] p-8 text-[#1A1A18]">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>The Distribution Monopoly</h3>
              <p className="mt-3 text-sm text-black/55">
                The best content dies without distribution. We don't wait for the algorithm; we hijack it using our proprietary network of massive existing audiences.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-black/60">
                <li>→&nbsp;&nbsp;Instant reach via 500+ Owned Meme/Niche Pages</li>
                <li>→&nbsp;&nbsp;Guaranteed distribution across 1000+ Creators</li>
                <li>→&nbsp;&nbsp;Strategic Cross-Collabbing with 100+ Partner Brands</li>
                <li>→&nbsp;&nbsp;Pod-based Initial Algorithmic Amplification</li>
                <li>→&nbsp;&nbsp;PR Placement & Media Syndication (Tier 1 Sites)</li>
                <li>→&nbsp;&nbsp;Shadow-Scaling for Event Launches</li>
                <li>→&nbsp;&nbsp;WhatsApp "Dark Social" Broadcast Architecture</li>
                <li>→&nbsp;&nbsp;Competitor Audience Hijacking (Targeting their followers)</li>
                <li>→&nbsp;&nbsp;Subreddit & Discord Infiltration Campaigns</li>
                <li>→&nbsp;&nbsp;Micro-UGC Army Deployment (100+ raw videos monthly)</li>
                <li>→&nbsp;&nbsp;Algorithmic Trigger Manipulation (Watch-time boosting)</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#F5F2ED] text-[#1A1A18] px-8 py-3 text-sm font-semibold hover:bg-white transition">Calculate Your Potential ➔</Link>
          </div>
        </div>
      </section>

      {/* CLIENTS / BRANDS */}
      <section className="relative bg-cream text-ink pb-0 overflow-hidden">
        {/* Grass as absolute background at bottom */}
        <div className="absolute left-0 right-0 z-0" style={{ bottom: '-12rem' }}>
          <img src="/grass.png" alt="" className="w-full object-cover object-bottom" />
        </div>
        <div className="container-x pt-24 relative z-10">
          <h2 className="text-center text-4xl font-bold md:text-5xl flex items-center justify-center gap-3" style={{ fontFamily: "'Gambetta', serif" }}>
            <img src="/Client_Star.png" alt="" className="h-10 w-10 object-contain" /> Clients / Brands
          </h2>
          <div className="mt-12 mb-16 mx-auto max-w-6xl rounded-2xl border border-white/30 bg-white/20 backdrop-blur-2xl p-12 shadow-2xl ring-1 ring-white/10">
            <div className="grid grid-cols-3 gap-10 md:grid-cols-5">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="flex h-24 items-center justify-center rounded-lg">
                  <img src={`/brands/brand-${i + 1}.png`} alt={`Brand ${i + 1}`} className="max-h-20 w-full object-contain px-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Spacer so grass peeks below the card */}
        <div className="h-48 relative z-0" />
      </section>

      {/* VOICES / TEAM — cream */}
      <section className="bg-cream text-ink">
        <div className="container-x py-24">
          <h2 className="text-center text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            1000+ Influencers <span className="text-[#3A5E48]">& Meme Networks.</span>
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {SPEAKERS.map((m, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl">
                <img src={m.img} alt={m.name} className="w-full object-cover object-top" style={{height: '380px'}} />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-semibold leading-tight text-white">{m.name}</h3>
                  <p className="mt-0.5 text-xs text-white/80">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FORM — forest */}
      <section className="bg-[#22372B] text-white">
        <div className="container-x grid gap-10 py-24 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold leading-tight" style={{ fontFamily: "'Gambetta', serif" }}>
              You secure the funding.
              <br />
              <span className="text-[#8FB89A]">We monopolize the attention.</span>
            </h2>
            <p className="mt-5 max-w-md text-white/70">
              The algorithm doesn't care about your product's code; it cares about attention velocity. Tell us where your target audience lives, and we'll build the proprietary systems necessary to force them onto your site.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F5F2ED] px-7 py-3 text-sm font-semibold text-[#22372B] transition hover:bg-white">
              Claim Your Unfair Advantage ➔
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['Founder Ghostwriting', 'Narrative Control', 'B2B Inbound Engines', 'Authority Syndication', 'Viral Sub-networks', 'Frictionless Approvals'].map((t) => (
              <div key={t} className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm font-medium transition-colors hover:border-[#8FB89A]/40 hover:bg-white/10">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

{/* TESTIMONIALS — cream */}
      <section className="bg-sand text-ink">
        <div className="container-x py-24">
          <h2 className="text-center text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            From the people <span className="text-[#3A5E48]">we've built with.</span>
          </h2>
          <div className="mt-12 overflow-hidden" style={{maskImage:'linear-gradient(to right,transparent,black 10%,black 90%,transparent)',WebkitMaskImage:'linear-gradient(to right,transparent,black 10%,black 90%,transparent)'}}>
            <div className="flex gap-6 w-max" style={{animation:'marquee-rtl 28s linear infinite'}}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <figure key={i} className="flex flex-col gap-3 bg-white rounded-2xl border border-ink/10 p-6 w-80 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <img src={t.img} alt={t.name} className="w-10 h-10 rounded-full object-cover object-top flex-shrink-0" />
                    <figcaption>
                      <span className="block font-bold text-sm leading-tight">{t.name}</span>
                      <span className="block text-xs text-ink/50">{t.role}</span>
                    </figcaption>
                  </div>
                  <blockquote className="text-xs leading-relaxed text-ink/70 line-clamp-4">{t.quote}</blockquote>
                </figure>
              ))}
            </div>
          </div>
          <style>{`@keyframes marquee-rtl{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
        </div>
      </section>

      {/* OUTCOMES / PARTNER — light */}
      <section className="bg-[#F5F2ED] text-[#1A1A18]">
        <div className="container-x py-24">
          <h2 className="text-center text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            Don't buy deliverables.
            <br />
            <span className="text-[#3A5E48]">Buy an outcome.</span>
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OUTCOMES.map((o, i) => (
              <div key={i} className={`rounded-3xl p-7 ${o.bg} ${o.dark ? 'text-[#1A1A18]' : 'text-white'}`}>
                <div className={`text-2xl ${o.dark ? 'text-[#3A5E48]' : ''}`}>{o.icon}</div>
                <h3 className="mt-4 font-display text-lg font-bold">{o.title}</h3>
                <p className={`mt-2 text-sm ${o.dark ? 'text-black/60' : 'opacity-90'}`}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOGS / ARTICLES */}
      <section className="relative bg-[#F5F2ED] text-[#1A1A18]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 70%)',
          }}
        />
        <div className="container-x relative z-10 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">From our desk</p>
              <h2 className="mt-3 text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
                Blog & <span className="text-[#3A5E48]">Articles</span>
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A18] transition hover:border-[#3A5E48] hover:text-[#3A5E48]"
            >
              View all articles →
            </Link>
          </div>

          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p._id}
                  to={`/blog/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#EDE9E1]">
                    {p.coverImage ? (
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-4xl font-bold text-black/8" style={{ fontFamily: "'Gambetta', serif" }}>N.</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {(p.tags || []).slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-[#3A5E48]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3A5E48]">{t}</span>
                      ))}
                    </div>
                    <h3 className="mt-3 text-lg font-bold leading-snug text-[#1A1A18] transition-colors group-hover:text-[#3A5E48]" style={{ fontFamily: "'Gambetta', serif" }}>
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-black/50 line-clamp-2">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#3A5E48]">
                      Read article <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-px md:grid-cols-3 rounded-2xl overflow-hidden border border-black/8 bg-black/8">
              {[
                { num: '01', title: 'Growth Playbooks', desc: 'Frameworks, strategies, and case studies from real campaigns we ran for brands.' },
                { num: '02', title: 'Algorithm Intel', desc: 'What changed, what works, and how to exploit platform shifts before competitors catch on.' },
                { num: '03', title: 'Behind the Build', desc: 'Inside looks at our process — from strategy sprints to content production workflows.' },
              ].map((c) => (
                <div key={c.title} className="bg-white p-8 flex flex-col gap-4">
                  <span className="text-xs font-mono text-black/20 tracking-widest">{c.num}</span>
                  <h3 className="font-display text-lg font-bold leading-tight text-[#1A1A18]">{c.title}</h3>
                  <p className="text-sm text-black/45 leading-relaxed flex-1">{c.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ — light */}
      <section className="bg-white text-[#1A1A18]">
        <div className="container-x max-w-3xl py-24">
          <h2 className="text-center text-4xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>
            Questions before you <span className="text-[#3A5E48]">commit?</span>
          </h2>
          <div className="mt-10 divide-y divide-black/8 border-y border-black/8">
            {FAQS.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                  className="flex w-full cursor-pointer items-center justify-between py-5 text-left"
                >
                  <span className="font-medium">{f.q}</span>
                  <span className="text-lg font-semibold text-[#3A5E48]">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className="pb-5 text-sm leading-relaxed text-black/55">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#3A5E48] text-white">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-14 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl" style={{ fontFamily: "'Gambetta', serif" }}>Ready to see your numbers go up?</h2>
            <p className="mt-2 text-white/70">Drop your URL, and let's map out a clear path to get your brand noticed.</p>
          </div>
          <Link to="/audit" className="whitespace-nowrap rounded-full bg-[#F5F2ED] px-7 py-3 text-sm font-semibold text-[#1A1A18] transition hover:bg-white">Request a quick review</Link>
        </div>
      </section>
    </div>
  );
}
