import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/apiClient';

const AuthContext = createContext(null);
const IDLE_TIMEOUT_MS = 60 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verificarSesion() {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.valid ? data.usuario : null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verificarSesion();
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    let timeoutId;
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    function resetIdleTimer() {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT_MS);
    }

    resetIdleTimer();
    activityEvents.forEach(event => window.addEventListener(event, resetIdleTimer));

    return () => {
      window.clearTimeout(timeoutId);
      activityEvents.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, [user]);

  async function login(correo, password) {
    const { data } = await api.post('/auth/login', { correo, password });
    setUser(data.usuario);
    return data.usuario;
  }

  async function logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
