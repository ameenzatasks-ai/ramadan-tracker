import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

export function Card({ children, onPress, style, selected = false }) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          selected && styles.selected,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.card, selected && styles.selected, style]}>
      {children}
    </View>
  );
}

export function CardTitle({ children, style }) {
  return <Text style={[type.bodyStrong, { color: colors.headline }, style]}>{children}</Text>;
}

export function CardBody({ children, style }) {
  return <Text style={[type.small, { color: colors.paragraph, marginTop: 4 }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  selected: {
    borderColor: colors.button,
    backgroundColor: colors.surfaceWarm,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
});
