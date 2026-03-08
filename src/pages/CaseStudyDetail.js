import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '../api';
import './CaseStudies.css';

function CaseStudyDetail() {
    const { slug } = useParams();
    const [study, setStudy] = useState(null);

    useEffect(() => {
        const fetchStudy = async () => {
            try {
                const data = await api.getCaseStudy(slug);
                setStudy(data);
            } catch (err) {
                console.error('Failed to fetch case study:', err);
                setStudy(null);
            }
        };
        fetchStudy();
    }, [slug]);

    if (!study) {
        return (
            <div className="cs-page">
                <Navbar ctaText="All Studies" ctaLink="/case-studies" />
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
            <Navbar ctaText="All Studies" ctaLink="/case-studies" />

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
