import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

export function Button({ label, onPress, disabled, loading, variant = 'primary', style, accessibilityLabel }) {
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => [
        styles.base,
        isGhost && styles.ghost,
        isDanger && styles.danger,
        !isGhost && !isDanger && styles.primary,
        pressed && !isGhost && styles.primaryPressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? colors.headline : colors.buttonText} />
      ) : (
        <Text
          style={[
            type.button,
            isGhost ? styles.ghostText : (isDanger ? styles.dangerText : styles.primaryText),
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: colors.button,
    shadowColor: colors.button,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryPressed: { backgroundColor: colors.buttonPressed },
  primaryText: { color: colors.buttonText },
  ghost: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.dividerStrong,
  },
  ghostText: { color: colors.headline },
  danger: {
    backgroundColor: 'rgba(242,119,122,0.12)',
    borderWidth: 1.5,
    borderColor: colors.rose,
  },
  dangerText: { color: colors.rose },
  disabled: { opacity: 0.5 },
});
