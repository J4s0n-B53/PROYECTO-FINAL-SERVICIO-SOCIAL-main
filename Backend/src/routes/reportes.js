const router = require('express').Router();
const ctrl   = require('../controllers/reporteController');
const { authMiddleware } = require('../middlewares/auth');

router.get('/global/:estudianteId', authMiddleware, ctrl.getReporteGlobal);
router.get('/:id', authMiddleware, ctrl.getReporte);

module.exports = router;