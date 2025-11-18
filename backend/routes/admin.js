const express = require('express');
const router = express.Router();
const { getSiteStats, getAllUsers } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET api/admin/stats
// @desc    Get site-wide stats
// @access  Private (Admin only)
router.get('/stats', [authMiddleware, adminMiddleware], getSiteStats);

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', [authMiddleware, adminMiddleware], getAllUsers);

module.exports = router;