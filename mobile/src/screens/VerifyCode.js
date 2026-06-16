import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Animated } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { easeStandard, durations } from '../theme/motion';

const CELLS = 6;

export default function VerifyCode({ route, navigation }) {
  const email = route?.params?.email || '';
  const { signIn } = useAuth();
  const reduceMotion = useReduceMotion();
  const [digits, setDigits] = useState(Array(CELLS).fill(''));
  const inputs = useRef([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  // Per-cell border glow animation (useNativeDriver: false — borderColor)
  const focusAnims = useRef(
    Array.from({ length: CELLS }, () => new Animated.Value(0))
  ).current;
  // Horizontal shake on error (useNativeDriver: true — transform)
  const shakeX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onCellFocus = (i) => {
    if (reduceMotion) return;
    focusAnims.forEach((anim, j) => {
      Animated.timing(anim, {
        toValue: j === i ? 1 : 0,
        duration: durations.focusGlow,
        easing: easeStandard,
        useNativeDriver: false,
      }).start();
    });
  };

  const onCellBlur = () => {
    if (reduceMotion) return;
    focusAnims.forEach((anim) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: durations.focusGlow,
        easing: easeStandard,
        useNativeDriver: false,
      }).start();
    });
  };

  const shake = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 4, duration: 48, easing: easeStandard, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -4, duration: 48, easing: easeStandard, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 4, duration: 48, easing: easeStandard, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -4, duration: 48, easing: easeStandard, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 48, easing: easeStandard, useNativeDriver: true }),
    ]).start();
  };

  const setErrorAndShake = (msg) => {
    setError(msg);
    if (msg && !reduceMotion) shake();
  };

  const setDigit = (i, val) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 1);
    setDigits((curr) => {
      const next = [...curr];
      next[i] = cleaned;
      return next;
    });
    if (cleaned && i < CELLS - 1) {
      setTimeout(() => inputs.current[i + 1]?.focus(), 0);
    }
  };

  const onKey = (i, e) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const code = digits.join('');
    if (code.length < CELLS) {
      setErrorAndShake('Enter the 6-digit code from your email.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await api.verify(email, code);
      await signIn(token, user);
    } catch (e) {
      setErrorAndShake(e instanceof ApiError ? e.message : 'Unable to verify code.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setResendNotice(null);
    setError(null);
    try {
      await api.resend(email);
      setResendNotice('A fresh code has been sent.');
      setCooldown(30);
    } catch (e) {
      setErrorAndShake(e instanceof ApiError ? e.message : 'Unable to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen>
      <Header navigation={navigation} title="Verify your email" showHome={false} />
      <Text style={[type.body, styles.intro]}>
        Enter the 6-digit code sent to <Text style={styles.email}>{email}</Text>.
      </Text>
      <Animated.View style={[styles.cells, { transform: [{ translateX: shakeX }] }]}>
        {digits.map((d, i) => (
          <Animated.View
            key={i}
            style={[
              styles.cellOuter,
              {
                borderColor: focusAnims[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [colors.divider, colors.button],
                }),
              },
            ]}
          >
            <TextInput
              ref={(r) => (inputs.current[i] = r)}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              onKeyPress={(e) => onKey(i, e)}
              onFocus={() => onCellFocus(i)}
              onBlur={onCellBlur}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.cellInput}
              textAlign="center"
              autoFocus={i === 0}
              returnKeyType="next"
            />
          </Animated.View>
        ))}
      </Animated.View>
      {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
      {resendNotice ? <Text style={[type.small, styles.noticeText]}>{resendNotice}</Text> : null}
      <Button label="Verify and continue" onPress={onSubmit} loading={loading} />
      <View style={{ height: 14 }} />
      <Pressable onPress={onResend} disabled={cooldown > 0 || resending} hitSlop={10}>
        <Text style={[type.small, styles.resend, (cooldown > 0 || resending) && styles.resendDisabled]}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : (resending ? 'Sending…' : 'Resend code')}
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 22 },
  email: { color: colors.headline, fontWeight: '600' },
  cells: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
  cellOuter: {
    width: 46, height: 56, borderRadius: 8,
    borderWidth: 1,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  cellInput: {
    width: '100%', height: '100%',
    color: colors.headline, fontSize: 24, fontWeight: '700',
    textAlign: 'center',
  },
  errorText: { color: colors.illoTertiary, marginBottom: 12 },
  noticeText: { color: colors.illoSecondary, marginBottom: 12 },
  resend: { color: colors.button, textAlign: 'center', fontSize: 14, fontWeight: '600' },
  resendDisabled: { color: colors.paragraph, opacity: 0.7 },
});
