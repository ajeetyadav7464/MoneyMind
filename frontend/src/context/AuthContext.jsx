/**
 * context/AuthContext.jsx
 * Global auth state — token + user stored in localStorage, exposed via useAuth().
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getMe, loginUser, registerUser } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (credentials) => {
    const data = await registerUser(credentials);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user',  JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const bootstrapUser = async () => {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const me = await getMe();
        setUser(me);
        localStorage.setItem('user', JSON.stringify(me));
      } catch {
        logout();
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrapUser();
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuth: !!token, isBootstrapping }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
