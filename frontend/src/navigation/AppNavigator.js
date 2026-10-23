import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import MainDrawerNavigator from './MainDrawerNavigator';
import { colors } from '../theme';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primaryDark,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.rose,
  },
};

/**
 * Navegación raíz.
 *
 * Sin sesión → Stack de autenticación (Login).
 * Con sesión  → Drawer principal, que contiene las pestañas inferiores y
 *               las pantallas secundarias de configuración.
 */
const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

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
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
