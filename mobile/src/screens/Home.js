import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { TabBar } from '../components/TabBar';
import { colors } from '../theme/colors';
import { type, fonts } from '../theme/type';
import { spacing, radius } from '../theme/spacing';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useProfiles } from '../context/ProfileContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { easeStandard, durations } from '../theme/motion';

export default function Home({ navigation }) {
  const { user } = useAuth();
  const { active } = useProfiles();
  const reduceMotion = useReduceMotion();
  const [data, setData] = useState({ day: 1, isLive: false, entries: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (reduceMotion) return;
    Animated.sequence([
      Animated.timing(cardPulse, {
        toValue: 1.025,
        duration: durations.dayCardPulse,
        easing: easeStandard,
        useNativeDriver: true,
      }),
      Animated.timing(cardPulse, {
        toValue: 1,
        duration: durations.dayCardPulse,
        easing: easeStandard,
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async () => {
    try {
      const fresh = await api.today();
      setData(fresh);
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load today.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const greetingName = active?.displayName || user?.fullName || 'friend';
  const remaining = data.entries.filter((e) => !e.completed).length;
  const total = data.entries.length;
  const progress = Math.max(1, (data.day / 30) * 370);

  return (
    <Screen footer={<TabBar current="Home" />}>
      <View style={styles.head}>
        <Text style={[type.eyebrow, styles.eyebrow]}>Assalamu alaikum</Text>
        <Text style={[type.h1, styles.greeting]}>{greetingName}</Text>
        <Text style={[type.body, styles.lede]}>A gentle plan for today, held one action at a time.</Text>
      </View>

      <Animated.View style={[styles.dayCard, { transform: [{ scale: cardPulse }] }]}>
        <View style={styles.ringWrap}>
          <Svg width={150} height={150} viewBox="0 0 150 150">
            <Circle cx="75" cy="75" r="59" stroke="rgba(22,32,24,0.14)" strokeWidth={16} fill="none" />
            <Circle
              cx="75"
              cy="75"
              r="59"
              stroke={colors.buttonText}
              strokeOpacity={0.24}
              strokeWidth={16}
              fill="none"
              strokeDasharray={`${progress} 370`}
              strokeLinecap="round"
              rotation="-90"
              origin="75,75"
            />
          </Svg>
          <View style={styles.dayCenter}>
            <Text style={[type.smallStrong, styles.dayKicker]}>
              Ramadan day
            </Text>
            <Text style={styles.dayNumber}>{data.day}</Text>
            <Text style={styles.dayTotal}>of 30</Text>
          </View>
        </View>
      </Animated.View>

      {loading ? (
        <ActivityIndicator color={colors.paragraph} style={{ marginTop: 16 }} />
      ) : error ? (
        <Text style={[type.body, { color: colors.rose }]}>{error}</Text>
      ) : total === 0 ? (
        <View style={styles.empty}>
          <Text style={[type.bodyStrong, { color: colors.headline, textAlign: 'center' }]}>
            No goals yet
          </Text>
          <Text style={[type.body, { color: colors.paragraph, textAlign: 'center', marginTop: 6 }]}>
            Add a goal from the six categories to begin your Ramadan tracker.
          </Text>
          <View style={{ height: 16 }} />
          <Button label="Set up goals" onPress={() => navigation.navigate('GoalsOverview')} />
        </View>
      ) : (
        <View style={styles.todayPanel}>
          <Text style={[type.smallStrong, styles.todayHead]}>TODAY'S GOALS</Text>
          <Text style={[type.body, styles.todayCount]}>
            {remaining === 0
              ? "All today's goals complete"
              : `You have ${remaining} of ${total} goal${total === 1 ? '' : 's'} remaining`}
          </Text>
          <Button label="View today's goals" onPress={() => navigation.navigate('DayTracker')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { marginBottom: spacing.xxl },
  eyebrow: { color: colors.button, textTransform: 'uppercase' },
  greeting: { color: colors.headline, marginTop: spacing.sm },
  lede: { color: colors.paragraph, marginTop: spacing.sm },
  dayCard: {
    backgroundColor: colors.button,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.xxl,
    shadowColor: colors.button,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  ringWrap: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumber: {
    color: colors.buttonText,
    fontFamily: fonts.displayBold,
    fontSize: 58,
    lineHeight: 64,
  },
  dayKicker: {
    color: colors.buttonText,
    opacity: 0.72,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dayTotal: {
    color: colors.buttonText,
    fontFamily: fonts.semibold,
    opacity: 0.72,
    fontSize: 13,
  },
  empty: { padding: spacing.md, marginTop: spacing.sm },
  todayPanel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  todayHead: { color: colors.button, letterSpacing: 1, marginBottom: spacing.sm },
  todayCount: { color: colors.headline, marginBottom: spacing.lg },
});
