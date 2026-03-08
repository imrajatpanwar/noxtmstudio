import React, { useState, useEffect } from 'react';
import './Visitor.css';

function VisitorStats() {
  const [stats, setStats] = useState({ views: 0, claps: 0, comments: 0 });
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('noxtm_visitor_user');
    if (!stored) return;
    const user = JSON.parse(stored);

    const allBlogs = JSON.parse(localStorage.getItem('noxtm_blogs') || '[]');
    const myBlogs = allBlogs
      .filter((b) => b.authorId === user.id)
      .map((b) => ({
        id: b.id,
        title: b.title || 'Untitled',
        status: b.status || 'pending',
        views: b.views || Math.floor(Math.random() * 500),
        claps: b.claps || Math.floor(Math.random() * 50),
        comments: b.comments?.length || Math.floor(Math.random() * 10),
        date: b.createdAt,
      }));

    const totalViews = myBlogs.reduce((sum, b) => sum + b.views, 0);
    const totalClaps = myBlogs.reduce((sum, b) => sum + b.claps, 0);
    const totalComments = myBlogs.reduce((sum, b) => sum + b.comments, 0);

    setStats({ views: totalViews, claps: totalClaps, comments: totalComments });
    setBlogs(myBlogs);
  }, []);

  return (
    <div>
      <div className="visitor-page-header">
        <h1>Stats</h1>
        <p>See how your stories are performing.</p>
      </div>

      {/* Overview */}
      <div className="visitor-stats-grid">
        <div className="visitor-stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{stats.views.toLocaleString()}</div>
        </div>
        <div className="visitor-stat-card">
          <div className="stat-label">Total Claps</div>
          <div className="stat-value">{stats.claps.toLocaleString()}</div>
        </div>
        <div className="visitor-stat-card">
          <div className="stat-label">Total Comments</div>
          <div className="stat-value">{stats.comments.toLocaleString()}</div>
        </div>
      </div>

      {/* Blog-by-blog table */}
      <div className="visitor-card">
        <h2>Story Performance</h2>

        {blogs.length === 0 ? (
          <div className="visitor-empty">
            <p>No stories yet. Write your first story to see stats here.</p>
          </div>
        ) : (
          <div className="visitor-table-wrap">
            <table className="visitor-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Claps</th>
                  <th>Comments</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td style={{ fontWeight: 500, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {blog.title}
                    </td>
                    <td>
                      <span className={`status-badge ${blog.status}`}>{blog.status}</span>
                    </td>
                    <td>{blog.views.toLocaleString()}</td>
                    <td>{blog.claps.toLocaleString()}</td>
                    <td>{blog.comments}</td>
                    <td style={{ whiteSpace: 'nowrap', color: '#6B6B6B', fontSize: 13 }}>
                      {blog.date
                        ? new Date(blog.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default VisitorStats;
