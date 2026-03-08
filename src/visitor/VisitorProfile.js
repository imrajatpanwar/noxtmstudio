import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import './Visitor.css';

function VisitorProfile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('noxtm_visitor_token');
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const u = await api.visitorProfile();
        const normalized = { ...u, id: u._id || u.id };
        setUser(normalized);
        setForm({ name: normalized.name, bio: normalized.bio || '', avatar: normalized.avatar || '👤' });
        localStorage.setItem('noxtm_visitor_user', JSON.stringify(normalized));
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
      });
      const normalized = { ...updatedUser, id: updatedUser._id || updatedUser.id };
      localStorage.setItem('noxtm_visitor_user', JSON.stringify(normalized));
      setUser(normalized);
      setEditing(false);
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }
    setUploading(true);
    try {
      const result = await api.uploadProfileImage(file);
      const updatedUser = { ...user, profileImage: result.url, id: user._id || user.id };
      setUser(updatedUser);
      localStorage.setItem('noxtm_visitor_user', JSON.stringify(updatedUser));
      setSuccess('Profile picture updated!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
            <div className="profile-avatar-upload-wrapper">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} className="visitor-profile-avatar-img" />
              ) : (
                <div className="visitor-profile-avatar">{user.avatar}</div>
              )}
              <button
                type="button"
                className="profile-avatar-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload profile picture"
              >
                {uploading ? '...' : '📷'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                onChange={handleProfileImageUpload}
              />
            </div>
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
            {/* Avatar Emoji (only when no profile image) */}
            {!user.profileImage && (
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
