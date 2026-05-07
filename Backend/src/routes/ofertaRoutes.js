const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');

router.get('/', ofertaController.obtenerOfertas);

module.exports = router;