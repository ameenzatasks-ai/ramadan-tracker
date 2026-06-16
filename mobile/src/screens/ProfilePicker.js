import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ProfileIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { useProfiles } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';

export default function ProfilePicker({ navigation }) {
  const { profiles, activeId, setActive, removeProfile } = useProfiles();
  const { signOut } = useAuth();
  const [busyId, setBusyId] = useState(null);

  const choose = async (id) => {
    await setActive(id);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const confirmDelete = (item) => {
    Alert.alert(
      `Delete profile?`,
      `"${item.displayName}" and all its goals will be removed.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setBusyId(item.id);
              await removeProfile(item.id);
            } finally {
              setBusyId(null);
            }
          },
        },
      ],
    );
  };

  return (
    <Screen
      footer={
        <View>
          <Button label="Create new profile" onPress={() => navigation.navigate('ProfileCreate')} />
          <View style={{ height: 10 }} />
          <Button label="Log out" variant="ghost" onPress={signOut} />
        </View>
      }
    >
      <Header navigation={navigation} title="Who is this for?" showBack={false} showHome={false} />
      <Text style={[type.body, styles.intro]}>
        Each profile keeps its own goals. Switch any time.
      </Text>
      <FlatList
        data={profiles}
        keyExtractor={(p) => String(p.id)}
        contentContainerStyle={{ paddingBottom: 8 }}
        ListEmptyComponent={(
          <View style={styles.empty}>
            <Text style={[type.body, styles.emptyText]}>No profiles yet. Create one to begin.</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isActive = item.id === activeId;
          return (
            <Pressable
              onPress={() => choose(item.id)}
              onLongPress={() => confirmDelete(item)}
              style={({ pressed }) => [styles.row, isActive && styles.rowActive, pressed && styles.rowPressed]}
            >
              <ProfileIcon kind={item.profileType} size={56} />
              <View style={styles.rowText}>
                <Text style={[type.bodyStrong, { color: colors.headline }]}>{item.displayName}</Text>
                <Text style={[type.small, { color: colors.paragraph, marginTop: 2 }]}>
                  {item.profileType === 'child' ? 'Child' : 'Adult'}
                </Text>
              </View>
              <Text style={styles.arrow}>{busyId === item.id ? '…' : '›'}</Text>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 14 },
  empty: { padding: 16, alignItems: 'center' },
  emptyText: { color: colors.paragraph, textAlign: 'center' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 8, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: colors.divider,
  },
  rowActive: { borderColor: colors.button, backgroundColor: colors.surfaceWarm },
  rowPressed: { opacity: 0.85 },
  rowText: { flex: 1, marginLeft: 14 },
  arrow: { color: colors.paragraph, fontSize: 26, marginLeft: 8 },
});
