import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

const emptyJob = {
  title: '',
  department: '',
  location: 'Remote',
  type: 'Full-time',
  description: '',
  requirements: '',
  salaryRange: '',
  applyLink: '',
  status: 'Active',
  createdAt: '',
  updatedAt: '',
};

function CareerManager() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [view, setView] = useState('list');
  const [current, setCurrent] = useState({ ...emptyJob });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await api.getCareers();
        setJobs(data);
      } catch (err) { /* ignore */ }
    };
    loadJobs();
  }, []);

  useEffect(() => {
    if (location.state && location.state.openNew) {
      handleNew();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const reloadJobs = async () => {
    try {
      const data = await api.getCareers();
      setJobs(data);
    } catch (err) { /* ignore */ }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleNew = () => {
    setCurrent({
      ...emptyJob,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setView('editor');
  };

  const handleEdit = (job) => {
    setCurrent({ ...job });
    setView('editor');
  };

  const handleDelete = (job) => {
    setDeleteTarget(job);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteCareer(deleteTarget._id);
      await reloadJobs();
      setDeleteTarget(null);
      showToast('Job posting deleted successfully.');
    } catch (err) {
      showToast('Failed to delete job posting.', 'error');
    }
  };

  const handleSave = async () => {
    if (!current.title.trim()) {
      showToast('Job title is required.', 'error');
      return;
    }

    const now = new Date().toISOString();
    const toSave = { ...current, updatedAt: now };

    try {
      if (toSave._id) {
        await api.updateCareer(toSave._id, toSave);
        showToast('Job posting updated successfully.');
      } else {
        toSave.createdAt = now;
        await api.createCareer(toSave);
        showToast('Job posting created successfully.');
      }
      await reloadJobs();
      setView('list');
    } catch (err) {
      showToast('Failed to save job posting.', 'error');
    }
  };

  const handleCancel = () => {
    setView('list');
    setCurrent({ ...emptyJob });
  };

  const handleChange = (field, value) => {
    setCurrent((prev) => ({ ...prev, [field]: value }));
  };

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || job.status === filterStatus;
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
            <h2>{jobs.find((j) => j._id === current._id) ? 'Edit Job Posting' : 'New Job Posting'}</h2>
            <button className="admin-btn admin-btn-outline admin-btn-sm" onClick={handleCancel}>
              ← Back to List
            </button>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-group admin-form-full">
              <label>Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Senior Frontend Developer"
                value={current.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Department</label>
              <input
                type="text"
                placeholder="e.g. Engineering, Design, Marketing"
                value={current.department}
                onChange={(e) => handleChange('department', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Location</label>
              <select
                value={current.location}
                onChange={(e) => handleChange('location', e.target.value)}
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Employment Type</label>
              <select
                value={current.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Salary Range</label>
              <input
                type="text"
                placeholder="e.g. $80,000 - $120,000"
                value={current.salaryRange}
                onChange={(e) => handleChange('salaryRange', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Job Description</label>
              <textarea
                className="admin-textarea-large"
                placeholder="Describe the role, responsibilities, and what the candidate will work on..."
                value={current.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label>Requirements</label>
              <textarea
                className="admin-textarea-large"
                placeholder="List the required skills, experience, and qualifications..."
                value={current.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Apply Link / Email</label>
              <input
                type="text"
                placeholder="https://apply.link or careers@noxtm.studio"
                value={current.applyLink}
                onChange={(e) => handleChange('applyLink', e.target.value)}
              />
            </div>

            <div className="admin-form-group">
              <label>Status</label>
              <select
                value={current.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn admin-btn-primary" onClick={handleSave}>
              {jobs.find((j) => j._id === current._id) ? 'Update Job' : 'Save Job'}
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
            <h3>Delete Job Posting</h3>
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
          <h1>Careers</h1>
          <p>Manage job postings and openings.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleNew}>
          + New Job Posting
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <span className="admin-search-icon">🔍</span>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by title, department, location..."
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
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6">
                  <div className="admin-table-empty">
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚀</div>
                    <strong>No job postings found</strong>
                    <p>Create a job posting to start hiring.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((job) => (
                <tr key={job._id}>
                  <td className="admin-table-title">{job.title}</td>
                  <td>{job.department || '—'}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>
                    <span
                      className={`admin-badge ${
                        job.status === 'Active' ? 'admin-badge-active' : 'admin-badge-inactive'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        onClick={() => handleEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(job)}
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

export default CareerManager;
