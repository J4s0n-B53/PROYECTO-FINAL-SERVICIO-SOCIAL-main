const router = require('express').Router();
const inscripcionesController = require('../controllers/inscripcionesController');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

// GET /api/inscripciones
router.get('/',                authMiddleware,            inscripcionesController.getAll);

// POST /api/inscripciones
router.post('/',               authMiddleware,            inscripcionesController.inscribir);

// PATCH /api/inscripciones/:id/estado
router.patch('/:id/estado',    authMiddleware, adminOnly, inscripcionesController.cambiarEstado);

// PATCH /api/inscripciones/:id/horas
router.patch('/:id/horas',     authMiddleware, adminOnly, inscripcionesController.acreditarHoras);

// DELETE /api/inscripciones/:id
router.delete('/:id',          authMiddleware,            inscripcionesController.eliminar);

module.exports = router;
