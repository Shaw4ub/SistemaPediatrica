import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

/**
 * Estado vacío amigable para listados sin resultados.
 */
const EmptyState = ({
  icon = 'file-tray-outline',
  title = 'Sin información',
  message = 'Aún no hay elementos para mostrar.',
  action,
}) => (
  <View style={styles.container}>
    <View style={styles.iconCircle}>
      <Ionicons name={icon} size={34} color={colors.primaryDark} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    {action ? <View style={styles.action}>{action}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.xs,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    textAlign: 'center',
  },
  action: {
    marginTop: spacing.lg,
  },
});

export default EmptyState;
