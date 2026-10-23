import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { darkColors, lightColors } from '../theme';
import {
  readThemePreference,
  writeThemePreference,
} from '../services/storage';

/**
 * Tema global de la aplicación.
 *
 * - Carga la preferencia guardada al iniciar.
 * - Aplica el cambio de inmediato en memoria (UI reactiva).
 * - Persiste en AsyncStorage con try/catch, sin romper la app si falla.
 */
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      try {
        const storedMode = await readThemePreference();

        if (mounted && storedMode) {
          setMode(storedMode);
        }
      } catch (error) {
        // Defensa extra: el servicio ya maneja sus propios errores.
        console.warn('[theme] No se pudo cargar la preferencia guardada.', error);
      } finally {
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    loadPreference();

    return () => {
      mounted = false;
    };
  }, []);

  const setThemeMode = useCallback(async (nextMode) => {
    const normalizedMode = nextMode === 'dark' ? 'dark' : 'light';

    // Actualización optimista: la UI cambia al instante.
    setMode(normalizedMode);

    try {
      await writeThemePreference(normalizedMode);
    } catch (error) {
      // El servicio devuelve false, pero protegemos cualquier fallo inesperado.
      console.warn('[theme] El tema se aplicó, pero no se pudo persistir.', error);
    }
  }, []);

  const setDarkMode = useCallback(
    (value) => setThemeMode(value ? 'dark' : 'light'),
    [setThemeMode]
  );

  const toggleDarkMode = useCallback(
    () => setThemeMode(mode === 'dark' ? 'light' : 'dark'),
    [mode, setThemeMode]
  );

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? darkColors : lightColors,
      isReady,
      setThemeMode,
      setDarkMode,
      toggleDarkMode,
    }),
    [mode, isReady, setThemeMode, setDarkMode, toggleDarkMode]
  );

  // Evita mostrar la app con el tema incorrecto mientras se lee AsyncStorage.
  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={lightColors.primaryDark} />
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  }

  return context;
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f8fc',
  },
});

export default ThemeContext;
