const jwtService = require('../utils/jwt');
const User = require('../../database/models/User');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate users using JWT tokens
 * Adds user object to req.user if authentication succeeds
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({
        error: {
          code: 'NO_TOKEN',
          message: 'Access token is required'
        }
      });
    }

    // Verify the token
    const decoded = jwtService.verifyAccessToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check if user is active and not banned
    if (!user.flags.isActive || user.flags.isBanned) {
      return res.status(401).json({
        error: {
          code: 'USER_INACTIVE',
          message: user.flags.isBanned ? 'User account is banned' : 'User account is inactive'
        }
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        error: {
          code: 'ACCOUNT_LOCKED',
          message: 'Account is temporarily locked due to multiple failed login attempts'
        }
      });
    }

    // Add user to request object
    req.user = user;
    req.token = {
      raw: token,
      decoded: decoded
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired'
        }
      });
    }
    
    if (error.message.includes('invalid') || error.message.includes('malformed')) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid access token'
        }
      });
    }

    return res.status(500).json({
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    });
  }
};

/**
 * Optional authentication middleware
 * Sets req.user if token is valid, but doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtService.extractTokenFromHeader(authHeader);
    
    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    // Try to verify token and get user
    const decoded = jwtService.verifyAccessToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (user && user.flags.isActive && !user.flags.isBanned && !user.isLocked) {
      req.user = user;
      req.token = {
        raw: token,
        decoded: decoded
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token verification fails, just continue without authentication
    req.user = null;
    next();
  }
};

/**
 * Middleware to require email verification
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'AUTHENTICATION_REQUIRED',
        message: 'Authentication required'
      }
    });
  }

  if (!req.user.verification.email.isVerified) {
    return res.status(403).json({
      error: {
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Email verification is required to perform this action'
      }
    });
  }

  next();
};

/**
 * Middleware to authorize users based on roles
 * @param {string|Array} roles - Required role(s)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    const userRole = req.user.role;
    const allowedRoles = roles.flat();

    if (!allowedRoles.includes(userRole)) {
      logger.warn(`Authorization failed - User ${req.user.id} (${userRole}) attempted to access ${req.method} ${req.path} requiring roles: ${allowedRoles.join(', ')}`);
      
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'You do not have permission to perform this action'
        }
      });
    }

    next();
  };
};

/**
 * Middleware to check if user owns the resource or has admin privileges
 * @param {string} resourceUserField - Field name in req object containing resource owner ID
 */
const requireOwnershipOrAdmin = (resourceUserField = 'params.userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required'
        }
      });
    }

    // Get resource owner ID from request
    const resourceOwnerKeys = resourceUserField.split('.');
    let resourceOwnerId = req;
    
    for (const key of resourceOwnerKeys) {
      if (resourceOwnerId && resourceOwnerId[key]) {
        resourceOwnerId = resourceOwnerId[key];
      } else {
        resourceOwnerId = null;
        break;
      }
    }

    // Check if user owns the resource or is admin/moderator
    const isOwner = resourceOwnerId && resourceOwnerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: {
          code: 'ACCESS_DENIED',
          message: 'You can only access your own resources'
        }
      });
    }

    req.isResourceOwner = isOwner;
    req.isAdmin = isAdmin;
    next();
  };
};

/**
 * Middleware to apply rate limiting per user
 * @param {number} maxRequests - Maximum requests per window
 * @param {number} windowMs - Time window in milliseconds
 */
const rateLimitByUser = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequestCounts = new Map();
  
  return (req, res, next) => {
    if (!req.user) {
      // Apply IP-based rate limiting for unauthenticated users
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    if (userRequestCounts.has(userId)) {
      const userRequests = userRequestCounts.get(userId);
      userRequestCounts.set(userId, userRequests.filter(time => time > windowStart));
    }

    // Check current request count
    const currentRequests = userRequestCounts.get(userId) || [];
    
    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please try again in ${Math.ceil(windowMs / 60000)} minutes.`
        }
      });
    }

    // Add current request
    currentRequests.push(now);
    userRequestCounts.set(userId, currentRequests);

    next();
  };
};

/**
 * Middleware to log authentication events
 */
const logAuthEvents = (req, res, next) => {
  if (req.user) {
    logger.info(`Authenticated request: ${req.method} ${req.path}`, {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }
  
  next();
};

/**
 * Middleware to handle API key authentication (for external services)
 * @param {string} expectedApiKey - Expected API key value
 */
const authenticateApiKey = (expectedApiKey) => {
  return (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({
        error: {
          code: 'API_KEY_REQUIRED',
          message: 'API key is required'
        }
      });
    }

    if (apiKey !== expectedApiKey) {
      return res.status(401).json({
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid API key'
        }
      });
    }

    req.authenticatedViaApiKey = true;
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireEmailVerification,
  authorize,
  requireOwnershipOrAdmin,
  rateLimitByUser,
  logAuthEvents,
  authenticateApiKey
};