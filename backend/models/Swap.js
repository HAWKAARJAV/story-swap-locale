const mongoose = require('mongoose');
function simpleId() { return 'x-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

const swapSchema = new mongoose.Schema({
  _id: { type: String, default: simpleId },
  user: { type: String, ref: 'User', required: true },
  storyToUnlock: { type: String, ref: 'Story', required: true },
  submittedStory: { type: String, ref: 'Story', default: null },
  status: { type: String, enum: ['pending', 'completed', 'rejected', 'expired'], default: 'pending' },
  swapType: { type: String, enum: ['story_submission', 'existing_story', 'premium_unlock'], default: 'story_submission' }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

swapSchema.index({ user: 1, status: 1 });
swapSchema.index({ storyToUnlock: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });
swapSchema.index({ expiresAt: 1 });
swapSchema.index({ user: 1, storyToUnlock: 1 }, { unique: true });

module.exports = mongoose.models_SWAP || mongoose.model('Swap', swapSchema);
