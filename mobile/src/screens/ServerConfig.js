import React, { useState } from 'react';
import { Text, StyleSheet, Alert, View } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, getApiBase, setApiBaseOverride } from '../lib/api';

export default function ServerConfig({ navigation }) {
  const [url, setUrl] = useState(getApiBase());
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const onTest = async () => {
    setTesting(true);
    setStatus(null);
    try {
      await setApiBaseOverride(url);
      await api.health();
      setStatus({ ok: true, msg: 'Server is reachable.' });
    } catch (e) {
      setStatus({ ok: false, msg: e?.message || 'Could not reach server.' });
    } finally {
      setTesting(false);
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const next = await setApiBaseOverride(url);
      Alert.alert('Saved', `App will now talk to:\n${next}`);
      if (navigation.canGoBack()) navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const onReset = async () => {
    const next = await setApiBaseOverride('');
    setUrl(next);
    setStatus(null);
  };

  return (
    <Screen scroll>
      <Header navigation={navigation} title="Server URL" showHome={false} />
      <Text style={[type.body, styles.intro]}>
        Point the app at your backend. On a physical phone use your PC's LAN IP
        (e.g. http://192.168.1.42:4000), not localhost.
      </Text>
      <Input
        label="API base URL"
        value={url}
        onChangeText={setUrl}
        placeholder="http://192.168.1.42:4000"
        autoCapitalize="none"
        keyboardType="url"
      />
      {status ? (
        <Text style={[type.small, status.ok ? styles.ok : styles.bad]}>{status.msg}</Text>
      ) : null}
      <Button label="Test connection" variant="ghost" onPress={onTest} loading={testing} />
      <View style={{ height: 10 }} />
      <Button label="Save" onPress={onSave} loading={saving} />
      <View style={{ height: 10 }} />
      <Button label="Reset to default" variant="ghost" onPress={onReset} />
      <View style={{ height: 16 }} />
      <Text style={[type.small, { color: colors.paragraph }]}>
        Current: {getApiBase()}
      </Text>
      <Text style={[type.small, { color: colors.paragraph, marginTop: 6 }]}>
        Tip: find your PC's IP by running `ipconfig` in Command Prompt and look for
        "IPv4 Address" under your active adapter.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 16 },
  ok: { color: colors.illoSecondary, marginBottom: 8 },
  bad: { color: colors.illoTertiary, marginBottom: 8 },
});
