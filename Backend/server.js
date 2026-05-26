require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { PORT } = require('./src/config/env');

const app = express();

// Middlewares globales
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/reportes', require('./src/routes/reportes'));
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/ofertas', require('./src/routes/ofertas'));
app.use('/api/inscripciones', require('./src/routes/inscripciones'));
app.use('/api/usuarios', require('./src/routes/usuarios'));
app.use('/api/carreras', require('./src/routes/carreras'));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Iniciar servidor
app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
