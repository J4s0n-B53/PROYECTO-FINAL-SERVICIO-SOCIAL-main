function extractCareerCodeFromEmail(email) {
  if (!email || typeof email !== 'string') return null;

  const localPart = email.split('@')[0]?.toLowerCase();
  if (!localPart) return null;

  const match = localPart.match(/^[a-z]{2}\d{2}([a-z]\d{2})\d{3}$/i);
  return match ? match[1].toUpperCase() : null;
}

async function syncCareerFromEmail(connection, userId, email, currentCareerId) {
  const codigoCarrera = extractCareerCodeFromEmail(email);
  if (!codigoCarrera) return currentCareerId || null;

  const [[carrera]] = await connection.query(
    'SELECT id_carrera FROM carreras WHERE codigo_carrera = ? LIMIT 1',
    [codigoCarrera]
  );

  if (!carrera) return currentCareerId || null;

  if (currentCareerId !== carrera.id_carrera) {
    await connection.query(
      'UPDATE usuarios SET id_carrera = ? WHERE id_usuario = ? AND rol = ?',
      [carrera.id_carrera, userId, 'estudiante']
    );
  }

  return carrera.id_carrera;
}

async function syncAllStudentCareersFromEmail(connection) {
  const [users] = await connection.query(
    `SELECT id_usuario, correo_institucional, id_carrera
     FROM usuarios
     WHERE rol = 'estudiante'`
  );

  for (const user of users) {
    await syncCareerFromEmail(
      connection,
      user.id_usuario,
      user.correo_institucional,
      user.id_carrera
    );
  }
}

module.exports = {
  extractCareerCodeFromEmail,
  syncCareerFromEmail,
  syncAllStudentCareersFromEmail,
};
