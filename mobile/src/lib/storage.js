import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// SecureStore is only available on native iOS / Android. On web (and any other
// platform) we transparently fall back to AsyncStorage so the rest of the app
// can call setItem/getItem/removeItem without caring.
let SecureStore = null;
if (Platform.OS === 'ios' || Platform.OS === 'android') {
  try {
    // eslint-disable-next-line global-require
    SecureStore = require('expo-secure-store');
  } catch {
    SecureStore = null;
  }
}

export async function setItem(key, value) {
  if (SecureStore) {
    try { return await SecureStore.setItemAsync(key, value); }
    catch { return AsyncStorage.setItem(key, value); }
  }
  return AsyncStorage.setItem(key, value);
}

export async function getItem(key) {
  if (SecureStore) {
    try { return await SecureStore.getItemAsync(key); }
    catch { return AsyncStorage.getItem(key); }
  }
  return AsyncStorage.getItem(key);
}

export async function removeItem(key) {
  if (SecureStore) {
    try { return await SecureStore.deleteItemAsync(key); }
    catch { return AsyncStorage.removeItem(key); }
  }
  return AsyncStorage.removeItem(key);
}
