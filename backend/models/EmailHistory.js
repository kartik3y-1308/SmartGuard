const mongoose = require('mongoose');

const EmailHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isBreached: { // A quick-access boolean flag
    type: Boolean,
    default: false,
  },
  scanResult: { // The full JSON response from IPQS
    type: Object,
    required: true,
  },
}, { 
  timestamps: true 
});

module.exports = mongoose.model('EmailHistory', EmailHistorySchema);