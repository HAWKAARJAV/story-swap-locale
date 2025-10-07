const mongoose = require('mongoose');
const logger = require('../backend/utils/logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperlocal-story-swap';
    console.log('[DEBUG] Connecting to:', mongoURI);
    
    // Simple connection without complex options
    const conn = await mongoose.connect(mongoURI);

    logger.info(`🍃 MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);

    // Enhanced connection event handling
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
      // Attempt reconnection instead of crashing
      setTimeout(() => {
        logger.info('Attempting to reconnect to MongoDB...');
        mongoose.connect(mongoURI);
      }, 5000);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Add connection monitoring
    setInterval(() => {
      if (mongoose.connection.readyState !== 1) {
        logger.warn(`MongoDB connection state: ${mongoose.connection.readyState}`);
      }
    }, 30000);

  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message);
    // Don't exit process immediately, try to reconnect
    setTimeout(() => {
      logger.info('Attempting to reconnect to MongoDB after initial connection failure...');
      connectDB();
    }, 5000);
  }
};

module.exports = { connectDB };