import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

import { useTheme } from '../context/ThemeContext';
import { registerUser } from '../services/api';
import {
  darkHeroGradient,
  heroGradient,
  radius,
  shadows,
  spacing,
} from '../theme';

const INITIAL_FORM = {
  nombreUsuario: '',
  contrasena: '',
  confirmar: '',
};

/**
 * Registro de usuario.
 *
 * Al igual que `LoginScreen`, el alta es **simulada**: valida los datos y
 * vuelve al login con el usuario precargado. El backend ya expone
 * `POST /api/auth/register` (con el modelo `Usuario` de MongoDB) para cuando
 * se conecte la app a la API.
 */
const RegisterScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [createdUser, setCreatedUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const setField = (field) => (value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError('');
  };

  const validate = () => {
    const nextErrors = {};
    const usuario = form.nombreUsuario.trim();

    if (!usuario) {
      nextErrors.nombreUsuario = 'Escribe un nombre de usuario.';
    } else if (usuario.length < 3) {
      nextErrors.nombreUsuario = 'Debe tener al menos 3 caracteres.';
    } else if (/\s/.test(usuario)) {
      nextErrors.nombreUsuario = 'No puede contener espacios.';
    }

    if (!form.contrasena) {
      nextErrors.contrasena = 'Escribe una contraseña.';
    } else if (form.contrasena.length < 6) {
      nextErrors.contrasena = 'Debe tener al menos 6 caracteres.';
    }

    if (!form.confirmar) {
      nextErrors.confirmar = 'Confirma la contraseña.';
    } else if (form.confirmar !== form.contrasena) {
      nextErrors.confirmar = 'Las contraseñas no coinciden.';
    }

    return nextErrors;
  };

  const handleRegister = async () => {
    setServerError('');
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await registerUser({
        nombreUsuario: form.nombreUsuario.trim(),
        contrasena: form.contrasena,
        rol: 'user',
      });
      setCreatedUser(res.usuario?.nombreUsuario || form.nombreUsuario.trim());
    } catch (err) {
      setServerError(
        err.message || 'Ocurrió un error al intentar registrar el usuario.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goToLogin = () => {
    navigation.navigate('Login', {
      nombreUsuario: createdUser || form.nombreUsuario.trim(),
    });
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setServerError('');
    setCreatedUser('');
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
            <LinearGradient
              colors={isDark ? darkHeroGradient : heroGradient}
              style={styles.brand}
            >
              <View style={styles.brandCircleOne} />
              <View style={styles.brandCircleTwo} />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver al inicio de sesión"
                hitSlop={8}
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={20} color="#ffffff" />
              </Pressable>

              <View style={styles.logoCircle}>
                <Ionicons
                  name="person-add"
                  size={32}
                  color={isDark ? colors.primary : colors.primaryDark}
                />
              </View>
              <Text style={styles.brandTitle}>Crear cuenta</Text>
              <Text style={styles.brandSubtitle}>
                Regístrate para usar el sistema
              </Text>
            </LinearGradient>

            <View style={styles.card}>
              {createdUser ? (
                <View style={styles.successBox}>
                  <View style={styles.successIcon}>
                    <Ionicons
                      name="checkmark-circle"
                      size={44}
                      color={colors.success}
                    />
                  </View>
                  <Text style={styles.successTitle}>¡Cuenta creada!</Text>
                  <Text style={styles.successText}>
                    El usuario <Text style={styles.successUser}>{createdUser}</Text>{' '}
                    quedó registrado en la base de datos (MongoDB). Ya puedes iniciar sesión.
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    onPress={goToLogin}
                    style={({ pressed }) => [
                      styles.button,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.buttonText}>Ir a iniciar sesión</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={isDark ? '#082f49' : '#ffffff'}
                      style={styles.buttonIcon}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={resetForm}
                    style={styles.textLink}
                  >
                    <Text style={styles.textLinkLabel}>
                      Registrar otra cuenta
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <Text style={styles.welcome}>Tus datos de acceso</Text>
                  <Text style={styles.welcomeSubtitle}>
                    Completa el formulario para registrarte en MongoDB
                  </Text>

                  {serverError ? (
                    <View style={styles.serverErrorBox}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color={colors.danger}
                      />
                      <Text style={styles.serverErrorText}>{serverError}</Text>
                    </View>
                  ) : null}

                  <View style={styles.field}>
                    <Text style={styles.label}>Usuario</Text>
                    <View
                      style={[
                        styles.inputWrap,
                        errors.nombreUsuario && styles.inputWrapError,
                      ]}
                    >
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
                        value={form.nombreUsuario}
                        onChangeText={setField('nombreUsuario')}
                      />
                    </View>
                    {errors.nombreUsuario ? (
                      <Text style={styles.errorText}>{errors.nombreUsuario}</Text>
                    ) : null}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Contraseña</Text>
                    <View
                      style={[
                        styles.inputWrap,
                        errors.contrasena && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="lock-closed-outline"
                        size={18}
                        color={colors.muted}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor={colors.subtle}
                        secureTextEntry={!showPassword}
                        value={form.contrasena}
                        onChangeText={setField('contrasena')}
                      />
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
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
                    {errors.contrasena ? (
                      <Text style={styles.errorText}>{errors.contrasena}</Text>
                    ) : null}
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <View
                      style={[
                        styles.inputWrap,
                        errors.confirmar && styles.inputWrapError,
                      ]}
                    >
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={18}
                        color={colors.muted}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Repite tu contraseña"
                        placeholderTextColor={colors.subtle}
                        secureTextEntry={!showConfirm}
                        value={form.confirmar}
                        onChangeText={setField('confirmar')}
                        onSubmitEditing={handleRegister}
                      />
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          showConfirm
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                        hitSlop={8}
                        onPress={() => setShowConfirm((current) => !current)}
                      >
                        <Ionicons
                          name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                          size={19}
                          color={colors.muted}
                        />
                      </Pressable>
                    </View>
                    {errors.confirmar ? (
                      <Text style={styles.errorText}>{errors.confirmar}</Text>
                    ) : null}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    disabled={isLoading}
                    onPress={handleRegister}
                    style={({ pressed }) => [
                      styles.button,
                      pressed && styles.buttonPressed,
                      isLoading && styles.buttonDisabled,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator
                        size="small"
                        color={isDark ? '#082f49' : '#ffffff'}
                      />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Crear cuenta</Text>
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={isDark ? '#082f49' : '#ffffff'}
                          style={styles.buttonIcon}
                        />
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => navigation.goBack()}
                    style={styles.textLink}
                  >
                    <Text style={styles.textLinkLabel}>
                      ¿Ya tienes cuenta? Inicia sesión
                    </Text>
                  </Pressable>
                </>
              )}
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

const createStyles = (colors, isDark) =>
  StyleSheet.create({
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
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.xl,
      alignItems: 'center',
      overflow: 'hidden',
      ...shadows.floating,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.45 } : null),
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
    backButton: {
      position: 'absolute',
      top: spacing.md,
      left: spacing.md,
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      zIndex: 2,
    },
    logoCircle: {
      width: 66,
      height: 66,
      borderRadius: 22,
      backgroundColor: isDark ? colors.surface : 'rgba(255,255,255,0.94)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    brandTitle: {
      fontSize: 22,
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
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
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
    inputWrapError: {
      borderColor: colors.danger,
    },
    input: {
      flex: 1,
      marginLeft: spacing.sm,
      fontSize: 14,
      color: colors.text,
      paddingVertical: spacing.sm,
    },
    errorText: {
      marginTop: 5,
      fontSize: 11.5,
      fontWeight: '600',
      color: colors.danger,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? colors.primary : colors.primaryDark,
      borderRadius: radius.md,
      minHeight: 50,
      marginTop: spacing.sm,
    },
    buttonPressed: {
      opacity: 0.86,
      transform: [{ scale: 0.99 }],
    },
    buttonDisabled: {
      opacity: 0.65,
    },
    serverErrorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
      borderWidth: 1,
      borderColor: colors.danger,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginBottom: spacing.lg,
    },
    serverErrorText: {
      flex: 1,
      marginLeft: spacing.sm,
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.danger,
    },
    buttonText: {
      fontSize: 15,
      fontWeight: '800',
      color: isDark ? '#082f49' : '#ffffff',
    },
    buttonIcon: {
      marginLeft: spacing.sm,
    },
    textLink: {
      marginTop: spacing.lg,
      alignItems: 'center',
      paddingVertical: spacing.xs,
    },
    textLinkLabel: {
      fontSize: 12.5,
      fontWeight: '700',
      color: colors.primaryDeep,
    },
    successBox: {
      alignItems: 'center',
    },
    successIcon: {
      marginBottom: spacing.sm,
    },
    successTitle: {
      fontSize: 19,
      fontWeight: '800',
      color: colors.text,
    },
    successText: {
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      textAlign: 'center',
      fontSize: 13,
      lineHeight: 19,
      color: colors.muted,
    },
    successUser: {
      fontWeight: '800',
      color: colors.text,
    },
    footer: {
      marginTop: spacing.xxl,
      textAlign: 'center',
      fontSize: 11,
      color: colors.subtle,
    },
  });

export default RegisterScreen;
