import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { CATEGORIES } from '../data/goalLibrary';
import { api, ApiError } from '../lib/api';

export default function CustomGoal({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('custom');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onAdd = async () => {
    setError(null);
    if (!title.trim()) return setError('Describe the goal in a few words.');
    setSubmitting(true);
    try {
      await api.addGoal(category, title.trim(), 'custom');
      navigation.navigate('GoalsOverview');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not add.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <Header navigation={navigation} title="Create your own goal" />
      <Text style={[type.body, styles.intro]}>
        Write the goal in one short sentence. We will turn it into a thirty-day daily checklist.
      </Text>
      <Input
        label="Your goal"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Memorise Surah Al-Asr by the end of Ramadan"
        autoCapitalize="sentences"
        autoCorrect
        returnKeyType="done"
        maxLength={140}
      />
      <Text style={[type.smallStrong, styles.subhead]}>Choose a category (optional)</Text>
      <View style={styles.catGrid}>
        {[{ key: 'custom', label: 'Custom' }, ...CATEGORIES].map((c) => {
          const sel = c.key === category;
          return (
            <Pressable
              key={c.key}
              onPress={() => setCategory(c.key)}
              style={({ pressed }) => [styles.catCellWrap, sel && styles.catCellWrapActive, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.catCell}>
                <CategoryIcon category={c.key} size={36} />
                <Text style={[type.small, styles.catLabel]}>{c.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
      <View style={styles.infoBox}>
        <Text style={[type.smallStrong, { color: colors.buttonText }]}>How this works</Text>
        <Text style={[type.small, { color: colors.buttonText, marginTop: 4 }]}>
          We’ll break this down into daily steps for all 30 days of Ramadan.
        </Text>
      </View>
      <Button label="Add goal" onPress={onAdd} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 18 },
  subhead: { color: colors.paragraph, marginBottom: 8, marginTop: 6 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 12 },
  catCellWrap: { width: '31%', borderRadius: 8, padding: 2, marginBottom: 8, borderWidth: 1.5, borderColor: 'transparent' },
  catCellWrapActive: { borderColor: colors.button },
  catCell: {
    backgroundColor: colors.surface, borderRadius: 8, padding: 10,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.divider,
  },
  catLabel: { color: colors.headline, marginTop: 6 },
  errorText: { color: colors.illoTertiary, marginBottom: 12 },
  infoBox: {
    backgroundColor: colors.button,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
