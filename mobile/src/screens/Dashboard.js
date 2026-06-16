import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { useProfiles } from '../context/ProfileContext';

// Dashboard = today-only view. Goals are sorted by progress (incomplete first),
// not grouped by category. Tap to toggle, stays on screen. Done returns to dashboard
// — which is here — so on the dashboard "Done" is replaced by a Goals overview link
// per the navigation spec (Back -> Goals Overview, Home -> Dashboard).

export default function Dashboard({ navigation }) {
  const { active, profiles } = useProfiles();
  const [data, setData] = useState({ day: 1, isLive: false, entries: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null);

  const load = useCallback(async () => {
    try {
      const fresh = await api.today();
      setData(fresh);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load today.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onToggle = async (entry) => {
    setToggling(entry.dayId);
    // Optimistic flip so the UI doesn't lurch.
    setData((curr) => ({
      ...curr,
      entries: curr.entries.map((e) => e.dayId === entry.dayId ? { ...e, completed: !e.completed } : e),
    }));
    try {
      await api.toggleDay(entry.dayId);
    } catch (e) {
      // Revert on failure.
      setData((curr) => ({
        ...curr,
        entries: curr.entries.map((x) => x.dayId === entry.dayId ? { ...x, completed: !x.completed } : x),
      }));
    } finally {
      setToggling(null);
    }
  };

  const sorted = [...data.entries].sort((a, b) => {
    if (a.completed === b.completed) return a.goalId - b.goalId;
    return a.completed ? 1 : -1;
  });
  const remaining = data.entries.filter((e) => !e.completed).length;
  const total = data.entries.length;

  return (
    <Screen
      footer={(
        <View>
          <Button label="Done" onPress={() => navigation.navigate('Dashboard')} />
          <View style={{ height: 10 }} />
          <Button label="View all my goals" variant="ghost" onPress={() => navigation.navigate('GoalsOverview')} />
        </View>
      )}
    >
      <Header
        navigation={navigation}
        title={data.isLive ? `Day ${data.day} of 30` : 'Before Ramadan begins'}
        subtitle={active ? active.displayName : null}
        showBack={false}
        rightSlot={(
          <Pressable onPress={() => navigation.navigate('Settings')} hitSlop={10} accessibilityLabel="Settings">
            <Text style={styles.gear}>Settings</Text>
          </Pressable>
        )}
      />
      {profiles.length > 1 ? (
        <Pressable
          onPress={() => navigation.navigate('ProfilePicker')}
          style={({ pressed }) => [styles.switcher, pressed && { opacity: 0.85 }]}
        >
          <Text style={[type.small, { color: colors.paragraph }]}>Switch profile</Text>
        </Pressable>
      ) : null}

      {loading ? (
        <ActivityIndicator color={colors.paragraph} style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={[type.body, { color: colors.illoTertiary, marginTop: 16 }]}>{error}</Text>
      ) : total === 0 ? (
        <View style={styles.empty}>
          <Text style={[type.h1, { color: colors.headline, textAlign: 'center' }]}>No goals yet</Text>
          <Text style={[type.body, { color: colors.paragraph, textAlign: 'center', marginTop: 8 }]}>
            Add goals from the six categories — or write your own — to start your Ramadan tracker.
          </Text>
          <View style={{ height: 16 }} />
          <Button label="Set up goals" onPress={() => navigation.navigate('GoalsOverview')} />
        </View>
      ) : (
        <>
          <View style={styles.dayCard}>
            <Text style={[type.bodyStrong, { color: colors.buttonText }]}>
              {remaining === 0 ? 'All today’s goals complete' : `${remaining} of ${total} to go today`}
            </Text>
            <Text style={[type.small, { color: colors.buttonText, marginTop: 2 }]}>
              {data.isLive ? 'Today’s goals only — yesterday is closed, tomorrow opens at Fajr.' : 'Preview of Day 1. Tracking goes live when Ramadan begins.'}
            </Text>
          </View>
          <FlatList
            data={sorted}
            keyExtractor={(e) => String(e.dayId)}
            refreshControl={<RefreshControl tintColor={colors.paragraph} refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => onToggle(item)}
                disabled={toggling === item.dayId}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.completed }}
                accessibilityLabel={item.goalTitle}
                style={({ pressed }) => [
                  styles.entry,
                  item.completed && styles.entryDone,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <View style={styles.entryHead}>
                  <View style={[styles.box, item.completed && styles.boxChecked]}>
                    {item.completed ? <Text style={styles.check}>✓</Text> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.bodyStrong, item.completed ? styles.titleDone : styles.title]}>
                      {item.goalTitle}
                    </Text>
                    <Text style={[type.small, styles.body]}>{item.description}</Text>
                  </View>
                  <CategoryIcon category={item.category} size={36} />
                </View>
              </Pressable>
            )}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gear: { color: colors.button, fontSize: 13, fontWeight: '800' },
  switcher: { alignSelf: 'flex-end', marginBottom: 8 },
  empty: { padding: 24, marginTop: 30 },
  dayCard: { backgroundColor: colors.button, borderRadius: 8, padding: 14, marginBottom: 12 },
  entry: {
    backgroundColor: colors.surface, borderRadius: 8, padding: 14,
    borderWidth: 1, borderColor: colors.divider, marginBottom: 10,
  },
  entryDone: { borderColor: colors.button, backgroundColor: colors.surfaceWarm },
  entryHead: { flexDirection: 'row', alignItems: 'flex-start' },
  box: {
    width: 26, height: 26, borderRadius: 6, borderWidth: 2, borderColor: colors.paragraph,
    marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.button, borderColor: colors.button },
  check: { color: colors.buttonText, fontWeight: '900', fontSize: 16, lineHeight: 16 },
  title: { color: colors.headline },
  titleDone: { color: colors.paragraph, textDecorationLine: 'line-through' },
  body: { color: colors.paragraph, marginTop: 4 },
});
