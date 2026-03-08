import React, { useState, useEffect } from 'react';
import './Visitor.css';

function VisitorProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('noxtm_visitor_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ name: u.name, bio: u.bio || '', avatar: u.avatar || '👤' });
    }
  }, []);

  const getFullUser = () => {
    const visitors = JSON.parse(localStorage.getItem('noxtm_visitors') || '[]');
    return visitors.find((v) => v.id === user?.id);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    const visitors = JSON.parse(localStorage.getItem('noxtm_visitors') || '[]');
    const idx = visitors.findIndex((v) => v.id === user.id);
    if (idx === -1) return;

    visitors[idx] = {
      ...visitors[idx],
      name: form.name.trim(),
      bio: form.bio.trim(),
      avatar: form.avatar || '👤',
    };
    localStorage.setItem('noxtm_visitors', JSON.stringify(visitors));

    const updatedUser = {
      id: user.id,
      name: form.name.trim(),
      email: user.email,
      bio: form.bio.trim(),
      avatar: form.avatar || '👤',
    };
    localStorage.setItem('noxtm_visitor_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditing(false);
    setSuccess('Profile updated successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!user) return null;

  const fullUser = getFullUser();
  const followersCount = fullUser?.followers?.length || 0;
  const followingCount = fullUser?.following?.length || 0;
  const memberSince = fullUser?.createdAt
    ? new Date(fullUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    : '';

  const emojiOptions = ['👤', '😀', '😎', '🧑‍💻', '✍️', '📚', '🎨', '🚀', '🌟', '🦊', '🐱', '🌸'];

  return (
    <div>
      <div className="visitor-page-header">
        <h1>Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      {success && <div className="auth-success">{success}</div>}

      {!editing ? (
        <>
          {/* Profile Header */}
          <div className="visitor-profile-header">
            <div className="visitor-profile-avatar">{user.avatar}</div>
            <div className="visitor-profile-info">
              <h1>{user.name}</h1>
              <div className="profile-email">{user.email}</div>
              {user.bio && <div className="profile-bio">{user.bio}</div>}
              <div className="visitor-profile-meta">
                <span><strong>{followersCount}</strong> Followers</span>
                <span><strong>{followingCount}</strong> Following</span>
                {memberSince && <span>Member since {memberSince}</span>}
              </div>
            </div>
          </div>

          {/* Written by card */}
          <div className="profile-written-by">
            <h3>Written by</h3>
            <div className="written-by-name">{user.name}</div>
            <div className="written-by-stats">
              {followersCount} Followers · {followingCount} Following
            </div>
            {user.bio && <div className="written-by-bio">{user.bio}</div>}
          </div>

          <div className="profile-actions">
            <button className="visitor-btn visitor-btn-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
            <a href="/visitor/change-password" className="visitor-btn visitor-btn-secondary">
              Change Password
            </a>
          </div>
        </>
      ) : (
        <div className="visitor-card">
          <h2>Edit Profile</h2>
          <div className="profile-edit-form">
            <div className="form-group">
              <label>Avatar</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm({ ...form, avatar: emoji })}
                    style={{
                      width: 40,
                      height: 40,
                      fontSize: 20,
                      border: form.avatar === emoji ? '2px solid #131313' : '1px solid #E0E0E0',
                      borderRadius: 8,
                      background: form.avatar === emoji ? '#F0F0F0' : '#FFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="edit-name">Full Name</label>
              <input
                id="edit-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-bio">Bio</label>
              <textarea
                id="edit-bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about yourself…"
                rows={4}
              />
            </div>

            <div className="profile-actions">
              <button className="visitor-btn visitor-btn-primary" onClick={handleSave}>
                Save Changes
              </button>
              <button className="visitor-btn visitor-btn-secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VisitorProfile;
