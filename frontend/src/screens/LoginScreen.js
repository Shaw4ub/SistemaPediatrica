import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colors, heroGradient, radius, shadows, spacing } from '../theme';

const LoginScreen = () => {
  const { login } = useAuth();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!nombreUsuario.trim() || !contraseña.trim()) {
      Alert.alert('Aviso', 'Por favor ingresa usuario y contraseña');
      return;
    }

    // Simulación de inicio de sesión: el usuario se guarda en el contexto global.
    login({
      nombreUsuario: nombreUsuario.trim(),
      rol: 'Administrador',
      email: `${nombreUsuario.trim().toLowerCase()}@clinica.com`,
      telefono: '+503 7000 0000',
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <LinearGradient colors={heroGradient} style={styles.brand}>
              <View style={styles.brandCircleOne} />
              <View style={styles.brandCircleTwo} />

              <View style={styles.logoCircle}>
                <Ionicons name="medical" size={38} color={colors.primaryDark} />
              </View>
              <Text style={styles.brandTitle}>Clínica Pediátrica</Text>
              <Text style={styles.brandSubtitle}>
                Sistema de gestión de pacientes
              </Text>
            </LinearGradient>

            <View style={styles.card}>
              <Text style={styles.welcome}>Bienvenido de nuevo</Text>
              <Text style={styles.welcomeSubtitle}>
                Ingresa tus credenciales para continuar
              </Text>

              <View style={styles.field}>
                <Text style={styles.label}>Usuario</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={colors.muted}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    placeholderTextColor={colors.subtle}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={nombreUsuario}
                    onChangeText={setNombreUsuario}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputWrap}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={colors.muted}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Tu contraseña"
                    placeholderTextColor={colors.subtle}
                    secureTextEntry={!showPassword}
                    value={contraseña}
                    onChangeText={setContraseña}
                    onSubmitEditing={handleLogin}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    hitSlop={8}
                    onPress={() => setShowPassword((current) => !current)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={19}
                      color={colors.muted}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#ffffff"
                  style={styles.buttonIcon}
                />
              </Pressable>

              <View style={styles.demoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.primaryDark}
                />
                <Text style={styles.demoText}>
                  Demo: ingresa cualquier usuario y contraseña.
                </Text>
              </View>
            </View>

            <Text style={styles.footer}>
              Cuidando la salud de los más pequeños
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  container: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
  brand: {
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    overflow: 'hidden',
    ...shadows.floating,
  },
  brandCircleOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.10)',
    top: -60,
    right: -40,
  },
  brandCircleTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -45,
    left: -20,
  },
  logoCircle: {
    width: 74,
    height: 74,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.82)',
  },
  card: {
    marginTop: -spacing.lg,
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    marginTop: 4,
    marginBottom: spacing.xl,
    fontSize: 12.5,
    color: colors.muted,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: radius.md,
    minHeight: 50,
    marginTop: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  buttonIcon: {
    marginLeft: spacing.sm,
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
  },
  demoText: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 11.5,
    lineHeight: 17,
    color: colors.primaryDeep,
    fontWeight: '500',
  },
  footer: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    fontSize: 11,
    color: colors.subtle,
  },
});

export default LoginScreen;
