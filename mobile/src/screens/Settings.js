import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { useAuth } from '../context/AuthContext';
import { useProfiles } from '../context/ProfileContext';

function Row({ label, value, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[type.bodyStrong, { color: danger ? colors.illoTertiary : colors.headline }]}>{label}</Text>
        {value ? <Text style={[type.small, { color: colors.paragraph, marginTop: 2 }]}>{value}</Text> : null}
      </View>
      {onPress ? <Text style={styles.chevron}>›</Text> : null}
    </Pressable>
  );
}

export default function Settings({ navigation }) {
  const { user, signOut } = useAuth();
  const { active, profiles } = useProfiles();

  return (
    <Screen>
      <Header navigation={navigation} title="Settings" />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={[type.smallStrong, styles.sectionHead]}>Account information</Text>
        <View style={styles.group}>
          <Row label="Full name" value={user?.fullName} />
          <View style={styles.divider} />
          <Row label="Email" value={user?.email} />
        </View>

        <Text style={[type.smallStrong, styles.sectionHead]}>Account settings</Text>
        <View style={styles.group}>
          <Row label="Change password" onPress={() => navigation.navigate('ChangePassword')} />
          <View style={styles.divider} />
          <Row label="Update email" onPress={() => navigation.navigate('ChangeEmail')} />
          <View style={styles.divider} />
          <Row label="Manage account security" onPress={() => navigation.navigate('AccountSecurity')} />
        </View>

        <Text style={[type.smallStrong, styles.sectionHead]}>Connection</Text>
        <View style={styles.group}>
          <Row label="Server URL" onPress={() => navigation.navigate('ServerConfig')} />
        </View>

        <Text style={[type.smallStrong, styles.sectionHead]}>Profiles</Text>
        <View style={styles.group}>
          <Row label="Active profile" value={active?.displayName || 'None'} />
          <View style={styles.divider} />
          <Row
            label={profiles.length > 1 ? 'Switch profile' : 'Manage profiles'}
            onPress={() => navigation.navigate('ProfilePicker')}
          />
        </View>

        <View style={{ height: 20 }} />
        <Button label="Log out" variant="danger" onPress={signOut} />
        <View style={{ height: 12 }} />
        <Text style={[type.small, { color: colors.paragraph, textAlign: 'center' }]}>
          Logging out clears this session and returns you to Get Started.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionHead: { color: colors.paragraph, marginTop: 6, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  group: {
    backgroundColor: colors.surface, borderRadius: 8,
    borderWidth: 1, borderColor: colors.divider,
    marginBottom: 12, overflow: 'hidden',
  },
  row: { paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 14 },
  chevron: { color: colors.paragraph, fontSize: 22 },
});
