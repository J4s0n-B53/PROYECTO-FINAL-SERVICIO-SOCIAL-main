const router = require('express').Router();
const ofertasController = require('../controllers/ofertasController');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

// POST /api/ofertas/upload-imagen
router.post('/upload-imagen', authMiddleware, adminOnly, ofertasController.uploadImagen);

// GET /api/ofertas
router.get('/', authMiddleware, ofertasController.getAll);

// GET /api/ofertas/:id
router.get('/:id', authMiddleware,  ofertasController.getById);

// POST /api/ofertas
router.post('/', authMiddleware, adminOnly, ofertasController.create);

// PUT /api/ofertas/:id
router.put('/:id', authMiddleware, adminOnly, ofertasController.update);

// PATCH /api/ofertas/:id/toggle
router.patch('/:id/toggle', authMiddleware, adminOnly, ofertasController.toggle);

module.exports = router;
