const express = require("express");
const router = express.Router();
// Ensure BOTH functions are imported by name
const {
  getUserAnalytics,
  updatePassword,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET api/user/analytics
// @desc    Get scan analytics for the logged-in user
// @access  Private
router.get("/analytics", authMiddleware, getUserAnalytics);

// @route   PUT api/user/password
// @desc    Update user password
// @access  Private
router.put("/password", authMiddleware, updatePassword); // This line requires updatePassword to be a function

module.exports = router;
