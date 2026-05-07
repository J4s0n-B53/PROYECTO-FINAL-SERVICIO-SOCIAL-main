const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Oferta = db.define('Oferta', {
    // Definición de los campos de la tabla 'ofertas'
    id_oferta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING },
    descripcion: { type: DataTypes.TEXT },
    ubicacion: { type: DataTypes.STRING },
    horario: { type: DataTypes.STRING },
    horas_acreditar: { type: DataTypes.INTEGER },
    imagen_url: { type: DataTypes.STRING },
    cupo_maximo: { type: DataTypes.INTEGER }, 
    cupo_actual: { type: DataTypes.INTEGER },//
    activo: { type: DataTypes.BOOLEAN },
    id_carrera: { type: DataTypes.INTEGER },
    id_admin_creador: { type: DataTypes.INTEGER }
}, {
    tableName: 'ofertas',
    timestamps: false
});

module.exports = Oferta;