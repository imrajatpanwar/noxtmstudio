import { Router } from 'express';
import Event from '../models/Event.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const admin = req.query.all === '1';
  const filter = admin ? {} : { published: true };
  const events = await Event.find(filter).sort({ startDate: 1 });
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const ev = await Event.findById(req.params.id);
  if (!ev) return res.status(404).json({ error: 'Not found' });
  res.json(ev);
});

router.post('/', protect, async (req, res) => {
  const ev = await Event.create(req.body);
  res.status(201).json(ev);
});

router.put('/:id', protect, async (req, res) => {
  const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!ev) return res.status(404).json({ error: 'Not found' });
  res.json(ev);
});

router.delete('/:id', protect, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
