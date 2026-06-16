import { Router } from 'express';
import { db } from '../db.js';
import { getRamadanDay } from '../lib/ramadan.js';
import { requireProfile } from '../middleware.js';

const router = Router();

router.use(requireProfile);

// Today's goal entries for the active profile.
router.get('/today', async (req, res) => {
  const liveDay = getRamadanDay();
  const day = liveDay || 1;
  const result = await db.execute(
    `SELECT gd.id            AS dayId,
            gd.day_number    AS dayNumber,
            gd.description   AS description,
            gd.completed_at  AS completedAt,
            g.id             AS goalId,
            g.category       AS category,
            g.title          AS goalTitle
       FROM goal_days gd
       JOIN goals g ON g.id = gd.goal_id
      WHERE g.profile_id = ?
        AND gd.day_number = ?
      ORDER BY gd.completed_at IS NULL DESC, g.id ASC`,
    [req.profile.id, day]
  );
  res.json({
    day,
    isLive: !!liveDay,
    entries: (result.rows || []).map((r) => ({
      dayId: r.dayId,
      dayNumber: r.dayNumber,
      description: r.description,
      completed: !!r.completedAt,
      goalId: r.goalId,
      category: r.category,
      goalTitle: r.goalTitle,
    })),
  });
});

router.post('/toggle/:dayId', async (req, res) => {
  const dayId = Number(req.params.dayId);
  // Verify the day belongs to a goal owned by this profile.
  const row_result = await db.execute(
    `SELECT gd.* FROM goal_days gd JOIN goals g ON g.id = gd.goal_id
      WHERE gd.id = ? AND g.profile_id = ?`,
    [dayId, req.profile.id]
  );
  const row = row_result.rows?.[0];
  if (!row) return res.status(404).json({ error: 'not_found' });

  if (row.completed_at) {
    await db.execute('UPDATE goal_days SET completed_at = NULL WHERE id = ?', [dayId]);
    res.json({ completed: false });
  } else {
    await db.execute(
      "UPDATE goal_days SET completed_at = datetime('now') WHERE id = ?",
      [dayId]
    );
    res.json({ completed: true });
  }
});

export default router;
