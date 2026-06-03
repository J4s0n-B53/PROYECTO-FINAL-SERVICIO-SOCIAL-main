const pool = require('../database/connection');
const { syncAllStudentCareersFromEmail } = require('../utils/careerCode');
const META_NO_AMBIENTAL_SIN_AMBIENTAL = 475;

async function asegurarTablaHorasManuales(connection = pool) {
  await connection.query(
    `CREATE TABLE IF NOT EXISTS horas_manuales_acreditadas (
       id_hora_manual INT AUTO_INCREMENT PRIMARY KEY,
       id_estudiante INT NOT NULL,
       horas INT NOT NULL,
       descripcion VARCHAR(150) DEFAULT 'Acreditacion manual',
       fecha_acreditacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (id_estudiante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  );
}

function camposHorasAcumuladas() {
  return `
            LEAST(COALESCE(h.horas_no_ambientales, 0) + COALESCE(u.horas_manuales, 0), ${META_NO_AMBIENTAL_SIN_AMBIENTAL}) + COALESCE(ha.horas_ambientales, 0) AS horas_acumuladas,
            COALESCE(ha.horas_ambientales, 0) AS horas_ambientales,
            COALESCE(ha.horas_ambientales, 0) >= 25 AS ambiental_cumplido`;
}

function joinsHoras() {
  return `
     LEFT JOIN (
       SELECT i.id_estudiante,
              SUM(CASE WHEN o.es_ambiental = TRUE THEN 0 ELSE COALESCE(i.horas_acreditadas, o.horas_acreditar) END) AS horas_no_ambientales
       FROM inscripciones i
       JOIN ofertas o ON i.id_oferta = o.id_oferta
       WHERE i.estado = 'finalizado'
       GROUP BY i.id_estudiante
     ) h ON h.id_estudiante = u.id_usuario
     LEFT JOIN (
       SELECT i.id_estudiante,
              SUM(COALESCE(i.horas_acreditadas, o.horas_acreditar)) AS horas_ambientales
       FROM inscripciones i
       JOIN ofertas o ON i.id_oferta = o.id_oferta
       WHERE i.estado = 'finalizado' AND o.es_ambiental = TRUE
       GROUP BY i.id_estudiante
     ) ha ON ha.id_estudiante = u.id_usuario`;
}

async function getAll() {
  await syncAllStudentCareersFromEmail(pool);

  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo_institucional,
            u.rol, u.materias_aprobadas, u.horas_manuales, u.fecha_horas_manuales, u.created_at,
            c.nombre_carrera, c.codigo_carrera, f.nombre_facultad,
            ${camposHorasAcumuladas()}
     FROM usuarios u
     LEFT JOIN carreras   c ON u.id_carrera  = c.id_carrera
     LEFT JOIN facultades f ON c.id_facultad = f.id_facultad
     ${joinsHoras()}
     ORDER BY u.rol, u.nombre_completo`
  );
  return rows;
}

async function getMe(userId) {
  await syncAllStudentCareersFromEmail(pool);

  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo_institucional,
            u.rol, u.materias_aprobadas, u.horas_manuales, u.fecha_horas_manuales, u.created_at,
            c.id_carrera, c.nombre_carrera, c.codigo_carrera,
            f.nombre_facultad,
            ${camposHorasAcumuladas()}
     FROM usuarios u
     LEFT JOIN carreras   c ON u.id_carrera  = c.id_carrera
     LEFT JOIN facultades f ON c.id_facultad = f.id_facultad
     ${joinsHoras()}
     WHERE u.id_usuario = ?`,
    [userId]
  );
  if (!rows.length) throw { status: 404, message: 'Usuario no encontrado' };
  return rows[0];
}

async function actualizarHorasManuales(userId, horasManuales) {
  const horas = Number(horasManuales);
  if (!Number.isInteger(horas) || horas <= 0)
    throw { status: 400, message: 'Horas manuales invalidas' };
  if (horas > 500)
    throw { status: 400, message: 'No puedes acreditar mas de 500 horas manuales' };

  await asegurarTablaHorasManuales();

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[estudiante]] = await conn.query(
      `SELECT u.id_usuario, u.horas_manuales,
              COALESCE(h.horas_no_ambientales, 0) AS horas_no_ambientales
       FROM usuarios u
       LEFT JOIN (
         SELECT i.id_estudiante,
                SUM(CASE WHEN o.es_ambiental = TRUE THEN 0 ELSE COALESCE(i.horas_acreditadas, o.horas_acreditar) END) AS horas_no_ambientales
         FROM inscripciones i
         JOIN ofertas o ON i.id_oferta = o.id_oferta
         WHERE i.estado = 'finalizado'
         GROUP BY i.id_estudiante
       ) h ON h.id_estudiante = u.id_usuario
       WHERE u.id_usuario = ? AND u.rol = ?
       FOR UPDATE`,
      [userId, 'estudiante']
    );

    if (!estudiante)
      throw { status: 404, message: 'Estudiante no encontrado' };

    const totalNoAmbiental = Number(estudiante.horas_no_ambientales || 0) + Number(estudiante.horas_manuales || 0);
    const horasPermitidas = Math.max(META_NO_AMBIENTAL_SIN_AMBIENTAL - totalNoAmbiental, 0);
    const horasAcreditadas = Math.min(horas, horasPermitidas);

    if (horasAcreditadas <= 0) {
      throw {
        status: 400,
        message: 'El estudiante ya no tiene espacio para acreditar horas no ambientales. Reserva 25 horas para servicio ambiental.'
      };
    }

    await conn.query(
      `INSERT INTO horas_manuales_acreditadas (id_estudiante, horas, descripcion)
       VALUES (?, ?, ?)`,
      [userId, horasAcreditadas, 'Acreditacion manual']
    );

    await conn.query(
      `UPDATE usuarios
       SET horas_manuales = COALESCE(horas_manuales, 0) + ?,
           fecha_horas_manuales = CURRENT_TIMESTAMP
       WHERE id_usuario = ? AND rol = ?`,
      [horasAcreditadas, userId, 'estudiante']
    );

    await conn.commit();
    return {
      horas_solicitadas: horas,
      horas_acreditadas: horasAcreditadas,
      ajustado: horasAcreditadas < horas
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { getAll, getMe, actualizarHorasManuales, asegurarTablaHorasManuales };
