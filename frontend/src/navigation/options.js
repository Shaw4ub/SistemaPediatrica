import React from 'react';
import UserBadge from '../components/UserBadge';

/**
 * Opciones compartidas por todos los stacks autenticados.
 * Recibe la paleta activa para que los headers respeten el modo oscuro.
 */
export const getCommonHeaderOptions = (colors) => ({
  headerTitleAlign: 'center',
  headerTintColor: colors.primaryDeep,
  headerTitleStyle: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 17,
  },
  headerStyle: {
    backgroundColor: colors.surface,
  },
  headerShadowVisible: false,
  headerRight: () => <UserBadge />,
  headerBackButtonDisplayMode: 'minimal',
  contentStyle: {
    backgroundColor: colors.bg,
  },
});

export default getCommonHeaderOptions;
