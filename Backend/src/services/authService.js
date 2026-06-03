const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../database/connection');
const { JWT_SECRET } = require('../config/env');
const { syncCareerFromEmail } = require('../utils/careerCode');

const INSTITUTIONAL_DOMAIN = '@usonsonate.edu.sv';

async function login(correo, password) {
  const correoNormalizado = correo.toLowerCase().trim();

  if (!correoNormalizado.endsWith(INSTITUTIONAL_DOMAIN)) {
    throw { status: 400, message: 'Solo se permiten correos institucionales @usonsonate.edu.sv' };
  }

  const [rows] = await pool.query(
    `SELECT u.*, c.nombre_carrera
     FROM usuarios u
     LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
     WHERE u.correo_institucional = ?`,
    [correoNormalizado]
  );

  if (!rows.length) throw { status: 401, message: 'Credenciales incorrectas' };

  const user = rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) throw { status: 401, message: 'Credenciales incorrectas' };

  if (user.rol === 'estudiante') {
    user.id_carrera = await syncCareerFromEmail(
      pool,
      user.id_usuario,
      user.correo_institucional,
      user.id_carrera
    );
  }

  const [[career]] = user.id_carrera
    ? await pool.query('SELECT nombre_carrera FROM carreras WHERE id_carrera = ?', [user.id_carrera])
    : [[]];

  const token = jwt.sign(
    { id: user.id_usuario, rol: user.rol, nombre: user.nombre_completo },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    usuario: {
      id:        user.id_usuario,
      nombre:    user.nombre_completo,
      correo:    user.correo_institucional,
      rol:       user.rol,
      materias:  user.materias_aprobadas,
      carrera:   career?.nombre_carrera || user.nombre_carrera || null,
      id_carrera:user.id_carrera || null,
    },
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function getAuthUserById(userId) {
  const [[usuarioBase]] = await pool.query(
    `SELECT id_usuario, correo_institucional, id_carrera, rol
     FROM usuarios
     WHERE id_usuario = ?`,
    [userId]
  );

  if (usuarioBase?.rol === 'estudiante') {
    await syncCareerFromEmail(
      pool,
      usuarioBase.id_usuario,
      usuarioBase.correo_institucional,
      usuarioBase.id_carrera
    );
  }

  const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre_completo, u.correo_institucional,
            u.rol, u.materias_aprobadas, c.nombre_carrera, u.id_carrera
     FROM usuarios u
     LEFT JOIN carreras c ON u.id_carrera = c.id_carrera
     WHERE u.id_usuario = ?`,
    [userId]
  );

  if (!rows.length) throw { status: 404, message: 'Usuario no encontrado' };

  const user = rows[0];
  return {
    id: user.id_usuario,
    nombre: user.nombre_completo,
    correo: user.correo_institucional,
    rol: user.rol,
    materias: user.materias_aprobadas,
    carrera: user.nombre_carrera || null,
    id_carrera: user.id_carrera || null,
  };
}

module.exports = { login, verifyToken, getAuthUserById };
