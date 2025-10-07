const mongoose = require('mongoose');
function simpleId() { return 't-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); }

const tagSchema = new mongoose.Schema({
  _id: { type: String, default: simpleId },
  name: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 30 },
  displayName: { type: String, required: true, trim: true, maxlength: 50 },
  description: { type: String, trim: true, maxlength: 200 },
  category: { type: String, enum: ['food','history','culture','nature','architecture','events','people','hidden-gems','transportation','shopping','nightlife','art','music','sports','business','education','technology','other'], default: 'other' },
  color: { type: String, default: '#3B82F6' },
  icon: { type: String, default: 'tag', maxlength: 50 },
  usage: {
    totalStories: { type: Number, default: 0 },
    activeStories: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    popularityScore: { type: Number, default: 0 }
  },
  trending: {
    istrending: { type: Boolean, default: false },
    trendingScore: { type: Number, default: 0 },
    trendingSince: Date
  },
  metadata: {
    isOfficial: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isRestricted: { type: Boolean, default: false },
    createdBy: { type: String, ref: 'User' },
    approvedBy: { type: String, ref: 'User' },
    approvedAt: Date
  },
  synonyms: [String],
  relatedTags: [{ type: String, ref: 'Tag' }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// tagSchema.index({ name: 1 }); // Removed duplicate; text index below covers name
tagSchema.index({ category: 1, 'usage.popularityScore': -1 });
tagSchema.index({ 'usage.totalStories': -1 });
tagSchema.index({ 'trending.istrending': 1, 'trending.trendingScore': -1 });
tagSchema.index({ 'metadata.isOfficial': 1, 'usage.popularityScore': -1 });
tagSchema.index({ name: 'text', displayName: 'text', description: 'text', synonyms: 'text' });

tagSchema.pre('save', function (next) {
  if (!this.displayName && this.name) {
    this.displayName = this.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  this.usage.popularityScore = this.calculatePopularityScore();
  this.updateTrendingStatus();
  next();
});

tagSchema.methods.calculatePopularityScore = function () {
  const storyWeight = this.usage.totalStories * 10;
  const activeWeight = this.usage.activeStories * 20;
  const viewWeight = this.usage.totalViews * 1;
  const officialBonus = this.metadata.isOfficial ? 50 : 0;
  const featuredBonus = this.metadata.isFeatured ? 30 : 0;
  return storyWeight + activeWeight + viewWeight + officialBonus + featuredBonus;
};
tagSchema.methods.updateTrendingStatus = function () {
  this.trending.trendingScore = (this.usage.totalStories > 5 ? this.usage.totalStories * 0.3 : 0) + this.usage.popularityScore * 0.1;
  const threshold = 100;
  if (this.trending.trendingScore > threshold && !this.trending.istrending) {
    this.trending.istrending = true; this.trending.trendingSince = new Date();
  } else if (this.trending.trendingScore <= threshold && this.trending.istrending) {
    this.trending.istrending = false; this.trending.trendingSince = null;
  }
};
tagSchema.statics.findOrCreate = async function (name) {
  const norm = name.toLowerCase().trim();
  let tag = await this.findOne({ name: norm });
  if (!tag) tag = await this.create({ name: norm, displayName: name });
  return tag;
};

module.exports = mongoose.models.Tag || mongoose.model('Tag', tagSchema);
