import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Visitor.css';

function VisitorRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, confirmPassword, bio } = form;

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const visitors = JSON.parse(localStorage.getItem('noxtm_visitors') || '[]');
    const emailExists = visitors.some(
      (v) => v.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      setError('An account with this email already exists.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newVisitor = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        bio: bio.trim(),
        avatar: '👤',
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
      };

      visitors.push(newVisitor);
      localStorage.setItem('noxtm_visitors', JSON.stringify(visitors));

      // Auto-login
      const token = `vt_${newVisitor.id}_${Date.now()}`;
      localStorage.setItem('noxtm_visitor_token', token);
      localStorage.setItem(
        'noxtm_visitor_user',
        JSON.stringify({
          id: newVisitor.id,
          name: newVisitor.name,
          email: newVisitor.email,
          bio: newVisitor.bio,
          avatar: newVisitor.avatar,
        })
      );

      setLoading(false);
      navigate('/visitor/dashboard');
    }, 400);
  };

  return (
    <div className="visitor-auth-page">
      <div className="visitor-auth-card">
        <h1>Create account</h1>
        <p className="auth-subtitle">Join the community and start writing.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="password-field-wrapper">
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                required
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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="password-field-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" className="pwd-toggle-btn" onClick={() => setShowConfirmPwd(!showConfirmPwd)} aria-label={showConfirmPwd ? 'Hide password' : 'Show password'}>
                {showConfirmPwd ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio (optional)</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Tell us a little about yourself…"
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/visitor/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default VisitorRegister;
