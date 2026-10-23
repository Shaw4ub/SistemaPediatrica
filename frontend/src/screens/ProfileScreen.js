import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = ({ route }) => {
  const { user } = useAuth();
  // Parámetro de navegación enviado desde HomeScreen.
  const [profileType, setProfileType] = useState(
    route.params?.perfilInicial || 'admin'
  ); // 'admin', 'usuario', 'paciente'

  return (
    <View style={styles.screenWrapper}>
      {route.params?.desde && (
        <Text style={styles.paramText}>
          Accedido desde: {route.params.desde}
        </Text>
      )}

      {/* Selector de tipo de perfil para visualizar los diferentes ejemplos de la guía */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, profileType === 'admin' && styles.activeTab]}
          onPress={() => setProfileType('admin')}
        >
          <Text
            style={[
              styles.tabText,
              profileType === 'admin' && styles.activeTabText,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, profileType === 'usuario' && styles.activeTab]}
          onPress={() => setProfileType('usuario')}
        >
          <Text
            style={[
              styles.tabText,
              profileType === 'usuario' && styles.activeTabText,
            ]}
          >
            Médico
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, profileType === 'paciente' && styles.activeTab]}
          onPress={() => setProfileType('paciente')}
        >
          <Text
            style={[
              styles.tabText,
              profileType === 'paciente' && styles.activeTabText,
            ]}
          >
            Paciente
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {profileType === 'admin' && (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={90} color="#0284c7" />
            </View>
            <Text style={styles.profileTitle}>Perfil del Administrador</Text>

            <View style={styles.infoRow}>
              <FontAwesome name="user" size={18} color="#0284c7" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Nombre: </Text>
                {user?.nombreUsuario || 'Lito López'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="admin-panel-settings" size={18} color="#0284c7" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Rol: </Text>
                {user?.rol || 'Administrador'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail" size={18} color="#0284c7" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Correo: </Text>
                {user?.email || 'lito.lopez@clinica.com'}
              </Text>
            </View>
          </View>
        )}

        {profileType === 'usuario' && (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="medical" size={70} color="#0d9488" />
            </View>
            <Text style={[styles.profileTitle, { color: '#0d9488' }]}>
              Perfil del Usuario
            </Text>

            <View style={styles.infoRow}>
              <FontAwesome name="user-md" size={18} color="#0d9488" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Nombre: </Text>
                {user?.nombreUsuario || 'Dr. Lito López'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <MaterialIcons name="local-hospital" size={18} color="#0d9488" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Especialidad: </Text>
                Pediatría
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="mail" size={18} color="#0d9488" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Correo: </Text>
                {user?.email || 'lito.lopez@clinica.com'}
              </Text>
            </View>
          </View>
        )}

        {profileType === 'paciente' && (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="happy" size={75} color="#e11d48" />
            </View>
            <Text style={[styles.profileTitle, { color: '#e11d48' }]}>
              Perfil del Paciente
            </Text>

            <View style={styles.infoRow}>
              <FontAwesome name="user" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Nombre: </Text>
                María Pérez
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Edad: </Text>
                7 años
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="heart" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Condición: </Text>
                Asma
              </Text>
            </View>

            <Text style={styles.sectionHeader}>Información del Responsable</Text>

            <View style={styles.infoRow}>
              <FontAwesome name="user" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Nombre: </Text>
                José Pérez
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="call" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Teléfono: </Text>
                +503 7213 7890
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="people" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Relación: </Text>
                Padre
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Ionicons name="person-circle" size={18} color="#e11d48" style={styles.icon} />
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Registrado por: </Text>
                {user?.nombreUsuario || 'Invitado'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 15,
  },
  paramText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284c7',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e11d48',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  icon: {
    width: 28,
    textAlign: 'center',
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    flex: 1,
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
});

export default ProfileScreen;
