import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

export function Checkbox({ checked, onToggle, label, sublabel, disabled }) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Text style={styles.check}>✓</Text> : null}
      </View>
      <View style={styles.textWrap}>
        <Text style={[type.body, styles.label, checked && styles.labelChecked]}>{label}</Text>
        {sublabel ? <Text style={[type.small, styles.sublabel]}>{sublabel}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  box: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.paragraph,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 1,
  },
  boxChecked: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  check: { color: colors.buttonText, fontWeight: '900', fontSize: 16, lineHeight: 16 },
  textWrap: { flex: 1 },
  label: { color: colors.headline },
  labelChecked: { color: colors.headline, fontWeight: '600' },
  sublabel: { color: colors.paragraph, marginTop: 2 },
});
