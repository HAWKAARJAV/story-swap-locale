const mongoose = require('mongoose');
const logger = require('../utils/logger');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperlocal-story-swap';

const connect = async () => {
  if (process.env.SKIP_DB === '1') {
    logger.info('⏭️  Database connection bypassed (SKIP_DB=1)');
    return;
  }

  try {
    logger.info(`🔌 Attempting to connect to: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    logger.info(`🍃 MongoDB Connected successfully`);
  } catch (error) {
    logger.error('MongoDB connection failed:', error.message);
  }
};

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('🍃 MongoDB disconnected');
  }
};

module.exports = { connect, disconnect };