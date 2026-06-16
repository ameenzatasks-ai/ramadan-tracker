import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { useGoogleAuth } from '../lib/google';
import { useAuth } from '../context/AuthContext';

export default function SignUp({ navigation }) {
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { configured: googleConfigured, request, promptAsync } = useGoogleAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.signup(fullName.trim(), email.trim());
      navigation.navigate('VerifyCode', { email: email.trim() });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Unable to sign up.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    try {
      setGoogleLoading(true);
      const result = await promptAsync();
      if (result?.type !== 'success') return;
      const idToken = result.params?.id_token || result.authentication?.idToken;
      if (!idToken) throw new Error('No id token from Google');
      const { token, user } = await api.google(idToken);
      await signIn(token, user);
    } catch (e) {
      Alert.alert('Google sign-in failed', e?.message || 'Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Header navigation={navigation} title="Create your account" showHome={false} />
      <Text style={[type.body, styles.intro]}>Let’s get you started.</Text>
      <Input
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Your name"
        autoCapitalize="words"
        textContentType="name"
      />
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
      />
      {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
      <Button label="Continue" onPress={onSubmit} loading={loading} />
      <Text style={[type.small, styles.terms]}>
        By continuing, you agree to our Terms of Use and Privacy Policy.
      </Text>
      <View style={styles.dividerRow}>
        <View style={styles.divLine} />
        <Text style={[type.small, styles.divText]}>or</Text>
        <View style={styles.divLine} />
      </View>
      <Button
        label={googleConfigured ? 'Continue with Google' : 'Google sign-in (configure key)'}
        variant="ghost"
        onPress={onGoogle}
        disabled={!googleConfigured || !request}
        loading={googleLoading}
      />
      <View style={{ height: 16 }} />
      <Button label="I already have an account" variant="ghost" onPress={() => navigation.navigate('Login')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 18 },
  errorText: { color: colors.illoTertiary, marginBottom: 12 },
  terms: { color: colors.paragraph, textAlign: 'center', marginTop: 12, opacity: 0.85 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  divText: { color: colors.paragraph, marginHorizontal: 10 },
});
