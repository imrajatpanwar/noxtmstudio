import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const STORAGE_KEY = 'noxtm_works';

function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

function generateId() {
    return 'work_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
}

const emptyWork = {
    id: '', title: '', subtitle: '', slug: '', description: '', featureImage: '',
    category: '', clientName: '', projectUrl: '', gradientStart: '#6366F1', gradientEnd: '#E8722A',
    tags: '', status: 'Draft', publishDate: new Date().toISOString().split('T')[0],
    createdAt: '', updatedAt: '',
};

function WorkManager() {
    const location = useLocation();
    const [works, setWorks] = useState([]);
    const [view, setView] = useState('list');
    const [current, setCurrent] = useState({ ...emptyWork });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setWorks(saved);
    }, []);

    useEffect(() => {
        if (location.state && location.state.openNew) {
            handleNew();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const saveWorks = (updated) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setWorks(updated);
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleNew = () => {
        setCurrent({ ...emptyWork, id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        setView('editor');
    };

    const handleEdit = (work) => { setCurrent({ ...work }); setView('editor'); };
    const handleDelete = (work) => { setDeleteTarget(work); };

    const confirmDelete = () => {
        const updated = works.filter(w => w.id !== deleteTarget.id);
        saveWorks(updated);
        setDeleteTarget(null);
        showToast('Work item deleted successfully.');
    };

    const handleSave = () => {
        if (!current.title.trim()) { showToast('Title is required.', 'error'); return; }
        const now = new Date().toISOString();
        const toSave = { ...current, slug: current.slug || generateSlug(current.title), updatedAt: now };
        const exists = works.find(w => w.id === toSave.id);
        let updated;
        if (exists) {
            updated = works.map(w => (w.id === toSave.id ? toSave : w));
        } else {
            toSave.createdAt = now;
            updated = [toSave, ...works];
        }
        saveWorks(updated);
        setView('list');
        showToast(exists ? 'Work updated successfully.' : 'Work created successfully.');
    };

    const handleCancel = () => { setView('list'); setCurrent({ ...emptyWork }); };

    const handleChange = (field, value) => {
        setCurrent(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'title' && !prev.slugEdited) updated.slug = generateSlug(value);
            return updated;
        });
    };

    const handleSlugChange = (value) => { setCurrent(prev => ({ ...prev, slug: value, slugEdited: true })); };

    const filtered = works.filter(w => {
        const matchesSearch = w.title.toLowerCase().includes(searchTerm.toLowerCase()) || (w.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) || (w.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || w.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    if (view === 'editor') {
        return (
            <div>
                {toast && <div className={`admin-toast ${toast.type}`}><span className="admin-toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>{toast.message}</div>}
                <div className="admin-editor">
                    <div className="admin-editor-header">
                        <h2>{works.find(w => w.id === current.id) ? 'Edit Work' : 'New Work'}</h2>
                        <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={handleCancel}>← Back to List</button>
                    </div>
                    <div className="admin-form-grid">
                        <div className="admin-form-group admin-form-full">
                            <label>Title *</label>
                            <input type="text" placeholder="Work title" value={current.title} onChange={e => handleChange('title', e.target.value)} />
                        </div>
                        <div className="admin-form-group admin-form-full">
                            <label>Subtitle</label>
                            <input type="text" placeholder="A short subtitle" value={current.subtitle} onChange={e => handleChange('subtitle', e.target.value)} />
                        </div>
                        <div className="admin-form-group admin-form-full">
                            <label>Slug</label>
                            <input type="text" placeholder="auto-generated-from-title" value={current.slug} onChange={e => handleSlugChange(e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Client Name</label>
                            <input type="text" placeholder="Client or company name" value={current.clientName} onChange={e => handleChange('clientName', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Category</label>
                            <input type="text" placeholder="e.g. Web Design, Branding" value={current.category} onChange={e => handleChange('category', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Feature Image URL</label>
                            <input type="text" placeholder="https://example.com/image.jpg" value={current.featureImage} onChange={e => handleChange('featureImage', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Project URL</label>
                            <input type="text" placeholder="https://clientwebsite.com" value={current.projectUrl} onChange={e => handleChange('projectUrl', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Gradient Start Color</label>
                            <input type="color" value={current.gradientStart} onChange={e => handleChange('gradientStart', e.target.value)} style={{ height: '44px', padding: '4px' }} />
                        </div>
                        <div className="admin-form-group">
                            <label>Gradient End Color</label>
                            <input type="color" value={current.gradientEnd} onChange={e => handleChange('gradientEnd', e.target.value)} style={{ height: '44px', padding: '4px' }} />
                        </div>
                        <div className="admin-form-group admin-form-full">
                            <label>Tags (comma-separated)</label>
                            <input type="text" placeholder="web-design, branding, ux" value={current.tags} onChange={e => handleChange('tags', e.target.value)} />
                        </div>
                        <div className="admin-form-group admin-form-full">
                            <label>Description</label>
                            <textarea className="admin-textarea-large" placeholder="Full work description..." value={current.description} onChange={e => handleChange('description', e.target.value)} />
                        </div>
                        <div className="admin-form-group">
                            <label>Status</label>
                            <select value={current.status} onChange={e => handleChange('status', e.target.value)}>
                                <option value="Draft">Draft</option>
                                <option value="Published">Published</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Publish Date</label>
                            <input type="date" value={current.publishDate} onChange={e => handleChange('publishDate', e.target.value)} />
                        </div>
                    </div>
                    <div className="admin-form-actions">
                        <button className="admin-btn admin-btn-saffron" onClick={handleSave}>{works.find(w => w.id === current.id) ? 'Update Work' : 'Save Work'}</button>
                        <button className="admin-btn admin-btn-outline" onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {toast && <div className={`admin-toast ${toast.type}`}><span className="admin-toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>{toast.message}</div>}
            {deleteTarget && (
                <div className="admin-modal-overlay" onClick={() => setDeleteTarget(null)}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <h3>Delete Work</h3>
                        <p>Are you sure you want to delete "<strong>{deleteTarget.title}</strong>"? This action cannot be undone.</p>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="admin-page-header">
                <div><h1>Work</h1><p>Manage your portfolio work items.</p></div>
                <button className="admin-btn admin-btn-saffron" onClick={handleNew}>+ New Work</button>
            </div>
            <div className="admin-toolbar">
                <div className="admin-search-wrapper">
                    <span className="admin-search-icon">🔍</span>
                    <input type="text" className="admin-search-input" placeholder="Search by title, client, category..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <select className="admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                </select>
            </div>
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead><tr><th>Title</th><th>Client</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="6"><div className="admin-table-empty"><div style={{fontSize:'32px',marginBottom:'8px'}}>🎨</div><strong>No work items found</strong><p>Create your first work item to showcase your portfolio.</p></div></td></tr>
                        ) : filtered.map(work => (
                            <tr key={work.id}>
                                <td className="admin-table-title">{work.title}</td>
                                <td>{work.clientName || '—'}</td>
                                <td>{work.category || '—'}</td>
                                <td>{work.publishDate || '—'}</td>
                                <td><span className={`admin-badge ${work.status === 'Published' ? 'admin-badge-published' : 'admin-badge-draft'}`}>{work.status}</span></td>
                                <td><div className="admin-table-actions"><button className="admin-btn admin-btn-outline admin-btn-sm" onClick={() => handleEdit(work)}>Edit</button><button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(work)}>Delete</button></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default WorkManager;
