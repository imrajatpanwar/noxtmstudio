import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

import authRoutes from './routes/auth.js';
import pageRoutes from './routes/pages.js';
import postRoutes from './routes/posts.js';
import eventRoutes from './routes/events.js';
import teamRoutes from './routes/team.js';
import leadRoutes from './routes/leads.js';
import chatRoutes from './routes/chat.js';
import settingsRoutes from './routes/settings.js';
import auditRoutes from './routes/audit.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/audit', auditRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5050;

connectDB(process.env.MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`API on :${PORT}`)))
  .catch((e) => {
    console.error('DB connection failed:', e.message);
    process.exit(1);
  });
