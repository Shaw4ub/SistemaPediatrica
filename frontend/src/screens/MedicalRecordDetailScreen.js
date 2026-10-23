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
    { text: 'Eliminar', style: 'destructive', onPress: onConfirm },
  ]);
};

const MedicalRecordDetailScreen = ({ navigation, route }) => {
  const { records, deleteRecord, formatDate } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const { recordId } = route.params || {};
  const record = records.find((item) => item.id === recordId);

  if (!record) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="document-text-outline"
          title="Registro no encontrado"
          message="El registro clínico que buscas ya no está disponible."
          action={
            <AppButton
              title="Volver al historial"
              variant="soft"
              icon="arrow-back"
              onPress={() => navigation.goBack()}
            />
          }
        />
      </View>
    );
  }

  const handleDelete = () => {
    confirmAction(
      'Eliminar registro',
      'El registro se eliminará de forma permanente.',
      () => {
        deleteRecord(record.id);
        navigation.goBack();
      }
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Avatar name={record.paciente} size={62} />
        <View style={styles.heroInfo}>
          <Text style={styles.patient}>{record.paciente}</Text>
          <Text style={styles.diagnosis}>{record.diagnostico}</Text>
        </View>
        <View style={styles.recordBadge}>
          <Ionicons name="pulse" size={12} color={colors.purple} />
          <Text style={styles.recordBadgeText}>Registro</Text>
        </View>
      </View>

      <View style={styles.dateBanner}>
        <View style={styles.dateIcon}>
          <Ionicons name="calendar" size={22} color={colors.purple} />
        </View>
        <View style={styles.dateTextWrap}>
          <Text style={styles.dateLabel}>Fecha de la consulta</Text>
          <Text style={styles.dateValue}>
            {capitalize(
              formatDate(record.fecha, {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            )}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Detalle clínico</Text>
      <AppCard style={styles.card}>
        <InfoRow
          icon="person-outline"
          label="Paciente"
          value={record.paciente}
        />
        <InfoRow
          icon="medkit-outline"
          label="Diagnóstico"
          value={record.diagnostico}
        />
        <InfoRow
          icon="bandage-outline"
          label="Tratamiento"
          value={record.tratamiento}
        />
        <InfoRow
          icon="person-circle-outline"
          label="Médico responsable"
          value={record.medico}
          last
        />
      </AppCard>

      {record.notas ? (
        <>
          <Text style={styles.sectionTitle}>Notas y observaciones</Text>
          <AppCard style={styles.notesCard}>
            <View style={styles.notesIcon}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color={colors.purple}
              />
            </View>
            <Text style={styles.notesText}>{record.notas}</Text>
          </AppCard>
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Acciones</Text>
      <View style={styles.actions}>
        <AppButton
          title="Editar registro"
          icon="create-outline"
          onPress={() =>
            navigation.navigate('RecordForm', { recordId: record.id })
          }
          style={styles.action}
        />
        <AppButton
          title="Ver expediente"
          icon="folder-open-outline"
          variant="outline"
          onPress={() =>
            navigation.getParent()?.navigate('PacientesTab', {
              screen: 'PatientDetail',
              params: { patientId: record.pacienteId },
            })
          }
          style={styles.action}
        />
      </View>

      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => [
          styles.deleteAction,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="trash-outline" size={16} color={colors.subtle} />
        <Text style={styles.deleteText}>Eliminar registro</Text>
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
      marginRight: spacing.sm,
    },
    patient: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    diagnosis: {
      marginTop: 2,
      fontSize: 12.5,
      color: colors.muted,
    },
    recordBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: radius.pill,
      backgroundColor: colors.purpleSoft,
    },
    recordBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.purple,
    },
    dateBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radius.lg,
      backgroundColor: colors.purpleSoft,
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
      color: colors.purple,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    dateValue: {
      marginTop: 2,
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
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
      opacity: 0.78,
    },
  });

export default MedicalRecordDetailScreen;
