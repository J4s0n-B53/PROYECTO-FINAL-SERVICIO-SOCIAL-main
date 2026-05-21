const router = require('express').Router();
const usuariosController = require('../controllers/usuariosController');
const { authMiddleware, adminOnly } = require('../middlewares/auth');

// GET /api/usuarios  — solo admin
router.get('/',    authMiddleware, adminOnly, usuariosController.getAll);

// GET /api/usuarios/me — perfil propio
router.get('/me',  authMiddleware,            usuariosController.getMe);

module.exports = router;
