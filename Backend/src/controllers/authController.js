const db = require('../config/database');

const login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const [results] = await db.query(
            "SELECT * FROM usuarios WHERE correo_institucional = ?", 
            { replacements: [correo] }
        );

        if (results.length === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const user = results[0];
        if (user.password_hash !== password) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        // --- CAMBIO AQUÍ PARA QUE COINCIDA CON TU FRONTEND ---
        res.json({
            mensaje: "¡Bienvenido!",
            user: { 
                id_usuario: user.id_usuario, 
                nombre_completo: user.nombre_completo, // Cambiado de 'nombre' a 'nombre_completo'
                id_carrera: user.id_carrera, 
                rol: user.rol 
            }
        });
    } catch (err) {
        res.status(500).json({ mensaje: "Error de servidor", error: err.message });
    }
};

const register = async (req, res) => {
    const { nombre_completo, id_carrera, correo_institucional, password_hash } = req.body;
    try {
        await db.query(
            `INSERT INTO usuarios (nombre_completo, id_carrera, correo_institucional, password_hash, rol, materias_aprobadas) 
             VALUES (?, ?, ?, ?, 'estudiante', 0)`,
            { replacements: [nombre_completo, id_carrera, correo_institucional, password_hash] }
        );
        res.status(201).json({ mensaje: "Usuario registrado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error: El correo ya existe en MySQL" });
    }
};

module.exports = { login, register };