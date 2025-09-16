const logger = require('../utils/logger');

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle different types of errors and convert them to APIError
 */
const handleError = (err) => {
  let error = err;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));
    
    error = new APIError(
      'Validation failed',
      400,
      'VALIDATION_ERROR',
      { errors }
    );
  }

  // Handle Mongoose cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    error = new APIError(
      `Invalid ${err.path}: ${err.value}`,
      400,
      'INVALID_DATA_FORMAT'
    );
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    
    error = new APIError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`,
      409,
      'DUPLICATE_VALUE',
      { field, value }
    );
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new APIError(
      'Invalid token',
      401,
      'INVALID_TOKEN'
    );
  }

  if (err.name === 'TokenExpiredError') {
    error = new APIError(
      'Token expired',
      401,
      'TOKEN_EXPIRED'
    );
  }

  // Handle MongoDB connection errors
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    error = new APIError(
      'Database connection error',
      503,
      'DATABASE_ERROR'
    );
  }

  // Handle file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new APIError(
      'File size too large',
      413,
      'FILE_TOO_LARGE'
    );
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new APIError(
      'Unexpected file field',
      400,
      'INVALID_FILE_FIELD'
    );
  }

  return error;
};

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = handleError(err);

  // Log error details
  logger.error('API Error:', {
    error: {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      code: error.code
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : null
    }
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const errorResponse = {
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message,
      ...(error.details && { details: error.details }),
      ...(isDevelopment && { stack: error.stack }),
      timestamp: new Date().toISOString()
    }
  };

  // Add request ID if available
  if (req.id) {
    errorResponse.requestId = req.id;
  }

  res.status(error.statusCode || 500).json(errorResponse);
};

/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new APIError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  
  next(error);
};

/**
 * Async error wrapper to catch errors in async route handlers
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Validation error helper
 */
const validationError = (message, details = null) => {
  return new APIError(message, 400, 'VALIDATION_ERROR', details);
};

/**
 * Authorization error helper
 */
const authorizationError = (message = 'Access denied') => {
  return new APIError(message, 403, 'ACCESS_DENIED');
};

/**
 * Authentication error helper
 */
const authenticationError = (message = 'Authentication required') => {
  return new APIError(message, 401, 'AUTHENTICATION_REQUIRED');
};

/**
 * Not found error helper
 */
const notFoundError = (resource = 'Resource') => {
  return new APIError(`${resource} not found`, 404, 'NOT_FOUND');
};

/**
 * Conflict error helper
 */
const conflictError = (message) => {
  return new APIError(message, 409, 'CONFLICT');
};

/**
 * Rate limit error helper
 */
const rateLimitError = (message = 'Too many requests') => {
  return new APIError(message, 429, 'RATE_LIMIT_EXCEEDED');
};

/**
 * Service unavailable error helper
 */
const serviceUnavailableError = (message = 'Service temporarily unavailable') => {
  return new APIError(message, 503, 'SERVICE_UNAVAILABLE');
};

module.exports = {
  APIError,
  errorHandler,
  notFound,
  asyncHandler,
  validationError,
  authorizationError,
  authenticationError,
  notFoundError,
  conflictError,
  rateLimitError,
  serviceUnavailableError
};