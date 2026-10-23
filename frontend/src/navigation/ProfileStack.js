import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen, EditProfileScreen } from '../screens';
import DrawerMenuButton from '../components/DrawerMenuButton';
import { commonHeaderOptions } from './options';

const Stack = createNativeStackNavigator();

/**
 * Flujo del perfil: vista de perfil → edición de datos.
 */
const ProfileStack = () => (
  <Stack.Navigator screenOptions={commonHeaderOptions}>
    <Stack.Screen
      name="ProfileHome"
      component={ProfileScreen}
      options={{
        title: 'Perfil',
        headerLeft: () => <DrawerMenuButton />,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        title: 'Editar perfil',
        presentation: 'modal',
        animation: 'slide_from_bottom',
      }}
    />
  </Stack.Navigator>
);

export default ProfileStack;
