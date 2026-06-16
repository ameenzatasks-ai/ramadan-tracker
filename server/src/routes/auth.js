import { Router } from 'express';
import { db } from '../db.js';
import { signSession } from '../lib/auth.js';
import { verifyGoogleIdToken } from '../lib/google.js';
import { requireAuth } from '../middleware.js';

const router = Router();

function userPublic(u) {
  return {
    id: u.id,
    fullName: u.full_name,
    email: u.email,
    emailVerified: true, // All users are verified via Google
  };
}

// --- Google sign-in (create or link account) ---
router.post('/google', async (req, res) => {
  try {
    const idToken = String(req.body?.idToken || '');
    if (!idToken) return res.status(400).json({ error: 'missing_token' });

    const g = await verifyGoogleIdToken(idToken);

    // Look for existing user by google_sub
    let result = await db.execute(
      'SELECT id, full_name, email FROM users WHERE google_sub = ?',
      [g.sub]
    );
    let user = result.rows?.[0];

    if (!user) {
      // Look for existing user by email
      result = await db.execute(
        'SELECT id, full_name, email FROM users WHERE email = ?',
        [g.email]
      );
      const byEmail = result.rows?.[0];

      if (byEmail) {
        // Link Google to existing email account
        await db.execute(
          'UPDATE users SET google_sub = ? WHERE id = ?',
          [g.sub, byEmail.id]
        );
        user = byEmail;
      } else {
        // Create new user
        result = await db.execute(
          'INSERT INTO users (full_name, email, google_sub) VALUES (?, ?, ?)',
          [g.fullName, g.email, g.sub]
        );
        const userId = result.lastInsertRowid;
        result = await db.execute(
          'SELECT id, full_name, email FROM users WHERE id = ?',
          [userId]
        );
        user = result.rows?.[0];
      }
    }

    const token = signSession(user.id);
    res.json({ token, user: userPublic(user) });
  } catch (err) {
    console.error('[google]', err);
    res.status(401).json({ error: 'google_failed', message: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  res.json({ user: userPublic(req.user) });
});

export default router;
