const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
require('dotenv').config();

const db = require('./config/database');
const { setupSwagger } = require('./config/swagger');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');
const swapRoutes = require('./routes/swaps');
const trailRoutes = require('./routes/trails');
const travelRoutes = require('./routes/travel');
const adminRoutes = require('./routes/admin');
const mediaRoutes = require('./routes/media');
const moderationRoutes = require('./routes/moderation');
const agentxRoutes = require('./routes/agentx');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Connect to MongoDB (skip when running isolated tests)
async function initDatabase() {
  if (process.env.SKIP_DB === '1') {
    logger.info('⏭️  SKIP_DB=1 detected - skipping MongoDB connection');
    return;
  }
  const start = Date.now();
  try {
    await db.connect();
    logger.info(`🗄️  MongoDB connection established in ${Date.now() - start}ms`);
  } catch (err) {
    logger.error('❌ Failed to initialize database connection', { message: err.message, stack: err.stack });
    process.exit(1);
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://maps.googleapis.com", "https://api.mapbox.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "blob:"],
      frameSrc: ["'none'"],
    },
  },
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Speed limiting for expensive operations
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2,
  delayMs: () => 500, // Fixed for v2 compatibility
  validate: { delayMs: false } // Disable warning
});

app.use(generalLimiter);
app.use(speedLimiter);

// Dynamic CORS configuration
const getAllowedOrigins = () => {
  const origins = [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    process.env.FRONTEND_URL_NETWORK,
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:3000',
    'http://localhost:5173'
  ].filter(Boolean);
  
  // Get network IP dynamically
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  const networkIP = Object.values(networkInterfaces)
    .flat()
    .find(iface => iface?.family === 'IPv4' && !iface.internal)?.address;
  
  if (networkIP) {
  origins.push(`http://${networkIP}:8080`, `http://${networkIP}:8081`, `http://${networkIP}:8082`);
  }
  
  return origins;
};

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = getAllowedOrigins();
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    
    // Allow any local network IP on ports 8080/8081
    if (/^http:\/\/(localhost|127\.0\.0\.1|\d+\.\d+\.\d+\.\d+):(808[0-2]|3000|5173)$/.test(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/stories`, storyRoutes);
app.use(`/api/${API_VERSION}/swaps`, swapRoutes);
app.use(`/api/${API_VERSION}/travel`, travelRoutes);
app.use(`/api/${API_VERSION}/media`, mediaRoutes);
app.use(`/api/${API_VERSION}/moderation`, moderationRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/trails`, trailRoutes);
app.use(`/api/${API_VERSION}/agentx`, agentxRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`
    }
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  mongoose.disconnect().then(() => {
    logger.info('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  mongoose.disconnect().then(() => {
    logger.info('MongoDB connection closed.');
    process.exit(0);
  });
});

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    await initDatabase();
    app.listen(PORT, HOST, () => {
      logger.info(`🚀 Server running on ${HOST}:${PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      const networkIP = Object.values(networkInterfaces)
        .flat()
        .find(iface => iface?.family === 'IPv4' && !iface.internal)?.address;
      if (networkIP) {
        logger.info(`🌐 Network access available at http://${networkIP}:${PORT}/api/docs`);
      }
      logger.info('✅ Server is ready and accepting connections.');
    });
  })();
}

module.exports = app;