const pool = require('../database/connection');

async function getAll() {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo_institucional,
            u.rol, u.materias_aprobadas, u.created_at,
            c.nombre_carrera, f.nombre_facultad,
            COALESCE(h.horas_acumuladas, 0) AS horas_acumuladas
     FROM usuarios u
     LEFT JOIN carreras   c ON u.id_carrera  = c.id_carrera
     LEFT JOIN facultades f ON c.id_facultad = f.id_facultad
     LEFT JOIN (
       SELECT i.id_estudiante,
              SUM(COALESCE(i.horas_acreditadas, o.horas_acreditar)) AS horas_acumuladas
       FROM inscripciones i
       JOIN ofertas o ON i.id_oferta = o.id_oferta
       WHERE i.estado = 'finalizado'
       GROUP BY i.id_estudiante
     ) h ON h.id_estudiante = u.id_usuario
     ORDER BY u.rol, u.nombre_completo`
  );
  return rows;
}

async function getMe(userId) {
  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo_institucional,
            u.rol, u.materias_aprobadas, u.created_at,
            c.id_carrera, c.nombre_carrera,
            f.nombre_facultad
     FROM usuarios u
     LEFT JOIN carreras   c ON u.id_carrera  = c.id_carrera
     LEFT JOIN facultades f ON c.id_facultad = f.id_facultad
     WHERE u.id_usuario = ?`,
    [userId]
  );
  if (!rows.length) throw { status: 404, message: 'Usuario no encontrado' };
  return rows[0];
}

module.exports = { getAll, getMe };
