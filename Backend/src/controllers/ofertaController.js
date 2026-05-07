const Oferta = require('../models/Oferta');

exports.obtenerOfertas = async (req, res) => {
    try {
        const { carreraId } = req.query; 

        // Creamos la configuración de la consulta
        let opciones = {};

        // Si viene carreraId, filtramos. Si no, trae todas.
        if (carreraId && carreraId !== 'undefined') {
            opciones = {
                where: {
                    id_carrera: carreraId 
                }
            };
        }

        const ofertas = await Oferta.findAll(opciones);
        
        // Es vital enviar aunque sea un arreglo vacío [] para que React no falle
        res.json(ofertas);
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ 
            mensaje: "Error al obtener las ofertas",
            error: error.message 
        });
    }
};