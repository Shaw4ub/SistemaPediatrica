import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import Avatar from '../components/Avatar';
import InfoRow from '../components/InfoRow';
import { colors, radius, shadows, spacing } from '../theme';

const segments = [
  { key: 'admin', label: 'Admin' },
  { key: 'medico', label: 'Médico' },
  { key: 'paciente', label: 'Paciente' },
];

const ActionRow = ({ icon, title, subtitle, onPress, danger = false }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.actionRow, pressed && styles.pressed]}
  >
    <View
      style={[
        styles.actionIcon,
        { backgroundColor: danger ? colors.dangerSoft : colors.primarySoft },
      ]}
    >
      <Ionicons
        name={icon}
        size={19}
        color={danger ? colors.danger : colors.primaryDark}
      />
    </View>
    <View style={styles.actionInfo}>
      <Text style={[styles.actionTitle, danger && styles.actionTitleDanger]}>
        {title}
      </Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons
      name="chevron-forward"
      size={17}
      color={colors.borderStrong}
    />
  </Pressable>
);

const ProfileScreen = ({ navigation, route }) => {
  const { user, logout } = useAuth();
  const { patients, appointments, records } = useClinic();
  const [profileType, setProfileType] = useState(
    route.params?.perfilInicial || 'admin'
  );

  const samplePatient = patients[0];

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      logout();
      return;
    }

    Alert.alert('Cerrar sesión', '¿Deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {route.params?.desde ? (
        <View style={styles.originChip}>
          <Ionicons
            name="navigate-outline"
            size={12}
            color={colors.primaryDark}
          />
          <Text style={styles.originText}>
            Accedido desde: {route.params.desde}
          </Text>
        </View>
      ) : null}

      <View style={styles.heroCard}>
        <LinearGradient
          colors={['#e0f2fe', '#f0f9ff']}
          style={styles.heroBanner}
        >
          <View style={styles.heroCircle} />
          <Avatar name={user?.nombreUsuario} size={76} />
          <Text style={styles.name}>{user?.nombreUsuario || 'Invitado'}</Text>
          <View style={styles.roleChip}>
            <Ionicons
              name="shield-checkmark"
              size={12}
              color={colors.primaryDeep}
            />
            <Text style={styles.roleText}>{user?.rol || 'Usuario'}</Text>
          </View>
          <Text style={styles.email}>{user?.email || 'Sin correo registrado'}</Text>

          <AppButton
            title="Editar perfil"
            icon="create-outline"
            size="sm"
            variant="soft"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          />
        </LinearGradient>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{patients.length}</Text>
            <Text style={styles.statLabel}>Pacientes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Citas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{records.length}</Text>
            <Text style={styles.statLabel}>Registros</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Vista del perfil</Text>
      <View style={styles.segmented}>
        {segments.map((segment) => {
          const active = profileType === segment.key;

          return (
            <Pressable
              key={segment.key}
              onPress={() => setProfileType(segment.key)}
              style={[styles.segment, active && styles.segmentActive]}
            >
              <Text
                style={[
                  styles.segmentText,
                  active && styles.segmentTextActive,
                ]}
              >
                {segment.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {profileType === 'admin' ? (
        <AppCard style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="Nombre"
            value={user?.nombreUsuario || 'Lito López'}
          />
          <InfoRow
            icon="shield-checkmark-outline"
            label="Rol"
            value={user?.rol || 'Administrador'}
          />
          <InfoRow
            icon="mail-outline"
            label="Correo"
            value={user?.email || 'lito.lopez@clinica.com'}
          />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={user?.telefono || '+503 7000 0000'}
            last
          />
        </AppCard>
      ) : null}

      {profileType === 'medico' ? (
        <AppCard style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="Nombre"
            value={user?.nombreUsuario || 'Dr. Lito López'}
          />
          <InfoRow
            icon="medkit-outline"
            label="Especialidad"
            value="Pediatría"
          />
          <InfoRow
            icon="mail-outline"
            label="Correo"
            value={user?.email || 'lito.lopez@clinica.com'}
          />
          <InfoRow
            icon="ribbon-outline"
            label="Turno"
            value="Matutino · Consulta externa"
            last
          />
        </AppCard>
      ) : null}

      {profileType === 'paciente' ? (
        <AppCard style={styles.card}>
          <InfoRow
            icon="happy-outline"
            label="Paciente"
            value={samplePatient?.nombre || 'María Pérez'}
          />
          <InfoRow
            icon="calendar-outline"
            label="Edad"
            value={samplePatient ? `${samplePatient.edad} años` : '7 años'}
          />
          <InfoRow
            icon="pulse-outline"
            label="Condición"
            value={samplePatient?.condicion || 'Asma'}
          />
          <InfoRow
            icon="people-outline"
            label="Responsable"
            value={samplePatient?.tutor || 'José Pérez'}
          />
          <InfoRow
            icon="call-outline"
            label="Teléfono"
            value={samplePatient?.telefono || '+503 7213 7890'}
          />
          <InfoRow
            icon="person-circle-outline"
            label="Registrado por"
            value={user?.nombreUsuario || 'Invitado'}
            last
          />
        </AppCard>
      ) : null}

      <Text style={styles.sectionTitle}>Cuenta</Text>
      <AppCard style={styles.actionsCard}>
        <ActionRow
          icon="settings-outline"
          title="Configuración"
          subtitle="Notificaciones, idioma y preferencias"
          onPress={() => navigation.navigate('Settings')}
        />
        <View style={styles.actionDivider} />
        <ActionRow
          icon="lock-closed-outline"
          title="Cambiar contraseña"
          subtitle="Actualiza tu clave de acceso"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <View style={styles.actionDivider} />
        <ActionRow
          icon="help-circle-outline"
          title="Ayuda"
          subtitle="Preguntas frecuentes y contacto"
          onPress={() => navigation.navigate('Help')}
        />
        <View style={styles.actionDivider} />
        <ActionRow
          icon="log-out-outline"
          title="Cerrar sesión"
          subtitle="Finaliza tu sesión de forma segura"
          onPress={handleLogout}
          danger
        />
      </AppCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  originChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
  },
  originText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.primaryDeep,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  heroBanner: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  heroCircle: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(14,165,233,0.08)',
    top: -80,
    right: -50,
  },
  name: {
    marginTop: spacing.md,
    fontSize: 21,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: colors.primarySoft,
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.primaryDeep,
  },
  email: {
    marginTop: spacing.sm,
    fontSize: 12.5,
    color: colors.muted,
  },
  editButton: {
    marginTop: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDeep,
  },
  statLabel: {
    marginTop: 1,
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.muted,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: '#e8eff7',
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  segmentTextActive: {
    color: colors.primaryDeep,
  },
  card: {
    paddingVertical: spacing.xs,
  },
  actionsCard: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  actionTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  actionTitleDanger: {
    color: colors.danger,
  },
  actionSubtitle: {
    marginTop: 1,
    fontSize: 11,
    color: colors.muted,
  },
  actionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 50,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ProfileScreen;
