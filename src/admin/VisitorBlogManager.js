import React, { useState, useEffect } from 'react';
import api from '../api';

function VisitorBlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [viewBlog, setViewBlog] = useState(null);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            const all = await api.getVisitorBlogs();
            setBlogs(all);
        } catch (err) { /* ignore */ }
    };

    const filteredBlogs = blogs
        .filter(b => filter === 'all' || b.status === filter)
        .filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

    const handleApprove = async (blogId) => {
        try {
            await api.updateVisitorBlogStatus(blogId, 'approved');
            await loadBlogs();
        } catch (err) { /* ignore */ }
    };

    const handleReject = async (blogId) => {
        try {
            await api.updateVisitorBlogStatus(blogId, 'rejected');
            await loadBlogs();
        } catch (err) { /* ignore */ }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return <span className="admin-badge" style={{ background: '#DCFCE7', color: '#166534' }}>Approved</span>;
            case 'rejected': return <span className="admin-badge" style={{ background: '#FEE2E2', color: '#991B1B' }}>Rejected</span>;
            case 'pending':
            default: return <span className="admin-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>Pending</span>;
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Visitor Blog Posts</h1>
                    <p>Review and manage blog posts submitted by visitors</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                            key={f}
                            className={`admin-btn ${filter === f ? 'admin-btn-accent' : 'admin-btn-secondary'}`}
                            onClick={() => setFilter(f)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {f} ({f === 'all' ? blogs.length : blogs.filter(b => b.status === f).length})
                        </button>
                    ))}
                </div>
                <input
                    className="admin-editor"
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: '1 1 200px', maxWidth: '300px' }}
                />
            </div>

            {/* View Blog Modal */}
            {viewBlog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '24px'
                }}>
                    <div style={{
                        background: 'var(--card-bg, #fff)', borderRadius: '12px',
                        padding: '32px', maxWidth: '700px', width: '100%',
                        maxHeight: '80vh', overflow: 'auto',
                        border: '1px solid var(--border, #E0E0E0)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <h2 style={{ margin: 0 }}>{viewBlog.title}</h2>
                            <button className="admin-btn admin-btn-secondary" onClick={() => setViewBlog(null)}>✕</button>
                        </div>
                        <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted, #7A7A7A)' }}>
                            By {viewBlog.visitorName} · {new Date(viewBlog.createdAt).toLocaleDateString()} · {viewBlog.readTime}
                        </div>
                        {viewBlog.topics && viewBlog.topics.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {viewBlog.topics.map(t => (
                                    <span key={t} className="admin-badge" style={{ background: 'var(--bg-secondary, #F3EFE8)' }}>{t}</span>
                                ))}
                            </div>
                        )}
                        {viewBlog.excerpt && (
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px' }}>{viewBlog.excerpt}</p>
                        )}
                        <div style={{ lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>{viewBlog.content}</div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
                            {viewBlog.status === 'pending' && (
                                <>
                                    <button className="admin-btn admin-btn-accent" onClick={() => { handleApprove(viewBlog._id); setViewBlog({ ...viewBlog, status: 'approved' }); }}>
                                        ✅ Approve
                                    </button>
                                    <button className="admin-btn admin-btn-danger" onClick={() => { handleReject(viewBlog._id); setViewBlog({ ...viewBlog, status: 'rejected' }); }}>
                                        ❌ Reject
                                    </button>
                                </>
                            )}
                            <button className="admin-btn admin-btn-secondary" onClick={() => setViewBlog(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Table */}
            {filteredBlogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted, #7A7A7A)' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</p>
                    <p>No visitor blog posts found.</p>
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Topics</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBlogs.map(blog => (
                                <tr key={blog._id}>
                                    <td>
                                        <strong style={{ cursor: 'pointer' }} onClick={() => setViewBlog(blog)}>
                                            {blog.title}
                                        </strong>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span>{blog.visitorAvatar || '👤'}</span>
                                            <span>{blog.visitorName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {(blog.topics || []).map(t => (
                                                <span key={t} className="admin-badge" style={{ fontSize: '0.75rem' }}>{t}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{getStatusBadge(blog.status)}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button className="admin-btn admin-btn-sm admin-btn-secondary" onClick={() => setViewBlog(blog)}>
                                                👁️ View
                                            </button>
                                            {blog.status === 'pending' && (
                                                <>
                                                    <button className="admin-btn admin-btn-sm admin-btn-accent" onClick={() => handleApprove(blog._id)}>
                                                        ✅
                                                    </button>
                                                    <button className="admin-btn admin-btn-sm admin-btn-danger" onClick={() => handleReject(blog._id)}>
                                                        ❌
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default VisitorBlogManager;
