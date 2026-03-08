const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function authHeaders(isAdmin = false) {
  const token = localStorage.getItem(isAdmin ? 'noxtm_admin_token' : 'noxtm_visitor_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const api = {
  // Admin auth
  adminLogin: (email, password) => request('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // Visitor auth
  visitorRegister: (data) => request('/visitors/register', { method: 'POST', body: JSON.stringify(data) }),
  visitorLogin: (email, password) => request('/visitors/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  visitorProfile: () => request('/visitors/profile', { headers: authHeaders() }),
  updateVisitorProfile: (data) => request('/visitors/profile', { method: 'PUT', body: JSON.stringify(data), headers: authHeaders() }),
  changeVisitorPassword: (data) => request('/visitors/change-password', { method: 'PUT', body: JSON.stringify(data), headers: authHeaders() }),

  // Blogs
  getBlogs: () => request('/blogs'),
  getBlog: (slug) => request(`/blogs/${slug}`),
  createBlog: (data) => request('/blogs', { method: 'POST', body: JSON.stringify(data), headers: authHeaders(true) }),
  updateBlog: (id, data) => request(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeaders(true) }),
  deleteBlog: (id) => request(`/blogs/${id}`, { method: 'DELETE', headers: authHeaders(true) }),

  // Case Studies
  getCaseStudies: () => request('/case-studies'),
  getCaseStudy: (slug) => request(`/case-studies/${slug}`),
  createCaseStudy: (data) => request('/case-studies', { method: 'POST', body: JSON.stringify(data), headers: authHeaders(true) }),
  updateCaseStudy: (id, data) => request(`/case-studies/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeaders(true) }),
  deleteCaseStudy: (id) => request(`/case-studies/${id}`, { method: 'DELETE', headers: authHeaders(true) }),

  // Works
  getWorks: () => request('/works'),
  getWork: (slug) => request(`/works/${slug}`),
  createWork: (data) => request('/works', { method: 'POST', body: JSON.stringify(data), headers: authHeaders(true) }),
  updateWork: (id, data) => request(`/works/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeaders(true) }),
  deleteWork: (id) => request(`/works/${id}`, { method: 'DELETE', headers: authHeaders(true) }),

  // Careers
  getCareers: () => request('/careers'),
  createCareer: (data) => request('/careers', { method: 'POST', body: JSON.stringify(data), headers: authHeaders(true) }),
  updateCareer: (id, data) => request(`/careers/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeaders(true) }),
  deleteCareer: (id) => request(`/careers/${id}`, { method: 'DELETE', headers: authHeaders(true) }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data), headers: authHeaders(true) }),

  // Subscribers
  getSubscribers: () => request('/subscribers', { headers: authHeaders(true) }),
  subscribe: (email) => request('/subscribers', { method: 'POST', body: JSON.stringify({ email }) }),
  deleteSubscriber: (id) => request(`/subscribers/${id}`, { method: 'DELETE', headers: authHeaders(true) }),

  // Inquiries
  getInquiries: () => request('/inquiries', { headers: authHeaders(true) }),
  createInquiry: (data) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),

  // Visitor Blogs
  getVisitorBlogs: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/visitor-blogs${q ? '?' + q : ''}`);
  },
  getVisitorBlog: (id) => request(`/visitor-blogs/${id}`),
  createVisitorBlog: (data) => request('/visitor-blogs', { method: 'POST', body: JSON.stringify(data), headers: authHeaders() }),
  updateVisitorBlog: (id, data) => request(`/visitor-blogs/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: authHeaders() }),
  deleteVisitorBlog: (id) => request(`/visitor-blogs/${id}`, { method: 'DELETE', headers: authHeaders() }),
  updateVisitorBlogStatus: (id, status) => request(`/visitor-blogs/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }), headers: authHeaders(true) }),

  // Trust Logos
  getTrustLogos: () => request('/trust-logos'),
  createTrustLogo: (data) => request('/trust-logos', { method: 'POST', body: JSON.stringify(data), headers: authHeaders(true) }),
  deleteTrustLogo: (id) => request(`/trust-logos/${id}`, { method: 'DELETE', headers: authHeaders(true) }),

  // Dashboard
  getDashboardStats: () => request('/dashboard/stats', { headers: authHeaders(true) }),

  // Visitor Stats
  getVisitorStats: () => request('/visitor-stats', { headers: authHeaders() }),

  // Admin Visitor Management
  getVisitors: () => request('/admin/visitors', { headers: authHeaders(true) }),
  toggleVisitorVerification: (id) => request(`/admin/visitors/${id}/verify`, { method: 'PUT', headers: authHeaders(true) }),

  // View Tracking
  incrementBlogView: (id) => request(`/visitor-blogs/${id}/view`, { method: 'PUT' }),
};

export default api;
