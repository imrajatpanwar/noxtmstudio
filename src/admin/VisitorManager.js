import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';

function VisitorManager() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadVisitors();
    }, []);

    const loadVisitors = async () => {
        setLoading(true);
        try {
            const all = await api.getVisitors();
            setVisitors(all);
        } catch {
            showToast('Failed to load visitors.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleVerifyToggle = async (visitorId) => {
        try {
            const result = await api.toggleVisitorVerification(visitorId);
            setVisitors(prev => prev.map(v => v._id === visitorId ? { ...v, verified: result.verified } : v));
            showToast(result.verified ? `${result.name} verified.` : `Verification removed from ${result.name}.`);
        } catch {
            showToast('Action failed.', 'error');
        }
    };

    const handleSuspendToggle = async (visitorId) => {
        try {
            const result = await api.toggleVisitorSuspension(visitorId);
            setVisitors(prev => prev.map(v => v._id === visitorId ? { ...v, suspended: result.suspended } : v));
            showToast(result.suspended ? `${result.name} suspended.` : `${result.name} unsuspended.`);
        } catch {
            showToast('Action failed.', 'error');
        }
    };

    const handleExportCSV = () => {
        if (!visitors.length) return;
        const header = 'Name,Email,Verified,Suspended,Total Blogs,Published,Pending,Total Views,Total Claps,Joined';
        const rows = visitors.map(v =>
            [
                `"${v.name}"`,
                `"${v.email}"`,
                v.verified ? 'Yes' : 'No',
                v.suspended ? 'Yes' : 'No',
                v.stats?.totalBlogs || 0,
                v.stats?.publishedBlogs || 0,
                v.stats?.pendingBlogs || 0,
                v.stats?.totalViews || 0,
                v.stats?.totalClaps || 0,
                `"${new Date(v.createdAt).toLocaleDateString()}"`,
            ].join(',')
        );
        const csv = [header, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'noxtm_visitors.csv';
        a.click();
        URL.revokeObjectURL(url);
        showToast('CSV exported!');
    };

    const filtered = useMemo(() => {
        return visitors
            .filter(v => {
                if (filter === 'verified') return v.verified && !v.suspended;
                if (filter === 'unverified') return !v.verified && !v.suspended;
                if (filter === 'suspended') return v.suspended;
                return true;
            })
            .filter(v =>
                v.name.toLowerCase().includes(search.toLowerCase()) ||
                v.email.toLowerCase().includes(search.toLowerCase())
            );
    }, [visitors, filter, search]);

    // Summary stats
    const totalVerified = visitors.filter(v => v.verified).length;
    const totalSuspended = visitors.filter(v => v.suspended).length;
    const totalBlogs = visitors.reduce((s, v) => s + (v.stats?.totalBlogs || 0), 0);
    const totalViews = visitors.reduce((s, v) => s + (v.stats?.totalViews || 0), 0);

    return (
        <div style={{ position: 'relative' }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, zIndex: 9999,
                    padding: '12px 24px', borderRadius: 8, fontWeight: 600, fontSize: '0.875rem',
                    background: toast.type === 'error' ? '#FEE2E2' : '#DCFCE7',
                    color: toast.type === 'error' ? '#DC2626' : '#16A34A',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                }}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <h1>Visitors</h1>
                    <p>Manage registered visitor accounts, verify users, and moderate access.</p>
                </div>
                <button className="admin-btn admin-btn-secondary" onClick={handleExportCSV}>
                    ↓ Export CSV
                </button>
            </div>

            {/* Stats Overview */}
            <div className="admin-stats-grid" style={{ marginBottom: 28 }}>
                <div className="admin-stat-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: 8 }}>Total Visitors</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{visitors.length}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: 8 }}>Verified</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: '#166534' }}>{totalVerified}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: 8 }}>Suspended</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1, color: '#991B1B' }}>{totalSuspended}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: 8 }}>Total Posts</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{totalBlogs}</div>
                </div>
                <div className="admin-stat-card">
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#999', marginBottom: 8 }}>Total Views</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{totalViews.toLocaleString()}</div>
                </div>
            </div>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    className="admin-editor"
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: '1 1 220px', maxWidth: 340, padding: '8px 14px', fontSize: '0.875rem' }}
                />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[
                        { key: 'all', label: `All (${visitors.length})` },
                        { key: 'verified', label: `Verified (${totalVerified})` },
                        { key: 'unverified', label: `Unverified (${visitors.length - totalVerified - totalSuspended < 0 ? 0 : visitors.length - totalVerified - totalSuspended})` },
                        { key: 'suspended', label: `Suspended (${totalSuspended})` },
                    ].map(f => (
                        <button
                            key={f.key}
                            className={`admin-btn ${filter === f.key ? 'admin-btn-accent' : 'admin-btn-secondary'}`}
                            onClick={() => setFilter(f.key)}
                            style={{ fontSize: '0.8rem' }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visitor List */}
            {loading ? (
                <div style={{ padding: '48px 0', textAlign: 'center', color: '#999' }}>Loading visitors…</div>
            ) : filtered.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center', color: '#999' }}>
                    {search || filter !== 'all' ? 'No visitors match your search.' : 'No visitors registered yet.'}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {filtered.map(v => (
                        <div key={v._id} style={{
                            display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
                            background: v.suspended ? '#FFF5F5' : '#fff',
                            border: `1px solid ${v.suspended ? '#FCA5A5' : '#E0E0E0'}`,
                            borderRadius: 12, flexWrap: 'wrap',
                        }}>
                            {/* Avatar */}
                            <div style={{ flexShrink: 0 }}>
                                {v.profileImage ? (
                                    <img
                                        src={v.profileImage}
                                        alt={v.name}
                                        style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '1px solid #E0E0E0' }}
                                    />
                                ) : (
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '50%',
                                        background: '#F0F0F0', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: 24, border: '1px solid #E0E0E0',
                                    }}>
                                        {v.avatar || '👤'}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.name}</span>
                                    {v.verified && (
                                        <span style={{
                                            background: '#DCFCE7', color: '#166534',
                                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                                            borderRadius: 99, letterSpacing: '0.03em',
                                        }}>✓ Verified</span>
                                    )}
                                    {v.suspended && (
                                        <span style={{
                                            background: '#FEE2E2', color: '#991B1B',
                                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                                            borderRadius: 99,
                                        }}>🚫 Suspended</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#777', marginBottom: 2 }}>
                                    {v.email}
                                    <span style={{ margin: '0 6px', color: '#ccc' }}>·</span>
                                    Joined {new Date(v.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                {v.bio && (
                                    <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: 4, maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.bio}</div>
                                )}
                                <div style={{ fontSize: '0.75rem', color: '#aaa' }}>
                                    {v.followers?.length || 0} followers · {v.following?.length || 0} following
                                </div>
                            </div>

                            {/* Blog Stats */}
                            <div style={{ display: 'flex', gap: 20, flexShrink: 0, flexWrap: 'wrap' }}>
                                {[
                                    { label: 'Posts', value: v.stats?.totalBlogs || 0, color: '#131313' },
                                    { label: 'Published', value: v.stats?.publishedBlogs || 0, color: '#166534' },
                                    { label: 'Pending', value: v.stats?.pendingBlogs || 0, color: '#92400E' },
                                    { label: 'Views', value: (v.stats?.totalViews || 0).toLocaleString(), color: '#131313' },
                                    { label: 'Claps', value: (v.stats?.totalClaps || 0).toLocaleString(), color: '#131313' },
                                ].map(s => (
                                    <div key={s.label} style={{ textAlign: 'center', minWidth: 44 }}>
                                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#aaa', marginTop: 3 }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div style={{ flexShrink: 0, display: 'flex', gap: 6 }}>
                                <button
                                    className={`admin-btn admin-btn-sm ${v.verified ? 'admin-btn-secondary' : 'admin-btn-accent'}`}
                                    onClick={() => handleVerifyToggle(v._id)}
                                    title={v.verified ? 'Remove verified badge' : 'Grant verified badge'}
                                >
                                    {v.verified ? 'Unverify' : '✓ Verify'}
                                </button>
                                <button
                                    className={`admin-btn admin-btn-sm ${v.suspended ? 'admin-btn-secondary' : 'admin-btn-danger'}`}
                                    onClick={() => handleSuspendToggle(v._id)}
                                    title={v.suspended ? 'Unsuspend account' : 'Suspend account'}
                                >
                                    {v.suspended ? 'Unsuspend' : '🚫 Suspend'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Results count */}
            {!loading && filtered.length > 0 && (
                <div style={{ marginTop: 16, fontSize: '0.8rem', color: '#aaa', textAlign: 'right' }}>
                    Showing {filtered.length} of {visitors.length} visitors
                </div>
            )}
        </div>
    );
}

export default VisitorManager;
