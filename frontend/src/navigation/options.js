import React from 'react';
import UserBadge from '../components/UserBadge';
import { colors } from '../theme';

/**
 * Opciones compartidas por todos los stacks autenticados.
 * Mantiene headers blancos, título centrado y el chip de usuario a la derecha.
 */
export const commonHeaderOptions = {
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
};

export default commonHeaderOptions;
