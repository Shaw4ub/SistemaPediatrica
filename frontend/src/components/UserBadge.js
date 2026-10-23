import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

/**
 * Muestra el nombre del usuario logueado en el encabezado de todas las
 * pantallas. Lee la información desde el contexto global (Context API).
 */
const UserBadge = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Ionicons name="person-circle" size={20} color="#0284c7" />
      <Text style={styles.name} numberOfLines={1}>
        {user.nombreUsuario}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    maxWidth: 170,
    marginRight: 8,
  },
  name: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
    flexShrink: 1,
  },
});

export default UserBadge;
