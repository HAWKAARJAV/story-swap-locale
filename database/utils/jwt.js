const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

class JWTService {
  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET;
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    this.accessTokenExpiry = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';
    
    if (!this.accessTokenSecret || !this.refreshTokenSecret) {
      throw new Error('JWT secrets are required. Please check your environment variables.');
    }
  }

  /**
   * Generate access token
   * @param {Object} payload - User payload to encode in token
   * @returns {string} - JWT access token
   */
  generateAccessToken(payload) {
    try {
      const tokenPayload = {
        sub: payload.userId || payload.id,
        id: payload.userId || payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role || 'user',
        type: 'access',
        jti: uuidv4(), // Unique token ID
        iat: Math.floor(Date.now() / 1000),
        ...payload
      };

      return jwt.sign(tokenPayload, this.accessTokenSecret, {
        expiresIn: this.accessTokenExpiry,
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  /**
   * Generate refresh token
   * @param {Object} payload - User payload to encode in token
   * @returns {string} - JWT refresh token
   */
  generateRefreshToken(payload) {
    try {
      const tokenPayload = {
        sub: payload.userId || payload.id,
        id: payload.userId || payload.id,
        type: 'refresh',
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000)
      };

      return jwt.sign(tokenPayload, this.refreshTokenSecret, {
        expiresIn: this.refreshTokenExpiry,
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} user - User object
   * @returns {Object} - Object containing access and refresh tokens
   */
  generateTokens(user) {
    const payload = {
      userId: user._id,
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.verification?.email?.isVerified || false
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      tokenType: 'Bearer',
      expiresIn: this.accessTokenExpiry
    };
  }

  /**
   * Verify access token
   * @param {string} token - JWT access token
   * @returns {Object} - Decoded token payload
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });

      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      } else if (error.name === 'NotBeforeError') {
        throw new Error('Access token not active yet');
      }
      
      logger.error('Error verifying access token:', error);
      throw new Error('Token verification failed');
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - JWT refresh token
   * @returns {Object} - Decoded token payload
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      
      logger.error('Error verifying refresh token:', error);
      throw new Error('Token verification failed');
    }
  }

  /**
   * Decode token without verification (for inspection)
   * @param {string} token - JWT token
   * @returns {Object} - Decoded token payload
   */
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} - Extracted token or null
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} - True if token is expired
   */
  isTokenExpired(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return true;
      
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} - Expiration date or null
   */
  getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) return null;
      
      return new Date(decoded.exp * 1000);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get time until token expires
   * @param {string} token - JWT token
   * @returns {number|null} - Milliseconds until expiration or null
   */
  getTimeUntilExpiration(token) {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return null;
    
    return expiration.getTime() - Date.now();
  }

  /**
   * Generate email verification token
   * @param {Object} payload - Payload for verification token
   * @returns {string} - JWT verification token
   */
  generateEmailVerificationToken(payload) {
    try {
      const tokenPayload = {
        sub: payload.userId,
        email: payload.email,
        type: 'email_verification',
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000)
      };

      return jwt.sign(tokenPayload, this.accessTokenSecret, {
        expiresIn: '24h',
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });
    } catch (error) {
      logger.error('Error generating email verification token:', error);
      throw new Error('Failed to generate verification token');
    }
  }

  /**
   * Generate password reset token
   * @param {Object} payload - Payload for reset token
   * @returns {string} - JWT reset token
   */
  generatePasswordResetToken(payload) {
    try {
      const tokenPayload = {
        sub: payload.userId,
        email: payload.email,
        type: 'password_reset',
        jti: uuidv4(),
        iat: Math.floor(Date.now() / 1000)
      };

      return jwt.sign(tokenPayload, this.accessTokenSecret, {
        expiresIn: '1h',
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });
    } catch (error) {
      logger.error('Error generating password reset token:', error);
      throw new Error('Failed to generate reset token');
    }
  }

  /**
   * Verify email verification token
   * @param {string} token - JWT verification token
   * @returns {Object} - Decoded token payload
   */
  verifyEmailVerificationToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });

      if (decoded.type !== 'email_verification') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      logger.error('Error verifying email verification token:', error);
      throw new Error('Invalid verification token');
    }
  }

  /**
   * Verify password reset token
   * @param {string} token - JWT reset token
   * @returns {Object} - Decoded token payload
   */
  verifyPasswordResetToken(token) {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'hyperlocal-story-swap',
        audience: 'story-swap-users'
      });

      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      logger.error('Error verifying password reset token:', error);
      throw new Error('Invalid reset token');
    }
  }
}

module.exports = new JWTService();