const express = require('express');
const router = express.Router();
// Importamos todo el objeto del controlador para que sea más fácil
const authController = require('../controllers/authController');

// Ahora sí, usamos el objeto authController para acceder a ambas funciones
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
