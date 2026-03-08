import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../api';
import './Work.css';

function Work() {
    const [works, setWorks] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const data = await api.getWorks();
                const published = data.filter(w => w.status === 'Published');
                setWorks(published);
            } catch (err) {
                console.error('Failed to fetch works:', err);
            }
        };
        fetchWorks();
    }, []);

    const categories = ['All', ...new Set(works.map(w => w.category).filter(Boolean))];
    const filtered = filter === 'All' ? works : works.filter(w => w.category === filter);

    return (
        <div className="work-page">
            <div className="navbar-wrapper">
                <nav className="navbar">
                    <div className="nav-logo">
                        <Link to="/" className="logo-text" style={{textDecoration:'none',color:'inherit'}}>Noxtm Studio</Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/blog">Blogs</Link></li>
                        <li><Link to="/case-studies">Case Studies</Link></li>
                        <li><Link to="/work" style={{color:'var(--text-primary)'}}>Work</Link></li>
                    </ul>
                    <Link to="/blog" className="nav-cta">Explore Blog</Link>
                </nav>
            </div>

            <section className="work-hero">
                <h1 className="work-hero-title">Our Work</h1>
                <p className="work-hero-sub">A showcase of our best projects, clients, and creative endeavors.</p>
            </section>

            {categories.length > 1 && (
                <div className="work-filter-bar">
                    {categories.map(cat => (
                        <button key={cat} className={`work-filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            <section className="work-grid">
                {filtered.length === 0 ? (
                    <div className="work-empty"><p>No work published yet. Check back soon!</p></div>
                ) : filtered.map(work => (
                    <Link to={`/work/${work.slug || work._id}`} className="work-card" key={work._id}>
                        <div className="work-card-image" style={{
                            background: work.featureImage
                                ? `url(${work.featureImage}) center/cover no-repeat`
                                : `linear-gradient(135deg, ${work.gradientStart || '#6366F1'} 0%, ${work.gradientEnd || '#E8722A'} 100%)`,
                        }} />
                        <div className="work-card-body">
                            <span className="work-card-category">{work.category || 'Work'}</span>
                            <h3 className="work-card-title">{work.title}</h3>
                            <p className="work-card-subtitle">{work.subtitle || ''}</p>
                            {work.tags && (
                                <div className="work-card-tags">
                                    {work.tags.split(',').slice(0, 3).map((tag, i) => (
                                        <span className="work-tag" key={i}>{tag.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </section>

            <Footer />
        </div>
    );
}

export default Work;
