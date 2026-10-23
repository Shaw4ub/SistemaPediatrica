import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useClinic } from '../context/ClinicContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import { FormField, ChipSelect } from '../components/FormField';
import { colors, radius, spacing } from '../theme';

const statusOptions = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'completada', label: 'Completada' },
];

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

const AppointmentFormScreen = ({ navigation, route }) => {
  const {
    patients,
    appointments,
    addAppointment,
    updateAppointment,
    todayISO,
  } = useClinic();
  const { appointmentId, patientId } = route.params || {};
  const editing = useMemo(
    () => appointments.find((appointment) => appointment.id === appointmentId),
    [appointments, appointmentId]
  );

  const [selectedPatientId, setSelectedPatientId] = useState(
    editing?.pacienteId || patientId || patients[0]?.id || ''
  );
  const [fecha, setFecha] = useState(editing?.fecha || todayISO());
  const [hora, setHora] = useState(editing?.hora || '09:00');
  const [motivo, setMotivo] = useState(editing?.motivo || '');
  const [medico, setMedico] = useState(
    editing?.medico || 'Dra. Elena Ruiz'
  );
  const [estado, setEstado] = useState(editing?.estado || 'pendiente');
  const [notas, setNotas] = useState(editing?.notas || '');

  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.nombre,
  }));

  // Si la pantalla ya existía en el stack (por ejemplo, al llegar desde otra
  // pestaña), sincroniza el formulario con los nuevos parámetros.
  useEffect(() => {
    const current = appointmentId
      ? appointments.find((appointment) => appointment.id === appointmentId)
      : null;

    setSelectedPatientId(
      current?.pacienteId || patientId || patients[0]?.id || ''
    );
    setFecha(current?.fecha || todayISO());
    setHora(current?.hora || '09:00');
    setMotivo(current?.motivo || '');
    setMedico(current?.medico || 'Dra. Elena Ruiz');
    setEstado(current?.estado || 'pendiente');
    setNotas(current?.notas || '');
    // Solo se reejecuta cuando cambian los parámetros de navegación.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, patientId]);

  const handleSubmit = () => {
    const patient = patients.find((item) => item.id === selectedPatientId);

    if (!patient) {
      Alert.alert('Falta el paciente', 'Selecciona un paciente para la cita.');
      return;
    }

    if (!isValidDate(fecha.trim())) {
      Alert.alert(
        'Fecha inválida',
        'Usa el formato AAAA-MM-DD. Ejemplo: 2026-10-24.'
      );
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora.trim())) {
      Alert.alert('Hora inválida', 'Usa el formato de 24 horas. Ejemplo: 09:30.');
      return;
    }

    if (!motivo.trim() || !medico.trim()) {
      Alert.alert('Campos obligatorios', 'Completa el motivo y el médico.');
      return;
    }

    const payload = {
      pacienteId: patient.id,
      paciente: patient.nombre,
      fecha: fecha.trim(),
      hora: hora.trim(),
      motivo: motivo.trim(),
      medico: medico.trim(),
      estado,
      notas: notas.trim(),
    };

    if (editing) {
      updateAppointment(editing.id, payload);
    } else {
      addAppointment(payload);
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons
              name={editing ? 'create-outline' : 'calendar-outline'}
              size={22}
              color={colors.primaryDark}
            />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              {editing ? 'Actualiza la cita' : 'Agenda una nueva cita'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              Completa los datos de la consulta.
            </Text>
          </View>
        </View>

        <AppCard style={styles.card}>
          <ChipSelect
            label="Paciente"
            options={patientOptions}
            value={selectedPatientId}
            onChange={setSelectedPatientId}
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <FormField
                label="Fecha (AAAA-MM-DD)"
                value={fecha}
                onChangeText={setFecha}
                placeholder="2026-10-24"
                keyboardType="numbers-and-punctuation"
              />
            </View>
            <View style={styles.half}>
              <FormField
                label="Hora (HH:MM)"
                value={hora}
                onChangeText={setHora}
                placeholder="09:30"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>

          <FormField
            label="Motivo de la consulta"
            value={motivo}
            onChangeText={setMotivo}
            placeholder="Ej. Control de asma"
          />

          <FormField
            label="Médico responsable"
            value={medico}
            onChangeText={setMedico}
            placeholder="Nombre del médico"
          />

          <ChipSelect
            label="Estado"
            options={statusOptions}
            value={estado}
            onChange={setEstado}
          />

          <FormField
            label="Notas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Indicaciones, observaciones o recordatorios"
            multiline
          />
        </AppCard>

        <View style={styles.actions}>
          <AppButton
            title={editing ? 'Guardar cambios' : 'Crear cita'}
            icon={editing ? 'save-outline' : 'checkmark-circle-outline'}
            onPress={handleSubmit}
            fullWidth
          />
          <AppButton
            title="Cancelar"
            variant="ghost"
            onPress={() => navigation.goBack()}
            fullWidth
            style={styles.cancel}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.primaryDeep,
  },
  bannerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.primaryDark,
  },
  card: {
    paddingBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  half: {
    flex: 1,
  },
  actions: {
    marginTop: spacing.lg,
  },
  cancel: {
    marginTop: spacing.xs,
  },
});

export default AppointmentFormScreen;
