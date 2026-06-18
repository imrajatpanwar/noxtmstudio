import { Link } from 'react-router-dom';

export default function Footer({ settings }) {
  const s = settings || {};
  const socials = s.socials || {};
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink text-white">

      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-xl font-bold">
            Noxtm Studio<span className="text-[#8FB89A]">.</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/50">
            Master of Marketing and Management.
          </p>
          <div className="mt-3 text-sm text-white/50">
            <p>mail@noxtmstudio.com</p>
            <p>+91 8860921042</p>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-white/50">
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
            <li><Link to="/work" className="hover:text-white transition-colors">Work</Link></li>
            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Connect</h4>
          <ul className="space-y-2 text-sm text-white/50">
            {socials.linkedin && <li><a href={socials.linkedin} className="hover:text-white transition-colors">LinkedIn</a></li>}
            {socials.twitter && <li><a href={socials.twitter} className="hover:text-white transition-colors">Twitter / X</a></li>}
            {socials.instagram && <li><a href={socials.instagram} className="hover:text-white transition-colors">Instagram</a></li>}
            {socials.dribbble && <li><a href={socials.dribbble} className="hover:text-white transition-colors">Dribbble</a></li>}
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Newsletter</h4>
          <p className="mb-3 text-sm text-white/50">Stay ahead of the algorithm.</p>
          <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
            />
            <button
              type="submit"
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-ink transition-opacity hover:opacity-80"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/30 sm:flex-row">
          <span>© {year} {s.siteName || 'Noxtm Studio'}. All rights reserved.</span>
          <Link to="/admin/login" className="hover:text-white transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
