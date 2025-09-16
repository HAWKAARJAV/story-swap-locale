const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getPlatformAnalytics,
  getUserManagement,
  getModerationQueue,
  updateUser
} = require('../controllers/adminController');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticate, authorize('admin', 'moderator'));

/**
 * @swagger
 * /admin/analytics:
 *   get:
 *     summary: Get comprehensive platform analytics for judges
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeframe
 *         schema:
 *           type: string
 *           enum: [1d, 7d, 30d, 90d]
 *           default: 30d
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Platform analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalStories:
 *                       type: integer
 *                     totalSwaps:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                 growth:
 *                   type: object
 *                   properties:
 *                     newUsers:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: integer
 *                         growth:
 *                           type: string
 *                 geography:
 *                   type: object
 *                   properties:
 *                     topCities:
 *                       type: array
 *                       items:
 *                         type: object
 *                 swapMechanics:
 *                   type: object
 *                   properties:
 *                     totalSwaps:
 *                       type: integer
 *                     successRate:
 *                       type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/analytics', getPlatformAnalytics);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get user management data
 *     tags: [Admin]
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
 *           default: 50
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, moderator, admin]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, banned]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by username, display name, or email
 *     responses:
 *       200:
 *         description: User management data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/users', getUserManagement);

/**
 * @swagger
 * /admin/moderation:
 *   get:
 *     summary: Get content moderation queue
 *     tags: [Admin]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, stories, comments]
 *           default: all
 *     responses:
 *       200:
 *         description: Flagged content for moderation
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.get('/moderation', getModerationQueue);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     summary: Update user role or status
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, moderator, admin]
 *               status:
 *                 type: string
 *                 enum: [ban, unban, activate, deactivate]
 *               banReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.patch('/users/:id', authorize('admin'), updateUser);

// Legacy route for compatibility
router.get('/metrics', getPlatformAnalytics);

module.exports = router;
