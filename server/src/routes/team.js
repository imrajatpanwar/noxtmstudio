import { Router } from 'express';
import TeamMember from '../models/TeamMember.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const admin = req.query.all === '1';
  const filter = admin ? {} : { published: true };
  const members = await TeamMember.find(filter).sort({ order: 1, createdAt: 1 });
  res.json(members);
});

router.post('/', protect, async (req, res) => {
  const m = await TeamMember.create(req.body);
  res.status(201).json(m);
});

router.put('/:id', protect, async (req, res) => {
  const m = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!m) return res.status(404).json({ error: 'Not found' });
  res.json(m);
});

router.delete('/:id', protect, async (req, res) => {
  await TeamMember.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
