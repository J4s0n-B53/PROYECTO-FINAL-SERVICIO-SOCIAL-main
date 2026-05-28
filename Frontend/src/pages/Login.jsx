import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INSTITUTIONAL_DOMAIN = '@usonsonate.edu.sv';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const correoNormalizado = correo.trim().toLowerCase();

    if (!correoNormalizado.endsWith(INSTITUTIONAL_DOMAIN)) {
      setError('Solo se permiten correos institucionales @usonsonate.edu.sv.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const user = await login(correoNormalizado, password);
      navigate(user.rol === 'admin' ? '/dashboard' : '/ofertas', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .login-page {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          min-height: 100vh;
          padding: 72px 0 0 76px;
          background-image:
            linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)),
            url('/USO.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .login-container {
          display: flex;
          width: 720px;
          max-width: calc(100vw - 112px);
          min-height: 430px;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 14px 28px rgba(0,0,0,0.18), 0 10px 10px rgba(0,0,0,0.12);
        }
        .login-form-side {
          width: 55%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px 34px;
        }
        .login-form {
          width: 100%;
          max-width: 390px;
          display: flex;
          flex-direction: column;
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 6px;
        }
        .login-logo-icon {
          width: 46px;
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
          font-size: 12px;
          color: #4a5578;
          margin-bottom: 24px;
          line-height: 1.5;
          white-space: nowrap;
        }
        .login-field {
          margin-bottom: 14px;
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
          padding: 10px 12px;
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
          padding: 11px;
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
          padding: 32px;
          text-align: center;
          color: #fff;
        }
        .login-overlay-content h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .login-overlay-content {
          transform: translateY(-22px);
        }
        .login-welcome-logo {
          width: 96px;
          height: 96px;
          object-fit: contain;
          margin: 0 auto 18px;
          filter: drop-shadow(0 10px 18px rgba(0,0,0,.18));
        }
        .login-overlay-content p {
          font-size: 14px;
          line-height: 1.7;
          opacity: .9;
        }
        @media (max-width: 640px) {
          .login-page {
            align-items: center;
            justify-content: center;
            padding: 24px;
          }
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
                <div className="login-logo-icon">SSE.</div>
                <span className="login-logo-text">USO</span>
              </div>
              <p className="login-subtitle">
                Sistema de Servicio Social Estudiantil — Universidad de Sonsonate
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
                  required
                  autoComplete="off"
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
                {loading ? 'Verificando...' : 'Iniciar sesión'}
              </button>

              {error && <div className="login-error">{error}</div>}
            </form>
          </div>

          <div className="login-overlay-side">
            <div className="login-overlay-content">
              <img className="login-welcome-logo" src="/logo-uso.png" alt="Logo USO" />
              <h1>¡Bienvenido!</h1>
              <p>Ingresa tus datos para acceder al sistema de servicio social</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
