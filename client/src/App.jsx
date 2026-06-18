import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth.jsx';

import PublicLayout from './components/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import Work from './pages/Work.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Events from './pages/Events.jsx';
import Contact from './pages/Contact.jsx';
import Audit from './pages/Audit.jsx';
import Cities from './pages/Cities.jsx';
import CityPage from './pages/CityPage.jsx';

import AdminLogin from './admin/Login.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import PagesAdmin from './admin/PagesAdmin.jsx';
import PostsAdmin from './admin/PostsAdmin.jsx';
import EventsAdmin from './admin/EventsAdmin.jsx';
import TeamAdmin from './admin/TeamAdmin.jsx';
import LeadsAdmin from './admin/LeadsAdmin.jsx';
import ChatAdmin from './admin/ChatAdmin.jsx';
import SettingsAdmin from './admin/SettingsAdmin.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/:slug" element={<CityPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pages" element={<PagesAdmin />} />
          <Route path="posts" element={<PostsAdmin />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="team" element={<TeamAdmin />} />
          <Route path="leads" element={<LeadsAdmin />} />
          <Route path="chat" element={<ChatAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
