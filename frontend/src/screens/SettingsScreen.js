import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = ({ route }) => {
  const { user, logout } = useAuth();
  const settingsOptions = [
    {
      id: '1',
      title: 'Editar Perfil',
      icon: <Ionicons name="person" size={20} color="#fff" />,
      color: '#3498db',
      action: () => Alert.alert('Configuración', 'Editar Perfil seleccionado'),
    },
    {
      id: '2',
      title: 'Notificaciones',
      icon: <Ionicons name="notifications" size={20} color="#fff" />,
      color: '#3498db',
      action: () => Alert.alert('Configuración', 'Notificaciones seleccionadas'),
    },
    {
      id: '3',
      title: 'Preferencias de Tema',
      icon: <Ionicons name="color-palette" size={20} color="#fff" />,
      color: '#3498db',
      action: () => Alert.alert('Configuración', 'Preferencias de Tema'),
    },
    {
      id: '4',
      title: 'Idioma',
      icon: <Ionicons name="language" size={20} color="#fff" />,
      color: '#3498db',
      action: () => Alert.alert('Configuración', 'Idioma seleccionado'),
    },
    {
      id: '5',
      title: 'Cambiar Contraseña',
      icon: <Ionicons name="lock-closed" size={20} color="#fff" />,
      color: '#3498db',
      action: () => Alert.alert('Configuración', 'Cambiar Contraseña'),
    },
    {
      id: '6',
      title: 'Acerca de la Aplicación',
      icon: <Ionicons name="information-circle" size={20} color="#fff" />,
      color: '#3498db',
      action: () => Alert.alert('Clínica Pediátrica', 'Versión 1.0.0 - Sistema de Gestión'),
    },
    {
      id: '7',
      title: 'Cerrar Sesión',
      icon: <Ionicons name="log-out" size={20} color="#fff" />,
      color: '#3498db',
      action: () => {
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
      },
    },
    {
      id: '8',
      title: 'Eliminar Cuenta',
      icon: <Ionicons name="trash" size={20} color="#fff" />,
      color: '#e74c3c',
      action: () => Alert.alert('Eliminar Cuenta', 'Esta acción no se puede deshacer.'),
    },
  ];

  return (
    <View style={styles.screenWrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Configuración</Text>

        <Text style={styles.sessionText}>
          Usuario en sesión: {user?.nombreUsuario}
        </Text>
        {route.params?.desde && (
          <Text style={styles.paramText}>
            Accedido desde: {route.params.desde}
          </Text>
        )}

        <View style={styles.optionsContainer}>
          {settingsOptions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.optionButton,
                { backgroundColor: item.color },
              ]}
              onPress={item.action}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text style={styles.optionText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  sessionText: {
    fontSize: 13,
    color: '#0369a1',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  paramText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 15,
  },
  container: {
    paddingHorizontal: 25,
    paddingBottom: 30,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: 25,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  optionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default SettingsScreen;
