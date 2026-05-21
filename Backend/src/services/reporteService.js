const pool = require('../database/connection');

/* Reporte individual por inscripción */
async function getReporte(inscripcionId, estudianteId) {
  const [rows] = await pool.query(
    `SELECT
       i.id_inscripcion, i.fecha_inscripcion, i.estado,
       u.nombre_completo, u.correo_institucional, u.materias_aprobadas,
       c.nombre_carrera, f.nombre_facultad,
       o.titulo AS oferta_titulo, o.descripcion AS oferta_descripcion,
       o.ubicacion, o.horario,
       COALESCE(i.horas_acreditadas, o.horas_acreditar) AS horas_acreditar
     FROM inscripciones i
     JOIN usuarios u ON i.id_estudiante = u.id_usuario
     JOIN ofertas  o ON i.id_oferta     = o.id_oferta
     LEFT JOIN carreras   c ON u.id_carrera  = c.id_carrera
     LEFT JOIN facultades f ON c.id_facultad = f.id_facultad
     WHERE i.id_inscripcion = ? AND i.id_estudiante = ? AND i.estado = 'finalizado'`,
    [inscripcionId, estudianteId]
  );
  if (!rows.length)
    throw { status: 404, message: 'Reporte no disponible o servicio no finalizado' };
  return rows[0];
}

/* Reporte GLOBAL — suma todas las inscripciones finalizadas */
async function getReporteGlobal(estudianteId) {
  const [[estudiante]] = await pool.query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo_institucional,
            u.materias_aprobadas, u.created_at,
            c.nombre_carrera, f.nombre_facultad
     FROM usuarios u
     LEFT JOIN carreras   c ON u.id_carrera  = c.id_carrera
     LEFT JOIN facultades f ON c.id_facultad = f.id_facultad
     WHERE u.id_usuario = ?`,
    [estudianteId]
  );
  if (!estudiante)
    throw { status: 404, message: 'Estudiante no encontrado' };

  const [actividades] = await pool.query(
    `SELECT o.titulo, o.ubicacion, o.horario,
            COALESCE(i.horas_acreditadas, o.horas_acreditar) AS horas_acreditar,
            i.fecha_inscripcion
     FROM inscripciones i
     JOIN ofertas o ON i.id_oferta = o.id_oferta
     WHERE i.id_estudiante = ? AND i.estado = 'finalizado'
     ORDER BY i.fecha_inscripcion ASC`,
    [estudianteId]
  );

  const totalHoras = actividades.reduce((a, i) => a + (i.horas_acreditar || 0), 0);
  const META = 500;

  if (totalHoras < META)
    throw { status: 403, message: `Aún no se completaron las ${META} horas requeridas (llevas ${totalHoras}h)` };

  return { estudiante, actividades, totalHoras, meta: META };
}

module.exports = { getReporte, getReporteGlobal };
