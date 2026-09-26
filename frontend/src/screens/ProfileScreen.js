import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProfileScreen = ({ user, onBack }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Perfil de Usuario</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nombre de Usuario:</Text>
        <Text style={styles.value}>{user?.nombreUsuario || 'Administrador'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Rol:</Text>
        <Text style={styles.value}>{user?.rol || 'Admin'}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'admin@clinica.com'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f7fa',
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 17,
    color: '#1e293b',
    fontWeight: '500',
  },
});

export default ProfileScreen;
