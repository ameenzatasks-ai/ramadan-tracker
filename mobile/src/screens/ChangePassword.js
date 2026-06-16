import React, { useState } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';

export default function ChangePassword({ navigation }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async () => {
    setError(null);
    if (next.length < 8) return setError('New password must be at least 8 characters.');
    if (next !== confirmNew) return setError('New passwords do not match.');
    setLoading(true);
    try {
      await api.changePassword(current, next);
      Alert.alert('Password updated', 'Your password has been changed.');
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Header navigation={navigation} title="Change password" />
      <Text style={[type.body, styles.intro]}>Enter your current password to set a new one.</Text>
      <Input label="Current password" value={current} onChangeText={setCurrent} secureTextEntry textContentType="password" />
      <Input label="New password" value={next} onChangeText={setNext} secureTextEntry textContentType="newPassword" placeholder="At least 8 characters" />
      <Input label="Confirm new password" value={confirmNew} onChangeText={setConfirmNew} secureTextEntry />
      {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
      <Button label="Update password" onPress={onSubmit} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 18 },
  errorText: { color: colors.illoTertiary, marginBottom: 12 },
});
