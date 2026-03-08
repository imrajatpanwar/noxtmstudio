import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import api from '../api';
import './Contact.css';

function Contact() {
    const [form, setForm] = useState({
        name: '', email: '', phone: '', company: '', subject: '', message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.createInquiry(form);
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit inquiry:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-page">
            {/* Navbar */}
            <Navbar ctaText="Contact" ctaLink="/contact" ctaStyle={{pointerEvents:'none',opacity:0.6}} />

            {/* Hero */}
            <section className="ct-hero">
                <div className="ct-hero-inner">
                    <span className="ct-badge">Get in Touch</span>
                    <h1 className="ct-hero-title">Let's Build Something Great Together</h1>
                    <p className="ct-hero-sub">Have a project in mind? Want to grow your social media? We'd love to hear from you.</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="ct-content">
                <div className="ct-content-inner">
                    {/* Left: Info */}
                    <div className="ct-info">
                        <div className="ct-info-block">
                            <h3>Email Us</h3>
                            <a href="mailto:hello@noxtm.studio" className="ct-info-link">hello@noxtm.studio</a>
                        </div>
                        <div className="ct-info-block">
                            <h3>Call Us</h3>
                            <a href="tel:+919876543210" className="ct-info-link">+91 98765 43210</a>
                        </div>
                        <div className="ct-info-block">
                            <h3>Visit Us</h3>
                            <p className="ct-info-text">Noxtm Studio<br/>Jaipur, Rajasthan<br/>India</p>
                        </div>
                        <div className="ct-info-block">
                            <h3>Follow Us</h3>
                            <div className="ct-social-links">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                <a href="https://x.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="ct-form-wrapper">
                        {submitted ? (
                            <div className="ct-success">
                                <div className="ct-success-icon">✓</div>
                                <h2>Message Sent!</h2>
                                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button className="ct-reset-btn" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', phone:'', company:'', subject:'', message:'' }); }}>
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="ct-form">
                                <div className="ct-form-row">
                                    <div className="ct-form-group">
                                        <label htmlFor="ct-name">Full Name *</label>
                                        <input id="ct-name" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                                    </div>
                                    <div className="ct-form-group">
                                        <label htmlFor="ct-email">Email *</label>
                                        <input id="ct-email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="ct-form-row">
                                    <div className="ct-form-group">
                                        <label htmlFor="ct-phone">Phone</label>
                                        <input id="ct-phone" name="phone" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
                                    </div>
                                    <div className="ct-form-group">
                                        <label htmlFor="ct-company">Company</label>
                                        <input id="ct-company" name="company" type="text" placeholder="Your Company" value={form.company} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="ct-form-group ct-form-full">
                                    <label htmlFor="ct-subject">Subject *</label>
                                    <input id="ct-subject" name="subject" type="text" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                                </div>
                                <div className="ct-form-group ct-form-full">
                                    <label htmlFor="ct-message">Message *</label>
                                    <textarea id="ct-message" name="message" rows={5} placeholder="Tell us about your project, goals, and timeline..." value={form.message} onChange={handleChange} required />
                                </div>
                                <button type="submit" className="ct-submit-btn" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message ✦'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Contact;
