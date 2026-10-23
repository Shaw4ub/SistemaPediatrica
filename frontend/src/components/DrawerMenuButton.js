import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { colors } from '../theme';

/**
 * Botón hamburguesa que abre el Drawer desde cualquier tab.
 * La acción se propaga hasta el Drawer ancestro mediante React Navigation.
 */
const DrawerMenuButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      hitSlop={10}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Ionicons name="menu" size={24} color={colors.primaryDeep} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    backgroundColor: colors.primarySoft,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default DrawerMenuButton;
