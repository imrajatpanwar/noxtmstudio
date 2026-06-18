import { Router } from 'express';
import Page from '../models/Page.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const pages = await Page.find().sort({ slug: 1 });
  res.json(pages);
});

router.get('/:slug', async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ error: 'Not found' });
  res.json(page);
});

router.post('/', protect, async (req, res) => {
  const page = await Page.create(req.body);
  res.status(201).json(page);
});

// Upsert by slug — admin CMS edits the home page sections in place.
router.put('/:slug', protect, async (req, res) => {
  const page = await Page.findOneAndUpdate(
    { slug: req.params.slug },
    { $set: { ...req.body, slug: req.params.slug } },
    { new: true, upsert: true }
  );
  res.json(page);
});

router.delete('/:slug', protect, async (req, res) => {
  await Page.findOneAndDelete({ slug: req.params.slug });
  res.json({ ok: true });
});

export default router;
