import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

export function Eyebrow({ children, style }) {
  return <Text style={[type.eyebrow, styles.eyebrow, style]}>{children}</Text>;
}

export function SectionTitle({ eyebrow, title, body, style }) {
  return (
    <View style={[styles.wrap, style]}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? <Text style={[type.h1, styles.title]}>{title}</Text> : null}
      {body ? <Text style={[type.body, styles.body]}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  eyebrow: {
    color: colors.button,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: { color: colors.headline },
  body: { color: colors.paragraph, marginTop: 8 },
});
