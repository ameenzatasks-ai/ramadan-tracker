import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  RefreshControl, ActivityIndicator, Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { CategoryIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { easeStandard, easeCompletion, durations } from '../theme/motion';

export default function DayTracker({ navigation }) {
  const reduceMotion = useReduceMotion();
  const [data, setData] = useState({ day: 1, isLive: false, entries: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toggling, setToggling] = useState(null);

  // Stagger: only animate the list on the very first load
  const hasAnimatedRef = useRef(false);
  // Per-item animation values keyed by dayId
  const itemAnims = useRef(new Map());
  // Done button: shown after first toggle
  const doneShownRef = useRef(false);
  const doneButtonY = useRef(new Animated.Value(12)).current;
  const doneButtonOpacity = useRef(new Animated.Value(0)).current;
  const doneBtnScale = useRef(new Animated.Value(1)).current;
  // Screen fade on Done tap
  const screenOpacity = useRef(new Animated.Value(1)).current;

  function getItemAnim(dayId) {
    if (!itemAnims.current.has(dayId)) {
      // Items created before initial stagger start hidden; items added after appear immediately
      const alreadyLoaded = hasAnimatedRef.current;
      itemAnims.current.set(dayId, {
        opacity: new Animated.Value(alreadyLoaded ? 1 : 0),
        translateY: new Animated.Value(alreadyLoaded ? 0 : 6),
        checkScale: new Animated.Value(1),
        glowOpacity: new Animated.Value(0),
        glowScale: new Animated.Value(1),
      });
    }
    return itemAnims.current.get(dayId);
  }

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

  useFocusEffect(useCallback(() => {
    screenOpacity.setValue(1);
    load();
  }, [load]));

  // Stagger items in on first data arrival only
  useEffect(() => {
    if (hasAnimatedRef.current || data.entries.length === 0 || loading) return;

    const sorted = [...data.entries].sort((a, b) =>
      a.completed === b.completed ? a.goalId - b.goalId : a.completed ? 1 : -1
    );

    // Create anim values while hasAnimatedRef is still false → they start hidden
    sorted.forEach((entry) => getItemAnim(entry.dayId));
    hasAnimatedRef.current = true;

    if (reduceMotion) {
      sorted.forEach((entry) => {
        const anim = itemAnims.current.get(entry.dayId);
        anim.opacity.setValue(1);
        anim.translateY.setValue(0);
      });
      return;
    }

    sorted.forEach((entry, idx) => {
      const anim = itemAnims.current.get(entry.dayId);
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: durations.goalEntry,
          delay: idx * durations.goalStagger,
          easing: easeStandard,
          useNativeDriver: true,
        }),
        Animated.timing(anim.translateY, {
          toValue: 0,
          duration: durations.goalEntry,
          delay: idx * durations.goalStagger,
          easing: easeStandard,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [data.entries, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const onToggle = async (entry) => {
    const completing = !entry.completed;

    // Checkbox animation on completion only
    if (completing && !reduceMotion) {
      const anim = getItemAnim(entry.dayId);

      // Phase 1: brief scale depress → spring back (140ms)
      Animated.sequence([
        Animated.timing(anim.checkScale, { toValue: 0.92, duration: 0, useNativeDriver: true }),
        Animated.timing(anim.checkScale, {
          toValue: 1.0,
          duration: durations.togglePhase1,
          easing: easeCompletion,
          useNativeDriver: true,
        }),
      ]).start();

      // Phase 2: glow ring expands and dissolves (starts 60ms after phase 1)
      setTimeout(() => {
        const a = getItemAnim(entry.dayId);
        a.glowScale.setValue(1);
        Animated.sequence([
          Animated.timing(a.glowOpacity, { toValue: 0.35, duration: 0, useNativeDriver: true }),
          Animated.parallel([
            Animated.timing(a.glowScale, {
              toValue: 1.6,
              duration: durations.togglePhase2,
              easing: easeStandard,
              useNativeDriver: true,
            }),
            Animated.timing(a.glowOpacity, {
              toValue: 0,
              duration: durations.togglePhase2,
              easing: easeStandard,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, 60);
    }

    // Reveal Done button after the very first toggle
    if (!doneShownRef.current) {
      doneShownRef.current = true;
      if (!reduceMotion) {
        Animated.parallel([
          Animated.timing(doneButtonY, {
            toValue: 0,
            duration: durations.doneButtonIn,
            easing: easeStandard,
            useNativeDriver: true,
          }),
          Animated.timing(doneButtonOpacity, {
            toValue: 1,
            duration: durations.doneButtonIn,
            easing: easeStandard,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        doneButtonOpacity.setValue(1);
        doneButtonY.setValue(0);
      }
    }

    // Optimistic toggle
    setToggling(entry.dayId);
    setData((curr) => ({
      ...curr,
      entries: curr.entries.map((e) =>
        e.dayId === entry.dayId ? { ...e, completed: !e.completed } : e
      ),
    }));
    try {
      await api.toggleDay(entry.dayId);
    } catch {
      setData((curr) => ({
        ...curr,
        entries: curr.entries.map((x) =>
          x.dayId === entry.dayId ? { ...x, completed: !x.completed } : x
        ),
      }));
    } finally {
      setToggling(null);
    }
  };

  const onDone = () => {
    if (reduceMotion) {
      navigation.navigate('Home');
      return;
    }
    // Brief button depress
    Animated.sequence([
      Animated.timing(doneBtnScale, {
        toValue: 0.98,
        duration: 80,
        easing: easeCompletion,
        useNativeDriver: true,
      }),
      Animated.timing(doneBtnScale, {
        toValue: 1.0,
        duration: 80,
        easing: easeStandard,
        useNativeDriver: true,
      }),
    ]).start();
    // Screen fades out then navigate
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: durations.doneTap,
      easing: easeStandard,
      useNativeDriver: true,
    }).start(() => navigation.navigate('Home'));
  };

  const sorted = [...data.entries].sort((a, b) =>
    a.completed === b.completed ? a.goalId - b.goalId : a.completed ? 1 : -1
  );
  const remaining = data.entries.filter((e) => !e.completed).length;
  const total = data.entries.length;

  return (
    <Animated.View style={{ flex: 1, opacity: screenOpacity }}>
      <Screen
        footer={(
          <Animated.View
            pointerEvents={doneShownRef.current ? 'auto' : 'none'}
            style={{ opacity: doneButtonOpacity, transform: [{ translateY: doneButtonY }] }}
          >
            <Animated.View style={{ transform: [{ scale: doneBtnScale }] }}>
              <Button label="Done" onPress={onDone} />
            </Animated.View>
          </Animated.View>
        )}
      >
        <Header
          navigation={navigation}
          title={`Ramadan Day ${data.day}`}
          subtitle="Today's goals"
        />
        {loading ? (
          <ActivityIndicator color={colors.paragraph} style={{ marginTop: 24 }} />
        ) : error ? (
          <Text style={[type.body, { color: colors.illoTertiary, marginTop: 16 }]}>{error}</Text>
        ) : total === 0 ? (
          <Text style={[type.body, { color: colors.paragraph }]}>
            You have no goals yet for this day. Add some from the Goals tab.
          </Text>
        ) : (
          <>
            <View style={styles.dayCard}>
              <Text style={[type.bodyStrong, { color: colors.buttonText }]}>
                {remaining === 0
                  ? 'All goals complete for today'
                  : `${remaining} of ${total} remaining`}
              </Text>
            </View>
            <ScrollView
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  tintColor={colors.paragraph}
                  refreshing={refreshing}
                  onRefresh={() => { setRefreshing(true); load(); }}
                />
              }
            >
              {sorted.map((item) => {
                const anim = getItemAnim(item.dayId);
                return (
                  <Animated.View
                    key={item.dayId}
                    style={{
                      opacity: anim.opacity,
                      transform: [{ translateY: anim.translateY }],
                      marginBottom: 10,
                    }}
                  >
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
                        <View style={styles.checkboxContainer}>
                          {/* Glow ring: expands and dissolves on completion */}
                          <Animated.View
                            style={[styles.glowRing, {
                              opacity: anim.glowOpacity,
                              transform: [{ scale: anim.glowScale }],
                            }]}
                          />
                          <Animated.View
                            style={[
                              styles.box,
                              item.completed && styles.boxChecked,
                              { transform: [{ scale: anim.checkScale }] },
                            ]}
                          >
                            {item.completed ? <Text style={styles.check}>✓</Text> : null}
                          </Animated.View>
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
                  </Animated.View>
                );
              })}
              <View style={{ height: 16 }} />
            </ScrollView>
          </>
        )}
      </Screen>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dayCard: {
    backgroundColor: colors.button, borderRadius: 8, padding: 14, marginBottom: 12,
  },
  entry: {
    backgroundColor: colors.surface, borderRadius: 8, padding: 14,
    borderWidth: 1, borderColor: colors.divider,
  },
  entryDone: { borderColor: colors.button, backgroundColor: colors.surfaceWarm },
  entryHead: { flexDirection: 'row', alignItems: 'flex-start' },
  checkboxContainer: {
    width: 30, height: 30, marginRight: 12, marginTop: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute', left: 0, top: 0,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.button,
  },
  box: {
    width: 26, height: 26, borderRadius: 6, borderWidth: 2, borderColor: colors.paragraph,
    alignItems: 'center', justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.button, borderColor: colors.button },
  check: { color: colors.buttonText, fontWeight: '900', fontSize: 16, lineHeight: 16 },
  title: { color: colors.headline },
  titleDone: { color: colors.paragraph, textDecorationLine: 'line-through' },
  body: { color: colors.paragraph, marginTop: 4 },
});
