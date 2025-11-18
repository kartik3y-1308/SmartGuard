const mongoose = require('mongoose');

const ScanHistorySchema = new mongoose.Schema({
  // Link to the User model
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  // Store the full JSON response from the IPQS API
  scanResult: {
    type: Object,
    required: true,
  },
  // A simple flag for quick filtering and display on the frontend
  isMalicious: {
    type: Boolean,
    default: false,
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('ScanHistory', ScanHistorySchema);