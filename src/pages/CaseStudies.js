import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './CaseStudies.css';

function CaseStudies() {
    const [studies, setStudies] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('noxtm_case_studies') || '[]');
            const published = saved.filter(s => s.status === 'Published');
            setStudies(published);
        } catch { }
    }, []);

    const categories = ['All', ...new Set(studies.map(s => s.category).filter(Boolean))];
    const filtered = filter === 'All' ? studies : studies.filter(s => s.category === filter);

    return (
        <div className="cs-page">
            {/* Navbar */}
            <div className="navbar-wrapper">
                <nav className="navbar">
                    <div className="nav-logo">
                        <Link to="/" className="logo-text" style={{textDecoration:'none',color:'inherit'}}>Noxtm Studio</Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/blog">Blogs</Link></li>
                        <li><Link to="/case-studies" style={{color:'var(--text-primary)'}}>Case Studies</Link></li>
                        <li><Link to="/work">Work</Link></li>
                    </ul>
                    <Link to="/blog" className="nav-cta">Explore Blog</Link>
                </nav>
            </div>

            {/* Hero */}
            <section className="cs-hero">
                <h1 className="cs-hero-title">Case Studies</h1>
                <p className="cs-hero-sub">Real results for real brands. Explore how we've helped businesses grow.</p>
            </section>

            {/* Filter */}
            {categories.length > 1 && (
                <div className="cs-filter-bar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`cs-filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            <section className="cs-grid">
                {filtered.length === 0 ? (
                    <div className="cs-empty">
                        <p>No case studies published yet.</p>
                    </div>
                ) : (
                    filtered.map(cs => (
                        <Link to={`/case-studies/${cs.slug || cs.id}`} className="cs-card" key={cs.id}>
                            <div
                                className="cs-card-image"
                                style={{
                                    background: cs.featureImage
                                        ? `url(${cs.featureImage}) center/cover no-repeat`
                                        : `linear-gradient(135deg, ${cs.gradientStart || '#6366F1'} 0%, ${cs.gradientEnd || '#E8722A'} 100%)`,
                                }}
                            />
                            <div className="cs-card-body">
                                <span className="cs-card-category">{cs.category || 'Case Study'}</span>
                                <h3 className="cs-card-title">{cs.title}</h3>
                                <p className="cs-card-subtitle">{cs.subtitle || ''}</p>
                                {cs.tags && (
                                    <div className="cs-card-tags">
                                        {cs.tags.split(',').slice(0, 3).map((tag, i) => (
                                            <span className="cs-tag" key={i}>{tag.trim()}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </section>

            <Footer />
        </div>
    );
}

export default CaseStudies;
