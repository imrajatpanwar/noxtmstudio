import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import './BlogPost.css';
import './Blog.css';

/* ── Sample Blog Data (same as Blog.js) ── */
const BLOG_POSTS = [
    {
        id: 1,
        author: 'Arjun Mehta',
        authorAvatar: '🧡',
        publication: 'Noxtm Insights',
        title: 'Why Indian Brands Need Culturally-Rooted Social Media Strategies',
        description: 'The brands that win on social media in India aren\'t just translating global content — they\'re building narratives rooted in regional culture, festivals, and everyday traditions that resonate deeply.',
        thumbnailColor: '#E8722A',
        date: 'Feb 25, 2026',
        readTime: '8 min read',
        claps: 342,
        comments: 18,
        featured: true,
    },
    {
        id: 2,
        author: 'Sneha Kapoor',
        authorAvatar: '💜',
        publication: 'Design at Noxtm',
        title: 'The Art of Scroll-Stopping Creatives: A Design Framework',
        description: 'After designing 5,000+ social media creatives, we distilled our process into a repeatable framework that consistently delivers 3× higher engagement than industry benchmarks.',
        thumbnailColor: '#6366F1',
        date: 'Feb 20, 2026',
        readTime: '12 min read',
        claps: 891,
        comments: 45,
        featured: true,
    },
    {
        id: 3,
        author: 'Rohan Desai',
        authorAvatar: '🟢',
        publication: 'Growth Lab',
        title: 'Performance Marketing in 2026: The Complete Strategy Guide for Indian Markets',
        description: 'From audience micro-segmentation to creative fatigue management, here\'s everything you need to know about running profitable Meta and Google ad campaigns in India this year.',
        thumbnailColor: '#10B981',
        date: 'Feb 15, 2026',
        readTime: '15 min read',
        claps: 1204,
        comments: 67,
        featured: true,
    },
    {
        id: 4,
        author: 'Priya Sharma',
        authorAvatar: '🔶',
        publication: 'Noxtm Insights',
        title: 'How We Scaled a D2C Brand to 1M Followers in 6 Months',
        description: 'A detailed case study on how we combined organic content strategy with targeted paid campaigns to build a massive, engaged following for an ethnic wear brand starting from scratch.',
        thumbnailColor: '#F0A030',
        date: 'Feb 10, 2026',
        readTime: '10 min read',
        claps: 578,
        comments: 32,
        featured: false,
    },
    {
        id: 5,
        author: 'Vikram Nair',
        authorAvatar: '🔵',
        publication: 'Growth Lab',
        title: 'Retargeting Done Right: Turning Window Shoppers into Loyal Customers',
        description: 'Most brands waste 60% of their retargeting budget. Learn the funnel-based retargeting framework we use to achieve 4× ROAS consistently across industries.',
        thumbnailColor: '#3B82F6',
        date: 'Feb 5, 2026',
        readTime: '7 min read',
        claps: 456,
        comments: 21,
        featured: false,
    },
    {
        id: 6,
        author: 'Ananya Iyer',
        authorAvatar: '🌸',
        publication: 'Design at Noxtm',
        title: 'Building Brand Identity Systems That Scale Across Platforms',
        description: 'A comprehensive guide to creating flexible brand identity systems that maintain consistency from Instagram Stories to billboard campaigns without losing their soul.',
        thumbnailColor: '#EC4899',
        date: 'Jan 28, 2026',
        readTime: '9 min read',
        claps: 723,
        comments: 38,
        featured: true,
    },
    {
        id: 7,
        author: 'Karthik Reddy',
        authorAvatar: '🟠',
        publication: 'Noxtm Insights',
        title: 'The Content Calendar Blueprint: Planning 90 Days of Social Media',
        description: 'Stop scrambling for content ideas. Our 90-day content planning methodology helps brands maintain consistency while staying culturally relevant and timely.',
        thumbnailColor: '#F97316',
        date: 'Jan 22, 2026',
        readTime: '11 min read',
        claps: 389,
        comments: 27,
        featured: false,
    },
    {
        id: 8,
        author: 'Meera Joshi',
        authorAvatar: '💎',
        publication: 'Growth Lab',
        title: 'SEO for Indian Businesses: A Vernacular-First Approach',
        description: 'With 500M+ Indian internet users preferring regional languages, your SEO strategy needs a fundamental rethink. Here\'s how to capture the next wave of search traffic.',
        thumbnailColor: '#8B5CF6',
        date: 'Jan 15, 2026',
        readTime: '13 min read',
        claps: 612,
        comments: 41,
        featured: false,
    },
    {
        id: 9,
        author: 'Arjun Mehta',
        authorAvatar: '🧡',
        publication: 'Noxtm Insights',
        title: 'Instagram Reels vs YouTube Shorts: Where Should Indian Brands Invest?',
        description: 'A data-driven comparison of both platforms in the Indian context — reach, engagement, conversion rates, and audience demographics broken down by industry.',
        thumbnailColor: '#EF4444',
        date: 'Jan 8, 2026',
        readTime: '6 min read',
        claps: 934,
        comments: 53,
        featured: true,
    },
    {
        id: 10,
        author: 'Sneha Kapoor',
        authorAvatar: '💜',
        publication: 'Design at Noxtm',
        title: 'Motion Graphics for Social Media: The Complete Beginner\'s Guide',
        description: 'Static posts are losing ground. Learn how to incorporate motion graphics into your social media strategy without a massive production budget or After Effects expertise.',
        thumbnailColor: '#C4B5FD',
        date: 'Jan 2, 2026',
        readTime: '14 min read',
        claps: 501,
        comments: 29,
        featured: false,
    },
];

/* ── Helper: Format clap count ── */
function formatClaps(n) {
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n;
}

/* ── Generate placeholder paragraphs based on title ── */
function generateContent(post) {
    const paragraphs = [
        `The landscape of ${post.title.toLowerCase().includes('brand') ? 'brand building' : 'digital marketing'} in India is undergoing a fundamental transformation. What worked even two years ago — repurposing global templates, relying solely on English content, or treating social media as an afterthought — no longer cuts it. The modern Indian consumer is digitally savvy, culturally proud, and has an uncanny ability to spot inauthenticity from a mile away. In this comprehensive guide from ${post.publication}, we explore what it really takes to succeed.`,

        `At Noxtm Studio, we've had the privilege of working with over 150 brands across categories — from heritage textile houses in Varanasi to Gen-Z D2C brands in Bengaluru. The single thread that connects every successful campaign? A deep, almost obsessive understanding of the audience. Not just demographics, but psychographics: what makes them laugh on a Monday morning, what cultural reference will stop their thumb mid-scroll, what value proposition speaks to their specific life stage and aspirations.`,

        `The data backs this up. Campaigns that incorporated region-specific cultural cues saw a 4.2× increase in engagement compared to generic content. When we A/B tested festive season content for a leading ethnic wear brand, the Onam-specific creative for Kerala outperformed the generic Diwali creative by 287% in that market. These aren't marginal improvements — they're the difference between being part of the conversation and being filtered out as noise.`,

        `Looking ahead, the brands that will thrive are those that treat their digital presence not as a marketing channel, but as a living, breathing extension of their brand identity. This means investing in content creators who understand regional nuances, building systems that allow for rapid localization, and having the courage to let go of one-size-fits-all approaches. The future belongs to brands that can be simultaneously global in quality and hyperlocal in resonance.`,
    ];
    return paragraphs;
}

/* ── Main BlogPost Component ── */
function BlogPost() {
    const { id } = useParams();
    const post = BLOG_POSTS.find(p => p.id === parseInt(id, 10));
    const [currentVisitor, setCurrentVisitor] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        try {
            const user = localStorage.getItem('noxtm_visitor_user');
            if (user) setCurrentVisitor(JSON.parse(user));
        } catch { /* ignore */ }
    }, []);

    useEffect(() => {
        if (!id) return;
        try {
            const saved = localStorage.getItem(`noxtm_blog_comments_${id}`);
            if (saved) setComments(JSON.parse(saved));
        } catch { /* ignore */ }
    }, [id]);

    const handleAddComment = () => {
        if (!newComment.trim() || !currentVisitor) return;
        const comment = {
            id: Date.now(),
            name: currentVisitor.name,
            avatar: currentVisitor.avatar || '👤',
            text: newComment.trim(),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        };
        const updated = [...comments, comment];
        setComments(updated);
        localStorage.setItem(`noxtm_blog_comments_${id}`, JSON.stringify(updated));
        setNewComment('');
    };

    /* Related posts: 3 random other posts (memoized to prevent re-shuffle) */
    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return BLOG_POSTS.filter(p => p.id !== post.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }, [post]);

    /* ── Not Found ── */
    if (!post) {
        return (
            <div className="blogpost-page blog-page">
                {/* Navbar */}
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
                        <Link to="/#contact" className="nav-cta">Contact</Link>
                    </nav>
                </div>

                <div className="blogpost-notfound">
                    <h1>Post not found</h1>
                    <p>Sorry, we couldn't find the article you're looking for.</p>
                    <Link to="/blog" className="blogpost-notfound-link">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const bodyParagraphs = generateContent(post);

    return (
        <div className={`blogpost-page blog-page ${currentVisitor ? 'blog-page--with-sidebar' : ''}`}>
            {/* ═══ Visitor Sidebar (when logged in) ═══ */}
            {currentVisitor && (
                <aside className="visitor-sidebar blog-visitor-sidebar">
                    <div className="visitor-sidebar-logo">Noxtm Studio</div>
                    <nav className="visitor-sidebar-nav">
                        <NavLink to="/blog">
                            <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><polyline points="9 21 9 13 15 13 15 21" /></svg>
                            Home
                        </NavLink>
                        <NavLink to="/visitor/dashboard">
                            <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg>
                            Library
                        </NavLink>
                        <NavLink to="/visitor/profile">
                            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Profile
                        </NavLink>
                        <NavLink to="/visitor/my-blogs">
                            <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                            Stories
                        </NavLink>
                        <NavLink to="/visitor/stats">
                            <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                            Stats
                        </NavLink>
                        <div className="sidebar-divider" />
                        <div className="sidebar-section-label">Following</div>
                        <div className="sidebar-section-text">
                            Find writers and publications to follow.
                            <br />
                            <Link to="/blog">See suggestions</Link>
                        </div>
                    </nav>
                    <div className="sidebar-user">
                        <div className="sidebar-user-avatar">{currentVisitor.avatar || '👤'}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{currentVisitor.name}</div>
                            <div className="sidebar-user-email">{currentVisitor.email}</div>
                        </div>
                        <button className="sidebar-logout-btn" onClick={() => { localStorage.removeItem('noxtm_visitor_token'); localStorage.removeItem('noxtm_visitor_user'); window.location.reload(); }} title="Sign out">
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
                    <Link to="/#contact" className="nav-cta">Contact</Link>
                </nav>
            </div>

            {/* ═══ Article ═══ */}
            <article className="blogpost-container">
                {/* Back Link */}
                <Link to="/blog" className="blogpost-back">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    All articles
                </Link>

                {/* Header */}
                <header className="blogpost-header">
                    <span className="blogpost-publication">{post.publication}</span>
                    <h1 className="blogpost-title">{post.title}</h1>
                    <p className="blogpost-subtitle">{post.description}</p>
                </header>

                {/* Author Info */}
                <div className="blogpost-author-row blogpost-author-row--enhanced">
                    <div className="blogpost-author-avatar">{post.authorAvatar}</div>
                    <div className="blogpost-author-info">
                        <div className="blogpost-author-name">{post.author}</div>
                        <p className="blogpost-author-bio">Digital marketing expert sharing insights on brands, creativity, and growth strategies in the Indian market.</p>
                        <div className="blogpost-author-meta">
                            <span>{post.publication}</span>
                            <span className="meta-dot">·</span>
                            <span>{post.date}</span>
                            <span className="meta-dot">·</span>
                            <span>{post.readTime}</span>
                            <span className="meta-dot">·</span>
                            <span>5.4K followers</span>
                        </div>
                    </div>
                    <button className="blogpost-follow-btn">Follow</button>
                </div>

                {/* Featured Color Block */}
                <div className="blogpost-featured" style={{ backgroundColor: post.thumbnailColor }}>
                    <span className="blogpost-featured-icon">
                        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                            <rect x="8" y="8" width="48" height="48" rx="8" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                            <circle cx="24" cy="24" r="6" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                            <path d="M8 44l14-14 10 10 8-8 16 16" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                </div>

                {/* Article Body */}
                <div className="blogpost-body">
                    {bodyParagraphs.map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>

                {/* Claps & Actions */}
                <div className="blogpost-actions">
                    <div className="blogpost-actions-left">
                        <button className="blogpost-action-item">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <path d="M5.5 9.5L3 12V7l2.5-3.5L8 1l2.5 2.5L13 7v5l-2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {formatClaps(post.claps)}
                        </button>
                        <button className="blogpost-action-item">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <path d="M2 3h12v8H5l-3 3V3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {post.comments}
                        </button>
                    </div>
                    <div className="blogpost-actions-right">
                        <button className="blogpost-icon-btn" aria-label="Bookmark">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <path d="M3 2h10v13l-5-3.5L3 15V2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="blogpost-icon-btn" aria-label="Share">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <path d="M4 9v4h8V9M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="blogpost-icon-btn" aria-label="More">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                                <circle cx="4" cy="8" r="1.2" fill="currentColor"/>
                                <circle cx="8" cy="8" r="1.2" fill="currentColor"/>
                                <circle cx="12" cy="8" r="1.2" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <section className="blogpost-comments">
                    <h3 className="blogpost-comments-title">Comments ({comments.length})</h3>
                    {currentVisitor ? (
                        <div className="blogpost-comment-form">
                            <div className="blogpost-comment-avatar">{currentVisitor.avatar || '👤'}</div>
                            <div className="blogpost-comment-input-wrapper">
                                <textarea placeholder="What are your thoughts?" value={newComment} onChange={e => setNewComment(e.target.value)} className="blogpost-comment-input" />
                                <button className="blogpost-comment-submit" onClick={handleAddComment}>Respond</button>
                            </div>
                        </div>
                    ) : (
                        <div className="blogpost-comment-login">
                            <p>Sign in to leave a comment</p>
                            <Link to="/visitor/login" className="blogpost-comment-login-btn">Sign in</Link>
                        </div>
                    )}
                    <div className="blogpost-comment-list">
                        {comments.map(c => (
                            <div className="blogpost-comment-item" key={c.id}>
                                <div className="blogpost-comment-item-avatar">{c.avatar || '👤'}</div>
                                <div>
                                    <div className="blogpost-comment-item-header">
                                        <strong>{c.name}</strong>
                                        <span>{c.date}</span>
                                    </div>
                                    <p className="blogpost-comment-item-text">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Related Posts */}
                <section className="blogpost-related">
                    <h2 className="blogpost-related-title">More from Noxtm Studio</h2>
                    <div className="blogpost-related-grid">
                        {relatedPosts.map(rp => (
                            <Link to={`/blog/${rp.id}`} className="blogpost-related-card" key={rp.id}>
                                <div className="blogpost-related-thumb" style={{ backgroundColor: rp.thumbnailColor }}>
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <rect x="4" y="4" width="20" height="20" rx="4" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                                        <circle cx="11" cy="11" r="3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                                        <path d="M4 19l6-6 4 4 4-4 6 6" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="blogpost-related-info">
                                    <h4>{rp.title}</h4>
                                    <div className="blogpost-related-meta">
                                        <span>{rp.author}</span>
                                        <span>·</span>
                                        <span>{rp.date}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </article>

            {/* ═══ Footer ═══ */}
            <Footer />
        </div>
    );
}

export default BlogPost;
