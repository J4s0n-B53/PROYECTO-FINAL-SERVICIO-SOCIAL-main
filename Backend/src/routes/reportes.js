const router = require('express').Router();
const ctrl   = require('../controllers/reporteController');
const { authMiddleware } = require('../middlewares/auth');

// ⚠️ La ruta específica SIEMPRE antes que la genérica
router.get('/global/:estudianteId', authMiddleware, ctrl.getReporteGlobal);
router.get('/:id',                  authMiddleware, ctrl.getReporte);

module.exports = router;