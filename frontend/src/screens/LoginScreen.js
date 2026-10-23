import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
import { useTheme } from '../context/ThemeContext';
import { loginUser } from '../services/api';
import {
  darkHeroGradient,
  heroGradient,
  radius,
  shadows,
  spacing,
} from '../theme';

const LoginScreen = ({ navigation, route }) => {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(
    () => createStyles(colors, isDark),
    [colors, isDark]
  );
  const usuarioSugerido = route?.params?.nombreUsuario ?? '';
  const [nombreUsuario, setNombreUsuario] = useState(usuarioSugerido);
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Al volver de Register, el usuario recién creado llega por parámetros.
  useEffect(() => {
    if (usuarioSugerido) {
      setNombreUsuario(usuarioSugerido);
    }
  }, [usuarioSugerido]);

  const handleLogin = async () => {
    const user = nombreUsuario.trim();
    const pass = contraseña.trim();

    if (!user || !pass) {
      Alert.alert('Aviso', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      const res = await loginUser({ nombreUsuario: user, contrasena: pass });
      login({
        nombreUsuario: res.usuario?.nombreUsuario || user,
        rol: res.usuario?.rol === 'admin' ? 'Administrador' : 'Usuario',
        email: `${user.toLowerCase()}@clinica.com`,
        telefono: '+503 7000 0000',
      });
    } catch (err) {
      // Si el backend respondió que no coincide o no existe:
      if (
        err.message &&
        (err.message.includes('inválidas') ||
          err.message.includes('no encontrado') ||
          err.message.includes('Credenciales'))
      ) {
        Alert.alert('Acceso denegado', err.message);
        return;
      }

      // Si el backend no está corriendo, permitir entrar en modo demostración local
      const enterDemo = () => {
        login({
          nombreUsuario: user,
          rol: 'Administrador',
          email: `${user.toLowerCase()}@clinica.com`,
          telefono: '+503 7000 0000',
        });
      };

      if (Platform.OS === 'web') {
        const proceed = window.confirm(
          `No se pudo conectar al servidor MongoDB (${err.message}).\n\n¿Deseas iniciar sesión en modo demostración local?`
        );
        if (proceed) enterDemo();
      } else {
        Alert.alert(
          'Servidor no disponible',
          `No se pudo conectar al backend MongoDB.\n\n¿Deseas entrar en modo demostración local?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Entrar como Demo', onPress: enterDemo },
          ]
        );
      }
    } finally {
      setIsLoading(false);
    }
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

              <View style={styles.logoCircle}>
                <Ionicons
                  name="medical"
                  size={38}
                  color={isDark ? colors.primary : colors.primaryDark}
                />
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
                disabled={isLoading}
                onPress={handleLogin}
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
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={isDark ? '#082f49' : '#ffffff'}
                      style={styles.buttonIcon}
                    />
                  </>
                )}
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>o</Text>
                <View style={styles.divider} />
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Crear una cuenta"
                onPress={() => navigation.navigate('Register')}
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons
                  name="person-add-outline"
                  size={18}
                  color={colors.primaryDeep}
                  style={styles.secondaryIcon}
                />
                <Text style={styles.secondaryText}>Crear una cuenta</Text>
              </Pressable>

              <View style={styles.demoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={colors.primaryDeep}
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
      paddingVertical: spacing.xxl,
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
    logoCircle: {
      width: 74,
      height: 74,
      borderRadius: 24,
      backgroundColor: isDark ? colors.surface : 'rgba(255,255,255,0.94)',
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
    buttonText: {
      fontSize: 15,
      fontWeight: '800',
      color: isDark ? '#082f49' : '#ffffff',
    },
    buttonIcon: {
      marginLeft: spacing.sm,
    },
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.lg,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: spacing.md,
      fontSize: 11.5,
      fontWeight: '700',
      color: colors.subtle,
    },
    secondaryButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderStrong,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      minHeight: 48,
      marginTop: spacing.md,
    },
    secondaryIcon: {
      marginRight: spacing.sm,
    },
    secondaryText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primaryDeep,
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
