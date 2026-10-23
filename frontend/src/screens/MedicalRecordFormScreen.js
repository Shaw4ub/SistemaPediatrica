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
import { useTheme } from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import { FormField, ChipSelect } from '../components/FormField';
import { radius, spacing } from '../theme';

const isValidDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime());
};

const MedicalRecordFormScreen = ({ navigation, route }) => {
  const { patients, records, addRecord, updateRecord, todayISO } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const { recordId, patientId } = route.params || {};
  const editing = useMemo(
    () => records.find((record) => record.id === recordId),
    [records, recordId]
  );

  const [selectedPatientId, setSelectedPatientId] = useState(
    editing?.pacienteId || patientId || patients[0]?.id || ''
  );
  const [fecha, setFecha] = useState(editing?.fecha || todayISO());
  const [diagnostico, setDiagnostico] = useState(editing?.diagnostico || '');
  const [tratamiento, setTratamiento] = useState(editing?.tratamiento || '');
  const [medico, setMedico] = useState(
    editing?.medico || 'Dra. Elena Ruiz'
  );
  const [notas, setNotas] = useState(editing?.notas || '');

  const patientOptions = patients.map((patient) => ({
    value: patient.id,
    label: patient.nombre,
  }));

  // Mantiene el formulario sincronizado si la pantalla ya estaba montada en
  // el stack (navegación entre pestañas).
  useEffect(() => {
    const current = recordId
      ? records.find((record) => record.id === recordId)
      : null;

    setSelectedPatientId(
      current?.pacienteId || patientId || patients[0]?.id || ''
    );
    setFecha(current?.fecha || todayISO());
    setDiagnostico(current?.diagnostico || '');
    setTratamiento(current?.tratamiento || '');
    setMedico(current?.medico || 'Dra. Elena Ruiz');
    setNotas(current?.notas || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId, patientId]);

  // Selecciona el primer paciente cuando la base termina de cargar.
  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const handleSubmit = () => {
    const patient = patients.find((item) => item.id === selectedPatientId);

    if (!patient) {
      Alert.alert('Falta el paciente', 'Selecciona el paciente del registro.');
      return;
    }

    if (!isValidDate(fecha.trim())) {
      Alert.alert(
        'Fecha inválida',
        'Usa el formato AAAA-MM-DD. Ejemplo: 2026-10-24.'
      );
      return;
    }

    if (!diagnostico.trim() || !tratamiento.trim() || !medico.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'Completa el diagnóstico, el tratamiento y el médico.'
      );
      return;
    }

    const payload = {
      pacienteId: patient.id,
      paciente: patient.nombre,
      fecha: fecha.trim(),
      diagnostico: diagnostico.trim(),
      tratamiento: tratamiento.trim(),
      medico: medico.trim(),
      notas: notas.trim(),
    };

    if (editing) {
      updateRecord(editing.id, payload);
    } else {
      addRecord(payload);
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
              name={editing ? 'create-outline' : 'document-text-outline'}
              size={22}
              color={colors.purple}
            />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              {editing ? 'Actualizar registro' : 'Nuevo registro clínico'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              Documenta el diagnóstico y el tratamiento indicado.
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

          <FormField
            label="Fecha de la consulta (AAAA-MM-DD)"
            value={fecha}
            onChangeText={setFecha}
            placeholder="2026-10-24"
            keyboardType="numbers-and-punctuation"
          />

          <FormField
            label="Diagnóstico *"
            value={diagnostico}
            onChangeText={setDiagnostico}
            placeholder="Ej. Rinitis alérgica"
          />

          <FormField
            label="Tratamiento *"
            value={tratamiento}
            onChangeText={setTratamiento}
            placeholder="Medicamentos e indicaciones"
            multiline
          />

          <FormField
            label="Médico responsable *"
            value={medico}
            onChangeText={setMedico}
            placeholder="Nombre del médico"
          />

          <FormField
            label="Notas y observaciones"
            value={notas}
            onChangeText={setNotas}
            placeholder="Evolución, recomendaciones o próximos controles"
            multiline
          />
        </AppCard>

        <View style={styles.actions}>
          <AppButton
            title={editing ? 'Guardar cambios' : 'Registrar consulta'}
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
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.purpleSoft,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    bannerIcon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      backgroundColor: colors.surface,
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
      color: colors.purple,
    },
    bannerSubtitle: {
      marginTop: 2,
      fontSize: 12,
      color: colors.textSecondary,
    },
    card: {
      paddingBottom: spacing.xs,
    },
    actions: {
      marginTop: spacing.lg,
    },
    cancel: {
      marginTop: spacing.xs,
    },
  });

export default MedicalRecordFormScreen;
