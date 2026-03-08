import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import './Admin.css';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('noxtm_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('noxtm_admin_token');
    localStorage.removeItem('noxtm_admin_user');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { path: '/admin/case-studies', label: 'Case Studies', icon: '💼' },
    { path: '/admin/work', label: 'Work', icon: '🎨' },
    { path: '/admin/careers', label: 'Careers', icon: '🚀' },
    { path: '/admin/visitor-blogs', label: 'Visitor Blogs', icon: '👥' },
    { path: '/admin/settings', label: 'Website Settings', icon: '⚙️' },
    { path: '/admin/subscribers', label: 'Subscribers', icon: '📧' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <div
        className={`admin-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <h2>Noxtm <span>Studio</span></h2>
          <p>Admin Panel</p>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-sidebar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="admin-sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-sidebar-link admin-logout-btn"
            onClick={handleLogout}
          >
            <span className="admin-sidebar-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <span className="admin-topbar-title">Admin Panel</span>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-topbar-user">admin@noxtm.studio</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
