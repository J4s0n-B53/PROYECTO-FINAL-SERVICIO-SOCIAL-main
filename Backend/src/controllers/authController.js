const authService = require('../services/authService');

const AUTH_COOKIE_NAME = 'sse_auth';
const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000;

function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
}

function clearAuthCookieOptions() {
  const { maxAge, ...options } = authCookieOptions();
  return options;
}

function getCookie(req, name) {
  const raw = req.headers.cookie;
  if (!raw) return null;

  return raw
    .split(';')
    .map(cookie => cookie.trim())
    .reduce((found, cookie) => {
      if (found) return found;
      const [key, ...value] = cookie.split('=');
      return key === name ? decodeURIComponent(value.join('=')) : null;
    }, null);
}

async function login(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password)
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });

  try {
    const result = await authService.login(correo, password);
    res.cookie(AUTH_COOKIE_NAME, result.token, authCookieOptions());
    res.json({ usuario: result.usuario });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

async function me(req, res) {
  const token = getCookie(req, AUTH_COOKIE_NAME);
  if (!token) return res.status(401).json({ error: 'Sesión requerida' });

  try {
    const decoded = authService.verifyToken(token);
    const usuario = await authService.getAuthUserById(decoded.id);
    res.json({ valid: true, usuario });
  } catch {
    res.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions());
    res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

function logout(req, res) {
  res.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions());
  res.json({ mensaje: 'Sesión cerrada' });
}

module.exports = { login, me, logout, AUTH_COOKIE_NAME, authCookieOptions, getCookie };
