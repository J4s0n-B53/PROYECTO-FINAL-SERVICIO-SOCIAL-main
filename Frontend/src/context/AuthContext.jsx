import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  /*useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);*/

  useEffect(() => {
  async function verificarSesion() {
    const token  = localStorage.getItem('token');
    const stored = localStorage.getItem('usuario');
    if (!token || !stored) {
      setLoading(false);
      return;
    }
    try {
      await api.get('/auth/me');
      setUser(JSON.parse(stored));
    } catch {
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  verificarSesion();
}, []);

  async function login(correo, password) {
    const { data } = await api.post('/auth/login', { correo, password });
    localStorage.setItem('token',   data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUser(data.usuario);
    return data.usuario;
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
