const express = require('express');
const router = express.Router();
// 1. Import the NEW function names
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user
// 2. Use the new function name 'registerUser'
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Login a user
// 3. Use the new function name 'loginUser'
router.post('/login', loginUser);

module.exports = router;