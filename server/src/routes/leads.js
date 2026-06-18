import { Router } from 'express';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Public: submit contact / lead form
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
  const lead = await Lead.create(req.body);
  res.status(201).json({ ok: true, id: lead._id });
});

// Admin: list + manage
router.get('/', protect, async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.json(leads);
});

router.put('/:id', protect, async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!lead) return res.status(404).json({ error: 'Not found' });
  res.json(lead);
});

router.delete('/:id', protect, async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
