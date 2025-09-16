const Swap = require('../../database/models/Swap');
const Story = require('../../database/models/Story');
const User = require('../../database/models/User');
const Location = require('../../database/models/Location');
const Tag = require('../../database/models/Tag');
const { asyncHandler, validationError, notFoundError, authorizationError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Request story unlock via swap
 * @route POST /api/v1/swaps/:storyId/request-unlock
 * @access Private
 */
const requestUnlock = asyncHandler(async (req, res) => {
  const { storyId } = req.params;
  const { submittedStory } = req.body;
  const userId = req.user._id;

  // Check if target story exists
  const targetStory = await Story.findById(storyId);
  if (!targetStory) {
    throw notFoundError('Story');
  }

  // Check if story requires swapping
  if (!targetStory.swapSettings.requiresSwap || !targetStory.swapSettings.isLocked) {
    return res.json({
      status: 'completed',
      unlocked: true,
      message: 'Story is already unlocked'
    });
  }

  // Check if user is the author (authors can always access their stories)
  if (targetStory.author.toString() === userId.toString()) {
    return res.json({
      status: 'completed',
      unlocked: true,
      message: 'You can access your own story'
    });
  }

  // Check if user has already swapped for this story
  const existingSwap = await Swap.findOne({
    user: userId,
    storyToUnlock: storyId
  });

  if (existingSwap && existingSwap.status === 'completed') {
    return res.json({
      status: 'completed',
      unlocked: true,
      message: 'Story already unlocked'
    });
  }

  if (existingSwap && existingSwap.status === 'pending') {
    return res.json({
      status: 'pending',
      unlocked: false,
      message: 'Swap is being processed',
      swapId: existingSwap._id
    });
  }

  // Validate submitted story data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError('Story submission validation failed', { errors: errors.array() });
  }

  // Create new swap record
  const swap = new Swap({
    user: userId,
    storyToUnlock: storyId,
    submissionData: submittedStory,
    status: 'pending'
  });

  await swap.save();

  // Validate swap requirements
  const validation = await swap.validateRequirements();
  if (!validation.isValid) {
    swap.status = 'rejected';
    await swap.save();
    
    throw validationError('Story does not meet swap requirements', {
      errors: validation.errors
    });
  }

  // Run automated checks
  try {
    const checkResults = await swap.runAutomatedChecks();
    
    if (checkResults.passed) {
      // Auto-approve and create the story
      const createdStory = await createStoryFromSwap(swap, userId);
      
      // Mark swap as completed
      swap.submittedStory = createdStory._id;
      swap.status = 'completed';
      await swap.save();

      // Update target story unlock count
      await targetStory.incrementEngagement('unlocks');

      // Update user stats
      await User.findByIdAndUpdate(userId, {
        $inc: { 
          'stats.swapsCompleted': 1,
          'stats.storiesUnlocked': 1
        }
      });

      logger.info('Swap completed successfully', {
        swapId: swap._id,
        userId,
        targetStoryId: storyId,
        submittedStoryId: createdStory._id
      });

      res.json({
        status: 'completed',
        unlocked: true,
        message: 'Story swapped and unlocked successfully!',
        swapId: swap._id,
        submittedStory: {
          _id: createdStory._id,
          title: createdStory.title
        }
      });
    } else {
      // Story needs manual review
      swap.status = 'rejected';
      swap.moderationResults.reviewRequired = true;
      await swap.save();

      res.json({
        status: 'rejected',
        unlocked: false,
        message: 'Your story is being reviewed. We\'ll notify you once it\'s approved.',
        swapId: swap._id
      });
    }
  } catch (error) {
    swap.status = 'rejected';
    await swap.save();
    
    logger.error('Swap processing failed', {
      swapId: swap._id,
      userId,
      error: error.message
    });

    throw validationError('Failed to process story swap', {
      details: error.message
    });
  }
});

/**
 * Get user's swap history
 * @route GET /api/v1/swaps/user/me
 * @access Private
 */
const getUserSwaps = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const userId = req.user._id;

  const swaps = await Swap.findUserSwaps(userId, {
    status,
    limit: parseInt(limit),
    sort: '-createdAt'
  });

  const total = await Swap.countDocuments({
    user: userId,
    ...(status && { status })
  });

  res.json({
    swaps,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
});

/**
 * Get swap details by ID
 * @route GET /api/v1/swaps/:id
 * @access Private
 */
const getSwapById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const swap = await Swap.findById(id)
    .populate('user', 'username displayName avatar')
    .populate('storyToUnlock', 'title author location')
    .populate('submittedStory', 'title status');

  if (!swap) {
    throw notFoundError('Swap');
  }

  // Check if user owns this swap or is admin
  if (swap.user._id.toString() !== userId.toString() && req.user.role !== 'admin') {
    throw authorizationError('Access denied');
  }

  res.json({ swap });
});

/**
 * Cancel pending swap
 * @route DELETE /api/v1/swaps/:id
 * @access Private
 */
const cancelSwap = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const swap = await Swap.findById(id);
  
  if (!swap) {
    throw notFoundError('Swap');
  }

  // Check if user owns this swap
  if (swap.user.toString() !== userId.toString()) {
    throw authorizationError('You can only cancel your own swaps');
  }

  // Can only cancel pending swaps
  if (swap.status !== 'pending') {
    throw validationError('Can only cancel pending swaps');
  }

  await Swap.findByIdAndDelete(id);

  res.json({
    message: 'Swap cancelled successfully'
  });
});

/**
 * Get swap statistics (for admin dashboard)
 * @route GET /api/v1/swaps/stats
 * @access Admin
 */
const getSwapStats = asyncHandler(async (req, res) => {
  const { timeframe = '7d' } = req.query;

  const stats = await Swap.getSwapStats(timeframe);
  
  // Additional aggregated stats
  const totalSwaps = await Swap.countDocuments();
  const completedSwaps = await Swap.countDocuments({ status: 'completed' });
  const pendingSwaps = await Swap.countDocuments({ status: 'pending' });
  const rejectedSwaps = await Swap.countDocuments({ status: 'rejected' });

  const successRate = totalSwaps > 0 ? ((completedSwaps / totalSwaps) * 100).toFixed(2) : 0;

  res.json({
    timeframe,
    overview: {
      totalSwaps,
      completedSwaps,
      pendingSwaps,
      rejectedSwaps,
      successRate: parseFloat(successRate)
    },
    breakdown: stats,
    generated: new Date()
  });
});

/**
 * Create story from swap submission data
 */
async function createStoryFromSwap(swap, userId) {
  const { submissionData } = swap;

  // Create or find location
  let location;
  if (submissionData.location && submissionData.location.coordinates) {
    location = await Location.findOrCreate({
      coordinates: {
        type: 'Point',
        coordinates: submissionData.location.coordinates
      },
      address: {
        formatted: submissionData.location.address || 'User submitted location',
        city: 'Unknown',
        country: 'Unknown'
      }
    });
  } else {
    throw new Error('Location is required for story submission');
  }

  // Process tags
  let storyTags = [];
  if (submissionData.tags && submissionData.tags.length > 0) {
    for (const tagName of submissionData.tags.slice(0, 5)) {
      const tag = await Tag.findOrCreate(tagName.toLowerCase());
      storyTags.push(tag._id);
    }
  }

  // Create story
  const story = new Story({
    title: submissionData.title,
    content: {
      type: submissionData.content.type || 'text',
      text: submissionData.content.text ? {
        body: submissionData.content.text,
        wordCount: submissionData.content.text.trim().split(/\s+/).length
      } : undefined,
      media: submissionData.content.media || []
    },
    author: userId,
    location: location._id,
    tags: storyTags,
    status: 'published',
    publishedAt: new Date(),
    swapSettings: {
      isLocked: true,
      requiresSwap: true
    }
  });

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
  await User.findByIdAndUpdate(userId, {
    $inc: { 'stats.storiesPublished': 1 }
  });

  return story;
}

/**
 * Retry failed swap (admin only)
 * @route POST /api/v1/swaps/:id/retry
 * @access Admin
 */
const retrySwap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const swap = await Swap.findById(id);
  
  if (!swap) {
    throw notFoundError('Swap');
  }

  if (swap.status !== 'rejected') {
    throw validationError('Can only retry rejected swaps');
  }

  // Reset swap status
  swap.status = 'pending';
  swap.moderationResults = {
    flagged: false,
    reasons: [],
    reviewRequired: false
  };

  await swap.save();

  // Try processing again
  try {
    const checkResults = await swap.runAutomatedChecks();
    
    if (checkResults.passed) {
      const createdStory = await createStoryFromSwap(swap, swap.user);
      
      swap.submittedStory = createdStory._id;
      swap.status = 'completed';
      await swap.save();

      res.json({
        message: 'Swap retried and completed successfully',
        status: 'completed',
        submittedStory: createdStory._id
      });
    } else {
      swap.status = 'rejected';
      swap.moderationResults.reviewRequired = true;
      await swap.save();

      res.json({
        message: 'Swap retried but still requires review',
        status: 'rejected'
      });
    }
  } catch (error) {
    swap.status = 'rejected';
    await swap.save();
    
    throw validationError('Swap retry failed', {
      details: error.message
    });
  }
});

module.exports = {
  requestUnlock,
  getUserSwaps,
  getSwapById,
  cancelSwap,
  getSwapStats,
  retrySwap
};