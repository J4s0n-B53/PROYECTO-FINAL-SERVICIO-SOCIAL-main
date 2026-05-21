const router = require('express').Router();
const carrerasController = require('../controllers/carrerasController');
const { authMiddleware } = require('../middlewares/auth');

// GET /api/carreras
router.get('/', authMiddleware, carrerasController.getAll);

module.exports = router;
