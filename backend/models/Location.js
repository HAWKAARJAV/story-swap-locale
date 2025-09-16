const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const locationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates format'
      }
    }
  },
  address: {
    formatted: {
      type: String,
      required: [true, 'Formatted address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters']
    },
    street: {
      type: String,
      trim: true,
      maxlength: [100, 'Street cannot exceed 100 characters']
    },
    neighborhood: {
      type: String,
      trim: true,
      maxlength: [50, 'Neighborhood cannot exceed 50 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [50, 'City cannot exceed 50 characters']
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, 'State cannot exceed 50 characters']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      maxlength: [50, 'Country cannot exceed 50 characters']
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [20, 'Postal code cannot exceed 20 characters']
    }
  },
  metadata: {
    placeId: String, // Google Places ID or similar
    type: {
      type: String,
      enum: ['poi', 'address', 'landmark', 'establishment', 'other'],
      default: 'address'
    },
    accuracy: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    source: {
      type: String,
      enum: ['google', 'mapbox', 'manual', 'gps'],
      default: 'manual'
    }
  },
  stats: {
    storiesCount: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 },
    lastStoryDate: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Geospatial index for location queries
locationSchema.index({ coordinates: '2dsphere' });

// Compound indexes for common queries
locationSchema.index({ 'address.city': 1, 'address.country': 1 });
locationSchema.index({ 'stats.storiesCount': -1 });
locationSchema.index({ 'stats.popularityScore': -1 });
locationSchema.index({ createdAt: -1 });

// Virtual for latitude
locationSchema.virtual('latitude').get(function() {
  return this.coordinates.coordinates[1];
});

// Virtual for longitude
locationSchema.virtual('longitude').get(function() {
  return this.coordinates.coordinates[0];
});

// Virtual for display name
locationSchema.virtual('displayName').get(function() {
  const parts = [
    this.address.neighborhood,
    this.address.city,
    this.address.state,
    this.address.country
  ].filter(Boolean);
  return parts.join(', ');
});

// Instance method to calculate distance to another location
locationSchema.methods.distanceTo = function(otherLocation) {
  const [lon1, lat1] = this.coordinates.coordinates;
  const [lon2, lat2] = otherLocation.coordinates ? 
    otherLocation.coordinates.coordinates : [otherLocation.longitude, otherLocation.latitude];

  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

// Instance method to update stats
locationSchema.methods.updateStats = function(increment = 1) {
  this.stats.storiesCount += increment;
  this.stats.lastStoryDate = new Date();
  this.stats.popularityScore = this.calculatePopularityScore();
  return this.save();
};

// Instance method to calculate popularity score
locationSchema.methods.calculatePopularityScore = function() {
  const storyWeight = this.stats.storiesCount * 10;
  const recencyWeight = this.stats.lastStoryDate ? 
    Math.max(0, 30 - Math.floor((Date.now() - this.stats.lastStoryDate) / (1000 * 60 * 60 * 24))) : 0;
  
  return storyWeight + recencyWeight;
};

// Static method to find locations within radius
locationSchema.statics.findNearby = function(longitude, latitude, maxDistance = 5000, limit = 50) {
  return this.find({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    }
  }).limit(limit);
};

// Static method to find popular locations
locationSchema.statics.findPopular = function(city = null, limit = 20) {
  const query = city ? { 'address.city': new RegExp(city, 'i') } : {};
  
  return this.find(query)
    .sort({ 'stats.popularityScore': -1, 'stats.storiesCount': -1 })
    .limit(limit);
};

// Static method to find or create location
locationSchema.statics.findOrCreate = async function(locationData) {
  const { coordinates, address } = locationData;
  
  // Try to find existing location within 50 meters
  let existingLocation = await this.findOne({
    coordinates: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates.coordinates
        },
        $maxDistance: 50 // 50 meters
      }
    }
  });

  if (existingLocation) {
    return existingLocation;
  }

  // Create new location
  return this.create(locationData);
};

// Pre-save middleware to update popularity score
locationSchema.pre('save', function(next) {
  if (this.isModified('stats.storiesCount') || this.isModified('stats.lastStoryDate')) {
    this.stats.popularityScore = this.calculatePopularityScore();
  }
  next();
});

module.exports = mongoose.model('Location', locationSchema);