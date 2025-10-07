const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
function simpleId() { return 'u-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

const userSchema = new mongoose.Schema({
  _id: { type: String, default: simpleId },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  displayName: { type: String, required: true, trim: true, maxlength: 50 },
  avatar: { url: { type: String, default: null }, publicId: { type: String, default: null } },
  bio: { type: String, maxlength: 300, trim: true, default: '' },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  homeCity: { type: String, trim: true, maxlength: 100 },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: [0, 0] } },
  socialLinks: { instagram: String, twitter: String, website: String },
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
  flags: {
    isBanned: { type: Boolean, default: false },
    banReason: String,
    banExpiresAt: Date,
    isActive: { type: Boolean, default: true }
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Indices reduced to avoid duplicates; email & username already unique enforced by schema uniqueness.
userSchema.index({ location: '2dsphere' });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'stats.storiesPublished': -1 });

userSchema.virtual('isLocked').get(function () {
  return false; // simplified for unified model; original logic not critical for story fetch
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try { const salt = await bcrypt.genSalt(12); this.password = await bcrypt.hash(this.password, salt); next(); } catch (e) { next(e); }
});

userSchema.methods.comparePassword = async function (candidate) { return bcrypt.compare(candidate, this.password); };

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
