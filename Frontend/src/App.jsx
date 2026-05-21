import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login      from './pages/Login';
import Layout     from './components/Layout';
import Dashboard  from './pages/Dashboard';
import Ofertas    from './pages/Ofertas';
import Inscripciones from './pages/Inscripciones';
import Usuarios   from './pages/Usuarios';
import MisInscripciones from './pages/MisInscripciones';
import Perfil     from './pages/Perfil';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'var(--text2)'}}>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.rol !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.rol === 'admin'
    ? <Navigate to="/dashboard" replace />
    : <Navigate to="/ofertas" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<RootRedirect />} />
            <Route path="dashboard"     element={<PrivateRoute adminOnly><Dashboard /></PrivateRoute>} />
            <Route path="ofertas"       element={<Ofertas />} />
            <Route path="inscripciones" element={<PrivateRoute adminOnly><Inscripciones /></PrivateRoute>} />
            <Route path="usuarios"      element={<PrivateRoute adminOnly><Usuarios /></PrivateRoute>} />
            <Route path="mis-inscripciones" element={<MisInscripciones />} />
            <Route path="perfil"        element={<Perfil />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
