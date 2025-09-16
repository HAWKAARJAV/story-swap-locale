const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    validate: {
      validator: function(username) {
        return /^[a-zA-Z0-9_]+$/.test(username);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [50, 'Display name cannot exceed 50 characters']
  },
  avatar: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  },
  bio: {
    type: String,
    maxlength: [300, 'Bio cannot exceed 300 characters'],
    trim: true,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  homeCity: {
    type: String,
    trim: true,
    maxlength: [100, 'Home city cannot exceed 100 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  socialLinks: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  preferences: {
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    publicProfile: { type: Boolean, default: true },
    shareLocation: { type: Boolean, default: false }
  },
  stats: {
    storiesPublished: { type: Number, default: 0 },
    storiesUnlocked: { type: Number, default: 0 },
    swapsCompleted: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
  },
  verification: {
    email: {
      isVerified: { type: Boolean, default: false },
      token: String,
      expires: Date
    },
    phone: {
      isVerified: { type: Boolean, default: false },
      number: String
    }
  },
  security: {
    loginAttempts: { type: Number, default: 0 },
    lockoutUntil: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    lastLoginIP: String
  },
  oauth: {
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    expiresAt: Date
  },
  flags: {
    isBanned: { type: Boolean, default: false },
    banReason: String,
    banExpiresAt: Date,
    isActive: { type: Boolean, default: true }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'stats.storiesPublished': -1 });

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockoutUntil && this.security.lockoutUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.security.lockoutUntil && this.security.lockoutUntil < Date.now()) {
    return this.updateOne({
      $unset: {
        'security.lockoutUntil': 1
      },
      $set: {
        'security.loginAttempts': 1
      }
    });
  }

  const updates = { $inc: { 'security.loginAttempts': 1 } };
  
  // If we have max attempts and it's not locked yet, lock the account
  if (this.security.loginAttempts + 1 >= 10 && !this.isLocked) {
    updates.$set = {
      'security.lockoutUntil': Date.now() + 30 * 60 * 1000 // 30 minutes
    };
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      'security.loginAttempts': 1,
      'security.lockoutUntil': 1
    }
  });
};

// Method to generate verification token
userSchema.methods.generateVerificationToken = function() {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit token
  this.verification.email.token = token;
  this.verification.email.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  return token;
};

// Method to update user stats
userSchema.methods.updateStats = function(statType, increment = 1) {
  this.stats[statType] = (this.stats[statType] || 0) + increment;
  return this.save();
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ]
  });
};

// Static method for nearby users
userSchema.statics.findNearbyUsers = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // meters
      }
    },
    'flags.isActive': true,
    'flags.isBanned': false
  });
};

module.exports = mongoose.model('User', userSchema);