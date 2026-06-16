import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('./data.sqlite');
console.log('tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
console.log('users:', db.prepare('SELECT id, full_name, email, email_verified_at FROM users ORDER BY id DESC LIMIT 5').all());
try { console.log('otps:', db.prepare('SELECT email, purpose, expires_at, consumed_at, created_at FROM otp_codes ORDER BY id DESC LIMIT 5').all()); } catch (e) { console.log('otps err:', e.message); }
