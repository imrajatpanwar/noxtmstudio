import { Router } from 'express';
import SiteSettings from '../models/SiteSettings.js';
import { protect } from '../middleware/auth.js';

const router = Router();

async function getOrCreate() {
  let s = await SiteSettings.findOne();
  if (!s) s = await SiteSettings.create({});
  return s;
}

// Public: strip sensitive fields
router.get('/', async (req, res) => {
  const s = (await getOrCreate()).toObject();
  // Only expose IG audit fields to authenticated admins
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    delete s.igAuditUser;
    delete s.igAuditPass;
    delete s.igCookies;
    delete s.igCookiesAt;
  }
  // Never expose cookies or raw password in any response
  delete s.igCookies;
  if (s.igAuditPass) s.igAuditPass = '••••••••';
  res.json(s);
});

router.put('/', protect, async (req, res) => {
  const s = await getOrCreate();
  const body = { ...req.body };
  // Don't overwrite real password with masked value
  if (body.igAuditPass === '••••••••') delete body.igAuditPass;
  Object.assign(s, body);
  await s.save();
  res.json(s);
});

export default router;
