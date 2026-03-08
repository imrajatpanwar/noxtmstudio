import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Company.css';

function Company() {
    return (
        <div className="company-page">
            {/* Navbar */}
            <div className="navbar-wrapper">
                <nav className="navbar">
                    <div className="nav-logo">
                        <Link to="/" className="logo-text" style={{textDecoration:'none',color:'inherit'}}>Noxtm Studio</Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/blog">Blogs</Link></li>
                        <li><Link to="/case-studies">Case Studies</Link></li>
                        <li><Link to="/work">Work</Link></li>
                    </ul>
                    <Link to="/contact" className="nav-cta">Contact</Link>
                </nav>
            </div>

            {/* Hero */}
            <section className="comp-hero">
                <div className="comp-hero-inner">
                    <span className="comp-badge">About Us</span>
                    <h1 className="comp-hero-title">We Are Noxtm Studio</h1>
                    <p className="comp-hero-sub">
                        A full-service digital marketing agency rooted in Indian culture,
                        powered by data, and driven by creativity. We help brands grow
                        their social media presence with strategies that resonate.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="comp-section">
                <div className="comp-section-inner">
                    <div className="comp-two-col">
                        <div className="comp-col">
                            <span className="comp-label">OUR MISSION</span>
                            <h2 className="comp-heading">Empowering Indian Brands to Dominate Digital</h2>
                            <p className="comp-text">
                                At Noxtm Studio, we believe every Indian brand has a unique story worth telling.
                                We combine culturally-rooted storytelling with cutting-edge digital marketing
                                strategies to help businesses connect authentically with their audiences.
                            </p>
                            <p className="comp-text">
                                From local startups to established enterprises, we craft social media strategies
                                that don't just chase metrics — they build communities, drive conversations,
                                and create lasting brand loyalty.
                            </p>
                        </div>
                        <div className="comp-col comp-stat-grid">
                            <div className="comp-stat-card">
                                <span className="comp-stat-num">50+</span>
                                <span className="comp-stat-label">Brands Served</span>
                            </div>
                            <div className="comp-stat-card">
                                <span className="comp-stat-num">1M+</span>
                                <span className="comp-stat-label">Followers Gained</span>
                            </div>
                            <div className="comp-stat-card">
                                <span className="comp-stat-num">300%</span>
                                <span className="comp-stat-label">Avg. ROI</span>
                            </div>
                            <div className="comp-stat-card">
                                <span className="comp-stat-num">3+</span>
                                <span className="comp-stat-label">Years of Impact</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do */}
            <section className="comp-section comp-section--alt">
                <div className="comp-section-inner">
                    <span className="comp-label">WHAT WE DO</span>
                    <h2 className="comp-heading">Full-Service Digital Marketing</h2>
                    <div className="comp-services-grid">
                        <div className="comp-service-card">
                            <div className="comp-service-icon">📱</div>
                            <h3>Social Media Management</h3>
                            <p>Crafting scroll-stopping content and growing engaged communities across all social platforms.</p>
                        </div>
                        <div className="comp-service-card">
                            <div className="comp-service-icon">📊</div>
                            <h3>Performance Marketing</h3>
                            <p>Data-driven ad campaigns on Meta & Google that maximize ROAS and deliver measurable growth.</p>
                        </div>
                        <div className="comp-service-card">
                            <div className="comp-service-icon">🎨</div>
                            <h3>Graphic Design</h3>
                            <p>From brand identity to social creatives — designs that blend Indian aesthetics with modern sophistication.</p>
                        </div>
                        <div className="comp-service-card">
                            <div className="comp-service-icon">📝</div>
                            <h3>Content Strategy</h3>
                            <p>Strategic content planning that positions your brand as a thought leader in your industry.</p>
                        </div>
                        <div className="comp-service-card">
                            <div className="comp-service-icon">🔍</div>
                            <h3>SEO & Analytics</h3>
                            <p>Organic growth strategies backed by deep analytics to ensure sustained long-term visibility.</p>
                        </div>
                        <div className="comp-service-card">
                            <div className="comp-service-icon">🤝</div>
                            <h3>Brand Consulting</h3>
                            <p>Strategic brand positioning and market analysis to help you stand out in crowded markets.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="comp-section">
                <div className="comp-section-inner">
                    <span className="comp-label">OUR VALUES</span>
                    <h2 className="comp-heading">What Drives Us</h2>
                    <div className="comp-values-grid">
                        <div className="comp-value-item">
                            <div className="comp-value-num">01</div>
                            <h3>Cultural Roots</h3>
                            <p>Every strategy is rooted in understanding India's diverse cultural landscape.</p>
                        </div>
                        <div className="comp-value-item">
                            <div className="comp-value-num">02</div>
                            <h3>Data-Driven</h3>
                            <p>Decisions backed by analytics, not assumptions. Every move is measured.</p>
                        </div>
                        <div className="comp-value-item">
                            <div className="comp-value-num">03</div>
                            <h3>Creative Excellence</h3>
                            <p>Pushing creative boundaries while staying true to your brand's voice.</p>
                        </div>
                        <div className="comp-value-item">
                            <div className="comp-value-num">04</div>
                            <h3>Client First</h3>
                            <p>Your growth is our success. We treat every brand as our own.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="comp-cta">
                <h2>Ready to grow your brand?</h2>
                <p>Let's build something amazing together.</p>
                <Link to="/contact" className="comp-cta-btn">Get in Touch ✦</Link>
            </section>

            <Footer />
        </div>
    );
}

export default Company;
