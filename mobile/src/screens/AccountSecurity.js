import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { useAuth } from '../context/AuthContext';

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={[type.bodyStrong, { color: colors.headline }]}>{label}</Text>
      <Text style={[type.small, { color: colors.paragraph, marginTop: 4 }]}>{value}</Text>
    </View>
  );
}

export default function AccountSecurity({ navigation }) {
  const { user, signOut } = useAuth();

  return (
    <Screen scroll>
      <Header navigation={navigation} title="Account security" />
      <Text style={[type.body, styles.intro]}>
        Your session is protected by a long-lived token stored securely on this device.
        Logging out removes the token from this device immediately.
      </Text>
      <View style={styles.group}>
        <Row label="Email verified" value={user?.emailVerified ? 'Yes' : 'No — re-verify by signing in again'} />
        <View style={styles.divider} />
        <Row label="Sign-in method" value="Email + password (Google linked accounts also sign in here)" />
        <View style={styles.divider} />
        <Row label="This device" value="Session active. Tap Log out to end it." />
      </View>
      <Button
        label="Log out of this device"
        variant="danger"
        onPress={() => Alert.alert('Log out?', 'You will return to the Get Started screen.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log out', style: 'destructive', onPress: signOut },
        ])}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 16 },
  group: {
    backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.divider,
    marginBottom: 18, overflow: 'hidden',
  },
  row: { padding: 14 },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 14 },
});
