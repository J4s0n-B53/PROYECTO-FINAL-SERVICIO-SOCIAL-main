const pool = require('../database/connection');
const MIN_MATERIAS_APROBADAS = 30;

async function getAll(user) {
  let sql, params = [];

  if (user.rol === 'admin') {
    sql = `
      SELECT i.*,
             u.nombre_completo AS estudiante_nombre,
             u.correo_institucional,
             c.nombre_carrera,
             o.titulo AS oferta_titulo,
             o.horas_acreditar AS horas_oferta,
             COALESCE(i.horas_acreditadas, o.horas_acreditar) AS horas_acreditar
      FROM inscripciones i
      JOIN usuarios u ON i.id_estudiante = u.id_usuario
      LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
      JOIN ofertas  o ON i.id_oferta    = o.id_oferta
      ORDER BY i.fecha_inscripcion DESC
    `;
  } else {
    sql = `
      SELECT i.*,
             o.titulo AS oferta_titulo,
             o.horas_acreditar AS horas_oferta,
             COALESCE(i.horas_acreditadas, o.horas_acreditar) AS horas_acreditar,
             o.ubicacion, o.horario
      FROM inscripciones i
      JOIN ofertas o ON i.id_oferta = o.id_oferta
      WHERE i.id_estudiante = ?
      ORDER BY i.fecha_inscripcion DESC
    `;
    params = [user.id];
  }

  const [rows] = await pool.query(sql, params);
  return rows;
}

async function inscribir(estudianteId, ofertaId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[estudiante]] = await conn.query(
      'SELECT materias_aprobadas FROM usuarios WHERE id_usuario = ? FOR UPDATE',
      [estudianteId]
    );
    if (!estudiante) throw { status: 404, message: 'Estudiante no encontrado' };
    if ((estudiante.materias_aprobadas || 0) < MIN_MATERIAS_APROBADAS)
      throw { status: 403, message: 'Te falta aprobar al menos el 50% de materias para inscribirte' };

    const [[oferta]] = await conn.query(
      'SELECT * FROM ofertas WHERE id_oferta = ? AND activo = TRUE FOR UPDATE',
      [ofertaId]
    );
    if (!oferta) throw { status: 404, message: 'Oferta no disponible' };
    if (oferta.cupo_actual >= oferta.cupo_maximo)
      throw { status: 409, message: 'Sin cupo disponible' };

    const [[existe]] = await conn.query(
      'SELECT id_inscripcion FROM inscripciones WHERE id_estudiante=? AND id_oferta=?',
      [estudianteId, ofertaId]
    );
    if (existe) throw { status: 409, message: 'Ya estás inscrito en esta oferta' };

    await conn.query(
      'INSERT INTO inscripciones (id_estudiante, id_oferta) VALUES (?,?)',
      [estudianteId, ofertaId]
    );
    await conn.query(
      'UPDATE ofertas SET cupo_actual = cupo_actual + 1 WHERE id_oferta = ?',
      [ofertaId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    if (err.code === 'ER_DUP_ENTRY')
      throw { status: 409, message: 'Ya estás inscrito en esta oferta' };
    throw err;
  } finally {
    conn.release();
  }
}

async function cambiarEstado(id, estado) {
  const validos = ['pendiente', 'aceptado', 'finalizado', 'rechazado'];
  if (!validos.includes(estado))
    throw { status: 400, message: 'Estado inválido' };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[inscripcion]] = await conn.query(
      'SELECT id_oferta, estado FROM inscripciones WHERE id_inscripcion = ? FOR UPDATE',
      [id]
    );
    if (!inscripcion) throw { status: 404, message: 'Inscripción no encontrada' };

    await conn.query(
      'UPDATE inscripciones SET estado=? WHERE id_inscripcion=?',
      [estado, id]
    );

    if (estado === 'rechazado' && inscripcion.estado !== 'rechazado') {
      await conn.query(
        'UPDATE ofertas SET cupo_actual = GREATEST(cupo_actual - 1, 0) WHERE id_oferta = ?',
        [inscripcion.id_oferta]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function acreditarHoras(id, horasAcreditadas) {
  const horas = Number(horasAcreditadas);
  if (!Number.isInteger(horas) || horas < 0)
    throw { status: 400, message: 'Horas acreditadas inválidas' };

  const [[inscripcion]] = await pool.query(
    `SELECT i.id_inscripcion, o.horas_acreditar
     FROM inscripciones i
     JOIN ofertas o ON i.id_oferta = o.id_oferta
     WHERE i.id_inscripcion = ?`,
    [id]
  );

  if (!inscripcion) throw { status: 404, message: 'Inscripción no encontrada' };
  if (horas > inscripcion.horas_acreditar)
    throw { status: 400, message: `No puedes acreditar más de ${inscripcion.horas_acreditar} horas` };

  await pool.query(
    `UPDATE inscripciones
     SET horas_acreditadas = ?, estado = 'finalizado'
     WHERE id_inscripcion = ?`,
    [horas, id]
  );
}

async function eliminar(id, user) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[inscripcion]] = await conn.query(
      'SELECT id_oferta, id_estudiante, estado, horas_acreditadas FROM inscripciones WHERE id_inscripcion = ? FOR UPDATE',
      [id]
    );
    if (!inscripcion) throw { status: 404, message: 'Inscripción no encontrada' };

    if (user?.rol !== 'admin' && inscripcion.id_estudiante !== user?.id)
      throw { status: 403, message: 'No puedes eliminar esta inscripción' };
    if (user?.rol === 'estudiante' && inscripcion.estado !== 'pendiente')
      throw { status: 409, message: 'Solo puedes desuscribirte mientras la inscripción está pendiente' };

    if (inscripcion.estado === 'finalizado' || inscripcion.horas_acreditadas !== null)
      throw { status: 409, message: 'No puedes eliminar una inscripción con horas acreditadas' };

    await conn.query('DELETE FROM inscripciones WHERE id_inscripcion = ?', [id]);
    await conn.query(
      'UPDATE ofertas SET cupo_actual = GREATEST(cupo_actual - 1, 0) WHERE id_oferta = ?',
      [inscripcion.id_oferta]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { getAll, inscribir, cambiarEstado, acreditarHoras, eliminar };
