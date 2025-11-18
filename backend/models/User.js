const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
require('dotenv').config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // --- ADD THIS NEW FIELD ---
  // We are NOT encrypting this, so it's searchable and simple
  manualBlocklist: {
    type: [String],
    default: []
  }
  // -------------------------
}, {
  timestamps: true 
});

// --- Password Hashing Pre-Save Hook ---
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method to compare passwords ---
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);