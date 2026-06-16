import { OAuth2Client } from 'google-auth-library';

let client = null;

export async function verifyGoogleIdToken(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID is not configured');
  if (!client) client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({ idToken, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload?.email) {
    throw new Error('Invalid Google token payload');
  }
  return {
    sub: payload.sub,
    email: payload.email,
    emailVerified: !!payload.email_verified,
    fullName: payload.name || payload.email.split('@')[0],
  };
}
