import React, { useMemo } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainDrawerNavigator from './MainDrawerNavigator';

const Stack = createNativeStackNavigator();

/**
 * Navegación raíz.
 *
 * Sin sesión → Stack de autenticación (Login).
 * Con sesión  → Drawer principal, que contiene las pestañas inferiores y
 *               las pantallas secundarias de configuración.
 *
 * El tema de React Navigation se sincroniza con ThemeContext para que los
 * headers, el fondo y la tab bar cambien de inmediato.
 */
const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const { colors, isDark } = useTheme();

  const navigationTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      dark: isDark,
      colors: {
        ...baseTheme.colors,
        primary: colors.primaryDark,
        background: colors.bg,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.rose,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainDrawerNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
