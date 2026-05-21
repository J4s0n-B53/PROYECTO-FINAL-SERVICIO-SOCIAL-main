const usuariosService = require('../services/usuariosService');

async function getAll(req, res) {
  try {
    const rows = await usuariosService.getAll();
    res.json(rows);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

async function getMe(req, res) {
  try {
    const usuario = await usuariosService.getMe(req.user.id);
    res.json(usuario);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

async function actualizarHorasManuales(req, res) {
  try {
    await usuariosService.actualizarHorasManuales(req.params.id, req.body.horas_manuales);
    res.json({ ok: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

module.exports = { getAll, getMe, actualizarHorasManuales };
