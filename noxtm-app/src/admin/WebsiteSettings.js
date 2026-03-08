import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'noxtm_website_settings';

const defaultSettings = {
  /* General */
  siteTitle: 'Noxtm Studio',
  siteDescription: 'A digital marketing agency building brands that matter.',
  metaKeywords: 'digital marketing, branding, web design, noxtm studio',
  faviconUrl: '',
  primaryColor: '#6366F1',
  footerCopyright: '© 2026 Noxtm Studio. All rights reserved.',

  /* SEO & Meta (new) */
  metaTitle: '',
  metaDescription: '',
  focusKeyword: '',
  urlSlug: '',
  h1Tag: '',

  /* Robots & Indexing (new) */
  robotsMeta: 'index, follow',
  canonicalUrl: '',
  cacheControl: 'public',

  /* Social Sharing */
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  twitterCard: 'summary_large_image',

  /* Media (new) */
  featuredImage: '',
  imageAltText: '',
  breadcrumb: '',

  /* Analytics */
  googleAnalyticsId: '',
  facebookPixelId: '',

  /* Social Links */
  socialInstagram: '',
  socialLinkedIn: '',
  socialTwitter: '',
  socialFacebook: '',
};

/* ── Character-counter helper ── */
function CharCounter({ value, min, max }) {
  const len = (value || '').length;
  let cls = 'admin-char-counter';
  if (len > max) cls += ' danger';
  else if (len >= min && len <= max) cls += ''; /* green / default */
  else if (len > max - 10 || (len > 0 && len < min)) cls += ' warning';
  const inRange = len >= min && len <= max;
  return (
    <span className={cls} style={{ color: inRange ? '#22c55e' : undefined }}>
      {len} / {min}–{max} {inRange ? '✓' : ''}
    </span>
  );
}

function WebsiteSettings() {
  const [settings, setSettings] = useState({ ...defaultSettings });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved) {
      setSettings({ ...defaultSettings, ...saved });
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    showToast('Website settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({ ...defaultSettings });
    showToast('Settings reset to defaults.');
  };

  return (
    <div>
      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          <span className="admin-toast-icon">{toast.type === 'success' ? '✓' : '✕'}</span>
          {toast.message}
        </div>
      )}

      <div className="admin-page-header">
        <div>
          <h1>Website Settings</h1>
          <p>Configure global site settings, SEO, social sharing, and integrations.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="admin-btn admin-btn-outline" onClick={handleReset}>
            Reset to Defaults
          </button>
          <button className="admin-btn admin-btn-accent" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>

      {/* ═══════════════════════ General Settings ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>🌐</span> General Settings</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group admin-form-full">
            <label>Site Title</label>
            <input
              type="text"
              placeholder="Your website name"
              value={settings.siteTitle}
              onChange={(e) => handleChange('siteTitle', e.target.value)}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Site Description</label>
            <textarea
              placeholder="Describe your website in a few sentences..."
              value={settings.siteDescription}
              onChange={(e) => handleChange('siteDescription', e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Footer Copyright Text</label>
            <input
              type="text"
              placeholder="© 2026 Your Company. All rights reserved."
              value={settings.footerCopyright}
              onChange={(e) => handleChange('footerCopyright', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Primary Color Override</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                style={{ width: '50px', height: '44px', padding: '4px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label>Favicon URL</label>
            <input
              type="text"
              placeholder="https://example.com/favicon.ico"
              value={settings.faviconUrl}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════ SEO & Meta ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>🔍</span> SEO &amp; Meta</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group admin-form-full">
            <label>
              Meta Title
              <CharCounter value={settings.metaTitle} min={50} max={60} />
            </label>
            <input
              type="text"
              placeholder="Page title for search engines (50-60 chars optimal)"
              value={settings.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>
              Meta Description
              <CharCounter value={settings.metaDescription} min={150} max={160} />
            </label>
            <textarea
              placeholder="Page description for search engines (150-160 chars optimal)"
              value={settings.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Meta Keywords</label>
            <input
              type="text"
              placeholder="keyword1, keyword2, keyword3"
              value={settings.metaKeywords}
              onChange={(e) => handleChange('metaKeywords', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Focus Keyword</label>
            <input
              type="text"
              placeholder="Primary keyword to target"
              value={settings.focusKeyword}
              onChange={(e) => handleChange('focusKeyword', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>URL Slug</label>
            <input
              type="text"
              placeholder="/your-page-slug"
              value={settings.urlSlug}
              onChange={(e) => handleChange('urlSlug', e.target.value)}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>H1 Tag</label>
            <input
              type="text"
              placeholder="Main heading for the page"
              value={settings.h1Tag}
              onChange={(e) => handleChange('h1Tag', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════ Robots & Indexing ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>🤖</span> Robots &amp; Indexing</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Robots Meta</label>
            <select
              value={settings.robotsMeta}
              onChange={(e) => handleChange('robotsMeta', e.target.value)}
            >
              <option value="index, follow">index, follow</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label>Canonical URL</label>
            <input
              type="text"
              placeholder="https://example.com/page"
              value={settings.canonicalUrl}
              onChange={(e) => handleChange('canonicalUrl', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Cache Control</label>
            <select
              value={settings.cacheControl}
              onChange={(e) => handleChange('cacheControl', e.target.value)}
            >
              <option value="public">public</option>
              <option value="private">private</option>
              <option value="no-cache">no-cache</option>
              <option value="no-store">no-store</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ Social Sharing ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>📢</span> Social Sharing</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>OG Title</label>
            <input
              type="text"
              placeholder="Open Graph title"
              value={settings.ogTitle}
              onChange={(e) => handleChange('ogTitle', e.target.value)}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>OG Description</label>
            <textarea
              placeholder="Open Graph description for social previews"
              value={settings.ogDescription}
              onChange={(e) => handleChange('ogDescription', e.target.value)}
              style={{ minHeight: '70px' }}
            />
          </div>

          <div className="admin-form-group">
            <label>OG Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/og-image.jpg"
              value={settings.ogImage}
              onChange={(e) => handleChange('ogImage', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Twitter Card Type</label>
            <select
              value={settings.twitterCard}
              onChange={(e) => handleChange('twitterCard', e.target.value)}
            >
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ Media ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>🖼️</span> Media</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Featured Image URL</label>
            <input
              type="text"
              placeholder="https://example.com/featured.jpg"
              value={settings.featuredImage}
              onChange={(e) => handleChange('featuredImage', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Image Alt Text</label>
            <input
              type="text"
              placeholder="Descriptive alt text for the image"
              value={settings.imageAltText}
              onChange={(e) => handleChange('imageAltText', e.target.value)}
            />
          </div>

          <div className="admin-form-group admin-form-full">
            <label>Breadcrumb</label>
            <input
              type="text"
              placeholder="Home > Services > Web Design"
              value={settings.breadcrumb}
              onChange={(e) => handleChange('breadcrumb', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════ Analytics & Tracking ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>📊</span> Analytics &amp; Tracking</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Google Analytics ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={settings.googleAnalyticsId}
              onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Facebook Pixel ID</label>
            <input
              type="text"
              placeholder="123456789012345"
              value={settings.facebookPixelId}
              onChange={(e) => handleChange('facebookPixelId', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════════ Social Links ═══════════════════════ */}
      <div className="admin-settings-card">
        <h3><span>🔗</span> Social Links</h3>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label>Instagram</label>
            <input
              type="text"
              placeholder="https://instagram.com/noxtmstudio"
              value={settings.socialInstagram}
              onChange={(e) => handleChange('socialInstagram', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>LinkedIn</label>
            <input
              type="text"
              placeholder="https://linkedin.com/company/noxtmstudio"
              value={settings.socialLinkedIn}
              onChange={(e) => handleChange('socialLinkedIn', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>X (Twitter)</label>
            <input
              type="text"
              placeholder="https://x.com/noxtmstudio"
              value={settings.socialTwitter}
              onChange={(e) => handleChange('socialTwitter', e.target.value)}
            />
          </div>

          <div className="admin-form-group">
            <label>Facebook</label>
            <input
              type="text"
              placeholder="https://facebook.com/noxtmstudio"
              value={settings.socialFacebook}
              onChange={(e) => handleChange('socialFacebook', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="admin-btn admin-btn-outline" onClick={handleReset}>
          Reset to Defaults
        </button>
        <button className="admin-btn admin-btn-accent" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default WebsiteSettings;
