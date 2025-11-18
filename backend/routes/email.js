const express = require('express');
const router = express.Router();
// 1. Import the new function
const { checkEmailBreach, getEmailHistory } = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

// This route already exists
router.post('/check', authMiddleware, checkEmailBreach);

// 2. Add this new route
router.get('/history', authMiddleware, getEmailHistory);

module.exports = router;