import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { radius, shadows, spacing } from '../theme';

const filters = [
  { key: 'proximas', label: 'Próximas' },
  { key: 'hoy', label: 'Hoy' },
  { key: 'pasadas', label: 'Pasadas' },
  { key: 'todas', label: 'Todas' },
];

const getDayMonth = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'short' })
    .format(date)
    .replace('.', '');

  return { day, monthLabel: monthLabel.toUpperCase() };
};

const AppointmentScreen = ({ navigation }) => {
  const { appointments, todayISO, formatDate } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const [activeFilter, setActiveFilter] = useState('proximas');

  const today = todayISO();

  const visibleAppointments = useMemo(() => {
    const list = appointments.filter((appointment) => {
      if (activeFilter === 'hoy') return appointment.fecha === today;
      if (activeFilter === 'proximas') return appointment.fecha >= today;
      if (activeFilter === 'pasadas') return appointment.fecha < today;
      return true;
    });

    return [...list].sort((a, b) => {
      const comparison =
        a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora);
      return activeFilter === 'pasadas' || activeFilter === 'todas'
        ? -comparison
        : comparison;
    });
  }, [appointments, activeFilter, today]);

  const todayCount = appointments.filter(
    (appointment) => appointment.fecha === today
  ).length;
  const pendingCount = appointments.filter(
    (appointment) => appointment.estado === 'pendiente'
  ).length;

  const renderItem = ({ item }) => {
    const date = getDayMonth(item.fecha);

    return (
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          navigation.navigate('AppointmentDetail', {
            appointmentId: item.id,
          })
        }
        style={({ pressed }) => [
          styles.card,
          item.estado === 'cancelada' && styles.cardCancelled,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.dateBlock}>
          <Text style={styles.dateDay}>{date.day}</Text>
          <Text style={styles.dateMonth}>{date.monthLabel}</Text>
        </View>

        <View style={styles.cardInfo}>
          <View style={styles.cardTop}>
            <Text style={styles.patient} numberOfLines={1}>
              {item.paciente}
            </Text>
            <StatusBadge status={item.estado} />
          </View>
          <Text style={styles.reason} numberOfLines={1}>
            {item.motivo}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={colors.muted} />
            <Text style={styles.metaText}>{item.hora}</Text>
            <View style={styles.metaDot} />
            <Ionicons
              name="medkit-outline"
              size={13}
              color={colors.muted}
            />
            <Text style={styles.metaText} numberOfLines={1}>
              {item.medico}
            </Text>
          </View>
        </View>

        <View style={styles.chevron}>
          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.primaryDark}
          />
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={isDark}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, styles.summaryIconBlue]}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={colors.primaryDark}
                  />
                </View>
                <Text style={styles.summaryValue}>{todayCount}</Text>
                <Text style={styles.summaryLabel}>Hoy</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, styles.summaryIconAmber]}>
                  <Ionicons
                    name="hourglass-outline"
                    size={18}
                    color={colors.amberText}
                  />
                </View>
                <Text style={styles.summaryValue}>{pendingCount}</Text>
                <Text style={styles.summaryLabel}>Pendientes</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, styles.summaryIconTeal]}>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={18}
                    color={colors.success}
                  />
                </View>
                <Text style={styles.summaryValue}>{appointments.length}</Text>
                <Text style={styles.summaryLabel}>Totales</Text>
              </View>
            </View>

            <Text style={styles.title}>Agenda de citas</Text>
            <Text style={styles.subtitle}>
              Organiza y da seguimiento a cada consulta
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {filters.map((filter) => {
                const active = activeFilter === filter.key;

                return (
                  <Pressable
                    key={filter.key}
                    onPress={() => setActiveFilter(filter.key)}
                    style={({ pressed }) => [
                      styles.filter,
                      active && styles.filterActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Citas programadas</Text>
              <Text style={styles.listCount}>
                {visibleAppointments.length}{' '}
                {visibleAppointments.length === 1 ? 'resultado' : 'resultados'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="calendar-clear-outline"
            title="No hay citas en esta vista"
            message="Cambia el filtro o programa una nueva cita para comenzar."
          />
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nueva cita"
        onPress={() => navigation.navigate('AppointmentForm', {})}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
      >
        <Ionicons
          name="add"
          size={28}
          color={isDark ? '#082f49' : '#ffffff'}
        />
      </Pressable>
    </View>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    list: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: 96,
      width: '100%',
      maxWidth: 760,
      alignSelf: 'center',
    },
    summary: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: spacing.lg,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryIcon: {
      width: 34,
      height: 34,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    summaryIconBlue: {
      backgroundColor: colors.primarySoft,
    },
    summaryIconAmber: {
      backgroundColor: colors.amberSoft,
    },
    summaryIconTeal: {
      backgroundColor: colors.accentSoft,
    },
    summaryValue: {
      fontSize: 18,
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
      height: 48,
      backgroundColor: colors.border,
    },
    title: {
      marginTop: spacing.xxl,
      fontSize: 23,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.4,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 12.5,
      color: colors.muted,
    },
    filters: {
      gap: spacing.sm,
      paddingVertical: spacing.lg,
    },
    filter: {
      paddingHorizontal: spacing.lg,
      paddingVertical: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterActive: {
      backgroundColor: isDark ? colors.primary : colors.primaryDark,
      borderColor: isDark ? colors.primary : colors.primaryDark,
    },
    filterText: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.muted,
    },
    filterTextActive: {
      color: isDark ? '#082f49' : '#ffffff',
    },
    listHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
    },
    listTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    listCount: {
      fontSize: 11.5,
      color: colors.muted,
      fontWeight: '600',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    cardCancelled: {
      opacity: 0.6,
    },
    dateBlock: {
      width: 54,
      height: 60,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    dateDay: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primaryDeep,
      lineHeight: 23,
    },
    dateMonth: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.primaryDark,
      letterSpacing: 0.7,
    },
    cardInfo: {
      flex: 1,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
    },
    patient: {
      flex: 1,
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.text,
    },
    reason: {
      marginTop: 2,
      fontSize: 12,
      color: colors.muted,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 7,
    },
    metaText: {
      marginLeft: 4,
      fontSize: 11,
      fontWeight: '600',
      color: colors.muted,
      flexShrink: 1,
    },
    metaDot: {
      width: 3,
      height: 3,
      borderRadius: 2,
      backgroundColor: colors.borderStrong,
      marginHorizontal: 7,
    },
    chevron: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: spacing.sm,
    },
    fab: {
      position: 'absolute',
      right: spacing.xl,
      bottom: spacing.xl,
      width: 56,
      height: 56,
      borderRadius: 19,
      backgroundColor: isDark ? colors.primary : colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.floating,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.45 } : null),
    },
    fabPressed: {
      opacity: 0.85,
      transform: [{ scale: 0.96 }],
    },
    pressed: {
      opacity: 0.8,
    },
  });

export default AppointmentScreen;
