const pool = require('../database/connection');

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

async function create({ titulo, descripcion, ubicacion, horario, horas_acreditar,
                        imagen_url, cupo_maximo, id_carrera }, adminId) {
  const [result] = await pool.query(
    `INSERT INTO ofertas
      (titulo, descripcion, ubicacion, horario, horas_acreditar,
       imagen_url, cupo_maximo, id_carrera, id_admin_creador)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [titulo, descripcion, ubicacion || null, horario || null,
     horas_acreditar, imagen_url || null, cupo_maximo,
     id_carrera || null, adminId]
  );
  return { id: result.insertId };
}

async function update(id, { titulo, descripcion, ubicacion, horario, horas_acreditar,
                            imagen_url, cupo_maximo, id_carrera, activo }) {
  await pool.query(
    `UPDATE ofertas SET
      titulo=?, descripcion=?, ubicacion=?, horario=?,
      horas_acreditar=?, imagen_url=?, cupo_maximo=?,
      id_carrera=?, activo=?
     WHERE id_oferta=?`,
    [titulo, descripcion, ubicacion || null, horario || null,
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
