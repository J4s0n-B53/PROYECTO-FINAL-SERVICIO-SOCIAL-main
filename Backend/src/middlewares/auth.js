const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { AUTH_COOKIE_NAME, getCookie } = require('../controllers/authController');

function authMiddleware(req, res, next) {
  const token = getCookie(req, AUTH_COOKIE_NAME);
  if (!token) return res.status(401).json({ error: 'Sesión requerida' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.rol !== 'admin')
    return res.status(403).json({ error: 'Solo administradores' });
  next();
}

module.exports = { authMiddleware, adminOnly };
