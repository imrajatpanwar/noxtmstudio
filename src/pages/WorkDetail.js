import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '../api';
import './Work.css';

function WorkDetail() {
    const { slug } = useParams();
    const [work, setWork] = useState(null);

    useEffect(() => {
        const fetchWork = async () => {
            try {
                const data = await api.getWork(slug);
                setWork(data);
            } catch (err) {
                console.error('Failed to fetch work:', err);
                setWork(null);
            }
        };
        fetchWork();
    }, [slug]);

    if (!work) {
        return (
            <div className="work-page">
                <Navbar ctaText="All Work" ctaLink="/work" />
                <div className="work-not-found">
                    <h2>Work Not Found</h2>
                    <p>The work item you're looking for doesn't exist or hasn't been published yet.</p>
                    <Link to="/work" className="work-back-btn">← Back to Work</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="work-page">
            <Navbar ctaText="All Work" ctaLink="/work" />

            <section className="wd-hero" style={{
                background: work.featureImage
                    ? `url(${work.featureImage}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${work.gradientStart || '#6366F1'} 0%, ${work.gradientEnd || '#E8722A'} 100%)`,
            }}>
                <div className="wd-hero-overlay">
                    <span className="wd-category">{work.category || 'Work'}</span>
                    <h1 className="wd-title">{work.title}</h1>
                    <p className="wd-subtitle">{work.subtitle || ''}</p>
                </div>
            </section>

            <section className="wd-meta">
                {work.clientName && <div className="wd-meta-item"><span className="wd-meta-label">Client</span><span className="wd-meta-value">{work.clientName}</span></div>}
                {work.category && <div className="wd-meta-item"><span className="wd-meta-label">Category</span><span className="wd-meta-value">{work.category}</span></div>}
                {work.publishDate && <div className="wd-meta-item"><span className="wd-meta-label">Date</span><span className="wd-meta-value">{work.publishDate}</span></div>}
                {work.projectUrl && <div className="wd-meta-item"><span className="wd-meta-label">Website</span><a href={work.projectUrl} target="_blank" rel="noopener noreferrer" className="wd-meta-link">{work.projectUrl}</a></div>}
            </section>

            <section className="wd-content">
                <div className="wd-description" dangerouslySetInnerHTML={{ __html: work.description.replace(/\n/g, '<br/>') }} />
                {work.tags && (
                    <div className="wd-tags">
                        {work.tags.split(',').map((tag, i) => <span className="work-tag" key={i}>{tag.trim()}</span>)}
                    </div>
                )}
            </section>

            <Footer />
        </div>
    );
}

export default WorkDetail;
