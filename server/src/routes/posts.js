import { Router } from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public: list published posts
router.get('/', async (req, res) => {
  const admin = req.query.all === '1';
  const filter = admin ? {} : { published: true };
  const posts = await Post.find(filter).sort({ publishedAt: -1, createdAt: -1 });
  res.json(posts);
});

// Public: single by slug
router.get('/:slug', async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug });
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

router.post('/', protect, async (req, res) => {
  const data = { ...req.body };
  if (data.published && !data.publishedAt) data.publishedAt = new Date();
  const post = await Post.create(data);
  res.status(201).json(post);
});

router.put('/:id', protect, async (req, res) => {
  const data = { ...req.body };
  if (data.published && !data.publishedAt) data.publishedAt = new Date();
  const post = await Post.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

router.delete('/:id', protect, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
