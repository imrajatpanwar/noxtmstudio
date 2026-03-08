import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Company from './pages/Company';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import BlogManager from './admin/BlogManager';
import CaseStudyManager from './admin/CaseStudyManager';
import CareerManager from './admin/CareerManager';
import WebsiteSettings from './admin/WebsiteSettings';
import SubscriberManager from './admin/SubscriberManager';
import VisitorBlogManager from './admin/VisitorBlogManager';
import VisitorLogin from './visitor/VisitorLogin';
import VisitorRegister from './visitor/VisitorRegister';
import VisitorLayout from './visitor/VisitorLayout';
import VisitorDashboard from './visitor/VisitorDashboard';
import VisitorProfile from './visitor/VisitorProfile';
import VisitorChangePassword from './visitor/VisitorChangePassword';
import VisitorStats from './visitor/VisitorStats';
import VisitorWriteBlog from './visitor/VisitorWriteBlog';
import VisitorMyBlogs from './visitor/VisitorMyBlogs';
import WorkManager from './admin/WorkManager';
import WorkPage from './pages/Work';
import WorkDetail from './pages/WorkDetail';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/company" element={<Company />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="case-studies" element={<CaseStudyManager />} />
            <Route path="work" element={<WorkManager />} />
            <Route path="careers" element={<CareerManager />} />
            <Route path="settings" element={<WebsiteSettings />} />
            <Route path="subscribers" element={<SubscriberManager />} />
            <Route path="visitor-blogs" element={<VisitorBlogManager />} />
          </Route>

          {/* Visitor Routes */}
          <Route path="/visitor/login" element={<VisitorLogin />} />
          <Route path="/visitor/register" element={<VisitorRegister />} />
          <Route path="/visitor" element={<VisitorLayout />}>
            <Route index element={<VisitorDashboard />} />
            <Route path="dashboard" element={<VisitorDashboard />} />
            <Route path="profile" element={<VisitorProfile />} />
            <Route path="change-password" element={<VisitorChangePassword />} />
            <Route path="stats" element={<VisitorStats />} />
            <Route path="write" element={<VisitorWriteBlog />} />
            <Route path="my-blogs" element={<VisitorMyBlogs />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
