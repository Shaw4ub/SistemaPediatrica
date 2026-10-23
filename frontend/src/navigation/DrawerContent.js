import React from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useClinic } from '../context/ClinicContext';
import Avatar from '../components/Avatar';
import {
  colors,
  drawerGradient,
  radius,
  spacing,
} from '../theme';

const MenuItem = ({ icon, label, active, onPress, badge }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
    onPress={onPress}
    style={({ pressed }) => [
      styles.item,
      active && styles.itemActive,
      pressed && styles.itemPressed,
    ]}
  >
    <View style={[styles.itemIcon, active && styles.itemIconActive]}>
      <Ionicons
        name={icon}
        size={19}
        color={active ? colors.primaryDeep : colors.muted}
      />
    </View>
    <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>
      {label}
    </Text>
    {badge ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : (
      <Ionicons
        name="chevron-forward"
        size={15}
        color={active ? colors.primaryDark : colors.borderStrong}
      />
    )}
  </Pressable>
);

const DrawerContent = (props) => {
  const { user, logout } = useAuth();
  const { patients, appointments } = useClinic();

  const drawerRoute = props.state.routeNames[props.state.index];
  const tabsRoute = props.state.routes.find((route) => route.name === 'Tabs');
  const tabsState = tabsRoute?.state;
  const activeTab = tabsState?.routes?.[tabsState.index]?.name;

  const goToTab = (tab, screen) => {
    props.navigation.navigate('Tabs', {
      screen: tab,
      params: screen ? { screen } : undefined,
    });
    props.navigation.closeDrawer();
  };

  const goToScreen = (name) => {
    props.navigation.navigate(name);
    props.navigation.closeDrawer();
  };

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
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.scroll}
    >
      <LinearGradient colors={drawerGradient} style={styles.header}>
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />

        <Avatar
          name={user?.nombreUsuario}
          size={60}
          style={styles.avatar}
        />
        <Text style={styles.name} numberOfLines={1}>
          {user?.nombreUsuario || 'Invitado'}
        </Text>
        <Text style={styles.role}>{user?.rol || 'Usuario'}</Text>

        <View style={styles.sessionChip}>
          <View style={styles.dot} />
          <Text style={styles.sessionText}>Sesión activa</Text>
        </View>
      </LinearGradient>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{patients.length}</Text>
          <Text style={styles.summaryLabel}>Pacientes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{appointments.length}</Text>
          <Text style={styles.summaryLabel}>Citas</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>3</Text>
          <Text style={styles.summaryLabel}>Avisos</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Principal</Text>
      <MenuItem
        icon="home-outline"
        label="Inicio"
        active={drawerRoute === 'Tabs' && activeTab === 'InicioTab'}
        onPress={() => goToTab('InicioTab')}
      />
      <MenuItem
        icon="person-outline"
        label="Mi perfil"
        active={drawerRoute === 'Tabs' && activeTab === 'PerfilTab'}
        onPress={() => goToTab('PerfilTab')}
      />
      <MenuItem
        icon="notifications-outline"
        label="Notificaciones"
        badge="3"
        active={
          drawerRoute === 'Tabs' &&
          activeTab === 'InicioTab' &&
          tabsState?.routes?.[tabsState.index]?.state?.index === 1
        }
        onPress={() => goToTab('InicioTab', 'Notifications')}
      />

      <Text style={styles.sectionLabel}>Configuración</Text>
      <MenuItem
        icon="settings-outline"
        label="Configuración"
        active={drawerRoute === 'Settings'}
        onPress={() => goToScreen('Settings')}
      />
      <MenuItem
        icon="lock-closed-outline"
        label="Cambiar contraseña"
        active={drawerRoute === 'ChangePassword'}
        onPress={() => goToScreen('ChangePassword')}
      />
      <MenuItem
        icon="help-circle-outline"
        label="Ayuda"
        active={drawerRoute === 'Help'}
        onPress={() => goToScreen('Help')}
      />
      <MenuItem
        icon="information-circle-outline"
        label="Acerca de la app"
        active={drawerRoute === 'About'}
        onPress={() => goToScreen('About')}
      />

      <View style={styles.spacer} />

      <Pressable
        accessibilityRole="button"
        onPress={handleLogout}
        style={({ pressed }) => [
          styles.logout,
          pressed && styles.itemPressed,
        ]}
      >
        <View style={styles.logoutIcon}>
          <Ionicons name="log-out-outline" size={19} color={colors.danger} />
        </View>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>

      <Text style={styles.version}>Clínica Pediátrica · v1.0.0</Text>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: spacing.lg,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  circleOne: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -60,
    right: -40,
  },
  circleTwo: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -40,
    left: -20,
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  role: {
    marginTop: 3,
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.82)',
  },
  sessionChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  sessionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  summaryLabel: {
    marginTop: 1,
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.muted,
  },
  summaryDivider: {
    width: 1,
    height: 26,
    backgroundColor: colors.border,
  },
  sectionLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.xl,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: colors.subtle,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    borderRadius: radius.md,
  },
  itemActive: {
    backgroundColor: colors.primarySoft,
  },
  itemPressed: {
    opacity: 0.72,
  },
  itemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    marginRight: spacing.md,
  },
  itemIconActive: {
    backgroundColor: '#ffffff',
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  itemLabelActive: {
    color: colors.primaryDeep,
    fontWeight: '800',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.rose,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  spacer: {
    flex: 1,
    minHeight: spacing.lg,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  logoutIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginRight: spacing.md,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.danger,
  },
  version: {
    marginTop: spacing.md,
    textAlign: 'center',
    fontSize: 10.5,
    color: colors.subtle,
  },
});

export default DrawerContent;
