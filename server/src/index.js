import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db.js';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profiles.js';
import goalRoutes from './routes/goals.js';
import progressRoutes from './routes/progress.js';
import { requireAuth } from './middleware.js';

const app = express();

// CORS: allow all origins by default. In production you can lock this down to your
// web app's origin(s) with a comma-separated CORS_ORIGIN env var.
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '256kb' }));

app.get('/', (_req, res) => res.json({ service: 'ramadan-goal-companion', ok: true }));
app.get('/health', (_req, res) => res.json({ ok: true }));

// Public auth endpoints.
app.use('/auth', authRoutes);

// Authenticated endpoints.
app.use('/profiles', requireAuth, profileRoutes);
app.use('/goals', requireAuth, goalRoutes);
app.use('/progress', requireAuth, progressRoutes);

const port = Number(process.env.PORT || 4000);

// Initialize database then start server.
(async () => {
  try {
    await initDatabase();
    console.log('[db] Initialized');
  } catch (err) {
    console.error('[db] init failed:', err);
    process.exit(1);
  }

  // Bind 0.0.0.0 so the server is reachable inside containers (Fly, Docker, etc.).
  app.listen(port, '0.0.0.0', () => {
    console.log(`Ramadan Goal Companion server listening on :${port}`);
  });
})();
