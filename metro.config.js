const { getDefaultConfig } = require('expo/metro-config');

/**
 * Configuración de Metro.
 *
 * `expo-sqlite` en web usa un build de WebAssembly (`wa-sqlite.wasm`) y
 * `SharedArrayBuffer`, por lo que se necesita:
 *   1. Reconocer los archivos .wasm como assets.
 *   2. Enviar las cabeceras COOP/COEP en el servidor de desarrollo.
 *
 * En hosting estático también deben configurarse esas cabeceras.
 */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

module.exports = config;
