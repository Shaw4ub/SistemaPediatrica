import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import AppCard from '../components/AppCard';
import Avatar from '../components/Avatar';
import { colors, radius, spacing } from '../theme';

const SettingRow = ({
  icon,
  iconColor = colors.primaryDark,
  iconBackground = colors.primarySoft,
  title,
  subtitle,
  onPress,
  right,
  danger = false,
  last = false,
}) => {
  const content = (
    <>
      <View style={[styles.iconWrap, { backgroundColor: iconBackground }]}>
        <Ionicons name={icon} size={19} color={iconColor} />
      </View>
      <View style={styles.rowInfo}>
        <Text style={[styles.rowTitle, danger && styles.rowTitleDanger]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {right ||
        (onPress ? (
          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.borderStrong}
          />
        ) : null)}
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, last && styles.lastRow]}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        last && styles.lastRow,
        pressed && styles.pressed,
      ]}
    >
      {content}
    </Pressable>
  );
};

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sounds, setSounds] = useState(false);

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

  const handleDeleteAccount = () => {
    const remove = () => {
      logout();
    };

    if (Platform.OS === 'web') {
      const accepted =
        typeof globalThis.confirm === 'function'
          ? globalThis.confirm(
              'Eliminar cuenta\n\nEsta acción cerrará tu sesión y no se puede deshacer.'
            )
          : true;
      if (accepted) remove();
      return;
    }

    Alert.alert(
      'Eliminar cuenta',
      'Esta acción cerrará tu sesión y no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: remove },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <Avatar name={user?.nombreUsuario} size={54} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.nombreUsuario}</Text>
          <Text style={styles.profileRole}>{user?.rol}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar perfil"
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'PerfilTab',
              params: { screen: 'EditProfile' },
            })
          }
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="create-outline" size={19} color={colors.primaryDeep} />
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>Preferencias</Text>
      <AppCard style={styles.card}>
        <SettingRow
          icon="notifications-outline"
          title="Notificaciones push"
          subtitle="Avisos de nuevas citas y mensajes"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.borderStrong, true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
        />
        <SettingRow
          icon="alarm-outline"
          title="Recordatorios de citas"
          subtitle="Avisar 24 horas antes de cada cita"
          iconColor="#b45309"
          iconBackground={colors.amberSoft}
          right={
            <Switch
              value={reminders}
              onValueChange={setReminders}
              trackColor={{ false: colors.borderStrong, true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
        />
        <SettingRow
          icon="volume-medium-outline"
          title="Sonidos de la app"
          subtitle="Reproducir sonido al confirmar acciones"
          iconColor={colors.purple}
          iconBackground={colors.purpleSoft}
          right={
            <Switch
              value={sounds}
              onValueChange={setSounds}
              trackColor={{ false: colors.borderStrong, true: colors.primary }}
              thumbColor="#ffffff"
            />
          }
          last
        />
      </AppCard>

      <Text style={styles.sectionLabel}>Cuenta y seguridad</Text>
      <AppCard style={styles.card}>
        <SettingRow
          icon="person-outline"
          title="Editar perfil"
          subtitle="Nombre, correo y teléfono"
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'PerfilTab',
              params: { screen: 'EditProfile' },
            })
          }
        />
        <SettingRow
          icon="lock-closed-outline"
          title="Cambiar contraseña"
          subtitle="Actualiza tu clave de acceso"
          iconColor="#b45309"
          iconBackground={colors.amberSoft}
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <SettingRow
          icon="language-outline"
          title="Idioma"
          subtitle="Español (predeterminado)"
          iconColor={colors.purple}
          iconBackground={colors.purpleSoft}
          onPress={() =>
            Alert.alert(
              'Idioma',
              'La aplicación está configurada en español.'
            )
          }
        />
        <SettingRow
          icon="notifications-circle-outline"
          title="Centro de notificaciones"
          subtitle="Revisa los avisos recientes"
          onPress={() =>
            navigation.navigate('Tabs', {
              screen: 'InicioTab',
              params: { screen: 'Notifications' },
            })
          }
          last
        />
      </AppCard>

      <Text style={styles.sectionLabel}>Información</Text>
      <AppCard style={styles.card}>
        <SettingRow
          icon="help-circle-outline"
          title="Ayuda y soporte"
          subtitle="Preguntas frecuentes y contacto"
          onPress={() => navigation.navigate('Help')}
        />
        <SettingRow
          icon="information-circle-outline"
          title="Acerca de la aplicación"
          subtitle="Versión, equipo y funcionalidades"
          onPress={() => navigation.navigate('About')}
          last
        />
      </AppCard>

      <Text style={styles.sectionLabel}>Sesión</Text>
      <AppCard style={styles.card}>
        <SettingRow
          icon="log-out-outline"
          title="Cerrar sesión"
          subtitle="Finaliza tu sesión de forma segura"
          iconColor={colors.danger}
          iconBackground={colors.dangerSoft}
          onPress={handleLogout}
          danger
        />
        <SettingRow
          icon="trash-outline"
          title="Eliminar cuenta"
          subtitle="Esta acción no se puede deshacer"
          iconColor={colors.danger}
          iconBackground={colors.dangerSoft}
          onPress={handleDeleteAccount}
          danger
          last
        />
      </AppCard>

      <Text style={styles.version}>
        Clínica Pediátrica · Versión 1.0.0
      </Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  profileRole: {
    marginTop: 1,
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  profileEmail: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.subtle,
  },
  card: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  rowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  rowTitleDanger: {
    color: colors.danger,
  },
  rowSubtitle: {
    marginTop: 1,
    fontSize: 11,
    color: colors.muted,
  },
  pressed: {
    opacity: 0.7,
  },
  version: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    fontSize: 10.5,
    color: colors.subtle,
  },
});

export default SettingsScreen;
