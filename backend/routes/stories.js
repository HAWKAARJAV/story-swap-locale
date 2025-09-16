const express = require('express');
const { body } = require('express-validator');
const { authenticate, optionalAuth, authorize } = require('../middleware/auth');
const {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
  toggleLike,
  getTrendingStories
} = require('../controllers/storyController');

const router = express.Router();

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Get stories with filtering and pagination
 *     tags: [Stories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: integer
 *           default: 5000
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [recent, popular, likes, views]
 *           default: recent
 *     responses:
 *       200:
 *         description: Stories retrieved successfully
 */
router.get('/', optionalAuth, getStories);

/**
 * @swagger
 * /stories/trending:
 *   get:
 *     summary: Get trending stories
 *     tags: [Stories]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [1d, 3d, 7d, 30d]
 *           default: 7d
 *     responses:
 *       200:
 *         description: Trending stories retrieved successfully
 */
router.get('/trending', getTrendingStories);

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create a new story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoryCreateRequest'
 *     responses:
 *       201:
 *         description: Story created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', authenticate, [
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content.type')
    .isIn(['text', 'audio', 'photo', 'video', 'mixed'])
    .withMessage('Invalid content type'),
  body('content.text')
    .optional()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Text content must be between 50 and 5000 characters'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be [longitude, latitude]'),
  body('location.address')
    .notEmpty()
    .withMessage('Location address is required'),
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 tags allowed')
], createStory);

/**
 * @swagger
 * /stories/{id}:
 *   get:
 *     summary: Get story by ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', optionalAuth, getStoryById);

/**
 * @swagger
 * /stories/{id}:
 *   put:
 *     summary: Update story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', authenticate, updateStory);

/**
 * @swagger
 * /stories/{id}:
 *   delete:
 *     summary: Delete story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, deleteStory);

/**
 * @swagger
 * /stories/{id}/like:
 *   post:
 *     summary: Like/unlike a story
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Story liked successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/like', authenticate, toggleLike);

module.exports = router;
