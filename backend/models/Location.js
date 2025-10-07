const mongoose = require('mongoose');
function simpleId() { return 'l-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

const locationSchema = new mongoose.Schema({
  _id: { type: String, default: simpleId },
  coordinates: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: {
      type: [Number], required: true, validate: {
        validator: (c) => c.length === 2 && c[0] >= -180 && c[0] <= 180 && c[1] >= -90 && c[1] <= 90,
        message: 'Invalid coordinates format'
      }
    }
  },
  address: {
    formatted: { type: String, required: true, trim: true, maxlength: 200 },
    street: { type: String, trim: true, maxlength: 100 },
    neighborhood: { type: String, trim: true, maxlength: 50 },
    city: { type: String, required: true, trim: true, maxlength: 50 },
    state: { type: String, trim: true, maxlength: 50 },
    country: { type: String, required: true, trim: true, maxlength: 50 },
    postalCode: { type: String, trim: true, maxlength: 20 }
  },
  metadata: {
    placeId: String,
    type: { type: String, enum: ['poi', 'address', 'landmark', 'establishment', 'other'], default: 'address' },
    accuracy: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    source: { type: String, enum: ['google', 'mapbox', 'manual', 'gps'], default: 'manual' }
  },
  stats: {
    storiesCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    lastStoryDate: Date
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ 'address.city': 1, 'address.country': 1 });
locationSchema.index({ 'stats.storiesCount': -1 });
locationSchema.index({ 'stats.popularityScore': -1 });
locationSchema.index({ createdAt: -1 });

locationSchema.virtual('latitude').get(function () { return this.coordinates.coordinates[1]; });
locationSchema.virtual('longitude').get(function () { return this.coordinates.coordinates[0]; });
locationSchema.virtual('displayName').get(function () {
  return [this.address.neighborhood, this.address.city, this.address.state, this.address.country].filter(Boolean).join(', ');
});

locationSchema.methods.calculatePopularityScore = function () {
  const storyWeight = this.stats.storiesCount * 10;
  const recencyWeight = this.stats.lastStoryDate ? Math.max(0, 30 - Math.floor((Date.now() - this.stats.lastStoryDate) / 86400000)) : 0;
  return storyWeight + recencyWeight;
};

locationSchema.methods.updateStats = function (inc = 1) {
  this.stats.storiesCount += inc;
  this.stats.lastStoryDate = new Date();
  this.stats.popularityScore = this.calculatePopularityScore();
  return this.save();
};

locationSchema.statics.findOrCreate = async function (data) {
  const { coordinates, address } = data;
  let existing = await this.findOne({
    coordinates: {
      $near: { $geometry: { type: 'Point', coordinates: coordinates.coordinates }, $maxDistance: 50 }
    }
  });
  if (existing) return existing;
  return this.create(data);
};

module.exports = mongoose.models.Location || mongoose.model('Location', locationSchema);
