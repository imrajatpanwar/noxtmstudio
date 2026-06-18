import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const links = [
  { to: '/about', label: 'How it Works' },
  { to: '/services', label: 'Solutions' },
  { to: '/work', label: 'Results' },
  { to: '/contact', label: 'Pricing' },
];

const RESOURCES = [
  { to: '/cities', label: 'Cities We Serve' },
];

export default function Navbar({ settings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastAlgo, setPastAlgo] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isResourcesActive = location.pathname.startsWith('/cities');

  // Active resource label
  const activeResourceLabel = RESOURCES.find((r) => location.pathname.startsWith(r.to))?.label;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 400);
      const algoSection = document.getElementById('algo-section');
      if (algoSection) {
        setPastAlgo(window.scrollY > algoSection.offsetTop + algoSection.offsetHeight);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setResourcesOpen(false);
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40">
      <div className={`border-b border-white/10 transition-colors duration-300 ${isHome ? (pastAlgo ? 'bg-[#1A1A18]' : scrolled ? 'bg-[#22372B]' : 'bg-transparent') : 'bg-[rgb(34,55,43)]'}`}>
        <div className="container-x flex h-14 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <span className="text-lg font-bold tracking-wide text-white" style={{ fontFamily: "'Switzer', sans-serif" }}>
              Noxtm Studio
            </span>
            <span className="hidden sm:block h-8 w-px bg-white/20" />
            <div className="hidden sm:block">
              <div className="text-[10px] leading-tight text-[#dad9d9]">Leadership in Social</div>
              <div className="text-[10px] leading-tight text-[#dad9d9]">Media Management 2026</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `text-[13px] font-medium transition hover:text-white ${isActive ? 'text-white' : 'text-[#dad9d9]'}`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {/* Resources dropdown */}
            <div
              ref={resourcesRef}
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                onClick={() => setResourcesOpen((v) => !v)}
                className={`flex items-center gap-1 text-[13px] font-medium transition hover:text-white ${isResourcesActive ? 'text-white' : 'text-[#dad9d9]'}`}
              >
                {activeResourceLabel || 'Resources'}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {resourcesOpen && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="min-w-[176px] rounded-xl border border-white/10 bg-[#1A1A18] p-1 shadow-xl">
                    {RESOURCES.map((r) => (
                      <NavLink
                        key={r.to}
                        to={r.to}
                        className={({ isActive }) =>
                          `flex items-center rounded-lg px-3 py-2 text-[13px] transition hover:bg-white/8 hover:text-white ${isActive ? 'text-white font-medium' : 'text-[#dad9d9]'}`
                        }
                      >
                        {r.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-1.5 text-[13px] font-semibold text-[#1A1A18] shadow-md transition hover:bg-[#F5F2ED] hover:shadow-lg"
            >
              Let's Talk With us <span className="text-sm">→</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
              <span className="block h-0.5 w-6 bg-white" />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-white/10 bg-[#22372B] md:hidden">
            <div className="container-x flex flex-col gap-1 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-sm text-[#dad9d9] hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </NavLink>
              ))}
              {/* Resources in mobile */}
              <div className="mt-1 border-t border-white/10 pt-2">
                <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">Resources</p>
                {RESOURCES.map((r) => (
                  <NavLink
                    key={r.to}
                    to={r.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-2 py-2 text-sm text-[#dad9d9] hover:bg-white/5 hover:text-white block"
                  >
                    {r.label}
                  </NavLink>
                ))}
              </div>
              <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#8FB89A] px-5 py-2 text-[13px] font-semibold text-[#1A1A18]">
                Let's Talk With us →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
