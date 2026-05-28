const ofertasService = require('../services/ofertasService');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../../uploads/ofertas');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten archivos de imagen'));
      return;
    }
    cb(null, true);
  }
}).single('imagen');

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
  const {
    titulo, descripcion, ubicacion, fecha_inicio, fecha_fin, hora_inicio, hora_fin,
    horas_acreditar, cupo_maximo, es_ambiental
  } = req.body;
  if (!titulo || !descripcion || !ubicacion || !fecha_inicio || !fecha_fin || !hora_inicio || !hora_fin || (!es_ambiental && !horas_acreditar) || !cupo_maximo)
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

function uploadImagen(req, res) {
  upload(req, res, err => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 400 : 500;
      const error = err.code === 'LIMIT_FILE_SIZE'
        ? 'La imagen no puede superar 5 MB'
        : err.message || 'Error al subir imagen';
      return res.status(status).json({ error });
    }

    if (!req.file) return res.status(400).json({ error: 'Selecciona una imagen' });

    res.status(201).json({
      imagen_url: `/uploads/ofertas/${req.file.filename}`
    });
  });
}

module.exports = { getAll, getById, create, update, toggle, uploadImagen };
