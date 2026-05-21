const carrerasService = require('../services/carrerasService');

async function getAll(req, res) {
  try {
    const rows = await carrerasService.getAll();
    res.json(rows);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

module.exports = { getAll };
