const authService = require('../services/authService');

async function login(req, res) {
  const { correo, password } = req.body;
  if (!correo || !password)
    return res.status(400).json({ error: 'Correo y contraseña requeridos' });

  try {
    const result = await authService.login(correo, password);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

function me(req, res) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = authService.verifyToken(token);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = { login, me };
