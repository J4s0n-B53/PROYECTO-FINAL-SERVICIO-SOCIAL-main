const Usuario = require('../models/usuario');

exports.login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        // 1. Buscar al usuario (Usamos el Modelo 'Usuario' con U mayúscula)
        // Guardamos el resultado en una variable nueva llamada 'userFound'
        const userFound = await Usuario.findOne({ where: { correo_institucional: correo } });

        if (!userFound) {
            return res.status(404).json({ mensaje: 'El correo no existe en el sistema' });
        }

        // 2. Verificar contraseña usando 'userFound'
        if (userFound.password_hash !== password) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        // 3. Verificar materias usando 'userFound'
        if (userFound.rol === 'estudiante' && userFound.materias_aprobadas < 25) {
            return res.status(403).json({ 
                mensaje: 'NO ESTÁS APTO AÚN', 
                materias: userFound.materias_aprobadas 
            });
        }

        // 4. Si todo está bien
        res.json({
            mensaje: 'Bienvenido al sistema',
            user: {
                nombre: userFound.nombre_completo,
                rol: userFound.rol,
                carrera: userFound.id_carrera
            }
        });

    } catch (error) {
        console.error("❌ ERROR REAL:", error);
        res.status(500).json({ mensaje: 'Error en el servidor', detalle: error.message });
    }
};