import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AppCard from '../components/AppCard';
import { useTheme } from '../context/ThemeContext';
import { radius, shadows, spacing } from '../theme';

const faqs = [
  {
    id: 'f1',
    question: '¿Cómo agendo una nueva cita?',
    answer:
      'Entra a la pestaña Citas y toca el botón + en la esquina inferior derecha. Completa el paciente, la fecha, la hora y el motivo, y guarda los cambios.',
  },
  {
    id: 'f2',
    question: '¿Cómo registro un paciente nuevo?',
    answer:
      'En la pestaña Pacientes toca el botón +, completa los datos del paciente y su responsable, y presiona “Registrar paciente”. El expediente quedará disponible de inmediato.',
  },
  {
    id: 'f3',
    question: '¿Dónde consulto el historial médico?',
    answer:
      'La pestaña Historial reúne todos los registros clínicos. Puedes filtrar por paciente o buscar por diagnóstico y tratamiento. Toca un registro para ver el detalle.',
  },
  {
    id: 'f4',
    question: '¿Puedo editar la información después de guardarla?',
    answer:
      'Sí. Abre el detalle de una cita, un paciente o un registro y usa el botón “Editar”. Los cambios se reflejan en toda la aplicación.',
  },
  {
    id: 'f5',
    question: '¿Cómo cambio mi contraseña?',
    answer:
      'Abre el menú lateral, entra a “Cambiar contraseña” y completa los campos. También puedes llegar desde Configuración, en la sección Cuenta y seguridad.',
  },
];

const steps = [
  {
    icon: 'calendar-outline',
    title: 'Agenda',
    description: 'Programa y consulta tus citas del día.',
  },
  {
    icon: 'people-outline',
    title: 'Pacientes',
    description: 'Administra expedientes y responsables.',
  },
  {
    icon: 'document-text-outline',
    title: 'Historial',
    description: 'Consulta diagnósticos y tratamientos.',
  },
];

const HelpScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const [expandedId, setExpandedId] = useState('f1');

  const openEmail = () => {
    Linking.openURL('mailto:soporte@clinicapediatrica.com').catch(() =>
      Alert.alert(
        'Contacto',
        'Escríbenos a soporte@clinicapediatrica.com'
      )
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons
            name="help-buoy-outline"
            size={26}
            color={colors.primaryDark}
          />
        </View>
        <Text style={styles.heroTitle}>¿Cómo podemos ayudarte?</Text>
        <Text style={styles.heroSubtitle}>
          Guías rápidas y respuestas a las dudas más frecuentes.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Primeros pasos</Text>
      <View style={styles.steps}>
        {steps.map((step) => (
          <View key={step.title} style={styles.stepCard}>
            <View style={styles.stepIcon}>
              <Ionicons name={step.icon} size={20} color={colors.primaryDark} />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Preguntas frecuentes</Text>
      <AppCard style={styles.faqCard}>
        {faqs.map((faq, index) => {
          const expanded = expandedId === faq.id;

          return (
            <View
              key={faq.id}
              style={[
                styles.faqItem,
                index !== faqs.length - 1 && styles.faqBorder,
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => setExpandedId(expanded ? null : faq.id)}
                style={styles.faqQuestion}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={17}
                  color={colors.primaryDark}
                />
              </Pressable>
              {expanded ? (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              ) : null}
            </View>
          );
        })}
      </AppCard>

      <Text style={styles.sectionTitle}>¿Necesitas más ayuda?</Text>
      <AppCard style={styles.contactCard}>
        <View style={styles.contactIcon}>
          <Ionicons name="mail-outline" size={22} color={colors.primaryDark} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Soporte técnico</Text>
          <Text style={styles.contactText}>soporte@clinicapediatrica.com</Text>
          <Text style={styles.contactText}>Lunes a viernes · 8:00 a 17:00</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={openEmail}
          style={({ pressed }) => [
            styles.contactButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="arrow-forward"
            size={18}
            color={isDark ? '#082f49' : '#ffffff'}
          />
        </Pressable>
      </AppCard>
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
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.xxl,
      alignItems: 'center',
      ...shadows.card,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    heroIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    heroSubtitle: {
      marginTop: 5,
      fontSize: 12.5,
      lineHeight: 18,
      color: colors.muted,
      textAlign: 'center',
    },
    sectionTitle: {
      marginTop: spacing.xxl,
      marginBottom: spacing.sm,
      fontSize: 14,
      fontWeight: '800',
      color: colors.text,
    },
    steps: {
      flexDirection: 'row',
      gap: spacing.sm,
    },
    stepCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
    },
    stepIcon: {
      width: 36,
      height: 36,
      borderRadius: 11,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    stepTitle: {
      fontSize: 12.5,
      fontWeight: '800',
      color: colors.text,
    },
    stepDescription: {
      marginTop: 2,
      fontSize: 10.5,
      lineHeight: 15,
      color: colors.muted,
    },
    faqCard: {
      paddingVertical: spacing.xs,
    },
    faqItem: {
      paddingVertical: spacing.md,
    },
    faqBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    faqQuestion: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    faqQuestionText: {
      flex: 1,
      paddingRight: spacing.md,
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    faqAnswer: {
      marginTop: spacing.sm,
      fontSize: 12,
      lineHeight: 18,
      color: colors.textSecondary,
    },
    contactCard: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    contactIcon: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    contactInfo: {
      flex: 1,
    },
    contactTitle: {
      fontSize: 13.5,
      fontWeight: '800',
      color: colors.text,
    },
    contactText: {
      marginTop: 1,
      fontSize: 11,
      color: colors.muted,
    },
    contactButton: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: isDark ? colors.primary : colors.primaryDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pressed: {
      opacity: 0.75,
    },
  });

export default HelpScreen;
