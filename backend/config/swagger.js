const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hyperlocal Story Swap API',
      version: '1.0.0',
      description: 'A location-based storytelling platform where users share and discover local stories through a swap mechanism.',
      contact: {
        name: 'API Support',
        email: 'support@storyswap.local'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.storyswap.local' 
          : `http://localhost:${process.env.PORT || 5000}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            username: { type: 'string', example: 'johndoe' },
            displayName: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email' },
            avatar: {
              type: 'object',
              properties: {
                url: { type: 'string', format: 'uri' },
                publicId: { type: 'string' }
              }
            },
            bio: { type: 'string', example: 'Travel enthusiast and storyteller' },
            role: { type: 'string', enum: ['user', 'moderator', 'admin'] },
            homeCity: { type: 'string', example: 'Delhi' },
            stats: {
              type: 'object',
              properties: {
                storiesPublished: { type: 'number' },
                storiesUnlocked: { type: 'number' },
                swapsCompleted: { type: 'number' },
                likes: { type: 'number' }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Story: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            title: { type: 'string', example: 'Hidden tea stall in Old Delhi' },
            content: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['text', 'audio', 'photo', 'video', 'mixed'] },
                text: {
                  type: 'object',
                  properties: {
                    body: { type: 'string' },
                    wordCount: { type: 'number' }
                  }
                },
                media: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', enum: ['image', 'audio', 'video'] },
                      url: { type: 'string', format: 'uri' },
                      thumbnailUrl: { type: 'string', format: 'uri' },
                      metadata: {
                        type: 'object',
                        properties: {
                          duration: { type: 'number' },
                          size: { type: 'number' },
                          format: { type: 'string' }
                        }
                      }
                    }
                  }
                },
                snippet: { type: 'string' }
              }
            },
            author: { $ref: '#/components/schemas/User' },
            location: { $ref: '#/components/schemas/Location' },
            tags: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['draft', 'published', 'queued', 'removed', 'archived'] },
            swapSettings: {
              type: 'object',
              properties: {
                isLocked: { type: 'boolean' },
                requiresSwap: { type: 'boolean' }
              }
            },
            engagement: {
              type: 'object',
              properties: {
                views: { type: 'number' },
                likes: { type: 'number' },
                unlocks: { type: 'number' },
                comments: { type: 'number' },
                shares: { type: 'number' }
              }
            },
            publishedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Location: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            coordinates: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['Point'] },
                coordinates: {
                  type: 'array',
                  items: { type: 'number' },
                  minItems: 2,
                  maxItems: 2,
                  example: [77.2090, 28.6139]
                }
              }
            },
            address: {
              type: 'object',
              properties: {
                formatted: { type: 'string', example: 'Connaught Place, New Delhi, India' },
                city: { type: 'string', example: 'New Delhi' },
                country: { type: 'string', example: 'India' }
              }
            }
          }
        },
        Swap: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            user: { type: 'string', format: 'uuid' },
            storyToUnlock: { $ref: '#/components/schemas/Story' },
            submittedStory: { $ref: '#/components/schemas/Story' },
            status: { type: 'string', enum: ['pending', 'completed', 'rejected', 'expired'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Tag: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'food' },
            displayName: { type: 'string', example: 'Food' },
            category: { type: 'string', enum: ['food', 'history', 'culture', 'nature', 'art'] },
            usage: {
              type: 'object',
              properties: {
                totalStories: { type: 'number' },
                popularityScore: { type: 'number' }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'Validation failed' },
                details: { type: 'object' },
                timestamp: { type: 'string', format: 'date-time' }
              }
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'username', 'displayName'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            username: { type: 'string', minLength: 3 },
            displayName: { type: 'string', minLength: 1 }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            tokens: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                tokenType: { type: 'string', example: 'Bearer' },
                expiresIn: { type: 'string', example: '15m' }
              }
            }
          }
        },
        StoryCreateRequest: {
          type: 'object',
          required: ['title', 'content', 'location'],
          properties: {
            title: { type: 'string', minLength: 5, maxLength: 200 },
            content: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['text', 'audio', 'photo', 'video', 'mixed'] },
                text: { type: 'string', maxLength: 5000 },
                media: {
                  type: 'array',
                  items: { type: 'string' } // Media IDs
                }
              }
            },
            location: {
              type: 'object',
              properties: {
                coordinates: { type: 'array', items: { type: 'number' } },
                address: { type: 'string' }
              }
            },
            tags: { type: 'array', items: { type: 'string' }, maxItems: 5 },
            visibility: { type: 'string', enum: ['public', 'private', 'unlisted'], default: 'public' }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                pages: { type: 'number' },
                hasNext: { type: 'boolean' },
                hasPrev: { type: 'boolean' }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ForbiddenError: {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'User authentication and authorization' },
      { name: 'Users', description: 'User management and profiles' },
      { name: 'Stories', description: 'Story creation, management and discovery' },
      { name: 'Swaps', description: 'Story swap mechanics and unlock system' },
      { name: 'Locations', description: 'Geographic data and location-based queries' },
      { name: 'Tags', description: 'Story categorization and tagging' },
      { name: 'Media', description: 'File upload and media management' },
      { name: 'Moderation', description: 'Content moderation and reporting' },
      { name: 'Admin', description: 'Administrative functions' }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  const swaggerOptions = {
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #FF7A59; }
    `,
    customSiteTitle: 'Hyperlocal Story Swap API Documentation',
    customfavIcon: '/assets/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      tryItOutEnabled: true
    }
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));
  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = { setupSwagger, specs };