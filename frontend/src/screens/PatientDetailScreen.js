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
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import { radius, spacing } from '../theme';

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
    { text: 'Eliminar', style: 'destructive', onPress: onConfirm },
  ]);
};

const PatientDetailScreen = ({ navigation, route }) => {
  const {
    patients,
    appointments,
    records,
    deletePatient,
    formatDate,
  } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const { patientId } = route.params || {};
  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="person-outline"
          title="Paciente no encontrado"
          message="El expediente que buscas ya no está disponible."
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

  const patientAppointments = appointments
    .filter((appointment) => appointment.pacienteId === patient.id)
    .sort(
      (a, b) =>
        b.fecha.localeCompare(a.fecha) || b.hora.localeCompare(a.hora)
    );
  const patientRecords = records
    .filter((record) => record.pacienteId === patient.id)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const handleDelete = () => {
    confirmAction(
      'Eliminar paciente',
      'Se eliminarán también sus citas e historial. Esta acción no se puede deshacer.',
      async () => {
        try {
          await deletePatient(patient.id);
          navigation.goBack();
        } catch (error) {
          console.warn('[patients] No se pudo eliminar el paciente.', error);
          Alert.alert(
            'No se pudo eliminar',
            'Ocurrió un error al borrar el registro en la base de datos.'
          );
        }
      }
    );
  };

  const openAppointment = (appointmentId) => {
    navigation.getParent()?.navigate('CitasTab', {
      screen: 'AppointmentDetail',
      params: { appointmentId },
    });
  };

  const openRecord = (recordId) => {
    navigation.getParent()?.navigate('HistorialTab', {
      screen: 'RecordDetail',
      params: { recordId },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Avatar name={patient.nombre} size={70} />
        <View style={styles.heroInfo}>
          <Text style={styles.name}>{patient.nombre}</Text>
          <Text style={styles.meta}>
            {patient.edad} años · {patient.sexo}
          </Text>
          <View style={styles.heroTags}>
            <View style={styles.statusChip}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>En seguimiento</Text>
            </View>
            {patient.tipoSangre ? (
              <View style={styles.bloodChip}>
                <Ionicons
                  name="water-outline"
                  size={11}
                  color={colors.danger}
                />
                <Text style={styles.bloodText}>{patient.tipoSangre}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Agendar cita"
          icon="calendar-outline"
          onPress={() =>
            navigation.getParent()?.navigate('CitasTab', {
              screen: 'AppointmentForm',
              params: { patientId: patient.id },
            })
          }
          style={styles.action}
          size="sm"
        />
        <AppButton
          title="Nuevo registro"
          icon="add-circle-outline"
          variant="outline"
          onPress={() =>
            navigation.getParent()?.navigate('HistorialTab', {
              screen: 'RecordForm',
              params: { patientId: patient.id },
            })
          }
          style={styles.action}
          size="sm"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Editar paciente"
          onPress={() =>
            navigation.navigate('PatientForm', { patientId: patient.id })
          }
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="create-outline" size={19} color={colors.primaryDeep} />
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Datos del paciente</Text>
      <AppCard style={styles.card}>
        <InfoRow
          icon="calendar-outline"
          label="Edad"
          value={`${patient.edad} años`}
        />
        <InfoRow
          icon="gift-outline"
          label="Fecha de nacimiento"
          value={
            patient.fechaNacimiento
              ? formatDate(patient.fechaNacimiento)
              : 'No registrada'
          }
        />
        <InfoRow icon="male-female-outline" label="Sexo" value={patient.sexo} />
        <InfoRow
          icon="people-outline"
          label="Tutor / responsable"
          value={patient.tutor}
        />
        <InfoRow
          icon="call-outline"
          label="Teléfono de contacto"
          value={patient.telefono || 'No registrado'}
        />
        <InfoRow
          icon="mail-outline"
          label="Correo electrónico"
          value={patient.correo || 'No registrado'}
        />
        <InfoRow
          icon="home-outline"
          label="Dirección"
          value={patient.direccion || 'No registrada'}
        />
        {patient.contactoEmergencia ? (
          <InfoRow
            icon="medkit-outline"
            label="Contacto de emergencia"
            value={`${patient.contactoEmergencia}${
              patient.telefonoEmergencia
                ? ` · ${patient.telefonoEmergencia}`
                : ''
            }`}
          />
        ) : null}
        <InfoRow
          icon="alert-circle-outline"
          label="Alergias"
          value={patient.alergias}
        />
        <InfoRow
          icon="pulse-outline"
          label="Condición principal"
          value={patient.condicion}
          last
        />
      </AppCard>

      {patient.notas ? (
        <>
          <Text style={styles.sectionTitle}>Notas clínicas</Text>
          <AppCard style={styles.notesCard}>
            <View style={styles.notesIcon}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.purple}
              />
            </View>
            <Text style={styles.notesText}>{patient.notas}</Text>
          </AppCard>
        </>
      ) : null}

      <SectionHeader
        style={styles.sectionHeader}
        title="Citas del paciente"
        subtitle={`${patientAppointments.length} registradas`}
        actionLabel="Agenda"
        onAction={() =>
          navigation.getParent()?.navigate('CitasTab')
        }
      />

      {patientAppointments.length ? (
        patientAppointments.slice(0, 3).map((appointment) => (
          <Pressable
            key={appointment.id}
            onPress={() => openAppointment(appointment.id)}
            style={({ pressed }) => [
              styles.historyRow,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.historyDate}>
              <Text style={styles.historyDay}>
                {appointment.fecha.split('-')[2]}
              </Text>
              <Text style={styles.historyMonth}>
                {new Intl.DateTimeFormat('es-ES', { month: 'short' })
                  .format(
                    new Date(
                      Number(appointment.fecha.split('-')[0]),
                      Number(appointment.fecha.split('-')[1]) - 1,
                      Number(appointment.fecha.split('-')[2])
                    )
                  )
                  .replace('.', '')
                  .toUpperCase()}
              </Text>
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle} numberOfLines={1}>
                {appointment.motivo}
              </Text>
              <Text style={styles.historyMeta}>
                {appointment.hora} · {formatDate(appointment.fecha)}
              </Text>
            </View>
            <StatusBadge status={appointment.estado} />
          </Pressable>
        ))
      ) : (
        <View style={styles.emptyRow}>
          <Ionicons
            name="calendar-clear-outline"
            size={20}
            color={colors.subtle}
          />
          <Text style={styles.emptyText}>Este paciente no tiene citas aún.</Text>
        </View>
      )}

      <SectionHeader
        style={styles.sectionHeader}
        title="Historial médico"
        subtitle={`${patientRecords.length} registros clínicos`}
        actionLabel="Ver todo"
        onAction={() => navigation.getParent()?.navigate('HistorialTab')}
      />

      {patientRecords.length ? (
        patientRecords.slice(0, 3).map((record) => (
          <Pressable
            key={record.id}
            onPress={() => openRecord(record.id)}
            style={({ pressed }) => [
              styles.historyRow,
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.recordIcon}>
              <Ionicons name="pulse" size={17} color={colors.purple} />
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle} numberOfLines={1}>
                {record.diagnostico}
              </Text>
              <Text style={styles.historyMeta} numberOfLines={1}>
                {formatDate(record.fecha)} · {record.tratamiento}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.borderStrong}
            />
          </Pressable>
        ))
      ) : (
        <View style={styles.emptyRow}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color={colors.subtle}
          />
          <Text style={styles.emptyText}>Sin registros médicos todavía.</Text>
        </View>
      )}

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.deleteAction,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.subtle} />
        <Text style={styles.deleteText}>Eliminar paciente</Text>
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
    hero: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.lg,
    },
    heroInfo: {
      flex: 1,
      marginLeft: spacing.md,
    },
    name: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.3,
    },
    meta: {
      marginTop: 2,
      fontSize: 12.5,
      color: colors.muted,
    },
    heroTags: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    statusChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.successSoft,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.success,
      marginRight: 5,
    },
    statusText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.success,
    },
    bloodChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.dangerSoft,
    },
    bloodText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.danger,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    action: {
      flex: 1,
    },
    editButton: {
      width: 38,
      height: 38,
      borderRadius: radius.sm,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
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
    sectionHeader: {
      marginTop: spacing.xxl,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    historyDate: {
      width: 44,
      height: 48,
      borderRadius: radius.sm,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    historyDay: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.primaryDeep,
      lineHeight: 18,
    },
    historyMonth: {
      fontSize: 8.5,
      fontWeight: '800',
      color: colors.primaryDark,
      letterSpacing: 0.5,
    },
    historyInfo: {
      flex: 1,
      marginRight: spacing.sm,
    },
    historyTitle: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.text,
    },
    historyMeta: {
      marginTop: 2,
      fontSize: 11,
      color: colors.muted,
    },
    recordIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    emptyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.lg,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyText: {
      marginLeft: spacing.sm,
      fontSize: 12.5,
      color: colors.muted,
    },
    deleteAction: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.xxl,
      paddingVertical: spacing.sm,
    },
    deleteText: {
      marginLeft: 5,
      fontSize: 12,
      fontWeight: '600',
      color: colors.subtle,
    },
    pressed: {
      opacity: 0.78,
    },
  });

export default PatientDetailScreen;
