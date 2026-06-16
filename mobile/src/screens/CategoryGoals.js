import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Checkbox } from '../components/Checkbox';
import { CategoryIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { CATEGORIES, getExamples, getAllForCategory } from '../data/goalLibrary';
import { useProfiles } from '../context/ProfileContext';

export default function CategoryGoals({ route, navigation }) {
  const category = route?.params?.category;
  const cat = CATEGORIES.find((c) => c.key === category);
  const { active } = useProfiles();
  const profileType = active?.profileType || 'adult';

  const [examples, setExamples] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [existingTitles, setExistingTitles] = useState(new Set());
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);

  // Initial load: existing goals on this profile, plus 4-5 examples for the category.
  useEffect(() => {
    (async () => {
      try {
        const data = await api.listGoals();
        const sameCat = data.goals.filter((g) => g.category === category).map((g) => g.title);
        setExistingTitles(new Set(sameCat));
      } catch {
        // non-fatal
      }
    })();
    setExamples(getExamples(profileType, category, active?.id ?? 0));
  }, [active?.id, profileType, category]);

  const visibleList = useMemo(() => {
    if (showAll) return getAllForCategory(profileType, category);
    return examples;
  }, [showAll, examples, profileType, category]);

  const toggle = useCallback((title) => {
    setSelected((curr) => {
      const next = new Set(curr);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  }, []);

  const onGenerate = async () => {
    if (selected.size === 0) {
      Alert.alert('Choose goals', 'Select at least one goal to add.');
      return;
    }
    setSubmitting(true);
    try {
      for (const title of selected) {
        if (existingTitles.has(title)) continue;
        // eslint-disable-next-line no-await-in-loop
        await api.addGoal(category, title, 'library');
      }
      navigation.navigate('GoalsOverview');
    } catch (e) {
      Alert.alert('Could not add', e instanceof ApiError ? e.message : 'Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen
      footer={(
        <View>
          <Button
            label={selected.size > 0 ? `Generate ${selected.size} goal${selected.size === 1 ? '' : 's'}` : 'Generate'}
            onPress={onGenerate}
            loading={submitting}
            disabled={selected.size === 0}
          />
          <View style={{ height: 10 }} />
          <Button
            label={showAll ? 'Show fewer examples' : 'Show all goals for this category'}
            variant="ghost"
            onPress={() => setShowAll((v) => !v)}
          />
        </View>
      )}
    >
      <Header navigation={navigation} title={cat?.label || 'Category'} />
      <View style={styles.head}>
        <CategoryIcon category={category} size={56} />
        <View style={styles.headText}>
          <Text style={[type.bodyStrong, { color: colors.headline }]}>{cat?.label}</Text>
          <Text style={[type.small, { color: colors.paragraph, marginTop: 4 }]}>{cat?.blurb}</Text>
        </View>
      </View>
      <Text style={[type.smallStrong, styles.subhead]}>Example goals — tap to select</Text>
      <FlatList
        data={visibleList}
        keyExtractor={(t) => t}
        contentContainerStyle={{ paddingBottom: 8 }}
        renderItem={({ item }) => {
          const already = existingTitles.has(item);
          return (
            <Checkbox
              label={item}
              sublabel={already ? 'Already on your list' : undefined}
              checked={selected.has(item) || already}
              onToggle={() => !already && toggle(item)}
              disabled={already}
            />
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surfaceCool, borderRadius: 8, padding: 14,
    borderWidth: 1, borderColor: colors.divider, marginBottom: 14,
  },
  headText: { flex: 1, marginLeft: 14 },
  subhead: { color: colors.paragraph, marginBottom: 10 },
});
