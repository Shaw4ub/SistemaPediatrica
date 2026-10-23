import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen, NotificationsScreen } from '../screens';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { useTheme } from '../context/ThemeContext';
import { getCommonHeaderOptions } from './options';

const Stack = createNativeStackNavigator();

/**
 * Flujo de la pestaña Inicio.
 * Inicio es la raíz; las notificaciones se abren como pantalla jerárquica.
 */
const HomeStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonHeaderOptions(colors)}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerLeft: () => <DrawerMenuButton />,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notificaciones' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
