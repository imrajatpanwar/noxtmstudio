import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    blogPosts: 0,
    caseStudies: 0,
    activeJobs: 0,
    totalViews: 14382,
    totalVisitors: 0,
    pendingBlogs: 0,
    subscribers: 0,
  });

  /* ── Client Logos state ── */
  const [trustLogos, setTrustLogos] = useState([]);
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoUrl, setNewLogoUrl] = useState('');
  const [logoToast, setLogoToast] = useState('');

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem('noxtm_blogs') || '[]');
    const cases = JSON.parse(localStorage.getItem('noxtm_case_studies') || '[]');
    const careers = JSON.parse(localStorage.getItem('noxtm_careers') || '[]');
    const activeJobs = careers.filter((c) => c.status === 'Active').length;

    const visitors = JSON.parse(localStorage.getItem('noxtm_visitors') || '[]');
    const visitorBlogs = JSON.parse(localStorage.getItem('noxtm_visitor_blogs') || '[]');
    const pendingBlogs = visitorBlogs.filter((b) => b.status === 'pending').length;
    const subscribers = JSON.parse(localStorage.getItem('noxtm_newsletter_subscribers') || '[]');

    setStats({
      blogPosts: blogs.length,
      caseStudies: cases.length,
      activeJobs: activeJobs,
      totalViews: 14382,
      totalVisitors: visitors.length,
      pendingBlogs: pendingBlogs,
      subscribers: subscribers.length,
    });

    try {
      const savedLogos = JSON.parse(localStorage.getItem('noxtm_trust_logos') || '[]');
      if (Array.isArray(savedLogos)) setTrustLogos(savedLogos);
    } catch { /* ignore corrupt data */ }
  }, []);

  const showLogoToast = (msg) => {
    setLogoToast(msg);
    setTimeout(() => setLogoToast(''), 3000);
  };

  const handleAddLogo = (e) => {
    e.preventDefault();
    if (!newLogoName.trim() || !newLogoUrl.trim()) return;
    const logo = { id: Date.now(), name: newLogoName.trim(), imageUrl: newLogoUrl.trim() };
    const updated = [...trustLogos, logo];
    setTrustLogos(updated);
    localStorage.setItem('noxtm_trust_logos', JSON.stringify(updated));
    setNewLogoName('');
    setNewLogoUrl('');
    showLogoToast('Logo added successfully!');
  };

  const handleDeleteLogo = (id) => {
    const updated = trustLogos.filter((l) => l.id !== id);
    setTrustLogos(updated);
    localStorage.setItem('noxtm_trust_logos', JSON.stringify(updated));
    showLogoToast('Logo deleted.');
  };

  const recentActivity = [
    { text: 'New blog post "Digital Marketing Trends 2026" published', time: '2 hours ago', color: 'blue' },
    { text: 'Case study "Rebranding Luxe Hotels" updated', time: '5 hours ago', color: 'saffron' },
    { text: 'Frontend Developer position posted', time: '1 day ago', color: 'green' },
    { text: 'Website SEO settings updated', time: '2 days ago', color: 'blue' },
    { text: 'Case study "E-Commerce Growth" published', time: '3 days ago', color: 'saffron' },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's an overview of your website.</p>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.blogPosts}</div>
              <div className="admin-stat-label">Total Blog Posts</div>
            </div>
            <div className="admin-stat-card-icon blue">📝</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.caseStudies}</div>
              <div className="admin-stat-label">Total Case Studies</div>
            </div>
            <div className="admin-stat-card-icon saffron">💼</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.activeJobs}</div>
              <div className="admin-stat-label">Active Job Openings</div>
            </div>
            <div className="admin-stat-card-icon green">🚀</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.totalViews.toLocaleString()}</div>
              <div className="admin-stat-label">Total Page Views</div>
            </div>
            <div className="admin-stat-card-icon purple">👁️</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.totalVisitors}</div>
              <div className="admin-stat-label">Total Visitors</div>
            </div>
            <div className="admin-stat-card-icon blue">👥</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.pendingBlogs}</div>
              <div className="admin-stat-label">Pending Blogs</div>
            </div>
            <div className="admin-stat-card-icon saffron">📋</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-header">
            <div>
              <div className="admin-stat-number">{stats.subscribers}</div>
              <div className="admin-stat-label">Subscribers</div>
            </div>
            <div className="admin-stat-card-icon green">📧</div>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-quick-actions">
          <button
            className="admin-btn admin-btn-accent"
            onClick={() => navigate('/admin/blog', { state: { openNew: true } })}
          >
            + New Blog Post
          </button>
          <button
            className="admin-btn admin-btn-saffron"
            onClick={() => navigate('/admin/case-studies', { state: { openNew: true } })}
          >
            + New Case Study
          </button>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => navigate('/admin/careers', { state: { openNew: true } })}
          >
            + New Job Posting
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section-title">Recent Activity</h2>
        <div className="admin-activity-list">
          {recentActivity.map((item, index) => (
            <div className="admin-activity-item" key={index}>
              <div className={`admin-activity-dot ${item.color}`}></div>
              <span className="admin-activity-text">{item.text}</span>
              <span className="admin-activity-time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Client Logos Management ── */}
      <div className="admin-section">
        <h2 className="admin-section-title">Client Logos</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Manage logos displayed in the "Trusted By" section
        </p>

        {logoToast && (
          <div style={{
            background: 'var(--accent, #4f46e5)',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}>
            {logoToast}
          </div>
        )}

        <form onSubmit={handleAddLogo} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <div className="admin-form-group" style={{ flex: '1 1 200px', marginBottom: 0 }}>
            <input
              className="admin-editor"
              type="text"
              placeholder="Client Name"
              value={newLogoName}
              onChange={(e) => setNewLogoName(e.target.value)}
            />
          </div>
          <div className="admin-form-group" style={{ flex: '2 1 300px', marginBottom: 0 }}>
            <input
              className="admin-editor"
              type="text"
              placeholder="Image URL"
              value={newLogoUrl}
              onChange={(e) => setNewLogoUrl(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-accent">Add Logo</button>
        </form>

        {trustLogos.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No client logos added yet. The homepage will show default text logos.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {trustLogos.map((logo) => (
              <div key={logo.id} style={{
                background: 'var(--card-bg, #1a1a2e)',
                border: '1px solid var(--border, #333)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
              }}>
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  style={{ height: '40px', maxWidth: '100%', objectFit: 'contain', marginBottom: '0.5rem' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-primary, #fff)' }}>{logo.name}</p>
                <button
                  className="admin-btn admin-btn-sm admin-btn-danger"
                  onClick={() => handleDeleteLogo(logo.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
