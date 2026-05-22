const pool = require('../database/connection');
const MAX_HORAS_OFERTA = 500;

function validarOferta({ horas_acreditar, cupo_maximo }) {
  const horas = Number(horas_acreditar);
  const cupo = Number(cupo_maximo);

  if (!Number.isInteger(horas) || horas < 1 || horas > MAX_HORAS_OFERTA)
    throw { status: 400, message: `Las horas a acreditar deben estar entre 1 y ${MAX_HORAS_OFERTA}` };
  if (!Number.isInteger(cupo) || cupo < 1)
    throw { status: 400, message: 'El cupo máximo debe ser mayor a 0' };
}

function validarFechas({ fecha_inicio, fecha_fin, hora_inicio, hora_fin }) {
  if (fecha_inicio && fecha_fin && fecha_inicio > fecha_fin)
    throw { status: 400, message: 'La fecha de finalización no puede ser anterior a la fecha de inicio' };
  if (fecha_inicio && fecha_fin && fecha_inicio === fecha_fin && hora_inicio && hora_fin && hora_inicio > hora_fin)
    throw { status: 400, message: 'La hora de finalización no puede ser anterior a la hora de inicio' };
}

async function getAll(userRol) {
  let sql = `
    SELECT o.*, c.nombre_carrera,
           u.nombre_completo AS admin_nombre
    FROM ofertas o
    LEFT JOIN carreras c ON o.id_carrera = c.id_carrera
    LEFT JOIN usuarios u ON o.id_admin_creador = u.id_usuario
  `;
  if (userRol !== 'admin') sql += ' WHERE o.activo = TRUE';
  sql += ' ORDER BY o.created_at DESC';

  const [rows] = await pool.query(sql);
  return rows;
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT o.*, c.nombre_carrera
     FROM ofertas o
     LEFT JOIN carreras c ON o.id_carrera = c.id_carrera
     WHERE o.id_oferta = ?`,
    [id]
  );
  if (!rows.length) throw { status: 404, message: 'Oferta no encontrada' };
  return rows[0];
}

async function create({ titulo, descripcion, ubicacion, horario, fecha_inicio, fecha_fin, hora_inicio, hora_fin, horas_acreditar,
                        imagen_url, cupo_maximo, id_carrera }, adminId) {
  validarOferta({ horas_acreditar, cupo_maximo });
  validarFechas({ fecha_inicio, fecha_fin, hora_inicio, hora_fin });

  const [result] = await pool.query(
    `INSERT INTO ofertas
      (titulo, descripcion, ubicacion, horario, fecha_inicio, fecha_fin, hora_inicio, hora_fin, horas_acreditar,
       imagen_url, cupo_maximo, id_carrera, id_admin_creador)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [titulo, descripcion, ubicacion || null, horario || null,
     fecha_inicio || null, fecha_fin || null, hora_inicio || null, hora_fin || null,
     horas_acreditar, imagen_url || null, cupo_maximo,
     id_carrera || null, adminId]
  );
  return { id: result.insertId };
}

async function update(id, { titulo, descripcion, ubicacion, horario, fecha_inicio, fecha_fin, hora_inicio, hora_fin, horas_acreditar,
                            imagen_url, cupo_maximo, id_carrera, activo }) {
  validarOferta({ horas_acreditar, cupo_maximo });
  validarFechas({ fecha_inicio, fecha_fin, hora_inicio, hora_fin });

  await pool.query(
    `UPDATE ofertas SET
      titulo=?, descripcion=?, ubicacion=?, horario=?,
      fecha_inicio=?, fecha_fin=?, hora_inicio=?, hora_fin=?,
      horas_acreditar=?, imagen_url=?, cupo_maximo=?,
      id_carrera=?, activo=?
     WHERE id_oferta=?`,
    [titulo, descripcion, ubicacion || null, horario || null,
     fecha_inicio || null, fecha_fin || null, hora_inicio || null, hora_fin || null,
     horas_acreditar, imagen_url || null, cupo_maximo,
     id_carrera || null, activo ?? true, id]
  );
}

async function toggle(id) {
  await pool.query(
    'UPDATE ofertas SET activo = NOT activo WHERE id_oferta = ?',
    [id]
  );
}

module.exports = { getAll, getById, create, update, toggle };
