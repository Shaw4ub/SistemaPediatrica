import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme';

/**
 * Insignia de estado de una cita u otro registro.
 * Los colores se recalculan con el tema activo.
 */
const StatusBadge = ({ status = 'pendiente', style }) => {
  const { colors } = useTheme();

  const statusMap = useMemo(
    () => ({
      confirmada: {
        label: 'Confirmada',
        bg: colors.successSoft,
        color: colors.success,
      },
      pendiente: {
        label: 'Pendiente',
        bg: colors.amberSoft,
        color: colors.amberText,
      },
      cancelada: {
        label: 'Cancelada',
        bg: colors.dangerSoft,
        color: colors.danger,
      },
      completada: {
        label: 'Completada',
        bg: colors.primarySoft,
        color: colors.primaryDeep,
      },
    }),
    [colors]
  );

  const config = statusMap[status] || statusMap.pendiente;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});

export default StatusBadge;
