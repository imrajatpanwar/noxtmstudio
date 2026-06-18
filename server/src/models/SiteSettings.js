import mongoose from 'mongoose';

// Single-document global settings (branding, contact, socials).
const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Noxtm Studio' },
    tagline: { type: String, default: 'Design that leads.' },
    logoText: { type: String, default: 'NOXTM' },
    contactEmail: { type: String, default: 'hello@noxtm.studio' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    socials: {
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      dribbble: { type: String, default: '' },
    },
    igAuditUser: { type: String, default: '' },
    igAuditPass: { type: String, default: '' },
    igCookies: { type: String, default: '' }, // JSON string of session cookies
    igCookiesAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
