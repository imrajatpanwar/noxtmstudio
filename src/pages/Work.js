import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
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
            <Navbar ctaText="Explore Blog" ctaLink="/blog" />

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
