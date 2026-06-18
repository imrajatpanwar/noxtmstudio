import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { CITIES } from './cityData.js';
import { CITY_IMAGES } from './cityImages.js';

// Cities whose cutout images should render full-width, anchored to the bottom
const ZOOMED_CITIES = new Set([
  'mumbai', 'delhi', 'pune', 'kolkata', 'bangalore', 'surat',
  'lucknow', 'bhopal', 'indore', 'visakhapatnam', 'vadodara',
]);

function CityCard({ city, index }) {
  const src = CITY_IMAGES[city.slug];
  const zoomed = ZOOMED_CITIES.has(city.slug);
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
      style={{
        transitionDelay: `${(index % 4) * 80}ms`,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(48px) scale(0.97)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.55s ease',
      }}
    >
      <Link
        to={`/social-media-management-${city.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-black/8 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#3A5E48]/30 hover:shadow-xl hover:shadow-black/8"
      >
        {/* Image / placeholder */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE9E1]">
          {src ? (
            <div
              className="absolute inset-0"
              style={{
                transform: visible ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.9s cubic-bezier(0.22,1,0.36,1)',
                transitionDelay: `${(index % 4) * 80 + 120}ms`,
              }}
            >
              <img
                src={src}
                alt={city.name}
                loading="lazy"
                className={
                  zoomed
                    ? 'city-img-full absolute bottom-0 left-0 w-full'
                    : 'city-img h-full w-full object-cover object-bottom'
                }
              />
            </div>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                backgroundImage:
                  'linear-gradient(#dcd6cb 1px, transparent 1px), linear-gradient(90deg, #dcd6cb 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }}
            >
              <span
                className="text-6xl text-[#3A5E48]/25 transition-colors duration-300 group-hover:text-[#3A5E48]/45"
                style={{ fontFamily: "'Gambetta', serif" }}
              >
                {city.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Label */}
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <p className="text-[15px] font-semibold text-[#1A1A18] transition-colors group-hover:text-[#3A5E48]">
              {city.name}
            </p>
            <p className="mt-0.5 text-[11px] text-black/40">{city.state}</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/8 text-sm text-black/30 transition-all duration-300 group-hover:border-[#3A5E48] group-hover:bg-[#3A5E48] group-hover:text-white">
            →
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function Cities() {
  useEffect(() => {
    document.title = 'Cities We Serve | NOXTM Studio';
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute('content', 'NOXTM Studio provides expert social media management across 20+ top cities in India. Find your city and grow your brand with us.');
  }, []);

  return (
    <div className="bg-[#F5F2ED] text-[#1A1A18]">

      {/* HEADER */}
      <section className="relative overflow-hidden border-b border-black/8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#d5d0c8 1px, transparent 1px), linear-gradient(90deg, #d5d0c8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 80%)',
          }}
        />
        <div className="container-x relative z-10 py-16 text-center">
          <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#3A5E48]">
            Cities We Serve
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl" style={{ fontFamily: "'Gambetta', serif" }}>
            We grow brands across India.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-black/45">
            From Delhi to Kanyakumari, Noxtm Studio delivers social media management, content production, and growth strategy to local and national brands.
          </p>
        </div>
      </section>

      {/* CITY GRID */}
      <section className="container-x py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/30">
              20 Cities. One Agency.
            </p>
            <h2 className="mt-2 text-2xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>
              Pick your city
            </h2>
          </div>
          <p className="hidden text-[11px] text-black/35 sm:block">
            Click a city to see local services →
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CITIES.map((city, i) => (
            <CityCard key={city.slug} city={city} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black/8 bg-white">
        <div className="container-x py-14 text-center">
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Gambetta', serif" }}>Don't see your city?</h2>
          <p className="mt-3 text-sm text-black/45">We work with brands across all of India. Get in touch.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1A1A18] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2d2d2a]">
            Contact Us →
          </Link>
        </div>
      </section>

    </div>
  );
}
