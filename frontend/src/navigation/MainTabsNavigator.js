import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeStack from './HomeStack';
import AppointmentsStack from './AppointmentsStack';
import PatientsStack from './PatientsStack';
import HistoryStack from './HistoryStack';
import ProfileStack from './ProfileStack';
import { useTheme } from '../context/ThemeContext';
import { shadows, spacing } from '../theme';

const Tab = createBottomTabNavigator();

const icons = {
  InicioTab: { active: 'home', inactive: 'home-outline' },
  CitasTab: { active: 'calendar', inactive: 'calendar-outline' },
  PacientesTab: { active: 'people', inactive: 'people-outline' },
  HistorialTab: { active: 'document-text', inactive: 'document-text-outline' },
  PerfilTab: { active: 'person', inactive: 'person-outline' },
};

/**
 * Pestañas fijas inferiores. Cada pestaña contiene su propio Stack para
 * conservar el flujo jerárquico (listado → detalle → formulario).
 */
const MainTabsNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const bottomInset = Math.max(insets.bottom, 6);

  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.subtle,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 62 + bottomInset,
            paddingBottom: bottomInset,
          },
        ],
        tabBarIcon: ({ focused, color }) => {
          const icon = icons[route.name] || icons.InicioTab;

          return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Ionicons
                name={focused ? icon.active : icon.inactive}
                size={20}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="InicioTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="CitasTab"
        component={AppointmentsStack}
        options={{ tabBarLabel: 'Citas' }}
      />
      <Tab.Screen
        name="PacientesTab"
        component={PatientsStack}
        options={{ tabBarLabel: 'Pacientes' }}
      />
      <Tab.Screen
        name="HistorialTab"
        component={HistoryStack}
        options={{ tabBarLabel: 'Historial' }}
      />
      <Tab.Screen
        name="PerfilTab"
        component={ProfileStack}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 7,
      ...shadows.floating,
      ...(isDark ? { shadowColor: '#000000', shadowOpacity: 0.35 } : null),
    },
    item: {
      paddingVertical: 0,
    },
    label: {
      fontSize: 10.5,
      fontWeight: '700',
      letterSpacing: 0.1,
    },
    iconWrap: {
      width: 38,
      height: 30,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xs / 2,
    },
    iconWrapActive: {
      backgroundColor: colors.primarySoft,
    },
  });

export default MainTabsNavigator;
