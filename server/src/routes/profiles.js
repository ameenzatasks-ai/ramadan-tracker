import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

router.get('/', async (req, res) => {
  const result = await db.execute(
    'SELECT id, display_name AS displayName, profile_type AS profileType, created_at AS createdAt FROM profiles WHERE user_id = ? ORDER BY id ASC',
    [req.user.id]
  );
  res.json({ profiles: result.rows || [] });
});

router.post('/', async (req, res) => {
  const displayName = String(req.body?.displayName || '').trim();
  const profileType = String(req.body?.profileType || '');
  if (!displayName) return res.status(400).json({ error: 'name_required' });
  if (!['adult', 'child'].includes(profileType)) return res.status(400).json({ error: 'invalid_type' });

  const info = await db.execute(
    'INSERT INTO profiles (user_id, display_name, profile_type) VALUES (?, ?, ?)',
    [req.user.id, displayName, profileType]
  );
  const row_result = await db.execute(
    'SELECT id, display_name AS displayName, profile_type AS profileType, created_at AS createdAt FROM profiles WHERE id = ?',
    [info.lastInsertRowid]
  );
  const row = row_result.rows?.[0];
  res.json({ profile: row });
});

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const profile_result = await db.execute(
    'SELECT * FROM profiles WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );
  const profile = profile_result.rows?.[0];
  if (!profile) return res.status(404).json({ error: 'not_found' });

  const displayName = String(req.body?.displayName || profile.display_name).trim();
  await db.execute(
    'UPDATE profiles SET display_name = ? WHERE id = ?',
    [displayName, id]
  );
  const row_result = await db.execute(
    'SELECT id, display_name AS displayName, profile_type AS profileType FROM profiles WHERE id = ?',
    [id]
  );
  const row = row_result.rows?.[0];
  res.json({ profile: row });
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const result = await db.execute(
    'DELETE FROM profiles WHERE id = ? AND user_id = ?',
    [id, req.user.id]
  );
  if (result.rowsAffected === 0) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

export default router;
