import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  UserInterfaceScreen,
  PatientDetailScreen,
  PatientFormScreen,
  SqliteViewerScreen,
} from '../screens';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { useTheme } from '../context/ThemeContext';
import { getCommonHeaderOptions } from './options';

const Stack = createNativeStackNavigator();

/**
 * Flujo jerárquico de pacientes:
 * listado → expediente → formulario (crear/editar).
 */
const PatientsStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonHeaderOptions(colors)}>
      <Stack.Screen
        name="PatientsHome"
        component={UserInterfaceScreen}
        options={{
          title: 'Pacientes',
          headerLeft: () => <DrawerMenuButton />,
        }}
      />
      <Stack.Screen
        name="PatientDetail"
        component={PatientDetailScreen}
        options={{ title: 'Expediente del paciente' }}
      />
      <Stack.Screen
        name="PatientForm"
        component={PatientFormScreen}
        options={({ route }) => ({
          title: route.params?.patientId ? 'Editar paciente' : 'Nuevo paciente',
          presentation: 'modal',
          animation: 'slide_from_bottom',
        })}
      />
      <Stack.Screen
        name="DatabaseViewer"
        component={SqliteViewerScreen}
        options={{ title: 'Base de datos SQLite' }}
      />
    </Stack.Navigator>
  );
};

export default PatientsStack;
