const User = require('../models/User');
const ScanHistory = require('../models/ScanHistory');
const EmailHistory = require('../models/EmailHistory');

// @desc    Get site-wide statistics
exports.getSiteStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUrlScans = await ScanHistory.countDocuments();
    const totalEmailScans = await EmailHistory.countDocuments();

    // Find the 5 most recently registered users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password'); // Don't send back passwords

    res.json({
      totalUsers,
      totalUrlScans,
      totalEmailScans,
      recentUsers
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all users (for user management)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};