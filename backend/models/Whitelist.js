const mongoose = require('mongoose');
const WhitelistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: String, required: true },
}, { timestamps: true });
WhitelistSchema.index({ user: 1, domain: 1 }, { unique: true });
module.exports = mongoose.model('Whitelist', WhitelistSchema);