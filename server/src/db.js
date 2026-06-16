import { createClient } from '@libsql/client';

// Turso database URL and auth token come from env vars set during deployment.
// Locally, you can use a file-based database with file:// URLs.
// Example:
//   DATABASE_URL=file:data.sqlite
//   (no TURSO_AUTH_TOKEN needed for file:// URLs)
//
// Production (Turso):
//   DATABASE_URL=libsql://my-db-xxx.turso.io
//   TURSO_AUTH_TOKEN=eyJhbGciOiJFZFNBIn0...
const databaseUrl = process.env.DATABASE_URL || 'file:data.sqlite';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: databaseUrl,
  authToken,
});

export const db = client;

// Initialize schema on startup. libsql uses async for all operations,
// so we wrap the init in a function called from index.js.
export async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      google_sub TEXT NOT NULL UNIQUE,
      email_verified_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      display_name TEXT NOT NULL,
      profile_type TEXT NOT NULL CHECK (profile_type IN ('adult','child')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
      category TEXT NOT NULL CHECK (category IN ('salah','quran','charity','family','adhkar','dua','custom')),
      title TEXT NOT NULL,
      source TEXT NOT NULL CHECK (source IN ('library','custom')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_goals_profile ON goals(profile_id);

    CREATE TABLE IF NOT EXISTS goal_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
      day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 30),
      description TEXT NOT NULL,
      completed_at TEXT,
      UNIQUE (goal_id, day_number)
    );
    CREATE INDEX IF NOT EXISTS idx_goaldays_goal ON goal_days(goal_id);
  `);
}

// Helper: wrap libsql's async execute/executeMany into a more ergonomic API.
// These are small helpers so code that was written for sync DB can mostly work.
// For new code, use the async versions directly or use db.execute.
export const dbSync = {
  prepare: (sql) => ({
    get: async (args) => {
      const result = await db.execute({
        sql,
        args: Array.isArray(args) ? args : [args],
      });
      return result.rows?.[0];
    },
    all: async (args) => {
      const result = await db.execute({
        sql,
        args: Array.isArray(args) ? args : [args],
      });
      return result.rows || [];
    },
    run: async (args) => {
      const result = await db.execute({
        sql,
        args: Array.isArray(args) ? args : [args],
      });
      return {
        changes: result.rowsAffected,
        lastInsertRowid: result.lastInsertRowid,
      };
    },
  }),
};
