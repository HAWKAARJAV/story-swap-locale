const mongoose = require('mongoose');

function simpleId() {
  return 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

const storySchema = new mongoose.Schema({
  _id: { type: String, default: simpleId },
  title: { type: String, required: true, trim: true, minlength: 5, maxlength: 200 },
  content: {
    type: { type: String, enum: ['text', 'audio', 'photo', 'video', 'mixed'], default: 'text', required: true },
    text: {
      body: { type: String, maxlength: 5000 },
      wordCount: { type: Number, default: 0 }
    },
    media: [{
      _id: { type: String, default: simpleId },
      type: { type: String, enum: ['image', 'audio', 'video'], required: true },
      url: { type: String, required: true },
      thumbnailUrl: String,
      publicId: String,
      metadata: {
        filename: String,
        size: Number,
        duration: Number,
        dimensions: { width: Number, height: Number },
        format: String,
        transcription: String
      }
    }],
    snippet: { type: String, maxlength: 150, trim: true }
  },
  author: { type: String, ref: 'User', required: true },
  location: { type: String, ref: 'Location', required: true },
  tags: [{ type: String, ref: 'Tag' }],
  status: { type: String, enum: ['draft', 'published', 'queued', 'removed', 'archived'], default: 'draft' },
  visibility: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
  swapSettings: {
    isLocked: { type: Boolean, default: true },
    requiresSwap: { type: Boolean, default: true },
    swapRequirements: {
      minContentLength: { type: Number, default: 50 },
      requiresLocation: { type: Boolean, default: true },
      allowedContentTypes: [{ type: String, enum: ['text', 'audio', 'photo', 'video'] }]
    }
  },
  moderation: {
    flagCount: { type: Number, default: 0 },
    flags: [{
      reason: { type: String, enum: ['spam', 'inappropriate', 'harassment', 'copyright', 'misinformation', 'other'] },
      reporterId: { type: String, ref: 'User' },
      description: String,
      status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
      createdAt: { type: Date, default: Date.now }
    }],
    moderationStatus: { type: String, enum: ['pending', 'approved', 'rejected', 'requires_review'], default: 'approved' },
    moderatedBy: { type: String, ref: 'User' },
    moderatedAt: Date,
    moderationNotes: String
  },
  engagement: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    unlocks: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
  },
  analytics: {
    viewHistory: [{
      userId: { type: String, ref: 'User' },
      timestamp: { type: Date, default: Date.now },
      source: { type: String, enum: ['map', 'feed', 'search', 'profile', 'direct'] }
    }],
    popularityScore: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 }
  },
  metadata: {
    language: { type: String, default: 'en', maxlength: 5 },
    readingTime: { type: Number, default: 0 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    aiGenerated: { type: Boolean, default: false },
    sources: [String],
    relatedStories: [{ type: String, ref: 'Story' }]
  },
  publishedAt: Date,
  featuredUntil: Date,
  expiresAt: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Consolidated essential indexes to reduce duplication in dev.
storySchema.index({ status: 1, publishedAt: -1 });
storySchema.index({ author: 1 });
storySchema.index({ 'engagement.popularityScore': -1 });
storySchema.index({ title: 'text', 'content.text.body': 'text', 'content.snippet': 'text' });

storySchema.virtual('isUnlocked').get(function () { return !this.swapSettings.isLocked || !this.swapSettings.requiresSwap; });
storySchema.virtual('publishedTimeAgo').get(function () {
  if (!this.publishedAt) return null;
  const diff = Date.now() - this.publishedAt.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

storySchema.virtual('preview').get(function () {
  if (this.content.snippet) return this.content.snippet;
  if (this.content.text?.body) {
    const words = this.content.text.body.trim().split(/\s+/);
    return words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');
  }
  if (this.content.media?.length) {
    const mediaType = this.content.media[0].type;
    return `[${mediaType.toUpperCase()}] ${this.title}`;
  }
  return this.title;
});

storySchema.pre('save', function (next) {
  if (this.content.text?.body) {
    this.content.text.wordCount = this.content.text.body.trim().split(/\s+/).length;
    this.metadata.readingTime = Math.ceil(this.content.text.wordCount / 200);
  }
  if (!this.content.snippet && this.content.text?.body) {
    const words = this.content.text.body.trim().split(/\s+/);
    this.content.snippet = words.slice(0, 25).join(' ') + (words.length > 25 ? '...' : '');
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  this.analytics.popularityScore = this.calculatePopularityScore();
  next();
});

storySchema.methods.calculatePopularityScore = function () {
  const viewWeight = this.engagement.views * 1;
  const likeWeight = this.engagement.likes * 5;
  const unlockWeight = this.engagement.unlocks * 10;
  const commentWeight = this.engagement.comments * 3;
  const shareWeight = this.engagement.shares * 8;
  const daysSince = this.publishedAt ? (Date.now() - this.publishedAt.getTime()) / 86400000 : 0;
  const ageFactor = Math.max(0.1, 1 - (daysSince * 0.1));
  return Math.floor((viewWeight + likeWeight + unlockWeight + commentWeight + shareWeight) * ageFactor);
};

storySchema.methods.incrementEngagement = function (metric, inc = 1) {
  if (Object.prototype.hasOwnProperty.call(this.engagement, metric)) {
    this.engagement[metric] += inc;
    this.analytics.popularityScore = this.calculatePopularityScore();
    return this.save();
  }
  throw new Error(`Invalid engagement metric: ${metric}`);
};

storySchema.methods.addView = function (userId = null, source = 'direct') {
  this.engagement.views += 1;
  if (userId) {
    this.analytics.viewHistory.unshift({ userId, source });
    if (this.analytics.viewHistory.length > 100) {
      this.analytics.viewHistory = this.analytics.viewHistory.slice(0, 100);
    }
  }
  return this.save();
};

storySchema.methods.canUnlock = function (userId) {
  if (this.author?.toString() === userId?.toString()) return { canUnlock: true, reason: 'author' };
  if (!this.swapSettings.requiresSwap) return { canUnlock: true, reason: 'no_swap_required' };
  if (!this.swapSettings.isLocked) return { canUnlock: true, reason: 'not_locked' };
  return { canUnlock: false, reason: 'swap_required' };
};

storySchema.statics.findTrending = function (limit = 20, timeframe = '7d') {
  const map = { '1d': 1, '3d': 3, '7d': 7, '30d': 30 };
  const days = map[timeframe] || 7;
  const cutoff = new Date(Date.now() - days * 86400000);
  return this.find({ status: 'published', publishedAt: { $gte: cutoff } })
    .sort({ 'analytics.popularityScore': -1, 'engagement.views': -1 })
    .limit(limit)
    .populate('author', 'username displayName avatar')
    .populate('location', 'address coordinates');
};

module.exports = mongoose.models.Story || mongoose.model('Story', storySchema);
