import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme';

/**
 * Fila de detalle con ícono, etiqueta y valor.
 */
const InfoRow = ({ icon, label, value, last = false }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );

  return (
    <View style={[styles.row, last && styles.lastRow]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={17} color={colors.primaryDark} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '—'}</Text>
      </View>
    </View>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    iconWrap: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    content: {
      flex: 1,
    },
    label: {
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.muted,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    value: {
      marginTop: 3,
      fontSize: 14.5,
      lineHeight: 20,
      color: colors.text,
      fontWeight: '500',
    },
  });

export default InfoRow;
