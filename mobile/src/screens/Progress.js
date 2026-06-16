import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { TabBar } from '../components/TabBar';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';

// 30 days, one row each — current day expanded, others collapsed.
// No percentages or cumulative summaries: each day stands alone.
export default function Progress({ navigation }) {
  const [data, setData] = useState({ day: 1, isLive: false, entries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const fresh = await api.today();
      setData(fresh);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const total = data.entries.length;
  const remaining = data.entries.filter((e) => !e.completed).length;

  // Build a 30-cell list. The current day is the one returned by the API.
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <Screen padded footer={<TabBar current="Progress" />}>
      <Header navigation={navigation} title="Progress" showBack={false} showHome={false} />
      <Text style={[type.body, { color: colors.paragraph, marginBottom: 14 }]}>
        Each day stands on its own. Tap today to see its goals.
      </Text>
      {loading ? (
        <ActivityIndicator color={colors.paragraph} />
      ) : error ? (
        <Text style={[type.body, { color: colors.illoTertiary }]}>{error}</Text>
      ) : (
        <FlatList
          data={days}
          keyExtractor={(n) => String(n)}
          contentContainerStyle={{ paddingBottom: 12 }}
          renderItem={({ item }) => {
            const isCurrent = item === data.day;
            return (
              <Pressable
                onPress={() => isCurrent && navigation.navigate('DayTracker')}
                disabled={!isCurrent}
                style={[styles.row, isCurrent && styles.rowCurrent, item < data.day && styles.rowPast]}
              >
                <View style={[styles.bullet, isCurrent && styles.bulletCurrent]}>
                  <Text style={[styles.bulletText, isCurrent && styles.bulletTextCurrent]}>{item}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodyStrong, { color: colors.headline }]}>
                    Day {item}{isCurrent ? ' — today' : ''}
                  </Text>
                  <Text style={[type.small, { color: colors.paragraph, marginTop: 2 }]}>
                    {isCurrent
                      ? (total === 0
                          ? 'No goals set yet'
                          : `${total - remaining} of ${total} done so far`)
                      : (item < data.day ? 'Past' : 'Upcoming')}
                  </Text>
                </View>
                {isCurrent ? <Text style={styles.arrow}>›</Text> : null}
              </Pressable>
            );
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, padding: 12, borderRadius: 8,
    borderWidth: 1, borderColor: colors.divider, marginBottom: 8,
  },
  rowCurrent: { borderColor: colors.button, backgroundColor: colors.surfaceWarm },
  rowPast: { opacity: 0.72 },
  bullet: {
    width: 36, height: 36, borderRadius: 10, marginRight: 12,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.divider,
    alignItems: 'center', justifyContent: 'center',
  },
  bulletCurrent: { backgroundColor: colors.button, borderColor: colors.button },
  bulletText: { color: colors.paragraph, fontWeight: '700' },
  bulletTextCurrent: { color: colors.buttonText },
  arrow: { color: colors.button, fontSize: 22 },
});
