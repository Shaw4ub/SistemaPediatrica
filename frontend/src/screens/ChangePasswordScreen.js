import React, { useMemo, useState } from 'react';
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

import AppButton from '../components/AppButton';
import AppCard from '../components/AppCard';
import { FormField } from '../components/FormField';
import { useTheme } from '../context/ThemeContext';
import { radius, spacing } from '../theme';

const tips = [
  'Usa al menos 8 caracteres.',
  'Combina mayúsculas, minúsculas y números.',
  'Evita datos personales fáciles de adivinar.',
];

const ChangePasswordScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (!currentPassword.trim()) {
      Alert.alert('Falta la contraseña actual', 'Ingresa tu contraseña actual.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(
        'Contraseña muy corta',
        'La nueva contraseña debe tener al menos 8 caracteres.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'No coinciden',
        'La nueva contraseña y su confirmación deben ser iguales.'
      );
      return;
    }

    if (newPassword === currentPassword) {
      Alert.alert(
        'Contraseña sin cambios',
        'La nueva contraseña debe ser diferente a la actual.'
      );
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    Alert.alert(
      'Contraseña actualizada',
      'Tu contraseña se cambió correctamente.',
      [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
    );
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
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={26}
              color={colors.primaryDark}
            />
          </View>
          <Text style={styles.heroTitle}>Cuida tu cuenta</Text>
          <Text style={styles.heroSubtitle}>
            Cambia tu contraseña periódicamente para mantener la información
            de la clínica segura.
          </Text>
        </View>

        <AppCard style={styles.card}>
          <FormField
            label="Contraseña actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Tu contraseña actual"
            secureTextEntry
            autoCapitalize="none"
          />
          <FormField
            label="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
            autoCapitalize="none"
          />
          <FormField
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repite la nueva contraseña"
            secureTextEntry
            autoCapitalize="none"
          />
        </AppCard>

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color={colors.primaryDark}
            />
            <Text style={styles.tipsTitle}>Recomendaciones de seguridad</Text>
          </View>
          {tips.map((tip) => (
            <View key={tip} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <AppButton
          title="Actualizar contraseña"
          icon="shield-checkmark-outline"
          onPress={handleSubmit}
          fullWidth
          style={styles.submit}
        />
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
      maxWidth: 640,
      alignSelf: 'center',
    },
    hero: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
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
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
    },
    heroSubtitle: {
      marginTop: 5,
      fontSize: 12,
      lineHeight: 18,
      color: colors.muted,
      textAlign: 'center',
    },
    card: {
      paddingBottom: spacing.xs,
    },
    tipsCard: {
      marginTop: spacing.lg,
      padding: spacing.lg,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: spacing.sm,
    },
    tipsTitle: {
      fontSize: 12.5,
      fontWeight: '800',
      color: colors.primaryDeep,
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    tipDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.primaryDark,
      marginRight: spacing.sm,
    },
    tipText: {
      fontSize: 11.5,
      color: colors.primaryDeep,
    },
    submit: {
      marginTop: spacing.xl,
    },
  });

export default ChangePasswordScreen;
