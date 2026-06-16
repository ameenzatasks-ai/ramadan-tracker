import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Load the auth-session provider defensively. If anything in the import path
// throws (this happens on web in some configurations) we treat Google as
// unavailable and the rest of the app falls back to email auth only.
let Google = null;
try {
  // eslint-disable-next-line global-require
  Google = require('expo-auth-session/providers/google');
} catch {
  Google = null;
}

if (Google) {
  try { WebBrowser.maybeCompleteAuthSession(); } catch { /* ignore */ }
}

const extra = Constants.expoConfig?.extra ?? {};
const webClientId = extra.googleWebClientId || undefined;
const iosClientId = extra.googleIosClientId || undefined;
const androidClientId = extra.googleAndroidClientId || undefined;

// `configured` is a module-level constant determined entirely by static
// expoConfig + the platform. That means the hook's branching below is stable
// across every render of the app's lifetime, which keeps React's hook ordering
// invariant happy even though we conditionally return early.
const neededId =
  Platform.OS === 'ios' ? (iosClientId || webClientId)
  : Platform.OS === 'android' ? (androidClientId || webClientId)
  : webClientId;
const configured = !!Google && !!neededId;

const unconfiguredStub = {
  configured: false,
  request: null,
  response: null,
  promptAsync: async () => ({ type: 'dismiss' }),
};

export function useGoogleAuth() {
  if (!configured) return unconfiguredStub;
  // Only reached when Google + a usable client id are present, so calling the
  // hook here is safe and order-stable.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: webClientId,
    iosClientId,
    androidClientId,
    selectAccount: true,
  });
  return { configured: true, request, response, promptAsync };
}
