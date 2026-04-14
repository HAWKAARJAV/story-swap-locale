const mongoose = require('mongoose');

const tripPlanSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
    index: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  itinerary: [{
    type: String,
    trim: true
  }],
  vibe: {
    type: String,
    trim: true
  },
  quote: {
    type: String,
    trim: true
  },
  estimatedDuration: {
    type: String,
    trim: true
  },
  bestSeason: {
    type: String,
    trim: true
  },
  emotionalTone: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ['ai', 'manual', 'agentx'],
    default: 'ai'
  },
  context: {
    userInput: String,
    currentMood: String,
    previousStories: [String]
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['saved', 'planned', 'completed', 'cancelled'],
    default: 'saved'
  },
  actualTripDate: {
    type: Date
  },
  linkedStory: {
    type: String,
    ref: 'Story'
  },
  aiSuggestions: [{
    type: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
tripPlanSchema.index({ userId: 1, status: 1 });
tripPlanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('TripPlan', tripPlanSchema);
