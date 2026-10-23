import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme';

/**
 * Construye la paleta de cada variante a partir de los colores del tema.
 * En modo oscuro el botón primario invierte el contraste para mantener
 * legibilidad sobre el azul claro de la paleta oscura.
 */
const getVariants = (colors, isDark) => ({
  primary: {
    backgroundColor: isDark ? colors.primary : colors.primaryDark,
    borderColor: isDark ? colors.primary : colors.primaryDark,
    textColor: isDark ? '#082f49' : '#ffffff',
    iconColor: isDark ? '#082f49' : '#ffffff',
  },
  soft: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primarySoft,
    textColor: colors.primaryDeep,
    iconColor: colors.primaryDeep,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.borderStrong,
    textColor: colors.textSecondary,
    iconColor: colors.textSecondary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: colors.primaryDark,
    iconColor: colors.primaryDark,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.dangerSoft,
    textColor: colors.danger,
    iconColor: colors.danger,
  },
});

/**
 * Botón reutilizable con variantes de color e ícono opcional.
 */
const AppButton = ({
  title,
  onPress,
  icon,
  iconRight,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const variants = useMemo(
    () => getVariants(colors, isDark),
    [colors, isDark]
  );

  const palette = variants[variant] || variants.primary;
  const isSmall = size === 'sm';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isSmall && styles.small,
        {
          backgroundColor: palette.backgroundColor,
          borderColor: palette.borderColor,
        },
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={palette.iconColor} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={isSmall ? 15 : 18}
              color={palette.iconColor}
              style={styles.leftIcon}
            />
          ) : null}
          <Text
            style={[
              styles.text,
              isSmall && styles.textSmall,
              { color: palette.textColor },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {iconRight ? (
            <Ionicons
              name={iconRight}
              size={isSmall ? 15 : 17}
              color={palette.iconColor}
              style={styles.rightIcon}
            />
          ) : null}
        </>
      )}
    </Pressable>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    base: {
      minHeight: 46,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    small: {
      minHeight: 36,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    fullWidth: {
      width: '100%',
    },
    disabled: {
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
    text: {
      fontSize: 15,
      fontWeight: '700',
    },
    textSmall: {
      fontSize: 13,
    },
    leftIcon: {
      marginRight: 8,
    },
    rightIcon: {
      marginLeft: 8,
    },
  });

export default AppButton;
