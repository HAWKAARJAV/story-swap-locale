const User = require('../../database/models/User');
const Story = require('../../database/models/Story');
const Location = require('../../database/models/Location');
const Swap = require('../../database/models/Swap');
const Tag = require('../../database/models/Tag');
const Comment = require('../../database/models/Comment');
const { asyncHandler } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Get comprehensive platform analytics for judges
 * @route GET /api/v1/admin/analytics
 * @access Admin
 */
const getPlatformAnalytics = asyncHandler(async (req, res) => {
  const { timeframe = '30d' } = req.query;
  
  // Calculate date range
  const timeframeDays = {
    '1d': 1,
    '7d': 7,
    '30d': 30,
    '90d': 90
  };
  
  const daysAgo = timeframeDays[timeframe] || 30;
  const cutoffDate = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000));

  // Get all metrics in parallel
  const [
    totalUsers,
    totalStories,
    totalSwaps,
    totalLocations,
    activeUsers,
    newUsersCount,
    newStoriesCount,
    completedSwapsCount,
    topCities,
    topStorytellersByCity,
    mostLikedStories,
    swapSuccessRate,
    engagementMetrics,
    contentBreakdown
  ] = await Promise.all([
    // Total counts
    User.countDocuments({ 'flags.isActive': true }),
    Story.countDocuments({ status: 'published' }),
    Swap.countDocuments(),
    Location.countDocuments(),
    
    // Active users (users who logged in within timeframe)
    User.countDocuments({
      'security.lastLogin': { $gte: cutoffDate },
      'flags.isActive': true
    }),
    
    // New users in timeframe
    User.countDocuments({
      createdAt: { $gte: cutoffDate },
      'flags.isActive': true
    }),
    
    // New stories in timeframe
    Story.countDocuments({
      publishedAt: { $gte: cutoffDate },
      status: 'published'
    }),
    
    // Completed swaps in timeframe
    Swap.countDocuments({
      createdAt: { $gte: cutoffDate },
      status: 'completed'
    }),
    
    // Top cities by story count
    getTopCities(),
    
    // Top storytellers by city
    getTopStorytellersByCity(),
    
    // Most liked stories
    getMostLikedStories(10),
    
    // Swap success rate
    getSwapSuccessRate(cutoffDate),
    
    // Engagement metrics
    getEngagementMetrics(cutoffDate),
    
    // Content breakdown
    getContentBreakdown()
  ]);

  // Calculate growth rates
  const previousPeriodDate = new Date(cutoffDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
  const [
    previousPeriodUsers,
    previousPeriodStories,
    previousPeriodSwaps
  ] = await Promise.all([
    User.countDocuments({
      createdAt: { $gte: previousPeriodDate, $lt: cutoffDate }
    }),
    Story.countDocuments({
      publishedAt: { $gte: previousPeriodDate, $lt: cutoffDate },
      status: 'published'
    }),
    Swap.countDocuments({
      createdAt: { $gte: previousPeriodDate, $lt: cutoffDate },
      status: 'completed'
    })
  ]);

  // Calculate growth percentages
  const userGrowth = previousPeriodUsers > 0 
    ? ((newUsersCount - previousPeriodUsers) / previousPeriodUsers * 100).toFixed(1)
    : 100;
  
  const storyGrowth = previousPeriodStories > 0
    ? ((newStoriesCount - previousPeriodStories) / previousPeriodStories * 100).toFixed(1)
    : 100;
    
  const swapGrowth = previousPeriodSwaps > 0
    ? ((completedSwapsCount - previousPeriodSwaps) / previousPeriodSwaps * 100).toFixed(1)
    : 100;

  res.json({
    timeframe,
    generated: new Date(),
    overview: {
      totalUsers,
      totalStories,
      totalSwaps,
      totalLocations,
      activeUsers,
      userEngagementRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0
    },
    growth: {
      newUsers: {
        count: newUsersCount,
        growth: `${userGrowth > 0 ? '+' : ''}${userGrowth}%`
      },
      newStories: {
        count: newStoriesCount,
        growth: `${storyGrowth > 0 ? '+' : ''}${storyGrowth}%`
      },
      completedSwaps: {
        count: completedSwapsCount,
        growth: `${swapGrowth > 0 ? '+' : ''}${swapGrowth}%`
      }
    },
    geography: {
      topCities,
      totalCitiesWithStories: topCities.length
    },
    community: {
      topStorytellersByCity,
      mostLikedStories
    },
    swapMechanics: {
      ...swapSuccessRate,
      averageSwapsPerUser: totalUsers > 0 ? (totalSwaps / totalUsers).toFixed(2) : 0
    },
    engagement: engagementMetrics,
    content: contentBreakdown,
    competitionMetrics: {
      storiesPerDay: (totalStories / Math.max(1, daysAgo)).toFixed(1),
      swapsPerDay: (totalSwaps / Math.max(1, daysAgo)).toFixed(1),
      averageStoryLength: await getAverageStoryLength(),
      multilingualContent: await getLanguageBreakdown(),
      userRetention: await getUserRetentionRate(cutoffDate)
    }
  });
});

/**
 * Get user management data
 * @route GET /api/v1/admin/users
 * @access Admin
 */
const getUserManagement = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 50,
    role,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  let query = {};
  
  if (role) query.role = role;
  if (status === 'active') query['flags.isActive'] = true;
  if (status === 'banned') query['flags.isBanned'] = true;
  if (search) {
    query.$or = [
      { username: new RegExp(search, 'i') },
      { displayName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const users = await User.find(query)
    .select('-password -security.passwordResetToken')
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .lean();

  const total = await User.countDocuments(query);

  res.json({
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get content moderation queue
 * @route GET /api/v1/admin/moderation
 * @access Admin/Moderator
 */
const getModerationQueue = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type = 'all' } = req.query;

  let flaggedStories = [];
  let flaggedComments = [];

  if (type === 'all' || type === 'stories') {
    flaggedStories = await Story.find({
      'moderation.flagCount': { $gte: 1 },
      status: { $in: ['published', 'queued'] }
    })
    .populate('author', 'username displayName')
    .populate('location', 'address.city address.formatted')
    .sort({ 'moderation.flagCount': -1, createdAt: -1 })
    .limit(type === 'stories' ? parseInt(limit) : Math.floor(parseInt(limit) / 2));
  }

  if (type === 'all' || type === 'comments') {
    flaggedComments = await Comment.findFlagged(
      type === 'comments' ? parseInt(limit) : Math.floor(parseInt(limit) / 2)
    );
  }

  const totalFlagged = await Story.countDocuments({
    'moderation.flagCount': { $gte: 1 }
  }) + await Comment.countDocuments({
    'moderation.flagCount': { $gte: 1 }
  });

  res.json({
    flaggedContent: {
      stories: flaggedStories,
      comments: flaggedComments
    },
    stats: {
      totalFlagged,
      pendingReview: totalFlagged
    },
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

/**
 * Update user role or status
 * @route PATCH /api/v1/admin/users/:id
 * @access Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, status, banReason } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: { message: 'User not found' } });
  }

  // Update fields
  if (role && ['user', 'moderator', 'admin'].includes(role)) {
    user.role = role;
  }
  
  if (status === 'ban') {
    user.flags.isBanned = true;
    user.flags.banReason = banReason || 'Banned by administrator';
  } else if (status === 'unban') {
    user.flags.isBanned = false;
    user.flags.banReason = null;
  } else if (status === 'deactivate') {
    user.flags.isActive = false;
  } else if (status === 'activate') {
    user.flags.isActive = true;
  }

  await user.save();

  // Log admin action
  logger.info('Admin user action', {
    adminId: req.user._id,
    targetUserId: id,
    action: { role, status, banReason },
    timestamp: new Date()
  });

  res.json({
    message: 'User updated successfully',
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
      flags: user.flags
    }
  });
});

/**
 * Helper functions
 */
async function getTopCities() {
  return await Location.aggregate([
    {
      $group: {
        _id: '$address.city',
        storyCount: { $sum: '$stats.storiesCount' },
        locations: { $sum: 1 }
      }
    },
    { $match: { storyCount: { $gt: 0 } } },
    { $sort: { storyCount: -1 } },
    { $limit: 10 }
  ]);
}

async function getTopStorytellersByCity() {
  return await User.aggregate([
    { $match: { 'stats.storiesPublished': { $gt: 0 } } },
    {
      $group: {
        _id: '$homeCity',
        topStoryteller: {
          $first: {
            username: '$username',
            displayName: '$displayName',
            storiesPublished: '$stats.storiesPublished',
            swapsCompleted: '$stats.swapsCompleted'
          }
        }
      }
    },
    { $sort: { 'topStoryteller.storiesPublished': -1 } },
    { $limit: 5 }
  ]);
}

async function getMostLikedStories(limit = 10) {
  return await Story.find({ status: 'published' })
    .populate('author', 'username displayName homeCity')
    .populate('location', 'address.city')
    .sort({ 'engagement.likes': -1 })
    .limit(limit)
    .select('title engagement.likes engagement.views author location publishedAt');
}

async function getSwapSuccessRate(cutoffDate) {
  const swapStats = await Swap.aggregate([
    { $match: { createdAt: { $gte: cutoffDate } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = swapStats.reduce((sum, stat) => sum + stat.count, 0);
  const completed = swapStats.find(s => s._id === 'completed')?.count || 0;
  const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  return {
    totalSwaps: total,
    completedSwaps: completed,
    successRate: `${successRate}%`,
    breakdown: swapStats
  };
}

async function getEngagementMetrics(cutoffDate) {
  const [totalViews, totalLikes, totalComments] = await Promise.all([
    Story.aggregate([
      { $match: { publishedAt: { $gte: cutoffDate } } },
      { $group: { _id: null, total: { $sum: '$engagement.views' } } }
    ]),
    Story.aggregate([
      { $match: { publishedAt: { $gte: cutoffDate } } },
      { $group: { _id: null, total: { $sum: '$engagement.likes' } } }
    ]),
    Comment.countDocuments({ createdAt: { $gte: cutoffDate } })
  ]);

  return {
    totalViews: totalViews[0]?.total || 0,
    totalLikes: totalLikes[0]?.total || 0,
    totalComments,
    avgViewsPerStory: totalViews[0] ? (totalViews[0].total / await Story.countDocuments({ publishedAt: { $gte: cutoffDate } })).toFixed(1) : 0
  };
}

async function getContentBreakdown() {
  const breakdown = await Story.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: '$content.type',
        count: { $sum: 1 }
      }
    }
  ]);

  return breakdown.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});
}

async function getAverageStoryLength() {
  const avgLength = await Story.aggregate([
    { $match: { status: 'published', 'content.text.body': { $exists: true } } },
    {
      $group: {
        _id: null,
        avgWordCount: { $avg: '$content.text.wordCount' }
      }
    }
  ]);

  return avgLength[0]?.avgWordCount?.toFixed(0) || 0;
}

async function getLanguageBreakdown() {
  return await Story.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: '$metadata.language',
        count: { $sum: 1 }
      }
    }
  ]);
}

async function getUserRetentionRate(cutoffDate) {
  const newUsers = await User.countDocuments({
    createdAt: { $gte: cutoffDate }
  });
  
  const activeNewUsers = await User.countDocuments({
    createdAt: { $gte: cutoffDate },
    'security.lastLogin': { $gte: cutoffDate }
  });

  const retentionRate = newUsers > 0 ? ((activeNewUsers / newUsers) * 100).toFixed(1) : 0;
  
  return `${retentionRate}%`;
}

module.exports = {
  getPlatformAnalytics,
  getUserManagement,
  getModerationQueue,
  updateUser
};