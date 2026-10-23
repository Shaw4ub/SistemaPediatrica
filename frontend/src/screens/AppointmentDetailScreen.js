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
import { Ionicons } from '@expo/vector-icons';

import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import InfoRow from '../components/InfoRow';
import StatusBadge from '../components/StatusBadge';
import { radius, spacing } from '../theme';

const capitalize = (value = '') =>
  value.charAt(0).toUpperCase() + value.slice(1);

const confirmAction = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    const accepted =
      typeof globalThis.confirm === 'function'
        ? globalThis.confirm(`${title}\n\n${message}`)
        : true;
    if (accepted) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Confirmar', style: 'destructive', onPress: onConfirm },
  ]);
};

const AppointmentDetailScreen = ({ navigation, route }) => {
  const {
    appointments,
    updateAppointment,
    deleteAppointment,
    formatDate,
  } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const { appointmentId } = route.params || {};
  const appointment = appointments.find((item) => item.id === appointmentId);

  if (!appointment) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="calendar-clear-outline"
          title="Cita no encontrada"
          message="La cita que buscas ya no está disponible."
          action={
            <AppButton
              title="Volver al listado"
              variant="soft"
              icon="arrow-back"
              onPress={() => navigation.goBack()}
            />
          }
        />
      </View>
    );
  }

  const handleCancelAppointment = () => {
    confirmAction(
      'Cancelar cita',
      'La cita quedará marcada como cancelada.',
      () => updateAppointment(appointment.id, { estado: 'cancelada' })
    );
  };

  const handleDelete = () => {
    confirmAction(
      'Eliminar cita',
      'Esta acción eliminará la cita de forma permanente.',
      () => {
        deleteAppointment(appointment.id);
        navigation.goBack();
      }
    );
  };

  const handleOpenPatient = () => {
    navigation.getParent()?.navigate('PacientesTab', {
      screen: 'PatientDetail',
      params: { patientId: appointment.pacienteId },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.patientCard}>
        <Avatar name={appointment.paciente} size={62} />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{appointment.paciente}</Text>
          <Text style={styles.reason}>{appointment.motivo}</Text>
        </View>
        <StatusBadge status={appointment.estado} />
      </View>

      <View style={styles.dateBanner}>
        <View style={styles.dateIcon}>
          <Ionicons name="calendar" size={22} color={colors.primaryDark} />
        </View>
        <View style={styles.dateTextWrap}>
          <Text style={styles.dateLabel}>Fecha y hora</Text>
          <Text style={styles.dateValue}>
            {capitalize(
              formatDate(appointment.fecha, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            )}
          </Text>
        </View>
        <View style={styles.timeChip}>
          <Ionicons name="time-outline" size={14} color={colors.primaryDeep} />
          <Text style={styles.timeText}>{appointment.hora}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Información de la cita</Text>
      <AppCard style={styles.card}>
        <InfoRow
          icon="person-outline"
          label="Paciente"
          value={appointment.paciente}
        />
        <InfoRow
          icon="medkit-outline"
          label="Médico responsable"
          value={appointment.medico}
        />
        <InfoRow
          icon="chatbubble-ellipses-outline"
          label="Motivo de consulta"
          value={appointment.motivo}
        />
        <InfoRow
          icon="pulse-outline"
          label="Estado"
          value={
            appointment.estado.charAt(0).toUpperCase() +
            appointment.estado.slice(1)
          }
          last
        />
      </AppCard>

      {appointment.notas ? (
        <>
          <Text style={styles.sectionTitle}>Notas</Text>
          <AppCard style={styles.notesCard}>
            <View style={styles.notesIcon}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.purple}
              />
            </View>
            <Text style={styles.notesText}>{appointment.notas}</Text>
          </AppCard>
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Acciones</Text>
      <View style={styles.actions}>
        <AppButton
          title="Editar cita"
          icon="create-outline"
          onPress={() =>
            navigation.navigate('AppointmentForm', {
              appointmentId: appointment.id,
            })
          }
          style={styles.action}
        />
        <AppButton
          title="Ver expediente"
          icon="folder-open-outline"
          variant="outline"
          onPress={handleOpenPatient}
          style={styles.action}
        />
      </View>

      {appointment.estado !== 'cancelada' ? (
        <Pressable
          onPress={handleCancelAppointment}
          style={({ pressed }) => [
            styles.secondaryAction,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="close-circle-outline"
            size={18}
            color={colors.danger}
          />
          <Text style={styles.secondaryActionText}>Cancelar cita</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.deleteAction,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.subtle} />
        <Text style={styles.deleteText}>Eliminar cita</Text>
      </Pressable>
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
    patientCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
    },
    patientInfo: {
      flex: 1,
      marginLeft: spacing.md,
      marginRight: spacing.sm,
    },
    patientName: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
    },
    reason: {
      marginTop: 2,
      fontSize: 12.5,
      color: colors.muted,
    },
    dateBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.primarySoft,
    },
    dateIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    dateTextWrap: {
      flex: 1,
    },
    dateLabel: {
      fontSize: 10.5,
      fontWeight: '800',
      color: colors.primaryDark,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dateValue: {
      marginTop: 2,
      fontSize: 13,
      fontWeight: '700',
      color: colors.primaryDeep,
    },
    timeChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    timeText: {
      marginLeft: 4,
      fontSize: 12,
      fontWeight: '800',
      color: colors.primaryDeep,
    },
    sectionTitle: {
      marginTop: spacing.xxl,
      marginBottom: spacing.sm,
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    card: {
      paddingVertical: spacing.xs,
    },
    notesCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    notesIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      backgroundColor: colors.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    notesText: {
      flex: 1,
      fontSize: 13.5,
      lineHeight: 20,
      color: colors.textSecondary,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    action: {
      flex: 1,
    },
    secondaryAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.dangerSoft,
    },
    secondaryActionText: {
      marginLeft: 6,
      fontSize: 13,
      fontWeight: '700',
      color: colors.danger,
    },
    deleteAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.lg,
      paddingVertical: spacing.sm,
    },
    deleteText: {
      marginLeft: 5,
      fontSize: 12,
      fontWeight: '600',
      color: colors.subtle,
    },
    pressed: {
      opacity: 0.75,
    },
  });

export default AppointmentDetailScreen;
