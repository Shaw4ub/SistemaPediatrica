import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme';

/**
 * Muestra el nombre del usuario logueado en el encabezado de todas las
 * pantallas. Lee la información desde el contexto global (Context API).
 */
const UserBadge = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={20} color={colors.primaryDark} />
      <Text style={styles.name} numberOfLines={1}>
        {user.nombreUsuario}
      </Text>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: radius.pill,
      maxWidth: 170,
      marginRight: 10,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    name: {
      marginLeft: 5,
      fontSize: 12,
      fontWeight: '700',
      color: colors.primaryDeep,
      flexShrink: 1,
    },
  });

export default UserBadge;
