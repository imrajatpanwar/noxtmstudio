import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ ctaText = 'Contact', ctaLink = '/contact', ctaStyle }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="nav-logo">
            <Link to="/" className="logo-text" style={{ textDecoration: 'none', color: 'inherit' }}>
              Noxtm Studio
            </Link>
          </div>
          <ul className="nav-links">
            <li><Link to="/case-studies">Case Studies</Link></li>
            <li><Link to="/work">Work</Link></li>
            <li><Link to="/blog">Blogs</Link></li>
            <li className="nav-dropdown-parent">
              <Link to="/company" className="nav-dropdown-trigger">
                About{' '}
                <svg className="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <ul className="nav-dropdown">
                <li><Link to="/company">Company</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </li>
          </ul>
          <Link to={ctaLink} className="nav-cta nav-cta-desktop" style={ctaStyle}>
            {ctaText}
          </Link>
          <button
            className="mobile-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
            <span className={`hamburger-line ${menuOpen ? 'open' : ''}`}></span>
          </button>
        </nav>
      </div>
      <div
        className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`}
        onClick={() => setMenuOpen(false)}
      ></div>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/case-studies" onClick={() => setMenuOpen(false)}>Case Studies</Link>
        <Link to="/work" onClick={() => setMenuOpen(false)}>Work</Link>
        <Link to="/blog" onClick={() => setMenuOpen(false)}>Blogs</Link>
        <Link to="/company" onClick={() => setMenuOpen(false)}>Company</Link>
        <Link to="/contact" className="mobile-menu-cta" onClick={() => setMenuOpen(false)}>Contact</Link>
      </div>
    </>
  );
}

export default Navbar;
