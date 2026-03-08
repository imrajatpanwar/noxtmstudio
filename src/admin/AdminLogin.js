import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Admin.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.adminLogin(email, password);
      localStorage.setItem('noxtm_admin_token', data.token);
      localStorage.setItem('noxtm_admin_user', JSON.stringify(data.user));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <h1>Noxtm <span>Studio</span></h1>
          <p>Admin Dashboard</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          {error && <div className="admin-login-error">{error}</div>}

          <div className="admin-form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@noxtm.studio"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="password-field-wrapper">
              <input
                id="admin-password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="pwd-toggle-btn" onClick={() => setShowPwd(!showPwd)} aria-label={showPwd ? 'Hide password' : 'Show password'}>
                {showPwd ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
