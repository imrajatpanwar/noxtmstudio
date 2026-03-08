import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Visitor.css';

function VisitorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const visitors = JSON.parse(localStorage.getItem('noxtm_visitors') || '[]');
      const visitor = visitors.find(
        (v) => v.email.toLowerCase() === email.toLowerCase() && v.password === password
      );

      if (!visitor) {
        setError('Invalid email or password.');
        setLoading(false);
        return;
      }

      // Create token and store session
      const token = `vt_${visitor.id}_${Date.now()}`;
      localStorage.setItem('noxtm_visitor_token', token);
      localStorage.setItem(
        'noxtm_visitor_user',
        JSON.stringify({
          id: visitor.id,
          name: visitor.name,
          email: visitor.email,
          bio: visitor.bio,
          avatar: visitor.avatar,
        })
      );

      setLoading(false);
      navigate('/visitor/dashboard');
    }, 400);
  };

  return (
    <div className="visitor-auth-page">
      <div className="visitor-auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field-wrapper">
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/visitor/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default VisitorLogin;
