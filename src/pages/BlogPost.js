import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, NavLink } from 'react-router-dom';
import Footer from '../components/Footer';
import api from '../api';
import './BlogPost.css';
import './Blog.css';

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

/* ── Render visitor blog content (supports block-based JSON or plain text) ── */
function VisitorBlogContent({ content }) {
    if (!content) return null;
    let blocks;
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) blocks = parsed;
    } catch {}
    
    if (!blocks) {
        // Plain text fallback
        return content.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
        ));
    }

    return blocks.map((block, i) => {
        if (block.type === 'image') {
            return (
                <figure key={i} className="blogpost-inline-image">
                    {block.url && <img src={block.url} alt={block.alt || ''} />}
                    {(block.credit || block.alt) && (
                        <figcaption>
                            {block.credit || block.alt}
                        </figcaption>
                    )}
                </figure>
            );
        }
        // Text block — render with basic markdown-like formatting
        return (block.content || '').split('\n\n').map((para, j) => {
            if (para.startsWith('## ')) return <h2 key={`${i}-${j}`}>{para.slice(3)}</h2>;
            if (para.startsWith('> ')) return <blockquote key={`${i}-${j}`}>{para.slice(2)}</blockquote>;
            return <p key={`${i}-${j}`} dangerouslySetInnerHTML={{ __html: formatMarkdown(para) }} />;
        });
    });
}

function formatMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/* ── Main BlogPost Component ── */
function BlogPost() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    const [loading, setLoading] = useState(true);
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
        const fetchBlog = async () => {
            setLoading(true);
            try {
                // Check if it's a visitor blog (id starts with "visitor-")
                if (id.startsWith('visitor-')) {
                    const realId = id.replace('visitor-', '');
                    const data = await api.getVisitorBlog(realId);
                    setPost({
                        ...data,
                        _id: id,
                        author: data.visitorName,
                        authorAvatar: data.visitorProfileImage ? null : (data.visitorAvatar || '👤'),
                        authorProfileImage: data.visitorProfileImage || '',
                        authorVerified: data.visitorVerified || false,
                        publication: 'Community',
                        title: data.title,
                        description: data.excerpt,
                        thumbnailColor: '#6366f1',
                        date: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        readTime: data.readTime || '5 min read',
                        claps: data.claps || 0,
                        comments: data.comments?.length || 0,
                        isVisitorBlog: true,
                        visitorBlogContent: data.content,
                    });
                    // Increment view count
                    api.incrementBlogView(realId).catch(() => {});
                } else {
                    const data = await api.getBlog(id);
                    setPost(data);
                }
            } catch (err) {
                console.error('Failed to fetch blog:', err);
                setPost(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    useEffect(() => {
        const fetchAllBlogs = async () => {
            try {
                const data = await api.getBlogs();
                setAllPosts(data.filter(b => b.status === 'Published'));
            } catch { /* ignore */ }
        };
        fetchAllBlogs();
    }, []);

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

        setNewComment('');
    };

    /* Related posts: 3 random other posts (memoized to prevent re-shuffle) */
    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return allPosts.filter(p => p._id !== post._id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
    }, [post, allPosts]);

    /* ── Not Found / Loading ── */
    if (loading) {
        return (
            <div className="blogpost-page blog-page">
                <div className="navbar-wrapper">
                    <nav className="navbar">
                        <div className="nav-logo">
                            <Link to="/" className="logo-text">Noxtm Studio</Link>
                        </div>
                        <ul className="nav-links">
                            <li><Link to="/blog">Blogs</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="blogpost-notfound">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

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
                        {currentVisitor.profileImage ? (
                            <img src={currentVisitor.profileImage} alt={currentVisitor.name} className="sidebar-user-avatar-img" />
                        ) : (
                            <div className="sidebar-user-avatar">{currentVisitor.avatar || '👤'}</div>
                        )}
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">
                                {currentVisitor.name}
                                {currentVisitor.verified && <span className="verified-badge" title="Verified">✓</span>}
                            </div>
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
                    {post.authorProfileImage ? (
                        <img src={post.authorProfileImage} alt={post.author} className="blogpost-author-avatar-img" />
                    ) : (
                        <div className="blogpost-author-avatar">{post.authorAvatar}</div>
                    )}
                    <div className="blogpost-author-info">
                        <div className="blogpost-author-name">
                            {post.author}
                            {post.authorVerified && <span className="verified-badge" title="Verified">✓</span>}
                        </div>
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
                    {post.isVisitorBlog ? (
                        <VisitorBlogContent content={post.visitorBlogContent} />
                    ) : (
                        bodyParagraphs.map((para, i) => (
                            <p key={i}>{para}</p>
                        ))
                    )}
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
                            <Link to={`/blog/${rp.slug || rp._id}`} className="blogpost-related-card" key={rp._id}>
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
