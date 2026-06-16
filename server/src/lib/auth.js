import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const hashPassword = (plain) => bcrypt.hash(plain, 10);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export const signSession = (userId) =>
  jwt.sign({ uid: userId }, SECRET, { expiresIn: '90d' });

export const verifySession = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};

export const generateOtp = () => {
  // 6-digit numeric code, zero-padded.
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, '0');
};

export const hashOtp = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');
