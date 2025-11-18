const axios = require("axios");
const ScanHistory = require("../models/ScanHistory");
require("dotenv").config();

// @desc    Scan a URL for threats
exports.scanUrl = async (req, res) => {
  const { url } = req.body;
  const userId = req.user.id; // From authMiddleware

  if (!url) {
    return res.status(400).json({ msg: "URL is required" });
  }

  try {
    // 1. Construct the API request URL for IPQS
    const API_KEY = process.env.IPQS_API_KEY;
    const ipqsUrl = `https://www.ipqualityscore.com/api/json/url/${API_KEY}/${encodeURIComponent(
      url
    )}`;

    // 2. Call the external API
    const response = await axios.get(ipqsUrl);
    const scanResult = response.data;

    console.log("IPQS API Response:", scanResult);

    // 3. Save the scan result to the user's history
    const newScan = new ScanHistory({
      user: userId,
      url: url,
      scanResult: scanResult,
      // Determine if the URL is malicious based on API response fields
      isMalicious:
        scanResult.malicious || scanResult.phishing || scanResult.suspicious,
    });
    await newScan.save();

    // 4. Return the API response to the frontend
    res.json(scanResult);
  } catch (err) {
    console.error("IPQS API Error:", err.message);
    res
      .status(500)
      .send("Error scanning URL. The API may be down or the key invalid.");
  }
};

// @desc    Get the logged-in user's scan history
exports.getHistory = async (req, res) => {
  try {
    // Find all history items linked to the user's ID and sort by most recent
    const history = await ScanHistory.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
