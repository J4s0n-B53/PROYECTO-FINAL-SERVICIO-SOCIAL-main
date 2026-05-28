import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_MENU = [
  { to: '/dashboard',     label: 'Dashboard',     icon: '📊' },
  { to: '/ofertas',       label: 'Ofertas',       icon: '💼' },
  { to: '/historial-ofertas', label: 'Historial de ofertas', icon: '🗂️' },
  { to: '/inscripciones', label: 'Inscripciones', icon: '📋' },
  { to: '/usuarios',      label: 'Usuarios',      icon: '👥' },
  { to: '/acerca',        label: 'Sobre nosotros', icon: 'ℹ️' },
];
const STUDENT_MENU = [
  { to: '/ofertas',           label: 'Ofertas disponibles', icon: '💼' },
  { to: '/mis-inscripciones', label: 'Mis inscripciones',   icon: '📋' },
  { to: '/perfil',            label: 'Mi perfil',           icon: '👤' },
  { to: '/acerca',            label: 'Sobre nosotros',      icon: 'ℹ️' },
];

function initials(name = '') {
  return name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
}

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menu = user?.rol === 'admin' ? ADMIN_MENU : STUDENT_MENU;

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh' }}>
      {/* TOPBAR */}
      <header style={{
        height: 56,
        background: '#0A1B4E',
        display: 'flex', alignItems: 'center',
        padding: '0 28px', gap: 14, flexShrink: 0,
        position: 'sticky', top: 0, zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img
            src="/logo-uso.png"
            alt="Logo USO"
            style={{
              width: 30,
              height: 30,
              objectFit: 'contain',
              display: 'block'
            }}
          />
          <span style={{
            fontWeight: 800, fontSize: 17, color: '#fff',
            letterSpacing: -.5, fontFamily: 'inherit'
          }}>
            SSE<span style={{ color: '#6fe0b8' }}>.</span>USO
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Rol badge */}
        <span style={{
          fontSize: 11, padding: '4px 12px', borderRadius: 20,
          border: `1px solid ${user?.rol === 'admin' ? 'rgba(79,140,255,.5)' : 'rgba(15,200,138,.5)'}`,
          color: user?.rol === 'admin' ? '#a0bfff' : '#6fe0b8',
          background: 'rgba(255,255,255,0.06)'
        }}>
          {user?.rol === 'admin' ? 'Administrador' : 'Estudiante'}
        </span>

        {/* Avatar + nombre */}
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#1e3d8a',
            color: '#6fe0b8',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize: 12, fontWeight: 700,
            border: '2px solid rgba(111,224,184,.35)'
          }}>{initials(user?.nombre)}</div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.80)', fontWeight: 500 }}>
            {user?.nombre?.split(' ').slice(0,2).join(' ')}
          </span>
        </div>

        {/* Salir */}
        <button onClick={handleLogout} style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.75)',
          borderRadius: 6, padding: '5px 14px',
          fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
          transition: 'background .15s'
        }}>Salir</button>
      </header>

      <div style={{ display:'flex', flex: 1, overflow: 'hidden' }}>
        {/* SIDEBAR */}
        <nav style={{
          width: 220, flexShrink: 0,
          background: '#fff',
          borderRight: '1px solid rgba(10,27,78,.10)',
          padding: '20px 10px',
          overflowY: 'auto'
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700, color: '#aab1c8',
            letterSpacing: 1.2, textTransform: 'uppercase',
            padding: '0 10px', marginBottom: 10
          }}>
            {user?.rol === 'admin' ? 'Administración' : 'Menú'}
          </div>

          {menu.map(item => (
            <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 8, marginBottom: 2,
              fontSize: 13, textDecoration: 'none',
              color: isActive ? '#0A1B4E' : '#6b7593',
              background: isActive ? '#e8edf8' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              transition: 'background .15s, color .15s'
            })}>
              <span style={{ width: 16, fontSize: 15, opacity: 0.85, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* MAIN CONTENT */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '32px 36px',
          background: '#f0f2f7'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

