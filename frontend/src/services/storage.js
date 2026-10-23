import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Claves de AsyncStorage.
 *
 * Convención: `@app/<área>/<dato>`.
 * - Solo se guardan preferencias esenciales y no sensibles.
 * - Nunca se almacenan contraseñas, tokens, documentos ni datos clínicos.
 */
export const STORAGE_KEYS = Object.freeze({
  THEME: '@sistemapediatrica/preferences/theme',
});

const THEME_VALUES = new Set(['light', 'dark']);

/**
 * Lee la preferencia de tema.
 * Devuelve `null` si no existe, es inválida o falla el almacenamiento.
 */
export const readThemePreference = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);

    if (!THEME_VALUES.has(stored)) {
      return null;
    }

    return stored;
  } catch (error) {
    // La app debe seguir funcionando aunque AsyncStorage no esté disponible.
    console.warn('[storage] No se pudo leer la preferencia de tema.', error);
    return null;
  }
};

/**
 * Guarda la preferencia de tema (`light` o `dark`).
 * Devuelve `true` si se guardó correctamente y `false` si hubo un error.
 */
export const writeThemePreference = async (mode) => {
  try {
    if (!THEME_VALUES.has(mode)) {
      throw new Error(`Valor de tema no válido: ${mode}`);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.THEME, mode);
    return true;
  } catch (error) {
    // No propagamos la excepción: el tema visual sigue funcionando en memoria.
    console.warn('[storage] No se pudo guardar la preferencia de tema.', error);
    return false;
  }
};
