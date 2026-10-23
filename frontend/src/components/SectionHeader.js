import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../theme';

/**
 * Encabezado de sección con acción opcional a la derecha.
 */
const SectionHeader = ({ title, subtitle, actionLabel, onAction, style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>

    {actionLabel ? (
      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12.5,
    color: colors.muted,
  },
  action: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default SectionHeader;
