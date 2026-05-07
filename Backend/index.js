const express = require('express');
const cors = require('cors');
const db = require('./src/config/database');
require('dotenv').config();

// --- IMPORTACIÓN DE RUTAS ---
// Les damos nombres distintos para que no choquen
const authRoutes = require('./src/routes/authRoutes');
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const ofertaRoutes = require('./src/routes/ofertaRoutes');

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// Prueba de estado
app.get('/test', (req, res) => res.send('El servidor responde correctamente'));

// --- CONEXIÓN A LA BASE DE DATOS ---
db.authenticate()
    .then(() => console.log('Conexión a SQL Server exitosa...'))
    .catch(err => console.log('Error al conectar a la Base de Datos: ' + err));

// --- USO DE RUTAS ---
// Ahora puedes usar ambos puntos de entrada
app.use('/api/auth', authRoutes);       // Para Login y Registro
app.use('/api/usuarios', usuarioRoutes); // Para otras cosas de usuarios si las tienes
app.use('/api/ofertas', ofertaRoutes);   // Para las ofertas de servicio social

// --- ARRANQUE DEL SERVIDOR ---
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});