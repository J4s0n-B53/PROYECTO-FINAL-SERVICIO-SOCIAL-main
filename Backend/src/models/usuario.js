const { DataTypes } = require('sequelize');
const db = require('../config/database');
// Definición del modelo 'Usuario' con los campos correspondientes a la tabla 'usuarios'
const Usuario = db.define('Usuario', {
    // Definición de los campos de la tabla 'usuarios'
    id_usuario: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true,
        field: 'id_usuario' // 
    },
    nombre_completo: { 
        type: DataTypes.STRING,
        field: 'nombre_completo' //
    },
    correo_institucional: { 
        type: DataTypes.STRING, 
        unique: true,
        field: 'correo_institucional'
    },
    password_hash: { 
        type: DataTypes.STRING,
        field: 'password_hash'
    },
    rol: { 
        type: DataTypes.ENUM('estudiante', 'admin') 
    },
    materias_aprobadas: { 
        type: DataTypes.INTEGER,
        field: 'materias_aprobadas'
    },
    id_carrera: { 
        type: DataTypes.INTEGER,
        field: 'id_carrera'
    }
}, {
    tableName: 'usuarios',
    timestamps: false 
});

module.exports = Usuario;