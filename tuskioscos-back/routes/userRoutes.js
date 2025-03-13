const express = require('express');
const { login, register, logout, infoUser } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/', authenticate, infoUser);

module.exports = router;