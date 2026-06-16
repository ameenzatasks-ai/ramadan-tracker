import { verifySession } from './lib/auth.js';
import { db } from './db.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = token && verifySession(token);
  if (!payload) return res.status(401).json({ error: 'unauthorized' });

  const result = await db.execute(
    'SELECT id, full_name, email FROM users WHERE id = ?',
    [payload.uid]
  );
  const user = result.rows?.[0];
  if (!user) return res.status(401).json({ error: 'unauthorized' });
  req.user = user;
  next();
}

export async function requireProfile(req, res, next) {
  const profileId = Number(req.headers['x-profile-id']);
  if (!profileId) return res.status(400).json({ error: 'missing_profile' });

  const result = await db.execute(
    'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
    [profileId, req.user.id]
  );
  const profile = result.rows?.[0];
  if (!profile) return res.status(404).json({ error: 'profile_not_found' });
  req.profile = profile;
  next();
}
