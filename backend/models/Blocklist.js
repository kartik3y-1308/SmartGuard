const mongoose = require('mongoose');
const BlocklistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
}, { timestamps: true });
BlocklistSchema.index({ user: 1, domain: 1 }, { unique: true });
module.exports = mongoose.model('Blocklist', BlocklistSchema);