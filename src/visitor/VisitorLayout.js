import React, { useState, useEffect } from 'react';
import VerificationBadge from '../pages/image/Verification.svg';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import api from '../api';
import './Visitor.css';

function VisitorLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('noxtm_visitor_token');
    if (!token) {
      navigate('/visitor/login');
      return;
    }
    const stored = localStorage.getItem('noxtm_visitor_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    // Fetch fresh profile data so profile image is always up-to-date
    const fetchProfile = async () => {
      try {
        const u = await api.visitorProfile();
        const normalized = { ...u, id: u._id || u.id };
        setUser(normalized);
        localStorage.setItem('noxtm_visitor_user', JSON.stringify(normalized));
      } catch {
        // Token expired or invalid — redirect to login
        localStorage.removeItem('noxtm_visitor_token');
        localStorage.removeItem('noxtm_visitor_user');
        navigate('/visitor/login');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('noxtm_visitor_token');
    localStorage.removeItem('noxtm_visitor_user');
    navigate('/visitor/login');
  };

  if (!user) return null;

  return (
    <div className="visitor-layout">
      {/* Mobile hamburger */}
      <button
        className="visitor-hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      <div
        className={`visitor-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`visitor-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="visitor-sidebar-logo">Noxtm Studio</div>

        <nav className="visitor-sidebar-nav">
          <NavLink to="/blog" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
              <polyline points="9 21 9 13 15 13 15 21" />
            </svg>
            Home
          </NavLink>

          <NavLink to="/visitor/dashboard" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink to="/visitor/write" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Write
          </NavLink>

          <NavLink to="/visitor/my-blogs" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            My Blogs
          </NavLink>

          <NavLink to="/visitor/profile" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </NavLink>

          <NavLink to="/visitor/stats" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Stats
          </NavLink>

          <div className="sidebar-divider" />

          <NavLink to="/blog" className="sidebar-browse-link" onClick={() => setSidebarOpen(false)}>
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Browse Blogs
          </NavLink>
        </nav>

        {/* User section */}
        <div className="sidebar-user">
          {user.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="sidebar-user-avatar-img" />
          ) : (
            <div className="sidebar-user-avatar">{user.avatar}</div>
          )}
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user.name}
              {user.verified && <img src={VerificationBadge} className="verified-badge" title="Verified" alt="Verified" />}
            </div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Sign out"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="visitor-content">
        {user.suspended && (
          <div className="visitor-suspended-banner">
            <span>🚫 Your account has been suspended. You cannot write or publish blog posts.</span>
            <span>Contact <a href="mailto:mail@noxtmstudio.com">mail@noxtmstudio.com</a> to appeal.</span>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}

export default VisitorLayout;
