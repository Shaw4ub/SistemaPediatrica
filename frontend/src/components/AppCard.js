import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius, shadows, spacing } from '../theme';

/**
 * Tarjeta base. Si recibe `onPress` se vuelve interactiva.
 * El color de superficie cambia automáticamente con el tema global.
 */
const AppCard = ({ children, style, onPress, padded = true }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );

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

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
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
