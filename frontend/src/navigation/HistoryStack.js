import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  MedicalHistoryScreen,
  MedicalRecordDetailScreen,
  MedicalRecordFormScreen,
} from '../screens';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { commonHeaderOptions } from './options';

const Stack = createNativeStackNavigator();

/**
 * Flujo jerárquico del historial médico:
 * listado → detalle del registro → formulario (crear/editar).
 */
const HistoryStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="HistoryHome"
      component={MedicalHistoryScreen}
      options={{
        title: 'Historial Médico',
        headerLeft: () => <DrawerMenuButton />,
      }}
    />
    <Stack.Screen
      name="RecordDetail"
      component={MedicalRecordDetailScreen}
      options={{ title: 'Detalle del registro' }}
    />
    <Stack.Screen
      name="RecordForm"
      component={MedicalRecordFormScreen}
      options={({ route }) => ({
        title: route.params?.recordId ? 'Editar registro' : 'Nuevo registro',
        presentation: 'modal',
        animation: 'slide_from_bottom',
      })}
    />
  </Stack.Navigator>
);

export default HistoryStack;
