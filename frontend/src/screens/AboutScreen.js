import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AppCard from '../components/AppCard';
import { colors, heroGradient, radius, shadows, spacing } from '../theme';

const features = [
  {
    icon: 'calendar-outline',
    title: 'Agenda de citas',
    description: 'Programa, edita y da seguimiento a cada consulta.',
  },
  {
    icon: 'people-outline',
    title: 'Expedientes de pacientes',
    description: 'Información completa de cada paciente y su responsable.',
  },
  {
    icon: 'document-text-outline',
    title: 'Historial clínico',
    description: 'Diagnósticos, tratamientos y notas de todas las consultas.',
  },
  {
    icon: 'notifications-outline',
    title: 'Notificaciones',
    description: 'Avisos de citas, recordatorios y actividad del sistema.',
  },
];

const AboutScreen = () => (
  <ScrollView
    style={styles.screen}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <LinearGradient colors={heroGradient} style={styles.hero}>
      <View style={styles.heroCircle} />
      <View style={styles.logo}>
        <Ionicons name="medical" size={38} color={colors.primaryDark} />
      </View>
      <Text style={styles.name}>Clínica Pediátrica</Text>
      <Text style={styles.tagline}>Sistema de gestión de pacientes</Text>
      <View style={styles.versionChip}>
        <Text style={styles.versionText}>Versión 1.0.0</Text>
      </View>
    </LinearGradient>

    <AppCard style={styles.descriptionCard}>
      <Text style={styles.descriptionTitle}>Sobre la aplicación</Text>
      <Text style={styles.description}>
        SistemaPediatrica es una aplicación móvil pensada para facilitar la
        gestión diaria de una clínica pediátrica: agenda de citas, expedientes
        de pacientes e historial médico en un solo lugar, con una experiencia
        clara e intuitiva.
      </Text>
    </AppCard>

    <Text style={styles.sectionTitle}>Funcionalidades</Text>
    <AppCard style={styles.featuresCard}>
      {features.map((feature, index) => (
        <View
          key={feature.title}
          style={[
            styles.featureRow,
            index !== features.length - 1 && styles.featureBorder,
          ]}
        >
          <View style={styles.featureIcon}>
            <Ionicons
              name={feature.icon}
              size={19}
              color={colors.primaryDark}
            />
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>
              {feature.description}
            </Text>
          </View>
        </View>
      ))}
    </AppCard>

    <Text style={styles.sectionTitle}>Tecnología</Text>
    <AppCard>
      <View style={styles.techRow}>
        <View style={styles.techChip}>
          <Ionicons name="logo-react" size={15} color={colors.primaryDark} />
          <Text style={styles.techText}>React Native</Text>
        </View>
        <View style={styles.techChip}>
          <Ionicons name="layers-outline" size={15} color={colors.purple} />
          <Text style={styles.techText}>Expo</Text>
        </View>
        <View style={styles.techChip}>
          <Ionicons
            name="git-branch-outline"
            size={15}
            color={colors.success}
          />
          <Text style={styles.techText}>React Navigation</Text>
        </View>
      </View>
      <Text style={styles.techNote}>
        Navegación combinada con Stack, Tabs y Drawer para una experiencia
        coherente en cada flujo.
      </Text>
    </AppCard>

    <Text style={styles.footer}>
      Hecho con dedicación para cuidar a los más pequeños.
    </Text>
  </ScrollView>
);

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
  hero: {
    alignItems: 'center',
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
    ...shadows.floating,
  },
  heroCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -70,
    right: -50,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: {
    fontSize: 23,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.4,
  },
  tagline: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.82)',
  },
  versionChip: {
    marginTop: spacing.md,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  versionText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#ffffff',
  },
  descriptionCard: {
    marginTop: spacing.lg,
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  sectionTitle: {
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  featuresCard: {
    paddingVertical: spacing.xs,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  featureBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.text,
  },
  featureDescription: {
    marginTop: 2,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.muted,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  techChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  techText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  techNote: {
    marginTop: spacing.md,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.muted,
  },
  footer: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    fontSize: 10.5,
    color: colors.subtle,
  },
});

export default AboutScreen;
