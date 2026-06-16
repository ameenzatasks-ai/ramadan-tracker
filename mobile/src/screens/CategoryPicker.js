import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Screen } from '../components/Screen';
import { Header } from '../components/Header';
import { CategoryIcon } from '../components/CategoryIcon';
import { colors } from '../theme/colors';
import { type } from '../theme/type';
import { CATEGORIES } from '../data/goalLibrary';

export default function CategoryPicker({ navigation }) {
  return (
    <Screen>
      <Header navigation={navigation} title="Choose a category" />
      <Text style={[type.body, styles.intro]}>
        Pick a category to see example goals and add them to your list.
      </Text>
      <View style={styles.grid}>
        {CATEGORIES.map((item) => (
          <Pressable
            key={item.key}
            onPress={() => navigation.navigate('CategoryGoals', { category: item.key })}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [styles.tile, pressed && { opacity: 0.85 }]}
          >
            <CategoryIcon category={item.key} size={64} />
            <Text style={[type.bodyStrong, styles.tileLabel]}>{item.label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { color: colors.paragraph, marginBottom: 14 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  tileLabel: {
    color: colors.headline,
    marginTop: 10,
    textAlign: 'center',
  },
});
