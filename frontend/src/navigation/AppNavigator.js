import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '../context/AuthContext';
import UserBadge from '../components/UserBadge';
import {
  LoginScreen,
  HomeScreen,
  ProfileScreen,
  SettingsScreen,
  AppointmentScreen,
  MedicalHistoryScreen,
  UserInterfaceScreen,
} from '../screens';

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#ffffff',
    primary: '#0284c7',
  },
};

/**
 * Navegador principal de la aplicación.
 *
 * - Si no hay sesión activa, muestra únicamente LoginScreen.
 * - Si hay sesión activa, muestra el stack de pantallas teniendo a HomeScreen
 *   como punto de partida.
 * - Las transiciones se configuran con animation: 'slide_from_right'.
 * - El nombre del usuario se muestra en el encabezado de todas las pantallas
 *   mediante UserBadge, que consume el contexto global.
 */
const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
          headerTintColor: '#0284c7',
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#1e293b',
          },
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerShadowVisible: false,
          headerRight: () => <UserBadge />,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: {
            backgroundColor: '#ffffff',
          },
        }}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Inicio',
                headerLeft: () => null,
              }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Perfil' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Configuración' }}
            />
            <Stack.Screen
              name="Appointments"
              component={AppointmentScreen}
              options={{ title: 'Citas' }}
            />
            <Stack.Screen
              name="MedicalHistory"
              component={MedicalHistoryScreen}
              options={{ title: 'Historial Médico' }}
            />
            <Stack.Screen
              name="UserInterface"
              component={UserInterfaceScreen}
              options={{ title: 'Gestión de Pacientes' }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
