#!/usr/bin/env node
// Simple token generator for TestSprite scenarios.
// Usage: node token-gen.js > token.txt
const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET || 'dummy';

const token = jwt.sign(
  {
    id: '507f1f77bcf86cd799439011',
    email: 'testsprite@example.com',
    type: 'access',
    role: 'user'
  },
  ACCESS_SECRET,
  {
    issuer: 'hyperlocal-story-swap',
    audience: 'story-swap-users',
    expiresIn: '30m'
  }
);

process.stdout.write(token + '\n');
