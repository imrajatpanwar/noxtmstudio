import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../api';
import './Blog.css';

const RECOMMENDED_TOPICS = [
    'Programming', 'Digital Marketing', 'Social Media', 'Design',
    'SEO', 'Content Strategy', 'Branding', 'Analytics',
    'UX Design', 'Copywriting', 'Growth Hacking', 'AI & Marketing',
];

/* ── Helper: Format clap count ── */
function formatClaps(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n;
}

/* ── Blog Card Component ── */
function BlogCard({ post }) {
    return (
        <Link to={`/blog/${post.slug || post._id}`} className="blog-card-link">
        <article className="blog-card">
            <div className="blog-card-content">
                <div className="blog-card-meta-top">
                    {post.authorProfileImage ? (
                        <img src={post.authorProfileImage} alt={post.author} className="blog-card-avatar-img" />
                    ) : (
                        <span className="blog-card-avatar">{post.authorAvatar}</span>
                    )}
                    <span className="blog-card-byline">
                        In <strong>{post.publication}</strong> by {post.author}
                        {post.authorVerified && <span className="verified-badge" title="Verified">✓</span>}
                    </span>
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-description">{post.description}</p>
                <div className="blog-card-bottom">
                    <div className="blog-card-bottom-left">
                        <span className="blog-card-star">⭐</span>
                        <span className="blog-card-date">{post.date}</span>
                        <span className="blog-card-dot">·</span>
                        <span className="blog-card-read">{post.readTime}</span>
                        <span className="blog-card-dot">·</span>
                        <span className="blog-card-claps">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.5 9.5L3 12V7l2.5-3.5L8 1l2.5 2.5L13 7v5l-2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {formatClaps(post.claps)}
                        </span>
                        <span className="blog-card-comments">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 3h12v8H5l-3 3V3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {post.comments}
                        </span>
                    </div>
                    <div className="blog-card-bottom-right">
                        <button className="blog-card-icon-btn" aria-label="Bookmark">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 2h10v13l-5-3.5L3 15V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="blog-card-icon-btn" aria-label="More">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="4" cy="8" r="1.2" fill="currentColor"/>
                                <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
                                <circle cx="12" cy="8" r="1.2" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="blog-card-thumbnail" style={{ backgroundColor: post.thumbnailColor }}>
                <span className="blog-card-thumb-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <rect x="4" y="4" width="20" height="20" rx="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                        <circle cx="11" cy="11" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                        <path d="M4 19l6-6 4 4 4-4 6 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </div>
        </article>
        </Link>
    );
}

/* ── Main Blog Page ── */
function Blog() {
    const [activeTab, setActiveTab] = useState('trending');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterMsg, setNewsletterMsg] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [visitorUser, setVisitorUser] = useState(null);

    const handleNewsletterSubscribe = async () => {
        if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
            setNewsletterMsg('Please enter a valid email address.');
            return;
        }
        try {
            await api.subscribe(newsletterEmail.trim());
            setNewsletterMsg('Thank you for subscribing! 🎉');
            setNewsletterEmail('');
            setTimeout(() => setNewsletterMsg(''), 5000);
        } catch (err) {
            setNewsletterMsg(err.message || 'Subscription failed. Please try again.');
        }
    };

    /* Read admin website settings and update document title */
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const s = await api.getSettings();
                document.title = `Blog | ${s.siteTitle || 'Noxtm Studio'}`;
            } catch (_) { /* ignore */ }
        };
        fetchSettings();
    }, []);

    /* Load blogs from API and merge with approved visitor blogs */
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const [blogs, visitorBlogs] = await Promise.all([
                    api.getBlogs(),
                    api.getVisitorBlogs({ status: 'approved' }).catch(() => []),
                ]);
                const published = blogs.filter(b => b.status === 'Published');
                const approved = (Array.isArray(visitorBlogs) ? visitorBlogs : []).map(blog => ({
                    _id: `visitor-${blog._id}`,
                    author: blog.visitorName,
                    authorAvatar: blog.visitorProfileImage ? null : (blog.visitorAvatar || '👤'),
                    authorProfileImage: blog.visitorProfileImage || '',
                    authorVerified: blog.visitorVerified || false,
                    publication: 'Community',
                    title: blog.title,
                    description: blog.excerpt,
                    thumbnailColor: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
                    date: new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    readTime: blog.readTime || '5 min read',
                    claps: blog.claps || 0,
                    comments: blog.comments?.length || 0,
                    featured: false,
                    topics: blog.topics || [],
                    isVisitorBlog: true,
                    visitorBlogId: blog._id,
                }));
                setAllPosts([...published, ...approved]);
            } catch (err) {
                console.error('Failed to fetch blogs:', err);
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('noxtm_visitor_user');
            if (stored) setVisitorUser(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    const filteredPosts = activeTab === 'trending'
        ? allPosts.filter(p => p.featured)
        : allPosts;

    return (
        <div className={`blog-page ${visitorUser ? 'blog-page--with-sidebar' : ''}`}>
            {/* ═══ Visitor Sidebar (when logged in) ═══ */}
            {visitorUser && (
                <aside className="visitor-sidebar blog-visitor-sidebar">
                    <div className="visitor-sidebar-logo">Noxtm Studio</div>
                    <nav className="visitor-sidebar-nav">
                        <NavLink to="/blog">
                            <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><polyline points="9 21 9 13 15 13 15 21" /></svg>
                            Home
                        </NavLink>
                        <NavLink to="/visitor/dashboard">
                            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                            Dashboard
                        </NavLink>
                        <NavLink to="/visitor/write">
                            <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                            Write
                        </NavLink>
                        <NavLink to="/visitor/my-blogs">
                            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            My Blogs
                        </NavLink>
                        <NavLink to="/visitor/profile">
                            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Profile
                        </NavLink>
                        <NavLink to="/visitor/stats">
                            <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                            Stats
                        </NavLink>
                    </nav>
                    <div className="sidebar-user">
                        {visitorUser.profileImage ? (
                            <img src={visitorUser.profileImage} alt={visitorUser.name} className="sidebar-user-avatar-img" />
                        ) : (
                            <div className="sidebar-user-avatar">{visitorUser.avatar || '👤'}</div>
                        )}
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">
                                {visitorUser.name}
                                {visitorUser.verified && <span className="verified-badge" title="Verified">✓</span>}
                            </div>
                            <div className="sidebar-user-email">{visitorUser.email}</div>
                        </div>
                        <button className="sidebar-logout-btn" onClick={() => { localStorage.removeItem('noxtm_visitor_token'); localStorage.removeItem('noxtm_visitor_user'); setVisitorUser(null); }} title="Sign out">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        </button>
                    </div>
                </aside>
            )}
            {/* ═══ Navbar ═══ */}
            <div className="navbar-wrapper">
                <nav className="navbar">
                    <div className="nav-logo">
                        <Link to="/" className="logo-text">Noxtm Studio</Link>
                    </div>
                    <ul className="nav-links">
                        <li><Link to="/case-studies">Case Studies</Link></li>
                        <li><Link to="/work">Work</Link></li>
                        <li><Link to="/">Services</Link></li>
                        <li className="nav-dropdown-parent">
                            <Link to="/" className="nav-dropdown-trigger">
                                About{' '}
                                <svg className="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </Link>
                            <ul className="nav-dropdown">
                                <li><Link to="/blog">Blogs</Link></li>
                                <li><Link to="/">Company</Link></li>
                                <li><Link to="/">Team</Link></li>
                            </ul>
                        </li>
                    </ul>
                    {(() => {
                        const visitor = JSON.parse(localStorage.getItem('noxtm_visitor_user') || 'null');
                        return visitor ? (
                            <Link to="/visitor/write" className="nav-write-btn">Write</Link>
                        ) : (
                            <Link to="/visitor/login" className="nav-signin-btn">Sign in</Link>
                        );
                    })()}
                    <Link to="/#contact" className="nav-cta">Contact</Link>
                </nav>
            </div>

            {/* ═══ Page Content ═══ */}
            <main className="blog-main-wrapper">
                <div className="blog-layout">
                    {/* ── Main Content Column ── */}
                    <div className="blog-main">
                        {/* Tab Switcher */}
                        <div className="blog-tabs">
                            <button
                                className={`blog-tab ${activeTab === 'trending' ? 'blog-tab--active' : ''}`}
                                onClick={() => setActiveTab('trending')}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                                    <path d="M8 2 L10 6 L14 7 L11 10 L12 14 L8 12 L4 14 L5 10 L2 7 L6 6 Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Trending
                            </button>
                            <button
                                className={`blog-tab ${activeTab === 'foryou' ? 'blog-tab--active' : ''}`}
                                onClick={() => setActiveTab('foryou')}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                                    <path d="M5 8h6M8 5v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                </svg>
                                For you
                            </button>
                        </div>

                        {/* Blog Cards */}
                        <div className="blog-feed">
                            {filteredPosts.map(post => (
                                <BlogCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>

                    {/* ── Sidebar ── */}
                    <aside className="blog-sidebar">
                        {/* Newsletter Section */}
                        <div className="blog-newsletter">
                            <h3 className="blog-newsletter-title">Subscribe to our Newsletter</h3>
                            <p className="blog-newsletter-desc">
                                Get the latest insights on digital marketing, social media strategy, and design — delivered to your inbox every week.
                            </p>
                            <div className="blog-newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="blog-newsletter-input"
                                    aria-label="Email address"
                                    value={newsletterEmail}
                                    onChange={e => setNewsletterEmail(e.target.value)}
                                />
                                <button className="blog-newsletter-btn" onClick={handleNewsletterSubscribe}>Subscribe</button>
                            </div>
                            {newsletterMsg && <p className="blog-newsletter-msg">{newsletterMsg}</p>}
                        </div>

                        {/* Recommended Topics */}
                        <div className="blog-topics">
                            <h3 className="blog-topics-title">Recommended topics</h3>
                            <div className="blog-topics-list">
                                {RECOMMENDED_TOPICS.map(topic => (
                                    <button key={topic} className="blog-topic-pill">
                                        {topic}
                                    </button>
                                ))}
                            </div>
                            <a href="#topics" className="blog-topics-link">See the full list</a>
                        </div>
                    </aside>
                </div>
            </main>

            {/* ═══ Footer ═══ */}
            <Footer />
        </div>
    );
}

export default Blog;
