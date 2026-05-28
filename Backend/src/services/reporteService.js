const pool = require('../database/connection');
const { asegurarTablaHorasManuales } = require('./usuariosService');
const META_NO_AMBIENTAL_SIN_AMBIENTAL = 475;

/* Reporte individual por inscripción */
async function getReporte(inscripcionId, estudianteId) {
  const [rows] = await pool.query(
    `SELECT
       i.id_inscripcion,
       COALESCE(i.fecha_acreditacion, i.fecha_inscripcion) AS fecha_inscripcion,
       i.estado,
       u.nombre_completo, u.correo_institucional, u.materias_aprobadas,
       c.nombre_carrera, f.nombre_facultad,
       o.titulo AS oferta_titulo, o.descripcion AS oferta_descripcion,
       o.ubicacion, o.fecha_inicio, o.fecha_fin, o.hora_inicio, o.hora_fin,
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
            u.materias_aprobadas, u.horas_manuales, u.fecha_horas_manuales, u.created_at,
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
    `SELECT o.titulo, o.ubicacion, o.fecha_inicio, o.fecha_fin, o.hora_inicio, o.hora_fin, o.es_ambiental,
            COALESCE(i.horas_acreditadas, o.horas_acreditar) AS horas_acreditar,
            COALESCE(i.fecha_acreditacion, i.fecha_inscripcion) AS fecha_inscripcion
     FROM inscripciones i
     JOIN ofertas o ON i.id_oferta = o.id_oferta
     WHERE i.id_estudiante = ? AND i.estado = 'finalizado'
     ORDER BY COALESCE(i.fecha_acreditacion, i.fecha_inscripcion) ASC`,
    [estudianteId]
  );

  await asegurarTablaHorasManuales();

  const [registrosManuales] = await pool.query(
    `SELECT horas, descripcion, fecha_acreditacion
     FROM horas_manuales_acreditadas
     WHERE id_estudiante = ?
     ORDER BY fecha_acreditacion ASC, id_hora_manual ASC`,
    [estudianteId]
  );

  if (registrosManuales.length > 0) {
    registrosManuales.forEach((registro) => {
      actividades.push({
        titulo: 'Actividad externa',
        ubicacion: 'Externa a la universidad',
        fecha_inicio: null,
        fecha_fin: null,
        hora_inicio: null,
        hora_fin: null,
        es_ambiental: false,
        horas_acreditar: registro.horas,
        fecha_inscripcion: registro.fecha_acreditacion
      });
    });
  } else if ((estudiante.horas_manuales || 0) > 0) {
    actividades.push({
      titulo: 'Actividad externa',
      ubicacion: 'Externa a la universidad',
      fecha_inicio: null,
      fecha_fin: null,
      hora_inicio: null,
      hora_fin: null,
      es_ambiental: false,
      horas_acreditar: estudiante.horas_manuales,
      fecha_inscripcion: estudiante.fecha_horas_manuales || estudiante.created_at
    });
  }

  let horasNoAmbientalesUsadas = 0;
  const actividadesAjustadas = [];

  for (const actividad of actividades) {
    const horasActividad = Number(actividad.horas_acreditar || 0);

    if (actividad.es_ambiental) {
      actividadesAjustadas.push({ ...actividad, horas_acreditar: horasActividad });
      continue;
    }

    const espacioDisponible = META_NO_AMBIENTAL_SIN_AMBIENTAL - horasNoAmbientalesUsadas;
    if (espacioDisponible <= 0) continue;

    const horasContables = Math.min(horasActividad, espacioDisponible);
    actividadesAjustadas.push({ ...actividad, horas_acreditar: horasContables });
    horasNoAmbientalesUsadas += horasContables;
  }

  const horasAmbientales = actividadesAjustadas
    .filter(i => i.es_ambiental)
    .reduce((a, i) => a + (i.horas_acreditar || 0), 0);
  const horasNoAmbientales = actividadesAjustadas
    .filter(i => !i.es_ambiental)
    .reduce((a, i) => a + (i.horas_acreditar || 0), 0);
  const totalHoras = horasNoAmbientales + horasAmbientales;
  const META = 500;
  const META_AMBIENTAL = 25;
  const ambientalCumplido = horasAmbientales >= META_AMBIENTAL;

  if (totalHoras < META)
    throw { status: 403, message: `Aun no se completaron las ${META} horas requeridas (llevas ${totalHoras}h)` };

  if (!ambientalCumplido)
    throw { status: 403, message: `Aun no se completaron las ${META_AMBIENTAL} horas ambientales requeridas` };

  return { estudiante, actividades: actividadesAjustadas, totalHoras, meta: META, horasAmbientales, metaAmbiental: META_AMBIENTAL, ambientalCumplido };
}

module.exports = { getReporte, getReporteGlobal };
