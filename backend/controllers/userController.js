const User = require('../models/User');
const ScanHistory = require('../models/ScanHistory');
const EmailHistory = require('../models/EmailHistory');
const mongoose = require('mongoose'); // <--- 1. IMPORT MONGOOSE
const bcrypt = require('bcryptjs');

// @desc    Get user scan analytics (FIXED AGGREGATION)
exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = new mongoose.Types.ObjectId(userId); // <--- 2. CONVERT ID TO OBJECTID

    // 1. URL Scan Aggregation
    const urlStats = await ScanHistory.aggregate([
      { $match: { user: userObjectId } }, // <--- USE OBJECTID IN MATCH
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          malicious: { $sum: { $cond: [{ $eq: ["$isMalicious", true] }, 1, 0] } },
          totalRiskScore: { $sum: "$scanResult.risk_score" }
        }
      }
    ]);

    // 2. Email Scan Aggregation
    const emailStats = await EmailHistory.aggregate([
      { $match: { user: userObjectId } }, // <--- USE OBJECTID IN MATCH
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          breached: { $sum: { $cond: [{ $eq: ["$isBreached", true] }, 1, 0] } }
        }
      }
    ]);
    
    // --- Consolidate and Calculate (rest of the code is the same) ---
    const urlData = urlStats.length > 0 ? urlStats[0] : {};
    const emailData = emailStats.length > 0 ? emailStats[0] : {};
    
    const totalUrlScans = urlData.total || 0;
    
    const avgUrlRiskScore = totalUrlScans > 0 
      ? Math.round(urlData.totalRiskScore / totalUrlScans) 
      : 0;

    res.json({
      totalUrlScans: totalUrlScans,
      totalMaliciousUrlScans: urlData.malicious || 0,
      avgUrlRiskScore: avgUrlRiskScore,
      totalEmailScans: emailData.total || 0,
      totalBreachedEmails: emailData.breached || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// ... (exports.updatePassword is unchanged)
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Incorrect current password' });
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};