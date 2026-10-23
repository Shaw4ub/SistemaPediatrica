import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainTabsNavigator from './MainTabsNavigator';
import DrawerContent from './DrawerContent';
import DrawerMenuButton from '../components/DrawerMenuButton';
import {
  AboutScreen,
  ChangePasswordScreen,
  HelpScreen,
  SettingsScreen,
} from '../screens';
import { getCommonHeaderOptions } from './options';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();

/**
 * Drawer para secciones secundarias: configuración, seguridad, ayuda y
 * acerca de. Las secciones principales viven en las pestañas inferiores.
 */
const MainDrawerNavigator = () => {
  const { colors } = useTheme();

  const drawerScreenOptions = (title) => ({
    ...getCommonHeaderOptions(colors),
    headerShown: true,
    title,
    headerLeft: () => <DrawerMenuButton />,
  });

  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: colors.overlay,
        drawerStyle: {
          width: 316,
          backgroundColor: colors.surface,
        },
        sceneStyle: {
          backgroundColor: colors.bg,
        },
      }}
    >
      <Drawer.Screen name="Tabs" component={MainTabsNavigator} />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={drawerScreenOptions('Configuración')}
      />
      <Drawer.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={drawerScreenOptions('Cambiar contraseña')}
      />
      <Drawer.Screen
        name="Help"
        component={HelpScreen}
        options={drawerScreenOptions('Ayuda')}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={drawerScreenOptions('Acerca de la app')}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
