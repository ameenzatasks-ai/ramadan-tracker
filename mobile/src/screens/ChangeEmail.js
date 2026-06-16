import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ChangeEmail({ navigation }) {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState('request'); // 'request' or 'confirm'
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onRequest = async () => {
    setError(null);
    if (!newEmail.trim().includes('@')) return setError('Enter a valid email.');
    setLoading(true);
    try {
      await api.requestEmailChange(newEmail.trim());
      setStep('confirm');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send code.');
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = async () => {
    setError(null);
    if (code.trim().length < 6) return setError('Enter the 6-digit code.');
    setLoading(true);
    try {
      const { email } = await api.confirmEmailChange(newEmail.trim(), code.trim());
      await updateUser({ ...user, email });
      Alert.alert('Email updated', `Your account email is now ${email}.`);
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not verify code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Header navigation={navigation} title="Update email" />
      {step === 'request' ? (
        <>
          <Text style={[type.body, styles.intro]}>
            Current email: <Text style={styles.bold}>{user?.email}</Text>{'\n'}
            We will send a code to the new address to confirm it.
          </Text>
          <Input label="New email" value={newEmail} onChangeText={setNewEmail} keyboardType="email-address" textContentType="emailAddress" />
          {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
          <Button label="Send verification code" onPress={onRequest} loading={loading} />
        </>
      ) : (
        <>
          <Text style={[type.body, styles.intro]}>
            Enter the 6-digit code sent to <Text style={styles.bold}>{newEmail}</Text>.
          </Text>
          <Input label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
          {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
          <Button label="Confirm" onPress={onConfirm} loading={loading} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 18 },
  bold: { color: colors.headline, fontWeight: '600' },
  errorText: { color: colors.illoTertiary, marginBottom: 12 },
});
