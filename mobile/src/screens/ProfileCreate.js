import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ProfileIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { useProfiles } from '../context/ProfileContext';
import { ApiError } from '../lib/api';

export default function ProfileCreate({ navigation }) {
  const { createProfile } = useProfiles();
  const [name, setName] = useState('');
  const [kind, setKind] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onContinue = async () => {
    if (!name.trim()) return setError('Please enter a profile name.');
    if (!kind) return setError('Please choose a profile type.');
    setLoading(true);
    setError(null);
    try {
      await createProfile(name.trim(), kind);
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not create profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Header navigation={navigation} title="New profile" showHome={false} />
      <Text style={[type.body, styles.intro]}>
        Give the profile a name and choose its type. You can have as many profiles as you like.
      </Text>
      <Input
        label="Profile name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Aisha"
        autoCapitalize="words"
      />
      <Text style={[type.smallStrong, styles.choiceLabel]}>Profile type</Text>
      <View style={styles.choices}>
        <Pressable
          onPress={() => setKind('adult')}
          accessibilityRole="button"
          accessibilityLabel="Adult profile"
          accessibilityState={{ selected: kind === 'adult' }}
          style={[styles.choice, kind === 'adult' && styles.choiceActive]}
        >
          <ProfileIcon kind="adult" size={72} />
          <Text style={[type.bodyStrong, styles.choiceText]}>Adult</Text>
          <Text style={[type.small, styles.choiceSub]}>Standard depth and language</Text>
        </Pressable>
        <Pressable
          onPress={() => setKind('child')}
          accessibilityRole="button"
          accessibilityLabel="Child profile"
          accessibilityState={{ selected: kind === 'child' }}
          style={[styles.choice, kind === 'child' && styles.choiceActive]}
        >
          <ProfileIcon kind="child" size={72} />
          <Text style={[type.bodyStrong, styles.choiceText]}>Child</Text>
          <Text style={[type.small, styles.choiceSub]}>Simpler language and scope</Text>
        </Pressable>
      </View>
      {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
      <Button label="Create profile" onPress={onContinue} loading={loading} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 18 },
  choiceLabel: { color: colors.paragraph, marginBottom: 8 },
  choices: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  choice: {
    flex: 1, marginRight: 10, padding: 14, borderRadius: 8,
    backgroundColor: colors.surface, alignItems: 'center',
    borderWidth: 1.5, borderColor: colors.divider,
  },
  choiceActive: { borderColor: colors.button, backgroundColor: colors.surfaceHigh },
  choiceText: { color: colors.headline, marginTop: 8 },
  choiceSub: { color: colors.paragraph, marginTop: 4, textAlign: 'center' },
  errorText: { color: colors.illoTertiary, marginBottom: 10 },
});
