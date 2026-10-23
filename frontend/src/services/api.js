import { Platform } from 'react-native';

/**
 * URL base del backend Node.js + Express.
 *
 * - En navegador Web: http://localhost:5000
 * - En emulador Android: http://10.0.2.2:5000 (alias del localhost de la máquina host)
 * - En dispositivo físico (Expo Go en la misma red Wi-Fi): IP local del equipo (ej. http://192.168.1.12:5000)
 */
export const API_BASE_URL = Platform.select({
  web: 'http://localhost:5000',
  android: 'http://10.0.2.2:5000',
  default: 'http://192.168.1.12:5000',
});

/**
 * Registra un usuario en MongoDB a través del backend.
 *
 * @param {Object} params
 * @param {string} params.nombreUsuario
 * @param {string} params.contrasena
 * @param {string} [params.rol='user']
 * @returns {Promise<{ mensaje: string, usuario: { id: string, nombreUsuario: string, rol: string } }>}
 */
export async function registerUser({ nombreUsuario, contrasena, rol = 'user' }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombreUsuario: nombreUsuario.trim(),
        contraseña: contrasena,
        rol,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || 'Error al registrar el usuario en MongoDB');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Tiempo de espera agotado. Verifica que el servidor backend esté corriendo en el puerto 5000.'
      );
    }
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error(
        'No se pudo conectar al servidor. Asegúrate de ejecutar "npm start" en la carpeta backend.'
      );
    }
    throw error;
  }
}

/**
 * Autentica un usuario contra MongoDB a través del backend.
 *
 * @param {Object} params
 * @param {string} params.nombreUsuario
 * @param {string} params.contrasena
 * @returns {Promise<{ token: string, usuario: { id: string, nombreUsuario: string, rol: string } }>}
 */
export async function loginUser({ nombreUsuario, contrasena }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombreUsuario: nombreUsuario.trim(),
        contraseña: contrasena,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.mensaje || 'Credenciales inválidas');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'Tiempo de espera agotado al conectar con el backend.'
      );
    }
    if (error.message && error.message.includes('Network request failed')) {
      throw new Error(
        'No se pudo conectar al backend (puerto 5000).'
      );
    }
    throw error;
  }
}
