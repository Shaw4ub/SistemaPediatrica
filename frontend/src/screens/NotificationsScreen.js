import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import EmptyState from '../components/EmptyState';
import { useTheme } from '../context/ThemeContext';
import { radius, shadows, spacing } from '../theme';

const initialNotifications = [
  {
    id: 'n1',
    type: 'cita',
    title: 'Cita confirmada',
    message: 'María Pérez tiene una cita hoy a las 09:30 con la Dra. Elena Ruiz.',
    time: 'Hace 20 min',
    read: false,
    icon: 'calendar',
    tone: 'primary',
  },
  {
    id: 'n2',
    type: 'recordatorio',
    title: 'Recordatorio de vacunación',
    message: 'Sofía Ramírez tiene pendiente su refuerzo de vacunación esta semana.',
    time: 'Hace 2 h',
    read: false,
    icon: 'alarm',
    tone: 'amber',
  },
  {
    id: 'n3',
    type: 'sistema',
    title: 'Nuevo registro clínico',
    message: 'Se agregó un registro de seguimiento al expediente de Juan Pérez.',
    time: 'Ayer',
    read: false,
    icon: 'document-text',
    tone: 'purple',
  },
  {
    id: 'n4',
    type: 'cita',
    title: 'Cita reprogramada',
    message: 'Ana García cambió su consulta al viernes a las 14:00.',
    time: 'Hace 2 días',
    read: true,
    icon: 'refresh-circle',
    tone: 'success',
  },
  {
    id: 'n5',
    type: 'sistema',
    title: 'Respaldo completado',
    message: 'La información de la clínica se sincronizó correctamente.',
    time: 'Hace 3 días',
    read: true,
    icon: 'cloud-done',
    tone: 'neutral',
  },
];

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'unread', label: 'No leídas' },
  { key: 'cita', label: 'Citas' },
  { key: 'sistema', label: 'Sistema' },
];

const NotificationsScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState('all');

  // Los tonos se resuelven en cada render para respetar el tema activo.
  const tones = useMemo(
    () => ({
      primary: { color: colors.primaryDark, background: colors.primarySoft },
      amber: { color: colors.amberText, background: colors.amberSoft },
      purple: { color: colors.purple, background: colors.purpleSoft },
      success: { color: colors.success, background: colors.accentSoft },
      neutral: { color: colors.muted, background: colors.neutralSoft },
    }),
    [colors]
  );

  const unreadCount = notifications.filter((item) => !item.read).length;

  const visibleNotifications = useMemo(() => {
    if (activeFilter === 'unread') {
      return notifications.filter((item) => !item.read);
    }
    if (activeFilter === 'all') return notifications;
    return notifications.filter((item) => item.type === activeFilter);
  }, [notifications, activeFilter]);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons
            name="notifications"
            size={24}
            color={colors.primaryDark}
          />
        </View>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle}>
            {unreadCount
              ? `Tienes ${unreadCount} avisos sin leer`
              : 'Estás al día'}
          </Text>
          <Text style={styles.summarySubtitle}>
            {unreadCount
              ? 'Revisa las novedades de tu clínica.'
              : 'No tienes notificaciones pendientes.'}
          </Text>
        </View>
        {unreadCount ? (
          <Pressable
            accessibilityRole="button"
            onPress={markAllAsRead}
            style={({ pressed }) => [
              styles.markAll,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="checkmark-done"
              size={18}
              color={colors.primaryDeep}
            />
          </Pressable>
        ) : null}
      </View>

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
              style={[styles.filter, active && styles.filterActive]}
            >
              <Text
                style={[styles.filterText, active && styles.filterTextActive]}
              >
                {filter.label}
              </Text>
              {filter.key === 'unread' && unreadCount ? (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>

      {visibleNotifications.length ? (
        visibleNotifications.map((item) => {
          const tone = tones[item.tone] || tones.neutral;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => markAsRead(item.id)}
              style={({ pressed }) => [
                styles.card,
                !item.read && styles.cardUnread,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[styles.cardIcon, { backgroundColor: tone.background }]}
              >
                <Ionicons name={item.icon} size={20} color={tone.color} />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {!item.read ? <View style={styles.unreadDot} /> : null}
                </View>
                <Text style={styles.cardMessage}>{item.message}</Text>
                <Text style={styles.cardTime}>{item.time}</Text>
              </View>
            </Pressable>
          );
        })
      ) : (
        <EmptyState
          icon="notifications-off-outline"
          title="Sin notificaciones"
          message="No hay avisos que coincidan con este filtro."
        />
      )}

      <Text style={styles.footer}>
        Toca una notificación para marcarla como leída.
      </Text>
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
      padding: spacing.lg,
      paddingBottom: spacing.xxxl,
      width: '100%',
      maxWidth: 720,
      alignSelf: 'center',
    },
    summaryCard: {
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
    summaryIcon: {
      width: 50,
      height: 50,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    summaryInfo: {
      flex: 1,
    },
    summaryTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    summarySubtitle: {
      marginTop: 3,
      fontSize: 11.5,
      color: colors.muted,
    },
    markAll: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filters: {
      gap: spacing.sm,
      paddingVertical: spacing.lg,
    },
    filter: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: 7,
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
      fontSize: 12,
      fontWeight: '700',
      color: colors.muted,
    },
    filterTextActive: {
      color: isDark ? '#082f49' : '#ffffff',
    },
    filterBadge: {
      marginLeft: 6,
      minWidth: 17,
      height: 17,
      borderRadius: 9,
      paddingHorizontal: 4,
      backgroundColor: colors.rose,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterBadgeText: {
      fontSize: 9,
      fontWeight: '800',
      color: isDark ? '#082f49' : '#ffffff',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.md,
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    cardUnread: {
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    cardIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    cardInfo: {
      flex: 1,
    },
    cardTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    cardTitle: {
      flex: 1,
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.text,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    cardMessage: {
      marginTop: 3,
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    cardTime: {
      marginTop: 5,
      fontSize: 10.5,
      fontWeight: '600',
      color: colors.subtle,
    },
    footer: {
      marginTop: spacing.lg,
      textAlign: 'center',
      fontSize: 10.5,
      color: colors.subtle,
    },
    pressed: {
      opacity: 0.78,
    },
  });

export default NotificationsScreen;
