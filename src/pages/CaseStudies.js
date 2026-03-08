import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '../api';
import './CaseStudies.css';

function CaseStudies() {
    const [studies, setStudies] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const data = await api.getCaseStudies();
                const published = data.filter(s => s.status === 'Published');
                setStudies(published);
            } catch (err) {
                console.error('Failed to fetch case studies:', err);
            }
        };
        fetchStudies();
    }, []);

    const categories = ['All', ...new Set(studies.map(s => s.category).filter(Boolean))];
    const filtered = filter === 'All' ? studies : studies.filter(s => s.category === filter);

    return (
        <div className="cs-page">
            {/* Navbar */}
            <Navbar ctaText="Explore Blog" ctaLink="/blog" />

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
                        <Link to={`/case-studies/${cs.slug || cs._id}`} className="cs-card" key={cs._id}>
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
