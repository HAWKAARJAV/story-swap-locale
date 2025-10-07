const jwt = require('jsonwebtoken');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_access_secret';
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test_refresh_secret';
process.env.API_VERSION = process.env.API_VERSION || 'v1';
process.env.SKIP_DB = '1';

function buildTestToken(overrides = {}) {
  const payload = {
    sub: overrides.id || '507f1f77bcf86cd799439011',
    id: overrides.id || '507f1f77bcf86cd799439011',
    email: overrides.email || 'testuser@example.com',
    username: overrides.username || 'testuser',
    role: overrides.role || 'user',
    type: 'access',
    iat: Math.floor(Date.now() / 1000)
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30m',
    issuer: 'hyperlocal-story-swap',
    audience: 'story-swap-users'
  });
}

module.exports = { buildTestToken };
