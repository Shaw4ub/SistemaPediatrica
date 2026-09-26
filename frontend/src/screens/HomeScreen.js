import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const HomeScreen = ({ onNavigate, onLogout }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido a la Clínica Pediátrica</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate && onNavigate('profile')}
      >
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate && onNavigate('settings')}
      >
        <Text style={styles.buttonText}>Configuración</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate && onNavigate('appointments')}
      >
        <Text style={styles.buttonText}>Citas</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate && onNavigate('medical-history')}
      >
        <Text style={styles.buttonText}>Historial Médico</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onNavigate && onNavigate('user-interface')}
      >
        <Text style={styles.buttonText}>Gestión de Pacientes</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={() => onLogout && onLogout()}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 35,
    color: '#4a5568',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#b91c1c',
    paddingVertical: 13,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#991b1b',
    marginTop: 10,
  },
  spacer: {
    height: 14,
  },
});

export default HomeScreen;
