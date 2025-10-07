const mongoose = require('mongoose');
function simpleId() { return 'x-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

const swapSchema = new mongoose.Schema({
  _id: {
    type: String,
  default: simpleId
  },
  user: {
    type: String,
    ref: 'User',
    required: [true, 'User is required']
  },
  storyToUnlock: {
    type: String,
    ref: 'Story',
    required: [true, 'Story to unlock is required']
  },
  submittedStory: {
    type: String,
    ref: 'Story',
    default: null // Will be set when user submits their story
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected', 'expired'],
    default: 'pending'
  },
  swapType: {
    type: String,
    enum: ['story_submission', 'existing_story', 'premium_unlock'],
    default: 'story_submission'
  },
  submissionData: {
    // Temporary storage for story data during submission process
    title: String,
    content: {
      type: String,
      text: String,
      media: [{
        type: { type: String, enum: ['image', 'audio', 'video'] },
        tempUrl: String,
        filename: String,
        size: Number
      }]
    },
    location: {
      coordinates: [Number], // [longitude, latitude]
      address: String
    },
    tags: [String]
  },
  validation: {
    contentLength: { type: Number, default: 0 },
    hasLocation: { type: Boolean, default: false },
    hasMedia: { type: Boolean, default: false },
    passedProfanityCheck: { type: Boolean, default: false },
    passedDuplicateCheck: { type: Boolean, default: false },
    passedModerationCheck: { type: Boolean, default: true }
  },
  moderationResults: {
    flagged: { type: Boolean, default: false },
    reasons: [String],
    confidence: { type: Number, default: 0 },
    reviewRequired: { type: Boolean, default: false },
    moderatorNotes: String
  },
  metrics: {
    submissionTime: Date,
    processingTime: Number, // milliseconds
    unlockTime: Date,
    userExperience: {
      difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
      },
      rating: { type: Number, min: 1, max: 5 },
      feedback: String
    }
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
swapSchema.index({ user: 1, status: 1 });
swapSchema.index({ storyToUnlock: 1, status: 1 });
swapSchema.index({ status: 1, createdAt: -1 });
swapSchema.index({ expiresAt: 1 }); // For TTL cleanup
swapSchema.index({ 'metrics.submissionTime': -1 });

// Compound indexes
swapSchema.index({ user: 1, storyToUnlock: 1 }, { unique: true }); // Prevent duplicate swaps

// TTL index to auto-delete expired swaps
swapSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual to check if swap is expired
swapSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

// Virtual to calculate time remaining
swapSchema.virtual('timeRemaining').get(function() {
  if (!this.expiresAt) return null;
  
  const now = new Date();
  const remaining = this.expiresAt - now;
  
  if (remaining <= 0) return 'Expired';
  
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Pre-save middleware to validate swap requirements
swapSchema.pre('save', function(next) {
  // Update validation fields based on submission data
  if (this.submissionData) {
    // Check content length
    let contentLength = 0;
    if (this.submissionData.content) {
      if (this.submissionData.content.text) {
        contentLength = this.submissionData.content.text.length;
      }
      if (this.submissionData.content.media && this.submissionData.content.media.length > 0) {
        // For media, consider it as meeting minimum length if it exists
        contentLength = Math.max(contentLength, 50);
      }
    }
    this.validation.contentLength = contentLength;
    
    // Check location
    this.validation.hasLocation = !!(
      this.submissionData.location && 
      this.submissionData.location.coordinates &&
      this.submissionData.location.coordinates.length === 2
    );
    
    // Check media
    this.validation.hasMedia = !!(
      this.submissionData.content &&
      this.submissionData.content.media &&
      this.submissionData.content.media.length > 0
    );
  }
  
  // Set submission time when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.metrics.submissionTime) {
    this.metrics.submissionTime = new Date();
  }
  
  // Set unlock time when story is successfully unlocked
  if (this.isModified('status') && this.status === 'completed' && !this.metrics.unlockTime) {
    this.metrics.unlockTime = new Date();
    
    // Calculate processing time
    if (this.createdAt) {
      this.metrics.processingTime = this.metrics.unlockTime - this.createdAt;
    }
  }
  
  next();
});

// Method to validate swap requirements against target story
swapSchema.methods.validateRequirements = async function() {
  const Story = mongoose.model('Story');
  const targetStory = await Story.findById(this.storyToUnlock);
  
  if (!targetStory) {
    return { isValid: false, errors: ['Target story not found'] };
  }
  
  const errors = [];
  const requirements = targetStory.swapSettings.swapRequirements;
  
  // Check minimum content length
  if (this.validation.contentLength < requirements.minContentLength) {
    errors.push(`Content must be at least ${requirements.minContentLength} characters`);
  }
  
  // Check location requirement
  if (requirements.requiresLocation && !this.validation.hasLocation) {
    errors.push('Location is required for this swap');
  }
  
  // Check allowed content types
  if (requirements.allowedContentTypes && requirements.allowedContentTypes.length > 0) {
    const hasAllowedType = this.submissionData.content.media.some(media => 
      requirements.allowedContentTypes.includes(media.type)
    ) || (requirements.allowedContentTypes.includes('text') && this.submissionData.content.text);
    
    if (!hasAllowedType) {
      errors.push(`Content type must be one of: ${requirements.allowedContentTypes.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Method to run automated checks
swapSchema.methods.runAutomatedChecks = async function() {
  const checks = {
    profanity: false,
    duplicate: false,
    moderation: true
  };
  
  try {
    // Profanity check
    checks.profanity = await this.checkProfanity();
    this.validation.passedProfanityCheck = checks.profanity;
    
    // Duplicate content check
    checks.duplicate = await this.checkDuplicateContent();
    this.validation.passedDuplicateCheck = checks.duplicate;
    
    // Content moderation check
    checks.moderation = await this.checkContentModeration();
    this.validation.passedModerationCheck = checks.moderation;
    
    // Update overall status
    const allChecksPassed = Object.values(checks).every(check => check === true);
    
    if (allChecksPassed) {
      this.status = 'completed';
    } else {
      this.status = 'rejected';
      this.moderationResults.flagged = true;
      this.moderationResults.reviewRequired = true;
    }
    
    await this.save();
    return { passed: allChecksPassed, checks };
    
  } catch (error) {
    this.status = 'rejected';
    this.moderationResults.flagged = true;
    this.moderationResults.reasons = ['automated_check_failed'];
    await this.save();
    throw error;
  }
};

// Method to check for profanity
swapSchema.methods.checkProfanity = async function() {
  // Simplified profanity check - in production, use a proper service
  const profanityWords = ['spam', 'fake', 'scam']; // Add more words
  const textToCheck = [
    this.submissionData.title,
    this.submissionData.content.text
  ].filter(Boolean).join(' ').toLowerCase();
  
  return !profanityWords.some(word => textToCheck.includes(word));
};

// Method to check for duplicate content
swapSchema.methods.checkDuplicateContent = async function() {
  const Story = mongoose.model('Story');
  const textToCheck = this.submissionData.content.text;
  
  if (!textToCheck || textToCheck.length < 50) return true;
  
  // Simple duplicate check - in production, use more sophisticated matching
  const similarStories = await Story.find({
    'content.text.body': new RegExp(textToCheck.substring(0, 100), 'i'),
    status: 'published'
  }).limit(5);
  
  return similarStories.length === 0;
};

// Method to check content moderation
swapSchema.methods.checkContentModeration = async function() {
  // Basic content moderation - in production, integrate with ML services
  const content = this.submissionData.content.text || '';
  const title = this.submissionData.title || '';
  
  const flaggedPatterns = [
    /violence/i,
    /hate/i,
    /inappropriate/i
  ];
  
  const isFlagged = flaggedPatterns.some(pattern => 
    pattern.test(content) || pattern.test(title)
  );
  
  if (isFlagged) {
    this.moderationResults.flagged = true;
    this.moderationResults.reasons = ['inappropriate_content'];
    this.moderationResults.confidence = 0.8;
  }
  
  return !isFlagged;
};

// Static method to find user's swaps
swapSchema.statics.findUserSwaps = function(userId, options = {}) {
  const { status, limit = 20, sort = '-createdAt' } = options;
  
  const query = { user: userId };
  if (status) query.status = status;
  
  return this.find(query)
    .sort(sort)
    .limit(limit)
    .populate('storyToUnlock', 'title author location')
    .populate('submittedStory', 'title status');
};

// Static method to find pending swaps for moderation
swapSchema.statics.findPendingModeration = function(limit = 50) {
  return this.find({
    status: 'rejected',
    'moderationResults.reviewRequired': true
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('user', 'username displayName')
  .populate('storyToUnlock', 'title author');
};

// Static method for analytics
swapSchema.statics.getSwapStats = async function(timeframe = '7d') {
  const timeframeDays = {
    '1d': 1,
    '7d': 7,
    '30d': 30
  };
  
  const daysAgo = timeframeDays[timeframe] || 7;
  const cutoffDate = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));
  
  return this.aggregate([
    { $match: { createdAt: { $gte: cutoffDate } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$metrics.processingTime' }
      }
    }
  ]);
};

module.exports = mongoose.model('Swap', swapSchema);