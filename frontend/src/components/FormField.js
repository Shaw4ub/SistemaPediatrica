import React from 'react';
import { StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { colors, radius, spacing } from '../theme';

/**
 * Campo de formulario con etiqueta. Reutiliza estilos en todas las screens.
 */
export const FormField = ({ label, style, multiline, ...props }) => (
  <View style={styles.field}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <TextInput
      style={[
        styles.input,
        multiline && styles.multiline,
        style,
      ]}
      placeholderTextColor={colors.subtle}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      {...props}
    />
  </View>
);

/**
 * Selector de opciones en forma de chips (pacientes, sexo, estado, etc.).
 */
export const ChipSelect = ({ label, options, value, onChange }) => (
  <View style={styles.field}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={styles.chips}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.chip, selected && styles.chipSelected]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            {option.icon ? (
              <Text style={[styles.chipIcon, selected && styles.chipTextSelected]}>
                {option.icon}
              </Text>
            ) : null}
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
  },
  multiline: {
    minHeight: 92,
    paddingTop: spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.muted,
  },
  chipTextSelected: {
    color: colors.primaryDeep,
    fontWeight: '700',
  },
  chipIcon: {
    fontSize: 12,
    color: colors.muted,
    marginRight: 4,
  },
});

export default FormField;
