const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  requestUnlock,
  getUserSwaps,
  getSwapById,
  cancelSwap,
  getSwapStats,
  retrySwap
} = require('../controllers/swapController');

const router = express.Router();

/**
 * @swagger
 * /swaps/{storyId}/request-unlock:
 *   post:
 *     summary: Request story unlock via swap
 *     tags: [Swaps]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: storyId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - submittedStory
 *             properties:
 *               submittedStory:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                     minLength: 5
 *                     maxLength: 200
 *                   content:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [text, audio, photo, video, mixed]
 *                       text:
 *                         type: string
 *                         minLength: 50
 *                       media:
 *                         type: array
 *                         items:
 *                           type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         minItems: 2
 *                         maxItems: 2
 *                       address:
 *                         type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     maxItems: 5
 *     responses:
 *       200:
 *         description: Swap request processed
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:storyId/request-unlock', authenticate, [
  body('submittedStory.title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Story title must be between 5 and 200 characters'),
  body('submittedStory.content.type')
    .isIn(['text', 'audio', 'photo', 'video', 'mixed'])
    .withMessage('Invalid content type'),
  body('submittedStory.content.text')
    .optional()
    .isLength({ min: 50 })
    .withMessage('Text content must be at least 50 characters'),
  body('submittedStory.location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be [longitude, latitude]'),
  body('submittedStory.location.address')
    .notEmpty()
    .withMessage('Location address is required')
], requestUnlock);

/**
 * @swagger
 * /swaps/user/me:
 *   get:
 *     summary: Get current user's swap history
 *     tags: [Swaps]
 *     security:
 *       - BearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, rejected, expired]
 *     responses:
 *       200:
 *         description: Swap history retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/user/me', authenticate, getUserSwaps);

/**
 * @swagger
 * /swaps/stats:
 *   get:
 *     summary: Get swap statistics (admin only)
 *     tags: [Swaps]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [1d, 7d, 30d]
 *           default: 7d
 *     responses:
 *       200:
 *         description: Swap statistics retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/stats', authenticate, authorize('admin'), getSwapStats);

/**
 * @swagger
 * /swaps/{id}:
 *   get:
 *     summary: Get swap details by ID
 *     tags: [Swaps]
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
 *         description: Swap details retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', authenticate, getSwapById);

/**
 * @swagger
 * /swaps/{id}:
 *   delete:
 *     summary: Cancel pending swap
 *     tags: [Swaps]
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
 *         description: Swap cancelled successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', authenticate, cancelSwap);

/**
 * @swagger
 * /swaps/{id}/retry:
 *   post:
 *     summary: Retry failed swap (admin only)
 *     tags: [Swaps]
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
 *         description: Swap retried successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/retry', authenticate, authorize('admin'), retrySwap);

module.exports = router;
