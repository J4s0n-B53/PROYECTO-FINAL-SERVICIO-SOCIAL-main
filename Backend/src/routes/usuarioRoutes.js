const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Asegúrate de que estas dos líneas existan
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;