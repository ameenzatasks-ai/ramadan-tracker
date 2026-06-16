import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { type } from '../theme/type';

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize = 'none', autoCorrect = false, error, maxLength, returnKeyType, onSubmitEditing, textContentType }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[type.smallStrong, styles.label]}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(201,216,204,0.55)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        textContentType={textContentType}
      />
      {error ? <Text style={[type.small, styles.errorText]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { color: colors.paragraph, marginBottom: 6 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.headline,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.divider,
    minHeight: 50,
  },
  inputError: { borderColor: colors.rose },
  errorText: { color: colors.rose, marginTop: 6 },
});
