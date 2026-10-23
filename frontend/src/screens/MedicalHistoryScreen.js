import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useClinic } from '../context/ClinicContext';
import EmptyState from '../components/EmptyState';
import { colors, radius, shadows, spacing } from '../theme';

const getDayMonth = (isoDate) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const monthLabel = new Intl.DateTimeFormat('es-ES', { month: 'short' })
    .format(date)
    .replace('.', '');

  return { day, monthLabel: monthLabel.toUpperCase() };
};

const MedicalHistoryScreen = ({ navigation }) => {
  const { records, patients, formatDate } = useClinic();
  const [query, setQuery] = useState('');
  const [patientFilter, setPatientFilter] = useState('all');

  const patientFilters = useMemo(
    () =>
      patients.filter((patient) =>
        records.some((record) => record.pacienteId === patient.id)
      ),
    [patients, records]
  );

  const visibleRecords = useMemo(() => {
    const term = query.trim().toLowerCase();

    return [...records]
      .filter((record) => {
        const matchesPatient =
          patientFilter === 'all' || record.pacienteId === patientFilter;
        const matchesTerm =
          !term ||
          record.paciente.toLowerCase().includes(term) ||
          record.diagnostico.toLowerCase().includes(term) ||
          record.tratamiento.toLowerCase().includes(term);

        return matchesPatient && matchesTerm;
      })
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [records, query, patientFilter]);

  const uniquePatients = new Set(records.map((record) => record.pacienteId)).size;
  const lastRecord = [...records].sort((a, b) => b.fecha.localeCompare(a.fecha))[0];

  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleRecords}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{records.length}</Text>
                <Text style={styles.summaryLabel}>Registros</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{uniquePatients}</Text>
                <Text style={styles.summaryLabel}>Pacientes</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {lastRecord ? formatDate(lastRecord.fecha, {
                    day: '2-digit',
                    month: 'short',
                  }) : '—'}
                </Text>
                <Text style={styles.summaryLabel}>Último</Text>
              </View>
            </View>

            <Text style={styles.title}>Historial clínico</Text>
            <Text style={styles.subtitle}>
              Diagnósticos, tratamientos y notas de cada consulta
            </Text>

            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por paciente, diagnóstico o tratamiento"
                placeholderTextColor={colors.subtle}
                value={query}
                onChangeText={setQuery}
              />
              {query ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpiar búsqueda"
                  hitSlop={8}
                  onPress={() => setQuery('')}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.subtle}
                  />
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              <Pressable
                onPress={() => setPatientFilter('all')}
                style={[
                  styles.filter,
                  patientFilter === 'all' && styles.filterActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    patientFilter === 'all' && styles.filterTextActive,
                  ]}
                >
                  Todos
                </Text>
              </Pressable>

              {patientFilters.map((patient) => {
                const active = patientFilter === patient.id;

                return (
                  <Pressable
                    key={patient.id}
                    onPress={() => setPatientFilter(patient.id)}
                    style={[styles.filter, active && styles.filterActive]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        active && styles.filterTextActive,
                      ]}
                    >
                      {patient.nombre.split(' ')[0]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Registros médicos</Text>
              <Text style={styles.listCount}>
                {visibleRecords.length}{' '}
                {visibleRecords.length === 1 ? 'resultado' : 'resultados'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const date = getDayMonth(item.fecha);

          return (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                navigation.navigate('RecordDetail', { recordId: item.id })
              }
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.dateBlock}>
                <Text style={styles.dateDay}>{date.day}</Text>
                <Text style={styles.dateMonth}>{date.monthLabel}</Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.diagnosis} numberOfLines={1}>
                  {item.diagnostico}
                </Text>
                <Text style={styles.patient} numberOfLines={1}>
                  {item.paciente}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons
                    name="medkit-outline"
                    size={13}
                    color={colors.muted}
                  />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {item.tratamiento}
                  </Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {item.medico}
                  </Text>
                </View>
              </View>

              <View style={styles.chevron}>
                <Ionicons
                  name="chevron-forward"
                  size={17}
                  color={colors.purple}
                />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="No hay registros"
            message="Ajusta la búsqueda o agrega un nuevo registro clínico."
          />
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nuevo registro médico"
        onPress={() => navigation.navigate('RecordForm', {})}
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.purple,
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 10.5,
    fontWeight: '600',
    color: colors.muted,
  },
  summaryDivider: {
    width: 1,
    height: 30,
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    minHeight: 46,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 13.5,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  filters: {
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  filter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  filterTextActive: {
    color: '#ffffff',
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
    fontWeight: '600',
    color: colors.muted,
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
  },
  dateBlock: {
    width: 54,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.purple,
    lineHeight: 23,
  },
  dateMonth: {
    fontSize: 9.5,
    fontWeight: '800',
    color: colors.purple,
    letterSpacing: 0.7,
  },
  cardInfo: {
    flex: 1,
  },
  diagnosis: {
    fontSize: 14.5,
    fontWeight: '800',
    color: colors.text,
  },
  patient: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 10.5,
    color: colors.muted,
    flexShrink: 1,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginHorizontal: 6,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.purpleSoft,
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
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.floating,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  pressed: {
    opacity: 0.82,
  },
});

export default MedicalHistoryScreen;
