const mongoose = require('mongoose');
function simpleId() {
  return 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

// Create a schema with performance optimizations
const storySchema = new mongoose.Schema({
  _id: {
    type: String,
  default: simpleId
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: {
      type: String,
      enum: ['text', 'audio', 'photo', 'video', 'mixed'],
      required: [true, 'Content type is required'],
      default: 'text'
    },
    text: {
      body: {
        type: String,
        maxlength: [5000, 'Story content cannot exceed 5000 characters']
      },
      wordCount: { type: Number, default: 0 }
    },
    media: [{
      _id: {
        type: String,
  default: simpleId
      },
      type: {
        type: String,
        enum: ['image', 'audio', 'video'],
        required: true
      },
      url: {
        type: String,
        required: [true, 'Media URL is required']
      },
      thumbnailUrl: String,
      publicId: String, // For cloud storage
      metadata: {
        filename: String,
        size: Number, // bytes
        duration: Number, // seconds (for audio/video)
        dimensions: {
          width: Number,
          height: Number
        },
        format: String,
        transcription: String // AI-generated transcript for audio/video
      }
    }],
    snippet: {
      type: String,
      maxlength: 150,
      trim: true
    } // Auto-generated preview text
  },
  author: {
    type: String,
    ref: 'User',
    required: [true, 'Author is required']
  },
  location: {
    type: String,
    ref: 'Location',
    required: [true, 'Location is required']
  },
  tags: [{
    type: String,
    ref: 'Tag'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'queued', 'removed', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public'
  },
  swapSettings: {
    isLocked: {
      type: Boolean,
      default: true
    },
    requiresSwap: {
      type: Boolean,
      default: true
    },
    swapRequirements: {
      minContentLength: { type: Number, default: 50 },
      requiresLocation: { type: Boolean, default: true },
      allowedContentTypes: [{
        type: String,
        enum: ['text', 'audio', 'photo', 'video']
      }]
    }
  },
  moderation: {
    flagCount: { type: Number, default: 0 },
    flags: [{
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'harassment', 'copyright', 'misinformation', 'other']
      },
      reporterId: {
        type: String,
        ref: 'User'
      },
      description: String,
      status: {
        type: String,
        enum: ['pending', 'resolved', 'dismissed'],
        default: 'pending'
      },
      createdAt: { type: Date, default: Date.now }
    }],
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'requires_review'],
      default: 'approved'
    },
    moderatedBy: {
      type: String,
      ref: 'User'
    },
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
      source: {
        type: String,
        enum: ['map', 'feed', 'search', 'profile', 'direct']
      }
    }],
    popularityScore: { type: Number, default: 0 },
    trendingScore: { type: Number, default: 0 }
  },
  metadata: {
    language: {
      type: String,
      default: 'en',
      maxlength: 5
    },
    readingTime: { type: Number, default: 0 }, // minutes
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    },
    aiGenerated: { type: Boolean, default: false },
    sources: [String], // External sources or references
    relatedStories: [{
      type: String,
      ref: 'Story'
    }]
  },
  publishedAt: Date,
  featuredUntil: Date, // For promoting stories
  expiresAt: Date // For temporary stories
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and queries
storySchema.index({ author: 1, status: 1 });
storySchema.index({ location: 1, status: 1 });
storySchema.index({ tags: 1, status: 1 });
storySchema.index({ publishedAt: -1 });
storySchema.index({ 'engagement.popularityScore': -1 });
storySchema.index({ 'engagement.views': -1 });
storySchema.index({ 'engagement.likes': -1 });
storySchema.index({ 'moderation.moderationStatus': 1 });

// Compound indexes for complex queries
storySchema.index({ status: 1, publishedAt: -1 });
storySchema.index({ 'swapSettings.isLocked': 1, status: 1 });

// Text index for search functionality
storySchema.index({ 
  title: 'text', 
  'content.text.body': 'text',
  'content.snippet': 'text'
});

// Geospatial index for location-based queries (populated from Location)
storySchema.index({ 'locationData.coordinates': '2dsphere' });

// Virtual for checking if story is unlocked for a user
storySchema.virtual('isUnlocked').get(function() {
  return !this.swapSettings.isLocked || !this.swapSettings.requiresSwap;
});

// Virtual for formatted publish date
storySchema.virtual('publishedTimeAgo').get(function() {
  if (!this.publishedAt) return null;
  
  const now = new Date();
  const diff = now - this.publishedAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Virtual for content preview
storySchema.virtual('preview').get(function() {
  if (this.content.snippet) return this.content.snippet;
  
  if (this.content.text && this.content.text.body) {
    const words = this.content.text.body.trim().split(/\s+/);
    return words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');
  }
  
  if (this.content.media && this.content.media.length > 0) {
    const mediaType = this.content.media[0].type;
    return `[${mediaType.toUpperCase()}] ${this.title}`;
  }
  
  return this.title;
});

// Pre-save middleware
storySchema.pre('save', function(next) {
  // Update word count for text content
  if (this.content.text && this.content.text.body) {
    this.content.text.wordCount = this.content.text.body.trim().split(/\s+/).length;
    
    // Calculate reading time (average 200 words per minute)
    this.metadata.readingTime = Math.ceil(this.content.text.wordCount / 200);
  }
  
  // Generate snippet if not provided
  if (!this.content.snippet && this.content.text && this.content.text.body) {
    const words = this.content.text.body.trim().split(/\s+/);
    this.content.snippet = words.slice(0, 25).join(' ') + (words.length > 25 ? '...' : '');
  }
  
  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate popularity score
  this.analytics.popularityScore = this.calculatePopularityScore();
  
  next();
});

// Method to calculate popularity score
storySchema.methods.calculatePopularityScore = function() {
  const viewWeight = this.engagement.views * 1;
  const likeWeight = this.engagement.likes * 5;
  const unlockWeight = this.engagement.unlocks * 10;
  const commentWeight = this.engagement.comments * 3;
  const shareWeight = this.engagement.shares * 8;
  
  // Decay factor based on age (newer stories get higher scores)
  const daysSincePublished = this.publishedAt ? 
    (Date.now() - this.publishedAt.getTime()) / (1000 * 60 * 60 * 24) : 0;
  const ageFactor = Math.max(0.1, 1 - (daysSincePublished * 0.1));
  
  return Math.floor((viewWeight + likeWeight + unlockWeight + commentWeight + shareWeight) * ageFactor);
};

// Method to increment engagement metrics
storySchema.methods.incrementEngagement = function(metric, increment = 1) {
  if (this.engagement.hasOwnProperty(metric)) {
    this.engagement[metric] += increment;
    this.analytics.popularityScore = this.calculatePopularityScore();
    return this.save();
  }
  throw new Error(`Invalid engagement metric: ${metric}`);
};

// Method to add view with tracking
storySchema.methods.addView = function(userId = null, source = 'direct') {
  this.engagement.views += 1;
  
  if (userId) {
    // Limit view history to last 100 entries
    this.analytics.viewHistory.unshift({ userId, source });
    if (this.analytics.viewHistory.length > 100) {
      this.analytics.viewHistory = this.analytics.viewHistory.slice(0, 100);
    }
  }
  
  return this.save();
};

// Method to check if user can unlock story
storySchema.methods.canUnlock = function(userId) {
  // Story author can always access their own stories
  if (this.author.toString() === userId.toString()) {
    return { canUnlock: true, reason: 'author' };
  }
  
  // Check if swap is required
  if (!this.swapSettings.requiresSwap) {
    return { canUnlock: true, reason: 'no_swap_required' };
  }
  
  // Check if story is not locked
  if (!this.swapSettings.isLocked) {
    return { canUnlock: true, reason: 'not_locked' };
  }
  
  return { canUnlock: false, reason: 'swap_required' };
};

// Static method to find nearby stories
storySchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000, options = {}) {
  const {
    limit = 20,
    status = 'published',
    excludeUserId = null
  } = options;
  
  const pipeline = [
    {
      $lookup: {
        from: 'locations',
        localField: 'location',
        foreignField: '_id',
        as: 'locationData'
      }
    },
    {
      $match: {
        status: status,
        'locationData.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: maxDistance
          }
        },
        ...(excludeUserId && { author: { $ne: excludeUserId } })
      }
    },
    { $limit: limit }
  ];
  
  return this.aggregate(pipeline);
};

// Static method for trending stories
storySchema.statics.findTrending = function(limit = 20, timeframe = '7d') {
  const timeframeDays = {
    '1d': 1,
    '3d': 3,
    '7d': 7,
    '30d': 30
  };
  
  const daysAgo = timeframeDays[timeframe] || 7;
  const cutoffDate = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
  
  return this.find({
    status: 'published',
    publishedAt: { $gte: cutoffDate }
  })
  .sort({ 'analytics.popularityScore': -1, 'engagement.views': -1 })
  .limit(limit)
  .populate('author', 'username displayName avatar')
  .populate('location', 'address coordinates');
};

// Add performance indexes
storySchema.index({ title: 'text', 'content.text.body': 'text', tags: 'text' }); // Text search index
storySchema.index({ author: 1 }); // Author queries
storySchema.index({ status: 1, publishedAt: -1 }); // Status + date queries
storySchema.index({ 'location.coordinates': '2dsphere' }); // Geospatial queries
storySchema.index({ category: 1 }); // Category filtering
storySchema.index({ 'analytics.popularityScore': -1 }); // Trending stories
storySchema.index({ createdAt: -1 }); // Recent stories
storySchema.index({ slug: 1 }, { unique: true }); // Slug lookups

module.exports = mongoose.model('Story', storySchema);