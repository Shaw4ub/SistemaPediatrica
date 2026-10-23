import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, shadows, spacing } from '../theme';

/**
 * Tarjeta blanca base. Si recibe `onPress` se vuelve interactiva.
 */
const AppCard = ({ children, style, onPress, padded = true }) => {
  const content = (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  padded: {
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
});

export default AppCard;
