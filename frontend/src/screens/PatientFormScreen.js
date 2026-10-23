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

const sexOptions = [
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Otro', label: 'Otro' },
];

const bloodOptions = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(
  (value) => ({ value, label: value })
);

const isValidISODate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const calculateAge = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;

  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  ) {
    age -= 1;
  }

  return age;
};

const PatientFormScreen = ({ navigation, route }) => {
  const { patients, addPatient, updatePatient } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
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
  const [correo, setCorreo] = useState(editing?.correo || '');
  const [fechaNacimiento, setFechaNacimiento] = useState(
    editing?.fechaNacimiento || ''
  );
  const [contactoEmergencia, setContactoEmergencia] = useState(
    editing?.contactoEmergencia || ''
  );
  const [telefonoEmergencia, setTelefonoEmergencia] = useState(
    editing?.telefonoEmergencia || ''
  );
  const [tipoSangre, setTipoSangre] = useState(editing?.tipoSangre || 'O+');
  const [condicion, setCondicion] = useState(editing?.condicion || '');
  const [alergias, setAlergias] = useState(editing?.alergias || 'Ninguna');
  const [direccion, setDireccion] = useState(editing?.direccion || '');
  const [notas, setNotas] = useState(editing?.notas || '');
  const [saving, setSaving] = useState(false);

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
    setCorreo(current?.correo || '');
    setFechaNacimiento(current?.fechaNacimiento || '');
    setContactoEmergencia(current?.contactoEmergencia || '');
    setTelefonoEmergencia(current?.telefonoEmergencia || '');
    setTipoSangre(current?.tipoSangre || 'O+');
    setCondicion(current?.condicion || '');
    setAlergias(current?.alergias || 'Ninguna');
    setDireccion(current?.direccion || '');
    setNotas(current?.notas || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleBirthDateChange = (value) => {
    setFechaNacimiento(value);

    // Si la fecha es válida, calcula la edad automáticamente.
    if (isValidISODate(value)) {
      setEdad(String(Math.max(calculateAge(value), 0)));
    }
  };

  const handleSubmit = async () => {
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

    if (fechaNacimiento.trim() && !isValidISODate(fechaNacimiento.trim())) {
      Alert.alert(
        'Fecha inválida',
        'Usa el formato AAAA-MM-DD, por ejemplo 2019-05-14.'
      );
      return;
    }

    if (correo.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      Alert.alert(
        'Correo inválido',
        'Escribe un correo electrónico válido, por ejemplo tutor@correo.com.'
      );
      return;
    }

    const payload = {
      nombre: nombre.trim(),
      edad: edad.trim(),
      sexo,
      tutor: tutor.trim(),
      telefono: telefono.trim(),
      correo: correo.trim(),
      fechaNacimiento: fechaNacimiento.trim(),
      contactoEmergencia: contactoEmergencia.trim(),
      telefonoEmergencia: telefonoEmergencia.trim(),
      tipoSangre,
      condicion: condicion.trim() || 'Sin condición registrada',
      alergias: alergias.trim() || 'Ninguna',
      direccion: direccion.trim(),
      notas: notas.trim(),
    };

    try {
      setSaving(true);

      if (editing) {
        await updatePatient(editing.id, payload);
      } else {
        await addPatient(payload);
      }

      navigation.goBack();
    } catch (error) {
      console.warn('[patients] No se pudo guardar el paciente.', error);
      Alert.alert(
        'No se pudo guardar',
        'Ocurrió un error al escribir en la base de datos. Intenta de nuevo.'
      );
    } finally {
      setSaving(false);
    }
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
              Los datos se guardan en la base SQLite del dispositivo.
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

          <FormField
            label="Fecha de nacimiento"
            value={fechaNacimiento}
            onChangeText={handleBirthDateChange}
            placeholder="AAAA-MM-DD (ej. 2019-05-14)"
            keyboardType="numbers-and-punctuation"
            maxLength={10}
            autoCapitalize="none"
          />

          <FormField
            label="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            placeholder="tutor@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

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

          <View style={styles.row}>
            <View style={styles.half}>
              <FormField
                label="Contacto de emergencia"
                value={contactoEmergencia}
                onChangeText={setContactoEmergencia}
                placeholder="Nombre completo"
                autoCapitalize="words"
              />
            </View>
            <View style={styles.half}>
              <FormField
                label="Teléfono de emergencia"
                value={telefonoEmergencia}
                onChangeText={setTelefonoEmergencia}
                placeholder="+503 0000 0000"
                keyboardType="phone-pad"
              />
            </View>
          </View>

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
            loading={saving}
            disabled={saving}
            fullWidth
          />
          <AppButton
            title="Cancelar"
            variant="ghost"
            onPress={() => navigation.goBack()}
            disabled={saving}
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
      backgroundColor: colors.primarySoft,
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
