import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Perfil', screen: 'Profile', icon: 'person' },
  { label: 'Configuración', screen: 'Settings', icon: 'settings' },
  { label: 'Citas', screen: 'Appointments', icon: 'calendar' },
  { label: 'Historial Médico', screen: 'MedicalHistory', icon: 'document-text' },
  { label: 'Gestión de Pacientes', screen: 'UserInterface', icon: 'people' },
];

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

  const navigateTo = (screen) => {
    // Parámetros de navegación: la pantalla destino recibe el origen y el usuario.
    navigation.navigate(screen, {
      desde: 'Inicio',
      nombreUsuario: user?.nombreUsuario,
    });
  };

  const handleLogout = () => {
    // En web Alert no muestra botones de confirmación, así que se cierra directo.
    if (Platform.OS === 'web') {
      logout();
      return;
    }

    Alert.alert('Cerrar sesión', '¿Deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeCard}>
        <Ionicons name="person-circle" size={54} color="#0284c7" />
        <Text style={styles.welcomeLabel}>Sesión iniciada como</Text>
        <Text style={styles.userName}>{user?.nombreUsuario}</Text>
        <Text style={styles.userRole}>{user?.rol}</Text>
      </View>

      <Text style={styles.title}>Bienvenido a la Clínica Pediátrica</Text>

      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.screen}
          style={styles.button}
          onPress={() => navigateTo(item.screen)}
        >
          <Ionicons
            name={item.icon}
            size={18}
            color="#fff"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out"
          size={18}
          color="#fff"
          style={styles.buttonIcon}
        />
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
  welcomeCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  welcomeLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748b',
  },
  userName: {
    marginTop: 2,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  userRole: {
    marginTop: 2,
    fontSize: 13,
    color: '#0284c7',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#4a5568',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#b91c1c',
    paddingVertical: 13,
    borderRadius: 8,
    width: '80%',
    maxWidth: 380,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#991b1b',
    marginTop: 6,
  },
});

export default HomeScreen;
