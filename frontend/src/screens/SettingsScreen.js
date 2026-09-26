import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const SettingsScreen = ({ onBack, onLogout }) => {
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
        if (onLogout) {
          onLogout();
        } else if (onBack) {
          onBack();
        }
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
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Configuración</Text>

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
  backButton: {
    marginHorizontal: 20,
    marginBottom: 10,
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
  container: {
    paddingHorizontal: 25,
    paddingBottom: 30,
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
