import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';

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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1), opacity 0.7s ease',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/posts').then((r) => setPosts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#F5F2ED] text-[#1A1A18] min-h-screen">
      {/* Header with grid bg */}
      <section className="relative border-b border-black/8 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 90%)',
          }}
        />
        <div className="container-x relative z-10 py-20 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/30">From our desk</p>
          <h1 className="mt-4 text-5xl font-bold md:text-6xl" style={{ fontFamily: "'Gambetta', serif" }}>
            Blog & <span className="text-[#3A5E48]">Articles</span>
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-black/50">
            Playbooks, case studies, and behind-the-scenes breakdowns from real campaigns. No fluff.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="relative">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.4,
          }}
        />
        <div className="container-x relative z-10 py-16">
          {loading ? (
            <p className="text-center text-black/40">Loading…</p>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-2xl font-bold text-black/20" style={{ fontFamily: "'Gambetta', serif" }}>No articles yet.</p>
              <p className="mt-2 text-sm text-black/35">Check back soon — we ship insights weekly.</p>
            </div>
          ) : (
            <>
              {/* Featured first post */}
              {posts.length > 0 && (
                <Reveal>
                  <Link
                    to={`/blog/${posts[0].slug}`}
                    className="group mb-10 grid overflow-hidden rounded-2xl border border-black/8 bg-white md:grid-cols-2"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#EDE9E1] md:aspect-auto md:min-h-[320px]">
                      {posts[0].coverImage ? (
                        <img src={posts[0].coverImage} alt={posts[0].title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-6xl font-bold text-black/6" style={{ fontFamily: "'Gambetta', serif" }}>N.</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-10">
                      <div className="flex flex-wrap gap-2">
                        {(posts[0].tags || []).slice(0, 3).map((t) => (
                          <span key={t} className="rounded-full bg-[#3A5E48]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3A5E48]">{t}</span>
                        ))}
                      </div>
                      <h2 className="mt-4 text-2xl font-bold leading-snug transition-colors group-hover:text-[#3A5E48] md:text-3xl" style={{ fontFamily: "'Gambetta', serif" }}>
                        {posts[0].title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-black/50 line-clamp-3">{posts[0].excerpt}</p>
                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-xs text-black/35">
                          {posts[0].author}{posts[0].publishedAt ? ` · ${new Date(posts[0].publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#3A5E48]">
                          Read <span className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              {/* Rest of posts */}
              {posts.length > 1 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {posts.slice(1).map((p, i) => (
                    <Reveal key={p._id} delay={(i % 3) * 80}>
                      <Link
                        to={`/blog/${p.slug}`}
                        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-black/8 hover:-translate-y-1"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-[#EDE9E1]">
                          {p.coverImage ? (
                            <img src={p.coverImage} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-4xl font-bold text-black/6" style={{ fontFamily: "'Gambetta', serif" }}>N.</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex flex-wrap gap-2">
                            {(p.tags || []).slice(0, 2).map((t) => (
                              <span key={t} className="rounded-full bg-[#3A5E48]/8 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#3A5E48]">{t}</span>
                            ))}
                          </div>
                          <h3 className="mt-3 text-lg font-bold leading-snug transition-colors group-hover:text-[#3A5E48]" style={{ fontFamily: "'Gambetta', serif" }}>
                            {p.title}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-black/50 line-clamp-2">{p.excerpt}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-[11px] text-black/30">
                              {p.author}{p.publishedAt ? ` · ${new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                            </span>
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#3A5E48]">
                              Read <span className="transition-transform group-hover:translate-x-1">→</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3A5E48] to-[#22372B] px-6 py-14 text-center md:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
            <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#D9A441]/20 blur-[80px]" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white md:text-3xl" style={{ fontFamily: "'Gambetta', serif" }}>
                Want these strategies applied to your brand?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/60">Book a free consultation. No pitch decks — just straight answers.</p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F5F2ED] px-7 py-3 text-sm font-semibold text-[#22372B] transition hover:bg-white hover:shadow-lg"
              >
                Book Free Consultation →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
