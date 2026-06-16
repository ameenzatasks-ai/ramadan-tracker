import { Router } from 'express';
import { db } from '../db.js';
import { expandGoalToDailyChecklist } from '../lib/ai.js';
import { isRamadanActive, getRamadanDay } from '../lib/ramadan.js';
import { requireProfile } from '../middleware.js';

const router = Router();

const VALID_CATEGORIES = ['salah', 'quran', 'charity', 'family', 'adhkar', 'dua', 'custom'];

function blockIfLocked(req, res, next) {
  if (isRamadanActive()) {
    return res.status(423).json({ error: 'ramadan_locked' });
  }
  next();
}

router.use(requireProfile);

router.get('/', async (req, res) => {
  const result = await db.execute(
    'SELECT id, category, title, source FROM goals WHERE profile_id = ? ORDER BY id ASC',
    [req.profile.id]
  );
  res.json({
    goals: result.rows || [],
    locked: isRamadanActive(),
    ramadanDay: getRamadanDay(),
  });
});

router.post('/', blockIfLocked, async (req, res) => {
  const category = String(req.body?.category || '');
  const title = String(req.body?.title || '').trim();
  const source = req.body?.source === 'custom' ? 'custom' : 'library';
  if (!VALID_CATEGORIES.includes(category)) return res.status(400).json({ error: 'invalid_category' });
  if (!title) return res.status(400).json({ error: 'title_required' });

  const days = await expandGoalToDailyChecklist({
    title,
    category,
    profileType: req.profile.profile_type,
  });

  // Insert goal
  const goalInfo = await db.execute(
    'INSERT INTO goals (profile_id, category, title, source) VALUES (?, ?, ?, ?)',
    [req.profile.id, category, title, source]
  );
  const goalId = goalInfo.lastInsertRowid;

  // Insert all 30 day entries
  for (let i = 0; i < 30; i++) {
    await db.execute(
      'INSERT INTO goal_days (goal_id, day_number, description) VALUES (?, ?, ?)',
      [goalId, i + 1, String(days[i] || `Day ${i + 1}: ${title}`)]
    );
  }

  res.json({ goal: { id: goalId, category, title, source } });
});

router.delete('/:id', blockIfLocked, async (req, res) => {
  const id = Number(req.params.id);
  const result = await db.execute(
    'DELETE FROM goals WHERE id = ? AND profile_id = ?',
    [id, req.profile.id]
  );
  if (result.rowsAffected === 0) return res.status(404).json({ error: 'not_found' });
  res.json({ ok: true });
});

export default router;
