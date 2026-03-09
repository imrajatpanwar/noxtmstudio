require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ─── Ensure uploads directory ───
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ─── Multer config ───
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  },
});
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) are allowed'));
  },
});

// ─── Middleware ───
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// ─── MongoDB Connection ───
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error:', err); process.exit(1); });

// ══════════════════════════════════════════════
// ─── MONGOOSE MODELS ─────────────────────────
// ══════════════════════════════════════════════

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  author: String,
  content: String,
  featureImage: String,
  category: String,
  tags: String,
  excerpt: String,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  ogImage: String,
  ogTitle: String,
  ogDescription: String,
  canonicalUrl: String,
  robotsMeta: { type: String, default: 'index' },
  publication: String,
  readTime: String,
  status: { type: String, default: 'Draft' },
  publishDate: String,
}, { timestamps: true });
const Blog = mongoose.model('Blog', blogSchema);

const caseStudySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  slug: String,
  description: String,
  featureImage: String,
  category: String,
  clientName: String,
  projectUrl: String,
  gradientStart: String,
  gradientEnd: String,
  tags: String,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  ogImage: String,
  ogTitle: String,
  ogDescription: String,
  canonicalUrl: String,
  robotsMeta: { type: String, default: 'index' },
  status: { type: String, default: 'Draft' },
  publishDate: String,
}, { timestamps: true });
const CaseStudy = mongoose.model('CaseStudy', caseStudySchema);

const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  slug: String,
  description: String,
  featureImage: String,
  category: String,
  clientName: String,
  projectUrl: String,
  gradientStart: String,
  gradientEnd: String,
  tags: String,
  status: { type: String, default: 'Draft' },
  publishDate: String,
}, { timestamps: true });
const Work = mongoose.model('Work', workSchema);

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: String,
  location: String,
  type: String,
  description: String,
  requirements: String,
  salaryRange: String,
  applyLink: String,
  status: { type: String, default: 'Active' },
}, { timestamps: true });
const Career = mongoose.model('Career', careerSchema);

const settingsSchema = new mongoose.Schema({
  siteName: String,
  siteDescription: String,
  siteUrl: String,
  logo: String,
  favicon: String,
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String,
  googleAnalyticsId: String,
  facebookPixelId: String,
  socialLinks: {
    twitter: String,
    facebook: String,
    instagram: String,
    linkedin: String,
    youtube: String,
  },
  contactEmail: String,
  contactPhone: String,
  contactAddress: String,
  footerText: String,
  customCss: String,
  customJs: String,
}, { timestamps: true });
const Settings = mongoose.model('Settings', settingsSchema);

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);

const inquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  message: String,
  service: String,
  budget: String,
}, { timestamps: true });
const Inquiry = mongoose.model('Inquiry', inquirySchema);

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '👤' },
  profileImage: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' }],
}, { timestamps: true });
const Visitor = mongoose.model('Visitor', visitorSchema);

const visitorBlogSchema = new mongoose.Schema({
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  visitorName: String,
  visitorAvatar: String,
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  content: String,
  excerpt: String,
  featureImage: String,
  topics: [String],
  readTime: String,
  status: { type: String, default: 'pending' },
  claps: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: [{ user: String, text: String, date: Date }],
}, { timestamps: true });
const VisitorBlog = mongoose.model('VisitorBlog', visitorBlogSchema);

const trustLogoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });
const TrustLogo = mongoose.model('TrustLogo', trustLogoSchema);

// ══════════════════════════════════════════════
// ─── AUTH MIDDLEWARE ──────────────────────────
// ══════════════════════════════════════════════

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Not authorized' });
    req.admin = decoded;
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}

function visitorAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'visitor') return res.status(403).json({ error: 'Not authorized' });
    req.visitor = decoded;
    next();
  } catch { return res.status(401).json({ error: 'Invalid token' }); }
}

// ══════════════════════════════════════════════
// ─── ADMIN AUTH ROUTES ───────────────────────
// ══════════════════════════════════════════════

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { email, name: 'Admin' } });
  }
  return res.status(401).json({ error: 'Invalid email or password' });
});

// ══════════════════════════════════════════════
// ─── VISITOR AUTH ROUTES ─────────────────────
// ══════════════════════════════════════════════

app.post('/api/visitors/register', async (req, res) => {
  try {
    const { name, email, password, bio } = req.body;
    const exists = await Visitor.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'An account with this email already exists.' });
    const hashed = await bcrypt.hash(password, 10);
    const visitor = await Visitor.create({ name: name.trim(), email: email.trim().toLowerCase(), password: hashed, bio: bio?.trim() || '' });
    const token = jwt.sign({ role: 'visitor', id: visitor._id, email: visitor.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: visitor._id, name: visitor.name, email: visitor.email, bio: visitor.bio, avatar: visitor.avatar, profileImage: visitor.profileImage, verified: visitor.verified, followers: visitor.followers, following: visitor.following, createdAt: visitor.createdAt } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/visitors/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const visitor = await Visitor.findOne({ email: email.toLowerCase() });
    if (!visitor) return res.status(401).json({ error: 'Invalid email or password.' });
    const valid = await bcrypt.compare(password, visitor.password);
    if (!valid) return res.status(401).json({ error: 'Invalid email or password.' });
    const token = jwt.sign({ role: 'visitor', id: visitor._id, email: visitor.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: visitor._id, name: visitor.name, email: visitor.email, bio: visitor.bio, avatar: visitor.avatar, profileImage: visitor.profileImage, verified: visitor.verified, suspended: visitor.suspended, followers: visitor.followers, following: visitor.following, createdAt: visitor.createdAt } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/visitors/profile', visitorAuth, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.visitor.id).select('-password');
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    res.json(visitor);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/visitors/profile', visitorAuth, async (req, res) => {
  try {
    const { name, bio, avatar, profileImage } = req.body;
    const update = { name, bio, avatar };
    if (profileImage !== undefined) update.profileImage = profileImage;
    const visitor = await Visitor.findByIdAndUpdate(req.visitor.id, update, { new: true }).select('-password');
    res.json(visitor);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/visitors/change-password', visitorAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const visitor = await Visitor.findById(req.visitor.id);
    const valid = await bcrypt.compare(currentPassword, visitor.password);
    if (!valid) return res.status(400).json({ error: 'Current password is incorrect.' });
    visitor.password = await bcrypt.hash(newPassword, 10);
    await visitor.save();
    res.json({ message: 'Password changed successfully.' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── BLOG ROUTES ─────────────────────────────
// ══════════════════════════════════════════════

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blogs/:slugOrId', async (req, res) => {
  try {
    const param = req.params.slugOrId;
    // Try by slug first
    let blog = await Blog.findOne({ slug: param });
    if (blog) return res.json(blog);
    // Fallback: try by _id (for old hash-based URLs)
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(param);
      if (blog) {
        // Return the blog with a redirect hint so frontend can 301
        return res.json({ ...blog.toObject(), _redirectSlug: blog.slug || null });
      }
    }
    return res.status(404).json({ error: 'Blog not found' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/blogs', adminAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.slug && data.title) data.slug = generateSlug(data.title);
    // Ensure slug uniqueness
    let baseSlug = data.slug;
    let counter = 1;
    while (await Blog.findOne({ slug: data.slug })) {
      data.slug = `${baseSlug}-${counter++}`;
    }
    const blog = await Blog.create(data);
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/blogs/:id', adminAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    // Auto-generate slug if missing
    if (!data.slug && data.title) data.slug = generateSlug(data.title);
    // Ensure slug uniqueness (exclude current doc)
    if (data.slug) {
      let baseSlug = data.slug;
      let counter = 1;
      while (await Blog.findOne({ slug: data.slug, _id: { $ne: req.params.id } })) {
        data.slug = `${baseSlug}-${counter++}`;
      }
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/blogs/:id', adminAuth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Backfill slugs for existing posts that don't have one
app.post('/api/blogs/backfill-slugs', adminAuth, async (req, res) => {
  try {
    const blogs = await Blog.find({ $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }] });
    let updated = 0;
    for (const blog of blogs) {
      let slug = generateSlug(blog.title);
      let baseSlug = slug;
      let counter = 1;
      while (await Blog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      blog.slug = slug;
      await blog.save();
      updated++;
    }
    res.json({ message: `Backfilled slugs for ${updated} posts` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── CASE STUDY ROUTES ───────────────────────
// ══════════════════════════════════════════════

app.get('/api/case-studies', async (req, res) => {
  try {
    const items = await CaseStudy.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/case-studies/:slug', async (req, res) => {
  try {
    const item = await CaseStudy.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'Case study not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/case-studies', adminAuth, async (req, res) => {
  try {
    const item = await CaseStudy.create(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/case-studies/:id', adminAuth, async (req, res) => {
  try {
    const item = await CaseStudy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Case study not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/case-studies/:id', adminAuth, async (req, res) => {
  try {
    await CaseStudy.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── WORK ROUTES ─────────────────────────────
// ══════════════════════════════════════════════

app.get('/api/works', async (req, res) => {
  try {
    const items = await Work.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/works/:slug', async (req, res) => {
  try {
    const item = await Work.findOne({ slug: req.params.slug });
    if (!item) return res.status(404).json({ error: 'Work not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/works', adminAuth, async (req, res) => {
  try {
    const item = await Work.create(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/works/:id', adminAuth, async (req, res) => {
  try {
    const item = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Work not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/works/:id', adminAuth, async (req, res) => {
  try {
    await Work.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── CAREER ROUTES ───────────────────────────
// ══════════════════════════════════════════════

app.get('/api/careers', async (req, res) => {
  try {
    const items = await Career.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/careers', adminAuth, async (req, res) => {
  try {
    const item = await Career.create(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/careers/:id', adminAuth, async (req, res) => {
  try {
    const item = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Career not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/careers/:id', adminAuth, async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── SETTINGS ROUTES ─────────────────────────
// ══════════════════════════════════════════════

app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/settings', adminAuth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create(req.body);
    else { Object.assign(settings, req.body); await settings.save(); }
    res.json(settings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── SUBSCRIBER ROUTES ───────────────────────
// ══════════════════════════════════════════════

app.get('/api/subscribers', adminAuth, async (req, res) => {
  try {
    const subs = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/subscribers', async (req, res) => {
  try {
    const { email } = req.body;
    const exists = await Subscriber.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: 'Already subscribed' });
    const sub = await Subscriber.create({ email: email.toLowerCase() });
    res.json(sub);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/subscribers/:id', adminAuth, async (req, res) => {
  try {
    await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── INQUIRY ROUTES ──────────────────────────
// ══════════════════════════════════════════════

app.get('/api/inquiries', adminAuth, async (req, res) => {
  try {
    const items = await Inquiry.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const item = await Inquiry.create(req.body);
    res.json(item);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── VISITOR BLOG ROUTES ─────────────────────
// ══════════════════════════════════════════════

app.get('/api/visitor-blogs', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.visitorId) filter.visitorId = req.query.visitorId;
    const blogs = await VisitorBlog.find(filter).sort({ createdAt: -1 });
    // Attach verification status from visitor
    const visitorIds = [...new Set(blogs.map(b => b.visitorId.toString()))];
    const visitors = await Visitor.find({ _id: { $in: visitorIds } }).select('verified profileImage bio');
    const visitorMap = {};
    visitors.forEach(v => { visitorMap[v._id.toString()] = { verified: v.verified, profileImage: v.profileImage, bio: v.bio }; });
    const enriched = blogs.map(b => {
      const obj = b.toObject();
      const vInfo = visitorMap[b.visitorId.toString()] || {};
      obj.visitorVerified = vInfo.verified || false;
      obj.visitorProfileImage = vInfo.profileImage || '';
      obj.visitorBio = vInfo.bio || '';
      return obj;
    });
    res.json(enriched);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/visitor-blogs/:slugOrId', async (req, res) => {
  try {
    let blog = await VisitorBlog.findOne({ slug: req.params.slugOrId });
    let redirectSlug = null;
    if (!blog) {
      if (mongoose.Types.ObjectId.isValid(req.params.slugOrId)) {
        blog = await VisitorBlog.findById(req.params.slugOrId);
        if (blog && blog.slug) redirectSlug = blog.slug;
      }
    }
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    const visitor = await Visitor.findById(blog.visitorId).select('verified profileImage bio');
    const obj = blog.toObject();
    obj.visitorVerified = visitor?.verified || false;
    obj.visitorProfileImage = visitor?.profileImage || '';
    obj.visitorBio = visitor?.bio || '';
    if (redirectSlug) obj._redirectSlug = redirectSlug;
    res.json(obj);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/visitor-blogs', visitorAuth, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.visitor.id);
    if (visitor.suspended) return res.status(403).json({ error: 'Your account has been suspended. You cannot create blog posts. Contact mail@noxtmstudio.com to appeal.' });
    const data = {
      ...req.body,
      visitorId: req.visitor.id,
      visitorName: visitor.name,
      visitorAvatar: visitor.avatar,
    };
    if (!data.slug && data.title) data.slug = generateSlug(data.title);
    let baseSlug = data.slug;
    let counter = 1;
    while (await VisitorBlog.findOne({ slug: data.slug })) {
      data.slug = `${baseSlug}-${counter++}`;
    }
    const blog = await VisitorBlog.create(data);
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/visitor-blogs/:id', visitorAuth, async (req, res) => {
  try {
    const { title, content, excerpt, featureImage, topics, readTime } = req.body;
    const updateData = { title, content, excerpt, featureImage, topics, readTime, status: 'pending' };
    if (!updateData.slug && title) updateData.slug = generateSlug(title);
    if (updateData.slug) {
      let baseSlug = updateData.slug;
      let counter = 1;
      while (await VisitorBlog.findOne({ slug: updateData.slug, _id: { $ne: req.params.id } })) {
        updateData.slug = `${baseSlug}-${counter++}`;
      }
    }
    const blog = await VisitorBlog.findOneAndUpdate(
      { _id: req.params.id, visitorId: req.visitor.id },
      updateData,
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: 'Blog not found or not authorized' });
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/visitor-blogs/:id', visitorAuth, async (req, res) => {
  try {
    await VisitorBlog.findOneAndDelete({ _id: req.params.id, visitorId: req.visitor.id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Backfill slugs for existing visitor blogs
app.post('/api/visitor-blogs/backfill-slugs', adminAuth, async (req, res) => {
  try {
    const blogs = await VisitorBlog.find({ $or: [{ slug: null }, { slug: '' }, { slug: { $exists: false } }] });
    let updated = 0;
    for (const blog of blogs) {
      let slug = generateSlug(blog.title);
      let baseSlug = slug;
      let counter = 1;
      while (await VisitorBlog.findOne({ slug, _id: { $ne: blog._id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      blog.slug = slug;
      await blog.save();
      updated++;
    }
    res.json({ message: `Backfilled slugs for ${updated} visitor blog posts` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: approve/reject visitor blogs
app.put('/api/visitor-blogs/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const blog = await VisitorBlog.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── TRUST LOGO ROUTES ───────────────────────
// ══════════════════════════════════════════════

app.get('/api/trust-logos', async (req, res) => {
  try {
    const logos = await TrustLogo.find().sort({ createdAt: -1 });
    res.json(logos);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/trust-logos', adminAuth, async (req, res) => {
  try {
    const logo = await TrustLogo.create(req.body);
    res.json(logo);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/trust-logos/:id', adminAuth, async (req, res) => {
  try {
    await TrustLogo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── DASHBOARD STATS ─────────────────────────
// ══════════════════════════════════════════════

app.get('/api/dashboard/stats', adminAuth, async (req, res) => {
  try {
    const [blogPosts, caseStudies, careers, visitors, visitorBlogs, subscribers] = await Promise.all([
      Blog.countDocuments(),
      CaseStudy.countDocuments(),
      Career.countDocuments({ status: 'Active' }),
      Visitor.countDocuments(),
      VisitorBlog.countDocuments({ status: 'pending' }),
      Subscriber.countDocuments(),
    ]);
    res.json({ blogPosts, caseStudies, activeJobs: careers, totalVisitors: visitors, pendingBlogs: visitorBlogs, subscribers });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── VISITOR STATS ───────────────────────────
app.get('/api/visitor-stats', visitorAuth, async (req, res) => {
  try {
    const blogs = await VisitorBlog.find({ visitorId: req.visitor.id });
    res.json({ blogs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── ADMIN VISITOR MANAGEMENT ────────────────
// ══════════════════════════════════════════════

app.get('/api/admin/visitors', adminAuth, async (req, res) => {
  try {
    const visitors = await Visitor.find().select('-password').sort({ createdAt: -1 });
    // Enrich with blog stats
    const visitorIds = visitors.map(v => v._id);
    const blogs = await VisitorBlog.find({ visitorId: { $in: visitorIds } });
    // Also get follower/following counts
    const statsMap = {};
    blogs.forEach(b => {
      const vid = b.visitorId.toString();
      if (!statsMap[vid]) statsMap[vid] = { totalBlogs: 0, publishedBlogs: 0, pendingBlogs: 0, totalViews: 0, totalClaps: 0 };
      statsMap[vid].totalBlogs++;
      if (b.status === 'approved') statsMap[vid].publishedBlogs++;
      if (b.status === 'pending') statsMap[vid].pendingBlogs++;
      statsMap[vid].totalViews += b.views || 0;
      statsMap[vid].totalClaps += b.claps || 0;
    });
    const enriched = visitors.map(v => {
      const obj = v.toObject();
      obj.stats = statsMap[v._id.toString()] || { totalBlogs: 0, publishedBlogs: 0, pendingBlogs: 0, totalViews: 0, totalClaps: 0 };
      return obj;
    });
    res.json(enriched);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/visitors/:id/verify', adminAuth, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    visitor.verified = !visitor.verified;
    await visitor.save();
    res.json({ verified: visitor.verified, name: visitor.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/visitors/:id/suspend', adminAuth, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ error: 'Visitor not found' });
    visitor.suspended = !visitor.suspended;
    await visitor.save();
    res.json({ suspended: visitor.suspended, name: visitor.name });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── VIEW TRACKING ───────────────────────────
app.put('/api/visitor-blogs/:slugOrId/view', async (req, res) => {
  try {
    let blog = await VisitorBlog.findOne({ slug: req.params.slugOrId });
    if (!blog && mongoose.Types.ObjectId.isValid(req.params.slugOrId)) {
      blog = await VisitorBlog.findById(req.params.slugOrId);
    }
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    blog.views = (blog.views || 0) + 1;
    await blog.save();
    res.json({ views: blog.views });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ══════════════════════════════════════════════
// ─── FILE UPLOAD ROUTES ──────────────────────
// ══════════════════════════════════════════════

// Upload profile picture (visitor auth required)
app.post('/api/upload/profile', visitorAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    // Update visitor's profileImage
    await Visitor.findByIdAndUpdate(req.visitor.id, { profileImage: imageUrl });
    res.json({ url: imageUrl });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Upload blog feature image (visitor auth required)
app.post('/api/upload/blog-image', visitorAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─── Health check ────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ─── Dynamic Sitemap.xml ─────────────────────
app.get('/sitemap.xml', async (req, res) => {
  try {
    const SITE = 'https://noxtmstudio.com';
    const today = new Date().toISOString().split('T')[0];

    // Static pages
    const staticPages = [
      { loc: '/',             changefreq: 'weekly',  priority: '1.0' },
      { loc: '/blog',         changefreq: 'daily',   priority: '0.9' },
      { loc: '/case-studies',  changefreq: 'weekly',  priority: '0.8' },
      { loc: '/work',          changefreq: 'weekly',  priority: '0.8' },
      { loc: '/company',       changefreq: 'monthly', priority: '0.7' },
      { loc: '/contact',       changefreq: 'monthly', priority: '0.7' },
    ];

    // Dynamic pages from DB
    const [blogs, caseStudies, works, visitorBlogs] = await Promise.all([
      Blog.find({ status: 'Published' }).select('slug updatedAt').lean(),
      CaseStudy.find({ status: 'Published' }).select('slug updatedAt').lean(),
      Work.find({ status: 'Published' }).select('slug updatedAt').lean(),
      VisitorBlog.find({ status: 'approved' }).select('_id updatedAt').lean(),
    ]);

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${SITE}${page.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Blog posts
    for (const blog of blogs) {
      if (!blog.slug) continue;
      const lastmod = blog.updatedAt ? new Date(blog.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${SITE}/blog/${encodeURIComponent(blog.slug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    // Visitor blogs (approved)
    for (const vb of visitorBlogs) {
      if (!vb.slug) continue;
      const lastmod = vb.updatedAt ? new Date(vb.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${SITE}/blog/visitor-${encodeURIComponent(vb.slug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    // Case studies
    for (const cs of caseStudies) {
      if (!cs.slug) continue;
      const lastmod = cs.updatedAt ? new Date(cs.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${SITE}/case-studies/${encodeURIComponent(cs.slug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    // Works
    for (const w of works) {
      if (!w.slug) continue;
      const lastmod = w.updatedAt ? new Date(w.updatedAt).toISOString().split('T')[0] : today;
      xml += '  <url>\n';
      xml += `    <loc>${SITE}/work/${encodeURIComponent(w.slug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// ─── Serve React build in production ─────────
const buildPath = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// ─── Start Server ────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
