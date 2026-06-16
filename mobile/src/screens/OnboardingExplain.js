import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

function Lantern() {
  // Ramadan lantern using the illustration palette.
  const stroke = { stroke: colors.illoStroke, strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  return (
    <Svg width={140} height={170} viewBox="0 0 140 170">
      {/* Crescent + star backdrop */}
      <Path d="M30 14 a14 14 0 1 0 0 16 a10 10 0 1 1 0 -16 Z" fill={colors.illoSecondary} {...stroke} />
      <Path d="M105 18 l3 6 6 1 -4 5 1 7 -6 -3 -6 3 1 -7 -4 -5 6 -1 Z" fill={colors.illoTertiary} {...stroke} />
      {/* Hanger */}
      <Path d="M70 32 V40 M55 40 H85" {...stroke} />
      {/* Lantern top cap */}
      <Path d="M55 40 L70 50 L85 40 Z" fill={colors.illoHighlight} {...stroke} />
      {/* Lantern body */}
      <Path d="M50 52 L90 52 L88 110 L52 110 Z" fill={colors.illoMain} {...stroke} />
      {/* Inner glow */}
      <Rect x="60" y="62" width="20" height="40" rx="4" fill={colors.illoHighlight} {...stroke} />
      {/* Flame */}
      <Path d="M70 70 C66 76 66 82 70 86 C74 82 74 76 70 70 Z" fill={colors.illoTertiary} {...stroke} />
      {/* Lantern base */}
      <Path d="M48 112 L92 112 L88 122 L52 122 Z" fill={colors.illoSecondary} {...stroke} />
      <Path d="M62 124 L78 124 L78 132 L62 132 Z" fill={colors.illoHighlight} {...stroke} />
    </Svg>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.tick}>
        <Svg width={12} height={12} viewBox="0 0 24 24">
          <Path d="M5 12 L10 17 L19 7" stroke={colors.buttonText} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </View>
      <Text style={[type.body, { color: colors.headline, flex: 1 }]}>{children}</Text>
    </View>
  );
}

export default function OnboardingExplain({ navigation }) {
  return (
    <Screen
      footer={(
        <Button
          label="Continue"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
        />
      )}
    >
      <View style={styles.heroWrap}>
        <Lantern />
      </View>
      <Text style={[type.h1, styles.title]}>Here’s how it works</Text>
      <View style={styles.bullets}>
        <Bullet>Ramadan lasts 30 days</Bullet>
        <Bullet>You’ll track your goals daily</Bullet>
        <Bullet>Your goals will be locked once Ramadan begins</Bullet>
        <Bullet>Stay consistent and get closer to Allah every day</Bullet>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroWrap: { alignItems: 'center', marginTop: 12, marginBottom: 18 },
  title: { color: colors.headline, textAlign: 'center', marginBottom: 24 },
  bullets: { paddingHorizontal: 4 },
  bullet: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tick: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.button,
    alignItems: 'center', justifyContent: 'center', marginRight: 12, marginTop: 2,
  },
});
