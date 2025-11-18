const express = require('express');
const router = express.Router();
// Ensure you are importing the functions from scanController.js
const { scanUrl, getHistory } = require('../controllers/scanController'); 
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST api/scan/
// @desc    Scan a URL
// @access  Private 
router.post('/', authMiddleware, scanUrl); // <--- This route definition is crucial

// @route   GET api/scan/history
// @desc    Get user scan history
// @access  Private
router.get('/history', authMiddleware, getHistory);

module.exports = router;