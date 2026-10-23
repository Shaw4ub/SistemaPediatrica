import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme';

/**
 * Encabezado de pantalla reutilizable para listados y detalles.
 * Se usa cuando el header nativo queda oculto.
 */
const ScreenHeader = ({ eyebrow, title, subtitle, icon, right }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );

  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right ||
        (icon ? (
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={22} color={colors.primaryDark} />
          </View>
        ) : null)}
    </View>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.lg,
    },
    textWrap: {
      flex: 1,
      paddingRight: spacing.md,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.primaryDark,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 13,
      color: colors.muted,
    },
    iconWrap: {
      width: 46,
      height: 46,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default ScreenHeader;
