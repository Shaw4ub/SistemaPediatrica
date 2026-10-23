import { Platform } from 'react-native';

/**
 * Paleta y tokens visuales compartidos por toda la aplicación.
 * Centralizarlos evita colores sueltos y mantiene una identidad coherente.
 */
export const lightColors = {
  primary: '#0ea5e9',
  primaryDark: '#0284c7',
  primaryDeep: '#075985',
  primarySoft: '#e0f2fe',

  accent: '#14b8a6',
  accentSoft: '#ccfbf1',

  purple: '#8b5cf6',
  purpleSoft: '#ede9fe',

  amber: '#f59e0b',
  amberSoft: '#fef3c7',
  amberText: '#b45309',

  rose: '#e11d48',
  roseSoft: '#ffe4e6',

  danger: '#dc2626',
  dangerSoft: '#fee2e2',

  success: '#0d9488',
  successSoft: '#ccfbf1',

  bg: '#f4f8fc',
  surface: '#ffffff',
  surfaceMuted: '#f8fafc',
  neutralSoft: '#eef2f7',

  text: '#0f172a',
  textSecondary: '#334155',
  muted: '#64748b',
  subtle: '#94a3b8',

  border: '#e5edf6',
  borderStrong: '#cbd5e1',
  overlay: 'rgba(15, 23, 42, 0.42)',
};

/**
 * Paleta oscura. Mantiene los mismos nombres de token que la paleta clara
 * para que las pantallas solo necesiten cambiar el objeto de colores.
 */
export const darkColors = {
  primary: '#38bdf8',
  primaryDark: '#7dd3fc',
  primaryDeep: '#bae6fd',
  primarySoft: '#0c4a6e',

  accent: '#2dd4bf',
  accentSoft: '#134e4a',

  purple: '#c4b5fd',
  purpleSoft: '#4c1d95',

  amber: '#fbbf24',
  amberSoft: '#451a03',
  amberText: '#fbbf24',

  rose: '#fb7185',
  roseSoft: '#4c0519',

  danger: '#f87171',
  dangerSoft: '#450a0a',

  success: '#5eead4',
  successSoft: '#042f2e',

  bg: '#070f1c',
  surface: '#0f1b2d',
  surfaceMuted: '#0b1626',
  neutralSoft: '#1e293b',

  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  muted: '#94a3b8',
  subtle: '#64748b',

  border: '#1e2f45',
  borderStrong: '#334155',
  overlay: 'rgba(2, 6, 23, 0.75)',
};

/**
 * Alias histórico: las pantallas que aún no usan ThemeContext siguen
 * obteniendo la paleta clara. Las pantallas con tema dinámico usan
 * `useTheme().colors`.
 */
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '800', color: colors.text },
  h2: { fontSize: 20, fontWeight: '700', color: colors.text },
  h3: { fontSize: 16, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, color: colors.textSecondary },
  caption: { fontSize: 12, color: colors.muted },
};

/**
 * Sombra suave multiplataforma. En iOS se usan las props shadow* y en
 * Android elevation. En web se traduce a box-shadow.
 */
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
    },
    android: { elevation: 2 },
    default: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
    },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 9 },
    default: {
      shadowColor: '#0f172a',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
    },
  }),
};

export const heroGradient = ['#38bdf8', '#0284c7', '#0369a1'];
export const darkHeroGradient = ['#0ea5e9', '#0369a1', '#075985'];
export const drawerGradient = ['#0ea5e9', '#0369a1'];
export const darkDrawerGradient = ['#0c4a6e', '#082f49'];

export const getShadowColor = (isDark) => (isDark ? '#000000' : '#0f172a');

export default {
  colors,
  lightColors,
  darkColors,
  spacing,
  radius,
  typography,
  shadows,
};
