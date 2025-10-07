const User = require('../models/User');
const jwtService = require('../utils/jwt');
const logger = require('../utils/logger');
const { asyncHandler, validationError, authenticationError, notFoundError } = require('../middleware/errorHandler');
const { validationResult } = require('express-validator');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError('Validation failed', { errors: errors.array() });
  }

  const { email, password, username, displayName, homeCity } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username: username }
    ]
  });

  if (existingUser) {
    if (existingUser.email === email.toLowerCase()) {
      throw validationError('Email is already registered');
    }
    if (existingUser.username === username) {
      throw validationError('Username is already taken');
    }
  }

  // Create new user
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    username,
    displayName,
    homeCity: homeCity || ''
  });

  // Generate email verification token
  const verificationToken = user.generateVerificationToken();
  await user.save();

  // Generate auth tokens
  const tokens = jwtService.generateTokens(user);

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  logger.info('User registered successfully:', { userId: user._id, email: user.email });

  res.status(201).json({
    message: 'User registered successfully',
    user: userResponse,
    tokens,
    verification: {
      required: true,
      token: verificationToken // In production, send this via email
    }
  });
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw validationError('Validation failed', { errors: errors.array() });
  }

  const { email, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  // Find user by email or username
  const user = await User.findByEmailOrUsername(email).select('+password');

  if (!user) {
    throw authenticationError('Invalid credentials');
  }

  // Check if account is locked
  if (user.isLocked) {
    throw authenticationError('Account is temporarily locked due to multiple failed login attempts');
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    // Increment login attempts
    await user.incrementLoginAttempts();
    logger.warn('Failed login attempt:', { email, ip: ipAddress });
    throw authenticationError('Invalid credentials');
  }

  // Check if user is active
  if (!user.flags.isActive || user.flags.isBanned) {
    throw authenticationError(user.flags.isBanned ? 'Account is banned' : 'Account is inactive');
  }

  // Reset login attempts on successful login
  if (user.security.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login info
  user.security.lastLogin = new Date();
  user.security.lastLoginIP = ipAddress;
  await user.save();

  // Generate tokens
  const tokens = jwtService.generateTokens(user);

  // Remove sensitive info from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.security;

  logger.info('User logged in successfully:', { userId: user._id, email: user.email });

  res.json({
    message: 'Login successful',
    user: userResponse,
    tokens
  });
});

/**
 * Logout user (invalidate tokens)
 * @route POST /api/v1/auth/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  // In a production app, you would typically:
  // 1. Add tokens to a blacklist
  // 2. Store blacklisted tokens in Redis with expiration
  // 3. Check blacklist in auth middleware
  
  // For now, we'll just log the logout event
  logger.info('User logged out:', { userId: req.user._id });

  res.json({
    message: 'Logout successful'
  });
});

/**
 * Refresh access token
 * @route POST /api/v1/auth/refresh
 * @access Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw authenticationError('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = jwtService.verifyRefreshToken(refreshToken);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw authenticationError('User not found');
    }

    // Check if user is still active
    if (!user.flags.isActive || user.flags.isBanned) {
      throw authenticationError('User account is not active');
    }

    // Generate new tokens
    const tokens = jwtService.generateTokens(user);

    res.json({
      message: 'Token refreshed successfully',
      tokens
    });
  } catch (error) {
    throw authenticationError('Invalid refresh token');
  }
});

/**
 * Verify email address
 * @route POST /api/v1/auth/verify-email
 * @access Public
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw validationError('Verification token is required');
  }

  try {
    // Verify the email verification token
    const decoded = jwtService.verifyEmailVerificationToken(token);
    
    // Find user
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      throw notFoundError('User');
    }

    // Check if email is already verified
    if (user.verification.email.isVerified) {
      return res.json({
        message: 'Email is already verified'
      });
    }

    // Verify email
    user.verification.email.isVerified = true;
    user.verification.email.token = undefined;
    user.verification.email.expires = undefined;
    await user.save();

    logger.info('Email verified successfully:', { userId: user._id, email: user.email });

    res.json({
      message: 'Email verified successfully'
    });
  } catch (error) {
    throw validationError('Invalid or expired verification token');
  }
});

/**
 * Resend email verification
 * @route POST /api/v1/auth/resend-verification
 * @access Private
 */
const resendVerification = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.verification.email.isVerified) {
    throw validationError('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = user.generateVerificationToken();
  await user.save();

  // In production, send email here
  logger.info('Verification email resent:', { userId: user._id, email: user.email });

  res.json({
    message: 'Verification email sent',
    token: verificationToken // In production, don't send this in response
  });
});

/**
 * Forgot password - send reset token
 * @route POST /api/v1/auth/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw validationError('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  }

  // Generate password reset token
  const resetToken = jwtService.generatePasswordResetToken({
    userId: user._id,
    email: user.email
  });

  // Store reset token (in production, hash this)
  user.security.passwordResetToken = resetToken;
  user.security.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // In production, send reset email here
  logger.info('Password reset requested:', { userId: user._id, email: user.email });

  res.json({
    message: 'If an account with that email exists, a password reset link has been sent',
    token: resetToken // In production, don't send this in response
  });
});

/**
 * Reset password with token
 * @route POST /api/v1/auth/reset-password
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw validationError('Token and new password are required');
  }

  if (password.length < 8) {
    throw validationError('Password must be at least 8 characters long');
  }

  try {
    // Verify reset token
    const decoded = jwtService.verifyPasswordResetToken(token);
    
    // Find user
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      throw authenticationError('Invalid reset token');
    }

    // Check if token matches and hasn't expired
    if (user.security.passwordResetToken !== token || 
        user.security.passwordResetExpires < new Date()) {
      throw authenticationError('Invalid or expired reset token');
    }

    // Update password
    user.password = password;
    user.security.passwordResetToken = undefined;
    user.security.passwordResetExpires = undefined;
    await user.save();

    logger.info('Password reset successfully:', { userId: user._id, email: user.email });

    res.json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    throw authenticationError('Invalid or expired reset token');
  }
});

/**
 * Get current user profile
 * @route GET /api/v1/auth/me
 * @access Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.json({
    user: {
      _id: user._id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      homeCity: user.homeCity,
      stats: user.stats,
      preferences: user.preferences,
      verification: user.verification,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

/**
 * Update password
 * @route PUT /api/v1/auth/password
 * @access Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw validationError('Current password and new password are required');
  }

  if (newPassword.length < 8) {
    throw validationError('Password must be at least 8 characters long');
  }

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  
  if (!isCurrentPasswordValid) {
    throw authenticationError('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info('Password updated:', { userId: user._id });

  res.json({
    message: 'Password updated successfully'
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updatePassword
};