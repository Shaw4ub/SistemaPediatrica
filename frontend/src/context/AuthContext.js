import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

/**
 * Contexto global de autenticación.
 * Comparte el usuario logueado con todas las pantallas de la aplicación.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((changes) => {
    setUser((current) => (current ? { ...current, ...changes } : current));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      updateUser,
    }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  return context;
};

export default AuthContext;
