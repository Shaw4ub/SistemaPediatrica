import React from 'react';
import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme';

const variants = {
  primary: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
    textColor: '#ffffff',
    iconColor: '#ffffff',
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
};

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

const styles = StyleSheet.create({
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
