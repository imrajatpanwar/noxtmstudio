import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-col footer-col--brand">
                    <h4 className="footer-brand-name saudagar-text">Noxtm Studio</h4>
                    <p className="footer-brand-desc">A full-service digital marketing agency helping Indian brands grow with culturally-rooted strategies, creative design, and performance marketing.</p>
                </div>
                <div className="footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li><Link to="/company">About</Link></li>
                        <li><Link to="/company">Careers</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Resources</h4>
                    <ul>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><Link to="/case-studies">Case Studies</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>Community</h4>
                    <ul>
                        <li><Link to="/visitor/login">Sign in</Link></li>
                        <li><Link to="/visitor/register">Create account</Link></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://x.com" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span className="footer-logo">◉ NOXTM STUDIO</span>
                <span>© {new Date().getFullYear()} Noxtm Studio. All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;
