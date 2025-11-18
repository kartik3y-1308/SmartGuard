const axios = require('axios');
const EmailHistory = require('../models/EmailHistory'); // 1. Import the new model
require('dotenv').config();

// @desc    Check an email's risk and breach status
exports.checkEmailBreach = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    const API_KEY = process.env.IPQS_API_KEY;
    const ipqsUrl = `https://www.ipqualityscore.com/api/json/email/${API_KEY}/${encodeURIComponent(email)}`;
    
    const response = await axios.get(ipqsUrl, {
      params: { strictness: 1, fast: false }
    });
    
    const result = response.data;

    // 2. Save the result to the database
    if (result.success) {
      const newScan = new EmailHistory({
        user: req.user.id,
        email: email,
        isBreached: result.leaked,
        scanResult: result,
      });
      await newScan.save();
    }

    res.json(result);

  } catch (err) {
    console.error('IPQS API Error:', err.message);
    res.status(500).send('Error checking email.');
  }
};

// 3. Add this new function to get the history
// @desc    Get user's email scan history
exports.getEmailHistory = async (req, res) => {
  try {
    const history = await EmailHistory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};