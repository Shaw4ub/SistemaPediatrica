import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  AppointmentScreen,
  AppointmentDetailScreen,
  AppointmentFormScreen,
} from '../screens';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { commonHeaderOptions } from './options';

const Stack = createNativeStackNavigator();

/**
 * Flujo jerárquico de citas:
 * listado → detalle → formulario (crear/editar).
 */
const AppointmentsStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="AppointmentsHome"
      component={AppointmentScreen}
      options={{
        title: 'Citas',
        headerLeft: () => <DrawerMenuButton />,
      }}
    />
    <Stack.Screen
      name="AppointmentDetail"
      component={AppointmentDetailScreen}
      options={{ title: 'Detalle de la cita' }}
    />
    <Stack.Screen
      name="AppointmentForm"
      component={AppointmentFormScreen}
      options={({ route }) => ({
        title: route.params?.appointmentId ? 'Editar cita' : 'Nueva cita',
        presentation: 'modal',
        animation: 'slide_from_bottom',
      })}
    />
  </Stack.Navigator>
);

export default AppointmentsStack;
