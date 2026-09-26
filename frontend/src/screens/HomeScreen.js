import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen = ({ onNavigate, onLogout }) => {
  return (
    <View style={styles.container}>
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
        style={[styles.button, styles.logoutButton]}
        onPress={() => onLogout && onLogout()}
      >
        <Text style={[styles.buttonText, styles.logoutText]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2c3e50',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    width: '75%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  logoutText: {
    color: '#e74c3c',
  },
  spacer: {
    height: 15,
  },
});

export default HomeScreen;
