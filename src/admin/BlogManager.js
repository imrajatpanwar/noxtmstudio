import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'noxtm_blogs';

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function generateId() {
  return 'blog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

const emptyPost = {
  id: '',
  title: '',
  slug: '',
  author: '',
  content: '',
  featureImage: '',
  category: '',
  tags: '',
  excerpt: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  ogImage: '',
  ogTitle: '',
  ogDescription: '',
  canonicalUrl: '',
  robotsMeta: 'index',
  publication: '',
  readTime: '',
  status: 'Draft',
  publishDate: new Date().toISOString().split('T')[0],
  createdAt: '',
  updatedAt: '',
};

function BlogManager() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list');
  const [currentPost, setCurrentPost] = useState({ ...emptyPost });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setPosts(saved);
  }, []);

  useEffect(() => {
    if (location.state && location.state.openNew) {
      handleNew();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const savePosts = (updated) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setPosts(updated);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNew = () => {
    setCurrentPost({
      ...emptyPost,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setView('editor');
  };

  const handleEdit = (post) => {
    setCurrentPost({ ...post });
    setView('editor');
  };

  const handleDelete = (post) => {
    setDeleteTarget(post);
  };

  const confirmDelete = () => {
    const updated = posts.filter((p) => p.id !== deleteTarget.id);
    savePosts(updated);
    setDeleteTarget(null);
    showToast('Blog post deleted successfully.');
  };

  const handleSave = () => {
    if (!currentPost.title.trim()) {
      showToast('Title is required.', 'error');
      return;
    }

    const now = new Date().toISOString();
    const postToSave = {
      ...currentPost,
      slug: currentPost.slug || generateSlug(currentPost.title),
      updatedAt: now,
    };

    const exists = posts.find((p) => p.id === postToSave.id);
    let updated;
    if (exists) {
      updated = posts.map((p) => (p.id === postToSave.id ? postToSave : p));
    } else {
      postToSave.createdAt = now;
      updated = [postToSave, ...posts];
    }

    savePosts(updated);
    setView('list');
    showToast(exists ? 'Blog post updated successfully.' : 'Blog post created successfully.');
  };

  const handleCancel = () => {
    setView('list');
    setCurrentPost({ ...emptyPost });
  };

  const handleChange = (field, value) => {
    setCurrentPost((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !prev.slugEdited) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSlugChange = (value) => {
    setCurrentPost((prev) => ({
      ...prev,
      slug: value,
      slugEdited: true,
    }));
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || post.status === filterStatus;
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
            <h2>{posts.find((p) => p.id === currentPost.id) ? 'Edit Blog Post' : 'New Blog Post'}</h2>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={handleCancel}>
              ← Back to List
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label>Title *</label>
              <input
                type="text"
                placeholder="Enter blog post title"
                value={currentPost.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Slug</label>
              <input
                type="text"
                placeholder="auto-generated-from-title"
                value={currentPost.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Author Name</label>
              <input
                type="text"
                placeholder="Author name"
                value={currentPost.author}
                onChange={(e) => handleChange('author', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Feature Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={currentPost.featureImage}
                onChange={(e) => handleChange('featureImage', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Category</label>
              <input
                type="text"
                placeholder="e.g. Digital Marketing"
                value={currentPost.category}
                onChange={(e) => handleChange('category', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="seo, marketing, design"
                value={currentPost.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Excerpt / Short Description</label>
              <textarea
                placeholder="A short summary of the blog post..."
                value={currentPost.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Content</label>
              <textarea
                className="admin-textarea-large"
                placeholder="Write your blog post content here..."
                value={currentPost.content}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Publication</label>
              <input
                type="text"
                placeholder="Publication name"
                value={currentPost.publication}
                onChange={(e) => handleChange('publication', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Read Time (minutes)</label>
              <input
                type="number"
                placeholder="5"
                min="1"
                value={currentPost.readTime}
                onChange={(e) => handleChange('readTime', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                value={currentPost.status}
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
                value={currentPost.publishDate}
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
                  value={currentPost.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Meta Description</label>
                <textarea
                  placeholder="SEO description (max 160 characters recommended)"
                  value={currentPost.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  maxLength={200}
                  style={{ minHeight: '80px' }}
                />
                <div
                  className={`admin-char-counter ${
                    currentPost.metaDescription.length > 160
                      ? 'danger'
                      : currentPost.metaDescription.length > 140
                      ? 'warning'
                      : ''
                  }`}
                >
                  {currentPost.metaDescription.length}/160 characters
                </div>
              </div>

              <div className="admin-form-group admin-form-full">
                <label>Meta Keywords</label>
                <input
                  type="text"
                  placeholder="keyword1, keyword2, keyword3"
                  value={currentPost.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>OG Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/og-image.jpg"
                  value={currentPost.ogImage}
                  onChange={(e) => handleChange('ogImage', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>OG Title</label>
                <input
                  type="text"
                  placeholder="Open Graph title"
                  value={currentPost.ogTitle}
                  onChange={(e) => handleChange('ogTitle', e.target.value)}
                />
              </div>

              <div className="admin-form-group admin-form-full">
                <label>OG Description</label>
                <textarea
                  placeholder="Open Graph description"
                  value={currentPost.ogDescription}
                  onChange={(e) => handleChange('ogDescription', e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="admin-form-group">
                <label>Canonical URL</label>
                <input
                  type="text"
                  placeholder="https://noxtm.studio/blog/your-post"
                  value={currentPost.canonicalUrl}
                  onChange={(e) => handleChange('canonicalUrl', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Robots Meta</label>
                <select
                  value={currentPost.robotsMeta}
                  onChange={(e) => handleChange('robotsMeta', e.target.value)}
                >
                  <option value="index">Index</option>
                  <option value="noindex">No Index</option>
                </select>
              </div>
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-accent" onClick={handleSave}>
              {posts.find((p) => p.id === currentPost.id) ? 'Update Post' : 'Save Post'}
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
            <h3>Delete Blog Post</h3>
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
          <h1>Blog Posts</h1>
          <p>Manage your blog content and SEO settings.</p>
        </div>
        <button className="admin-btn admin-btn-accent" onClick={handleNew}>
          + New Blog Post
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search posts by title, author, category..."
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
              <th>Author</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="admin-table-empty">
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                    <strong>No blog posts found</strong>
                    <p>Create your first blog post to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="admin-table-title">{post.title}</td>
                  <td>{post.author || '—'}</td>
                  <td>{post.category || '—'}</td>
                  <td>{post.publishDate || '—'}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        post.status === 'Published' ? 'admin-badge-published' : 'admin-badge-draft'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(post)}
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

export default BlogManager;
