import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verificarSesion() {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.usuario);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    verificarSesion();
  }, []);

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
