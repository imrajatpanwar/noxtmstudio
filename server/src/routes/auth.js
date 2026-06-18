import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.matchPassword(password || ''))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: sign(user), user });
});

router.get('/me', protect, (req, res) => res.json(req.user));

export default router;
