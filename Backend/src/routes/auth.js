const router = require('express').Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me
router.get('/me', authController.me);

module.exports = router;
