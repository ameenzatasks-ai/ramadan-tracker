import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal, Animated } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { TabBar } from '../components/TabBar';
import { ProfileIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { useAuth } from '../context/AuthContext';
import { useProfiles } from '../context/ProfileContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { easeStandard, durations } from '../theme/motion';

function Row({ label, value, onPress, danger }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
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

export default function Profile({ navigation }) {
  const { user, signOut } = useAuth();
  const { active, profiles, setActive } = useProfiles();
  const reduceMotion = useReduceMotion();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Screen opacity for logout fade-out
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Stagger animation for ACCOUNT SETTINGS rows (4 rows)
  const rowAnims = useRef(
    Array.from({ length: 4 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(8),
    }))
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      rowAnims.forEach(({ opacity, translateY }) => {
        opacity.setValue(1);
        translateY.setValue(0);
      });
      return;
    }
    rowAnims.forEach(({ opacity, translateY }, i) => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: durations.listItem,
          delay: i * durations.listStagger,
          easing: easeStandard,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: durations.listItem,
          delay: i * durations.listStagger,
          easing: easeStandard,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onLogoutConfirmed = () => {
    setConfirmOpen(false);
    if (reduceMotion) {
      signOut();
      return;
    }
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: durations.logout,
      easing: easeStandard,
      useNativeDriver: true,
    }).start(() => signOut());
  };

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <Screen padded={false} footer={<TabBar current="Profile" />}>
        <View style={styles.padded}>
          <Header navigation={navigation} title="Account" showBack={false} showHome={false} />
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={[type.smallStrong, styles.sectionHead]}>ACCOUNT</Text>
          <View style={styles.group}>
            <Row label="Name" value={user?.fullName} />
            <View style={styles.divider} />
            <Row label="Email" value={user?.email} />
          </View>

          <Text style={[type.smallStrong, styles.sectionHead]}>ACCOUNT SETTINGS</Text>
          <View style={styles.group}>
            <Animated.View style={{ opacity: rowAnims[0].opacity, transform: [{ translateY: rowAnims[0].translateY }] }}>
              <Row label="Change password" onPress={() => navigation.navigate('ChangePassword')} />
              <View style={styles.divider} />
            </Animated.View>
            <Animated.View style={{ opacity: rowAnims[1].opacity, transform: [{ translateY: rowAnims[1].translateY }] }}>
              <Row label="Update email" onPress={() => navigation.navigate('ChangeEmail')} />
              <View style={styles.divider} />
            </Animated.View>
            <Animated.View style={{ opacity: rowAnims[2].opacity, transform: [{ translateY: rowAnims[2].translateY }] }}>
              <Row label="Manage account security" onPress={() => navigation.navigate('AccountSecurity')} />
              <View style={styles.divider} />
            </Animated.View>
            <Animated.View style={{ opacity: rowAnims[3].opacity, transform: [{ translateY: rowAnims[3].translateY }] }}>
              <Row label="Server URL" onPress={() => navigation.navigate('ServerConfig')} />
            </Animated.View>
          </View>

          <Text style={[type.smallStrong, styles.sectionHead]}>PROFILES</Text>
          <View style={styles.group}>
            {profiles.length === 0 ? (
              <Row label="No profiles yet" onPress={() => navigation.navigate('ProfileCreate')} />
            ) : profiles.map((p, i) => (
              <View key={p.id}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <Pressable
                  onPress={() => setActive(p.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${p.displayName}`}
                  style={({ pressed }) => [styles.profileRow, pressed && { opacity: 0.85 }]}
                >
                  <ProfileIcon kind={p.profileType} size={40} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={[type.bodyStrong, { color: colors.headline }]}>{p.displayName}</Text>
                    <Text style={[type.small, { color: colors.paragraph, marginTop: 2 }]}>
                      {p.profileType === 'child' ? 'Child' : 'Adult'}
                    </Text>
                  </View>
                  {p.id === active?.id ? (
                    <View style={styles.currentDot} />
                  ) : (
                    <Text style={styles.chevron}>›</Text>
                  )}
                </Pressable>
              </View>
            ))}
            {profiles.length > 0 ? <View style={styles.divider} /> : null}
            <Row label="+ Add new profile" onPress={() => navigation.navigate('ProfileCreate')} />
          </View>

          <View style={{ height: 12 }} />
          <Button label="Logout" variant="danger" onPress={() => setConfirmOpen(true)} />
          <View style={{ height: 14 }} />
        </ScrollView>

        <Modal
          visible={confirmOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setConfirmOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={[type.h1, { color: colors.headline, textAlign: 'center' }]}>Logout</Text>
              <Text style={[type.body, { color: colors.paragraph, textAlign: 'center', marginTop: 8 }]}>
                Are you sure you want to logout from your account?
              </Text>
              <View style={{ height: 16 }} />
              <Button label="Cancel" variant="ghost" onPress={() => setConfirmOpen(false)} />
              <View style={{ height: 10 }} />
              <Button label="Logout" variant="danger" onPress={onLogoutConfirmed} />
            </View>
          </View>
        </Modal>
      </Screen>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: 20, paddingTop: 16 },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  sectionHead: { color: colors.paragraph, letterSpacing: 1, marginTop: 6, marginBottom: 8 },
  group: {
    backgroundColor: colors.surface, borderRadius: 8, borderWidth: 1, borderColor: colors.divider,
    marginBottom: 12, overflow: 'hidden',
  },
  row: { padding: 14, flexDirection: 'row', alignItems: 'center' },
  profileRow: { padding: 12, flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 14 },
  chevron: { color: colors.paragraph, fontSize: 22 },
  currentDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.button, marginRight: 4 },
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,30,29,0.7)',
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  modalCard: {
    width: '100%', maxWidth: 360,
    backgroundColor: colors.backgroundAlt, borderRadius: 8, padding: 20,
    borderWidth: 1, borderColor: colors.divider,
  },
});
