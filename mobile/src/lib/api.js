import Constants from 'expo-constants';
import { getItem, setItem, removeItem } from './storage';

const KEY_API_OVERRIDE = 'rgc.apiBaseOverride';

// Resolution order for the API base URL:
//   1. EXPO_PUBLIC_API_BASE  (env var baked at bundle time, simplest)
//   2. User-saved override   (set in-app from GetStarted / Settings)
//   3. expo.extra.apiBaseUrl (default from app.json)
//   4. http://localhost:4000 (last-ditch fallback)
const extra = Constants.expoConfig?.extra ?? {};
const envBase = process.env.EXPO_PUBLIC_API_BASE;
const defaultBase = envBase || extra.apiBaseUrl || 'http://localhost:4000';

let currentBase = defaultBase;
let resolvedFrom = envBase ? 'env' : (extra.apiBaseUrl ? 'config' : 'fallback');

export function getApiBase() {
  return currentBase;
}
export function getApiBaseSource() {
  return resolvedFrom;
}

// Called once on app startup so a saved override takes priority over the default.
export async function loadStoredApiBase() {
  try {
    const stored = await getItem(KEY_API_OVERRIDE);
    if (stored) {
      currentBase = stored;
      resolvedFrom = 'override';
    }
  } catch {
    // ignore
  }
}

export async function setApiBaseOverride(url) {
  const cleaned = String(url || '').trim().replace(/\/+$/, '');
  if (!cleaned) {
    await removeItem(KEY_API_OVERRIDE);
    currentBase = envBase || extra.apiBaseUrl || 'http://localhost:4000';
    resolvedFrom = envBase ? 'env' : (extra.apiBaseUrl ? 'config' : 'fallback');
    return currentBase;
  }
  await setItem(KEY_API_OVERRIDE, cleaned);
  currentBase = cleaned;
  resolvedFrom = 'override';
  return currentBase;
}

let sessionToken = null;
let activeProfileId = null;

export function setAuth(token) { sessionToken = token; }
export function setActiveProfileId(id) { activeProfileId = id; }

async function request(path, { method = 'GET', body, headers = {}, withProfile = false } = {}) {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (sessionToken) finalHeaders.Authorization = `Bearer ${sessionToken}`;
  if (withProfile && activeProfileId) finalHeaders['X-Profile-Id'] = String(activeProfileId);

  let resp;
  try {
    resp = await fetch(`${currentBase}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError('network', `Cannot reach ${currentBase}. Check the server URL and that the backend is running.`);
  }
  const text = await resp.text();
  let data = null;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!resp.ok) {
    throw new ApiError(data.error || 'request_failed', errorMessage(data.error), data);
  }
  return data;
}

export class ApiError extends Error {
  constructor(code, message, data) {
    super(message || code);
    this.code = code;
    this.data = data;
  }
}

function errorMessage(code) {
  switch (code) {
    case 'name_required': return 'Please enter your full name.';
    case 'invalid_email': return 'That does not look like a valid email.';
    case 'weak_password': return 'Password must be at least 8 characters.';
    case 'email_in_use': return 'An account with that email already exists.';
    case 'no_user': return 'No account found for that email.';
    case 'no_code': return 'No verification code on file. Request a new one.';
    case 'expired': return 'This code has expired. Tap Resend.';
    case 'invalid': return 'Incorrect code. Try again.';
    case 'invalid_credentials': return 'Email or password is incorrect.';
    case 'email_not_verified': return 'Email not yet verified. Check your inbox.';
    case 'invalid_current_password': return 'Current password is incorrect.';
    case 'google_failed': return 'Google sign-in failed. Try again.';
    case 'ramadan_locked': return 'Goals are locked during Ramadan and cannot be changed.';
    case 'missing_profile': return 'Please select a profile first.';
    case 'profile_not_found': return 'Profile not found.';
    case 'network': return 'Cannot reach server. Check your connection.';
    default: return 'Something went wrong. Please try again.';
  }
}

export const api = {
  health: () => request('/health'),

  signup: (fullName, email) =>
    request('/auth/signup', { method: 'POST', body: { fullName, email } }),
  loginEmail: (email) =>
    request('/auth/login-email', { method: 'POST', body: { email } }),
  verify: (email, code) =>
    request('/auth/verify', { method: 'POST', body: { email, code } }),
  resend: (email) =>
    request('/auth/resend', { method: 'POST', body: { email } }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  google: (idToken) =>
    request('/auth/google', { method: 'POST', body: { idToken } }),
  me: () => request('/auth/me'),

  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } }),
  requestEmailChange: (newEmail) =>
    request('/auth/request-email-change', { method: 'POST', body: { newEmail } }),
  confirmEmailChange: (newEmail, code) =>
    request('/auth/confirm-email-change', { method: 'POST', body: { newEmail, code } }),

  listProfiles: () => request('/profiles'),
  createProfile: (displayName, profileType) =>
    request('/profiles', { method: 'POST', body: { displayName, profileType } }),
  renameProfile: (id, displayName) =>
    request(`/profiles/${id}`, { method: 'PATCH', body: { displayName } }),
  deleteProfile: (id) =>
    request(`/profiles/${id}`, { method: 'DELETE' }),

  listGoals: () => request('/goals', { withProfile: true }),
  addGoal: (category, title, source = 'library') =>
    request('/goals', { method: 'POST', body: { category, title, source }, withProfile: true }),
  deleteGoal: (id) =>
    request(`/goals/${id}`, { method: 'DELETE', withProfile: true }),

  today: () => request('/progress/today', { withProfile: true }),
  toggleDay: (dayId) =>
    request(`/progress/toggle/${dayId}`, { method: 'POST', withProfile: true }),
};
