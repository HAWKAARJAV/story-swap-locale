const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Disable buffering globally
mongoose.set('bufferCommands', false);

class Database {
  constructor() {
    this.mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hyperlocal-story-swap';
    this._connection = null;
  }

  async connect() {
    if (process.env.SKIP_DB === '1') {
      logger.info('⏭️  Database.connect() bypassed (SKIP_DB=1)');
      return;
    }
    if (this._connection) {
      logger.info('🍃 MongoDB is already connected.');
      return;
    }

    try {
      const conn = await mongoose.connect(this.mongoURI, {
        // Modern Mongoose no longer supports legacy buffering options removed earlier
        // Keep options object in case we add other safe options later
      });

      this._connection = conn.connection;
      logger.info(`🍃 MongoDB Connected: ${this._connection.host}`);

      // Secondary mongoose instance removal: models now unified under backend/models

      this._connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      this._connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      this._connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

    } catch (error) {
      logger.error('Error connecting to MongoDB:', error.message);
      process.exit(1);
    }
  }

  async disconnect() {
    if (process.env.SKIP_DB === '1') {
      logger.info('⏭️  Database.disconnect() bypassed (SKIP_DB=1)');
      return;
    }
    if (this._connection) {
      await mongoose.disconnect();
      this._connection = null;
      logger.info('🍃 MongoDB disconnected.');
    }
  }
}

const instance = new Database();
module.exports = instance;