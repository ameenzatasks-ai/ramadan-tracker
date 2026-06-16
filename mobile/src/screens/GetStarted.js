import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type, fonts } from '../theme/type';
import { spacing, radius } from '../theme/spacing';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../lib/google';
import { api } from '../lib/api';

function Crescent() {
  return (
    <Svg width={220} height={220} viewBox="0 0 220 220">
      <Path d="M110 26 C77 36 52 67 52 106 C52 153 90 191 137 191 C154 191 170 186 183 177 C171 196 150 208 126 208 C75 208 34 167 34 116 C34 66 74 26 124 26 C119 25 114 25 110 26 Z" fill={colors.illoHighlight} />
      <Path d="M141 34 C108 44 83 75 83 114 C83 153 110 185 147 194 C94 201 47 160 47 107 C47 59 86 20 134 20 C137 20 139 20 141 34 Z" fill={colors.backgroundAlt} />
      <Circle cx="64" cy="46" r="3" fill={colors.illoSecondary} />
      <Circle cx="180" cy="70" r="2.5" fill={colors.illoMain} />
      <Circle cx="42" cy="152" r="2.5" fill={colors.illoHighlight} />
      <Path d="M160 120 l5 10 11 2 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -2 Z" fill={colors.illoSecondary} stroke={colors.illoStroke} strokeWidth={2} strokeLinejoin="round" />
      <Rect x="28" y="178" width="164" height="12" rx="6" fill="rgba(255,250,240,0.12)" />
    </Svg>
  );
}

export default function GetStarted({ navigation }) {
  const reduceMotion = useReduceMotion();
  const float = useRef(new Animated.Value(0)).current;
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const { signIn } = useAuth();

  const { request: googleRequest, response: googleResponse, promptAsync: googlePrompt } = useGoogleAuth();

  // Handle Google sign-in response. The id-token flow returns the JWT in
  // response.params.id_token (some versions also expose authentication.idToken).
  React.useEffect(() => {
    if (googleResponse?.type === 'success') {
      const idToken =
        googleResponse.params?.id_token || googleResponse.authentication?.idToken;
      if (idToken) handleGoogleSignIn(idToken);
      else console.error('[google sign-in] no id_token in response');
    }
  }, [googleResponse]);

  const handleGoogleSignIn = async (idToken) => {
    try {
      setGoogleLoading(true);
      const result = await api.google(idToken);
      await signIn(result.token, result.user);
      // Navigation happens automatically via AuthContext in the Gate component
    } catch (err) {
      console.error('[google sign-in]', err.message);
      // TODO: show error toast
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2600, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [float, reduceMotion]);

  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });

  return (
    <Screen>
      <View style={styles.body}>
        <Animated.View style={[styles.art, { transform: [{ translateY }] }]}>
          <Crescent />
        </Animated.View>
        <Text style={[type.eyebrow, styles.eyebrow]}>Thirty days, one beautiful rhythm</Text>
        <Text style={[type.display, styles.title]}>Ramadan Goal Companion</Text>
        <Text style={[type.body, styles.subtitle]}>
          Build a calmer daily practice for prayer, Quran, charity, family, dhikr, and dua.
        </Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>30</Text>
            <Text style={styles.statLabel}>days</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>paths</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>focus</Text>
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button
          label={googleLoading ? 'Signing in...' : 'Sign in with Google'}
          onPress={() => googlePrompt()}
          disabled={!googleRequest || googleLoading}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.sm },
  art: { marginBottom: spacing.md },
  eyebrow: { color: colors.button, textAlign: 'center', textTransform: 'uppercase', marginBottom: spacing.md },
  title: { color: colors.headline, textAlign: 'center', marginBottom: spacing.md },
  subtitle: { color: colors.paragraph, textAlign: 'center', maxWidth: 330 },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xxl },
  stat: {
    width: 88,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
  },
  statNumber: { color: colors.headline, fontFamily: fonts.display, fontSize: 24, lineHeight: 28 },
  statLabel: {
    color: colors.muted, fontFamily: fonts.semibold, fontSize: 11,
    marginTop: spacing.xs, letterSpacing: 1, textTransform: 'uppercase',
  },
  buttons: { paddingBottom: spacing.sm },
});
