// Unified model imports (single mongoose instance)
const Story = require('../models/Story');
const Location = require('../models/Location');
const Tag = require('../models/Tag');
const Swap = require('../models/Swap');
const User = require('../models/User');
const { asyncHandler, validationError, notFoundError, authorizationError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Analyze story emotion using keyword-based detection
 * @param {string} title - Story title
 * @param {string} content - Story content
 * @returns {object} - Emotion analysis result
 */
function analyzeStoryEmotion(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  let emotion = 'peaceful';
  let moodScore = 5;

  const emotionKeywords = {
    adventure: ['adventure', 'trek', 'climb', 'thrill', 'expedition', 'mountain', 'hike', 'climb', 'rapids', 'extreme'],
    cultural: ['temple', 'culture', 'heritage', 'history', 'ancient', 'museum', 'monument', 'traditional', 'ritual'],
    romantic: ['love', 'romantic', 'couple', 'honeymoon', 'intimate', 'sunset', 'candlelight', 'together'],
    spiritual: ['spiritual', 'meditation', 'peace', 'divine', 'prayer', 'ashram', 'zen', 'enlightenment', 'sacred'],
    exciting: ['exciting', 'fun', 'party', 'celebration', 'festival', 'vibrant', 'energetic', 'lively'],
    joyful: ['joy', 'happy', 'delightful', 'cheerful', 'wonderful', 'amazing', 'beautiful', 'magical'],
    nostalgic: ['remember', 'memory', 'childhood', 'nostalgia', 'past', 'reminds', 'familiar', 'old times'],
    contemplative: ['reflect', 'think', 'ponder', 'quiet', 'solitude', 'alone', 'introspective', 'thoughtful'],
    mysterious: ['mystery', 'unknown', 'secret', 'hidden', 'enigmatic', 'curious', 'unexplored', 'strange']
  };

  const suggestions = {
    adventure: [
      'Plan a trekking expedition to similar terrain',
      'Explore adventure sports in mountain regions',
      'Consider multi-day hiking adventures'
    ],
    cultural: [
      'Visit UNESCO World Heritage sites nearby',
      'Explore ancient temples and monuments',
      'Take heritage walks with local guides'
    ],
    romantic: [
      'Plan sunset dinners at scenic locations',
      'Book couple spa treatments',
      'Choose destinations with romantic ambiance'
    ],
    spiritual: [
      'Visit meditation retreats and ashrams',
      'Explore sacred pilgrimage sites',
      'Join yoga and wellness programs'
    ],
    peaceful: [
      'Choose hill stations and nature retreats',
      'Plan quiet getaways with minimal crowds',
      'Focus on wellness and relaxation'
    ],
    exciting: [
      'Explore vibrant cities and nightlife',
      'Try local festivals and events',
      'Book adventure activities and tours'
    ],
    joyful: [
      'Visit colorful markets and local celebrations',
      'Try local cuisine and food tours',
      'Capture moments with photography walks'
    ],
    nostalgic: [
      'Revisit childhood vacation spots',
      'Explore heritage homes and vintage cafes',
      'Take slow travel experiences'
    ],
    contemplative: [
      'Choose serene lakes and quiet mountains',
      'Book solo retreats and writing workshops',
      'Visit libraries and peaceful gardens'
    ],
    mysterious: [
      'Explore off-beat destinations',
      'Visit ancient ruins and folklore sites',
      'Take night walks and ghost tours'
    ]
  };

  // Calculate emotion scores based on keyword matches
  let maxScore = 0;
  for (const [emotionType, keywords] of Object.entries(emotionKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      emotion = emotionType;
      // Mood score based on intensity (capped at 10)
      moodScore = Math.min(10, 5 + Math.floor(score / 2));
    }
  }

  return {
    emotion,
    moodScore,
    confidence: 0.85,
    aiSuggestions: suggestions[emotion] || suggestions.peaceful
  };
}


/**
 * Get stories with location filtering and pagination
 * @route GET /api/v1/stories
 * @access Public (with optional authentication)
 */
const getStories = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      lat,
      lng,
      radius = 5000, // meters
      city,
      tags,
      search,
      sortBy = 'recent',
      author,
      authorEmail
    } = req.query;

    // Validate pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAGINATION',
          message: 'Page number must be a positive integer'
        }
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PAGINATION',
          message: 'Limit must be a positive integer between 1 and 100'
        }
      });
    }

    // Build query
    // If user is requesting their own stories, show all statuses (draft + published)
    // Otherwise, only show published stories
    let query = {};
    
    // Check if this is a request for the authenticated user's own stories
    const isOwnStories = req.user && (
      (author && author === req.user._id?.toString()) ||
      (authorEmail && authorEmail === req.user.email)
    );
    
    // Only filter by published if it's a public query (not the user's own stories)
    if (!isOwnStories) {
      query.status = 'published';
    }

    // Location-based filtering with validation
    if (lat && lng) {
      const longitude = parseFloat(lng);
      const latitude = parseFloat(lat);

      if (isNaN(longitude) || isNaN(latitude)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_COORDINATES',
            message: 'Latitude and longitude must be valid numbers'
          }
        });
      }

      // Find nearby locations first
      const nearbyLocations = await Location.find({
        coordinates: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: parseInt(radius)
          }
        }
      }).select('_id');

      query.location = { $in: nearbyLocations.map(loc => loc._id) };
    } else if (city) {
      // Filter by city name
      const cityLocations = await Location.find({
        'address.city': new RegExp(city, 'i')
      }).select('_id');

      query.location = { $in: cityLocations.map(loc => loc._id) };
    }

    // Tag filtering
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $in: tagList };
    }

    // Author filtering
    if (author) {
      logger.info(`[getStories] Filtering by author: ${author}`);
      query.author = author;
    } else if (authorEmail) {
      // Find user by email and filter by their ID
      const user = await User.findOne({ email: authorEmail }).select('_id');
      if (user) {
        logger.info(`[getStories] Found user by email ${authorEmail}: ${user._id}`);
        query.author = user._id;
      } else {
        logger.warn(`[getStories] No user found for email: ${authorEmail}`);
        // If no user found, return empty results
        query.author = null;
      }
    }
    
    logger.info(`[getStories] Final query:`, JSON.stringify(query));

    // Search filtering
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'popular':
        sortOptions = { 'analytics.popularityScore': -1 };
        break;
      case 'likes':
        sortOptions = { 'engagement.likes': -1 };
        break;
      case 'views':
        sortOptions = { 'engagement.views': -1 };
        break;
      default:
        sortOptions = { publishedAt: -1 };
    }

    // Execute query with pagination (add debug + granular error capture)
    let stories = [];
    let total = 0;
    try {
      const qLimit = parseInt(limit);
      const qSkip = (parseInt(page) - 1) * qLimit;
      // Removed verbose debug logging after stabilization.
      [stories, total] = await Promise.all([
        Story.find(query)
          .populate('author', 'username displayName avatar homeCity stats')
          .populate('location', 'coordinates address description')
          .populate('tags', 'name displayName color')
          .sort(sortOptions)
          .limit(qLimit)
          .skip(qSkip)
          .lean(),
        Story.countDocuments(query)
      ]);
    } catch (innerErr) {
      // Log full error details
      logger.error('Story query failed', {
        name: innerErr?.name,
        message: innerErr?.message,
        stack: innerErr?.stack,
        code: innerErr?.code,
        query
      });
      return res.status(500).json({
        success: false,
        error: {
          code: 'STORY_QUERY_FAILED',
          message: 'Failed running story query',
          details: innerErr?.message || 'Unknown error'
        }
      });
    }

    // Removed verbose debug logging.
    const pages = Math.ceil(total / parseInt(limit));

    // Process stories for response (check if unlocked for current user)
    // Optimization: single batch Swap query instead of N+1 per-story queries
    let unlockedStoryIds = new Set();
    if (req.user?._id && stories.length > 0) {
      const storyIds = stories.map(s => s._id);
      const completedSwaps = await Swap.find({
        user: req.user._id,
        storyToUnlock: { $in: storyIds },
        status: 'completed'
      }).select('storyToUnlock').lean();
      unlockedStoryIds = new Set(completedSwaps.map(s => s.storyToUnlock.toString()));
    }

    const processedStories = stories.map((story) => {
      const isAuthor = req.user && story.author?._id?.toString() === req.user._id.toString();
      const noSwapRequired = !story.swapSettings?.requiresSwap || !story.swapSettings?.isLocked;
      const isUnlocked = !req.user
        ? false
        : isAuthor || noSwapRequired || unlockedStoryIds.has(story._id.toString());

      return {
        ...story,
        isUnlocked,
        content: isUnlocked ? story.content : {
          ...story.content,
          text: story.content.snippet ? { body: story.content.snippet } : undefined,
          media: undefined // Hide media if locked
        }
      };
    });

    res.json({
      stories: processedStories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages,
        hasNext: parseInt(page) < pages,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng), radius: parseInt(radius) } : null,
        city: city || null,
        tags: tags || null,
        search: search || null
      }
    });
  } catch (error) {
    logger.error('Error fetching stories:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch stories. Please try again later.',
        errorId: `err_${Date.now().toString(36)}`
      }
    });
  }
});

/**
 * Get single story by ID
 * @route GET /api/v1/stories/:id
 * @access Public (with optional authentication)
 */
const getStoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id)
    .populate('author', 'username displayName avatar homeCity stats')
    .populate('location', 'coordinates address description')
    .populate('tags', 'name displayName color');

  if (!story) {
    throw notFoundError('Story');
  }

  // Check if story is unlocked for current user
  const isUnlocked = await checkStoryUnlocked(story._id, req.user?._id);

  // Track view if story is unlocked
  if (isUnlocked) {
    await story.addView(req.user?._id, 'direct');
  }

  // Format response based on unlock status
  const response = {
    ...story.toObject(),
    isUnlocked,
    canUnlock: story.canUnlock(req.user?._id),
  };

  // Hide full content if story is locked
  if (!isUnlocked) {
    response.content = {
      ...story.content,
      text: story.content.snippet ? { body: story.content.snippet } : undefined,
      media: undefined
    };
  }

  res.json({ story: response });
});

/**
 * Create new story
 * @route POST /api/v1/stories
 * @access Private
 */
const createStory = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError('Validation failed', { errors: errors.array() });
  }

  const {
    title,
    content,
    location: locationData,
    tags,
    visibility = 'public'
  } = req.body;

  // Create or find location
  let location;
  if (locationData.coordinates && locationData.address) {
    location = await Location.findOrCreate({
      coordinates: {
        type: 'Point',
        coordinates: locationData.coordinates
      },
      address: {
        formatted: locationData.address.formatted || locationData.address,
        city: locationData.address.city || 'Unknown',
        country: locationData.address.country || 'Unknown'
      }
    });
  } else {
    throw validationError('Location data is required');
  }

  // Process tags
  let storyTags = [];
  if (tags && tags.length > 0) {
    for (const tagName of tags.slice(0, 5)) { // Limit to 5 tags
      const tag = await Tag.findOrCreate(tagName.toLowerCase());
      storyTags.push(tag._id);
    }
  }

  // Create story
  const story = new Story({
    title,
    content: {
      type: content.type || 'text',
      text: content.text ? {
        body: content.text,
        wordCount: content.text.trim().split(/\s+/).length
      } : undefined,
      media: content.media || []
    },
    author: req.user._id,
    location: location._id,
    tags: storyTags,
    visibility,
    status: 'published', // Auto-publish immediately
    publishedAt: new Date()
  });

  // Auto-analyze emotion if text content exists
  if (content.text) {
    try {
      const emotionAnalysis = analyzeStoryEmotion(title, content.text);
      story.emotion = emotionAnalysis.emotion;
      story.moodScore = emotionAnalysis.moodScore;
      story.aiSuggestions = emotionAnalysis.aiSuggestions;
      story.emotionAnalyzedAt = new Date();

      // Update user's mood history
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          'travelPreferences.moodHistory': {
            $each: [{
              emotion: emotionAnalysis.emotion,
              date: new Date(),
              source: 'story'
            }],
            $slice: -20 // Keep only last 20 entries
          }
        },
        $set: {
          'travelPreferences.lastStoryEmotion': emotionAnalysis.emotion
        }
      });
    } catch (emotionError) {
      logger.error('Emotion analysis failed:', emotionError);
      // Continue without emotion data if analysis fails
    }
  }

  await story.save();

  // Update location stats
  await location.updateStats();

  // Update tag usage stats
  for (const tagId of storyTags) {
    const tag = await Tag.findById(tagId);
    if (tag) {
      await tag.incrementUsage('totalStories');
    }
  }

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { 'stats.storiesPublished': 1 }
  });

  // Populate and return the created story
  const populatedStory = await Story.findById(story._id)
    .populate('author', 'username displayName avatar')
    .populate('location', 'coordinates address description')
    .populate('tags', 'name displayName color');

  logger.info('Story created successfully', {
    storyId: story._id,
    authorId: req.user._id,
    title: story.title
  });

  res.status(201).json({
    message: 'Story created successfully',
    story: populatedStory
  });
});

/**
 * Update story
 * @route PUT /api/v1/stories/:id
 * @access Private (author only)
 */
const updateStory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, visibility } = req.body;

  const story = await Story.findById(id);

  if (!story) {
    throw notFoundError('Story');
  }

  // Check if user owns the story
  if (story.author.toString() !== req.user._id.toString()) {
    throw authorizationError('You can only edit your own stories');
  }

  // Update fields
  if (title) story.title = title;
  if (content) {
    story.content = {
      ...story.content,
      ...content
    };
  }
  if (visibility) story.visibility = visibility;

  // Update tags if provided
  if (tags) {
    let storyTags = [];
    for (const tagName of tags.slice(0, 5)) {
      const tag = await Tag.findOrCreate(tagName.toLowerCase());
      storyTags.push(tag._id);
    }
    story.tags = storyTags;
  }

  await story.save();

  const updatedStory = await Story.findById(story._id)
    .populate('author', 'username displayName avatar')
    .populate('location', 'coordinates address description')
    .populate('tags', 'name displayName color');

  res.json({
    message: 'Story updated successfully',
    story: updatedStory
  });
});

/**
 * Delete story
 * @route DELETE /api/v1/stories/:id
 * @access Private (author only)
 */
const deleteStory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id);

  if (!story) {
    throw notFoundError('Story');
  }

  // Check if user owns the story or is admin
  if (story.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw authorizationError('You can only delete your own stories');
  }

  await Story.findByIdAndDelete(id);

  res.json({
    message: 'Story deleted successfully'
  });
});

/**
 * Like/Unlike story
 * @route POST /api/v1/stories/:id/like
 * @access Private
 */
const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id);
  if (!story) {
    throw notFoundError('Story');
  }

  // Check if user has already liked this story
  // This would typically be stored in a separate collection for better performance
  const user = await User.findById(req.user._id);

  // For simplicity, we'll just increment/decrement the like count
  // In a production app, you'd have a separate Likes collection
  await story.incrementEngagement('likes', 1);

  res.json({
    message: 'Story liked successfully',
    likes: story.engagement.likes
  });
});

/**
 * Get trending stories
 * @route GET /api/v1/stories/trending
 * @access Public
 */
const getTrendingStories = asyncHandler(async (req, res) => {
  const { limit = 10, timeframe = '7d' } = req.query;

  const stories = await Story.findTrending(parseInt(limit), timeframe);

  res.json({
    stories,
    timeframe,
    generated: new Date()
  });
});

/**
 * Publish a draft story
 * @route POST /api/v1/stories/:id/publish
 * @access Private (author only)
 */
const publishStory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const story = await Story.findById(id);

  if (!story) {
    throw notFoundError('Story');
  }

  // Check if user owns the story
  const storyAuthorId = story.author ? story.author.toString() : null;
  const userId = req.user._id ? req.user._id.toString() : null;
  
  if (storyAuthorId !== userId) {
    throw authorizationError('You can only publish your own stories');
  }

  // Check if story is in draft status
  if (story.status !== 'draft') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_STATUS',
        message: `Story is already ${story.status}. Only draft stories can be published.`,
        currentStatus: story.status
      }
    });
  }

  // Update story status to published
  story.status = 'published';
  story.publishedAt = new Date();
  await story.save();

  // Update user stats - increment published stories count
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.storiesPublished': 1 }
    }, { new: true });
  } catch (err) {
    logger.error('Failed to update user stats:', { userId: req.user._id, error: err.message });
    // Don't fail the publish if user stats update fails
  }

  // Populate and return the published story
  const publishedStory = await Story.findById(story._id)
    .populate('author', 'username displayName avatar homeCity stats')
    .populate('location', 'coordinates address description')
    .populate('tags', 'name displayName color');

  if (!publishedStory) {
    throw notFoundError('Story');
  }

  logger.info('Story published successfully', {
    storyId: story._id,
    authorId: req.user._id,
    title: story.title
  });

  res.json({
    success: true,
    message: 'Story published successfully',
    story: publishedStory
  });
});

/**
 * Helper function to check if a single story is unlocked for a user.
 * Accepts the already-fetched story object to avoid redundant DB lookups.
 * Used by single-story endpoints (e.g. getStoryById).
 */
async function checkStoryUnlocked(storyId, userId) {
  if (!userId) return false;

  // Fetch the story (only called for single-story endpoints, so 1 query is fine)
  const story = await Story.findById(storyId);
  if (!story) return false;

  // Check if user is author
  if (story.author.toString() === userId.toString()) {
    return true;
  }

  // Check if swap is not required
  if (!story.swapSettings.requiresSwap || !story.swapSettings.isLocked) {
    return true;
  }

  // Check if user has completed a swap for this story
  const completedSwap = await Swap.findOne({
    user: userId,
    storyToUnlock: storyId,
    status: 'completed'
  });

  return !!completedSwap;
}

module.exports = {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleLike,
  getTrendingStories,
  publishStory
};
