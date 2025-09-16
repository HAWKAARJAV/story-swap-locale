const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const commentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: String,
    ref: 'User',
    required: [true, 'Comment author is required']
  },
  story: {
    type: String,
    ref: 'Story',
    required: [true, 'Story reference is required']
  },
  parent: {
    type: String,
    ref: 'Comment',
    default: null // null for top-level comments
  },
  depth: {
    type: Number,
    default: 0,
    max: [2, 'Comments cannot be nested more than 2 levels deep']
  },
  status: {
    type: String,
    enum: ['published', 'pending', 'hidden', 'removed'],
    default: 'published'
  },
  engagement: {
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    flags: { type: Number, default: 0 }
  },
  moderation: {
    flagCount: { type: Number, default: 0 },
    flags: [{
      reason: {
        type: String,
        enum: ['spam', 'harassment', 'inappropriate', 'off-topic', 'other']
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
    moderatedBy: {
      type: String,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationNotes: String
  },
  metadata: {
    editedAt: Date,
    editHistory: [{
      content: String,
      editedAt: { type: Date, default: Date.now }
    }],
    ipAddress: String,
    userAgent: String,
    mentionedUsers: [{
      type: String,
      ref: 'User'
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
commentSchema.index({ story: 1, status: 1, createdAt: -1 });
commentSchema.index({ author: 1, createdAt: -1 });
commentSchema.index({ parent: 1, createdAt: 1 });
commentSchema.index({ status: 1, 'engagement.likes': -1 });

// Virtual for checking if comment is edited
commentSchema.virtual('isEdited').get(function() {
  return !!(this.metadata.editedAt && this.metadata.editedAt > this.createdAt);
});

// Virtual for time since creation
commentSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Pre-save middleware
commentSchema.pre('save', function(next) {
  // Set depth based on parent
  if (this.parent && this.isNew) {
    Comment.findById(this.parent, (err, parentComment) => {
      if (err) return next(err);
      if (parentComment) {
        this.depth = parentComment.depth + 1;
        if (this.depth > 2) {
          return next(new Error('Comments cannot be nested more than 2 levels deep'));
        }
      }
      next();
    });
  } else {
    next();
  }
});

// Post-save middleware to update parent reply count
commentSchema.post('save', async function(doc) {
  if (doc.parent && doc.status === 'published') {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.parent,
      { $inc: { 'engagement.replies': 1 } }
    );
  }
  
  // Update story comment count
  await mongoose.model('Story').findByIdAndUpdate(
    doc.story,
    { $inc: { 'engagement.comments': 1 } }
  );
});

// Post-remove middleware to update counts
commentSchema.post('findOneAndDelete', async function(doc) {
  if (doc && doc.parent) {
    await mongoose.model('Comment').findByIdAndUpdate(
      doc.parent,
      { $inc: { 'engagement.replies': -1 } }
    );
  }
  
  if (doc) {
    // Update story comment count
    await mongoose.model('Story').findByIdAndUpdate(
      doc.story,
      { $inc: { 'engagement.comments': -1 } }
    );
    
    // Remove all child comments
    await mongoose.model('Comment').deleteMany({ parent: doc._id });
  }
});

// Method to edit comment content
commentSchema.methods.editContent = function(newContent, userId) {
  if (this.author.toString() !== userId.toString()) {
    throw new Error('Only the author can edit this comment');
  }
  
  // Save edit history
  this.metadata.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });
  
  // Update content
  this.content = newContent;
  this.metadata.editedAt = new Date();
  
  return this.save();
};

// Method to add like
commentSchema.methods.addLike = function() {
  this.engagement.likes += 1;
  return this.save();
};

// Method to remove like
commentSchema.methods.removeLike = function() {
  this.engagement.likes = Math.max(0, this.engagement.likes - 1);
  return this.save();
};

// Method to flag comment
commentSchema.methods.flag = function(reason, reporterId, description = '') {
  this.moderation.flags.push({
    reason,
    reporterId,
    description
  });
  this.moderation.flagCount += 1;
  this.engagement.flags += 1;
  
  // Auto-hide if flagged multiple times
  if (this.moderation.flagCount >= 3) {
    this.status = 'pending';
  }
  
  return this.save();
};

// Static method to find story comments with threading
commentSchema.statics.findByStoryThreaded = async function(storyId, options = {}) {
  const { limit = 20, sort = '-createdAt' } = options;
  
  // Get top-level comments
  const topLevelComments = await this.find({
    story: storyId,
    parent: null,
    status: 'published'
  })
  .sort(sort)
  .limit(limit)
  .populate('author', 'username displayName avatar')
  .lean();
  
  // Get replies for each top-level comment
  for (let comment of topLevelComments) {
    const replies = await this.find({
      parent: comment._id,
      status: 'published'
    })
    .sort('createdAt')
    .populate('author', 'username displayName avatar')
    .lean();
    
    comment.replies = replies;
  }
  
  return topLevelComments;
};

// Static method to find user's comments
commentSchema.statics.findByUser = function(userId, options = {}) {
  const { limit = 20, status = 'published' } = options;
  
  return this.find({
    author: userId,
    status: status
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('story', 'title author')
  .populate('parent', 'content author');
};

// Static method to find flagged comments for moderation
commentSchema.statics.findFlagged = function(limit = 50) {
  return this.find({
    'moderation.flagCount': { $gte: 1 },
    status: { $in: ['published', 'pending'] }
  })
  .sort({ 'moderation.flagCount': -1, createdAt: -1 })
  .limit(limit)
  .populate('author', 'username displayName')
  .populate('story', 'title');
};

// Static method to get comment statistics
commentSchema.statics.getStats = function(timeframe = '7d') {
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
        totalLikes: { $sum: '$engagement.likes' },
        totalFlags: { $sum: '$moderation.flagCount' }
      }
    }
  ]);
};

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;