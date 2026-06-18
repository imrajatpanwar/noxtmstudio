import { Router } from 'express';
import ChatConfig from '../models/ChatConfig.js';
import Conversation from '../models/Conversation.js';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/auth.js';

const router = Router();

async function getConfig() {
  let c = await ChatConfig.findOne();
  if (!c) c = await ChatConfig.create({});
  return c;
}

function matchRule(rules, text) {
  const low = text.toLowerCase();
  for (const rule of rules) {
    if ((rule.keywords || []).some((k) => k && low.includes(k.toLowerCase()))) {
      return rule.answer;
    }
  }
  return null;
}

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;

// Public: get widget config (welcome message, enabled state)
router.get('/config', async (_req, res) => {
  const c = await getConfig();
  res.json({ enabled: c.enabled, title: c.title, welcome: c.welcome });
});

// Public: send a message, get a bot reply
router.post('/message', async (req, res) => {
  const { visitorId, text } = req.body;
  if (!visitorId || !text) return res.status(400).json({ error: 'visitorId and text required' });

  const config = await getConfig();
  let convo = await Conversation.findOne({ visitorId });
  if (!convo) convo = new Conversation({ visitorId, messages: [] });

  convo.messages.push({ from: 'user', text });

  // Capture an email as a lead from inside the chat
  const emailMatch = text.match(EMAIL_RE);
  if (emailMatch && !convo.contactEmail) {
    convo.contactEmail = emailMatch[0];
    await Lead.create({
      name: 'Chat visitor',
      email: emailMatch[0],
      message: text,
      source: 'chatbot',
    });
  }

  let reply = matchRule(config.rules, text);
  if (!reply) reply = config.fallback;

  convo.messages.push({ from: 'bot', text: reply });
  await convo.save();

  res.json({ reply });
});

// Admin: full config
router.get('/admin/config', protect, async (_req, res) => {
  res.json(await getConfig());
});

router.put('/admin/config', protect, async (req, res) => {
  const c = await getConfig();
  Object.assign(c, req.body);
  await c.save();
  res.json(c);
});

// Admin: conversation log
router.get('/admin/conversations', protect, async (_req, res) => {
  const convos = await Conversation.find().sort({ updatedAt: -1 }).limit(200);
  res.json(convos);
});

export default router;
