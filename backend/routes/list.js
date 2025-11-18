const express = require('express');
const router = express.Router();
const { getList, addDomain, removeDomain } = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:listType', authMiddleware, getList);
router.post('/:listType', authMiddleware, addDomain);
// Use a POST for deletion to send the domain in the body, it's simpler
router.post('/:listType/delete', authMiddleware, removeDomain); 

module.exports = router;