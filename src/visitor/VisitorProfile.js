import React, { useState, useEffect } from 'react';
import api from '../api';
import './Visitor.css';

function VisitorProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '', profileImage: '' });
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const u = await api.visitorProfile();
        setUser(u);
        setForm({ name: u.name, bio: u.bio || '', avatar: u.avatar || '👤', profileImage: u.profileImage || '' });
        localStorage.setItem('noxtm_visitor_user', JSON.stringify(u));
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;

    try {
      const updatedUser = await api.updateVisitorProfile({
        name: form.name.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar || '👤',
        profileImage: form.profileImage.trim(),
      });
      localStorage.setItem('noxtm_visitor_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  if (!user) return null;

  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
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
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="visitor-profile-avatar-img" />
            ) : (
              <div className="visitor-profile-avatar">{user.avatar}</div>
            )}
            <div className="visitor-profile-info">
              <h1>
                {user.name}
                {user.verified && <span className="verified-badge" title="Verified">✓</span>}
              </h1>
              <div className="profile-email">{user.email}</div>
              {user.bio && <div className="profile-bio">{user.bio}</div>}
              <div className="visitor-profile-meta">
                <span><strong>{followersCount}</strong> Followers</span>
                <span><strong>{followingCount}</strong> Following</span>
                {memberSince && <span>Member since {memberSince}</span>}
              </div>
            </div>
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
            {/* Profile Image URL */}
            <div className="form-group">
              <label>Profile Picture URL</label>
              <input
                type="text"
                value={form.profileImage}
                onChange={(e) => setForm({ ...form, profileImage: e.target.value })}
                placeholder="https://example.com/your-photo.jpg"
              />
              {form.profileImage && (
                <div className="profile-image-preview">
                  <img src={form.profileImage} alt="Preview" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <p className="form-hint">Paste a URL to your profile picture. Leave empty to use an avatar emoji instead.</p>
            </div>

            {/* Avatar Emoji (fallback) */}
            {!form.profileImage && (
              <div className="form-group">
                <label>Avatar Emoji</label>
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
            )}

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
