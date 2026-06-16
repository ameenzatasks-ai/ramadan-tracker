import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { colors } from '../theme/colors';
import { useReduceMotion } from '../hooks/useReduceMotion';

export function AmbientBackground() {
  const reduceMotion = useReduceMotion();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 9000, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 9000, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift, reduceMotion]);

  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.backgroundAlt} />
            <Stop offset="0.52" stopColor={colors.background} />
            <Stop offset="1" stopColor={colors.ink} />
          </LinearGradient>
        </Defs>
        <Rect width="390" height="844" fill="url(#sky)" />
        <Path d="M-70 220 C50 120 150 170 230 88 C300 17 390 22 460 -22 L460 0 L-70 0 Z" fill="rgba(247,195,95,0.16)" />
        <Path d="M-60 770 C50 650 156 718 270 612 C332 554 398 562 460 506 L460 844 L-60 844 Z" fill="rgba(99,214,163,0.13)" />
        <Path d="M-20 540 C84 485 132 510 206 440 C270 380 328 386 414 312" stroke="rgba(255,250,240,0.09)" strokeWidth="34" fill="none" />
        <Path d="M43 142 h78 a39 39 0 0 1 39 39 v100 h-156 v-100 a39 39 0 0 1 39 -39 Z" fill="rgba(255,250,240,0.035)" />
        <Path d="M248 92 h82 a41 41 0 0 1 41 41 v132 h-164 v-132 a41 41 0 0 1 41 -41 Z" fill="rgba(255,250,240,0.033)" />
        <Path d="M196 610 h96 a48 48 0 0 1 48 48 v150 h-192 v-150 a48 48 0 0 1 48 -48 Z" fill="rgba(255,250,240,0.028)" />
      </Svg>
      <Animated.View style={[styles.sparkleLayer, { transform: [{ translateY }] }]}>
        <Svg width="100%" height="100%" viewBox="0 0 390 844" preserveAspectRatio="none">
          <Circle cx="62" cy="92" r="1.8" fill="rgba(255,250,240,0.72)" />
          <Circle cx="302" cy="64" r="1.3" fill="rgba(247,195,95,0.82)" />
          <Circle cx="344" cy="206" r="1.7" fill="rgba(255,250,240,0.62)" />
          <Circle cx="32" cy="410" r="1.4" fill="rgba(86,199,194,0.72)" />
          <Circle cx="318" cy="500" r="1.2" fill="rgba(255,250,240,0.58)" />
          <Circle cx="108" cy="710" r="1.6" fill="rgba(247,195,95,0.62)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sparkleLayer: StyleSheet.absoluteFillObject,
});
