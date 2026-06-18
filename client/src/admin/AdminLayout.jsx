import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const nav = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/pages', label: 'Home / CMS' },
  { to: '/admin/posts', label: 'Blog posts' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/team', label: 'Team' },
  { to: '/admin/leads', label: 'Leads' },
  { to: '/admin/chat', label: 'Chatbot' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="admin-light flex min-h-screen items-center justify-center text-black/40">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-light flex min-h-screen">
      <aside className="flex w-60 flex-col border-r border-black/8 bg-white">
        <div className="border-b border-black/8 px-5 py-4 font-display text-lg font-bold text-[#1A1A18]">
          NOXTM<span className="text-[#3A5E48]">.</span>
          <span className="ml-2 text-xs font-normal text-black/40">admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-[#3A5E48] text-white font-semibold' : 'text-black/50 hover:bg-black/5 hover:text-[#1A1A18]'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-black/8 p-3">
          <p className="px-3 text-xs text-black/40">{user.email}</p>
          <button
            onClick={() => { logout(); navigate('/admin/login'); }}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-black/50 hover:bg-black/5 hover:text-[#1A1A18]"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
