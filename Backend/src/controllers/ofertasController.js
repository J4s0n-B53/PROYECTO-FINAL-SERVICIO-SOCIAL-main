const ofertasService = require('../services/ofertasService');

async function getAll(req, res) {
  try {
    const rows = await ofertasService.getAll(req.user.rol);
    res.json(rows);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al obtener ofertas' });
  }
}

async function getById(req, res) {
  try {
    const oferta = await ofertasService.getById(req.params.id);
    res.json(oferta);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

async function create(req, res) {
  const { titulo, descripcion, horas_acreditar, cupo_maximo } = req.body;
  if (!titulo || !descripcion || !horas_acreditar || !cupo_maximo)
    return res.status(400).json({ error: 'Faltan campos obligatorios' });

  try {
    const result = await ofertasService.create(req.body, req.user.id);
    res.status(201).json({ id: result.id, mensaje: 'Oferta creada' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al crear oferta' });
  }
}

async function update(req, res) {
  try {
    await ofertasService.update(req.params.id, req.body);
    res.json({ mensaje: 'Oferta actualizada' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error al actualizar oferta' });
  }
}

async function toggle(req, res) {
  try {
    await ofertasService.toggle(req.params.id);
    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
}

module.exports = { getAll, getById, create, update, toggle };
