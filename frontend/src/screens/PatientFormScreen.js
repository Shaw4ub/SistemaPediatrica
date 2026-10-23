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

const sexOptions = [
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Otro', label: 'Otro' },
];

const bloodOptions = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(
  (value) => ({ value, label: value })
);

const PatientFormScreen = ({ navigation, route }) => {
  const { patients, addPatient, updatePatient } = useClinic();
  const { patientId } = route.params || {};
  const editing = useMemo(
    () => patients.find((patient) => patient.id === patientId),
    [patients, patientId]
  );

  const [nombre, setNombre] = useState(editing?.nombre || '');
  const [edad, setEdad] = useState(editing?.edad || '');
  const [sexo, setSexo] = useState(editing?.sexo || 'Femenino');
  const [tutor, setTutor] = useState(editing?.tutor || '');
  const [telefono, setTelefono] = useState(editing?.telefono || '');
  const [tipoSangre, setTipoSangre] = useState(editing?.tipoSangre || 'O+');
  const [condicion, setCondicion] = useState(editing?.condicion || '');
  const [alergias, setAlergias] = useState(editing?.alergias || 'Ninguna');
  const [direccion, setDireccion] = useState(editing?.direccion || '');
  const [notas, setNotas] = useState(editing?.notas || '');

  // Sincroniza los campos si se reutiliza la pantalla con otro paciente.
  useEffect(() => {
    const current = patientId
      ? patients.find((patient) => patient.id === patientId)
      : null;

    setNombre(current?.nombre || '');
    setEdad(current?.edad || '');
    setSexo(current?.sexo || 'Femenino');
    setTutor(current?.tutor || '');
    setTelefono(current?.telefono || '');
    setTipoSangre(current?.tipoSangre || 'O+');
    setCondicion(current?.condicion || '');
    setAlergias(current?.alergias || 'Ninguna');
    setDireccion(current?.direccion || '');
    setNotas(current?.notas || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleSubmit = () => {
    if (!nombre.trim()) {
      Alert.alert('Falta el nombre', 'Escribe el nombre del paciente.');
      return;
    }

    if (!edad.trim() || Number.isNaN(Number(edad)) || Number(edad) < 0) {
      Alert.alert('Edad inválida', 'Ingresa una edad numérica válida.');
      return;
    }

    if (!tutor.trim()) {
      Alert.alert(
        'Falta el responsable',
        'Indica el tutor o responsable del paciente.'
      );
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      edad: edad.trim(),
      sexo,
      tutor: tutor.trim(),
      telefono: telefono.trim(),
      tipoSangre,
      condicion: condicion.trim() || 'Sin condición registrada',
      alergias: alergias.trim() || 'Ninguna',
      direccion: direccion.trim(),
      notas: notas.trim(),
    };

    if (editing) {
      updatePatient(editing.id, payload);
    } else {
      addPatient(payload);
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
              name={editing ? 'person-outline' : 'person-add-outline'}
              size={22}
              color={colors.primaryDark}
            />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>
              {editing ? 'Actualizar expediente' : 'Nuevo paciente'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              Los datos se guardan en el directorio local.
            </Text>
          </View>
        </View>

        <AppCard style={styles.card}>
          <FormField
            label="Nombre completo *"
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. María Pérez"
            autoCapitalize="words"
          />

          <View style={styles.row}>
            <View style={styles.half}>
              <FormField
                label="Edad *"
                value={edad}
                onChangeText={setEdad}
                placeholder="7"
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.half}>
              <FormField
                label="Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                placeholder="+503 0000 0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <ChipSelect
            label="Sexo"
            options={sexOptions}
            value={sexo}
            onChange={setSexo}
          />

          <FormField
            label="Tutor / responsable *"
            value={tutor}
            onChangeText={setTutor}
            placeholder="Nombre del padre, madre o encargado"
            autoCapitalize="words"
          />

          <ChipSelect
            label="Tipo de sangre"
            options={bloodOptions}
            value={tipoSangre}
            onChange={setTipoSangre}
          />

          <FormField
            label="Condición principal"
            value={condicion}
            onChangeText={setCondicion}
            placeholder="Ej. Asma"
          />

          <FormField
            label="Alergias"
            value={alergias}
            onChangeText={setAlergias}
            placeholder="Medicamentos, alimentos, etc."
          />

          <FormField
            label="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholder="Colonia, municipio, departamento"
          />

          <FormField
            label="Notas clínicas"
            value={notas}
            onChangeText={setNotas}
            placeholder="Observaciones relevantes del paciente"
            multiline
          />
        </AppCard>

        <View style={styles.actions}>
          <AppButton
            title={editing ? 'Guardar cambios' : 'Registrar paciente'}
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

export default PatientFormScreen;
