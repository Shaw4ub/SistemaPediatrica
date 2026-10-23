import React, { useMemo } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/Avatar';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import {
  darkHeroGradient,
  heroGradient,
  radius,
  shadows,
  spacing,
} from '../theme';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

const capitalize = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1);

const getDayMonth = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'short' })
    .format(date)
    .replace('.', '');

  return { day, monthLabel: monthLabel.toUpperCase() };
};

const HomeScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const {
    appointments,
    patients,
    records,
    todayISO,
    formatDate,
    formatLongDate,
  } = useClinic();

  const quickActions = useMemo(
    () => [
      {
        key: 'appointments',
        title: 'Citas',
        description: 'Agenda y programa',
        icon: 'calendar',
        color: colors.primaryDark,
        soft: colors.primarySoft,
        tab: 'CitasTab',
      },
      {
        key: 'patients',
        title: 'Pacientes',
        description: 'Gestiona expedientes',
        icon: 'people',
        color: colors.success,
        soft: colors.accentSoft,
        tab: 'PacientesTab',
      },
      {
        key: 'history',
        title: 'Historial',
        description: 'Consultas previas',
        icon: 'document-text',
        color: colors.purple,
        soft: colors.purpleSoft,
        tab: 'HistorialTab',
      },
      {
        key: 'profile',
        title: 'Perfil',
        description: 'Tus datos personales',
        icon: 'person',
        color: colors.amberText,
        soft: colors.amberSoft,
        tab: 'PerfilTab',
      },
      {
        key: 'settings',
        title: 'Configuración',
        description: 'Preferencias de la app',
        icon: 'settings',
        color: colors.muted,
        soft: colors.neutralSoft,
        screen: 'Settings',
      },
      {
        key: 'notifications',
        title: 'Notificaciones',
        description: 'Novedades y avisos',
        icon: 'notifications',
        color: colors.rose,
        soft: colors.roseSoft,
        screen: 'Notifications',
      },
    ],
    [colors]
  );

  const today = todayISO();
  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.fecha === today && appointment.estado !== 'cancelada'
  );

  const upcoming = [...appointments]
    .filter(
      (appointment) =>
        appointment.estado !== 'cancelada' && appointment.fecha >= today
    )
    .sort(
      (a, b) =>
        a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora)
    );

  const nextAppointment = upcoming[0];
  const recentRecords = [...records]
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, 2);

  const openTab = (tab) => {
    navigation.getParent()?.navigate(tab);
  };

  const openQuickAction = (action) => {
    if (action.tab) {
      openTab(action.tab);
      return;
    }

    navigation.navigate(action.screen);
  };

  const openAppointment = (appointmentId) => {
    navigation.getParent()?.navigate('CitasTab', {
      screen: 'AppointmentDetail',
      params: { appointmentId },
    });
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

  const appointmentDate = nextAppointment
    ? getDayMonth(nextAppointment.fecha)
    : null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inner}>
        <LinearGradient
          colors={isDark ? darkHeroGradient : heroGradient}
          style={styles.hero}
        >
          <View style={styles.heroCircleLarge} />
          <View style={styles.heroCircleSmall} />

          <View style={styles.heroTop}>
            <Avatar
              name={user?.nombreUsuario}
              size={54}
              style={styles.heroAvatar}
            />
            <View style={styles.heroText}>
              <Text style={styles.heroEyebrow}>{getGreeting()}</Text>
              <Text style={styles.heroName} numberOfLines={1}>
                {user?.nombreUsuario || 'Bienvenido'}
              </Text>
              <Text style={styles.heroRole}>{user?.rol || 'Usuario'}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ver notificaciones"
              onPress={() => navigation.navigate('Notifications')}
              style={({ pressed }) => [
                styles.heroBell,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="notifications-outline" size={20} color="#fff" />
              <View style={styles.heroBellDot} />
            </Pressable>
          </View>

          <View style={styles.datePill}>
            <Ionicons name="sunny-outline" size={14} color="#fff" />
            <Text style={styles.datePillText}>
              {capitalize(formatLongDate(today))}
            </Text>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{todayAppointments.length}</Text>
              <Text style={styles.heroStatLabel}>Citas hoy</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{patients.length}</Text>
              <Text style={styles.heroStatLabel}>Pacientes</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{records.length}</Text>
              <Text style={styles.heroStatLabel}>Registros</Text>
            </View>
          </View>
        </LinearGradient>

        <SectionHeader
          style={styles.section}
          title="Accesos rápidos"
          subtitle="Todo lo que necesitas, a un toque"
          actionLabel="Agenda"
          onAction={() => openTab('CitasTab')}
        />

        <View style={styles.grid}>
          {quickActions.map((action) => (
            <Pressable
              key={action.key}
              accessibilityRole="button"
              onPress={() => openQuickAction(action)}
              style={({ pressed }) => [
                styles.quickCard,
                pressed && styles.quickCardPressed,
              ]}
            >
              <View
                style={[styles.quickIcon, { backgroundColor: action.soft }]}
              >
                <Ionicons
                  name={action.icon}
                  size={20}
                  color={action.color}
                />
              </View>
              <Text style={styles.quickTitle}>{action.title}</Text>
              <Text style={styles.quickDescription} numberOfLines={1}>
                {action.description}
              </Text>
              <View style={styles.quickArrow}>
                <Ionicons
                  name="arrow-forward"
                  size={13}
                  color={colors.subtle}
                />
              </View>
            </Pressable>
          ))}
        </View>

        <SectionHeader
          style={styles.section}
          title="Próxima cita"
          subtitle="Tu siguiente paciente"
          actionLabel="Ver todas"
          onAction={() => openTab('CitasTab')}
        />

        {nextAppointment ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => openAppointment(nextAppointment.id)}
            style={({ pressed }) => [
              styles.appointmentCard,
              pressed && styles.quickCardPressed,
            ]}
          >
            <View style={styles.dateBlock}>
              <Text style={styles.dateDay}>{appointmentDate.day}</Text>
              <Text style={styles.dateMonth}>{appointmentDate.monthLabel}</Text>
            </View>

            <View style={styles.appointmentInfo}>
              <View style={styles.appointmentTop}>
                <Text style={styles.appointmentPatient} numberOfLines={1}>
                  {nextAppointment.paciente}
                </Text>
                <StatusBadge status={nextAppointment.estado} />
              </View>
              <Text style={styles.appointmentReason} numberOfLines={1}>
                {nextAppointment.motivo}
              </Text>
              <View style={styles.appointmentMeta}>
                <Ionicons
                  name="time-outline"
                  size={13}
                  color={colors.muted}
                />
                <Text style={styles.appointmentMetaText}>
                  {nextAppointment.hora}
                </Text>
                <View style={styles.metaDot} />
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={colors.muted}
                />
                <Text style={styles.appointmentMetaText}>
                  {formatDate(nextAppointment.fecha)}
                </Text>
              </View>
            </View>

            <View style={styles.chevron}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.primaryDeep}
              />
            </View>
          </Pressable>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="calendar-clear-outline"
                size={24}
                color={colors.primaryDeep}
              />
            </View>
            <View style={styles.emptyTextWrap}>
              <Text style={styles.emptyTitle}>Sin citas próximas</Text>
              <Text style={styles.emptyText}>
                Programa una nueva cita para comenzar.
              </Text>
            </View>
            <Pressable
              onPress={() =>
                navigation.getParent()?.navigate('CitasTab', {
                  screen: 'AppointmentForm',
                  params: {},
                })
              }
              style={styles.emptyButton}
            >
              <Ionicons
                name="add"
                size={18}
                color={isDark ? '#082f49' : '#fff'}
              />
            </Pressable>
          </View>
        )}

        <SectionHeader
          style={styles.section}
          title="Actividad reciente"
          subtitle="Últimos registros médicos"
          actionLabel="Historial"
          onAction={() => openTab('HistorialTab')}
        />

        <View style={styles.activityCard}>
          {recentRecords.map((record, index) => (
            <Pressable
              key={record.id}
              accessibilityRole="button"
              onPress={() =>
                navigation.getParent()?.navigate('HistorialTab', {
                  screen: 'RecordDetail',
                  params: { recordId: record.id },
                })
              }
              style={({ pressed }) => [
                styles.activityRow,
                index !== recentRecords.length - 1 &&
                  styles.activityRowBorder,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.activityDot}>
                <Ionicons
                  name="pulse"
                  size={15}
                  color={colors.purple}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle} numberOfLines={1}>
                  {record.diagnostico}
                </Text>
                <Text style={styles.activitySubtitle} numberOfLines={1}>
                  {record.paciente} · {formatDate(record.fecha)}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.borderStrong}
              />
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutCard,
            pressed && styles.quickCardPressed,
          ]}
        >
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          </View>
          <View style={styles.logoutInfo}>
            <Text style={styles.logoutTitle}>Cerrar sesión</Text>
            <Text style={styles.logoutSubtitle}>
              Finaliza tu sesión de forma segura
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.borderStrong}
          />
        </Pressable>

        <Text style={styles.footer}>
          Clínica Pediátrica · Cuidando a los más pequeños
        </Text>
      </View>
    </ScrollView>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
      paddingBottom: spacing.xxl,
    },
    inner: {
      width: '100%',
      maxWidth: 720,
      alignSelf: 'center',
    },
    hero: {
      borderRadius: radius.xxl,
      padding: spacing.xl,
      overflow: 'hidden',
      ...shadows.floating,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.45 } : null),
    },
    heroCircleLarge: {
      position: 'absolute',
      width: 210,
      height: 210,
      borderRadius: 105,
      backgroundColor: 'rgba(255,255,255,0.10)',
      top: -85,
      right: -60,
    },
    heroCircleSmall: {
      position: 'absolute',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255,255,255,0.08)',
      bottom: -50,
      left: -25,
    },
    heroTop: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    heroAvatar: {
      marginRight: spacing.md,
    },
    heroText: {
      flex: 1,
    },
    heroEyebrow: {
      fontSize: 11.5,
      fontWeight: '700',
      color: 'rgba(255,255,255,0.78)',
      letterSpacing: 0.4,
    },
    heroName: {
      marginTop: 2,
      fontSize: 21,
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: -0.4,
    },
    heroRole: {
      marginTop: 1,
      fontSize: 12,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.82)',
    },
    heroBell: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
    },
    heroBellDot: {
      position: 'absolute',
      top: 10,
      right: 11,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: '#fbbf24',
      borderWidth: 1,
      borderColor: '#0284c7',
    },
    datePill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      paddingHorizontal: 11,
      paddingVertical: 6,
      borderRadius: radius.pill,
      backgroundColor: 'rgba(255,255,255,0.16)',
    },
    datePillText: {
      marginLeft: 6,
      fontSize: 11.5,
      fontWeight: '700',
      color: '#ffffff',
    },
    heroStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.18)',
    },
    heroStat: {
      flex: 1,
    },
    heroStatValue: {
      fontSize: 22,
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: -0.5,
    },
    heroStatLabel: {
      marginTop: 1,
      fontSize: 11,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.78)',
    },
    heroDivider: {
      width: 1,
      height: 30,
      backgroundColor: 'rgba(255,255,255,0.18)',
      marginHorizontal: spacing.sm,
    },
    section: {
      marginTop: spacing.xxl,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    quickCard: {
      width: '48%',
      minWidth: 140,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    quickCardPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.985 }],
    },
    quickIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    quickTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.2,
    },
    quickDescription: {
      marginTop: 3,
      fontSize: 11.5,
      color: colors.muted,
      paddingRight: spacing.lg,
    },
    quickArrow: {
      position: 'absolute',
      right: spacing.md,
      bottom: spacing.md,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    appointmentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    dateBlock: {
      width: 56,
      height: 62,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    dateDay: {
      fontSize: 21,
      fontWeight: '800',
      color: colors.primaryDeep,
      lineHeight: 24,
    },
    dateMonth: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primaryDeep,
      letterSpacing: 0.8,
    },
    appointmentInfo: {
      flex: 1,
    },
    appointmentTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    appointmentPatient: {
      flex: 1,
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    appointmentReason: {
      marginTop: 2,
      fontSize: 12.5,
      color: colors.muted,
    },
    appointmentMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 7,
    },
    appointmentMetaText: {
      marginLeft: 4,
      fontSize: 11,
      fontWeight: '600',
      color: colors.muted,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.borderStrong,
      marginHorizontal: 7,
    },
    chevron: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing.sm,
    },
    emptyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    emptyIcon: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    emptyTextWrap: {
      flex: 1,
    },
    emptyTitle: {
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.text,
    },
    emptyText: {
      marginTop: 2,
      fontSize: 12,
      color: colors.muted,
    },
    emptyButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: isDark ? colors.primary : colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.lg,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
    },
    activityRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityDot: {
      width: 34,
      height: 34,
      borderRadius: 11,
      backgroundColor: colors.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    activityInfo: {
      flex: 1,
      paddingRight: spacing.sm,
    },
    activityTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.text,
    },
    activitySubtitle: {
      marginTop: 2,
      fontSize: 11.5,
      color: colors.muted,
    },
    logoutCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.xxl,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    logoutIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: colors.dangerSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    logoutInfo: {
      flex: 1,
    },
    logoutTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    logoutSubtitle: {
      marginTop: 2,
      fontSize: 11.5,
      color: colors.muted,
    },
    footer: {
      marginTop: spacing.xl,
      textAlign: 'center',
      fontSize: 10.5,
      color: colors.subtle,
    },
    pressed: {
      opacity: 0.75,
    },
  });

export default HomeScreen;
