import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';
import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import {
  getDatabaseSummary,
  getTableRows,
  getTableSchema,
  runReadOnlyQuery,
} from '../database/db';
import { radius, spacing } from '../theme';

const CELL_WIDTH = 148;

const formatCell = (value) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * Tabla de solo lectura con desplazamiento horizontal.
 */
const DataTable = ({ columns, rows, styles, emptyMessage }) => {
  if (!columns.length) {
    return <Text style={styles.tableEmpty}>{emptyMessage}</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      style={styles.tableScroll}
      contentContainerStyle={styles.tableContent}
    >
      <View>
        <View style={styles.tableHeader}>
          {columns.map((column) => (
            <Text
              key={column}
              style={[styles.cell, styles.headerCell]}
              numberOfLines={1}
            >
              {column}
            </Text>
          ))}
        </View>

        {rows.map((row, index) => (
          <View
            key={index}
            style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}
          >
            {columns.map((column) => (
              <Text key={column} style={styles.cell} numberOfLines={2}>
                {formatCell(row[column])}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

/**
 * Visor de la base SQLite local.
 *
 * Permite consultar el esquema y los registros sin salir de la app, además de
 * ejecutar consultas de solo lectura. La misma base aparece en la pestaña
 * "Expo SQLite" de las DevTools cuando se ejecuta `npx expo start`.
 */
const SqliteViewerScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );

  const [summary, setSummary] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [schema, setSchema] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableError, setTableError] = useState(null);

  const [query, setQuery] = useState('SELECT * FROM pacientes;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [queryRunning, setQueryRunning] = useState(false);

  const selectTable = useCallback(async (tableName) => {
    setSelectedTable(tableName);
    setTableLoading(true);
    setTableError(null);

    try {
      const [columns, data] = await Promise.all([
        getTableSchema(tableName),
        getTableRows(tableName, 50),
      ]);

      setSchema(columns);
      setTableColumns(data.columns);
      setTableRows(data.rows);
    } catch (loadError) {
      console.warn('[sqlite] No se pudo leer la tabla.', loadError);
      setTableError(loadError.message || 'No se pudo leer la tabla.');
      setSchema([]);
      setTableColumns([]);
      setTableRows([]);
    } finally {
      setTableLoading(false);
    }
  }, []);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getDatabaseSummary();
      setSummary(data);

      if (data.tables.length > 0) {
        await selectTable(data.tables[0].name);
      }
    } catch (loadError) {
      console.warn('[sqlite] No se pudo abrir la base de datos.', loadError);
      setError(loadError.message || 'No se pudo abrir la base de datos.');
    } finally {
      setLoading(false);
    }
  }, [selectTable]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleRunQuery = async () => {
    setQueryRunning(true);
    setQueryError(null);

    try {
      const result = await runReadOnlyQuery(query);
      setQueryResult(result);
    } catch (runError) {
      setQueryResult(null);
      setQueryError(runError.message || 'No se pudo ejecutar la consulta.');
    } finally {
      setQueryRunning(false);
    }
  };

  const selectedSummary = summary?.tables.find(
    (table) => table.name === selectedTable
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="server-outline" size={24} color={colors.primaryDeep} />
        </View>
        <View style={styles.heroInfo}>
          <Text style={styles.heroTitle}>
            {summary?.name || 'Base de datos SQLite'}
          </Text>
          <Text style={styles.heroMeta}>
            {summary
              ? `SQLite ${summary.version} · ${summary.tables.length} ${
                  summary.tables.length === 1 ? 'tabla' : 'tablas'
                }`
              : 'Leyendo la base local…'}
          </Text>
          {summary?.path ? (
            <Text style={styles.heroPath} numberOfLines={2}>
              {summary.path}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.note}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color={colors.primaryDeep}
        />
        <Text style={styles.noteText}>
          Datos persistidos en el dispositivo. También puedes verlos en la
          pestaña «Expo SQLite» de las DevTools mientras la app corre con Expo.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color={colors.primaryDark} />
          <Text style={styles.loadingText}>Abriendo la base de datos…</Text>
        </View>
      ) : null}

      {error ? (
        <AppCard style={styles.errorCard}>
          <Ionicons name="warning-outline" size={22} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <AppButton
            title="Reintentar"
            icon="refresh-outline"
            size="sm"
            variant="soft"
            onPress={loadSummary}
          />
        </AppCard>
      ) : null}

      {summary ? (
        <>
          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>
              Tablas
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Actualizar datos"
              onPress={loadSummary}
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="refresh-outline"
                size={15}
                color={colors.primaryDeep}
              />
              <Text style={styles.refreshText}>Actualizar</Text>
            </Pressable>
          </View>

          <View style={styles.tableChips}>
            {summary.tables.map((table) => {
              const active = table.name === selectedTable;

              return (
                <Pressable
                  key={table.name}
                  onPress={() => selectTable(table.name)}
                  style={({ pressed }) => [
                    styles.tableChip,
                    active && styles.tableChipActive,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons
                    name="grid-outline"
                    size={13}
                    color={active ? colors.primaryDeep : colors.muted}
                  />
                  <Text
                    style={[
                      styles.tableChipText,
                      active && styles.tableChipTextActive,
                    ]}
                  >
                    {table.name}
                  </Text>
                  <View
                    style={[
                      styles.tableCount,
                      active && styles.tableCountActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tableCountText,
                        active && styles.tableCountTextActive,
                      ]}
                    >
                      {table.rows}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {tableLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={colors.primaryDark} />
              <Text style={styles.loadingText}>Leyendo registros…</Text>
            </View>
          ) : null}

          {tableError ? (
            <Text style={styles.inlineError}>{tableError}</Text>
          ) : null}

          {!tableLoading && selectedTable ? (
            <>
              <Text style={styles.sectionTitle}>Esquema de {selectedTable}</Text>
              <AppCard style={styles.schemaCard}>
                {schema.length ? (
                  schema.map((column, index) => (
                    <View
                      key={column.name}
                      style={[
                        styles.schemaRow,
                        index === schema.length - 1 && styles.schemaRowLast,
                      ]}
                    >
                      <View style={styles.schemaMain}>
                        <Text style={styles.schemaName}>{column.name}</Text>
                        <Text style={styles.schemaType}>
                          {column.type || 'TEXT'}
                        </Text>
                      </View>
                      <View style={styles.schemaTags}>
                        {column.pk ? (
                          <View style={styles.schemaTagPrimary}>
                            <Text style={styles.schemaTagPrimaryText}>PK</Text>
                          </View>
                        ) : null}
                        {column.notnull ? (
                          <View style={styles.schemaTag}>
                            <Text style={styles.schemaTagText}>NOT NULL</Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.tableEmpty}>Sin columnas.</Text>
                )}
              </AppCard>

              <View style={styles.sectionHead}>
                <Text style={[styles.sectionTitle, styles.sectionTitleInline]}>
                  Registros de {selectedTable}
                </Text>
                <Text style={styles.sectionMeta}>
                  {selectedSummary?.rows ?? tableRows.length} en total · se
                  muestran {tableRows.length}
                </Text>
              </View>

              {tableRows.length ? (
                <DataTable
                  columns={tableColumns}
                  rows={tableRows}
                  styles={styles}
                  emptyMessage="Esta tabla no tiene registros."
                />
              ) : (
                <Text style={styles.tableEmpty}>
                  Esta tabla no tiene registros.
                </Text>
              )}
            </>
          ) : null}

          <Text style={[styles.sectionTitle, styles.queryTitle]}>
            Consulta de solo lectura
          </Text>
          <AppCard style={styles.queryCard}>
            <TextInput
              style={styles.queryInput}
              value={query}
              onChangeText={setQuery}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="SELECT * FROM pacientes;"
              placeholderTextColor={colors.subtle}
            />
            <AppButton
              title="Ejecutar consulta"
              icon="play-outline"
              size="sm"
              onPress={handleRunQuery}
              loading={queryRunning}
              disabled={queryRunning}
              fullWidth
            />
            <Text style={styles.queryHint}>
              Permitido: SELECT, PRAGMA, WITH y EXPLAIN. Sin escrituras.
            </Text>

            {queryError ? (
              <Text style={styles.inlineError}>{queryError}</Text>
            ) : null}

            {queryResult ? (
              <View style={styles.queryResult}>
                <Text style={styles.queryResultMeta}>
                  {queryResult.total}{' '}
                  {queryResult.total === 1 ? 'fila' : 'filas'}
                  {queryResult.truncated ? ' · mostrando 100' : ''}
                </Text>
                <DataTable
                  columns={queryResult.columns}
                  rows={queryResult.rows}
                  styles={styles}
                  emptyMessage="La consulta no devolvió filas."
                />
              </View>
            ) : null}
          </AppCard>
        </>
      ) : null}
    </ScrollView>
  );
};

const monoFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

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
      maxWidth: 860,
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
    heroIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    heroInfo: {
      flex: 1,
    },
    heroTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
    },
    heroMeta: {
      marginTop: 2,
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.primaryDeep,
    },
    heroPath: {
      marginTop: 4,
      fontSize: 10,
      fontFamily: monoFont,
      color: colors.subtle,
    },
    note: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
    },
    noteText: {
      flex: 1,
      fontSize: 11,
      lineHeight: 16,
      color: colors.primaryDeep,
    },
    loading: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xl,
    },
    loadingText: {
      fontSize: 12,
      color: colors.muted,
    },
    errorCard: {
      marginTop: spacing.lg,
      alignItems: 'center',
      gap: spacing.sm,
    },
    errorText: {
      fontSize: 12,
      textAlign: 'center',
      color: colors.danger,
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
      gap: spacing.sm,
    },
    sectionTitle: {
      marginTop: spacing.xl,
      marginBottom: spacing.sm,
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    sectionMeta: {
      flexShrink: 1,
      fontSize: 10.5,
      color: colors.muted,
      textAlign: 'right',
    },
    sectionTitleInline: {
      marginTop: 0,
      marginBottom: 0,
    },
    refreshButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 5,
      borderRadius: radius.pill,
      backgroundColor: colors.primarySoft,
    },
    refreshText: {
      fontSize: 10.5,
      fontWeight: '700',
      color: colors.primaryDeep,
    },
    tableChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tableChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.md,
      paddingVertical: 7,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    tableChipActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
    },
    tableChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.muted,
    },
    tableChipTextActive: {
      color: colors.primaryDeep,
    },
    tableCount: {
      minWidth: 20,
      paddingHorizontal: 5,
      paddingVertical: 1,
      borderRadius: radius.pill,
      backgroundColor: colors.neutralSoft,
      alignItems: 'center',
    },
    tableCountActive: {
      backgroundColor: colors.primary,
    },
    tableCountText: {
      fontSize: 9.5,
      fontWeight: '800',
      color: colors.muted,
    },
    tableCountTextActive: {
      color: isDark ? '#082f49' : '#ffffff',
    },
    schemaCard: {
      paddingVertical: spacing.xs,
    },
    schemaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    schemaRowLast: {
      borderBottomWidth: 0,
    },
    schemaMain: {
      flex: 1,
    },
    schemaName: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.text,
      fontFamily: monoFont,
    },
    schemaType: {
      marginTop: 1,
      fontSize: 10,
      color: colors.muted,
      fontFamily: monoFont,
    },
    schemaTags: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    schemaTag: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: colors.neutralSoft,
    },
    schemaTagText: {
      fontSize: 8,
      fontWeight: '800',
      color: colors.muted,
    },
    schemaTagPrimary: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: radius.sm,
      backgroundColor: colors.amberSoft,
    },
    schemaTagPrimaryText: {
      fontSize: 8,
      fontWeight: '800',
      color: colors.amberText,
    },
    tableScroll: {
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    tableContent: {
      paddingBottom: 1,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: colors.primarySoft,
    },
    tableRow: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    tableRowAlt: {
      backgroundColor: colors.surfaceMuted,
    },
    cell: {
      width: CELL_WIDTH,
      paddingHorizontal: spacing.sm,
      paddingVertical: 8,
      fontSize: 10.5,
      color: colors.textSecondary,
    },
    headerCell: {
      fontWeight: '800',
      color: colors.primaryDeep,
      fontFamily: monoFont,
      paddingVertical: 9,
    },
    tableEmpty: {
      padding: spacing.lg,
      fontSize: 12,
      textAlign: 'center',
      color: colors.muted,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    queryTitle: {
      marginTop: spacing.xxl,
    },
    queryCard: {
      gap: spacing.sm,
    },
    queryInput: {
      minHeight: 84,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: 12,
      fontFamily: monoFont,
      color: colors.text,
      backgroundColor: colors.surfaceMuted,
      textAlignVertical: 'top',
    },
    queryHint: {
      fontSize: 10,
      color: colors.subtle,
    },
    queryResult: {
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    queryResultMeta: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.muted,
    },
    inlineError: {
      marginTop: spacing.sm,
      padding: spacing.sm,
      borderRadius: radius.sm,
      backgroundColor: colors.dangerSoft,
      fontSize: 11,
      color: colors.danger,
    },
    pressed: {
      opacity: 0.8,
    },
  });

export default SqliteViewerScreen;
