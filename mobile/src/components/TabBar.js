import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

function Icon({ name, color }) {
  const p = { stroke: color, strokeWidth: 2, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Path d="M3 12 L12 4 L21 12" {...p} />
          <Path d="M5 11 V20 H10 V14 H14 V20 H19 V11" {...p} />
        </Svg>
      );
    case 'progress':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Rect x="4" y="13" width="3.5" height="7" {...p} />
          <Rect x="10.25" y="9" width="3.5" height="11" {...p} />
          <Rect x="16.5" y="5" width="3.5" height="15" {...p} />
        </Svg>
      );
    case 'goals':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Rect x="4" y="4" width="16" height="16" rx="3" {...p} />
          <Path d="M8 12 L11 15 L17 9" {...p} />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Circle cx="12" cy="9" r="4" {...p} />
          <Path d="M4 21 C4 16 7 13 12 13 C17 13 20 16 20 21" {...p} />
        </Svg>
      );
    default:
      return null;
  }
}

const TABS = [
  { route: 'Home',          label: 'Home',     icon: 'home' },
  { route: 'Progress',      label: 'Progress', icon: 'progress' },
  { route: 'GoalsOverview', label: 'Goals',    icon: 'goals' },
  { route: 'Profile',       label: 'Profile',  icon: 'profile' },
];

export function TabBar({ current }) {
  const navigation = useNavigation();
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const active = t.route === current;
        const color = active ? colors.button : colors.paragraph;
        return (
          <Pressable
            key={t.route}
            onPress={() => navigation.navigate(t.route)}
            accessibilityRole="button"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: active }}
            style={({ pressed }) => [styles.tab, pressed && { opacity: 0.7 }]}
          >
            <View style={[styles.activeRail, active && styles.activeRailOn]} />
            <Icon name={t.icon} color={color} />
            <Text style={[type.small, { color, marginTop: 4 }]}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 4 : 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6, position: 'relative' },
  activeRail: {
    position: 'absolute',
    top: -8,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  activeRailOn: { backgroundColor: colors.button },
});
