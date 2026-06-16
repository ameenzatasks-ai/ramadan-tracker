import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

function NavIcon({ name }) {
  if (name === 'back') {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path d="M15 5 L8 12 L15 19" stroke={colors.headline} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24">
      <Path d="M3 12 L12 4 L21 12" stroke={colors.headline} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6 11 V20 H10 V15 H14 V20 H18 V11" stroke={colors.headline} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function Header({ navigation, title, subtitle, showBack = true, showHome = true, rightSlot }) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
              else navigation.navigate('GoalsOverview');
            }}
            hitSlop={12}
            accessibilityLabel="Back"
            style={styles.iconButton}
          >
            <NavIcon name="back" />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        <Text style={[type.h2, styles.title]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[type.small, styles.subtitle]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.side}>
        {rightSlot ? rightSlot : (showHome ? (
          <Pressable
            onPress={() => navigation.navigate('Home')}
            hitSlop={12}
            accessibilityLabel="Home"
            style={styles.iconButton}
          >
            <NavIcon name="home" />
          </Pressable>
        ) : null)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    marginBottom: 14,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center' },
  title: { color: colors.headline, textAlign: 'center' },
  subtitle: { color: colors.paragraph, textAlign: 'center', marginTop: 2 },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
  },
});
