import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Visitor.css';

function VisitorDashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
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
        if (stored) {
            const u = JSON.parse(stored);
            setUser(u);

            const allBlogs = JSON.parse(localStorage.getItem('noxtm_visitor_blogs') || '[]');
            const myBlogs = allBlogs.filter((b) => b.visitorId === u.id);

            const approved = myBlogs.filter((b) => b.status === 'approved').length;
            const pending = myBlogs.filter((b) => b.status === 'pending').length;
            const rejected = myBlogs.filter((b) => b.status === 'rejected').length;

            setStats({ total: myBlogs.length, approved, pending, rejected });

            const recent = [...myBlogs]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((b) => ({
                    id: b.id,
                    title: b.title,
                    status: b.status || 'pending',
                    date: b.createdAt,
                    excerpt: b.excerpt || '',
                }));
            setRecentActivity(recent);
        }
    }, []);

    if (!user) return null;

    return (
        <div className="vd-dashboard">
            {/* Hero Welcome Section */}
            <section className="vd-welcome">
                <div className="vd-welcome-content">
                    <p className="vd-greeting">{greeting},</p>
                    <h1 className="vd-welcome-name">{user.name}</h1>
                    <p className="vd-welcome-sub">Here's what's happening with your stories today.</p>
                </div>
                <div className="vd-welcome-action">
                    <Link to="/visitor/write" className="vd-write-btn">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        Write a story
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
                        <span className="vd-stat-label">Total Stories</span>
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
                <div className="vd-stat-card vd-stat-card--error">
                    <div className="vd-stat-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D32F2F" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className="vd-stat-content">
                        <span className="vd-stat-value">{stats.rejected}</span>
                        <span className="vd-stat-label">Rejected</span>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="vd-quick-actions">
                <h2 className="vd-section-title">Quick Actions</h2>
                <div className="vd-actions-grid">
                    <Link to="/visitor/write" className="vd-action-card">
                        <div className="vd-action-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </div>
                        <div className="vd-action-text">
                            <h3>Write</h3>
                            <p>Start a new story</p>
                        </div>
                    </Link>
                    <Link to="/visitor/my-blogs" className="vd-action-card">
                        <div className="vd-action-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div className="vd-action-text">
                            <h3>Stories</h3>
                            <p>Manage your stories</p>
                        </div>
                    </Link>
                    <Link to="/visitor/stats" className="vd-action-card">
                        <div className="vd-action-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </div>
                        <div className="vd-action-text">
                            <h3>Analytics</h3>
                            <p>View performance</p>
                        </div>
                    </Link>
                    <Link to="/visitor/profile" className="vd-action-card">
                        <div className="vd-action-icon">
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <div className="vd-action-text">
                            <h3>Profile</h3>
                            <p>Edit your profile</p>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="vd-recent">
                <div className="vd-recent-header">
                    <h2 className="vd-section-title">Recent Activity</h2>
                    {recentActivity.length > 0 && (
                        <Link to="/visitor/my-blogs" className="vd-see-all">View all stories →</Link>
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
                        <p className="vd-empty-title">No stories yet</p>
                        <p className="vd-empty-text">Write your first story and share your ideas with the world.</p>
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
