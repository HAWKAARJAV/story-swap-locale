const mongoose = require('mongoose');
function simpleId() { return 't-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

const tagSchema = new mongoose.Schema({
  _id: {
    type: String,
  default: simpleId
  },
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: [30, 'Tag name cannot exceed 30 characters'],
    validate: {
      validator: function(name) {
        return /^[a-z0-9\s-]+$/.test(name);
      },
      message: 'Tag name can only contain lowercase letters, numbers, spaces, and hyphens'
    }
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: [
      'food', 'history', 'culture', 'nature', 'architecture', 
      'events', 'people', 'hidden-gems', 'transportation', 
      'shopping', 'nightlife', 'art', 'music', 'sports', 
      'business', 'education', 'technology', 'other'
    ],
    default: 'other'
  },
  color: {
    type: String,
    default: '#3B82F6', // Blue
    validate: {
      validator: function(color) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
      },
      message: 'Invalid color format. Use hex color format (e.g., #FF5733)'
    }
  },
  icon: {
    type: String,
    default: 'tag',
    maxlength: [50, 'Icon name cannot exceed 50 characters']
  },
  usage: {
    totalStories: { type: Number, default: 0 },
    activeStories: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 }
  },
  trending: {
    istrending: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    trendingSince: Date
  },
  metadata: {
    isOfficial: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isRestricted: { type: Boolean, default: false },
    createdBy: {
      type: String,
      ref: 'User'
    },
    approvedBy: {
      type: String,
      ref: 'User'
    },
    approvedAt: Date
  },
  synonyms: [String], // Alternative names for this tag
  relatedTags: [{
    type: String,
    ref: 'Tag'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
tagSchema.index({ name: 1 });
tagSchema.index({ category: 1, 'usage.popularityScore': -1 });
tagSchema.index({ 'usage.totalStories': -1 });
tagSchema.index({ 'trending.istrending': 1, 'trending.trendingScore': -1 });
tagSchema.index({ 'metadata.isOfficial': 1, 'usage.popularityScore': -1 });

// Text index for search
tagSchema.index({
  name: 'text',
  displayName: 'text',
  description: 'text',
  synonyms: 'text'
});

// Virtual for URL-friendly slug
tagSchema.virtual('slug').get(function() {
  return this.name.replace(/\s+/g, '-');
});

// Virtual for usage percentage (compared to most popular tag)
tagSchema.virtual('usagePercentage').get(function() {
  // This would typically be calculated relative to the most used tag
  // For now, return a simple percentage based on total stories
  return Math.min(100, (this.usage.totalStories / 100) * 100);
});

// Pre-save middleware
tagSchema.pre('save', function(next) {
  // Auto-generate display name if not provided
  if (!this.displayName && this.name) {
    this.displayName = this.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Calculate popularity score
  this.usage.popularityScore = this.calculatePopularityScore();
  
  // Update trending status
  this.updateTrendingStatus();
  
  next();
});

// Method to calculate popularity score
tagSchema.methods.calculatePopularityScore = function() {
  const storyWeight = this.usage.totalStories * 10;
  const activeWeight = this.usage.activeStories * 20;
  const viewWeight = this.usage.totalViews * 1;
  const officialBonus = this.metadata.isOfficial ? 50 : 0;
  const featuredBonus = this.metadata.isFeatured ? 30 : 0;
  
  return storyWeight + activeWeight + viewWeight + officialBonus + featuredBonus;
};

// Method to update trending status
tagSchema.methods.updateTrendingStatus = function() {
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  
  // Simple trending calculation - in production, use more sophisticated algorithm
  const recentGrowthRate = this.usage.totalStories > 5 ? 
    (this.usage.totalStories * 0.3) : 0; // Simplified growth rate
  
  this.trending.trendingScore = recentGrowthRate + this.usage.popularityScore * 0.1;
  
  // Mark as trending if score is above threshold
  const trendingThreshold = 100;
  if (this.trending.trendingScore > trendingThreshold && !this.trending.istrending) {
    this.trending.istrending = true;
    this.trending.trendingSince = now;
  } else if (this.trending.trendingScore <= trendingThreshold && this.trending.istrending) {
    this.trending.istrending = false;
    this.trending.trendingSince = null;
  }
};

// Method to increment usage stats
tagSchema.methods.incrementUsage = function(statsType = 'totalStories', increment = 1) {
  if (this.usage.hasOwnProperty(statsType)) {
    this.usage[statsType] += increment;
    this.usage.popularityScore = this.calculatePopularityScore();
    this.updateTrendingStatus();
    return this.save();
  }
  throw new Error(`Invalid usage stat type: ${statsType}`);
};

// Method to add related tag
tagSchema.methods.addRelatedTag = function(tagId) {
  if (!this.relatedTags.includes(tagId)) {
    this.relatedTags.push(tagId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Static method to find or create tag
tagSchema.statics.findOrCreate = async function(tagName) {
  const normalizedName = tagName.toLowerCase().trim();
  
  let tag = await this.findOne({ name: normalizedName });
  
  if (!tag) {
    tag = await this.create({
      name: normalizedName,
      displayName: tagName // Keep original case for display
    });
  }
  
  return tag;
};

// Static method to find popular tags
tagSchema.statics.findPopular = function(limit = 20, category = null) {
  const query = {};
  if (category) query.category = category;
  
  return this.find(query)
    .sort({ 'usage.popularityScore': -1, 'usage.totalStories': -1 })
    .limit(limit);
};

// Static method to find trending tags
tagSchema.statics.findTrending = function(limit = 10) {
  return this.find({ 'trending.isTriending': true })
    .sort({ 'trending.trendingScore': -1 })
    .limit(limit);
};

// Static method to search tags
tagSchema.statics.search = function(query, options = {}) {
  const { limit = 20, category = null } = options;
  
  const searchQuery = {
    $or: [
      { name: new RegExp(query, 'i') },
      { displayName: new RegExp(query, 'i') },
      { synonyms: new RegExp(query, 'i') }
    ]
  };
  
  if (category) searchQuery.category = category;
  
  return this.find(searchQuery)
    .sort({ 'usage.popularityScore': -1 })
    .limit(limit);
};

// Static method to get tag suggestions
tagSchema.statics.getSuggestions = function(partialName, limit = 10) {
  return this.find({
    name: new RegExp(`^${partialName}`, 'i')
  })
  .sort({ 'usage.popularityScore': -1 })
  .limit(limit)
  .select('name displayName usage.totalStories');
};

// Static method to get category breakdown
tagSchema.statics.getCategoryStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalUsage: { $sum: '$usage.totalStories' },
        avgPopularity: { $avg: '$usage.popularityScore' }
      }
    },
    {
      $sort: { totalUsage: -1 }
    }
  ]);
};

// Static method to clean up unused tags
tagSchema.statics.cleanupUnused = function(minUsage = 0) {
  return this.deleteMany({
    'usage.totalStories': { $lte: minUsage },
    'metadata.isOfficial': false,
    'metadata.isFeatured': false
  });
};

module.exports = mongoose.model('Tag', tagSchema);