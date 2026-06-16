import React from 'react';
import { View, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { AmbientBackground } from './AmbientBackground';

export function Screen({ children, scroll = false, padded = true, footer }) {
  const inner = (
    <View style={[styles.inner, padded && styles.padded]}>
      {children}
    </View>
  );
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AmbientBackground />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {inner}
          </ScrollView>
        ) : (
          inner
        )}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  inner: { flex: 1 },
  padded: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.xxxl },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxl : spacing.lg,
    backgroundColor: 'rgba(12, 38, 35, 0.92)',
    borderTopColor: colors.divider,
    borderTopWidth: 1,
  },
});
