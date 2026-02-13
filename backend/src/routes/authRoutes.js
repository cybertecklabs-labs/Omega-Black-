const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('username').notEmpty()
], register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
