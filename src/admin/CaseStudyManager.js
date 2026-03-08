import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

const emptyStudy = {
  title: '',
  subtitle: '',
  slug: '',
  description: '',
  featureImage: '',
  category: '',
  clientName: '',
  projectUrl: '',
  gradientStart: '#6366F1',
  gradientEnd: '#E8722A',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  canonicalUrl: '',
  robotsMeta: 'index',
  status: 'Draft',
  publishDate: new Date().toISOString().split('T')[0],
  createdAt: '',
  updatedAt: '',
};

function CaseStudyManager() {
  const location = useLocation();
  const [studies, setStudies] = useState([]);
  const [view, setView] = useState('list');
  const [current, setCurrent] = useState({ ...emptyStudy });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadStudies = async () => {
      try {
        const data = await api.getCaseStudies();
        setStudies(data);
      } catch (err) { /* ignore */ }
    };
    loadStudies();
  }, []);

  useEffect(() => {
    if (location.state && location.state.openNew) {
      handleNew();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const reloadStudies = async () => {
    try {
      const data = await api.getCaseStudies();
      setStudies(data);
    } catch (err) { /* ignore */ }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNew = () => {
    setCurrent({
      ...emptyStudy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setView('editor');
  };

  const handleEdit = (study) => {
    setCurrent({ ...study });
    setView('editor');
  };

  const handleDelete = (study) => {
    setDeleteTarget(study);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteCaseStudy(deleteTarget._id);
      await reloadStudies();
      setDeleteTarget(null);
      showToast('Case study deleted successfully.');
    } catch (err) {
      showToast('Failed to delete case study.', 'error');
    }
  };

  const handleSave = async () => {
    if (!current.title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }

    const now = new Date().toISOString();
    const toSave = {
      ...current,
      slug: current.slug || generateSlug(current.title),
      updatedAt: now,
    };

    try {
      if (toSave._id) {
        await api.updateCaseStudy(toSave._id, toSave);
        showToast('Case study updated successfully.');
      } else {
        toSave.createdAt = now;
        await api.createCaseStudy(toSave);
        showToast('Case study created successfully.');
      }
      await reloadStudies();
      setView('list');
    } catch (err) {
      showToast('Failed to save case study.', 'error');
    }
  };

  const handleCancel = () => {
    setView('list');
    setCurrent({ ...emptyStudy });
  };

  const handleChange = (field, value) => {
    setCurrent((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slugEdited) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSlugChange = (value) => {
    setCurrent((prev) => ({ ...prev, slug: value, slugEdited: true }));
  };

  const filtered = studies.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (view === 'editor') {
    return (
      <div>
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            <span className="admin-toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
            {toast.message}
          </div>
        )}

        <div className="admin-editor">
          <div className="admin-editor-header">
            <h2>{studies.find((s) => s._id === current._id) ? 'Edit Case Study' : 'New Case Study'}</h2>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={handleCancel}>
              ← Back to List
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label>Title *</label>
              <input
                type="text"
                placeholder="Case study title"
                value={current.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Subtitle</label>
              <input
                type="text"
                placeholder="A short subtitle"
                value={current.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Slug</label>
              <input
                type="text"
                placeholder="auto-generated-from-title"
                value={current.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Client Name</label>
              <input
                type="text"
                placeholder="Client or company name"
                value={current.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Category</label>
              <input
                type="text"
                placeholder="e.g. Branding, Web Design"
                value={current.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Feature Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={current.featureImage}
                onChange={(e) => handleChange('featureImage', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Project URL</label>
              <input
                type="text"
                placeholder="https://clientwebsite.com"
                value={current.projectUrl}
                onChange={(e) => handleChange('projectUrl', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Gradient Start Color</label>
              <input
                type="color"
                value={current.gradientStart}
                onChange={(e) => handleChange('gradientStart', e.target.value)}
                style={{ height: '44px', padding: '4px' }}
              />
            </div>

            <div className="admin-form-group">
              <label>Gradient End Color</label>
              <input
                type="color"
                value={current.gradientEnd}
                onChange={(e) => handleChange('gradientEnd', e.target.value)}
                style={{ height: '44px', padding: '4px' }}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="branding, ui-design, strategy"
                value={current.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Description</label>
              <textarea
                className="admin-textarea-large"
                placeholder="Full case study description..."
                value={current.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                value={current.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Publish Date</label>
              <input
                type="date"
                value={current.publishDate}
                onChange={(e) => handleChange('publishDate', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-section">
            <h3 className="admin-form-section-title">
              <span className="admin-section-icon">🔍</span> SEO Settings
            </h3>
            <div className="admin-form-grid">
              <div className="admin-form-group admin-form-full">
                <label>Meta Title</label>
                <input
                  type="text"
                  placeholder="SEO title for search engines"
                  value={current.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Meta Description</label>
                <textarea
                  placeholder="SEO description (max 160 characters recommended)"
                  value={current.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  maxLength={200}
                  style={{ minHeight: '80px' }}
                />
                <div
                  className={`admin-char-counter ${
                    current.metaDescription.length > 160
                      ? 'danger'
                      : current.metaDescription.length > 140
                      ? 'warning'
                      : ''
                  }`}
                >
                  {current.metaDescription.length}/160 characters
                </div>
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Meta Keywords</label>
                <input
                  type="text"
                  placeholder="keyword1, keyword2, keyword3"
                  value={current.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>OG Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/og-image.jpg"
                  value={current.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>OG Title</label>
                <input
                  type="text"
                  placeholder="Open Graph title"
                  value={current.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label>OG Description</label>
                <textarea
                  placeholder="Open Graph description"
                  value={current.ogDescription}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="admin-form-group">
                <label>Canonical URL</label>
                <input
                  type="text"
                  placeholder="https://noxtm.studio/case-studies/your-study"
                  value={current.canonicalUrl}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Robots Meta</label>
                <select
                  value={current.robotsMeta}
                  onChange={(e) => handleChange('robotsMeta', e.target.value)}
                >
                  <option value="index">Index</option>
                  <option value="noindex">No Index</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-saffron" onClick={handleSave}>
              {studies.find((s) => s._id === current._id) ? 'Update Case Study' : 'Save Case Study'}
            </button>
            <button className="admin-btn admin-btn-outline" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <span className="admin-toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Case Study</h3>
            <p>
              Are you sure you want to delete "<strong>{deleteTarget.title}</strong>"? This action
              cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1>Case Studies</h1>
          <p>Manage your portfolio case studies.</p>
        </div>
        <button className="admin-btn admin-btn-saffron" onClick={handleNew}>
          + New Case Study
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by title, client, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="admin-filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Client</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="admin-table-empty">
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>💼</div>
                    <strong>No case studies found</strong>
                    <p>Create your first case study to showcase your work.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((study) => (
                <tr key={study._id}>
                  <td className="admin-table-title">{study.title}</td>
                  <td>{study.clientName || '—'}</td>
                  <td>{study.category || '—'}</td>
                  <td>{study.publishDate || '—'}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        study.status === 'Published' ? 'admin-badge-published' : 'admin-badge-draft'
                      }`}
                    >
                      {study.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => handleEdit(study)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(study)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CaseStudyManager;
