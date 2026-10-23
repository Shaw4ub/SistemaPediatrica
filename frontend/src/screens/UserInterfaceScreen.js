import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useClinic } from '../context/ClinicContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/Avatar';
import EmptyState from '../components/EmptyState';
import { radius, shadows, spacing } from '../theme';

const UserInterfaceScreen = ({ navigation }) => {
  const { patients } = useClinic();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const [query, setQuery] = useState('');

  const filteredPatients = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return patients;

    return patients.filter(
      (patient) =>
        patient.nombre.toLowerCase().includes(term) ||
        patient.tutor?.toLowerCase().includes(term) ||
        patient.condicion?.toLowerCase().includes(term)
    );
  }, [patients, query]);

  const withCondition = patients.filter(
    (patient) => patient.condicion && patient.condicion !== 'Ninguna'
  ).length;

  const renderItem = ({ item }) => (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        navigation.navigate('PatientDetail', { patientId: item.id })
      }
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Avatar name={item.nombre} size={50} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.edad} años · {item.sexo}
        </Text>
        <View style={styles.tags}>
          {item.condicion ? (
            <View style={styles.conditionTag}>
              <Ionicons
                name="pulse-outline"
                size={11}
                color={colors.primaryDeep}
              />
              <Text style={styles.conditionText} numberOfLines={1}>
                {item.condicion}
              </Text>
            </View>
          ) : null}
          <Text style={styles.tutor} numberOfLines={1}>
            Tutor: {item.tutor}
          </Text>
        </View>
      </View>

      <View style={styles.chevron}>
        <Ionicons
          name="chevron-forward"
          size={17}
          color={colors.primaryDeep}
        />
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={isDark}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.summary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{patients.length}</Text>
                <Text style={styles.summaryLabel}>Pacientes</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{withCondition}</Text>
                <Text style={styles.summaryLabel}>En seguimiento</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>100%</Text>
                <Text style={styles.summaryLabel}>Expedientes</Text>
              </View>
            </View>

            <Text style={styles.title}>Directorio de pacientes</Text>
            <Text style={styles.subtitle}>
              Consulta y actualiza cada expediente
            </Text>

            <View style={styles.searchWrap}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por nombre, tutor o condición"
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

            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Expedientes</Text>
              <Text style={styles.listCount}>
                {filteredPatients.length}{' '}
                {filteredPatients.length === 1 ? 'paciente' : 'pacientes'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No se encontraron pacientes"
            message={
              query
                ? 'Prueba con otro nombre o limpia la búsqueda.'
                : 'Registra tu primer paciente para comenzar.'
            }
          />
        }
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Nuevo paciente"
        onPress={() => navigation.navigate('PatientForm', {})}
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
    summaryValue: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.primaryDeep,
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
    listHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xl,
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
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    info: {
      flex: 1,
      marginLeft: spacing.md,
      marginRight: spacing.sm,
    },
    name: {
      fontSize: 14.5,
      fontWeight: '800',
      color: colors.text,
    },
    meta: {
      marginTop: 1,
      fontSize: 11.5,
      color: colors.muted,
    },
    tags: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      gap: spacing.sm,
    },
    conditionTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
      maxWidth: '55%',
    },
    conditionText: {
      fontSize: 9.5,
      fontWeight: '700',
      color: colors.primaryDeep,
      flexShrink: 1,
    },
    tutor: {
      flex: 1,
      fontSize: 10,
      color: colors.subtle,
    },
    chevron: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
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
      opacity: 0.82,
    },
  });

export default UserInterfaceScreen;
