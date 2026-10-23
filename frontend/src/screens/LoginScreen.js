import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLogin = () => {
    if (!nombreUsuario.trim() || !contraseña.trim()) {
      Alert.alert('Aviso', 'Por favor ingresa usuario y contraseña');
      return;
    }

    // Simulación de inicio de sesión: se guarda el usuario en el contexto global.
    login({
      nombreUsuario: nombreUsuario.trim(),
      rol: 'Administrador',
      email: `${nombreUsuario.trim().toLowerCase()}@clinica.com`,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="medical" size={48} color="#2ec4b6" />
        </View>
      </View>

      <Text style={styles.header}>Clínica Pediátrica</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        placeholderTextColor="#a0aec0"
        autoCapitalize="none"
        autoCorrect={false}
        value={nombreUsuario}
        onChangeText={setNombreUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#a0aec0"
        secureTextEntry
        value={contraseña}
        onChangeText={setContraseña}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        Demo: ingresa cualquier usuario y contraseña
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6fffa',
    borderWidth: 2,
    borderColor: '#b2f5ea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0284c7',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 44,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#38bdf8',
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  hint: {
    marginTop: 18,
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default LoginScreen;
