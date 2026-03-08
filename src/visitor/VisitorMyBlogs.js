import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Visitor.css';

function VisitorMyBlogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [visitor, setVisitor] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('noxtm_visitor_token');
        const user = localStorage.getItem('noxtm_visitor_user');
        if (!token || !user) {
            navigate('/visitor/login');
            return;
        }
        try {
            const v = JSON.parse(user);
            setVisitor(v);
            loadBlogs(v.id);
        } catch {
            navigate('/visitor/login');
        }
    }, [navigate]);

    const loadBlogs = (visitorId) => {
        const all = JSON.parse(localStorage.getItem('noxtm_visitor_blogs') || '[]');
        const mine = all.filter(b => b.visitorId === visitorId);
        setBlogs(mine);
    };

    const filteredBlogs = (filter === 'all' ? blogs : blogs.filter(b => b.status === filter))
        .filter(b => !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleDelete = (blogId) => {
        if (!window.confirm('Are you sure you want to delete this story?')) return;
        const all = JSON.parse(localStorage.getItem('noxtm_visitor_blogs') || '[]');
        const updated = all.filter(b => b.id !== blogId);
        localStorage.setItem('noxtm_visitor_blogs', JSON.stringify(updated));
        if (visitor) loadBlogs(visitor.id);
    };

    const handleEdit = (blogId) => {
        navigate(`/visitor/write?edit=${blogId}`);
    };

    const counts = {
        all: blogs.length,
        pending: blogs.filter(b => b.status === 'pending').length,
        approved: blogs.filter(b => b.status === 'approved').length,
        rejected: blogs.filter(b => b.status === 'rejected').length,
    };

    return (
        <div className="stories-page">
            {/* Page Header */}
            <div className="stories-header">
                <div className="stories-header-left">
                    <h1 className="stories-title">Your Stories</h1>
                    <p className="stories-subtitle">Manage and track all your published and draft stories</p>
                </div>
                <button className="stories-write-btn" onClick={() => navigate('/visitor/write')}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Write a story
                </button>
            </div>

            {/* Stats Overview */}
            <div className="stories-stats-row">
                <div className="stories-stat">
                    <span className="stories-stat-value">{counts.all}</span>
                    <span className="stories-stat-label">Total</span>
                </div>
                <div className="stories-stat stories-stat--success">
                    <span className="stories-stat-value">{counts.approved}</span>
                    <span className="stories-stat-label">Published</span>
                </div>
                <div className="stories-stat stories-stat--warning">
                    <span className="stories-stat-value">{counts.pending}</span>
                    <span className="stories-stat-label">In Review</span>
                </div>
                <div className="stories-stat stories-stat--error">
                    <span className="stories-stat-value">{counts.rejected}</span>
                    <span className="stories-stat-label">Rejected</span>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="stories-controls">
                <div className="stories-search">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="stories-search-input"
                    />
                </div>
                <div className="stories-filter-tabs">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            className={`stories-filter-tab ${filter === f ? 'stories-filter-tab--active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === 'all' ? 'All' : f === 'pending' ? 'In Review' : f === 'approved' ? 'Published' : 'Rejected'}
                            <span className="stories-filter-count">{counts[f]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Stories List */}
            {filteredBlogs.length === 0 ? (
                <div className="stories-empty">
                    <div className="stories-empty-icon">
                        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#E0E0E0" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                    </div>
                    <h3 className="stories-empty-title">{searchQuery ? 'No matching stories' : 'No stories yet'}</h3>
                    <p className="stories-empty-text">
                        {searchQuery 
                            ? 'Try a different search term.' 
                            : 'Start writing your first story and share your knowledge with the community.'}
                    </p>
                    {!searchQuery && (
                        <button className="stories-write-btn" onClick={() => navigate('/visitor/write')}>
                            Write your first story
                        </button>
                    )}
                </div>
            ) : (
                <div className="stories-list">
                    {filteredBlogs.map(blog => (
                        <article className="story-card" key={blog.id}>
                            <div className="story-card-header">
                                <span className={`story-status story-status--${blog.status}`}>
                                    {blog.status === 'pending' ? 'In Review' : blog.status === 'approved' ? 'Published' : 'Rejected'}
                                </span>
                                <span className="story-date">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <h3 className="story-card-title">
                                <Link to={blog.status === 'approved' ? `/blog/visitor-${blog.id}` : '#'} className="story-card-title-link">
                                    {blog.title}
                                </Link>
                            </h3>
                            <p className="story-card-excerpt">{blog.excerpt}</p>
                            {blog.topics && blog.topics.length > 0 && (
                                <div className="story-card-topics">
                                    {blog.topics.map(t => (
                                        <span key={t} className="story-topic-pill">{t}</span>
                                    ))}
                                </div>
                            )}
                            <div className="story-card-footer">
                                <div className="story-card-meta">
                                    {blog.readTime && <span>{blog.readTime}</span>}
                                </div>
                                <div className="story-card-actions">
                                    {(blog.status === 'pending' || blog.status === 'rejected') && (
                                        <button className="story-action-btn story-action-edit" onClick={() => handleEdit(blog.id)}>
                                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Edit
                                        </button>
                                    )}
                                    <button className="story-action-btn story-action-delete" onClick={() => handleDelete(blog.id)}>
                                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default VisitorMyBlogs;
