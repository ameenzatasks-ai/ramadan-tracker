import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Card, CardTitle, CardBody } from '../components/Card';
import { CategoryIcon } from '../components/CategoryIcon';
import { TabBar } from '../components/TabBar';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { CATEGORIES } from '../data/goalLibrary';

const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));
CAT_LABEL.custom = 'Custom';

export default function GoalsOverview({ navigation }) {
  const [goals, setGoals] = useState([]);
  const [locked, setLocked] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await api.listGoals();
      setGoals(data.goals);
      setLocked(!!data.locked);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load goals.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onDelete = (goal) => {
    Alert.alert(
      'Remove goal?',
      `"${goal.title}" will be removed from this profile.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive', onPress: async () => {
            try {
              await api.deleteGoal(goal.id);
              setGoals((curr) => curr.filter((g) => g.id !== goal.id));
            } catch (e) {
              Alert.alert('Could not remove', e?.message || 'Try again.');
            }
          },
        },
      ],
    );
  };

  return (
    <Screen footer={<TabBar current="GoalsOverview" />}>
      <Header navigation={navigation} title="Your Ramadan goals" showBack={false} showHome={false} />
      <Text style={[type.body, styles.lede]}>
        Shape the practices you want to carry through the month.
      </Text>
      {!locked ? (
        <View style={styles.actionsRow}>
          <Button label="Add from categories" onPress={() => navigation.navigate('CategoryPicker')} style={{ flex: 1, marginRight: 8 }} />
          <Button label="Create your own" variant="ghost" onPress={() => navigation.navigate('CustomGoal')} style={{ flex: 1, marginLeft: 8 }} />
        </View>
      ) : null}
      {locked ? (
        <View style={styles.lockBanner}>
          <Text style={[type.smallStrong, { color: colors.buttonText }]}>
            Ramadan has begun — goals are locked.
          </Text>
          <Text style={[type.small, { color: colors.buttonText, marginTop: 2 }]}>
            Focus on living them, day by day.
          </Text>
        </View>
      ) : null}
      {loading ? (
        <Text style={[type.body, styles.muted]}>Loading…</Text>
      ) : error ? (
        <Text style={[type.body, { color: colors.illoTertiary }]}>{error}</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(g) => String(g.id)}
          refreshControl={<RefreshControl tintColor={colors.paragraph} refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
          ListEmptyComponent={(
            <View style={styles.empty}>
              <Text style={[type.bodyStrong, { color: colors.headline, textAlign: 'center' }]}>No goals yet</Text>
              <Text style={[type.body, { color: colors.paragraph, textAlign: 'center', marginTop: 6 }]}>
                Pick a category below to choose your goals for Ramadan.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <Card onPress={!locked ? () => onDelete(item) : undefined} style={styles.goalCard}>
              <View style={styles.row}>
                <CategoryIcon category={item.category} size={44} />
                <View style={styles.rowText}>
                  <CardTitle>{item.title}</CardTitle>
                  <CardBody>{CAT_LABEL[item.category]} • {item.source === 'custom' ? 'Custom' : 'From library'}</CardBody>
                </View>
              </View>
              {!locked ? (
                <Text style={[type.small, { color: colors.paragraph, marginTop: 8 }]}>Tap to remove</Text>
              ) : null}
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  lede: { color: colors.paragraph, marginBottom: 14 },
  muted: { color: colors.paragraph },
  actionsRow: { flexDirection: 'row', marginBottom: 12 },
  lockBanner: {
    backgroundColor: colors.button, padding: 12, borderRadius: 8, marginBottom: 12,
  },
  empty: { padding: 24, alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowText: { flex: 1, marginLeft: 12 },
  goalCard: { backgroundColor: colors.surfaceCool },
});
