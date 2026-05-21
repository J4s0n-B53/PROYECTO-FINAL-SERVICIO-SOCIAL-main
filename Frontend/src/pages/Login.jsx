/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMOS = [
  { label: '👨‍💼 Administrador',    correo: 'admin@usonsonate.edu.sv',          pass: '2323' },
  { label: '🎓 Brayan (Sistemas)', correo: 'sd23i04002@usonsonate.edu.sv',     pass: '5678' },
  { label: '🎓 Jorge (Jurídicas)', correo: 'ce25d01005@usonsonate.edu.sv',     pass: '5678' },
  { label: '🎓 Sofía (Jurídicas)', correo: 'tg22d01001@usonsonate.edu.sv',     pass: '5678' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [correo,   setCorreo]   = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(correo, password);
      navigate(user.rol === 'admin' ? '/dashboard' : '/ofertas', { replace: true });
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(d) { setCorreo(d.correo); setPassword(d.pass); setError(''); }

  const inp = {
    width: '100%', background: '#f0f2f7', border: '1px solid rgba(10,27,78,.18)',
    borderRadius: 8, padding: '12px 14px', fontFamily: 'inherit',
    fontSize: 14, color: '#0d1b3e', outline: 'none'
  };

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh',
      background: `radial-gradient(ellipse 70% 60% at 60% 40%, rgba(10,27,78,.06) 0%, transparent 70%),
                   radial-gradient(ellipse 50% 40% at 20% 80%, rgba(10,27,78,.04) 0%, transparent 60%),
                   #f0f2f7`
    }}>
      <form onSubmit={handleSubmit} style={{
        width: 420, background: '#ffffff', border: '1px solid rgba(10,27,78,.12)',
        borderRadius: 20, padding: '48px 40px 40px',
        boxShadow: '0 8px 40px rgba(10,27,78,.12)', animation: 'fadeUp .5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: '#0A1B4E', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>SS</span>
          </div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#0A1B4E' }}>
            USO
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 36 }}>
          Sistema de Servicio Social — Universidad de Sonsonate
        </p>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#4a5578', marginBottom:8 }}>
            Correo institucional
          </label>
          <input style={inp} type="email" value={correo} onChange={e=>setCorreo(e.target.value)}
            placeholder="usuario@usonsonate.edu.sv" required autoComplete="off" />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#4a5578', marginBottom:8 }}>
            Contraseña
          </label>
          <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••" required />
        </div>

        <button type="submit" disabled={loading} style={{
          width:'100%', background:'#0A1B4E', color:'#fff', border:'none',
          borderRadius:8, padding:13, fontFamily:'inherit', fontSize:14,
          fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? .7 : 1, transition: '.2s', marginTop:8
        }}>
          {loading ? 'Verificando…' : 'Iniciar sesión'}
        </button>

        {error && (
          <div style={{
            background:'rgba(217,48,37,.08)', border:'1px solid rgba(217,48,37,.25)',
            color:'#b52920', borderRadius:8, padding:'10px 14px',
            fontSize:13, marginTop:14
          }}>{error}</div>
        )}

        <div style={{ marginTop:24, paddingTop:24, borderTop:'1px solid rgba(10,27,78,.08)' }}>
          <p style={{ fontSize:12, color:'#8d97b8', marginBottom:10 }}>Acceso rápido (demo):</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {DEMOS.map(d => (
              <button key={d.correo} type="button" onClick={() => fillDemo(d)} style={{
                background:'#f0f2f7', border:'1px solid rgba(10,27,78,.12)',
                borderRadius:6, padding:'5px 10px', fontSize:11, color:'#4a5578',
                cursor:'pointer', fontFamily:'inherit', transition:'.2s'
              }}>{d.label}</button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}*/



/*import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INSTITUTIONAL_DOMAIN = '@usonsonate.edu.sv';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [correo,   setCorreo]   = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const correoNormalizado = correo.trim().toLowerCase();

    if (!correoNormalizado.endsWith(INSTITUTIONAL_DOMAIN)) {
      setError('Solo se permiten correos institucionales @usonsonate.edu.sv.');
      return;
    }

    setError(''); setLoading(true);
    try {
      const user = await login(correoNormalizado, password);
      navigate(user.rol === 'admin' ? '/dashboard' : '/ofertas', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    width: '100%', background: '#f0f2f7', border: '1px solid rgba(10,27,78,.18)',
    borderRadius: 8, padding: '12px 14px', fontFamily: 'inherit',
    fontSize: 14, color: '#0d1b3e', outline: 'none'
  };

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh',
      background: `radial-gradient(ellipse 70% 60% at 60% 40%, rgba(10,27,78,.06) 0%, transparent 70%),
                   radial-gradient(ellipse 50% 40% at 20% 80%, rgba(10,27,78,.04) 0%, transparent 60%),
                   #f0f2f7`
    }}>
      <form onSubmit={handleSubmit} style={{
        width: 420, background: '#ffffff', border: '1px solid rgba(10,27,78,.12)',
        borderRadius: 20, padding: '48px 40px 40px',
        boxShadow: '0 8px 40px rgba(10,27,78,.12)', animation: 'fadeUp .5s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: '#0A1B4E', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>SS</span>
          </div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#0A1B4E' }}>
            USO
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#4a5578', marginBottom: 36 }}>
          Sistema de Servicio Social — Universidad de Sonsonate
        </p>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#4a5578', marginBottom:8 }}>
            Correo institucional
          </label>
          <input style={inp} type="email" value={correo} onChange={e=>setCorreo(e.target.value)}
            placeholder="usuario@usonsonate.edu.sv" required autoComplete="off" />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#4a5578', marginBottom:8 }}>
            Contraseña
          </label>
          <input style={inp} type="password" value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="••••••••" required />
        </div>

        <button type="submit" disabled={loading} style={{
          width:'100%', background:'#0A1B4E', color:'#fff', border:'none',
          borderRadius:8, padding:13, fontFamily:'inherit', fontSize:14,
          fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? .7 : 1, transition: '.2s', marginTop:8
        }}>
          {loading ? 'Verificando…' : 'Iniciar sesión'}
        </button>

        {error && (
          <div style={{
            background:'rgba(217,48,37,.08)', border:'1px solid rgba(217,48,37,.25)',
            color:'#b52920', borderRadius:8, padding:'10px 14px',
            fontSize:13, marginTop:14
          }}>{error}</div>
        )}
      </form>
    </div>
  );
}*/



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [correo,   setCorreo]   = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(correo, password);
      navigate(user.rol === 'admin' ? '/dashboard' : '/ofertas', { replace: true });
    } catch {
      setError('Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background-image:
            linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
            url('/USO.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .login-container {
          display: flex;
          width: 850px;
          max-width: 95vw;
          min-height: 520px;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 14px 28px rgba(0,0,0,0.18), 0 10px 10px rgba(0,0,0,0.12);
        }
        .login-form-side {
          width: 55%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
        }
        .login-form {
          width: 100%;
          max-width: 340px;
          display: flex;
          flex-direction: column;
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .login-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #0A1B4E;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .login-logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #0A1B4E;
          letter-spacing: 1px;
        }
        .login-subtitle {
          font-size: 13px;
          color: #4a5578;
          margin-bottom: 32px;
          line-height: 1.5;
        }
        .login-field {
          margin-bottom: 18px;
        }
        .login-field label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #4a5578;
          margin-bottom: 8px;
        }
        .login-field input {
          width: 100%;
          background: #f0f2f7;
          border: 1px solid rgba(10,27,78,.18);
          border-radius: 8px;
          padding: 12px 14px;
          font-size: 14px;
          color: #0d1b3e;
          outline: none;
          transition: border-color .2s;
          font-family: inherit;
        }
        .login-field input:focus {
          border-color: rgba(10,27,78,.45);
        }
        .login-btn {
          width: 100%;
          background: linear-gradient(135deg, #010a36, #1344b6, #0194fc);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          transition: transform 80ms ease-in, opacity .2s;
        }
        .login-btn:disabled { opacity: .7; cursor: not-allowed; }
        .login-btn:active:not(:disabled) { transform: scale(0.97); }
        .login-error {
          background: rgba(217,48,37,.08);
          border: 1px solid rgba(217,48,37,.25);
          color: #b52920;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          margin-top: 14px;
        }
        .login-overlay-side {
          width: 45%;
          background: linear-gradient(135deg, #010a36, #1344b6, #0194fc);
          border-radius: 150px 0 0 150px / 50% 0 0 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          text-align: center;
          color: #fff;
        }
        .login-overlay-content h1 {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .login-overlay-content p {
          font-size: 14px;
          line-height: 1.7;
          opacity: .9;
        }
        @media (max-width: 640px) {
          .login-container { flex-direction: column; }
          .login-form-side { width: 100%; padding: 36px 24px; }
          .login-overlay-side {
            width: 100%;
            border-radius: 0 0 20px 20px;
            padding: 28px 24px;
            min-height: 160px;
          }
        }
      `}</style>

      <div className="login-page">
        <div className="login-container">

          <div className="login-form-side">
            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-logo">
                <div className="login-logo-icon">SS</div>
                <span className="login-logo-text">USO</span>
              </div>
              <p className="login-subtitle">
                Sistema de Servicio Social — Universidad de Sonsonate
              </p>

              <div className="login-field">
                <label>Correo institucional</label>
                <input
                  type="email"
                  value={correo}
                  onChange={e => setCorreo(e.target.value)}
                  placeholder="usuario@usonsonate.edu.sv"
                  pattern="^[^@\s]+@usonsonate\.edu\.sv$"
                  title="Usa tu correo institucional @usonsonate.edu.sv"
                  required autoComplete="off"
                />
              </div>

              <div className="login-field">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="login-btn">
                {loading ? 'Verificando…' : 'Iniciar sesión'}
              </button>

              {error && <div className="login-error">{error}</div>}
            </form>
          </div>

          <div className="login-overlay-side">
            <div className="login-overlay-content">
              <h1>¡Bienvenido!</h1>
              <p>Ingresa tus datos para acceder al sistema de servicio social</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
