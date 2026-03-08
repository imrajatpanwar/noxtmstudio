import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Visitor.css';

function VisitorDashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0, views: 0, claps: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 17) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem('noxtm_visitor_user');
        if (!stored) return;
        const u = JSON.parse(stored);
        setUser(u);

        const fetchBlogs = async () => {
            try {
                const myBlogs = await api.getVisitorBlogs({ visitorId: u.id });

                const approved = myBlogs.filter((b) => b.status === 'approved').length;
                const pending = myBlogs.filter((b) => b.status === 'pending').length;
                const rejected = myBlogs.filter((b) => b.status === 'rejected').length;
                const views = myBlogs.reduce((sum, b) => sum + (b.views || 0), 0);
                const claps = myBlogs.reduce((sum, b) => sum + (b.claps || 0), 0);

                setStats({ total: myBlogs.length, approved, pending, rejected, views, claps });

                const recent = [...myBlogs]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map((b) => ({
                        id: b._id,
                        title: b.title,
                        status: b.status || 'pending',
                        date: b.createdAt,
                        excerpt: b.excerpt || '',
                        views: b.views || 0,
                    }));
                setRecentActivity(recent);
            } catch (err) {
                console.error('Failed to load blogs:', err);
            }
        };
        fetchBlogs();
    }, []);

    if (!user) return null;

    return (
        <div className="vd-dashboard">
            {/* Hero Welcome Section */}
            <section className="vd-welcome">
                <div className="vd-welcome-content">
                    <p className="vd-greeting">{greeting},</p>
                    <h1 className="vd-welcome-name">{user.name}</h1>
                    <p className="vd-welcome-sub">Here's what's happening with your blog posts today.</p>
                </div>
                <div className="vd-welcome-action">
                    <Link to="/visitor/write" className="vd-write-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Write a blog post
                    </Link>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="vd-stats">
                <div className="vd-stat-card">
                    <div className="vd-stat-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#131313" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                    </div>
                    <div className="vd-stat-content">
                        <span className="vd-stat-value">{stats.total}</span>
                        <span className="vd-stat-label">Total Posts</span>
                    </div>
                </div>
                <div className="vd-stat-card vd-stat-card--success">
                    <div className="vd-stat-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2E7D32" strokeWidth="1.5">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="vd-stat-content">
                        <span className="vd-stat-value">{stats.approved}</span>
                        <span className="vd-stat-label">Published</span>
                    </div>
                </div>
                <div className="vd-stat-card vd-stat-card--warning">
                    <div className="vd-stat-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ED6C02" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                    </div>
                    <div className="vd-stat-content">
                        <span className="vd-stat-value">{stats.pending}</span>
                        <span className="vd-stat-label">In Review</span>
                    </div>
                </div>
                <div className="vd-stat-card">
                    <div className="vd-stat-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#131313" strokeWidth="1.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <div className="vd-stat-content">
                        <span className="vd-stat-value">{stats.views.toLocaleString()}</span>
                        <span className="vd-stat-label">Total Views</span>
                    </div>
                </div>
                <div className="vd-stat-card">
                    <div className="vd-stat-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#131313" strokeWidth="1.5">
                            <path d="M14 9V5a3 3 0 00-5.12-2.12L3 8.76V21h7l5-5v-3h2a2 2 0 002-2V9h-5z" />
                        </svg>
                    </div>
                    <div className="vd-stat-content">
                        <span className="vd-stat-value">{stats.claps.toLocaleString()}</span>
                        <span className="vd-stat-label">Total Claps</span>
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="vd-recent">
                <div className="vd-recent-header">
                    <h2 className="vd-section-title">Recent Blog Posts</h2>
                    {recentActivity.length > 0 && (
                        <Link to="/visitor/my-blogs" className="vd-see-all">View all posts →</Link>
                    )}
                </div>
                {recentActivity.length === 0 ? (
                    <div className="vd-empty">
                        <div className="vd-empty-icon">
                            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#E0E0E0" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <p className="vd-empty-title">No blog posts yet</p>
                        <p className="vd-empty-text">Write your first blog post and share your ideas with the world.</p>
                        <Link to="/visitor/write" className="vd-write-btn vd-write-btn--sm">
                            Start writing
                        </Link>
                    </div>
                ) : (
                    <div className="vd-activity-list">
                        {recentActivity.map((item) => (
                            <div className="vd-activity-item" key={item.id}>
                                <div className={`vd-activity-indicator vd-activity-indicator--${item.status}`} />
                                <div className="vd-activity-content">
                                    <h4 className="vd-activity-title">{item.title}</h4>
                                    {item.excerpt && <p className="vd-activity-excerpt">{item.excerpt}</p>}
                                </div>
                                <div className="vd-activity-side">
                                    <span className={`vd-activity-badge vd-activity-badge--${item.status}`}>
                                        {item.status === 'pending' ? 'In Review' : item.status === 'approved' ? 'Published' : 'Rejected'}
                                    </span>
                                    <span className="vd-activity-views">{item.views} views</span>
                                    <span className="vd-activity-date">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default VisitorDashboard;
