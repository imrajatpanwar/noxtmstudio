import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './CaseStudies.css';

function CaseStudyDetail() {
    const { slug } = useParams();
    const [study, setStudy] = useState(null);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('noxtm_case_studies') || '[]');
            const found = saved.find(s => (s.slug === slug || s.id === slug) && s.status === 'Published');
            setStudy(found || null);
        } catch { }
    }, [slug]);

    if (!study) {
        return (
            <div className="cs-page">
                <div className="navbar-wrapper">
                    <nav className="navbar">
                        <div className="nav-logo"><Link to="/" className="logo-text" style={{textDecoration:'none',color:'inherit'}}>Noxtm Studio</Link></div>
                        <ul className="nav-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/case-studies">Case Studies</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="cs-not-found">
                    <h2>Case Study Not Found</h2>
                    <p>The case study you're looking for doesn't exist or hasn't been published yet.</p>
                    <Link to="/case-studies" className="cs-back-btn">← Back to Case Studies</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cs-page">
            <div className="navbar-wrapper">
                <nav className="navbar">
                    <div className="nav-logo"><Link to="/" className="logo-text" style={{textDecoration:'none',color:'inherit'}}>Noxtm Studio</Link></div>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/case-studies">Case Studies</Link></li>
                    </ul>
                    <Link to="/case-studies" className="nav-cta">All Studies</Link>
                </nav>
            </div>

            {/* Hero banner */}
            <section
                className="csd-hero"
                style={{
                    background: study.featureImage
                        ? `url(${study.featureImage}) center/cover no-repeat`
                        : `linear-gradient(135deg, ${study.gradientStart || '#6366F1'} 0%, ${study.gradientEnd || '#E8722A'} 100%)`,
                }}
            >
                <div className="csd-hero-overlay">
                    <span className="csd-category">{study.category || 'Case Study'}</span>
                    <h1 className="csd-title">{study.title}</h1>
                    <p className="csd-subtitle">{study.subtitle || ''}</p>
                </div>
            </section>

            {/* Meta row */}
            <section className="csd-meta">
                {study.clientName && (
                    <div className="csd-meta-item">
                        <span className="csd-meta-label">Client</span>
                        <span className="csd-meta-value">{study.clientName}</span>
                    </div>
                )}
                {study.category && (
                    <div className="csd-meta-item">
                        <span className="csd-meta-label">Category</span>
                        <span className="csd-meta-value">{study.category}</span>
                    </div>
                )}
                {study.publishDate && (
                    <div className="csd-meta-item">
                        <span className="csd-meta-label">Date</span>
                        <span className="csd-meta-value">{study.publishDate}</span>
                    </div>
                )}
                {study.projectUrl && (
                    <div className="csd-meta-item">
                        <span className="csd-meta-label">Website</span>
                        <a href={study.projectUrl} target="_blank" rel="noopener noreferrer" className="csd-meta-link">{study.projectUrl}</a>
                    </div>
                )}
            </section>

            {/* Content */}
            <section className="csd-content">
                <div className="csd-description" dangerouslySetInnerHTML={{ __html: study.description.replace(/\n/g, '<br/>') }} />

                {study.tags && (
                    <div className="csd-tags">
                        {study.tags.split(',').map((tag, i) => (
                            <span className="cs-tag" key={i}>{tag.trim()}</span>
                        ))}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default CaseStudyDetail;
